import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy de geocodificação (Nominatim) com cache e rate-limit próprios.
 *
 * Por que isso existe: antes, o navegador de CADA visitante chamava
 * nominatim.openstreetmap.org diretamente a cada tecla digitada. Isso viola
 * a política de uso deles (autocomplete de produção sem acordo prévio, e
 * limite de 1 req/s por origem) e, com tráfego pago simultâneo, é o cenário
 * mais provável de gerar bloqueio/instabilidade bem na hora que mais importa.
 *
 * O que esta rota resolve:
 *  1. Cache "seed" (grátis, instantâneo, sem chamar o Nominatim) para os
 *     lugares mais buscados na região -- cidade, bairros e pontos que já
 *     aparecem no routes.json.
 *  2. Cache em memória (TTL) para qualquer busca recente, com camada opcional
 *     no Upstash Redis (grátis até um volume razoável) para o cache valer
 *     entre TODAS as instâncias serverless da Vercel, não só a que atendeu
 *     a requisição -- é o que torna isso robusto de verdade em produção.
 *  3. Fila/throttle para nunca mandar mais de 1 req/s pro Nominatim,
 *     não importa quantos visitantes estejam digitando ao mesmo tempo.
 *  4. Dedupe de requisições idênticas simultâneas (2 pessoas digitando
 *     "Shopping Iguatemi" ao mesmo tempo geram 1 chamada só ao Nominatim).
 *  5. User-Agent correto com contato, exigido pela política de uso deles.
 *  6. Erros tratados: distingue "sem resultado" de "serviço indisponível",
 *     e nunca deixa a requisição do Nominatim pendurar o usuário (timeout).
 *
 * CONFIGURAÇÃO OPCIONAL (recomendada para produção):
 *   Criar um banco grátis em https://upstash.com (Redis serverless) e
 *   definir estas duas variáveis de ambiente na Vercel:
 *     UPSTASH_REDIS_REST_URL
 *     UPSTASH_REDIS_REST_TOKEN
 *   Sem elas, o proxy funciona igual, só que o cache fica só na memória
 *   de cada instância (se reinicia, esquece -- ainda assim já resolve o
 *   principal, que é não estourar o rate-limit do Nominatim).
 */

// ---------- Config ----------

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Identifica quem está fazendo a chamada, como a política do Nominatim exige.
// TROQUE o e-mail de contato pelo real da empresa antes de subir.
const USER_AGENT = 'SorocabaVipFretados/1.0 (contato@sorocabavip.com.br)';

// Bounding box Sorocaba/Votorantim -> Grande São Paulo (mesmo valor que já
// existia no componente, só que agora centralizado aqui no backend).
const SEARCH_VIEWBOX = '-47.75,-23.20,-46.55,-23.85';

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 dias: endereços não mudam de lugar
const MIN_INTERVAL_MS = 1100; // >1s entre chamadas ao Nominatim (exigência deles)
const UPSTREAM_TIMEOUT_MS = 6000;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_UPSTASH = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

type GeoResult = { lat: number; lng: number; address: string };

// ---------- Cache "seed": lugares mais buscados, direto no código ----------
// Zero latência, zero chamada ao Nominatim. Adicione aqui qualquer lugar que
// vocês perceberem que é buscado com frequência (olhem os logs de "sem
// resultado" ou os endereços mais repetidos no CRM/WhatsApp).
// Chave: query normalizada (minúsculo, sem acento, trim). Ver normalizeQuery().
const SEED_CACHE: Record<string, GeoResult[]> = {
  'sorocaba': [{ lat: -23.5015, lng: -47.4581, address: 'Sorocaba, São Paulo, Brasil' }],
  'votorantim': [{ lat: -23.5467, lng: -47.4392, address: 'Votorantim, São Paulo, Brasil' }],
  'shopping iguatemi': [{ lat: -23.539658, lng: -47.466501, address: 'Shopping Iguatemi Esplanada, Votorantim, São Paulo, Brasil' }],
  'shopping sorocaba': [{ lat: -23.496289, lng: -47.467468, address: 'Shopping Sorocaba, Sorocaba, São Paulo, Brasil' }],
  'rodoviaria de sorocaba': [{ lat: -23.510504, lng: -47.466614, address: 'Rodoviária de Sorocaba, São Paulo, Brasil' }],
  'praca 9 de julho sorocaba': [{ lat: -23.502872, lng: -47.468214, address: 'Praça 9 de Julho, Sorocaba, São Paulo, Brasil' }],
};

function normalizeQuery(q: string): string {
  return q
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

// ---------- Cache em memória (fallback quando não há Upstash configurado) ----------

type MemCacheEntry = { data: GeoResult[]; expiresAt: number };
const memCache = new Map<string, MemCacheEntry>();

// Dedupe: se duas requisições idênticas chegarem ao mesmo tempo, a segunda
// espera o resultado da primeira em vez de disparar outra chamada upstream.
const inFlight = new Map<string, Promise<GeoResult[]>>();

// ---------- Throttle global (garante >=1.1s entre chamadas ao Nominatim) ----------

let lastUpstreamCallAt = 0;
let throttleQueue: Promise<void> = Promise.resolve();

function scheduleUpstreamSlot(): Promise<void> {
  const myTurn = throttleQueue.then(async () => {
    const now = Date.now();
    const wait = Math.max(0, lastUpstreamCallAt + MIN_INTERVAL_MS - now);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastUpstreamCallAt = Date.now();
  });
  throttleQueue = myTurn.catch(() => {}); // não deixa uma falha travar a fila
  return myTurn;
}

// ---------- Camada Upstash (opcional, cache compartilhado entre instâncias) ----------

async function upstashGet(key: string): Promise<GeoResult[] | null> {
  if (!HAS_UPSTASH) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.result) return null;
    return JSON.parse(json.result);
  } catch {
    return null; // Upstash indisponível não pode derrubar a busca -- cai pro resto do fluxo
  }
}

async function upstashSet(key: string, value: GeoResult[]): Promise<void> {
  if (!HAS_UPSTASH) return;
  try {
    await fetch(
      `${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?EX=${CACHE_TTL_SECONDS}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }, cache: 'no-store' }
    );
  } catch {
    // cache é otimização, não pode quebrar a resposta principal
  }
}

// ---------- Busca real no Nominatim (com throttle + timeout) ----------

async function fetchFromNominatim(query: string): Promise<GeoResult[]> {
  await scheduleUpstreamSlot();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const res = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=br&viewbox=${SEARCH_VIEWBOX}&bounded=1&limit=5`,
      {
        headers: {
          'Accept-Language': 'pt-BR',
          'User-Agent': USER_AGENT,
        },
        signal: controller.signal,
      }
    );

    if (res.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    if (!res.ok) {
      throw new Error(`UPSTREAM_${res.status}`);
    }

    const data = await res.json();
    return data.map((d: any) => ({
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      address: d.display_name,
    }));
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Handler principal ----------

async function resolveQuery(rawQuery: string): Promise<{ results: GeoResult[]; source: string }> {
  const key = normalizeQuery(rawQuery);

  // 1. Seed cache (instantâneo, não conta pra nenhum limite)
  if (SEED_CACHE[key]) {
    return { results: SEED_CACHE[key], source: 'seed' };
  }

  // 2. Cache em memória (quente, mesma instância)
  const mem = memCache.get(key);
  if (mem && mem.expiresAt > Date.now()) {
    return { results: mem.data, source: 'memory' };
  }

  // 3. Cache compartilhado (Upstash), se configurado
  const cached = await upstashGet(key);
  if (cached) {
    memCache.set(key, { data: cached, expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000 });
    return { results: cached, source: 'upstash' };
  }

  // 4. Dedupe: se já existe uma chamada idêntica em andamento, espera ela
  const existing = inFlight.get(key);
  if (existing) {
    const results = await existing;
    return { results, source: 'dedup' };
  }

  // 5. Chamada real ao Nominatim, com throttle
  const promise = fetchFromNominatim(rawQuery);
  inFlight.set(key, promise);
  try {
    const results = await promise;
    memCache.set(key, { data: results, expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000 });
    await upstashSet(key, results); // não bloqueia a resposta em caso de falha
    return { results, source: 'nominatim' };
  } finally {
    inFlight.delete(key);
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';

  if (!q || q.trim().length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const { results, source } = await resolveQuery(q);
    return NextResponse.json(
      { results },
      {
        headers: {
          // Ajuda o CDN da Vercel a servir buscas repetidas sem nem chegar
          // na function -- mais uma camada de proteção contra pico de tráfego.
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
          'X-Geocode-Source': source,
        },
      }
    );
  } catch (err: any) {
    const rateLimited = err?.message === 'RATE_LIMITED';
    console.error('Geocode proxy error:', err?.message || err);
    return NextResponse.json(
      { results: [], error: rateLimited ? 'rate_limited' : 'upstream_error' },
      { status: rateLimited ? 503 : 502 }
    );
  }
}

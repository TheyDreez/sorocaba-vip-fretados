const fs = require('fs');
 
const places = {
  // --- Linha 1 (só 2 pontos de baixa precisão) ---
  "Estação Morumbi": "Estação Morumbi CPTM, São Paulo, SP",
  "Marginal Pinheiros (Chegada)": "Ponte Eusébio Matoso, Marginal Pinheiros, São Paulo, SP",
 
  // --- Linha 2 (embarque em Sorocaba) ---
  "AV. IPANEMA (LUZIO)": "Avenida Ipanema, Sorocaba, SP",
  "PARQUE SÃO BENTO HORTO 01,02,03 E 04": "Parque São Bento, Sorocaba, SP",
  "AV. EDGAR FRUFRU SÃO GUILHERME": "Jardim São Guilherme, Sorocaba, SP",
  "PRAÇA 9 DE JULHO": "Praça 9 de Julho, Sorocaba, SP",
  "RUA SÃO BENTO ( CENTRO)": "Rua São Bento, Centro, Sorocaba, SP",
  "AV. SÃO PAULO CONFIANÇA SUPERMERCADO": "Avenida São Paulo, Sorocaba, SP",
  "CONDOMINIOS LE FRANCE VILA AMORE E PRIMAVERA": "Condomínio Le France, Sorocaba, SP",
  "AV. INDEPENDENCIA TERMINAL ÉDEN": "Terminal Éden, Avenida Independência, Sorocaba, SP",
  "AV. PARANA CONDOMINIO TERRAS SÃO FRANCISCO": "Avenida Paraná, Sorocaba, SP",
 
  // --- Linha 2 (desembarque em São Paulo) ---
  "ESTAÇÃO VILA OLIMPIA CPTM": "Estação Vila Olímpia CPTM, São Paulo, SP",
  "ESTAÇÃO CIDADE JARDIM CPTM": "Estação Cidade Jardim CPTM, São Paulo, SP",
  "ESTAÇÃO HEBRAICA CPTM E PONTE EUSÉBIO MATOSO": "Estação Hebraica-Rebouças CPTM, São Paulo, SP",
  "AVENIDA ENGENHEIRO CARLOS BERRINI VIVO": "Avenida Engenheiro Luís Carlos Berrini, São Paulo, SP",
  "AVENIDA CHUCRI ZAIDAN VIVO SHOPPING MORUMBI E ROCHA VERÁ": "Avenida Chucri Zaidan, São Paulo, SP",
  "RUA CECILIA LUTEMBERG PROX. ESTAÇÃO GRANJA JULIETA CPTM": "Estação Granja Julieta CPTM, São Paulo, SP",
  "RUA CASTRO VERDE PROX. ESTAÇÃO JOÃO DIAS CPTM": "Estação João Dias CPTM, São Paulo, SP",
  "RUA AMADOR BUENO SANTANDER SANTO AMARO": "Rua Amador Bueno, Santo Amaro, São Paulo, SP",
 
  // --- Linha 3 ---
  "Av Angélica - Mercado São Roque": "Avenida Angélica, Sorocaba, SP",
  "Av Pres. JK - Rodoviária": "Rodoviária de Sorocaba, Avenida Presidente Kennedy, Sorocaba, SP",
  "Ponte da Anhanguera": "Ponte Rodovia Anhanguera, Marginal Pinheiros, São Paulo, SP"
};
 
async function regeocode() {
  const results = [];
  for (const [name, query] of Object.entries(places)) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'BatataGeocodeLinhas23/1 (contato@seudominio.com.br)' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        results.push({
          name,
          query,
          coords: { lat: parseFloat(data[0].lat).toFixed(6), lng: parseFloat(data[0].lon).toFixed(6) },
          matchedAddress: data[0].display_name
        });
        console.log(`OK  ${name} -> ${data[0].lat}, ${data[0].lon}`);
      } else {
        results.push({ name, query, coords: null });
        console.log(`SEM RESULTADO  ${name} (query: "${query}")`);
      }
    } catch (err) {
      results.push({ name, query, coords: null, error: err.message });
      console.error(`ERRO  ${name}:`, err.message);
    }
    // Respeita o limite de 1 req/segundo do Nominatim
    await new Promise(r => setTimeout(r, 1200));
  }
 
  fs.writeFileSync('geocoded_results_linhas_2_3.json', JSON.stringify(results, null, 2));
  console.log(`\nConcluído. ${results.filter(r => r.coords).length}/${results.length} pontos geocodificados com sucesso.`);
}
 
regeocode();

const fs = require('fs');

const places = {
  "Estação Morumbi": "Avenida Roque Petroni Júnior, São Paulo, SP",
  "Marginal Pinheiros (Chegada)": "Ponte Eusébio Matoso, São Paulo, SP",
  "PRAÇA 9 DE JULHO": "Praça Nove de Julho, Sorocaba, SP",
  "AV. INDEPENDENCIA TERMINAL ÉDEN": "Avenida Independência, Sorocaba, SP",
  "ESTAÇÃO VILA OLIMPIA CPTM": "Avenida Hélio Pellegrino, São Paulo, SP",
  "ESTAÇÃO HEBRAICA CPTM E PONTE EUSÉBIO MATOSO": "Ponte Eusébio Matoso, São Paulo, SP",
  "RUA CECILIA LUTEMBERG PROX. ESTAÇÃO GRANJA JULIETA CPTM": "Rua Cecília Lutemberg, São Paulo, SP",
  "RUA CASTRO VERDE PROX. ESTAÇÃO JOÃO DIAS CPTM": "Rua Castro Verde, São Paulo, SP",
  "Av Pres. JK - Rodoviária": "Avenida Presidente Kennedy, Sorocaba, SP",
  "Ponte da Anhanguera": "Ponte da Rodovia Anhanguera, Marginal Tietê, São Paulo, SP"
};

async function regeocode() {
  const results = [];
  for (const [name, query] of Object.entries(places)) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'BatataGeocodePendentes/1 (contato@seudominio.com.br)' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        results.push({
          name,
          query,
          coords: { lat: parseFloat(data[0].lat).toFixed(6), lng: parseFloat(data[0].lon).toFixed(6) },
          matchedAddress: data[0].display_name
        });
        console.log(`OK  ${name} -> ${data[0].lat}, ${data[0].lon}  (${data[0].display_name})`);
      } else {
        results.push({ name, query, coords: null });
        console.log(`SEM RESULTADO  ${name} (query: "${query}")`);
      }
    } catch (err) {
      results.push({ name, query, coords: null, error: err.message });
      console.error(`ERRO  ${name}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 1200)); // respeita 1 req/s do Nominatim
  }

  fs.writeFileSync('geocoded_results_pendentes.json', JSON.stringify(results, null, 2));
  console.log(`\nConcluído. ${results.filter(r => r.coords).length}/${results.length} pontos geocodificados.`);
}

regeocode();

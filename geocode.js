const fs = require('fs');

const places = {
  "McDonald's Vanel Ville Sorocaba": "Avenida Elias Maluf, Sorocaba",
  "Terminal Ipiranga Sorocaba": "Rua Estado de Israel, Sorocaba",
  "Bradesco Avenida Doutor Armando Pannunzio Sorocaba": "Avenida Doutor Armando Pannunzio, Sorocaba",
  "Confianca Avenida Doutor Armando Pannunzio Sorocaba": "Avenida Doutor Armando Pannunzio, Sorocaba",
  "Shopping Iguatemi Esplanada Votorantim": "Avenida Gisele Constantino, Votorantim",
  "Corpo de Bombeiros Votorantim": "Avenida 31 de Março, Votorantim",
  "Posto Madeira Sorocaba": "Avenida Dom Aguirre, Sorocaba",
  "D&D Shopping Berrini Sao Paulo": "Avenida das Nações Unidas 12551, Sao Paulo",
  "Posto Ally Sao Paulo": "Avenida dos Bandeirantes 3154, Sao Paulo",
  "Posto Cidade Jardim Marginal Pinheiros": "Avenida das Nações Unidas 7733, Sao Paulo",
  "Parque Natural Chico Mendes Sorocaba": "Avenida Três de Março, Sorocaba"
};

async function geocode() {
  const results = {};
  for (const [key, q] of Object.entries(places)) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'BatataGeocode/1' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        results[key] = { lat: parseFloat(data[0].lat).toFixed(6), lng: parseFloat(data[0].lon).toFixed(6) };
      } else {
        results[key] = null;
      }
    } catch (err) {
      console.error("Error on", key, err.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log(JSON.stringify(results, null, 2));
}

geocode();

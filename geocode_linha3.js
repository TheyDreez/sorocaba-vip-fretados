const fs = require('fs');

const places = {
  // Boarding
  "Av Itavuvu - Havan": "Havan Itavuvu Sorocaba",
  "Av Angélica - Mercado São Roque": "Supermercado São Roque Vila Angelica Sorocaba",
  "Av Paulo Emanuel de Almeida": "Avenida Paulo Emanuel de Almeida Sorocaba",
  "R. Ramzia El Hadi": "Rua Ramzia El Hadi Sorocaba",
  "Av Elias Maluf - Con. Milano": "Avenida Elias Maluf Sorocaba",
  "Av Américo Figueiredo - Lopes": "Lopes Supermercados Avenida Americo Figueiredo Sorocaba",
  "Av Santa Cruz, 1493": "Avenida Santa Cruz 1493 Sorocaba",
  "Av Armando Pannunzio - Posto Lusitano": "Avenida Doutor Armando Pannunzio Sorocaba", // fallback
  "Av General Carneiro - Bradesco": "Avenida General Carneiro Sorocaba",
  "Av Moreira César, 345": "Avenida Moreira Cesar 345 Sorocaba",
  "Av Pres. JK - Rodoviária": "Rodoviaria Sorocaba",
  "Rua Leopoldo Machado - Terminal": "Terminal Sao Paulo Sorocaba",
  "Av Dom Aguirre - Bombeiros": "Corpo de Bombeiros Avenida Dom Aguirre Sorocaba",
  "Rod. Sen. José Ermírio - Castelinho": "Castelinho Sorocaba",

  // Dropoff
  "Km 17 - Osasco": "Osasco SP", // Use km 17 from linha 1 manually later
  "Ponte dos Remédios": "Ponte dos Remedios Sao Paulo",
  "Ponte da Anhanguera": "Ponte da Anhanguera Sao Paulo",
  "Ponte do Piqueri": "Ponte do Piqueri Sao Paulo",
  "Ponte Freguesia do Ó": "Ponte Freguesia do O Sao Paulo",
  "Metrô Barra Funda": "Metro Barra Funda Sao Paulo",
  "Rua Norma Pieruccini Giannotti, 423": "Rua Norma Pieruccini Giannotti 423 Sao Paulo",
  "Ponte das Bandeiras": "Ponte das Bandeiras Sao Paulo",
  "Metrô Carandiru": "Metro Carandiru Sao Paulo"
};

async function geocode() {
  const results = {};
  for (const [key, q] of Object.entries(places)) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'BatataGeocode3/1' }
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

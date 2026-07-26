const fs = require('fs');

const ROUTES_PATH = './src/data/routes.json';
const GEOCODES_PATH = './geocoded_results_pendentes.json';
const MAX_SANITY_KM = 10; // ajuste conforme o raio real de cada linha

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const data = JSON.parse(fs.readFileSync(ROUTES_PATH, 'utf8'));
const geocodes = JSON.parse(fs.readFileSync(GEOCODES_PATH, 'utf8'));

let applied = 0;
let rejected = [];

geocodes.forEach(geo => {
  if (!geo.coords) return;
  const { lat, lng } = geo.coords;

  data.lines.forEach(line => {
    ['boardingStops', 'dropoffStops'].forEach(kind => {
      const stops = line[kind];
      const targetIndex = stops.findIndex(s => s.name === geo.name);
      if (targetIndex === -1) return;

      // Distância mínima até QUALQUER outra parada do mesmo tipo/linha
      const others = stops.filter((_, i) => i !== targetIndex);
      const minDist = others.length
        ? Math.min(...others.map(o => haversineKm(lat, lng, o.lat, o.lng)))
        : 0;

      if (others.length === 0 || minDist <= MAX_SANITY_KM) {
        stops[targetIndex].lat = lat;
        stops[targetIndex].lng = lng;
        applied++;
        console.log(`APLICADO  ${geo.name}  (${minDist.toFixed(1)}km da parada mais próxima da mesma linha)`);
      } else {
        rejected.push({ name: geo.name, minDist: minDist.toFixed(1), matchedAddress: geo.matchedAddress });
        console.warn(`REJEITADO  ${geo.name}  -- ${minDist.toFixed(1)}km da parada mais próxima (limite: ${MAX_SANITY_KM}km). Provável match errado do Nominatim: "${geo.matchedAddress}"`);
      }
    });
  });
});

fs.writeFileSync(ROUTES_PATH, JSON.stringify(data, null, 2));

console.log(`\n${applied} coordenada(s) aplicada(s).`);
if (rejected.length) {
  console.log(`${rejected.length} rejeitada(s) por segurança -- revisem manualmente:`);
  rejected.forEach(r => console.log(`  - ${r.name}: matchedAddress = "${r.matchedAddress}"`));
}

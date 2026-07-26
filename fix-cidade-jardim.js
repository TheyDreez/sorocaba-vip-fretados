const fs = require('fs');
const path = './src/data/routes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const FIXED_NAME = 'ESTAÇÃO CIDADE JARDIM CPTM';
const FIXED_COORDS = { lat: -23.593, lng: -46.689 };

let fixed = 0;
data.lines.forEach(line => {
  ['boardingStops', 'dropoffStops'].forEach(kind => {
    line[kind].forEach(stop => {
      if (stop.name === FIXED_NAME) {
        stop.lat = FIXED_COORDS.lat;
        stop.lng = FIXED_COORDS.lng;
        fixed++;
      }
    });
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Corrigido ${fixed} ponto(s): "${FIXED_NAME}" -> ${FIXED_COORDS.lat}, ${FIXED_COORDS.lng}`);
if (fixed === 0) {
  console.warn('Nenhum ponto com esse nome foi encontrado -- confira se o nome ainda bate com routes.json.');
}

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/routes.json', 'utf8'));
const geocodes = JSON.parse(fs.readFileSync('./geocoded_results_linhas_2_3.json', 'utf8'));

let count = 0;

geocodes.forEach(geo => {
  if (geo.coords) {
    const lat = parseFloat(geo.coords.lat);
    const lng = parseFloat(geo.coords.lng);
    
    data.lines.forEach(line => {
      line.boardingStops.forEach(stop => {
        if (stop.name === geo.name) {
          stop.lat = lat;
          stop.lng = lng;
          count++;
        }
      });
      line.dropoffStops.forEach(stop => {
        if (stop.name === geo.name) {
          stop.lat = lat;
          stop.lng = lng;
          count++;
        }
      });
    });
  }
});

fs.writeFileSync('./src/data/routes.json', JSON.stringify(data, null, 2));
console.log(`Patched ${count} stops with new geocodes.`);

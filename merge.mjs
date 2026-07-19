import fs from 'fs';

const routesPath = 'src/data/routes.json';
const resultsPath = 'geocoded_results.json';

const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
const geocoded = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

function updateStops(stops) {
  stops.forEach(stop => {
    // Try to find matching geocoded result
    const match = geocoded.find(g => 
      g.name.includes(stop.name) || 
      g.name.replace(' Sorocaba', '') === stop.name || 
      g.name.replace(' São Paulo', '') === stop.name
    );
    if (match && match.coords) {
      stop.lat = parseFloat(match.coords.lat.toFixed(6));
      stop.lng = parseFloat(match.coords.lng.toFixed(6));
    }
  });
}

routes.lines.forEach(line => {
  updateStops(line.boardingStops);
  updateStops(line.dropoffStops);
});

fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
console.log("Merged coordinates into routes.json");

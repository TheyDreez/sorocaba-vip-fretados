const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/routes.json', 'utf8'));

const linha3 = {
  "id": "linha-3",
  "name": "Linha 3 - Barra Funda / Zona Norte",
  "color": "#3B82F6",
  "boardingStops": [
    { "name": "Av Itavuvu - Havan", "lat": -23.459008, "lng": -47.480712 },
    { "name": "Av Angélica - Mercado São Roque", "lat": -23.4735, "lng": -47.4645 },
    { "name": "Av Paulo Emanuel de Almeida", "lat": -23.491322, "lng": -47.505024 },
    { "name": "R. Ramzia El Hadi", "lat": -23.489077, "lng": -47.511408 },
    { "name": "Av Elias Maluf - Con. Milano", "lat": -23.490762, "lng": -47.512396 },
    { "name": "Av Américo Figueiredo - Lopes", "lat": -23.502532, "lng": -47.500716 },
    { "name": "Av Santa Cruz, 1493", "lat": -23.508578, "lng": -47.502785 },
    { "name": "Av Armando Pannunzio - Posto Lusitano", "lat": -23.523469, "lng": -47.491264 },
    { "name": "Av General Carneiro - Bradesco", "lat": -23.506513, "lng": -47.483076 },
    { "name": "Av Moreira César, 345", "lat": -23.504918, "lng": -47.464246 },
    { "name": "Av Pres. JK - Rodoviária", "lat": -23.502, "lng": -47.466 }, // fixed rodoviaria sorocaba coords
    { "name": "Rua Leopoldo Machado - Terminal", "lat": -23.504532, "lng": -47.452625 },
    { "name": "Av Dom Aguirre - Bombeiros", "lat": -23.491375, "lng": -47.443786 },
    { "name": "Rod. Sen. José Ermírio - Castelinho", "lat": -23.476476, "lng": -47.381290 }
  ],
  "dropoffStops": [
    { "name": "Km 17 - Osasco", "lat": -23.511670, "lng": -46.803348 },
    { "name": "Ponte dos Remédios", "lat": -23.520298, "lng": -46.746784 },
    { "name": "Ponte da Anhanguera", "lat": -23.5135, "lng": -46.7419 }, // manual fix
    { "name": "Ponte do Piqueri", "lat": -23.508645, "lng": -46.705696 },
    { "name": "Ponte Freguesia do Ó", "lat": -23.508638, "lng": -46.705626 },
    { "name": "Metrô Barra Funda", "lat": -23.527700, "lng": -46.664140 },
    { "name": "Rua Norma Pieruccini Giannotti, 423", "lat": -23.523279, "lng": -46.654848 },
    { "name": "Ponte das Bandeiras", "lat": -23.519136, "lng": -46.630083 },
    { "name": "Metrô Carandiru", "lat": -23.509680, "lng": -46.624759 }
  ],
  "schedule": [
    "04:28",
    "17:00"
  ]
};

// Ensure no duplicates if ran twice
if (!data.lines.find(l => l.id === "linha-3")) {
  data.lines.push(linha3);
  fs.writeFileSync('./src/data/routes.json', JSON.stringify(data, null, 2));
  console.log("Linha 3 adicionada com sucesso!");
} else {
  console.log("Linha 3 ja existe.");
}

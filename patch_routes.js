const fs = require('fs');
const path = './src/data/routes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const updates = {
  // From Task 1 (first geocode)
  "Carrefour Rua Ademar de Barros": { "lat": -23.486302, "lng": -47.471529 },
  "Raposo Tavares/ Sentido Votorantim": { "lat": -23.525561, "lng": -47.444443 },
  "Condomínio Sunset / Condomínio Alfa Clube/ Bairro Parque Campolim": { "lat": -23.543634, "lng": -47.469443 },
  "Av Cláudio Pinto Nascimento/Sesi Votorantim": { "lat": -23.535729, "lng": -47.455998 },
  "Marginal Dom Aguirre/ Terminal São Paulo/ Bombeiro/ Posto Leizer": { "lat": -23.504532, "lng": -47.452625 },
  "Centro Empresarial João Dias": { "lat": -23.649202, "lng": -46.729996 },
  "FÓRUM E OAB": { "lat": -23.471996, "lng": -47.421293 },
  "AV. PARANA CONDOMINIO CAMPOS DO CONDE": { "lat": -23.409604, "lng": -47.390040 },
  "PARANA ESCOLA KEVEDO": { "lat": -23.397146, "lng": -47.357776 },
  "AV. PARANA CONDOMINIO CITY CASTELO": { "lat": -23.397327, "lng": -47.356206 },
  "MARGINAL PINHEIROS PONTE JAGUARE": { "lat": -23.544960, "lng": -46.733590 },
  "MARGINAL PINHEIROS PONTE CIDADE UNIVERSITARIA": { "lat": -23.558335, "lng": -46.711587 },
  "MARGINAL PINHEIROS BUTANTÃ PROX. METRO LINHA AMARELA": { "lat": -23.571913, "lng": -46.708168 },
  
  // From Task 2 (second geocode)
  "Vanel Ville McDonald's": { "lat": -23.500541, "lng": -47.504490 },
  "Terminal Ipiranga av Santa Cruz": { "lat": -23.499458, "lng": -47.507209 },
  "Armando Pannunzio/Bradesco": { "lat": -23.518789, "lng": -47.490426 },
  "Armando Pannunzio/ Supermercado Confiança": { "lat": -23.518789, "lng": -47.490426 },
  "Votorantim Shopping Iguatemi/ Tauste/ Mercadão": { "lat": -23.539658, "lng": -47.466501 },
  "Av 31 de Março Bombeiro Votorantim": { "lat": -23.531965, "lng": -47.450778 },
  "Posto Madeira sentido Marginal Dom Aguirre": { "lat": -23.469690, "lng": -47.448523 },
  "DED": { "lat": -23.620452, "lng": -46.700630 },
  "Posto Ally": { "lat": -23.612906, "lng": -46.671246 },
  "Cidade Jardim (Posto)": { "lat": -23.620452, "lng": -46.700630 },
  "3 DE MARÇO PARQUE CHICO MENDES": { "lat": -23.447614, "lng": -47.376248 },
  
  // One manual fix for Marginal Pinheiros (Chegada) -> Pinheiros station roughly
  "Marginal Pinheiros (Chegada)": { "lat": -23.567, "lng": -46.702 }
};

let modifiedCount = 0;

data.lines.forEach(line => {
  line.boardingStops.forEach(stop => {
    if (updates[stop.name]) {
      stop.lat = updates[stop.name].lat;
      stop.lng = updates[stop.name].lng;
      modifiedCount++;
    }
  });
  line.dropoffStops.forEach(stop => {
    if (updates[stop.name]) {
      stop.lat = updates[stop.name].lat;
      stop.lng = updates[stop.name].lng;
      modifiedCount++;
    }
  });
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Successfully patched ${modifiedCount} stops in routes.json`);

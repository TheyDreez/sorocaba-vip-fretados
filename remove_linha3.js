const fs = require('fs');

const path = './src/data/routes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const originalLength = data.lines.length;

// Remove a linha 3. O id provavelmente é 'linha3' ou podemos filtrar pelo nome se tiver "Linha 3"
data.lines = data.lines.filter(line => line.id !== 'linha-3' && !line.name.includes('Linha 3'));

if (data.lines.length < originalLength) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`Linha 3 removida com sucesso. Total de linhas agora: ${data.lines.length}`);
} else {
  console.log('Erro: Não encontrei a Linha 3 para remover. Mostrando os IDs disponíveis:');
  console.log(data.lines.map(l => l.id));
}

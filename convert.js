const sharp = require('sharp');
const path = require('path');

const dir = 'C:\\Users\\andre\\.gemini\\antigravity\\brain\\310cdb13-aa65-4f88-a24b-275b4b355c6f';

sharp(path.join(dir, 'bus_exterior_landscape_1784430310758.jpg'))
  .png()
  .toFile(path.join(dir, 'bus_exterior_landscape.png'))
  .then(() => console.log('1 done'))
  .catch(console.error);

sharp(path.join(dir, 'bus_interior_square_1784430319045.jpg'))
  .png()
  .toFile(path.join(dir, 'bus_interior_square.png'))
  .then(() => console.log('2 done'))
  .catch(console.error);

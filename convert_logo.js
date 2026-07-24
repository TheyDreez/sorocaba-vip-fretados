const sharp = require('sharp');
const path = require('path');

const dir = 'C:\\Users\\andre\\.gemini\\antigravity\\brain\\310cdb13-aa65-4f88-a24b-275b4b355c6f';

sharp(path.join(dir, 'bus_logo_square_1784431010430.jpg'))
  .png()
  .toFile(path.join(dir, 'bus_logo_square.png'))
  .then(() => console.log('Logo converted'))
  .catch(console.error);

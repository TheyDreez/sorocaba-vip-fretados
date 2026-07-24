const sharp = require('sharp');
const path = require('path');

const dir = 'C:\\Users\\andre\\.gemini\\antigravity\\brain\\310cdb13-aa65-4f88-a24b-275b4b355c6f';

// Image 1: media__1784430433707.png (Exterior)
sharp(path.join(dir, 'media__1784430433707.png'))
  .modulate({ brightness: 1.05, saturation: 1.15 }) // Slightly brighter and more vibrant colors
  .sharpen({ sigma: 1, m1: 1, m2: 1 }) // Sharpen details
  .png()
  .toFile(path.join(dir, 'bus_exterior_enhanced.png'))
  .then(() => console.log('1 done'))
  .catch(console.error);

// Image 2: media__1784430484578.png (Interior)
sharp(path.join(dir, 'media__1784430484578.png'))
  .modulate({ brightness: 1.10, saturation: 1.15 }) // Brighten the dark interior a bit more
  .sharpen({ sigma: 1, m1: 1, m2: 1 }) // Sharpen seats and lights
  .png()
  .toFile(path.join(dir, 'bus_interior_enhanced.png'))
  .then(() => console.log('2 done'))
  .catch(console.error);

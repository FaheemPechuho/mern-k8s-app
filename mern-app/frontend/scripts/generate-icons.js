const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'logo.svg');

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Generate favicon.ico (multiple sizes)
Promise.all([16, 32, 48].map(size => 
  sharp(svgBuffer)
    .resize(size, size)
    .toFormat('png')
    .toBuffer()
)).then(buffers => {
  sharp(Buffer.concat(buffers))
    .toFile(path.join(publicDir, 'favicon.ico'))
    .catch(console.error);
});

// Generate PNG icons
[192, 512].forEach(size => {
  sharp(svgBuffer)
    .resize(size, size)
    .toFile(path.join(publicDir, `logo${size}.png`))
    .catch(console.error);
}); 
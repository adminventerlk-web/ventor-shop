const sharp = require('sharp');
const path = require('path');

const input = 'C:/Users/mahen/.gemini/antigravity-ide/brain/4aa661a7-5bcd-4a0d-9d4b-17b19aa0d673/.user_uploaded/media_1791302510398.png';
const outputPng = path.join(__dirname, '../public/images/logo-badge.png');
const outputWebp = path.join(__dirname, '../public/images/logo-badge.webp');

async function makeCircular() {
  const width = 1024;
  const height = 1024;
  const cx = 511;
  const cy = 511.5;
  const r = 501.5;

  const circleSvg = Buffer.from(
    `<svg width="${width}" height="${height}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" />
    </svg>`
  );

  const mask = await sharp(circleSvg).toBuffer();

  await sharp(input)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(outputPng);

  await sharp(outputPng)
    .webp({ quality: 95 })
    .toFile(outputWebp);

  console.log('Successfully created round logo badge with transparent background outside circle!');
}

makeCircular().catch(console.error);

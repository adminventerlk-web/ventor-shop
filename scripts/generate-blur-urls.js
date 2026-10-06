const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'sri_lankan_exports.webp',
  'groceries_basket.webp',
  'rani_animal_feed.webp',
  'storefront_3d.webp',
  'hero_banner.webp',
  'hero_woman.webp',
  'logo.webp',
];

async function generateBlur() {
  const results = {};
  for (const imgName of images) {
    const fullPath = path.join('public', 'images', imgName);
    if (!fs.existsSync(fullPath)) {
      console.log('Not found:', fullPath);
      continue;
    }
    const image = sharp(fullPath);
    const stats = await image.stats();
    const dominantColor = `rgb(${Math.round(stats.dominant.r)}, ${Math.round(stats.dominant.g)}, ${Math.round(stats.dominant.b)})`;
    
    // Create a tiny 10x10 blurDataURL in webp format
    const tinyBuffer = await sharp(fullPath)
      .resize(10, 10, { fit: 'inside' })
      .toFormat('webp', { quality: 20 })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${tinyBuffer.toString('base64')}`;

    results[imgName] = {
      dominantColor,
      blurDataURL,
    };
  }
  console.log(JSON.stringify(results, null, 2));
}

generateBlur().catch(console.error);

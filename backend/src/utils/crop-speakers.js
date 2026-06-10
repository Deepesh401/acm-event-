import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Jimp } = require('jimp');
import path from 'path';

async function cropSpeakers() {
  const srcPath = 'C:/Users/deepe/.gemini/antigravity/brain/6be72efa-dd3f-4859-960a-113e057d63e5/media__1780992488279.png';
  const destDir = 'c:/Users/deepe/Desktop/acm/client/public/images';

  console.log('Loading source image...');
  const image = await Jimp.read(srcPath);
  console.log('Image loaded successfully.');

  const names = ['speaker-suhas', 'speaker-sashikumaar', 'speaker-srinivas', 'speaker-sashikumar-m'];
  
  // Fixed coordinates for the 4 speaker photos inside the 1024x473 image:
  // Card 1: x = 40, y = 110, w = 196, h = 250
  // Offset between columns is exactly 256px.
  const y = 110;
  const h = 250;
  const w = 196;
  const xs = [40, 296, 552, 808];

  for (let i = 0; i < 4; i++) {
    const x = xs[i];
    console.log(`Cropping ${names[i]} at x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
    const cropped = image.clone().crop({ x, y, w, h });
    const destPath = path.join(destDir, `${names[i]}.png`);
    await cropped.write(destPath);
    console.log(`Saved cropped speaker to: ${destPath}`);
  }
  
  console.log('All speaker photos cropped successfully!');
}

cropSpeakers().catch(err => {
  console.error('Error cropping speakers:', err);
});

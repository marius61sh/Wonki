// Generează iconițe PNG pentru PWA manifest
// Rulare: node generate-icons.js
const Jimp = require('jimp');
const path = require('path');
const fs   = require('fs');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT   = path.join(__dirname, 'images', 'icons');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const BG   = 0x918880FF; // taupe #918880
const TEXT = 0xFFFFFFFF; // alb

async function makeIcon(size) {
  const img    = new Jimp(size, size, BG);
  const radius = Math.round(size * 0.22);

  // Colțuri rotunjite — simulăm cu un pătrat interior + cerc pe fiecare colț
  // (Jimp nu suportă border-radius nativ — facem masking manual)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inTopLeft     = x < radius && y < radius         && Math.hypot(x - radius,      y - radius)      > radius;
      const inTopRight    = x >= size - radius && y < radius         && Math.hypot(x - (size-radius-1), y - radius)      > radius;
      const inBotLeft     = x < radius && y >= size - radius  && Math.hypot(x - radius,      y - (size-radius-1)) > radius;
      const inBotRight    = x >= size - radius && y >= size - radius  && Math.hypot(x - (size-radius-1), y - (size-radius-1)) > radius;
      if (inTopLeft || inTopRight || inBotLeft || inBotRight) {
        img.setPixelColor(0x00000000, x, y);
      }
    }
  }

  // Litera "w" centrată — folosim fontul Jimp built-in
  const fontSize = Math.round(size * 0.52);
  let font;
  try {
    font = await Jimp.loadFont(size >= 256 ? Jimp.FONT_SANS_128_WHITE : Jimp.FONT_SANS_64_WHITE);
  } catch {
    font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  }

  img.print(font, 0, 0, {
    text: 'w',
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  }, size, size);

  const out = path.join(OUT, `icon-${size}.png`);
  await img.writeAsync(out);
  console.log(`  ✅ icon-${size}.png`);
}

(async () => {
  console.log('\n🎨 Generez iconiţe PWA...\n');
  for (const s of SIZES) {
    await makeIcon(s).catch(e => console.error(`  ❌ ${s}:`, e.message));
  }
  console.log('\n✅ Gata! Iconițele sunt în images/icons/\n');
})();

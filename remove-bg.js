// ============================================================
//  Elimină fundalul alb din ilustrații → salvează ca PNG
//  Rulare: node remove-bg.js
// ============================================================
const Jimp = require('jimp');
const path = require('path');

const IMAGES   = ['illu-goat', 'illu-duck', 'illu-bunny', 'illu-sheep'];
const TOLERANCE = 28; // cât de aproape de alb să elimine (0–255)

async function removeBg(name) {
  const inputPath  = path.join(__dirname, 'images', name + '.jpg');
  const outputPath = path.join(__dirname, 'images', name + '.png');

  const img = await Jimp.read(inputPath);
  const { width, height } = img.bitmap;

  // ── BFS flood-fill din colțuri ──────────────────────────────
  const visited = new Uint8Array(width * height);
  const queue   = [];

  const isWhitish = (x, y) => {
    const i = (y * width + x) * 4;
    const d = img.bitmap.data;
    return d[i] >= 255 - TOLERANCE &&
           d[i+1] >= 255 - TOLERANCE &&
           d[i+2] >= 255 - TOLERANCE;
  };

  // Pornește din toate cele 4 colțuri
  [[0,0],[width-1,0],[0,height-1],[width-1,height-1]].forEach(([x,y]) => {
    visited[y * width + x] = 1;
    queue.push(x, y);
  });

  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++];
    const y = queue[qi++];
    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      if (isWhitish(nx, ny)) {
        visited[ni] = 1;
        queue.push(nx, ny);
      }
    }
  }

  // Setează alpha = 0 pe pixelii din fundal
  img.scan(0, 0, width, height, function(x, y, idx) {
    if (visited[y * width + x]) this.bitmap.data[idx + 3] = 0;
  });

  await img.writeAsync(outputPath);
  console.log(`  ✅ ${name}.png`);
}

(async () => {
  console.log('\n🎨 Eliminare fundal alb...\n');
  for (const name of IMAGES) {
    await removeBg(name).catch(e => console.error(`  ❌ ${name}:`, e.message));
  }
  console.log('\n✅ Gata! Actualizează HTML-ul să folosească .png în loc de .jpg\n');
})();

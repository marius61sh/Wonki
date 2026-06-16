require('dotenv').config({ path: __dirname + '/.env' });
const { initDB, getDB } = require('./firebase');

initDB().then(async () => {
  const db = getDB();

  // ── Testimoniale ─────────────────────────────────────────────
  const testSnap = await db.collection('testimoniale').get();
  const testNoi = [
    { name: 'Natalia Ciobanu', role: 'Mama lui Maxim, 4 ani',  text: 'Wonki este locul perfect pentru copilul meu! Educatoarele sunt minunate.',                           stars: 5, status: 'activ' },
    { name: 'Viorel Lupu',     role: 'Tata Sofiei, 3 ani',     text: 'Copilul nostru asteapta cu nerabdare sa mearga in fiecare zi. Recomandam cu caldura!',                stars: 5, status: 'activ' },
    { name: 'Aliona Moraru',   role: 'Mama lui Daniil, 5 ani', text: 'Mediul calduros si activitatile creative fac din Wonki alegerea perfecta pentru familia noastra.',    stars: 5, status: 'activ' },
  ];

  const batchTest = db.batch();
  testSnap.docs.forEach((doc, i) => {
    if (testNoi[i]) batchTest.update(doc.ref, testNoi[i]);
  });
  await batchTest.commit();
  console.log(`✅ Testimoniale actualizate (${testSnap.size} înregistrări)`);

  // ── Echipă ───────────────────────────────────────────────────
  const echipaSnap = await db.collection('echipa').orderBy('created', 'asc').get();
  const echipaNoi = [
    { name: 'Tatiana Botnaru', role: 'Director & Educator', emoji: '👩‍🏫', bio: 'Cu 15 ani de experienta in educatia timpurie.' },
    { name: 'Olga Vrabie',     role: 'Educator Senior',     emoji: '🌟',   bio: 'Specialista in educatie prin joc si creativitate.' },
    { name: 'Dorina Rusu',     role: 'Profesor Muzica',     emoji: '🎵',   bio: 'Aduce magia muzicii in viata copiilor.' },
    { name: 'Liliana Grosu',   role: 'Nutritionist',        emoji: '🥗',   bio: 'Creeaza meniuri sanatoase si delicioase zilnic.' },
  ];

  const batchEchipa = db.batch();
  echipaSnap.docs.forEach((doc, i) => {
    if (echipaNoi[i]) batchEchipa.update(doc.ref, echipaNoi[i]);
  });
  await batchEchipa.commit();
  console.log(`✅ Echipă actualizată (${echipaSnap.size} înregistrări)`);

  process.exit(0);
}).catch(e => {
  console.error('❌ Eroare:', e.message);
  process.exit(1);
});

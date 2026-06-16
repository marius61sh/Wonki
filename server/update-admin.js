// Script one-time: actualizează credențialele adminului în Firestore
// Rulare: node server/update-admin.js
require('dotenv').config({ path: __dirname + '/.env' });
const { initDB, getDB } = require('./firebase');
const bcrypt = require('bcryptjs');

initDB().then(async () => {
  const db = getDB();
  const snap = await db.collection('users').get();

  if (snap.empty) {
    console.log('Nu există niciun utilizator admin în baza de date.');
    process.exit(0);
  }

  const batch = db.batch();
  snap.docs.forEach(doc => {
    batch.update(doc.ref, {
      email:    'admin@',
      password: bcrypt.hashSync('wonki2026', 10),
    });
  });

  await batch.commit();
  console.log(`✅ Credențiale actualizate pentru ${snap.size} cont(uri) admin.`);
  console.log('   Email nou:  admin@');
  console.log('   Parolă nouă: wonki2026');
  process.exit(0);
}).catch(e => {
  console.error('❌ Eroare:', e.message);
  process.exit(1);
});

// ============================================================
//  WONKI – Initializare Firebase + Firestore
// ============================================================
const admin  = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path   = require('path');

let db;

async function initDB() {
  let serviceAccount;
  if (process.env.FIREBASE_CREDENTIALS) {
    // Pe Render / cloud — credențialele vin din variabila de mediu
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } else {
    // Local — citim din fișier
    serviceAccount = require(path.resolve(__dirname, 'firebase-credentials.json'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  db = admin.firestore();
  console.log(' Firebase conectat!');

  await seedIfEmpty();
  return db;
}

function getDB() {
  if (!db) throw new Error('Firestore nu a fost initializat!');
  return db;
}

// Converteste un document Firestore intr-un obiect simplu JSON
function docToObj(doc) {
  const data = doc.data();
  const result = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    result[key] = value && value.toDate ? value.toDate().toISOString() : value;
  }
  return result;
}

// Populeaza baza de date la prima pornire
async function seedIfEmpty() {
  const snap = await db.collection('users').limit(1).get();
  if (!snap.empty) return;

  console.log(' Prima pornire - creez datele initiale...');
  const now = new Date();

  await db.collection('users').add({
    email:    'admin@',
    password: bcrypt.hashSync('wonki2026', 10),
    name:     'Administrator',
    created:  now
  });

  await db.collection('blog').add({ title: 'Bun venit la Wonki!', content: 'Suntem bucurosi sa va prezentam gradinita noastra plina de culoare si bucurie!', category: 'Noutati',    status: 'publicat', views: 0, created: now });
  await db.collection('blog').add({ title: 'Programul de toamna 2025', content: 'Noul program de activitati pentru trimestrul de toamna este disponibil acum pe site.',           category: 'Evenimente', status: 'publicat', views: 0, created: now });
  await db.collection('blog').add({ title: 'Atelier de pictura',       content: 'Copiii nostri au participat la un atelier special de pictura cu artisti locali.',                  category: 'Activitati', status: 'publicat', views: 0, created: now });

  await db.collection('testimoniale').add({ name: 'Natalia Ciobanu',  role: 'Mama lui Maxim, 4 ani',  text: 'Wonki este locul perfect pentru copilul meu! Educatoarele sunt minunate.',                           stars: 5, status: 'activ', created: now });
  await db.collection('testimoniale').add({ name: 'Viorel Lupu',      role: 'Tata Sofiei, 3 ani',     text: 'Copilul nostru asteapta cu nerabdare sa mearga in fiecare zi. Recomandam cu caldura!',                stars: 5, status: 'activ', created: now });
  await db.collection('testimoniale').add({ name: 'Aliona Moraru',    role: 'Mama lui Daniil, 5 ani', text: 'Mediul calduros si activitatile creative fac din Wonki alegerea perfecta pentru familia noastra.', stars: 5, status: 'activ', created: now });

  await db.collection('echipa').add({ name: 'Tatiana Botnaru', role: 'Director & Educator',  emoji: '👩‍🏫', bio: 'Cu 15 ani de experienta in educatia timpurie.',      status: 'activ', created: now });
  await db.collection('echipa').add({ name: 'Olga Vrabie',     role: 'Educator Senior',      emoji: '🌟',   bio: 'Specialista in educatie prin joc si creativitate.',  status: 'activ', created: now });
  await db.collection('echipa').add({ name: 'Dorina Rusu',     role: 'Profesor Muzica',      emoji: '🎵',   bio: 'Aduce magia muzicii in viata copiilor.',             status: 'activ', created: now });
  await db.collection('echipa').add({ name: 'Liliana Grosu',   role: 'Nutritionist',         emoji: '🥗',   bio: 'Creeaza meniuri sanatoase si delicioase zilnic.',   status: 'activ', created: now });

  console.log(' Date initiale create cu succes!');
}

module.exports = { initDB, getDB, docToObj };

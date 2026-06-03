// ============================================================
//  WONKI – Script de seed date demo
//  Rulare: node seed.js
// ============================================================
require('dotenv').config();
const admin  = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path   = require('path');

// ── Init Firebase ─────────────────────────────────────────────
let serviceAccount;
if (process.env.FIREBASE_CREDENTIALS) {
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  serviceAccount = require(path.resolve(__dirname, 'firebase-credentials.json'));
}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// ── Helpers ───────────────────────────────────────────────────
const ago = (days) => new Date(Date.now() - days * 86400000);

function calcGrupa(dataNasterii) {
  if (!dataNasterii) return 'Necunoscută';
  const dob = new Date(dataNasterii);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  if (age <= 2) return '🐻 Ursuleți';
  if (age === 3) return '🦋 Fluturași';
  if (age === 4) return '⭐ Steluțe';
  return '🚀 Exploratori';
}

async function seed() {
  console.log('\n🌱 Începe seed-ul datelor demo...\n');

  // ── 1. COPII ────────────────────────────────────────────────
  console.log('👦 Adaug copii...');
  const copiiData = [
    { numeCopil: 'Alexandru Ionescu',  dataNasterii: '2022-03-15', numeParinte: 'Maria Ionescu',    telefon: '069123456', email: 'maria.ionescu@gmail.com',    program: 'Scurt (07:30–13:00)',  alergii: '',              observatii: 'Îi plac activitățile artistice' },
    { numeCopil: 'Sofia Popescu',      dataNasterii: '2021-07-22', numeParinte: 'Ion Popescu',       telefon: '068234567', email: 'ion.popescu@gmail.com',       program: 'Lung (07:30–18:00)',   alergii: 'Lactate',       observatii: 'Alergie la lactate — fără lapte și brânză' },
    { numeCopil: 'Andrei Constantin',  dataNasterii: '2020-11-08', numeParinte: 'Elena Constantin',  telefon: '067345678', email: 'elena.const@yahoo.com',       program: 'Premium Plus',         alergii: '',              observatii: '' },
    { numeCopil: 'Mia Dumitrescu',     dataNasterii: '2020-05-30', numeParinte: 'Radu Dumitrescu',   telefon: '060456789', email: 'radu.d@gmail.com',            program: 'Lung (07:30–18:00)',   alergii: 'Nuci',          observatii: 'Alergie la nuci — atenție la gustări' },
    { numeCopil: 'Luca Popa',          dataNasterii: '2019-09-14', numeParinte: 'Ana Popa',          telefon: '069567890', email: 'ana.popa@gmail.com',          program: 'Premium Plus',         alergii: '',              observatii: 'Timid la început, se adaptează repede' },
    { numeCopil: 'Emma Stoica',        dataNasterii: '2019-02-28', numeParinte: 'Mihai Stoica',      telefon: '068678901', email: 'mihai.stoica@gmail.com',      program: 'Scurt (07:30–13:00)',  alergii: '',              observatii: '' },
    { numeCopil: 'Rareș Moldovan',     dataNasterii: '2021-12-01', numeParinte: 'Cristina Moldovan', telefon: '067789012', email: 'cristina.moldovan@yahoo.com', program: 'Lung (07:30–18:00)',   alergii: 'Polen (sezonier)', observatii: 'Antihistaminic în sezon' },
    { numeCopil: 'Sara Nistor',        dataNasterii: '2022-08-19', numeParinte: 'Bogdan Nistor',     telefon: '069890123', email: 'bogdan.nistor@gmail.com',     program: 'Scurt (07:30–13:00)',  alergii: '',              observatii: 'Prima experiență la grădiniță' },
  ];

  const copiiIds = [];
  for (const c of copiiData) {
    const ref = await db.collection('copii').add({
      ...c,
      grupa:  calcGrupa(c.dataNasterii),
      varsta: '',
      status: 'activ',
      created: ago(Math.floor(Math.random() * 60) + 10)
    });
    copiiIds.push({ id: ref.id, ...c });
    console.log(`   ✅ ${c.numeCopil} (${calcGrupa(c.dataNasterii)})`);
  }

  // ── 2. INSCRIERI ────────────────────────────────────────────
  console.log('\n📋 Adaug înscrieri...');
  const inscrieriData = [
    { numeCopil: 'David Georgescu',  dataNasterii: '2021-04-10', numeParinte: 'Laura Georgescu',   telefon: '069111222', email: 'laura.g@gmail.com',  program: 'Lung (07:30–18:00)',  sursa: 'Recomandare',  mesaj: 'Suntem foarte interesați de grupul Fluturași. Putem programa o vizită?',             status: 'nou',       created: ago(2) },
    { numeCopil: 'Ioana Mureșan',    dataNasterii: '2020-08-25', numeParinte: 'Dan Mureșan',        telefon: '068222333', email: 'dan.m@yahoo.com',    program: 'Premium Plus',         sursa: 'Facebook',     mesaj: 'Am văzut postarea voastră pe Facebook. Ce documente sunt necesare pentru înscriere?', status: 'nou',       created: ago(1) },
    { numeCopil: 'Pavel Costache',   dataNasterii: '2019-11-15', numeParinte: 'Ioana Costache',     telefon: '067333444', email: 'i.costache@gmail.com', program: 'Scurt (07:30–13:00)', sursa: 'Google',       mesaj: '',                                                                                    status: 'confirmat', created: ago(15) },
    { numeCopil: 'Ana-Maria Toma',   dataNasterii: '2022-01-20', numeParinte: 'Victor Toma',        telefon: '069444555', email: 'v.toma@gmail.com',   program: 'Lung (07:30–18:00)',  sursa: 'Site web',     mesaj: 'Fetița noastră are 2 ani. Există locuri disponibile în grupa Ursuleți?',              status: 'nou',       created: ago(0) },
    { numeCopil: 'Mihai Bucur',      dataNasterii: '2020-06-03', numeParinte: 'Simona Bucur',       telefon: '068555666', email: 's.bucur@yahoo.com',  program: 'Premium Plus',         sursa: 'Prieten',      mesaj: 'Ne recomandați cu drag! Abia așteptăm să venim la vizită.',                           status: 'confirmat', created: ago(20) },
  ];

  for (const ins of inscrieriData) {
    await db.collection('inscrieri').add({ ...ins, created: ins.created });
    console.log(`   ✅ ${ins.numeCopil} — ${ins.status}`);
  }

  // ── 3. MESAJE CONTACT ───────────────────────────────────────
  console.log('\n💬 Adaug mesaje contact...');
  const mesajeData = [
    { from_name: 'Laura Georgescu', email: 'laura.g@gmail.com',    subject: 'Întrebare despre program',      body: 'Bună ziua! Aș dori să știu mai multe detalii despre programul scurt. Care sunt activitățile incluse?',                                    read: false, created: ago(1) },
    { from_name: 'Dan Mureșan',     email: 'dan.m@yahoo.com',      subject: 'Meniu zilnic',                  body: 'Bună! Puteți să-mi spuneți dacă există opțiuni vegetariene în meniu? Copilul nostru nu mănâncă carne.',                                   read: false, created: ago(0) },
    { from_name: 'Simona Bucur',    email: 's.bucur@yahoo.com',    subject: 'Mulțumiri',                     body: 'Vreau să vă mulțumesc pentru cum ați primit copilul meu în primele zile. Echipa voastră este extraordinară!',                               read: true,  created: ago(5) },
    { from_name: 'Victor Toma',     email: 'v.toma@gmail.com',     subject: 'Disponibilitate locuri',        body: 'Salut! Vrem să înmătriculăm fetița de la septembrie. Mai sunt locuri disponibile în grupa Ursuleți pentru 2025-2026?',                      read: true,  created: ago(7) },
    { from_name: 'Andrei Marin',    email: 'andrei.m@gmail.com',   subject: 'Vizită grădiniță',              body: 'Bună ziua! Când putem veni să vizităm grădinița? Suntem o familie nouă în Chișinău și căutăm o grădiniță de calitate.',                    read: false, created: ago(0) },
  ];

  for (const m of mesajeData) {
    await db.collection('mesaje').add(m);
    console.log(`   ✅ ${m.from_name} — "${m.subject}"`);
  }

  // ── 4. ANUNTURI PORTAL ──────────────────────────────────────
  console.log('\n📢 Adaug anunțuri portal...');
  const anunturiData = [
    { titlu: 'Serbare de Crăciun — 20 decembrie 🎄',         text: 'Vă invităm pe toți părinții la serbarea de Crăciun care va avea loc pe 20 decembrie, ora 17:00, în sala de festivități. Copiii au pregătit surprize speciale!',                                 tip: 'eveniment', created: ago(3)  },
    { titlu: 'Program modificat săptămâna 9-13 decembrie',    text: 'Vă informăm că în perioada 9-13 decembrie programul va fi 08:00-17:00 din cauza cursurilor de formare ale educatoarelor. Vă mulțumim pentru înțelegere.',                                        tip: 'important', created: ago(5)  },
    { titlu: 'Meniu nou disponibil pentru luna Decembrie',    text: 'Meniul pentru luna Decembrie a fost actualizat. Puteți vizualiza meniul complet la secretariat sau contactați-ne direct. Am adăugat mai multe opțiuni de fructe de sezon.',                       tip: 'info',      created: ago(8)  },
    { titlu: 'Atelier de pictură cu părinții — sâmbătă',      text: 'Sâmbătă, 14 decembrie, organizăm un atelier special de pictură unde părinții pot participa alături de copii. Înscrierile se fac până vineri. Locuri limitate — 15 familii!',                    tip: 'eveniment', created: ago(10) },
    { titlu: 'Reamintire: taxa lunii Decembrie',               text: 'Vă reamintim că taxa pentru luna Decembrie trebuie achitată până pe 5 decembrie. Puteți plăti prin transfer bancar (detaliile la secretariat) sau numerar.',                                      tip: 'important', created: ago(12) },
  ];

  for (const a of anunturiData) {
    await db.collection('anunturi').add(a);
    console.log(`   ✅ ${a.titlu}`);
  }

  // ── 5. CONTURI PARINTI ──────────────────────────────────────
  console.log('\n👨‍👩‍👧 Adaug conturi părinți...');
  // Creem conturi pentru primii 3 copii
  const conturiParinti = [
    { copilIndex: 0, email: 'maria.ionescu@gmail.com', password: 'parola123', name: 'Maria Ionescu'    },
    { copilIndex: 1, email: 'ion.popescu@gmail.com',   password: 'parola123', name: 'Ion Popescu'      },
    { copilIndex: 2, email: 'elena.const@yahoo.com',   password: 'parola123', name: 'Elena Constantin' },
  ];

  const parintiIds = [];
  for (const p of conturiParinti) {
    const copil = copiiIds[p.copilIndex];
    const ref = await db.collection('parinti').add({
      email:    p.email,
      password: bcrypt.hashSync(p.password, 10),
      name:     p.name,
      copilId:  copil.id,
      created:  ago(30)
    });
    parintiIds.push({ id: ref.id, copilId: copil.id, name: p.name });
    console.log(`   ✅ ${p.name} (${p.email} / ${p.password})`);
  }

  // ── 6. MESAJE PORTAL PARINTI ────────────────────────────────
  console.log('\n💬 Adaug mesaje portal părinți...');
  const convData = [
    // Conversație 1 — Maria Ionescu (Alexandru)
    { copilId: parintiIds[0].copilId, parinteId: parintiIds[0].id, from: 'parinte', text: 'Bună ziua! Vreau să știu cum s-a descurcat Alexandru azi la activitățile STEAM.',       created: ago(3) },
    { copilId: parintiIds[0].copilId, parinteId: parintiIds[0].id, from: 'admin',   text: 'Bună ziua, Doamna Ionescu! Alexandru a fost extraordinar azi — a construit un turn din blocuri și a explicat colegilor cum funcționează! Suntem mândri de el. 🌟', created: ago(3) },
    { copilId: parintiIds[0].copilId, parinteId: parintiIds[0].id, from: 'parinte', text: 'Minunat! Vă mulțumesc mult. Chiar acasă tot de turnuri și construcții vorbea ieri seară. 😄', created: ago(2) },
    { copilId: parintiIds[0].copilId, parinteId: parintiIds[0].id, from: 'admin',   text: 'Cu mare drag! Mâine avem atelier de pictură — pregătiți hăinuțe pe care poate le pătăm puțin. 🎨', created: ago(2) },

    // Conversație 2 — Ion Popescu (Sofia)
    { copilId: parintiIds[1].copilId, parinteId: parintiIds[1].id, from: 'parinte', text: 'Buna ziua! Sofia a mâncat ceva cu lactate azi? Are alergie și vrem să fim siguri.', created: ago(1) },
    { copilId: parintiIds[1].copilId, parinteId: parintiIds[1].id, from: 'admin',   text: 'Bună ziua! Nu vă faceți griji — avem notată alergia Sofiei și bucătarul pregătește mereu o porție separată fără lactate. Astăzi a mâncat mâncare de legume cu orez. 🥗', created: ago(1) },
    { copilId: parintiIds[1].copilId, parinteId: parintiIds[1].id, from: 'parinte', text: 'Mulțumesc frumos! Suntem liniștiți știind că e în mâini bune.', created: ago(1) },

    // Conversație 3 — Elena Constantin (Andrei) — mesaj nou necitit
    { copilId: parintiIds[2].copilId, parinteId: parintiIds[2].id, from: 'parinte', text: 'Bună ziua! Andrei vine mâine cu mașinuța lui preferată la grădiniță, sper că e ok?', created: ago(0) },
  ];

  for (const m of convData) {
    await db.collection('mesaje_parinti').add({ ...m, read: m.from === 'admin' });
    process.stdout.write('   💬 ');
  }
  console.log('\n   ✅ Mesaje adăugate');

  // ── SUMAR ────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log('✅ SEED COMPLET!\n');
  console.log('📌 Date adăugate:');
  console.log(`   👦 ${copiiData.length} copii activi`);
  console.log(`   📋 ${inscrieriData.length} înscrieri (3 noi, 2 confirmate)`);
  console.log(`   💬 ${mesajeData.length} mesaje contact`);
  console.log(`   📢 ${anunturiData.length} anunțuri portal`);
  console.log(`   👨‍👩‍👧 ${conturiParinti.length} conturi părinți`);
  console.log(`   💬 ${convData.length} mesaje portal\n`);
  console.log('🔑 Conturi părinți create:');
  conturiParinti.forEach(p => console.log(`   ${p.email}  /  ${p.password}`));
  console.log('\n🔑 Cont admin (existent):');
  console.log('   admin@wonki.ro  /  wonki2025');
  console.log('='.repeat(50) + '\n');

  process.exit(0);
}

seed().catch(e => { console.error('❌ Eroare seed:', e); process.exit(1); });

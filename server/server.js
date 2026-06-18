// ============================================================
//  WONKI – Server Express + Firestore
//  Pornire: cd server && npm run dev
// ============================================================
require('dotenv').config({ path: __dirname + '/.env' });
const express      = require('express');
const path         = require('path');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const multer       = require('multer');
const cors         = require('cors');
const fs           = require('fs');
const rateLimit    = require('express-rate-limit');
const nodemailer   = require('nodemailer');
const { initDB, getDB, docToObj } = require('./firebase');

// ── Nodemailer transporter ───────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const app    = express();
const PORT   = process.env.PORT       || 3000;
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  console.error('EROARE: JWT_SECRET lipseste din fisierul .env!');
  process.exit(1);
}

// ── Uploads dir ─────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(uploadsDir));

// ── Multer ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Doar imagini!'))
});

// ── Rate limiting pe login ───────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'Prea multe incercari. Incearca din nou dupa 15 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Auth middleware ──────────────────────────────────────────
function auth(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, error: 'Neautorizat' });
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { res.status(401).json({ ok: false, error: 'Token invalid' }); }
}

const ok  = (res, data)      => res.json({ ok: true, data });
const err = (res, msg, s=400) => res.status(s).json({ ok: false, error: msg });

// ── AUTH ─────────────────────────────────────────────────────
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return err(res, 'Email si parola obligatorii');

    const snap = await getDB().collection('users').where('email', '==', email).limit(1).get();
    if (snap.empty) return err(res, 'Email sau parola incorecta', 401);

    const userDoc = snap.docs[0];
    const user    = userDoc.data();
    if (!bcrypt.compareSync(password, user.password)) return err(res, 'Email sau parola incorecta', 401);

    const token = jwt.sign({ id: userDoc.id, email: user.email, name: user.name }, SECRET, { expiresIn: '24h' });
    ok(res, { token, name: user.name, email: user.email });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return err(res, 'Parola noua prea scurta (min 6 caractere)');

    const userDoc = await getDB().collection('users').doc(req.user.id).get();
    if (!userDoc.exists) return err(res, 'Utilizator negasit', 404);

    if (!bcrypt.compareSync(currentPassword, userDoc.data().password)) return err(res, 'Parola curenta gresita');
    await getDB().collection('users').doc(req.user.id).update({ password: bcrypt.hashSync(newPassword, 10) });
    ok(res, 'Parola schimbata');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── BLOG ─────────────────────────────────────────────────────
app.get('/api/blog', async (req, res) => {
  try {
    const snap = await getDB().collection('blog').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj).filter(p => p.status === 'publicat'));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/blog', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('blog').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/blog', auth, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    if (!title) return err(res, 'Titlul obligatoriu');
    const ref = await getDB().collection('blog').add({
      title, content: content || '', category: category || 'Noutati',
      status: status || 'publicat', views: 0, created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/blog/:id', auth, async (req, res) => {
  try {
    const { title, content, category, status } = req.body;
    await getDB().collection('blog').doc(req.params.id).update({ title, content, category, status });
    ok(res, 'Actualizat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/blog/:id', auth, async (req, res) => {
  try {
    await getDB().collection('blog').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── TESTIMONIALE ─────────────────────────────────────────────
app.get('/api/testimoniale', async (req, res) => {
  try {
    const snap = await getDB().collection('testimoniale').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj).filter(t => t.status === 'activ'));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/testimoniale', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('testimoniale').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/testimoniale', auth, async (req, res) => {
  try {
    const { name, role, text, stars, status } = req.body;
    if (!name) return err(res, 'Numele obligatoriu');
    const ref = await getDB().collection('testimoniale').add({
      name, role: role || '', text: text || '',
      stars: stars || 5, status: status || 'activ', created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/testimoniale/:id', auth, async (req, res) => {
  try {
    const { name, role, text, stars, status } = req.body;
    await getDB().collection('testimoniale').doc(req.params.id).update({ name, role, text, stars, status });
    ok(res, 'Actualizat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/testimoniale/:id', auth, async (req, res) => {
  try {
    await getDB().collection('testimoniale').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── INSCRIERI ────────────────────────────────────────────────
app.post('/api/inscrieri', async (req, res) => {
  try {
    const { numeCopil, dataNasterii, numeParinte, telefon, email, program, sursa, mesaj } = req.body;
    if (!numeParinte) return err(res, 'Numele obligatoriu');

    // ── Verificare duplicate ──────────────────────────────────
    const db = getDB();
    if (email) {
      const dupEmail = await db.collection('inscrieri').where('email', '==', email.toLowerCase()).limit(1).get();
      if (!dupEmail.empty) return err(res, 'Există deja o cerere de înscriere cu acest email.');
    }
    if (telefon) {
      const clean = telefon.replace(/\s/g, '');
      const dupTel = await db.collection('inscrieri').where('telefon', '==', clean).limit(1).get();
      if (!dupTel.empty) return err(res, 'Există deja o cerere de înscriere cu acest număr de telefon.');
    }
    if (numeCopil && dataNasterii) {
      const dupCopil = await db.collection('inscrieri')
        .where('numeCopil', '==', numeCopil).where('dataNasterii', '==', dataNasterii).limit(1).get();
      if (!dupCopil.empty) return err(res, 'Există deja o cerere pentru acest copil.');
    }

    const varstaAnni = calcVarsta(dataNasterii);
    const ref = await getDB().collection('inscrieri').add({
      numeCopil:    numeCopil    || '',
      dataNasterii: dataNasterii || '',
      varsta:       varstaAnni !== null ? varstaAnni + ' ani' : '',
      numeParinte,
      telefon:  telefon  || '',
      email:    email    || '',
      program:  program  || '',
      sursa:    sursa    || '',
      mesaj:    mesaj    || '',
      status: 'nou',
      created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/inscrieri', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('inscrieri').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/inscrieri/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await getDB().collection('inscrieri').doc(req.params.id).update({ status });

    // La confirmare → creează automat profil copil (dacă nu există deja)
    if (status === 'confirmat') {
      const existing = await getDB().collection('copii')
        .where('inscriere_id', '==', req.params.id).limit(1).get();
      if (existing.empty) {
        const insSnap = await getDB().collection('inscrieri').doc(req.params.id).get();
        const ins = insSnap.data() || {};
        const varstaCalc = calcVarsta(ins.dataNasterii);
        await getDB().collection('copii').add({
          numeCopil:    ins.numeCopil    || '',
          dataNasterii: ins.dataNasterii || '',
          varsta:       varstaCalc !== null ? varstaCalc + ' ani' : (ins.varsta || ''),
          numeParinte:  ins.numeParinte  || '',
          telefon:      ins.telefon      || '',
          email:        ins.email        || '',
          program:      ins.program      || '',
          grupa:        ins.dataNasterii ? getGrupaFromDate(ins.dataNasterii) : getGrupa(ins.varsta),
          observatii:   '',
          alergii:      '',
          status:       'activ',
          inscriere_id: req.params.id,
          created:      new Date()
        });
      }
    }
    ok(res, 'Actualizat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// Calculeaza varsta exacta in ani din data nasterii
function calcVarsta(dataNasterii) {
  if (!dataNasterii) return null;
  const dob = new Date(dataNasterii);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

// Atribuie grupa in functie de data nasterii
function getGrupaFromDate(dataNasterii) {
  const age = calcVarsta(dataNasterii);
  if (age === null) return 'Necunoscută';
  if (age <= 2) return '🐻 Ursuleți';
  if (age === 3) return '🦋 Fluturași';
  if (age === 4) return '⭐ Steluțe';
  return '🚀 Exploratori';
}

// Fallback pentru datele vechi cu string range
function getGrupa(varsta) {
  if (!varsta) return 'Necunoscută';
  if (varsta.startsWith('2')) return '🐻 Ursuleți';
  if (varsta.startsWith('3')) return '🦋 Fluturași';
  if (varsta.startsWith('4')) return '⭐ Steluțe';
  return '🚀 Exploratori';
}

// ── COPII ─────────────────────────────────────────────────────
app.get('/api/admin/copii', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('copii').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/copii', auth, async (req, res) => {
  try {
    const { numeCopil, dataNasterii, numeParinte, telefon, email, program, grupa, observatii, alergii } = req.body;
    if (!numeCopil) return err(res, 'Numele copilului este obligatoriu');

    // ── Verificare duplicate ──────────────────────────────────
    const db = getDB();
    if (email) {
      const dup = await db.collection('copii').where('email', '==', email.toLowerCase()).limit(1).get();
      if (!dup.empty) return err(res, 'Există deja un copil înregistrat cu acest email.');
    }
    if (telefon) {
      const clean = telefon.replace(/\s/g, '');
      const dup = await db.collection('copii').where('telefon', '==', clean).limit(1).get();
      if (!dup.empty) return err(res, 'Există deja un copil înregistrat cu acest număr de telefon.');
    }
    if (dataNasterii) {
      const dup = await db.collection('copii')
        .where('numeCopil', '==', numeCopil).where('dataNasterii', '==', dataNasterii).limit(1).get();
      if (!dup.empty) return err(res, 'Există deja un profil pentru acest copil (nume + dată naștere identice).');
    }

    const varstaCalc = calcVarsta(dataNasterii);
    const ref = await getDB().collection('copii').add({
      numeCopil,
      dataNasterii: dataNasterii || '',
      varsta:       varstaCalc !== null ? varstaCalc + ' ani' : '',
      numeParinte:  numeParinte || '',
      telefon:      telefon     || '',
      email:        email       || '',
      program:      program     || '',
      grupa:        grupa || (dataNasterii ? getGrupaFromDate(dataNasterii) : 'Necunoscută'),
      observatii:   observatii  || '',
      alergii:      alergii     || '',
      status: 'activ', created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/copii/:id', auth, async (req, res) => {
  try {
    const { numeCopil, dataNasterii, numeParinte, telefon, email, program, grupa, observatii, alergii, status } = req.body;
    const varstaCalc = calcVarsta(dataNasterii);
    await getDB().collection('copii').doc(req.params.id).update({
      numeCopil:    numeCopil    || '',
      dataNasterii: dataNasterii || '',
      varsta:       varstaCalc !== null ? varstaCalc + ' ani' : '',
      numeParinte,  telefon, email, program,
      grupa:        grupa || (dataNasterii ? getGrupaFromDate(dataNasterii) : 'Necunoscută'),
      observatii:   observatii || '',
      alergii:      alergii    || '',
      status
    });
    ok(res, 'Actualizat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/copii/:id', auth, async (req, res) => {
  try {
    await getDB().collection('copii').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/inscrieri/:id', auth, async (req, res) => {
  try {
    await getDB().collection('inscrieri').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── ADMIN: CLEANUP DUPLICATE ──────────────────────────────────
app.post('/api/admin/cleanup-duplicates', auth, async (req, res) => {
  try {
    const db = getDB();
    let totalDeleted = 0;
    const report = [];

    async function deduplicateCollection(colName, keys) {
      const snap = await db.collection(colName).get();
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const seen = new Map(); // key → doc cu created cel mai recent
      const toDelete = [];

      for (const doc of docs) {
        for (const key of keys) {
          const val = (doc[key] || '').toString().trim().toLowerCase().replace(/\s/g, '');
          if (!val) continue;
          const mapKey = `${key}::${val}`;
          if (seen.has(mapKey)) {
            // Păstrăm cel mai recent (created mai mare)
            const existing = seen.get(mapKey);
            const existDate = existing.created?.toDate ? existing.created.toDate() : new Date(existing.created || 0);
            const curDate   = doc.created?.toDate     ? doc.created.toDate()       : new Date(doc.created || 0);
            if (curDate > existDate) {
              toDelete.push(existing.id);
              seen.set(mapKey, doc);
            } else {
              toDelete.push(doc.id);
            }
          } else {
            seen.set(mapKey, doc);
          }
        }
      }

      // Deduplicare unică (un doc poate apărea de mai multe ori în toDelete)
      const uniqueDelete = [...new Set(toDelete)];
      for (const id of uniqueDelete) {
        await db.collection(colName).doc(id).delete();
        totalDeleted++;
      }
      if (uniqueDelete.length > 0) {
        report.push(`${colName}: ${uniqueDelete.length} duplicate șterse`);
      }
    }

    await deduplicateCollection('inscrieri', ['email', 'telefon']);
    await deduplicateCollection('copii',     ['email', 'telefon']);
    await deduplicateCollection('parinti',   ['email']);

    ok(res, {
      deleted: totalDeleted,
      report: report.length ? report : ['Nicio duplicată găsită — baza de date este curată ✅']
    });
  } catch (e) { console.error(e); err(res, 'Eroare server', 500); }
});

// ── MESAJE ───────────────────────────────────────────────────
app.post('/api/mesaje', async (req, res) => {
  try {
    const { from_name, telefon, email, subject, body } = req.body;
    if (!from_name) return err(res, 'Numele este obligatoriu');
    if (!telefon)   return err(res, 'Numărul de telefon este obligatoriu');
    await getDB().collection('mesaje').add({
      from_name: from_name || '', telefon: telefon || '',
      email: email || '', subject: subject || '',
      body: body || '', read: false, created: new Date()
    });
    ok(res, 'Trimis');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/mesaje', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('mesaje').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/mesaje/:id/read', auth, async (req, res) => {
  try {
    await getDB().collection('mesaje').doc(req.params.id).update({ read: true });
    ok(res, 'Marcat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/mesaje/:id', auth, async (req, res) => {
  try {
    await getDB().collection('mesaje').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── ECHIPA ───────────────────────────────────────────────────
app.get('/api/echipa', async (req, res) => {
  try {
    const snap = await getDB().collection('echipa').orderBy('created', 'asc').get();
    ok(res, snap.docs.map(docToObj).filter(m => m.status === 'activ'));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/echipa', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('echipa').orderBy('created', 'asc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/echipa', auth, async (req, res) => {
  try {
    const { name, role, emoji, bio, telefon, email, specializare, dataAngajare } = req.body;
    if (!name) return err(res, 'Numele obligatoriu');
    const ref = await getDB().collection('echipa').add({
      name, role: role || '', emoji: emoji || '👤',
      bio: bio || '', telefon: telefon || '', email: email || '',
      specializare: specializare || '', dataAngajare: dataAngajare || '',
      status: 'activ', created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/echipa/:id', auth, async (req, res) => {
  try {
    const { name, role, emoji, bio, telefon, email, specializare, dataAngajare, status } = req.body;
    await getDB().collection('echipa').doc(req.params.id).update({
      name, role, emoji, bio: bio||'',
      telefon: telefon||'', email: email||'',
      specializare: specializare||'', dataAngajare: dataAngajare||'',
      status: status || 'activ'
    });
    ok(res, 'Actualizat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/echipa/:id', auth, async (req, res) => {
  try {
    await getDB().collection('echipa').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── GALERIE ──────────────────────────────────────────────────
app.get('/api/galerie', async (req, res) => {
  try {
    const cat  = req.query.category;
    let query  = getDB().collection('galerie').orderBy('created', 'desc');
    if (cat && cat !== 'all') query = query.where('category', '==', cat);
    const snap = await query.get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/galerie', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || !req.files.length) return err(res, 'Niciun fisier');
    const category = req.body.category || 'general';
    const inserted = [];
    for (const f of req.files) {
      const url = '/uploads/' + f.filename;
      const ref = await getDB().collection('galerie').add({
        filename: f.filename, url, category, created: new Date()
      });
      inserted.push({ id: ref.id, url, filename: f.filename, category });
    }
    ok(res, inserted);
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/galerie/:id', auth, async (req, res) => {
  try {
    const doc = await getDB().collection('galerie').doc(req.params.id).get();
    if (doc.exists) {
      const fp = path.join(uploadsDir, doc.data().filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
      await getDB().collection('galerie').doc(req.params.id).delete();
    }
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── SETARI ───────────────────────────────────────────────────
app.get('/api/setari', async (req, res) => {
  try {
    const doc = await getDB().collection('setari').doc('config').get();
    ok(res, doc.exists ? doc.data() : {});
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/setari', auth, async (req, res) => {
  try {
    const doc = await getDB().collection('setari').doc('config').get();
    ok(res, doc.exists ? doc.data() : {});
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/setari', auth, async (req, res) => {
  try {
    await getDB().collection('setari').doc('config').set(req.body, { merge: true });
    ok(res, 'Salvat');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── STATS ────────────────────────────────────────────────────
app.get('/api/admin/stats', auth, async (req, res) => {
  try {
    const db = getDB();
    const [inscrieriSnap, cereriSnap, mesajeSnap, blogSnap, copiiSnap] = await Promise.all([
      db.collection('inscrieri').count().get(),
      db.collection('inscrieri').where('status', '==', 'nou').count().get(),
      db.collection('mesaje').where('read', '==', false).count().get(),
      db.collection('blog').where('status', '==', 'publicat').count().get(),
      db.collection('copii').where('status', '==', 'activ').count().get(),
    ]);
    ok(res, {
      inscrieri:    inscrieriSnap.data().count,
      cereri_noi:   cereriSnap.data().count,
      mesaje_noi:   mesajeSnap.data().count,
      blog_pub:     blogSnap.data().count,
      copii_activi: copiiSnap.data().count,
    });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── CHARTS ───────────────────────────────────────────────────
app.get('/api/admin/charts', auth, async (req, res) => {
  try {
    const db = getDB();
    const [copiiSnap, inscrieriSnap] = await Promise.all([
      db.collection('copii').get(),
      db.collection('inscrieri').orderBy('created', 'desc').get()
    ]);

    const copii     = copiiSnap.docs.map(docToObj);
    const inscrieri = inscrieriSnap.docs.map(docToObj);

    // Firestore Timestamp → JS Date
    const toDate = v => {
      if (!v) return null;
      if (v instanceof Date) return v;
      if (typeof v.toDate === 'function') return v.toDate();
      if (v._seconds) return new Date(v._seconds * 1000);
      return new Date(v);
    };

    // ── Distribuție grupe (copii activi) ──────────────────────
    const activi = copii.filter(c => c.status === 'activ');
    const GRUPE  = ['🐻 Ursuleți', '🦋 Fluturași', '⭐ Steluțe', '🚀 Exploratori'];
    const grupeMap = Object.fromEntries(GRUPE.map(g => [g, 0]));
    activi.forEach(c => { if (grupeMap[c.grupa] !== undefined) grupeMap[c.grupa]++; });
    const grupeActive = GRUPE.filter(g => grupeMap[g] > 0);

    // ── Distribuție programe (copii activi) ───────────────────
    const PROG = { 'Scurt (07:30–13:00)': 'Scurt', 'Lung (07:30–18:00)': 'Lung', 'Premium Plus': 'Premium' };
    const progMap = {};
    activi.forEach(c => {
      const p = PROG[c.program] || c.program || 'Nespecificat';
      progMap[p] = (progMap[p] || 0) + 1;
    });

    // ── Înscrieri pe ultimele 6 luni ──────────────────────────
    const now    = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('ro-RO', { month: 'short', year: '2-digit' }),
        count: 0
      };
    });
    inscrieri.forEach(ins => {
      const d = toDate(ins.created);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const m   = months.find(x => x.key === key);
      if (m) m.count++;
    });

    // ── Status copii (toți) ────────────────────────────────────
    const statusMap = { activi: 0, inactivi: 0 };
    copii.forEach(c => { statusMap[c.status === 'activ' ? 'activi' : 'inactivi']++; });

    ok(res, {
      grupe:           { labels: grupeActive, data: grupeActive.map(g => grupeMap[g]) },
      programe:        { labels: Object.keys(progMap), data: Object.values(progMap) },
      inscrieri_lunar: { labels: months.map(m => m.label), data: months.map(m => m.count) },
      status:          statusMap
    });
  } catch (e) { console.error(e); err(res, 'Eroare server', 500); }
});

// ── PARENT PORTAL ────────────────────────────────────────────

// Timestamp helper
const toDate = v => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v.toDate === 'function') return v.toDate();
  if (v._seconds) return new Date(v._seconds * 1000);
  return new Date(v);
};

// authParinte middleware
function authParinte(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, error: 'Neautorizat' });
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== 'parinte') return res.status(403).json({ ok: false, error: 'Acces interzis' });
    // normalize legacy single copilId → copiiIds array
    if (!decoded.copiiIds && decoded.copilId) decoded.copiiIds = [decoded.copilId];
    decoded.copiiIds = decoded.copiiIds || [];
    req.user = decoded;
    next();
  } catch { res.status(401).json({ ok: false, error: 'Token invalid' }); }
}

// ── ANUNTURI ─────────────────────────────────────────────────
app.get('/api/admin/anunturi', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('anunturi').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/anunturi', auth, async (req, res) => {
  try {
    const { titlu, text, tip } = req.body;
    if (!titlu) return err(res, 'Titlul este obligatoriu');
    const ref = await getDB().collection('anunturi').add({
      titlu, text: text || '', tip: tip || 'info', created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/anunturi/:id', auth, async (req, res) => {
  try {
    await getDB().collection('anunturi').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/parinti/anunturi', authParinte, async (req, res) => {
  try {
    const snap = await getDB().collection('anunturi').orderBy('created', 'desc').limit(20).get();
    ok(res, snap.docs.map(docToObj));
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── PARINTI AUTH ──────────────────────────────────────────────
app.post('/api/parinti/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return err(res, 'Email si parola obligatorii');
    const snap = await getDB().collection('parinti').where('email', '==', email).limit(1).get();
    if (snap.empty) return err(res, 'Email sau parola incorecta', 401);
    const doc  = snap.docs[0];
    const data = doc.data();
    if (!bcrypt.compareSync(password, data.password)) return err(res, 'Email sau parola incorecta', 401);
    const copiiIds = data.copiiIds || (data.copilId ? [data.copilId] : []);
    const token = jwt.sign(
      { id: doc.id, email: data.email, name: data.name, copiiIds, role: 'parinte' },
      SECRET, { expiresIn: '7d' }
    );
    ok(res, { token, name: data.name, copiiIds });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── PARINTI ENDPOINTS ─────────────────────────────────────────
app.get('/api/parinti/profil', authParinte, async (req, res) => {
  try {
    const db = getDB();
    const copiiIds = req.user.copiiIds;
    const requestedId = req.query.copilId;
    const activeCopilId = (requestedId && copiiIds.includes(requestedId)) ? requestedId : copiiIds[0];
    const [copilDoc, parinteDoc] = await Promise.all([
      activeCopilId ? db.collection('copii').doc(activeCopilId).get() : Promise.resolve({ exists: false }),
      db.collection('parinti').doc(req.user.id).get()
    ]);
    const copil      = copilDoc.exists   ? { id: copilDoc.id,   ...copilDoc.data()   } : null;
    const parinteRaw = parinteDoc.exists ? { id: parinteDoc.id, ...parinteDoc.data() } : null;
    if (parinteRaw) delete parinteRaw.password;
    // fetch names of all children for the selector
    let toateCopiii = [];
    if (copiiIds.length > 1) {
      const docs = await Promise.all(copiiIds.map(id => db.collection('copii').doc(id).get()));
      toateCopiii = docs.filter(d => d.exists).map(d => ({ id: d.id, numeCopil: d.data().numeCopil }));
    } else if (copil) {
      toateCopiii = [{ id: copil.id, numeCopil: copil.numeCopil }];
    }
    ok(res, { copil, parinte: parinteRaw, toateCopiii, activeCopilId });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/parinti/mesaje', authParinte, async (req, res) => {
  try {
    const db = getDB();
    const copiiIds = req.user.copiiIds;
    const requestedId = req.query.copilId;
    const activeCopilId = (requestedId && copiiIds.includes(requestedId)) ? requestedId : copiiIds[0];
    const snap = await db.collection('mesaje_parinti').where('copilId', '==', activeCopilId).get();
    const msgs = snap.docs.map(docToObj).sort((a, b) => {
      const da = toDate(a.created) || 0;
      const db2 = toDate(b.created) || 0;
      return da - db2;
    });
    // Mark admin messages as read
    const unread = snap.docs.filter(d => d.data().from === 'admin' && !d.data().read);
    if (unread.length) {
      const batch = db.batch();
      unread.forEach(d => batch.update(d.ref, { read: true }));
      await batch.commit();
    }
    ok(res, msgs);
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/parinti/mesaje', authParinte, async (req, res) => {
  try {
    const { text, copilId: reqCopilId } = req.body;
    if (!text || !text.trim()) return err(res, 'Mesajul nu poate fi gol');
    const copiiIds = req.user.copiiIds;
    const copilId = (reqCopilId && copiiIds.includes(reqCopilId)) ? reqCopilId : copiiIds[0];
    const ref = await getDB().collection('mesaje_parinti').add({
      copilId,
      from:    'parinte',
      text:    text.trim(),
      read:    false,
      created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── PARINTI: FORGOT PASSWORD ─────────────────────────────────
app.post('/api/parinti/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return err(res, 'Email obligatoriu');
    const snap = await getDB().collection('parinti').where('email', '==', email).limit(1).get();
    if (snap.empty) return err(res, 'Nu există niciun cont cu acest email');

    // Generează cod de 6 cifre + expiră în 15 min
    const code    = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await getDB().collection('parinti').doc(snap.docs[0].id).update({ resetCode: code, resetExpires: expires });

    // Trimite email cu codul
    await mailer.sendMail({
      from: `"Grădinița Wonki 🌟" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Resetare parolă – Wonki',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#FAFAFA;border-radius:16px">
          <h2 style="color:#918880;margin:0 0 8px">Grădinița <strong>Wonki</strong> 🌟</h2>
          <p style="color:#555;font-size:15px">Ai solicitat resetarea parolei pentru portalul părinților.</p>
          <div style="background:#fff;border-radius:12px;padding:24px;text-align:center;margin:24px 0;box-shadow:0 4px 16px rgba(0,0,0,.07)">
            <p style="margin:0 0 8px;color:#999;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Codul tău de verificare</p>
            <p style="margin:0;font-size:40px;font-weight:900;letter-spacing:8px;color:#1A1A18">${code}</p>
          </div>
          <p style="color:#999;font-size:13px">Codul este valabil <strong>15 minute</strong>. Dacă nu ai solicitat resetarea parolei, ignoră acest email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="color:#ccc;font-size:12px;margin:0">© ${new Date().getFullYear()} Grădinița Wonki · Chișinău</p>
        </div>
      `
    });

    ok(res, { message: 'Codul a fost trimis pe email.' });
  } catch (e) {
    console.error('Email error:', e);
    err(res, 'Eroare la trimiterea emailului', 500);
  }
});

app.post('/api/parinti/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return err(res, 'Toate câmpurile sunt obligatorii');
    if (newPassword.length < 6) return err(res, 'Parola trebuie să aibă cel puțin 6 caractere');
    const snap = await getDB().collection('parinti').where('email', '==', email).limit(1).get();
    if (snap.empty) return err(res, 'Email inexistent');
    const doc  = snap.docs[0];
    const data = doc.data();
    if (!data.resetCode || data.resetCode !== code) return err(res, 'Cod incorect');
    const expires = data.resetExpires?.toDate ? data.resetExpires.toDate() : new Date(data.resetExpires);
    if (new Date() > expires) return err(res, 'Codul a expirat. Solicită unul nou.');
    await getDB().collection('parinti').doc(doc.id).update({
      password: bcrypt.hashSync(newPassword, 10),
      resetCode: null, resetExpires: null
    });
    ok(res, { message: 'Parola a fost schimbată cu succes!' });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── PARINTI: SCHIMBA PAROLA (logat) ──────────────────────────
app.post('/api/parinti/change-password', authParinte, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return err(res, 'Câmpuri obligatorii');
    if (newPassword.length < 6) return err(res, 'Parola nouă trebuie să aibă cel puțin 6 caractere');
    const doc  = await getDB().collection('parinti').doc(req.user.id).get();
    if (!doc.exists) return err(res, 'Cont inexistent');
    if (!bcrypt.compareSync(currentPassword, doc.data().password)) return err(res, 'Parola curentă este incorectă');
    await getDB().collection('parinti').doc(req.user.id).update({ password: bcrypt.hashSync(newPassword, 10) });
    ok(res, { message: 'Parola a fost schimbată!' });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── ADMIN: CONTURI PARINTI ────────────────────────────────────
app.post('/api/admin/parinti', auth, async (req, res) => {
  try {
    const { email, password, copiiIds, name } = req.body;
    if (!email || !password || !copiiIds?.length || !name) return err(res, 'Toate câmpurile sunt obligatorii');
    const existing = await getDB().collection('parinti').where('email', '==', email).limit(1).get();
    if (!existing.empty) return err(res, 'Email deja înregistrat');
    const hashed = bcrypt.hashSync(password, 10);
    const ref = await getDB().collection('parinti').add({
      email, password: hashed, copiiIds, name, created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.get('/api/admin/parinti', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('parinti').orderBy('created', 'desc').get();
    ok(res, snap.docs.map(d => {
      const obj = docToObj(d);
      delete obj.password;
      if (!obj.copiiIds && obj.copilId) obj.copiiIds = [obj.copilId];
      obj.copiiIds = obj.copiiIds || [];
      return obj;
    }));
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.delete('/api/admin/parinti/:id', auth, async (req, res) => {
  try {
    await getDB().collection('parinti').doc(req.params.id).delete();
    ok(res, 'Sters');
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.put('/api/admin/parinti/:id/reset-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return err(res, 'Parola trebuie să aibă cel puțin 6 caractere');
    await getDB().collection('parinti').doc(req.params.id).update({
      password: bcrypt.hashSync(newPassword, 10),
      resetCode: null, resetExpires: null
    });
    ok(res, 'Parola a fost resetată');
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── ADMIN: MESAJE PARINTI ─────────────────────────────────────
app.get('/api/admin/mesaje-parinti', auth, async (req, res) => {
  try {
    const snap = await getDB().collection('mesaje_parinti').get();
    const msgs = snap.docs.map(docToObj).sort((a, b) => {
      const da = toDate(a.created) || 0;
      const db2 = toDate(b.created) || 0;
      return db2 - da;
    });
    ok(res, msgs);
  } catch (e) { err(res, 'Eroare server', 500); }
});

app.post('/api/admin/mesaje-parinti/:copilId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return err(res, 'Mesajul nu poate fi gol');
    const ref = await getDB().collection('mesaje_parinti').add({
      copilId: req.params.copilId,
      from:    'admin',
      text:    text.trim(),
      read:    false,
      created: new Date()
    });
    ok(res, { id: ref.id });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── ADMIN: STERGE CONVERSATIE PARINTE ────────────────────────
app.delete('/api/admin/mesaje-parinti/:copilId', auth, async (req, res) => {
  try {
    const db   = getDB();
    const snap = await db.collection('mesaje_parinti')
      .where('copilId', '==', req.params.copilId).get();
    if (snap.empty) return ok(res, { deleted: 0 });
    const batch = db.batch();
    snap.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    ok(res, { deleted: snap.size });
  } catch (e) { err(res, 'Eroare server', 500); }
});

// ── RUTE CURATE (fara .html) ─────────────────────────────────
const rootDir  = path.join(__dirname, '..');
const pagesDir = path.join(__dirname, '..', 'pages');

// PWA files — servite cu headers corecte
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(rootDir, 'sw.js'));
});
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.join(rootDir, 'manifest.json'));
});
app.get('/offline.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'offline.html'));
});

app.get('/',                  (req, res) => res.sendFile(path.join(rootDir,  'index.html')));
app.get('/acasa',             (req, res) => res.sendFile(path.join(rootDir,  'index.html')));
app.get('/despre',            (req, res) => res.sendFile(path.join(pagesDir, 'despre.html')));
app.get('/program',           (req, res) => res.sendFile(path.join(pagesDir, 'program.html')));
app.get('/tarife',            (req, res) => res.sendFile(path.join(pagesDir, 'tarife.html')));
app.get('/blog',              (req, res) => res.sendFile(path.join(pagesDir, 'blog.html')));
app.get('/galerie',           (req, res) => res.sendFile(path.join(pagesDir, 'galerie.html')));
app.get('/contact',           (req, res) => res.sendFile(path.join(pagesDir, 'contact.html')));
app.get('/confidentialitate', (req, res) => res.sendFile(path.join(pagesDir, 'confidentialitate.html')));
app.get('/admin',             (req, res) => res.sendFile(path.join(rootDir,  'admin', 'admin.html')));
app.get('/admin/login',       (req, res) => res.sendFile(path.join(rootDir,  'admin', 'login.html')));
app.get('/parinti',           (req, res) => res.sendFile(path.join(pagesDir, 'parinti', 'portal.html')));
app.get('/parinti/login',     (req, res) => res.sendFile(path.join(pagesDir, 'parinti', 'login.html')));

// ── SPA fallback ─────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));

// ── START ────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log(' ==========================================');
    console.log('  Wonki Server pornit!');
    console.log('  Site:  http://localhost:' + PORT);
    console.log('  Admin: http://localhost:' + PORT + '/admin/login.html');
    console.log('  DB:    Firestore (cloud)');
    console.log(' ==========================================');
    console.log('');
  });
}).catch(e => { console.error('Eroare initializare:', e); process.exit(1); });

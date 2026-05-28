// ============================================================
//  WONKI – Server Express + Firestore
//  Pornire: cd server && npm run dev
// ============================================================
require('dotenv').config();
const express   = require('express');
const path      = require('path');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const multer    = require('multer');
const cors      = require('cors');
const fs        = require('fs');
const rateLimit = require('express-rate-limit');
const { initDB, getDB, docToObj } = require('./firebase');

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

// ── MESAJE ───────────────────────────────────────────────────
app.post('/api/mesaje', async (req, res) => {
  try {
    const { from_name, email, subject, body } = req.body;
    await getDB().collection('mesaje').add({
      from_name: from_name || '', email: email || '',
      subject: subject || '', body: body || '',
      read: false, created: new Date()
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

// ── RUTE CURATE (fara .html) ─────────────────────────────────
const rootDir  = path.join(__dirname, '..');
const pagesDir = path.join(__dirname, '..', 'pages');

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

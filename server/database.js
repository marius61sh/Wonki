// ============================================================
//  WONKI – Database (sql.js — fara compilare nativa!)
// ============================================================
const initSqlJs = require('sql.js');
const path      = require('path');
const fs        = require('fs');
const bcrypt    = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'wonki.db');
let db;

async function initDB() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  function save() {
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
  }

  // Helpers
  db.query = function(sql, params) {
    const stmt = this.prepare(sql);
    const rows = [];
    if (params) stmt.bind(params);
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  };
  db.queryOne = function(sql, params) { return this.query(sql, params)[0] || null; };
  db.exec1    = function(sql, params) {
    this.run(sql, params || []);
    save();
    return this.queryOne('SELECT last_insert_rowid() as id').id;
  };
  db.save = save;

  // Schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
      name TEXT DEFAULT 'Admin', created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL, content TEXT, category TEXT DEFAULT 'Noutati',
      status TEXT DEFAULT 'publicat', image TEXT, views INTEGER DEFAULT 0,
      created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS testimoniale (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, role TEXT, text TEXT, stars INTEGER DEFAULT 5,
      status TEXT DEFAULT 'activ', created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inscrieri (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numeParinte TEXT, telefon TEXT, email TEXT, varsta TEXT,
      program TEXT, sursa TEXT, mesaj TEXT, status TEXT DEFAULT 'nou',
      created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS mesaje (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_name TEXT, email TEXT, subject TEXT, body TEXT,
      read INTEGER DEFAULT 0, created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS echipa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, role TEXT, emoji TEXT DEFAULT '?', bio TEXT,
      status TEXT DEFAULT 'activ', created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS galerie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL, url TEXT NOT NULL, category TEXT DEFAULT 'general',
      created TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS setari (key TEXT PRIMARY KEY, value TEXT);
  `);
  save();

  // Seed admin
  if (!db.queryOne('SELECT id FROM users WHERE email=?', ['admin@wonki.ro'])) {
    db.exec1('INSERT INTO users(email,password,name) VALUES(?,?,?)',
      ['admin@wonki.ro', bcrypt.hashSync('wonki2025',10), 'Ana Marinescu']);
    console.log('Admin creat: admin@wonki.ro / wonki2025');
  }

  // Seed demo
  if (db.queryOne('SELECT COUNT(*) as c FROM blog').c == 0) {
    db.exec1('INSERT INTO blog(title,content,category,status,views) VALUES(?,?,?,?,?)',
      ['Cum pregatim copilul pentru prima zi la gradinita','<p>Prima zi la gradinita este un moment emotionant. Cateva sfaturi practice va pot ajuta.</p>','Sfaturi','publicat',342]);
    db.exec1('INSERT INTO blog(title,content,category,status,views) VALUES(?,?,?,?,?)',
      ['Activitatile STEAM de ce conteaza de la 3 ani','<p>STEAM inseamna Stiinta, Tehnologie, Inginerie, Arta si Matematica. La Wonki, transformam fiecare activitate intr-o aventura.</p>','Educatie','publicat',218]);
    db.exec1('INSERT INTO blog(title,content,category,status,views) VALUES(?,?,?,?,?)',
      ['Serbarea de primavara 2025','<p>Ce zi minunata am petrecut impreuna! Copiii au pregatit momente artistice incredibile.</p>','Evenimente','publicat',189]);
  }
  if (db.queryOne('SELECT COUNT(*) as c FROM testimoniale').c == 0) {
    db.exec1('INSERT INTO testimoniale(name,role,text,stars,status) VALUES(?,?,?,?,?)',['Maria Ionescu','Mama Andreei, 4 ani','Andreea nu mai voia sa plece acasa dupa prima saptamana!',5,'activ']);
    db.exec1('INSERT INTO testimoniale(name,role,text,stars,status) VALUES(?,?,?,?,?)',['Alexandru Popa','Tatal lui Radu, 5 ani','A invatat sa colaboreze si sa iubeasca cartile.',5,'activ']);
    db.exec1('INSERT INTO testimoniale(name,role,text,stars,status) VALUES(?,?,?,?,?)',['Elena Dumitrescu','Mama Miei, 3 ani','Mancarea delicioasa, spatii curate, comunicare perfecta!',5,'activ']);
  }
  if (db.queryOne('SELECT COUNT(*) as c FROM echipa').c == 0) {
    db.exec1('INSERT INTO echipa(name,role,emoji,bio) VALUES(?,?,?,?)',['Ana Marinescu','Fondatoare & Director','A','Psiholog educational cu 15 ani experienta.']);
    db.exec1('INSERT INTO echipa(name,role,emoji,bio) VALUES(?,?,?,?)',['Ioana Petre','Educatoare Senior','B','Specialist Montessori certificat.']);
    db.exec1('INSERT INTO echipa(name,role,emoji,bio) VALUES(?,?,?,?)',['Mihai Stoica','Coordonator STEAM','C','Transforma stiinta in joaca fascinanta.']);
    db.exec1('INSERT INTO echipa(name,role,emoji,bio) VALUES(?,?,?,?)',['Elena Vasile','Nutritionist & Bucatar','D','Meniuri delicioase si sanatoase.']);
  }

  console.log('Baza de date initialiazata!');
  return db;
}

module.exports = { initDB, getDB: () => db };

# 🌟 Grădinița Wonki — Ghid de utilizare

## ▶️ Pornire rapidă (Windows)

**Dublu-click pe `START.bat`** — gata!

Se deschide automat browserul la panoul de admin.

---

## 🔐 Date de login

| Câmp   | Valoare          |
|--------|------------------|
| Email  | admin@wonki.ro   |
| Parolă | wonki2025        |

> ⚠️ **Schimbă parola** din Admin → Setări după prima autentificare!

---

## 🌐 Adrese

| Pagină        | URL                                          |
|---------------|----------------------------------------------|
| Site public   | http://localhost:3000                        |
| Admin         | http://localhost:3000/admin/login.html       |
| API           | http://localhost:3000/api/...                |

---

## 📁 Structura proiectului

```
wonki/
├── START.bat           ← Pornire cu dublu-click
├── index.html          ← Homepage
├── pages/
│   ├── despre.html
│   ├── program.html
│   ├── galerie.html
│   └── contact.html
├── admin/
│   ├── login.html      ← Pagina de login
│   └── admin.html      ← Panou admin complet
├── css/                ← Stiluri
├── js/                 ← JavaScript site
└── server/             ← Serverul Node.js
    ├── server.js       ← Serverul principal
    ├── database.js     ← Baza de date SQLite
    ├── package.json
    ├── wonki.db        ← Baza de date (creat automat)
    └── uploads/        ← Pozele uploadate (creat automat)
```

---

## 🛠️ Pornire manuală (alternativă)

```bash
cd server
npm install       # doar prima dată
npm start
```

---

## ⚙️ Ce poate face panoul Admin

| Secțiune     | Funcții                                      |
|--------------|----------------------------------------------|
| Dashboard    | Statistici live, grafic activitate           |
| Înscrieri    | Confirmă / șterge cereri de la părinți       |
| Mesaje       | Citește mesajele din formularul de contact   |
| Blog         | Adaugă, editează, șterge articole            |
| Galerie      | Upload poze (drag & drop sau click)          |
| Testimoniale | Activează / dezactivează recenzii            |
| Echipă       | Gestionează membrii echipei                  |
| Setări       | Info grădiniță, schimbă parola               |

---

## 📤 Formular contact (site public)

Când un vizitator completează formularul din `/pages/contact.html`,
cererea apare **automat** în Admin → Înscrieri și Admin → Mesaje.

---

## 💾 Baza de date

Toate datele sunt salvate în **`server/wonki.db`** (SQLite).
Fișierul este creat automat la prima pornire.

**Backup**: copiază fișierul `wonki.db` într-un loc sigur periodic.

---

## 🚀 Publicare online (opțional)

Când vrei să pui site-ul pe internet, poți folosi:
- **Railway.app** — gratuit, simplu, suportă Node.js
- **Render.com** — gratuit
- **VPS** (DigitalOcean, Hetzner) — mai mult control

---

*Creat cu ❤️ pentru Grădinița Wonki*
"# Wonki" 

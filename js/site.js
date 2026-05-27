/* ============================================================
   WONKI – Site public conectat la API (site.js)
   Încarcă dinamic: testimoniale, galerie, echipă, blog, setări
   ============================================================ */

const API = '/api';

async function apiFetch(path) {
  try {
    const r = await fetch(API + path);
    const d = await r.json();
    return d.ok ? d.data : null;
  } catch {
    return null; // server oprit → rămâne conținutul static
  }
}

/* ─── TESTIMONIALE (index.html) ─── */
async function loadTestimoniale() {
  const el = document.querySelector('.t-track');
  if (!el) return;
  const list = await apiFetch('/testimoniale');
  if (!list || !list.length) return;

  const colors = ['rgba(255,107,107,.15)', 'rgba(77,150,255,.15)', 'rgba(107,203,119,.15)', 'rgba(255,179,71,.15)', 'rgba(199,125,255,.15)'];
  const avatars = ['👩', '👨', '👩', '👩', '👨'];

  // Dublăm lista pentru animația marquee seamless
  const doubled = [...list, ...list];
  el.innerHTML = doubled.map((t, i) => `
    <div class="tcard">
      <div class="stars">${'★'.repeat(t.stars || 5)}</div>
      <p>${t.text || ''}</p>
      <div class="t-author">
        <div class="t-avatar" style="background:${colors[i % colors.length]}">${avatars[i % avatars.length]}</div>
        <div>
          <div class="t-name">${t.name}</div>
          <div class="t-role">${t.role || ''}</div>
        </div>
      </div>
    </div>`).join('');
}

/* ─── GALERIE PREVIEW (index.html) ─── */
async function loadGaleriePreview() {
  const el = document.querySelector('.gal-grid');
  if (!el) return;
  const list = await apiFetch('/galerie');
  if (!list || !list.length) return;

  // Primele 6 imagini
  el.innerHTML = list.slice(0, 6).map(img => `
    <div class="g-item reveal" style="background-image:url('${img.url}');background-size:cover;background-position:center;overflow:hidden">
    </div>`).join('');
}

/* ─── GALERIE COMPLETĂ (pages/galerie.html) ─── */
async function loadGalerieCompleta() {
  const grid = document.querySelector('.masonry-grid');
  if (!grid) return;
  const list = await apiFetch('/galerie');
  if (!list || !list.length) return;

  grid.innerHTML = list.map(img => `
    <div class="masonry-item reveal" data-cat="${img.category}" style="min-height:200px">
      <img src="${img.url}" alt="${img.name || img.category}"
           style="width:100%;height:100%;object-fit:cover;border-radius:20px;display:block">
      <div class="overlay"><span>${img.category}</span></div>
    </div>`).join('');

  // Reinit reveal + filter
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) e.target.classList.add('vis');
    }, { threshold: 0.1 }).observe(el);
  });

  // Reinit filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;
      document.querySelectorAll('.masonry-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ─── ECHIPA (pages/despre.html) ─── */
async function loadEchipa() {
  const grid = document.querySelector('.team-grid');
  if (!grid) return;
  const list = await apiFetch('/echipa');
  if (!list || !list.length) return;

  const bgColors = [
    'rgba(255,107,107,.12)', 'rgba(77,150,255,.12)',
    'rgba(107,203,119,.12)', 'rgba(199,125,255,.12)',
    'rgba(255,179,71,.12)',  'rgba(255,211,61,.12)',
  ];

  grid.innerHTML = list.map((m, i) => `
    <div class="team-card reveal">
      <div class="team-avatar" style="background:${bgColors[i % bgColors.length]}">${m.emoji || '🧑‍🏫'}</div>
      <h4>${m.name}</h4>
      <div class="role">${m.role || ''}</div>
      <p>${m.bio || ''}</p>
    </div>`).join('');

  document.querySelectorAll('.team-card.reveal').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) e.target.classList.add('vis');
    }, { threshold: 0.1 }).observe(el);
  });
}

/* ─── BLOG (pages/ sau secțiune pe index) ─── */
async function loadBlogSection() {
  const el = document.getElementById('blog-grid');
  if (!el) return;
  const list = await apiFetch('/blog');
  if (!list || !list.length) return;

  el.innerHTML = list.slice(0, 3).map(p => `
    <div class="blog-card reveal">
      <div class="blog-img" style="background:linear-gradient(135deg,var(--coral),var(--lavender));display:flex;align-items:center;justify-content:center;font-size:3rem">
        ${p.category === 'Sfaturi' ? '💡' : p.category === 'Educație' ? '📚' : p.category === 'Evenimente' ? '🎉' : '✍️'}
      </div>
      <div class="blog-body">
        <span class="blog-cat">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${stripHtml(p.content || '').substring(0, 100)}...</p>
        <div class="blog-meta">
          <span>${formatDate(p.created)}</span>
          <span>${p.views || 0} vizualizări</span>
        </div>
      </div>
    </div>`).join('');

  document.querySelectorAll('.blog-card.reveal').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) e.target.classList.add('vis');
    }, { threshold: 0.1 }).observe(el);
  });
}

/* ─── SETĂRI SITE (footer, contact page) ─── */
async function loadSetari() {
  const setari = await apiFetch('/setari');
  if (!setari) return;

  // Actualizează footer-ul cu date din setări
  const email   = setari['set-email'];
  const tel     = setari['set-tel'];
  const adresa  = setari['set-adresa'];
  const program = setari['set-program'];
  const nume    = setari['set-name'];
  const slogan  = setari['set-slogan'];

  // Footer contact links
  document.querySelectorAll('[data-set="email"]').forEach(el => { if(email) el.textContent = '✉️ ' + email; });
  document.querySelectorAll('[data-set="tel"]').forEach(el => { if(tel) el.textContent = '📞 ' + tel; });
  document.querySelectorAll('[data-set="adresa"]').forEach(el => { if(adresa) el.textContent = '📍 ' + adresa; });
  document.querySelectorAll('[data-set="program"]').forEach(el => { if(program) el.textContent = '🕐 ' + program; });
  document.querySelectorAll('[data-set="slogan"]').forEach(el => { if(slogan) el.textContent = slogan; });
}

/* ─── UTILS ─── */
function stripHtml(html) {
  const t = document.createElement('div');
  t.innerHTML = html;
  return t.textContent || '';
}
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ─── INIT — detectează ce pagină suntem și încarcă ce trebuie ─── */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Pe orice pagină — setări (footer)
  loadSetari();

  // index.html
  if (path.endsWith('index.html') || path === '/' || path.endsWith(':3000/')) {
    loadTestimoniale();
    loadGaleriePreview();
    loadBlogSection();
  }

  // pages/galerie.html
  if (path.includes('galerie')) {
    loadGalerieCompleta();
  }

  // pages/despre.html
  if (path.includes('despre')) {
    loadEchipa();
  }
});

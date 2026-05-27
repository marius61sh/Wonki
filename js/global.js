/* ============================================================
   WONKI – Global JavaScript (global.js)
   ============================================================ */

/* ─── DARK MODE — aplica tema inainte de render ─── */
(function () {
  const saved  = localStorage.getItem('wonki-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || system);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ─── DARK MODE TOGGLE ─── */
  const toggle = document.getElementById('theme-toggle');

  // Salveaza fill-urile originale ale valurilor SVG la prima incarcare
  document.querySelectorAll('.wave path').forEach(path => {
    path.dataset.lightFill = path.getAttribute('fill');
  });

  function updateWaves(theme) {
    document.querySelectorAll('.wave path').forEach(path => {
      path.setAttribute('fill', theme === 'dark' ? '#0f0f1a' : (path.dataset.lightFill || '#ffffff'));
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wonki-theme', theme);
    updateWaves(theme);
    if (toggle) {
      toggle.textContent  = theme === 'dark' ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Mod luminos' : 'Mod întunecat');
    }
  }

  // Seteaza iconita corecta si aplica valurile la incarcare
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateWaves(currentTheme);
  if (toggle) {
    toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ─── CUSTOM CURSOR ─── */
  const cur  = document.getElementById('cur');
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();

  function cursorBig() { cur.classList.add('big'); }
  function cursorNorm(){ cur.classList.remove('big'); }

  document.querySelectorAll('a, button, .feature-card, .g-item, .info-row, .tl-card, .team-card, .pkg-card, .faq-question, .masonry-item, .tab-btn, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', cursorBig);
    el.addEventListener('mouseleave', cursorNorm);
  });

  /* ─── CANVAS PARTICLES ─── */
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const COLORS = ['#FF6B6B','#FFD93D','#4D96FF','#6BCB77','#C77DFF','#FFB347'];
    let W, H;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(rand) {
        this.x = rand ? Math.random() * W : -20;
        this.y = rand ? Math.random() * H : Math.random() * H;
        this.r = Math.random() * 5 + 2;
        this.vx = Math.random() * .7 + .2;
        this.vy = (Math.random() - .5) * .5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * .5 + .2;
        this.type  = Math.floor(Math.random() * 3);
        this.rot   = Math.random() * Math.PI * 2;
        this.rotV  = (Math.random() - .5) * .04;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        if (this.type === 0) {
          ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
        } else if (this.type === 1) {
          drawStar(ctx, this.r * 2, this.r, 5);
        } else {
          drawHeart(ctx, this.r);
        }
        ctx.restore();
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.rot += this.rotV;
        if (this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset(false);
      }
    }

    function drawStar(c, or, ir, pts) {
      c.beginPath();
      let a = -Math.PI / 2;
      for (let i = 0; i < pts * 2; i++) {
        const r = i % 2 === 0 ? or : ir;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        a += Math.PI / pts;
      }
      c.closePath(); c.fill();
    }

    function drawHeart(c, s) {
      c.beginPath();
      c.moveTo(0, s * .4);
      c.bezierCurveTo(0, 0, -s * 1.2, -s * .6, -s, -s);
      c.bezierCurveTo(-s * .8, -s * 1.4, 0, -s * 1.1, 0, -s * .6);
      c.bezierCurveTo(0, -s * 1.1, s * .8, -s * 1.4, s, -s);
      c.bezierCurveTo(s * 1.2, -s * .6, 0, 0, 0, s * .4);
      c.closePath(); c.fill();
    }

    const particles = [];
    for (let i = 0; i < 90; i++) particles.push(new Particle());

    (function animP() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animP);
    })();
  }

  /* ─── NAV SCROLL ─── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ─── ACTIVE NAV LINK ─── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ─── HAMBURGER MENU ─── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 90);
      }
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s, .tl-item, .ftl-item').forEach(el => {
    // Skip elementele din sectiunile cu scroll jacking – JS-ul lor le anima
    if (!el.closest('.sj-section')) revealObs.observe(el);
  });

  /* ─── COUNTER ANIMATION ─── */
  function animCount(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1800, step = 16;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + target / (dur / step), target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur >= target) { el.textContent = target + suffix; clearInterval(t); }
    }, step);
  }

  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animCount(e.target); cntObs.unobserve(e.target); }
    });
  }, { threshold: .5 });

  document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

  /* ─── RIPPLE ─── */
  document.querySelectorAll('.btn, .submit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const sz   = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - rect.left - sz/2}px;top:${e.clientY - rect.top - sz/2}px;position:absolute;`;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });

  /* ─── TOAST ─── */
  window.showToast = function(msg = '✅ Mesaj trimis! Te contactăm în curând 💛') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  };

  /* ─── 3D TILT ─── */
  document.querySelectorAll('.feature-card, .value-item, .team-card, .group-card').forEach(card => {
    // In sectiunile cu scroll jacking, transform-ul e controlat de JS-ul de animatie.
    // Aplicam doar efectele CSS (box-shadow, border-color) fara sa atingem transform.
    const isSJ = !!card.closest('.sj-section');

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      if (!isSJ) {
        card.style.transform = `translateY(-10px) scale(1.02) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
      }
      card.style.transition = 'box-shadow .3s, border-color .3s';
    });
    card.addEventListener('mouseleave', () => {
      if (!isSJ) {
        card.style.transform  = '';
        card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .4s, border-color .3s';
      } else {
        card.style.transition = 'box-shadow .4s, border-color .3s';
      }
    });
  });

  /* ─── PARALLAX FLOATIES (mouse) ─── */
  const floaties = document.querySelectorAll('.floaty');
  if (floaties.length) {
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      floaties.forEach((f, i) => {
        const d = (i + 1) * 6;
        f.style.transform = `translate(${dx * d}px, ${dy * d}px) rotate(${dx * 5}deg)`;
      });
    });
  }

  /* ─── PARALLAX SCROLL ─── */
  (function () {
    // Dezactiveaza pe touch / mobile (performanta)
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const pItems = [];
    const VH = window.innerHeight;
    // Daca hero-pin exista, scroll jacking-ul controleaza hero-ul → skip parallax pe el
    const hasScrollJack = !!document.querySelector('.hero-pin');

    function buildItem(el, speed) {
      el.style.willChange = 'transform';
      // Punct de referinta: scrollY la care elementul e centrat in viewport
      const elTop = el.getBoundingClientRect().top + window.pageYOffset;
      const baseScrollY = Math.max(0, elTop + el.offsetHeight / 2 - VH / 2);
      pItems.push({ el, speed, baseScrollY });
    }

    if (!hasScrollJack) {
      // Strat 1 – continut hero (se misca mai incet → efect de profunzime)
      document.querySelectorAll('.hero-content, .page-hero-content').forEach(el => buildItem(el, 0.18));

      // Strat 2 – fundalul decorativ hero (si mai incet → pare mai adanc)
      document.querySelectorAll('.page-hero-bg').forEach(el => buildItem(el, 0.38));
    }
    // Cand scroll jacking e activ (index.html), hero-content si page-hero-bg
    // sunt animate de scriptul de scroll jacking → nu le adaugam si la parallax

    // Strat 3 – elemente custom cu data-parallax="<viteza>"
    document.querySelectorAll('[data-parallax]').forEach(el => {
      buildItem(el, parseFloat(el.dataset.parallax) || 0.2);
    });

    if (!pItems.length) return;

    let pRaf = null;
    function tickParallax() {
      const sy = window.pageYOffset;
      pItems.forEach(({ el, speed, baseScrollY }) => {
        // Skip daca elementul e departe de viewport
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -300 || rect.top > VH + 300) return;
        const offset = (sy - baseScrollY) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
      pRaf = null;
    }

    window.addEventListener('scroll', () => {
      if (!pRaf) pRaf = requestAnimationFrame(tickParallax);
    }, { passive: true });

    tickParallax(); // pozitie initiala
  })();

  /* ─── TYPEWRITER HERO ─── */
  const twWord = document.getElementById('tw-word');
  if (twWord) {
    const twText   = twWord.querySelector('.tw-text');
    const twCursor = twWord.querySelector('.tw-cursor');

    const WORDS  = ['supraputere', 'magie', 'bucurie', 'aventură', 'creație'];
    const SPEED_TYPE   = 85;   // ms per caracter la scriere
    const SPEED_DELETE = 48;   // ms per caracter la stergere
    const PAUSE_AFTER  = 2000; // ms pauza dupa ce cuvantul e scris complet
    const PAUSE_BEFORE = 320;  // ms pauza inainte sa inceapa urmatorul cuvant

    // Rezerva spatiu fix = latimea celui mai lung cuvant → previne layout shift
    const longestWord = WORDS.reduce((a, b) => a.length >= b.length ? a : b);
    twText.textContent = longestWord;
    twWord.style.display    = 'inline-block';
    twWord.style.minWidth   = twWord.offsetWidth + 'px';
    twWord.style.textAlign  = 'center';

    let wi = 0, ci = 0, deleting = false;

    // Primul cuvant apare deja scris (odata cu pop-in animatia)
    twText.textContent = WORDS[0];
    ci = WORDS[0].length;

    function typeStep() {
      const word = WORDS[wi];

      if (!deleting) {
        ci++;
        twText.textContent = word.slice(0, ci);
        if (ci >= word.length) {
          deleting = true;
          setTimeout(typeStep, PAUSE_AFTER);
        } else {
          setTimeout(typeStep, SPEED_TYPE);
        }
      } else {
        ci--;
        twText.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % WORDS.length;
          setTimeout(typeStep, PAUSE_BEFORE);
        } else {
          setTimeout(typeStep, SPEED_DELETE);
        }
      }
    }

    // Porneste ciclul dupa ce animatia initiala e gata (0.65s delay + 0.6s durata + buffer)
    setTimeout(() => {
      deleting = true;
      typeStep();
    }, 2400);
  }

});

/* ─── TAWK.TO LIVE CHAT — incarca doar cu consimtamant ─── */
function loadTawk() {
  if (document.getElementById('tawk-script')) return;
  var s1 = document.createElement('script');
  s1.id  = 'tawk-script';
  s1.async = true;
  s1.src = 'https://embed.tawk.to/6a16bdce36ad8d1c38c41b37/1jpkdarp9';
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  document.head.appendChild(s1);
}

/* ─── COOKIE CONSENT ─── */
(function () {
  var CONSENT_KEY = 'wonki-cookie-consent';

  function getConsent() { return localStorage.getItem(CONSENT_KEY); }

  function setConsent(val) {
    localStorage.setItem(CONSENT_KEY, val);
    if (val === 'accept') loadTawk();
    hideBanner();
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) { b.style.transform = 'translateY(120%)'; setTimeout(function(){ b.remove(); }, 400); }
  }

  // Deja a ales → aplica direct
  var existing = getConsent();
  if (existing === 'accept') { document.addEventListener('DOMContentLoaded', loadTawk); return; }
  if (existing === 'decline') return;

  // Prima vizita → afiseaza bannerul
  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="ck-inner">
        <div class="ck-left">
          <div class="ck-title">🍪 Folosim cookie-uri</div>
          <p class="ck-text">Folosim cookie-uri pentru a îmbunătăți experiența ta și pentru funcționalități precum chat-ul live. Poți accepta sau refuza cookie-urile non-esențiale.</p>
          <a class="ck-link" href="pages/confidentialitate.html">Politica de confidențialitate →</a>
        </div>
        <div class="ck-btns">
          <button class="ck-btn ck-accept" id="ck-accept">✓ Accept toate</button>
          <button class="ck-btn ck-decline" id="ck-decline">Doar esențiale</button>
        </div>
      </div>`;
    document.body.appendChild(banner);

    // Animatie intrare
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        banner.style.transform = 'translateY(0)';
      });
    });

    document.getElementById('ck-accept').addEventListener('click', function(){ setConsent('accept'); });
    document.getElementById('ck-decline').addEventListener('click', function(){ setConsent('decline'); });
  });
})();

/* ============================================================
   WONKI – Pages JavaScript (pages.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PROGRAM PAGE: TABS ─── */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tc = document.getElementById(target);
      if (tc) tc.classList.add('active');
    });
  });

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── GALLERY FILTERS ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mItems     = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      mItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          item.style.transform = 'scale(.9)';
          setTimeout(() => {
            item.style.transition = 'opacity .4s, transform .4s';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.transition = 'opacity .3s';
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ─── LIGHTBOX ─── */
  const lightbox  = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg     = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');
    const lbClose   = document.getElementById('lb-close');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');
    let currentIdx  = 0;

    // Returneaza doar itemii vizibili (nu filtrati)
    function visibleItems() {
      return [...document.querySelectorAll('.masonry-item')].filter(el => el.style.display !== 'none');
    }

    function showItem(idx) {
      const items = visibleItems();
      if (!items.length) return;
      currentIdx = (idx + items.length) % items.length;
      const item = items[currentIdx];

      // Background din computed style
      const cs = window.getComputedStyle(item);
      lbImg.style.backgroundImage = cs.backgroundImage;
      lbImg.style.backgroundColor = cs.backgroundColor;

      // Emoji din primul text node
      lbImg.textContent = item.childNodes[0]?.textContent?.trim() || '🖼️';

      // Titlu din overlay
      lbCaption.textContent = item.querySelector('.overlay span')?.textContent || '';
      lbCounter.textContent = `${currentIdx + 1} / ${items.length}`;
    }

    function openLightbox(idx) {
      showItem(idx);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Click pe item din galerie
    document.querySelectorAll('.masonry-item').forEach(item => {
      item.addEventListener('click', () => {
        const visible = visibleItems();
        const idx = visible.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click',  () => showItem(currentIdx - 1));
    lbNext.addEventListener('click',  () => showItem(currentIdx + 1));

    // Click pe fundal → inchide
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Swipe touch (mobile)
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? showItem(currentIdx + 1) : showItem(currentIdx - 1);
    });

    // Tastatura
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showItem(currentIdx - 1);
      if (e.key === 'ArrowRight') showItem(currentIdx + 1);
    });
  }

  /* ─── CONTACT FORM ─── */
  // Handler-ul real (cu API call) se afla direct in contact.html
  // Nu mai adaugam un handler duplicat aici.

});

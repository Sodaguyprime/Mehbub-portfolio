/* ============================================================
   PROTOFILO — gallery.js
   Pinterest-style masonry gallery + filters + lightbox.
   Depends on scripts/data.js (window.PORTFOLIO_CATEGORIES / ITEMS).
   ============================================================ */
(function () {
  const grid     = document.getElementById('galleryGrid');
  const filters  = document.getElementById('galleryFilters');
  const CATS     = window.PORTFOLIO_CATEGORIES || [];
  const ITEMS    = window.PORTFOLIO_ITEMS || [];
  if (!grid) return;

  /* ── FILTER TABS ── */
  const tabs = [{ key: 'all', label: 'All Work' }, ...CATS];
  filters.innerHTML = tabs
    .map((t, i) =>
      `<li data-filter="${t.key}" class="${i === 0 ? 'active' : ''}">${t.label}</li>`)
    .join('');

  filters.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    filters.querySelectorAll('li').forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    render(li.dataset.filter);
  });

  /* ── RENDER MASONRY ── */
  function render(filter = 'all') {
    const items = filter === 'all'
      ? ITEMS
      : ITEMS.filter(it => it.category === filter);

    if (!items.length) {
      grid.innerHTML = '<p class="g-empty">No work in this category yet.</p>';
      return;
    }

    grid.innerHTML = items.map((it, i) => `
      <button class="g-item" type="button"
              style="animation-delay:${Math.min(i * 0.03, 0.6)}s"
              data-src="${it.src}" data-label="${it.label}"
              aria-label="${it.label}">
        <img src="${it.src}" alt="${it.label}" loading="lazy" decoding="async">
        <div class="g-item-overlay"><span>${it.label}</span></div>
      </button>`).join('');
  }

  grid.addEventListener('click', e => {
    const item = e.target.closest('.g-item');
    if (item) openLightbox(item.dataset.src, item.dataset.label);
  });

  /* ── LIGHTBOX ── */
  const box = document.getElementById('pf-lightbox');
  const lbImg = box ? box.querySelector('img') : null;
  const lbCap = box ? box.querySelector('.lb-caption') : null;

  function openLightbox(src, caption) {
    if (!box) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCap) lbCap.textContent = caption || '';
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!box) return;
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

  if (box) {
    box.addEventListener('click', e => {
      if (e.target === box || e.target.classList.contains('lb-close')) closeLightbox();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── INIT ── */
  render('all');
})();

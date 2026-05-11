/* ============================================================
   PROTOFILO — main.js
   ============================================================ */

/* ── DOT GRIDS ── */
function makeDots(el, count) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    el.appendChild(s);
  }
}
makeDots(document.getElementById('heroDots'), 180);
makeDots(document.getElementById('aboutDots'), 36);

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

/* ── ACTIVE NAV (IntersectionObserver) ── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => navObserver.observe(s));

/* ============================================================
   PORTFOLIO DATA
   ─────────────────────────────────────────────────────────────
   Each `files` array contains ONLY the bare filename.
   The full path is built as:  ./images/{folder}/{filename}
   Make sure your folder names below EXACTLY match the folder
   names on disk (they are case-sensitive on most web servers).
   ============================================================ */
const CATEGORIES = [
  {
    key:    'acrylic',
    label:  'Acrylic Trophy Designs',
    folder: 'Acrylic trophy designs',
    files:  ['AClebel.jpg', 'Acrylic TROPHY.jpg']
  },
  {
    key:    'advertisements',
    label:  'Advertisements',
    folder: 'Advertisments',        // keep the original folder spelling
    files:  ['07012023.jpg', 'ad post.jpg']
  },
  {
    key:    'cd',
    label:  'CD Designs',
    folder: 'CD desgins',           // keep the original folder spelling
    files:  ['09112022CD.jpg', '25102022.jpg', '25102022A.jpg', '25102022B.jpg']
  },
  {
    key:    'discount',
    label:  'Discount Designs',
    folder: 'Discount designs',
    files:  ['06012024.jpg']
  },
  {
    key:    'educational',
    label:  'Educational Designs',
    folder: 'Educational designs',
    files:  ['3.jpg', '4.jpg', '14.jpg', '44.jpg', '1972023.jpg', '19720232.jpg', '19720233.jpg']
  },
  {
    key:    'others',
    label:  'Others',
    folder: 'Others',
    files:  ['02102022A.jpg', '02102022B.jpg', '15012023.jpg', '16022023.jpg', '27102022BU.jpg', 'Adhkar.jpg']
  },
  {
    key:    'perfumes',
    label:  'Perfumes & Accessories',
    folder: 'Perfumes accesories',  // keep the original folder spelling
    files:  ['17SE22..jpg', '17SE22.jpg', '25723.jpg', '14012023.jpg']
  },
  {
    key:    'restaurants',
    label:  'Restaurants',
    folder: 'Restaurants',
    files:  ['02102022.jpg', '03112022TA.jpg']
  },
  {
    key:    'stickers',
    label:  'Stickers',
    folder: 'stickers',
    files:  ['08062023.jpg']
  }
];

/* Build flat item list — path: ./images/{folder}/{filename} */
const ALL_ITEMS = [];
CATEGORIES.forEach(cat => {
  cat.files.forEach((file, i) => {
    ALL_ITEMS.push({
      category: cat.key,
      label:    cat.label,
      src:      `./images/${cat.folder}/${file}`,
      id:       `${cat.key}-${i}`
    });
  });
});

/* ── MASONRY GRID ── */
const BATCH = 12;
let currentFilter = 'all';
let shown = 0;

function filteredItems() {
  return currentFilter === 'all'
    ? ALL_ITEMS
    : ALL_ITEMS.filter(it => it.category === currentFilter);
}

function buildCard(item) {
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.dataset.category = item.category;

  /* vary aspect-ratio class for masonry rhythm */
  const spans = ['span-1', 'span-2', 'span-3'];
  const idx = ALL_ITEMS.indexOf(item);
  card.classList.add(spans[idx % 3 === 0 ? 2 : idx % 2 === 0 ? 1 : 0]);

  const img = document.createElement('img');
  img.src     = item.src;
  img.alt     = item.label;
  img.loading = 'lazy';

  const overlay = document.createElement('div');
  overlay.className = 'pf-overlay';
  overlay.innerHTML = `<span class="pf-cat-label">${item.label}</span>`;

  card.appendChild(img);
  card.appendChild(overlay);
  card.addEventListener('click', () => openLightbox(item.src, item.label));
  return card;
}

function renderGrid(reset = false) {
  const grid = document.getElementById('portfolioGrid');
  if (reset) { grid.innerHTML = ''; shown = 0; }
  const items = filteredItems();
  const slice = items.slice(shown, shown + BATCH);
  slice.forEach(item => grid.appendChild(buildCard(item)));
  shown += slice.length;
  document.getElementById('loadMore').style.display =
    shown >= items.length ? 'none' : 'inline-block';
}

/* ── FILTER TABS ── */
document.getElementById('filterTabs').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  document.querySelectorAll('#filterTabs li').forEach(el => el.classList.remove('active'));
  li.classList.add('active');
  currentFilter = li.dataset.filter;
  renderGrid(true);
});

document.getElementById('loadMore').addEventListener('click', () => renderGrid(false));

/* ── LIGHTBOX ── */
function openLightbox(src, label) {
  const lb = document.getElementById('pf-lightbox');
  lb.querySelector('img').src = src;
  lb.querySelector('.lb-caption').textContent = label;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('pf-lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
/* expose closeLightbox globally (called via onclick in HTML) */
window.closeLightbox = closeLightbox;

/* ── SKILLS ── */
const skills = [
  { name: 'Adobe Illustrator', pct: 95 },
  { name: 'Adobe Photoshop',   pct: 90 },
  { name: 'CorelDRAW',         pct: 88 },
  { name: 'Print / Prepress',  pct: 92 },
  { name: 'Signage Design',    pct: 85 },
  { name: 'Branding',          pct: 80 },
];

const skillsGrid = document.getElementById('skillsGrid');
skills.forEach((sk, i) => {
  const div = document.createElement('div');
  div.className = `skill-item reveal reveal-delay-${(i % 4) + 1}`;
  div.innerHTML = `
    <div class="skill-header">
      <span class="skill-name">${sk.name}</span>
      <span class="skill-pct">${sk.pct}%</span>
    </div>
    <div class="skill-bar"><div class="skill-fill" data-pct="${sk.pct}"></div></div>`;
  skillsGrid.appendChild(div);
});

/* ── SCROLL REVEAL ── */
function setupReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      /* animate any skill bar inside this element */
      const fill = e.target.querySelector('.skill-fill');
      if (fill && !fill.style.width) fill.style.width = fill.dataset.pct + '%';
      /* catch bars in already-visible containers */
      document.querySelectorAll('.reveal.visible .skill-fill').forEach(f => {
        if (!f.style.width) f.style.width = f.dataset.pct + '%';
      });
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObs.observe(el));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderGrid(true);
  setupReveal();
  /* immediately reveal hero elements */
  document.querySelectorAll('#home .reveal').forEach(el => el.classList.add('visible'));
});
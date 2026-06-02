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

/* ── HERO PHONE GALLERY (auto-scrolling work samples) ── */
const HERO_SAMPLES = [
  './images/Educational designs/3.jpg',
  './images/Perfumes accesories/25723.jpg',
  './images/Restaurants/02102022.jpg',
  './images/Advertisments/ad post.jpg',
  './images/CD desgins/25102022.jpg',
  './images/Others/Adhkar.jpg',
  './images/Educational designs/4.jpg',
  './images/Discount designs/06012024.jpg',
  './images/stickers/08062023.jpg',
  './images/Acrylic trophy designs/Acrylic TROPHY.jpg'
];
function fillGalleryTrack(track, samples) {
  if (!track) return;
  /* duplicate the set so the marquee can loop seamlessly (-50%) */
  [...samples, ...samples].forEach(src => {
    const phone = document.createElement('div');
    phone.className = 'hero-phone';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Work sample';
    img.loading = 'lazy';
    phone.appendChild(img);
    track.appendChild(phone);
  });
}
/* top row uses a rotated order so the two rows don't mirror each other */
const HERO_SAMPLES_TOP = HERO_SAMPLES.slice(5).concat(HERO_SAMPLES.slice(0, 5));
fillGalleryTrack(document.getElementById('heroGalleryTop'), HERO_SAMPLES_TOP);
fillGalleryTrack(document.getElementById('heroGalleryBottom'), HERO_SAMPLES);

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
/* close the mobile menu after tapping a link */
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── MOVING NAVBAR (compact on scroll, hide down / reveal up) ── */
const navEl = document.querySelector('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navEl.classList.toggle('scrolled', y > 24);
  /* keep the menu visible while it is open or near the very top */
  if (!navLinks.classList.contains('open')) {
    if (y > lastScroll && y > 200) navEl.classList.add('nav-hidden');
    else navEl.classList.remove('nav-hidden');
  }
  lastScroll = y;
}, { passive: true });

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

/* ── WORKS SHOWCASE (stacked-card carousel) ── */
const SC_DURATION = 3800;           // ms per slide while playing
let currentFilter = 'all';
let scItems   = [];
let scIndex   = 0;
let scPlaying = false;
let scTimer   = null;

const scImg      = document.getElementById('showcaseImg');
const scSlide    = document.getElementById('showcaseImgSlide');
const scImgBack  = document.getElementById('showcaseImgBack');
const scTitle    = document.getElementById('showcaseTitle');
const scProgress = document.getElementById('showcaseProgress');
const scCount    = document.getElementById('scCount');
const scPlayBtn  = document.getElementById('scPlay');
let   scAnim     = null;            // active slide tween

const PLAY_SVG  = '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
const PAUSE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';

const pad = n => String(n).padStart(2, '0');

function filteredItems() {
  return currentFilter === 'all'
    ? ALL_ITEMS
    : ALL_ITEMS.filter(it => it.category === currentFilter);
}

/* preload, then crossfade the front image */
function fadeTo(src, alt) {
  scImg.style.opacity = '0';
  const pre = new Image();
  const swap = () => {
    scImg.src = src;
    scImg.alt = alt;
    requestAnimationFrame(() => { scImg.style.opacity = '1'; });
  };
  pre.onload = swap;
  pre.onerror = swap;
  pre.src = src;
}

function setProgress(pct, durationMs) {
  scProgress.style.transition = durationMs
    ? `width ${durationMs}ms linear`
    : 'width 0.4s ease';
  scProgress.style.width = pct + '%';
}

/* animate the bar 0 → 100% over one slide duration */
function runSlideProgress() {
  setProgress(0, 0);
  void scProgress.offsetWidth;      // force reflow so the reset applies
  setProgress(100, SC_DURATION);
}

/* commit the slid-in image as the new base layer */
function commitBase(item) {
  scImg.src = item.src;
  scImg.alt = item.label;
  scImg.style.opacity = '1';
  scSlide.style.display = 'none';
  scAnim = null;
}

function scShow(i, dir = 0) {
  if (!scItems.length) return;
  scIndex = (i + scItems.length) % scItems.length;
  const item = scItems[scIndex];
  const next = scItems[(scIndex + 1) % scItems.length];

  scTitle.textContent = item.label;
  scCount.textContent = `${pad(scIndex + 1)} / ${pad(scItems.length)}`;
  if (scPlaying) runSlideProgress();
  else setProgress(((scIndex + 1) / scItems.length) * 100, 0);

  scImgBack.src = next.src;

  if (dir && window.gsap) {
    /* next image slides over the current one from the pressed side */
    if (scAnim) scAnim.progress(1);            // finish any in-flight slide
    const startX = dir > 0 ? 105 : -105;       // right press → enter from right
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      scSlide.src = item.src;
      scSlide.alt = item.label;
      scSlide.style.display = 'block';
      gsap.killTweensOf(scSlide);
      scAnim = gsap.fromTo(scSlide,
        { xPercent: startX },
        { xPercent: 0, duration: 0.6, ease: 'power3.out', onComplete: () => commitBase(item) });
    };
    pre.src = item.src;
  } else {
    fadeTo(item.src, item.label);             // first load / no GSAP → crossfade
  }
}

function scStep(dir) {
  scShow(scIndex + dir, dir);
  if (scPlaying) {
    clearTimeout(scTimer);
    scTimer = setTimeout(() => scStep(1), SC_DURATION);
  }
}

function scSetPlaying(play) {
  scPlaying = play;
  scPlayBtn.classList.toggle('playing', play);
  scPlayBtn.innerHTML = play ? PAUSE_SVG : PLAY_SVG;
  scPlayBtn.setAttribute('aria-label', play ? 'Pause slideshow' : 'Play slideshow');
  clearTimeout(scTimer);
  if (play) {
    runSlideProgress();
    scTimer = setTimeout(() => scStep(1), SC_DURATION);
  } else {
    setProgress(((scIndex + 1) / scItems.length) * 100, 0);
  }
}

function scSetFilter(filter) {
  currentFilter = filter;
  scItems = filteredItems();
  scShow(0);
  if (scPlaying) {
    clearTimeout(scTimer);
    scTimer = setTimeout(() => scStep(1), SC_DURATION);
  }
}

/* ── FILTER TABS ── */
document.getElementById('filterTabs').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  document.querySelectorAll('#filterTabs li').forEach(el => el.classList.remove('active'));
  li.classList.add('active');
  scSetFilter(li.dataset.filter);
});

/* ── SHOWCASE CONTROLS ── */
document.getElementById('scPrev').addEventListener('click', () => scStep(-1));
document.getElementById('scNext').addEventListener('click', () => scStep(1));
scPlayBtn.addEventListener('click', () => scSetPlaying(!scPlaying));
scImg.addEventListener('click', () => openLightbox(scItems[scIndex].src, scItems[scIndex].label));
document.getElementById('showcaseExpand').addEventListener('click', () =>
  openLightbox(scItems[scIndex].src, scItems[scIndex].label));

/* keyboard arrows navigate when the showcase is in view */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  scStep(-1);
  if (e.key === 'ArrowRight') scStep(1);
});

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
  { name: 'Adobe Illustrator', pct: 95, color: '#ff9a00' },
  { name: 'Adobe Photoshop',   pct: 90, color: '#31a8ff' },
  { name: 'CorelDRAW',         pct: 88, color: '#2fbf71' },
  { name: 'Print / Prepress',  pct: 92, color: '#e63946' },
  { name: 'Signage Design',    pct: 85, color: '#b56bff' },
  { name: 'Branding',          pct: 80, color: '#f0e000' },
];

const skillsGrid = document.getElementById('skillsGrid');
skills.forEach((sk, i) => {
  const div = document.createElement('div');
  div.className = `skill-item reveal reveal-delay-${(i % 4) + 1}`;
  div.style.setProperty('--skill-color', sk.color);
  div.innerHTML = `
    <div class="skill-header">
      <span class="skill-dot"></span>
      <span class="skill-name">${sk.name}</span>
    </div>
    <div class="skill-bar">
      <div class="skill-fill" data-pct="${sk.pct}">
        <span class="skill-pct">${sk.pct}%</span>
      </div>
    </div>`;
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

/* ══════════════════════════════════════════════════════════
   HERO → ABOUT DUST MORPH
   As you scroll, the hero photo disintegrates from the top into
   grayscale dust that drifts toward the (empty) about frame and
   rebuilds the photo from the bottom up. Particles are drawn with
   drawImage (slices of the photo), so it also works from file://
   where getImageData would be blocked.
══════════════════════════════════════════════════════════ */
function setupMorph() {
  const heroImg  = document.getElementById('heroImg');
  const aboutImg = document.getElementById('aboutImg');
  const canvas   = document.getElementById('morphCanvas');
  if (!heroImg || !aboutImg || !canvas) return;

  /* respect reduced-motion: just show the about photo, no effect */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    aboutImg.style.opacity = '1';
    return;
  }

  const ctx  = canvas.getContext('2d', { alpha: true });
  const COLS = window.innerWidth < 700 ? 18 : 26;   // grid resolution (low = smoothest)
  const S    = 0.34;                                // top/bottom stagger window
  const clamp = v => (v < 0 ? 0 : v > 1 ? 1 : v);

  let particles = [];
  let ROWS = 0, ready = false;
  let cw = 0, ch = 0, dpr = 1;
  let lastP = -1;

  /* one-time grayscale copy of the photo, pre-shrunk to the particle
     grid so each particle samples a single 1×1 source pixel (no costly
     per-frame downsampling) */
  const gray = document.createElement('canvas');
  const gctx = gray.getContext('2d');

  const src = new Image();
  src.onload = () => {
    const W = src.naturalWidth, H = src.naturalHeight;
    ROWS = Math.max(8, Math.round(COLS * (H / W)));
    gray.width = COLS; gray.height = ROWS;
    gctx.filter = 'grayscale(1) contrast(1.05)';
    gctx.drawImage(src, 0, 0, COLS, ROWS);   // downscale once
    gctx.filter = 'none';

    particles = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 160;
        particles.push({
          nx: (x + 0.5) / COLS, ny: (y + 0.5) / ROWS,
          ix: x, iy: y,
          dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist,
          grav: Math.random() * 80
        });
      }
    }
    ready = true;
  };
  src.src = './images/profile picture.jpeg';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1) * 0.85;  // render below CSS res; dust hides it
    cw = window.innerWidth; ch = window.innerHeight;
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;        // nearest-neighbour = cheap blits
    lastP = -1;                               // force a redraw after resize
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* progress 0→1 as the about photo rises from the fold into view */
  function progress() {
    const r = aboutImg.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp((vh - r.top) / (vh * 0.7));
  }

  function render(p) {
    const hr = heroImg.getBoundingClientRect();
    const ar = aboutImg.getBoundingClientRect();
    const hCell = hr.width / COLS, aCell = ar.width / COLS;
    ctx.clearRect(0, 0, cw, ch);

    for (let k = 0; k < particles.length; k++) {
      const pt = particles[k];
      const t0 = pt.ny * S;                 // top particles leave first
      const t1 = (1 - S) + (1 - pt.ny) * S; // bottom particles settle first
      let x, y, size, alpha = 1;

      if (p <= t0) {                        // still part of the hero photo
        x = hr.left + pt.nx * hr.width;
        y = hr.top  + pt.ny * hr.height;
        size = hCell;
      } else if (p >= t1) {                 // settled into the about photo
        x = ar.left + pt.nx * ar.width;
        y = ar.top  + pt.ny * ar.height;
        size = aCell;
      } else {                              // airborne dust
        const u = (p - t0) / (t1 - t0);
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        const hx = hr.left + pt.nx * hr.width, hy = hr.top + pt.ny * hr.height;
        const axx = ar.left + pt.nx * ar.width, ayy = ar.top + pt.ny * ar.height;
        const amp = Math.sin(u * Math.PI);
        x = hx + (axx - hx) * e + pt.dx * amp;
        y = hy + (ayy - hy) * e + pt.dy * amp + pt.grav * amp;
        size = hCell + (aCell - hCell) * e;
        alpha = 1 - 0.45 * amp;
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(gray, pt.ix, pt.iy, 1, 1, x, y, size + 1, size + 1);
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    if (ready) {
      const p = progress();
      heroImg.style.opacity  = p > 0.004 ? '0' : '0.85';
      aboutImg.style.opacity = p > 0.996 ? '1' : '0';
      if (p > 0.004 && p < 0.996) {
        canvas.classList.add('active');
        if (p !== lastP) { render(p); lastP = p; }   // skip redraw when idle
      } else {
        canvas.classList.remove('active');
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  scSetFilter('all');
  setupReveal();
  setupMorph();
  /* immediately reveal hero elements */
  document.querySelectorAll('#home .reveal').forEach(el => el.classList.add('visible'));
});
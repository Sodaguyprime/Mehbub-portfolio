/* ============================================================
   PROTOFILO — main.js
   ============================================================ */

/* ── DOT GRIDS ── */
function makeDots(el, count) {
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    el.appendChild(s);
  }
}
makeDots(document.getElementById('aboutDots'), 36);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── CUSTOM CURSOR (dot + trailing ring, magnetic-aware) ── */
function setupCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  /* skip on touch / coarse pointers */
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.body.classList.add('has-cursor');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  (function trail() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(trail);
  })();

  /* grow over interactive elements */
  const hot = 'a, button, .magnetic, [data-tilt], #filterTabs li, .skill-item, .stat-card, .stat-feature, .contact-info-card';
  document.querySelectorAll(hot).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hot'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hot'));
  });
}

/* ── MAGNETIC BUTTONS ── */
function setupMagnetic() {
  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    const strength = 0.35;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ── HERO SPOTLIGHT (cursor-tracked glow) + GHOST PARALLAX ── */
function setupHeroSpotlight() {
  const hero  = document.getElementById('home');
  const spot  = document.getElementById('heroSpotlight');
  const ghost = document.querySelector('[data-ghost]');
  if (!hero || !spot) return;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    spot.style.setProperty('--mx', x + '%');
    spot.style.setProperty('--my', y + '%');
    if (ghost && !prefersReduced) {
      const dx = (x - 50) * 0.4, dy = (y - 50) * 0.4;
      ghost.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  }, { passive: true });
}

/* ── LIGHTWEIGHT TILT (portraits / frames) ── */
function setupTilt() {
  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
}

/* ── ANIMATED COUNTERS ── */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const render = n => { el.innerHTML = n + (suffix ? `<span>${suffix}</span>` : ''); };
  if (prefersReduced) { render(target); return; }
  const dur = 1500;
  const start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    render(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  })(start);
}
function setupCounters() {
  const els = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); o.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  els.forEach(el => obs.observe(el));
}



/* ── SCROLL PROGRESS BAR ── */
function setupScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

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

/* ── PORTFOLIO SLIDER ───────────────────────────── */

const track = document.getElementById("portfolioTrack");
const prevBtn = document.getElementById("portfolioPrev");
const nextBtn = document.getElementById("portfolioNext");

if (track && prevBtn && nextBtn) {

    let currentIndex = 0;
    let autoPlay;

    function buildSlider(filter = "all") {

        track.innerHTML = "";

        const items =
            filter === "all"
                ? ALL_ITEMS
                : ALL_ITEMS.filter(item => item.category === filter);

        items.forEach(item => {

            const card = document.createElement("div");
            card.className = "portfolio-card";

            card.innerHTML = `
                <img src="${item.src}" alt="${item.label}">
                <div class="portfolio-overlay">
                    <h3>${item.label}</h3>
                </div>
            `;

            track.appendChild(card);
        });

        currentIndex = 0;
        updateSlider();
    }

    function cards() {
        return document.querySelectorAll(".portfolio-card");
    }

    function getCardWidth() {
        const first = cards()[0];
        return first ? first.offsetWidth + 20 : 0;
    }

    function visibleCards() {
        return window.innerWidth < 768 ? 1 : 4;
    }

    function maxIndex() {
        return Math.max(0, cards().length - visibleCards());
    }

    function updateSlider() {
        track.style.transform =
            `translateX(-${currentIndex * getCardWidth()}px)`;
    }

    function nextSlide() {

        if (currentIndex >= maxIndex()) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        updateSlider();
    }

    function prevSlide() {

        if (currentIndex <= 0) {
            currentIndex = maxIndex();
        } else {
            currentIndex--;
        }

        updateSlider();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    function startAutoPlay() {

        clearInterval(autoPlay);

        autoPlay = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    track.addEventListener("mouseenter", () => {
        clearInterval(autoPlay);
    });

    track.addEventListener("mouseleave", startAutoPlay);

    window.addEventListener("resize", updateSlider);

    /* FILTER TABS */
    document
        .getElementById("filterTabs")
        ?.addEventListener("click", (e) => {

            const tab = e.target.closest("li");
            if (!tab) return;

            document
                .querySelectorAll("#filterTabs li")
                .forEach(li => li.classList.remove("active"));

            tab.classList.add("active");

            buildSlider(tab.dataset.filter);
        });

    buildSlider("all");
    startAutoPlay();
}

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
  setupReveal();
  setupMorph();
  setupCursor();
  setupMagnetic();
  setupHeroSpotlight();
  setupTilt();
  setupCounters();
  setupScrollProgress();
  /* immediately reveal hero elements */
  document.querySelectorAll('#home .reveal').forEach(el => el.classList.add('visible'));
});

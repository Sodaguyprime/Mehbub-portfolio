 /* ── DOT GRIDS ── */
    function makeDots(el, count) {
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        el.appendChild(s);
      }
    }
    makeDots(document.getElementById('heroDots'), 80);
    makeDots(document.getElementById('aboutDots'), 35);

    /* ── HAMBURGER ── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

    /* ── ACTIVE NAV ── */
    const sections = document.querySelectorAll('section[id]');
    const navAs    = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navAs.forEach(a => a.classList.remove('active'));
          const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    }, { threshold: 0.45 });
    sections.forEach(s => observer.observe(s));

    /* ── PORTFOLIO DATA ── */
    const portfolioItems = [
      { cat: 'graphic',    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70&auto=format&fit=crop', title: 'Architecture I' },
      { cat: 'webdesign',  img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=70&auto=format&fit=crop', title: 'Facade Study' },
      { cat: 'branding',   img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70&auto=format&fit=crop', title: 'Urban Lines' },
      { cat: 'graphic',    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70&auto=format&fit=crop', title: 'Mountain Peak' },
      { cat: 'videos',     img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=70&auto=format&fit=crop', title: 'Aerial Travel' },
      { cat: 'webdesign',  img: null, featured: true,                                                                          title: 'Design Project', desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' },
      { cat: 'branding',   img: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&q=70&auto=format&fit=crop', title: 'Ferris Wheel' },
      { cat: 'graphic',    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=70&auto=format&fit=crop', title: 'Misty Lake' },
      { cat: 'videos',     img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70&auto=format&fit=crop', title: 'Cloudscape' },
      { cat: 'branding',   img: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=400&q=70&auto=format&fit=crop', title: 'Night Sky' },
      { cat: 'graphic',    img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=70&auto=format&fit=crop', title: 'Reflection' },
      { cat: 'webdesign',  img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70&auto=format&fit=crop', title: 'Desert Road' },
    ];

    const VISIBLE_INIT = 9;
    let visibleCount = VISIBLE_INIT;
    let currentFilter = 'all';

    function renderGrid() {
      const grid = document.getElementById('portfolioGrid');
      const filtered = currentFilter === 'all' ? portfolioItems : portfolioItems.filter(i => i.cat === currentFilter);
      const toShow = filtered.slice(0, visibleCount);

      grid.innerHTML = '';
      toShow.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'portfolio-item' + (item.featured ? ' featured' : '');
        div.style.animationDelay = `${idx * 0.06}s`;

        if (!item.featured) {
          div.innerHTML = `
            <img src="${item.img}" alt="${item.title}" loading="lazy" />
            <div class="portfolio-overlay">
              <svg viewBox="0 0 24 24"><path d="M11 3H3v8h2V5h6V3zm2 18h8v-8h-2v6h-6v2zM3 13H1v8h8v-2H3v-6zm18-10h-8V1H21v8h-2V3z"/></svg>
              <p>${item.title}</p>
              <span>${item.cat}</span>
            </div>`;
        } else {
          div.innerHTML = `
            <div class="portfolio-overlay">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <p>${item.title}</p>
              <span>${item.desc}</span>
            </div>`;
        }
        grid.appendChild(div);
      });

      document.getElementById('loadMore').style.display =
        visibleCount >= filtered.length ? 'none' : 'inline-block';
    }

    /* filter tabs */
    document.getElementById('filterTabs').addEventListener('click', e => {
      const li = e.target.closest('li');
      if (!li) return;
      document.querySelectorAll('.filter-tabs li').forEach(l => l.classList.remove('active'));
      li.classList.add('active');
      currentFilter = li.dataset.filter;
      visibleCount = VISIBLE_INIT;
      renderGrid();
    });

    /* load more */
    document.getElementById('loadMore').addEventListener('click', () => {
      visibleCount += 3;
      renderGrid();
    });

    renderGrid();

    /* ── SKILLS ── */
    const skills = [
      { name: 'UI Design',       pct: 92 },
      { name: 'HTML / CSS',      pct: 95 },
      { name: 'JavaScript',      pct: 85 },
      { name: 'React',           pct: 80 },
      { name: 'Figma',           pct: 88 },
      { name: 'Branding',        pct: 75 },
    ];

    const skillsGrid = document.getElementById('skillsGrid');
    skills.forEach((sk, i) => {
      skillsGrid.innerHTML += `
        <div class="skill-item reveal reveal-delay-${(i%4)+1}">
          <div class="skill-header">
            <span class="skill-name">${sk.name}</span>
            <span class="skill-pct">${sk.pct}%</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" data-pct="${sk.pct}"></div></div>
        </div>`;
    });

    /* ── SCROLL REVEAL ── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          /* animate skill bars when visible */
          const fill = e.target.querySelector ? e.target.querySelector('.skill-fill') : null;
          if (fill) fill.style.width = fill.dataset.pct + '%';

          /* also trigger fills inside revealed containers */
          document.querySelectorAll('.reveal.visible .skill-fill').forEach(f => {
            if (!f.style.width) f.style.width = f.dataset.pct + '%';
          });
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObs.observe(el));

    /* trigger hero reveals on load */
    window.addEventListener('load', () => {
      document.querySelectorAll('#home .reveal').forEach(el => el.classList.add('visible'));
    });
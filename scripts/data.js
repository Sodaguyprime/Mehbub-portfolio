/* ============================================================
   PROTOFILO — shared portfolio data
   ------------------------------------------------------------
   Single source of truth for both the home-page Works slider
   and the full Pinterest-style gallery page.

   Each `files` array holds ONLY the bare filename.
   The full path is built as:  ./images/{folder}/{filename}
   Folder names are CASE-SENSITIVE on most web servers, so they
   must EXACTLY match the folders on disk.
   ============================================================ */
(function (global) {
  const CATEGORIES = [
    {
      key: 'acrylic',
      label: 'Acrylic Trophy Designs',
      folder: 'Acrylic trophy designs',
      files: ['AClebel.webp', 'Acrylic TROPHY.webp', 'AC lebel.webp', '2356.webp']
    },
    {
      key: 'advertisements',
      label: 'Advertisements',
      folder: 'Advertisments',        // keep the original folder spelling
      files: ['07012023.webp', 'ad post.webp']
    },
    {
      key: 'cd',
      label: 'CD Designs',
      folder: 'CD desgins',           // keep the original folder spelling
      files: ['09112022CD.webp', '25102022.webp', '25102022A.webp', '25102022B.webp']
    },
    {
      key: 'discount',
      label: 'Discount Designs',
      folder: 'Discount designs',
      files: ['06012024.webp']
    },
    {
      key: 'educational',
      label: 'Educational Designs',
      folder: 'Educational designs',
      files: ['3.webp', '4.webp', '14.webp', '44.webp', '1972023.webp', '19720232.webp', '19720233.webp']
    },
    {
      key: 'others',
      label: 'Others',
      folder: 'Others',
      files: [
        '02102022A.webp', '02102022B.webp', '15012023.webp', '16022023.webp', '27102022BU.webp', 'Adhkar.webp', '121.webp',
        'al-isra-wal-miraj-reel.webp', 'al-isra-wal-miraj.webp', 'alya-spa-na.webp', 'asegv.webp', 'ba.webp',
        'back-to-school-2024.webp', 'back-to-school-gift.webp', 'back-to-school.webp', 'baner.webp', 'banner.webp',
        'birthday-decor.webp', 'birthday-poster.webp', 'birthday-poster1.webp', 'birthday-poster2.webp', 'bookmark.webp',
        'box.webp', 'brand.webp', 'business-card.webp', 'calender-1.webp', 'calender.webp', 'camera-post.webp', 'camera-post2.webp',
        'cd-2.webp', 'divine.webp', 'divine2.webp', 'divine3.webp', 'drow.webp', 'dsadsasa.webp', 'edi.webp', 'eid.webp',
        'english-fonts.webp', 'flyer.webp', 'flyer1.webp', 'graduation-badge.webp', 'graduation-cards.webp', 'haj.webp',
        'haj2.webp', 'hajj-and-umrah.webp', 'hiring-post.webp', 'honey-bees-poster.webp',
        'how-to-order-online.webp', 'ind.webp', 'ind2.webp', 'ind26.webp', 'indian-republic-day.webp', 'insta.webp',
        'insta2.webp', 'iphone.webp', 'islamic-holidays-1444-ah3.webp', 'islamic-post.webp', 'keyboard.webp', 'laundry.webp',
        'logo.webp', 'masjid2.webp', 'medicin.webp', 'mh-e-solutions.webp', 'mobile-gallery-2.webp', 'mobile-gallery.webp',
        'mobile-gallery2-2.webp', 'mobile-gallery2.webp', 'mobile-gallery3.webp', 'mobile-gallery4.webp', 'mockup.webp',
        'move.webp', 'musab-bin.webp', 'name-stickers.webp', 'national-1.webp', 'national-2.webp', 'national-day-2.webp',
        'national-day-2024.webp', 'national-day.webp', 'new-babay.webp', 'new-baby-born.webp', 'new-baby.webp',
        'new-year-12.webp', 'new-year.webp', 'new-year13.webp', 'new-year2023.webp', 'newa.webp', 'newspaper.webp',
        'offiial-stamp.webp', 'photo-booth.webp', 'post-1.webp', 'post-12.webp', 'post-13.webp', 'post.webp', 'poster.webp',
        'poster1.webp', 'price-list.webp', 'qarankasho.webp', 'qarankasho2.webp', 'qarankasho3.webp', 'quran-bookmark.webp',
        'ramadan-kareem.webp', 'ramadan.webp', 'ramazan.webp', 'reel.webp', 'royaldatesoman.webp', 'shaikh-gazali.webp',
        'shaikh-gazali2.webp', 'sketch2365987.webp', 'sti.webp', 'tauzeyat.webp', 'tauzeyat1-3.webp', 'teaches-stamps.webp',
        'teacher-day-2.webp', 'teacher-day.webp', 'teeb-al-oud.webp', 'wedding-passport.webp',
        'woman-day-4.webp', 'woman-day-mock.webp', 'woman-day.webp', 'woman-day1.webp', 'woman-day2.webp', 'woman-day3.webp',
        'arabic-fonts.webp', 'water-comments.webp', 'hawal-hawal.webp', 'hawal-hawal2.webp', 'design-2.webp'
      ]
    },
    {
      key: 'perfumes',
      label: 'Perfumes & Accessories',
      folder: 'Perfumes accesories',  // keep the original folder spelling
      files: ['17SE22..webp', '17SE22.webp', '25723.webp', '14012023.webp']
    },
    {
      key: 'restaurants',
      label: 'Restaurants',
      folder: 'Restaurants',
      files: ['02102022.webp', '03112022TA.webp']
    },
    {
      key: 'stickers',
      label: 'Stickers',
      folder: 'stickers',
      files: ['08062023.webp']
    }
  ];

  /* Flatten to a single item list — encodeURI handles the spaces
     in folder/file names so the paths are valid on every host. */
  const ALL_ITEMS = [];
  CATEGORIES.forEach(cat => {
    cat.files.forEach((file, i) => {
      ALL_ITEMS.push({
        category: cat.key,
        label: cat.label,
        src: encodeURI(`./images/${cat.folder}/${file}`),
        id: `${cat.key}-${i}`
      });
    });
  });

  global.PORTFOLIO_CATEGORIES = CATEGORIES;
  global.PORTFOLIO_ITEMS = ALL_ITEMS;
})(window);

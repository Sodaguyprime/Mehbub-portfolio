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
      files: ['AClebel.jpg', 'Acrylic TROPHY.jpg']
    },
    {
      key: 'advertisements',
      label: 'Advertisements',
      folder: 'Advertisments',        // keep the original folder spelling
      files: ['07012023.jpg', 'ad post.jpg']
    },
    {
      key: 'cd',
      label: 'CD Designs',
      folder: 'CD desgins',           // keep the original folder spelling
      files: ['09112022CD.jpg', '25102022.jpg', '25102022A.jpg', '25102022B.jpg']
    },
    {
      key: 'discount',
      label: 'Discount Designs',
      folder: 'Discount designs',
      files: ['06012024.jpg']
    },
    {
      key: 'educational',
      label: 'Educational Designs',
      folder: 'Educational designs',
      files: ['3.jpg', '4.jpg', '14.jpg', '44.jpg', '1972023.jpg', '19720232.jpg', '19720233.jpg']
    },
    {
      key: 'others',
      label: 'Others',
      folder: 'Others',
      files: ['02102022A.jpg', '02102022B.jpg', '15012023.jpg', '16022023.jpg', '27102022BU.jpg', 'Adhkar.jpg']
    },
    {
      key: 'perfumes',
      label: 'Perfumes & Accessories',
      folder: 'Perfumes accesories',  // keep the original folder spelling
      files: ['17SE22..jpg', '17SE22.jpg', '25723.jpg', '14012023.jpg']
    },
    {
      key: 'restaurants',
      label: 'Restaurants',
      folder: 'Restaurants',
      files: ['02102022.jpg', '03112022TA.jpg']
    },
    {
      key: 'stickers',
      label: 'Stickers',
      folder: 'stickers',
      files: ['08062023.jpg']
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

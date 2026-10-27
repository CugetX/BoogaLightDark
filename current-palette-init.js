// Apply a saved palette and time-of-day mode before paint.
// Respects the visitor's system preference initially, then remembers their choice.
(() => {
  const allowed = ['brand-moss', 'brand-ochre', 'brand-rose', 'forest', 'ink', 'clay', 'cave', 'lagoon', 'volcanic'];
  const params = new URLSearchParams(location.search);
  let choice = params.get('palette');
  try {
    if (!allowed.includes(choice)) choice = JSON.parse(localStorage.getItem('boogas-mobile-palette'));
  } catch {}
  const palette = allowed.includes(choice) ? choice : 'brand-moss';
  document.documentElement.dataset.palette = palette;

  let mode = params.get('mode');
  if (!['light', 'dark'].includes(mode)) {
    try {
      const remembered = JSON.parse(localStorage.getItem('boogas-mobile-time-choice'));
      if (['light', 'dark'].includes(remembered)) mode = remembered;
    } catch {}
  }
  if (!['light', 'dark'].includes(mode)) {
    try {
      if (localStorage.getItem('boogas-mobile-time-chosen') === '1') {
        const legacy = JSON.parse(localStorage.getItem('boogas-mobile-mode'));
        if (['light', 'dark'].includes(legacy)) mode = legacy;
      }
    } catch {}
  }
  if (!['light', 'dark'].includes(mode)) {
    mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (['cave', 'lagoon', 'volcanic'].includes(palette)) mode = 'dark';
  document.documentElement.dataset.mode = mode;
})();

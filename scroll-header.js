// Give mobile reading space; a short upward scroll restores navigation.
export function mountScrollHeader() {
  const header = document.querySelector('.header');
  const mobile = matchMedia('(max-width: 599px)');
  if (!header) return;
  let previous = Math.max(0, scrollY), direction = 0, distance = 0;
  let queued = false, revealUntil = 0;
  const reveal = () => {
    header.classList.remove('header-away');
    previous = Math.max(0, scrollY);
    direction = 0;
    distance = 0;
    revealUntil = performance.now() + 450;
  };
  function update() {
    queued = false;
    const limit = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const y = Math.max(0, Math.min(scrollY, limit));
    const delta = y - previous;
    previous = y;
    if (!mobile.matches || y < 120 || performance.now() < revealUntil ||
        document.querySelector('dialog[open]') || header.querySelector(':focus-visible')) {
      header.classList.remove('header-away');
      direction = 0;
      distance = 0;
      return;
    }
    if (Math.abs(delta) < 1) return;
    const nextDirection = Math.sign(delta);
    distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (direction > 0 && distance >= 32) header.classList.add('header-away');
    if (direction < 0 && distance >= 12) header.classList.remove('header-away');
  }
  addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('hashchange', reveal);
  mobile.addEventListener('change', reveal);
  header.addEventListener('focusin', reveal);
  header.addEventListener('click', reveal);
  document.addEventListener('focusin', event => {
    if (event.target.closest?.('dialog[open]')) reveal();
  });
  reveal();
}

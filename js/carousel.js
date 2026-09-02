// Najiha Closet — Lightweight carousel (no dependencies)
// Usage: initCarousel('#heroCarousel', { auto: true, interval: 5000 })

export function initCarousel(rootSelector, { auto = false, interval = 5000 } = {}) {
  const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
  if (!root) return null;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const dotsWrap = root.querySelector('.carousel-dots');
  if (!track || slides.length === 0) return null;

  let index = 0;
  let timer = null;

  if (dotsWrap) {
    dotsWrap.innerHTML = slides.map((_, i) => `<button aria-label="Go to slide ${i + 1}" data-dot="${i}"></button>`).join('');
  }

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap?.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  root.querySelector('.carousel-arrow.next')?.addEventListener('click', () => { next(); restart(); });
  root.querySelector('.carousel-arrow.prev')?.addEventListener('click', () => { prev(); restart(); });
  dotsWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dot]');
    if (!btn) return;
    goTo(Number(btn.dataset.dot));
    restart();
  });

  function restart() {
    if (!auto) return;
    clearInterval(timer);
    timer = setInterval(next, interval);
  }

  // Swipe support
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); restart(); }
    startX = null;
  }, { passive: true });

  render();
  if (auto) restart();

  return { next, prev, goTo };
}

/** Horizontal card-row carousel (e.g. related products) — scroll-based, uses the row's own arrows. */
export function initCardRow(rootSelector) {
  const root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : rootSelector;
  if (!root) return;
  const row = root.querySelector('.card-carousel');
  if (!row) return;
  const step = () => row.querySelector(':scope > *')?.getBoundingClientRect().width + 20 || 260;
  root.querySelector('.carousel-arrow.next')?.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
  root.querySelector('.carousel-arrow.prev')?.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
}

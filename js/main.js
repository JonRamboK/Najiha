// Najiha Closet — Homepage logic
import { getAllProducts, getFeatured, productCardHTML } from './products.js';
import { wireProductGrid } from './product-interactions.js';
import { hideLoadScreen, initRevealOnScroll, initFloatingButtons } from './ui.js';
import { initCarousel, initCardRow } from './carousel.js';

const CATEGORY_TILES = [
  { key: 'baby', label: 'Baby', img: 'https://picsum.photos/seed/nc-cat-baby/300/300' },
  { key: 'girls', label: 'Girls', img: 'https://picsum.photos/seed/nc-cat-girls/300/300' },
  { key: 'boys', label: 'Boys', img: 'https://picsum.photos/seed/nc-cat-boys/300/300' },
  { key: 'girls', label: 'Party Wear', occasion: 'Party Wear', img: 'https://picsum.photos/seed/nc-cat-party/300/300' },
  { key: 'girls', label: 'Eid Collection', occasion: 'Eid Collection', img: 'https://picsum.photos/seed/nc-cat-eid/300/300' },
  { key: 'all', label: 'Custom Size', custom: true, img: 'https://picsum.photos/seed/nc-cat-custom/300/300' },
];

function renderCategoryStrip() {
  const el = document.getElementById('categoryStrip');
  if (!el) return;
  el.innerHTML = CATEGORY_TILES.map(c => {
    const params = new URLSearchParams();
    if (c.key !== 'all') params.set('category', c.key);
    if (c.occasion) params.set('occasion', c.occasion);
    if (c.custom) params.set('custom', '1');
    return `
      <a class="category-card" href="shop.html?${params.toString()}">
        <div class="cat-img"><img src="${c.img}" alt="${c.label}" loading="lazy"></div>
        <span>${c.label}</span>
      </a>`;
  }).join('');
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const items = getFeatured(8);
  grid.innerHTML = items.map(productCardHTML).join('');
  wireProductGrid(grid);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryStrip();
  renderFeatured();
  initRevealOnScroll();
  initFloatingButtons();
  hideLoadScreen();
  initCarousel('#lookbookCarousel', { auto: true, interval: 5500 });
  initCardRow('.card-carousel-row');

  // Newsletter form
  const form = document.getElementById('newsletterForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input.value.trim()) {
      import('./ui.js').then(({ showToast }) => showToast("You're subscribed! Watch for our latest arrivals."));
      form.reset();
    }
  });

  // Contact-style quick note: total product count for trust stat
  const totalEl = document.getElementById('productCountStat');
  if (totalEl) totalEl.textContent = `${getAllProducts().length}+`;
});

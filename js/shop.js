// Najiha Closet — Shop page logic
import { getAllProducts, filterProducts, sortProducts, productCardHTML, getOccasions } from './products.js';
import { wireProductGrid } from './product-interactions.js';
import { hideLoadScreen, initRevealOnScroll, initFloatingButtons } from './ui.js';

const PAGE_SIZE = 12;
let state = {
  category: 'all',
  occasion: '',
  age: '',
  size: '',
  minPrice: null,
  maxPrice: null,
  customOnly: false,
  search: '',
  sort: 'featured',
  page: 1,
};

function readStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) state.category = params.get('category');
  if (params.get('occasion')) state.occasion = params.get('occasion');
  if (params.get('search')) state.search = params.get('search');
  if (params.get('custom')) state.customOnly = true;
}

function currentResults() {
  const all = getAllProducts();
  const filtered = filterProducts(all, state);
  return sortProducts(filtered, state.sort);
}

function renderPills() {
  const wrap = document.getElementById('filterPills');
  if (!wrap) return;
  const cats = [
    { key: 'all', label: 'All' },
    { key: 'baby', label: 'Baby' },
    { key: 'girls', label: 'Girls' },
    { key: 'boys', label: 'Boys' },
  ];
  wrap.innerHTML = cats.map(c => `<button class="filter-pill ${state.category === c.key ? 'active' : ''}" data-cat="${c.key}">${c.label}</button>`).join('');
  wrap.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      state.page = 1;
      renderPills();
      renderGrid();
    });
  });
}

function renderSidebarOptions() {
  const occWrap = document.getElementById('occasionFilters');
  if (occWrap) {
    occWrap.innerHTML = getOccasions().map(o => `
      <label class="filter-check"><input type="radio" name="occasion" value="${o}" ${state.occasion === o ? 'checked' : ''}> ${o}</label>`).join('')
      + `<label class="filter-check"><input type="radio" name="occasion" value="" ${!state.occasion ? 'checked' : ''}> Any occasion</label>`;
    occWrap.querySelectorAll('input').forEach(inp => inp.addEventListener('change', () => {
      state.occasion = inp.value; state.page = 1; renderGrid();
    }));
  }
  const ageWrap = document.getElementById('ageFilters');
  if (ageWrap) {
    const ages = ['0-3M', '3-6M', '6-9M', '9-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'];
    ageWrap.innerHTML = `<option value="">Any age</option>` + ages.map(a => `<option value="${a}">${a}</option>`).join('');
    ageWrap.addEventListener('change', () => { state.age = ageWrap.value; state.page = 1; renderGrid(); });
  }
  const sizeWrap = document.getElementById('sizeFilters');
  if (sizeWrap) {
    const sizes = ['0-3M', '3-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'];
    sizeWrap.innerHTML = `<option value="">Any size</option>` + sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    sizeWrap.addEventListener('change', () => { state.size = sizeWrap.value; state.page = 1; renderGrid(); });
  }
  const customCheck = document.getElementById('customOnlyFilter');
  if (customCheck) {
    customCheck.checked = state.customOnly;
    customCheck.addEventListener('change', () => { state.customOnly = customCheck.checked; state.page = 1; renderGrid(); });
  }
  const minInput = document.getElementById('minPriceInput');
  const maxInput = document.getElementById('maxPriceInput');
  document.getElementById('applyPriceBtn')?.addEventListener('click', () => {
    state.minPrice = minInput.value ? Number(minInput.value) : null;
    state.maxPrice = maxInput.value ? Number(maxInput.value) : null;
    state.page = 1;
    renderGrid();
  });
}

function renderGrid() {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('resultCount');
  if (!grid) return;

  const results = currentResults();
  const visible = results.slice(0, state.page * PAGE_SIZE);

  if (results.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <i class="fa-solid fa-shirt"></i>
      <h3>No products match those filters</h3>
      <p>Try clearing a filter or searching a different term.</p>
    </div>`;
  } else {
    grid.innerHTML = visible.map(productCardHTML).join('');
  }
  grid.dataset.wired = '';
  wireProductGrid(grid);

  if (countEl) countEl.textContent = `${results.length} product${results.length !== 1 ? 's' : ''}`;

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = visible.length < results.length ? 'inline-flex' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  readStateFromURL();
  renderPills();
  renderSidebarOptions();
  renderGrid();
  initRevealOnScroll();
  initFloatingButtons();
  hideLoadScreen();

  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => { state.sort = sortSelect.value; renderGrid(); });

  const searchInput = document.getElementById('shopSearchInput');
  if (searchInput) {
    searchInput.value = state.search;
    let t;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.search = searchInput.value; state.page = 1; renderGrid(); }, 250);
    });
  }

  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    state.page += 1;
    renderGrid();
  });

  document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
    state = { category: 'all', occasion: '', age: '', size: '', minPrice: null, maxPrice: null, customOnly: false, search: '', sort: 'featured', page: 1 };
    document.getElementById('minPriceInput').value = '';
    document.getElementById('maxPriceInput').value = '';
    if (searchInput) searchInput.value = '';
    renderPills();
    renderSidebarOptions();
    renderGrid();
  });
});

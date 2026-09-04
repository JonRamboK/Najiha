// Najiha Closet — Products module
// Wraps PRODUCTS (js/products-data.js) with filtering/sorting/formatting helpers,
// plus admin CRUD used by admin.js.
//
// DEMO_MODE (see config.js): admin-added/edited products are kept in localStorage
// and merged on top of the static catalog, so the admin panel works with no
// Firebase project connected. Once real Firebase config is pasted into config.js,
// the exact same functions read/write the "products" Firestore collection instead
// — no other file needs to change.

import { PRODUCTS } from './products-data.js';
import { DEMO_MODE } from './config.js';

export const CATEGORIES = [
  { id: 'baby', label: 'Baby' },
  { id: 'girls', label: 'Girls' },
  { id: 'boys', label: 'Boys' },
];

const LOCAL_KEY = 'nc_admin_products';

function readLocalOverrides() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; } catch { return {}; }
}
function writeLocalOverrides(map) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
}

/** Merges the static catalog with any demo-mode admin additions/edits (deletions hide the base item). */
function mergedProducts() {
  const overrides = readLocalOverrides();
  const base = PRODUCTS.filter(p => overrides[p.id]?._deleted !== true)
    .map(p => (overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
  const added = Object.entries(overrides)
    .filter(([id, v]) => v._new && !v._deleted && !PRODUCTS.some(p => p.id === id))
    .map(([id, v]) => ({ id, rating: 5, stock: 10, sizes: [], ...v }));
  return [...added, ...base];
}

// ------------------------------------------------------------
// Live Firestore cache (only active once real Firebase config is
// pasted into config.js — DEMO_MODE becomes false). Keeps
// getAllProducts() synchronous for every existing call-site while
// still reflecting admin.js changes in real time.
// ------------------------------------------------------------
let liveProducts = null;

if (!DEMO_MODE) {
  import('./firebase-core.js').then(({ db, collection, onSnapshot }) => {
    onSnapshot(collection(db, 'products'), (snap) => {
      liveProducts = snap.docs.map(d => ({ id: d.id, rating: 5, ...d.data() }));
      document.dispatchEvent(new CustomEvent('nc:products-updated'));
    });
  });
}

export function getAllProducts() {
  if (!DEMO_MODE && liveProducts) return liveProducts;
  return mergedProducts();
}

export function getProductById(id) {
  return mergedProducts().find(p => p.id === id) || null;
}

/* ---------- Admin CRUD (used by admin.js) ---------- */

export async function addProduct(data) {
  if (!DEMO_MODE) {
    const { db, collection, addDoc, serverTimestamp } = await import('./firebase-core.js');
    return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
  }
  const overrides = readLocalOverrides();
  const id = 'p_' + Date.now().toString(36);
  overrides[id] = { ...data, _new: true };
  writeLocalOverrides(overrides);
  document.dispatchEvent(new CustomEvent('nc:products-updated'));
}

export async function updateProduct(id, data) {
  if (!DEMO_MODE) {
    const { db, doc, updateDoc } = await import('./firebase-core.js');
    return updateDoc(doc(db, 'products', id), data);
  }
  const overrides = readLocalOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...data };
  writeLocalOverrides(overrides);
  document.dispatchEvent(new CustomEvent('nc:products-updated'));
}

export async function deleteProduct(id) {
  if (!DEMO_MODE) {
    const { db, doc, deleteDoc } = await import('./firebase-core.js');
    return deleteDoc(doc(db, 'products', id));
  }
  const overrides = readLocalOverrides();
  overrides[id] = { ...(overrides[id] || {}), _deleted: true };
  writeLocalOverrides(overrides);
  document.dispatchEvent(new CustomEvent('nc:products-updated'));
}

export function getFeatured(limit = 8) {
  return [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getCategories() {
  return [
    { key: 'all', label: 'All' },
    { key: 'baby', label: 'Baby' },
    { key: 'girls', label: 'Girls' },
    { key: 'boys', label: 'Boys' },
  ];
}

export function getOccasions() {
  return [...new Set(PRODUCTS.map(p => p.occasion))];
}

export function filterProducts(products, filters = {}) {
  let result = [...products];

  if (filters.category && filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters.occasion) {
    result = result.filter(p => p.occasion === filters.occasion);
  }
  if (filters.age) {
    result = result.filter(p => p.ageGroup === filters.age);
  }
  if (filters.size) {
    result = result.filter(p => p.sizes.includes(filters.size));
  }
  if (filters.minPrice != null) {
    result = result.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice != null) {
    result = result.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.customOnly) {
    result = result.filter(p => p.customSize);
  }
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.occasion.toLowerCase().includes(q)
    );
  }
  return result;
}

export function sortProducts(products, sortBy = 'featured') {
  const result = [...products];
  switch (sortBy) {
    case 'newest':
      return result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
    case 'price-low':
      return result.sort((a, b) => a.price - b.price);
    case 'price-high':
      return result.sort((a, b) => b.price - a.price);
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating);
    default:
      return result;
  }
}

export function formatPrice(n) {
  return 'Rs. ' + Number(n).toLocaleString('en-PK');
}

/**
 * Renders a single product card. Returns an HTML string.
 */
export function productCardHTML(p) {
  const badge = p.badge ? `<span class="product-badge ${p.badge}">${p.badge}</span>` : '';
  const compare = p.comparePrice > p.price
    ? `<span class="price-compare">${formatPrice(p.comparePrice)}</span>` : '';
  const outOfStock = p.stock === 0;
  return `
  <div class="product-card ${outOfStock ? 'out-of-stock' : ''}" data-id="${p.id}">
    <div class="product-thumb">
      <a href="product.html?id=${p.id}" aria-label="View ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="quick-view-btn">Quick view</span>
      </a>
      ${badge}
      <button class="wishlist-btn" data-wishlist="${p.id}" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.category} · ${p.occasion}</span>
      <a href="product.html?id=${p.id}" class="product-name-link"><h3 class="product-name">${p.name}</h3></a>
      <span class="product-meta">Age ${p.ageGroup} · Sizes ${p.sizes.join(', ')}</span>
      <div class="product-price-row">
        <span class="price-now">${formatPrice(p.price)}</span>
        ${compare}
      </div>
      ${outOfStock ? '<span class="stock-note">Out of stock</span>' : (p.customSize ? '<span class="stock-note">Custom size available</span>' : '')}
      <div class="product-actions">
        <a href="product.html?id=${p.id}" class="btn btn-outline">View Details</a>
        <button class="btn btn-primary" data-apply="${p.id}">${outOfStock ? 'Notify Me' : 'Apply / Order'}</button>
      </div>
    </div>
  </div>`;
}

// Najiha Closet — Cart & wishlist (localStorage-backed demo store)
// Cart items are denormalized (id, name, image, price, size, qty) so the cart
// page never needs to look products back up. Swap read()/write() for Firestore
// once you want carts to sync across a signed-in user's devices — every other
// file (cart-page.js, navbar.js, product pages) keeps working unchanged.

const CART_KEY = 'nc_cart_v1';
const WISHLIST_KEY = 'nc_wishlist';
const RECENT_KEY = 'nc_recent';

function read(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(key, val, eventName) {
  localStorage.setItem(key, JSON.stringify(val));
  if (eventName) document.dispatchEvent(new CustomEvent(eventName));
}

/* ---------- Cart ---------- */

export function getCartItems() {
  return read(CART_KEY);
}

/** Back-compat alias used by older modules. */
export function getCart() { return getCartItems(); }

export function addToCart(product, size = '', qty = 1) {
  const items = getCartItems();
  const existing = items.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
      qty,
    });
  }
  write(CART_KEY, items, 'nc-cart-updated');
  document.dispatchEvent(new CustomEvent('nc:cart-updated'));
}

export function removeFromCart(id, size = '') {
  const items = getCartItems().filter(i => !(i.id === id && i.size === size));
  write(CART_KEY, items, 'nc-cart-updated');
  document.dispatchEvent(new CustomEvent('nc:cart-updated'));
}

export function updateQty(id, size = '', qty = 1) {
  const items = getCartItems();
  const item = items.find(i => i.id === id && i.size === size);
  if (item) item.qty = Math.max(1, qty);
  write(CART_KEY, items, 'nc-cart-updated');
  document.dispatchEvent(new CustomEvent('nc:cart-updated'));
}

export function getCartTotal() {
  return getCartItems().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount() {
  return getCartItems().reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart() {
  write(CART_KEY, [], 'nc-cart-updated');
  document.dispatchEvent(new CustomEvent('nc:cart-updated'));
}

/* ---------- Wishlist ---------- */
export function getWishlist() { return read(WISHLIST_KEY); }

export function toggleWishlist(productId) {
  let list = getWishlist();
  if (list.includes(productId)) list = list.filter(id => id !== productId);
  else list.push(productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('nc:wishlist-updated'));
  return list.includes(productId);
}

export function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

/* ---------- Recently viewed ---------- */
export function pushRecentlyViewed(productId) {
  let list = read(RECENT_KEY).filter(id => id !== productId);
  list.unshift(productId);
  list = list.slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}
export function getRecentlyViewed() { return read(RECENT_KEY); }

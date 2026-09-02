// Najiha Closet — Auth state helper
// Thin wrapper around firebase-core.js so older modules (product-interactions.js,
// product.html) can check login state without importing the whole Firebase surface.

import { auth, onAuthReady } from './firebase-core.js';

export function isLoggedIn() {
  return !!auth.currentUser;
}

export { onAuthReady };

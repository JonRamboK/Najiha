// Najiha Closet — Product card interactions (event delegation)
// Wires up [data-apply] and [data-wishlist] buttons inside any container.
import { isLoggedIn } from './auth-state.js';
import { openLoginRequiredModal, showToast } from './ui.js';
import { toggleWishlist, isWishlisted } from './cart.js';

export function wireProductGrid(container) {
  if (!container || container.dataset.wired) return;
  container.dataset.wired = '1';

  container.addEventListener('click', (e) => {
    const applyBtn = e.target.closest('[data-apply]');
    if (applyBtn) {
      e.preventDefault();
      const id = applyBtn.dataset.apply;
      if (!isLoggedIn()) {
        openLoginRequiredModal(`application.html?product=${id}`);
      } else {
        window.location.href = `application.html?product=${id}`;
      }
      return;
    }
    const wishBtn = e.target.closest('[data-wishlist]');
    if (wishBtn) {
      e.preventDefault();
      const id = wishBtn.dataset.wishlist;
      const active = toggleWishlist(id);
      wishBtn.classList.toggle('active', active);
      wishBtn.querySelector('i').className = active ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      showToast(active ? 'Added to wishlist' : 'Removed from wishlist');
      return;
    }
    // Demo mode: viewing a product's full detail page requires an account.
    // Browsing the grid itself stays open to everyone.
    const detailLink = e.target.closest('a[href^="product.html"]');
    if (detailLink && !isLoggedIn()) {
      e.preventDefault();
      openLoginRequiredModal(detailLink.getAttribute('href'));
    }
  });

  // Reflect wishlist state on initial render
  container.querySelectorAll('[data-wishlist]').forEach(btn => {
    const id = btn.dataset.wishlist;
    if (isWishlisted(id)) {
      btn.classList.add('active');
      btn.querySelector('i').className = 'fa-solid fa-heart';
    }
  });
}

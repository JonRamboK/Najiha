// Najiha Closet — Navbar component
// Renders immediately with logo/links/cart so the nav is never blank, then
// upgrades in place once Firebase auth state resolves. Firebase is wrapped
// in try/catch: if it fails to load (blocked network, ad-blocker, bad
// config) the navbar still works — it just won't know who's logged in.








// import { cartCount } from './cart.js';

// let liveUser = null;
// let isAdmin = false;

// (async () => {
//   try {
//     const fb = await import('./firebase-core.js');
//     fb.onAuthReady((user) => {
//       liveUser = user;
//       isAdmin = user ? fb.isAdminEmail(user.email) : false;
//       render();
//     });
//     window.__ncLogout = () => {
//       fb.signOut(fb.auth).then(() => {
//         fb.showToast('You have been logged out.');
//         window.location.href = 'index.html';
//       });
//     };
//   } catch (err) {
//     console.error('Firebase failed to load — navbar will render as logged-out.', err);
//   }
// })();

// function getCurrentUser() {
//   if (!liveUser) return null;
//   return {
//     name: liveUser.displayName || liveUser.email?.split('@')[0] || 'Account',
//     email: liveUser.email || '',
//     isAdmin,
//   };
// }

// function logout() {
//   if (window.__ncLogout) window.__ncLogout();
// }

// const NAV_LINKS = [
//   { href: 'index.html', label: 'Home' },
//   { href: 'shop.html', label: 'Shop' },
//   { href: 'categories.html', label: 'Categories' },
//   { href: 'custom-size.html', label: 'Custom Size' },
//   { href: 'gallery.html', label: 'Gallery' },
//   { href: 'videos.html', label: 'Videos' },
//   { href: 'about.html', label: 'About' },
//   { href: 'contact.html', label: 'Contact' },
// ];

// function currentPage() {
//   const p = window.location.pathname.split('/').pop();
//   return p === '' ? 'index.html' : p;
// }

// function linksHTML() {
//   const cur = currentPage();
//   return NAV_LINKS.map(l => `<li><a href="${l.href}" class="${l.href === cur ? 'active' : ''}">${l.label}</a></li>`).join('');
// }

// function userChipHTML(user) {
//   if (!user) {
//     return `
//       <a href="login.html" class="btn btn-outline btn-sm">Login</a>
//       <a href="register.html" class="btn btn-primary btn-sm">Register</a>`;
//   }
//   const initial = (user.name || 'U').trim().charAt(0).toUpperCase();
//   return `
//     <div style="position:relative;">
//       <button class="nav-user-chip" id="userChipBtn" type="button">
//         <span class="avatar">${initial}</span>
//         <span>${(user.name || 'Account').split(' ')[0]}</span>
//         <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
//       </button>
//       <div id="userDropdown" class="nav-user-dropdown">
//         ${user.isAdmin ? '<a href="admin.html" style="display:block;padding:10px 12px;border-radius:8px;font-size:13.5px;font-weight:700;color:var(--rose-gold-dark);">Admin Dashboard</a>' : ''}
//         <a href="cart.html" style="display:block;padding:10px 12px;border-radius:8px;font-size:13.5px;font-weight:600;">My Cart</a>
//         <a href="custom-size.html" style="display:block;padding:10px 12px;border-radius:8px;font-size:13.5px;font-weight:600;">Custom Measurements</a>
//         <button id="navLogoutBtn" type="button" style="width:100%;text-align:left;padding:10px 12px;border-radius:8px;font-size:13.5px;font-weight:700;color:#c0524f;background:none;border:none;">Logout</button>
//       </div>
//     </div>`;
// }

// let eventsWired = false;

// function render() {
//   const mount = document.getElementById('site-navbar');
//   if (!mount) return;

//   const user = getCurrentUser();
//   let count = 0;
//   try { count = cartCount(); } catch { /* ignore */ }

//   mount.innerHTML = `
//     <div class="announce-bar">STYLE WITH ELEGANCE — Free delivery in Karachi on orders above Rs. 4,000</div>
//     <nav class="navbar">
//       <div class="navbar-inner">
//         <a href="index.html" class="nav-logo">
//           <img src="assets/logo.png" alt="Najiha Closet" onerror="this.style.display='none'">
//           <span>Najiha Closet</span>
//         </a>
//         <ul class="nav-links">${linksHTML()}</ul>
//         <div class="nav-actions">
//           <button class="nav-icon-btn" id="navSearchBtn" type="button" aria-label="Search"><i class="fa-solid fa-magnifying-glass"></i></button>
//           <a href="cart.html" class="nav-icon-btn" aria-label="Cart">
//             <i class="fa-solid fa-bag-shopping"></i>
//             ${count > 0 ? `<span class="cart-count">${count}</span>` : ''}
//           </a>
//           <div class="nav-desktop-auth" style="display:flex;align-items:center;gap:10px;">${userChipHTML(user)}</div>
//           <button class="nav-toggle" id="navToggleBtn" type="button" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
//         </div>
//       </div>
//     </nav>
//     <div class="mobile-drawer" id="mobileDrawer">
//       <div class="mobile-drawer-overlay" id="drawerOverlay"></div>
//       <div class="mobile-drawer-panel">
//         <button class="mobile-drawer-close" id="drawerClose" type="button"><i class="fa-solid fa-xmark"></i></button>
//         <div class="nav-logo" style="margin-bottom:24px;">
//           <img src="assets/logo.png" alt="Najiha Closet" style="height:36px;" onerror="this.style.display='none'">
//           <span>Najiha Closet</span>
//         </div>
//         <ul class="nav-links">${linksHTML()}</ul>
//         <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">${userChipHTML(user)}</div>
//       </div>
//     </div>
//     <div class="modal-overlay" id="searchModal">
//       <div class="modal-box" style="max-width:520px;">
//         <button class="modal-close" data-close-modal type="button"><i class="fa-solid fa-xmark"></i></button>
//         <h3 style="font-size:19px;margin-bottom:16px;">Search products</h3>
//         <div class="input-wrapper">
//           <i class="fa-solid fa-magnifying-glass"></i>
//           <input type="text" id="navSearchInput" placeholder="Search dresses, sets, sizes..." class="modal-search-input">
//         </div>
//       </div>
//     </div>
//   `;

//   wireEvents(mount);
// }

// // Event delegation on the mount element instead of re-binding fresh
// // listeners on every render — avoids listener buildup across repeated
// // renders (auth resolving, cart updates, etc.) and keeps behaviour correct
// // no matter how many times render() runs.
// function wireEvents(mount) {
//   if (eventsWired) return;
//   eventsWired = true;

//   mount.addEventListener('click', (e) => {
//     const drawer = document.getElementById('mobileDrawer');
//     const searchModal = document.getElementById('searchModal');

//     if (e.target.closest('#navToggleBtn')) { drawer?.classList.add('open'); return; }
//     if (e.target.closest('#drawerClose') || e.target.id === 'drawerOverlay') { drawer?.classList.remove('open'); return; }

//     if (e.target.closest('#userChipBtn')) {
//       e.stopPropagation();
//       const dropdown = document.getElementById('userDropdown');
//       if (dropdown) dropdown.classList.toggle('open');
//       return;
//     }

//     if (e.target.closest('#navLogoutBtn')) { logout(); return; }

//     if (e.target.closest('#navSearchBtn')) {
//       searchModal?.classList.add('open');
//       setTimeout(() => document.getElementById('navSearchInput')?.focus(), 100);
//       return;
//     }
//     if (e.target === searchModal || e.target.closest('[data-close-modal]')) {
//       searchModal?.classList.remove('open');
//     }
//   });

//   document.addEventListener('click', (e) => {
//     if (!e.target.closest('#userChipBtn')) {
//       document.getElementById('userDropdown')?.classList.remove('open');
//     }
//   });

//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && e.target.id === 'navSearchInput' && e.target.value.trim()) {
//       window.location.href = `shop.html?search=${encodeURIComponent(e.target.value.trim())}`;
//     }
//   });
// }

// function boot() {
//   render();
//   document.addEventListener('nc:cart-updated', render);
//   document.addEventListener('nc-cart-updated', render);
// }


// If this script loads/executes after DOMContentLoaded already fired
// (slow network, deferred module fetch), the event would never come —
// so check readyState directly instead of only listening for the event.


// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', boot);
// } else {
//   boot();
// }


// ------------Add the new Js file --------------------




// Najiha Closet — Responsive Navbar
import { cartCount } from './cart.js';

let liveUser = null;
let isAdmin = false;
let eventsWired = false;

// --------------------------------------------------
// Firebase Authentication
// --------------------------------------------------
(async () => {
  try {
    const fb = await import('./firebase-core.js');

    fb.onAuthReady((user) => {
      liveUser = user;
      isAdmin = user ? fb.isAdminEmail(user.email) : false;
      render();
    });

    window.__ncLogout = async () => {
      try {
        await fb.signOut(fb.auth);
        fb.showToast('You have been logged out.');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  } catch (error) {
    console.error(
      'Firebase failed to load — navbar will work as logged-out:',
      error
    );
  }
})();

// --------------------------------------------------
// User
// --------------------------------------------------
function getCurrentUser() {
  if (!liveUser) return null;

  return {
    name:
      liveUser.displayName ||
      liveUser.email?.split('@')[0] ||
      'Account',

    email: liveUser.email || '',
    isAdmin
  };
}

function logout() {
  if (typeof window.__ncLogout === 'function') {
    window.__ncLogout();
  }
}

// --------------------------------------------------
// Navigation Links
// --------------------------------------------------
const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'shop.html', label: 'Shop' },
  { href: 'categories.html', label: 'Categories' },
  { href: 'custom-size.html', label: 'Custom Size' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'videos.html', label: 'Videos' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' }
];

// --------------------------------------------------
// Current Page
// --------------------------------------------------
function currentPage() {
  let page = window.location.pathname.split('/').pop();

  if (!page || page === '/') {
    page = 'index.html';
  }

  return page.toLowerCase();
}

// --------------------------------------------------
// Navigation HTML
// --------------------------------------------------
function linksHTML() {
  const current = currentPage();

  return NAV_LINKS.map((link) => {
    const active =
      link.href.toLowerCase() === current ? 'active' : '';

    return `
      <li>
        <a href="${link.href}" class="${active}">
          ${link.label}
        </a>
      </li>
    `;
  }).join('');
}

// --------------------------------------------------
// User Area
// --------------------------------------------------
function userChipHTML(user, mobile = false) {
  if (!user) {
    return `
      <div class="nav-auth-buttons ${mobile ? 'mobile-auth-buttons' : ''}">
        <a href="login.html" class="btn btn-outline btn-sm">
          Login
        </a>

        <a href="register.html" class="btn btn-primary btn-sm">
          Register
        </a>
      </div>
    `;
  }

  const initial = (user.name || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  return `
    <div class="nav-user-wrapper">

      <button
        class="nav-user-chip"
        id="${mobile ? 'mobileUserChipBtn' : 'userChipBtn'}"
        type="button"
        aria-expanded="false"
      >
        <span class="avatar">${initial}</span>

        <span class="nav-user-name">
          ${(user.name || 'Account').split(' ')[0]}
        </span>

        <i class="fa-solid fa-chevron-down"></i>
      </button>

      <div
        id="${mobile ? 'mobileUserDropdown' : 'userDropdown'}"
        class="nav-user-dropdown"
      >

        ${
          user.isAdmin
            ? `
              <a href="admin.html">
                <i class="fa-solid fa-gauge-high"></i>
                Admin Dashboard
              </a>
            `
            : ''
        }

        <a href="cart.html">
          <i class="fa-solid fa-bag-shopping"></i>
          My Cart
        </a>

        <a href="custom-size.html">
          <i class="fa-solid fa-ruler-combined"></i>
          Custom Measurements
        </a>

        <button
          id="${mobile ? 'mobileNavLogoutBtn' : 'navLogoutBtn'}"
          type="button"
        >
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>

      </div>
    </div>
  `;
}

// --------------------------------------------------
// Main Render
// --------------------------------------------------
function render() {
  const mount = document.getElementById('site-navbar');

  if (!mount) return;

  const user = getCurrentUser();

  let count = 0;

  try {
    count = cartCount();
  } catch {
    count = 0;
  }

  mount.innerHTML = `

    <!-- Announcement -->
    // <div class="announce-bar">
    //   <div class="announce-inner">
    //     <span>
    //       STYLE WITH ELEGANCE
    //     </span>

    //     <span class="announce-separator">•</span>

    //     <span>
    //       Free delivery in Karachi on orders above Rs. 4,000
    //     </span>
    //   </div>
    // </div>

    <!-- Navbar -->
    <nav class="navbar">

      <div class="navbar-inner">

        <!-- Logo -->
        <a href="index.html" class="nav-logo">

          <img
            src="assets/logo.png"
            alt="Najiha Closet Logo"
            onerror="this.style.display='none'"
          >

          <span>Najiha Closet</span>

        </a>

        <!-- Desktop Navigation -->
        <ul class="nav-links">
          ${linksHTML()}
        </ul>

        <!-- Actions -->
        <div class="nav-actions">

          <!-- Search -->
          <button
            class="nav-icon-btn"
            id="navSearchBtn"
            type="button"
            aria-label="Search"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>

          <!-- Cart -->
          <a
            href="cart.html"
            class="nav-icon-btn cart-btn"
            aria-label="Shopping Cart"
          >
            <i class="fa-solid fa-bag-shopping"></i>

            ${
              count > 0
                ? `<span class="cart-count">${count}</span>`
                : ''
            }
          </a>

          <!-- Desktop Account -->
          <div class="nav-desktop-auth">
            ${userChipHTML(user)}
          </div>

          <!-- Mobile Menu -->
          <button
            class="nav-toggle"
            id="navToggleBtn"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
          >
            <i class="fa-solid fa-bars"></i>
          </button>

        </div>

      </div>

    </nav>

    <!-- Mobile Drawer -->
    <div
      class="mobile-drawer"
      id="mobileDrawer"
      aria-hidden="true"
    >

      <div
        class="mobile-drawer-overlay"
        id="drawerOverlay"
      ></div>

      <aside class="mobile-drawer-panel">

        <!-- Drawer Header -->
        <div class="mobile-drawer-header">

          <a href="index.html" class="nav-logo">

            <img
              src="assets/logo.png"
              alt="Najiha Closet Logo"
              onerror="this.style.display='none'"
            >

            <span>Najiha Closet</span>

          </a>

          <button
            class="mobile-drawer-close"
            id="drawerClose"
            type="button"
            aria-label="Close menu"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

        </div>

        <!-- Mobile Navigation -->
        <ul class="mobile-nav-links">
          ${linksHTML()}
        </ul>

        <!-- Mobile Account -->
        <div class="mobile-account">
          ${userChipHTML(user, true)}
        </div>

      </aside>

    </div>

    <!-- Search Modal -->
    <div
      class="modal-overlay"
      id="searchModal"
      aria-hidden="true"
    >

      <div class="modal-box nav-search-box">

        <button
          class="modal-close"
          data-close-modal
          type="button"
          aria-label="Close search"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <h3>
          Search Products
        </h3>

        <p class="search-help">
          Search dresses, sets, sizes and more.
        </p>

        <div class="input-wrapper">

          <i class="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            id="navSearchInput"
            placeholder="Search dresses, sets, sizes..."
            class="modal-search-input"
            autocomplete="off"
          >

        </div>

      </div>

    </div>
  `;

  wireEvents(mount);
}

// --------------------------------------------------
// Events
// --------------------------------------------------
function wireEvents(mount) {
  if (eventsWired) return;

  eventsWired = true;

  mount.addEventListener('click', (event) => {

    // Open mobile menu
    if (event.target.closest('#navToggleBtn')) {
      openDrawer();
      return;
    }

    // Close mobile menu
    if (
      event.target.closest('#drawerClose') ||
      event.target.id === 'drawerOverlay'
    ) {
      closeDrawer();
      return;
    }

    // Desktop user menu
    if (event.target.closest('#userChipBtn')) {
      event.stopPropagation();

      const button = document.getElementById('userChipBtn');
      const dropdown = document.getElementById('userDropdown');

      if (dropdown) {
        const isOpen = dropdown.classList.toggle('open');
        button?.setAttribute('aria-expanded', String(isOpen));
      }

      return;
    }

    // Mobile user menu
    if (event.target.closest('#mobileUserChipBtn')) {
      event.stopPropagation();

      const button =
        document.getElementById('mobileUserChipBtn');

      const dropdown =
        document.getElementById('mobileUserDropdown');

      if (dropdown) {
        const isOpen = dropdown.classList.toggle('open');

        button?.setAttribute(
          'aria-expanded',
          String(isOpen)
        );
      }

      return;
    }

    // Logout
    if (
      event.target.closest('#navLogoutBtn') ||
      event.target.closest('#mobileNavLogoutBtn')
    ) {
      logout();
      return;
    }

    // Search
    if (event.target.closest('#navSearchBtn')) {
      openSearch();
      return;
    }

    // Close search
    const searchModal =
      document.getElementById('searchModal');

    if (
      event.target === searchModal ||
      event.target.closest('[data-close-modal]')
    ) {
      closeSearch();
      return;
    }

    // Close drawer when clicking a mobile navigation link
    if (
      event.target.closest('.mobile-nav-links a')
    ) {
      closeDrawer();
    }
  });

  // Global click
  document.addEventListener('click', (event) => {

    if (
      !event.target.closest('#userChipBtn')
    ) {
      closeDropdown('userDropdown');
    }

    if (
      !event.target.closest('#mobileUserChipBtn')
    ) {
      closeDropdown('mobileUserDropdown');
    }
  });

  // Keyboard
  document.addEventListener('keydown', (event) => {

    // Search Enter
    if (
      event.key === 'Enter' &&
      event.target.id === 'navSearchInput'
    ) {
      const query = event.target.value.trim();

      if (query) {
        window.location.href =
          `shop.html?search=${encodeURIComponent(query)}`;
      }
    }

    // ESC
    if (event.key === 'Escape') {
      closeDrawer();
      closeSearch();
      closeDropdown('userDropdown');
      closeDropdown('mobileUserDropdown');
    }
  });

  // Resize protection
  window.addEventListener('resize', () => {

    if (window.innerWidth > 900) {
      closeDrawer();
    }
  });
}

// --------------------------------------------------
// Drawer
// --------------------------------------------------
function openDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const button = document.getElementById('navToggleBtn');

  if (!drawer) return;

  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');

  button?.setAttribute('aria-expanded', 'true');

  document.body.classList.add('nav-menu-open');
}

function closeDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const button = document.getElementById('navToggleBtn');

  if (!drawer) return;

  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');

  button?.setAttribute('aria-expanded', 'false');

  document.body.classList.remove('nav-menu-open');
}

// --------------------------------------------------
// Search
// --------------------------------------------------
function openSearch() {
  const modal = document.getElementById('searchModal');

  if (!modal) return;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    document.getElementById('navSearchInput')?.focus();
  }, 100);
}

function closeSearch() {
  const modal = document.getElementById('searchModal');

  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

// --------------------------------------------------
// Dropdown
// --------------------------------------------------
function closeDropdown(id) {
  const dropdown = document.getElementById(id);

  if (dropdown) {
    dropdown.classList.remove('open');
  }
}

// --------------------------------------------------
// Boot
// --------------------------------------------------
function boot() {
  render();

  document.addEventListener(
    'nc:cart-updated',
    render
  );

  document.addEventListener(
    'nc-cart-updated',
    render
  );
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    boot
  );
} else {
  boot();
}

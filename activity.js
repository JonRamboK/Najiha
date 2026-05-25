/**
 * ═══════════════════════════════════════════════════════════
 * NAJIHA — Activity / View Layer (activity.js)
 * Renders shared UI components and wires up interactions.
 * Depends on model.js being loaded first.
 * ═══════════════════════════════════════════════════════════
 */

const NajihaActivity = (() => {

  /* ───────────────────────────────────────────────────────
   * UTILITIES
   * ─────────────────────────────────────────────────────── */
  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

  function formatPrice(n) { return '$' + Number(n).toFixed(2); }

  function stars(rating) {
    const full  = Math.floor(rating);
    const half  = (rating % 1) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  /* ───────────────────────────────────────────────────────
   * TOAST NOTIFICATIONS
   * ─────────────────────────────────────────────────────── */
  function showToast(msg) {
    let stack = $('#toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ───────────────────────────────────────────────────────
   * NAVBAR
   * Renders the shared top nav into #nav-mount
   * ─────────────────────────────────────────────────────── */
  function mountNav(activePage = '') {
    const mount = $('#nav-mount');
    if (!mount) return;

    const user = NajihaModel.Auth.currentUser();
    const cartCount = NajihaModel.Cart.count();

    const links = NajihaModel.NAV_LINKS.map(l =>
      `<li><a href="${l.href}" class="${l.href.includes(activePage) ? 'active' : ''}">${l.label}</a></li>`
    ).join('');

    const authHtml = user
      ? `<div style="display:flex;align-items:center;gap:10px;">
           <span style="font-size:8px;color:var(--ink-soft);">👤 ${user.name}</span>
           <button class="btn-pill btn-pill-outline" id="nav-logout">Logout</button>
         </div>`
      : `<a href="index.html" class="btn-pill btn-pill-rose">Sign In</a>`;

    mount.innerHTML = `
      <nav class="nav-shell" id="main-nav">
        <a href="Home.html" class="nav-logo">Na<em>jiha</em></a>
        <ul class="nav-links">${links}</ul>
        <div class="nav-actions">
          <input class="nav-search" type="search" placeholder="Search products…" id="nav-search-input" />
          <a href="payment.html" class="btn-pill btn-pill-outline" id="nav-cart-btn">
            🛍 Cart <span id="nav-cart-count" style="background:var(--rose);color:#fff;border-radius:99px;padding:1px 7px;font-size:11px;margin-left:2px;">${cartCount || ''}</span>
          </a>
          ${authHtml}
          <button class="nav-hamburger" id="nav-ham" aria-label="Menu">☰</button>
        </div>
      </nav>
      <div class="nav-mobile-drawer" id="nav-drawer">
        ${NajihaModel.NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
        ${user ? `<a href="#" id="drawer-logout">Logout (${user.name})</a>` : '<a href="index.html">Sign In</a>'}
      </div>
    `;

    // Scroll shadow
    window.addEventListener('scroll', () => {
      document.getElementById('main-nav')?.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Hamburger
    $('#nav-ham')?.addEventListener('click', () => {
      $('#nav-drawer')?.classList.toggle('open');
    });

    // Logout
    $('#nav-logout')?.addEventListener('click', () => {
      NajihaModel.Auth.logout(); location.reload();
    });
    $('#drawer-logout')?.addEventListener('click', e => {
      e.preventDefault(); NajihaModel.Auth.logout(); location.reload();
    });

    // Search
    let searchTimer;
    $('#nav-search-input')?.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const q = e.target.value.trim();
        if (q.length > 1) document.dispatchEvent(new CustomEvent('search:query', { detail: q }));
        if (!q) document.dispatchEvent(new CustomEvent('search:clear'));
      }, 300);
    });

    // Cart count sync
    document.addEventListener('cart:updated', ({ detail }) => {
      const el = $('#nav-cart-count');
      if (el) el.textContent = detail.cart.reduce((s, i) => s + (i.qty || 1), 0) || '';
    });
  }

  /* ───────────────────────────────────────────────────────
   * SOCIAL FLOAT BAR
   * ─────────────────────────────────────────────────────── */
  function mountSocialFloat() {
    const wrap = document.createElement('div');
    const socials = NajihaModel.SOCIAL_LINKS.map(s =>
      `<a href="${s.href}" target="_blank" rel="noopener noreferrer" class="${s.cls}" title="${s.label}">
         <i class="fa-brands ${s.icon}"></i>
       </a>`
    ).join('');

    wrap.innerHTML = `
      <div class="social-float-bar" id="social-bar">${socials}</div>
      <button class="social-float-btn" id="social-toggle" aria-label="Social links">
        <i class="fa-solid fa-share-nodes"></i>
      </button>
    `;
    document.body.appendChild(wrap);

    $('#social-toggle')?.addEventListener('click', () => {
      $('#social-bar')?.classList.toggle('active');
      $('#social-toggle')?.classList.toggle('active');
    });
  }

  /* ───────────────────────────────────────────────────────
   * FOOTER
   * ─────────────────────────────────────────────────────── */
  function mountFooter() {
    const mount = $('#footer-mount');
    if (!mount) return;

    const socials = NajihaModel.SOCIAL_LINKS.map(s =>
      `<a href="${s.href}" class="social-icon" target="_blank" title="${s.label}">
         <i class="fa-brands ${s.icon}"></i>
       </a>`
    ).join('');

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Na<em>jiha</em></div>
            <p class="footer-desc">Handpicked children's clothing for every occasion. Quality, charm, and style — made for the little ones who mean the world.</p>
            <div class="footer-socials">${socials}</div>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Dresses</a></li>
              <li><a href="#">Sets & Rompers</a></li>
              <li><a href="#">Sale</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#contact-section">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Najiha</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Najiha. All rights reserved.</span>
          <span>Made with ♥ in Karachi, Pakistan</span>
        </div>
      </footer>
    `;
  }

  /* ───────────────────────────────────────────────────────
   * NEWSLETTER SECTION
   * ─────────────────────────────────────────────────────── */
  function mountNewsletter() {
    const mount = $('#newsletter-mount');
    if (!mount) return;

    mount.innerHTML = `
      <section style="background:var(--rose);padding:60px 5%;text-align:center;">
        <p class="label" style="color:rgba(255,255,255,0.75);">Stay in the loop</p>
        <h2 style="font-family:var(--font-display);font-size:36px;color:white;margin-bottom:8px;font-weight:600;">Join Our Secret Society</h2>
        <p style="color:rgba(255,255,255,0.8);margin-bottom:2rem;font-size:15px;">Get early access to new drops, exclusive offers, and styling tips.</p>
        <form id="newsletter-form" style="display:flex;max-width:480px;margin:0 auto;background:white;border-radius:9999px;overflow:hidden;padding:4px;">
          <input type="email" placeholder="Your email address" required
            style="flex:1;border:none;padding:12px 20px;font-size:14px;outline:none;font-family:var(--font-body);" />
          <button type="submit" class="btn-dark" style="border-radius:9999px;font-size:13px;">Subscribe</button>
        </form>
      </section>
    `;

    $('#newsletter-form')?.addEventListener('submit', e => {
      e.preventDefault();
      showToast('🎉 You\'re on the list! Welcome to the society.');
      e.target.reset();
    });
  }

  /* ───────────────────────────────────────────────────────
   * PRODUCT CARD COMPONENT
   * ─────────────────────────────────────────────────────── */
  function renderProductCard(product) {
    const liked  = NajihaModel.Wishlist.has(product.id);
    const badgeHtml = product.badge
      ? `<span class="card-badge badge-${product.badge}">${product.badge}</span>` : '';
    const origHtml = product.originalPrice
      ? `<del>${formatPrice(product.originalPrice)}</del>` : '';

    return `
      <article class="product-card fade-up" data-product-id="${product.id}">
        <div class="card-img-wrap">
          ${badgeHtml}
          <button class="card-wish ${liked ? 'liked' : ''}" data-wish="${product.id}" title="Wishlist">♥</button>
          <img src="${product.img}" alt="${product.name}" loading="lazy"
               onerror="this.style.display='none';this.parentElement.style.background='var(--mist)';" />
        </div>
        <div class="card-info">
          <div class="card-brand">${product.brand}</div>
          <div class="card-name">${product.name}</div>
          <div class="card-stars">${stars(product.rating)} <span>(${product.reviews})</span></div>
          <div class="card-foot">
            <div class="card-price">${formatPrice(product.price)} ${origHtml}</div>
            <button class="btn-cart" data-add-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  /* ───────────────────────────────────────────────────────
   * PRODUCT GRID
   * Renders + wires up the store section
   * ─────────────────────────────────────────────────────── */
  function mountProductGrid(mountId = 'products-mount', initialCat = 'all') {
    const mount = $(`#${mountId}`);
    if (!mount) return;

    const cats = NajihaModel.Products.categories();
    const pills = cats.map(c =>
      `<button class="cat-pill ${c === initialCat ? 'active' : ''}" data-cat="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</button>`
    ).join('');

    mount.innerHTML = `
      <div class="cat-pills" id="cat-filter">${pills}</div>
      <div class="products-grid" id="products-grid"></div>
    `;

    function render(cat) {
      const grid = $('#products-grid');
      const items = NajihaModel.Products.byCategory(cat);
      grid.innerHTML = items.map(renderProductCard).join('');
      wireProductCards(grid);
    }

    render(initialCat);

    $('#cat-filter')?.addEventListener('click', e => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      $$('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      render(pill.dataset.cat);
    });

    // Search integration
    document.addEventListener('search:query', e => {
      const results = NajihaModel.Products.search(e.detail);
      const grid = $('#products-grid');
      if (!grid) return;
      grid.innerHTML = results.length
        ? results.map(renderProductCard).join('')
        : `<p style="grid-column:1/-1;color:var(--gray-mid);padding:2rem 0;">No products found for "<strong>${e.detail}</strong>"</p>`;
      wireProductCards(grid);
    });
    document.addEventListener('search:clear', () => {
      const active = $('.cat-pill.active');
      render(active ? active.dataset.cat : 'all');
    });
  }

  /* Wire up cart + wishlist buttons inside a container */
  function wireProductCards(container) {
    container.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = NajihaModel.Cart.add(Number(btn.dataset.addCart));
        if (product) showToast(`🛍 "${product.name}" added to cart!`);
      });
    });

    container.querySelectorAll('[data-wish]').forEach(btn => {
      btn.addEventListener('click', () => {
        const liked = NajihaModel.Wishlist.toggle(Number(btn.dataset.wish));
        btn.classList.toggle('liked', liked);
        showToast(liked ? '♥ Added to wishlist' : '♡ Removed from wishlist');
      });
    });
  }

  /* ───────────────────────────────────────────────────────
   * HERO CAROUSEL
   * ─────────────────────────────────────────────────────── */
  function mountCarousel(mountId = 'carousel-mount') {
    const mount = $(`#${mountId}`);
    if (!mount) return;

    const slides = NajihaModel.CAROUSEL_SLIDES;
    let current = 0, timer;

    function buildSlides() {
      return slides.map((s, i) => `
        <div class="carousel-slide ${i === 0 ? 'active' : ''}" style="background:${s.bg};">
          <div class="slide-deco"></div>
          <div class="slide-content">
            <span class="label">${s.subtitle}</span>
            <h1 class="display" style="font-size:clamp(36px,5vw,60px);color:white;margin:12px 0 16px;">${s.title}</h1>
            <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.7;max-width:420px;margin-bottom:2rem;">${s.desc}</p>
            <a href="${s.href}" class="btn-primary">${s.cta}</a>
          </div>
        </div>
      `).join('');
    }

    const dots = slides.map((_, i) =>
      `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></button>`
    ).join('');

    mount.innerHTML = `
      <div class="hero-carousel" style="position:relative;overflow:hidden;background:#1c1c1e;height:520px;">
        <div class="carousel-track" id="carousel-track">${buildSlides()}</div>
        <button class="carousel-arrow prev" id="car-prev">‹</button>
        <button class="carousel-arrow next" id="car-next">›</button>
        <div class="carousel-dots" style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;gap:10px;">${dots}</div>
      </div>
    `;

    // Inject carousel CSS for this component
    if (!document.getElementById('carousel-css')) {
      const style = document.createElement('style');
      style.id = 'carousel-css';
      style.textContent = `
        .carousel-slide { min-width:100%;height:520px;display:flex;align-items:center;padding:0 8%;position:relative;overflow:hidden; }
        .carousel-track  { display:flex;transition:transform .6s cubic-bezier(.77,0,.18,1); }
        .slide-content   { position:relative;z-index:2;max-width:520px; }
        .slide-deco      { position:absolute;right:8%;top:50%;transform:translateY(-50%);width:360px;height:360px;border-radius:50%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08); }
        .carousel-dot    { width:8px;height:8px;border-radius:9999px;background:rgba(255,255,255,0.3);border:none;cursor:pointer;transition:all .3s; }
        .carousel-dot.active { background:var(--rose);width:28px;border-radius:4px; }
        .carousel-arrow  { position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:10; }
        .carousel-arrow:hover { background:var(--rose);border-color:var(--rose); }
        .carousel-arrow.prev { left:16px; }
        .carousel-arrow.next { right:16px; }
        @media(max-width:768px){ .carousel-slide,.hero-carousel { height:360px!important; } .slide-deco{display:none;} }
      `;
      document.head.appendChild(style);
    }

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      $('#carousel-track').style.transform = `translateX(-${current * 100}%)`;
      $$('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
      clearTimeout(timer);
      timer = setTimeout(() => goTo(current + 1), 5000);
    }

    $('#car-next')?.addEventListener('click', () => goTo(current + 1));
    $('#car-prev')?.addEventListener('click', () => goTo(current - 1));
    mount.querySelectorAll('.carousel-dot').forEach(d =>
      d.addEventListener('click', () => goTo(Number(d.dataset.i)))
    );

    timer = setTimeout(() => goTo(1), 5000);
  }

  /* ───────────────────────────────────────────────────────
   * CONTACT SECTION
   * ─────────────────────────────────────────────────────── */
  function mountContact(mountId = 'contact-mount') {
    const mount = $(`#${mountId}`);
    if (!mount) return;
    const info = NajihaModel.CONTACT_INFO;

    mount.innerHTML = `
      <section id="contact-section" class="section section-dark">
        <div style="max-width:1100px;margin:0 auto;">
          <div class="section-head">
            <div class="left">
              <span class="label">Get in Touch</span>
              <h2>We'd Love to Hear From You</h2>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 2fr;gap:4rem;align-items:start;">
            <div>
              <div style="display:flex;flex-direction:column;gap:1.5rem;">
                <div><p class="label">Location</p><p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:4px;">${info.address}</p></div>
                <div><p class="label">Phone</p><p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:4px;">${info.phone}</p></div>
                <div><p class="label">Email</p><p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:4px;">${info.email}</p></div>
              </div>
            </div>
            <form id="contact-form" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
              <input type="text"  placeholder="First Name" required class="contact-input" />
              <input type="text"  placeholder="Last Name"  class="contact-input" />
              <input type="email" placeholder="Email Address" required class="contact-input" style="grid-column:1/-1;" />
              <textarea placeholder="Your message…" rows="4" class="contact-input" style="grid-column:1/-1;resize:vertical;"></textarea>
              <div style="grid-column:1/-1;">
                <button type="submit" class="btn-primary">Send Message →</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;

    // Contact input styles
    if (!document.getElementById('contact-css')) {
      const s = document.createElement('style');
      s.id = 'contact-css';
      s.textContent = `.contact-input{width:100%;padding:13px 16px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);border-radius:var(--r-md);color:#fff;font-size:14px;font-family:var(--font-body);outline:none;transition:border-color .2s;} .contact-input:focus{border-color:var(--rose);} .contact-input::placeholder{color:rgba(255,255,255,0.35);}`;
      document.head.appendChild(s);
    }

    $('#contact-form')?.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✉️ Message sent! We\'ll be in touch soon.');
      e.target.reset();
    });
  }

  /* ───────────────────────────────────────────────────────
   * SCROLLSPY DOTS
   * ─────────────────────────────────────────────────────── */
  function mountScrollspy(sectionIds) {
    const rail = document.createElement('div');
    rail.className = 'spy-rail';
    rail.innerHTML = sectionIds.map((id, i) =>
      `<button class="spy-dot ${i === 0 ? 'active' : ''}" data-target="${id}" title="${id}"></button>`
    ).join('');
    document.body.appendChild(rail);

    rail.querySelectorAll('.spy-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.getElementById(dot.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          rail.querySelectorAll('.spy-dot').forEach(d =>
            d.classList.toggle('active', d.dataset.target === id)
          );
        }
      });
    }, { threshold: 0.4 });

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ─── Public API ─────────────────────────────────────── */
  return {
    mountNav,
    mountFooter,
    mountSocialFloat,
    mountNewsletter,
    mountProductGrid,
    mountCarousel,
    mountContact,
    mountScrollspy,
    renderProductCard,
    wireProductCards,
    showToast,
    formatPrice,
  };

})();

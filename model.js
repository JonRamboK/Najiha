/**
 * ═══════════════════════════════════════════════════════════
 * NAJIHA — Model Layer (model.js)
 * Pure data, state management, and business logic.
 * No DOM manipulation here — only data operations.
 * ═══════════════════════════════════════════════════════════
 */

const NajihaModel = (() => {

  /* ───────────────────────────────────────────────────────
   * 1. PRODUCT CATALOG
   * ─────────────────────────────────────────────────────── */
  const PRODUCTS = [
    { id: 1,  name: "Mustard Yellow Ruffled Set",          category: "sets",     price: 12.00, originalPrice: 18.00, rating: 4.5, reviews: 34, badge: "sale",  brand: "Najiha Kids",  img: "./rambo/2.jpg",   desc: "Vibrant mustard-yellow sleeveless top with ruffles and side bows, paired with matching bottoms." },
    { id: 2,  name: "Party Dress with Oversized Bow",      category: "dresses",  price: 45.05, originalPrice: null,  rating: 4.8, reviews: 62, badge: "hot",   brand: "Najiha Kids",  img: "./rambo/3.jpg",   desc: "Baby blue occasion dress with an oversized back bow—fit for royalty." },
    { id: 3,  name: "Pastel Blue Puff-Sleeve Shirt Dress", category: "dresses",  price: 32.00, originalPrice: null,  rating: 4.6, reviews: 45, badge: "new",   brand: "Najiha Kids",  img: "./rambo/4.jpg",   desc: "Classic tailoring meets playful design in this textured puff-sleeve shirt dress." },
    { id: 4,  name: "Toddler Two-Piece Summer Set",        category: "sets",     price: 23.00, originalPrice: 30.00, rating: 4.4, reviews: 28, badge: "sale",  brand: "Najiha Kids",  img: "./rambo/5.jpg",   desc: "Adorable long-sleeve dress perfect for keeping your little one cozy and stylish." },
    { id: 5,  name: "Vintage Floral Flutter-Sleeve Dress", category: "dresses",  price: 58.00, originalPrice: null,  rating: 4.9, reviews: 81, badge: "hot",   brand: "Najiha Luxe",  img: "./rambo/6 years girls dress light dress.jpg.", desc: "Enchanting white sleeveless dress with lace trim—spring perfection." },
    { id: 6,  name: "Garden Whimsy Embroidered Dress",     category: "dresses",  price: 16.00, originalPrice: null,  rating: 4.3, reviews: 19, badge: null,    brand: "Najiha Kids",  img: "./rambo/6.jpg",   desc: "Charming floral embroidered white dress, ideal for any summer occasion." },
    { id: 7,  name: "White Heirloom Embroidered Dress",    category: "dresses",  price: 35.00, originalPrice: 42.00, rating: 4.7, reviews: 53, badge: "sale",  brand: "Najiha Luxe",  img: "./rambo/7.jpg",   desc: "Classic elegance in this stunning white heirloom-style dress." },
    { id: 8,  name: "Lavender & White Scalloped Dress",    category: "dresses",  price: 14.00, originalPrice: null,  rating: 4.2, reviews: 17, badge: null,    brand: "Najiha Kids",  img: "./rambo/8.jpg",   desc: "Delightful lavender accents on white — perfect for casual celebrations." },
    { id: 9,  name: "Sweetheart Ruffle Muslin Dress",      category: "dresses",  price: 28.00, originalPrice: null,  rating: 4.6, reviews: 40, badge: "new",   brand: "Najiha Kids",  img: "./rambo/9.jpg",   desc: "Charm meets sun safety in this two-piece muslin set." },
    { id: 10, name: "Tiny Hearts Smocked Sundress & Hat",  category: "sets",     price: 18.00, originalPrice: null,  rating: 4.5, reviews: 31, badge: null,    brand: "Najiha Kids",  img: "./rambo/10.jpg",  desc: "Sweet and classic smocked sundress with matching hat." },
    { id: 11, name: "Mustard Yellow Ruffled Romper",       category: "rompers",  price: 10.00, originalPrice: 14.00, rating: 4.1, reviews: 12, badge: "sale",  brand: "Najiha Kids",  img: "./rambo/11.jpg",  desc: "Vibrant mustard-yellow romper for bright summer days." },
    { id: 12, name: "Sweet Summer Hearts & Floral Dress",  category: "dresses",  price: 24.90, originalPrice: null,  rating: 4.4, reviews: 22, badge: null,    brand: "Najiha Kids",  img: "./rambo/12.jpg",  desc: "Flutter-sleeve cotton dress in cheerful heart and floral prints." },
    { id: 13, name: "Little Honeybee Floral Flutter Dress",category: "dresses",  price: 17.50, originalPrice: null,  rating: 4.5, reviews: 35, badge: "new",   brand: "Najiha Kids",  img: "./rambo/13.jpg",  desc: "Charming honeybee-themed dress to brighten up your little one's day." },
    { id: 14, name: "Elegant Butterfly Summer Dress",      category: "dresses",  price: 18.99, originalPrice: null,  rating: 4.6, reviews: 48, badge: null,    brand: "Najiha Luxe",  img: "./rambo/14.jpg",  desc: "Comfortable fit for freedom of movement, looking adorable all day." },
    { id: 15, name: "Sunshine Butterfly Layered Dress",    category: "dresses",  price: 19.00, originalPrice: 25.00, rating: 4.7, reviews: 57, badge: "sale",  brand: "Najiha Luxe",  img: "./rambo/15.jpg",  desc: "Bright yellow dress with butterfly print, flutter sleeves, and layered ruffle skirt." },
  ];

  const CAROUSEL_SLIDES = [
    { title: "Passion in Bloom",   subtitle: "Spring/Summer 2026 Collection",  desc: "Curated dresses and sets for the little princess in your life.", bg: "linear-gradient(135deg, #1c1c1e 55%, #2d1a2e)", cta: "Shop Collection", href: "#store" },
    { title: "Soft & Radiant",     subtitle: "New Arrivals — Just Landed",      desc: "Fresh styles with gentle fabrics, designed for comfort and charm.", bg: "linear-gradient(135deg, #0d1f2d 55%, #1a3046)", cta: "Explore New",    href: "#store" },
    { title: "Golden Hour",        subtitle: "Limited Edition Party Dresses",   desc: "Make every occasion magical with our heirloom-quality pieces.", bg: "linear-gradient(135deg, #211508 55%, #3d2310)", cta: "View Limited",   href: "#store" },
  ];

  const FEATURED_ITEMS = [
    { img: "./rambo/Newborn.webp",           label: "Australian Baby Frock" },
    { img: "./rambo/product.webp",           label: "Indian Baby Frock" },
    { img: "./rambo/lhknculhknculhkn.webp",  label: "Chinese Baby Frock" },
  ];

  const NAV_LINKS = [
    { label: "Home",    href: "Home.html" },
    { label: "Store",   href: "Store.html" },
    { label: "Gallery", href: "Gallery.html" },
    { label: "About",   href: "About.html" },
    { label: "Contact", href: "Contact.html" },
  ];

  /* ───────────────────────────────────────────────────────
   * ABOUT PAGE CONTENT
   * ─────────────────────────────────────────────────────── */
  const ABOUT_CONTENT = {
    hero: {
      label: "Our Story",
      title: "Made with Love, Worn with Joy",
      desc: "Najiha began as a small dream in Karachi — to dress children in pieces as soft, joyful, and full of character as childhood itself.",
    },
    story: [
      "Najiha was founded on a simple belief: that children's clothing should be as thoughtfully made as anything in a grown-up's wardrobe. What started as a small home-based atelier stitching frocks for family and friends has grown into a boutique loved by parents who want a little more heart in what their children wear.",
      "Every piece we create passes through hands that care — from selecting breathable, skin-safe fabrics to finishing every hem with the kind of attention usually reserved for heirlooms. We believe childhood is fleeting, and the clothes worn during it should feel just as special.",
    ],
    values: [
      { icon: "🧵", title: "Handcrafted Quality", desc: "Every stitch is checked by hand before a piece ever reaches your doorstep." },
      { icon: "🌿", title: "Gentle Fabrics", desc: "Breathable cottons and muslins chosen for delicate, sensitive skin." },
      { icon: "🎀", title: "Timeless Design", desc: "Styles that outlast trends — pieces you'll want to keep in the memory box." },
      { icon: "🤍", title: "Made with Care", desc: "Small-batch production means every order gets real attention." },
    ],
    stats: [
      { n: "5000+", l: "Happy Families" },
      { n: "15+",   l: "Signature Collections" },
      { n: "4.8★",  l: "Average Rating" },
      { n: "100%",  l: "Skin-Safe Fabrics" },
    ],
  };

  /* ───────────────────────────────────────────────────────
   * GALLERY CONTENT — lifestyle & product imagery
   * ─────────────────────────────────────────────────────── */
  const GALLERY_ITEMS = [
    { img: "./rambo/2.jpg",  caption: "Mustard Yellow Ruffled Set",          tag: "sets" },
    { img: "./rambo/3.jpg",  caption: "Party Dress with Oversized Bow",      tag: "dresses" },
    { img: "./rambo/4.jpg",  caption: "Pastel Blue Puff-Sleeve Shirt Dress", tag: "dresses" },
    { img: "./rambo/5.jpg",  caption: "Toddler Two-Piece Summer Set",        tag: "sets" },
    { img: "./rambo/6.jpg",  caption: "Garden Whimsy Embroidered Dress",     tag: "dresses" },
    { img: "./rambo/7.jpg",  caption: "White Heirloom Embroidered Dress",    tag: "dresses" },
    { img: "./rambo/8.jpg",  caption: "Lavender & White Scalloped Dress",    tag: "dresses" },
    { img: "./rambo/9.jpg",  caption: "Sweetheart Ruffle Muslin Dress",      tag: "dresses" },
    { img: "./rambo/10.jpg", caption: "Tiny Hearts Smocked Sundress & Hat",  tag: "sets" },
    { img: "./rambo/11.jpg", caption: "Mustard Yellow Ruffled Romper",       tag: "rompers" },
    { img: "./rambo/12.jpg", caption: "Sweet Summer Hearts & Floral Dress",  tag: "dresses" },
    { img: "./rambo/Newborn.webp", caption: "Australian Baby Frocks",       tag: "dresses" },
    { img: "./rambo/product.webp", caption: "Indian Baby Frocks",           tag: "dresses" },
  ];

  const SOCIAL_LINKS = [
    { cls: "s-wa", icon: "fa-whatsapp",  href: "https://wa.me/923012292471",    label: "WhatsApp" },
    { cls: "s-fb", icon: "fa-facebook",  href: "https://www.facebook.com",      label: "Facebook" },
    { cls: "s-ig", icon: "fa-instagram", href: "https://www.instagram.com",     label: "Instagram" },
    { cls: "s-yt", icon: "fa-youtube",   href: "https://youtube.com/@craft884", label: "YouTube" },
    { cls: "s-tt", icon: "fa-tiktok",    href: "https://www.tiktok.com/@najiha_diy_craft", label: "TikTok" },
  ];

  const CONTACT_INFO = {
    address: "Mushraf Colony, near Haksbay Road, Karachi, Pakistan",
    phone:   "0301-2292471",
    email:   "info@najiha.com",
  };

  /* ───────────────────────────────────────────────────────
   * 2. CART STATE
   * ─────────────────────────────────────────────────────── */
  let _cart = JSON.parse(localStorage.getItem('najiha_cart') || '[]');

  function _saveCart() {
    localStorage.setItem('najiha_cart', JSON.stringify(_cart));
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: [..._cart] } }));
  }

  const Cart = {
    /** Returns a shallow copy of the cart array */
    getAll() { return [..._cart]; },

    /** Total item count (summing quantities) */
    count() { return _cart.reduce((sum, i) => sum + (i.qty || 1), 0); },

    /** Total price */
    total() { return _cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0); },

    /** Add or increment a product */
    add(productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      const existing = _cart.find(i => i.id === productId);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        _cart.push({ ...product, qty: 1 });
      }
      _saveCart();
      return product;
    },

    /** Remove by product id */
    remove(productId) {
      _cart = _cart.filter(i => i.id !== productId);
      _saveCart();
    },

    /** Clear everything */
    clear() { _cart = []; _saveCart(); },
  };

  /* ───────────────────────────────────────────────────────
   * 3. WISHLIST STATE
   * ─────────────────────────────────────────────────────── */
  let _wishlist = JSON.parse(localStorage.getItem('najiha_wish') || '[]');

  const Wishlist = {
    has(id) { return _wishlist.includes(id); },
    toggle(id) {
      if (Wishlist.has(id)) {
        _wishlist = _wishlist.filter(w => w !== id);
      } else {
        _wishlist.push(id);
      }
      localStorage.setItem('najiha_wish', JSON.stringify(_wishlist));
      return Wishlist.has(id);
    },
  };

  /* ───────────────────────────────────────────────────────
   * 4. AUTH STATE
   * ─────────────────────────────────────────────────────── */
  const Auth = {
    /** Get session user (set after login) */
    currentUser() {
      const raw = localStorage.getItem('najiha_session');
      return raw ? JSON.parse(raw) : null;
    },

    /** Store a registered user */
    register({ name, email, password }) {
      if (localStorage.getItem('najiha_user_' + email)) return { ok: false, msg: "Email already registered." };
      if (!Auth._strongPassword(password)) return { ok: false, msg: "Password must be 8+ chars with uppercase and numbers." };
      localStorage.setItem('najiha_user_' + email, JSON.stringify({ name, email, password }));
      return { ok: true };
    },

    /** Login — returns { ok, msg, user } */
    login({ email, password }) {
      const raw = localStorage.getItem('najiha_user_' + email);
      if (!raw) return { ok: false, msg: "No account found with this email." };
      const user = JSON.parse(raw);
      if (user.password !== password) return { ok: false, msg: "Incorrect password. Please try again." };
      localStorage.setItem('najiha_session', JSON.stringify({ name: user.name, email: user.email }));
      return { ok: true, user };
    },

    /** Clear session */
    logout() { localStorage.removeItem('najiha_session'); },

    /** Password strength check */
    _strongPassword(pw) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(pw); },
  };

  /* ───────────────────────────────────────────────────────
   * 5. PRODUCT QUERIES
   * ─────────────────────────────────────────────────────── */
  const Products = {
    all()                  { return [...PRODUCTS]; },
    byId(id)               { return PRODUCTS.find(p => p.id === id); },
    byCategory(cat)        { return cat === 'all' ? Products.all() : PRODUCTS.filter(p => p.category === cat); },
    search(q)              { const lq = q.toLowerCase(); return PRODUCTS.filter(p => p.name.toLowerCase().includes(lq) || p.brand.toLowerCase().includes(lq)); },
    categories()           { return ['all', ...new Set(PRODUCTS.map(p => p.category))]; },
    featured(n = 8)        { return PRODUCTS.slice(0, n); },
  };

  /* ─── Public API ─────────────────────────────────────── */
  return {
    Cart,
    Wishlist,
    Auth,
    Products,
    CAROUSEL_SLIDES,
    FEATURED_ITEMS,
    NAV_LINKS,
    SOCIAL_LINKS,
    CONTACT_INFO,
    ABOUT_CONTENT,
    GALLERY_ITEMS,
  };

})();

// Najiha Closet — Footer component
function render() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const year = new Date().getFullYear();

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/logo/logo.png" alt="Najiha Closet" onerror="this.style.display='none'">
          <div class="footer-tagline">Style With Elegance</div>
          <p>Premium kidswear and custom-made outfits designed especially for little ones — from everyday essentials to occasion wear.</p>
          <div class="footer-social">
            <a href="https://instagram.com/najihacloset" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://tiktok.com/@najihacloset" target="_blank" rel="noopener" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://youtube.com/@najihacloset" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://facebook.com/najihacloset" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="categories.html">Categories</a></li>
            <li><a href="custom-size.html">Custom Size</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="videos.html">Videos</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Support</h5>
          <ul>
            <li><a href="my-orders.html">Track Order</a></li>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms &amp; Conditions</a></li>
            <li><a href="mailto:hello@najihacloset.com">hello@najihacloset.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${year} Najiha Closet. All Rights Reserved.</span>
        <span>Made with care in Karachi, Pakistan</span>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', render);

// Najiha Closet — Shared UI helpers (toast, modals, loading screen, floating buttons)

export function showToast(message, type = 'success') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

export function hideLoadScreen() {
  const el = document.getElementById('loadScreen');
  if (!el) return;
  setTimeout(() => {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 450);
  }, 350);
}

export function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

export function initFloatingButtons(whatsappNumber = '923001234567') {
  if (document.querySelector('.whatsapp-float')) return;
  const wa = document.createElement('a');
  wa.href = `https://wa.me/${whatsappNumber}`;
  wa.target = '_blank'; wa.rel = 'noopener';
  wa.className = 'float-btn whatsapp-float';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  document.body.appendChild(wa);

  const top = document.createElement('button');
  top.className = 'float-btn back-to-top';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(top);

  window.addEventListener('scroll', () => {
    top.classList.toggle('show', window.scrollY > 500);
  });
}

/**
 * Opens the "Login Required" modal (used when a guest clicks Apply/Order).
 * `returnUrl` is stored so login.html can bounce the user back afterwards.
 */
export function openLoginRequiredModal(returnUrl = window.location.href) {
  let modal = document.getElementById('loginRequiredModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'loginRequiredModal';
    modal.innerHTML = `
      <div class="modal-box" style="text-align:center;max-width:400px;">
        <button class="modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button>
        <div style="width:60px;height:60px;border-radius:50%;background:var(--blush);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;">
          <i class="fa-solid fa-lock" style="color:var(--rose-gold-dark);font-size:22px;"></i>
        </div>
        <h3 style="font-size:21px;margin-bottom:8px;">Login Required</h3>
        <p style="margin-bottom:24px;">Please login or create an account to continue with your order.</p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <a class="btn btn-primary" style="justify-content:center;" id="loginRequiredLoginBtn">Login</a>
          <a class="btn btn-outline" style="justify-content:center;" id="loginRequiredRegisterBtn">Create Account</a>
          <button class="btn" style="justify-content:center;background:transparent;color:var(--muted);" id="loginRequiredDemoBtn">Continue as Demo User</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(modal); });
  }
  modal.querySelector('#loginRequiredLoginBtn').href = `login.html?redirect=${encodeURIComponent(returnUrl)}`;
  modal.querySelector('#loginRequiredRegisterBtn').href = `register.html?redirect=${encodeURIComponent(returnUrl)}`;
  modal.querySelector('#loginRequiredDemoBtn').onclick = () => {
    localStorage.setItem('nc_demo_user', '1');
    closeModal(modal);
    showToast('Browsing as Demo User — real orders are disabled.', 'success');
  };
  modal.classList.add('open');
}

export function closeModal(modal) {
  modal.classList.remove('open');
}

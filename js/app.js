/* EuroCraft Automotive — App Layer (theme, cookie, a11y, perf) */

/* ---------- THEME SWITCHER — dark default ---------- */
(function() {
  const root = document.documentElement;
  const STORAGE_KEY = 'ec_theme';

  // Determine starting theme: stored pref → default dark
  const saved = localStorage.getItem(STORAGE_KEY);
  const theme = saved || 'dark';
  root.setAttribute('data-theme', theme);

  // Sync all toggle buttons on the page
  function syncButtons(active) {
    document.querySelectorAll('#btn-dark, #btn-dark-m').forEach(b => {
      b.classList.toggle('active', active === 'dark');
      b.setAttribute('aria-pressed', String(active === 'dark'));
    });
    document.querySelectorAll('#btn-light, #btn-light-m').forEach(b => {
      b.classList.toggle('active', active === 'light');
      b.setAttribute('aria-pressed', String(active === 'light'));
    });
  }

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE_KEY, t);
    syncButtons(t);
  }

  // Run sync after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    syncButtons(theme);
    document.querySelectorAll('#btn-dark, #btn-dark-m').forEach(b =>
      b.addEventListener('click', () => setTheme('dark')));
    document.querySelectorAll('#btn-light, #btn-light-m').forEach(b =>
      b.addEventListener('click', () => setTheme('light')));
  });
})();


/* ---------- SKIP NAV ---------- */
(function() {
  const skip = document.createElement('a');
  skip.href = '#main-content';
  skip.textContent = 'Skip to main content';
  skip.className = 'skip-nav';
  document.body.insertBefore(skip, document.body.firstChild);
})();

/* ---------- COOKIE BANNER ---------- */
(function() {
  if (localStorage.getItem('ec_cookie_ok')) return;
  if (location.search.includes('all')) return; // suppress in screenshot mode
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <div class="cookie-inner">
      <p>We use cookies to improve your experience. By using this site you agree to our 
        <a href="#" style="color:var(--red);">privacy policy</a>.</p>
      <div class="cookie-actions">
        <button class="btn btn-primary" id="cookie-accept" style="padding: 0.7rem 1.4rem; font-size: 0.8rem;">
          <span>Accept</span>
        </button>
        <button class="btn btn-ghost" id="cookie-decline" style="padding: 0.7rem 1.2rem; font-size: 0.8rem;">
          <span>Decline</span>
        </button>
      </div>
    </div>`;
  document.body.appendChild(banner);

  const dismiss = () => {
    banner.classList.add('cookie-hide');
    setTimeout(() => banner.remove(), 400);
  };
  document.getElementById('cookie-accept').onclick = () => {
    localStorage.setItem('ec_cookie_ok', '1');
    dismiss();
  };
  document.getElementById('cookie-decline').onclick = dismiss;

  setTimeout(() => banner.classList.add('cookie-show'), 1200);
})();

/* ---------- SMOOTH BACK-TO-TOP ---------- */
(function() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---------- STICKY BOOKING CTA ---------- */
(function() {
  if (location.search.includes('all')) return; // suppress in screenshot mode
  if (window.location.pathname.includes('contact')) return;
  const cta = document.createElement('div');
  cta.id = 'book-sticky';
  cta.innerHTML = `
    <a href="https://book.eurocraftautomotive.com/" class="book-sticky-btn" target="_blank" rel="noopener">
      <span class="book-sticky-pulse"></span>
      <span>Book a Service</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>`;
  document.body.appendChild(cta);
  
  let shown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500 && !shown) { cta.classList.add('visible'); shown = true; }
    else if (window.scrollY < 200 && shown) { cta.classList.remove('visible'); shown = false; }
  }, { passive: true });
})();

/* ---------- PHONE LINK TRACKING ---------- */
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'phone_call', { event_category: 'engagement', event_label: a.href });
    }
  });
});

/* ---------- BOOKING LINK TRACKING ---------- */
document.querySelectorAll('a[href*="book.eurocraft"]').forEach(a => {
  a.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_click', { event_category: 'conversion', event_label: a.href });
    }
  });
});

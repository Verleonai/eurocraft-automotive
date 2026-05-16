/* EuroCraft Automotive — Interactions */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- BYPASS REVEAL FOR FULL-PAGE CAPTURES ---------- */
  if (location.search.includes('all')) {
    document.querySelectorAll('.reveal, .reveal-x').forEach(el => el.classList.add('in'));
  }

  /* ---------- LOADER ---------- */
  setTimeout(() => {
    document.querySelector('.loader')?.classList.add('done');
  }, 800);

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && matchMedia('(min-width: 901px)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.classList.add('ready'); }, { once: false });
    const animateCursor = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
    document.querySelectorAll('a, button, .gallery-item, .service-card, .process-row').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ---------- NAV SCROLL ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mmenu = document.querySelector('.mobile-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mmenu?.classList.toggle('open');
    document.body.style.overflow = toggle.classList.contains('open') ? 'hidden' : '';
  });
  mmenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle?.classList.remove('open');
    mmenu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- HERO ENTRANCE ---------- */
  const heroWords = document.querySelectorAll('.hero-title .word span');
  heroWords.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
      w.style.transform = 'translateY(0)';
    }, 200 + i * 80);
  });
  setTimeout(() => {
    document.querySelectorAll('.hero-sub, .hero-actions, .hero-meta').forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 150);
    });
  }, 400 + heroWords.length * 80);

  /* ---------- PARALLAX HERO BG ---------- */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1.1) translateY(${y * 0.25}px)`;
    }, { passive: true });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-x');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  revealEls.forEach(el => io.observe(el));
  // Immediately reveal anything already in viewport (page load case)
  revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
  });
  // Safety net: if any element is still hidden after 6s (e.g., automated tools, off-screen check failed), reveal all
  setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('in')) {
        // Only force-reveal if user has scrolled past it OR if no scroll has occurred
        const r = el.getBoundingClientRect();
        if (window.scrollY === 0 || r.top < window.innerHeight * 2) el.classList.add('in');
      }
    });
  }, 6000);

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  // Reset to 0 only when about to animate (preserve target value in DOM for no-JS users)
  counters.forEach(c => { c._target = c.dataset.counter; });
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el._target);
      const decimals = (el._target.split('.')[1] || '').length;
      el.textContent = decimals ? '0.0' : '0';
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (eased * target).toFixed(decimals);
        el.textContent = val;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  /* ---------- MARQUEE DUPLICATE ---------- */
  document.querySelectorAll('.marquee, .testimonials-track').forEach(track => {
    const clone = track.cloneNode(true);
    Array.from(clone.children).forEach(c => track.appendChild(c.cloneNode(true)));
  });

  /* ---------- CONTACT FORM — real Formspree async submission ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      const data = new FormData(form);

      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          // Success state
          form.innerHTML = `
            <div style="text-align:center;padding:3rem 1rem;">
              <div style="width:64px;height:64px;background:var(--red);border-radius:50%;display:grid;place-items:center;margin:0 auto 1.4rem;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style="font-family:var(--font-display);font-size:2.4rem;text-transform:uppercase;color:var(--jet);margin-bottom:0.8rem;">Message Sent</h3>
              <p style="color:var(--ink);max-width:38ch;margin:0 auto;">We received your inquiry and will reply within one business day at the email you provided.</p>
            </div>`;
        } else {
          const json = await res.json();
          throw new Error(json.error || 'Submission failed');
        }
      } catch (err) {
        btn.innerHTML = '<span>Failed — try again</span>';
        btn.style.background = '#8b0f0f';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 3000);
      }
    });
  }
});

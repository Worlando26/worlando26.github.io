/* ═══════════════════════════════════════════════════
   WORLANDO HAS — Portfolio JS
   Animations au scroll uniquement (pas de marquee, pas de typing auto)
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV: scroll state + active link ─────────────── */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const updateNav = () => {
    // Scrolled state
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── HAMBURGER / MOBILE MENU ──────────────────────── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });

  window.closeMenu = () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── SCROLL REVEAL ────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 300);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));

  /* ── WORK FILTER TABS ─────────────────────────────── */
  const tabs = document.querySelectorAll('.ftab');
  const cards = document.querySelectorAll('.wcard');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        if (match) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 360);
        }
      });
    });
  });

  /* ── SMOOTH SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CONTACT FORM ─────────────────────────────────── */
  window.sendMessage = () => {
    const fname   = document.getElementById('fname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Contact Portfolio';
    const msg     = document.getElementById('message').value.trim();

    if (!fname || !email || !msg) {
      showToast('Veuillez remplir tous les champs requis.', 'error');
      return;
    }

    const body = `Bonjour Worlando,\n\nJe m'appelle ${fname}.\n\n${msg}\n\nEmail : ${email}`;
    window.location.href = `mailto:venomworlando@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Ouverture de votre client email…', 'success');
  };

  /* Toast helper */
  function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed; bottom:2rem; right:2rem; z-index:9999;
      padding:14px 22px; border-radius:12px;
      background:${type === 'success' ? '#e8ff47' : '#ff4747'}; color:#000;
      font-family:'Satoshi',sans-serif; font-weight:600; font-size:0.88rem;
      box-shadow:0 12px 40px rgba(0,0,0,0.4);
      transform:translateY(20px); opacity:0;
      transition:all 0.4s cubic-bezier(0.16,1,0.3,1);
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.transform = 'translateY(0)';
      t.style.opacity = '1';
    });
    setTimeout(() => {
      t.style.transform = 'translateY(20px)';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 400);
    }, 3500);
  }

  /* ── PARALLAX SUBTLE (hero photo) ────────────────── */
  const photoWrap = document.querySelector('.photo-wrap');
  if (photoWrap && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      photoWrap.style.transform = `translateY(${y * 0.06}px)`;
    }, { passive: true });
  }

  /* ── CARD TILT (subtle) ──────────────────────────── */
  document.querySelectorAll('.wcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) / r.width;
      const y = (e.clientY - r.top  - r.height / 2) / r.height;
      card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── LIGHTBOX for design cards ──────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.dcard').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  window.closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

});

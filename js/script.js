/* ============================================================
   PAF-IAST Website — js/script.js v2.0 ENHANCED
   Features:
   1. Scroll Progress Bar
   2. Typewriter Effect
   3. Glassmorphism Navbar
   4. Floating Stats + Odometer Counter
   5. Gold Particle Cursor
   6. Video Background Hero
   7. Timeline (CSS-animated)
   8. Testimonials Auto-Slider
   9. Loading Progress Bar (top)
   10. Scroll-triggered Odometer Numbers
   ============================================================ */

'use strict';

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('done');
    triggerHeroAnimations();
    initTypewriter();
    initVideoBackground();
  }, 2300);
});

/* ===== 1. SCROLL PROGRESS BAR ===== */
const progressBar = document.getElementById('scroll-progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  if (progressBar) progressBar.style.width = progress + '%';
}, { passive: true });

/* ===== 2. TYPEWRITER EFFECT ===== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Shaping Tomorrow\'s Innovators',
    'Engineering Pakistan\'s Future',
    'Where Science Meets Ambition',
    'Applied Excellence, Global Vision'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPausing = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        // Pause then delete
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2200);
        return;
      }
    } else {
      el.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 40 : 70;
    setTimeout(type, speed);
  }

  type();
}

/* ===== HERO ANIMATIONS ===== */
function triggerHeroAnimations() {
  const items = document.querySelectorAll('.fade-up, .fade-left');
  items.forEach(el => {
    const delay = parseInt(el.getAttribute('data-delay') || 0);
    setTimeout(() => el.classList.add('shown'), delay);
  });
}

/* ===== 3. GLASSMORPHISM NAVBAR — handled by CSS + scroll class ===== */
const nav = document.getElementById('nav');
const hbg = document.getElementById('hbg');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  const btt = document.getElementById('btt');
  if (btt) btt.classList.toggle('show', window.scrollY > 500);
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  document.querySelectorAll('.nl').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

if (hbg) {
  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hbg && hbg.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== BACK TO TOP ===== */
const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== PARTICLES BACKGROUND ===== */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'pt';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 9 + 7}s;
      animation-delay: ${Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
})();

/* ===== 4. FLOATING STATS — handled by CSS animations ===== */

/* ===== 5. GOLD PARTICLE CURSOR ===== */
(function initParticleCursor() {
  const canvas = document.getElementById('particle-cursor');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mouse = { x: -100, y: -100 };
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn 2 particles per move
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouse.x + (Math.random() - .5) * 10,
        y: mouse.y + (Math.random() - .5) * 10,
        vx: (Math.random() - .5) * 2,
        vy: (Math.random() - 1) * 2.5,
        life: 1,
        decay: Math.random() * 0.025 + 0.015,
        size: Math.random() * 3 + 1,
        hue: Math.random() > .5 ? '#c9a84c' : '#e8c96a'
      });
    }
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.05; // slight upward drift
      p.life -= p.decay;

      ctx.save();
      ctx.globalAlpha = p.life * 0.8;
      ctx.fillStyle = p.hue;
      ctx.shadowColor = '#c9a84c';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== 6. VIDEO BACKGROUND ===== */
function initVideoBackground() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  video.addEventListener('canplay', () => {
    video.classList.add('loaded');
  });

  // If video src doesn't exist or errors, keep fallback image
  video.addEventListener('error', () => {
    video.style.display = 'none';
  });
}

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('on'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== 10. SCROLL-TRIGGERED ODOMETER COUNTER ===== */
function animateOdometer(el) {
  const target = parseInt(el.getAttribute('data-target'));
  if (!target || el.dataset.animated) return;
  el.dataset.animated = 'true';

  const duration = 2400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
      // Add final glow flash
      el.style.textShadow = '0 0 30px rgba(201,168,76,1)';
      setTimeout(() => {
        el.style.textShadow = '0 0 20px rgba(201,168,76,0.6)';
      }, 300);
    }
  }
  requestAnimationFrame(update);
}

const odometerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateOdometer(entry.target);
      odometerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.odometer[data-target]').forEach(el => odometerObserver.observe(el));

/* ===== 7. TIMELINE — animated via CSS reveal ===== */
// Timeline items get the .reveal class and are handled by revealObserver above

/* ===== 8. TESTIMONIALS AUTO-SLIDER ===== */
(function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.test-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetTimer();
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Start auto-slide
  resetTimer();

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
})();

/* ===== 3D TILT CARDS ===== */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const rotateX = dy * -12;
    const rotateY = dx * 12;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.boxShadow = `${-dx * 15}px ${-dy * 15}px 40px rgba(0,0,0,.4), 0 0 30px rgba(201,168,76,.2)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
    card.style.transition = 'transform .5s ease, box-shadow .5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

/* ===== CAMPUS GALLERY ===== */
window.changeGallery = function(thumb) {
  const mainImg = document.getElementById('galleryMain');
  if (!mainImg) return;
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = thumb.src;
    mainImg.alt = thumb.alt;
    mainImg.style.opacity = '1';
  }, 300);
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
};

let galleryIndex = 0;
const thumbs = document.querySelectorAll('.thumb');
if (thumbs.length > 0) {
  setInterval(() => {
    galleryIndex = (galleryIndex + 1) % thumbs.length;
    window.changeGallery(thumbs[galleryIndex]);
  }, 4000);
}

/* ===== PROGRAM CARDS STAGGER ===== */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.prog-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity .6s ease, transform .6s ease';
  cardObserver.observe(card);
});

/* ===== NAVBAR CLICK HIGHLIGHT ===== */
document.querySelectorAll('.nl').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nl').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ============================================================
   FORM VALIDATION
   ============================================================ */
const formFields = {
  fn: {
    el: document.getElementById('fn'), wrap: null,
    errEl: document.getElementById('fn-err'),
    rules: { required: true, minLength: 2, maxLength: 60 },
    messages: { required: 'Full name is required.', minLength: 'Name must be at least 2 characters.', maxLength: 'Name cannot exceed 60 characters.' }
  },
  fe: {
    el: document.getElementById('fe'), wrap: null,
    errEl: document.getElementById('fe-err'),
    rules: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ },
    messages: { required: 'Email address is required.', pattern: 'Please enter a valid email.' }
  },
  fs: {
    el: document.getElementById('fs'), wrap: null,
    errEl: document.getElementById('fs-err'),
    rules: { required: true, minLength: 3, maxLength: 100 },
    messages: { required: 'Subject is required.', minLength: 'Subject must be at least 3 characters.', maxLength: 'Subject cannot exceed 100 characters.' }
  },
  fp: {
    el: document.getElementById('fp'), wrap: null,
    errEl: document.getElementById('fp-err'),
    rules: { required: false, pattern: /^(\+92|0)[0-9]{9,10}$/ },
    messages: { pattern: 'Enter valid Pakistani number (e.g. +92 3XX XXXXXXX).' }
  },
  fm: {
    el: document.getElementById('fm'), wrap: null,
    errEl: document.getElementById('fm-err'),
    rules: { required: true, minLength: 10, maxLength: 1000 },
    messages: { required: 'Message is required.', minLength: 'Message must be at least 10 characters.', maxLength: 'Message cannot exceed 1000 characters.' }
  }
};

Object.keys(formFields).forEach(key => {
  const field = formFields[key];
  if (field.el) field.wrap = field.el.closest('.input-wrap');
});

function validateField(key) {
  const field = formFields[key];
  if (!field.el) return true;
  const val = field.el.value.trim();
  const rules = field.rules;
  const msgs = field.messages;
  let errorMsg = '';

  if (rules.required && val === '') errorMsg = msgs.required;
  else if (rules.minLength && val.length > 0 && val.length < rules.minLength) errorMsg = msgs.minLength;
  else if (rules.maxLength && val.length > rules.maxLength) errorMsg = msgs.maxLength;
  else if (rules.pattern && val.length > 0 && !rules.pattern.test(val)) errorMsg = msgs.pattern;

  if (errorMsg) { showFieldError(field, errorMsg); return false; }
  else { if (val.length > 0) showFieldSuccess(field); else clearFieldState(field); return true; }
}

function showFieldError(field, msg) {
  if (field.wrap) { field.wrap.classList.remove('valid'); field.wrap.classList.add('error'); }
  if (field.errEl) { field.errEl.querySelector('.etxt').textContent = msg; field.errEl.classList.add('show'); }
}
function showFieldSuccess(field) {
  if (field.wrap) { field.wrap.classList.remove('error'); field.wrap.classList.add('valid'); }
  if (field.errEl) field.errEl.classList.remove('show');
}
function clearFieldState(field) {
  if (field.wrap) field.wrap.classList.remove('error', 'valid');
  if (field.errEl) field.errEl.classList.remove('show');
}

Object.keys(formFields).forEach(key => {
  const field = formFields[key];
  if (!field.el) return;
  field.el.addEventListener('input', () => {
    const val = field.el.value.trim();
    if (val.length === 0) clearFieldState(field);
    else if (field.wrap && field.wrap.classList.contains('error')) validateField(key);
  });
  field.el.addEventListener('blur', () => {
    if (field.el.value.trim().length > 0 || field.rules.required) validateField(key);
  });
});

const contactForm = document.getElementById('contactForm');
const sbtn = document.getElementById('sbtn');
const sbtnText = document.getElementById('sbtn-t');
const fSuccess = document.getElementById('f-success');
const fErrorBox = document.getElementById('f-error');
const fErrorMsg = document.getElementById('f-error-msg');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    fSuccess.classList.add('hidden');
    fErrorBox.classList.add('hidden');

    let isValid = true;
    Object.keys(formFields).forEach(key => { if (!validateField(key)) isValid = false; });

    if (!isValid) {
      const firstError = contactForm.querySelector('.input-wrap.error input, .input-wrap.error textarea');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    sbtn.classList.add('loading');
    sbtnText.textContent = 'Sending...';
    document.getElementById('sbtn-icon').outerHTML = '<span class="spinner" id="sbtn-icon"></span>';
    sbtn.disabled = true;

    try {
      await emailjs.send('service_6a3npkb', 'template_rwfcp8x', {
        name: formFields.fn.el.value.trim(),
        email: formFields.fe.el.value.trim(),
        title: formFields.fs.el.value.trim(),
        message: formFields.fm.el.value.trim(),
        phone: formFields.fp.el.value.trim() || 'Not provided',
      });
      fSuccess.classList.remove('hidden');
      contactForm.reset();
      Object.keys(formFields).forEach(key => clearFieldState(formFields[key]));
      fSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      fErrorMsg.textContent = 'Could not send message. Please email us at: ishashoukat45@gmail.com';
      fErrorBox.classList.remove('hidden');
    } finally {
      sbtn.classList.remove('loading');
      sbtn.disabled = false;
      sbtnText.textContent = 'Send Message';
      const spinnerEl = document.getElementById('sbtn-icon');
      if (spinnerEl) spinnerEl.outerHTML = '<i class="fas fa-paper-plane" id="sbtn-icon"></i>';
    }
  });
}

console.log('%c✅ PAF-IAST v2.0 Enhanced — Loaded Successfully', 'color:#c9a84c;font-size:13px;font-weight:bold;background:#0a1628;padding:6px 14px;border-radius:6px;');

/* ═══════════════════════════════════════════════════════════════
   SARAH & JAMES — E-WEDDING INVITATION
   script.js — All interactivity
═══════════════════════════════════════════════════════════════ */

'use strict';

// ────────────────────────────────────────────────
// 1. CONFETTI ON LOAD
// ────────────────────────────────────────────────
(function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  const COLORS = ['#F2C4CE','#E8A0AD','#C9A96E','#E8D5A3','#FFFFFF','#C97B8A','#8B5563'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.w = Math.random() * 10 + 4;
    this.h = Math.random() * 6 + 2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.06;
    this.velY = Math.random() * 3 + 1.5;
    this.velX = (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.y += p.velY;
      p.x += p.velX;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
      if (p.y > H + 20) particles.splice(i, 1);
    });
    if (particles.length > 0) {
      animId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, W, H);
      canvas.style.pointerEvents = 'none';
    }
  }

  window.launchConfetti = function(count = 160) {
    resize();
    particles = [];
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * H * 0.3 - H * 0.3; // start above viewport
      particles.push(p);
    }
    cancelAnimationFrame(animId);
    draw();
  };

  window.addEventListener('resize', resize);
  resize();

  // Auto-launch on page load
  window.addEventListener('load', () => {
    setTimeout(launchConfetti, 600);
  });
})();

// ────────────────────────────────────────────────
// 2. BACKGROUND MUSIC
// ────────────────────────────────────────────────
(function initMusic() {
  const btn = document.getElementById('musicToggle');
  let audio = null;
  let playing = false;

  // Using a royalty-free piano piece from a public CDN
  // Replace with your own audio file URL
  const MUSIC_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  function getAudio() {
    if (!audio) {
      audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = 0.3;
    }
    return audio;
  }

  btn.addEventListener('click', () => {
    const a = getAudio();
    if (!playing) {
      a.play().then(() => {
        playing = true;
        btn.classList.add('playing');
        btn.querySelector('.music-label').textContent = 'Music On';
      }).catch(() => {
        showToast('Could not autoplay audio in this browser.');
      });
    } else {
      a.pause();
      playing = false;
      btn.classList.remove('playing');
      btn.querySelector('.music-label').textContent = 'Music';
    }
  });
})();

// ────────────────────────────────────────────────
// 3. SCROLL REVEAL
// ────────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index within parent
        const siblings = Array.from(entry.target.parentElement.children).filter(c =>
          c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
        );
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ────────────────────────────────────────────────
// 4. FLOATING NAV — visibility & active dot
// ────────────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('floatingNav');
  const dots = document.querySelectorAll('.nav-dot');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  window.addEventListener('scroll', () => {
    // Show nav after first section
    if (window.scrollY > window.innerHeight * 0.5) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    // Active dot
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight / 2) {
        current = sec.id;
      }
    });
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Smooth click
  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ────────────────────────────────────────────────
// 5. OPEN INVITATION BUTTON
// ────────────────────────────────────────────────
document.getElementById('openInvitation').addEventListener('click', () => {
  const couple = document.getElementById('couple');
  if (couple) couple.scrollIntoView({ behavior: 'smooth' });
  launchConfetti(200);
});

// ────────────────────────────────────────────────
// 6. COUNTDOWN TIMER
// ────────────────────────────────────────────────
(function initCountdown() {
  const WEDDING_DATE = new Date('2025-06-14T10:00:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    animateNumber('days', pad(d));
    animateNumber('hours', pad(h));
    animateNumber('minutes', pad(m));
    animateNumber('seconds', pad(s));
  }

  const prevValues = {};
  function animateNumber(id, val) {
    const el = document.getElementById(id);
    if (el && prevValues[id] !== val) {
      el.style.transform = 'translateY(-8px)';
      el.style.opacity = '0.5';
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.textContent = val;
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }, 80);
      });
      prevValues[id] = val;
    }
  }

  update();
  setInterval(update, 1000);
})();

// ────────────────────────────────────────────────
// 7. GALLERY LIGHTBOX
// ────────────────────────────────────────────────
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const items = document.querySelectorAll('.gallery-item[data-src]');
  let current = 0;

  function open(index) {
    current = index;
    img.src = items[index].dataset.src;
    img.style.opacity = '0';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { img.style.transition = 'opacity 0.3s'; img.style.opacity = '1'; }, 50);
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  function navigate(dir) {
    current = (current + dir + items.length) % items.length;
    img.style.opacity = '0';
    setTimeout(() => { img.src = items[current].dataset.src; img.style.opacity = '1'; }, 150);
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

// ────────────────────────────────────────────────
// 8. RSVP FORM
// ────────────────────────────────────────────────
(function initRSVP() {
  const submitBtn = document.getElementById('rsvpSubmit');
  const formContainer = document.getElementById('rsvpFormContainer');
  const successDiv = document.getElementById('rsvpSuccess');
  const againBtn = document.getElementById('rsvpAgain');
  const btnText = document.getElementById('rsvpBtnText');
  const btnLoading = document.getElementById('rsvpBtnLoading');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('rsvpName').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const phone = document.getElementById('rsvpPhone').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const guests = document.getElementById('rsvpGuests').value;
    const diet = document.getElementById('rsvpDiet').value.trim();
    const message = document.getElementById('rsvpMessage').value.trim();

    // Validation
    if (!name) { showToast('Please enter your full name.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email.'); return; }
    if (!attendance) { showToast('Please select your attendance status.'); return; }

    const data = { name, email, phone, attendance: attendance.value, guests: parseInt(guests), diet, message };

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    submitBtn.disabled = true;

    try {
      // Try Firebase (defined in index.html module script)
      let result = { success: true, demo: true };
      if (typeof window.submitRSVP === 'function') {
        result = await window.submitRSVP(data);
      }

      if (result.success) {
        formContainer.style.display = 'none';
        successDiv.style.display = 'block';
        if (data.attendance === 'yes') launchConfetti(120);
      }
    } catch (err) {
      console.error(err);
      showToast('Something went wrong. Please try again.');
    } finally {
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  againBtn && againBtn.addEventListener('click', () => {
    successDiv.style.display = 'none';
    formContainer.style.display = 'block';
    // Reset form
    document.getElementById('rsvpName').value = '';
    document.getElementById('rsvpEmail').value = '';
    document.getElementById('rsvpPhone').value = '';
    document.getElementById('rsvpDiet').value = '';
    document.getElementById('rsvpMessage').value = '';
    const checked = document.querySelector('input[name="attendance"]:checked');
    if (checked) checked.checked = false;
  });
})();

// ────────────────────────────────────────────────
// 9. COPY TO CLIPBOARD
// ────────────────────────────────────────────────
window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`"${text}" copied to clipboard!`);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast(`Copied to clipboard!`); }
    catch (e) { showToast('Could not copy. Please copy manually.'); }
    document.body.removeChild(ta);
  });
};

// ────────────────────────────────────────────────
// 10. TOAST NOTIFICATION
// ────────────────────────────────────────────────
let toastTimer;
window.showToast = function(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
};

// ────────────────────────────────────────────────
// 11. SMOOTH PARALLAX PETAL MOVEMENT
// ────────────────────────────────────────────────
(function initParallax() {
  const cover = document.getElementById('cover');
  if (!cover) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      cover.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
  }, { passive: true });
})();

// ────────────────────────────────────────────────
// 12. HONOR PREFER-REDUCED-MOTION
// ────────────────────────────────────────────────
(function checkMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', '0.01s');
    document.querySelectorAll('.petal').forEach(p => p.style.animation = 'none');
  }
})();
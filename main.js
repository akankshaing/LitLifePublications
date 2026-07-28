// LIT LIFE PUBLISHING — shared interactions

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- cursor glow (desktop only) ---------- */
  if (window.matchMedia('(min-width: 881px)').matches && window.matchMedia('(pointer:fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener('mousemove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('active');
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
    (function glowLoop(){
      cx += (gx - cx) * 0.14;
      cy += (gy - cy) * 0.14;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(glowLoop);
    })();
  }

  /* ---------- marquee: duplicate track content for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    /* ---------- tilt cards ---------- */
    document.querySelectorAll('.card, .pillar').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -4}deg) rotateY(${px * 4}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.textContent = open ? 'Close' : 'Menu';
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    }));
  }

  /* ---------- scroll reveal ---------- */
  const groups = document.querySelectorAll('.reveal-group');
  if ('IntersectionObserver' in window && groups.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
    groups.forEach(g => io.observe(g));
  } else {
    groups.forEach(g => g.classList.add('in-view'));
  }

  /* ---------- active nav link ---------- */
  const here = (location.pathname.split('/').pop() || 'home.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'home.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- library: genre filter ---------- */
  const filterRow = document.querySelector('.filter-row');
  const bookCards = document.querySelectorAll('.book-card');
  if (filterRow && bookCards.length) {
    filterRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      filterRow.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const genre = chip.dataset.filter;
      bookCards.forEach(card => {
        const match = genre === 'all' || card.dataset.genre === genre;
        card.classList.toggle('is-hidden', !match);
      });
    });
  }

  /* ---------- form handling (Formspree) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    const endpoint = form.getAttribute('data-endpoint');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');

      // No endpoint configured yet — fall back to the old front-end-only preview behaviour.
      if (!endpoint || endpoint.includes('YOUR_')) {
        form.reset();
        if (success) success.classList.add('show');
        else alert('Thank you — your submission has been received.');
        console.warn('Lit Life: this form has no live Formspree endpoint set yet — running in preview mode.');
        return;
      }

      const originalBtnText = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          if (success) success.classList.add('show');
          else alert('Thank you — your submission has been received.');
        } else {
          alert('Something went wrong sending your message. Please try again, or email us directly.');
        }
      } catch (err) {
        alert('Something went wrong sending your message. Please check your connection and try again.');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
      }
    });
  });

  const shelfHero = document.querySelector('.shelf-hero');
  const book = document.getElementById('fallingBook');
  const siteFooter = document.querySelector('footer.site-footer');

  if (shelfHero) {
    const motesHost = shelfHero.querySelector('.shelf-row');
    if (motesHost) {
      for (let i = 0; i < 14; i++) {
        const m = document.createElement('span');
        m.className = 'dust-mote';
        const size = 1.5 + Math.random() * 2.5;
        m.style.width = size + 'px';
        m.style.height = size + 'px';
        m.style.left = (Math.random() * 100) + '%';
        m.style.bottom = (Math.random() * 40) + 'px';
        m.style.animationDuration = (5 + Math.random() * 6) + 's';
        m.style.animationDelay = (Math.random() * 6) + 's';
        motesHost.appendChild(m);
      }
    }
  }

  if (shelfHero && book && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const FALL_DISTANCE = 260;   // px it travels (in-hero) once tipped off the shelf
    const DRIFT = 40;            // px sideways drift during the tip-off
    const SPIN = 280;            // degrees of tumble during the tip-off
    const SPIN_FALL = 760;       // additional degrees of continuous tumbling while drifting down the page
    const RANGE_FRACTION = 0.42; // tip-off resolves within this fraction of the hero's height
    const SETTLE_ROT = 12;       // resting tilt once it finally lands
    const LANDING_GAP = 90;      // px above the footer where it comes to rest

    // Fast-start easing: quick drop, then eases out — the reverse of a slow ease-in.
    function easeFallOut(p) { return 1 - Math.pow(1 - p, 3); }
    function easeInOut(p) { return p < 0.5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2; }

    let current = { x: 0, y: 0, rot: 0, top: 0 };
    let target = { x: 0, y: 0, rot: 0, top: 0 };
    let landedTriggered = false;
    let detached = false;
    let ticking = false;

    // metrics recomputed on load/resize since page height & footer position can shift
    let heroTopDoc = 0, heroH = 0, footerTopDoc = 0, phaseAEndViewportY = 0;
    function refreshMetrics() {
      const heroRect = shelfHero.getBoundingClientRect();
      heroTopDoc = heroRect.top + window.scrollY;
      heroH = shelfHero.offsetHeight || 1;
      if (siteFooter) {
        const footRect = siteFooter.getBoundingClientRect();
        footerTopDoc = footRect.top + window.scrollY;
      } else {
        footerTopDoc = document.documentElement.scrollHeight;
      }
      // the viewport Y the book sits at the instant phase A finishes — a fixed
      // constant (depends only on hero height, not on live scroll position)
      phaseAEndViewportY = 96 + FALL_DISTANCE - heroH * RANGE_FRACTION;
    }

    function phaseAProgress() {
      const scrolledPast = Math.min(Math.max(window.scrollY - heroTopDoc, 0), heroH);
      const range = Math.max(1, heroH * RANGE_FRACTION);
      return Math.min(1, Math.max(0, scrolledPast / range));
    }

    function phaseBProgress() {
      const range = Math.max(1, window.innerHeight);
      const start = heroTopDoc + heroH * RANGE_FRACTION;
      const end = Math.max(start + range, footerTopDoc - window.innerHeight + LANDING_GAP);
      return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
    }

    function spawnPuff() {
      const bookRect = book.getBoundingClientRect();
      const puff = document.createElement('span');
      puff.className = 'impact-puff';
      puff.style.position = 'fixed';
      puff.style.left = (bookRect.left + bookRect.width * 0.55) + 'px';
      puff.style.top = (bookRect.top + bookRect.height * 0.92) + 'px';
      document.body.appendChild(puff);
      puff.addEventListener('animationend', () => puff.remove());
    }

    function update() {
      const pA = phaseAProgress();
      const easedA = easeFallOut(pA);

      book.classList.toggle('tipping', pA > 0.02);
      book.classList.toggle('mid-fall', pA > 0.02 && pA < 0.98 && !detached);

      if (pA < 1) {
        // still on/leaving the shelf — absolute positioning inside the hero
        if (detached) {
          detached = false;
          book.classList.remove('detached');
          book.style.top = '';
        }
        target.x = DRIFT * easedA;
        target.y = FALL_DISTANCE * easedA;
        target.rot = SPIN * pA;
        landedTriggered = false;
      } else {
        // fully off the shelf — fixed viewport position, drifting down the
        // rest of the page from a constant hand-off point (never recomputed
        // from the live scroll offset, which is what caused it to vanish)
        if (!detached) {
          detached = true;
          book.classList.add('detached');
          current.top = phaseAEndViewportY;
        }
        const pB = phaseBProgress();
        const endViewportY = window.innerHeight - 150;
        const t = easeInOut(pB);
        target.top = phaseAEndViewportY + (endViewportY - phaseAEndViewportY) * t;
        target.x = DRIFT + Math.sin(pB * Math.PI * 1.4) * 14;

        // keep tumbling continuously (several full turns) almost the whole
        // way down, then ease into a small resting tilt only right at the
        // very end, as it settles near the footer
        const rawSpin = SPIN + SPIN_FALL * pB;
        const settleBlend = Math.min(1, Math.max(0, (pB - 0.9) / 0.1));
        const totalAtEnd = SPIN + SPIN_FALL;
        const restingRot = Math.round((totalAtEnd - SETTLE_ROT) / 360) * 360 + SETTLE_ROT;
        target.rot = rawSpin + (restingRot - rawSpin) * settleBlend;

        if (pB >= 0.995) {
          if (!landedTriggered) { landedTriggered = true; spawnPuff(); }
        } else {
          landedTriggered = false;
        }
      }
    }

    function animate() {
      current.x += (target.x - current.x) * 0.22;
      current.rot += (target.rot - current.rot) * 0.22;
      if (detached) {
        current.top += (target.top - current.top) * 0.16;
        book.style.top = current.top + 'px';
        book.style.transform = `translateX(${current.x}px) rotate(${current.rot}deg)`;
      } else {
        current.y += (target.y - current.y) * 0.22;
        book.style.transform = `translate(${current.x}px, ${current.y}px) rotate(${current.rot}deg)`;
      }
      requestAnimationFrame(animate);
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }

    refreshMetrics();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { refreshMetrics(); update(); });
    window.addEventListener('load', refreshMetrics);
    requestAnimationFrame(animate);
  }

});

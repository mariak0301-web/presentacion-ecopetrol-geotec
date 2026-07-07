// GEOTEC × Ecopetrol — Presentación interactiva
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navbar = document.querySelector('.navbar');
  const navOffset = () => (navbar ? navbar.offsetHeight : 64) + 12;

  /* ---------- Barra de progreso de lectura ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Sombra del navbar al hacer scroll ---------- */
  const navShadow = () => navbar && navbar.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', navShadow, { passive: true });
  navShadow();

  /* ---------- Menú móvil ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const closeMenu = () => {
    if (!navbar || !navbar.classList.contains('nav-open')) return;
    navbar.classList.remove('nav-open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
  };
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      const open = navbar.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Smooth scroll con offset real del navbar ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      window.scrollTo({
        top: target.offsetTop - navOffset(),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ---------- Cascada (stagger) en cuadrículas ---------- */
  const staggerGrids = document.querySelectorAll(
    '.team-grid, .card-grid, .tool-focus-grid, .evidence-grid, .validation-steps, .expertise-flow, .value-strip, .hero-stats, .alliance-badges, .mag-stats'
  );
  staggerGrids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--stagger', `${Math.min(i, 11) * 70}ms`);
      if (!child.classList.contains('reveal')) child.classList.add('reveal-child');
    });
  });
  // Las tool-cards ya tienen .reveal individual: solo se les asigna el retardo
  document.querySelectorAll('.tool-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--stagger', `${(i % 3) * 90}ms`);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Contadores numéricos ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion || isNaN(target)) { el.textContent = target; return; }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Spotlight en tarjetas ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tool-card, .tool-focus-card, .evidence-card, .team-item, .pillar').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Botón volver arriba ---------- */
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Volver arriba');
  toTop.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const toggleTop = () => toTop.classList.toggle('show', window.scrollY > 700);
  window.addEventListener('scroll', toggleTop, { passive: true });
  toggleTop();

  /* ---------- Terminal de validación (firma visual) ---------- */
  const terminal = document.getElementById('terminal');
  if (terminal) {
    const lines = terminal.querySelectorAll('.t-line');
    let played = false;
    const playTerminal = () => {
      if (played) return;
      played = true;
      if (reduceMotion) {
        lines.forEach(l => l.style.opacity = 1);
        return;
      }
      lines.forEach((line, i) => {
        setTimeout(() => { line.style.transition = 'opacity .25s ease'; line.style.opacity = 1; }, i * 380);
      });
    };
    const termObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { playTerminal(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    termObserver.observe(terminal);
  }

  /* ---------- Nav activo según sección visible ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -35% 0px' });
  sections.forEach(sec => navObserver.observe(sec));
});

/* ---------- Carrusel de clientes (marquee) ---------- */
(function () {
  const clients = [
    { src: 'assets/clientes/ecopetrol.png', alt: 'Ecopetrol' },
    { src: 'assets/clientes/frontera_energy.png', alt: 'Frontera Energy' },
    { src: 'assets/clientes/exxonmobil.png', alt: 'ExxonMobil' },
    { src: 'assets/clientes/bp.png', alt: 'BP', large: true },
    { src: 'assets/clientes/bhp_billiton.png', alt: 'BHP Billiton' },
    { src: 'assets/clientes/petrobras.png', alt: 'Petrobras', large: true },
    { src: 'assets/clientes/gran_tierra.png', alt: 'Gran Tierra', large: true },
    { src: 'assets/clientes/equion.png', alt: 'Equion' },
    { src: 'assets/clientes/anh.png', alt: 'ANH' },
    { src: 'assets/clientes/cenit.png', alt: 'Cenit' },
    { src: 'assets/clientes/mintransporte.png', alt: 'Mintransporte' },
    { src: 'assets/clientes/tw_solar.png', alt: 'TW Solar' },
    { src: 'assets/clientes/acorn.png', alt: 'Acorn International', large: true },
    { src: 'assets/clientes/fonade.png', alt: 'Fonade' },
    { src: 'assets/clientes/kof.png', alt: 'KOF' },
    { src: 'assets/clientes/ocensa.webp', alt: 'Ocensa' },
    { src: 'assets/clientes/petrosantander.webp', alt: 'PetroSantander' },
    { src: 'assets/clientes/uaesp.png', alt: 'UAESP' },
    { src: 'assets/clientes/secop.png', alt: 'SECOP' }
  ];
  function makeChip(c) {
    const chip = document.createElement('div');
    chip.className = 'client-chip' + (c.large ? ' chip-lg' : '');
    const img = document.createElement('img');
    img.src = c.src;
    img.alt = c.alt;
    img.loading = 'lazy';
    chip.appendChild(img);
    return chip;
  }
  const mq1 = document.getElementById('mq1');
  const mq2 = document.getElementById('mq2');
  if (!mq1 || !mq2) return;
  const rowA = clients.slice(0, 10);
  const rowB = clients.slice(10);
  [...rowA, ...rowA].forEach(c => mq1.appendChild(makeChip(c)));
  [...rowB, ...rowB, ...rowB].forEach(c => mq2.appendChild(makeChip(c)));
}());

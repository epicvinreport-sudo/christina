/* =============================================================
   Christina Carlsen - core site behaviour
   Partials loader -> Sticky header -> Mobile menu -> Forms
   ============================================================= */

(function () {
  'use strict';

  async function injectPartial(selector, file) {
    const slot = document.querySelector(selector);
    if (!slot) return;
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) return;
      slot.outerHTML = await res.text();
    } catch (_) { /* ignore */ }
  }

  async function bootstrap() {
    await Promise.all([
      injectPartial('[data-include="header"]', '/partials/_header.html'),
      injectPartial('[data-include="footer"]', '/partials/_footer.html'),
    ]);
    initSite();
    if (typeof window.initAnimations === 'function') window.initAnimations();
  }

  function initSite() {
    /* active nav */
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const dir = location.pathname.split('/').slice(0, -1).filter(Boolean)[0] || '';
    document.querySelectorAll('[data-nav]').forEach((el) => {
      const target = el.dataset.nav;
      const isExact = target === path || (path === '' && target === 'index.html');
      const isFolder = dir && target === `${dir}.html`;
      if (isExact || isFolder) el.classList.add('is-active');
    });

    /* sticky header */
    const header = document.querySelector('.site-header');
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 30) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* mobile nav */
    const toggle = document.querySelector('[data-nav-toggle]');
    const body = document.body;
    if (toggle) {
      toggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
        const expanded = body.classList.contains('nav-open');
        toggle.setAttribute('aria-expanded', String(expanded));
        const label = toggle.querySelector('.nav-label');
        if (label) label.textContent = expanded ? 'Close' : 'Menu';
      });
    }
    document.querySelectorAll('.mobile-nav a').forEach((a) => {
      a.addEventListener('click', () => {
        body.classList.remove('nav-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        const label = toggle && toggle.querySelector('.nav-label');
        if (label) label.textContent = 'Menu';
      });
    });

    /* marquee duplicate */
    document.querySelectorAll('.marquee-track').forEach((track) => {
      const clone = track.firstElementChild && track.firstElementChild.cloneNode(true);
      if (clone) track.appendChild(clone);
    });

    /* demo forms */
    document.querySelectorAll('[data-demo-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = '/thank-you.html';
      });
    });

    /* year stamp */
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });

    /* blog filter */
    const filterButtons = document.querySelectorAll('[data-blog-filter]');
    if (filterButtons.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          const filter = btn.dataset.blogFilter;
          document.querySelectorAll('[data-blog-card]').forEach((card) => {
            const cat = card.dataset.blogCard;
            card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
          });
        });
      });
    }

    /* custom cursor (desktop) */
    if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      const ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);

      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx, ry = my;

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });

      const animateRing = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
      };
      animateRing();

      document.querySelectorAll('a, button, .book-card, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

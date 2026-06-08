/* eslint-disable no-undef */
/* global gsap, ScrollTrigger, Lenis, SplitType */
/* =============================================================
   Christina Carlsen - animations
   Lenis + GSAP + ScrollTrigger + SplitType
   Exposes window.initAnimations() so it can be called after partials inject.
   ============================================================= */

window.initAnimations = function () {
  if (typeof gsap === 'undefined') return;
  if (window.__cc_anim_inited) return;
  window.__cc_anim_inited = true;

  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll */
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Loader fade */
  const fadeLoader = () => {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => loader.remove(),
    });
  };
  if (document.readyState === 'complete') {
    fadeLoader();
  } else {
    window.addEventListener('load', fadeLoader);
  }

  /* SplitType: hero (intro) */
  if (typeof SplitType !== 'undefined') {
    const hero = document.querySelector('[data-split="hero"]');
    if (hero) {
      const split = new SplitType(hero, { types: 'lines, words', tagName: 'span' });
      split.lines.forEach((line) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'row';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
        stagger: 0.04,
        delay: 0.3,
      });
    }

    document.querySelectorAll('[data-split="lines"]').forEach((el) => {
      const split = new SplitType(el, { types: 'lines', tagName: 'span' });
      split.lines.forEach((line) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'block';
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
      gsap.from(split.lines, {
        yPercent: 105,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }

  /* Hero figure curtain reveal */
  const heroFig = document.querySelector('.hero-figure');
  if (heroFig) {
    const mask = heroFig.querySelector('.figure-mask');
    const img = heroFig.querySelector('img');
    const tl = gsap.timeline({ delay: 0.55 });
    if (mask) tl.to(mask, { scaleY: 0, duration: 1.1, ease: 'power3.inOut' });
    if (img) tl.to(img, { scale: 1, duration: 1.4, ease: 'power3.out' }, '<');
  }

  /* Reveal up */
  document.querySelectorAll('.reveal-up').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  /* Image curtain reveal */
  document.querySelectorAll('.img-reveal').forEach((el) => {
    const curtain = el.querySelector('.curtain');
    const img = el.querySelector('img');
    if (curtain) {
      gsap.to(curtain, {
        scaleY: 0,
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.15 },
        {
          scale: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      );
    }
  });

  /* Marquee infinite scroll */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    const totalWidth = track.scrollWidth / 2;
    if (totalWidth > 0) {
      gsap.to(track, {
        x: -totalWidth,
        duration: 38,
        ease: 'none',
        repeat: -1,
      });
    }
  });

  /* Parallax */
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 60;
    gsap.fromTo(
      el,
      { y: amount },
      {
        y: -amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  // also schedule a refresh now in case load already fired
  setTimeout(() => { try { ScrollTrigger.refresh(); } catch (_e) { /* noop */ } }, 600);
};

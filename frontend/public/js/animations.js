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
    const tl = gsap.timeline({ onComplete: () => loader.remove() });
    // animate the count up to 100 quickly while the progress bar fills (1.6s)
    const count = loader.querySelector('[data-pl-count]');
    if (count) {
      const obj = { v: 0 };
      tl.to(obj, {
        v: 100,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          count.textContent = String(Math.round(obj.v)).padStart(3, '0');
        },
      }, 0);
    }
    // Curtain wipe to reveal page
    tl.add(() => loader.classList.add('is-leaving'), '>-0.05')
      .to(loader, { duration: 0.9, ease: 'power3.inOut',
        onStart: () => {
          const t = loader.querySelector('.pl-curtain.top');
          const b = loader.querySelector('.pl-curtain.bot');
          if (t) gsap.to(t, { y: 0, yPercent: -100, duration: 0.9, ease: 'power3.inOut' });
          if (b) gsap.to(b, { y: 0, yPercent: 100, duration: 0.9, ease: 'power3.inOut' });
        }
      })
      .to(loader, { opacity: 0, duration: 0.4, ease: 'power2.out' }, '>-0.2');
  };
  // Title reveal first
  const plTitle = document.querySelector('.page-loader .pl-title span');
  const plMark = document.querySelector('.page-loader .pl-mark');
  if (plTitle) gsap.to(plTitle, { y: '0%', duration: 0.85, ease: 'power3.out', delay: 0.15 });
  if (plMark) gsap.to(plMark, { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.35 });

  if (document.readyState === 'complete') {
    setTimeout(fadeLoader, 1600);
  } else {
    let firedLoad = false;
    const trigger = () => { if (firedLoad) return; firedLoad = true; setTimeout(fadeLoader, 1600); };
    window.addEventListener('load', trigger);
    // safety: never hold the loader for more than 5s
    setTimeout(trigger, 5000);
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

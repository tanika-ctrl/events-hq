/**
 * parallax.js — Subtle parallax effects on hero background
 * Only runs on non-touch, non-reduced-motion devices
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePonter = window.matchMedia('(pointer: fine)').matches;

  if (prefersReducedMotion || !hasFinePonter) return;

  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrollY < heroHeight) {
          const progress = scrollY / heroHeight;
          heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
          heroBg.style.opacity = 1 - progress * 0.4;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();

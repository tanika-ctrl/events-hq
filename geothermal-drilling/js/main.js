/**
 * main.js — Initializes hero particles and any remaining global behaviors
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Hero Particles ───────────────────────────────────────
  function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container || prefersReducedMotion) return;

    const particleCount = window.innerWidth < 600 ? 12 : 24;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';

      // Random horizontal position
      const x = Math.random() * 100;
      // Random size (2–5px)
      const size = 2 + Math.random() * 3;
      // Random animation duration (8–20s)
      const duration = 8 + Math.random() * 12;
      // Random delay (0–8s)
      const delay = Math.random() * 8;
      // Random opacity
      const opacity = 0.3 + Math.random() * 0.5;

      particle.style.cssText = [
        'position: absolute',
        'left: ' + x + '%',
        'bottom: -10px',
        'width: ' + size + 'px',
        'height: ' + size + 'px',
        'border-radius: 50%',
        'background: rgba(230, 126, 34, ' + opacity + ')',
        'animation: float-up ' + duration + 's ' + delay + 's ease-in infinite',
        'will-change: transform',
        'pointer-events: none',
      ].join(';');

      container.appendChild(particle);
    }
  }

  // ─── Smooth anchor scroll override ───────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        const navHeight = document.getElementById('main-nav').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });
  }

  // ─── Impact bar animations ────────────────────────────────
  function initImpactBars() {
    const bars = document.querySelectorAll('.impact-bar__fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.dataset.width || bar.style.width;
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = targetWidth + (String(targetWidth).includes('%') ? '' : '%');
            bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          }, 150);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      const w = bar.style.width;
      bar.dataset.width = parseFloat(w);
      bar.style.width = '0';
      observer.observe(bar);
    });
  }

  // ─── Init all ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initSmoothScroll();
    initImpactBars();
  });

  // Also run immediately if DOM is already loaded
  if (document.readyState !== 'loading') {
    initParticles();
    initSmoothScroll();
    initImpactBars();
  }

})();

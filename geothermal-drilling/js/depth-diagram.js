/**
 * depth-diagram.js — Scroll-driven SVG drill animation
 * Maps scroll position within the "How Drilling Works" section
 * to: drill path length, rock layer visibility, step card activation,
 * temperature display, and casing segments.
 */
(function () {
  'use strict';

  const section = document.getElementById('how-drilling-works');
  if (!section) return;

  const drillPath = document.getElementById('drill-path');
  const drillBit = document.getElementById('drill-bit');
  const depthDisplay = document.getElementById('drill-depth-display');
  const tempDisplay = document.getElementById('drill-temp-display');
  const tempFill = document.getElementById('temp-fill');
  const tempText = document.getElementById('temp-text');
  const stepCards = document.querySelectorAll('.step-card');

  // Rock layers and labels
  const layers = [
    { layer: 'layer-soil', label: 'lbl-soil', casing: 'casing-1' },
    { layer: 'layer-sediment', label: 'lbl-sediment', casing: 'casing-2' },
    { layer: 'layer-granite', label: 'lbl-granite', casing: 'casing-3' },
    { layer: 'layer-basalt', label: 'lbl-basalt', casing: null },
    { layer: 'layer-hot-rock', label: 'lbl-hot-rock', casing: null },
    { layer: 'layer-reservoir', label: 'lbl-reservoir', casing: null },
  ];

  // SVG path total length
  const PATH_LENGTH = 600;
  // Drill bit Y range in SVG (0 to ~570)
  const BIT_START_Y = 0;
  const BIT_END_Y = 570;
  // Temperature range
  const TEMP_START = 15;
  const TEMP_END = 300;
  // Depth range (meters)
  const DEPTH_START = 0;
  const DEPTH_END = 3200;
  // Temp fill height range (SVG units)
  const TEMP_FILL_MAX = 500;

  // Step thresholds (0–1 progress): when each step card activates
  const STEP_THRESHOLDS = [0, 0.12, 0.28, 0.45, 0.63, 0.82];
  // Layer reveal thresholds
  const LAYER_THRESHOLDS = [0.02, 0.15, 0.30, 0.50, 0.68, 0.85];

  let currentStep = 0;
  let ticking = false;
  let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function getScrollProgress() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Progress starts when section top hits viewport, ends when section bottom leaves
    const scrolled = -rect.top;
    const totalScrollable = sectionHeight - viewportHeight;

    return clamp(scrolled / Math.max(totalScrollable, 1), 0, 1);
  }

  function updateDiagram(progress) {
    if (prefersReducedMotion) return;

    // 1. Draw drill path
    const drawnLength = progress * PATH_LENGTH;
    drillPath.style.strokeDashoffset = PATH_LENGTH - drawnLength;

    // 2. Move drill bit
    const bitY = lerp(BIT_START_Y, BIT_END_Y, progress);
    drillBit.setAttribute('transform', 'translate(150, ' + bitY + ')');

    // 3. Temperature
    const temp = Math.round(lerp(TEMP_START, TEMP_END, progress));
    if (tempDisplay) tempDisplay.textContent = temp + '°C';

    // Update SVG temp gauge
    if (tempFill && tempText) {
      const fillHeight = progress * TEMP_FILL_MAX;
      const fillY = TEMP_FILL_MAX - fillHeight;
      tempFill.setAttribute('y', fillY);
      tempFill.setAttribute('height', fillHeight);
      tempText.setAttribute('y', fillY - 4 > 10 ? fillY - 4 : 10);
      tempText.textContent = temp + '°';
    }

    // 4. Depth display
    const depth = Math.round(lerp(DEPTH_START, DEPTH_END, progress));
    if (depthDisplay) {
      if (depth < 1000) {
        depthDisplay.textContent = depth + ' m';
      } else {
        depthDisplay.textContent = (depth / 1000).toFixed(1) + ' km';
      }
    }

    // 5. Reveal geology layers
    layers.forEach((item, i) => {
      const layerEl = document.getElementById(item.layer);
      const labelEl = document.getElementById(item.label);
      const threshold = LAYER_THRESHOLDS[i];

      if (progress >= threshold) {
        if (layerEl) {
          const layerProgress = clamp((progress - threshold) / 0.1, 0, 1);
          layerEl.style.opacity = layerProgress;
        }
        if (labelEl) {
          const labelProgress = clamp((progress - threshold - 0.02) / 0.1, 0, 1);
          labelEl.style.opacity = labelProgress;
        }
      } else {
        if (layerEl) layerEl.style.opacity = 0;
        if (labelEl) labelEl.style.opacity = 0;
      }

      // Reveal casing segments
      if (item.casing) {
        const casingEl = document.getElementById(item.casing);
        if (casingEl && progress >= threshold) {
          const casingProgress = clamp((progress - threshold) / 0.08, 0, 1);
          casingEl.style.opacity = casingProgress;

          // Grow casing height proportional to drill progress
          const casingDepths = [50, 130, 250];
          const maxHeight = casingDepths[i] || 50;
          const currentHeight = casingProgress * maxHeight;
          casingEl.setAttribute('height', currentHeight);
        }
      }
    });

    // 6. Activate step cards
    let activeStep = 0;
    STEP_THRESHOLDS.forEach((threshold, i) => {
      if (progress >= threshold) activeStep = i;
    });

    if (activeStep !== currentStep) {
      currentStep = activeStep;
      stepCards.forEach((card, i) => {
        if (i === activeStep) {
          card.classList.add('is-active');
          // Smooth scroll step card into view on mobile
          if (window.innerWidth < 768) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          card.classList.remove('is-active');
        }
      });
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        const progress = getScrollProgress();
        updateDiagram(progress);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initialize on load
  updateDiagram(0);

  // ─── Earth diagram depth slider (Section 1: What Is) ──────
  const depthSlider = document.getElementById('depth-slider');
  const depthValue = document.getElementById('depth-value');
  const tempValue = document.getElementById('temp-value');
  const earthLayers = document.querySelectorAll('.earth-layer');

  const depthData = [
    { depth: 0, temp: 15, unit: 'km', label: '0 km' },
    { depth: 5, temp: 150, unit: 'km', label: '5 km' },
    { depth: 35, temp: 400, unit: 'km', label: '35 km' },
    { depth: 100, temp: 1300, unit: 'km', label: '100 km' },
    { depth: 2900, temp: 3500, unit: 'km', label: '2,900 km' },
    { depth: 5100, temp: 5000, unit: 'km', label: '5,100 km' },
  ];

  if (depthSlider) {
    depthSlider.addEventListener('input', function () {
      const idx = parseInt(this.value, 10);
      const data = depthData[idx];

      if (depthValue) depthValue.textContent = data.label;
      if (tempValue) {
        tempValue.textContent = data.temp.toLocaleString() + '°C';
        // Color temperature readout based on value
        const hue = Math.max(0, 30 - (idx * 5));
        tempValue.style.color = `hsl(${hue}, 90%, 60%)`;
      }

      // Highlight active layer
      earthLayers.forEach((layer, i) => {
        if (i <= idx) {
          layer.style.opacity = 1;
          if (i === idx) {
            layer.style.outline = '2px solid rgba(230, 126, 34, 0.6)';
          } else {
            layer.style.outline = 'none';
          }
        } else {
          layer.style.opacity = 0.3;
          layer.style.outline = 'none';
        }
      });
    });
  }

  // ─── World Map Tooltips ───────────────────────────────────
  const hotspots = document.querySelectorAll('.geo-hotspot');
  const tooltip = document.getElementById('map-tooltip');
  const tooltipCountry = document.getElementById('tooltip-country');
  const tooltipStat = document.getElementById('tooltip-stat');
  const tooltipDetail = document.getElementById('tooltip-detail');
  const mapContainer = document.getElementById('world-map-container');

  if (hotspots.length && tooltip) {
    hotspots.forEach(spot => {
      spot.addEventListener('mouseenter', function (e) {
        const country = this.dataset.country;
        const stat = this.dataset.stat;
        const detail = this.dataset.detail;

        if (tooltipCountry) tooltipCountry.textContent = country;
        if (tooltipStat) tooltipStat.textContent = stat;
        if (tooltipDetail) tooltipDetail.textContent = detail;

        tooltip.classList.add('is-visible');
      });

      spot.addEventListener('mousemove', function (e) {
        const containerRect = mapContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left + 12;
        let y = e.clientY - containerRect.top - 10;

        // Keep tooltip within bounds
        const tooltipWidth = 180;
        if (x + tooltipWidth > containerRect.width) {
          x = e.clientX - containerRect.left - tooltipWidth - 12;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      });

      spot.addEventListener('mouseleave', function () {
        tooltip.classList.remove('is-visible');
      });

      // Touch support
      spot.addEventListener('click', function (e) {
        e.stopPropagation();
        const country = this.dataset.country;
        const stat = this.dataset.stat;
        const detail = this.dataset.detail;

        if (tooltipCountry) tooltipCountry.textContent = country;
        if (tooltipStat) tooltipStat.textContent = stat;
        if (tooltipDetail) tooltipDetail.textContent = detail;
        tooltip.classList.toggle('is-visible');

        const rect = this.getBoundingClientRect();
        const containerRect = mapContainer.getBoundingClientRect();
        tooltip.style.left = (rect.left - containerRect.left + 10) + 'px';
        tooltip.style.top = (rect.top - containerRect.top - 80) + 'px';
      });
    });

    document.addEventListener('click', function () {
      tooltip.classList.remove('is-visible');
    });
  }

  // ─── Carousel ─────────────────────────────────────────────
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (carouselTrack) {
    const slides = carouselTrack.querySelectorAll('.carousel__slide');
    let currentSlide = 0;

    // Create dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, slides.length - 1));
      const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(carouselTrack).gap);
      carouselTrack.scrollTo({ left: currentSlide * slideWidth, behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentSlide);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    // Update dots on manual scroll
    carouselTrack.addEventListener('scroll', function () {
      const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(carouselTrack).gap || 0);
      currentSlide = Math.round(this.scrollLeft / slideWidth);
      updateDots();
    });
  }

  // ─── Tech Cards Expand/Collapse ───────────────────────────
  const techCards = document.querySelectorAll('.tech-card');
  techCards.forEach(card => {
    card.addEventListener('click', function () {
      const isExpanded = this.classList.contains('is-expanded');
      techCards.forEach(c => c.classList.remove('is-expanded'));
      if (!isExpanded) {
        this.classList.add('is-expanded');
      }
    });
  });

  // ─── Timeline ─────────────────────────────────────────────
  const timelineNodes = document.querySelectorAll('.timeline-node');
  if (timelineNodes.length) {
    timelineNodes[0].querySelector('.timeline-node__content').classList.add('is-active');

    timelineNodes.forEach(node => {
      const content = node.querySelector('.timeline-node__content');
      if (content) {
        content.addEventListener('click', function () {
          timelineNodes.forEach(n => {
            const c = n.querySelector('.timeline-node__content');
            if (c) c.classList.remove('is-active');
          });
          this.classList.toggle('is-active');
        });
      }
    });
  }

})();

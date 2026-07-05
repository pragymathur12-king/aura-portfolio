// Elements marked with .reveal will fade/slide in when they enter the viewport.

(function () {
  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!revealEls.length) return;

  // If user prefers reduced motion, show immediately.
  if (reduceMotion || !supportsIO) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealEls.forEach((el) => io.observe(el));
})();

// Animated statistic counters for the About section
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counterEls = Array.from(document.querySelectorAll('.metric-value[data-target]'));
  if (!counterEls.length) return;

  const supportsIO = typeof IntersectionObserver !== 'undefined';

  const animate = (el, target) => {
    if (reduceMotion) {
      el.textContent = `${target}+`;
      return;
    }

    const duration = 900; // ms
    const start = performance.now();

    const from = 0;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const value = Math.round(from + (target - from) * easeOutCubic(t));
      el.textContent = `${value}+`;
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (!supportsIO) {
    counterEls.forEach((el) => {
      const target = Number(el.getAttribute('data-target') || '0');
      animate(el, target);
    });
    return;
  }

  const counterIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = Number(el.getAttribute('data-target') || '0');
          animate(el, target);
          counterIO.unobserve(el);
        }
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -15% 0px' }
  );

  counterEls.forEach((el) => counterIO.observe(el));
})();

// Animate product journey timeline while scrolling
(function () {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = Array.from(document.querySelectorAll('.timeline-item'));
  if (!items.length) return;

  // Build a scroll-based progress (simple, smooth enough)
  const ioSupportsIO = typeof IntersectionObserver !== 'undefined';
  if (!ioSupportsIO) return;

  const activateIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-active');
        activateIO.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  activateIO.observe(timeline);
})();




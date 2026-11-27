(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const slides = [...root.querySelectorAll('[data-slide]')];
    const controls = [...root.querySelectorAll('[data-target]')];
    if (slides.length < 2) return;
    let active = 0, visible = false, timer;
    const delay = Number(root.dataset.interval) || 6000;
    function schedule() {
      clearTimeout(timer);
      if (!reducedMotion.matches && visible && !document.hidden) timer = setTimeout(() => show(active + 1), delay);
    }
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== active;
        slide.inert = i !== active;
      });
      controls.forEach((control, i) => control.setAttribute('aria-pressed', String(i === active)));
      root.dataset.activeIndex = String(active);
      if (root.dataset.carousel === 'materials') {
        const link = root.closest('.material-layout')?.querySelector('[data-material-inquiry]');
        if (link) {
          const url = new URL(link.href);
          url.searchParams.set('material', controls[active].getAttribute('aria-label'));
          link.href = url.href;
        }
      }
      schedule();
    }
    controls.forEach((control, i) => control.addEventListener('click', () => show(i)));
    root.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();show(active + (event.key === 'ArrowRight' ? 1 : -1));controls[active].focus();
    });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', schedule);
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting;schedule();}, {threshold:.2});
    observer.observe(root);
    show(0);
  });
})();

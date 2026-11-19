(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const slides = [...root.querySelectorAll('[data-slide]')];
    const controls = [...root.querySelectorAll('[data-target]')];
    const pause = root.querySelector('[data-pause]');
    if (slides.length < 2 || !pause) return;
    let active = 0, paused = reducedMotion.matches, hovering = false, visible = false, timer;
    const delay = Number(root.dataset.interval) || 7000;
    // Reserva la altura de la diapositiva más alta para evitar saltos al cambiar.
    function stabilizeHeight() {
      if (root.dataset.carousel !== 'hero') return;
      root.style.removeProperty('--hero-stage-height');
      let height = 0;
      for (const slide of slides) {
        const hidden = slide.hidden;
        const style = slide.getAttribute('style');
        slide.hidden = false;
        Object.assign(slide.style,{position:'absolute',visibility:'hidden',width:'100%'});
        height = Math.max(height, slide.getBoundingClientRect().height);
        slide.hidden = hidden;
        if (style === null) slide.removeAttribute('style'); else slide.setAttribute('style',style);
      }
      root.style.setProperty('--hero-stage-height',Math.ceil(height)+'px');
    }
    function schedule() {
      clearTimeout(timer);
      if (!paused && !hovering && visible && !document.hidden) timer = setTimeout(() => show(active + 1), delay);
    }
    function setPaused(value) {
      paused = value;
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? (en ? 'Play' : 'Reproducir') : (en ? 'Pause' : 'Pausar');
      const subject = root.dataset.carousel === 'hero' ? (en ? 'hero images' : 'imágenes de portada') : (en ? 'material images' : 'imágenes de materiales');
      pause.setAttribute('aria-label', (paused ? (en ? 'Play ' : 'Reproducir ') : (en ? 'Pause ' : 'Pausar ')) + subject);
      schedule();
    }
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {slide.hidden = i !== active;});
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
    controls.forEach((control, i) => control.addEventListener('click', () => {setPaused(true);show(i);}));
    pause.addEventListener('click', () => setPaused(!paused));
    root.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();setPaused(true);show(active + (event.key === 'ArrowRight' ? 1 : -1));controls[active].focus();
    });
    root.addEventListener('mouseenter', () => {hovering = true;schedule();});
    root.addEventListener('mouseleave', () => {hovering = false;schedule();});
    root.addEventListener('focusin', event => {if (event.target !== pause) setPaused(true);});
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', event => {if (event.matches) setPaused(true);});
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting;schedule();}, {threshold:.2});
    observer.observe(root);
    setPaused(paused);show(0);
    stabilizeHeight();
    document.fonts.ready.then(stabilizeHeight);
    let resizeFrame;
    window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(stabilizeHeight);});
  });
})();

/*
 * Motion layer for the desktop portfolio.
 * All animation lives here; app.js calls these hooks so behaviour and motion stay separate.
 * Uses the Web Animations API and the individual `translate` / `scale` / `rotate` CSS
 * properties, so hover, drag and dock magnification never fight over `transform`.
 * Respects prefers-reduced-motion: every duration collapses to 0 and ambient effects stop.
 */
(() => {
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverQuery = matchMedia('(hover: hover) and (pointer: fine)');
  const still = () => reduceQuery.matches;

  const ease = {
    out: 'cubic-bezier(.22,1,.36,1)',
    spring: 'cubic-bezier(.34,1.45,.64,1)',
    in: 'cubic-bezier(.55,0,.75,.2)',
    inOut: 'cubic-bezier(.65,0,.35,1)'
  };

  /** Play keyframes; resolves when finished (or immediately when motion is reduced). */
  function play(el, frames, { duration = 300, delay = 0, easing = ease.out, fill = 'backwards' } = {}) {
    if (!el || !el.animate) return Promise.resolve();
    const anim = el.animate(frames, {
      duration: still() ? 0 : duration,
      delay: still() ? 0 : delay,
      easing,
      fill
    });
    return anim.finished.then(() => anim).catch(() => anim);
  }

  const clear = el => el && el.getAnimations && el.getAnimations().forEach(a => a.cancel());

  const centre = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  /* ---------- Intro ---------- */
  function intro() {
    const landscape = document.querySelector('.landscape');
    play(landscape, [
      { opacity: 0, transform: 'scale(1.08)' },
      { opacity: 1, transform: 'scale(1)' }
    ], { duration: 1800 });

    document.querySelectorAll('.brand, .intro, .side-nav .nav-link, .sidebar-foot').forEach((el, i) => {
      play(el, [
        { opacity: 0, translate: '0 10px', filter: 'blur(6px)' },
        { opacity: 1, translate: '0 0', filter: 'blur(0)' }
      ], { duration: 700, delay: 120 + i * 60 });
    });

    document.querySelectorAll('.tool-button').forEach((el, i) => {
      play(el, [
        { opacity: 0, translate: '0 -14px', scale: '.9' },
        { opacity: 1, translate: '0 0', scale: '1' }
      ], { duration: 560, delay: 300 + i * 55, easing: ease.spring });
    });

    const shell = document.querySelector('.dock-shell');
    play(shell, [
      { opacity: 0, translate: '0 40px' },
      { opacity: 1, translate: '0 0' }
    ], { duration: 700, delay: 420 });
    popDock([...document.querySelectorAll('.dock-app')], 560);

    cascadeIn([...document.querySelectorAll('.project-window')], 360);
  }

  /* ---------- Windows ---------- */
  function cascadeIn(windows, baseDelay = 0) {
    return Promise.all(windows.map((w, i) => play(w, [
      { opacity: 0, transform: 'translateY(28px) scale(.94)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 640, delay: baseDelay + i * 70 })));
  }

  function openFromDock(win, icon) {
    if (!icon || !icon.offsetParent) return cascadeIn([win]);
    const from = centre(icon.getBoundingClientRect());
    const box = win.getBoundingClientRect();
    const to = centre(box);
    const s = Math.max(icon.offsetWidth / box.width, 0.05);
    return play(win, [
      { opacity: 0, transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${s})` },
      { opacity: 1, offset: 0.35 },
      { opacity: 1, transform: 'none' }
    ], { duration: 560 });
  }

  function closeWindow(win, done) {
    win.style.pointerEvents = 'none';
    return play(win, [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'scale(.92)' }
    ], { duration: 200, easing: ease.in, fill: 'forwards' }).then(done);
  }

  /** Lightweight "genie": the window narrows, drops and shrinks into its dock icon. */
  function minimizeToDock(win, icon, done) {
    if (!icon || !icon.offsetParent) return closeWindow(win, done);
    win.style.pointerEvents = 'none';
    const box = win.getBoundingClientRect();
    const from = centre(box);
    const to = centre(icon.getBoundingClientRect());
    const dx = to.x - from.x, dy = to.y - from.y;
    const s = Math.max(icon.offsetWidth / box.width, 0.05);
    return play(win, [
      { opacity: 1, transform: 'none' },
      { opacity: 0.9, transform: `translate(${dx * 0.35}px, ${dy * 0.6}px) scale(.6, .42)`, offset: 0.55 },
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${s})` }
    ], { duration: 480, easing: ease.inOut, fill: 'forwards' }).then(() => {
      receive(icon);
      done && done();
    });
  }

  /** FLIP between the floating and maximised layouts. */
  function toggleMaximize(win) {
    clear(win);
    const first = win.getBoundingClientRect();
    win.classList.toggle('maximized');
    const last = win.getBoundingClientRect();
    if (!last.width || !last.height) return Promise.resolve();
    const sx = first.width / last.width, sy = first.height / last.height;
    const dx = first.left - last.left, dy = first.top - last.top;
    play(win.querySelector('.window-content'), [{ opacity: 0.55 }, { opacity: 1 }], { duration: 420 });
    return play(win, [
      { transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
      { transformOrigin: '0 0', transform: 'none' }
    ], { duration: 460 });
  }

  /** Small acknowledgement when a window that is already open is brought forward. */
  function nudge(win) {
    return play(win, [{ scale: '1' }, { scale: '1.015' }, { scale: '1' }], { duration: 260, easing: ease.inOut });
  }

  /* ---------- Dragging ---------- */
  function dragStart(win) {
    win.classList.add('dragging');
  }
  function dragMove(win, dx) {
    if (still()) return;
    const tilt = Math.max(-4, Math.min(4, dx * 0.35));
    win.style.rotate = `${tilt.toFixed(2)}deg`;
  }
  function dragEnd(win) {
    win.classList.remove('dragging');
    win.style.rotate = '0deg';
  }

  /* ---------- Dock ---------- */
  function popDock(icons, baseDelay = 0) {
    return Promise.all(icons.map((icon, i) => play(icon, [
      { opacity: 0, scale: '.4' },
      { opacity: 1, scale: '1' }
    ], { duration: 520, delay: baseDelay + i * 35, easing: ease.spring })));
  }

  function launch(icon) {
    if (!icon) return Promise.resolve();
    return play(icon, [
      { translate: '0 0' }, { translate: '0 -18px' }, { translate: '0 0' },
      { translate: '0 -8px' }, { translate: '0 0' }
    ], { duration: 720, easing: 'ease-in-out' });
  }

  function receive(icon) {
    return play(icon, [{ scale: '1' }, { scale: '1.14' }, { scale: '1' }], { duration: 300, easing: ease.out });
  }

  /** macOS-style magnification: icons near the pointer grow and lift. */
  function bindDock(dock) {
    const range = 130, maxMag = 1.45;
    let centres = [], raf = 0;
    const measure = () => {
      const left = dock.getBoundingClientRect().left - dock.scrollLeft;
      centres = [...dock.children].map(app => left + app.offsetLeft + app.offsetWidth / 2);
    };
    const reset = () => [...dock.children].forEach(app => app.style.setProperty('--mag', 1));
    dock.addEventListener('pointerenter', () => { if (hoverQuery.matches) measure(); });
    dock.addEventListener('pointermove', e => {
      if (!hoverQuery.matches || still()) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        [...dock.children].forEach((app, i) => {
          const d = Math.abs(e.clientX - (centres[i] ?? 0));
          const k = d < range ? (Math.cos(Math.PI * d / range) + 1) / 2 : 0;
          app.style.setProperty('--mag', (1 + (maxMag - 1) * k).toFixed(3));
        });
      });
    });
    dock.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); reset(); });
  }

  /* ---------- Leaving (used when filters change) ---------- */
  function leave(elements) {
    return Promise.all(elements.map((el, i) => play(el, [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateY(10px) scale(.96)' }
    ], { duration: 180, delay: i * 12, easing: ease.in, fill: 'forwards' })));
  }

  /* ---------- Popovers ---------- */
  function openPopover(pop) {
    clear(pop);
    pop.hidden = false;
    return play(pop, [
      { opacity: 0, transform: 'translateY(-6px) scale(.96)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 240 });
  }
  function closePopover(pop) {
    if (pop.hidden) return Promise.resolve();
    return play(pop, [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateY(-4px) scale(.97)' }
    ], { duration: 150, easing: ease.in, fill: 'forwards' }).then(() => { pop.hidden = true; clear(pop); });
  }

  /* ---------- Overlays ---------- */
  function showOverlay(overlay) {
    clear(overlay);
    overlay.hidden = false;
    play(overlay, [{ opacity: 0 }, { opacity: 1 }], { duration: 320 });
    overlay.querySelectorAll('.about-content, .source-card').forEach(el => play(el, [
      { opacity: 0, transform: 'translateY(24px) scale(.98)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 560, delay: 80 }));
    play(overlay.querySelector('.about-art'), [
      { opacity: 0, translate: '-40px 0' },
      { opacity: 0.82, translate: '0 0' }
    ], { duration: 760, delay: 40 });
    play(overlay.querySelector('.overlay-close'), [
      { opacity: 0, scale: '.8' },
      { opacity: 1, scale: '1' }
    ], { duration: 420, delay: 200, easing: ease.spring });
  }
  function hideOverlay(overlay) {
    if (overlay.hidden) return Promise.resolve();
    return play(overlay, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: ease.in, fill: 'forwards' })
      .then(() => { overlay.hidden = true; clear(overlay); });
  }

  /* ---------- About carousel ---------- */
  let swapChain = Promise.resolve();
  function swapAbout(direction, update) {
    swapChain = swapChain.then(async () => {
      const parts = ['.about-card', '.about-caption'].map(s => document.querySelector(s));
      const art = document.querySelector('#aboutArt');
      await Promise.all([
        ...parts.map(el => play(el, [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: `translateX(${-direction * 24}px)` }
        ], { duration: 160, easing: ease.in, fill: 'forwards' })),
        play(art, [{ opacity: 0.82, scale: '1' }, { opacity: 0, scale: '1.04' }], { duration: 160, easing: ease.in, fill: 'forwards' })
      ]);
      update();
      [...parts, art].forEach(clear);
      parts.forEach(el => play(el, [
        { opacity: 0, transform: `translateX(${direction * 24}px)` },
        { opacity: 1, transform: 'none' }
      ], { duration: 340 }));
      play(art, [{ opacity: 0, scale: '.98' }, { opacity: 0.82, scale: '1' }], { duration: 480 });
    });
    return swapChain;
  }

  /* ---------- Sidebar nav pill ---------- */
  let navSync = () => {};
  function bindNav(nav) {
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill);
    const moveTo = link => {
      if (!link || !link.offsetHeight) { pill.style.opacity = '0'; return; }
      pill.style.opacity = '1';
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.transform = `translateY(${link.offsetTop}px)`;
    };
    const active = () => nav.querySelector('.nav-link.active');
    nav.addEventListener('pointerover', e => { const l = e.target.closest('.nav-link'); if (l) moveTo(l); });
    nav.addEventListener('pointerleave', () => moveTo(active()));
    nav.addEventListener('focusin', e => { const l = e.target.closest('.nav-link'); if (l) moveTo(l); });
    nav.addEventListener('focusout', () => moveTo(active()));
    addEventListener('resize', () => moveTo(active()));
    document.querySelector('.sidebar')?.addEventListener('transitionend', () => moveTo(active()));
    navSync = () => moveTo(active());
    requestAnimationFrame(navSync);
  }

  /* ---------- Wallpaper parallax ---------- */
  function bindParallax(workspace) {
    const layers = [['.ridge-back', 6], ['.ridge-front', 14], ['.ground', 4]]
      .map(([sel, depth]) => [workspace.querySelector(sel), depth]).filter(([el]) => el);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach(([el, depth]) => { el.style.translate = `${(cx * depth).toFixed(2)}px ${(cy * depth * 0.5).toFixed(2)}px`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    workspace.addEventListener('pointermove', e => {
      if (!hoverQuery.matches || still()) return;
      const r = workspace.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    workspace.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
  }

  window.Motion = {
    ease, play, intro, cascadeIn, openFromDock, closeWindow, minimizeToDock, toggleMaximize, nudge,
    dragStart, dragMove, dragEnd, popDock, launch, receive, bindDock, leave,
    openPopover, closePopover, showOverlay, hideOverlay, swapAbout, bindNav, bindParallax,
    syncNav: () => navSync()
  };
})();

const { about, projects, sections, domains, gallery } = window.PORTFOLIO;
const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const external = '<svg class="ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5H3.5v9h9V10M9 3h4v4M13 3 7.5 8.5"/></svg>';

const windowsEl = document.querySelector('#windows');
const dock = document.querySelector('#dock');
const toast = document.querySelector('#toast');
const M = window.Motion;
let z = 10, toastTimer;
document.querySelector('#year').textContent = new Date().getFullYear();

const dockIcon = id => dock.querySelector(`.dock-app[data-id="${id}"]`);

/* ---------- Desktop apps: the dock carries navigation, not individual projects ---------- */
const glyph = {
  home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
  about: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/>',
  projects: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l1.8 2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  gallery: '<rect x="4" y="5" width="16" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4.5 3 3 2.5-2.5L19 17"/>'
};
const apps = [
  { id: 'home', name: 'Home', tint: 'linear-gradient(160deg,#7fb6c9,#3f7d92)' },
  { id: 'about', name: 'About', tint: 'linear-gradient(160deg,#e6b08c,#b8694a)' },
  { id: 'projects', name: 'Projects', tint: 'linear-gradient(160deg,#6fa0e8,#2f62c4)' },
  { id: 'gallery', name: 'Gallery', tint: 'linear-gradient(160deg,#f2c76b,#d9763f 55%,#b8507a)' }
];

const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${glyph[name]}</svg>`;

function makeDockApp(app) {
  const b = document.createElement('button');
  b.className = 'dock-app nav-app';
  b.dataset.id = app.id;
  b.style.setProperty('--appcolor', app.tint);
  b.setAttribute('aria-label', app.name);
  b.innerHTML = `${icon(app.id)}<span class="dock-label">${app.name}</span>`;
  b.addEventListener('click', () => openApp(app.id));
  return b;
}

/** Shared macOS window chrome used by every app window. */
function makeWindowShell(id, name, extraClass = '') {
  const w = document.createElement('article');
  w.className = `project-window app-window ${extraClass}`;
  w.dataset.id = id;
  w.setAttribute('aria-label', `${name} window`);
  w.setAttribute('role', 'dialog');
  w.tabIndex = -1;
  w.innerHTML = `<header class="window-bar"><div class="traffic"><button class="red" aria-label="Close ${name}"></button><button class="yellow" aria-label="Minimize ${name}"></button><button class="green" aria-label="Maximize ${name}"></button></div><span>${name}</span></header><div class="app-body"></div>`;
  const closed = () => { const hadFocus = w.contains(document.activeElement); w.remove(); dockIcon(id)?.classList.remove('open', 'selected'); focusTopWindow(); if (hadFocus) dockIcon(id)?.focus(); };
  const minimized = () => { w.classList.add('minimized'); w.classList.remove('focused'); dockIcon(id)?.classList.remove('selected'); focusTopWindow(); };
  w.minimize = () => M.minimizeToDock(w, dockIcon(id), minimized);
  w.addEventListener('pointerdown', () => focusWindow(w));
  w.querySelector('.red').addEventListener('click', e => { e.stopPropagation(); M.closeWindow(w, closed); });
  w.querySelector('.yellow').addEventListener('click', e => { e.stopPropagation(); w.minimize(); });
  w.querySelector('.window-bar').addEventListener('dblclick', e => { if (!e.target.closest('button')) w.minimize(); });
  w.querySelector('.green').addEventListener('click', e => { e.stopPropagation(); focusWindow(w); M.toggleMaximize(w); });
  makeDraggable(w);
  return w;
}

/* ---------- Projects: a Finder window with a sidebar, gallery view and detail view ---------- */
const sideGlyph = {
  all: '<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  shipped: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  explorations: '<path d="M12 3.5 14.4 9l5.6.6-4.2 3.8 1.2 5.6L12 16.2 7 19l1.2-5.6L4 9.6 9.6 9z"/>',
  banking: '<path d="M3.5 9 12 4.5 20.5 9M5 10v7m4.7-7v7m4.6-7v7M19 10v7M3.5 19.5h17"/>',
  marketplaces: '<path d="M4 9.5 5.6 5h12.8L20 9.5M4 9.5h16v10H4zM9.5 19.5v-5h5v5"/>',
  ai: '<path d="M12 3.5v3m0 11v3M3.5 12h3m11 0h3"/><rect x="7.5" y="7.5" width="9" height="9" rx="2.5"/>',
  saas: '<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
  health: '<path d="M12 19.5s-7.5-4.3-7.5-9.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.3c0 5.3-7.5 9.6-7.5 9.6z"/>'
};
const sideIcon = id => `<svg viewBox="0 0 24 24" aria-hidden="true">${sideGlyph[id]}</svg>`;
const matches = (p, f) => f === 'all' || (f === 'shipped' && p.shipped) || (f === 'explorations' && !p.shipped) || p.domain === f;

function makeProjectsWindow() {
  const w = makeWindowShell('projects', 'Projects', 'projects-window');
  const body = w.querySelector('.app-body');
  const item = (f, label) => `<button class="side-item" data-filter="${f}" aria-pressed="${f === 'all'}">${sideIcon(f)}<span>${esc(label)}</span><small>${projects.filter(p => matches(p, f)).length}</small></button>`;
  body.innerHTML = `<div class="finder">
    <nav class="finder-sidebar" aria-label="Filter projects">
      <p class="side-heading">Work</p>${sections.map(x => item(x.id, x.label)).join('')}
      <p class="side-heading">Domains</p>${domains.map(x => item(x.id, x.label)).join('')}
    </nav>
    <section class="finder-main">
      <div class="window-toolbar"><button class="finder-back" aria-label="Back to projects" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg></button><h2 class="finder-title">All projects</h2><span class="finder-count"></span></div>
      <div class="finder-scroll"><div class="project-grid" role="list"></div><article class="project-detail" hidden></article></div>
    </section>
  </div>`;
  const grid = body.querySelector('.project-grid'), detail = body.querySelector('.project-detail');
  const back = body.querySelector('.finder-back'), title = body.querySelector('.finder-title');
  const count = body.querySelector('.finder-count'), scroll = body.querySelector('.finder-scroll');
  const sidebar = body.querySelector('.finder-sidebar');
  let filter = 'all', filterLabel = 'All projects';

  const renderGrid = animate => {
    const list = projects.filter(p => matches(p, filter));
    grid.innerHTML = list.map(p => `<button class="project-card" role="listitem" data-project="${p.id}">
      <span class="card-cover"><img src="${esc(p.cover)}" alt="" loading="lazy"></span>
      <span class="card-row"><strong>${esc(p.name)}</strong><small>${esc(p.year)}</small></span>
      <span class="card-line">${esc(p.line)}</span>
    </button>`).join('');
    count.textContent = `${list.length} ${list.length === 1 ? 'project' : 'projects'}`;
    if (animate) M.cascadeIn([...grid.children]);
  };

  const showDetail = p => {
    const links = p.links.map(l => `<a class="link-button" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}${external}<span class="sr-only"> (opens in a new tab)</span></a>`).join('');
    const imgs = p.images.length ? p.images : [{ src: p.cover, alt: p.name }];
    detail.innerHTML = `
      <header class="detail-head"><h3>${esc(p.name)}</h3><p>${esc(p.line)}</p></header>
      <figure class="detail-media"><img class="detail-hero" src="${esc(imgs[0].src)}" alt="${esc(imgs[0].alt)}">
        ${imgs.length > 1 ? `<div class="detail-thumbs" role="group" aria-label="Project images">${imgs.map((im, i) => `<button aria-pressed="${i === 0}" aria-label="Show ${esc(im.alt)}" data-src="${esc(im.src)}" data-alt="${esc(im.alt)}"><img src="${esc(im.src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      </figure>
      <dl class="detail-facts">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
        <div><dt>Status</dt><dd>${esc(p.stage)}${p.sector ? `, ${esc(p.sector.toLowerCase())}` : ''}</dd></div>
        <div><dt>Contribution</dt><dd class="tags">${p.skills.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</dd></div>
      </dl>
      ${p.problem ? `<section class="detail-section"><h4>The problem</h4><p>${esc(p.problem)}</p></section>` : ''}
      ${p.decisions.length ? `<section class="detail-section"><h4>Key decisions</h4><ul class="decisions">${p.decisions.map(d => `<li><strong>${esc(d.title)}</strong> ${esc(d.text)}</li>`).join('')}</ul></section>` : ''}
      ${p.result ? `<section class="detail-section"><h4>What shipped</h4><p>${esc(p.result)}</p></section>` : ''}
      ${p.metrics.length ? `<section class="detail-section"><h4>${p.shipped ? 'Outcomes and scope' : 'Scope'}</h4><div class="metrics">${p.metrics.map(m => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join('')}</div>${p.metricNote ? `<p class="metric-note">${esc(p.metricNote)}</p>` : ''}</section>` : ''}
      ${links ? `<div class="detail-links">${links}</div>` : ''}`;
    const hero = detail.querySelector('.detail-hero');
    detail.querySelector('.detail-thumbs')?.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      detail.querySelectorAll('.detail-thumbs button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      M.play(hero, [{ opacity: 0.35 }, { opacity: 1 }], { duration: 260 });
      hero.src = b.dataset.src; hero.alt = b.dataset.alt;
    });
    grid.hidden = true; detail.hidden = false; back.hidden = false; count.hidden = true;
    title.textContent = filterLabel;
    scroll.scrollTop = 0;
    M.play(detail, [{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'none' }], { duration: 340 });
    back.focus({ preventScroll: true });
  };
  const showGrid = () => {
    if (grid.hidden === false) return;
    detail.hidden = true; grid.hidden = false; back.hidden = true; count.hidden = false;
    title.textContent = filterLabel;
    M.play(grid, [{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'none' }], { duration: 340 });
  };

  grid.addEventListener('click', e => { const card = e.target.closest('.project-card'); if (card) showDetail(projects.find(p => p.id === card.dataset.project)); });
  back.addEventListener('click', showGrid);
  sidebar.addEventListener('click', e => {
    const b = e.target.closest('.side-item'); if (!b) return;
    filter = b.dataset.filter; filterLabel = b.querySelector('span').textContent;
    sidebar.querySelectorAll('.side-item').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    detail.hidden = true; grid.hidden = false; back.hidden = true; count.hidden = false;
    title.textContent = filterLabel;
    renderGrid(true);
  });
  w.openProject = id => { const p = projects.find(x => x.id === id); if (p) showDetail(p); };
  renderGrid(false);
  return w;
}

/* ---------- About: modelled on macOS "About This Mac" ---------- */
function makeAboutWindow() {
  const w = makeWindowShell('about', 'About', 'about-window');
  w.querySelector('.app-body').innerHTML = `<div class="about-panel">
    <img class="about-portrait" src="${esc(about.portrait)}" alt="Portrait of ${esc(about.name)}" width="112" height="112">
    <h2 class="about-name">${esc(about.name)}</h2>
    <p class="about-title">${esc(about.title)}</p>
    <p class="about-headline">${esc(about.headline)}</p>
    <dl class="about-facts">${about.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="about-actions">
      <a class="link-button primary" href="mailto:${esc(about.email)}">Email me</a>
      <a class="link-button" href="${esc(about.linkedin)}" target="_blank" rel="noopener">LinkedIn${external}<span class="sr-only"> (opens in a new tab)</span></a>
      <button class="link-button" data-open="projects">See projects</button>
    </div>
    <details class="about-more"><summary>More about me</summary>${about.bio.map(p => `<p>${esc(p)}</p>`).join('')}</details>
  </div>`;
  w.querySelector('[data-open="projects"]').addEventListener('click', () => openApp('projects'));
  return w;
}

/* Gallery: a Photos-style grid for personal images, with a viewer inside the window. */
function makeGalleryWindow() {
  const w = makeWindowShell('gallery', 'Gallery', 'gallery-window');
  const body = w.querySelector('.app-body');
  const items = gallery.length ? gallery : Array.from({ length: 9 }, (_, i) => ({ placeholder: i, caption: 'Your photo here' }));
  const tile = (item, i) => item.src
    ? `<img src="${item.src}" alt="${item.caption || ''}" loading="lazy">`
    : `<span class="photo-placeholder ph-${i % 6}"><span>${icon('gallery')}</span></span>`;
  body.innerHTML = `<div class="window-toolbar"><h2 class="finder-title">Gallery</h2><span class="finder-count">${gallery.length ? `${gallery.length} photos` : 'Add your photos'}</span></div><div class="finder-scroll"><div class="photo-grid">${items.map((item, i) => `<button class="photo-tile ${[0, 4, 7].includes(i) ? 'tall' : ''}" data-index="${i}" aria-label="Open photo ${i + 1}">${tile(item, i)}</button>`).join('')}</div></div><div class="photo-viewer" hidden><button class="viewer-close" aria-label="Close photo">×</button><button class="viewer-nav prev" aria-label="Previous photo">‹</button><figure><div class="viewer-frame"></div><figcaption></figcaption></figure><button class="viewer-nav next" aria-label="Next photo">›</button></div>`;
  const viewer = body.querySelector('.photo-viewer');
  let index = 0;
  const show = i => {
    index = (i + items.length) % items.length;
    viewer.querySelector('.viewer-frame').innerHTML = tile(items[index], index);
    viewer.querySelector('figcaption').textContent = `${items[index].caption || ''} · ${index + 1} / ${items.length}`;
  };
  body.querySelector('.photo-grid').addEventListener('click', e => {
    const t = e.target.closest('.photo-tile'); if (!t) return;
    show(Number(t.dataset.index));
    viewer.hidden = false;
    M.play(viewer, [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    M.play(viewer.querySelector('figure'), [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 380 });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => M.play(viewer, [{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).then(() => { viewer.hidden = true; viewer.getAnimations().forEach(a => a.cancel()); }));
  viewer.querySelector('.prev').addEventListener('click', () => show(index - 1));
  viewer.querySelector('.next').addEventListener('click', () => show(index + 1));
  return w;
}

/** Centres a new window in the workspace, cascading slightly from any already open. */
function placeWindow(w) {
  const area = windowsEl;
  const offset = windowsEl.querySelectorAll('.project-window:not(.minimized)').length - 1;
  const x = Math.max(0, (area.clientWidth - w.offsetWidth) / 2 + offset * 28);
  const y = Math.max(0, Math.min(area.clientHeight - w.offsetHeight, area.clientHeight * 0.06) + offset * 24);
  w.style.left = `${x}px`;
  w.style.top = `${y}px`;
}

const builders = { about: makeAboutWindow, projects: makeProjectsWindow, gallery: makeGalleryWindow };

function openApp(id) {
  const icon = dockIcon(id);
  closePopovers();
  if (id === 'home') return showDesktop();
  const existing = windowsEl.querySelector(`.project-window[data-id="${id}"]`);
  setNav(id);
  if (existing && existing.classList.contains('minimized')) {
    existing.classList.remove('minimized');
    focusWindow(existing);
    return M.restoreFromDock(existing, icon);
  }
  if (existing) { focusWindow(existing); return M.nudge(existing); }
  const w = builders[id]();
  windowsEl.append(w);
  placeWindow(w);
  icon?.classList.add('open');
  focusWindow(w);
  M.launch(icon);
  M.openFromDock(w, icon);
  w.focus({ preventScroll: true });
}

/** Home is the clear desktop: every open window minimises into the dock. */
function showDesktop() {
  setNav('home');
  windowsEl.querySelectorAll('.project-window:not(.minimized)').forEach(w => w.minimize && w.minimize());
}

function focusWindow(w) {
  w.style.zIndex = ++z;
  document.querySelectorAll('.project-window').forEach(x => x.classList.toggle('focused', x === w));
  document.querySelectorAll('.dock-app').forEach(x => x.classList.toggle('selected', x.dataset.id === w.dataset.id));
}

/** Like macOS: when a window goes away, the next window up takes focus. */
function focusTopWindow() {
  const open = [...windowsEl.querySelectorAll('.project-window:not(.minimized)')];
  if (!open.length) return setNav('home');
  focusWindow(open.reduce((a, b) => (Number(b.style.zIndex) > Number(a.style.zIndex) ? b : a)));
}

function render() {
  windowsEl.replaceChildren();
  dock.replaceChildren(...apps.map(makeDockApp));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

/**
 * Keeps a window reachable but lets it travel partly off-screen, like macOS:
 * at least 120px stays visible sideways and the title bar never goes above the top.
 */
function clampWindow(w, x, y) {
  const area = w.parentElement;
  const keep = Math.min(120, w.offsetWidth);
  const nx = Math.min(area.clientWidth - keep, Math.max(keep - w.offsetWidth, x));
  const ny = Math.min(area.clientHeight + 40, Math.max(0, y));
  return [nx, ny];
}

function makeDraggable(w) {
  const handles = [w.querySelector('.window-bar'), w.querySelector('.window-meta'), w.querySelector('.window-toolbar')];
  let sx = 0, sy = 0, ox = 0, oy = 0, lastX = 0, lastY = 0, lastT = 0, vx = 0, vy = 0, drag = null;

  const start = (handle, e) => {
    if (e.button !== 0 || e.target.closest('button, a, input')) return;
    focusWindow(w);
    M.stopGlide(w);
    const area = w.parentElement.getBoundingClientRect();
    if (w.classList.contains('maximized')) {
      // Dragging a maximised window restores it under the pointer, as on a Mac.
      const r = w.getBoundingClientRect();
      const ratio = (e.clientX - r.left) / r.width;
      w.classList.remove('maximized');
      w.style.left = `${e.clientX - area.left - ratio * w.offsetWidth}px`;
      w.style.top = `${Math.max(0, e.clientY - area.top - 18)}px`;
    }
    w.classList.add('moved');
    drag = handle;
    sx = lastX = e.clientX; sy = lastY = e.clientY; lastT = performance.now();
    ox = w.offsetLeft; oy = w.offsetTop; vx = vy = 0;
    handle.setPointerCapture(e.pointerId);
    M.dragStart(w);
  };
  const move = e => {
    if (!drag) return;
    const [x, y] = clampWindow(w, ox + e.clientX - sx, oy + e.clientY - sy);
    w.style.left = `${x}px`;
    w.style.top = `${y}px`;
    const now = performance.now(), dt = Math.max(1, now - lastT);
    vx = 0.7 * ((e.clientX - lastX) / dt) + 0.3 * vx;
    vy = 0.7 * ((e.clientY - lastY) / dt) + 0.3 * vy;
    M.dragMove(w, e.clientX - lastX);
    lastX = e.clientX; lastY = e.clientY; lastT = now;
  };
  const end = () => {
    if (!drag) return;
    drag = null;
    M.dragEnd(w);
    if (performance.now() - lastT > 80) vx = vy = 0; // paused before release: no throw
    const cap = v => Math.max(-2.5, Math.min(2.5, v));
    M.glide(w, cap(vx), cap(vy), clampWindow);
  };
  handles.forEach(h => {
    if (!h) return;
    h.addEventListener('pointerdown', e => start(h, e));
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', end);
    h.addEventListener('pointercancel', end);
  });
}

/* Popovers: the hamburger menu and the Control Center */
const popovers = [['#menuToggle', '#menuPop'], ['#controlToggle', '#controlPop']]
  .map(([b, p]) => [document.querySelector(b), document.querySelector(p)]);
function closePopovers(except) {
  popovers.forEach(([btn, pop]) => { if (pop !== except && !pop.hidden) { btn.setAttribute('aria-expanded', 'false'); M.closePopover(pop); } });
}
popovers.forEach(([btn, pop]) => btn.addEventListener('click', e => {
  e.stopPropagation();
  closePopovers(pop);
  const show = pop.hidden;
  btn.setAttribute('aria-expanded', String(show));
  show ? M.openPopover(pop) : M.closePopover(pop);
}));
document.addEventListener('pointerdown', e => { if (!e.target.closest('.popover-wrap')) closePopovers(); });
document.querySelector('#menuPop').addEventListener('click', e => { if (e.target.closest('.nav-link')) closePopovers(); });

/* Control Center sliders fill like macOS: the track colour follows the value */
function paintSlider(input) {
  const pct = (input.value - input.min) / (input.max - input.min) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}
document.querySelectorAll('.cc-slider input').forEach(paintSlider);

document.querySelector('#brightness').addEventListener('input', e => {
  paintSlider(e.target);
  document.querySelector('.workspace').style.setProperty('--brightness', Number(e.target.value) / 100);
});

let playing = false, trackIndex = 0;
const tracks = [['Quiet Hours', 'Portfolio radio'], ['Soft Focus', 'Studio mix'], ['Open Skies', 'Field recordings']];
const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
function syncPlayer() {
  const [title, artist] = tracks[trackIndex];
  document.querySelector('#trackTitle').textContent = title;
  document.querySelector('#trackArtist').textContent = artist;
  const btn = document.querySelector('#playerToggle');
  btn.innerHTML = playing ? pauseIcon : playIcon;
  btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  document.querySelector('.cc-now').classList.toggle('playing', playing);
}
document.querySelector('#playerToggle').addEventListener('click', () => { playing = !playing; syncPlayer(); });
document.querySelector('#nextTrack').addEventListener('click', () => { trackIndex = (trackIndex + 1) % tracks.length; syncPlayer(); });
document.querySelector('#volume').addEventListener('input', e => {
  paintSlider(e.target);
  document.querySelector('.cc-sound-ico').classList.toggle('muted', Number(e.target.value) === 0);
});
document.querySelector('#outputToggle').addEventListener('click', e => { const on = e.currentTarget.classList.toggle('active'); showToast(on ? 'Output: Headphones' : 'Output: Speakers'); });

/* Toggles: connectivity rows, Focus, Stage Manager and Appearance */
const subtitles = { wifi: ['Off', 'Portfolio-5G'], bluetooth: ['Off', 'On'], airdrop: ['Receiving Off', 'Everyone'] };
document.querySelectorAll('[data-control]').forEach(el => el.addEventListener('click', () => {
  const key = el.dataset.control;
  if (key === 'appearance') {
    const dark = document.body.classList.toggle('dark-appearance');
    el.classList.toggle('active', dark);
    return;
  }
  if (key === 'stage') return tidyWindows(el);
  const on = el.classList.toggle('active');
  if (subtitles[key]) el.querySelector('small').textContent = subtitles[key][Number(on)];
  if (key === 'focus') { el.querySelector('small').textContent = on ? 'On' : ''; showToast(on ? 'Focus on' : 'Focus off'); }
}));

/** Stage Manager: gathers open windows into a neat cascade. */
function tidyWindows(tile) {
  tile.classList.add('active');
  setTimeout(() => tile.classList.remove('active'), 600);
  const open = [...windowsEl.querySelectorAll('.project-window:not(.minimized)')].sort((a, b) => a.style.zIndex - b.style.zIndex);
  open.forEach((w, i) => {
    w.classList.remove('maximized');
    const from = w.getBoundingClientRect();
    w.style.left = `${Math.max(0, (windowsEl.clientWidth - w.offsetWidth) / 2 + (i - (open.length - 1) / 2) * 34)}px`;
    w.style.top = `${16 + i * 26}px`;
    const to = w.getBoundingClientRect();
    M.play(w, [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }], { duration: 480 });
  });
}

/* Menu-bar clock */
function tick() {
  const now = new Date();
  document.querySelector('#menuClock').textContent = `${now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} ${now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}`;
}
tick();
setInterval(tick, 15000);

/* Navigation and keyboard */
function setNav(action) {
  document.querySelectorAll('.side-nav .nav-link[data-action]').forEach(x => x.classList.toggle('active', x.dataset.action === action));
  M.syncNav();
}
document.querySelectorAll('.side-nav [data-action]').forEach(b => b.addEventListener('click', () => openApp(b.dataset.action)));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const viewer = document.querySelector('.photo-viewer:not([hidden])');
  if (viewer) return viewer.querySelector('.viewer-close').click();
  closePopovers();
});

/* Boot */
render();
M.bindDock(dock);
M.bindNav(document.querySelector('.side-nav'));
M.bindParallax(document.querySelector('.workspace'));
M.intro();

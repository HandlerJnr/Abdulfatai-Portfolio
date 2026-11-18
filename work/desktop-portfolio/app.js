const projects = [
  {id:'signal', name:'Signal', mark:'Si', color:'#252929', text:'#ddd3c2', title:'A clearer way to act on complex information', kind:'Case study', tags:['Product design','Research'], kindPreview:'editor', x:'13%',y:'12%',layer:1, copy:'A research-led product experience that helps people move from scattered information to confident next steps.'},
  {id:'fieldnotes', name:'Fieldnotes', mark:'Fi', color:'#b56f50', text:'#fff1dc', title:'A calmer workspace for collecting ideas', kind:'Case study', tags:['UX','Interaction'], kindPreview:'', x:'28%',y:'18%',layer:2, copy:'A flexible space for saving, connecting, and revisiting the things that spark new ideas.'},
  {id:'atlas', name:'Atlas', mark:'At', color:'#273b42', text:'#b9d5d3', title:'Find your way through a changing city', kind:'Demo', tags:['Prototype','Maps'], kindPreview:'dashboard', x:'17%',y:'10%',layer:3, copy:'An interactive map concept for discovering useful places and navigating unfamiliar neighbourhoods.'},
  {id:'studio', name:'Studio', mark:'St', color:'#403343', text:'#e5c9d5', title:'A simple home for creative collaboration', kind:'Case study', tags:['Product','Systems'], kindPreview:'editor', x:'25%',y:'14%',layer:4, copy:'Tools and shared rituals that help small teams turn a rough brief into a thoughtful first release.'},
  {id:'orbit', name:'Orbit', mark:'Or', color:'#30484b', text:'#b9d6d0', title:'Make long-term goals feel more reachable', kind:'Demo', tags:['Motion','AI'], kindPreview:'', x:'19%',y:'15%',layer:5, copy:'A small, exploratory interface for planning personal projects one useful step at a time.'},
  {id:'ledger', name:'Ledger', mark:'Le', color:'#29394b', text:'#c4d4e9', title:'Everyday finances, made easier to understand', kind:'Case study', tags:['Research','Service design'], kindPreview:'dashboard', x:'30%',y:'11%',layer:6, copy:'A responsive account overview that brings upcoming tasks and spending patterns into focus.'},
  {id:'loop', name:'Loop', mark:'Lo', color:'#3d3029', text:'#e2bd93', title:'A new rhythm for learning together', kind:'Demo', tags:['Education','Prototype'], kindPreview:'', x:'23%',y:'18%',layer:7, copy:'A lightweight learning concept for setting a pace, sharing progress, and keeping momentum.'},
  {id:'common', name:'Common', mark:'Co', color:'#6d4037', text:'#f0d1bd', title:'A neighbourhood guide built around people', kind:'Case study', tags:['Community','UX'], kindPreview:'editor', x:'14%',y:'13%',layer:8, copy:'A community-centred guide to the independent places, services, and events around you.'},
  {id:'notes', name:'Notes', mark:'No', color:'#e8e2ce', text:'#60635b', title:'Notes', kind:'Demo', tags:['Personal'], kindPreview:'notes', x:'28%',y:'12%',layer:9, copy:'A small corner for thoughts and things to remember.'}
];
const aboutCards = [
  ['A little about me','Designing with care, from idea to interface.','I’m a multidisciplinary designer who enjoys turning complex problems into clear, useful digital experiences.','A small introduction'],
  ['Where I’m from','Curiosity travels with me.','The places and communities I’ve been part of shape how I listen, notice details, and approach new challenges.','A sense of place'],
  ['How I work','Make space to understand the problem.','I like to begin with questions, bring people into the process early, and keep the work grounded in what we learn.','Research before assumptions'],
  ['Design & code','One connected practice.','Moving between interaction design and front-end implementation helps me explore ideas and bring the details to life.','From sketch to screen'],
  ['What matters','Useful, clear, and considered.','The best interfaces respect people’s time, make the next step easier, and feel coherent in the small moments.','Care in the details'],
  ['Outside work','A little room for inspiration.','I’m usually collecting references, walking somewhere new, listening to music, or learning a tool just for the joy of it.','The things around the work'],
  ['Working together','Good work is a shared effort.','I value open communication, generous critique, and teams that make it safe to ask better questions.','Better together'],
  ['Say hello','Let’s make something meaningful.','If you’re working on a thoughtful product or want to compare notes, I’d be happy to hear from you.','Until next time']
];
const windowsEl = document.querySelector('#windows');
const dock = document.querySelector('#dock');
const toast = document.querySelector('#toast');
const M = window.Motion;
let z = 10, aboutIndex = 0, toastTimer;
document.querySelector('#year').textContent = new Date().getFullYear();

function previewMarkup(p) {
  if (p.kindPreview === 'dashboard') return `<div class="dash-nav"><b>Workspace</b><span>Overview</span><span>Explore</span><span>Saved</span><span>Settings</span></div><div class="dash-main"><p class="mini-label">A little more clarity</p><h3>${p.title}</h3><div class="dash-lines"><i></i><i></i><i></i><i></i></div></div>`;
  if (p.kindPreview === 'editor') return `<div class="editor-card"><p class="mini-label">A thoughtful starting point</p><h3>${p.title}</h3><div class="line long"></div><div class="line"></div><div class="line short"></div></div>`;
  if (p.kindPreview === 'notes') return `<div class="editor-card"><h3>Little thoughts,<br>kept close.</h3><div class="line long"></div><div class="line short"></div></div>`;
  return `<p class="mini-label">An idea in progress</p><h3>${p.title}</h3><p class="preview-mark">EXPLORE &nbsp;·&nbsp; MAKE &nbsp;·&nbsp; REFINE</p>`;
}

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

/* Your own photos go here, e.g. { src: 'assets/gallery/01.jpg', caption: 'Brighton seafront' } */
const gallery = [];

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
  w.innerHTML = `<header class="window-bar"><div class="traffic"><button class="red" aria-label="Close ${name}"></button><button class="yellow" aria-label="Minimize ${name}"></button><button class="green" aria-label="Maximize ${name}"></button></div><span>${name}</span></header><div class="app-body"></div>`;
  const closed = () => { w.remove(); dockIcon(id)?.classList.remove('open', 'selected'); focusTopWindow(); };
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

/* Projects: one Finder-style window listing every project, with a detail view inside. */
function makeProjectsWindow() {
  const w = makeWindowShell('projects', 'Projects', 'projects-window');
  const body = w.querySelector('.app-body');
  body.innerHTML = `<div class="window-toolbar"><button class="finder-back" aria-label="Back to all projects" hidden>‹</button><h2 class="finder-title">All projects</h2><div class="segmented" role="group" aria-label="Filter projects"><button aria-pressed="true" data-filter="all">All</button><button aria-pressed="false" data-filter="Case study">Case studies</button><button aria-pressed="false" data-filter="Demo">Experiments</button></div><span class="finder-count"></span></div><div class="finder-scroll"><div class="project-grid"></div><article class="project-detail" hidden></article></div>`;
  const grid = body.querySelector('.project-grid'), detail = body.querySelector('.project-detail');
  const back = body.querySelector('.finder-back'), title = body.querySelector('.finder-title');
  const segmented = body.querySelector('.segmented'), count = body.querySelector('.finder-count');
  let filter = 'all';

  let renderGrid = animate => {
    const list = projects.filter(p => filter === 'all' || p.kind === filter);
    grid.innerHTML = list.map(p => `<button class="project-card" data-project="${p.id}"><div class="mini-preview"><div class="preview preview-zoom ${p.kindPreview || ''}">${previewMarkup(p)}</div></div><span class="card-copy"><strong>${p.name}</strong><small>${p.title}</small><span class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</span></span></button>`).join('');
    count.textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    if (animate) M.cascadeIn([...grid.children].map(c => c));
  };
  const showDetail = p => {
    detail.innerHTML = `<div class="detail-preview preview ${p.kindPreview || ''}">${previewMarkup(p)}</div><div class="detail-copy"><p class="eyebrow">${p.kind}</p><h3>${p.title}</h3><p>${p.copy}</p><div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>`;
    grid.hidden = true; detail.hidden = false; back.hidden = false; segmented.hidden = true; count.hidden = true;
    title.textContent = p.name;
    body.querySelector('.finder-scroll').scrollTop = 0;
    M.play(detail, [{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }], { duration: 340 });
  };
  const showGrid = () => {
    detail.hidden = true; grid.hidden = false; back.hidden = true; segmented.hidden = false; count.hidden = false;
    title.textContent = 'All projects';
    M.play(grid, [{ opacity: 0, transform: 'translateX(-18px)' }, { opacity: 1, transform: 'none' }], { duration: 340 });
  };

  grid.addEventListener('click', e => { const card = e.target.closest('.project-card'); if (card) showDetail(projects.find(p => p.id === card.dataset.project)); });
  back.addEventListener('click', showGrid);
  segmented.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    filter = btn.dataset.filter;
    segmented.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    renderGrid(true);
  });
  // Thumbnails are full-size previews scaled to whatever width the card has.
  const fit = () => grid.querySelectorAll('.mini-preview').forEach(m => m.style.setProperty('--s', (m.clientWidth / 560).toFixed(4)));
  new ResizeObserver(fit).observe(grid);
  const renderAndFit = renderGrid;
  renderGrid = animate => { renderAndFit(animate); fit(); };
  renderGrid(false);
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

const builders = { projects: makeProjectsWindow, gallery: makeGalleryWindow };

function openApp(id) {
  const icon = dockIcon(id);
  closePopovers();
  if (id === 'home') return showDesktop();
  if (id === 'about') {
    setNav('about');
    icon?.classList.add('open');
    M.launch(icon);
    return M.showOverlay(aboutOverlay);
  }
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
}

/** Home is the clear desktop: every open window minimises into the dock. */
function showDesktop() {
  setNav('home');
  if (!aboutOverlay.hidden) hideOverlay(aboutOverlay);
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

/* Overlays and navigation */
const aboutOverlay = document.querySelector('#aboutOverlay');
function setNav(action) {
  document.querySelectorAll('.side-nav .nav-link[data-action]').forEach(x => x.classList.toggle('active', x.dataset.action === action));
  M.syncNav();
}
function hideOverlay(o) {
  M.hideOverlay(o);
  if (o === aboutOverlay) { dockIcon('about')?.classList.remove('open'); focusTopWindow(); }
}
document.querySelector('[data-action="source"]').addEventListener('click', () => M.showOverlay(document.querySelector('#sourceOverlay')));
document.querySelectorAll('.side-nav [data-action]').forEach(b => { if (b.dataset.action !== 'source') b.addEventListener('click', () => openApp(b.dataset.action)); });

function renderAbout() {
  const c = aboutCards[aboutIndex];
  document.querySelector('#aboutEyebrow').textContent = c[0];
  document.querySelector('#aboutTitle').textContent = c[1];
  document.querySelector('#aboutBody').textContent = c[2];
  document.querySelector('#aboutCaption').textContent = c[3];
  document.querySelector('#aboutCount').textContent = `${String(aboutIndex + 1).padStart(2, '0')} / ${String(aboutCards.length).padStart(2, '0')}`;
  document.querySelector('#aboutArt').className = `about-art art-${['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'][aboutIndex]}`;
}
function stepAbout(dir) {
  M.swapAbout(dir, () => { aboutIndex = (aboutIndex + dir + aboutCards.length) % aboutCards.length; renderAbout(); });
}
document.querySelector('#aboutNext').addEventListener('click', () => stepAbout(1));
document.querySelector('#aboutPrev').addEventListener('click', () => stepAbout(-1));

document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => hideOverlay(document.getElementById(b.dataset.close))));
document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) hideOverlay(o); }));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { document.querySelectorAll('.overlay:not([hidden])').forEach(hideOverlay); closePopovers(); }
  if (aboutOverlay.hidden) return;
  if (e.key === 'ArrowRight') stepAbout(1);
  if (e.key === 'ArrowLeft') stepAbout(-1);
});

/* Boot */
render();
M.bindDock(dock);
M.bindNav(document.querySelector('.side-nav'));
M.bindParallax(document.querySelector('.workspace'));
M.intro();

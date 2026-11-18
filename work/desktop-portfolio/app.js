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
let z = 10, activeFilter = new Set(), aboutIndex = 0, toastTimer, renderToken = 0;
document.querySelector('#year').textContent = new Date().getFullYear();

function previewMarkup(p) {
  if (p.kindPreview === 'dashboard') return `<div class="dash-nav"><b>Workspace</b><span>Overview</span><span>Explore</span><span>Saved</span><span>Settings</span></div><div class="dash-main"><p class="mini-label">A little more clarity</p><h3>${p.title}</h3><div class="dash-lines"><i></i><i></i><i></i><i></i></div></div>`;
  if (p.kindPreview === 'editor') return `<div class="editor-card"><p class="mini-label">A thoughtful starting point</p><h3>${p.title}</h3><div class="line long"></div><div class="line"></div><div class="line short"></div></div>`;
  if (p.kindPreview === 'notes') return `<div class="editor-card"><h3>Little thoughts,<br>kept close.</h3><div class="line long"></div><div class="line short"></div></div>`;
  return `<p class="mini-label">An idea in progress</p><h3>${p.title}</h3><p class="preview-mark">EXPLORE &nbsp;·&nbsp; MAKE &nbsp;·&nbsp; REFINE</p>`;
}

const dockIcon = id => dock.querySelector(`.dock-app[data-id="${id}"]`);

function makeWindow(p) {
  const w = document.createElement('article');
  w.className = 'project-window';
  w.dataset.id = p.id;
  w.dataset.kind = p.kind;
  w.style.setProperty('--x', p.x);
  w.style.setProperty('--y', p.y);
  w.style.zIndex = p.layer;
  w.innerHTML = `<header class="window-bar"><div class="traffic"><button class="red" aria-label="Close ${p.name}"></button><button class="yellow" aria-label="Minimize ${p.name}"></button><button class="green" aria-label="Maximize ${p.name}"></button></div><span>${p.name}</span></header><div class="window-content"><div class="preview ${p.kindPreview || ''}">${previewMarkup(p)}</div></div><footer class="window-meta"><h2>${p.title}</h2><div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}<span class="tag">${p.kind}</span></div></footer>`;
  const closed = () => { w.remove(); dockIcon(p.id)?.classList.remove('open', 'selected'); focusTopWindow(); };
  const minimized = () => { w.classList.add('minimized'); w.classList.remove('focused'); dockIcon(p.id)?.classList.remove('selected'); focusTopWindow(); };
  w.addEventListener('pointerdown', () => focusWindow(w));
  w.querySelector('.red').addEventListener('click', e => { e.stopPropagation(); M.closeWindow(w, closed); });
  w.querySelector('.yellow').addEventListener('click', e => { e.stopPropagation(); M.minimizeToDock(w, dockIcon(p.id), minimized); });
  w.querySelector('.window-bar').addEventListener('dblclick', e => { if (!e.target.closest('button')) M.minimizeToDock(w, dockIcon(p.id), minimized); });
  w.querySelector('.green').addEventListener('click', e => { e.stopPropagation(); focusWindow(w); M.toggleMaximize(w); });
  makeDraggable(w);
  return w;
}

function focusWindow(w) {
  w.style.zIndex = ++z;
  document.querySelectorAll('.project-window').forEach(x => x.classList.toggle('focused', x === w));
  document.querySelectorAll('.dock-app').forEach(x => x.classList.toggle('selected', x.dataset.id === w.dataset.id));
}

/** Like macOS: when a window goes away, the next window up takes focus. */
function focusTopWindow() {
  const open = [...windowsEl.querySelectorAll('.project-window:not(.minimized)')];
  if (!open.length) return;
  focusWindow(open.reduce((a, b) => (Number(b.style.zIndex) > Number(a.style.zIndex) ? b : a)));
}

const visibleProjects = () => projects.filter(p => !activeFilter.size || activeFilter.has(p.kind));

function makeDockApp(p) {
  const b = document.createElement('button');
  b.className = 'dock-app open';
  b.dataset.id = p.id;
  b.style.setProperty('--appcolor', p.color);
  b.style.setProperty('--apptext', p.text);
  b.setAttribute('aria-label', `Open ${p.name}`);
  b.innerHTML = `${p.mark}<span class="dock-label">${p.name}</span>`;
  b.addEventListener('click', () => {
    const existing = windowsEl.querySelector(`[data-id="${p.id}"]`);
    if (existing && existing.classList.contains('minimized')) {
      existing.classList.remove('minimized');
      focusWindow(existing);
      M.restoreFromDock(existing, b);
      return;
    }
    if (existing) { focusWindow(existing); M.nudge(existing); return; }
    const w = makeWindow(p);
    windowsEl.append(w);
    b.classList.add('open');
    focusWindow(w);
    M.launch(b);
    M.openFromDock(w, b);
  });
  return b;
}

function render() {
  windowsEl.replaceChildren();
  dock.replaceChildren();
  visibleProjects().forEach(p => {
    windowsEl.append(makeWindow(p));
    dock.append(makeDockApp(p));
  });
}

/** Filter changes animate the old set out, then cascade the new set in. */
function rerender() {
  const token = ++renderToken;
  M.leave([...windowsEl.children, ...dock.children]).then(() => {
    if (token !== renderToken) return;
    render();
    M.cascadeIn([...windowsEl.children]);
    M.popDock([...dock.children], 80);
  });
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
  const handles = [w.querySelector('.window-bar'), w.querySelector('.window-meta')];
  let sx = 0, sy = 0, ox = 0, oy = 0, lastX = 0, lastY = 0, lastT = 0, vx = 0, vy = 0, drag = null;

  const start = (handle, e) => {
    if (e.button !== 0 || e.target.closest('button, a')) return;
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

/* Popovers */
const popovers = [['#menuToggle', '#menuPop'], ['#filterToggle', '#filterPop'], ['#soundToggle', '#soundPop'], ['#controlToggle', '#controlPop'], ['#nowPlayingToggle', '#nowPlayingPop']]
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
document.querySelector('#menuPop').addEventListener('click', e => { if (e.target.closest('.nav-link')) { closePopovers(); document.querySelector('#menuToggle').setAttribute('aria-expanded','false'); } });

document.querySelectorAll('.filter-check').forEach(c => c.addEventListener('change', () => {
  activeFilter = new Set([...document.querySelectorAll('.filter-check:checked')].map(x => x.value));
  rerender();
}));

document.querySelector('#brightness').addEventListener('input', e => {
  const v = Number(e.target.value);
  document.querySelector('.workspace').style.setProperty('--brightness', v / 100);
  document.querySelector('#brightnessValue').textContent = `${v}%`;
});

let playing = false, muted = false, trackIndex = 0;
const tracks = [['Quiet Hours','Portfolio radio'],['Soft Focus','Studio mix'],['Open Skies','Field recordings']];
function syncPlayer() {
  const [title, artist] = tracks[trackIndex];
  document.querySelector('#trackTitle').textContent = title;
  document.querySelector('#trackArtist').textContent = artist;
  document.querySelector('#musicPlay').textContent = playing ? 'Ⅱ' : '▶';
  document.querySelector('#playerToggle').textContent = playing ? 'Ⅱ' : '▶';
  document.querySelector('#musicPlay').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  document.querySelector('#playerToggle').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  document.querySelector('#trackProgress').style.width = playing ? '42%' : '28%';
  document.querySelector('#soundToggle').classList.toggle('selected', playing && !muted);
}
function togglePlayback() { playing = !playing; syncPlayer(); showToast(playing ? 'Now playing' : 'Playback paused'); }
document.querySelector('#musicPlay').addEventListener('click', togglePlayback);
document.querySelector('#playerToggle').addEventListener('click', togglePlayback);
document.querySelector('#previousTrack').addEventListener('click', () => { trackIndex = (trackIndex + tracks.length - 1) % tracks.length; syncPlayer(); });
document.querySelector('#nextTrack').addEventListener('click', () => { trackIndex = (trackIndex + 1) % tracks.length; syncPlayer(); });
document.querySelector('#volume').addEventListener('input', e => { document.querySelector('#volumeValue').textContent = e.target.value + '%'; });
document.querySelector('#muteToggle').addEventListener('click', e => { muted = !muted; e.currentTarget.textContent = muted ? 'Unmute' : 'Mute'; e.currentTarget.classList.toggle('active', muted); syncPlayer(); });
document.querySelector('#outputToggle').addEventListener('click', e => { e.currentTarget.classList.toggle('selected'); showToast(e.currentTarget.classList.contains('selected') ? 'Headphones selected' : 'MacBook Speakers selected'); });
document.querySelectorAll('.control-tile').forEach(tile => tile.addEventListener('click', () => {
  const key = tile.dataset.control, small = tile.querySelector('small');
  if (key === 'appearance') {
    const dark = document.body.classList.toggle('dark-appearance');
    small.textContent = dark ? 'Dark' : 'Light';
  } else {
    const enabled = tile.classList.toggle('active');
    small.textContent = key === 'focus' ? (enabled ? 'On' : 'Off') : (enabled ? (key === 'wifi' ? 'Connected' : 'On') : 'Off');
  }
}));

/* Overlays and navigation */
const aboutOverlay = document.querySelector('#aboutOverlay');
function setNav(action) {
  document.querySelectorAll('.side-nav .nav-link[data-action]').forEach(x => x.classList.toggle('active', x.dataset.action === action));
  M.syncNav();
}
function hideOverlay(o) {
  M.hideOverlay(o);
  if (o === aboutOverlay) setNav('work');
}
document.querySelector('[data-action="source"]').addEventListener('click', () => M.showOverlay(document.querySelector('#sourceOverlay')));
document.querySelectorAll('[data-action="about"]').forEach(b => b.addEventListener('click', () => { setNav('about'); M.showOverlay(aboutOverlay); }));
document.querySelectorAll('[data-action="work"]').forEach(b => b.addEventListener('click', () => hideOverlay(aboutOverlay)));

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

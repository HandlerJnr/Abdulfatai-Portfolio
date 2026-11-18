/*
 * "Ask Jamiu": the portfolio's AI guide, presented like Siri on a Mac.
 * Answers come from the same /api/agent endpoint as the main portfolio's chat.
 * The reply is spoken (when voice is on) and shown as captions that light up word by word.
 * Voice input uses the browser's speech recognition where it exists; typing always works.
 */
(() => {
  const EMAIL = 'aabdulfataijamiu@gmail.com';
  const panel = document.querySelector('#siri');
  const toolbarButton = document.querySelector('#siriToggle');
  const { projects } = window.PORTFOLIO;
  const M = window.Motion;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const phone = matchMedia('(max-width: 760px)');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');

  const SUGGESTIONS = ['Who is Jamiu?', 'What has he shipped?', 'Walk me through his fintech work', 'How does he use AI in his work?'];
  const svg = (d, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    voiceOn: svg('<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>'),
    voiceOff: svg('<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/><path d="m16 9.5 5 5m0-5-5 5"/>'),
    close: svg('<path d="M7 7l10 10M17 7 7 17"/>'),
    mic: svg('<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>'),
    send: svg('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    stop: '<span class="siri-stop-square" aria-hidden="true"></span>',
    open: svg('<path d="M7 17 17 7M8 7h9v9"/>')
  };
  // The asterisk from the portfolio's agent icon, drawn as three bars so it can sit on the orb.
  const glyph = '<svg class="orb-glyph" viewBox="0 0 100 100" aria-hidden="true"><rect x="19" y="43" width="62" height="14"/><rect x="19" y="43" width="62" height="14" transform="rotate(60 50 50)"/><rect x="19" y="43" width="62" height="14" transform="rotate(-60 50 50)"/></svg>';

  panel.innerHTML = `
    <div class="siri-top">
      <button class="siri-tool siri-voice" type="button" aria-pressed="true" title="Spoken replies"><span class="sr-only">Spoken replies</span></button>
      <button class="siri-tool siri-close" type="button" title="Close">${ICONS.close}<span class="sr-only">Close the AI guide</span></button>
    </div>
    <div class="siri-orb" aria-hidden="true"><span class="orb-fluid"><i></i><i></i><i></i><i></i></span>${glyph}</div>
    <p class="siri-status" aria-live="polite"></p>
    <p class="siri-question" hidden></p>
    <div class="siri-caption" aria-hidden="true"></div>
    <p class="sr-only siri-answer-sr" aria-live="polite"></p>
    <div class="siri-chips" role="group" aria-label="Suggestions"></div>
    <form class="siri-form">
      <label class="sr-only" for="siriInput">Ask about Jamiu’s work</label>
      <input id="siriInput" type="text" maxlength="700" autocomplete="off" enterkeyhint="send" placeholder="Ask about Jamiu’s work">
      ${SR ? `<button class="siri-mic" type="button" aria-pressed="false" title="Ask by voice">${ICONS.mic}<span class="sr-only">Ask by voice</span></button>` : ''}
      <button class="siri-send" type="submit" title="Ask">${ICONS.send}<span class="sr-only">Ask</span></button>
    </form>
    <p class="siri-note">Answers come from Jamiu’s published portfolio.</p>`;

  const $ = s => panel.querySelector(s);
  const orb = $('.siri-orb'), statusEl = $('.siri-status'), questionEl = $('.siri-question');
  const caption = $('.siri-caption'), srAnswer = $('.siri-answer-sr'), chips = $('.siri-chips');
  const form = $('.siri-form'), input = $('#siriInput'), send = $('.siri-send'), mic = $('.siri-mic');
  const voiceBtn = $('.siri-voice');

  let state = 'idle', runId = 0, controller = null, history = [], recog = null;
  let lastTrigger = null, finishSpeaking = null;
  let voiceOn = true;
  try { voiceOn = localStorage.getItem('guide-voice') !== 'off'; } catch {}
  if (!synth) { voiceOn = false; voiceBtn.hidden = true; }

  /* ---------- State ---------- */
  const setState = s => { state = s; panel.dataset.state = s; };
  const status = text => { statusEl.textContent = text; };
  const busy = () => state === 'thinking' || state === 'speaking';
  function syncControls() {
    const b = busy();
    send.innerHTML = (b ? ICONS.stop : ICONS.send) + `<span class="sr-only">${b ? 'Stop' : 'Ask'}</span>`;
    send.title = b ? 'Stop' : 'Ask';
    send.classList.toggle('is-stop', b);
    voiceBtn.innerHTML = (voiceOn ? ICONS.voiceOn : ICONS.voiceOff) + '<span class="sr-only">Spoken replies</span>';
    voiceBtn.setAttribute('aria-pressed', String(voiceOn));
    voiceBtn.title = voiceOn ? 'Spoken replies on' : 'Spoken replies off';
  }

  function chip(label, onClick, { href, icon } = {}) {
    const el = document.createElement(href ? 'a' : 'button');
    el.className = 'siri-chip' + (icon ? ' is-action' : '');
    if (href) { el.href = href; } else { el.type = 'button'; el.addEventListener('click', onClick); }
    el.innerHTML = `<span>${label.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])}</span>${icon || ''}`;
    return el;
  }
  function showSuggestions(list) {
    chips.replaceChildren(...list.map(q => chip(q, () => ask(q))));
    if (!reduced()) [...chips.children].forEach((c, i) => M.play(c, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 80 + i * 45 }));
  }
  function greet() {
    panel.classList.remove('has-answer');
    setState('idle');
    status('What would you like to know about Jamiu?');
    questionEl.hidden = true;
    caption.replaceChildren();
    showSuggestions(SUGGESTIONS);
  }

  /* ---------- Opening and closing ---------- */
  function open(from) {
    lastTrigger = from || document.activeElement;
    if (!panel.hidden) { input.focus({ preventScroll: true }); return; }
    window.Desktop && window.Desktop.closePopovers();
    panel.hidden = false;
    toolbarButton.setAttribute('aria-expanded', 'true');
    document.querySelector('.ask-app')?.classList.add('open');
    if (!questionEl.textContent) greet();
    syncControls();
    const y = phone.matches ? '18px' : '-10px';
    M.play(panel, [
      { opacity: 0, transform: `translateY(${y}) scale(.94)`, filter: 'blur(8px)' },
      { opacity: 1, transform: 'none', filter: 'blur(0)' }
    ], { duration: 460 });
    M.play(orb, [{ scale: '.6' }, { scale: '1' }], { duration: 620, easing: 'cubic-bezier(.34,1.45,.64,1)' });
    if (!phone.matches) input.focus({ preventScroll: true });
  }
  function close() {
    if (panel.hidden) return;
    stop();
    recog && recog.abort();
    toolbarButton.setAttribute('aria-expanded', 'false');
    document.querySelector('.ask-app')?.classList.remove('open');
    const y = phone.matches ? '18px' : '-10px';
    M.play(panel, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${y}) scale(.96)` }], { duration: 220, fill: 'forwards' })
      .then(() => { panel.hidden = true; panel.getAnimations().forEach(a => a.cancel()); });
    if (lastTrigger && lastTrigger.isConnected && panel.contains(document.activeElement)) lastTrigger.focus({ preventScroll: true });
  }
  const toggle = from => (panel.hidden ? open(from) : close());

  /* ---------- Talking to the agent ---------- */
  function pageContext() {
    const id = window.Desktop ? window.Desktop.currentProject() : '';
    return { page_id: '', pathname: id ? `/work/${id}/` : '/', hash: '', title: document.title, record_title: '' };
  }
  async function callAgent(question, signal, onStatus) {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, stream: true, history: history.slice(-10), page_context: pageContext() }),
      signal
    });
    if (!res.ok) throw new Error('unavailable');
    if (!(res.headers.get('content-type') || '').includes('application/x-ndjson')) {
      const data = await res.json();
      if (!data.answer) throw new Error('empty');
      return data.answer;
    }
    const reader = res.body.getReader(), decoder = new TextDecoder();
    let buffer = '', answer = '', final = '';
    const accept = line => {
      if (!line.trim()) return;
      const ev = JSON.parse(line);
      if (ev.type === 'status' && typeof ev.message === 'string') onStatus(ev.message);
      if (ev.type === 'delta' && typeof ev.text === 'string') answer += ev.text;
      if (ev.type === 'error') throw new Error(ev.error || 'interrupted');
      if (ev.type === 'done') final = ev.answer || answer;
    };
    try {
      for (;;) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        let at;
        while ((at = buffer.indexOf('\n')) >= 0) { accept(buffer.slice(0, at)); buffer = buffer.slice(at + 1); }
        if (done) break;
      }
      if (buffer.trim()) accept(buffer);
    } finally { reader.releaseLock(); }
    if (!final) throw new Error('incomplete');
    return final;
  }

  /** Plain text for captions and speech: no markdown, links reduced to their labels. */
  const tidy = t => String(t || '')
    .replace(/\[([^\]]+)\]\((?:https?:|mailto:)[^)]+\)/g, '$1')
    .replace(/\*\*|__|`/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*(?:[-*•]|\d+\.)\s+/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();

  async function ask(raw) {
    const q = String(raw || '').trim();
    if (!q) return;
    stop();
    if (synth && voiceOn) { synth.cancel(); synth.speak(new SpeechSynthesisUtterance('')); } // unlocks speech inside the click, for Safari
    input.value = '';
    panel.classList.add('has-answer');
    questionEl.textContent = `“${q}”`;
    questionEl.hidden = false;
    caption.replaceChildren();
    chips.replaceChildren();
    srAnswer.textContent = '';
    setState('thinking');
    status('Thinking…');
    syncControls();
    const run = ++runId;
    controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    let answer, ok = true;
    try {
      answer = await callAgent(q, controller.signal, m => { if (run === runId) status(m); });
    } catch {
      if (run !== runId) return;
      ok = false;
      answer = `I can’t reach Jamiu’s portfolio guide right now. Try again in a moment, or email him at ${EMAIL}.`;
    } finally { clearTimeout(timer); }
    if (run !== runId) return;
    const text = tidy(answer);
    if (ok) { history.push({ role: 'user', text: q }, { role: 'assistant', text }); history = history.slice(-10); }
    srAnswer.textContent = text;
    status('');
    setState('speaking');
    syncControls();
    await present(text, run);
    if (run !== runId) return;
    setState('idle');
    syncControls();
    showActions(text, q, ok);
  }

  function stop() {
    if (state === 'thinking') {
      runId++;
      controller && controller.abort();
      setState('idle');
      status('Stopped.');
      showSuggestions(SUGGESTIONS.slice(0, 3));
    } else if (state === 'speaking' && finishSpeaking) {
      finishSpeaking();
    }
    syncControls();
  }

  /* ---------- Captions and speech ---------- */
  function present(text, run) {
    const words = [];
    caption.replaceChildren();
    text.split('\n').forEach((line, li) => {
      if (li) caption.append(document.createElement('br'));
      line.split(' ').filter(Boolean).forEach(w => {
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = w + ' ';
        caption.append(span);
        words.push({ text: w, el: span, lineEnd: false });
      });
      if (words.length) words[words.length - 1].lineEnd = true;
    });
    caption.scrollTop = 0;
    let shown = 0, lastPulse = 0;
    const reveal = n => {
      n = Math.min(words.length, n);
      if (n <= shown) return;
      for (let i = shown; i < n; i++) words[i].el.classList.add('on');
      words[shown && shown - 1]?.el.classList.remove('now');
      words[n - 1].el.classList.add('now');
      shown = n;
      const el = words[n - 1].el;
      if (el.offsetTop + el.offsetHeight > caption.scrollTop + caption.clientHeight - 6) {
        caption.scrollTo({ top: el.offsetTop - caption.clientHeight * 0.35, behavior: reduced() ? 'auto' : 'smooth' });
      }
      const now = performance.now();
      if (now - lastPulse > 140 && !reduced()) {
        lastPulse = now;
        orb.animate([{ scale: '1' }, { scale: '1.045' }, { scale: '1' }], { duration: 260, easing: 'ease-out' });
      }
    };
    const revealAll = () => { reveal(words.length); words[words.length - 1]?.el.classList.remove('now'); };

    return new Promise(resolve => {
      let done = false, timers = [];
      const finish = () => {
        if (done) return;
        done = true;
        timers.forEach(clearInterval);
        synth && synth.cancel();
        finishSpeaking = null;
        revealAll();
        resolve();
      };
      finishSpeaking = finish;
      if (!words.length) return finish();
      if (reduced() && !(voiceOn && synth)) return finish();

      if (!(voiceOn && synth)) {
        // Reading pace when the voice is off: about five words a second.
        const t = setInterval(() => { if (run !== runId) return finish(); reveal(shown + 1); if (shown >= words.length) finish(); }, 190);
        timers.push(t);
        return;
      }

      // Speak in sentence-sized pieces; long single utterances stall in some browsers.
      const chunks = [];
      let cur = { text: '', start: 0, offsets: [] };
      words.forEach((w, i) => {
        if (!cur.offsets.length) cur.start = i;
        cur.offsets.push(cur.text.length);
        cur.text += w.text + (w.lineEnd && !/[.!?:;,]$/.test(w.text) ? '. ' : ' ');
        const sentenceEnd = /[.!?]["”’)]?$/.test(w.text) || w.lineEnd;
        if ((sentenceEnd && cur.text.length > 90) || cur.text.length > 210 || i === words.length - 1) {
          chunks.push(cur);
          cur = { text: '', start: 0, offsets: [] };
        }
      });
      const voice = pickVoice();
      const speakChunk = k => {
        if (done || run !== runId) return finish();
        if (k >= chunks.length) return finish();
        const c = chunks[k];
        const u = new SpeechSynthesisUtterance(c.text.trim());
        if (voice) u.voice = voice;
        u.lang = voice ? voice.lang : 'en-GB';
        u.rate = 1.02;
        let boundaries = false, started = 0;
        const end = c.start + c.offsets.length;
        u.onstart = () => {
          started = performance.now();
          const t = setInterval(() => {
            if (done) return clearInterval(t);
            if (!boundaries) reveal(Math.min(end - 1, c.start + Math.floor((performance.now() - started) / 1000 * 2.75) + 1));
          }, 80);
          timers.push(t);
        };
        u.onboundary = e => {
          if (e.name && e.name !== 'word') return;
          boundaries = true;
          let idx = 0;
          while (idx + 1 < c.offsets.length && c.offsets[idx + 1] <= e.charIndex) idx++;
          reveal(c.start + idx + 1);
        };
        const next = () => { reveal(end); speakChunk(k + 1); };
        u.onend = next;
        u.onerror = e => (e.error === 'interrupted' || e.error === 'canceled') ? null : next();
        // Some browsers never fire `end`; move on once the piece has had ample time.
        const guard = setTimeout(() => { if (!done && shown < end) { synth.cancel(); next(); } }, 4000 + c.text.length * 90);
        timers.push(guard);
        synth.speak(u);
      };
      synth.cancel();
      speakChunk(0);
    });
  }

  function pickVoice() {
    const voices = synth ? synth.getVoices() : [];
    const gb = voices.filter(v => /^en[-_]GB/i.test(v.lang));
    return gb.find(v => /natural|neural|premium|enhanced/i.test(v.name))
      || gb.find(v => /Google UK English|Daniel|Arthur|Serena|Martha/i.test(v.name))
      || gb[0] || voices.find(v => /^en/i.test(v.lang)) || null;
  }
  synth && synth.addEventListener && synth.addEventListener('voiceschanged', () => {});

  /* ---------- After the answer: open what it mentioned ---------- */
  const ALIASES = {
    'vista-digital-banking': ['Vista'],
    'radius-pay4me': ['Pay4Me', 'Radius'],
    'kremor-ai': ['Kremor'],
    'chalant-ai': ['Chalant'],
    'shortlet-lagos': ['Shortlet'],
    'architek': ['Archi-Tek', 'Architek'],
    'loan-investment-app': ['Loan and Investment', 'Loan & Investment'],
    'reporting-portal': ['project management dashboard']
  };
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function mentioned(text) {
    return projects.map(p => {
      const names = [p.name, ...(ALIASES[p.id] || [])];
      const at = Math.min(...names.map(n => { const m = new RegExp(`\\b${escapeRe(n)}\\b`, 'i').exec(text); return m ? m.index : Infinity; }));
      return { p, at };
    }).filter(x => x.at < Infinity).sort((a, b) => a.at - b.at).map(x => x.p).slice(0, 3);
  }
  function showActions(text, q, ok) {
    const list = [];
    mentioned(text).forEach(p => list.push(chip(`Open ${p.name}`, () => {
      close();
      window.Desktop.openProject(p.id);
    }, { icon: ICONS.open })));
    if (!ok || /email|contact|reach|hire|available|availability/i.test(q + ' ' + text)) {
      list.push(chip('Email Jamiu', null, { href: `mailto:${EMAIL}`, icon: ICONS.open }));
    }
    SUGGESTIONS.filter(s => s.toLowerCase() !== q.toLowerCase()).slice(0, Math.max(1, 4 - list.length)).forEach(s => list.push(chip(s, () => ask(s))));
    chips.replaceChildren(...list);
    if (!reduced()) list.forEach((c, i) => M.play(c, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: i * 45 }));
  }

  /* ---------- Voice input ---------- */
  function listen() {
    if (!SR) return;
    if (state === 'listening') { recog && recog.stop(); return; }
    stop();
    synth && synth.cancel();
    recog = new SR();
    recog.lang = 'en-GB';
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    let heard = '', failed = false;
    setState('listening');
    status('Listening…');
    mic.setAttribute('aria-pressed', 'true');
    recog.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) heard += r[0].transcript; else interim += r[0].transcript;
      }
      input.value = (heard + interim).trim();
    };
    recog.onerror = e => {
      failed = true;
      status(e.error === 'not-allowed' || e.error === 'service-not-allowed'
        ? 'Microphone access is off. You can type your question instead.'
        : 'I didn’t catch that. Try again, or type your question.');
    };
    recog.onend = () => {
      mic.setAttribute('aria-pressed', 'false');
      if (state === 'listening') setState('idle');
      const q = input.value.trim();
      if (q && !failed) ask(q);
      else if (!failed) status('What would you like to know about Jamiu?');
    };
    try { recog.start(); } catch { mic.setAttribute('aria-pressed', 'false'); setState('idle'); }
  }

  /* ---------- Wiring ---------- */
  form.addEventListener('submit', e => { e.preventDefault(); busy() ? stop() : ask(input.value); });
  mic && mic.addEventListener('click', listen);
  orb.addEventListener('click', () => busy() && stop());
  $('.siri-close').addEventListener('click', close);
  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    try { localStorage.setItem('guide-voice', voiceOn ? 'on' : 'off'); } catch {}
    if (!voiceOn && synth) synth.cancel();
    syncControls();
  });
  toolbarButton.addEventListener('click', e => { e.stopPropagation(); toggle(toolbarButton); });
  document.addEventListener('pointerdown', e => {
    if (panel.hidden || panel.contains(e.target) || e.target.closest('#siriToggle, .ask-app, [data-control="ask"], .project-window')) return;
    if (!busy() && state !== 'listening') close();
  });

  window.Siri = { open, close, toggle, isOpen: () => !panel.hidden, ask };
})();

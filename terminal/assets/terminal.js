(() => {
  'use strict';
  const D = window.TERMINAL_DATA;
  const $ = (s) => document.querySelector(s);
  const input = $('#accessInput');
  const button = $('#submitBtn');
  const log = $('#bootlog');
  const trace = $('#traceBar');
  const traceText = $('#traceText');

  const params = new URLSearchParams(location.search);
  if (params.get('reset') === 'handler') {
    localStorage.removeItem('borislov:' + D.node);
    localStorage.removeItem('borislov-lock:' + D.node);
    history.replaceState({}, '', location.pathname);
  }

  function norm(s) {
    return s.toLowerCase().trim()
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^crit success /, 'critical ')
      .replace(/^critical success /, 'critical ')
      .replace(/^success /, 'pass ')
      .replace(/^critical failure /, 'critical fail ')
      .replace(/^crit fail /, 'critical fail ');
  }

  function b64(s) {
    return Uint8Array.from(atob(s), c => c.charCodeAt(0));
  }

  async function derive(value) {
    const bytes = new TextEncoder().encode(norm(value) + '|' + D.node + '|BORISLOV-97-V2');
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return crypto.subtle.importKey('raw', hash, {name: 'AES-GCM'}, false, ['decrypt']);
  }

  async function attempt(value) {
    const key = await derive(value);
    for (const payload of D.payloads) {
      try {
        const plain = await crypto.subtle.decrypt(
          {name: 'AES-GCM', iv: b64(payload.iv), additionalData: new TextEncoder().encode(D.node)},
          key,
          b64(payload.data)
        );
        return JSON.parse(new TextDecoder().decode(plain));
      } catch (_) {}
    }
    return null;
  }

  function add(line, cls = '') {
    const div = document.createElement('div');
    div.textContent = line;
    if (cls) div.className = cls;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function beep(freq = 620, duration = 0.045) {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      const context = new Audio();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = freq;
      gain.gain.value = 0.02;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
      oscillator.addEventListener('ended', () => context.close());
    } catch (_) {}
  }

  async function sequence() {
    input.disabled = true;
    button.disabled = true;
    const lines = [
      'HANDLER TOKEN RECEIVED',
      'NORMALIZING AUTHORIZATION STRING',
      'NEGOTIATING 56K RELAY',
      'SPOOFING LOCAL ACCOUNT',
      'BYPASSING AUDIT DAEMON',
      'DECRYPTING RECOVERED RECORDS'
    ];
    for (let i = 0; i < lines.length; i++) {
      add('> ' + lines[i] + '...');
      beep(460 + i * 45);
      await sleep(280 + Math.random() * 210);
    }
  }

  function setTrace(value) {
    const bounded = Math.min(100, value);
    trace.style.width = bounded + '%';
    traceText.textContent = bounded + '%';
  }

  function render(result) {
    $('#standby').style.display = 'none';
    const box = $('#result');
    box.innerHTML = '';

    const classification = document.createElement('div');
    classification.className = 'classification';
    classification.textContent = result.classification;
    box.appendChild(classification);

    const heading = document.createElement('h2');
    heading.textContent = result.title;
    box.appendChild(heading);

    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.textContent = result.summary;
    box.appendChild(summary);

    result.sections.forEach(section => {
      const wrapper = document.createElement('div');
      wrapper.className = 'section';
      const title = document.createElement('b');
      title.textContent = section[0];
      const paragraph = document.createElement('p');
      paragraph.textContent = section[1];
      wrapper.append(title, paragraph);
      box.appendChild(wrapper);
    });

    const consequence = document.createElement('div');
    consequence.className = 'complication';
    const consequenceTitle = document.createElement('b');
    consequenceTitle.textContent = 'ACCESS CONSEQUENCE';
    consequence.append(consequenceTitle, document.createElement('br'), document.createTextNode(result.complication));
    box.appendChild(consequence);

    box.classList.add('show');
    input.disabled = true;
    button.disabled = true;
    $('#promptLabel').textContent = 'SESSION SEALED // RESULT STORED LOCALLY';
    localStorage.setItem('borislov:' + D.node, JSON.stringify(result));
    setTrace(result.outcome === 'critical fail' ? 100 : result.outcome === 'fail' ? 62 : result.outcome === 'pass' ? 24 : 8);
  }

  async function submit() {
    const state = JSON.parse(localStorage.getItem('borislov-lock:' + D.node) || '{"tries":0,"until":0}');
    if (Date.now() < state.until) {
      add('> REMOTE ACCESS TEMPORARILY LOCKED', 'locked');
      return;
    }

    const value = input.value;
    if (!value.trim()) return;
    add('C:\\REMOTE> ' + value.replace(/\d/g, '•'));
    await sequence();
    const result = await attempt(value);

    if (result) {
      add('> AUTHORIZATION ACCEPTED');
      add('> RECORD SET DECRYPTED');
      localStorage.removeItem('borislov-lock:' + D.node);
      localStorage.setItem('borislov:' + D.node, JSON.stringify(result));
      await sleep(300);
      render(result);
      beep(920, 0.12);
      return;
    }

    let tries = state.tries + 1;
    let until = 0;
    if (tries >= 5) {
      until = Date.now() + 60000;
      tries = 0;
      add('> FIVE TOKEN FAILURES // PORT LOCKED 60 SECONDS', 'locked');
      setTrace(86);
    } else {
      add('> TOKEN MISMATCH // AUTHORIZATION REJECTED', 'locked');
      setTrace(tries * 16);
    }
    localStorage.setItem('borislov-lock:' + D.node, JSON.stringify({tries, until}));
    input.disabled = false;
    button.disabled = false;
    input.value = '';
    input.focus();
    beep(180, 0.16);
  }

  button.addEventListener('click', submit);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') submit();
  });

  $('#system').textContent = D.system;
  $('#agency').textContent = D.agency;
  $('#promptLabel').textContent = D.prompt;
  $('#node').textContent = D.node;
  D.boot.forEach(line => add(line));

  function updateClock() {
    const elapsed = Math.floor((Date.now() - D.loadedAt) / 1000);
    const date = new Date(new Date(D.startDate).getTime() + elapsed * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    $('#clock').textContent = `${pad(date.getDate())} AUG 1997 // ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} MSK`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  const saved = localStorage.getItem('borislov:' + D.node);
  if (saved) {
    try { render(JSON.parse(saved)); } catch (_) {}
  } else {
    input.focus();
  }
})();

/* ═══════════════════════════════════════════════════
   IELTS Road Blitz — game.js  (v2)
   Fixes: desktop buttons, landscape, larger word font,
   audio plays AFTER collision, engine sound, crash sound,
   word repeat fix, high scores.
═══════════════════════════════════════════════════ */

/* ── Speed presets ── */
const SPEEDS = { slow: 2.2, medium: 3.6, fast: 5.2 };

/* ── State ── */
const state = {
  speed:         'slow',
  score:         0,
  streak:        0,
  bestStreak:    0,
  playedIds:     [],
  currentTopic:  null,
  currentWords:  [],
  wordIndex:     0,
  roundResults:  [],
  selectedVoice: null,
  tiltEnabled:   false,
  tiltGamma:     0,
  running:       false,
  animFrame:     null,
  steerLeft:     false,   // on-screen / keyboard left held
  steerRight:    false,   // on-screen / keyboard right held
  usedPairWords: new Set(), // tracks words used as pairs to prevent repetition
};

/* ── Audio context (created on first user gesture) ── */
let audioCtx      = null;
let engineNode    = null;
let engineGain    = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/* ── Engine rumble ── */
function startEngine() {
  try {
    const ctx = getAudioCtx();
    if (engineNode) { engineNode.stop(); engineNode = null; }

    // Layered oscillators for engine rumble
    engineGain        = ctx.createGain();
    engineGain.gain.setValueAtTime(0.0, ctx.currentTime);
    engineGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
    engineGain.connect(ctx.destination);

    const freqs = [55, 110, 165];
    freqs.forEach(f => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type   = 'sawtooth';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.connect(gain);
      gain.connect(engineGain);
      osc.start();
      // keep reference to first one for stop
      if (f === 55) engineNode = osc;
      else osc; // others run until context stops
    });
  } catch (e) { /* audio not supported */ }
}

function stopEngine() {
  try {
    if (engineGain) {
      engineGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
  } catch {}
}

/* ── Crash sound ── */
function playCrash(isCorrect) {
  try {
    const ctx  = getAudioCtx();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (isCorrect) {
      // Satisfying crunch + success tone
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 0.8);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      src.connect(gain);
      src.start();

      // Success ding
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type  = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.25);
      og.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
      og.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
      osc.connect(og); og.connect(ctx.destination);
      osc.start(ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Wrong buzz
      const osc = ctx.createOscillator();
      const og  = ctx.createGain();
      osc.type  = 'square';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);
      og.gain.setValueAtTime(0.35, ctx.currentTime);
      og.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.connect(og); og.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
}

/* ── Speech ── */
function speak(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u   = new SpeechSynthesisUtterance(word);
  u.rate    = 0.88;
  u.pitch   = 1;
  u.volume  = 1;
  if (state.selectedVoice) { u.voice = state.selectedVoice; u.lang = state.selectedVoice.lang; }
  else u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

function populateVoices() {
  const english = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  if (!english.length) return;
  el.voiceSelect.innerHTML = '';
  english.forEach((v, i) => {
    const o       = document.createElement('option');
    o.value       = i;
    o.textContent = v.name + ' (' + v.lang + ')';
    el.voiceSelect.appendChild(o);
  });
  const pref = english.findIndex(v => v.lang === 'en-GB' || v.name.toLowerCase().includes('daniel'));
  const idx  = pref >= 0 ? pref : 0;
  el.voiceSelect.value = idx;
  state.selectedVoice  = english[idx];
}

/* ── Canvas ── */
const canvas = document.getElementById('game-canvas');
const ctx2d  = canvas.getContext('2d');

/* ── Flash overlay ── */
const flashEl = document.createElement('div');
flashEl.className = 'flash-overlay';
document.body.appendChild(flashEl);
function flash(type) {
  flashEl.className = 'flash-overlay';
  void flashEl.offsetWidth;
  flashEl.className = 'flash-overlay ' + type;
  setTimeout(() => { flashEl.className = 'flash-overlay'; }, 400);
}

/* ── Storage ── */
const STORE    = 'ielts_roadblitz_v2';
const HS_STORE = 'ielts_roadblitz_hs';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE)) || { playedIds:[], totalScore:0 }; }
  catch { return { playedIds:[], totalScore:0 }; }
}
function saveProgress() {
  try {
    const saved  = loadProgress();
    const merged = [...new Set([...saved.playedIds, ...state.playedIds])];
    localStorage.setItem(STORE, JSON.stringify({
      playedIds:  merged,
      totalScore: (saved.totalScore||0) + state.score,
    }));
  } catch {}
}
function resetProgress() {
  try { localStorage.removeItem(STORE); } catch {}
  state.playedIds = []; state.score = 0; state.streak = 0;
  updateStartScreen();
}

/* ── High scores ── */
function loadHighScores() {
  try { return JSON.parse(localStorage.getItem(HS_STORE)) || []; }
  catch { return []; }
}
function saveHighScore(score, topic) {
  const hs   = loadHighScores();
  const date = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  hs.push({ score, topic, date });
  hs.sort((a,b) => b.score - a.score);
  hs.splice(5); // keep top 5
  try { localStorage.setItem(HS_STORE, JSON.stringify(hs)); } catch {}
}
function renderHighScores() {
  const hs  = loadHighScores();
  const list = document.getElementById('hs-list');
  if (!hs.length) {
    list.innerHTML = '<li class="hs-empty">No scores yet — hit the road!</li>';
    return;
  }
  list.innerHTML = '';
  hs.forEach((h, i) => {
    const li = document.createElement('li');
    li.className = 'hs-entry';
    li.innerHTML =
      '<span class="hs-rank">' + (i+1) + '</span>' +
      '<div class="hs-info">' +
        '<div class="hs-topic">' + h.topic + '</div>' +
        '<div class="hs-date">' + h.date + '</div>' +
      '</div>' +
      '<span class="hs-pts">' + h.score + '</span>';
    list.appendChild(li);
  });
}

/* ── DOM refs ── */
const el = {
  spdBtns:      document.querySelectorAll('.spd'),
  voiceSelect:  document.getElementById('voice-select'),
  voiceTestBtn: document.getElementById('voice-test-btn'),
  tiltBtn:      document.getElementById('tilt-btn'),
  btnStart:     document.getElementById('btn-start'),
  resetBtn:     document.getElementById('reset-btn'),
  progDone:     document.getElementById('prog-done'),
  topicChip:    document.getElementById('topic-chip'),
  topicDots:    document.getElementById('topic-dots'),
  cueTitle:     document.getElementById('cue-title'),
  cueBody:      document.getElementById('cue-body'),
  btnReady:     document.getElementById('btn-ready'),
  hudScore:     document.getElementById('hud-score'),
  hudTopic:     document.getElementById('hud-topic'),
  hudLeft:      document.getElementById('hud-left'),
  streakFire:   document.getElementById('streak-fire'),
  streakNum:    document.getElementById('streak-num'),
  steerLeft:    document.getElementById('steer-left'),
  steerRight:   document.getElementById('steer-right'),
  reviewScore:  document.getElementById('review-score'),
  reviewStars:  document.getElementById('review-stars'),
  reviewTopic:  document.getElementById('review-topic'),
  reviewList:   document.getElementById('review-list'),
  btnNext:      document.getElementById('btn-next'),
  btnHome:      document.getElementById('btn-home'),
  doneScore:    document.getElementById('done-score'),
  btnAgain:     document.getElementById('btn-again'),
  hsClearBtn:   document.getElementById('hs-clear-btn'),
};

/* ── Screen management ── */
const screens = {
  start:  document.getElementById('screen-start'),
  topic:  document.getElementById('screen-topic'),
  game:   document.getElementById('screen-game'),
  review: document.getElementById('screen-review'),
  done:   document.getElementById('screen-done'),
};
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  if (name !== 'game') stopGame();
  window.scrollTo(0,0);
}

/* ── Voice ── */
el.voiceSelect.addEventListener('change', () => {
  const english = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  state.selectedVoice = english[parseInt(el.voiceSelect.value, 10)];
});
el.voiceTestBtn.addEventListener('click', () => speak('vocation'));
if (window.speechSynthesis) {
  if (speechSynthesis.getVoices().length) populateVoices();
  speechSynthesis.onvoiceschanged = populateVoices;
}

/* ── Tilt ── */
el.tiltBtn.addEventListener('click', async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') enableTilt();
      else el.tiltBtn.textContent = 'Permission denied';
    } catch { el.tiltBtn.textContent = 'Not supported'; }
  } else {
    enableTilt();
  }
});
function enableTilt() {
  state.tiltEnabled = true;
  el.tiltBtn.textContent = '✓ Tilt enabled';
  el.tiltBtn.classList.add('enabled');

  window.addEventListener('deviceorientation', e => {
    // No CSS rotation hack anymore — phone must be landscape.
    // In landscape, gamma = left/right tilt. Simple.
    // screen.orientation.angle 90 = landscape-right (normal hold)
    // screen.orientation.angle 270 = landscape-left (upside down)
    let angle = 0;
    if (screen.orientation && screen.orientation.angle !== undefined) {
      angle = screen.orientation.angle;
    } else if (window.orientation !== undefined) {
      angle = window.orientation;
    }
    // landscape-left (270/-90) inverts gamma
    state.tiltGamma = (angle === 270 || angle === -90)
      ? -(e.gamma || 0)
      :  (e.gamma || 0);
  });
}

/* ── On-screen steering buttons ── */
function setupSteerButtons() {
  // Visual buttons
  function pressVisual(side, on) {
    el['steer' + side].classList.toggle('pressed', on);
  }

  ['Left','Right'].forEach(side => {
    const btn = el['steer' + side];
    btn.addEventListener('touchstart',  e => { e.preventDefault(); e.stopPropagation(); state['steer'+side] = true;  pressVisual(side, true);  }, { passive:false });
    btn.addEventListener('touchend',    e => { e.preventDefault(); e.stopPropagation(); state['steer'+side] = false; pressVisual(side, false); }, { passive:false });
    btn.addEventListener('touchcancel', e => { e.preventDefault(); e.stopPropagation(); state['steer'+side] = false; pressVisual(side, false); }, { passive:false });
    btn.addEventListener('mousedown',  () => { state['steer'+side] = true;  pressVisual(side, true);  });
    btn.addEventListener('mouseup',    () => { state['steer'+side] = false; pressVisual(side, false); });
    btn.addEventListener('mouseleave', () => { state['steer'+side] = false; pressVisual(side, false); });
  });

  // ALSO handle touches on the canvas itself — split screen left/right
  // This is the reliable fallback since the canvas covers everything
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    Array.from(e.changedTouches).forEach(t => {
      if (t.clientX < W / 2) { state.steerLeft  = true;  pressVisual('Left',  true);  }
      else                   { state.steerRight = true;  pressVisual('Right', true);  }
    });
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    // If no touches left, release both
    if (e.touches.length === 0) {
      state.steerLeft  = false; pressVisual('Left',  false);
      state.steerRight = false; pressVisual('Right', false);
    } else {
      // Re-evaluate which sides are still pressed
      let hasLeft = false, hasRight = false;
      Array.from(e.touches).forEach(t => {
        if (t.clientX < W / 2) hasLeft  = true;
        else                   hasRight = true;
      });
      state.steerLeft  = hasLeft;  pressVisual('Left',  hasLeft);
      state.steerRight = hasRight; pressVisual('Right', hasRight);
    }
  }, { passive: false });

  canvas.addEventListener('touchcancel', e => {
    e.preventDefault();
    state.steerLeft  = false; pressVisual('Left',  false);
    state.steerRight = false; pressVisual('Right', false);
  }, { passive: false });
}

/* ── Keyboard ── */
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup',   e => { keys[e.key] = false; });

/* ── Start screen ── */
function updateStartScreen() {
  const saved = loadProgress();
  const done  = new Set([...saved.playedIds, ...state.playedIds]);
  el.progDone.textContent = done.size;
  renderHighScores();
}

el.spdBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    el.spdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.speed = btn.dataset.speed;
  });
});

el.resetBtn.addEventListener('click', () => {
  if (confirm('Reset progress?')) resetProgress();
});

el.hsClearBtn.addEventListener('click', () => {
  if (confirm('Clear all high scores?')) {
    try { localStorage.removeItem(HS_STORE); } catch {}
    renderHighScores();
  }
});

el.btnStart.addEventListener('click', () => {
  getAudioCtx(); // unlock audio context on user gesture
  const saved     = loadProgress();
  const allPlayed = [...new Set([...saved.playedIds, ...state.playedIds])];
  const topic     = getNextTopic(allPlayed);
  if (!topic) { showDoneScreen(); return; }
  loadTopic(topic);
});

/* ── Topic screen ── */
function loadTopic(topic) {
  state.currentTopic   = topic;
  state.roundResults   = [];
  state.wordIndex      = 0;
  state.usedPairWords  = new Set();

  // Shuffle all keywords; slice to 10
  const all = [...topic.keywords];
  shuffleArray(all);
  state.currentWords = all.slice(0, 10);

  el.cueTitle.textContent = topic.title;
  el.cueBody.textContent  = topic.prompt;

  const saved     = loadProgress();
  const allPlayed = new Set([...saved.playedIds, ...state.playedIds]);
  el.topicChip.textContent = 'Topic ' + (allPlayed.size + 1) + ' of 25';
  buildDots(allPlayed.size);
  showScreen('topic');
}

function buildDots(doneCount) {
  el.topicDots.innerHTML = '';
  const n = Math.min(topics.length, 13);
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i < doneCount ? ' done' : i === doneCount ? ' active' : '');
    el.topicDots.appendChild(d);
  }
}

el.btnReady.addEventListener('click', () => {
  // Try to lock orientation to landscape (works in Chrome Android + PWA mode)
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
  // Unlock speech synthesis on desktop with a silent utterance
  if (window.speechSynthesis) {
    const unlock = new SpeechSynthesisUtterance('');
    unlock.volume = 0;
    window.speechSynthesis.speak(unlock);
  }
  showScreen('game');
  startGame();
});

/* ═══════════════════════════════════════════════════
   CANVAS GAME ENGINE
═══════════════════════════════════════════════════ */
let W, H, roadLeft, roadRight, roadW, laneCX, laneCX_L, laneCX_R;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  roadW    = Math.min(W * 0.80, 420);
  roadLeft = (W - roadW) / 2;
  roadRight= roadLeft + roadW;
  laneCX   = W / 2;
  laneCX_L = roadLeft  + roadW / 4;
  laneCX_R = roadRight - roadW / 4;
}
window.addEventListener('resize', resizeCanvas);

let playerCar   = null;
let enemyCars   = [];
let particles   = [];
let hitLabels   = [];
let roadStripes = [];
let kerbDashes  = [];
let bgTrees     = [];
let lastTime    = 0;
let pairSpawned = false;
let waitingNext = false;
let waitTimer   = 0;
const WAIT_MS   = 1100;  // slightly longer to fit crash sound + speech

/* ── Car sizing ── */
function carW()  { return Math.min(roadW * 0.20, 58); }
function carH(w) { return w * 1.9; }

const ENEMY_COLORS = [
  { body:'#e85454', roof:'#c43535', win:'#ff9999' },
  { body:'#e8a832', roof:'#c48a1a', win:'#ffe499' },
  { body:'#9b59f5', roof:'#6a2db8', win:'#d4aaff' },
  { body:'#2ecc8a', roof:'#1a9960', win:'#99ffd0' },
  { body:'#f06030', roof:'#b84020', win:'#ffaa80' },
  { body:'#e84da0', roof:'#b02875', win:'#ffaadd' },
];

function makeEnemyCar(lane, wordObj, colorIdx) {
  const cx  = lane === 'left' ? laneCX_L : laneCX_R;
  const w   = carW();
  const col = ENEMY_COLORS[colorIdx % ENEMY_COLORS.length];
  return {
    x: cx, y: -160,
    w, h: carH(w),
    lane, wordObj, col,
    speed:   SPEEDS[state.speed] * 0.55,
    alive:   true,
    hitVx:   0, hitVy: 0,
    hitRot:  0, hitRotV: 0,
    opacity: 1,
  };
}

function initRoad() {
  roadStripes = [];
  const sh = 48, sg = 40;
  const n  = Math.ceil(H / (sh + sg)) + 2;
  for (let i = 0; i < n; i++) roadStripes.push({ y: i * (sh + sg) });

  kerbDashes = [];
  const kd = 32, kg = 24;
  const kn = Math.ceil(H / (kd + kg)) + 2;
  for (let i = 0; i < kn; i++) kerbDashes.push({ y: i * (kd + kg) });

  bgTrees = [];
  for (let i = 0; i < 14; i++) bgTrees.push(makeBgTree(i));
}

function makeBgTree(i) {
  const side = i % 2 === 0 ? 'left' : 'right';
  const xBase= side === 'left'
    ? roadLeft * 0.5
    : roadRight + (W - roadRight) * 0.5;
  return {
    x: xBase + (Math.random()-0.5) * (roadLeft * 0.6),
    y: Math.random() * H,
    r: 7 + Math.random() * 9,
    shade: Math.random() > 0.5 ? '#2d4a2a' : '#3a5c36',
  };
}

function spawnParticles(x, y, color) {
  for (let i = 0; i < 24; i++) {
    const angle = (Math.PI * 2 * i / 24) + (Math.random()-0.5) * 0.5;
    const spd   = 2.5 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd,
      r: 3 + Math.random()*4,
      color, life: 1,
      decay: 0.024 + Math.random()*0.028,
    });
  }
}

/* ── Start / stop ── */
function startGame() {
  resizeCanvas();
  const w    = carW();
  playerCar  = { x: W/2, y: H*0.78, w, h: carH(w), vx: 0 };
  enemyCars  = []; particles = []; hitLabels = [];
  pairSpawned= false; waitingNext = false; waitTimer = 0;
  state.running = true;
  state.usedPairWords = new Set();
  initRoad();
  updateHUD();
  startEngine();

  // Show tap zone hint briefly
  let tapHint = document.querySelector('.tap-zones');
  if (!tapHint) {
    tapHint = document.createElement('div');
    tapHint.className = 'tap-zones';
    tapHint.innerHTML =
      '<div class="tap-zone-left"><span class="tap-zone-label">◀ tap left</span></div>' +
      '<div class="tap-zone-right"><span class="tap-zone-label">tap right ▶</span></div>';
    document.getElementById('screen-game').appendChild(tapHint);
  }
  tapHint.classList.add('visible');
  setTimeout(() => tapHint.classList.remove('visible'), 2000);
  lastTime = performance.now();
  state.animFrame = requestAnimationFrame(gameLoop);
}

function stopGame() {
  state.running = false;
  if (state.animFrame) { cancelAnimationFrame(state.animFrame); state.animFrame = null; }
  stopEngine();
}

/* ── Game loop ── */
function gameLoop(ts) {
  if (!state.running) return;
  const dt = Math.min(ts - lastTime, 32);
  lastTime = ts;
  update(dt);
  draw();
  state.animFrame = requestAnimationFrame(gameLoop);
}

/* ── Update ── */
function update(dt) {
  const scroll = SPEEDS[state.speed] * (dt / 16.67);

  // Steering — tilt takes priority, then on-screen buttons, then keyboard
  if (state.tiltEnabled) {
    const tilt  = Math.max(-45, Math.min(45, state.tiltGamma));
    const force = (tilt / 45) * 5.5;
    playerCar.vx += force * 0.18;
    playerCar.vx *= 0.82;
  } else {
    const goLeft  = state.steerLeft  || keys['ArrowLeft']  || keys['a'] || keys['A'];
    const goRight = state.steerRight || keys['ArrowRight'] || keys['d'] || keys['D'];
    if (goLeft)  playerCar.vx -= 0.7;
    if (goRight) playerCar.vx += 0.7;
    playerCar.vx *= 0.84;
  }

  playerCar.x = Math.max(roadLeft  + playerCar.w/2,
                 Math.min(roadRight - playerCar.w/2,
                          playerCar.x + playerCar.vx));

  // Road scroll
  const sh = 48, sg = 40;
  roadStripes.forEach(s => {
    s.y += scroll;
    if (s.y > H + sh) s.y -= (sh + sg) * roadStripes.length;
  });
  const kd = 32, kg = 24;
  kerbDashes.forEach(k => {
    k.y += scroll;
    if (k.y > H + kd) k.y -= (kd + kg) * kerbDashes.length;
  });
  bgTrees.forEach(t => {
    t.y += scroll * 0.4;
    if (t.y > H + 40) t.y = -40;
  });

  // Spawn pair
  if (!pairSpawned && !waitingNext) {
    if (state.wordIndex < state.currentWords.length) {
      spawnNextPair();
      pairSpawned = true;
    } else {
      endRound(); return;
    }
  }

  // Update enemy cars
  let allGone = true;
  enemyCars.forEach(car => {
    if (!car.alive) {
      car.x      += car.hitVx;
      car.y      += car.hitVy;
      car.hitRot += car.hitRotV;
      car.opacity = Math.max(0, car.opacity - 0.04);
      return;
    }
    car.y += scroll + car.speed * (dt / 16.67);
    if (car.y < H + car.h) allGone = false;
    if (carsOverlap(playerCar, car)) handleCollision(car);
  });

  // Both cars drove past — missed
  if (pairSpawned && allGone && !waitingNext) {
    const wordObj = state.currentWords[state.wordIndex];
    if (wordObj && !state.roundResults.find(r => r.word.word === wordObj.word)) {
      state.roundResults.push({ word: wordObj, hit:false, correct:false, missed:true });
      state.streak = 0; updateStreak();
    }
    advanceToNext();
  }

  if (waitingNext) {
    waitTimer -= dt;
    if (waitTimer <= 0) { waitingNext = false; pairSpawned = false; enemyCars = []; }
  }

  // Particles
  particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=0.12; p.life-=p.decay; });
  particles = particles.filter(p => p.life > 0);

  // Hit labels
  hitLabels.forEach(l => { l.y += l.vy; l.life -= 0.022; });
  hitLabels = hitLabels.filter(l => l.life > 0);
}

/* ── Spawn word pair — NO repeats ── */
function spawnNextPair() {
  const wordObj = state.currentWords[state.wordIndex];
  if (!wordObj) return;

  // Build pool of candidate pair words:
  // Must be opposite type (correct vs distractor) and not recently used as a pair
  const isCorrect   = wordObj.correct;
  const candidates  = state.currentWords.filter(w =>
    w !== wordObj &&
    w.correct !== isCorrect &&
    !state.usedPairWords.has(w.word)
  );

  // If we exhausted unique pairs, reset the used set (but still avoid same word)
  if (!candidates.length) {
    state.usedPairWords.clear();
    const fallback = state.currentWords.filter(w => w !== wordObj && w.correct !== isCorrect);
    candidates.push(...fallback);
  }

  // Shuffle candidates and pick first
  shuffleArray(candidates);
  const pairedWord = candidates[0] || state.currentWords.find(w => w !== wordObj);

  // Mark paired word as used
  state.usedPairWords.add(pairedWord.word);

  // Randomise lanes
  const leftWord  = Math.random() > 0.5 ? wordObj : pairedWord;
  const rightWord = leftWord === wordObj ? pairedWord : wordObj;

  const colorA = Math.floor(Math.random() * ENEMY_COLORS.length);
  const colorB = (colorA + 2) % ENEMY_COLORS.length;

  enemyCars = [
    makeEnemyCar('left',  leftWord,  colorA),
    makeEnemyCar('right', rightWord, colorB),
  ];

  // No auto-speak — word spoken AFTER collision (fix #4)
}

/* ── Collision ── */
function carsOverlap(player, enemy) {
  const pw = player.w * 0.68, ph = player.h * 0.68;
  const ew = enemy.w  * 0.68, eh = enemy.h  * 0.68;
  return Math.abs(player.x - enemy.x) < (pw+ew)/2 &&
         Math.abs(player.y - enemy.y) < (ph+eh)/2;
}

function handleCollision(car) {
  if (!car.alive) return;
  car.alive   = false;
  car.hitVx   = (car.x - playerCar.x) * 0.28;
  car.hitVy   = -3.5 - Math.random() * 2;
  car.hitRotV = (Math.random()-0.5) * 0.2;

  const actuallyCorrect = car.wordObj.correct;
  const wordObj         = state.currentWords[state.wordIndex];

  state.roundResults.push({
    word:    wordObj,
    rammedWord: car.wordObj,
    hit:     true,
    correct: actuallyCorrect,
    missed:  false,
  });

  // Kill other car
  enemyCars.forEach(c => {
    if (c !== car && c.alive) {
      c.alive = false; c.hitVx = (c.x-playerCar.x)*0.15;
      c.hitVy = -1.5;  c.hitRotV = (Math.random()-0.5)*0.1;
    }
  });

  if (actuallyCorrect) {
    const points = 10 + streakBonus();
    state.score += points;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    updateHUD(); updateStreak();
    spawnParticles(car.x, car.y, car.col.body);
    flash('green');
    hitLabels.push({ text:'+'+points, x:car.x, y:car.y, color:'#30e88a', life:1, vy:-1.6 });
  } else {
    state.streak = 0; updateStreak();
    spawnParticles(car.x, car.y, '#ff4d4d');
    flash('red');
    hitLabels.push({ text:'WRONG', x:car.x, y:car.y, color:'#ff4d4d', life:1, vy:-1.6 });
  }

  // Play crash sound immediately, then speak the rammed word after 350ms
  playCrash(actuallyCorrect);
  setTimeout(() => speak(car.wordObj.word), 360);

  advanceToNext();
}

function advanceToNext() {
  state.wordIndex++;
  el.hudLeft.textContent = Math.max(0, state.currentWords.length - state.wordIndex);
  waitingNext = true;
  waitTimer   = WAIT_MS;
}

function streakBonus() {
  if (state.streak >= 9) return 8;
  if (state.streak >= 5) return 5;
  if (state.streak >= 2) return 3;
  return 0;
}

function updateHUD() {
  el.hudScore.textContent = state.score;
  el.hudTopic.textContent = state.currentTopic ? state.currentTopic.title : '';
  el.hudLeft.textContent  = state.currentWords.length - state.wordIndex;
}

function updateStreak() {
  el.streakNum.textContent  = state.streak;
  let e = '✦';
  if (state.streak >= 10) e = '🔥🔥🔥';
  else if (state.streak >= 6) e = '🔥🔥';
  else if (state.streak >= 3) e = '🔥';
  el.streakFire.textContent = e;
  el.streakFire.classList.remove('pop');
  void el.streakFire.offsetWidth;
  if (state.streak > 0) el.streakFire.classList.add('pop');
}

/* ═══════════════════════════════════════════════════
   DRAW
═══════════════════════════════════════════════════ */
function draw() {
  ctx2d.clearRect(0, 0, W, H);
  drawRoad();
  drawBgTrees();
  enemyCars.filter(c => !c.alive).forEach(c => drawCar(c, false));
  enemyCars.filter(c =>  c.alive).forEach(c => drawCar(c, false));
  drawPlayerCar();
  drawParticles();
  drawHitLabels();
}

function drawRoad() {
  ctx2d.fillStyle = '#1a1d24';
  ctx2d.fillRect(0, 0, roadLeft, H);
  ctx2d.fillRect(roadRight, 0, W - roadRight, H);

  ctx2d.fillStyle = '#2a2d35';
  ctx2d.fillRect(roadLeft, 0, roadW, H);

  // Centre dashes
  ctx2d.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx2d.lineWidth   = 3;
  ctx2d.setLineDash([48, 40]);
  ctx2d.beginPath();
  ctx2d.moveTo(laneCX, 0); ctx2d.lineTo(laneCX, H);
  ctx2d.stroke();
  ctx2d.setLineDash([]);

  // Kerb dashes
  const kd = 32;
  kerbDashes.forEach(k => {
    ctx2d.globalAlpha = 0.13;
    ctx2d.fillStyle   = '#ffffff';
    ctx2d.fillRect(roadLeft - 7, k.y, 7, kd);
    ctx2d.fillRect(roadRight,    k.y, 7, kd);
    ctx2d.globalAlpha = 1;
  });

  ctx2d.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx2d.lineWidth   = 2;
  ctx2d.beginPath();
  ctx2d.moveTo(roadLeft,  0); ctx2d.lineTo(roadLeft,  H);
  ctx2d.moveTo(roadRight, 0); ctx2d.lineTo(roadRight, H);
  ctx2d.stroke();
}

function drawBgTrees() {
  bgTrees.forEach(t => {
    ctx2d.fillStyle = '#3a2a1a';
    ctx2d.fillRect(t.x-2, t.y-t.r, 4, t.r*1.5);
    ctx2d.beginPath();
    ctx2d.arc(t.x, t.y-t.r, t.r, 0, Math.PI*2);
    ctx2d.fillStyle = t.shade;
    ctx2d.fill();
  });
}

function drawPlayerCar() {
  const c  = playerCar;
  const hw = c.w/2, hh = c.h/2;
  ctx2d.save();
  ctx2d.translate(c.x, c.y);

  // Shadow
  ctx2d.fillStyle = 'rgba(0,0,0,0.28)';
  ctx2d.beginPath();
  ctx2d.ellipse(3, hh+4, hw*0.8, 5, 0, 0, Math.PI*2);
  ctx2d.fill();

  // Body
  ctx2d.fillStyle = '#4db8ff';
  rrect(ctx2d, -hw, -hh, c.w, c.h, 8);
  ctx2d.fill();

  // Roof
  ctx2d.fillStyle = '#1a6090';
  rrect(ctx2d, -hw*0.7, -hh*0.55, c.w*0.7, c.h*0.38, 5);
  ctx2d.fill();

  // Windscreen
  ctx2d.fillStyle = 'rgba(180,230,255,0.55)';
  rrect(ctx2d, -hw*0.6, -hh*0.52, c.w*0.6, c.h*0.22, 4);
  ctx2d.fill();

  // Headlights
  ctx2d.fillStyle = '#ffffaa';
  ctx2d.fillRect(-hw+3, -hh+3, 9, 5);
  ctx2d.fillRect( hw-12,-hh+3, 9, 5);

  // Tail lights
  ctx2d.fillStyle = '#ff4444';
  ctx2d.fillRect(-hw+3, hh-8, 9, 5);
  ctx2d.fillRect( hw-12,hh-8, 9, 5);

  ctx2d.restore();
}

function drawCar(car, _isPlayer) {
  const hw = car.w/2, hh = car.h/2;
  ctx2d.save();
  ctx2d.globalAlpha = car.opacity;
  ctx2d.translate(car.x, car.y);
  if (!car.alive) ctx2d.rotate(car.hitRot);

  // Shadow
  ctx2d.fillStyle = 'rgba(0,0,0,0.22)';
  ctx2d.beginPath();
  ctx2d.ellipse(3, hh+4, hw*0.8, 5, 0, 0, Math.PI*2);
  ctx2d.fill();

  // Body
  ctx2d.fillStyle = car.col.body;
  rrect(ctx2d, -hw, -hh, car.w, car.h, 8);
  ctx2d.fill();

  // Roof
  ctx2d.fillStyle = car.col.roof;
  rrect(ctx2d, -hw*0.75, -hh*0.6, car.w*0.75, car.h*0.42, 5);
  ctx2d.fill();

  // Windscreen
  ctx2d.globalAlpha *= 0.55;
  ctx2d.fillStyle = car.col.win;
  rrect(ctx2d, -hw*0.62, -hh*0.56, car.w*0.62, car.h*0.22, 4);
  ctx2d.fill();
  ctx2d.globalAlpha = car.opacity;

  // Tail lights (facing player)
  ctx2d.fillStyle = '#ffffaa';
  ctx2d.fillRect(-hw+3, hh-8, 9, 5);
  ctx2d.fillRect( hw-12,hh-8, 9, 5);

  // ── Word label — floats ABOVE the car, large and readable ──
  const word     = car.wordObj.word;
  // Font size based on screen width for readability at all speeds
  const maxWidth = Math.min(roadW * 0.46, 180);
  let fontSize   = Math.min(W * 0.038, 36);  // much larger base size
  ctx2d.font = '900 ' + fontSize + 'px "Barlow Condensed", sans-serif';
  while (ctx2d.measureText(word).width > maxWidth - 12 && fontSize > 14) {
    fontSize -= 1;
    ctx2d.font = '900 ' + fontSize + 'px "Barlow Condensed", sans-serif';
  }

  ctx2d.textAlign    = 'center';
  ctx2d.textBaseline = 'middle';
  const tw  = ctx2d.measureText(word).width;
  const pad = 10;
  const lw  = tw + pad * 2;
  const lh  = fontSize + 12;
  // Float ABOVE the car top
  const ly  = -hh - lh / 2 - 6;

  // Bright pill background so it's readable at speed
  ctx2d.fillStyle = 'rgba(0,0,0,0.82)';
  rrect(ctx2d, -lw/2, ly - lh/2, lw, lh, 7);
  ctx2d.fill();

  // Yellow border for extra pop
  ctx2d.strokeStyle = 'rgba(240,194,48,0.7)';
  ctx2d.lineWidth   = 2;
  rrect(ctx2d, -lw/2, ly - lh/2, lw, lh, 7);
  ctx2d.stroke();

  // Label text
  ctx2d.fillStyle   = '#ffffff';
  ctx2d.lineWidth   = 3;
  ctx2d.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx2d.strokeText(word, 0, ly);
  ctx2d.fillText(word, 0, ly);

  ctx2d.restore();
}

function drawParticles() {
  particles.forEach(p => {
    ctx2d.globalAlpha = p.life;
    ctx2d.fillStyle   = p.color;
    ctx2d.beginPath();
    ctx2d.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2);
    ctx2d.fill();
  });
  ctx2d.globalAlpha = 1;
}

function drawHitLabels() {
  hitLabels.forEach(l => {
    ctx2d.globalAlpha   = l.life;
    ctx2d.font          = '900 28px "Barlow Condensed", sans-serif';
    ctx2d.textAlign     = 'center';
    ctx2d.textBaseline  = 'middle';
    ctx2d.strokeStyle   = 'rgba(0,0,0,0.55)';
    ctx2d.lineWidth     = 3.5;
    ctx2d.strokeText(l.text, l.x, l.y);
    ctx2d.fillStyle     = l.color;
    ctx2d.fillText(l.text, l.x, l.y);
  });
  ctx2d.globalAlpha = 1;
}

function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x+r, y);
  c.lineTo(x+w-r, y); c.quadraticCurveTo(x+w, y,   x+w, y+r);
  c.lineTo(x+w, y+h-r); c.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  c.lineTo(x+r, y+h); c.quadraticCurveTo(x,   y+h, x,   y+h-r);
  c.lineTo(x, y+r); c.quadraticCurveTo(x,   y,   x+r, y);
  c.closePath();
}

/* ═══════════════════════════════════════════════════
   END ROUND
═══════════════════════════════════════════════════ */
function endRound() {
  stopGame();
  if (!state.playedIds.includes(state.currentTopic.id)) {
    state.playedIds.push(state.currentTopic.id);
  }
  saveProgress();
  saveHighScore(state.score, state.currentTopic.title);
  buildReview();
  showScreen('review');
}

/* ── Build a single review card (used by both results and not-seen) ── */
function buildReviewItem(wordObj, result) {
  const item = document.createElement('div');

  // Determine status
  let cls, icon, resultTxt;
  if (!result) {
    cls = 'skip'; icon = '○'; resultTxt = 'Not shown this round';
  } else if (result.missed) {
    cls = 'skip'; icon = '⏱'; resultTxt = 'Missed — drove past';
  } else if (result.correct) {
    cls = 'hit';  icon = '✓'; resultTxt = 'Correct car rammed ✓';
  } else {
    cls = 'miss'; icon = '✕';
    resultTxt = 'Wrong — "' + (result.rammedWord ? result.rammedWord.word : '?') + '" is a distractor';
  }

  const tagCls = wordObj.correct ? 'fits' : 'distractor';
  const tagLbl = wordObj.correct ? 'fits topic' : 'distractor';

  item.className = 'r-item ' + cls;
  item.innerHTML =
    '<div class="r-icon">' + icon + '</div>' +
    '<div class="r-body">' +
      '<div class="r-word">' +
        wordObj.word +
        '<span class="r-tag ' + tagCls + '">' + tagLbl + '</span>' +
        '<button class="speak-btn" title="Hear pronunciation">🔊</button>' +
        (wordObj.chinese ? '<button class="cn-btn" title="Show Chinese">🇨🇳</button>' : '') +
      '</div>' +
      (wordObj.chinese ? '<div class="r-chinese" style="display:none">' + wordObj.chinese + '</div>' : '') +
      '<div class="r-explanation">' + wordObj.explanation + '</div>' +
      (wordObj.example  ? '<div class="r-example">"' + wordObj.example + '"</div>' : '') +
      (result && !result.missed ? '<div class="r-result">' + resultTxt + '</div>' : '') +
    '</div>';

  // Speak button
  item.querySelector('.speak-btn').addEventListener('click', () => speak(wordObj.word));

  // Chinese toggle button
  const cnBtn = item.querySelector('.cn-btn');
  if (cnBtn) {
    const cnDiv = item.querySelector('.r-chinese');
    cnBtn.addEventListener('click', () => {
      const visible = cnDiv.style.display !== 'none';
      cnDiv.style.display = visible ? 'none' : 'block';
      cnBtn.style.opacity = visible ? '0.5' : '1';
    });
  }

  return item;
}

/* ═══════════════════════════════════════════════════
   REVIEW
═══════════════════════════════════════════════════ */
function buildReview() {
  const results = state.roundResults;
  const correct = results.filter(r => r.correct).length;
  const total   = results.length;
  const pct     = total > 0 ? correct / total : 0;

  el.reviewScore.textContent = correct + '/' + total;
  el.reviewTopic.textContent = state.currentTopic.title;

  let stars = '☆☆☆';
  if (pct >= 0.9) stars = '★★★';
  else if (pct >= 0.6) stars = '★★☆';
  else if (pct >= 0.3) stars = '★☆☆';
  el.reviewStars.textContent = stars;

  el.reviewList.innerHTML = '';

  results.forEach(r => {
    el.reviewList.appendChild(buildReviewItem(r.word, r));
  });

  // Not-seen words
  const seen    = new Set(results.map(r => r.word.word));
  const notSeen = state.currentTopic.keywords.filter(w => !seen.has(w.word));
  if (notSeen.length) {
    const div = document.createElement('div');
    div.style.cssText = 'font-size:10px;color:var(--dim);text-transform:uppercase;' +
      'letter-spacing:1px;margin-top:6px;padding:5px 0;border-top:1px solid var(--border);';
    div.textContent = 'Other keywords for this topic';
    el.reviewList.appendChild(div);
    notSeen.forEach(w => {
      el.reviewList.appendChild(buildReviewItem(w, null));
    });
  }
}

el.btnNext.addEventListener('click', () => {
  const saved     = loadProgress();
  const allPlayed = [...new Set([...saved.playedIds, ...state.playedIds])];
  const next      = getNextTopic(allPlayed);
  if (!next) { showDoneScreen(); return; }
  loadTopic(next);
});

el.btnHome.addEventListener('click', () => { updateStartScreen(); showScreen('start'); });

/* ── Done ── */
function showDoneScreen() {
  const saved = loadProgress();
  el.doneScore.textContent = 'Total score: ' + ((saved.totalScore||0) + state.score);
  showScreen('done');
}
el.btnAgain.addEventListener('click', () => {
  resetProgress();
  state.score = 0; state.streak = 0;
  updateStartScreen(); showScreen('start');
});

/* ── Utility ── */
function shuffleArray(arr) {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ── Init ── */
function init() {
  resizeCanvas();
  setupSteerButtons();
  updateStartScreen();
  showScreen('start');
}

init();

/* ═══════════════════════════════════════════════════
   IELTS Road Blitz — game.js
   Canvas driving game: tilt steering, enemy cars,
   collision detection, particles, speech, review.
═══════════════════════════════════════════════════ */

/* ── Speed presets (px/frame at 60fps) ── */
const SPEEDS = {
  slow:   2.2,
  medium: 3.6,
  fast:   5.2,
};

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
  tiltGamma:     0,       // device tilt left/right (-90 to 90)
  running:       false,
  animFrame:     null,
};

/* ── Canvas & ctx ── */
const canvas = document.getElementById('game-canvas');
const ctx    = canvas.getContext('2d');

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
const STORE = 'ielts_roadblitz';
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
  state.playedIds = [];
  state.score     = 0;
  state.streak    = 0;
  updateStartScreen();
}

/* ── DOM refs ── */
const el = {
  screens:      {
    start:  document.getElementById('screen-start'),
    topic:  document.getElementById('screen-topic'),
    game:   document.getElementById('screen-game'),
    review: document.getElementById('screen-review'),
    done:   document.getElementById('screen-done'),
  },
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
  tiltHint:     document.getElementById('tilt-hint'),
  reviewScore:  document.getElementById('review-score'),
  reviewStars:  document.getElementById('review-stars'),
  reviewTopic:  document.getElementById('review-topic'),
  reviewList:   document.getElementById('review-list'),
  btnNext:      document.getElementById('btn-next'),
  btnHome:      document.getElementById('btn-home'),
  doneScore:    document.getElementById('done-score'),
  btnAgain:     document.getElementById('btn-again'),
};

/* ═══════════════════════════════════════════════════
   SCREEN MANAGEMENT
═══════════════════════════════════════════════════ */
function showScreen(name) {
  Object.values(el.screens).forEach(s => s.classList.remove('active'));
  el.screens[name].classList.add('active');
  if (name !== 'game') stopGame();
  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════════════
   SPEECH
═══════════════════════════════════════════════════ */
function speak(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u   = new SpeechSynthesisUtterance(word);
  u.rate    = 0.9;
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
    const o = document.createElement('option');
    o.value = i;
    o.textContent = v.name + ' (' + v.lang + ')';
    el.voiceSelect.appendChild(o);
  });
  const pref = english.findIndex(v => v.lang==='en-GB' || v.name.toLowerCase().includes('daniel'));
  const idx  = pref >= 0 ? pref : 0;
  el.voiceSelect.value = idx;
  state.selectedVoice  = english[idx];
}

el.voiceSelect.addEventListener('change', () => {
  const english = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
  state.selectedVoice = english[parseInt(el.voiceSelect.value, 10)];
});
el.voiceTestBtn.addEventListener('click', () => speak('vocation'));

if (window.speechSynthesis) {
  if (speechSynthesis.getVoices().length) populateVoices();
  speechSynthesis.onvoiceschanged = populateVoices;
}

/* ═══════════════════════════════════════════════════
   TILT / ACCELEROMETER
═══════════════════════════════════════════════════ */
el.tiltBtn.addEventListener('click', async () => {
  // iOS 13+ requires permission
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') enableTilt();
      else el.tiltBtn.textContent = 'Permission denied';
    } catch { el.tiltBtn.textContent = 'Not supported'; }
  } else {
    // Android / desktop — no permission needed
    enableTilt();
  }
});

function enableTilt() {
  state.tiltEnabled = true;
  el.tiltBtn.textContent = '✓ Tilt enabled';
  el.tiltBtn.classList.add('enabled');
  window.addEventListener('deviceorientation', onTilt);
}

function onTilt(e) {
  // gamma = left/right tilt, -90 to 90
  state.tiltGamma = e.gamma || 0;
}

/* ═══════════════════════════════════════════════════
   START SCREEN
═══════════════════════════════════════════════════ */
function updateStartScreen() {
  const saved = loadProgress();
  const done  = new Set([...saved.playedIds, ...state.playedIds]);
  el.progDone.textContent = done.size;
}

el.spdBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    el.spdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.speed = btn.dataset.speed;
  });
});

el.resetBtn.addEventListener('click', () => {
  if (confirm('Reset all progress? Cannot be undone.')) resetProgress();
});

el.btnStart.addEventListener('click', () => {
  const saved     = loadProgress();
  const allPlayed = [...new Set([...saved.playedIds, ...state.playedIds])];
  const topic     = getNextTopic(allPlayed);
  if (!topic) { showDoneScreen(); return; }
  loadTopic(topic);
});

/* ═══════════════════════════════════════════════════
   TOPIC SCREEN
═══════════════════════════════════════════════════ */
function loadTopic(topic) {
  state.currentTopic = topic;
  state.roundResults = [];
  state.wordIndex    = 0;

  const all = [...topic.keywords];
  shuffleArray(all);
  // ensure we have a mix — at least 2 distractors in the set
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
  showScreen('game');
  startGame();
});

/* ═══════════════════════════════════════════════════
   CANVAS GAME ENGINE
═══════════════════════════════════════════════════ */

/* ── Road constants (set on resize) ── */
let W, H, roadLeft, roadRight, roadW, laneW, laneCX, laneCX_L, laneCX_R;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;

  // Road occupies 80% of screen width, centred
  roadW    = Math.min(W * 0.82, 380);
  roadLeft = (W - roadW) / 2;
  roadRight= roadLeft + roadW;
  laneW    = roadW / 2;
  laneCX   = W / 2;
  laneCX_L = roadLeft  + laneW / 2;
  laneCX_R = roadRight - laneW / 2;
}

window.addEventListener('resize', () => { resizeCanvas(); });

/* ── Game objects ── */
let playerCar   = null;
let enemyCars   = [];  // max 2 active at once
let particles   = [];
let roadStripes = [];
let kerbDashes  = [];
let bgTrees     = [];

/* ── Timing ── */
let lastTime    = 0;
let pairSpawned = false;   // have we spawned the current word pair?
let waitingNext = false;   // are we pausing before next word?
let waitTimer   = 0;
const WAIT_MS   = 900;     // pause after collision before next pair

/* ── Player car shape ── */
function makePlayerCar() {
  return {
    x:      W / 2,
    y:      H * 0.78,
    w:      Math.min(roadW * 0.22, 52),
    h:      0,        // set from w
    speed:  SPEEDS[state.speed],
    vx:     0,
    color:  '#4db8ff',
    highlight: '#a8d8ff',
    shadow: '#1a6090',
  };
}

/* ── Enemy car colours ── */
const ENEMY_COLORS = [
  { body:'#e85454', roof:'#c43535', window:'#ff9999' },
  { body:'#e8a832', roof:'#c48a1a', window:'#ffe499' },
  { body:'#9b59f5', roof:'#6a2db8', window:'#d4aaff' },
  { body:'#2ecc8a', roof:'#1a9960', window:'#99ffd0' },
  { body:'#f06030', roof:'#b84020', window:'#ffaa80' },
];

function makeEnemyCar(lane, wordObj, colorIdx) {
  const cx = lane === 'left' ? laneCX_L : laneCX_R;
  const w  = Math.min(roadW * 0.22, 52);
  const col= ENEMY_COLORS[colorIdx % ENEMY_COLORS.length];
  return {
    x:       cx,
    y:       -120,
    w:       w,
    h:       w * 1.9,
    lane:    lane,
    wordObj: wordObj,
    col:     col,
    speed:   SPEEDS[state.speed] * 0.55,
    alive:   true,
    hit:     false,
    hitVx:   0,
    hitVy:   0,
    hitRot:  0,
    hitRotV: 0,
    opacity: 1,
  };
}

/* ── Road stripes (dashed centre line moving downward) ── */
function initRoad() {
  roadStripes = [];
  const stripeH = 48, gap = 40;
  const total   = Math.ceil(H / (stripeH + gap)) + 2;
  for (let i = 0; i < total; i++) {
    roadStripes.push({ y: i * (stripeH + gap) });
  }

  kerbDashes = [];
  const kDash = 32, kGap = 24;
  const kTotal= Math.ceil(H / (kDash + kGap)) + 2;
  for (let i = 0; i < kTotal; i++) {
    kerbDashes.push({ y: i * (kDash + kGap) });
  }

  bgTrees = [];
  for (let i = 0; i < 12; i++) {
    bgTrees.push(makeBgTree(i));
  }
}

function makeBgTree(i) {
  const side  = i % 2 === 0 ? 'left' : 'right';
  const xBase = side === 'left'
    ? roadLeft * 0.5
    : roadRight + (W - roadRight) * 0.5;
  return {
    x:    xBase + (Math.random() - 0.5) * (roadLeft * 0.6),
    y:    Math.random() * H,
    r:    6 + Math.random() * 8,
    side: side,
    shade: Math.random() > 0.5 ? '#2d4a2a' : '#3a5c36',
  };
}

/* ── Particle explosion ── */
function spawnParticles(x, y, color) {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx:      Math.cos(angle) * speed,
      vy:      Math.sin(angle) * speed,
      r:       3 + Math.random() * 4,
      color:   color,
      life:    1,
      decay:   0.025 + Math.random() * 0.03,
    });
  }
}

/* ── Start / stop ── */
function startGame() {
  resizeCanvas();

  // Setup player car
  playerCar       = makePlayerCar();
  playerCar.h     = playerCar.w * 1.9;

  enemyCars       = [];
  particles       = [];
  pairSpawned     = false;
  waitingNext     = false;
  waitTimer       = 0;
  state.running   = true;

  initRoad();
  updateHUD();

  // Hide tilt hint after 3s
  el.tiltHint.classList.remove('hidden');
  setTimeout(() => el.tiltHint.classList.add('hidden'), 3000);

  lastTime = performance.now();
  state.animFrame = requestAnimationFrame(gameLoop);
}

function stopGame() {
  state.running = false;
  if (state.animFrame) {
    cancelAnimationFrame(state.animFrame);
    state.animFrame = null;
  }
}

/* ── Main loop ── */
function gameLoop(ts) {
  if (!state.running) return;
  const dt = Math.min(ts - lastTime, 32); // cap at 32ms
  lastTime = ts;

  update(dt);
  draw();

  state.animFrame = requestAnimationFrame(gameLoop);
}

/* ── Update ── */
function update(dt) {
  const spd    = SPEEDS[state.speed];
  const scroll = spd * (dt / 16.67);   // normalise to 60fps

  // ── Player steering via tilt ──
  if (state.tiltEnabled) {
    const tilt  = Math.max(-45, Math.min(45, state.tiltGamma));
    const force = (tilt / 45) * 5.5;
    playerCar.vx += force * 0.18;
    playerCar.vx *= 0.82;  // friction
  } else {
    // Keyboard fallback (arrow keys)
    if (keys.ArrowLeft)  { playerCar.vx -= 0.6; }
    if (keys.ArrowRight) { playerCar.vx += 0.6; }
    playerCar.vx *= 0.85;
  }

  playerCar.x = Math.max(roadLeft  + playerCar.w/2,
                 Math.min(roadRight - playerCar.w/2,
                          playerCar.x + playerCar.vx));

  // ── Road scroll ──
  const stripeH = 48, gap = 40;
  roadStripes.forEach(s => {
    s.y += scroll;
    if (s.y > H + stripeH) s.y -= (stripeH + gap) * roadStripes.length;
  });

  const kDash = 32, kGap = 24;
  kerbDashes.forEach(k => {
    k.y += scroll;
    if (k.y > H + kDash) k.y -= (kDash + kGap) * kerbDashes.length;
  });

  bgTrees.forEach(t => {
    t.y += scroll * 0.4;
    if (t.y > H + 40) t.y = -40;
  });

  // ── Spawn enemy pair ──
  if (!pairSpawned && !waitingNext) {
    if (state.wordIndex < state.currentWords.length) {
      spawnNextPair();
      pairSpawned = true;
    } else {
      endRound();
      return;
    }
  }

  // ── Update enemy cars ──
  enemyCars.forEach(car => {
    if (!car.alive) {
      // spin & fade out after hit
      car.x      += car.hitVx;
      car.y      += car.hitVy;
      car.hitRot += car.hitRotV;
      car.opacity = Math.max(0, car.opacity - 0.04);
      return;
    }
    car.y += scroll + car.speed * (dt / 16.67);

    // ── Collision check ──
    if (carsOverlap(playerCar, car)) {
      handleCollision(car);
    }

    // ── Missed (drove past player) ──
    if (car.y > H + car.h) {
      car.alive = false;
    }
  });

  // ── Check if both enemy cars gone ──
  const allGone = enemyCars.every(c => !c.alive || c.y > H + c.h);
  if (pairSpawned && allGone && !waitingNext) {
    // Player missed both — count as timeout for the word
    const wordObj = state.currentWords[state.wordIndex];
    if (wordObj && !state.roundResults.find(r => r.word.word === wordObj.word)) {
      state.roundResults.push({ word: wordObj, hit: false, correct: false, missed: true });
      state.streak = 0;
      updateStreak();
    }
    advanceToNext();
  }

  // ── Wait timer before next word ──
  if (waitingNext) {
    waitTimer -= dt;
    if (waitTimer <= 0) {
      waitingNext = false;
      pairSpawned = false;
      enemyCars   = [];
    }
  }

  // ── Particles ──
  particles.forEach(p => {
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   += 0.12;
    p.life -= p.decay;
  });
  particles = particles.filter(p => p.life > 0);
}

/* ── Spawn a word pair ── */
function spawnNextPair() {
  const wordObj = state.currentWords[state.wordIndex];
  if (!wordObj) return;

  // Pick a random distractor from a different position
  const distractors = state.currentWords.filter(w => !w.correct);
  const others      = state.currentWords.filter(w => w !== wordObj && w.correct !== wordObj.correct);
  let   pairedWord  = null;

  if (wordObj.correct) {
    // show a distractor alongside a correct word
    pairedWord = distractors.length
      ? distractors[Math.floor(Math.random() * distractors.length)]
      : state.currentWords.find(w => w !== wordObj) || wordObj;
  } else {
    // show a correct word alongside this distractor
    const corrects = state.currentWords.filter(w => w.correct);
    pairedWord = corrects.length
      ? corrects[Math.floor(Math.random() * corrects.length)]
      : state.currentWords.find(w => w !== wordObj) || wordObj;
  }

  // Randomly assign lanes
  const leftWord  = Math.random() > 0.5 ? wordObj : pairedWord;
  const rightWord = leftWord === wordObj ? pairedWord : wordObj;

  const colorA = Math.floor(Math.random() * ENEMY_COLORS.length);
  const colorB = (colorA + 1 + Math.floor(Math.random() * (ENEMY_COLORS.length - 1))) % ENEMY_COLORS.length;

  enemyCars = [
    makeEnemyCar('left',  leftWord,  colorA),
    makeEnemyCar('right', rightWord, colorB),
  ];

  // Speak the correct word
  speak(wordObj.correct ? wordObj.word : pairedWord.word);
}

/* ── Collision ── */
function carsOverlap(player, enemy) {
  const pw = player.w * 0.7, ph = player.h * 0.7;
  const ew = enemy.w  * 0.7, eh = enemy.h  * 0.7;
  return Math.abs(player.x - enemy.x) < (pw + ew) / 2 &&
         Math.abs(player.y - enemy.y) < (ph + eh) / 2;
}

function handleCollision(car) {
  if (!car.alive) return;
  car.alive  = false;
  car.hitVx  = (car.x - playerCar.x) * 0.25;
  car.hitVy  = -3 - Math.random() * 2;
  car.hitRotV= (Math.random() - 0.5) * 0.18;

  const wordObj   = state.currentWords[state.wordIndex];
  const isCorrect = car.wordObj === wordObj
    ? wordObj.correct         // rammed the current word
    : !wordObj.correct;       // rammed the paired word, which is correct only if wordObj is distractor

  // More precisely: correct if car.wordObj.correct === true
  const actuallyCorrect = car.wordObj.correct;

  state.roundResults.push({
    word:    wordObj,
    hit:     true,
    correct: actuallyCorrect,
    missed:  false,
  });

  if (actuallyCorrect) {
    // Good hit
    const points = 10 + streakBonus();
    state.score += points;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    updateHUD();
    updateStreak();
    spawnParticles(car.x, car.y, car.col.body);
    flash('green');
    showHitLabel('+' + points, car.x, car.y, '#30e88a');
  } else {
    // Wrong hit
    state.streak = 0;
    updateStreak();
    spawnParticles(car.x, car.y, '#ff4d4d');
    flash('red');
    showHitLabel('WRONG', car.x, car.y, '#ff4d4d');
  }

  // Kill the other car too (advance cleanly)
  enemyCars.forEach(c => { if (c !== car && c.alive) {
    c.alive  = false;
    c.hitVx  = (c.x - playerCar.x) * 0.15;
    c.hitVy  = -1;
    c.hitRotV= (Math.random() - 0.5) * 0.08;
  }});

  advanceToNext();
}

/* ── Hit label (floating +10 etc.) ── */
let hitLabels = [];
function showHitLabel(text, x, y, color) {
  hitLabels.push({ text, x, y, color, life: 1, vy: -1.5 });
}

/* ── Advance to next word ── */
function advanceToNext() {
  state.wordIndex++;
  el.hudLeft.textContent = Math.max(0, state.currentWords.length - state.wordIndex);
  waitingNext = true;
  waitTimer   = WAIT_MS;
}

function streakBonus() {
  if (state.streak >= 9)  return 8;
  if (state.streak >= 5)  return 5;
  if (state.streak >= 2)  return 3;
  return 0;
}

/* ── Keyboard fallback ── */
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup',   e => { keys[e.key] = false; });

/* ── HUD ── */
function updateHUD() {
  el.hudScore.textContent = state.score;
  el.hudTopic.textContent = state.currentTopic ? state.currentTopic.title : '';
  el.hudLeft.textContent  = state.currentWords.length - state.wordIndex;
}

function updateStreak() {
  el.streakNum.textContent = state.streak;
  let emoji = '✦';
  if (state.streak >= 10) emoji = '🔥🔥🔥';
  else if (state.streak >= 6) emoji = '🔥🔥';
  else if (state.streak >= 3) emoji = '🔥';
  el.streakFire.textContent = emoji;
  el.streakFire.classList.remove('pop');
  void el.streakFire.offsetWidth;
  if (state.streak > 0) el.streakFire.classList.add('pop');
}

/* ═══════════════════════════════════════════════════
   DRAW
═══════════════════════════════════════════════════ */
function draw() {
  ctx.clearRect(0, 0, W, H);

  drawRoad();
  drawBgTrees();

  // Draw dead enemy cars (spinning away)
  enemyCars.filter(c => !c.alive).forEach(drawEnemyCar);

  // Draw live enemy cars
  enemyCars.filter(c => c.alive).forEach(drawEnemyCar);

  drawPlayerCar();
  drawParticles();
  drawHitLabels();
}

/* ── Road ── */
function drawRoad() {
  // Kerb (outer edges)
  ctx.fillStyle = '#1a1d24';
  ctx.fillRect(0, 0, roadLeft, H);
  ctx.fillRect(roadRight, 0, W - roadRight, H);

  // Tarmac
  ctx.fillStyle = '#2a2d35';
  ctx.fillRect(roadLeft, 0, roadW, H);

  // Lane divider (dashed centre line)
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth   = 3;
  ctx.setLineDash([48, 40]);
  ctx.beginPath();
  ctx.moveTo(laneCX, 0);
  ctx.lineTo(laneCX, H);
  ctx.stroke();
  ctx.setLineDash([]);

  // Kerb stripes
  const kDash = 32, kGap = 24;
  kerbDashes.forEach(k => {
    // Left kerb
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.15;
    ctx.fillRect(roadLeft - 6, k.y, 6, kDash);
    // Right kerb
    ctx.fillRect(roadRight, k.y, 6, kDash);
    ctx.globalAlpha = 1;
  });

  // Road edge lines
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(roadLeft, 0); ctx.lineTo(roadLeft, H);
  ctx.moveTo(roadRight, 0); ctx.lineTo(roadRight, H);
  ctx.stroke();
}

function drawBgTrees() {
  bgTrees.forEach(t => {
    // trunk
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(t.x - 2, t.y - t.r, 4, t.r * 1.5);
    // canopy
    ctx.beginPath();
    ctx.arc(t.x, t.y - t.r, t.r, 0, Math.PI * 2);
    ctx.fillStyle = t.shade;
    ctx.fill();
  });
}

/* ── Draw a car (player or enemy) ── */
function drawPlayerCar() {
  const c = playerCar;
  ctx.save();
  ctx.translate(c.x, c.y);

  const w = c.w, h = c.h;
  const hw = w/2, hh = h/2;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(4, hh + 4, hw * 0.8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = c.color;
  roundRect(ctx, -hw, -hh, w, h, 8);
  ctx.fill();

  // Roof
  ctx.fillStyle = c.shadow;
  roundRect(ctx, -hw * 0.7, -hh * 0.55, w * 0.7, h * 0.38, 5);
  ctx.fill();

  // Windscreen
  ctx.fillStyle = 'rgba(180,230,255,0.6)';
  roundRect(ctx, -hw * 0.6, -hh * 0.52, w * 0.6, h * 0.22, 4);
  ctx.fill();

  // Rear window
  ctx.fillStyle = 'rgba(180,230,255,0.4)';
  roundRect(ctx, -hw * 0.55, hh * 0.12, w * 0.55, h * 0.14, 3);
  ctx.fill();

  // Headlights
  ctx.fillStyle = '#ffffaa';
  ctx.fillRect(-hw + 3, -hh + 3, 8, 5);
  ctx.fillRect(hw - 11, -hh + 3, 8, 5);

  // Tail lights
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(-hw + 3, hh - 8, 8, 5);
  ctx.fillRect(hw - 11, hh - 8, 8, 5);

  ctx.restore();
}

function drawEnemyCar(car) {
  ctx.save();
  ctx.globalAlpha = car.opacity;
  ctx.translate(car.x, car.y);
  if (!car.alive) ctx.rotate(car.hitRot);

  const w = car.w, h = car.h;
  const hw = w/2, hh = h/2;
  const col = car.col;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(4, hh + 4, hw * 0.8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = col.body;
  roundRect(ctx, -hw, -hh, w, h, 8);
  ctx.fill();

  // Roof / word label area
  ctx.fillStyle = col.roof;
  roundRect(ctx, -hw * 0.75, -hh * 0.6, w * 0.75, h * 0.42, 5);
  ctx.fill();

  // Windscreen
  ctx.fillStyle = col.window;
  ctx.globalAlpha *= 0.6;
  roundRect(ctx, -hw * 0.62, -hh * 0.56, w * 0.62, h * 0.22, 4);
  ctx.fill();
  ctx.globalAlpha = car.opacity;

  // Headlights (facing down = toward player)
  ctx.fillStyle = '#ffffaa';
  ctx.fillRect(-hw + 3, hh - 8, 8, 5);
  ctx.fillRect(hw - 11, hh - 8, 8, 5);

  // Word label on roof
  const fontSize  = Math.max(11, Math.min(w * 0.38, 16));
  const labelText = car.wordObj.word;
  ctx.font        = '800 ' + fontSize + 'px "Barlow Condensed", sans-serif';
  ctx.textAlign   = 'center';
  ctx.textBaseline= 'middle';

  // Label background pill
  const tw  = ctx.measureText(labelText).width;
  const pad = 6;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRect(ctx, -(tw/2 + pad), -hh*0.38, tw + pad*2, fontSize + 8, 4);
  ctx.fill();

  // Label text — colour indicates fits/distractor (only after answered, here always white for challenge)
  ctx.fillStyle = '#ffffff';
  ctx.fillText(labelText, 0, -hh * 0.25);

  ctx.restore();
}

/* ── Particles ── */
function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

/* ── Hit labels ── */
function drawHitLabels() {
  hitLabels.forEach(l => {
    l.y    += l.vy;
    l.life -= 0.025;
  });
  hitLabels = hitLabels.filter(l => l.life > 0);

  hitLabels.forEach(l => {
    ctx.globalAlpha    = l.life;
    ctx.font           = '900 28px "Barlow Condensed", sans-serif';
    ctx.textAlign      = 'center';
    ctx.textBaseline   = 'middle';
    ctx.fillStyle      = l.color;
    ctx.strokeStyle    = 'rgba(0,0,0,0.5)';
    ctx.lineWidth      = 3;
    ctx.strokeText(l.text, l.x, l.y);
    ctx.fillText(l.text, l.x, l.y);
  });
  ctx.globalAlpha = 1;
}

/* ── Rounded rect helper ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x,     y + h, x,     y + h - r);
  ctx.lineTo(x,     y + r);
  ctx.quadraticCurveTo(x,     y,     x + r, y);
  ctx.closePath();
}

/* ═══════════════════════════════════════════════════
   END OF ROUND
═══════════════════════════════════════════════════ */
function endRound() {
  stopGame();

  if (!state.playedIds.includes(state.currentTopic.id)) {
    state.playedIds.push(state.currentTopic.id);
  }
  saveProgress();
  buildReview();
  showScreen('review');
}

/* ═══════════════════════════════════════════════════
   REVIEW SCREEN
═══════════════════════════════════════════════════ */
function buildReview() {
  const results = state.roundResults;
  const correct = results.filter(r => r.correct).length;
  const total   = results.length;
  const pct     = total > 0 ? correct / total : 0;

  el.reviewScore.textContent = correct + '/' + total;
  el.reviewTopic.textContent = state.currentTopic.title;

  let stars = '☆☆☆';
  if (pct >= 0.9)      stars = '★★★';
  else if (pct >= 0.6) stars = '★★☆';
  else if (pct >= 0.3) stars = '★☆☆';
  el.reviewStars.textContent = stars;

  el.reviewList.innerHTML = '';

  results.forEach(r => {
    const item = document.createElement('div');
    let cls, icon, resultTxt;

    if (r.missed) {
      cls = 'skip'; icon = '○'; resultTxt = 'Missed — drove past';
    } else if (r.correct) {
      cls = 'hit';  icon = '✓'; resultTxt = 'Rammed correctly ✓';
    } else {
      cls = 'miss'; icon = '✕'; resultTxt = 'Wrong car rammed ✕';
    }

    const tagCls = r.word.correct ? 'fits' : 'distractor';
    const tagLbl = r.word.correct ? 'fits topic' : 'distractor';

    item.className = 'r-item ' + cls;
    item.innerHTML =
      '<div class="r-icon">' + icon + '</div>' +
      '<div>' +
        '<div class="r-word">' +
          r.word.word +
          '<span class="r-tag ' + tagCls + '">' + tagLbl + '</span>' +
          '<button class="speak-btn" title="Hear word">🔊</button>' +
        '</div>' +
        '<div class="r-explanation">' + r.word.explanation + '</div>' +
        '<div class="r-result">' + resultTxt + '</div>' +
      '</div>';

    item.querySelector('.speak-btn').addEventListener('click', () => speak(r.word.word));
    el.reviewList.appendChild(item);
  });

  // Not-seen words
  const seen    = new Set(results.map(r => r.word.word));
  const notSeen = state.currentTopic.keywords.filter(w => !seen.has(w.word));
  if (notSeen.length) {
    const div = document.createElement('div');
    div.style.cssText = 'font-size:11px;color:var(--dim);text-transform:uppercase;' +
      'letter-spacing:1px;margin-top:8px;padding:6px 0;border-top:1px solid var(--border);';
    div.textContent = 'Other keywords for this topic';
    el.reviewList.appendChild(div);

    notSeen.forEach(w => {
      const item   = document.createElement('div');
      const tagCls = w.correct ? 'fits' : 'distractor';
      const tagLbl = w.correct ? 'fits topic' : 'distractor';
      item.className = 'r-item skip';
      item.innerHTML =
        '<div class="r-icon">○</div>' +
        '<div>' +
          '<div class="r-word">' +
            w.word +
            '<span class="r-tag ' + tagCls + '">' + tagLbl + '</span>' +
            '<button class="speak-btn" title="Hear word">🔊</button>' +
          '</div>' +
          '<div class="r-explanation">' + w.explanation + '</div>' +
        '</div>';
      item.querySelector('.speak-btn').addEventListener('click', () => speak(w.word));
      el.reviewList.appendChild(item);
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

el.btnHome.addEventListener('click', () => {
  updateStartScreen();
  showScreen('start');
});

/* ═══════════════════════════════════════════════════
   DONE SCREEN
═══════════════════════════════════════════════════ */
function showDoneScreen() {
  const saved = loadProgress();
  el.doneScore.textContent = 'Total score: ' + ((saved.totalScore || 0) + state.score);
  showScreen('done');
}

el.btnAgain.addEventListener('click', () => {
  resetProgress();
  state.score  = 0;
  state.streak = 0;
  updateStartScreen();
  showScreen('start');
});

/* ═══════════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════════ */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
function init() {
  resizeCanvas();
  updateStartScreen();
  showScreen('start');
}

init();

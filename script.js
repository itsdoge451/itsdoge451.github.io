const menuScreen = document.getElementById('menuScreen');
const timerScreen = document.getElementById('timerScreen');
const customScreen = document.getElementById('customScreen');
const timerModeBtn = document.getElementById('timerModeBtn');
const customModeBtn = document.getElementById('customModeBtn');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const startCustomBtn = document.getElementById('startCustomBtn');
const pauseCustomBtn = document.getElementById('pauseCustomBtn');
const resetCustomBtn = document.getElementById('resetCustomBtn');
const timerDisplay = document.getElementById('timerDisplay');
const customDisplay = document.getElementById('customDisplay');
const customInput = document.getElementById('customInput');
const customUnit = document.getElementById('customUnit');
const backButtons = document.querySelectorAll('.back-button');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let timerInterval = null;
let customInterval = null;
let timerSeconds = 0;
let customSeconds = 0;
let timerRunning = false;
let customRunning = false;

function showScreen(screen) {
  menuScreen.classList.toggle('active', screen === 'menuScreen');
  timerScreen.classList.toggle('active', screen === 'timerScreen');
  customScreen.classList.toggle('active', screen === 'customScreen');
}

function playClickSound() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playHoverSound() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.value = 580;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.08);
}

function playEndSound() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.3);
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function updateCustomDisplay() {
  customDisplay.textContent = formatTime(customSeconds);
}

function getCustomMultiplier() {
  const mode = customUnit.value;
  if (mode === 'hours') return 3600;
  if (mode === 'days') return 86400;
  return 60;
}

function getCustomLabelText() {
  const mode = customUnit.value;
  if (mode === 'hours') return 'Set time (hours)';
  if (mode === 'days') return 'Set time (days)';
  return 'Set time (minutes)';
}

function updateCustomLabel() {
  const label = document.querySelector('.custom-label');
  if (label) {
    label.textContent = getCustomLabelText();
  }
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  if (timerSeconds === 0) {
    timerSeconds = 300;
    updateTimerDisplay();
  }
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds -= 1;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      playEndSound();
    }
  }, 1000);
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerSeconds = 300;
  updateTimerDisplay();
}

function startCustom() {
  if (customRunning) return;
  const value = Number(customInput.value);
  const multiplier = getCustomMultiplier();
  if (customSeconds === 0 && Number.isFinite(value) && value >= 0) {
    customSeconds = Math.round(value * multiplier);
  }
  if (customSeconds <= 0) {
    customSeconds = 0;
    updateCustomDisplay();
    return;
  }
  customRunning = true;
  updateCustomDisplay();
  customInterval = setInterval(() => {
    if (customSeconds > 0) {
      customSeconds -= 1;
      updateCustomDisplay();
    } else {
      clearInterval(customInterval);
      customRunning = false;
      playEndSound();
    }
  }, 1000);
}

function pauseCustom() {
  if (!customRunning) return;
  customRunning = false;
  clearInterval(customInterval);
}

function resetCustom() {
  customRunning = false;
  clearInterval(customInterval);
  const value = Number(customInput.value);
  const multiplier = getCustomMultiplier();
  customSeconds = value > 0 ? Math.round(value * multiplier) : 0;
  updateCustomDisplay();
}

function init() {
  showScreen('menuScreen');
  updateTimerDisplay();
  updateCustomDisplay();
  updateCustomLabel();

  const allButtons = [
    timerModeBtn,
    customModeBtn,
    startTimerBtn,
    pauseTimerBtn,
    resetTimerBtn,
    startCustomBtn,
    pauseCustomBtn,
    resetCustomBtn,
    ...backButtons,
  ];

  allButtons.forEach(button => {
    button.addEventListener('click', () => {
      playClickSound();
    });
    button.addEventListener('pointerenter', () => {
      playHoverSound();
    });
  });

  timerModeBtn.addEventListener('click', () => showScreen('timerScreen'));
  customModeBtn.addEventListener('click', () => showScreen('customScreen'));
  startTimerBtn.addEventListener('click', startTimer);
  pauseTimerBtn.addEventListener('click', pauseTimer);
  resetTimerBtn.addEventListener('click', resetTimer);
  startCustomBtn.addEventListener('click', startCustom);
  pauseCustomBtn.addEventListener('click', pauseCustom);
  resetCustomBtn.addEventListener('click', resetCustom);
  customUnit.addEventListener('change', () => {
    updateCustomLabel();
  });
  customInput.addEventListener('input', () => {
    updateCustomLabel();
  });

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      pauseTimer();
      pauseCustom();
      showScreen('menuScreen');
    });
  });
}

init();

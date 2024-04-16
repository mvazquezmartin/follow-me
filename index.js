const $squares = document.querySelectorAll('.square');
const $btnAction = document.querySelector('#btn-action');
const $squaresRotate = document.querySelectorAll('.flip-square');
const $try_count = document.querySelector('.try');
const $best_count = document.querySelector('.best');
const $level_title = document.querySelector('.level');
const $front_flip_squares = document.querySelectorAll('.flip-square-front');

const context = new AudioContext();
const sequence = [];
const inputSequence = [];
const wrong_note = 210;
const start = { note: 230, type: 'triangle' };
let index_count = 0;
let try_count = 0;
let best_count = 0;
let currentOscillator = null;

const notes = [
  248.55, // Do
  264.32, // Do#
  279.98, // Re
  295.57, // Re#
  311.14, // Mi
  330.77, // Fa
  349.24, // Fa#
  370.59, // Sol
  392.0, // Sol#
  415.3, // La
  440.0, // La#
  466.16, // Si
];

const welcome = [0, 1, 2, 5, 4, 3, 6, 7, 8];

function jsNota(frecuencia, type = 'sine') {
  const o = context.createOscillator();
  const g = context.createGain();
  o.connect(g);
  o.type = type;
  o.frequency.value = frecuencia;
  g.connect(context.destination);
  o.start(0);
  g.gain.value = 0.5;
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1.5);
  return o;
}

function getRandomNumber() {
  return Math.floor(Math.random() * $squares.length);
}

function pushSequence() {
  const numSequence = getRandomNumber();
  sequence.push(numSequence);
}

async function generateSequence() {
  for (let i = 0; i < sequence.length; i++) {
    const active = sequence[i];
    const noteFrequency = notes[active];

    await new Promise((resolve) => {
      setTimeout(() => {
        jsNota(noteFrequency);
        $squares[active].classList.add('active-sequence');
        resolve();
      }, 200);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        $squares.forEach((square) => {
          square.classList.remove('active-sequence');
          inputSequence.length = 0;
        });
        resolve();
      }, 300);
    });
  }
}

function updateRecord() {
  const record = sequence.length - 1;
  if (best_count < record) best_count = record;
  $best_count.textContent = `Best: Level ${best_count}`;
}

function updateLevel(secuence = sequence.length) {
  $level_title.textContent = `Level ${secuence}`;
}

function addANewSequence() {
  pushSequence();
  setTimeout(() => {
    generateSequence();
  }, 750);
  updateRecord();
  updateLevel();
  index_count = 0;
}

function checkSequence(index) {
  // console.log({ index_count, inputSequence, sequence });
  if (sequence[index] === inputSequence[index]) {
    index_count++;
    if (sequence.length === inputSequence.length) {
      addANewSequence();
    }
    return true;
  } else {
    return false;
  }
}

async function welcomeSequence(sequence) {
  for (let i = 0; i < sequence.length; i++) {
    const active = sequence[i];

    await new Promise((resolve) => {
      setTimeout(() => {
    $front_flip_squares[active].classList.add('front-active');
    resolve();
      }, 300);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        $front_flip_squares.forEach((square) => {
          square.classList.remove('front-active');
          inputSequence.length = 0;
        });
        resolve();
      }, 300);
    });
  }
}

function playWelcomeSequence() {
  const welcome_sequence = welcome.slice().sort(() => Math.random() - 0.5);
  welcomeSequence(welcome_sequence);
}

function resetValue() {
  sequence.length = 0;
  inputSequence.length = 0;
  index_count = 0;
}

function init() {
  $squaresRotate.forEach((square) => {
    square.classList.add('rotate-square');
  });
  resetValue();
  pushSequence();
  setTimeout(() => generateSequence(), 1000);
}

$front_flip_squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    const noteFrequency = notes[index];
    jsNota(noteFrequency);
    square.classList.add('front-active');
    setTimeout(() => {
      square.classList.remove('front-active');
    }, 300);
  });
});

$squares.forEach((square, index) => {
  square.addEventListener('click', () => {
    square.classList.add('active-sequence');
    inputSequence.push(index);

    if (currentOscillator) currentOscillator.stop();

    const noteFrequency = notes[index];
    currentOscillator = jsNota(noteFrequency);

    setTimeout(() => {
      square.classList.remove('active-sequence');
    }, 250);

    if (!checkSequence(index_count)) {
      square.classList.remove('active-sequence');
      square.classList.add('wrong-sequence');

      if (currentOscillator) currentOscillator.stop();
      jsNota(wrong_note);

      updateRecord();
      resetValue();

      setTimeout(() => {
        square.classList.remove('wrong-sequence');
      }, 600);

      setTimeout(() => {
        $squaresRotate.forEach((square) => {
          square.classList.remove('rotate-square');
          $btnAction.style.visibility = 'visible';
          updateLevel(1);
        });
      }, 750);
    }
  });
});

$btnAction.addEventListener('click', () => {
  try_count++;
  $try_count.textContent = `Try: ${try_count}`;
  $btnAction.style.visibility = 'hidden';
  jsNota(start.note, start.type);
  init();
});

playWelcomeSequence();

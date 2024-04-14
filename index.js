const $squares = document.querySelectorAll('.square');
const $btnAction = document.querySelector('#btn-action');
const $squaresRotate = document.querySelectorAll('.flip-square');
const $try_count = document.querySelector('.try');
const $best_count = document.querySelector('.best');
const $level_title = document.querySelector('.level');

const range = [...$squares];
const sequence = [];
const inputSequence = [];
let index_count = 0;
let try_count = 0;
let best_count = 0;

function getRandomNumber() {
  return Math.floor(Math.random() * range.length);
}

function pushSequence() {
  const numSequence = getRandomNumber();
  sequence.push(numSequence);
}

async function generateSequence() {
  for (let i = 0; i < sequence.length; i++) {
    const active = sequence[i];
    await new Promise((resolve) => {
      setTimeout(() => {
        $squares[active].classList.add('active-sequence');
        resolve();
      }, 100);
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        $squares.forEach((square) => {
          square.classList.remove('active-sequence');
          inputSequence.length = 0;
        });
        resolve();
      }, 700);
    });
  }
}

function checkSequence(index) {
  // console.log({ index_count, inputSequence, sequence });
  if (sequence[index] === inputSequence[index]) {
    index_count++;
    if (
      sequence.every((element, index) => {
        return element === inputSequence[index];
      })
    ) {
      const newSequenceNum = getRandomNumber();
      sequence.push(newSequenceNum);
      setTimeout(() => {
        generateSequence();
      }, 750);
      index_count = 0;
      updateRecord();
      updateLevel();
    }
    return true;
  } else {
    return false;
  }
}

function updateLevel(secuence = sequence.length) {
  $level_title.textContent = `Level ${secuence}`;
}

function updateRecord() {
  const record = sequence.length - 1;
  if (best_count < record) best_count = record;
  $best_count.textContent = `Best: Level ${best_count}`;
}

function init() {
  $squaresRotate.forEach((square) => {
    square.classList.add('rotate-square');
  });
  sequence.length = 0;
  inputSequence.length = 0;
  index_count = 0;
  pushSequence();
  setTimeout(() => generateSequence(), 500);
}

$squares.forEach((square, index) => {
  square.addEventListener('mousedown', () => {
    square.classList.add('active-sequence');
    inputSequence.push(index);

    if (!checkSequence(index_count)) {
      square.classList.remove('active-sequence');
      square.classList.add('wrong-sequence');

      updateRecord();

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

$squares.forEach((square) => {
  square.addEventListener('mouseup', () => {
    setTimeout(() => {
      square.classList.remove('active-sequence');
    }, 100);
  });
});

$btnAction.addEventListener('click', () => {
  try_count++;
  $try_count.textContent = `Try: ${try_count}`;
  init();
  $btnAction.style.visibility = 'hidden';
});

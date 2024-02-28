'use strict';

/************** selecting and manipulating elements  date[ 30 - 01 - 2024 ]  */

// document.querySelector('.message').textContent = '🎉 Correct Number'
// document.querySelector('.number').textContent = '13';
// document.querySelector('.score').textContent = '10';

//setting value
// document.querySelector('.guess').vaue = 5;
//getting value

// console.log(document.querySelector('.guess').vaue);

// project - 1  date [ 31 - 01 - 2024 ]

const randomNumber = function () {
  return Math.trunc(Math.random() * 20) + 1;
};

// note generating secret number
// let secretNumber = Math.trunc(Math.random() * 20) + 1;
let secretNumber = randomNumber();
// retrieving the score at first
let score = 20;
let highscore = document.querySelector('.highscore').textContent;

//function
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const displayBackground = function (color) {
  document.querySelector('body').style.backgroundColor = color;
};

const displayScore = function (score) {
  document.querySelector('.score').textContent = score;
};

const displaySecretNumber = function (number) {
  document.querySelector('.number').textContent = number;
};

const setWidth = function (width) {
  document.querySelector('.number').style.width = width;
};

// note when check button is clicked, value in the input box is retrieved and stored in guess variable
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess);

  // note when no input
  if (!guess) {
    displayMessage('⛔ No number');

    // note winning case - change bgcolor using DOM manipulating CSS.
  } else if (guess === secretNumber) {
    displayMessage('✔️ Correct number');
    // document.querySelector('.number').textContent = secretNumber;
    displaySecretNumber(secretNumber);
    //setting highscore
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    // css manipulation
    // document.querySelector('body').style.backgroundColor = '#60b347';
    displayBackground('#60b347');
    // document.querySelector('.number').style.width = '30rem';
    setWidth('30rem');
  }

  // note when guess is wrong
  else if (guess !== secretNumber) {
    if (score > 1) {
      // document.querySelector('.message').textContent =
      //   guess > secretNumber ? '📈 Too high!' : '📉 Too low!';
      displayMessage(guess > secretNumber ? '📈 Too high!' : '📉 Too low!');
      score--;
      // document.querySelector('.score').textContent = score;
      displayScore(score);
    } else {
      displayMessage('💥You lost the game!');
      // document.querySelector('.score').textContent = 0;
      displayScore(0);
    }
  }
});

// note resetting game when again button is clicked

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = randomNumber(); // secret number newly generated
  score = 20;
  // document.querySelector('.number').textContent = '?';
  displaySecretNumber('?');
  document.querySelector('.guess').value = '';
  displayMessage('Start guessing...');
  // document.querySelector('.score').textContent = score;
  displayScore(score);
  // document.querySelector('body').style.backgroundColor = '#222';
  displayBackground('#222');
  // document.querySelector('.number').style.width = '15rem';
  setWidth('15rem');
});

// note code refactoring done above, that is implemented DRY principle.
// used ternary operator to check if guess greater or lower in single block
// used functions to display message
// used functions to display message,score,bgcolor,secretnumber

// project completed on  date [ 01 - 02 - 2024 ] @ 6 :45 pm

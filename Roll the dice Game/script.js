'use strict';
// note score elements not actual score

// date [ 02 - 02 - 2024 ]
// project #3 pig game - dice roll

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); // also this way
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnhold = document.querySelector('.btn--hold');
const current0El = document.getElementById('current--0'); //selcting current scores
const current1El = document.getElementById('current--1');

let scores,currentScore,activePlayer,playing;

// note initial conditions
// score0El.textContent = 0;
// score1El.textContent = 0;
// diceEl.classList.add('hidden'); 

// const scores = [0, 0]; 
// let currentScore = 0;
// let activePlayer = 0;
// let playing = true; 

const init = function () {
  // note initial conditions
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden'); // hiding the dice
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};
init();  //called whenever the page is loaded/reloaded.

//note switchPlayer() function

const switchPlayer = function () {
  // 3. switch the player
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  //switch to next player
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  // using classList.toggle() method to remove the specified if present or add if absent
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

// note handling events

// note rolling dice event handling
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1.Generate random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log(dice);

    //2.Display the generated dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`; // changing the src attribute to change dice.

    // 3.check rolled dice is 1 : if true switch the player
    if (dice !== 1) {
      // add dice value to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

//note hold button event handling

btnhold.addEventListener('click', function () {
  if (playing) {
    //1. add current score to active player's score
    // scores[1] = scores[1] + currentScore;
    scores[activePlayer] += currentScore;
    //setting the score of active player
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2.check if active player's score is >= 100.
    if (scores[activePlayer] >= 100) {
      // finish the game and announce active player as winner.
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      playing = false; // note notefinishing the game
      diceEl.classList.add('hidden');
    } else {
      switchPlayer();
    }
  }
});


//note handling event when new button is clicked
//resetting the game
btnNew.addEventListener('click', init); //note no ()

// project completed on date [ 02 - 02 - 2024 ]
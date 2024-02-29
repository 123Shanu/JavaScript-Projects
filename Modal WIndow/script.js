'use strict';

// project #2 on date [ 01 - 02 - 2024 ]

//selecting elements for manipulation

const btnsOpenModal = document.querySelectorAll('.show-modal'); // stored as a nodelist
const modal = document.querySelector('.modal');
const btnClosedModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');

for (let i = 0; i < btnsOpenModal.length; i++) {
  //adding event listener to each button in the loop
  btnsOpenModal[i].addEventListener('click', function () {
    // when class is hidden , the display property is set as none,so removing it will allow it to display,,,similarily for overlay also
    modal.classList.remove('hidden');
    // modal.style.display='block';  -- can use this also
    overlay.classList.remove('hidden');
  });
}

// note function to hide the  modal when clicking the close button and outside of it.
function hideModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}
// note note note  don't use paranthesis () inside the eventhandler,,we don't need to call,,when we click the button,it will be called.

btnClosedModal.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);

// eventhandler when pressing only 'esc' key  -- key press is a global event
//note we should tell that the modal should hide only pressing the esc key. so whenever a key is pressed, a object is created and it has the information about which event was pressed.We pass that object to the function when any key is pressed.  see below

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    hideModal();
  }
});

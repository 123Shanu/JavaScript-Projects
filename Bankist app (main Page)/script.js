'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     console.log(id);
//   });
// });

////////////////////////////////////
//learn more button scrolling
btnScrollTo.addEventListener('click', function (e) {
  //cords of section1
  // const s1cords = section1.getBoundingClientRect();
  //reach section 1

  //old schoolview
  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //legend way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//note event delegation
// 1.add event listener to common parant Element
// 2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//note tabbed components - operations
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// bad practice
// tabs.forEach(t=>t.addEventListener('click',()=>console.log('Tab')));

//good practice use event delegation
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  if (!clicked) return; //stop executing if click is not on the button.
  //removing active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //get data-tab number of clicked content

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//note Menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', function (e) {
  //handle function above
  handleHover(e, 0.5); //note
});

nav.addEventListener('mouseout', function (e) {
  //hadle function above
  handleHover(e, 1);
});

//note sticky navigation
//scroll event
//note - not a good way
// const initialCords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialCords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

/////////////////////////////////note
//sticky navigation : Intersection  Observer API
// const obsCallback = function(entries,observer){
//     entries.forEach(entry=>{

//       console.log(entry);
//     })
// }

// const obsOptions ={
//   root:null,
//   threshold:[0,0.2]
// };

// const observer = new IntersectionObserver(obsCallback,obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, headerObserver) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////note

//note Revealing sections on scroll

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  //unobserve
  //when seeing for the first time,observe then unobserve
  observer.unobserve(entry.target);
};

const allSections = document.querySelectorAll('.section');
const revealOptions = {
  root: null,
  threshold: [0.15],
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); 
});

//note lazy loading images
///selecting images where one of the attributes is 'data-src';
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, oberver) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  //replace src = data-src for high quality image
  //note below not preferable for slow networksxxxxxxxxxxxxxx
  // entry.target.classList.remove('lazy-img');
  // const originalSrc = entry.target.getAttribute('data-src');
  // console.log(originalSrc);
  // entry.target.src=originalSrc;
  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  entry.target.src = entry.target.dataset.src;
  //after image has loaded, remove blur
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imageObserver.observe(img));

//note slider components
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;

const goToSLide = function (curr) {
  slides.forEach(function (slide, i) {
    // currSlide :0 => 0%,100%,200%
    // currSlide :1 => -100%,0%,100%
    // currSlide :2 => -200%,-100%,0%
    slide.style.transform = `translateX(${(i - curr) * 100}%)`;
  });
};

//note when the page reloads currentslide is 0
goToSLide(0);

//btn
btnRight.addEventListener('click', function () {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  //slides style
  goToSLide(currentSlide);
});

btnLeft.addEventListener('click', function () {
  if (currentSlide === 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide--;
  }

  goToSLide(currentSlide);
});

///////////////////////////////
///////////////////////////////
///////////////////////////////
///////////////////////////////

// date - [ 13 - 02 - 2024 ]

//note selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allsection = document.querySelectorAll('.section');
// console.log('all sections :', allsection);
// console.log('section - 1', document.getElementById('section--1'));

// const button = document.getElementsByClassName('btn'); //return collection
// console.log(button);

// //note creating elements
// const msg = document.createElement('div');
// msg.classList.add('cookie-message');
// // msg.textContent='We use cookies for improved functionality and analytics'
// msg.innerHTML =
//   'We use cookies for improved functionality and analytics.<button class="btn btn--close--cookie">Got it!</button>';
// const header = document.querySelector('.header');
// //prepend first child
// // header.prepend(msg);//first child
// // header.append(msg);//last child
// // header.before(msg);//before header
// header.after(msg); //after heaader

// console.log(msg);

// //deleting elements
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     console.log('delete cookie message');
//     msg.remove();
//   });

// //note styles attributes and classes

// msg.style.backgroundColor = '#373838';
// msg.style.width = '100%';

// console.log(msg.style.height);
//getting computed styles - means actual styles of the element
// console.log(getComputedStyle(msg).height);

// msg.style.height =
//   Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary','orangered');

//Attributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// console.log(logo.id);

// //data attributes
// //works only for attributes starting with data
// console.log(logo.dataset.versionNumber);

// //classes
// logo.classList.add();
// logo.classList.remove();
// logo.classList.contains('');
// logo.classList.toggle();

// const h1 = document.querySelector('h1');
// const alertH1 = function () {
//   // h1.textContent='Hello World!';
//   alert('Eventlistener : You are reading the heading!');

//   h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

//another way
// h1.onmouseenter = function () {
//   // h1.textContent='Hello World!';
//   alert('Eventlistener : You are reading the heading!');
// };

// h1.addEventListener('mouseenter', function () {
//   // h1.textContent='Hello World!';
//   alert('Eventlistener : You are reading the heading!');
// });

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// // console.log(randomInt(2,5));

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link');
//   //stop propagation
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link');
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('link');
// });
// //child
// const h1 = document.querySelector('h1');
// console.log(h1.childNodes);
// console.log(h1.children);

// //parent
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// //siblings
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

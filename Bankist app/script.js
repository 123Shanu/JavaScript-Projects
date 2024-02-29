'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//note from here I started
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //initially making the container empty

  //for sorting
  //if sort is true,sorting occurs,else same
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//note ---------calculating balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//note ----------------calc In , Out , Interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const Out = acc.movements
    .filter(mov => mov < 0)
    .map(mov => Math.abs(mov))
    .reduce((acc, mov) => acc + mov, 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Out}€`;
  labelSumInterest.textContent = `${interest}€`;
};

//note---------------computing usernames
//note this function takes the array that constains all the accounts object, and creates username for each account.
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//date [ 10 - 02 - 2024 ]
//Event handlers.-----------Login implementation
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`; //first name only

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //focus out of input field

    //update UI
    updateUI(currentAccount);
    console.log('Login');
  }
});

//--------Money transfer implementing

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //prevent  form from being submitted

  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  //clear input field
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  //requested amount greater than 0,current amount atleast toamount,not transferring to own account,and the receiver exists
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('transfer valid');
    //add transaction to both sender and reciever account
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

//-----Request loan
//note note-- loan will be given if atleast the 10% of the requested amount is one of the deposits
btnLoan.addEventListener('click', function (e) {
  //avoid submitting
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    (amount > 0) &
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    //adding movements
    currentAccount.movements.push(amount);
    //updating UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';

  console.log(`Request granted : ${amount}`);
});

//-------close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = '0';
    console.log('Delete');
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    // labelWelcome.textContent = `Log in to your account`;
  }
});

//--------sorting technique
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted); //like toggling
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//note uncomment later
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
//note working with arrays date [ 08 - 02 - 2024 @ 6:30 am]


//REVERSE
let arr = ['a','b','c','d','e','f'];
let arr2 = ['j','i','h','g','f'];
console.log(arr.reverse());  //mutate original array

//CONCAT
const letters = arr.concat(arr2);
console.log(arr);//doesn't mutate
console.log(letters);

//JOIN
console.log(letters.join('-'));

//ES 2022
//new at method

const ar =[23,11,64]; 
//below both same
console.log(ar[0]); 
console.log(ar.at(0));

//note
//traditional way of getting last element
console.log(ar[ar.length-1]);
console.log(ar.slice(-1)[0]);
//using at method
console.log(ar.at(-1));

*/

///note---------for each method [ date 08 - 02 - 2024 @ 6:30 pm]

// const movements = [200, 450, -400, 3000, -650, -130, 0, 70, 1300];
// //for of
// console.log('Using For of Loop');
// for (const [i,movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i}: You deposited : ${movement}`);
//   } else if (movement < 0) {
//     console.log(`Movement ${i}: You withdrew : ${Math.abs(movement)}`);
//   } else {
//     console.log(`No transaction`);
//   }
// }

// //for each method on arrays
// //note note In for each loop , break and continue doesn't work
// console.log('\n Using forEach');
// //note pass argument as the element,index,array in same order
// movements.forEach(function (mov,i,arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited : ${mov}`);
//   } else if (mov < 0) {
//     console.log(`Movement ${i}: You withdrew : ${Math.abs(mov)}`);
//   } else {
//     console.log(`No transaction`);
//   }
// });

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//Map
currencies.forEach(function (value, index, currencies) {
  console.log(`${index} : ${value}`);
});

//SET
//note - no key for set values
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value} : ${value}`);
});


*/
//coding challenge #1
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];

const checkDogs = function (dogs1, dogs2) {
  //task 1
  const newdogs1 = dogs1.slice(1).slice(0, -2);
  console.log(newdogs1);
  //task 2
  const both = [...newdogs1, ...dogs2];
  console.log('Both :', both);
  //task 3
  both.forEach(function (age, no, both) {
    console.log(
      `Dog number ${no + 1} is ${
        age >= 3 ? `an adult and is ${age} years old` : `still a puppy`
      }`
    );
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//note --------------Data transformations map,filter,reduce date [ 09 - 02 - 2024 ]

//note MAP - returns an array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementstoUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementstoUSD);

*/
/*
//note------- filter method
// to filter elements that satisfy conditions to a new array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

const deposits = movements.filter(function(mov){
  return mov>0;
});
console.log("Only deposits",deposits);

const withdrawals = movements.filter(function(mov){
  return mov<0;
});
console.log(withdrawals);

const owith = withdrawals.map(mov=>Math.abs(mov));

console.log(owith);
*/

/*
//note --reduce method
//-- to boil down all the values in an array to  a single value

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//accumulator is  a snowball that gets added or reduced according to the values of array.
const balance = movements.reduce(function (acc, mov, i, arr) {
  return acc + mov;
}, 0);
console.log(
  'Bank balance after calculating deposits and withdrawals : ',
  balance
);

//another stuff using reduce
//max value of movements

//automatically generated
const maxValue = movements.reduce((a, b) => Math.max(a, b));
console.log('Max Value:', maxValue);

///////////////////////////////////////
// Coding Challenge #2

/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
//task - 1
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(function (age) {
    return age <= 2 ? 2 * age : 16 + age * 4;
  });
  return humanAge;
};

const avgHumanAge = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avgHumanAge);
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//task - 2
const dogs18 = avgHumanAge.filter(function (mov) {
  return mov >= 18;
});
console.log(`Human age dogs greater than 18 age : ${dogs18}`);

//avg human age for all dogs
const avg = dogs18.reduce(function (acc, age) {
  return acc + age;
}, 0);

console.log(avg / dogs18.length);

//note----find method
//returns first withdrawal that satisfies the condition.
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc=>acc.owner==='Jessica Davis');
console.log(account);

//using for of method
for(const account of accounts){
  if(account.owner==='Jessica Davis'){
    console.log(account);
  }
}
*/

/*

//note some method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

//some method
//true if any value greater than any value like 500
const anyDeposits = movements.some(mov => mov > 500);
console.log(anyDeposits);

//note every -- if all the elements passed the text
const elements = [2, 4, 5, 6, 7];
//check if all the elements are greater than 1 using every method
const anyValue = elements.every(elem => elem > 1);
console.log(anyValue);

//separate callback

const deposit = mov => mov > 1;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//[] a truthy value
if ([]) console.log('hello');
else {
  console.log('bye');
}

//flat method
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); //no callbacks

//flatMap method
const deepArr = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(deepArr.flat(2)); //here 2 is the depth

//Bank need to calculate the whole balance of the accounts
//flat
const accountMovements = accounts.map(acc => acc.movements);
console.log(
  accountMovements.flat().reduce(function (acc, mov) {
    return acc + mov;
  }, 0)
);

//flatmap -- just watch later

//-----sort mehod
//mutates original array
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// in numbers
console.log(movements);
console.log(movements.sort());

//a- current value, b- next value
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
});

// console.log([82,4,1,6,22].sort((a,b)=>a-b)); //ascending order
// console.log([82,4,1,6,22].sort((a,b)=>b-a)); //descending order
*/


//note---date [ 11 - 02 - 2024 ]
//More ways of creating and filling arrays
// console.log(new Array(5)); //does not create array with single element 5,instead 5 empty spaced array

const ar=[1,2,3,5,6];
// console.log(ar);

//Array.from -- creating arrays programatically
const newArr= Array.from({length:7},()=>1);
console.log(newArr);


//Real use case 


labelBalance.addEventListener('click',function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
  console.log(movementsUI);

});
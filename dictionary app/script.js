console.log("hello world");
let word1 = document.getElementById("word1");
let userInput = document.getElementById("user-input");
const getBtn = document.getElementById("get-button");
let desWord = document.getElementById("des-word");
let desMeaning = document.getElementById("des-meaning");
let desPhonetic = document.getElementById("des-phonetic");
let desPronounce = document.getElementById("des-pronounciation");
let desPro = document.getElementById("des-pro");
let UserInput;
// error
const errorMsg = document.getElementById("error-msg");
const errorDiv = document.getElementById("error-div");
const errorCloseBtn = document.getElementById("close-error");

//error raise

const renderError = function (msg) {
  errorDiv.classList.toggle("hidden");
  errorMsg.textContent = msg;
};

const clearInput = function () {
  userInput.value =
    word1.textContent =
    desWord.textContent =
    desMeaning.textContent =
    desPhonetic.textContent =
    desPronounce.src =
      "";
};

const getDescription = async function (word) {
  try {
    const response =
      await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}

`);
    console.log("response : ", response);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Word not found");
      } else {
        throw new Error("Fetch error");
      }
    }

    const [data] = await response.json();

    if (data.length == 0) {
      throw new Error("Word not found");
    }

    const meanings = await data.meanings;
    const [mean] = meanings;

    const meaning = mean.definitions[0].definition;

    const phonetic = data.phonetic;
    const [phoneticsObj] = data.phonetics;
    const pronounce = phoneticsObj?.audio;
    // ===================
    word1.textContent = data.word;
    desWord.textContent = data.word; //word
    desMeaning.textContent = meaning; //meaning
    desPhonetic.textContent = phonetic ? phonetic : "Phonetics not found"; //phonetic
    if (pronounce === "") {
      desPronounce.src = "";
    } else {
      desPronounce.src = pronounce ? pronounce : "";
    }
  } catch (err) {
    console.log(err);
    renderError(err.message);
  }
};

//Event handling
//Error box close button event handling
errorCloseBtn.addEventListener("click", function () {
  errorDiv.classList.toggle("hidden");
  clearInput();
});

//get description Button event handling
getBtn.addEventListener("click", function () {
  UserInput = userInput.value;

  if (OnlyString(UserInput)) {
    setTimeout(function () {
      word1.textContent = "Fetching data...Please Wait";
    });
    getDescription(UserInput);
    clearInput();
  } else {
    renderError("Enter only strings!");
  }
});

// function testing only strings
function OnlyString(input) {
  // Regular expression to match only letters (case-insensitive)
  const regex = /^[A-Za-z]+$/;

  // Test if the input string matches the regular expression
  return regex.test(input);
}

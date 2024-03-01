const dateBtn = document.getElementById("date-btn");
const addBtn = document.getElementById("add-btn");
const overlayDate = document.querySelector(".overlay-date");
const dateSelected = document.querySelector("#date");
const closeBtns = document.querySelectorAll(".close-btn");
const lists = document.querySelector(".lists");
const noOfTasks = document.getElementById("noOfTasks");
const inputTodo = document.getElementById("input-todo");
let taskCount = 0;
let currentDate;


//funtions===========================

const getTodoValue = function () {
  const todovalue = inputTodo.value;
  return todovalue;
};

const getDate = function () {
  return dateSelected.value;
};
const renderList = function (input, date) {
  const html = `<li class="details">
          <p class="task">${input}</p>
          <span class="target-date">${date}</span>
          <span><button class="close-btn">&times;</button></span>
        </li>`;

  lists.insertAdjacentHTML("afterbegin", html);
};




//Event listeners


// overlay date button==============================
dateBtn.addEventListener("click", function () {
  overlayDate.classList.toggle("hidden");
});

// addbutton =======================================
addBtn.addEventListener("click", function () {
  if (dateSelected.value !== "" && inputTodo.value!=="" ) {
    document.querySelector(".overlay-date").classList.toggle("hidden");

    const input = getTodoValue();
    const date = getDate();
    overlayDate.classList.add('hidden');

    currentDate = new Date();
    const targetDate = new Date(date);

    console.log(currentDate);
    console.log(targetDate);

    if (targetDate < currentDate) {
      alert("select future date.....");
      inputTodo.value = "";
    } else {
      renderList(input, date);

      inputTodo.value = "";
      taskCount++;
      noOfTasks.textContent = taskCount;
      console.log("total tasks = ", taskCount);
    }
  }
});



//event delegation method
lists.addEventListener("click", function (e) {
  const btn = e.target;
  //   console.log(btn);
  if (btn.classList.contains("close-btn")) {
    const list = btn.closest("li");
    list.remove();
    taskCount--;
    taskCount = taskCount < 0 ? 0 : taskCount;
    noOfTasks.textContent = taskCount;

    console.log("total tasks = ", taskCount);
  }
});



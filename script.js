// --------------------------------------------------
// LOAD SAVED TODOS FROM THE BROWSER STORAGE
// --------------------------------------------------

// localStorage can only store strings.
// So when we saved the todos earlier, we converted the array into a string using JSON.stringify().

// Here we do the opposite:
// 1. We retrieve the string from localStorage
// 2. We convert it back into a real JavaScript array using JSON.parse()

// If nothing exists in storage yet, localStorage.getItem("todos") returns null.
// The || [] means: "if null, use an empty array instead."

let todos = JSON.parse(localStorage.getItem("todos")) || [];


// --------------------------------------------------
// CONNECT JAVASCRIPT TO HTML ELEMENTS
// --------------------------------------------------

// These lines grab elements from the HTML page so JavaScript can interact with them.

const addBtn = document.getElementById("addBtn");     // Button that adds a new task
const todoInput = document.getElementById("todoInput"); // Text input where the user types tasks
const todoList = document.getElementById("todoList");   // The <ul> element where tasks will appear

const taskCounter = document.getElementById("taskCounter");

// --------------------------------------------------
// FUNCTION: RENDER TODOS ON THE SCREEN
// --------------------------------------------------

// This function rebuilds the visible list of tasks every time something changes.
// We call this function when:
// - the page loads
// - a task is added
// - a task is deleted
// - a task is marked completed

function renderTodos() {

  console.log("Rendering todos:", todos);

  todoList.innerHTML = "";

  // Clear the list before rebuilding it.
  // If we didn't do this, tasks would duplicate every time render runs.

  todoList.innerHTML = "";


  function updateCounter() {
    const remaining = todos.filter(t => !t.completed).length;
    taskCounter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
  }



  // Loop through every task inside the todos array
  // The variable "i" represents the index (position) of the current task

  for (let i = 0; i < todos.length; i++) {


    // --------------------------------------------------
    // CREATE A NEW LIST ITEM FOR THE TASK
    // --------------------------------------------------

    const li = document.createElement("li");

    // Each todo is now an object like:
    // { text: "Buy milk", completed: false }

    // So we access the text using .text

    li.textContent = todos[i].text;



    // --------------------------------------------------
    // IF TASK IS COMPLETED → STYLE IT DIFFERENTLY
    // --------------------------------------------------

    // If the completed property is true,
    // we visually show that by crossing out the text

    if (todos[i].completed) {

      li.style.textDecoration = "line-through"; // strike-through effect
      li.style.color = "gray";                   // dim the color
    }



    // --------------------------------------------------
    // CLICKING THE TASK TOGGLES COMPLETED STATE
    // --------------------------------------------------

    // When the user clicks the text:
    // true becomes false
    // false becomes true

    li.addEventListener("click", function () {

      // ! means "not"
      // So this flips the boolean value

      todos[i].completed = !todos[i].completed;

      // After modifying the array, we save it again

      localStorage.setItem("todos", JSON.stringify(todos));

      // Then we redraw the UI

      renderTodos();

    });



    // --------------------------------------------------
    // CREATE DELETE BUTTON
    // --------------------------------------------------

    const deleteBtn = document.createElement("button");

    // This text appears on the button

    deleteBtn.textContent = "X";



    // --------------------------------------------------
    // DELETE BUTTON CLICK EVENT
    // --------------------------------------------------

    // When the delete button is clicked:
    // we remove the task from the array

    // We wrap the listener in an IIFE to capture the correct index

    ((index) => {

      deleteBtn.addEventListener("click", function (event) {

        // stopPropagation prevents the click
        // from triggering the li click event (toggle completed)

        event.stopPropagation();

        // Remove one item from the array at position "index"

        todos.splice(index, 1);

        // Save the updated array to localStorage

        localStorage.setItem("todos", JSON.stringify(todos));

        // Redraw the list without the deleted task

        renderTodos();

      });

    })(i);



    // --------------------------------------------------
    // ADD DELETE BUTTON TO THE LIST ITEM
    // --------------------------------------------------

    li.appendChild(deleteBtn);



    // --------------------------------------------------
    // ADD THE LIST ITEM TO THE PAGE
    // --------------------------------------------------

    todoList.appendChild(li);

  }

  updateCounter();
}



// --------------------------------------------------
// ADD BUTTON CLICK EVENT
// --------------------------------------------------

addBtn.addEventListener("click", function () {

  // Get text typed by the user

  const text = todoInput.value;



  // Prevent adding empty tasks
  // trim() removes extra spaces

  if (text.trim() === "") return;



  // --------------------------------------------------
  // ADD NEW TASK TO THE ARRAY
  // --------------------------------------------------

  // Instead of pushing a string, we push an object

  todos.push({
    text: text,
    completed: false
  });



  // Save updated array to browser storage

  localStorage.setItem("todos", JSON.stringify(todos));



  // Update the screen

  renderTodos();



  // Clear the input field so user can type another task

  todoInput.value = "";

});



// --------------------------------------------------
// ENTER KEY SUPPORT
// --------------------------------------------------

// This allows the user to press ENTER instead of clicking the Add button

todoInput.addEventListener("keypress", function (event) {

  if (event.key === "Enter") {

    // Trigger the same action as clicking the button

    addBtn.click();

  }

});



// --------------------------------------------------
// INITIAL RENDER WHEN PAGE LOADS
// --------------------------------------------------

// This draws the todos stored in localStorage
// as soon as the page opens.

renderTodos()
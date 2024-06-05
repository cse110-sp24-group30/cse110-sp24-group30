window.addEventListener("DOMContentLoaded", init);

//Initialization which calls all the other functions
function init() {

  const addButtonNotStarted = document.querySelector(
    ".new-task-button-not-started"
  );

  const addButtonInProgress = document.querySelector(
    ".new-task-button-in-progress"
  );

  addButtonNotStarted.addEventListener("click", () =>
    addTask(false, 1)
  );

  
  addButtonInProgress.addEventListener("click", () =>
    addTask(false, 2)
  );

  // Add saved tasks for Not Started and In Progress from localStorage
  addTask(true);

  //Updating the display count of tasks in the respective columns
  updateCount();
}

/**
 * Adds tasks to the respective NotStarted and InProgress columns and
 * loads them if they already exist in localStorage depending on the category flag.
 * 
 * @param {boolean} existing - If true, loads tasks from localStorage.
 * @param {number} [category] - The column of the task (1 for Not Started, 2 for In Progress).
 */
function addTask(existing, category) {
  
  const notStartedList = getNotStarted();
  const inProgressList = getInProgress();

  //Getting today's date as a placeholder in the template for dueDate
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  //storing the date in string format so it can be understood by the user
  let currentDate = `${month}-${day}-${year}`;

  //TODO: Random word generation for the display title so that the user knows which task just created
  //Template for a task created with default values for all fields
  const toDoTemplate = {
    id: Math.floor(Math.random() * 2000000),
    title: "Default Title",
    dueDate: `${currentDate}`,
    label: "self",
  };

  //if true, then loads the previously created tasks from localStorage for Not Started and In Progress column
  //else it adds a new task to the DOM and updates localStorage accordingly by checking the category tag
  if (existing) {
    notStartedList.forEach((notStarted) => {
      createToDoElement(
        notStarted.id,
        notStarted.title,
        notStarted.dueDate,
        notStarted.label,
        1
      );
    });

    inProgressList.forEach((inProgress) => {
      createToDoElement(
        inProgress.id,
        inProgress.title,
        inProgress.dueDate,
        inProgress.label,
        2
      );
    });
  } else {
    createToDoElement(
      toDoTemplate.id,
      toDoTemplate.title,
      toDoTemplate.dueDate,
      toDoTemplate.label,
      category
    );

    const toDoElement = document.createElement("div");
    if (category === 1) {
      notStartedList.push(toDoTemplate);
      saveNotStarted(notStartedList);
      toDoElement.classList.add("not-started");
    } else if (category === 2) {
      inProgressList.push(toDoTemplate);
      saveInProgress(inProgressList);
      toDoElement.classList.add("in-progress");
    }

    //need to update count as we added new tasks
    updateCount();
  }
}

/**
 * Creates a task element in the DOM.
 * 
 * @param {number} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} label - The label of the task like self/work/school/other.
 * @param {number} category - The column of the task (1 for Not Started, 2 for In Progress).
 * 
 * @return {string} - The ID of the created task element.
 */
function createToDoElement(id, title, dueDate, label, category) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.setAttribute("task-id", id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "radio-button";

  const taskTitle = document.createElement("p");
  taskTitle.textContent = `${title}`;

  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");

  const categorySelect = document.createElement("select");
  categorySelect.id = "category-select";

  const categories = ["self", "work", "school", "other"];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === `${label}`) {
      option.selected = true;
    }
    categorySelect.appendChild(option);
  });

  //updating color so that it is consistent with the newly selected option
  updateCategoryColor(categorySelect);

  categorySelect.addEventListener("change", (event) => {
    updateCategoryColor(event.target);
    updateTaskLabel(id, event.target.value, category);
  });

  categoryDiv.appendChild(categorySelect);

  const dueDateSpan = document.createElement("span");
  dueDateSpan.id = "due-date";
  dueDateSpan.textContent = `Due Date: ${dueDate}`;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");

  const editButton = document.createElement("button");
  editButton.id = "edit-button";
  editButton.textContent = "Edit Button";

  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-button";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", () => {
    taskDiv.remove();
    removeTask(id, category);
  });

  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(deleteButton);

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskTitle);
  taskDiv.appendChild(categoryDiv);
  taskDiv.appendChild(dueDateSpan);
  taskDiv.appendChild(buttonsDiv);

  const notStarted = document.getElementById("not-started-list");
  const inProgress = document.getElementById("in-progress-list");

  if (category === 1) {
    notStarted.appendChild(taskDiv);
  } else if (category === 2) {
    inProgress.appendChild(taskDiv);
  }

  return taskDiv.id;
}

/**
 * Updates the background color of the task based on the label selected.
 * 
 * @param {HTMLElement} selectElement - The select element whose background color is to be updated.
 */
function updateCategoryColor(selectElement) {
  const category = selectElement.value;
  
  const categoryColors = {
    self: "orange",
    work: "blue",
    school: "green",
    other: "purple",
  };

  //updates the color based on the specified array, otherwise goes to default to avoid error
  selectElement.style.backgroundColor = categoryColors[category] || "orange";
}

/**
 * Updates the label of a task in localStorage.
 * 
 * @param {number} id - The ID of the task to update.
 * @param {string} newLabel - The new label of the task.
 * @param {number} category - The column of the task (1 for Not Started, 2 for In Progress).
 */
function updateTaskLabel(id, newLabel, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else {
    taskList = getInProgress();
  }

  //finds index of the task based on the localStorage id
  const taskIndex = taskList.findIndex((task) => task.id === id);

  //checks for valid index, if valid then updates the newly selected label in the localStorage for that element
  if (taskIndex > -1) {
    taskList[taskIndex].label = newLabel;
    if (category === 1) {
      saveNotStarted(taskList);
    } else {
      saveInProgress(taskList);
    }
  }
}

/**
 * Removes a task from the specified column array in localStorage.
 * 
 * @param {number} id - The ID of the task to remove.
 * @param {number} category - The column of the task (1 for Not Started, 2 for In Progress).
 */
function removeTask(id, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else {
    taskList = getInProgress();
  }

  //finds index of the task based on the localStorage id
  const taskIndex = taskList.findIndex((task) => task.id === id);

  //check if we get a valid index, if its valid then removes that element from the specified localStorage array
  if (taskIndex > -1) {
    taskList.splice(taskIndex, 1);
    if (category === 1) {
      saveNotStarted(taskList);
    } else {
      saveInProgress(taskList);
    }
  }

  //updating count because remove from localStorage, need to update display
  updateCount();
}

//Updates the counts of tasks in the Not Started, In Progress, and Done categories.
function updateCount() {
  const numNotStarted = document.getElementById("num-not-started");
  numNotStarted.innerText = getNotStarted().length;

  const numInProgress = document.getElementById("num-in-progress");
  numInProgress.innerText = getInProgress().length;

  const numDone = document.getElementById("num-done");
  numDone.innerText = getDone().length;
}

//Get all the notStarted entries from localStorage
function getNotStarted() {
  return JSON.parse(localStorage.getItem("not-started") || "[]");
}

// Saves all notStarted array to localStorage
function saveNotStarted(notStarted) {
  localStorage.setItem("not-started", JSON.stringify(notStarted));
}

// Get all the inProgress entries from localStorage
function getInProgress() {
  return JSON.parse(localStorage.getItem("in-progress") || "[]");
}

// Saves all inProgress array to localStorage
function saveInProgress(inProgress) {
  localStorage.setItem("in-progress", JSON.stringify(inProgress));
}

// Get all the done entries from localStorage
function getDone() {
  return JSON.parse(localStorage.getItem("done") || "[]");
}

// Saves all done array to localStorage
function saveDone(done) {
  localStorage.setItem("done", JSON.stringify(done));
}

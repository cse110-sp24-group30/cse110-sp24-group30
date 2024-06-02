window.addEventListener("DOMContentLoaded", init);

//Initialization which calls all the other functions
function init() {
  const toDoContainer = document.getElementById("list-container");
  const addButtonNotStarted = document.querySelector(
    ".new-task-button-not-started"
  );
  const addButtonInProgress = document.querySelector(
    ".new-task-button-in-progress"
  );

  addButtonNotStarted.addEventListener("click", () =>
    addTask(toDoContainer, false, 1)
  );
  console.log("clicked addbutton not started");
  addButtonInProgress.addEventListener("click", () =>
    addTask(toDoContainer, false, 2)
  );
  console.log("clicked addbutton in progress");

  // Add saved tasks for Not Started and In Progress from localStorage
  addTask(toDoContainer, true);

  updateCount();
}

function addTask(toDoContainer, existing, category) {
  console.log("add task");
  const notStartedList = getNotStarted();
  const inProgressList = getInProgress();
  let toDoID = 0;

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${month}-${day}-${year}`;

  const toDoTemplate = {
    id: Math.floor(Math.random() * 2000000),
    title: "Default Title",
    dueDate: `${currentDate}`,
    label: "self",
  };

  if (existing) {
    console.log("existing");
    notStartedList.forEach((notStarted) => {
      toDoID = createToDoElement(
        notStarted.id,
        notStarted.title,
        notStarted.dueDate,
        notStarted.label,
        1
      );
    });

    inProgressList.forEach((inProgress) => {
      toDoID = createToDoElement(
        inProgress.id,
        inProgress.title,
        inProgress.dueDate,
        inProgress.label,
        2
      );
    });
  } else {
    console.log("not existing");
    toDoID = createToDoElement(
      toDoTemplate.id,
      toDoTemplate.title,
      toDoTemplate.dueDate,
      toDoTemplate.label,
      category
    );

    const toDoElement = document.createElement("div");
    if (category === 1) {
      console.log("category 1");
      notStartedList.push(toDoTemplate);
      saveNotStarted(notStartedList);
      toDoElement.classList.add("not-started");
    } else if (category === 2) {
      console.log("category 2");
      inProgressList.push(toDoTemplate);
      saveInProgress(inProgressList);
      toDoElement.classList.add("in-progress");
    }

    updateCount();
  }
}

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

function updateCategoryColor(selectElement) {
  const category = selectElement.value;
  const categoryColors = {
    self: "orange",
    work: "blue",
    school: "green",
    other: "purple",
  };

  selectElement.style.backgroundColor = categoryColors[category] || "orange";
}

function updateTaskLabel(id, newLabel, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else {
    taskList = getInProgress();
  }

  const taskIndex = taskList.findIndex((task) => task.id === id);

  if (taskIndex > -1) {
    taskList[taskIndex].label = newLabel;
    if (category === 1) {
      saveNotStarted(taskList);
    } else {
      saveInProgress(taskList);
    }
  }
}

function removeTask(id, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else {
    taskList = getInProgress();
  }

  const taskIndex = taskList.findIndex((task) => task.id === id);

  if (taskIndex > -1) {
    taskList.splice(taskIndex, 1);
    if (category === 1) {
      saveNotStarted(taskList);
    } else {
      saveInProgress(taskList);
    }
  }
  updateCount();
}

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

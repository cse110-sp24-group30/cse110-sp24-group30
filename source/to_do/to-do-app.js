window.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the application by setting up event listeners, loading saved tasks,
 * and configuring the drag and drop functionality.
 */
function init() {
  // JavaScript to handle the click event and redirection
  document.querySelectorAll('.nav-element').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        
        // Set a timeout to show the loading screen if the page takes too long
        const loadingTimeout = setTimeout(() => {
          document.getElementById('loadingScreen').style.display = 'flex';
      }, 500); // Show loading screen if the page doesn't start loading within 500ms

      // Store the href attribute
      const targetUrl = this.querySelector('a').getAttribute('href');  

      // Create a hidden iframe to detect when the page starts loading
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = targetUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        clearTimeout(loadingTimeout); // Clear the timeout if the page loads quickly
        window.location.href = targetUrl; // Proceed to the target URL
      };
    });
  });

  const addButtonNotStarted = document.querySelector(
    ".new-task-button-not-started"
  );

  const addButtonInProgress = document.querySelector(
    ".new-task-button-in-progress"
  );

  addButtonNotStarted.addEventListener("click", () => addTask(false, 1));

  addButtonInProgress.addEventListener("click", () => addTask(false, 2));

  // Add saved tasks for Not Started and In Progress from localStorage
  addTask(true);

  //Updating the display count of tasks in the respective columns
  updateCount();

  setupDragAndDrop();

  // Edit task modal elements
  const editTaskModal = document.getElementById("edit-task-modal");
  const closeBtn = document.querySelector(".close-button");
  const editTaskForm = document.getElementById("edit-task-form");

  // Event listener for closing the modal
  closeBtn.addEventListener("click", closeEditModal);
  window.addEventListener("click", function (event) {
    if (event.target === editTaskModal) {
      closeEditModal();
    }
  });

  // Handle form submission for editing a task
  editTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Getting the new values to be updated
    const id = parseInt(document.getElementById("edit-task-id").value);
    const title = document.getElementById("edit-task-title").value;
    const dueDate = document.getElementById("edit-task-due-date").value;
    const label = document.getElementById("edit-task-label").value;
    //getting the correct column category using the id of task
    const category = parseInt(
      document
        .querySelector(`[task-id='${id}']`)
        .parentElement.parentElement.parentElement.getAttribute("data-category")
    );

    updateTaskDetails(id, title, dueDate, label, category);
    closeEditModal();
  });
}

/**
 * Sets up the drag and drop functionality for the task columns and tasks.
 */
function setupDragAndDrop() {
  const taskColumns = document.querySelectorAll(".task-column");

  taskColumns.forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
  });

  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
  });
}

/**
 * Handles the drag start event for a task.
 *
 * @param {DragEvent} event - The drag event.
 */
function handleDragStart(event) {
  event.dataTransfer.setData(
    "text/plain",
    event.target.getAttribute("task-id")
  );
  event.currentTarget.style.opacity = "0.4";
}

/**
 * Handles the drag end event for a task.
 *
 * @param {DragEvent} event - The drag event.
 */
function handleDragEnd(event) {
  event.currentTarget.style.opacity = "1";
}

/**
 * Handles the drag over event for a task column.
 *
 * @param {DragEvent} event - The drag event.
 */
function handleDragOver(event) {
  event.preventDefault();
}

/**
 * Handles the drop event for a task column.
 *
 * @param {DragEvent} event - The drag event.
 */
function handleDrop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const taskElement = document.querySelector(`[task-id='${taskId}']`);
  const newCategory = event.currentTarget.getAttribute("data-category");
  const oldCategory =
    taskElement.parentElement.parentElement.parentElement.getAttribute(
      "data-category"
    );

  if (newCategory !== oldCategory) {
    addTaskBetweenLists(taskId, parseInt(oldCategory), parseInt(newCategory));
    updateCount();
    event.currentTarget.querySelector("list").appendChild(taskElement);
    location.reload();
  }
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
  const doneList = getDone();

  //Getting today's date as a placeholder in the template for dueDate
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  //storing the date in string format so it can be understood by the user
  let currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  //Template for a task created with default values for all fields
  const toDoTemplate = {
    id: Math.floor(Math.random() * 2000000),
    title: generateRandomTitle(),
    dueDate: `${currentDate}`,
    label: "personal",
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

    doneList.forEach((done) => {
      createToDoElement(done.id, done.title, done.dueDate, done.label, 3);
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

    //keeping the calendar in sync with task generation
    addEventToCalendar(toDoTemplate);
  }
}

/**
 * Creates a task element in the DOM.
 *
 * @param {number} id - The ID of the task.
 * @param {string} title - The title of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} label - The label of the task like personal/work/school/other.
 * @param {number} category - The column of the task (1 for Not Started, 2 for In Progress).
 *
 * @return {string} - The ID of the created task element.
 */
function createToDoElement(id, title, dueDate, label, category) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.setAttribute("task-id", id);
  taskDiv.setAttribute("draggable", "true");

  taskDiv.addEventListener("dragstart", handleDragStart);
  taskDiv.addEventListener("dragend", handleDragEnd);

  const taskTitle = document.createElement("p");
  taskTitle.textContent = `${title}`;

  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");

  const categorySelect = document.createElement("select");
  categorySelect.classList.add("category-select");
  categorySelect.id = `category-select-${id}`;

  const categories = ["personal", "work", "school", "other"];
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
    updateCalendarEvent(id, title, dueDate, event.target.value);
  });

  categoryDiv.appendChild(categorySelect);

  const dueDateSpan = document.createElement("span");
  dueDateSpan.id = "due-date";
  dueDateSpan.textContent = `Due Date: ${dueDate}`;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");

  let editButton;
  if (category === 1 || category === 2) {
    editButton = document.createElement("button");
    editButton.id = "edit-button";
    let editIcon = document.createElement("img");
    editIcon.src = "../assets/icons/editDarkBlue.png";
    editIcon.alt = "Edit Button";
    editButton.appendChild(editIcon);

    editButton.addEventListener("click", function (event) {
      const taskDiv = event.target.closest(".task");
      const taskId = taskDiv.getAttribute("task-id");
      const taskCategory = parseInt(
        taskDiv.closest(".task-column").getAttribute("data-category")
      );

      const task = getTaskById(taskId, taskCategory);
      openEditModal(task);
    });
  }

  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-button";
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "../assets/icons/trashDarkBlue.png";
  deleteIcon.alt = "Delete Button";
  deleteButton.appendChild(deleteIcon);

  deleteButton.addEventListener("click", () => {
    taskDiv.remove();
    removeTask(id, category);
  });

  if (category === 1 || category === 2) {
    buttonsDiv.appendChild(editButton);
  }
  buttonsDiv.appendChild(deleteButton);

  // to help organize the layout of tasks
  const firstRowDiv = document.createElement("div");
  firstRowDiv.classList = "first-row";
  firstRowDiv.appendChild(taskTitle);
  firstRowDiv.appendChild(categoryDiv);

  const secondRowDiv = document.createElement("div");
  secondRowDiv.classList = "second-row";
  secondRowDiv.appendChild(dueDateSpan);
  secondRowDiv.appendChild(buttonsDiv);

  taskDiv.appendChild(firstRowDiv);
  taskDiv.appendChild(secondRowDiv);

  const notStarted = document.getElementById("not-started-list");
  const inProgress = document.getElementById("in-progress-list");
  const done = document.getElementById("done-list");

  if (category === 1) {
    notStarted.appendChild(taskDiv);
  } else if (category === 2) {
    inProgress.appendChild(taskDiv);
  } else {
    done.appendChild(taskDiv);
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
    personal: "darkorange",
    work: "brown",
    school: "crimson",
    other: "purple",
  };

  //updates the color based on the specified array, otherwise goes to default to avoid error
  selectElement.style.backgroundColor =
    categoryColors[category] || "darkorange";
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
  } else if (category === 2) {
    taskList = getInProgress();
  } else {
    taskList = getDone();
  }

  //finds index of the task based on the localStorage id
  const taskIndex = taskList.findIndex((task) => task.id === id);

  //check if we get a valid index, if its valid then removes that element from the specified localStorage array
  if (taskIndex > -1) {
    taskList.splice(taskIndex, 1);
    if (category === 1) {
      saveNotStarted(taskList);
    } else if (category === 2) {
      saveInProgress(taskList);
    } else {
      saveDone(taskList);
    }
  }

  //updating count because remove from localStorage, need to update display
  updateCount();

  //need to update calendar on task deletion as well
  removeFromCalendar(id);
}

/**
 * Adds the task from the old column to new column after drop
 *
 * @param {number} id - The ID of the task.
 * @param {number} fromCategory - The current category of the task.
 * @param {number} toCategory - The new category of the task.
 */
function addTaskBetweenLists(id, fromCategory, toCategory) {
  let fromList;
  let toList;
  if (fromCategory === 1) {
    fromList = getNotStarted();
  } else if (fromCategory === 2) {
    fromList = getInProgress();
  } else {
    fromList = getDone();
  }

  //finds index of the task based on the localStorage id
  const taskIndex = fromList.findIndex((task) => task.id === parseInt(id));

  if (taskIndex > -1) {
    if (toCategory === 1) {
      toList = getNotStarted();
      toList.push(fromList[taskIndex]);
      saveNotStarted(toList);
    } else if (toCategory === 2) {
      toList = getInProgress();
      toList.push(fromList[taskIndex]);
      saveInProgress(toList);
    } else {
      toList = getDone();
      toList.push(fromList[taskIndex]);
      saveDone(toList);
    }
    removeTask(parseInt(id), parseInt(fromCategory));
  }
}

/**
 * Updates the count of tasks in each column.
 */
function updateCount() {
  const numNotStarted = document.getElementById("num-not-started");
  numNotStarted.innerText = getNotStarted().length;

  const numInProgress = document.getElementById("num-in-progress");
  numInProgress.innerText = getInProgress().length;

  const numDone = document.getElementById("num-done");
  numDone.innerText = getDone().length;
}

/**
 * Retrieves all the "not started" tasks from localStorage.
 *
 * @return {Object[]} An array of "not started" tasks.
 */
function getNotStarted() {
  return JSON.parse(localStorage.getItem("not-started") || "[]");
}

/**
 * Saves the "not started" tasks array to localStorage.
 *
 * @param {Object[]} notStarted - An array of "not started" tasks to be saved.
 */
function saveNotStarted(notStarted) {
  localStorage.setItem("not-started", JSON.stringify(notStarted));
}

/**
 * Retrieves all the "in progress" tasks from localStorage.
 *
 * @return {Object[]} An array of "in progress" tasks.
 */
function getInProgress() {
  return JSON.parse(localStorage.getItem("in-progress") || "[]");
}

/**
 * Saves the "in progress" tasks array to localStorage.
 *
 * @param {Object[]} inProgress - An array of "in progress" tasks to be saved.
 */
function saveInProgress(inProgress) {
  localStorage.setItem("in-progress", JSON.stringify(inProgress));
}

/**
 * Retrieves all the "done" tasks from localStorage.
 *
 * @return {Object[]} An array of "done" tasks.
 */
function getDone() {
  return JSON.parse(localStorage.getItem("done") || "[]");
}

/**
 * Saves the "done" tasks array to localStorage.
 *
 * @param {Object[]} done - An array of "done" tasks to be saved.
 */
function saveDone(done) {
  localStorage.setItem("done", JSON.stringify(done));
}

/**
 * Retrieves a task by its ID and category.
 *
 * @param {number} id - The ID of the task.
 * @param {number} category - The category of the task (1 for "Not Started", 2 for "In Progress", 3 for "Done").
 * @return {Object} The task with the specified ID and category.
 */
function getTaskById(id, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else if (category === 2) {
    taskList = getInProgress();
  } else {
    taskList = getDone();
  }

  return taskList.find((task) => task.id === parseInt(id));
}

/**
 * Opens the edit modal and populates it with the details of the specified task.
 *
 * @param {Object} task - The task to be edited.
 */
function openEditModal(task) {
  const editTaskModal = document.getElementById("edit-task-modal");
  document.getElementById("edit-task-title").value = task.title;
  document.getElementById("edit-task-due-date").value = task.dueDate;
  document.getElementById("edit-task-label").value = task.label;
  document.getElementById("edit-task-id").value = task.id;
  document.getElementById("edit-task-category").value = task.category;

  editTaskModal.style.display = "block";
}

/**
 * Updates the details of a task.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} title - The new title of the task.
 * @param {string} dueDate - The new due date of the task.
 * @param {string} label - The new label of the task.
 * @param {number} category - The category of the task (1 for "Not Started", 2 for "In Progress", 3 for "Done").
 */
function updateTaskDetails(id, title, dueDate, label, category) {
  let taskList;
  if (category === 1) {
    taskList = getNotStarted();
  } else if (category === 2) {
    taskList = getInProgress();
  } else {
    taskList = getDone();
  }

  // Updating the localStorage with new values
  const taskIndex = taskList.findIndex((task) => task.id === id);
  if (taskIndex > -1) {
    taskList[taskIndex].title = title;
    taskList[taskIndex].dueDate = dueDate;
    taskList[taskIndex].label = label;

    if (category === 1) {
      saveNotStarted(taskList);
    } else if (category === 2) {
      saveInProgress(taskList);
    } else {
      saveDone(taskList);
    }

    // Updating the display
    const taskElement = document.querySelector(`.task[task-id='${id}']`);
    taskElement.querySelector("p").textContent = title;
    taskElement.querySelector("#due-date").textContent = `Due Date: ${dueDate}`;
    const categorySelect = taskElement.querySelector(`#category-select-${id}`);
    categorySelect.value = label;
    updateCategoryColor(categorySelect);

    //Need to keep calendar in sync with the latest changes from todo
    updateCalendarEvent(id, title, dueDate, label);
  }
}

/**
 * Closes the edit modal.
 */
function closeEditModal() {
  const editTaskModal = document.getElementById("edit-task-modal");
  editTaskModal.style.display = "none";
}

/**
 * Retrieves events from localStorage.
 * @returns {Array} The list of events stored in localStorage.
 */
function getEvents() {
  return JSON.parse(localStorage.getItem("events") || "[]");
}

/**
 * Saves events to localStorage.
 * @param {Array} events - The list of events to be saved.
 */
function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

/**
 * Adds a task from todo widget to the calendar.
 * @param {Object} eventAdd - The task to be added. Parameter is named eventAdd because calendar has events
 * @param {string} eventAdd.id - The ID of the event.
 * @param {string} eventAdd.title - The title of the event.
 * @param {string} eventAdd.label - The category label of the event.
 * @param {string} eventAdd.dueDate - The due date of the event.
 */
function addEventToCalendar(eventAdd) {
  const eventTemplate = {
    id: eventAdd.id,
    title: `${eventAdd.title}`,
    category: `${eventAdd.label}`,
    date: `${eventAdd.dueDate}`,
    time: "",
    description: "",
  };

  const events = getEvents();
  const eventIndex = events.findIndex((event) => event.id === eventAdd.id);

  if (eventIndex <= -1) {
    events.push(eventTemplate);
  }

  saveEvents(events);
}

/**
 * Updates an existing event(task) in the calendar.
 * @param {string} id - The ID of the event to update.
 * @param {string} title - The new title of the event.
 * @param {string} dueDate - The new due date of the event.
 * @param {string} label - The new category label of the event.
 */
function updateCalendarEvent(id, title, dueDate, label) {
  let events = getEvents();
  const eventIndex = events.findIndex((event) => event.id === id);

  if (eventIndex > -1) {
    events[eventIndex].title = title;
    events[eventIndex].date = dueDate;
    events[eventIndex].category = label;
    saveEvents(events);
  }
}

/**
 * Removes an event from the calendar.
 * @param {string} id - The ID of the event to remove.
 */
function removeFromCalendar(id) {
  let events = getEvents();
  events = events.filter((event) => event.id !== id);
  saveEvents(events);
}

/**
 * Generates a random title from a predefined list of titles.
 * @returns {string} A randomly selected title.
 */
function generateRandomTitle() {
  const todoListTitles = [
    "Grocery Shopping",
    "Finish Project Report",
    "Schedule Doctor Appointment",
    "Clean the Garage",
    "Prepare Presentation Slides",
    "Call the Electrician",
    "Update Resume",
    "Plan Weekend Getaway",
    "Pay Utility Bills",
    "Water the Plants",
    "Organize Closet",
    "Write Blog Post",
    "Renew Library Books",
    "Send Birthday Card",
    "Backup Computer Files",
    "Attend Yoga Class",
    "Review Monthly Budget",
    "Wash the Car",
    "Buy Office Supplies",
    "Meal Prep for the Week",
    "Respond to Emails",
    "Walk the Dog",
    "Finish Reading Book",
    "Order Prescription Refill",
    "Make Dentist Appointment",
    "Prepare Tax Documents",
    "Fix Leaky Faucet",
    "Update Software",
    "Create Fitness Plan",
    "Visit the Post Office",
    "Plan Family Dinner",
    "Research Investment Options",
    "Book Hotel for Vacation",
    "Write Thank You Notes",
    "Declutter Desk",
    "Complete Online Course",
    "Recycle Old Electronics",
    "Host Dinner Party",
    "Volunteer at Local Shelter",
    "Attend Networking Event",
  ];

  const randomIndex = Math.floor(Math.random() * todoListTitles.length);
  return todoListTitles[randomIndex];
}

window.addEventListener('DOMContentLoaded', init);

function init() {
    const toDoContainer = document.getElementById('list-container');
    const addButtonNotStarted = document.querySelector('.new-task-button-not-started');
    const addButtonInProgress = document.querySelector('.new-task-button-in-progress');
    const overlayRef = document.getElementById('overlay');
    const modalRef = document.getElementById('modal');


    addButtonNotStarted.addEventListener('click', () => addTask(toDoContainer, false, 1));
    console.log("clicked addbutton not started");
    addButtonInProgress.addEventListener('click', () => addTask(toDoContainer, false, 2));
    console.log("clicked addbutton in progress");

    // When a user clicks "out" of the journal content/popup, it closes it
    overlayRef.addEventListener('click', () => {
        overlayRef.style.display = 'none';
        modalRef.style.display = 'none';
    });

    // Add saved journals from localStorage
    addTask(toDoContainer, true);
}

function addTask(toDoContainer, existing, category) {
    console.log("add task");
    const toDoList = [];
    //const toDoList = getToDos();
    let toDoID = 0;
    
    const toDoTemplate = {
        id: Math.floor(Math.random() * 2000000),
        title: "Default Title",
        dueDate: "",
    };

    if (existing) {
        console.log("existing")
        toDoList.forEach(toDo => {
            toDoID = createToDoElement(toDo.id, toDo.title, toDo.dueDate, toDoContainer);
        });
    }
    else {
        console.log("not existing")
        toDoID = createToDoElement(toDoTemplate.id, toDoTemplate.title, toDoTemplate.dueDate, category);
        toDoList.push(toDoTemplate);
        //saveToDos(toDoList);

        const toDoElement = document.createElement('div');
        if(category === 1) {
            console.log("category 1")
            toDoElement.classList.add('not-started');
        }
        else if(category === 2) {
            console.log("category 2")
            toDoElement.classList.add('in-progress');
        }

        toDoElement.taskTitle = "Placeholder title";
        toDoElement.taskDueDate = "Placeholder date";
        toDoElement.setAttribute('task-id', toDoID);
    }
    
}

function createToDoElement(id, title, dueDate, category) {
    
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'radio-button';

    const taskTitle = document.createElement('p');
    taskTitle.textContent = 'Todo List Canvas';

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');

    const categoryP = document.createElement('p');
    categoryP.id = 'school-category';
    categoryP.textContent = 'school';

    categoryDiv.appendChild(categoryP);

    const dueDateSpan = document.createElement('span');
    dueDateSpan.id = 'due-date';
    dueDateSpan.textContent = 'Due Date: 5/31';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const editButton = document.createElement('button');
    editButton.id = 'edit-button';
    editButton.textContent = 'Edit Button';

    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-button';
    deleteButton.textContent = 'Delete';

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskTitle);
    taskDiv.appendChild(categoryDiv);
    taskDiv.appendChild(dueDateSpan);
    taskDiv.appendChild(buttonsDiv);

    const notStarted = document.getElementById('not-started-list');
    const inProgress = document.getElementById('in-progress-list');

    if (category === 1) {
        notStarted.appendChild(taskDiv);
    } else if (category === 2) {
        inProgress.appendChild(taskDiv);
    }

    return taskDiv.id;
}

// TO DO: Local storage     
/*
function getToDos() {
    return JSON.parse(localStorage.getItem("to-do-list") || "[]");
}

function saveToDos(toDos){
    localStorage.setItem("to-do-list", JSON.stringify(toDos));
}
*/

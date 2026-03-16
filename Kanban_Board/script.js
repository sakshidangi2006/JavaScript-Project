let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;

// Utility: Create a Task
function createTask(title, desc, column) {

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    column.appendChild(div);

    // Drag start
    div.addEventListener("dragstart", () => {
        dragElement = div;
    });

    // Delete task
    div.querySelector(".delete-btn").addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });
}

// Load Tasks from LocalStorage
if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            createTask(task.title, task.disc, column);
        });
    }
    updateTaskCount();
}

// Update Task Counter + Save
function updateTaskCount() {

    [todo, progress, done].forEach((col) => {

        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        // Save tasks in tasksData
        tasksData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").innerText,
            disc: t.querySelector("p").innerText
        }));

        count.innerText = tasks.length;
    });

    // Save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// Drag and Drop Columns
function addDragEventsOnColumns(column) {

    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();

        if (dragElement) {
            column.appendChild(dragElement);
        }

        column.classList.remove("hover-over");

        updateTaskCount();
    });
}

// Add drag events to all columns
addDragEventsOnColumns(todo);
addDragEventsOnColumns(progress);
addDragEventsOnColumns(done);

// Modal Elements
const toggleModalBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const addNewTaskBtn = document.querySelector("#add-new-task");
const modalBg = document.querySelector(".modal .bg");

// Open modal
toggleModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
});

// Close modal by clicking background
modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Add New Task
addNewTaskBtn.addEventListener("click", () => {

    const taskTitle = document.querySelector("#task-title-input").value.trim();
    const taskDesc = document.querySelector("#task-description-input").value.trim();

    if (!taskTitle) return alert("Task title cannot be empty.");

    createTask(taskTitle, taskDesc, todo);

    updateTaskCount();

    modal.classList.remove("active");

    // Clear modal inputs
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-description-input").value = "";
});

// Optional: Press Enter to Add Task
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && modal.classList.contains("active")) {
        addNewTaskBtn.click();
    }
});
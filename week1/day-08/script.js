"use strict";
// ============================================
// TYPES
// ============================================
// ============================================
// DOM ELEMENTS
// ============================================
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const highPriorityTasks = document.getElementById("highPriorityTasks");
const addTaskButton = document.getElementById("addTaskButton");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
// ============================================
// PRIORITY CONFIGURATION
// ============================================
const priorityPoints = {
    low: 5,
    medium: 10,
    high: 20
};
// ============================================
// STATE
// ============================================
let tasks = [];
// ============================================
// SAMPLE DATA
// ============================================
tasks = [
    {
        id: 1,
        title: "Learn TypeScript",
        description: "Practice utility types and type guards.",
        priority: "high",
        status: "pending",
        createdAt: "25-09-2026"
    },
    {
        id: 2,
        title: "Build Task Board",
        description: "Create a type-safe frontend application.",
        priority: "medium",
        status: "pending",
        createdAt: "25-09-2026"
    },
    {
        id: 3,
        title: "Review Git",
        description: "Practice feature branches and commits.",
        priority: "low",
        status: "completed",
        createdAt: "24-09-2026"
    }
];
// ============================================
// TYPE-SAFE FUNCTIONS
// ============================================
function createTask(data) {
    const newTask = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "pending",
        createdAt: getToday()
    };
    return newTask;
}
function updateTask(id, changes) {
    const task = tasks.find((task) => task.id === id);
    if (!task) {
        return;
    }
    Object.assign(task, changes);
}
function completeTask(id) {
    updateTask(id, {
        status: "completed"
    });
    renderTasks();
    showToast("Task Completed", "Great job! Task completed successfully.");
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
    showToast("Task Deleted", "The task has been removed.");
}
// ============================================
// TYPE GUARD — DISCRIMINATED UNION
// ============================================
function handleApiResponse(response) {
    if (response.status === "success") {
        tasks = response.data;
        renderTasks();
    }
    else if (response.status === "error") {
        showToast("Error", response.message);
    }
    else {
        console.log(`Loading: ${response.progress}%`);
    }
}
// ============================================
// TYPE GUARD — typeof
// ============================================
function formatTaskValue(value) {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toString();
}
function handleTaskResult(result) {
    if ("data" in result) {
        console.log(`Received ${result.data.length} tasks`);
    }
    else {
        console.log(`Error: ${result.error}`);
    }
}
// ============================================
// CLASS TYPES
// ============================================
class RegularUser {
    constructor(name) {
        this.name = name;
    }
}
class AdminUser {
    constructor(name, permissions) {
        this.name = name;
        this.permissions = permissions;
    }
}
// ============================================
// TYPE GUARD — instanceof
// ============================================
function displayUser(user) {
    if (user instanceof AdminUser) {
        console.log(`Admin: ${user.name}`);
        console.log(`Permissions: ${user.permissions.join(", ")}`);
    }
    else {
        console.log(`User: ${user.name}`);
    }
}
// ============================================
// TASK SNAPSHOT
// ============================================
function createTaskSnapshot(task) {
    return {
        id: task.id,
        title: task.title,
        priority: task.priority,
        status: task.status
    };
}
// ============================================
// RECORD EXAMPLE
// ============================================
function getPoints(priority) {
    return priorityPoints[priority];
}
// ============================================
// DATE
// ============================================
function getToday() {
    const date = new Date();
    return date.toLocaleDateString("en-GB");
}
// ============================================
// RENDER TASKS
// ============================================
function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet</h3>
                <p>Create your first task to get started.</p>
            </div>
        `;
        updateStats();
        return;
    }
    tasks.forEach((task) => {
        const card = createTaskCard(task);
        taskList.appendChild(card);
    });
    updateStats();
}
// ============================================
// CREATE TASK CARD
// ============================================
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.status === "completed") {
        card.classList.add("completed");
    }
    const taskCardData = {
        id: task.id,
        title: task.title,
        priority: task.priority,
        status: task.status
    };
    card.innerHTML = `
        <div class="task-top">

            <div>
                <h3>
                    ${taskCardData.title}
                </h3>

                <p>
                    ${task.description}
                </p>
            </div>

            <span class="priority ${taskCardData.priority}">
                ${taskCardData.priority}
            </span>

        </div>

        <div class="task-actions">

            <button
                class="complete"
                data-action="complete"
                data-id="${taskCardData.id}"
            >
                ${taskCardData.status === "completed"
        ? "Completed"
        : "Complete"}
            </button>

            <button
                data-action="delete"
                data-id="${taskCardData.id}"
            >
                Delete
            </button>

        </div>
    `;
    return card;
}
// ============================================
// STATS
// ============================================
function updateStats() {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const highPriority = tasks.filter((task) => task.priority === "high").length;
    totalTasks.textContent =
        tasks.length.toString();
    completedTasks.textContent =
        completed.toString();
    highPriorityTasks.textContent =
        highPriority.toString();
}
// ============================================
// EVENT HANDLING
// ============================================
taskList.addEventListener("click", (event) => {
    const target = event.target;
    const button = target.closest("button");
    if (!button) {
        return;
    }
    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    if (action === "complete") {
        completeTask(id);
    }
    else if (action === "delete") {
        deleteTask(id);
    }
});
// ============================================
// MODAL
// ============================================
function openModal() {
    taskModal.classList.remove("hidden");
    taskTitle.focus();
}
function closeTaskModal() {
    taskModal.classList.add("hidden");
    taskForm.reset();
}
addTaskButton.addEventListener("click", openModal);
closeModal.addEventListener("click", closeTaskModal);
taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
        closeTaskModal();
    }
});
// ============================================
// FORM
// ============================================
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    if (title === "") {
        return;
    }
    const taskData = {
        title,
        description,
        priority
    };
    const newTask = createTask(taskData);
    tasks.push(newTask);
    renderTasks();
    closeTaskModal();
    showToast("Task Created", "Your new task has been added.");
});
// ============================================
// TOAST
// ============================================
function showToast(title, message) {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
// ============================================
// INITIALIZATION
// ============================================
renderTasks();
// ============================================
// TYPE-SAFETY DEMONSTRATIONS
// ============================================
console.log(formatTaskValue("typescript"));
console.log(formatTaskValue(100));
console.log(getPoints("high"));
const firstTask = tasks[0];
if (firstTask) {
    const snapshot = createTaskSnapshot(firstTask);
    console.log("Readonly snapshot:", snapshot);
}
displayUser(new RegularUser("Rahul"));
displayUser(new AdminUser("Amit", [
    "delete-user",
    "manage-users"
]));
handleTaskResult({
    data: tasks
});
handleTaskResult({
    error: "Unable to load tasks"
});

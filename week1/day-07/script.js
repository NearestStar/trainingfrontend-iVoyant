"use strict";
// ================= DOM ELEMENTS =================
const openTaskModal = document.getElementById("openTaskModal");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const description = document.getElementById("description");
const taskModal = document.getElementById("taskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedValue = document.getElementById("completedValue");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
// ================= TASK DATA =================
let tasks = [];
// ================= OPEN MODAL =================
openTaskModal?.addEventListener("click", () => {
    taskModal?.classList.add("active");
});
// ================= CLOSE MODAL =================
closeTaskModal?.addEventListener("click", () => {
    taskModal?.classList.remove("active");
});
cancelTask?.addEventListener("click", () => {
    taskModal?.classList.remove("active");
});
// ================= CREATE TASK =================
taskForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    const taskDueDate = dueDate.value;
    const taskPriority = priority.value;
    const taskDescription = description.value.trim();
    // Don't create empty tasks
    if (title === "") {
        return;
    }
    const newTask = {
        id: Date.now(),
        title: title,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false
    };
    tasks.push(newTask);
    renderTasks();
    updateStats();
    // Clear form
    taskForm.reset();
    // Close modal
    taskModal?.classList.remove("active");
});
// ================= RENDER TASKS =================
function renderTasks() {
    if (!taskList) {
        return;
    }
    // Clear existing cards
    taskList.textContent = "";
    // Empty state
    if (tasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.classList.add("empty-state");
        emptyState.innerHTML = `
            <div class="empty-icon">
                ✓
            </div>

            <h3>No tasks yet</h3>

            <p>
                Add your first task and start being productive!
            </p>
        `;
        taskList.append(emptyState);
        return;
    }
    // Create cards
    tasks.forEach((task) => {
        const taskCard = document.createElement("article");
        taskCard.classList.add("task-card");
        // ================= TITLE =================
        const title = document.createElement("h3");
        title.textContent = task.title;
        // ================= DESCRIPTION =================
        const taskDescription = document.createElement("p");
        taskDescription.classList.add("task-description");
        taskDescription.textContent =
            task.description || "No description";
        // ================= PRIORITY =================
        const priorityBadge = document.createElement("span");
        priorityBadge.classList.add("priority", task.priority);
        priorityBadge.textContent =
            task.priority;
        // ================= DUE DATE =================
        const dueDateText = document.createElement("p");
        dueDateText.classList.add("due-date");
        dueDateText.textContent =
            `Due: ${task.dueDate}`;
        // ================= BUTTON CONTAINER =================
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-actions");
        // ================= COMPLETE BUTTON =================
        const completeButton = document.createElement("button");
        completeButton.classList.add("complete-btn");
        completeButton.textContent =
            task.completed
                ? "Completed ✓"
                : "Complete";
        // ================= DELETE BUTTON =================
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent =
            "Delete";
        // ================= COMPLETE EVENT =================
        completeButton.addEventListener("click", () => {
            task.completed =
                !task.completed;
            renderTasks();
            updateStats();
        });
        // ================= DELETE EVENT =================
        deleteButton.addEventListener("click", () => {
            tasks =
                tasks.filter((item) => item.id !== task.id);
            renderTasks();
            updateStats();
        });
        // ================= BUILD CARD =================
        buttonContainer.append(completeButton, deleteButton);
        taskCard.append(priorityBadge, title, taskDescription, dueDateText, buttonContainer);
        taskList.append(taskCard);
    });
}
// ================= UPDATE STATISTICS =================
function updateStats() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    // Active task count
    if (taskCount) {
        taskCount.textContent =
            activeTasks.toString();
    }
    // Completed count
    if (completedValue) {
        completedValue.textContent =
            completedTasks.toString();
    }
    // Progress
    if (tasks.length === 0) {
        if (progressFill) {
            progressFill.style.width = "0%";
        }
        if (progressText) {
            progressText.textContent = "0%";
        }
        return;
    }
    const progress = Math.round((completedTasks / tasks.length) * 100);
    if (progressFill) {
        progressFill.style.width =
            `${progress}%`;
    }
    if (progressText) {
        progressText.textContent =
            `${progress}%`;
    }
}
// ================= INITIAL RENDER =================
renderTasks();
updateStats();

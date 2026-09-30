interface Task {
    id: number;
    title: string;
    description?: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    completed: boolean;
    completedDate?: string;
    points?: number;
}


interface HistoryItem {
    id: number;
    title: string;
    completedDate: string;
    points: number;
}


// =====================================================
// DOM ELEMENTS
// =====================================================

const openTaskModal =
    document.getElementById("openTaskModal");

const taskForm =
    document.getElementById("taskForm") as HTMLFormElement;

const taskInput =
    document.getElementById("taskInput") as HTMLInputElement;

const dueDate =
    document.getElementById("dueDate") as HTMLInputElement;

const priority =
    document.getElementById("priority") as HTMLSelectElement;

const description =
    document.getElementById("description") as HTMLTextAreaElement;

const taskModal =
    document.getElementById("taskModal");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const cancelTask =
    document.getElementById("cancelTask");

const taskList =
    document.getElementById("taskList");

const taskCount =
    document.getElementById("taskCount");

const historyList =
    document.getElementById("historyList");

const historyCount =
    document.getElementById("historyCount");

const clearHistory =
    document.getElementById("clearHistory");

const pointsValue =
    document.getElementById("pointsValue");

const streakValue =
    document.getElementById("streakValue");

const bestStreakValue =
    document.getElementById("bestStreakValue");

const completedValue =
    document.getElementById("completedValue");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");


// =====================================================
// DATA
// =====================================================

let tasks: Task[] = [];

let taskHistory: HistoryItem[] = [];

let totalPoints = 0;

let currentStreak = 0;

let bestStreak = 0;

let lastCompletionDate = "";


// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

const TASKS_KEY = "taskflow_tasks";

const HISTORY_KEY = "taskflow_history";

const POINTS_KEY = "taskflow_points";

const STREAK_KEY = "taskflow_streak";

const BEST_STREAK_KEY = "taskflow_best_streak";

const LAST_COMPLETION_KEY =
    "taskflow_last_completion";


// =====================================================
// LOCAL STORAGE
// =====================================================

function saveData(): void {

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    localStorage.setItem(
        POINTS_KEY,
        totalPoints.toString()
    );

    localStorage.setItem(
        STREAK_KEY,
        currentStreak.toString()
    );

    localStorage.setItem(
        BEST_STREAK_KEY,
        bestStreak.toString()
    );

    localStorage.setItem(
        LAST_COMPLETION_KEY,
        lastCompletionDate
    );
}


function loadData(): void {

    const savedTasks =
        localStorage.getItem(TASKS_KEY);

    const savedHistory =
        localStorage.getItem(HISTORY_KEY);

    const savedPoints =
        localStorage.getItem(POINTS_KEY);

    const savedStreak =
        localStorage.getItem(STREAK_KEY);

    const savedBestStreak =
        localStorage.getItem(BEST_STREAK_KEY);

    const savedLastCompletion =
        localStorage.getItem(
            LAST_COMPLETION_KEY
        );


    if (savedTasks) {

        tasks =
            JSON.parse(savedTasks);

    }


    if (savedHistory) {

        history =
            JSON.parse(savedHistory);

    }


    if (savedPoints) {

        totalPoints =
            Number(savedPoints);

    }


    if (savedStreak) {

        currentStreak =
            Number(savedStreak);

    }


    if (savedBestStreak) {

        bestStreak =
            Number(savedBestStreak);

    }


    if (savedLastCompletion) {

        lastCompletionDate =
            savedLastCompletion;

    }
}


// =====================================================
// DATE HELPERS
// =====================================================

function getToday(): string {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function isOverdue(task: Task): boolean {

    if (task.completed) {
        return false;
    }

    return task.dueDate < getToday();

}


function formatDate(dateString: string): string {

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================================
// TOAST
// =====================================================

let toastTimeout: number | undefined;


function showToast(
    title: string,
    message: string
): void {

    if (!toast || !toastTitle || !toastMessage) {
        return;
    }


    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    if (toastTimeout) {

        window.clearTimeout(
            toastTimeout
        );

    }


    toastTimeout =
        window.setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);
}


// =====================================================
// MODAL
// =====================================================

openTaskModal?.addEventListener(
    "click",
    () => {

        taskModal?.classList.add("active");

        taskInput.focus();

    }
);


closeTaskModal?.addEventListener(
    "click",
    closeModal
);


cancelTask?.addEventListener(
    "click",
    closeModal
);


function closeModal(): void {

    taskModal?.classList.remove("active");

}


taskModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target === taskModal
        ) {

            closeModal();

        }

    }
);


// =====================================================
// CREATE TASK
// =====================================================

taskForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const title =
            taskInput.value.trim();

        const taskDueDate =
            dueDate.value;

        const taskPriority =
            priority.value as
            "low" |
            "medium" |
            "high";

        const taskDescription =
            description.value.trim();


        if (title === "") {

            showToast(
                "Missing Task",
                "Please enter a task name."
            );

            return;

        }


        if (taskDueDate === "") {

            showToast(
                "Missing Date",
                "Please select a due date."
            );

            return;

        }


        const newTask: Task = {

            id: Date.now(),

            title: title,

            description:
                taskDescription,

            dueDate:
                taskDueDate,

            priority:
                taskPriority,

            completed: false

        };


        tasks.push(newTask);

        saveData();

        renderTasks();

        renderHistory();

        updateStats();

        taskForm.reset();

        closeModal();


        showToast(
            "Task Created",
            `"${title}" was added successfully.`
        );

    }
);


// =====================================================
// RENDER TASKS
// =====================================================

function renderTasks(): void {

    if (!taskList) {
        return;
    }


    taskList.textContent = "";


    const activeTasks =
        tasks.filter(
            (task) => !task.completed
        );


    // EMPTY STATE

    if (activeTasks.length === 0) {

        const emptyState =
            document.createElement("div");

        emptyState.classList.add(
            "empty-state"
        );


        emptyState.innerHTML = `
            <div class="empty-icon">
                ✓
            </div>

            <h3>
                No tasks yet
            </h3>

            <p>
                No active tasks.
                Add your first task!
            </p>
        `;


        taskList.append(emptyState);

        return;

    }


    // ACTIVE TASKS

    activeTasks.forEach(
        (task) => {

            const taskCard =
                createTaskCard(task);

            taskList.append(taskCard);

        }
    );

}


// =====================================================
// CREATE TASK CARD
// =====================================================

function createTaskCard(
    task: Task
): HTMLElement {

    const taskCard =
        document.createElement("article");


    taskCard.classList.add(
        "task-card"
    );


    // TOP SECTION

    const taskTop =
        document.createElement("div");

    taskTop.classList.add(
        "task-top"
    );


    // PRIORITY

    const priorityBadge =
        document.createElement("span");

    priorityBadge.classList.add(
        "priority",
        task.priority
    );

    priorityBadge.textContent =
        task.priority;


    // POINTS

    const pointsPreview =
        document.createElement("span");

    pointsPreview.classList.add(
        "points-preview"
    );

    pointsPreview.textContent =
        isOverdue(task)
            ? "-5 pts"
            : "+10 pts";


    taskTop.append(
        priorityBadge,
        pointsPreview
    );


    // TITLE

    const title =
        document.createElement("h3");

    title.textContent =
        task.title;


    // DESCRIPTION

    const taskDescription =
        document.createElement("p");

    taskDescription.classList.add(
        "task-description"
    );

    taskDescription.textContent =
        task.description ||
        "No description";


    // META

    const taskMeta =
        document.createElement("div");

    taskMeta.classList.add(
        "task-meta"
    );


    // DATE

    const dueDateText =
        document.createElement("span");

    dueDateText.classList.add(
        "due-date"
    );

    dueDateText.textContent =
        `Due: ${formatDate(task.dueDate)}`;


    if (isOverdue(task)) {

        dueDateText.classList.add(
            "overdue"
        );


        const overdueBadge =
            document.createElement("span");

        overdueBadge.classList.add(
            "overdue-badge"
        );

        overdueBadge.textContent =
            "Overdue";


        taskMeta.append(
            dueDateText,
            overdueBadge
        );

    } else {

        taskMeta.append(
            dueDateText
        );

    }


    // ACTIONS

    const actions =
        document.createElement("div");

    actions.classList.add(
        "task-actions"
    );


    // COMPLETE

    const completeButton =
        document.createElement("button");

    completeButton.classList.add(
        "complete-btn"
    );

    completeButton.type =
        "button";

    completeButton.textContent =
        "✓ Complete";


    // DELETE

    const deleteButton =
        document.createElement("button");

    deleteButton.classList.add(
        "delete-btn"
    );

    deleteButton.type =
        "button";

    deleteButton.textContent =
        "Delete";


    // COMPLETE EVENT

    completeButton.addEventListener(
        "click",
        () => {

            completeTask(task.id);

        }
    );


    // DELETE EVENT

    deleteButton.addEventListener(
        "click",
        () => {

            deleteTask(task.id);

        }
    );


    actions.append(
        completeButton,
        deleteButton
    );


    // BUILD CARD

    taskCard.append(
        taskTop,
        title,
        taskDescription,
        taskMeta,
        actions
    );


    return taskCard;

}


// =====================================================
// COMPLETE TASK
// =====================================================

function completeTask(
    taskId: number
): void {

    const task =
        tasks.find(
            (item) =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    if (task.completed) {
        return;
    }


    const today =
        getToday();


    const completedOnTime =
        task.dueDate >= today;


    const earnedPoints =
        completedOnTime
            ? 10
            : -5;


    task.completed = true;

    task.completedDate = today;

    task.points = earnedPoints;


    totalPoints +=
        earnedPoints;


    updateStreak();


    taskHistory.push({

        id: task.id,

        title: task.title,

        completedDate: today,

        points: earnedPoints

    });


    saveData();


    renderTasks();

    renderHistory();

    updateStats();


    if (earnedPoints > 0) {

        showToast(
            "Task Completed! 🎉",
            `You earned +${earnedPoints} points.`
        );

    } else {

        showToast(
            "Task Completed",
            `Overdue task: ${earnedPoints} points.`
        );

    }

}


// =====================================================
// DELETE TASK
// =====================================================

function deleteTask(
    taskId: number
): void {

    const task =
        tasks.find(
            (item) =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    tasks =
        tasks.filter(
            (item) =>
                item.id !== taskId
        );


    saveData();


    renderTasks();

    renderHistory();

    updateStats();


    showToast(
        "Task Deleted",
        `"${task.title}" was removed.`
    );

}


// =====================================================
// HISTORY
// =====================================================

function renderHistory(): void {

    if (!historyList) {
        return;
    }


    historyList.textContent = "";


    if (history.length === 0) {

        const empty =
            document.createElement("div");

        empty.classList.add(
            "history-empty"
        );


        empty.innerHTML = `
            <span>📋</span>
            <p>
                Completed tasks will appear here.
            </p>
        `;


        historyList.append(empty);

        if (historyCount) {
            historyCount.textContent = "0";
        }

        return;

    }


    const sortedHistory =
        [...taskHistory].reverse();


    sortedHistory.forEach(
        (item) => {

            const historyItem =
                document.createElement("div");

            historyItem.classList.add(
                "history-item"
            );


            const main =
                document.createElement("div");

            main.classList.add(
                "history-main"
            );


            const check =
                document.createElement("div");

            check.classList.add(
                "history-check"
            );

            check.textContent = "✓";


            const textContainer =
                document.createElement("div");


            const title =
                document.createElement("p");

            title.classList.add(
                "history-title"
            );

            title.textContent =
                item.title;


            const date =
                document.createElement("p");

            date.classList.add(
                "history-date"
            );

            date.textContent =
                `Completed ${formatDate(
                    item.completedDate
                )}`;


            textContainer.append(
                title,
                date
            );


            main.append(
                check,
                textContainer
            );


            const points =
                document.createElement("span");

            points.classList.add(
                "history-points"
            );


            if (item.points >= 0) {

                points.classList.add(
                    "positive"
                );

                points.textContent =
                    `+${item.points}`;

            } else {

                points.classList.add(
                    "negative"
                );

                points.textContent =
                    `${item.points}`;

            }


            historyItem.append(
                main,
                points
            );


            historyList.append(
                historyItem
            );

        }
    );


    if (historyCount) {

        historyCount.textContent =
            history.length.toString();

    }

}


// =====================================================
// CLEAR HISTORY
// =====================================================

clearHistory?.addEventListener(
    "click",
    () => {

        if (history.length === 0) {

            showToast(
                "Nothing to Clear",
                "Your history is already empty."
            );

            return;

        }


        const confirmed =
            window.confirm(
                "Clear all completed task history?"
            );


        if (!confirmed) {
            return;
        }


        taskHistory = [];


        saveData();

        renderHistory();


        showToast(
            "History Cleared",
            "Your completed task history was removed."
        );

    }
);


// =====================================================
// STREAK
// =====================================================

function updateStreak(): void {

    const today =
        getToday();


    // First completion ever

    if (!lastCompletionDate) {

        currentStreak = 1;

    } else {

        const lastDate =
            new Date(
                `${lastCompletionDate}T00:00:00`
            );


        const currentDate =
            new Date(
                `${today}T00:00:00`
            );


        const difference =
            Math.round(
                (
                    currentDate.getTime()
                    -
                    lastDate.getTime()
                )
                /
                (1000 * 60 * 60 * 24)
            );


        if (difference === 0) {

            // Already completed today.
            // Keep the current streak.

        } else if (difference === 1) {

            currentStreak++;

        } else {

            currentStreak = 1;

        }

    }


    lastCompletionDate =
        today;


    if (
        currentStreak >
        bestStreak
    ) {

        bestStreak =
            currentStreak;

    }

}


// =====================================================
// STATISTICS
// =====================================================

function updateStats(): void {

    const activeTasks =
        tasks.filter(
            (task) =>
                !task.completed
        ).length;


    const completedTasks =
        tasks.filter(
            (task) =>
                task.completed
        ).length;


    // ACTIVE TASKS

    if (taskCount) {

        taskCount.textContent =
            activeTasks.toString();

    }


    // COMPLETED

    if (completedValue) {

        completedValue.textContent =
            completedTasks.toString();

    }


    // POINTS

    if (pointsValue) {

        pointsValue.textContent =
            totalPoints.toString();

    }


    // STREAK

    if (streakValue) {

        streakValue.textContent =
            currentStreak.toString();

    }


    // BEST STREAK

    if (bestStreakValue) {

        bestStreakValue.textContent =
            bestStreak.toString();

    }


    // PROGRESS

    if (tasks.length === 0) {

        if (progressFill) {

            progressFill.style.width =
                "0%";

        }


        if (progressText) {

            progressText.textContent =
                "0%";

        }


        return;

    }


    const progress =
        Math.round(
            (
                completedTasks
                /
                tasks.length
            )
            * 100
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    if (progressText) {

        progressText.textContent =
            `${progress}%`;

    }

}


// =====================================================
// INITIALIZE
// =====================================================

loadData();

renderTasks();

renderHistory();

updateStats();
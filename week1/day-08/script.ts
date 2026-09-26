// ============================================
// TYPES
// ============================================

type Priority = "low" | "medium" | "high";

type TaskStatus = "pending" | "completed";


// ============================================
// BASE TASK TYPE
// ============================================

type Task = {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    createdAt: string;
};


// ============================================
// UTILITY TYPES
// ============================================

// Pick
type TaskCard = Pick<
    Task,
    "id" | "title" | "priority" | "status"
>;


// Omit
type CreateTask = Omit<
    Task,
    "id" | "createdAt" | "status"
>;


// Partial
type UpdateTask = Partial<
    Pick<Task, "title" | "description" | "priority" | "status">
>;


// Readonly
type TaskSnapshot = Readonly<TaskCard>;


// Record
type PriorityPoints = Record<Priority, number>;


// ============================================
// INTERSECTION TYPE
// ============================================

type User = {
    name: string;
    email: string;
};

type TaskOwner = {
    userId: number;
};

type TaskUser = User & TaskOwner;


// ============================================
// API RESPONSE — DISCRIMINATED UNION
// ============================================

type SuccessResponse = {
    status: "success";
    data: Task[];
};

type ErrorResponse = {
    status: "error";
    message: string;
};

type LoadingResponse = {
    status: "loading";
    progress: number;
};

type ApiResponse =
    | SuccessResponse
    | ErrorResponse
    | LoadingResponse;


// ============================================
// DOM ELEMENTS
// ============================================

const taskList =
    document.getElementById("taskList") as HTMLDivElement;

const totalTasks =
    document.getElementById("totalTasks") as HTMLHeadingElement;

const completedTasks =
    document.getElementById("completedTasks") as HTMLHeadingElement;

const highPriorityTasks =
    document.getElementById(
        "highPriorityTasks"
    ) as HTMLHeadingElement;

const addTaskButton =
    document.getElementById(
        "addTaskButton"
    ) as HTMLButtonElement;

const taskModal =
    document.getElementById(
        "taskModal"
    ) as HTMLDivElement;

const closeModal =
    document.getElementById(
        "closeModal"
    ) as HTMLButtonElement;

const taskForm =
    document.getElementById(
        "taskForm"
    ) as HTMLFormElement;

const taskTitle =
    document.getElementById(
        "taskTitle"
    ) as HTMLInputElement;

const taskDescription =
    document.getElementById(
        "taskDescription"
    ) as HTMLInputElement;

const taskPriority =
    document.getElementById(
        "taskPriority"
    ) as HTMLSelectElement;

const toast =
    document.getElementById(
        "toast"
    ) as HTMLDivElement;

const toastTitle =
    document.getElementById(
        "toastTitle"
    ) as HTMLElement;

const toastMessage =
    document.getElementById(
        "toastMessage"
    ) as HTMLParagraphElement;


// ============================================
// PRIORITY CONFIGURATION
// ============================================

const priorityPoints: PriorityPoints = {
    low: 5,
    medium: 10,
    high: 20
};


// ============================================
// STATE
// ============================================

let tasks: Task[] = [];


// ============================================
// SAMPLE DATA
// ============================================

tasks = [
    {
        id: 1,
        title: "Learn TypeScript",
        description:
            "Practice utility types and type guards.",
        priority: "high",
        status: "pending",
        createdAt: "25-09-2026"
    },

    {
        id: 2,
        title: "Build Task Board",
        description:
            "Create a type-safe frontend application.",
        priority: "medium",
        status: "pending",
        createdAt: "25-09-2026"
    },

    {
        id: 3,
        title: "Review Git",
        description:
            "Practice feature branches and commits.",
        priority: "low",
        status: "completed",
        createdAt: "24-09-2026"
    }
];


// ============================================
// TYPE-SAFE FUNCTIONS
// ============================================

function createTask(data: CreateTask): Task {

    const newTask: Task = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "pending",
        createdAt: getToday()
    };

    return newTask;
}


function updateTask(
    id: number,
    changes: UpdateTask
): void {

    const task = tasks.find(
        (task: Task) => task.id === id
    );

    if (!task) {
        return;
    }

    Object.assign(task, changes);
}


function completeTask(id: number): void {

    updateTask(id, {
        status: "completed"
    });

    renderTasks();

    showToast(
        "Task Completed",
        "Great job! Task completed successfully."
    );
}


function deleteTask(id: number): void {

    tasks = tasks.filter(
        (task: Task) => task.id !== id
    );

    renderTasks();

    showToast(
        "Task Deleted",
        "The task has been removed."
    );
}


// ============================================
// TYPE GUARD — DISCRIMINATED UNION
// ============================================

function handleApiResponse(
    response: ApiResponse
): void {

    if (response.status === "success") {

        tasks = response.data;

        renderTasks();

    } else if (response.status === "error") {

        showToast(
            "Error",
            response.message
        );

    } else {

        console.log(
            `Loading: ${response.progress}%`
        );
    }
}


// ============================================
// TYPE GUARD — typeof
// ============================================

function formatTaskValue(
    value: string | number
): string {

    if (typeof value === "string") {
        return value.toUpperCase();
    }

    return value.toString();
}


// ============================================
// TYPE GUARD — in
// ============================================

type TaskSuccess = {
    data: Task[];
};

type TaskError = {
    error: string;
};

type TaskResult = TaskSuccess | TaskError;


function handleTaskResult(
    result: TaskResult
): void {

    if ("data" in result) {

        console.log(
            `Received ${result.data.length} tasks`
        );

    } else {

        console.log(
            `Error: ${result.error}`
        );
    }
}


// ============================================
// CLASS TYPES
// ============================================

class RegularUser {

    constructor(
        public name: string
    ) {}
}


class AdminUser {

    constructor(
        public name: string,
        public permissions: string[]
    ) {}
}


// ============================================
// TYPE GUARD — instanceof
// ============================================

function displayUser(
    user: RegularUser | AdminUser
): void {

    if (user instanceof AdminUser) {

        console.log(
            `Admin: ${user.name}`
        );

        console.log(
            `Permissions: ${user.permissions.join(", ")}`
        );

    } else {

        console.log(
            `User: ${user.name}`
        );
    }
}


// ============================================
// TASK SNAPSHOT
// ============================================

function createTaskSnapshot(
    task: Task
): TaskSnapshot {

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

function getPoints(
    priority: Priority
): number {

    return priorityPoints[priority];
}


// ============================================
// DATE
// ============================================

function getToday(): string {

    const date = new Date();

    return date.toLocaleDateString(
        "en-GB"
    );
}


// ============================================
// RENDER TASKS
// ============================================

function renderTasks(): void {

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


    tasks.forEach(
        (task: Task) => {

            const card =
                createTaskCard(task);

            taskList.appendChild(card);
        }
    );


    updateStats();
}


// ============================================
// CREATE TASK CARD
// ============================================

function createTaskCard(
    task: Task
): HTMLDivElement {

    const card =
        document.createElement("div");

    card.className = "task-card";


    if (task.status === "completed") {
        card.classList.add("completed");
    }


    const taskCardData: TaskCard = {
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

function updateStats(): void {

    const completed =
        tasks.filter(
            (task: Task) =>
                task.status === "completed"
        ).length;


    const highPriority =
        tasks.filter(
            (task: Task) =>
                task.priority === "high"
        ).length;


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

taskList.addEventListener(
    "click",
    (event: MouseEvent) => {

        const target =
            event.target as HTMLElement;

        const button =
            target.closest("button");

        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);

        const action =
            button.dataset.action;


        if (action === "complete") {

            completeTask(id);

        } else if (action === "delete") {

            deleteTask(id);
        }
    }
);


// ============================================
// MODAL
// ============================================

function openModal(): void {

    taskModal.classList.remove("hidden");

    taskTitle.focus();
}


function closeTaskModal(): void {

    taskModal.classList.add("hidden");

    taskForm.reset();
}


addTaskButton.addEventListener(
    "click",
    openModal
);


closeModal.addEventListener(
    "click",
    closeTaskModal
);


taskModal.addEventListener(
    "click",
    (event: MouseEvent) => {

        if (
            event.target === taskModal
        ) {
            closeTaskModal();
        }
    }
);


// ============================================
// FORM
// ============================================

taskForm.addEventListener(
    "submit",
    (event: SubmitEvent) => {

        event.preventDefault();


        const title =
            taskTitle.value.trim();

        const description =
            taskDescription.value.trim();

        const priority =
            taskPriority.value as Priority;


        if (title === "") {
            return;
        }


        const taskData: CreateTask = {
            title,
            description,
            priority
        };


        const newTask =
            createTask(taskData);


        tasks.push(newTask);


        renderTasks();

        closeTaskModal();


        showToast(
            "Task Created",
            "Your new task has been added."
        );
    }
);


// ============================================
// TOAST
// ============================================

function showToast(
    title: string,
    message: string
): void {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    setTimeout(
        () => {
            toast.classList.remove("show");
        },
        2500
    );
}


// ============================================
// INITIALIZATION
// ============================================

renderTasks();


// ============================================
// TYPE-SAFETY DEMONSTRATIONS
// ============================================

console.log(
    formatTaskValue("typescript")
);

console.log(
    formatTaskValue(100)
);


console.log(
    getPoints("high")
);


const firstTask =
    tasks[0];

if (firstTask) {

    const snapshot =
        createTaskSnapshot(firstTask);

    console.log(
        "Readonly snapshot:",
        snapshot
    );
}


displayUser(
    new RegularUser("Rahul")
);


displayUser(
    new AdminUser(
        "Amit",
        [
            "delete-user",
            "manage-users"
        ]
    )
);


handleTaskResult({
    data: tasks
});


handleTaskResult({
    error: "Unable to load tasks"
});
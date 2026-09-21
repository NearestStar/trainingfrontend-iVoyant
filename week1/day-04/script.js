const form = document.getElementById("todoForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim() != "") {
        const taskText = input.value.trim();

        const li = document.createElement("li");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;

        const completeButton = document.createElement("button");
        completeButton.classList.add("complete-btn");
        completeButton.textContent = "Completed";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(taskSpan);
        li.appendChild(buttonContainer);

        list.appendChild(li);

        input.value = "";
        console.log(taskText);

        deleteButton.addEventListener("click", () => {
            li.remove();
        });

        completeButton.addEventListener("click", () => {
            taskSpan.classList.toggle("completed");
        });
    }
});

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

todoForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const listItem = document.createElement("li");

    listItem.className =
        "flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg shadow-sm";

    const taskSpan = document.createElement("span");

    taskSpan.textContent = taskText;

    taskSpan.className =
        "flex-1 cursor-pointer break-words text-gray-700";

    listItem.animate(
        [
            { opacity: 0, transform: "translateY(-10px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        {
            duration: 300,
            easing: "ease-out"
        }
    );

    taskSpan.addEventListener("click", function() {

        taskSpan.classList.toggle("line-through");
        taskSpan.classList.toggle("text-gray-400");

    });

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className =
        "bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition duration-300 active:scale-95";

    deleteButton.addEventListener("click", function() {

        const animation = listItem.animate(
            [
                { opacity: 1, transform: "translateX(0)" },
                { opacity: 0, transform: "translateX(40px)" }
            ],
            {
                duration: 250,
                easing: "ease-in"
            }
        );

        animation.onfinish = function() {
            listItem.remove();
        };

    });

    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);

    taskInput.value = "";

});
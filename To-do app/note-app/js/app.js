const addTaskBtn = document.querySelector("#addTaskBtn");
const newTaskInput = document.querySelector("#newTaskInput");
const dueDateInput = document.querySelector("#dueDateInput");
const priorityInput = document.querySelector("#priorityInput");
const categoryInput = document.querySelector("#categoryInput");
const taskList = document.querySelector("#taskList");

const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll(".task").forEach(task => {
        const taskText = task.querySelector("input[type='text']").value;
        const isCompleted = task.querySelector("input[type='checkbox']").checked;
        const priority = task.querySelector(".priority").textContent.replace("Priority: ", "");
        const dueDate = task.querySelector(".due-date").textContent.replace("Due: ", "");
        const category = task.querySelector(".category").textContent.replace("Category: ", "");
        tasks.push({ text: taskText, completed: isCompleted, priority, dueDate, category });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(task => addTask(task.text, task.completed, task.priority, task.dueDate, task.category));
    }
}

const addTask = (text = "", completed = false, priority = "Low", dueDate = "", category = "Work") => {
    if (text.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    const task = document.createElement("div");
    task.classList.add("task");
    if (completed) task.classList.add("completed");

    // Check if the due date is near (within 2 days)
    if (dueDate) {
        const today = new Date();
        const taskDueDate = new Date(dueDate);
        const timeDifference = taskDueDate - today;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        // If the due date is 2 days or less from today, add the 'near-due' class
        if (daysDifference <= 2 && daysDifference >= 0) {
            task.classList.add("near-due");
        }
    }

    task.innerHTML = `
        <div>
            <input type="checkbox" ${completed ? "checked" : ""}>
            <input type="text" value="${text}" readonly>
        </div>
        <div class="details">
            <span class="priority">Priority: ${priority}</span>
            <span class="due-date">Due: ${dueDate || 'No Due Date'}</span>
            <span class="category">Category: ${category}</span>
        </div>
        <div class="actions">
            <i class="fas fa-edit edit-task"></i>
            <i class="fas fa-trash delete-task"></i>
        </div>
    `;

    task.querySelector("input[type='checkbox']").addEventListener("change", () => {
        task.classList.toggle("completed");
        saveTasks();
    });

    task.querySelector(".delete-task").addEventListener("click", () => {
        task.remove();
        saveTasks();
    });

    task.querySelector(".edit-task").addEventListener("click", () => {
        const taskInput = task.querySelector("input[type='text']");
        if (taskInput.hasAttribute("readonly")) {
            taskInput.removeAttribute("readonly");
            taskInput.focus();
        } else {
            taskInput.setAttribute("readonly", "true");
            saveTasks();
        }
    });

    taskList.appendChild(task);
    saveTasks();
}

addTaskBtn.addEventListener("click", () => {
    const taskText = newTaskInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;
    
    addTask(taskText, false, priority, dueDate, category);
    
    // Clear input after adding
    newTaskInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "Low";
    categoryInput.value = "Work";
});

loadTasks();

const form = document.querySelector("#task-form");
const nameInput = document.querySelector("#task-name");
const priorityInput = document.querySelector("#priority");
const filterInput = document.querySelector("#filter");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");

const STORAGE_KEY = "javascript-task-dashboard-tasks";

let tasks = loadTasks();

if (tasks.length === 0) {
  tasks = [
    {
      id: crypto.randomUUID(),
      name: "Validate product data",
      priority: "high",
      done: false
    },
    {
      id: crypto.randomUUID(),
      name: "Review SQL query",
      priority: "medium",
      done: true
    }
  ];
  saveTasks();
}

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function visibleTasks() {
  const filter = filterInput.value;

  if (filter === "open") {
    return tasks.filter(task => !task.done);
  }

  if (filter === "done") {
    return tasks.filter(task => task.done);
  }

  return tasks;
}

function render() {
  list.innerHTML = "";

  for (const task of visibleTasks()) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.done) {
      item.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      render();
    });

    const taskName = document.createElement("span");
    taskName.className = "task-name";
    taskName.textContent = task.name;

    const priority = document.createElement("span");
    priority.className = "priority";
    priority.textContent = task.priority.toUpperCase();

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks();
      render();
    });

    item.append(checkbox, taskName, priority, removeButton);
    list.append(item);
  }

  const completed = tasks.filter(task => task.done).length;
  summary.textContent = `${completed}/${tasks.length} completed`;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    message.textContent = "Task name is required.";
    nameInput.focus();
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    name,
    priority: priorityInput.value,
    done: false
  });

  saveTasks();
  nameInput.value = "";
  message.textContent = "";
  render();
});

filterInput.addEventListener("change", render);

render();

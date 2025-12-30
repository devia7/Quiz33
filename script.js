const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("modalOverlay");
const noteInput = document.getElementById("noteInput");
const search = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");
const applyBtn = document.getElementById("applyBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let theme = localStorage.getItem("theme") || "light";
let editId = null;

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

applyTheme(theme);

themeToggle.onclick = () => {
  theme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(theme);
};

document.getElementById("addBtn").onclick = () => {
  editId = null;
  noteInput.value = "";
  modal.classList.remove("hidden");
};

document.getElementById("cancelBtn").onclick = () => {
  modal.classList.add("hidden");
};

applyBtn.onclick = () => {
  if (!noteInput.value.trim()) return;

  if (editId) {
    const todo = todos.find(t => t.id === editId);
    todo.text = noteInput.value;
  } else {
    todos.push({
      id: Date.now(),
      text: noteInput.value,
      completed: false
    });
  }

  saveAndRender();
  modal.classList.add("hidden");
};

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

function render() {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo =>
    todo.text.toLowerCase().includes(search.value.toLowerCase())
  );

  emptyState.style.display = filtered.length ? "none" : "block";

  filtered.forEach(todo => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox" + (todo.completed ? " checked" : "");
    checkbox.onclick = () => {
      todo.completed = !todo.completed;
      saveAndRender();
    };

    const span = document.createElement("span");
    span.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editBtn = document.createElement("span");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      editId = todo.id;
      noteInput.value = todo.text;
      modal.classList.remove("hidden");
    };

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "🗑";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveAndRender();
    };

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    todoList.appendChild(li);
  });
}

search.oninput = render;

render();

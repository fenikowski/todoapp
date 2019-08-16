const sendButton = document.querySelector("button#send");
const input = document.querySelector("input#name");
const checkbox = document.querySelector("input#checkbox");

function sendTask(e) {
  e.preventDefault();

  const taskName = input.value;
  const important = checkbox.checked;

  input.value = "";
  checkbox.checked = false;

  const url = `/${taskName}/${important}`;

  console.log(url);

  fetch(url, {
    method: "POST"
  })
    .then(data => data.json())
    .then(data => {
      createTasks(data);
      document.querySelector("div#active-tasks span").innerText = data.length;
    });
}

function createTasks(data) {
  const node = document.querySelector("div#task-list");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  data.forEach(info => {
    const task = document.createElement("div");
    task.className = "task";
    const taskDate = document.createElement("div");
    taskDate.className = "task-date";
    const taskTitle = document.createElement("div");
    taskTitle.className = "task-title";
    const taskImportance = document.createElement("div");
    taskImportance.className = "task-importance";
    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
    const deleteButton = document.createElement("i");
    deleteButton.className = "fas fa-trash-alt";
    deleteButton.dataset.id = info._id;
    const completeButton = document.createElement("i");
    completeButton.className = "fas fa-check";
    completeButton.dataset.id = info._id;

    document.querySelector("div#task-list").appendChild(task);
    task.appendChild(taskDate);
    task.appendChild(taskTitle);
    task.appendChild(taskImportance);
    task.appendChild(taskButtons);
    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(deleteButton);
    deleteButton.addEventListener("click", handleDelete);
    completeButton.addEventListener("click", handleComplete);

    taskDate.innerText = info.time;
    taskTitle.innerText = info.name;
    taskImportance.innerText = info.importance;
  });
}

function handleDelete(e) {
  fetch(`/delete/${e.target.dataset.id}`, {
    method: "POST"
  })
    .then(data => data.json())
    .then(data => {
      createTasks(data);
      document.querySelector("div#active-tasks span").innerText = data.length;
    });
}

function handleComplete(e) {
  fetch(`/complete/${e.target.dataset.id}`, {
    method: "POST"
  })
    .then(data => data.json())
    .then(data => {
      createTasks(data.data);

      document.querySelector("div#completed-tasks span").innerText =
        data.completedTasks;

      document.querySelector("div#active-tasks span").innerText =
        data.data.length;
    });
}

function inicialization() {
  fetch("/getTasks", {
    method: "GET"
  })
    .then(data => data.json())
    .then(data => {
      createTasks(data.data);

      document.querySelector("div#completed-tasks span").innerText =
        data.completedTasks;
      document.querySelector("div#active-tasks span").innerText =
        data.data.length;
    });
}

inicialization();
sendButton.addEventListener("click", sendTask);

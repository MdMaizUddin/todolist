const taskInput = document.querySelector('#new-task');
const addTaskButton = document.querySelector('#add-task-btn');
const taskList = document.querySelector('#task-list');

document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
  setInterval(checkUncompletedTasks, 5000);
});

addTaskButton.addEventListener('click', function () {
  const taskText = taskInput.value;
  const taskPriority = prompt("Enter task priority (1 = High, 2 = Medium, 3 = Low):");

  if (taskText === '' || taskPriority === '') {
    alert('Please enter both a task and a priority');
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    priority: parseInt(taskPriority),
    childTasks: []
  };

  const li = createTaskElement(task);
  taskList.appendChild(li);
  saveTask(task);
  taskInput.value = ''; 
});

function createTaskElement(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked disabled' : ''}>
    <span>${task.text} - Priority: ${task.priority}</span>
    <button class="add-child-btn">Add Subtask</button>
    <ul class="child-task-list"></ul>
  `;

  li.querySelector('.task-checkbox').addEventListener('change', function () {
    if (this.checked) {
      li.classList.add('completed');
      this.disabled = true;
      updateTaskStatus(task.text, true, task.childTasks); 
    }
  });

  li.querySelector('.add-child-btn').addEventListener('click', function () {
    const childTaskText = prompt("Enter the subtask:");
    if (childTaskText) {
      const childTask = { text: childTaskText, completed: false, priority: task.priority }; 
      task.childTasks.push(childTask);
      updateTaskStatus(task.text, task.completed, task.childTasks); 
      const childTaskLi = createTaskElement(childTask);
      li.querySelector('.child-task-list').appendChild(childTaskLi);
    }
  });

  return li;
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  tasks = sortTasksByPriority(tasks);  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskStatus(taskText, completed, childTasks = []) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(task =>
    task.text === taskText ? { ...task, completed: completed, childTasks: childTasks } : task
  );
  tasks = sortTasksByPriority(tasks);  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = sortTasksByPriority(tasks); 
  tasks.forEach(task => {
    const li = createTaskElement(task);
    if (task.completed) {
      li.classList.add('completed');
    }
    taskList.appendChild(li);

    task.childTasks.forEach(childTask => {
      const childTaskLi = createTaskElement(childTask);
      li.querySelector('.child-task-list').appendChild(childTaskLi);
    });
  });
}

function checkUncompletedTasks() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let uncompletedTasks = tasks.filter(task => !task.completed);

  if (uncompletedTasks.length > 0) {
    alert('You have unfinished tasks!');
  }
}

function sortTasksByPriority(tasks) {
  tasks.sort((a, b) => a.priority - b.priority); // Sort parent tasks by priority
  tasks.forEach(task => {
    if (task.childTasks && task.childTasks.length > 0) {  // Correctly open this block
      task.childTasks.sort((a, b) => a.priority - b.priority);  // Sort subtasks by priority
    }
  });
  return tasks;
}










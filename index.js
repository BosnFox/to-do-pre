let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector('.to-do__list');
const formElement = document.querySelector('.to-do__form');
const inputElement = document.querySelector('.to-do__input');
const templateElement = document.querySelector('#to-do_item-template');

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
  const tasks = [];
  
  itemsNamesElements.forEach((element) => {
    tasks.push(element.textContent);
  });
  
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return initialItems;
}

function createItem(text) {
  const clone = templateElement.content.cloneNode(true);
  const itemElement = clone.querySelector('.to-do__item');
  const textElement = clone.querySelector('.to-do__item-text');
  
  const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
  const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
  const editButton = clone.querySelector('.to-do__item-button_type_edit');

  textElement.textContent = text;

  deleteButton.addEventListener('click', function () {
    itemElement.remove();
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  duplicateButton.addEventListener('click', function () {
    const currentText = textElement.textContent;
    const newElement = createItem(currentText);
    
    listElement.prepend(newElement);
    
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  editButton.addEventListener('click', function () {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });

  textElement.addEventListener('blur', function () {
    textElement.setAttribute('contenteditable', 'false');
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  return clone;
}

const items = loadTasks();

items.forEach((item) => {
  const taskElement = createItem(item);
  listElement.append(taskElement);
});

formElement.addEventListener('submit', function (event) {
  event.preventDefault();

  const taskText = inputElement.value.trim();

  if (taskText !== '') {
    const newTaskElement = createItem(taskText);
    listElement.prepend(newTaskElement);

    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);

    formElement.reset();
  }
});

const STORAGE_KEY = 'todo_list_state';
const defaultItems = [
    {id: 'def-1', text: 'Сделать проектную работу'},
    {id: 'def-2', text: 'Полить цветы'},
    {id: 'def-3', text: 'Пройти туториал по Реакту'},
    {id: 'def-4', text: 'Сделать фронт для своего проекта'}
];

const listElement = document.querySelector('.to-do__list');
const templateElement = document.querySelector('#to-do__item-template').content;
const formElement = document.querySelector('.to-do__form');
const inputElement = formElement.querySelector('.to-do__input');

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const saveState = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadState = () => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : defaultItems;
};

let tasks = loadState();

const createTaskElement = ({id, text}) => {
    const clone = templateElement.querySelector('.to-do__item').cloneNode(true);
    const textElement = clone.querySelector('.to-do__item-text');
    textElement.textContent = text;
    clone.dataset.id = id;
    return clone;
};

const render = () => {
    listElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    tasks.forEach((task) => {
        fragment.append(createTaskElement(task));
    });
    listElement.append(fragment);
};

const handleFormSubmit = (evt) => {
    evt.preventDefault();
    const trimmedValue = inputElement.value.trim();
    if (!trimmedValue) return;

    const newTask = {
        id: generateId(),
        text: trimmedValue
    };
    tasks.unshift(newTask);
    saveState(tasks);
    render();
    formElement.reset();
};

const handleListClick = (evt) => {
    const {target} = evt;
    const taskElement = target.closest('.to-do__item');
    if (!taskElement) return;
    const taskId = taskElement.dataset.id;

    if (target.classList.contains('to-do__item-button_type_delete')) {
        tasks = tasks.filter(({id}) => id !== taskId);
        saveState(tasks);
        render();
        return;
    }

    if (target.classList.contains('to-do__item-button_type_duplicate')) {
        const originalTask = tasks.find(({id}) => id === taskId);
        if (originalTask) {
            const newTask = {
                ...originalTask,
                id: generateId()
            };
            tasks.unshift(newTask);
            saveState(tasks);
            render();
        }
        return;
    }

    if (target.classList.contains('to-do__item-button_type_edit')) {
        const textElement = taskElement.querySelector('.to-do__item-text');
        textElement.contentEditable = true;
        textElement.focus();
    }
};

const finishEdit = (element) => {
    const taskId = element.closest('.to-do__item').dataset.id;
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const currentText = element.textContent.trim();
    if (!currentText) element.textContent = tasks[taskIndex].text;
    else {
        tasks[taskIndex].text = currentText;
        saveState(tasks);
    }

    element.removeAttribute('contenteditable');
};

const handleEditKeydown = (evt) => {
    const {key, target} = evt;
    if (!target.classList.contains('to-do__item-text')) return;
    switch (key) {
        case "Enter":
            evt.preventDefault();
            target.blur();
            break;
        case "Escape":
            const taskId = target.closest('.to-do__item').dataset.id;
            const originalTask = tasks.find((t) => t.id === taskId);
            if (originalTask) target.textContent = originalTask.text;
            target.blur();
            break;
    }
};

const handleEditFocusOut = (evt) => {
    const {target} = evt;
    if (target.classList.contains('to-do__item-text')) {
        finishEdit(target);
    }
};

render();

formElement.addEventListener('submit', handleFormSubmit);
listElement.addEventListener('click', handleListClick);
listElement.addEventListener('keydown', handleEditKeydown);
listElement.addEventListener('focusout', handleEditFocusOut);
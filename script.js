// let todos = [];
let todos;
const savedTodos = JSON.parse(localStorage.getItem('todos'));
if (Array.isArray(savedTodos)){
  todos = savedTodos;
}
else {
  todos = []
}  

function createTodo(title) {
  const id = '' + new Date().getTime();
  todos.push({
    title: title,
    id: id
  });
  saveTodos();
}

function removeTodo(idToDelete) {
  todos = todos.filter(function (todo) { // creates a new array
    if (todo.id === idToDelete) {
      return false; // excludes the element
    }
    else {
      return true;
    }
  });
  saveTodos();
}

function toggleTodo(todoId, checked) {
  todos.forEach(function (todo) {
    if (todo.id === todoId) {
      todo.isDone = checked;
    }
  });
}

function setEditing(todoId) {
  todos.forEach(function (todo) {
    if (todo.id === todoId) {
      todo.isEditing = true;
    }
  });

  saveTodos();
}

function updateTodo(todoId, newTitle) {
  todos.forEach(function (todo) {
    if (todo.id === todoId) {
      todo.title = newTitle;
      todo.isEditing = false;
    }
  });
  saveTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function clearAll() {
  document.getElementById('todoList').innerHTML = '';
  document.getElementById('todo-input').value = '';
}

function clearTodos() {
  clearAll();
  todos = [];
  saveTodos();
  document.getElementById('clear-button').disabled = true;
}

function checkTodo(event) {
  const checkbox = event.target;
  const todoId = checkbox.dataset.todoId;
  const checked = checkbox.checked;
  toggleTodo(todoId, checked);
  render();
}

// Controller

function addTodo() {
  const textbox = document.getElementById('todo-input');
  const title = textbox.value;
  const id = '' + new Date().getTime();
  if(checkTodoName(title) === 1) {
    createTodo(title);
    render(); // re renders the website with the update array
  }    
}

function addElement(element, name) {
  const newElement = document.createElement(element);
  newElement.setAttribute('class', name);
  return newElement;
}

function addButton(element, name, type, src, onClickFunction) {
  const button = addElement(element, name);
  button.type = 'image';
  button.src = src;
  button.onclick = onClickFunction;
  return button;
}

function deleteTodo(event) {
  const deleteButton = event.target;
  const idToDelete = deleteButton.id;
  removeTodo(idToDelete);
  render();
}

function onEdit(event) {
  const editButton = event.target;
  const todoId = editButton.dataset.todoId;
  setEditing(todoId);
  render();
}

function onUpdate(event) {
  const updateButton = event.target;
  const todoId = updateButton.dataset.todoId;
  const textbox = document.getElementById('edit-title-' + todoId);
  const newTitle = textbox.value;
  if(checkTodoName(newTitle) === 1) {
    updateTodo(todoId, newTitle);
    render();
  }
}

function checkTodoName(title) {
  if(title.length === 0) {
    alert('Please enter a todo item');
    return 0;
  }
  return 1;
}

function checkNumTodos() {
  if (todos.length > 0) {
    document.getElementById('clear-button').disabled = false;
  }
  else {
    document.getElementById('clear-button').disabled = true;
  }
}

// View
function render() {
  clearAll();
  checkNumTodos();
  todos.forEach(function (todo) {
    item = addElement('div', 'item');
    const itemName = addElement('div', 'itemName');
    const buttons = addElement('div', 'buttons');
    const checkBoxContainer = addElement('label','check-box-container');
    const checkBox = addElement('input','checkbox');
    checkBox.type = 'checkbox';
    checkBox.onchange = checkTodo;
    checkBox.dataset.todoId = todo.id;
    if (todo.isDone === true) {
      checkBox.checked = true;
      itemName.style.textDecoration = 'line-through';
      itemName.style.color = 'grey';
    } 
    else {
      checkBox.checked = false;
    }
    checkBoxContainer.appendChild(checkBox);
    const checkMark = addElement('div', 'checkmark');
    checkBoxContainer.appendChild(checkMark);
    item.appendChild(checkBoxContainer);
    if (todo.isEditing === true) {
      const textbox = addElement('input', 'edit-text-box');
      textbox.type = 'text';
      textbox.placeholder="Update todo item";
      textbox.id = 'edit-title-' + todo.id;
      item.appendChild(textbox);
      const updateButton = addButton('input', 'update-button', 'image', 'icons/update.png', onUpdate);
      updateButton.dataset.todoId = todo.id;
      item.appendChild(updateButton);
    } else  {
      itemName.innerHTML = todo.title;
      item.appendChild(itemName); 
      const editButton = addButton('input', 'edit-button', 'image', 'icons/edit.png', onEdit);
      editButton.dataset.todoId = todo.id;
      buttons.appendChild(editButton);
      const deleteButton = addButton('input', 'delete-button', 'image', 'icons/bin.png', deleteTodo);
      deleteButton.id = todo.id;
      buttons.appendChild(deleteButton); 
    }
    item.appendChild(buttons); 
    const todoItems = document.getElementById('todoList');
    todoItems.appendChild(item); 
  });
}

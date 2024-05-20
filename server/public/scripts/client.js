//Update todo in global scope
let editTodoId = '';
let todoCount = 0;

function onReady() {
  getTodos();
  return;
}

// handle form submission
function addTodo(event) {
  event.preventDefault();
  axios
    .post('/todos', {
      text: document.getElementById('todo-id').value,
    })
    .then(() => {
      // clear form
      document.getElementById('form-id').reset();
      // GET Todos
      getTodos();
    })
    .catch((error) => {
      console.error(`Error in posting todo`, error);
    });
}

function getTodos() {
  axios.get('/todos').then((response) => renderTodos(response.data));
}

function renderTodos(todos) {
  const todoList = document.querySelector('tbody');
  const todoCountElement = document.querySelector('p');
  let goneFishingBtn = document.getElementById('gone-fishing-btn-id');
  todoCount = todos.length;
  todoCountElement.textContent = todoCount;
  todoList.innerHTML = '';
  if (todos.length >= 20 && goneFishingBtn.hasAttribute('hidden')) {
    //gon fishing protocol! enable button!
    // alert();
    Swal.fire({
      title: 'Gone Fishing Protocol',
      text: 'Unlocked Gone Fishing Protocol!',
      icon: 'info',
      confirmButtonText: 'Ready!',
    });
    goneFishingBtn.removeAttribute('hidden');
  } else if (todos.length > 0 && todos.every((todo) => todo.isComplete)) {
    // alert();
    Swal.fire({
      title: 'Gone Fishing!!!',
      text: 'All Todos done',
      icon: 'success',
      confirmButtonText: 'Whoohoo!',
    });
  }
  todos.map((todo) => {
    todoList.innerHTML += `
         <tr id=${todo.id}>
            <td>${todo.isComplete ? '✅' : '🔲'}</td>
             <td>${todo.text}</td>
             <td>${moment(todo.create_date).format('L')}</td> 
             <td>${todo.complete_date ? moment(todo.complete_date).format('L') : ''}</td>
             <td>
             <button id="complete-btn-id" onClick="handleCompleteTodo(event)">${
               todo.isComplete ? 'Undo' : 'Done'
             }</button>
            </td>
             <td>
                 <button id="edit-btn-id" onClick="handleEditTodo(event)">Edit</button>
             </td>
             <td>
                 <button id="delete-btn-id" onClick="handleDeleteTodo(event)">Delete</button>
             </td>
         </tr>`;
  });
  return;
}

function handleCompleteTodo(event) {
  const todoId = event.target.closest('tr').id;
  axios
    .put(`/todos/${todoId}`)
    .then(() => getTodos())
    .catch((error) => {
      console.error('Error Marking todo complete', error);
    });
  return;
}

function handleEditTodo(event) {
  //open dialog box
  document.querySelector('dialog').showModal();
  //edit todo id
  editTodoId = event.target.closest('tr').id;

  //load todo information to be edited
  const rowInfo = event.target.closest('tr');
  let dialogInput = document.getElementById('dialog-todo-id');
  dialogInput.value = rowInfo.querySelector('td:nth-child(2)').textContent;
  return;
}

function closeDialog() {
  document.querySelector('dialog').close();
  return;
}

function updateTodo(event) {
  event.preventDefault();
  //get new input values from DOM
  let dialogInput = document.getElementById('dialog-todo-id').value;

  //PUT request to update
  axios
    .put(`todos/update/${editTodoId}`, { text: dialogInput })
    .then(() => {
      // reset/clear dialog form and global edit todo id
      document.getElementById('dialog-form-id').reset();
      editTodoId = '';
      dialogInput = '';
      getTodos();
    })
    .catch((error) => {
      console.error(`Error in Updating Todo`, error);
    });

  //close dialog
  closeDialog();
  return;
}

async function handleDeleteTodo(event) {
  const todoId = event.target.closest('tr').id;
  try {
    await axios.delete(`/todos/${todoId}`);
    getTodos();
  } catch (error) {
    console.error('Error deleting todo from list', error);
  }
}

// reset for testing
function resetTodos() {
  axios
    .put('todos/reset')
    .then(() => {
      let goneFishingBtn = document.getElementById('gone-fishing-btn-id');
      goneFishingBtn.setAttribute('hidden', true);
      getTodos();
    })
    .catch((error) => {
      console.error('Error Reseting Todos', error);
    });
}

// gone fishing protocol
function goneFishing() {
  axios
    .put('todos/gone-fishing')
    .then(() => getTodos())
    .catch((error) => {
      console.error('Error Going Fishing', error);
    });
}

// First call...
onReady();

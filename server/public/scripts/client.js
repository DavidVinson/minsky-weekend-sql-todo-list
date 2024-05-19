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
  todoList.innerHTML = '';
  todos.map((todo) => {
    todoList.innerHTML += `
         <tr id=${todo.id}>
             <td>${todo.text}</td>
             <td>${todo.isComplete}</td> 
             <td>${todo.create_date}</td> 
             <td>${todo.complete_date}</td>
             <td>
             <button id="complete-btn-id" onClick="handleCompleteTodo(event)">Complete</button>
         </td>
             <td>
                 <button id="edit-btn-id" onClick="handleEditTodo(event)">Edit</button>
             </td>
             <td>
                 <button id="delete-btn-id" onClick="handleDeleteTodo(event)">Delete</button>
             </td>
         </tr>`;
  });
}

function handleCompleteTodo(event, editTodoId) {
  const todoId = event.target.closest('tr').id || editTodoId;
  axios
    .put(`/todos/${todoId}`)
    .then(() => getTodos())
    .catch((error) => {
      console.error('Error Marking todo complete', error);
    });
}

function handleEditTodo(event) {
  console.log('handle edit todo!', event.target.closest('tr').id);
  const todoId = event.target.closest('tr').id;
  const rowInfo = event.target.closest('tr');
  console.log('TODO: ', rowInfo.querySelector('td').textContent);
  const inputElement = document.getElementById('todo-id');
  const submitFormBtn = document.getElementById('submit-btn-id');
  const form = document.getElementById('form-id');
  form.removeAttribute('onsubmit');
  form.setAttribute('onsubmit', 'updateTodo(event)');
  console.log('new form submit', form);

  submitFormBtn.textContent = 'Update Todo';
  inputElement.value = rowInfo.querySelector('td').textContent;
  //   if (confirm(`Edit todo ${rowInfo.id}`)) {
  //     axios
  //       .put(`todos/update/${todoId}`, { text: inputElement.value })
  //       .then(() => {
  //         submitFormBtn.textContent = 'Add Todo';
  //         document.getElementById('form-id').reset();
  //         getTodos();
  //       })
  //       .catch((error) => {
  //         console.error(`Error in Updating Todo`, error);
  //       });
  //   } else {
  //     // clear form
  //     submitFormBtn.textContent = 'Add Todo';
  //     document.getElementById('form-id').reset();
  //   }
  return;
}

function updateTodo(event) {
  event.preventDefault();
  console.log('Updating todo...');
  return;
}

function handleDeleteTodo(event) {
  const todoId = event.target.closest('tr').id;
  axios
    .delete(`/todos/${todoId}`)
    .then(() => getTodos())
    .catch((error) => {
      console.error('Error deleting todo from list', error);
    });
}

// reset for testing
function resetTodos() {
  axios
    .put('todos/reset')
    .then(() => getTodos())
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

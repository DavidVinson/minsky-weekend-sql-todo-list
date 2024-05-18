function onReady() {
  console.log('JS is sourced!');
  // GET Todos
  getTodos();
}

// handle form submission
function addTodo(event) {
  event.preventDefault();
  axios
    .post('/todos', {
      text: document.getElementById('todo-id').value,
    })
    .then((response) => {
      console.log('Todo Posted!');
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
  console.log('Get todos from server');
  axios.get('/todos').then((response) => {
    const allTodos = response.data;
    console.log('ALL TODOS', allTodos);
    //add to DOM
    let todoList = document.querySelector('tbody');
    console.log('todoList', todoList);
    todoList.innerHTML = '';
    allTodos.map((todo) => {
      todoList.innerHTML += `
        <tr id=${todo.id}>
        <td>${todo.text}</td>
        <td>${todo.isComplete}</td> 
        <td>${todo.create_date}</td> 
        <td>${todo.complete_date}</td>
        <td>
        <button>Edit</button>
        </td>
        <td>
        <button>Delete</button>
        </td>
        </tr>`;
    });
  });
}

onReady();

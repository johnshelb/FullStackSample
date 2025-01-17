 // Function to fetch ToDos from the server and display them
 async function fetchTodos() {
    try {
        const response = await fetch('http://localhost:3000/todos');
        if (!response.ok) {
            throw new Error('Failed to fetch ToDos');
        }
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error(error);
    }
}

// Function to display ToDos in the list
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing list items
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = todo.title;

        // Add button for updating ToDo
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
    // Prompt the user to enter updated text
        const updatedText = prompt('Enter updated text:', todo.text);
        if (updatedText !== null && updatedText.trim() !== '') {
            // Call the updateTodo function to handle the update operation
                updateTodo(todo._id, updatedText);
            }
        })

        listItem.appendChild(updateButton);



        // Add button for deleting ToDo
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(todo._id));
        listItem.appendChild(deleteButton);

        todoList.appendChild(listItem);
    });
}

// Function to handle form submission for creating a new ToDo
async function addTodo(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value;
    try {
        const response = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        if (!response.ok) {
            throw new Error('Failed to add ToDo');
        }
        fetchTodos(); // Refresh the ToDo list
    } catch (error) {
        console.error(error);
    }
}

function updateTodo(todoId, updatedText) {
    console.log(todoId)
// Send an HTTP PATCH request to update the todo item in the database
    fetch(`http://localhost:3000/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: updatedText })
    })
    .then(response => {
        if (response.ok) {
            // Update the todo item in the UI if the request is successful
            const todoTextElement = document.getElementById(`todo-${todoId}-text`);
            if (todoTextElement) {
                todoTextElement.textContent = updatedText;
            }
        } else {
            console.error('Failed to update todo:', response.statusText);
        }
        fetchTodos()
    })
    .catch(error => {
        console.error('Error updating todo:', error);
    });
}
// Function to handle deleting a ToDo
async function deleteTodo(todoId) {
    try {
        const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete ToDo');
        }
        fetchTodos(); // Refresh the ToDo list
    } catch (error) {
        console.error(error);
    }
}
// Add event listener for form submission
const todoForm = document.getElementById('todo-form');
todoForm.addEventListener('submit', addTodo);

// Fetch ToDos when the page loads
fetchTodos();
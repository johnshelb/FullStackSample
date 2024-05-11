// Require dependencies
const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const cors = require('cors');
// Create Express app
const app = express();
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from the public directory

// Connect to MongoDB
mongoose.connect('mongodb+srv://johnshelby:mongopassword@cluster0.w0jo9.mongodb.net/todoApp?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// Routes for CRUD operations
// Get all ToDos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving ToDos' });
    }
});

// Create a ToDo
app.post('/todos', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ error: 'Error creating ToDo' });
    }
});

// Update a ToDo
app.patch('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(id, {title:req.body.title}, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'ToDo not found' });
        }
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ error: 'Error updating ToDo' });
    }
});

// Delete a ToDo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'ToDo not found' });
        }
        res.json({ message: 'ToDo deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting ToDo' });
    }
});

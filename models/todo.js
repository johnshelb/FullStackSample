// models/todo.js

const mongoose = require('mongoose');

// Define ToDo schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

// Create ToDo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

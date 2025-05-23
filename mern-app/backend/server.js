const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/appdb';

// Middleware
app.use(cors());
app.use(express.json());

// Create logs directory if it doesn't exist
if (!fs.existsSync('/var/log')) {
  fs.mkdirSync('/var/log', { recursive: true });
}

// Create write stream for logging
const logStream = fs.createWriteStream('/var/log/backend.log', { flags: 'a' });

// Logging middleware
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  logStream.write(log);
  next();
});

// MongoDB connection
console.log('Attempting to connect to MongoDB at:', mongoUrl);
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
  logStream.write(`${new Date().toISOString()} - MongoDB connected successfully\n`);
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  logStream.write(`${new Date().toISOString()} - MongoDB connection error: ${err.message}\n`);
});

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    logStream.write(`${new Date().toISOString()} - Error fetching todos: ${err.message}\n`);
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const todo = new Todo({ text: req.body.text });
    await todo.save();
    logStream.write(`${new Date().toISOString()} - Todo created: ${todo._id}\n`);
    res.status(201).json(todo);
  } catch (err) {
    logStream.write(`${new Date().toISOString()} - Error creating todo: ${err.message}\n`);
    res.status(400).json({ error: 'Error creating todo' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    logStream.write(`${new Date().toISOString()} - Todo updated: ${todo._id}\n`);
    res.json(todo);
  } catch (err) {
    logStream.write(`${new Date().toISOString()} - Error updating todo: ${err.message}\n`);
    res.status(400).json({ error: 'Error updating todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    logStream.write(`${new Date().toISOString()} - Todo deleted: ${req.params.id}\n`);
    res.status(204).end();
  } catch (err) {
    logStream.write(`${new Date().toISOString()} - Error deleting todo: ${err.message}\n`);
    res.status(400).json({ error: 'Error deleting todo' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  logStream.write(`${new Date().toISOString()} - Server started on port ${port}\n`);
}); 
// backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// ---- Express App Initialization ----
const app = express();
const port = process.env.PORT || 8080;

// ---- Middleware ----
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable JSON body parsing for API requests

// ---- MongoDB Connection ----
// The MongoDB connection string will be provided as an environment variable.
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(mongoUri)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Exit the process with failure code if we can't connect to the database.
    process.exit(1);
  });

// ---- Todo Schema and Model ----
interface ITodo extends mongoose.Document {
  task: string;
  completed: boolean;
  createdAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>({
  task: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

// ---- API Routes ----

// GET /todos - Retrieve all todo items
app.get('/api/todos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// POST /todos - Create a new todo item
app.post('/api/todos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.task || typeof req.body.task !== 'string') {
      return res.status(400).json({ message: 'Task is required and must be a string.' });
    }
    const newTodo = new Todo({
      task: req.body.task,
      completed: req.body.completed || false
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    next(error);
  }
});

// PUT /todos/:id - Update a todo item
app.put('/api/todos/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Todo ID.' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { task, completed },
            { new: true, runValidators: true } // 'new: true' returns the updated document
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        res.json(updatedTodo);
    } catch (error) {
        next(error);
    }
});


// DELETE /todos/:id - Delete a todo item
app.delete('/api/todos/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Todo ID.' });
        }

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        next(error);
    }
});


// ---- Root Endpoint ----
app.get('/', (req: Request, res: Response) => {
  res.send('Todo App Backend is running!');
});

// ---- Error Handling Middleware ----
// This should be the last middleware added.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// ---- Server Startup ----
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

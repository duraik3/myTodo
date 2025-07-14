import React, { useState, useEffect } from 'react';
import type { Todo } from './types/todo';
import { getTodos, addTodo, updateTodo, deleteTodo, callGeminiAPI } from './services/api';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // ✨ State for Gemini features
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [suggestedTask, setSuggestedTask] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);
      } catch (err) {
        setError('Failed to fetch todos. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (task: string) => {
    try {
      const newTodo = await addTodo(task);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      setSuggestedTask(''); // Clear suggestion after adding
    } catch (err) {
      setError('Failed to add todo.');
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await updateTodo(id, { completed });
      setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? updatedTodo : todo)));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  // ✨ --- Gemini Feature Handlers --- ✨

  const handleBreakdownTask = async (task: string) => {
    setModalTitle(`Sub-tasks for: "${task}"`);
    setModalContent('');
    setIsModalOpen(true);
    setIsGeminiLoading(true);
    try {
      const prompt = `Break the following task into a list of small, actionable sub-tasks. Present it as a simple, bulleted list. Do not add any introductory text. Task: "${task}"`;
      const result = await callGeminiAPI(prompt);
      setModalContent(result);
    } catch (err) {
      setModalContent('Sorry, I couldn\'t break down the task. Please try again.');
    } finally {
      setIsGeminiLoading(false);
    }
  };
  
  const handleSuggestTask = async () => {
    setIsGeminiLoading(true);
    setError(null);
    try {
        const existingTasks = todos.map(t => `- ${t.task} (${t.completed ? 'Done' : 'To Do'})`).join('\n');
        const prompt = `Based on the following list of tasks, suggest one logical next task to add. Provide only the task text itself, without any extra formatting or explanation.\n\nMy Tasks:\n${existingTasks}`;
        const result = await callGeminiAPI(prompt);
        setSuggestedTask(result.replace(/\"/g, "")); // Set suggestion for the input form
    } catch (err) {
        setError("Sorry, couldn't get a suggestion right now.");
    } finally {
        setIsGeminiLoading(false);
    }
  };


  return (
    <div className="">
        <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title={modalTitle}
        >
            {isGeminiLoading ? <p>Thinking...</p> : <pre className="">{modalContent}</pre>}
        </Modal>

        <header className="">
            <div className="">
                <h1 className="">Todo App</h1>
            </div>
        </header>

        <main className="">
            <div className="">
                <AddTodoForm onAdd={handleAddTodo} suggestedTask={suggestedTask} setSuggestedTask={setSuggestedTask} />
                <div className="">
                    <button 
                        onClick={handleSuggestTask} 
                        disabled={isGeminiLoading}
                        className=""
                    >
                        {isGeminiLoading && !isModalOpen ? 'Thinking...' : '✨ Suggest a Task'}
                    </button>
                </div>

                {error && <p className="">{error}</p>}
                
                {loading ? (
                    <p className="">Loading...</p>
                ) : (
                    <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onBreakdown={handleBreakdownTask} />
                )}
            </div>
        </main>
    </div>
  );
};

export default App;
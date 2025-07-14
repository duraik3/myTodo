import type { AddTodoFormProps } from '../types/todo'; // Adjust the import path as necessary
import { useState } from 'react';

  const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, suggestedTask, setSuggestedTask }) => {
    const [task, setTask] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!task.trim()) return;
      onAdd(task);
      setTask('');
    };
    
    // Use suggested task when the input is empty
    const currentTask = task || suggestedTask;
  
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={currentTask}
          onChange={(e) => {
              setTask(e.target.value);
              if (suggestedTask) setSuggestedTask(''); // Clear suggestion on type
          }}
          placeholder="What needs to be done?"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition">
          Add
        </button>
      </form>
    );
  };

export default AddTodoForm;
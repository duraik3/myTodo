import type { TodoItemProps } from "../types/todo";
  
  export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onBreakdown }) => {
    return (
      <li className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0">
        <div className="flex items-center flex-grow">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo._id, !todo.completed)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className={`ml-4 text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.task}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBreakdown(todo.task)}
            className="text-purple-500 hover:text-purple-700 transition-colors p-1 rounded-full hover:bg-purple-100"
            title="Break down task with AI"
          >
            <span role="img" aria-label="Breakdown task">✨</span>
          </button>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label={`Delete task ${todo.task}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </li>
    );
  };
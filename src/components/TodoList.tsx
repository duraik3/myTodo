import type { TodoListProps } from "../types/todo";
import { TodoItem } from "./TodoItem";
const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onBreakdown }) => {
    if (todos.length === 0) {
      return <p className="text-center text-gray-500 py-8">Your todo list is empty. Add a task to get started!</p>;
    }
  
    return (
      <ul className="bg-white rounded-lg shadow-md overflow-hidden">
        {todos.map(todo => (
          <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} onBreakdown={onBreakdown} />
        ))}
      </ul>
    );
  };

export default TodoList;
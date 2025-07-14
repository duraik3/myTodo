export interface Todo {
    _id: string;
    task: string;
    completed: boolean;
    createdAt: string;
  }

  export interface AddTodoFormProps {
      onAdd: (task: string) => void;
      suggestedTask: string;
      setSuggestedTask: (task: string) => void;
    }

  export interface TodoItemProps {
      todo: Todo;
      onToggle: (id: string, completed: boolean) => void;
      onDelete: (id: string) => void;
      onBreakdown: (task: string) => void; // ✨ New prop
    }

   export  interface TodoListProps {
      todos: Todo[];
      onToggle: (id: string, completed: boolean) => void;
      onDelete: (id: string) => void;
      onBreakdown: (task: string) => void; // ✨ New prop
    }
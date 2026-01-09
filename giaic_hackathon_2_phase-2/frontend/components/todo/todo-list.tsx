import { Task } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './todo-item';

interface TodoListProps {
  todos: Task[];
  onRefresh: () => void;
}

const TodoList = ({ todos, onRefresh }: TodoListProps) => {
  // Separate completed and incomplete tasks
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {incompleteTodos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span>Active Tasks</span>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {incompleteTodos.length}
            </span>
          </h2>
          <AnimatePresence>
            <div className="space-y-3">
              {incompleteTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      )}

      {completedTodos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span>Completed Tasks</span>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {completedTodos.length}
            </span>
          </h2>
          <AnimatePresence>
            <div className="space-y-3">
              {completedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      )}

      {todos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 text-gray-500">
          <p>No todos to display</p>
        </motion.div>
      )}
    </div>
  );
};

export default TodoList;
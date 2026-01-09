import { useState } from 'react';
import { Task, Recurrence } from '@/lib/types';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import EditTodoModal from './edit-todo-modal';

interface TodoItemProps {
  todo: Task;
  onRefresh: () => void;
}

const TodoItem = ({ todo, onRefresh }: TodoItemProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await apiService.tasks.toggleComplete(todo.id, !todo.completed);
      onRefresh();
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiService.tasks.delete(todo.id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    onRefresh(); // Refresh after editing
  };

  // Determine if the task is overdue
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 transition-all duration-200 hover:shadow-md ${todo.completed ? 'bg-gray-100/70 opacity-80' : 'bg-white'}`}>
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {todo.priority && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    todo.priority === 'High' ? 'bg-red-100 text-red-800' :
                    todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {todo.priority}
                  </span>
                )}
                {todo.dueDate && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formatDate(todo.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                )}
                {todo.recurrence && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {todo.recurrence.charAt(0).toUpperCase() + todo.recurrence.slice(1)}
                  </span>
                )}
                {todo.tags && todo.tags.length > 0 && todo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={isDeleting}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>

        {showEditModal && (
          <EditTodoModal
            todo={todo}
            onClose={handleModalClose}
            onSuccess={handleModalClose}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default TodoItem;
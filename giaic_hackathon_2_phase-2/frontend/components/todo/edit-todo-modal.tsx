import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { Task, Priority, Recurrence } from '@/lib/types';
import PrioritySelector from './priority-selector';
import TagInput from './tag-input';
import RecurringTaskConfig from './recurring-task-config';
import DueDatePicker from './due-date-picker';

// Define the Zod schema for validation
const editTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  recurrence: z.nativeEnum(Recurrence).nullable().optional(),
});

// Define the form data type
type EditTodoFormData = z.infer<typeof editTodoSchema>;

interface EditTodoModalProps {
  todo: Task;
  onClose: () => void;
  onSuccess: () => void;
}

const EditTodoModal = ({ todo, onClose, onSuccess }: EditTodoModalProps) => {
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [tags, setTags] = useState<string[]>(todo.tags || []);
  const [dueDate, setDueDate] = useState<Date | null>(todo.dueDate ? new Date(todo.dueDate) : null);
  const [recurrence, setRecurrence] = useState<Recurrence | null>(todo.recurrence || null);

  // Set up the form with React Hook Form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTodoFormData>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      tags: todo.tags || [],
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
      recurrence: todo.recurrence || null,
    },
  });

  const onSubmit = async (data: EditTodoFormData) => {
    setLoading(true);
    try {
      // Create the todo update data object
      const updateData = {
        title: data.title,
        description: data.description,
        priority,
        tags,
        dueDate: dueDate || undefined,
        recurrence: recurrence || undefined,
      };

      // Call the API to update the todo
      const response = await apiService.tasks.update(todo.id, updateData);

      if (response.success) {
        onSuccess(); // Call the success callback
      } else {
        console.error('Error updating todo:', response.error);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Todo"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          type="text"
          placeholder="Enter todo title"
          {...register('title')}
          error={errors.title?.message}
          required
        />

        <Input
          label="Description"
          type="text"
          placeholder="Enter description (optional)"
          {...register('description')}
          error={errors.description?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <PrioritySelector value={priority} onChange={setPriority} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <TagInput value={tags} onChange={setTags} placeholder="Add tags..." />
        </div>

        <DueDatePicker value={dueDate} onChange={setDueDate} />

        <RecurringTaskConfig value={recurrence} onChange={setRecurrence} />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading}
          >
            Update Todo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTodoModal;
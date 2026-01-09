import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TaskFilter, Priority } from '@/lib/types';

interface FilterControlsProps {
  currentFilters: TaskFilter;
  onFilterChange: (filters: TaskFilter) => void;
}

const FilterControls = ({ currentFilters, onFilterChange }: FilterControlsProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const statusOptions = [
    { value: undefined, label: 'All', active: currentFilters.completed === undefined },
    { value: false, label: 'Active', active: currentFilters.completed === false },
    { value: true, label: 'Completed', active: currentFilters.completed === true },
  ];

  const priorityOptions = [
    { value: undefined, label: 'All', active: currentFilters.priority === undefined },
    { value: Priority.HIGH, label: 'High', active: currentFilters.priority === Priority.HIGH },
    { value: Priority.MEDIUM, label: 'Medium', active: currentFilters.priority === Priority.MEDIUM },
    { value: Priority.LOW, label: 'Low', active: currentFilters.priority === Priority.LOW },
  ];

  const handleStatusChange = (value: boolean | undefined) => {
    onFilterChange({ ...currentFilters, completed: value });
  };

  const handlePriorityChange = (value: Priority | undefined) => {
    onFilterChange({ ...currentFilters, priority: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(option => (
          <Button
            key={option.label}
            variant={option.active ? 'secondary' : 'outline'}
            onClick={() => handleStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {priorityOptions.map(option => (
          <Button
            key={option.label}
            variant={option.active ? 'secondary' : 'outline'}
            onClick={() => handlePriorityChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              defaultValue={currentFilters.tags?.join(', ') || ''}
              placeholder="work, personal, urgent"
              onBlur={(e) => {
                const tags = e.target.value
                  ? e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  : undefined;
                onFilterChange({ ...currentFilters, tags });
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
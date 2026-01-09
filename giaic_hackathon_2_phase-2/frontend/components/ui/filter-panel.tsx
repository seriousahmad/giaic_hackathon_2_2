import { useState } from 'react';
import { Button } from '../ui/button';
import { TaskFilter, Priority } from '@/lib/types';

interface FilterPanelProps {
  onFilterChange: (filters: TaskFilter) => void;
  currentFilters: TaskFilter;
  className?: string;
}

const FilterPanel = ({ onFilterChange, currentFilters, className }: FilterPanelProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(currentFilters.completed);
  const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>(currentFilters.priority);
  const [tagFilter, setTagFilter] = useState<string>(currentFilters.tags?.join(',') || '');

  const applyFilters = () => {
    const filters: TaskFilter = {
      completed: statusFilter,
      priority: priorityFilter,
      tags: tagFilter ? tagFilter.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
    };

    onFilterChange(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setStatusFilter(undefined);
    setPriorityFilter(undefined);
    setTagFilter('');
    onFilterChange({});
    setShowFilters(false);
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={statusFilter === undefined ? 'outline' : 'secondary'}
                onClick={() => setStatusFilter(undefined)}
              >
                All
              </Button>
              <Button
                type="button"
                variant={statusFilter === false ? 'outline' : 'secondary'}
                onClick={() => setStatusFilter(false)}
              >
                Active
              </Button>
              <Button
                type="button"
                variant={statusFilter === true ? 'outline' : 'secondary'}
                onClick={() => setStatusFilter(true)}
              >
                Completed
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={priorityFilter === undefined ? 'outline' : 'secondary'}
                onClick={() => setPriorityFilter(undefined)}
              >
                All
              </Button>
              <Button
                type="button"
                variant={priorityFilter === Priority.HIGH ? 'outline' : 'secondary'}
                onClick={() => setPriorityFilter(Priority.HIGH)}
              >
                High
              </Button>
              <Button
                type="button"
                variant={priorityFilter === Priority.MEDIUM ? 'outline' : 'secondary'}
                onClick={() => setPriorityFilter(Priority.MEDIUM)}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={priorityFilter === Priority.LOW ? 'outline' : 'secondary'}
                onClick={() => setPriorityFilter(Priority.LOW)}
              >
                Low
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              placeholder="work, personal, urgent"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              type="button"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { FilterPanel };
import { TaskSort } from '@/lib/types';

interface SortControlsProps {
  currentSort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
}

const SortControls = ({ currentSort, onSortChange }: SortControlsProps) => {
  const sortOptions = [
    { field: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', label: 'Updated Date' },
    { field: 'dueDate', label: 'Due Date' },
    { field: 'priority', label: 'Priority' },
    { field: 'title', label: 'Title' },
  ];

  const directions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  return (
    <div className="flex space-x-4 items-center">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={currentSort.field}
          onChange={(e) => onSortChange({ ...currentSort, field: e.target.value as any })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          {sortOptions.map(option => (
            <option key={option.field} value={option.field}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Direction
        </label>
        <select
          value={currentSort.direction}
          onChange={(e) => onSortChange({ ...currentSort, direction: e.target.value as 'asc' | 'desc' })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          {directions.map(dir => (
            <option key={dir.value} value={dir.value}>
              {dir.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortControls;
import { Priority } from '@/lib/types';

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const PrioritySelector = ({ value, onChange }: PrioritySelectorProps) => {
  const priorityOptions = [
    { value: Priority.HIGH, label: 'High', color: 'text-red-600 bg-red-100' },
    { value: Priority.MEDIUM, label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: Priority.LOW, label: 'Low', color: 'text-green-600 bg-green-100' },
  ];

  return (
    <div className="flex space-x-2">
      {priorityOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === option.value
              ? `${option.color} ring-2 ring-offset-2 ring-blue-500`
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PrioritySelector;
import { Recurrence } from '@/lib/types';

interface RecurringTaskConfigProps {
  value: Recurrence | null;
  onChange: (recurrence: Recurrence | null) => void;
}

const RecurringTaskConfig = ({ value, onChange }: RecurringTaskConfigProps) => {
  const recurrenceOptions = [
    { value: null, label: 'None' },
    { value: Recurrence.DAILY, label: 'Daily' },
    { value: Recurrence.WEEKLY, label: 'Weekly' },
    { value: Recurrence.MONTHLY, label: 'Monthly' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Recurrence
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {recurrenceOptions.map((option) => (
          <button
            key={option.value || 'none'}
            type="button"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              value === option.value
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecurringTaskConfig;
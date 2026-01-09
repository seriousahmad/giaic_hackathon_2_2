import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

interface DueDatePickerProps {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  className?: string;
}

const DueDatePicker = ({ value, onChange, className }: DueDatePickerProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(new Date(e.target.value));
    } else {
      onChange(null);
    }
  };

  const formattedDate = value ? formatDate(value) : '';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Due Date
      </label>
      <div className="flex items-center space-x-2">
        <Input
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          className="flex-1"
        />
        {formattedDate && (
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
};

export default DueDatePicker;
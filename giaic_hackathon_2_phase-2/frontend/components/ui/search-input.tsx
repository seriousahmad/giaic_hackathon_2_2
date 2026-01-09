import { Input } from './input';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

const SearchInput = ({
  onSearch,
  debounceMs = 300,
  className,
  ...props
}: SearchInputProps) => {
  let timeoutId: NodeJS.Timeout;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    const query = e.target.value;

    timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, debounceMs);
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <Input
        {...props}
        onChange={handleSearch}
        className="pl-10 w-full"
        placeholder="Search todos..."
      />
    </div>
  );
};

export { SearchInput };
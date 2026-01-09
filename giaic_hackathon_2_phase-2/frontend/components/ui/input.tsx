// Reusable Input component with validation support
import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    validate?: (value: string) => string | undefined;
  };
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      required = false,
      fullWidth = false,
      startIcon,
      endIcon,
      validation,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [validationError, setValidationError] = useState<string | undefined>();

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validation) {
        const value = e.target.value;
        let error: string | undefined;

        // Required validation
        if (validation.required && !value.trim()) {
          error = 'This field is required';
        }
        // Pattern validation
        else if (validation.pattern && value && !validation.pattern.test(value)) {
          error = 'Invalid format';
        }
        // Min length validation
        else if (validation.minLength && value.length < validation.minLength) {
          error = `Minimum length is ${validation.minLength} characters`;
        }
        // Max length validation
        else if (validation.maxLength && value.length > validation.maxLength) {
          error = `Maximum length is ${validation.maxLength} characters`;
        }
        // Custom validation
        else if (validation.validate) {
          error = validation.validate(value);
        }

        setValidationError(error);
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Clear validation error on change if there was one
      if (validationError) {
        setValidationError(undefined);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const hasError = Boolean(error || validationError);

    const widthClass = fullWidth ? 'w-full' : '';

    const baseClasses =
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const inputClasses = cn(
      baseClasses,
      {
        'border-red-500 focus-visible:ring-red-500': hasError,
        'border-gray-300 focus-visible:ring-blue-500': !hasError,
      },
      widthClass,
      className
    );

    return (
      <div className={cn('flex flex-col space-y-1', widthClass)}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputClasses,
              startIcon ? 'pl-10' : '',
              endIcon ? 'pr-10' : ''
            )}
            ref={ref}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || hasError) && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className={cn(
              'text-sm',
              hasError ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {hasError ? error || validationError : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
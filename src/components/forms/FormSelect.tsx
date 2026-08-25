import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function FormSelect({ name, label, options, placeholder, className, ...props }: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1.5 w-full">
          {label && (
            <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </label>
          )}
          <select
            id={name}
            {...field}
            value={field.value ?? ''}
            className={cn(
              'flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-destructive font-medium">{error.message}</p>}
        </div>
      )}
    />
  );
}

import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

export function FormTextarea({ name, label, className, ...props }: FormTextareaProps) {
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
          <textarea
            id={name}
            {...field}
            value={field.value ?? ''}
            className={cn(
              'flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            {...props}
          />
          {error && <p className="mt-1 text-xs text-destructive font-medium">{error.message}</p>}
        </div>
      )}
    />
  );
}

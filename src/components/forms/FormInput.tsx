import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputProps } from '@/components/ui/input';

export interface FormInputProps extends Omit<InputProps, 'name'> {
  name: string;
  label?: string;
  helperText?: string;
}

export function FormInput({ name, label, helperText, ...props }: FormInputProps) {
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
          <Input id={name} {...field} value={field.value ?? ''} error={error?.message} {...props} />
          {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
        </div>
      )}
    />
  );
}

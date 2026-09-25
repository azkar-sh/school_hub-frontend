import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputProps } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends Omit<InputProps, 'name'> {
  name: string;
  label?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
}

export function FormInput({
  name,
  label,
  helperText,
  type,
  showPasswordToggle,
  className,
  ...props
}: FormInputProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);

  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType && showPassword ? 'text' : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1.5 w-full">
          {label && (
            <label
              htmlFor={name}
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {label}
            </label>
          )}
          <div className="relative w-full">
            <Input
              id={name}
              {...field}
              type={effectiveType}
              value={field.value ?? ''}
              error={error?.message}
              className={cn(isPasswordType && showPasswordToggle !== false ? 'pr-10' : '', className)}
              {...props}
            />
            {isPasswordType && showPasswordToggle !== false && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
          {error && (
            <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in duration-150">
              {error.message}
            </p>
          )}
          {helperText && !error && (
            <p className="text-xs text-muted-foreground">{helperText}</p>
          )}
        </div>
      )}
    />
  );
}


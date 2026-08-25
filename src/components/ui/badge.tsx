import * as React from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'role' | 'teacher' | 'student' | 'parent';
  role?: UserRole;
}

export function Badge({ className, variant = 'default', role, children, ...props }: BadgeProps) {
  let badgeVariantClass = 'bg-primary/10 text-primary border-primary/20';

  if (role) {
    if (role === 'TEACHER') {
      badgeVariantClass = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    } else if (role === 'STUDENT') {
      badgeVariantClass = 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
    } else if (role === 'PARENT') {
      badgeVariantClass = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    }
  } else {
    switch (variant) {
      case 'secondary':
        badgeVariantClass = 'bg-secondary text-secondary-foreground border-transparent';
        break;
      case 'outline':
        badgeVariantClass = 'bg-transparent text-foreground border-border';
        break;
      case 'destructive':
        badgeVariantClass = 'bg-destructive/15 text-destructive border-destructive/30';
        break;
      case 'teacher':
        badgeVariantClass = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        break;
      case 'student':
        badgeVariantClass = 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
        break;
      case 'parent':
        badgeVariantClass = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        break;
      default:
        badgeVariantClass = 'bg-primary/10 text-primary border-primary/20';
        break;
    }
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariantClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

'use client';

import { Compass } from 'lucide-react';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';

export default function NotFound() {
  return (
    <ErrorDisplay
      code="404"
      title="Page not found"
      description="The page you are looking for has moved, been removed, or never existed. Check the URL or return to where you started."
      icon={Compass}
      actions="navigation"
    />
  );
}

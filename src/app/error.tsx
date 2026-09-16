'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay
      code="500"
      title="Something went wrong"
      description="An unexpected error interrupted your session. We've logged the issue — try again, or return home and continue where you left off."
      icon={TriangleAlert}
      actions="both"
      showSupport
      onRetry={reset}
    />
  );
}

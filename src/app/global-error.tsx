'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';

export default function GlobalError({
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
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorDisplay
            code="500"
            title="Application error"
            description="A critical error occurred and the application could not recover. Our team has been notified. Please try again or return home."
            icon={TriangleAlert}
            actions="both"
            showSupport
            onRetry={reset}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

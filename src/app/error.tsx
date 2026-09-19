'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPages');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay
      code="500"
      title={t('somethingWentWrong')}
      description={t('unexpectedError')}
      icon={TriangleAlert}
      actions="both"
      showSupport
      onRetry={reset}
    />
  );
}

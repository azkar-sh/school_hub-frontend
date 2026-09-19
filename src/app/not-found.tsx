'use client';

import { Compass } from 'lucide-react';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('ErrorPages');

  return (
    <ErrorDisplay
      code="404"
      title={t('pageNotFound')}
      description={t('notFoundDescription')}
      icon={Compass}
      actions="navigation"
    />
  );
}

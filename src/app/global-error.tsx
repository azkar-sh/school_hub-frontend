'use client';

import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ErrorDisplay } from '@/components/layout/ErrorDisplay';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import enMessages from '../../public/locales/en.json';
import idMessages from '../../public/locales/id.json';

function GlobalErrorContent({
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorDisplay
        code="500"
        title={t('applicationError')}
        description={t('criticalError')}
        icon={TriangleAlert}
        actions="both"
        showSupport
        onRetry={reset}
      />
    </ThemeProvider>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale =
    typeof document !== 'undefined'
      ? document.cookie.match(/NEXT_LOCALE=(\w+)/)?.[1] ??
        (navigator.language?.startsWith('id') ? 'id' : 'en')
      : 'en';
  const messages = locale === 'id' ? idMessages : enMessages;

  return (
    <html lang={locale} suppressHydrationWarning className="font-sans">
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalErrorContent error={error} reset={reset} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

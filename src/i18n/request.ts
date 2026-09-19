import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { routing } from './routing';

type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('NEXT_LOCALE')?.value as Locale | undefined;

  let locale: Locale = routing.defaultLocale as Locale;

  if (cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headerList = await headers();
    const acceptLanguage = headerList.get('accept-language') ?? '';
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (preferred && (routing.locales as readonly string[]).includes(preferred)) {
      locale = preferred as Locale;
    }
  }

  return {
    locale,
    messages: (await import(`../../public/locales/${locale}.json`)).default
  };
});
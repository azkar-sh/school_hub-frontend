'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOCALES = ['en', 'id'] as const;
type Locale = (typeof LOCALES)[number];

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const localeMeta: Record<Locale, { label: string; short: string }> = {
  id: { label: 'Bahasa Indonesia', short: 'ID' },
  en: { label: 'English', short: 'EN' },
};

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return 'id';
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  const stored = match?.[1] as Locale | undefined;
  if (stored && LOCALES.includes(stored)) return stored;
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.substring(0, 2) as Locale;
    if (LOCALES.includes(browserLang)) return browserLang;
  }
  return 'id';
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(getInitialLocale());
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="flex items-center gap-1.5 h-9 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeMeta[locale].label}</span>
        <span className="sm:hidden">{localeMeta[locale].short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {(Object.keys(localeMeta) as Locale[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchLocale(l)}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span>{localeMeta[l].label}</span>
            {locale === l && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
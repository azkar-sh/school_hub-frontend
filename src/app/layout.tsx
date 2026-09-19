import type { Metadata } from 'next';
import { Inter, Geist, Manrope } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'School Hub - Educational Assessment & Learning Platform',
  description: 'Interactive role-based assessment management system for Teachers, Students, and Parents.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={cn("font-sans", manrope.variable)}>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

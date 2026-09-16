'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  GraduationCap,
  ArrowLeft,
  Home,
  RefreshCw,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

export interface ErrorDisplayProps {
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: 'navigation' | 'retry' | 'both';
  showSupport?: boolean;
  onRetry?: () => void;
}

export function ErrorDisplay({
  code,
  title,
  description,
  icon: Icon,
  actions = 'navigation',
  showSupport = false,
  onRetry,
}: ErrorDisplayProps) {
  const router = useRouter();
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            School<span className="text-primary">Hub</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 text-center relative overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[140px] rounded-full pointer-events-none -z-10"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-primary/8 blur-[120px] rounded-full pointer-events-none -z-10"
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-3xl px-8 py-12 sm:px-16 sm:py-16 max-w-xl w-full shadow-2xl shadow-primary/5"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/20"
          >
            <Icon className="h-10 w-10" strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-7xl sm:text-8xl font-black tracking-tighter bg-gradient-to-br from-primary via-primary to-primary/40 bg-clip-text text-transparent leading-none"
          >
            {code}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 text-2xl font-bold tracking-tight"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-3 text-muted-foreground leading-relaxed max-w-md mx-auto"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {(actions === 'navigation' || actions === 'both') && (
              <>
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-xl shadow-md shadow-primary/20"
                  onClick={() => router.push('/')}
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </>
            )}
            {(actions === 'retry' || actions === 'both') && (
              <Button
                variant="default"
                size="lg"
                className="rounded-xl shadow-md shadow-primary/20"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </motion.div>

          {showSupport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 pt-6 border-t border-border/40"
            >
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                <LifeBuoy className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                Need help? Contact{' '}
                <a
                  href="mailto:support@schoolhub.edu"
                  className="ml-1 text-primary font-semibold hover:underline"
                >
                  support@schoolhub.edu
                </a>
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="py-6 border-t border-border/40 text-center text-xs text-muted-foreground">
        © 2026 School Hub Assessment System. All rights reserved.
      </footer>
    </div>
  );
}

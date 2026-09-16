'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoModeBannerProps {
  className?: string;
}

/**
 * Shown across all dashboard pages when the user is in demo/preview mode.
 * Informs the user that data is not live and provides a sign-in prompt.
 */
export function DemoModeBanner({ className }: DemoModeBannerProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border border-warning/30 bg-warning/8 px-4 py-3 text-sm ${className ?? ''}`}
    >
      <div className="flex items-center gap-2.5 text-warning min-w-0">
        <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="font-semibold shrink-0">Preview Mode</span>
        <span className="text-warning/80 text-xs truncate hidden sm:block">
          — You are viewing sample demo data. Sign in with a real account to access live information.
        </span>
      </div>
      <Link href="/login" className="shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="border-warning/40 text-warning hover:bg-warning/15 hover:border-warning/60 text-xs gap-1 h-8"
        >
          Sign In
          <ArrowRight className="w-3 h-3" />
        </Button>
      </Link>
    </div>
  );
}

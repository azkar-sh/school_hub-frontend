'use client';

import * as React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { useAuthStore } from '@/stores/use-auth-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const { activeRole } = useRoleThemeStore();
  const { user, token, fetchProfile } = useAuthStore();

  const currentRole = user?.role || activeRole;

  // Restore the session (and the cached school context) on first dashboard
  // load when we have a token but the user profile isn't in memory yet.
  React.useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-role', currentRole);
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full min-w-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

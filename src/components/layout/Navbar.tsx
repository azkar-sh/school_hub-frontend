'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRoleThemeStore } from '@/stores/use-role-theme-store';
import { RoleThemeSwitcher } from './RoleThemeSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Menu, User as UserIcon, ShieldAlert } from 'lucide-react';

export function Navbar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { activeRole } = useRoleThemeStore();

  const currentRole = user?.role || activeRole;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Left Side: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {onOpenMobileNav && (
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                School<span className="text-primary">Hub</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Assessment System
              </span>
            </div>
          </Link>
          <Badge role={currentRole} className="ml-2 hidden md:inline-flex capitalize">
            {currentRole.toLowerCase()} portal
          </Badge>
        </div>

        {/* Center/Right Side: Role Switcher, Theme Toggle & User Info */}
        <div className="flex items-center gap-3">
          <RoleThemeSwitcher className="hidden md:flex" />
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border/60">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground font-semibold border border-border">
                {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="role" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

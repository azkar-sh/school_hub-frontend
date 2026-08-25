import { create } from 'zustand';
import { UserRole } from '@/types';

interface RoleThemeState {
  activeRole: UserRole;
  setRoleTheme: (role: UserRole) => void;
}

export const useRoleThemeStore = create<RoleThemeState>((set) => ({
  activeRole: 'STUDENT',

  setRoleTheme: (role: UserRole) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-role', role);
    }
    set({ activeRole: role });
  },
}));

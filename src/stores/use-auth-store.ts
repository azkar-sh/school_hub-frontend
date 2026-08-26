import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { apiClient } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True when the current session is a demo/preview (not a real backend login). */
  isDemoMode: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  demoLoginAs: (role: UserRole) => void;
}

const normalizeUser = (userData: any): User => {
  if (!userData) return userData;
  return {
    ...userData,
    id: userData.id || userData.userId || 'user-id',
    name: userData.name || 'User',
    email: userData.email || '',
    role: userData.role || 'STUDENT',
  };
};

/** Returns true when the token belongs to a demo/preview session. */
const isTokenDemo = (token: string | null): boolean =>
  token !== null && token.startsWith('demo_');

const storedToken =
  typeof window !== 'undefined' ? localStorage.getItem('school_hub_token') : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isAuthenticated: false,
  isDemoMode: isTokenDemo(storedToken),
  isLoading: true,

  setAuth: (userRaw: User, token: string) => {
    const user = normalizeUser(userRaw);
    if (typeof window !== 'undefined') {
      localStorage.setItem('school_hub_token', token);
      localStorage.setItem('school_hub_user', JSON.stringify(user));
    }
    // Real logins are never in demo mode
    set({ user, token, isAuthenticated: true, isDemoMode: false, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('school_hub_token');
      localStorage.removeItem('school_hub_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isDemoMode: false, isLoading: false });
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get('/auth/me');
      const rawUser = response.data;
      if (rawUser) {
        const user = normalizeUser(rawUser);
        // Successfully reached the server → real session, not demo
        set({ user, isAuthenticated: true, isDemoMode: false, isLoading: false });
        return;
      }
    } catch {
      // Fallback to local storage when network is offline or token is invalid
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('school_hub_user');
        const token = localStorage.getItem('school_hub_token');
        if (storedUser) {
          try {
            const user = normalizeUser(JSON.parse(storedUser));
            set({
              user,
              isAuthenticated: true,
              isDemoMode: isTokenDemo(token),
              isLoading: false,
            });
            return;
          } catch {
            // invalid JSON in storage
          }
        }
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isDemoMode: false, isLoading: false });
  },

  demoLoginAs: (role: UserRole) => {
    const demoProfiles: Record<UserRole, User> = {
      TEACHER: {
        id: 'demo-teacher-id',
        name: 'Prof. Sarah Jenkins',
        email: 'sarah.jenkins@schoolhub.edu',
        role: 'TEACHER',
      },
      STUDENT: {
        id: 'demo-student-id',
        name: 'Alex Rivera',
        email: 'alex.rivera@student.schoolhub.edu',
        role: 'STUDENT',
      },
      PARENT: {
        id: 'demo-parent-id',
        name: 'Eleanor Rivera',
        email: 'eleanor.rivera@family.com',
        role: 'PARENT',
      },
    };

    const user = demoProfiles[role];
    const dummyToken = `demo_jwt_token_${role.toLowerCase()}_12345`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('school_hub_token', dummyToken);
      localStorage.setItem('school_hub_user', JSON.stringify(user));
    }
    // Demo logins are always in demo mode
    set({ user, token: dummyToken, isAuthenticated: true, isDemoMode: true, isLoading: false });
  },
}));

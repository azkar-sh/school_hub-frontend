import { create } from "zustand";
import { User, UserRole } from "@/types";
import { apiClient } from "@/lib/api-client";
import { useSchoolContextStore } from "@/stores/use-school-context-store";

type RawUser = Partial<User> & { userId?: string };

const isRawUser = (value: unknown): value is RawUser =>
  typeof value === "object" &&
  value !== null &&
  ("id" in value || "userId" in value);

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

const normalizeUser = (userData: RawUser): User => {
  return {
    ...userData,
    id: userData.id || userData.userId || "user-id",
    name: userData.name || "User",
    email: userData.email || "",
    role: userData.role || "STUDENT",
    schoolMemberships: userData.schoolMemberships || [],
  };
};

/** Returns true when the token belongs to a demo/preview session. */
const isTokenDemo = (token: string | null): boolean =>
  token !== null && token.startsWith("demo_");

const storedToken =
  typeof window !== "undefined"
    ? localStorage.getItem("school_hub_token")
    : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isAuthenticated: false,
  isDemoMode: isTokenDemo(storedToken),
  isLoading: true,

  setAuth: (userRaw: User, token: string) => {
    const user = normalizeUser(userRaw);
    if (typeof window !== "undefined") {
      localStorage.setItem("school_hub_token", token);
      localStorage.setItem("school_hub_user", JSON.stringify(user));
    }
    // Real logins are never in demo mode
    set({
      user,
      token,
      isAuthenticated: true,
      isDemoMode: false,
      isLoading: false,
    });
    useSchoolContextStore.getState().initFromUser(user);
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("school_hub_token");
      localStorage.removeItem("school_hub_user");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isDemoMode: false,
      isLoading: false,
    });
    useSchoolContextStore.getState().clear();
  },

  fetchProfile: async () => {
    try {
      set({ isLoading: true });
      // Primary profile fetch: /users/me (returns full user details + schoolMemberships)
      let rawUser: RawUser;
      try {
        const response = await apiClient.get<RawUser>("/users/me");
        rawUser = response.data;
      } catch {
        // Fallback endpoint: /auth/me
        const response = await apiClient.get<RawUser>("/auth/me");
        rawUser = response.data;
      }

      const user = normalizeUser(rawUser);
      set({
        user,
        isAuthenticated: true,
        isDemoMode: false,
        isLoading: false,
      });
      useSchoolContextStore.getState().initFromUser(user);
      return;
    } catch {
      // Fallback to local storage when network is offline or token is invalid
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("school_hub_user");
        const token = localStorage.getItem("school_hub_token");
        if (storedUser) {
          try {
            const parsedUser: unknown = JSON.parse(storedUser);
            if (isRawUser(parsedUser)) {
              const user = normalizeUser(parsedUser);
              set({
                user,
                isAuthenticated: true,
                isDemoMode: isTokenDemo(token),
                isLoading: false,
              });
              useSchoolContextStore.getState().initFromUser(user);
              return;
            }
          } catch {
            // invalid JSON in storage
          }
        }
      }
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isDemoMode: false,
      isLoading: false,
    });
    useSchoolContextStore.getState().clear();
  },

  demoLoginAs: (role: UserRole) => {
    const demoProfiles: Record<UserRole, User> = {
      SCHOOL_ADMIN: {
        id: "demo-admin-id",
        name: "Bu Ratna",
        email: "admin.garuda@learnhub.com",
        role: "SCHOOL_ADMIN",
        schoolMemberships: [
          {
            id: "demo-member-id",
            schoolId: "demo-school-id",
            userId: "demo-admin-id",
            school: { id: "demo-school-id", name: "SMA Garuda Hope" },
          },
        ],
      },
      TEACHER: {
        id: "demo-teacher-id",
        name: "Bu Siti",
        email: "teacher1.garuda@learnhub.com",
        role: "TEACHER",
        schoolMemberships: [
          {
            id: "demo-member-id-2",
            schoolId: "demo-school-id",
            userId: "demo-teacher-id",
            school: { id: "demo-school-id", name: "SMA Garuda Hope" },
          },
        ],
      },
      STUDENT: {
        id: "demo-student-id",
        name: "Budi Santoso",
        email: "student1.garuda@learnhub.com",
        role: "STUDENT",
      },
      PARENT: {
        id: "demo-parent-id",
        name: "Pak Agus",
        email: "parent1.garuda@learnhub.com",
        role: "PARENT",
      },
    };

    const user = demoProfiles[role];
    const dummyToken = `demo_jwt_token_${role.toLowerCase()}_12345`;
    if (typeof window !== "undefined") {
      localStorage.setItem("school_hub_token", dummyToken);
      localStorage.setItem("school_hub_user", JSON.stringify(user));
    }
    // Demo logins are always in demo mode
    set({
      user,
      token: dummyToken,
      isAuthenticated: true,
      isDemoMode: true,
      isLoading: false,
    });
    useSchoolContextStore.getState().initFromUser(user);
  },
}));

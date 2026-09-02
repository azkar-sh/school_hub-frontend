import { create } from "zustand";
import { School, SchoolMember, User } from "@/types";

const ACTIVE_SCHOOL_KEY = "school_hub_active_school_id";
const USER_SCHOOLS_KEY = "school_hub_user_schools";

export interface CachedSchool {
  id: string;
  name: string;
}

interface SchoolContextState {
  /** Schools the current user is a member of (cached from /users/me schoolMemberships). */
  userSchools: CachedSchool[];
  /** The currently selected school id — persisted across pages & reloads. */
  activeSchoolId: string;
  /** Whether the cache has been hydrated from the auth profile. */
  isInitialized: boolean;
  /** Hydrate the cache from the logged-in user's schoolMemberships. */
  initFromUser: (user: User | null) => void;
  /** Set the active school id (persists to localStorage). */
  setActiveSchool: (schoolId: string) => void;
  /** Replace the cached school list (e.g. after admin creates/joins a school). */
  setUserSchools: (schools: CachedSchool[]) => void;
  /** Clear the cache on logout. */
  clear: () => void;
}

const extractSchoolsFromMemberships = (
  memberships?: SchoolMember[],
): CachedSchool[] => {
  if (!Array.isArray(memberships)) return [];
  return memberships
    .map((m) => m.school)
    .filter((s): s is School => Boolean(s && s.id))
    .map((s) => ({ id: s.id, name: s.name }));
};

const readPersistedActiveSchool = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ACTIVE_SCHOOL_KEY) || "";
};

const readPersistedUserSchools = (): CachedSchool[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_SCHOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistActiveSchool = (id: string) => {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_SCHOOL_KEY, id);
  else localStorage.removeItem(ACTIVE_SCHOOL_KEY);
};

const persistUserSchools = (schools: CachedSchool[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_SCHOOLS_KEY, JSON.stringify(schools));
};

export const useSchoolContextStore = create<SchoolContextState>((set, get) => ({
  userSchools: readPersistedUserSchools(),
  activeSchoolId: readPersistedActiveSchool(),
  isInitialized: false,

  initFromUser: (user) => {
    const schools = extractSchoolsFromMemberships(user?.schoolMemberships);
    persistUserSchools(schools);

    // Keep the persisted active school if it is still in the user's memberships,
    // otherwise fall back to the user's first school.
    const currentActive = readPersistedActiveSchool();
    const stillValid =
      currentActive && schools.some((s) => s.id === currentActive);
    const nextActive = stillValid
      ? currentActive
      : schools.length > 0
        ? schools[0].id
        : "";

    persistActiveSchool(nextActive);
    set({
      userSchools: schools,
      activeSchoolId: nextActive,
      isInitialized: true,
    });
  },

  setActiveSchool: (schoolId) => {
    persistActiveSchool(schoolId);
    set({ activeSchoolId: schoolId });
  },

  setUserSchools: (schools) => {
    persistUserSchools(schools);
    const { activeSchoolId } = get();
    const stillValid =
      activeSchoolId && schools.some((s) => s.id === activeSchoolId);
    const nextActive = stillValid
      ? activeSchoolId
      : schools.length > 0
        ? schools[0].id
        : "";
    persistActiveSchool(nextActive);
    set({ userSchools: schools, activeSchoolId: nextActive });
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACTIVE_SCHOOL_KEY);
      localStorage.removeItem(USER_SCHOOLS_KEY);
    }
    set({ userSchools: [], activeSchoolId: "", isInitialized: false });
  },
}));

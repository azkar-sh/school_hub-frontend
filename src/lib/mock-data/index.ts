/**
 * Centralized role-aware mock data for preview/demo mode.
 * All mock data functions return content appropriate for the given role.
 *
 * Split by domain into sibling files; re-exported here so existing
 * `@/lib/mock-data` imports keep working unchanged.
 */
export * from "./assessments";
export * from "./submissions";
export * from "./classes";
export * from "./subjects";
export * from "./dashboard";
export * from "./school-admin";
export * from "./teacher";
export * from "./student";
export * from "./parent";
export * from "./members";
export * from "./children";

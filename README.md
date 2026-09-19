# School Hub — Frontend

Role-based school assessment platform. One portal for School Admin, Teacher, Student, and Parent to manage curriculum, create/take/grade assessments, and track results.

Branded **Learn Hub** in UI. Seeded demo school: **SMA Garuda Hope**.

> **Stack:** Next.js 16 (App Router, `output: standalone`) · React 19 · TypeScript 5 · Tailwind CSS 4 · shadcn + @base-ui/react · Zustand · React Hook Form + Yup · Axios · ExcelJS · next-themes · Framer Motion

---

## Table of Contents

- [What Is This App](#what-is-this-app)
- [MVP Scope](#mvp-scope)
- [Roles & Permissions](#roles--permissions)
- [Domain Model](#domain-model)
- [Routes](#routes)
- [Tech Stack in Detail](#tech-stack-in-detail)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Auth & Demo Mode](#auth--demo-mode)
- [Theming](#theming)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Layer](#api-layer)
- [Conventions for Contributors](#conventions-for-contributors)
- [Deployment](#deployment)
- [Related Docs](#related-docs)

---

## What Is This App

School Hub digitizes the assessment lifecycle for K-12 schools:

1. **Admin** bootstraps the school: creates school record, academic years, subjects/topics, classes, enrolls students, assigns teachers.
2. **Teacher** builds a question bank (MCQ / True-False / Short Answer), creates an assessment bound to a `TeachingAssignment` (teacher + subject + class + academic year), optionally via XLSX import.
3. **Student** takes timed assessments, submits, reviews auto-graded scores and teacher feedback.
4. **Parent** monitors linked children — per-subject averages and submission history.
5. **All roles** share results/analytics views scoped to their access.

Hierarchy: `School → AcademicYear → Class + Subject → Topic → SubTopic → Question → Assessment → Submission → Answer`.

---

## MVP Scope

### Shipped (live backend + demo mock)

| Area | Capabilities |
|---|---|
| **Auth** | Login, register (STUDENT/TEACHER/PARENT), JWT persistence, `fetchProfile` fallback, demo login, logout |
| **Admin Hub** | Create school, academic year, add member, link parent ↔ student |
| **Classes** | Create class, enroll student, assign homeroom, view roster |
| **Subjects & Curriculum** | Create subject / topic / sub-topic; admin creates subjects, teacher+admin edit curriculum |
| **Assessments** | List with search + type/subject/class filters + cards/table toggle + server pagination; create (2-step: details → questions via XLSX template download/import + manual editor); detail |
| **Assessment Player** | Timed quiz, question nav, submit, review (student/parent) |
| **Question Management** | Teacher `ManageQuestionsView` on `assessments/[id]` |
| **Submissions** | List (role-titled), detail, inline manual grading, auto-grade trigger |
| **Results** | Teacher (by subject → student), Student (by subject), Parent (by child → subject) — grouped via `result-grouping.ts`, only SUBMITTED/GRADED counted |
| **Children (Parent)** | Card grid + `children/[studentId]` detail with score badges (≥80 green, ≥60 yellow, <60 red) |
| **Shell** | `AppShell` auth guard, `Navbar` (school switcher, avatar, logout), `Sidebar` (role-filtered), `RoleThemeSwitcher`, `ThemeToggle` (light/dark), `DemoModeBanner`, `DataDisplay` (reusable list), error/404 boundaries |

### Stub / Planned (UI via `GuideResourcePage`, backend pending)

- `/school` — Edit School
- `/academic-years` — list/create
- `/teaching-assignments` — assign teacher
- `/assessments/[id]/results` — submission rows
- `/subjects/[id]` topics and `/subjects/[id]/topics/[topicId]` sub-topics deep pages (noted in `UI_guide_tree.md`)
- `/classes/[id]` detail (Students / Assessments tabs)
- Client-side route guards for role leak — currently sidebar-hides only; relies on backend 403 (`QA_SCENARIOS.md` documents expected 403/redirect)

---

## Roles & Permissions

`UserRole = SCHOOL_ADMIN | TEACHER | STUDENT | PARENT` — defined in `src/types/index.ts`. Registration excludes `SCHOOL_ADMIN`.

### Sidebar visibility

| Nav | Admin | Teacher | Student | Parent |
|---|---:|---:|---:|---:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Admin Hub (`/admin`) | ✓ | — | — | — |
| School (`/school`) | ✓ | — | — | — |
| Academic Years | ✓ | — | — | — |
| Members | ✓ | — | — | — |
| Teaching Assignments | ✓ | — | — | — |
| Assessments | ✓ | ✓ | ✓ | ✓ |
| Submissions | ✓ | ✓ | ✓ | ✓ |
| Classes | ✓ | ✓ | — | ✓ |
| Subjects & Topics | ✓ | ✓ | ✓ | ✓ |
| Results | — | ✓ | ✓ | ✓ |
| Children | — | — | — | ✓ |

Teacher sidebar adds **Create Assessment** quick action.

### Behavior differences

- **Assessments list:** Teacher sees `Manage Questions` + Create; Student sees Start/Continue/Review by `SubmissionStatus`; Parent sees View Results.
- **`assessments/[id]`:** Teacher → `ManageQuestionsView`; Student/Parent → `AssessmentPlayer`.
- **Classes:** `canManageClasses = role === SCHOOL_ADMIN` gates Create/Enroll/Homeroom.
- **Subjects:** `canAddSubject` (admin only), `canEditCurriculum` (admin+teacher).
- **Submissions title:** varies — Teacher `Student Submissions & Grading Hub`, Student `My Submission History`, Parent `Child's Submission History`.

---

## Domain Model

Core types in `src/types/index.ts` (~360 lines):

- **Auth:** `User`, `AuthResponse`, `JwtPayload`, `UserRole`, `ParentRelationship`
- **School:** `School`, `SchoolMember`, `AcademicYear`, `Subject`, `Topic`, `SubTopic`, `Class`, `Enrollment`, `TeachingAssignment`, `HomeroomAssignment`, `ParentStudent`
- **Assessment:** `AssessmentType` (QUIZ/EXAM/ASSIGNMENT), `QuestionType` (MCQ/TRUE_FALSE/SHORT_ANSWER), `Question`, `QuestionOption`, `Assessment`
- **Submission:** `SubmissionStatus` (DRAFT/SUBMITTED/GRADED), `Answer`, `Submission`
- **DTOs:** `CreateSchoolDto`, `CreateAssessmentDto`, `GradeSubmissionDto`, etc.

---

## Routes

### Public `(auth)` + `/`

| Route | Purpose |
|---|---|
| `/` | Landing: hero + 3 role cards → demo login + feature grid |
| `/login` | Email/password + Yup + 4 demo buttons |
| `/register` | Name/email/password/role (no ADMIN) → `authApi.register` |
| `/demo` | 3 role cards → demo login → `/dashboard` |
| `/get-started` | CTA to `/register` + `/login` |

### Dashboard `(dashboard)` — guarded by `AppShell`

| Route | Purpose | State |
|---|---|---|
| `/dashboard` | Role-specific stats + sections | Live + mock |
| `/admin` | 4 tabs: Schools / Academic Years / Members / Parent Link | Live + mock |
| `/members` | Search + role filter + add/detail modals | Live + mock |
| `/classes` | Grid + modals (admin) / read-only (teacher/parent) | Live + mock |
| `/subjects` | List + curriculum modals | Live + mock |
| `/assessments` | `DataDisplay` list, filters, pagination | Live + mock |
| `/assessments/new` | 2-step create + XLSX import/export | Live + mock |
| `/assessments/[id]` | Teacher manage vs Student/Parent player | Live + mock |
| `/submissions` | Role-titled list + search/status filter | Live + mock |
| `/submissions/[id]` | Detail + inline grading + auto-grade | Live + mock |
| `/results` | Teacher / Student / Parent views | Live + mock |
| `/children` | Parent child cards | Live + mock |
| `/children/[studentId]` | Parent child detail | Live + mock |
| `/school`, `/academic-years`, `/teaching-assignments`, `/assessments/[id]/results` | Stubs (`GuideResourcePage`) | Planned |

Error boundaries: `error.tsx`, `global-error.tsx`, `not-found.tsx`.

---

## Tech Stack in Detail

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router, `output: standalone` |
| Language | TypeScript 5 |
| Styling | Tailwind 4 + `@tailwindcss/postcss` + `tw-animate-css` |
| UI primitives | shadcn + `@base-ui/react` (`Button`, `Badge` via `useRender`/`mergeProps`), `class-variance-authority`, `tailwind-merge`/`cn`, `cmdk`, `lucide-react` |
| Theme | `next-themes` (dark/light) + custom `data-role` theming |
| Animation | `framer-motion` (error pages) |
| State | `zustand` 5 (with `persist` for assessment draft), `react-hook-form` + `@hookform/resolvers` + `yup` |
| Data | `axios`, `exceljs` (XLSX template build/parse) |
| Font | Manrope via `next/font/google` |
| Lint | `eslint-config-next` |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # public: login, register, demo, get-started
│   ├── (dashboard)/            # guarded: dashboard, admin, classes, subjects, assessments, submissions, results, children
│   │   └── _components/        # co-located page pieces per route
│   ├── error.tsx / global-error.tsx / not-found.tsx
│   ├── layout.tsx
│   └── page.tsx                # landing
├── components/
│   ├── layout/                 # AppShell, Navbar, Sidebar, ThemeToggle, RoleThemeSwitcher, ErrorDisplay
│   ├── ui/                     # shadcn primitives + DataDisplay, DemoModeBanner, guide-resource-page
│   ├── forms/                  # FormInput / FormSelect / FormTextarea (Controller wrappers)
│   └── providers/              # ThemeProvider
├── lib/
│   ├── api-client.ts           # axios instance + typed APIs (authApi, schoolsApi, assessmentsApi, ...)
│   ├── schemas/index.ts        # yup schemas
│   ├── errors.ts               # getErrorMessage
│   ├── utils.ts                # cn
│   ├── result-grouping.ts      # groupSubmissionsBySubject
│   ├── assessment-xlsx.ts      # buildAssessmentTemplate / parseAssessmentWorkbook
│   ├── use-fetch-data.ts       # stale-while-revalidate hook
│   ├── use-school-selection.ts
│   ├── use-parent-children.ts
│   └── mock-data/              # 11 domain mocks powering demo mode
├── stores/
│   ├── use-auth-store.ts
│   ├── use-role-theme-store.ts
│   ├── use-school-context-store.ts
│   └── use-assessment-store.ts
└── types/index.ts
```

Page pattern: `page.tsx` (UI) + `hooks.ts` (data/logic) + `_components/` (local UI).

---

## State Management

| Store | Persist | Key | Purpose |
|---|---|---|---|
| `use-auth-store` | `localStorage` (`school_hub_token`, `school_hub_user`) | auth | `user`, `token`, `isAuthenticated`, `isDemoMode`, `isLoading`; `setAuth`, `logout`, `fetchProfile`, `demoLoginAs(role)` |
| `use-role-theme-store` | `data-role` on `<html>` | theme | `activeRole`, `setRoleTheme` |
| `use-school-context-store` | `localStorage` (`school_hub_active_school_id`, `school_hub_user_schools`) | school | `userSchools`, `activeSchoolId`; `initFromUser`, `setActiveSchool` |
| `use-assessment-store` | `persist` (`assessment-draft-storage`) | draft | `draft`, `activeSubmission`, `selectedAnswers`; draft mutations + `setAnswer`/`clearAnswers` |

---

## Auth & Demo Mode

1. **Landing** role card → `demoLoginAs(role)` + `setRoleTheme(role)` → `/dashboard`.
2. **Login** → Yup → `POST /auth/login` (handles `{user, accessToken}` or flat shape) → `setAuth` + `setRoleTheme` → `/dashboard`. 4 demo buttons bypass API.
3. **Register** → Yup (role ∈ STUDENT/TEACHER/PARENT) → `authApi.register` → `setAuth` → `/dashboard`.
4. **Token** stored as `school_hub_token`; axios request interceptor attaches `Authorization: Bearer <token>`. `demo_*` prefix ⇒ `isDemoMode=true`.
5. **Restore** — `AppShell` mounts: if `token && !user` → `fetchProfile()` tries `GET /users/me` then `GET /auth/me`, falls back to localStorage user on failure.
6. **Guard** — no token → `router.replace('/login')`; `!isLoading && !isAuthenticated` → `/login`; shows spinner while `isLoading || !user`.
7. **School context** — `setAuth`/`fetchProfile` call `useSchoolContextStore.initFromUser(user)` from `user.schoolMemberships`.
8. **Logout** clears token + user + school context → `/login`.
9. **Demo vs Live** — `isDemoMode` gates hooks: mock data + `DemoModeBanner` vs real API. `RoleThemeSwitcher` freely switches roles in demo, locked in live.

---

## Theming

- **Dark/light:** `next-themes` via `ThemeToggle`.
- **Role colors** via `data-role` on `<html>`:

| Role | Gradient |
|---|---|
| TEACHER | `#059669` → `#0d9488` (emerald/teal) |
| STUDENT | `#6366f1` → `#8b5cf6` (indigo/violet) |
| PARENT | `#f59e0b` → `#ec4899` (amber/coral) |
| SCHOOL_ADMIN | `#8b5cf6` → `#6366f1` (violet/purple) |

---

## Getting Started

### Prerequisites

- Node 20+
- npm / yarn / pnpm / bun

### Install & Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

No backend required — use **Demo** buttons or role cards on `/` to explore with seeded mock data.

To run against a real backend, set `NEXT_PUBLIC_API_URL` (see below) and use Login/Register.

---

## Environment Variables

| Variable | Default | Description |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | Backend base URL (see `src/lib/api-client.ts`) |

Create `.env.local` in `frontend/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (standalone) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (`eslint-config-next`) |

---

## API Layer

`src/lib/api-client.ts` — single axios instance. Request interceptor injects JWT; response interceptor unwraps NestJS `{success, data}` envelope.

Exported clients: `authApi`, `usersApi`, `schoolsApi`, `academicYearsApi`, `subjectsApi`, `classesApi`, `teachingAssignmentsApi`, `assessmentsApi`, `submissionsApi`, `parentStudentsApi`.

Other lib utilities: `schemas/index.ts` (Yup), `errors.ts` (`getErrorMessage`), `result-grouping.ts`, `assessment-xlsx.ts` (Meta/Lists/Questions/README sheets + data validation), `use-fetch-data.ts`, `use-school-selection.ts`, `use-parent-children.ts`.

---

## Conventions for Contributors

- **Read `UI_guide_tree.md`** for intended page/component tree (includes planned routes like `/classes/[id]`, `/subjects/[id]/topics/[topicId]`).
- **Read `QA_SCENARIOS.md`** (537 lines) for per-role acceptance criteria and role-leak expectations.
- **Page pattern:** co-locate `page.tsx` + `hooks.ts` + `_components/` per route.
- **Forms:** `react-hook-form` + `Controller` wrappers in `components/forms` + Yup schemas in `lib/schemas`.
- **Lists:** reuse `components/ui/DataDisplay.tsx` (search, filter pills/select/dropdown/combobox, cards/table toggle, pagination, demo banner).
- **Styling:** Tailwind + `cn` (`clsx` + `tailwind-merge`); variants via `class-variance-authority`; base primitives on `@base-ui/react`.
- **State:** prefer Zustand stores; persist only the assessment draft (`assessment-draft-storage`).
- **Icons:** `lucide-react`.
- **Next.js version:** breaking changes from training data — follow `node_modules/next/dist/docs/` and deprecation notices. The `AGENTS.md` block is auto-managed by `next dev`; keep it committed.

---

## Deployment

- **Vercel:** `vercel` (default).
- **Docker:**
  ```bash
  docker build -f Dockerfile -t school-hub-frontend .        # production (standalone)
  docker build -f Dockerfile.dev -t school-hub-frontend:dev . # development
  ```
  `next.config.ts` is `output: "standalone"` for minimal Docker images.

---

## Related Docs

- `QA_SCENARIOS.md` — exhaustive QA checklist per role
- `UI_guide_tree.md` — full UI tree spec per role (392 lines)
- `AGENTS.md` / `CLAUDE.md` — Next.js agent rules
- `components.json` — shadcn config

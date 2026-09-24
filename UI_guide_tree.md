# LEARN HUB — UI Architecture & Route Tree Map

> **Authoritative UI Blueprint & Component Map**  
> Last updated: Post-Homepage Revamp.  
> This document maps every route, component, modal, and data hook across the platform. Use this as the reference compass for navigating and polishing the core application ("Main Course").

---

## 🧭 System Legend & Page Status

| Tag | Meaning |
|---|---|
| `[LIVE]` | Connected to live NestJS backend endpoints with JWT persistence |
| `[MOCK-FALLBACK]` | Works with live backend when available, falls back to Zustand mock store for demo |
| `[STUB/GUIDE]` | Uses `GuideResourcePage` or stub UI awaiting deeper backend wiring |
| `⭐ [MAIN COURSE]` | Core pedagogical workflow prioritized for polishing and refinement |

---

## 🌳 Complete Route & Component Tree

```text
LEARN HUB (Frontend Next.js 16 App Router)
│
├── 🌎 1. PUBLIC & AUTHENTICATION
│   │
│   ├── / [LIVE] — Modern Value-Driven Homepage
│   │   ├── Header: Logo (SchoolHub OS), Nav Anchors, LanguageSwitcher (EN/ID), ThemeToggle, Auth CTAs
│   │   ├── Hero: Pill Badge, High-Converting Headline, Narrative Subtitle, Dual CTAs
│   │   ├── Interactive Product Stage (Hero Studio):
│   │   │   ├── Tab: Teacher Studio (Previewing SMA Garuda Hope Class 8A Math, Topic Hierarchy, Auto-Grading)
│   │   │   ├── Tab: Student Exam Runner (Timer, Active MCQ, Option selection, Real-time progress)
│   │   │   ├── Tab: Parent Progress Hub (Child GPA 88.4, Good Standing badge, Teacher evaluation notes)
│   │   │   └── Tab: School Governance (Academic Year 2026/2027, Wali Kelas allocations, Member counts)
│   │   ├── Problem vs Solution: "Stop Juggling Disconnected Tools" (Before vs After comparison)
│   │   ├── Market Focus Banner: Indonesia-First Context (Tahun Ajaran, Wali Kelas, Guru Mapel, Transparansi Ortu)
│   │   ├── 4 Role Portals Grid: School Admin, Teacher, Student, Parent (1-Click Test Drive Demo buttons)
│   │   ├── Core Features Grid: Auto-Grading, Curriculum Hierarchy, Excel XLSX Import, Timed Exams, Parent Visibility, Role Themes
│   │   ├── Impact Metrics Banner: 85% Less Grading Time, 100% Curriculum Trace, 4 Unified Roles, 0 Report Card Surprises
│   │   ├── FAQ Accordion: Excel templates, Short-answer grading, Parent linking, Academic year rollover
│   │   ├── Final CTA Banner: Launch Live Demo / Sign In
│   │   └── Footer: Role demo shortcuts, branding, copyright
│   │
│   ├── /login [LIVE] — User Authentication
│   │   ├── Email & Password Form
│   │   ├── Role-based Quick Demo Login Buttons (Admin, Teacher, Student, Parent)
│   │   └── Link to /register
│   │
│   ├── /register [LIVE] — Account Registration
│   │   ├── Full Name, Email, Password
│   │   ├── Role Select: STUDENT | TEACHER | PARENT
│   │   └── Link to /login
│   │
│   └── /demo [LIVE] — Quick Role Switcher Launcher
│
│
├── 🏫 2. SCHOOL ADMIN WORKSPACE (Role Theme: Violet / Purple)
│   │
│   ├── /dashboard [LIVE]
│   │   ├── WelcomeBanner (Admin variant)
│   │   ├── AdminStatsGrid: Total Schools, Teachers, Students, Classes, Subjects
│   │   └── Quick access cards
│   │
│   ├── /admin [LIVE] — Admin Control Hub
│   │   ├── AdminHeader
│   │   ├── AdminTabs:
│   │   │   ├── Tab: Schools (List institutions, Create institution profile)
│   │   │   ├── Tab: Academic Years (Configure start/end dates, Set active term)
│   │   │   ├── Tab: Members (Associate users to school, filter staff/students)
│   │   │   └── Tab: Parent-Student Link (Establish family graph: Father, Mother, Guardian)
│   │   └── FeedbackBanner
│   │
│   ├── /classes [LIVE] — Class & Cohort Management
│   │   ├── ClassesHeader + Academic Year Selector
│   │   ├── ClassesGrid / MockClassesGrid (Grade, Class Name, Student Count, Wali Kelas)
│   │   ├── CreateClassModal (Class name, Grade level, Academic Year)
│   │   ├── EnrollStudentModal (Search & attach student to class)
│   │   ├── AssignHomeroomModal (Assign teacher as Wali Kelas)
│   │   └── ViewStudentsModal (Roster inspect modal)
│   │
│   ├── /members [LIVE] — School Community Directory
│   │   ├── MembersHeader + AddMemberModal
│   │   ├── MembersFilterBar (Search, Role Filter: Teacher / Student / Parent)
│   │   ├── MembersListCard
│   │   └── MemberDetailModal
│   │
│   ├── /academic-years [STUB/GUIDE] — Standalone Term Manager
│   ├── /teaching-assignments [STUB/GUIDE] — Teacher Assignment Manager
│   └── /school [STUB/GUIDE] — School Profile & Settings
│
│
├── 👩‍🏫 3. TEACHER WORKSPACE (Role Theme: Emerald / Teal) ⭐ [MAIN COURSE]
│   │
│   ├── /dashboard [LIVE]
│   │   ├── WelcomeBanner (Teacher variant)
│   │   ├── TeacherStatsGrid: Assigned Classes, Active Assessments, Submissions Pending Grading
│   │   ├── UpcomingAssessmentsCard
│   │   └── RecentResultsCard
│   │
│   ├── /subjects [LIVE] ⭐ — Curriculum & Taxonomy Engine
│   │   ├── SubjectsHeader
│   │   ├── SubjectsList / MockSubjectsList
│   │   ├── AddSubjectModal (Name, Code, Active status)
│   │   ├── AddTopicModal (Topic name, Description, Display order)
│   │   ├── AddSubTopicModal (SubTopic name, Description, Display order)
│   │   ├── /subjects/:id [STUB/GUIDE] — Subject Detail & Topic Drilldown
│   │   └── /subjects/:id/topics/:topicId [STUB/GUIDE] — SubTopic Question Association
│   │
│   ├── /assessments [LIVE] ⭐ — Assessment Operations
│   │   ├── AssessmentsHeader + "Create Assessment" Action
│   │   ├── AssessmentsToolbar (Search, Class Filter, Type Filter: Quiz / Exam / Assignment)
│   │   ├── AssessmentsGrid + AssessmentCard
│   │   ├── AssessmentsPagination
│   │   │
│   │   ├── /assessments/new [LIVE] ⭐ — Assessment Builder Studio
│   │   │   ├── AssessmentDetailsStep (Title, Type, TeachingAssignment, Topic, Due date)
│   │   │   ├── QuestionCreatorCard (Manual question editor: MCQ / True-False / Short Answer)
│   │   │   ├── QuestionListCard (Reorder questions, assign points, set answer keys)
│   │   │   └── XLSX Question Import/Export (ExcelJS template download & bulk upload)
│   │   │
│   │   └── /assessments/:id [LIVE] ⭐ — Assessment Management Cockpit
│   │       ├── ManageQuestionsView (Teacher mode: add/edit questions, options, point weights)
│   │       └── /assessments/:id/results [STUB/GUIDE] — Class Performance Grid
│   │
│   ├── /submissions [LIVE] ⭐ — Grading & Evaluation Cockpit
│   │   ├── SubmissionsTableCard / SubmissionCard (List submissions by class/assessment)
│   │   │
│   │   └── /submissions/:id [LIVE] ⭐ — Submission Grading Studio
│   │       ├── SubmissionDetailCard (Student info, Assessment metadata, Total score)
│   │       ├── Auto-Graded MCQ Breakdown (Instant green/red indicator)
│   │       └── Inline Manual Grading Form (Award points & teacher feedback on Short Answer)
│   │
│   └── /results [LIVE] — Teacher Analytics & Gradebook
│       └── TeacherResultsView (Grouped by Subject ➔ Student scores & completion rates)
│
│
├── 🎓 4. STUDENT WORKSPACE (Role Theme: Indigo / Violet) ⭐ [MAIN COURSE]
│   │
│   ├── /dashboard [LIVE]
│   │   ├── WelcomeBanner (Student variant)
│   │   ├── StudentStatsGrid: Enrolled Class, Completed Tests, Current GPA Average
│   │   ├── UpcomingAssessmentsCard (Direct "Take Test" action buttons)
│   │   └── RecentResultsCard
│   │
│   ├── /assessments [LIVE]
│   │   ├── Active / Upcoming Assessments List
│   │   └── Completed Assessments with Scores
│   │
│   ├── /assessments/:id [LIVE] ⭐ — Distraction-Free Exam Runner
│   │   ├── QuizHeaderBar (Live countdown timer, question progress counter)
│   │   ├── QuestionCard (Active question prompt, choice selector, auto-save state)
│   │   ├── Question Navigation Controls (Previous, Next, Question grid jump)
│   │   ├── CompletionCard (Post-submission instant score confirmation)
│   │   └── ReviewResults (Question-by-question mistake breakdown & feedback)
│   │
│   └── /results [LIVE]
│       └── StudentResultsView (Subject performance history, test scores, progression)
│
│
└── 👨‍👩‍👧 5. PARENT WORKSPACE (Role Theme: Amber / Coral) ⭐ [MAIN COURSE]
    │
    ├── /dashboard [LIVE]
    │   ├── WelcomeBanner (Parent variant)
    │   ├── ParentStatsGrid: Linked Children count, Recent assessment scores
    │   └── Children overview cards
    │
    ├── /children [LIVE] ⭐ — Children Academic Monitoring
    │   ├── Children list cards (Name, Enrolled Class, GPA Average, Recent test date)
    │   │
    │   └── /children/:studentId [LIVE] ⭐ — Detailed Child Academic Journey
    │       ├── Child Header (Student Name, Class, School, Homeroom Teacher / Wali Kelas)
    │       ├── Performance Threshold Badges (≥80 Good / Green, ≥60 Warning / Yellow, <60 Attention / Red)
    │       ├── Subject-by-Subject Score Breakdown
    │       └── Detailed Assessment History & Teacher Notes
    │
    └── /results [LIVE]
        └── ParentResultsView (Aggregated score cards grouped by Child ➔ Subject)
```

---

## 🎯 Priority Matrix for "Main Course" Polishing

When opening a new session to work on the internal core application, choose from these high-impact focus areas:

### 1. The Teacher Cockpit ⭐⭐⭐
* **Files**: `src/app/(dashboard)/assessments/new/*`, `src/app/(dashboard)/assessments/[id]/*`, `src/app/(dashboard)/submissions/[id]/*`
* **Polishing Targets**:
  * Elevate the 2-step Assessment Builder with richer question preview cards and smoother validation.
  * Polish the Excel XLSX bulk import/export workflow with clear visual error reporting.
  * Refine the Submission Grading Studio: smooth point sliders/inputs for Short Answers, instant score recalculation, and quick pre-set feedback snippets.

### 2. The Student Exam Runner Experience ⭐⭐⭐
* **Files**: `src/app/(dashboard)/assessments/[id]/*` (`QuizHeaderBar`, `QuestionCard`, `ReviewResults`)
* **Polishing Targets**:
  * Fullscreen focus mode toggle to eliminate all distractions during exams.
  * Visual question matrix (answered, flagged for review, unanswered).
  * Smooth animations for option selection and question transition (via `framer-motion`).
  * Instant post-exam celebration screen and detailed review breakdown.

### 3. The Parent Child Progress Journey ⭐⭐
* **Files**: `src/app/(dashboard)/children/*`, `src/app/(dashboard)/children/[studentId]/*`
* **Polishing Targets**:
  * Visual grade trajectory graphs (trend over time per subject).
  * Clear action items for parents (e.g., "Needs review in Trigonometric Identities").
  * Exportable PDF / print-friendly child progress report for parent-teacher conferences.

### 4. Curriculum Taxonomy Drilldown ⭐
* **Files**: `src/app/(dashboard)/subjects/*`, `src/app/(dashboard)/subjects/[id]/*`
* **Polishing Targets**:
  * Replace stub guide pages for deep subject/topic drilldown with interactive tree views.
  * Drag-and-drop ordering for Topics and SubTopics within a Subject.

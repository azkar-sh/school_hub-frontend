# QA Test Scenarios — School Hub Frontend

> Checklist per role. Mark `[ ]` → `[x]` when tested. Note bugs inline.

---

## 0. Shared / Cross-Role

### 0.1 Auth — Login
- [ ] Login page renders: email + password fields, yup validation (invalid email, min password)
- [ ] Submit empty form → validation errors show
- [ ] Login success → token stored, redirect `/dashboard`
- [ ] Login wrong credentials → error message displayed
- [ ] 4 quick demo buttons work (Admin / Teacher / Student / Parent) → redirect dashboard
- [ ] Token persisted in `localStorage` key `school_hub_token`
- [ ] Logout clears token + redirect `/login`

### 0.2 Auth — Register
- [ ] Register page renders: name, email, password, role select (STUDENT/TEACHER/PARENT — no ADMIN)
- [ ] Yup validation: invalid email, short password, missing name
- [ ] Register success → auth stored → redirect `/dashboard`
- [ ] Register duplicate email → error shown

### 0.3 Auth — Demo
- [ ] Landing page `/` renders 3 portal cards (STUDENT / TEACHER / PARENT)
- [ ] Click portal card → `demoLoginAs` → `/dashboard`
- [ ] `/demo` page renders 3 role cards → click → dashboard
- [ ] `/get-started` renders CTA → links to `/register` + `/login`
- [ ] Demo mode banner appears when `isDemoMode` true

### 0.4 Auth Guard
- [ ] Visit `/dashboard` without token → redirect `/login`
- [ ] Visit any `/dashboard/*` without token → redirect `/login`
- [ ] Token present but `user` null → `fetchProfile` fires → user loaded or redirect
- [ ] Expired/invalid token → API 401 → redirect `/login`

### 0.5 Layout / Navigation
- [ ] Navbar: brand logo, school switcher dropdown (if multiple schools), role theme switcher, dark/light toggle, user avatar + name + email, logout button
- [ ] Sidebar: only role-allowed nav items visible
- [ ] Sidebar: active route highlighted
- [ ] School switcher: switching active school refetches data
- [ ] Dark mode: all pages render correctly in dark theme
- [ ] `data-role` attribute set on `<html>` per role

### 0.6 Dashboard — All Roles
- [ ] Welcome banner: role-specific greeting + description
- [ ] Welcome banner CTA: TEACHER → Create Assessment, STUDENT → Start Quiz, ADMIN → Manage Years
- [ ] Demo mode banner shows when demo active
- [ ] Dashboard stats grid renders correct cards per role
- [ ] Dashboard content sections render per role (see role sections below)

---

## 1. SCHOOL_ADMIN

### 1.1 Sidebar Items
- [ ] Dashboard
- [ ] School Admin Hub (`/admin`)
- [ ] School (`/school`)
- [ ] Academic Years (`/academic-years`)
- [ ] Members (`/members`)
- [ ] Teaching Assignments (`/teaching-assignments`)
- [ ] Assessments (`/assessments`)
- [ ] Submissions (`/submissions`)
- [ ] Classes (`/classes`)
- [ ] Subjects & Topics (`/subjects`)
- [ ] **Results NOT visible** (admin excluded)

### 1.2 Dashboard — Admin
- [ ] AdminStatsGrid: teachers count, students count, classes count, subjects count
- [ ] AdminDashboardContent: Current Year card (name, status, classes, students)
- [ ] Recent Activity: 5 recent submissions listed

### 1.3 Admin Hub (`/admin`)
- [ ] 4 tabs render: Schools / Academic Years / Members / Parent Link
- [ ] Tab switching works, active tab highlighted

#### 1.3.1 Schools Tab
- [ ] School name input renders
- [ ] Create school → `schoolsApi.create` → success feedback
- [ ] Create school with empty name → validation error
- [ ] Loading state disables submit button
- [ ] Success/error FeedbackBanner shows

#### 1.3.2 Academic Years Tab
- [ ] School select dropdown renders (populated from schools)
- [ ] AY name, start date, end date inputs render
- [ ] Create AY → `academicYearsApi.create` → success feedback
- [ ] Create AY with missing fields → validation error
- [ ] Loading state disables submit
- [ ] Success/error FeedbackBanner shows

#### 1.3.3 Members Tab
- [ ] School select dropdown renders
- [ ] Member user dropdown renders (populated from `usersApi` limit 100)
- [ ] Add member → `schoolsApi.addMember` → success
- [ ] Add duplicate member → error shown
- [ ] Loading state disables submit
- [ ] Success/error FeedbackBanner shows

#### 1.3.4 Parent Link Tab
- [ ] Parent select dropdown renders
- [ ] Student select dropdown renders
- [ ] Relationship select: FATHER / MOTHER / GUARDIAN
- [ ] Link parent → `parentStudentsApi.link` → success
- [ ] Link duplicate → error shown
- [ ] Loading state disables submit
- [ ] Success/error FeedbackBanner shows

### 1.4 School Page (`/school`)
- [ ] Stub renders: school name "SMA Garuda Hope", Edit School button
- [ ] Edit School button → action triggers (stub)

### 1.5 Academic Years Page (`/academic-years`)
- [ ] Stub renders: "2026/2027" Active badge

### 1.6 Members Page (`/members`)
- [ ] Members list renders with DataDisplay
- [ ] Search by name/email (debounced)
- [ ] Role filter: ALL / TEACHER / STUDENT / PARENT
- [ ] Add Member modal opens → form fields → submit `schoolsApi.addMember`
- [ ] Member Detail modal opens → shows profile, role, membership info
- [ ] Pagination works if >limit members
- [ ] Card/table view toggle works
- [ ] Empty state when no members

### 1.7 Teaching Assignments Page (`/teaching-assignments`)
- [ ] Stub renders: 4 assignments listed
- [ ] Assign Teacher button → action triggers (stub)

### 1.8 Classes Page (`/classes`) — Admin
- [ ] Classes grid renders
- [ ] Create Class modal: name, grade, academic year → `classesApi.create`
- [ ] Create class with empty fields → validation error
- [ ] Enroll Student modal: studentId input → `POST /classes/:id/enroll`
- [ ] Assign Homeroom modal: teacherId select → `POST assign-homeroom`
- [ ] View Students modal: `GET registered-students` → student list
- [ ] Modal open/close works for all 4 modals
- [ ] Modal backdrop click closes modal
- [ ] Loading states during API calls

### 1.9 Subjects Page (`/subjects`) — Admin
- [ ] Subjects list renders
- [ ] Add Subject modal: name, code → `POST /subjects`
- [ ] Add Subject with empty fields → validation error
- [ ] Add Topic modal: name, description → `POST /subjects/topics`
- [ ] Add Sub-Topic modal: name → `POST /subjects/topics/sub-topics`
- [ ] All 3 modals open/close correctly
- [ ] Loading states during API calls

### 1.10 Subjects Detail Pages
- [ ] `/subjects/[id]` renders: topics list, links to sub-topics
- [ ] `/subjects/[id]/topics/[topicId]` renders: subTopics list

### 1.11 Assessments Page (`/assessments`) — Admin
- [ ] Assessment list renders with DataDisplay
- [ ] Search (debounced 350ms) hits server `findForTeacher`
- [ ] Type filter works (client-side)
- [ ] Pagination works
- [ ] Card/table view toggle
- [ ] Assessment card actions render

### 1.12 Submissions Page (`/submissions`) — Admin
- [ ] Submissions list renders
- [ ] Search by student/title/subject
- [ ] Status filter: ALL / SUBMITTED / GRADED
- [ ] Click submission → `/submissions/[id]` detail
- [ ] Submission detail renders

### 1.13 Role Leak Tests — Admin
- [ ] Visit `/children` as Admin → should redirect or show 403 (sidebar hides it)
- [ ] Visit `/results` as Admin → should redirect or show 403 (sidebar hides it)

---

## 2. TEACHER

### 2.1 Sidebar Items
- [ ] Dashboard
- [ ] Assessments (`/assessments`)
- [ ] Submissions (`/submissions`)
- [ ] Classes (`/classes`)
- [ ] Subjects & Topics (`/subjects`)
- [ ] Results (`/results`)
- [ ] Quick button: Create Assessment → `/assessments/new`
- [ ] **Admin Hub NOT visible**
- [ ] **School NOT visible**
- [ ] **Academic Years NOT visible**
- [ ] **Members NOT visible**
- [ ] **Teaching Assignments NOT visible**
- [ ] **Children NOT visible**

### 2.2 Dashboard — Teacher
- [ ] TeacherStatsGrid: myClasses, liveAssessments, pendingResults, classAverage
- [ ] TeacherDashboardContent: My Classes rows (name, subject, studentCount, assessmentCount)
- [ ] UpcomingAssessmentsCard: teacher assessments (max 3)
- [ ] Welcome banner CTA → Create Assessment

### 2.3 Assessments List (`/assessments`)
- [ ] List renders via `findForTeacher` (server pagination)
- [ ] Search debounced 350ms → server query
- [ ] Type filter (client-side)
- [ ] Pagination next/prev
- [ ] Card view renders: title, type, due date, status
- [ ] Table view toggle renders rows
- [ ] AssessmentCard action: "Manage Questions" → `/assessments/[id]`
- [ ] Empty state when no assessments
- [ ] Error state renders on API failure
- [ ] Loading skeleton renders

### 2.4 Create Assessment (`/assessments/new`)
- [ ] Step 1 (Details): Teaching Assignment select renders
- [ ] Step 1: Title, Description, Type (MCQ/TRUE_FALSE/SHORT_ANSWER), Due Date inputs
- [ ] Step 1: Cannot proceed without required fields
- [ ] Step 1 → Step 2 navigation works
- [ ] Step 2 (Questions): QuestionCreatorCard renders
- [ ] Sub-topic select populated (subjects→topics→subTopics flattened)
- [ ] Question text input
- [ ] Question type select: MCQ / TRUE_FALSE / SHORT_ANSWER
- [ ] MCQ: 4 options + true/false isCorrect toggle + points
- [ ] TRUE_FALSE: 2 options + isCorrect toggle + points
- [ ] SHORT_ANSWER: no options + points
- [ ] Add Question → appears in QuestionListCard
- [ ] Remove Question from list
- [ ] Publish → `assessmentsApi.create` with `{teachingAssignmentId, title, type, dueAt, questions}`
- [ ] Publish success → redirect to assessments list or detail
- [ ] Publish error → error feedback
- [ ] Back button: Step 2 → Step 1 preserves data
- [ ] Loading state during publish

### 2.5 Manage Questions (`/assessments/[id]`) — Teacher
- [ ] ManageQuestionsView renders (teacher view)
- [ ] Assessment details header shows
- [ ] Sub-topics list loaded from subjects→topics→subTopics
- [ ] Existing questions listed
- [ ] Add Question form: subTopic, text, type, points, options
- [ ] Add Question → `POST /assessments/:id/questions` → appears in list
- [ ] Edit Question: click edit → form pre-filled → `PUT .../questions/:qId`
- [ ] Delete Question: click delete → `DELETE .../questions/:qId` → removed
- [ ] Delete/Edit after students started → error 400 "Cannot modify after students started"
- [ ] isAdding / isSaving / isDeleting loading states
- [ ] Error feedback on failed operations

### 2.6 Assessment Results Page (`/assessments/[id]/results`)
- [ ] Stub renders: submission rows listed

### 2.7 Submissions (`/submissions`) — Teacher
- [ ] Title: "Student Submissions & Grading Hub"
- [ ] List renders with search (student/title/subject)
- [ ] Status filter: ALL / SUBMITTED / GRADED
- [ ] Click row → `/submissions/[id]` detail page
- [ ] Submission detail: student answers rendered
- [ ] Inline grade: answerId + pointsEarned input → `PATCH /submissions/:id/grade`
- [ ] Auto-Grade button → `POST auto-grade`
- [ ] Grade saved → success feedback
- [ ] Grade invalid (negative, >points) → validation
- [ ] Loading state during grading

### 2.8 Results (`/results`) — Teacher
- [ ] TeacherResultsView renders
- [ ] Submissions grouped by subject → student → assessments
- [ ] Average computed per `result-grouping.ts`
- [ ] Subject/student/assessment hierarchy correct

### 2.9 Classes (`/classes`) — Teacher
- [ ] Classes grid renders (view-only — no manage modals)
- [ ] MockClassesGrid / ClassesGrid display
- [ ] **No Create/Enroll/Homeroom/View modals** (read-only)

### 2.10 Subjects (`/subjects`) — Teacher
- [ ] Assigned subjects vs other subjects split (via teachingAssignments)
- [ ] Subject teacher names shown (`subjectTeachersMap`)
- [ ] Add Topic modal works
- [ ] Add Sub-Topic modal works
- [ ] **No Add Subject modal** (cannot add subject)

### 2.11 Role Leak Tests — Teacher
- [ ] Visit `/admin` as Teacher → should redirect or 403
- [ ] Visit `/children` as Teacher → should redirect or 403
- [ ] Visit `/members` as Teacher → should redirect or 403

---

## 3. STUDENT

### 3.1 Sidebar Items
- [ ] Dashboard
- [ ] Assessments (`/assessments`)
- [ ] Submissions (`/submissions`)
- [ ] Subjects & Topics (`/subjects`)
- [ ] Results (`/results`)
- [ ] **Classes NOT visible** (student excluded)
- [ ] **Admin Hub NOT visible**
- [ ] **School NOT visible**
- [ ] **Academic Years NOT visible**
- [ ] **Members NOT visible**
- [ ] **Teaching Assignments NOT visible**
- [ ] **Children NOT visible**

### 3.2 Dashboard — Student
- [ ] StudentStatsGrid: quizzesTaken, average, pendingDue
- [ ] My Class card: class name, grade, academic year, homeroom teacher
- [ ] Upcoming assessments: pending filter
- [ ] RecentResultsCard: 3 recent results
- [ ] Welcome banner CTA → Start Quiz

### 3.3 Assessments List (`/assessments`) — Student
- [ ] List renders via `findForStudent` (server pagination)
- [ ] Search debounced → server query
- [ ] Type filter (client-side)
- [ ] Pagination works
- [ ] Card/table toggle
- [ ] Status badges: AVAILABLE / DRAFT / SUBMITTED / GRADED (from `submissions[0]`)
- [ ] Action labels correct: Start (AVAILABLE) / Continue (DRAFT) / Review (SUBMITTED) / Review Score (GRADED)
- [ ] Click Start → `/assessments/[id]` player
- [ ] Click Continue → `/assessments/[id]` resume
- [ ] Click Review → `/assessments/[id]` review mode
- [ ] Empty state
- [ ] Error state
- [ ] Loading state

### 3.4 Assessment Player (`/assessments/[id]`) — Student
- [ ] Player loads → `submissionsApi.start` auto-fires
- [ ] QuizHeaderBar: time formatted mm:ss, question index/total
- [ ] Progress percentage bar
- [ ] QuestionCard: renders question text + options
- [ ] MCQ: radio select for options
- [ ] TRUE_FALSE: radio select True/False
- [ ] SHORT_ANSWER: text input
- [ ] Selected answers stored in `use-assessment-store`
- [ ] Previous button (disabled on Q1)
- [ ] Next button (disabled on last Q)
- [ ] Timer counts down (600s interval)
- [ ] Timer reaches 0 → auto-submit? (verify behavior)
- [ ] Submit → `POST /submissions/:id/submit {answers:[{questionId,answer}]}`
- [ ] Submit success → score raw + percentage → CompletionCard
- [ ] CompletionCard: Try Again / Return Dashboard buttons
- [ ] Return Dashboard → `/dashboard`
- [ ] Revisit SUBMITTED assessment → ReviewResults renders (full submission with answers)
- [ ] Revisit GRADED assessment → ReviewResults + score badge

### 3.5 Submissions (`/submissions`) — Student
- [ ] Title: "My Submission History"
- [ ] List renders with search
- [ ] Status filter: ALL / SUBMITTED / GRADED
- [ ] Click submission → detail (read-only, no grading)
- [ ] Detail shows answers + score (if graded)

### 3.6 Results (`/results`) — Student
- [ ] StudentResultsView renders
- [ ] Submissions grouped by subject (`groupSubmissionsBySubject`)
- [ ] Per-subject average displayed
- [ ] Assessment history per subject

### 3.7 Subjects (`/subjects`) — Student
- [ ] Subjects list renders (view-only)
- [ ] **No Add Subject/Topic/Sub-Topic modals**

### 3.8 Role Leak Tests — Student
- [ ] Visit `/admin` as Student → should redirect or 403
- [ ] Visit `/classes` as Student → should redirect or 403
- [ ] Visit `/children` as Student → should redirect or 403
- [ ] Visit `/members` as Student → should redirect or 403

---

## 4. PARENT

### 4.1 Sidebar Items
- [ ] Dashboard
- [ ] Assessments (`/assessments`)
- [ ] Submissions (`/submissions`)
- [ ] Classes (`/classes`)
- [ ] Subjects & Topics (`/subjects`)
- [ ] Results (`/results`)
- [ ] Children (`/children`)
- [ ] **Admin Hub NOT visible**
- [ ] **School NOT visible**
- [ ] **Academic Years NOT visible**
- [ ] **Members NOT visible**
- [ ] **Teaching Assignments NOT visible**

### 4.2 Dashboard — Parent
- [ ] ParentStatsGrid: children count, grade, average, completed
- [ ] ParentDashboardContent: children list rendered
- [ ] RecentResultsCard: recent results shown
- [ ] Welcome banner: parent-specific greeting

### 4.3 Children (`/children`)
- [ ] Fetch `GET /parent-students/children` → child cards render
- [ ] Fetch `GET /submissions` → merged with children data
- [ ] Child card: name, Badge Grade, FileCheck2 (assessment count), Award (average)
- [ ] Button → `/children/[studentId]`
- [ ] Empty state when no children linked
- [ ] Loading state
- [ ] Error state

### 4.4 Child Detail (`/children/[studentId]`)
- [ ] Header card: child name, class, grade, assessment count, average
- [ ] Results list: flat by subjects
- [ ] ScoreBadge color: >=80 green, >=60 yellow, <60 red
- [ ] Date displayed (with fallback)
- [ ] Back to Children button → `/children`
- [ ] Empty state when child has no submissions

### 4.5 Results (`/results`) — Parent
- [ ] ParentResultsView renders
- [ ] Per-child subjects breakdown
- [ ] Average computed per child per subject

### 4.6 Assessments (`/assessments`) — Parent
- [ ] Assessment list renders (view-only)
- [ ] Action: "View Results" (not Start/Continue)
- [ ] Search/filter/pagination work

### 4.7 Submissions (`/submissions`) — Parent
- [ ] Title: "Child's Submission History"
- [ ] List renders with search + status filter
- [ ] Click → detail (read-only, no grading)

### 4.8 Classes (`/classes`) — Parent
- [ ] Classes grid renders (view-only)
- [ ] View Students modal accessible
- [ ] **No Create/Enroll/Homeroom modals**

### 4.9 Subjects (`/subjects`) — Parent
- [ ] Subjects list renders (view-only)
- [ ] **No Add modals**

### 4.10 Role Leak Tests — Parent
- [ ] Visit `/admin` as Parent → should redirect or 403
- [ ] Visit `/children` as Parent → works (allowed)
- [ ] Visit `/members` as Parent → should redirect or 403
- [ ] Visit `/teaching-assignments` as Parent → should redirect or 403

---

## 5. Cross-Role Edge Cases

### 5.1 Role Switching
- [ ] Switch role via RoleThemeSwitcher → `data-role` updates on `<html>`
- [ ] Sidebar items update per new role
- [ ] Dashboard content updates per new role
- [ ] Theme colors update per role

### 5.2 School Context
- [ ] Multiple schools: switcher populates all schools
- [ ] Switch active school → data refetches
- [ ] `activeSchoolId` persisted in localStorage
- [ ] Single school: switcher hidden or disabled

### 5.3 Demo Mode vs Live Mode
- [ ] Demo mode: mock data renders (no API calls)
- [ ] Demo mode banner visible
- [ ] Live mode: real API calls fire
- [ ] Demo → logout → live login: token cleared, new token set

### 5.4 Responsive / Mobile
- [ ] Sidebar collapses on mobile
- [ ] Navbar responsive
- [ ] Modals scroll on small screen
- [ ] Tables → horizontal scroll or card view on mobile
- [ ] Forms usable on mobile

### 5.5 Error States
- [ ] API 500 → error component renders
- [ ] API timeout → loading stuck or timeout message
- [ ] Network offline → error message
- [ ] 403 forbidden → redirect or error
- [ ] 404 not found → error page

### 5.6 Stub Pages (Not Yet Implemented)
- [ ] `/school` — Edit School (stub action)
- [ ] `/academic-years` — list/create (stub)
- [ ] `/teaching-assignments` — assign teacher (stub)
- [ ] `/assessments/[id]/results` — submission rows (stub)
- [ ] `/subjects/[id]` — topics list (stub)
- [ ] `/subjects/[id]/topics/[topicId]` — subTopics list (stub)

---

## 6. API Integration Checklist

### 6.1 Auth Endpoints
- [ ] `POST /auth/register` — new user
- [ ] `POST /auth/login` — login
- [ ] `GET /auth/me` — profile fetch
- [ ] `GET /users/me` — profile fallback

### 6.2 School Admin
- [ ] `POST /schools` — create school
- [ ] `POST /schools/:id/members` — add member
- [ ] `POST /academic-years` — create AY
- [ ] `POST /parent-students` — link parent

### 6.3 Classes
- [ ] `POST /classes` — create class
- [ ] `POST /classes/:id/enroll` — enroll student
- [ ] `POST /classes/:id/assign-homeroom` — assign homeroom
- [ ] `GET /classes/:id/registered-students` — view students

### 6.4 Subjects
- [ ] `POST /subjects` — create subject
- [ ] `POST /subjects/topics` — create topic
- [ ] `POST /subjects/topics/sub-topics` — create sub-topic

### 6.5 Assessments
- [ ] `POST /assessments` — create assessment + questions
- [ ] `GET /assessments/teacher` — teacher list
- [ ] `GET /assessments/student` — student list
- [ ] `POST /assessments/:id/questions` — add question
- [ ] `PUT /assessments/:id/questions/:qId` — edit question
- [ ] `DELETE /assessments/:id/questions/:qId` — delete question

### 6.6 Submissions
- [ ] `POST /submissions/:id/start` — start submission
- [ ] `POST /submissions/:id/submit` — submit answers
- [ ] `GET /submissions` — list (with filters)
- [ ] `GET /submissions/:id` — detail
- [ ] `PATCH /submissions/:id/grade` — manual grade
- [ ] `POST /submissions/:id/auto-grade` — auto grade

### 6.7 Parent
- [ ] `GET /parent-students/children` — children list
- [ ] `POST /parent-students/link` — link parent-child
- [ ] `GET /parent-students/parents` — parent list

---

## How to Use

1. Login as each role (or use demo buttons)
2. Go through each section top to bottom
3. Mark `[x]` for pass, note bugs inline with `> BUG: ...`
4. Pay special attention to **Role Leak Tests** — URL access not blocked client-side
5. Check **Stub Pages** — these are placeholders, verify they render without crash
6. Test both **Demo Mode** and **Live Mode** where applicable

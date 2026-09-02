LEARN HUB
│
├── 🌎 PUBLIC
│ │
│ ├── /
│ │ └── Welcome / Homepage
│ │ ├── Navbar
│ │ │ ├── Logo
│ │ │ ├── Demo
│ │ │ ├── Log In
│ │ │ └── Get Started
│ │ │
│ │ ├── Hero
│ │ │ ├── Headline
│ │ │ ├── Description
│ │ │ ├── Get Started CTA
│ │ │ └── Explore Demo CTA
│ │ │
│ │ ├── Role Preview
│ │ │ ├── Teacher
│ │ │ ├── Student
│ │ │ └── Parent
│ │ │
│ │ ├── Features
│ │ │ ├── Learning Structure
│ │ │ ├── Assessments
│ │ │ ├── Student Learning
│ │ │ └── Parent Visibility
│ │ │
│ │ ├── How It Works
│ │ │ ├── School Setup
│ │ │ ├── Teacher Creates
│ │ │ └── Student Learns
│ │ │
│ │ ├── Roles
│ │ │ ├── School Admin
│ │ │ ├── Teacher
│ │ │ ├── Student
│ │ │ └── Parent
│ │ │
│ │ └── Footer
│ │
│ ├── /demo
│ │ ├── Teacher Demo
│ │ ├── Student Demo
│ │ └── Parent Demo
│ │
│ ├── /login
│ │ ├── Email
│ │ ├── Password
│ │ ├── Login Button
│ │ └── Get Started Link
│ │
│ └── /get-started
│ ├── Create Account
│ ├── Name
│ ├── Email
│ ├── Password
│ └── Role
│
│
├── 🏫 SCHOOL ADMIN
│ │
│ ├── /dashboard
│ │ ├── Welcome Header
│ │ ├── School Overview
│ │ │ ├── Teachers Count
│ │ │ ├── Students Count
│ │ │ ├── Classes Count
│ │ │ └── Subjects Count
│ │ │
│ │ ├── Current Academic Year
│ │ │ ├── Year
│ │ │ ├── Status
│ │ │ ├── Classes
│ │ │ └── Students
│ │ │
│ │ └── Recent Activity
│ │
│ ├── /school
│ │ ├── School Header
│ │ ├── School Information
│ │ │ ├── Name
│ │ │ ├── School ID
│ │ │ └── Created Date
│ │ │
│ │ └── Actions
│ │ └── Edit School
│ │
│ ├── /academic-years
│ │ ├── Page Header
│ │ │ ├── Title
│ │ │ └── Create Academic Year
│ │ │
│ │ ├── Academic Year List
│ │ │ ├── Name
│ │ │ ├── Start Date
│ │ │ ├── End Date
│ │ │ └── Status
│ │ │
│ │ └── Academic Year Detail
│ │ ├── Year Information
│ │ ├── Status
│ │ ├── Classes
│ │ ├── Students
│ │ └── Teaching Assignments
│ │
│ ├── /classes
│ │ ├── Page Header
│ │ │ ├── Title
│ │ │ └── Create Class
│ │ │
│ │ ├── Academic Year Filter
│ │ │
│ │ ├── Class List
│ │ │ ├── Class Name
│ │ │ ├── Grade
│ │ │ ├── Student Count
│ │ │ └── Homeroom Teacher
│ │ │
│ │ └── /classes/:id
│ │ ├── Class Header
│ │ │ ├── Class Name
│ │ │ ├── Grade
│ │ │ └── Academic Year
│ │ │
│ │ ├── Homeroom Teacher
│ │ │
│ │ ├── Students Tab
│ │ │ ├── Student Count
│ │ │ ├── Search
│ │ │ ├── Enroll Student
│ │ │ └── Student List
│ │ │
│ │ └── Teaching Assignments Tab
│ │ ├── Teacher
│ │ ├── Subject
│ │ └── Status
│ │
│ ├── /members
│ │ ├── Page Header
│ │ │ └── Add Member
│ │ │
│ │ ├── Search
│ │ ├── Role Filter
│ │ │ ├── All
│ │ │ ├── Teacher
│ │ │ ├── Student
│ │ │ └── Parent
│ │ │
│ │ ├── Member List
│ │ │ ├── Name
│ │ │ ├── Email
│ │ │ └── Role
│ │ │
│ │ └── Member Detail
│ │ ├── Profile
│ │ ├── Role
│ │ └── School Membership
│ │
│ └── /teaching-assignments
│ ├── Page Header
│ │ └── Assign Teacher
│ │
│ ├── Academic Year Filter
│ │
│ ├── Assignment List
│ │ ├── Teacher
│ │ ├── Subject
│ │ ├── Class
│ │ └── Status
│ │
│ └── Create Assignment
│ ├── Teacher Select
│ ├── Subject Select
│ ├── Class Select
│ └── Academic Year Select
│
│
├── 👩‍🏫 TEACHER
│ │
│ ├── /dashboard
│ │ ├── Welcome Header
│ │ ├── Quick Stats
│ │ │ ├── My Classes
│ │ │ ├── Assessments
│ │ │ └── Pending Results
│ │ │
│ │ ├── My Classes
│ │ └── Upcoming Assessments
│ │
│ ├── /classes
│ │ ├── My Classes
│ │ │ ├── Class Name
│ │ │ ├── Subject
│ │ │ ├── Student Count
│ │ │ └── Assessment Count
│ │ │
│ │ └── /classes/:id
│ │ ├── Class Header
│ │ ├── Students
│ │ │ ├── Search
│ │ │ └── Student List
│ │ │
│ │ └── Assessments
│ │ └── Assessment List
│ │
│ ├── /subjects
│ │ ├── Page Header
│ │ │ └── Create Subject
│ │ │
│ │ ├── Subject List
│ │ │ ├── Subject Name
│ │ │ ├── Code
│ │ │ ├── Topic Count
│ │ │ └── Status
│ │ │
│ │ └── /subjects/:subjectId
│ │ ├── Subject Header
│ │ │ ├── Name
│ │ │ ├── Code
│ │ │ └── Status
│ │ │
│ │ ├── Topics
│ │ │ ├── Topic Card
│ │ │ │ ├── Name
│ │ │ │ ├── Description
│ │ │ │ └── SubTopic Count
│ │ │ │
│ │ │ └── Add Topic
│ │ │
│ │ └── /topics/:topicId
│ │ ├── Topic Header
│ │ ├── Description
│ │ ├── SubTopics
│ │ │ ├── Name
│ │ │ ├── Description
│ │ │ └── Question Count
│ │ │
│ │ └── Add SubTopic
│ │
│ ├── /assessments
│ │ ├── Page Header
│ │ │ └── Create Assessment
│ │ │
│ │ ├── Filters
│ │ │ ├── Status
│ │ │ └── Class
│ │ │
│ │ ├── Assessment List
│ │ │ ├── Title
│ │ │ ├── Subject
│ │ │ ├── Class
│ │ │ ├── Questions
│ │ │ ├── Due Date
│ │ │ └── Status
│ │ │
│ │ ├── /assessments/create
│ │ │ ├── Basic Information
│ │ │ │ ├── Title
│ │ │ │ ├── Description
│ │ │ │ ├── Type
│ │ │ │ ├── Teaching Assignment
│ │ │ │ └── Due Date
│ │ │ │
│ │ │ ├── Questions
│ │ │ │ ├── Question
│ │ │ │ ├── Question Type
│ │ │ │ ├── SubTopic
│ │ │ │ ├── Points
│ │ │ │ └── Options
│ │ │ │
│ │ │ └── Actions
│ │ │ ├── Add Question
│ │ │ └── Save
│ │ │
│ │ └── /assessments/:assessmentId
│ │ ├── Assessment Header
│ │ │ ├── Title
│ │ │ ├── Type
│ │ │ ├── Class
│ │ │ └── Due Date
│ │ │
│ │ ├── Overview
│ │ │ ├── Student Count
│ │ │ ├── Submitted
│ │ │ ├── Graded
│ │ │ └── Average Score
│ │ │
│ │ ├── Questions
│ │ │ └── Question List
│ │ │
│ │ └── Submissions
│ │ ├── Student
│ │ ├── Status
│ │ └── Score
│ │
│ └── /results
│ ├── Assessment Filter
│ ├── Class Filter
│ ├── Summary
│ │ ├── Average
│ │ ├── Highest
│ │ └── Lowest
│ └── Student Results
│ ├── Student
│ └── Score
│
│
├── 🎓 STUDENT
│ │
│ ├── /dashboard
│ │ ├── Welcome Header
│ │ ├── My Class
│ │ ├── Upcoming Assessments
│ │ │ ├── Assessment
│ │ │ ├── Subject
│ │ │ ├── Due Date
│ │ │ └── Start
│ │ │
│ │ └── Recent Results
│ │ ├── Assessment
│ │ └── Score
│ │
│ ├── /assessments
│ │ ├── Upcoming
│ │ │ └── Assessment Cards
│ │ │
│ │ └── Completed
│ │ └── Assessment Cards
│ │
│ ├── /assessments/:assessmentId
│ │ ├── Assessment Information
│ │ │ ├── Title
│ │ │ ├── Subject
│ │ │ ├── Question Count
│ │ │ └── Due Date
│ │ │
│ │ ├── Start Assessment
│ │ │
│ │ └── Taking Assessment
│ │ ├── Progress
│ │ ├── Question
│ │ ├── Answer Options
│ │ ├── Previous
│ │ ├── Next
│ │ ├── Save & Exit
│ │ └── Submit
│ │
│ └── /results
│ ├── Result List
│ │ ├── Assessment
│ │ ├── Subject
│ │ ├── Score
│ │ └── Date
│ │
│ └── Result Detail
│ ├── Score
│ └── Question Review
│
│
└── 👨‍👩‍👧 PARENT
│
├── /dashboard
│ ├── Welcome Header
│ ├── Children
│ │ ├── Child Name
│ │ ├── Class
│ │ └── Latest Result
│ │
│ └── Recent Results
│
├── /children
│ ├── Children List
│ │ ├── Name
│ │ ├── Class
│ │ ├── Assessment Count
│ │ └── Average
│ │
│ └── /children/:studentId
│ ├── Child Header
│ │ ├── Name
│ │ └── Class
│ │
│ └── Assessment Results
│ ├── Assessment
│ ├── Subject
│ ├── Score
│ └── Date
│
└── /results
└── (optional / can be merged into Child Detail)

# KDC School Management System API

## Overview

The KDC School Management System is a comprehensive backend API for managing student academic records, computer-based testing (CBT) examinations, exam scheduling, and result management.

The system is designed with:

- Clean service-layer separation
- Role-based access control (superAdmin → admin → teacher → student)
- CBT module with exam scheduling, question management, and session tracking
- Academic term validation and result finalization protection
- Atomic score updates and exam answer processing
- Session resilience (resume interrupted exams)
- Auto-generated student registration numbers
- Natural language student search
- Scalable MongoDB structure with proper indexing
- Automated cron jobs (term finalization, timetable status updates, exam release)

This project uses:

- Node.js
- Express.js
- TypeScript
- MongoDB/Mongoose
- Zod (validation)
- node-cron (scheduled tasks)
- Morgan (logging)
- JWT (authentication)

---

# Features

## Authentication & Authorization

- JWT-based authentication with role hierarchy
- Role-based access control (superAdmin, admin, teacher, parent, student)
- Protected middleware with restrictTo guards
- Centralized error handling

## Student Management

- Register new students with auto-generated registration numbers
- Natural language search (e.g., "boys in JSS1", "graduating students")
- Filter by class, gender, active status
- Sort by age, date added
- Count queries (e.g., "how many girls")
- Pagination support
- Update student records
- Fetch by MongoDB ID or student registration number

## CBT (Computer Based Testing) Module

### Exam Management
- Teachers create exams with duration and subject assignment
- Admin schedules exams via Timetable (controls student access)
- Unique constraint: one exam per teacher per subject per class per term
- Exam visibility controlled by `isReleased` flag (cron-updated)
- Teachers can update duration/class only before timetable exists
- Teachers can delete exams only if no timetable scheduled

### Question Management
- Teachers add questions (4 options, one correct answer) to exams
- Duplicate detection (case-insensitive)
- Questions locked once timetable is scheduled
- Teachers can view all questions + correct answers
- Students see questions only during active exam (no correct answers visible)
- Supports up to 500+ questions per exam

### Exam Sessions (CBT Execution)
- Students start exam → creates session, fetches all questions
- Resume capability: reconnect after network downtime (same session)
- Prevent retakes: once submitted, cannot retake
- Submit exam with answers → auto-calculates correctness
- Batch processing of answers (O(1) lookup via Map pattern)
- Tracks startTime, endTime, percentage, score

### Result Management
- CBT scores automatically calculated on submission
- Stores detailed answer history (question, selected answer, correctness)
- Integrate with traditional graded results (written scores)
- Final score = CBT + written scores
- Grade calculation per Nigerian standard
- Leaderboard support (top students per session/term)
- Result finalization protection (no changes after term ends)

## Academic Term Control

- Academic session management (e.g., 2026/2027)
- Term management (first, second, third) with offered subjects
- Result finalization protection
- Prevent exam/question modifications after term finalized
- Automated term finalization via cron job (runs daily at midnight)
- Timetable status auto-update via cron (pending → active → closed)
- Exam auto-release when timetable becomes active

## Safety Features

- No delete functionality for results/terms
- Protected finalized results and terms
- Centralized authorization checks (teacher ownership, admin override)
- Unique constraints prevent duplicates
- Optional chaining guards against data integrity issues

---

# Project Structure

```bash
src/
│
├── controllers/
│   ├── exam.controller.ts
│   ├── question.controller.ts
│   ├── examSession.controller.ts
│   ├── resultController.ts
│   ├── studentControllers.ts
│   └── timeTable.controller.ts
│
├── middleware/
│   ├── authMiddleware.ts
│   ├── globalErrorHandler.ts
│   ├── zodSchemaVerifier.middleware.ts
│   └── rateLimiter.ts
│
├── models/
│   ├── examModels.ts
│   ├── questions.ts
│   ├── examSession.ts
│   ├── resultModel.ts
│   ├── studentModel.ts
│   ├── termModel.ts
│   ├── timeTable.ts
│   ├── teacherAssignment.ts
│   ├── subjects.ts
│   └── classSubject.ts
│
├── routes/
│   ├── exam.route.ts
│   ├── question.route.ts
│   ├── examSession.route.ts
│   ├── resultRoute.ts
│   ├── studentRoute.ts
│   ├── timeTable.route.ts
│   └── ...
│
├── services/
│   ├── exam.service.ts
│   ├── questions.service.ts
│   ├── examSession.service.ts
│   ├── timeTable.service.ts
│   ├── resultService.ts
│   └── studentService.ts
│
├── validators/
│   ├── examValidator.ts
│   ├── questions.validator.ts
│   ├── examSession.validator.ts
│   └── ...
│
├── utils/
│   ├── appError.ts
│   ├── catchAsync.ts
│   ├── cronJob.ts
│   ├── dateParser.ts
│   └── studentNLPParser.ts
│
├── app.ts
└── server.ts
```

---

# Database Design

## Exam Model

Represents a CBT exam scheduled for a specific class/subject/teacher.

```json
{
  "_id": "ObjectId",
  "assignedTeacher": "ObjectId (TeacherAssignment)",
  "subject": "ObjectId (Subject)",
  "class": "SS2",
  "term": "ObjectId (Term)",
  "duration": 70,
  "isReleased": false,
  "createdAt": "2026-06-24T12:37:49.434Z",
  "updatedAt": "2026-06-27T21:44:09.612Z"
}
```

**Unique Index:** `(assignedTeacher, subject, class, term)`

**Access Control:**
- Create: Teacher (of assignment)
- Read: Teacher (own), Student (their class), Admin (all)
- Update: Teacher (own, duration/class only, if no timetable)
- Delete: Teacher (own, if no timetable)

---

## Question Model

Represents a single MCQ question within an exam.

```json
{
  "_id": "ObjectId",
  "exam": "ObjectId (Exam)",
  "questionText": "Which of the following...",
  "options": [
    { "label": "A", "text": "Option text" },
    { "label": "B", "text": "Option text" },
    { "label": "C", "text": "Option text" },
    { "label": "D", "text": "Option text" }
  ],
  "correctAnswer": "A",
  "createdAt": "2026-06-30T16:10:14.413Z",
  "updatedAt": "2026-06-30T16:10:14.413Z"
}
```

**Duplicate Detection:** Case-insensitive exact match on `questionText` per exam

**Access Control:**
- Create: Teacher (of exam), if no timetable scheduled
- Read: Teacher (all + correct answers), Student (during active exam, no correct answers)
- Update: Teacher (if no timetable)
- Delete: Teacher (if no timetable)

---

## Timetable Model

Controls when an exam is active (student access window).

```json
{
  "_id": "ObjectId",
  "exam": "ObjectId (Exam)",
  "startTime": "2026-07-10T10:00:00.000Z",
  "endTime": "2026-07-10T11:10:00.000Z (auto-calculated)",
  "status": "active",
  "createdAt": "2026-06-24T12:37:49.434Z",
  "updatedAt": "2026-06-27T21:44:09.612Z"
}
```

**Status Enum:** `pending` → `active` → `closed` (auto-updated by cron)

**Unique Index:** `(exam, startTime)`

**Access Control:**
- Create: Admin only
- Read: Everyone (no filtering)
- Update: Admin only
- Delete: Admin only

**Cron Behavior:**
- `status: pending` → `active` when `startTime <= now < endTime`
- `status: active` → `closed` when `endTime <= now`
- When status becomes `active`: automatically set `Exam.isReleased = true`

---

## ExamSession Model

Tracks a student's exam attempt (CBT execution).

```json
{
  "_id": "ObjectId",
  "student": "ObjectId (Student)",
  "exam": "ObjectId (Exam)",
  "timeTable": "ObjectId (TimeTable)",
  "status": "submitted",
  "startTime": "2026-07-10T10:05:30.000Z",
  "endTime": "2026-07-10T11:08:45.000Z",
  "answers": [
    {
      "question": "ObjectId (Question)",
      "selectedAnswer": "A",
      "isCorrect": true,
      "_id": "ObjectId"
    },
    {
      "question": "ObjectId (Question)",
      "selectedAnswer": "B",
      "isCorrect": false,
      "_id": "ObjectId"
    }
  ],
  "cbtScore": 45,
  "percentage": 75,
  "createdAt": "2026-07-10T10:05:30.000Z",
  "updatedAt": "2026-07-10T11:08:45.000Z"
}
```

**Status Enum:** `active` → `submitted` (or `auto-submitted` if time expires)

**Unique Index:** `(timeTable, student)` — one attempt per student per timetable slot

**Access Control:**
- Create: Student (via startExam)
- Read: Student (own), Teacher (their exam), Admin (all)
- Update: Internal (submitExam only)

**Resume Logic:**
- If student reconnects before submission: return existing `active` session
- If student tries after submission: return 409 (already submitted)

---

## Result Model

Stores final academic result (CBT + written scores).

```json
{
  "_id": "ObjectId",
  "student": "ObjectId (Student)",
  "subject": "ObjectId (Subject)",
  "teacher": "ObjectId (TeacherAssign)",
  "cbtScore": 75,
  "writtenScore": 60,
  "finalScore": 68,
  "grade": "B3",
  "isLocked": false,
  "term": "ObjectId (Term)",
  "createdAt": "2026-07-10T11:00:00.000Z",
  "updatedAt": "2026-07-10T11:00:00.000Z"
}
```

**Unique Index:** `(student, term, subject)`

**Protection:** No modifications if term is finalized

---

## Term Model

Controls academic period and finalization state.

```json
{
  "_id": "ObjectId",
  "session": "2026/2027",
  "term": "first",
  "offeredSubjects": ["ObjectId (Subject)", "ObjectId (Subject)"],
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-11-30T00:00:00.000Z",
  "isFinalised": false,
  "isActive": true,
  "createdAt": "2026-06-11T11:50:39.577Z",
  "updatedAt": "2026-06-11T11:50:39.577Z"
}
```

**Unique Index:** `(session, term)`

**Cron Finalization:** Auto-set `isFinalised = true` at midnight if `endDate` is today

---

# API Routes

## Base URL

```
/api/v1
```

---

# Exam Routes

## Create Exam

```http
POST /exam
```

**Auth:** `protect → restrictTo('teacher')`

**Request Body:**
```json
{
  "assignedTeacher": "ObjectId",
  "subject": "ObjectId",
  "className": "SS2",
  "duration": 70,
  "term": "ObjectId"
}
```

**Response:** 201 Created with populated exam

---

## Get All Exams (Role-Aware)

```http
GET /exam
```

**Auth:** `protect`

**Response:**
- **Student:** Exams for their class only
- **Teacher:** Exams they created
- **Admin:** All exams

---

## Get Exam By ID (Role-Aware)

```http
GET /exam/:id
```

**Auth:** `protect`

**Response:** Single exam with authorization check

---

## Update Exam

```http
PATCH /exam/:id
```

**Auth:** `protect → restrictTo('teacher')`

**Allowed Fields:** `duration`, `className`

**Restrictions:**
- Teacher ownership required
- Cannot update if timetable exists (returns 409)

---

## Delete Exam

```http
DELETE /exam/:id
```

**Auth:** `protect → restrictTo('teacher')`

**Restrictions:**
- Teacher ownership required
- Cannot delete if timetable exists (returns 409)
- Cannot delete if released (returns 403)

---

# Question Routes

## Create Question

```http
POST /api/v1/:examId/questions
```

**Auth:** `protect → restrictTo('teacher')`

**Request Body:**
```json
{
  "exam": "ObjectId",
  "questionText": "Which of the following...",
  "options": [
    { "label": "A", "text": "Option A" },
    { "label": "B", "text": "Option B" },
    { "label": "C", "text": "Option C" },
    { "label": "D", "text": "Option D" }
  ],
  "correctAnswer": "A"
}
```

**Restrictions:**
- Must be teacher of exam
- No timetable can exist (returns 409)
- Duplicate questions rejected (returns 409)

**Response:** 201 Created with question populated

---

## Get All Questions for Exam

```http
GET /api/v1/:examId/questions
```

**Auth:** `protect`

**Response:**
- **Teacher:** All questions with correct answers
- **Student:** Only during active exam (no correct answers)

---

## Update Question

```http
PATCH /api/v1/:examId/questions/:questionId
```

**Auth:** `protect → restrictTo('teacher')`

**Allowed Fields:** `questionText`, `options`, `correctAnswer`

**Restrictions:**
- Teacher ownership required
- No timetable can exist (returns 409)

---

## Delete Question

```http
DELETE /api/v1/:examId/questions/:questionId
```

**Auth:** `protect → restrictTo('teacher')`

**Restrictions:**
- Teacher ownership required
- No timetable can exist (returns 409)

---

# Exam Session Routes

## Start Exam

```http
POST /api/v1/:examId/exam-sessions
```

**Auth:** `protect → restrictTo('student')`

**Validation:**
- Exam must be released
- Timetable must be active
- Student class must match exam class

**Logic:**
- Create new session or resume existing `active` session
- Return session + all questions (no correct answers)

**Response:** 200 with `{ examSession, questions }`

---

## Submit Exam

```http
POST /api/v1/exam-session/submit/:sessionId
```

**Auth:** `protect → restrictTo('student')`

**Request Body:**
```json
{
  "answers": [
    {
      "question": "ObjectId",
      "selectedAnswer": "A"
    },
    {
      "question": "ObjectId",
      "selectedAnswer": "B"
    }
  ]
}
```

**Logic:**
- Verify session exists and is `active`
- Batch fetch all questions (O(1) Map lookup)
- Compare each answer against `Question.correctAnswer`
- Calculate cbtScore and percentage
- Update session: answers, cbtScore, percentage, endTime, status: `submitted`
- Return updated session with scores

**Response:** 200 with updated ExamSession

---

## Get Exam Session

```http
GET /api/v1/exam-session/:sessionId
```

**Auth:** `protect`

**Response:** Full session with populated references (student owns verification)

---

# Timetable Routes

## Create Timetable

```http
POST /api/v1/time-table
```

**Auth:** `protect → restrictTo('admin', 'superAdmin')`

**Request Body:**
```json
{
  "exam": "ObjectId",
  "startTime": "10/07/2026 10:00"
}
```

**Validation:**
- startTime must be in future (DD/MM/YYYY HH:mm format)
- Exam must exist
- Duration must be set on exam

**Calculated Field:** `endTime = startTime + (exam.duration * 60000)`

**Response:** 201 with populated timetable

---

## Get All Timetables

```http
GET /api/v1/time-table
```

**Auth:** `protect`

---

## Update Timetable

```http
PUT /api/v1/time-table/:id
```

**Auth:** `protect → restrictTo('admin', 'superAdmin')`

---

## Delete Timetable

```http
DELETE /api/v1/time-table/:id
```

**Auth:** `protect → restrictTo('admin', 'superAdmin')`

---

# Result Routes

## Create Result

```http
POST /api/v1/result
```

**Request Body:**
```json
{
  "name": "Chinedu Okafor",
  "studentId": "CHI/2026/001",
  "term": "first",
  "session": "2026/2027",
  "subject": "Mathematics",
  "score": 85,
  "teacherId": "TCH101"
}
```

---

## Update Subject Score

```http
PUT /api/v1/result/subject-score
```

---

## Add Subject Score

```http
PUT /api/v1/result/add/subject-score
```

---

## Get All Results

```http
GET /api/v1/result
```

---

## Get Result By ID

```http
GET /api/v1/result/id/:id
```

---

## Get Result By Registration Number

```http
GET /api/v1/result/:studentId
```

---

## Get Results By Term

```http
GET /api/v1/result/term?term=first&session=2026/2027
```

---

## Best Student Per Term

```http
GET /api/v1/result/bestResult?session=2026/2027
```

---

## Top 10 Students Per Session

```http
GET /api/v1/result/bestStudent-per-session?session=2026/2027
```

---

# Student Routes

## Register Student

```http
POST /api/v1/student/register
```

**Request Body:**
```json
{
  "name": "Chinedu Okafor",
  "stdClass": "JSS1",
  "gender": "male",
  "dob": "15/3/2012",
  "parentsContact": {
    "name": "Emmanuel Okafor",
    "phone": "08012345678",
    "email": "emmanuel.okafor@gmail.com",
    "relationship": "father"
  }
}
```

---

## Natural Language Search

```http
GET /api/v1/student/search?q=boys in JSS1&page=1&limit=10
```

**Supported Queries:**
- `boys`, `male` → Filter by gender
- `girls`, `female` → Filter by gender
- `active` → Filter active students
- `inactive`, `suspended` → Filter inactive
- `graduating` → Filter SS3
- `junior graduating` → Filter JSS3
- `senior students` → Filter SS1, SS2, SS3
- `junior students` → Filter JSS1, JSS2, JSS3
- `in JSS1` → Filter by class
- `named john` → Search by name
- `youngest` → Sort by DOB descending
- `oldest` → Sort by DOB ascending
- `recently added` → Sort by creation date
- `how many boys` → Count results
- `how many in JSS1` → Count by class

---

## Get All Students

```http
GET /api/v1/student/find/all-students
```

---

## Find Student By Registration Number

```http
GET /api/v1/student/findByStudentId?studentId=CHI/2026/001
```

---

## Find Student By ID

```http
GET /api/v1/student/:id
```

---

## Update Student

```http
PUT /api/v1/student/update/:id
```

---

# Validation Rules

## Exam Rules

- `assignedTeacher` must be valid TeacherAssignment reference
- `subject` must exist
- `term` must not be finalized
- `className` must be enum: jss1-ss3
- `duration` must be positive integer (minutes)
- Unique constraint: one exam per teacher per subject per class per term

## Question Rules

- `exam` must exist and not have scheduled timetable
- `questionText` minimum 4 characters
- `options` must be exactly 4 with labels A, B, C, D
- Each option text minimum 2 characters
- `correctAnswer` must be A, B, C, or D
- Duplicate detection: case-insensitive exact match per exam

## ExamSession Rules

- Student can only have one `active` session per timetable
- Once `submitted`, cannot retake
- Must answer all questions before submit
- Each answer must have valid question ID and selected answer

## Timetable Rules

- `startTime` must be in future (DD/MM/YYYY HH:mm format)
- `exam` must exist with duration set
- `endTime` auto-calculated: startTime + (duration × 60000ms)

## Result Rules

- One result per student per session per term
- Cannot modify if term is finalized
- Subject scores updated atomically
- Final score = (cbtScore + writtenScore) / 2

## Term Rules

- Auto-finalized when end date is reached (cron job)
- Offered subjects required as array

---

# Recommended Database Indexes

```typescript
// Exam
examSchema.index({ assignedTeacher: 1, subject: 1, class: 1, term: 1 }, { unique: true });

// Question
questionSchema.index({ exam: 1 });

// ExamSession
examSessionSchema.index({ timeTable: 1, student: 1 }, { unique: true });

// Timetable
timeTableSchema.index({ exam: 1, startTime: 1 }, { unique: true });

// Result
resultSchema.index({ student: 1, session: 1, term: 1, subject: 1 }, { unique: true });

// Term
termSchema.index({ session: 1, term: 1 }, { unique: true });
```

---

# Error Handling

The system uses centralized custom error handling with `AppError` and a global error handler middleware.

### HTTP Status Codes

- `200` — Success
- `201` — Resource created
- `400` — Validation error
- `403` — Forbidden (authorization failed, term finalized, no timetable, etc.)
- `404` — Not found
- `409` — Conflict (duplicate, timetable exists, already submitted, etc.)
- `500` — Server error (data integrity issue)

### Example Error Response

```json
{
  "status": "error",
  "message": "Cannot update question with scheduled timetable"
}
```

---

# Cron Jobs

## Term Finalization (Daily at 00:00)

Automatically finalizes any term where `endDate` is today or earlier.

```typescript
// Runs at midnight every day
0 0 * * *
```

## Timetable Status Update (Every minute)

Updates timetable status based on current time and triggers exam release.

```typescript
// Runs every minute
* * * * *

Logic:
- If startTime ≤ now < endTime: status = 'active', Exam.isReleased = true
- If endTime ≤ now: status = 'closed'
```

---

# Middleware Stack

## Request Flow

```
Request
  ↓
morgan (logging)
  ↓
express.json() (body parsing)
  ↓
Route-specific middleware:
  1. protect (verify JWT)
  2. restrictTo (verify role)
  3. validate (Zod schema)
  4. controller (business logic)
  ↓
globalErrorHandler (catch AppError)
  ↓
Response
```

---

# Running The Project

## Install Dependencies

```bash
yarn install
```

## Start Development Server

```bash
yarn dev
```

## Build Project

```bash
yarn build
```

## Start Production Server

```bash
yarn start
```

---

# Environment Variables

Create a `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kdc
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
```

---

# Key Design Decisions

### 1. Role-Based Access Control

Authorization is checked at middleware level (restrictTo) + service level (ownership verification). Fail-fast principle: check auth before fetching data.

### 2. Question Immutability After Timetable

Once a timetable is created, no questions can be added/modified/deleted. This prevents mid-exam question changes and ensures fairness.

### 3. Exam Release Automation

`Exam.isReleased` is controlled exclusively by cron job based on timetable status. Teachers cannot manually release exams. This ensures synchronization with student access windows.

### 4. Session Resume Logic

Students can reconnect and continue an `active` session. Once submitted, no retakes. This handles network failures gracefully.

### 5. Batch Answer Processing

Answers submitted in array form are batch-fetched and processed using a Map for O(1) lookup instead of O(n) loops. Scales to 500+ questions.

### 6. Detailed Answer Tracking

Every answer is stored with `isCorrect` flag for post-exam review and analysis. Enables detailed student feedback.

### 7. Unique Constraints

Exams: `(assignedTeacher, subject, class, term)`
ExamSessions: `(timeTable, student)`
Results: `(student, session, term, subject)`

Prevents duplicates at database level.

---

# Future Enhancements

- [ ] Randomize question order per student
- [ ] Randomize option order per student
- [ ] Class-based leaderboards (JSS1 vs JSS3 separate rankings)
- [ ] Student authentication (login with studentId + password)
- [ ] Cloudinary file upload for student documents
- [ ] Result and exam natural language search
- [ ] GPA calculation per Nigerian standard
- [ ] Grade generation algorithm
- [ ] Transcript generation (PDF export)
- [ ] Analytics dashboard (performance trends)
- [ ] Multi-school support
- [ ] Exam difficulty analysis
- [ ] Item analysis (question difficulty, discrimination)
- [ ] Partial credit scoring
- [ ] Multi-attempt mode with average calculation
- [ ] Time-per-question analytics
- [ ] Question bank (reusable across exams)
- [ ] Exam templates
- [ ] Bulk question import (CSV)

---

# Testing

## Postman Collection

Import the provided Postman collection to test all endpoints with pre-populated auth tokens and request bodies.

### Key Test Scenarios

**Exam Flow:**
1. Teacher creates exam
2. Admin schedules timetable
3. Cron updates timetable status to `active` + Exam.isReleased = true
4. Student starts exam (gets questions, no answers)
5. Student submits answers (auto-calculates score)
6. Review ExamSession with scores

**Authorization Checks:**
- Student tries to access other class's exam → 404
- Teacher tries to update exam with scheduled timetable → 409
- Teacher tries to create duplicate exam → 409 (unique constraint)
- Different teacher tries to update → 403

---

# Author

**Chika Mark**  
Backend Engineer, ALX Software Engineering Graduate  
Location: Abuja, Nigeria  
Email: markworship001@gmail.com  
GitHub: [@chika-12](https://github.com/chika-12)

---

# Project Timeline

**Phase 1 (Complete):**
- ✅ Subject & ClassSubject management
- ✅ TeacherAssignment (teacher-subject-class binding)
- ✅ Exam CRUD with authorization
- ✅ Question CRUD with duplicate detection
- ✅ Timetable creation + cron automation
- ✅ ExamSession (startExam, submitExam)

**Phase 2 (In Progress):**
- 🔄 ExamSession (getExamSession)
- 🔄 Result integration with cbtScore
- 🔄 Postman testing

**Phase 3 (Planned):**
- ⏳ Web portal frontend (Next.js)
- ⏳ Parent/Student dashboards
- ⏳ Report generation
- ⏳ Deployment (DigitalOcean)

---

# License

Proprietary — KDC School Management System
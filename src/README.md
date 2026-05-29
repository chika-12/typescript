# School Result Management System API

## Overview

The School Result Management System is a backend API built for managing student academic records, term-based examination results, and score updates.

The system is designed with:

- Clean service separation
- Academic term validation
- Result finalization protection
- Atomic score updates
- Session and term consistency
- Scalable MongoDB structure

This project uses:

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

---

# Features

## Result Management

- Create student results
- Update subject scores
- Add new subject scores
- Fetch all student results
- Fetch result by ID
- Fetch result by registration number
- Fetch result by term

## Academic Term Control

- Academic session management
- Term management
- Result finalization protection
- Prevent updates after term finalization

## Safety Features

- No delete functionality
- Protected finalized results
- Centralized exam validation
- Compound academic filtering using:
  - session
  - term
  - studentId

---

# Project Structure

```bash
src/
│
├── controllers/
├── interfaces/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── app.ts
└── server.ts
```

---

# Database Design

## Result Model

The Result model stores:

- Student information
- Academic term
- Academic session
- Subject scores
- Teacher references

### Example Structure

```json
{
  "studentId": "ST001",
  "name": "John Doe",
  "term": "first",
  "session": "2025/2026",
  "scores": [
    {
      "subject": "Mathematics",
      "score": 85,
      "teacherId": "teacher123"
    }
  ]
}
```

---

## Term Model

The Term model controls academic state.

### Responsibilities

- Stores academic sessions
- Tracks term status
- Controls result finalization
- Prevents editing finalized results

### Example Structure

```json
{
  "session": "2025/2026",
  "term": "first",
  "isFinalised": false
}
```

---

# Result Finalization Logic

The system uses centralized exam validation.

Before creating or updating results:

1. The system checks if the term exists
2. The system checks if the term is finalized
3. If finalized, all write operations are blocked

This ensures academic integrity.

---

# API Routes

## Base URL

```bash
/api/v1
```

---

# Result Routes

## Create Result

Creates a new student result document.

### Endpoint

```http
POST /results
```

### Request Body

```json
{
  "name": "John Doe",
  "studentId": "ST001",
  "term": "first",
  "session": "2025/2026",
  "subject": "Mathematics",
  "score": 85,
  "teacherId": "teacher001"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Result created successfully"
}
```

---

## Update Subject Score

Updates an existing subject score for a student.

### Endpoint

```http
PATCH /results/update-score
```

### Request Body

```json
{
  "studentId": "ST001",
  "term": "first",
  "session": "2025/2026",
  "subject": "Mathematics",
  "score": 92,
  "teacherId": "teacher001"
}
```

---

## Add Subject Score

Adds a new subject score to an existing student result.

### Endpoint

```http
PATCH /results/add-subject
```

### Request Body

```json
{
  "studentId": "ST001",
  "term": "first",
  "session": "2025/2026",
  "subject": "Physics",
  "score": 78,
  "teacherId": "teacher002"
}
```

---

## Get All Results

Returns all student results.

### Endpoint

```http
GET /results
```

---

## Get Result By ID

Returns a student result using MongoDB document ID.

### Endpoint

```http
GET /results/:id
```

---

## Get Result By Student Registration Number

Returns a student result using the student registration number.

### Endpoint

```http
GET /results/student/:studentId
```

---

## Get Results By Term

Returns all results for a specific term.

### Endpoint

```http
GET /results/term/:term
```

---

# Term Routes

## Create Academic Term

Creates a new academic term.

### Endpoint

```http
POST /terms
```

### Request Body

```json
{
  "session": "2025/2026",
  "term": "first"
}
```

---

## Finalize Term

Locks all result modifications for a term.

### Endpoint

```http
PATCH /terms/finalize
```

### Request Body

```json
{
  "session": "2025/2026",
  "term": "first"
}
```

---

## Reopen Term

Reopens a finalized term.

### Endpoint

```http
PATCH /terms/reopen
```

### Request Body

```json
{
  "session": "2025/2026",
  "term": "first"
}
```

---

# Validation Rules

## Result Rules

- A student can only have one result document per:
  - session
  - term

- Results cannot be modified if:
  - term is finalized

- Subject scores are updated atomically.

---

# Recommended Database Indexes

## Result Schema

```ts
resultSchema.index({ studentId: 1, session: 1, term: 1 }, { unique: true });
```

## Term Schema

```ts
termSchema.index({ session: 1, term: 1 }, { unique: true });
```

---

# Error Handling

The system uses centralized custom error handling with AppError.

### Example Error Response

```json
{
  "success": false,
  "message": "This term has been finalized"
}
```

---

# Future Improvements

Potential future features:

- GPA calculation
- Grade generation
- Student ranking
- Transcript generation
- Authentication and authorization
- Role-based access control
- Audit logs
- PDF report export
- Analytics dashboard

---

# Running The Project

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

---

# Environment Variables

Create a `.env` file.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

---

# Author

Built as a scalable school result management backend system using Node.js, TypeScript, Express, and MongoDB.

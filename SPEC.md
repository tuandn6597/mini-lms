# Mini LMS Application Specification

## 1. Project Overview

- **Project Name**: Mini LMS (Learning Management System)
- **Core Functionality**: Web application for managing student-parent information, class scheduling, and subscription tracking
- **Target Users**: Small tutoring centers or educational institutions

## 2. Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB (using Mongoose ODM)
- **Frontend**: React.js with Vite
- **DevOps**: Docker, Docker Compose

## 3. Database Schema

### 3.1 Parents Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 Students Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  dob: Date,
  gender: String (enum: 'male', 'female', 'other'),
  current_grade: String,
  parent_id: ObjectId (ref: Parents),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 Classes Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  subject: String (required),
  day_of_week: Number (1-7, Monday=1, Sunday=7),
  time_slot: String (e.g., "09:00-10:30"),
  teacher_name: String (required),
  max_students: Number (default: 20),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 ClassRegistrations Collection
```javascript
{
  _id: ObjectId,
  class_id: ObjectId (ref: Classes),
  student_id: ObjectId (ref: Students),
  registeredAt: Date,
  status: String (enum: 'active', 'cancelled'),
  cancelledAt: Date
}
```

### 3.5 Subscriptions Collection
```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: Students),
  package_name: String (required),
  start_date: Date,
  expiry_date: Date,
  total_sessions: Number (required),
  used_sessions: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 4. API Endpoints

### 4.1 Parents API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/parents | Create a new parent |
| GET | /api/parents/:id | Get parent details |

### 4.2 Students API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/students | Create a new student (requires parent_id) |
| GET | /api/students/:id | Get student details including parent info |

### 4.3 Classes API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/classes | Create a new class |
| GET | /api/classes | List all classes |
| GET | /api/classes?day=:weekday | List classes by day of week (1-7) |

### 4.4 Class Registrations API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/classes/:class_id/register | Register student to class |
| DELETE | /api/registrations/:id | Cancel registration (refunds session if before class) |

### 4.5 Subscriptions API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/subscriptions | Create subscription for student |
| GET | /api/subscriptions/:id | Get subscription status |
| PATCH | /api/subscriptions/:id/use | Mark one session as used |

## 5. Business Rules

### 5.1 Class Registration Rules
1. **Max Students Check**: Cannot register if class has reached max_students
2. **Schedule Conflict Check**: Student cannot register for 2 classes with overlapping time_slot on same day
3. **Subscription Check**:
   - expiry_date must be in the future
   - used_sessions must be less than total_sessions

### 5.2 Cancellation Rules
- If cancelled before class time: refund session (increment available sessions)
- Status changes to 'cancelled'

## 6. Frontend Requirements

### 6.1 Pages/Components
1. **Parent & Student Form**: Form to create parent and student
2. **Class Schedule View**: Weekly table showing 7 days with time_slot and teacher
3. **Class Registration**: UI to register a student to a class
4. **Subscription Management**: View and update subscription status

### 6.2 UI Layout
- Simple, clean interface
- Navigation between sections
- Forms with validation
- Tables for data display

## 7. DevOps Configuration

### 7.1 Docker Setup
- **Backend**: Node.js container with Express.js
- **Frontend**: Node.js container with React/Vite
- **Database**: MongoDB container
- **Ports**:
  - Backend: 3000
  - Frontend: 5173
  - MongoDB: 27017

### 7.2 Docker Compose
- Services: backend, frontend, mongodb
- Shared network for inter-container communication

## 8. Project Structure

```
/interview
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── SPEC.md
```

## 9. Acceptance Criteria

1. All database models are created with proper validations
2. All API endpoints are functional with proper error handling
3. Business rules are enforced (max students, schedule conflict, subscription check)
4. Frontend can interact with all APIs
5. Docker setup works for local development
6. README provides clear setup instructions
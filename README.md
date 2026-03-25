# Mini LMS (Learning Management System)

A mini web application for managing student-parent information, class scheduling, and subscription tracking for small tutoring centers or educational institutions.

## Description

Mini LMS provides a simple interface to manage:
- **Parents & Students**: Create parent accounts and register students linked to parents
- **Classes**: Create and schedule classes with weekly timetable view
- **Registrations**: Enroll students in classes with automatic validation
- **Subscriptions**: Track student learning packages (total sessions, used sessions, remaining)

The system enforces business rules automatically:
- Prevents over-enrollment when class is full
- Detects schedule conflicts (same day/time)
- Validates subscription status before registration
- Handles cancellation with session refund

## Features

- **Parent & Student Management**: Create and manage parent and student records
- **Class Scheduling**: Weekly class schedule with 7-day view
- **Class Registration**: Register students for classes with business rule validations
- **Subscription Management**: Track student subscription packages (sessions used/remaining)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM)
- **Frontend**: React.js, Vite
- **Database**: MongoDB 7
- **DevOps**: Docker, Docker Compose

## Database Schema

### Parents
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| name | String | Parent's full name (required) |
| phone | String | Contact phone (required) |
| email | String | Email address |
| createdAt | Date | Record creation timestamp |

### Students
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| name | String | Student's full name (required) |
| dob | Date | Date of birth |
| gender | String | male/female/other |
| current_grade | String | Current school grade |
| parent_id | ObjectId | Reference to parent (required) |

### Classes
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| name | String | Class name (required) |
| subject | String | Subject matter (required) |
| day_of_week | Number | 1-7 (Monday=1, Sunday=7) |
| time_slot | String | e.g., "09:00-10:30" |
| teacher_name | String | Teacher's name (required) |
| max_students | Number | Maximum enrollment (default: 20) |

### ClassRegistrations
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| class_id | ObjectId | Reference to class |
| student_id | ObjectId | Reference to student |
| registeredAt | Date | Registration timestamp |
| status | String | active/cancelled |

### Subscriptions
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| student_id | ObjectId | Reference to student |
| package_name | String | Package name (required) |
| start_date | Date | Package start date |
| expiry_date | Date | Package expiry date (required) |
| total_sessions | Number | Total sessions in package |
| used_sessions | Number | Sessions already used |

## Project Structure

```
/interview
├── backend/               # Express.js API
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── seed.js       # Database seeder
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API client
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml     # Docker composition
├── SPEC.md               # Detailed specification
└── README.md
```

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- MongoDB port 27200 available

### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27200 (for Studio 3T, etc.)

### Stop services

```bash
docker-compose down
```

### Seed Database with Sample Data

```bash
docker-compose exec backend npm run seed
```

## Local Development (Without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### MongoDB

Make sure MongoDB is running locally on port 27200.

## API Endpoints

### Parents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/parents | Create parent |
| GET | /api/parents/:id | Get parent details |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | List all students |
| POST | /api/students | Create student |
| GET | /api/students/:id | Get student details (with parent info) |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/classes | Create class |
| GET | /api/classes | List all classes |
| GET | /api/classes?day=:weekday | List classes by day (1-7) |

### Class Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/classes/:class_id/register | Register student for class |
| GET | /api/registrations/student/:student_id | Get student's registrations |
| DELETE | /api/registrations/:id | Cancel registration |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/subscriptions | Create subscription |
| GET | /api/subscriptions/:id | Get subscription status |
| GET | /api/subscriptions/student/:student_id | Get student's subscriptions |
| PATCH | /api/subscriptions/:id/use | Use one session |

## API Demo with curl

```bash
# Create parent
curl -X POST http://localhost:3000/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"1234567890","email":"john@example.com"}'

# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","current_grade":"10","parent_id":"<parent_id>"}'

# Create class
curl -X POST http://localhost:3000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Math 101","subject":"Mathematics","day_of_week":1,"time_slot":"09:00-10:30","teacher_name":"Mr. Smith","max_students":20}'

# Create subscription
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"student_id":"<student_id>","package_name":"Monthly","expiry_date":"2026-12-31","total_sessions":10}'

# Register for class
curl -X POST http://localhost:3000/api/classes/<class_id>/register \
  -H "Content-Type: application/json" \
  -d '{"student_id":"<student_id>"}'

# Use session
curl -X PATCH http://localhost:3000/api/subscriptions/<subscription_id>/use

# Cancel registration
curl -X DELETE http://localhost:3000/api/registrations/<registration_id>

# List classes by day
curl "http://localhost:3000/api/classes?day=1"
```

## Business Rules

1. **Max Students**: Cannot register if class has reached max_students limit
2. **Schedule Conflict**: Student cannot register for 2 classes at the same time_slot on the same day_of_week
3. **Subscription Check**:
   - expiry_date must be in the future
   - used_sessions must be less than total_sessions
4. **Cancellation**: Cancelling a registration refunds one session (decrements used_sessions)

## Connecting to MongoDB

Use Studio 3T or any MongoDB client:
- **Host**: localhost
- **Port**: 27200
- **Database**: mini-lms
- **Authentication**: None
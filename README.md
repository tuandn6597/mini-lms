# Mini LMS (Learning Management System)

A mini web application for managing student-parent information, class scheduling, and subscription tracking.

## Features

- **Parent & Student Management**: Create and manage parent and student records
- **Class Scheduling**: Weekly class schedule with 7-day view
- **Class Registration**: Register students for classes with business rule validations
- **Subscription Management**: Track student subscription packages (sessions used/remaining)

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React.js, Vite
- **Database**: MongoDB
- **DevOps**: Docker, Docker Compose

## Project Structure

```
/interview
├── backend/               # Express.js API
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API client
│   │   └── App.jsx        # Main app component
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
- **MongoDB**: localhost:27200

### Stop services

```bash
docker-compose down
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

Make sure MongoDB is running locally or update `MONGODB_URI` in backend.

## API Endpoints

### Parents
- `POST /api/parents` - Create parent
- `GET /api/parents/:id` - Get parent details

### Students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details (with parent info)

### Classes
- `POST /api/classes` - Create class
- `GET /api/classes` - List all classes
- `GET /api/classes?day=:weekday` - List classes by day (1-7)

### Class Registrations
- `POST /api/classes/:class_id/register` - Register student for class
- `DELETE /api/registrations/:id` - Cancel registration

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - Get subscription status
- `PATCH /api/subscriptions/:id/use` - Use one session

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
```

## Business Rules

1. **Max Students**: Cannot register if class is full
2. **Schedule Conflict**: Student cannot register for 2 classes at the same time on the same day
3. **Subscription Check**:
   - Subscription must not be expired
   - Must have remaining sessions
4. **Cancellation**: Cancelling a registration refunds one session
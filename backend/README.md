# Backend - Attendance Management System (Vercel Serverless)

Node.js backend APIs refactored as Vercel serverless functions.

## Features

- 🚀 Vercel serverless functions (no server to manage)
- 🗄️ MySQL database integration with connection pooling
- 🔌 REST API endpoints for students and attendance
- 🌐 CORS support for cross-origin requests
- ⚡ Fast, scalable, and pay-as-you-go pricing

## Setup

### Environment Variables

Create a `.env` file (local development):

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=attendance_management
FRONTEND_URL=http://localhost:3000  # Optional, for CORS
```

### Install Dependencies

```bash
npm install
```

### Local Development

```bash
# MySQL must be running on your system
npm start          # Run server on http://localhost:4000
npm run dev        # Run with auto-reload (nodemon)
```

### Database Setup

```bash
# Run schema.sql on your database
mysql -u root -p < ../database/schema.sql
```

## Deployment to Vercel

### 1. Set Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - `DB_HOST` = Your PlanetScale/RDS host
   - `DB_PORT` = 3306 (or your port)
   - `DB_USER` = Database user
   - `DB_PASSWORD` = Database password
   - `DB_NAME` = attendance_management
   - `FRONTEND_URL` = Your frontend domain (optional)

### 2. Deploy

```bash
# Push to GitHub
git add .
git commit -m "Deploy backend to Vercel"
git push origin main

# Vercel auto-deploys on push, or

# Use Vercel CLI
npm i -g vercel
vercel
```

### 3. Test Deployment

```bash
# Visit Vercel URL
https://your-project.vercel.app/api/health

# Should return:
{
  "message": "API is running",
  "timestamp": "2024-03-24T...",
  "environment": "production"
}
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { message, timestamp, environment }
```

### Students
```
GET /api/students?date=YYYY-MM-DD
Response: [{ student_id, name, roll_number, status, remarks, attendance_id }]

POST /api/students
Body: { name, rollNumber }
Response: { message: "Student added successfully" }
```

### Attendance
```
GET /api/attendance?date=YYYY-MM-DD
Response: [{ student_id, name, roll_number, status, remarks, attendance_id, date }]

POST /api/attendance/mark
Body: { date: "YYYY-MM-DD", records: [{ studentId, status, remarks }] }
Response: { message: "Attendance saved successfully" }
```

## File Structure

```
backend/
├── api/
│   ├── db.js              # Database layer (connection pool, queries)
│   ├── health.js          # GET /api/health
│   ├── students.js        # GET/POST /api/students
│   └── attendance.js      # GET/POST /api/attendance
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  roll_number VARCHAR(40) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  remarks VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_date (student_id, date)
);
```

## Configuration

### vercel.json
Defines environment variables and build commands for Vercel deployment.

### CORS
Update `FRONTEND_URL` environment variable to allow requests from your frontend domain:

```javascript
res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
```

## Error Handling

- **400:** Invalid request (missing required parameters)
- **409:** Conflict (duplicate roll number)
- **500:** Server error (database issues, internal errors)

Check response `{ error: "..." }` for error details.

## Troubleshooting

- **Database connection error:** Verify credentials and that cloud database allows Vercel IPs
- **CORS errors:** Update `FRONTEND_URL` in Vercel environment variables
- **Timeout:** Check Vercel logs for slow queries (increase timeout or optimize queries)
- **Missing environment variables:** Verify all vars are set in Vercel Dashboard

## Performance Considerations

- **Connection pooling:** Reuses database connections across function invocations
- **Stateless functions:** Each request is independent (no persistent state)
- **Cold starts:** First request may take longer (typical for serverless)

## License

MIT

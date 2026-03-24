# Attendance Management System

Full-stack attendance system with separate frontend and backend deployment.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL

## Features

- Faculty login page
- Add students with unique roll numbers
- Class-wise and subject-wise attendance
- Mark all present or all absent
- Edit and resave attendance for a selected date

## Project Structure

```text
attendance-system/
  backend/
    api/
    server.js
    package.json
    vercel.json
  frontend/
    public/
      index.html
      login.html
      attendance.html
      app.js
      config.js
      styles.css
    package.json
  database/
    schema.sql
  CREDENTIALS.md
  DEPLOYMENT.md
  QUICKSTART.md
  README.md
```

## Local Development

### 1. Backend

```bash
cd backend
npm install
```

Create [backend/.env](backend/.env) with:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=attendance_management
FRONTEND_URL=http://localhost:3000
```

Start backend:

```bash
npm start
```

Backend runs on http://localhost:4000.

### 2. Database

Run [database/schema.sql](database/schema.sql) on your MySQL server.

### 3. Frontend

Use any static server from [frontend/public](frontend/public):

```bash
cd frontend
python -m http.server 3000
```

Open http://localhost:3000/login.html.

## Deployment

Use this recommended setup:

- Source code: GitHub
- Backend API: Render
- Frontend static site: Vercel

Complete steps are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Production API URL

Frontend API target is controlled in [frontend/public/config.js](frontend/public/config.js).

For production, set:

```js
window.APP_API_URL = "https://your-render-service.onrender.com";
```

## Login Credentials

Default credentials are documented in [CREDENTIALS.md](CREDENTIALS.md).

## Useful Docs

- [QUICKSTART.md](QUICKSTART.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
- [database/README.md](database/README.md)

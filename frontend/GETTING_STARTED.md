# Attendance System - Quick Start Guide

## 🚀 Start the Frontend

```bash
cd frontend
python -m http.server 3000
```

Then open your browser and go to:
```
http://localhost:3000
```

## 📝 Login Flow

1. **Entry Point** → You'll see the login page automatically (if not logged in)
2. **Enter Credentials:**
   - Email: `23eg110a27@anurag.edu.in`
   - Password: `faculty@ds`
3. **Click Sign In** → You'll be redirected to the attendance management system
4. **Attend System** → Use the attendance system to manage students and mark attendance

## 🚪 Logout

- Click the red **"Logout"** button in the top-right corner
- Confirm logout
- You'll be redirected back to the login page

## 🔄 How the Routing Works

```
User visits http://localhost:3000/
           ↓
    index.html (Router)
           ↓
    Is user logged in?
    ├─ YES → Redirect to /attendance.html (Attendance System)
    └─ NO  → Redirect to /login.html (Login Page)
```

## 📁 Frontend Structure

```
frontend/public/
├── index.html          ← Entry point (router)
├── login.html          ← Login page
├── login.js            ← Login logic
├── attendance.html     ← Attendance system page
├── app.js              ← Attendance system logic
└── styles.css          ← All styling
```

## 🧪 File Guide

| File | Purpose |
|------|---------|
| **index.html** | Automatically redirects to login or attendance based on login status |
| **login.html** | Beautiful login form with email & password |
| **login.js** | Handles login validation and session management |
| **attendance.html** | Main attendance management system page |
| **app.js** | Contains all attendance logic (add students, mark attendance, etc.) |
| **styles.css** | Beautiful styling for the entire application |

## 🔐 Credentials

- **Email:** `23eg110a27@anurag.edu.in`
- **Password:** `faculty@ds`

See [CREDENTIALS.md](../CREDENTIALS.md) for more info.

## ⚙️ Backend (Optional)

To also run the backend API:

```bash
cd backend
npm install
echo "DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_management" > .env
npm start
```

Backend will run on: `http://localhost:4000`

## 🎯 What You Can Do

1. **Add Students** - Create new students with roll numbers
2. **Mark Attendance** - Select a date and mark attendance as Present/Absent
3. **Add Remarks** - Add optional remarks for each student
4. **Bulk Actions** - Mark all students as Present or Absent at once
5. **Save Records** - Save attendance to the database

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't access http://localhost:3000 | Make sure `python -m http.server 3000` is running |
| Login not working | Check that you're using exact credentials: `23eg110a27@anurag.edu.in` / `faculty@ds` |
| Page redirects to login after logout | This is expected - you're logged out |
| Backend API calls fail | Make sure backend is running on http://localhost:4000 |

---

**Everything is ready to use!** 🎉

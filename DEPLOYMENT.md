# Deployment Guide (GitHub + Render + Vercel)

This project is deployed as:
- Backend API + PostgreSQL Database on **Render**
- Frontend static site on **Vercel**
- Source code on **GitHub**

**No external database needed!** Render provides free PostgreSQL with each Web Service.

---

## 1. Push Project to GitHub

Your code is already on GitHub. Just ensure everything is committed:

```bash
cd c:\Users\Harshith kumar\OneDrive\Desktop\attendance-system
git add .
git commit -m "Update backend to use PostgreSQL for Render deployment"
git push origin main
```

Verify: https://github.com/HarshithKumar9381/Attendance-System

---

## 2. Deploy Backend + Database on Render

### Step 1: Sign Up / Log In to Render

1. Go to https://render.com
2. Sign up with GitHub (easiest option)
3. Authorize access to your GitHub account

### Step 2: Create a New PostgreSQL Database

1. **Go to Render Dashboard** → Click **"New +"** → **"PostgreSQL"**

2. **Configure Database:**
   - **Name:** `attendance-db`
   - **Database:** `attendance_management`
   - **User:** `postgres` (default)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15 (default)
   - **Instance Type:** Free ($0/month)

3. **Create Database** and wait for it to be ready (2-3 minutes)

4. **Copy the Database Connection String:**
   - Go to your database dashboard
   - Look for "Connections" section
   - Copy the **External Database URL** (looks like: `postgresql://user:password@host:port/database`)
   - **Save this URL** - you'll need it soon

### Step 3: Create a New Web Service (Backend)

1. **Click "New +"** → **"Web Service"**

2. **Connect GitHub Repository:**
   - Click "Connect account" → Authorize GitHub
   - Search for and select: `HarshithKumar9381/Attendance-System`
   - Click "Connect"

3. **Configure Web Service:**
   - **Name:** `attendance-backend`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

4. **Add Environment Variables:**
   - Click **"Advanced"** or scroll to "Environment"
   - Add these variables:
   
   ```
   DATABASE_URL = postgresql://user:password@dpg-xxxxx.render.com:5432/attendance_management
   NODE_ENV = production
   FRONTEND_URL = https://attendance-system-frontend.vercel.app
   ```
   
   *(Replace DATABASE_URL with the one you copied from Step 2)*

5. **Deploy** by clicking **"Create Web Service"**

   **Wait 3-5 minutes for deployment**

6. **Test Your Backend:**
   - After deployment, note your URL (e.g., `https://attendance-backend-xxxxx.onrender.com`)
   - Visit: `https://your-render-service.onrender.com/api/health`
   - Expected response: `{"message":"API is running","timestamp":"2024-..."}`

---

## 3. Configure Frontend API URL

Update the frontend to point to your Render backend:

### Edit `frontend/public/config.js`:

```javascript
window.APP_API_URL = "https://attendance-backend-xxxxx.onrender.com";
```

*(Replace `xxxxx` with your actual Render service name)*

### Push to GitHub:

```bash
git add frontend/public/config.js
git commit -m "Update API URL to Render backend"
git push origin main
```

---

## 4. Deploy Frontend on Vercel

### Step 1: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize GitHub access

### Step 2: Import and Deploy Project

1. **Click "Add New"** → **"Project"**

2. **Import Git Repository:**
   - Click "Import Git Repository"
   - Search for `Attendance-System`
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** `attendance-system-frontend`
   - **Framework Preset:** `Other`
   - **Root Directory:** `frontend`
   - **Build Command:** *(leave empty)*
   - **Output Directory:** `public`
   - **Install Command:** *(leave empty)*
   - **Environment Variables:** *(none needed)*

4. **Deploy** by clicking **"Deploy"**

   **Wait 1-2 minutes**

5. **Verify Deployment:**
   - After deployment, you'll get a URL like: `https://attendance-system-frontend.vercel.app`
   - Visit that URL
   - You should see the login page

---

## 5. Update Backend Environment Variable (Final Step)

Go back to **Render Dashboard**:

1. **Click your** `attendance-backend` **web service**
2. **Go to "Environment"** (left sidebar)
3. **Update** `FRONTEND_URL = https://attendance-system-frontend.vercel.app`
4. **Click "Save"** → Service redeploys automatically

---

## 6. Test Everything

### Test Backend API:
```
https://your-render-service.onrender.com/api/health
Expected: JSON response with API status
```

### Test Frontend:
```
https://attendance-system-frontend.vercel.app
Expected: Login page loads
```

### Test Login:
- **Email:** `23eg110a27@anurag.edu.in`
- **Password:** `faculty@ds`
- Expected: Redirects to attendance dashboard

### Test Attendance Features:
- Add students (check if data saves in PostgreSQL)
- Mark attendance
- View reports

---

## Deployment Summary

| Service | URL | Free Tier |
|---------|-----|-----------|
| **Frontend (Vercel)** | https://attendance-system-frontend.vercel.app | ✅ Yes |
| **Backend (Render)** | https://attendance-backend-xxxxx.onrender.com | ✅ Yes |
| **Database (PostgreSQL on Render)** | Included with backend | ✅ Yes |
| **GitHub** | https://github.com/HarshithKumar9381/Attendance-System | ✅ Yes |

**Total Cost:** $0/month (free tier only)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Login fails** | Check DevTools Network tab. Verify DATABASE_URL in Render environment. |
| **"Cannot connect to database"** | Ensure PostgreSQL database is running. Verify DATABASE_URL format. |
| **Backend returns 503 error** | Render may still be starting. Wait 5 minutes. Check build logs in Render dashboard. |
| **Static files not loading** | Verify output directory is `public` in Vercel settings. |
| **CORS errors** | Check CORS is enabled in `backend/server.js`. Verify FRONTEND_URL in Render. |
| **Database empty after deploy** | Run manual seeding or seed through API calls. Database persists between deployments. |

---

## Local Development

To test locally with PostgreSQL:

1. **Install PostgreSQL locally**
2. **Create database:** `createdb attendance_management`
3. **Set environment variables:**
   ```bash
   DATABASE_URL=postgresql://postgres:password@localhost:5432/attendance_management
   NODE_ENV=development
   ```
4. **Start backend:** `cd backend && npm start`
5. **Start frontend:** `cd frontend && npm start`

---

## Database Connection String Format

PostgreSQL format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Render provides this automatically** - just copy and paste!

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Docs:** https://docs.github.com
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

It should redirect to login and then to attendance flow.

## 6. Final Checks

- Backend health works on Render
- Frontend loads on Vercel
- Add student works
- Attendance save works
- No CORS errors in browser console

## 7. Updating Later

For future updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Render and Vercel will auto-deploy from GitHub.

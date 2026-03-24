# Deployment Guide (GitHub + Render + Vercel)

This project is best deployed as:
- Backend API on Render
- Frontend static site on Vercel
- Source code on GitHub

## 1. Push Project to GitHub

From project root:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/attendance-system.git
git push -u origin main
```

If repo already exists, only do:

```bash
git add .
git commit -m "Prepare deployment"
git push
```

## 2. Prepare a MySQL Database (Cloud)

You need a public MySQL database for production.

Use one of these:
- Railway MySQL
- PlanetScale
- Aiven MySQL
- Any hosted MySQL provider

Collect these values:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

## 3. Deploy Backend on Render

1. Open Render dashboard and click **New +** -> **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - Name: `attendance-backend` (or your choice)
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://<your-frontend-domain>.vercel.app`
5. Deploy service.

After deployment, test:

```text
https://<your-render-service>.onrender.com/api/health
```

Expected: JSON response with API status.

## 4. Configure Frontend API URL

Edit `frontend/public/config.js`:

```js
window.APP_API_URL = "https://<your-render-service>.onrender.com";
```

Commit and push this change.

## 5. Deploy Frontend on Vercel

1. Open Vercel dashboard and click **Add New** -> **Project**.
2. Import your GitHub repo.
3. Configure build settings:
   - Framework Preset: `Other`
   - Root Directory: `frontend`
   - Build Command: (leave empty)
   - Output Directory: `public`
4. Deploy.

After deployment, open:

```text
https://<your-vercel-project>.vercel.app
```

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

# Attendance System - Deployment & Quick Start Guide

This is a **separated, multi-folder project** designed for easy independent deployment:
- **Frontend** → Deploy to GitHub Pages / Netlify / Vercel (with login system)
- **Backend** → Deploy to Vercel as serverless functions
- **Database** → PlanetScale or AWS RDS

## Login Credentials

Use these credentials to access the attendance system:
- **Email:** `23eg110a27@anurag.edu.in`
- **Password:** `faculty@ds`

See [CREDENTIALS.md](CREDENTIALS.md) for more details.

## Quick Start

### 1️⃣ Local Development

**Backend (Node.js):**
```bash
cd backend
npm install
echo "DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_management" > .env
npm start  # Runs on http://localhost:4000
```

**Frontend (Browser):**
```bash
cd frontend
python -m http.server 3000
# Open http://localhost:3000/login.html
# Enter credentials: 23eg110a27@anurag.edu.in / faculty@ds
```

**Database (MySQL):**
```bash
# Run schema.sql on your local MySQL
mysql -u root < database/schema.sql
```

### 2️⃣ Cloud Deployment

**Setup Cloud Database:**
- PlanetScale: https://planetscale.com (Free tier recommended)
- AWS RDS: https://aws.amazon.com/rds

**Deploy Backend to Vercel:**
1. Create Vercel account: https://vercel.com
2. Add environment variables (DB_HOST, DB_USER, DB_PASSWORD, etc.)
3. Deploy: `vercel` or push to GitHub (auto-deploy)
4. Copy your Vercel URL

**Update Frontend API URL:**
```javascript
// frontend/public/app.js (Line 1)
const API_BASE_URL = "https://your-vercel-domain.vercel.app";
```

**Deploy Frontend to Netlify:**
1. Connect GitHub repo to Netlify: https://netlify.com
2. Build settings:
   - Build command: (empty)
   - Publish directory: `frontend/public`
3. Deploy

## Project Structure

```
attendance-system/
├── frontend/                  # 🎨 Frontend (Netlify/GitHub Pages)
│   ├── public/
│   │   ├── index.html
│   │   ├── app.js            (Update API_BASE_URL here)
│   │   └── styles.css
│   └── package.json
│
├── backend/                   # ⚙️ Backend (Vercel serverless)
│   ├── api/
│   │   ├── db.js
│   │   ├── health.js
│   │   ├── students.js
│   │   └── attendance.js
│   ├── package.json
│   ├── vercel.json           (Environment vars config)
│   └── README.md
│
├── database/                  # 🗄️ Database (PlanetScale/AWS RDS)
│   ├── schema.sql
│   └── README.md
│
└── README.md                  (Full deployment guide)
```

## Next Steps

1. ✅ **Folder structure ready** - Frontend & Backend separated
2. ⬜ **Set up cloud database** - PlanetScale or AWS RDS
3. ⬜ **Deploy backend** - Vercel (`vercel` or push to GitHub)
4. ⬜ **Deploy frontend** - Netlify or GitHub Pages
5. ⬜ **Update API URLs** - Point frontend to your Vercel domain
6. ⬜ **Test end-to-end** - Add student, mark attendance, verify data

## Deployment URLs

After deployment, you'll have:
- **Frontend:** `https://your-domain.com` (Netlify) or `https://username.github.io/repo`
- **Backend:** `https://your-project.vercel.app/api/*` (Vercel)
- **Database:** `your-host` (PlanetScale/AWS)

## Environment Variables

### Backend (Vercel Dashboard or `.env`)
```
DB_HOST=your-planetscale-host
DB_PORT=3306
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=attendance_management
FRONTEND_URL=https://your-frontend-domain.com (Optional)
```

### Frontend (app.js)
```javascript
const API_BASE_URL = "https://your-vercel-project.vercel.app";
```

## Need Help?

- **Frontend issues:** See `frontend/README.md`
- **Backend issues:** See `backend/README.md`
- **Database setup:** See `database/README.md`
- **Full guide:** See `README.md`

## Tech Stack

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend | Vanilla JS/HTML/CSS | Netlify / GitHub Pages / Vercel |
| Backend | Node.js + Express | Vercel Serverless |
| Database | MySQL 8.0+ | PlanetScale / AWS RDS |

---

**Ready to deploy?** Start with the database setup, then deploy backend to Vercel, then frontend to Netlify! 🚀

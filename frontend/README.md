# Frontend - Attendance Management System

Vanilla HTML, CSS, and JavaScript frontend for the Attendance Management System with integrated faculty login.

## Features

- 🔐 **Secure Login** - Email and password authentication
- 📅 Date selection for attendance marking
- 👥 Student management (add students with unique roll numbers)
- ✅ Mark attendance as Present/Absent with optional remarks
- 📊 Bulk actions (Mark All Present/Absent)
- 🎨 Beautiful responsive UI with animations
- ⚡ Fast client-side rendering with vanilla JavaScript
- 🚪 Logout functionality with session management

## Setup

### Login Credentials

Before logging in, use these default credentials (see [CREDENTIALS.md](../CREDENTIALS.md) for details):

- **Email:** `23eg110a27@anurag.edu.in`
- **Password:** `faculty@ds`

**⚠️ Note:** For production, implement server-side authentication and use secure methods (OAuth, JWT, etc.)

### Local Development

```bash
# Option 1: Using Python (if installed)
python -m http.server 3000

# Option 2: Using Node.js http-server
npx http-server public -p 3000

# Option 3: Using npm script
npm start
```

Open `http://localhost:3000/login.html` in your browser.

**Login Flow:**
1. Enter email and password on login page
2. Click "Sign In"
3. On successful login, you'll be redirected to the attendance system
4. Click "Logout" button in the header to logout

## Configuration

### Update API Base URL

Update the API base URL in `public/app.js`:

```javascript
// Line 1 - Update to your backend URL
const API_BASE_URL = "https://your-backend-domain.vercel.app";
```

### Change Login Credentials

To modify credentials, edit `public/login.js`:

```javascript
const VALID_EMAIL = "your-email@example.com";
const VALID_PASSWORD = "your-password";
```

**Important:** For production, implement server-side authentication instead of client-side credentials.

## Deployment

### Netlify (Recommended)

1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `frontend/public`
3. Deploy

### GitHub Pages

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: `/frontend/public`
4. Your site: `https://username.github.io/repo-name`

### Vercel

1. Import repository
2. Root directory: `frontend`
3. Build command: (leave empty)
4. Output directory: `public`
5. Deploy

## File Structure

```
frontend/
├── public/
│   ├── login.html         # Login page (entry point)
│   ├── login.js           # Login authentication logic
│   ├── index.html         # Main attendance management page
│   ├── app.js             # Attendance app logic with auth protection
│   └── styles.css         # Styling
└── package.json           # Project metadata
```

## API Integration

Frontend communicates with backend via REST API:

- `GET /api/students` - Fetch all students
- `POST /api/students` - Add new student
- `GET /api/attendance?date=YYYY-MM-DD` - Fetch attendance for date
- `POST /api/attendance/mark` - Save attendance records

## Environment Variables

None required for frontend (configuration is in HTML/JS).  
Update `API_BASE_URL` constant in `public/app.js` to point to your backend.

## Troubleshooting

- **CORS errors:** Ensure backend allows requests from your frontend domain
- **API calls failing:** Verify `API_BASE_URL` matches your deployed backend
- **Styling issues:** Check that `styles.css` is loaded (`/styles.css`)
- **JavaScript errors:** Check browser console for details

## License

MIT

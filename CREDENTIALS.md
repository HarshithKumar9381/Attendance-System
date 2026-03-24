# Login Credentials

## Faculty Access

This file contains the credentials needed to access the Attendance Management System.

### Valid Credentials

- **Email:** `23eg110a27@anurag.edu.in`
- **Password:** `faculty@ds`

## Testing

1. Start the frontend server:
   ```bash
   cd frontend
   python -m http.server 3000
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/login.html
   ```

3. Enter the credentials above
4. You'll be redirected to the attendance management system

## Security Notes

- Credentials are validated on the client-side for demo purposes
- For production, implement server-side authentication
- Use HTTPS for secure credential transmission
- Consider implementing OAuth, JWT, or other secure authentication mechanisms
- Store credentials securely (e.g., hashed passwords in database)
- Add rate limiting to prevent brute force attacks

## Features

- ✅ Login form with email and password
- ✅ Client-side validation
- ✅ Secure credential checking (does not reveal which field is wrong)
- ✅ Session management using localStorage
- ✅ Automatic logout functionality
- ✅ Protected pages (redirects to login if not authenticated)
- ✅ Beautiful UI with animations and error handling

## Session Management

- Login status is stored in `localStorage.facultyAuthenticated`
- User email is stored in `localStorage.facultyEmail`
- Login timestamp is stored in `localStorage.loginTime`
- Logout clears all session data
- Refresh the page from no issue - you'll stay logged in

## Customization

To change credentials, edit `login.js`:
```javascript
const VALID_EMAIL = "your-email@example.com";
const VALID_PASSWORD = "your-password";
```

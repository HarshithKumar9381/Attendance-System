# Database Schema & Setup

This folder contains the database schema and initialization scripts.

## Files

- `schema.sql` - Database schema and seed data

## Setup Instructions

### PlanetScale (Recommended - Free Tier)

1. **Create PlanetScale Account**
   - Go to https://planetscale.com
   - Sign up with GitHub
   - Create organization

2. **Create Database**
   - Click "Add database"
   - Name: `attendance_management`
   - Region: Select your closest region
   - Create branch (main)

3. **Get Connection String**
   - Go to "Connect" dropdown
   - Select "node.js"
   - Copy connection string with credentials

4. **Initialize Schema**
   - Option A: Use PlanetScale UI SQL Editor
     - Open database
     - Click "Console"
     - Paste contents of `schema.sql`
     - Execute
   
   - Option B: Use MySQL CLI
     ```bash
     mysql -h <host> -u <user> -p < schema.sql
     ```

5. **Note Credentials**
   - DB_HOST: Your PlanetScale host
   - DB_PORT: Usually 3306
   - DB_USER: Your username
   - DB_PASSWORD: Your password
   - DB_NAME: attendance_management

### AWS RDS

1. **Create RDS Database**
   - Go to AWS Console → RDS
   - Click "Create database"
   - Engine: MySQL 8.0.x
   - Template: Free tier
   - Add credentials (master username/password)
   - Create database

2. **Get Connection Details**
   - Open database details
   - Copy endpoint (host)
   - Note port (usually 3306)
   - Use master credentials

3. **Initialize Schema**
   ```bash
   mysql -h <endpoint> -u <username> -p < schema.sql
   ```

4. **Security Group Setup**
   - Allow inbound traffic on port 3306 from Vercel IPs
   - Or allow all (less secure): 0.0.0.0/0

### Local MySQL

1. **Install MySQL**
   - Windows: https://dev.mysql.com/downloads/mysql/
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL Service**
   - Windows: MySQL is usually auto-started
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

3. **Initialize Schema**
   ```bash
   mysql -u root -p < schema.sql
   ```

4. **Run Local Backend**
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

## Schema Overview

### Students Table
Stores student information with unique roll numbers.

```sql
id (Primary Key)
name (VARCHAR 120)
roll_number (VARCHAR 40, UNIQUE)
created_at (TIMESTAMP)
```

### Attendance Table
Records student attendance with date and status.

```sql
id (Primary Key)
student_id (Foreign Key → students.id)
date (DATE)
status (ENUM: 'present', 'absent')
remarks (VARCHAR 255, optional)
created_at (TIMESTAMP)
UNIQUE(student_id, date)  -- One record per student per day
```

## Sample Data

The schema includes 3 sample students:
- Aarav Sharma (CSE001)
- Meera Nair (CSE002)
- Rohan Verma (CSE003)

To add more students, use the `POST /api/students` API endpoint or:
```sql
INSERT INTO students(name, roll_number) VALUES('Name', 'ROLL123');
```

## Verify Setup

```bash
# Test connection
mysql -h <host> -u <user> -p -e "USE attendance_management; SELECT * FROM students;"

# Should output:
# | id | name          | roll_number | created_at          |
# | 1  | Aarav Sharma  | CSE001      | 2024-03-24 15:30... |
# | 2  | Meera Nair    | CSE002      | 2024-03-24 15:30... |
# | 3  | Rohan Verma   | CSE003      | 2024-03-24 15:30... |
```

## Troubleshooting

- **Access denied:** Check username/password credentials
- **Unknown database:** Run schema.sql to create it
- **Connection timeout:** Verify host/port and firewall rules
- **Table doesn't exist:** Re-run schema.sql

## License

MIT

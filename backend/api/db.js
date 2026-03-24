const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "attendance_management";

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  const bootstrapConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD
  });

  await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await bootstrapConnection.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      roll_number VARCHAR(40) NOT NULL UNIQUE,
      class_name VARCHAR(20) NOT NULL DEFAULT 'DS-A',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Backward-compatible migration for existing databases.
  const [classColumnRows] = await pool.query(
    `
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'students'
      AND COLUMN_NAME = 'class_name'
    `,
    [DB_NAME]
  );

  if (!classColumnRows.length) {
    await pool.query(`
      ALTER TABLE students
      ADD COLUMN class_name VARCHAR(20) NOT NULL DEFAULT 'DS-A'
    `);
  }

  // Existing students are assigned to DS-A by default.
  await pool.query(`
    UPDATE students
    SET class_name = 'DS-A'
    WHERE class_name IS NULL OR class_name = ''
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      date DATE NOT NULL,
      subject VARCHAR(20) NOT NULL DEFAULT 'JAVA',
      status ENUM('present', 'absent') NOT NULL,
      remarks VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      UNIQUE KEY unique_student_date_subject (student_id, date, subject)
    )
  `);

  const [subjectColumnRows] = await pool.query(
    `
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'attendance'
      AND COLUMN_NAME = 'subject'
    `,
    [DB_NAME]
  );

  if (!subjectColumnRows.length) {
    await pool.query(`
      ALTER TABLE attendance
      ADD COLUMN subject VARCHAR(20) NOT NULL DEFAULT 'JAVA' AFTER date
    `);
  }

  await pool.query(`
    UPDATE attendance
    SET subject = 'JAVA'
    WHERE subject IS NULL OR subject = ''
  `);

  const [legacyUniqueIndexRows] = await pool.query(
    `
    SELECT INDEX_NAME
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'attendance'
      AND INDEX_NAME = 'unique_student_date'
    `,
    [DB_NAME]
  );

  if (legacyUniqueIndexRows.length) {
    const [studentIdIndexRows] = await pool.query(
      `
      SELECT INDEX_NAME
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'attendance'
        AND INDEX_NAME = 'idx_attendance_student_id'
      `,
      [DB_NAME]
    );

    if (!studentIdIndexRows.length) {
      await pool.query(
        "ALTER TABLE attendance ADD INDEX idx_attendance_student_id (student_id)"
      );
    }

    await pool.query("ALTER TABLE attendance DROP INDEX unique_student_date");
  }

  const [subjectUniqueIndexRows] = await pool.query(
    `
    SELECT INDEX_NAME
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'attendance'
      AND INDEX_NAME = 'unique_student_date_subject'
    `,
    [DB_NAME]
  );

  if (!subjectUniqueIndexRows.length) {
    await pool.query(
      "ALTER TABLE attendance ADD UNIQUE KEY unique_student_date_subject (student_id, date, subject)"
    );
  }
}

async function run(query, params = []) {
  const [result] = await pool.execute(query, params);
  return { id: result.insertId || 0, changes: result.affectedRows || 0 };
}

async function all(query, params = []) {
  const [rows] = await pool.execute(query, params);
  return rows;
}

async function get(query, params = []) {
  const [rows] = await pool.execute(query, params);
  return rows[0] || null;
}

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  pool,
  initializeDatabase,
  run,
  all,
  get,
  closeDatabase
};

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'attendance_management'}`,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function initializeDatabase() {
  try {
    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        roll_number VARCHAR(40) NOT NULL UNIQUE,
        class_name VARCHAR(20) NOT NULL DEFAULT 'DS-A',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        date DATE NOT NULL,
        subject VARCHAR(20) NOT NULL DEFAULT 'JAVA',
        status VARCHAR(20) NOT NULL,
        remarks VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(student_id, date, subject)
      )
    `);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
}

async function run(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return { id: result.rows[0]?.id || 0, changes: result.rowCount || 0 };
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

async function all(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows || [];
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

async function get(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows[0] || null;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
}

async function closeDatabase() {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database:", err);
    throw err;
  }
}

module.exports = {
  initializeDatabase,
  run,
  all,
  get,
  closeDatabase
};

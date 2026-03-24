const path = require("path");
const express = require("express");
const cors = require("cors");
const { pool, initializeDatabase, run, all, get, closeDatabase } = require("./api/db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const ALLOWED_CLASSES = ["DS-A", "DS-B"];
const ALLOWED_SUBJECTS = ["JAVA", "PYTHON", "C", "R"];

// ===== HEALTH CHECK =====
app.get("/api/health", (_req, res) => {
  res.json({ message: "API is running", timestamp: new Date().toISOString() });
});

// ===== STUDENTS =====
app.get("/api/students", async (req, res) => {
  const className = (req.query.className || "DS-A").toString().trim().toUpperCase();

  try {
    const students = await all(
      "SELECT id, name, roll_number, class_name FROM students WHERE class_name = ? ORDER BY roll_number ASC",
      [className]
    );
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.post("/api/students", async (req, res) => {
  const { name, rollNumber, className } = req.body;
  const normalizedClass = (className || "DS-A").toString().trim().toUpperCase();

  if (!name || !rollNumber) {
    res.status(400).json({ error: "Name and rollNumber are required" });
    return;
  }

  if (!["DS-A", "DS-B"].includes(normalizedClass)) {
    res.status(400).json({ error: "className must be DS-A or DS-B" });
    return;
  }

  try {
    await run(
      "INSERT INTO students(name, roll_number, class_name) VALUES(?, ?, ?)",
      [name.trim(), rollNumber.trim().toUpperCase(), normalizedClass]
    );
    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Roll number already exists" });
      return;
    }
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
});

// ===== ATTENDANCE =====
app.get("/api/attendance", async (req, res) => {
  const { date } = req.query;
  const className = (req.query.className || "DS-A").toString().trim().toUpperCase();
  const subject = (req.query.subject || "JAVA").toString().trim().toUpperCase();

  if (!date) {
    res.status(400).json({ error: "Date query parameter is required" });
    return;
  }

  if (!ALLOWED_CLASSES.includes(className)) {
    res.status(400).json({ error: "className must be DS-A or DS-B" });
    return;
  }

  if (!ALLOWED_SUBJECTS.includes(subject)) {
    res.status(400).json({ error: "subject must be JAVA, PYTHON, C or R" });
    return;
  }

  try {
    const rows = await all(
      `
      SELECT
        s.id AS student_id,
        a.id AS attendance_id,
        s.name,
        s.roll_number,
        IFNULL(a.status, 'absent') AS status,
        IFNULL(a.remarks, '') AS remarks,
        a.date
      FROM students s
      LEFT JOIN attendance a
        ON a.student_id = s.id AND a.date = ? AND a.subject = ?
      WHERE s.class_name = ?
      ORDER BY s.roll_number ASC
      `,
      [date, subject, className]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

app.get("/api/attendance/status", async (req, res) => {
  const { date } = req.query;
  const className = (req.query.className || "DS-A").toString().trim().toUpperCase();
  const subject = (req.query.subject || "JAVA").toString().trim().toUpperCase();

  if (!date) {
    res.status(400).json({ error: "Date query parameter is required" });
    return;
  }

  if (!ALLOWED_CLASSES.includes(className)) {
    res.status(400).json({ error: "className must be DS-A or DS-B" });
    return;
  }

  if (!ALLOWED_SUBJECTS.includes(subject)) {
    res.status(400).json({ error: "subject must be JAVA, PYTHON, C or R" });
    return;
  }

  try {
    const result = await get(
      `
      SELECT COUNT(*) AS record_count
      FROM attendance a
      INNER JOIN students s ON s.id = a.student_id
      WHERE a.date = ? AND a.subject = ? AND s.class_name = ?
      `,
      [date, subject, className]
    );
    res.json({
      date,
      className,
      subject,
      isMarked: Number(result?.record_count || 0) > 0
    });
  } catch (error) {
    console.error("Error checking attendance status:", error);
    res.status(500).json({ error: "Failed to check attendance status" });
  }
});

app.post("/api/attendance/mark", async (req, res) => {
  const { date, subject, records } = req.body;
  const normalizedSubject = (subject || "JAVA").toString().trim().toUpperCase();

  if (!date || !Array.isArray(records) || records.length === 0) {
    res.status(400).json({ error: "Date and non-empty records are required" });
    return;
  }

  if (!ALLOWED_SUBJECTS.includes(normalizedSubject)) {
    res.status(400).json({ error: "subject must be JAVA, PYTHON, C or R" });
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const record of records) {
      const studentId = Number(record.studentId);
      const status = record.status;
      const remarks = (record.remarks || "").trim();

      if (!studentId || !["present", "absent"].includes(status)) {
        throw new Error("Invalid record format");
      }

      await connection.execute(
        `
        INSERT INTO attendance(student_id, date, subject, status, remarks)
        VALUES(?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          remarks = VALUES(remarks)
        `,
        [studentId, date, normalizedSubject, status, remarks]
      );
    }

    await connection.commit();
    res.json({ message: "Attendance saved successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  } finally {
    connection.release();
  }
});

// ===== START SERVER =====
async function startServer() {
  try {
    console.log("Initializing database...");
    await initializeDatabase();
    console.log("✓ Database initialized");

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Frontend available at http://localhost:3000`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  closeDatabase().finally(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});

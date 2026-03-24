const { all, get, pool } = require("./db");

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const { date } = req.query;

      // GET /api/attendance - Fetch attendance records for a date
      if (!date) {
        return res.status(400).json({ error: "Date query parameter is required" });
      }

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
          ON a.student_id = s.id AND a.date = ?
        ORDER BY s.roll_number ASC
        `,
        [date]
      );

      return res.json(rows);
    }

    if (req.method === "POST") {
      const { date, records } = req.body;

      // POST /api/attendance/mark - Save attendance for multiple students
      if (!date || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ error: "Date and non-empty records are required" });
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
            INSERT INTO attendance(student_id, date, status, remarks)
            VALUES(?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              status = VALUES(status),
              remarks = VALUES(remarks)
            `,
            [studentId, date, status, remarks]
          );
        }

        await connection.commit();
        return res.json({ message: "Attendance saved successfully" });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Attendance API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}

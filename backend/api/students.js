const { all, run } = require("./db");

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
      // Fetch all students
      const students = await all(
        "SELECT id, name, roll_number FROM students ORDER BY roll_number ASC"
      );
      return res.json(students);
    }

    if (req.method === "POST") {
      // Add new student
      const { name, rollNumber } = req.body;

      if (!name || !rollNumber) {
        return res.status(400).json({ error: "Name and rollNumber are required" });
      }

      try {
        await run(
          "INSERT INTO students(name, roll_number) VALUES(?, ?)",
          [name.trim(), rollNumber.trim().toUpperCase()]
        );
        return res.status(201).json({ message: "Student added successfully" });
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Roll number already exists" });
        }
        throw error;
      }
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Students API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}

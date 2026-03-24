CREATE DATABASE IF NOT EXISTS attendance_management;
USE attendance_management;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  roll_number VARCHAR(40) NOT NULL UNIQUE,
  class_name VARCHAR(20) NOT NULL DEFAULT 'DS-A',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

INSERT INTO students(name, roll_number, class_name)
VALUES
  ('Aarav Sharma', 'CSE001', 'DS-A'),
  ('Meera Nair', 'CSE002', 'DS-A'),
  ('Rohan Verma', 'CSE003', 'DS-A')
ON DUPLICATE KEY UPDATE name = VALUES(name), class_name = VALUES(class_name);

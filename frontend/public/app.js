// Browser-safe API URL resolution
const API_BASE_URL =
  (window && window.APP_API_URL) ||
  "http://localhost:4000";

// ===== AUTHENTICATION CHECK =====
function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("facultyAuthenticated");
  if (isLoggedIn !== "true") {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// Check auth before anything else
if (!checkAuthentication()) {
  // This will redirect, so stop execution
  throw new Error("Not authenticated");
}

// ===== LOGOUT HANDLER =====
function performLogout() {
  localStorage.removeItem("facultyAuthenticated");
  localStorage.removeItem("facultyEmail");
  localStorage.removeItem("loginTime");
  sessionStorage.clear();
  window.location.replace("/login.html");
}

function showLogoutConfirmModal() {
  const modal = document.getElementById("logoutConfirmModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function hideLogoutConfirmModal() {
  const modal = document.getElementById("logoutConfirmModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function setupLogoutHandlers() {
  const logoutBtn = document.getElementById("logoutBtn");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const logoutConfirmModal = document.getElementById("logoutConfirmModal");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Fallback: if modal is not present in the current DOM, logout directly.
      if (!logoutConfirmModal) {
        performLogout();
        return;
      }

      showLogoutConfirmModal();
    });
  }

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener("click", () => {
      performLogout();
    });
  }

  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener("click", () => {
      hideLogoutConfirmModal();
    });
  }

  if (logoutConfirmModal) {
    logoutConfirmModal.addEventListener("click", (event) => {
      if (event.target === logoutConfirmModal) {
        hideLogoutConfirmModal();
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLogoutHandlers);
} else {
  setupLogoutHandlers();
}

// ===== APP CODE =====

const studentForm = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const rollNumberInput = document.getElementById("rollNumber");
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const attendanceDateInput = document.getElementById("attendanceDate");
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn");
const markAllPresentBtn = document.getElementById("markAllPresentBtn");
const markAllAbsentBtn = document.getElementById("markAllAbsentBtn");
const tableBody = document.getElementById("attendanceTableBody");
const statusMessage = document.getElementById("statusMessage");
const successModal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalMessage = document.getElementById("modalMessage");
const alreadyMarkedModal = document.getElementById("alreadyMarkedModal");
const editAttendanceBtn = document.getElementById("editAttendanceBtn");
const closeAlreadyMarkedBtn = document.getElementById("closeAlreadyMarkedBtn");
const dateFormatHint = document.getElementById("dateFormatHint");
const studentClassHint = document.getElementById("studentClassHint");

let isEditingMode = false;
let hasExistingAttendanceForSelectedDate = false;
let selectedClassName = "DS-A";
let selectedSubject = "JAVA";

function formatDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function showSuccessModal(message = "") {
  modalMessage.textContent = message;
  successModal.classList.remove("hidden");
}

function checkIfAttendanceAlreadyMarked() {
  return hasExistingAttendanceForSelectedDate;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

async function fetchStudents() {
  const res = await fetch(
    `${API_BASE_URL}/api/students?className=${encodeURIComponent(selectedClassName)}`
  );
  if (!res.ok) {
    throw new Error("Unable to fetch students");
  }
  return res.json();
}

function renderAttendanceRows(rows) {
  tableBody.innerHTML = "";

  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">No students found. Add students first.</td>`;
    tableBody.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.dataset.studentId = String(row.student_id);

    const isUnmarkedForDate = row.attendance_id === null;
    const presentChecked = isUnmarkedForDate || row.status === "present" ? "checked" : "";
    const absentChecked = !isUnmarkedForDate && row.status === "absent" ? "checked" : "";

    tr.innerHTML = `
      <td>${row.roll_number}</td>
      <td>${row.name}</td>
      <td>
        <div class="status-group">
          <label><input type="radio" name="status-${row.student_id}" value="present" ${presentChecked} /> Present</label>
          <label><input type="radio" name="status-${row.student_id}" value="absent" ${absentChecked} /> Absent</label>
        </div>
      </td>
      <td>
        <input type="text" placeholder="Optional remark" value="${row.remarks || ""}" class="remarks-input" />
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function setAllStatuses(status) {
  const rows = Array.from(tableBody.querySelectorAll("tr[data-student-id]"));
  rows.forEach((tr) => {
    const selector = `input[type="radio"][value="${status}"]`;
    const radio = tr.querySelector(selector);
    if (radio) {
      radio.checked = true;
    }
  });
}

async function loadAttendanceForDate() {
  const date = attendanceDateInput.value;
  if (!date) {
    hasExistingAttendanceForSelectedDate = false;
    isEditingMode = false;
    return;
  }

  try {
    showStatus(`Loading ${selectedClassName} ${selectedSubject} attendance for ${formatDate(date)}...`);
    const res = await fetch(
      `${API_BASE_URL}/api/attendance?date=${encodeURIComponent(date)}&className=${encodeURIComponent(selectedClassName)}&subject=${encodeURIComponent(selectedSubject)}`
    );
    if (!res.ok) {
      throw new Error("Unable to load attendance");
    }
    const rows = await res.json();
    hasExistingAttendanceForSelectedDate = rows.some((row) => row.attendance_id !== null);
    renderAttendanceRows(rows);
    showStatus(`Ready to mark ${selectedSubject} attendance for ${selectedClassName} on ${formatDate(date)}`);
  } catch (error) {
    hasExistingAttendanceForSelectedDate = false;
    showStatus(error.message, true);
  }
}

async function fetchAttendanceMarkedStatus(date) {
  const res = await fetch(
    `${API_BASE_URL}/api/attendance/status?date=${encodeURIComponent(date)}&className=${encodeURIComponent(selectedClassName)}&subject=${encodeURIComponent(selectedSubject)}`
  );
  if (!res.ok) {
    throw new Error("Unable to verify attendance status");
  }

  const data = await res.json();
  return Boolean(data.isMarked);
}

function collectAttendanceRecords() {
  const rows = Array.from(tableBody.querySelectorAll("tr[data-student-id]"));
  return rows.map((tr) => {
    const studentId = Number(tr.dataset.studentId);
    const selectedStatus = tr.querySelector('input[type="radio"]:checked');
    const remarks = tr.querySelector(".remarks-input").value;

    return {
      studentId,
      status: selectedStatus ? selectedStatus.value : "absent",
      remarks
    };
  });
}

async function saveAttendance() {
  const date = attendanceDateInput.value;
  if (!date) {
    showStatus("Select a date before saving", true);
    return;
  }

  const records = collectAttendanceRecords();
  if (!records.length) {
    showStatus("No records to save", true);
    return;
  }

  try {
    if (!isEditingMode) {
      const isMarkedInDatabase = await fetchAttendanceMarkedStatus(date);
      hasExistingAttendanceForSelectedDate = isMarkedInDatabase;

      if (isMarkedInDatabase || checkIfAttendanceAlreadyMarked()) {
        alreadyMarkedModal.classList.remove("hidden");
        return;
      }
    }

    showStatus(isEditingMode ? "Updating attendance..." : "Saving attendance...");
    const res = await fetch(`${API_BASE_URL}/api/attendance/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, className: selectedClassName, subject: selectedSubject, records })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Save failed");
    }

    const formattedDate = formatDate(date);
    const message = isEditingMode 
      ? `${selectedSubject} attendance for ${selectedClassName} on ${formattedDate} has been updated` 
      : `${selectedSubject} attendance for ${selectedClassName} on ${formattedDate} has been saved`;
    isEditingMode = false;
    hasExistingAttendanceForSelectedDate = true;
    showSuccessModal(message);
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function addStudent(event) {
  event.preventDefault();

  const name = studentNameInput.value.trim();
  const rollNumber = rollNumberInput.value.trim().toUpperCase();

  if (!name || !rollNumber) {
    showStatus("Name and roll number are required", true);
    return;
  }

  try {
    showStatus("Adding student...");
    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rollNumber, className: selectedClassName })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to add student");
    }

    studentForm.reset();
    showStatus(`Student added successfully to ${selectedClassName}`);

    await loadAttendanceForDate();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function init() {
  selectedClassName = (classSelect?.value || "DS-A").toUpperCase();
  selectedSubject = (subjectSelect?.value || "JAVA").toUpperCase();
  attendanceDateInput.value = todayISO();
  const today = formatDate(todayISO());
  dateFormatHint.textContent = `Class: ${selectedClassName} | Subject: ${selectedSubject} | Selected: ${today}`;
  if (studentClassHint) {
    studentClassHint.textContent = `Adding student to: ${selectedClassName}`;
  }

  try {
    await loadAttendanceForDate();
  } catch (error) {
    showStatus(error.message, true);
  }
}

studentForm.addEventListener("submit", addStudent);
attendanceDateInput.addEventListener("change", () => {
  const formattedDate = formatDate(attendanceDateInput.value);
  dateFormatHint.textContent = `Class: ${selectedClassName} | Subject: ${selectedSubject} | Selected: ${formattedDate}`;
  isEditingMode = false;
  loadAttendanceForDate();
});
if (classSelect) {
  classSelect.addEventListener("change", () => {
    selectedClassName = classSelect.value.toUpperCase();
    const formattedDate = formatDate(attendanceDateInput.value);
    dateFormatHint.textContent = `Class: ${selectedClassName} | Subject: ${selectedSubject} | Selected: ${formattedDate}`;
    if (studentClassHint) {
      studentClassHint.textContent = `Adding student to: ${selectedClassName}`;
    }
    isEditingMode = false;
    loadAttendanceForDate();
  });
}
if (subjectSelect) {
  subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value.toUpperCase();
    const formattedDate = formatDate(attendanceDateInput.value);
    dateFormatHint.textContent = `Class: ${selectedClassName} | Subject: ${selectedSubject} | Selected: ${formattedDate}`;
    isEditingMode = false;
    loadAttendanceForDate();
  });
}
saveAttendanceBtn.addEventListener("click", saveAttendance);
markAllPresentBtn.addEventListener("click", () => {
  setAllStatuses("present");
});
markAllAbsentBtn.addEventListener("click", () => {
  setAllStatuses("absent");
});
closeModalBtn.addEventListener("click", () => {
  successModal.classList.add("hidden");
});
closeAlreadyMarkedBtn.addEventListener("click", () => {
  alreadyMarkedModal.classList.add("hidden");
});
editAttendanceBtn.addEventListener("click", () => {
  isEditingMode = true;
  alreadyMarkedModal.classList.add("hidden");
});

init();

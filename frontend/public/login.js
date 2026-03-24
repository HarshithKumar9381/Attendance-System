// Credentials
const VALID_EMAIL = "23eg110a27@anurag.edu.in";
const VALID_PASSWORD = "faculty@ds";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const invalidPopup = document.getElementById("invalidPopup");
const popupMessage = document.getElementById("popupMessage");
const popupOkBtn = document.getElementById("popupOkBtn");

// Check if user is already logged in
function checkAuth() {
  const isLoggedIn = localStorage.getItem("facultyAuthenticated");
  if (isLoggedIn === "true") {
    window.location.href = "/attendance.html";
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

function showThemedPopup(message) {
  if (!invalidPopup || !popupMessage) return;
  popupMessage.textContent = message;
  invalidPopup.classList.remove("hidden");
}

function hideThemedPopup() {
  if (!invalidPopup) return;
  invalidPopup.classList.add("hidden");
}

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Reset messages
  errorMessage.classList.remove("show");
  successMessage.classList.remove("show");

  // Validate inputs
  if (!email || !password) {
    showError("Please fill in all fields");
    return;
  }

  // Show loading state
  loginBtn.disabled = true;
  loading.style.display = "block";

  // Simulate API call delay (security best practice - don't indicate if email exists)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check credentials
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    // Credentials match
    loading.style.display = "none";
    successMessage.classList.add("show");

    // Store authentication in localStorage
    localStorage.setItem("facultyAuthenticated", "true");
    localStorage.setItem("facultyEmail", email);
    localStorage.setItem("loginTime", new Date().toISOString());

    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = "/attendance.html";
    }, 1200);
  } else {
    // Invalid credentials
    loading.style.display = "none";
    loginBtn.disabled = false;

    if (email === VALID_EMAIL && password !== VALID_PASSWORD) {
      showThemedPopup("wrong password, enter valid password");
      showError("wrong password, enter valid password");
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    showThemedPopup("You are not a faculty");
    showError("You are not a faculty");

    // Clear password field for security
    passwordInput.value = "";
    emailInput.focus();
  }
});

// Check authentication on page load
checkAuth();

// Optional: Clear login message when user starts typing
emailInput.addEventListener("focus", () => {
  errorMessage.classList.remove("show");
});

passwordInput.addEventListener("focus", () => {
  errorMessage.classList.remove("show");
});

if (popupOkBtn) {
  popupOkBtn.addEventListener("click", () => {
    hideThemedPopup();
  });
}

if (invalidPopup) {
  invalidPopup.addEventListener("click", (event) => {
    if (event.target === invalidPopup) {
      hideThemedPopup();
    }
  });
}

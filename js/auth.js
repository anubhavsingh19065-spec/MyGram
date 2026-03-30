
//  MyGram — auth.js (FINAL WORKING VERSION)
// ============================================================

// 🔥 YOUR LIVE BACKEND URL
// const BASE_URL = "https://mygram-1-ek8g.onrender.com";

// ── Tab Switcher ──────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  clearErrors();
}
window.switchTab = switchTab;

// ── Helpers ───────────────────────────────────────────────
function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
  }
}

// ── LOGIN ────────────────────────────────────────────────
window.handleLogin = function () {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    return showError('login-error', 'Enter username & password');
  }

  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  })
  .then(user => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Login successful 🔥");
    window.location.href = "feed.html";
  })
  .catch(err => {
    console.error(err);
    showError('login-error', 'Login failed ❌');
  });
};

// ── SIGNUP ───────────────────────────────────────────────
window.handleSignup = function () {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;

  if (!username || !password) {
    return showError('signup-error', 'Fill all fields');
  }

  if (password !== confirm) {
    return showError('signup-error', 'Passwords do not match');
  }

  fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password,
      bio: ""
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  })
  .then(data => {
    localStorage.setItem("user", JSON.stringify(data));

  // 🔥 ADD THIS LINE (MOST IMPORTANT)
    localStorage.setItem("currentUser", data.username);

    alert("Signup successful ✅");
    window.location.href = "feed.html";
  })
  .catch(err => {
    console.error(err);
    showError('signup-error', 'Signup failed ❌');
  });
};

// ── LOGOUT ───────────────────────────────────────────────
window.handleLogout = function () {
  localStorage.removeItem("user");
  window.location.href = "login.html";
};

// ── ENTER KEY SUPPORT ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const loginVisible  = document.getElementById('login-form')?.style.display !== 'none';
  const signupVisible = document.getElementById('signup-form')?.style.display !== 'none';

  if (loginVisible) handleLogin();
  if (signupVisible) handleSignup();
});
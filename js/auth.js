// ============================================================
//  MyGram — auth.js
//  Login, Signup, Logout logic
// ============================================================

// ── Tab Switcher ──────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  clearErrors();
}
window.switchTab = switchTab;

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('shake'); }
  setTimeout(() => el && el.classList.remove('shake'), 400);
}

// ── Login ─────────────────────────────────────────────────
window.handleLogin = function () {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(res => res.json())
  .then(user => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful 🔥");
      window.location.href = "feed.html";
    } else {
      alert("Invalid credentials ❌");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Login error ❌");
  });
}

// ── Signup ────────────────────────────────────────────────
window.handleSignup = function () {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  fetch("http://localhost:8080/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password,
      bio: ""
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Signup successful ✅");
    window.location.href = "feed.html";
  })
  .catch(err => {
    console.error(err);
    alert("Signup failed ❌");
  });
}

// ── Logout ────────────────────────────────────────────────
function handleLogout() {
  Storage.clearSession();
  window.location.href = 'login.html';
}

// ── Enter key support ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const loginVisible  = document.getElementById('login-form')?.style.display !== 'none';
  const signupVisible = document.getElementById('signup-form')?.style.display !== 'none';
  if (loginVisible)  handleLogin();
  if (signupVisible) handleSignup();
});

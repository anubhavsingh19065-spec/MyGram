// ============================================================
//  MyGram — app.js (FINAL WORKING)
// ============================================================

// ── Route Guard ───────────────────────────────────────────
function requireAuth() {
  if (!Storage.isLoggedIn()) {
    window.location.href = '../pages/login.html';
  }
}

function requireGuest() {
  if (Storage.isLoggedIn()) {
    window.location.href = '../pages/feed.html';
  }
}

// ── Current User ──────────────────────────────────────────
function currentUser() {
  const session = Storage.getSession();
  return session ? session.username : null;
}

// ── Toast Notification ────────────────────────────────────
function showToast(msg, type = 'default') {
  let toast = document.getElementById('mg-toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mg-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.className = 'mg-toast show ' + type;

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.className = 'mg-toast';
  }, 3000);
}

// ── Time Ago ──────────────────────────────────────────────
function timeAgo(timestamp) {
  const diff = (Date.now() - timestamp) / 1000;

  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';

  return new Date(timestamp).toLocaleDateString();
}

// ── Avatar ────────────────────────────────────────────────
function avatarLetter(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}

function avatarColor(username) {
  const colors = ['#f5a623','#e8478b','#6c63ff','#1db954','#00b8d9','#ff6b6b','#f093fb'];
  let hash = 0;
  for (let i = 0; i < (username || '').length; i++) {
    hash += username.charCodeAt(i);
  }
  return colors[hash % colors.length];
}

function buildAvatar(username, size = 40) {
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${avatarColor(username)};font-size:${size * 0.4}px">
    ${avatarLetter(username)}
  </div>`;
}

// ── Seed Demo Data ────────────────────────────────────────
function seedDemoData() {
  if (localStorage.getItem('mygram_seeded')) return;

  const demoUsers = [
    { username: 'luna_v', password: 'demo123', bio: 'Chasing sunsets 🌅', joined: Date.now() },
    { username: 'kai_x', password: 'demo123', bio: 'Building things ⚡', joined: Date.now() }
  ];

  demoUsers.forEach(u => {
    if (!Storage.findUser(u.username)) Storage.addUser(u);
  });

  const demoPosts = [
    {
      id: 'p1',
      username: 'luna_v',
      text: 'Hello MyGram!',
      likes: [],
      comments: [],
      createdAt: Date.now()
    }
  ];

  Storage.savePosts(demoPosts);
  localStorage.setItem('mygram_seeded', '1');
}

// ── Navbar Active ─────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');

    if (
      link.getAttribute('href') &&
      path.includes(link.getAttribute('href').replace('../', ''))
    ) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// 🔥 MAKE FUNCTIONS GLOBAL (CRITICAL FIX)
// ============================================================

window.requireAuth = function () {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "login.html";
  }
};
window.requireGuest = function () {
  const user = localStorage.getItem("user");

  if (user) {
    window.location.href = "feed.html";
  }
};
window.currentUser = currentUser;
window.showToast = showToast;
window.timeAgo = timeAgo;
window.buildAvatar = buildAvatar;
window.seedDemoData = seedDemoData;
window.setActiveNav = setActiveNav;
const BASE_URL = "https://mygram-1-ek8g.onrender.com";

function createPost() {
  const user = JSON.parse(localStorage.getItem("user"));
  const content = document.getElementById("post-content").value;

  fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: user.username,
      content: content
    })
  })
  .then(res => res.json())
  .then(() => {
    loadPosts();
    document.getElementById("post-content").value = "";
  });
}

function loadPosts() {
  fetch(`${BASE_URL}/api/posts`)
    .then(res => res.json())
    .then(posts => {
      const feed = document.getElementById("feed");
      feed.innerHTML = "";

      posts.reverse().forEach(p => {
        feed.innerHTML += `
          <div>
            <strong>${p.username}</strong>
            <p>${p.content}</p>
          </div>
        `;
      });
    });
}

loadPosts();
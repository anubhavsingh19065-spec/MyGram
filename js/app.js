// ============================================================
//  MyGram — app.js (FINAL BACKEND VERSION)
// ============================================================

// 🔥 BACKEND URL
const BASE_URL = "https://mygram-1-ek8g.onrender.com";

// ── AUTH GUARDS ────────────────────────────────────────────
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

// ── CURRENT USER ───────────────────────────────────────────
function currentUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.username : null;
}
window.currentUser = currentUser;

// ── TOAST NOTIFICATION ─────────────────────────────────────
function showToast(msg, type = "default") {
  let toast = document.getElementById("mg-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "mg-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.className = "mg-toast show " + type;

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.className = "mg-toast";
  }, 3000);
}
window.showToast = showToast;

// ── TIME AGO ───────────────────────────────────────────────
function timeAgo(timestamp) {
  const diff = (Date.now() - timestamp) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + "d ago";

  return new Date(timestamp).toLocaleDateString();
}
window.timeAgo = timeAgo;

// ── AVATAR HELPERS ─────────────────────────────────────────
function avatarLetter(username) {
  return username ? username.charAt(0).toUpperCase() : "?";
}

function avatarColor(username) {
  const colors = ["#f5a623","#e8478b","#6c63ff","#1db954","#00b8d9","#ff6b6b","#f093fb"];
  let hash = 0;
  for (let i = 0; i < (username || "").length; i++) {
    hash += username.charCodeAt(i);
  }
  return colors[hash % colors.length];
}

function buildAvatar(username, size = 40) {
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${avatarColor(username)};font-size:${size * 0.4}px">
    ${avatarLetter(username)}
  </div>`;
}

window.buildAvatar = buildAvatar;

// ── NAV ACTIVE LINK ────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");

    if (
      link.getAttribute("href") &&
      path.includes(link.getAttribute("href").replace("../", ""))
    ) {
      link.classList.add("active");
    }
  });
}
window.setActiveNav = setActiveNav;

// ============================================================
// 🚀 POSTS (BACKEND CONNECTED)
// ============================================================

// 🔥 CREATE POST
function publishPost() {
  const user = JSON.parse(localStorage.getItem("user"));
  const content = document.getElementById("post-text").value;

  if (!content.trim()) {
    alert("Write something!");
    return;
  }

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
    document.getElementById("post-text").value = "";
    closePostModal && closePostModal();
    loadPosts();
    showToast("Post created 🚀");
  })
  .catch(() => showToast("Error posting ❌"));
}

// 🔥 LOAD POSTS
function loadPosts() {
  fetch(`${BASE_URL}/api/posts`)
    .then(res => res.json())
    .then(posts => {
      const feed = document.getElementById("posts-feed");
      if (!feed) return;

      feed.innerHTML = "";

      posts.reverse().forEach(p => {
        feed.innerHTML += `
          <div class="sidebar-card" style="margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              ${buildAvatar(p.username, 35)}
              <strong>${p.username}</strong>
            </div>
            <p>${p.content}</p>
          </div>
        `;
      });
    })
    .catch(() => showToast("Failed to load posts ❌"));
}
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  document.getElementById("profile-name").innerText = user.username;
  document.getElementById("profile-username").innerText = "@" + user.username;
  document.getElementById("profile-bio").innerText = user.bio || "No bio";
}
function toggleLike(postId) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const user = localStorage.getItem("currentUser");

  const post = posts.find(p => p.id === postId);

  if (!post.likes) post.likes = [];

  if (post.likes.includes(user)) {
    post.likes = post.likes.filter(u => u !== user);
  } else {
    post.likes.push(user);
  }

  localStorage.setItem("posts", JSON.stringify(posts));

  loadPosts();
}

function addComment(postId) {
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value.trim();

  if (!text) return;

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts.find(p => p.id === postId);

  if (!post.comments) post.comments = [];

  post.comments.push({
    user: localStorage.getItem("currentUser"),
    text: text
  });

  localStorage.setItem("posts", JSON.stringify(posts));

  input.value = "";

  loadPosts();
}

// 🔥 AUTO LOAD
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
  loadProfile();
});
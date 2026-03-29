// ============================================================
//  MyGram — posts.js
//  Create, render, like, comment on posts
// ============================================================

// ── Open / Close Post Modal ───────────────────────────────
function openPostModal() {
  document.getElementById('post-modal').classList.add('show');
  setTimeout(() => document.getElementById('post-text')?.focus(), 200);
}

function closePostModal() {
  document.getElementById('post-modal').classList.remove('show');
  if (document.getElementById('post-text')) document.getElementById('post-text').value = '';
}

// ── Add Emoji to textarea ─────────────────────────────────
function addEmoji(em) {
  const ta = document.getElementById('post-text');
  if (ta) ta.value += em;
  ta.focus();
}

// ── Publish Post ──────────────────────────────────────────
function publishPost() {
  const user = JSON.parse(localStorage.getItem("user"));
  const text = document.getElementById("post-text").value;

  if (!text.trim()) return alert("Write something!");

  fetch("https://mygram-1-ek8g.onrender.com/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: user.username,
      content: text
    })
  })
  .then(res => res.json())
  .then(() => {
    closePostModal();
    renderFeed();
  });
}

// ── Toggle Like ───────────────────────────────────────────
function toggleLike(postId) {
  const user = currentUser();
  const post = Storage.likePost(postId, user);
  if (!post) return;

  const btn = document.getElementById('like-btn-' + postId);
  const count = document.getElementById('like-count-' + postId);
  if (btn && count) {
    const liked = post.likes.includes(user);
    btn.classList.toggle('liked', liked);
    btn.querySelector('.like-icon').textContent = liked ? '❤️' : '🤍';
    count.textContent = post.likes.length;
  }
}

// ── Toggle Comment Box ────────────────────────────────────
function toggleComments(postId) {
  const box = document.getElementById('comment-box-' + postId);
  if (box) {
    const isOpen = box.style.display !== 'none';
    box.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) box.querySelector('input')?.focus();
  }
}

// ── Submit Comment ────────────────────────────────────────
function submitComment(postId) {
  const input = document.getElementById('comment-input-' + postId);
  const text = input?.value.trim();
  if (!text) return;

  const comment = { username: currentUser(), text, time: Date.now() };
  const post = Storage.addComment(postId, comment);
  input.value = '';

  // Re-render comments section
  const commentsList = document.getElementById('comments-list-' + postId);
  if (commentsList) {
    commentsList.innerHTML = renderComments(post.comments);
  }
  const countEl = document.getElementById('comment-count-' + postId);
  if (countEl) countEl.textContent = post.comments.length;

  showToast('💬 Comment posted!');
}

// ── Render Comments ───────────────────────────────────────
function renderComments(comments) {
  if (!comments || comments.length === 0) return '<p class="no-comments">No comments yet. Be the first!</p>';
  return comments.map(c => `
    <div class="comment-item">
      ${buildAvatar(c.username, 28)}
      <div class="comment-body">
        <span class="comment-user">${c.username}</span>
        <span class="comment-text">${escapeHtml(c.text)}</span>
        <div class="comment-time">${timeAgo(c.time)}</div>
      </div>
    </div>`).join('');
}

// ── Build Single Post Card HTML ───────────────────────────
function buildPostCard(post) {
  const user = currentUser();
  const liked = (post.likes || []).includes(user);
  const likeCount = (post.likes || []).length;
  const commentCount = (post.comments || []).length;
  const isOwner = post.username === user;

  return `
  <div class="post-card" id="post-${post.id}">
    <div class="post-header">
      <a href="profile.html?user=${post.username}" class="post-user-link">
        ${buildAvatar(post.username, 44)}
        <div class="post-meta">
          <div class="post-username">${post.username}</div>
          <div class="post-time">${timeAgo(post.createdAt)}</div>
        </div>
      </a>
      ${isOwner ? `<button class="post-delete-btn" onclick="deletePost('${post.id}')" title="Delete">🗑️</button>` : ''}
    </div>

    <div class="post-emoji-banner">${post.emoji || '✨'}</div>

    <div class="post-body">
      <p class="post-text">${escapeHtml(post.text)}</p>
      ${post.tags && post.tags.length ? `
        <div class="post-tags">
          ${post.tags.map(t => `<span class="tag" onclick="searchTag('${t}')">#${t}</span>`).join('')}
        </div>` : ''}
    </div>

    <div class="post-actions">
      <button class="action-btn like-btn ${liked ? 'liked' : ''}" id="like-btn-${post.id}" onclick="toggleLike('${post.id}')">
        <span class="like-icon">${liked ? '❤️' : '🤍'}</span>
        <span id="like-count-${post.id}">${likeCount}</span>
      </button>
      <button class="action-btn comment-btn" onclick="toggleComments('${post.id}')">
        💬 <span id="comment-count-${post.id}">${commentCount}</span>
      </button>
      <button class="action-btn share-btn" onclick="copyLink('${post.id}')">
        🔗 Share
      </button>
    </div>

    <div class="comment-box" id="comment-box-${post.id}" style="display:none">
      <div class="comments-list" id="comments-list-${post.id}">
        ${renderComments(post.comments)}
      </div>
      <div class="comment-input-wrap">
        ${buildAvatar(user, 32)}
        <input class="comment-input" id="comment-input-${post.id}"
          placeholder="Write a comment…"
          onkeydown="if(event.key==='Enter') submitComment('${post.id}')">
        <button class="comment-send" onclick="submitComment('${post.id}')">Send</button>
      </div>
    </div>
  </div>`;
}

// ── Render Full Feed ──────────────────────────────────────
function renderFeed(filter = 'all') {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;

  let posts = Storage.getPosts();
  const user = currentUser();

  if (filter === 'following') {
    const following = Storage.getFollowing(user);
    posts = posts.filter(p => following.includes(p.username) || p.username === user);
  }

  if (posts.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">Nothing here yet</div>
        <div class="empty-sub">Be the first to share something!</div>
        <button class="btn-primary" onclick="openPostModal()">Create Post</button>
      </div>`;
    return;
  }

  feed.innerHTML = posts.map(buildPostCard).join('');
}

// ── Delete Post ───────────────────────────────────────────
function deletePost(postId) {
  if (!confirm('Delete this post?')) return;
  Storage.deletePost(postId);
  document.getElementById('post-' + postId)?.remove();
  showToast('🗑️ Post deleted.');
}

// ── Copy Link ─────────────────────────────────────────────
function copyLink(postId) {
  navigator.clipboard.writeText(window.location.origin + '/post/' + postId).catch(() => {});
  showToast('🔗 Link copied!');
}

// ── Search by Tag ─────────────────────────────────────────
function searchTag(tag) {
  window.location.href = 'explore.html?tag=' + tag;
}

// ── Escape HTML ───────────────────────────────────────────
function escapeHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

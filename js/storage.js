// ============================================================
//  MyGram — storage.js
//  All localStorage read/write helpers
// ============================================================

const Storage = {

  // ── Users ──────────────────────────────────────────────
  getUsers() {
    return JSON.parse(localStorage.getItem('mygram_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('mygram_users', JSON.stringify(users));
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  findUser(username) {
    return this.getUsers().find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );
  },

  // ── Current Session ────────────────────────────────────
  getSession() {
    return JSON.parse(localStorage.getItem('mygram_session') || 'null');
  },
  setSession(username) {
    localStorage.setItem('mygram_session', JSON.stringify({ username, loginTime: Date.now() }));
  },
  clearSession() {
    localStorage.removeItem('mygram_session');
  },
  isLoggedIn() {
    return this.getSession() !== null;
  },

  // ── Posts ──────────────────────────────────────────────
  getPosts() {
    return JSON.parse(localStorage.getItem('mygram_posts') || '[]');
  },
  savePosts(posts) {
    localStorage.setItem('mygram_posts', JSON.stringify(posts));
  },
  addPost(post) {
    const posts = this.getPosts();
    posts.unshift(post); // newest first
    this.savePosts(posts);
    return post;
  },
  deletePost(postId) {
    const posts = this.getPosts().filter(p => p.id !== postId);
    this.savePosts(posts);
  },
  likePost(postId, username) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.likes) post.likes = [];
    const idx = post.likes.indexOf(username);
    if (idx === -1) post.likes.push(username);
    else post.likes.splice(idx, 1);
    this.savePosts(posts);
    return post;
  },
  addComment(postId, comment) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (!post.comments) post.comments = [];
    post.comments.push(comment);
    this.savePosts(posts);
    return post;
  },
  getPostsByUser(username) {
    return this.getPosts().filter(p => p.username === username);
  },

  // ── Following ──────────────────────────────────────────
  getFollowing(username) {
    const data = JSON.parse(localStorage.getItem('mygram_following') || '{}');
    return data[username] || [];
  },
  toggleFollow(currentUser, targetUser) {
    const data = JSON.parse(localStorage.getItem('mygram_following') || '{}');
    if (!data[currentUser]) data[currentUser] = [];
    const idx = data[currentUser].indexOf(targetUser);
    if (idx === -1) data[currentUser].push(targetUser);
    else data[currentUser].splice(idx, 1);
    localStorage.setItem('mygram_following', JSON.stringify(data));
    return idx === -1; // true = now following
  },
  isFollowing(currentUser, targetUser) {
    return this.getFollowing(currentUser).includes(targetUser);
  },
  getFollowers(username) {
    const data = JSON.parse(localStorage.getItem('mygram_following') || '{}');
    return Object.keys(data).filter(u => data[u].includes(username));
  },
};
// ── Demo Seed Data ──────────────────────────────
window.seedDemoData = function () {
  if (localStorage.getItem('mygram_seeded')) return;

  const demoUsers = [
    { username: 'luna_v', password: 'demo123', bio: 'Chasing sunsets 🌅', joined: Date.now() },
    { username: 'kai_x', password: 'demo123', bio: 'Building things ⚡', joined: Date.now() },
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
};

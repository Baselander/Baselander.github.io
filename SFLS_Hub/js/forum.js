// ============================================
// 论坛逻辑 — 发帖、搜索、实时更新
// ============================================

let allPosts = [];
let forumChannel = null;

async function loadPosts() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('forum_posts')
    .select(`
      id, title, content, image_url, created_at,
      profiles:user_id (username)
    `)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  allPosts = data || [];
  renderPosts(allPosts);
}

function renderPosts(posts) {
  const list = document.getElementById('post-list');
  if (!list) return;

  if (posts.length === 0) {
    list.innerHTML = '<p style="color:var(--sfls-text-secondary);">No posts yet.</p>';
    return;
  }

  list.innerHTML = posts.map(p => `
    <div class="post-card" onclick="viewPost(${p.id})">
      <div class="post-card-header">
        <div class="post-card-avatar">${(p.profiles?.username || '?')[0].toUpperCase()}</div>
        <span>${p.profiles?.username || 'Anonymous'}</span>
        <span>· ${formatTime(p.created_at)}</span>
      </div>
      <div class="post-card-title">${escapeHtml(p.title)}</div>
      <div class="post-card-excerpt">${escapeHtml(p.content || '')}</div>
    </div>
  `).join('');
}

// 发帖
async function publishPost() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) { showToast(t('forum.loginToPost')); return; }

  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  if (!title) { showToast('Title is required'); return; }

  const { error } = await sb.from('forum_posts').insert({
    user_id: user.id,
    title: title,
    content: content
  });

  if (error) { showToast('Failed: ' + error.message); return; }

  document.getElementById('post-title').value = '';
  document.getElementById('post-content').value = '';
  document.getElementById('new-post-area').style.display = 'none';
  await loadPosts();
}

function openNewPost() {
  document.getElementById('new-post-area').style.display = 'block';
  document.getElementById('post-title').focus();
}

function viewPost(postId) {
  window.location.href = `forum-detail.html?id=${postId}`;
}

// 搜索
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();

  const searchInput = document.getElementById('forum-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allPosts.filter(p =>
        p.title.toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q)
      );
      renderPosts(filtered);
    });
  }

  // 实时订阅
  const sb = getSupabase();
  if (sb) {
    forumChannel = sb
      .channel('forum-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => {
        loadPosts();
      })
      .subscribe();
  }
});
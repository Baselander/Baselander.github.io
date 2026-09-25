// ============================================
// 评论区组件 — 基于 Supabase Realtime
// 支持：实时同步、文件上传、回复、10分钟撤回
// ============================================

let currentClubId = null;
let currentUser = null;
let realtimeChannel = null;

// 初始化评论区
async function initComments(clubId) {
  currentClubId = clubId;
  const sb = getSupabase();
  if (!sb) return;

  // 获取当前用户
  const { data: { user } } = await sb.auth.getUser();
  currentUser = user;

  // 加载评论
  await loadComments(clubId);

  // 订阅实时更新
  realtimeChannel = sb
    .channel(`club-comments-${clubId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'club_comments',
      filter: `club_id=eq.${clubId}`
    }, () => {
      loadComments(clubId);
    })
    .subscribe();
}

// 加载评论
async function loadComments(clubId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('club_comments')
    .select(`
      id, content, image_url, created_at, parent_id,
      profiles:user_id (username, avatar_url)
    `)
    .eq('club_id', clubId)
    .order('created_at', { ascending: true });

  if (error) { console.error(error); return; }

  const list = document.getElementById('comment-list');
  if (!list) return;

  // 分离顶层评论和回复
  const topLevel = data.filter(c => !c.parent_id);
  const replies = data.filter(c => c.parent_id);

  list.innerHTML = topLevel.map(c => renderComment(c, replies, 0)).join('');
}

// 渲染单条评论
function renderComment(comment, allReplies, depth) {
  const childReplies = allReplies.filter(r => r.parent_id === comment.id);
  const username = comment.profiles?.username || 'Anonymous';
  const timeStr = formatTime(comment.created_at);
  const canRecall = currentUser &&
    (new Date() - new Date(comment.created_at)) < SITE_CONFIG.recallTimeLimit &&
    comment.profiles?.username === currentUser.user_metadata?.username;

  const repliesHtml = childReplies.length
    ? `<div class="replies">${childReplies.map(r => renderComment(r, [], depth + 1)).join('')}</div>`
    : '';

  return `
    <div class="comment-item" data-id="${comment.id}">
      <div class="comment-header">
        <div class="comment-avatar" onclick="showUserProfile('${comment.profiles?.username || ''}')">
          ${username.charAt(0).toUpperCase()}
        </div>
        <span class="comment-username">${username}</span>
        <span class="comment-time">${timeStr}</span>
      </div>
      <div class="comment-body">
        ${comment.content ? escapeHtml(comment.content) : ''}
        ${comment.image_url ? `<img src="${comment.image_url}" class="comment-image">` : ''}
      </div>
      <div class="comment-actions">
        <button onclick="replyTo(${comment.id})">${t('common.reply')}</button>
        ${canRecall ? `<button onclick="recallComment(${comment.id})">${t('common.recall')}</button>` : ''}
      </div>
      ${repliesHtml}
    </div>
  `;
}

// 提交评论
async function submitComment() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    showToast(t('clubs.loginToComment'));
    return;
  }

  const textEl = document.getElementById('comment-text');
  const content = textEl.value.trim();
  if (!content) return;

  // 上传图片（如果有）
  let imageUrl = '';
  const fileInput = document.getElementById('comment-file');
  if (fileInput && fileInput.files.length > 0) {
    imageUrl = await uploadFile(fileInput.files[0]);
  }

  const { error } = await sb.from('club_comments').insert({
    club_id: currentClubId,
    user_id: user.id,
    content: content,
    image_url: imageUrl
  });

  if (error) { showToast('Failed to post: ' + error.message); return; }

  textEl.value = '';
  fileInput.value = '';
  document.getElementById('comment-preview').innerHTML = '';
}

// 上传文件到 Supabase Storage
async function uploadFile(file) {
  const sb = getSupabase();
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await sb.storage
    .from('uploads')
    .upload(fileName, file);

  if (error) { console.error(error); return ''; }

  const { data: urlData } = sb.storage.from('uploads').getPublicUrl(fileName);
  return urlData.publicUrl;
}

// 撤回评论
async function recallComment(commentId) {
  if (!confirm(t('common.confirm') + '?')) return;
  const sb = getSupabase();
  const { error } = await sb.from('club_comments').delete().eq('id', commentId);
  if (error) showToast('Recall failed: ' + error.message);
}

// 回复评论
let replyingTo = null;
function replyTo(commentId) {
  replyingTo = commentId;
  const el = document.getElementById('comment-text');
  el.focus();
  el.placeholder = 'Replying...';
}

// 图片预览
function previewCommentImage(input) {
  const preview = document.getElementById('comment-preview');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" style="max-width:160px;border-radius:6px;margin-top:8px;">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// 工具函数
function formatTime(isoStr) {
  const d = new Date(isoStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return d.toLocaleDateString();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// 显示用户信息弹窗
function showUserProfile(username) {
  // 可从 profiles 表查询更多信息
  alert(username);
}
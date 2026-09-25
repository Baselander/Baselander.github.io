// profile 页面专用脚本

document.addEventListener('DOMContentLoaded', async () => {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) { window.location.href = 'auth.html'; return; }

  // 加载 profile
  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    document.getElementById('profile-username').textContent = profile.username || 'User';
    document.getElementById('profile-avatar').textContent = (profile.username || 'U')[0].toUpperCase();
    document.getElementById('bio-input').value = profile.bio || '';
    document.getElementById('profile-joined').textContent = 'Joined ' +
      new Date(profile.created_at).toLocaleDateString();
  }

  // 统计帖子数
  const { count } = await sb
    .from('forum_posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  document.getElementById('stat-posts').textContent = count || 0;
});

async function saveBio() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const bio = document.getElementById('bio-input').value.trim();
  const { error } = await sb.from('profiles').update({ bio }).eq('id', user.id);
  if (error) { alert('Failed: ' + error.message); return; }
  alert('Bio saved!');
}

function showProfileTab(tab) {
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  event.target.closest('.sidebar-item').classList.add('active');
}
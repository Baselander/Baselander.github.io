// ============================================
// 认证逻辑 — 注册 / 登录 / 登出
// ============================================

let isLoginMode = true;

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  const title = document.getElementById('auth-title');
  const btn = document.getElementById('auth-btn');
  const link = document.getElementById('auth-switch-link');
  const usernameGroup = document.getElementById('username-group');

  if (isLoginMode) {
    title.textContent = t('auth.login');
    btn.textContent = t('auth.loginBtn');
    link.textContent = t('auth.switchToRegister');
    usernameGroup.style.display = 'none';
  } else {
    title.textContent = t('auth.register');
    btn.textContent = t('auth.registerBtn');
    link.textContent = t('auth.switchToLogin');
    usernameGroup.style.display = 'block';
  }
}

async function handleAuth() {
  const sb = getSupabase();
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const username = document.getElementById('auth-username')?.value.trim();
  const errorEl = document.getElementById('auth-error');
  errorEl.style.display = 'none';

  if (!email || !password) {
    showAuthError('Please fill in all fields.');
    return;
  }

  if (isLoginMode) {
    // 登录
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { showAuthError(error.message); return; }
    window.location.href = 'profile.html';
  } else {
    // 注册
    if (!username) { showAuthError('Username is required.'); return; }
    if (password.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }

    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin + '/profile.html'
      }
    });
    if (error) { showAuthError(error.message); return; }
    showAuthError('Verification email sent! Please check your inbox.', '#2D6A4F');
  }
}

function showAuthError(msg, color = '#e53935') {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.color = color;
  el.style.display = 'block';
}

// 登出
async function logout() {
  const sb = getSupabase();
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

// 获取当前用户
async function getCurrentUser() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}
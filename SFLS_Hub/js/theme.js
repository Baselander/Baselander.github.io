// ============================================
// 主题切换 — 亮色 / 暗色
// 使用 CSS 变量 + localStorage 持久化
// ============================================

function initTheme() {
  const savedTheme = localStorage.getItem('sfls-theme') || SITE_CONFIG.defaultTheme;
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sfls-theme', theme);
  updateThemeButton(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

document.addEventListener('DOMContentLoaded', initTheme);
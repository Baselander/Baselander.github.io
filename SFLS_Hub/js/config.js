// ============================================
// Supabase 配置 — 请替换为你的项目信息
// 在 https://supabase.com/dashboard 中获取
// ============================================
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// 网站基础配置
const SITE_CONFIG = {
  name: 'SFLS Hub',
  version: '1.0.0',
  // 评论撤回时间限制（毫秒），10分钟 = 600000
  recallTimeLimit: 600000,
  // 默认语言
  defaultLang: 'en',
  // 默认主题
  defaultTheme: 'light'
};
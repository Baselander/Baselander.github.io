// Supabase 客户端初始化
// 依赖 CDN 引入的 @supabase/supabase-js
let supabaseClient = null;

function initSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof supabase === 'undefined') {
    console.error('Supabase SDK 未加载');
    return null;
  }
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

function getSupabase() {
  return supabaseClient || initSupabase();
}
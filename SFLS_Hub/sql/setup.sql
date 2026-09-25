-- ============================================
-- SFLS Hub 数据库初始化
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 1. 用户资料表
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以查看资料" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "用户只能修改自己的资料" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户只能插入自己的资料" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. 社团评论表
CREATE TABLE public.club_comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  club_id TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT DEFAULT '',
  parent_id BIGINT REFERENCES public.club_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.club_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以查看评论" ON public.club_comments
  FOR SELECT USING (true);

CREATE POLICY "登录用户可以发表评论" ON public.club_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的评论" ON public.club_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 3. 论坛帖子表
CREATE TABLE public.forum_posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以查看帖子" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "登录用户可以发帖" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的帖子" ON public.forum_posts
  FOR DELETE USING (auth.uid() = user_id);

-- 4. 论坛回复表
CREATE TABLE public.forum_replies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id BIGINT REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT DEFAULT '',
  parent_id BIGINT REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以查看回复" ON public.forum_replies
  FOR SELECT USING (true);

CREATE POLICY "登录用户可以回复" ON public.forum_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的回复" ON public.forum_replies
  FOR DELETE USING (auth.uid() = user_id);

-- 5. 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE public.club_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;

-- 6. 创建存储桶（用于图片上传）
-- 也可在 Supabase Dashboard → Storage 中手动创建名为 "uploads" 的公共桶
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "任何人都可以查看上传的文件" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "登录用户可以上传文件" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
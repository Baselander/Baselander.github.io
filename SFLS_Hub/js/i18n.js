// ============================================
// 国际化模块 — 中英文切换
// ============================================

const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      intro: 'Intro',
      homework: 'Homework',
      notifications: 'Notifications',
      clubs: 'Clubs',
      gap: 'GAP',
      forum: 'Forum',
      paradox: 'Paradox',
      other: 'Other',
      profile: 'Profile'
    },
    home: {
      title: 'AIP Hub',
      subtitle: 'Website For Students of AIP',
      enterBtn: 'Enter Intro →',
      // 浮窗内容
      floatHomework: {
        title: 'Homework',
        desc: 'Daily assignments for classes 111A-114. Updated regularly with subject-specific tasks.'
      },
      floatNotifications: {
        title: 'Notifications',
        desc: 'Important announcements, schedule changes, and school-wide notices.'
      },
      floatClubs: {
        title: 'Clubs',
        desc: 'Explore student clubs, join activities, and connect with like-minded peers.'
      },
      floatGap: {
        title: 'GAP',
        desc: 'Global Awareness Program — service learning and international exchange opportunities.'
      },
      floatForum: {
        title: 'Forum',
        desc: 'Discuss topics, share ideas, and collaborate with fellow AIP students.'
      },
      floatOther: {
        title: 'Other',
        desc: 'Additional resources, tools, and miscellaneous student services.'
      }
    },
    homework: {
      title: 'Homework',
      classes: { c111A: '111A', c111B: '111B', c112: '112', c113: '113', c114: '114' }
    },
    notifications: {
      title: 'Notifications'
    },
    clubs: {
      title: 'Clubs',
      searchPlaceholder: 'Search clubs...',
      contact: 'Contact',
      activities: 'Activities',
      comments: 'Comments',
      commentPlaceholder: 'Write a comment...',
      send: 'Send',
      loginToComment: 'Login to comment'
    },
    forum: {
      title: 'Forum',
      searchPlaceholder: 'Search posts...',
      newPost: 'New Post',
      titlePlaceholder: 'Post title...',
      contentPlaceholder: 'What do you want to share?',
      publish: 'Publish',
      loginToPost: 'Login to post',
      replies: 'replies'
    },
    profile: {
      title: 'Profile',
      bio: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      saveBio: 'Save Bio',
      myClubs: 'My Clubs',
      noClubs: 'No clubs yet.',
      clubs: 'Clubs',
      news: 'News',
      posts: 'Posts',
      member: 'MEMBER',
      joined: 'Joined'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      logout: 'Logout',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Login'
    },
    common: {
      loading: 'Loading...',
      noData: 'No data available',
      recall: 'Recall',
      reply: 'Reply',
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      upload: 'Upload'
    },
    footer: {
      copyright: '© 2025 SFLS International Department. Produced by The Daily Headache.',
      suggestion: 'If you have any suggestions, feel free to contact us in the WeChat group.'
    }
  },
  zh: {
    nav: {
      home: '首页',
      intro: '简介',
      homework: '作业',
      notifications: '通知',
      clubs: '社团',
      gap: 'GAP',
      forum: '论坛',
      paradox: 'Paradox',
      other: '其他',
      profile: '个人'
    },
    home: {
      title: 'AIP Hub',
      subtitle: 'AIP 学生专属网站',
      enterBtn: '进入简介 →',
      floatHomework: {
        title: '作业',
        desc: '111A-114 班级每日作业，定期更新各科任务。'
      },
      floatNotifications: {
        title: '通知',
        desc: '重要公告、课表变动及全校通知。'
      },
      floatClubs: {
        title: '社团',
        desc: '探索学生社团，参与活动，结识志同道合的伙伴。'
      },
      floatGap: {
        title: 'GAP',
        desc: '全球意识项目——服务学习与国际交流机会。'
      },
      floatForum: {
        title: '论坛',
        desc: '讨论话题、分享想法，与 AIP 同学协作交流。'
      },
      floatOther: {
        title: '其他',
        desc: '额外资源、工具及学生服务。'
      }
    },
    homework: {
      title: '作业',
      classes: { c111A: '111A', c111B: '111B', c112: '112', c113: '113', c114: '114' }
    },
    notifications: {
      title: '通知'
    },
    clubs: {
      title: '社团',
      searchPlaceholder: '搜索社团...',
      contact: '联系方式',
      activities: '活动',
      comments: '评论区',
      commentPlaceholder: '写下你的评论...',
      send: '发送',
      loginToComment: '登录后评论'
    },
    forum: {
      title: '论坛',
      searchPlaceholder: '搜索帖子...',
      newPost: '发布新帖',
      titlePlaceholder: '帖子标题...',
      contentPlaceholder: '想分享些什么？',
      publish: '发布',
      loginToPost: '登录后发帖',
      replies: '条回复'
    },
    profile: {
      title: '个人',
      bio: '简介',
      bioPlaceholder: '介绍一下你自己...',
      saveBio: '保存简介',
      myClubs: '我的社团',
      noClubs: '暂无社团',
      clubs: '社团',
      news: '动态',
      posts: '帖子',
      member: '成员',
      joined: '加入于'
    },
    auth: {
      login: '登录',
      register: '注册',
      email: '邮箱',
      username: '用户名',
      password: '密码',
      loginBtn: '登录',
      registerBtn: '创建账号',
      logout: '退出登录',
      switchToRegister: '没有账号？立即注册',
      switchToLogin: '已有账号？去登录'
    },
    common: {
      loading: '加载中...',
      noData: '暂无数据',
      recall: '撤回',
      reply: '回复',
      search: '搜索',
      cancel: '取消',
      confirm: '确认',
      upload: '上传'
    },
    footer: {
      copyright: '© 2025 SFLS 国际部. 每日头疼报社 出品.',
      suggestion: '如果你对本报有任何建议，可以在微信群告诉我们。'
    }
  }
};

// 当前语言
let currentLang = localStorage.getItem('sfls-lang') || SITE_CONFIG.defaultLang;

// 获取翻译
function t(path) {
  const keys = path.split('.');
  let result = TRANSLATIONS[currentLang];
  for (const key of keys) {
    if (result && result[key] !== undefined) {
      result = result[key];
    } else {
      return path; // 找不到则返回 key
    }
  }
  return result;
}

// 切换语言
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sfls-lang', lang);
  // 更新所有带 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  // 更新语言按钮状态
  updateLangButton();
  // 触发自定义事件，让页面可以监听
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function updateLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = currentLang === 'en' ? 'EN | 中文' : '中文 | EN';
  }
}

// 初始化语言
function initI18n() {
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('sfls-lang');
    if (savedLang) currentLang = savedLang;
    setLanguage(currentLang);
  });
}

initI18n();
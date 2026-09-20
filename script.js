// ==========================================
// 数据与状态管理区域
// ==========================================

// 1. 默认作业数据 (保留原样)
const homeworkData = {
    "111A": { date: "2025/11/24", subjects: [ { name: "Eng Lang", tasks: ["review class", "chapter 10"] }, { name: "Chinese", tasks: ["抄写纸", "三国演义练习题"] }, { name: "AP_physics", tasks: ["review"] }, { name: "Precalc", tasks: ["- ws"] }, { name: "History", tasks: ["pop WS due next tues"] } ], note: "由于今年选课复杂，仅列出9.1共同课程与Science。其余Elective的作业与通知需要大家自觉记录哦。" },
    "111B": { date: "2025/11/24", subjects: [ { name: "Eng Lang", tasks: ["Essay Draft", "Vocabulary Quiz prep"] }, { name: "Chinese", tasks: ["古诗背诵"] }, { name: "AP_physics", tasks: ["Lab report"] }, { name: "Precalc", tasks: ["Textbook Pg. 42"] }, { name: "History", tasks: ["Read Chapter 5"] } ], note: "请同学们按时完成作业，明天检查。" },
    "112": { date: "2025/11/24", subjects: [ { name: "Eng Lang", tasks: ["Group presentation准备"] }, { name: "AP_physics", tasks: ["错题整理"] } ], note: "112班通知：明天下午有物理测验。" },
    "113": { date: "2025/11/24", subjects: [], note: "今日暂无作业记录。" },
    "114": { date: "2025/11/24", subjects: [ { name: "Chinese", tasks: ["作文大纲"] }, { name: "Precalc", tasks: ["Worksheet"] } ], note: "注意：下周有历史大作业截止。" }
};

// 2. 默认通知数据 (保留原样)
const noticesData = [
    { time: "2025-11-24 08:00", title: "关于近期校园活动的通知", content: "本周五下午将举行秋季运动会，请各位同学穿着运动服准时到达操场集合。" },
    { time: "2025-11-22 14:30", title: "AP物理考试提醒", content: "AP物理模拟考试定于下周三上午进行，请同学们做好复习准备。" },
    { time: "2025-11-20 09:00", title: "图书馆延长开放时间", content: "为迎接期末考试，即日起至下月底，图书馆闭馆时间延长至晚上十点。" }
];

// 3. 社团数据 (示例3个)
const clubsData = [
    { id: 1, name: "编程社 (Coding Club)", desc: "热爱编程与科技创新的同学聚集地。", contact: "coding@sfls.edu", activities: "每周五下午在机房进行项目开发与算法学习。", comments: [] },
    { id: 2, name: "辩论社 (Debate Club)", desc: "锻炼思辨与表达能力的舞台。", contact: "debate@sfls.edu", activities: "每月举行校内模拟联合国与辩论赛。", comments: [] },
    { id: 3, name: "音乐社 (Music Club)", desc: "无论是古典还是流行，音乐爱好者之家。", contact: "music@sfls.edu", activities: "定期举办音乐分享会与校园演出。", comments: [] }
];

// 4. 系统数据初始化 (从 localStorage 获取或初始化)
let users = JSON.parse(localStorage.getItem('sfls_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('sfls_currentUser')) || null;
let forumPosts = JSON.parse(localStorage.getItem('sfls_posts')) || [
    { id: 1, title: "欢迎来到 SFLS 论坛！", content: "这是我们的第一个帖子。大家可以在下面留言交流。", author: "Admin", time: "2025-11-24 10:00", comments: [] }
];
let clubComments = JSON.parse(localStorage.getItem('sfls_club_comments')) || {};
let currentLang = localStorage.getItem('sfls_lang') || 'en'; // 默认英文

// ==========================================
// 语言包 (i18n)
// ==========================================
const translations = {
    en: {
        nav_home: "Home", nav_homework: "Homework", nav_notices: "Notices", nav_clubs: "Clubs", nav_forum: "Forum", nav_profile: "Profile", nav_gap: "GAP", nav_other: "Other",
        home_welcome: "Welcome to SFLS Learning Hub", home_desc: "View daily homework, stay updated with notices, and plan your campus life.", home_cta: "View Today's Homework",
        feat_hw_title: "📚 Homework", feat_hw_desc: "View homework by class, fast and convenient.", 
        feat_notice_title: "📢 Notices", feat_notice_desc: "Get important school events and exam schedules.",
        feat_gap_title: "📖 GAP Zone", feat_gap_desc: "Project-based learning and extracurricular activities.",
        notices_title: "Latest Notices",
        clubs_title: "Club List", clubs_search_ph: "Search clubs...", club_desc: "Description", club_contact: "Contact", club_activities: "Activities", comments: "Comments", comment_ph: "Write a comment...", submit_comment: "Submit", back: "Back",
        forum_title: "Forum", forum_search_ph: "Search posts...", forum_login_required: "Please login to use the forum.", go_login: "Go to Login", post_title_ph: "Post title...", post_content_ph: "Post content...", post_btn: "Post",
        profile_title: "Profile Center", login: "Login", login_acc_ph: "Email/Phone/Username", password_ph: "Password", login_btn: "Login", register: "Register", reg_acc_ph: "Email/Phone", reg_username_ph: "Username (unique)", reg_btn: "Register", privacy_link: "Read Privacy Policy", welcome_user: "Welcome, ", bio_label: "Bio:", bio_ph: "Write something about yourself...", save_bio: "Save Bio", logout_btn: "Logout",
        gap_placeholder: "🚧 Under Construction...", gap_desc: "GAP page is not ready yet. Stay tuned!",
        other_placeholder: "🚧 Under Construction...", other_desc: "Other features are in development. Stay tuned!",
        footer_copy: "© 2025 SFLS International Department. Daily Headache Press.",
        footer_suggest: "If you have any suggestions, tell us in the WeChat group.",
        user_info: "User Info", username: "Username", account: "Account", bio: "Bio",
        privacy_title: "Privacy Policy",
        privacy_text: "1. All data (accounts, posts, comments) is stored locally in your browser (localStorage). This website is a static frontend hosted on GitHub Pages and does not have a backend server. \n2. We do not collect, transmit, or store your personal information on any external server. \n3. Password: Your password is stored locally in an obfuscated format. It is recommended not to use your real sensitive password. \n4. Clear browser data will result in loss of all account and forum data."
    },
    zh: {
        nav_home: "首页", nav_homework: "作业", nav_notices: "通知", nav_clubs: "社团", nav_forum: "论坛", nav_profile: "个人", nav_gap: "GAP", nav_other: "其他",
        home_welcome: "欢迎来到 SFLS 学习中心", home_desc: "查看每日作业，掌握最新通知，规划你的校园生活。", home_cta: "查看今日作业",
        feat_hw_title: "📚 作业布置", feat_hw_desc: "按班级分类查看各科作业与要求，方便快捷。",
        feat_notice_title: "📢 校园通知", feat_notice_desc: "及时获取学校重要活动、考试安排与提醒。",
        feat_gap_title: "📖 GAP专区", feat_gap_desc: "项目式学习与课外拓展活动信息汇总。",
        notices_title: "最新通知",
        clubs_title: "社团列表", clubs_search_ph: "搜索社团...", club_desc: "介绍", club_contact: "联系方式", club_activities: "活动", comments: "评论区", comment_ph: "写下你的评论...", submit_comment: "提交", back: "返回",
        forum_title: "论坛", forum_search_ph: "搜索帖子...", forum_login_required: "请先登录才能使用论坛功能。", go_login: "前往登录", post_title_ph: "帖子标题...", post_content_ph: "帖子内容...", post_btn: "发布帖子",
        profile_title: "个人中心", login: "登录", login_acc_ph: "邮箱/手机号/用户名", password_ph: "密码", login_btn: "登录", register: "注册", reg_acc_ph: "邮箱/手机号", reg_username_ph: "用户名 (不能重复)", reg_btn: "注册", privacy_link: "阅读隐私信息说明", welcome_user: "欢迎, ", bio_label: "个人简介:", bio_ph: "写一点关于你的介绍...", save_bio: "保存简介", logout_btn: "退出登录",
        gap_placeholder: "🚧 正在制作...", gap_desc: "GAP页面尚未完成，敬请期待！",
        other_placeholder: "🚧 正在制作...", other_desc: "其他功能正在开发中，敬请期待！",
        footer_copy: "© 2025 SFLS 国际部. 每日头疼报社 出品.",
        footer_suggest: "如果你对本报有任何建议，可以在微信群告诉我们。",
        user_info: "用户信息", username: "用户名", account: "账号", bio: "简介",
        privacy_title: "隐私信息说明",
        privacy_text: "1. 所有数据（账号、帖子、评论）均存储在您的浏览器本地（localStorage）。本站为托管在 GitHub Pages 上的纯静态前端，没有后端服务器。\n2. 我们不会收集、传输或存储您的个人信息到任何外部服务器。\n3. 密码安全：您的密码以混淆格式存储在本地，建议不要使用真实的敏感密码。\n4. 清除浏览器数据将导致所有账号及论坛数据丢失。"
    }
};

function t(key) { return translations[currentLang][key] || key; }

// ==========================================
// 核心渲染与交互逻辑
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    initNavigation();
    initHomework();
    initNotices();
    initClubs();
    initForum();
    initAuth();
    updateAuthUI();
});

// 1. 语言切换
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sfls_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('btn-zh').classList.toggle('active', lang === 'zh');
    
    // 重新渲染动态内容
    const activeSub = document.querySelector('.sub-nav-btn.active');
    if(activeSub) renderHomework(activeSub.getAttribute('data-class'));
    renderNotices();
    renderClubs();
    renderForum();
}

// 2. 主选项卡切换
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            pageSections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    document.getElementById('btn-en').addEventListener('click', () => applyLanguage('en'));
    document.getElementById('btn-zh').addEventListener('click', () => applyLanguage('zh'));
}

// 3. 作业页逻辑 (保留原有)
function initHomework() {
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    subNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHomework(btn.getAttribute('data-class'));
        });
    });
    renderHomework('111A');
}

function renderHomework(className) {
    const data = homeworkData[className];
    const container = document.getElementById('homework-content');
    if (!data) return;

    let subjectsHtml = data.subjects.length > 0 
        ? data.subjects.map(sub => `<div class="subject-item"><h4>${sub.name}</h4><ul>${sub.tasks.map(t => `<li>${t}</li>`).join('')}</ul></div>`).join('')
        : '<p>暂无科目作业记录。</p>';

    container.innerHTML = `
        <div class="news-header">
            <h2>每日头疼</h2>
            <h3>The Daily Headache - ${className}</h3>
            <div class="date">${data.date}</div>
        </div>
        <div class="news-body">
            <div class="news-column-left">${subjectsHtml}</div>
            <div class="news-column-right">
                <div class="news-image-placeholder">[SFLS 校徽 / 图片区域]</div>
                <div class="news-note">${data.note}</div>
            </div>
        </div>
    `;
}

// 4. 通知页逻辑 (保留原有)
function initNotices() { renderNotices(); }
function renderNotices() {
    const list = document.getElementById('notices-list');
    list.innerHTML = noticesData.map((n, i) => `
        <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-content">
                <span class="time">${n.time}</span>
                <h4>${n.title}</h4>
                <p>${n.content}</p>
            </div>
        </div>
    `).join('');
}

// 5. 社团页逻辑
function initClubs() {
    document.getElementById('club-search').addEventListener('input', (e) => {
        renderClubs(e.target.value.toLowerCase());
    });
}

function renderClubs(searchTerm = '') {
    const grid = document.getElementById('club-grid');
    const filtered = clubsData.filter(c => c.name.toLowerCase().includes(searchTerm) || c.desc.toLowerCase().includes(searchTerm));
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p>没有找到匹配的社团。</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(club => `
        <button class="club-card" onclick="openClubDetail(${club.id})">
            <h3>${club.name}</h3>
            <p>${club.desc}</p>
        </button>
    `).join('');
}

function openClubDetail(clubId) {
    const club = clubsData.find(c => c.id === clubId);
    if (!club) return;
    
    document.getElementById('club-list-view').style.display = 'none';
    document.getElementById('club-detail-view').style.display = 'block';
    document.getElementById('detail-club-name').innerText = club.name;
    // 图片 src 留空，在 HTML 中加注释说明
    document.getElementById('detail-club-desc').innerText = club.desc;
    document.getElementById('detail-club-contact').innerText = club.contact;
    document.getElementById('detail-club-activities').innerText = club.activities;
    
    renderClubComments(clubId);
}

function showClubList() {
    document.getElementById('club-list-view').style.display = 'block';
    document.getElementById('club-detail-view').style.display = 'none';
}

function renderClubComments(clubId) {
    const club = clubsData.find(c => c.id === clubId);
    const comments = club.comments || [];
    const container = document.getElementById('club-comments-list');
    container.innerHTML = comments.length > 0 
        ? comments.map(c => `<div class="comment-item"><strong>${c.author}</strong> (${c.time}): ${c.text}</div>`).join('')
        : '<p>暂无评论，快来抢沙发吧！</p>';
}

function addClubComment() {
    if (!currentUser) { alert(t('forum_login_required')); return; }
    const input = document.getElementById('club-comment-input');
    const text = input.value.trim();
    if (!text) return;
    
    const activeClubName = document.getElementById('detail-club-name').innerText;
    const club = clubsData.find(c => c.name === activeClubName);
    if (!club) return;
    
    if (!club.comments) club.comments = [];
    club.comments.push({ author: currentUser.username, text: text, time: new Date().toLocaleString() });
    input.value = '';
    renderClubComments(club.id);
}

// 6. 论坛页逻辑
function initForum() {
    document.getElementById('forum-search').addEventListener('input', (e) => {
        renderForum(e.target.value.toLowerCase());
    });
}

function renderForum(searchTerm = '') {
    const authWarning = document.getElementById('forum-auth-warning');
    const contentArea = document.getElementById('forum-content-area');
    const list = document.getElementById('forum-posts-list');
    
    if (!currentUser) {
        authWarning.style.display = 'block';
        contentArea.style.display = 'none';
        return;
    } else {
        authWarning.style.display = 'none';
        contentArea.style.display = 'block';
    }
    
    const filtered = forumPosts.filter(p => p.title.toLowerCase().includes(searchTerm) || p.content.toLowerCase().includes(searchTerm));
    
    if (filtered.length === 0) {
        list.innerHTML = '<p>没有找到相关帖子。</p>';
        return;
    }
    
    list.innerHTML = filtered.map(post => `
        <div class="post-card" onclick="openForumDetail(${post.id})">
            <div class="post-header">
                <div class="post-avatar" onclick="event.stopPropagation(); showUserModal('${post.author}')">${post.author.charAt(0).toUpperCase()}</div>
                <div class="post-meta">
                    <div><strong>${post.author}</strong></div>
                    <div>${post.time}</div>
                </div>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-content-preview">${post.content}</div>
        </div>
    `).join('');
}

function createPost() {
    if (!currentUser) return;
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    if (!title || !content) { alert('标题和内容不能为空！'); return; }
    
    forumPosts.unshift({
        id: Date.now(),
        title: title,
        content: content,
        author: currentUser.username,
        time: new Date().toLocaleString(),
        comments: []
    });
    localStorage.setItem('sfls_posts', JSON.stringify(forumPosts));
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    renderForum();
}

function openForumDetail(postId) {
    if (!currentUser) return;
    const post = forumPosts.find(p => p.id === postId);
    if (!post) return;
    
    document.getElementById('forum-list-view').style.display = 'none';
    document.getElementById('forum-detail-view').style.display = 'block';
    
    let commentsHtml = post.comments.map(c => `
        <div class="comment-item">
            <strong>${c.author}</strong> (${c.time}): ${c.text}
        </div>
    `).join('');
    
    document.getElementById('forum-detail-content').innerHTML = `
        <h2>${post.title}</h2>
        <p style="color:#555; font-size:0.9rem;">作者: ${post.author} | 时间: ${post.time}</p>
        <div style="margin: 1.5rem 0; padding: 1rem; background: #f9f9f9; border-radius: 8px;">${post.content}</div>
        <h3>评论区</h3>
        <div id="forum-comments-list">${commentsHtml || '<p>暂无评论</p>'}</div>
        <div class="comment-input-area">
            <input type="text" id="forum-comment-input" placeholder="写下你的评论...">
            <button onclick="addForumComment(${post.id})">提交</button>
        </div>
    `;
}

function addForumComment(postId) {
    const input = document.getElementById('forum-comment-input');
    const text = input.value.trim();
    if (!text) return;
    
    const post = forumPosts.find(p => p.id === postId);
    if (!post) return;
    
    post.comments.push({ author: currentUser.username, text: text, time: new Date().toLocaleString() });
    localStorage.setItem('sfls_posts', JSON.stringify(forumPosts));
    openForumDetail(postId);
}

function showForumList() {
    document.getElementById('forum-list-view').style.display = 'block';
    document.getElementById('forum-detail-view').style.display = 'none';
    renderForum();
}

// 7. 用户信息弹窗
function showUserModal(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    
    document.getElementById('modal-username').innerText = user.username;
    // 隐藏部分敏感信息
    const hiddenAcc = user.account.length > 4 ? user.account.substring(0, 3) + '****' + user.account.slice(-2) : '****';
    document.getElementById('modal-account').innerText = hiddenAcc;
    document.getElementById('modal-bio').innerText = user.bio || '该用户还没有填写简介。';
    document.getElementById('user-info-modal').style.display = 'flex';
}

function closeUserModal() {
    document.getElementById('user-info-modal').style.display = 'none';
}

// 8. 账号系统 (注册/登录/个人中心)
function initAuth() {
    if (!localStorage.getItem('sfls_users')) localStorage.setItem('sfls_users', JSON.stringify([]));
}

function updateAuthUI() {
    const authForms = document.getElementById('auth-forms');
    const userDashboard = document.getElementById('user-dashboard');
    
    if (currentUser) {
        authForms.style.display = 'none';
        userDashboard.style.display = 'block';
        document.getElementById('dash-username').innerText = currentUser.username;
        document.getElementById('user-bio').value = currentUser.bio || '';
    } else {
        authForms.style.display = 'block';
        userDashboard.style.display = 'none';
    }
    renderForum(); // 更新论坛权限
}

function registerUser() {
    const account = document.getElementById('reg-account').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    
    if (!account || !username || !password) { alert('请填写所有注册信息！'); return; }
    
    const existingUser = users.find(u => u.username === username || u.account === account);
    if (existingUser) {
        alert('用户名或邮箱/手机号已被注册！');
        return;
    }
    
    // 简单混淆密码 (注意：这仅为演示，前端无法做到绝对安全，隐私说明中有提及)
    const obfuscatedPassword = btoa(password);
    
    const newUser = { account, username, password: obfuscatedPassword, bio: '' };
    users.push(newUser);
    localStorage.setItem('sfls_users', JSON.stringify(users));
    alert('注册成功！请登录。');
    
    document.getElementById('reg-account').value = '';
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
}

function loginUser() {
    const accountInput = document.getElementById('login-account').value.trim();
    const passwordInput = document.getElementById('login-password').value;
    
    if (!accountInput || !passwordInput) { alert('请输入账号和密码！'); return; }
    
    const obfuscatedInput = btoa(passwordInput);
    const user = users.find(u => (u.username === accountInput || u.account === accountInput) && u.password === obfuscatedInput);
    
    if (!user) {
        alert('账号或密码错误！');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('sfls_currentUser', JSON.stringify(user));
    updateAuthUI();
    alert('登录成功！');
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('sfls_currentUser');
    updateAuthUI();
    document.getElementById('login-account').value = '';
    document.getElementById('login-password').value = '';
}

function updateBio() {
    if (!currentUser) return;
    const newBio = document.getElementById('user-bio').value.trim();
    currentUser.bio = newBio;
    
    // 同步更新数组中的用户数据
    const index = users.findIndex(u => u.username === currentUser.username);
    if (index !== -1) users[index] = currentUser;
    
    localStorage.setItem('sfls_currentUser', JSON.stringify(currentUser));
    localStorage.setItem('sfls_users', JSON.stringify(users));
    alert('个人简介已更新！');
}

// 9. 隐私说明弹窗
function showPrivacy() {
    // 更新隐私说明内容（根据当前语言）
    document.querySelector('.privacy-text').innerText = t('privacy_text');
    document.getElementById('privacy-modal').style.display = 'flex';
}

function closePrivacy() {
    document.getElementById('privacy-modal').style.display = 'none';
}

// 全局挂载函数 (供HTML内联onclick调用)
window.openClubDetail = openClubDetail;
window.showClubList = showClubList;
window.addClubComment = addClubComment;
window.openForumDetail = openForumDetail;
window.showForumList = showForumList;
window.addForumComment = addForumComment;
window.createPost = createPost;
window.showUserModal = showUserModal;
window.closeUserModal = closeUserModal;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.updateBio = updateBio;
window.showPrivacy = showPrivacy;
window.closePrivacy = closePrivacy;
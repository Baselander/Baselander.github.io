// ==========================================
// 数据区域 (以后更新作业和通知，只需修改这里的数据即可)
// ==========================================

// 作业数据
const homeworkData = {
    "111A": {
        date: "2025/11/24",
        subjects: [
            { name: "Eng Lang", tasks: ["review class", "chapter 10"] },
            { name: "Chinese", tasks: ["抄写纸", "三国演义练习题"] },
            { name: "AP_physics", tasks: ["review"] },
            { name: "Precalc", tasks: ["- ws"] },
            { name: "History", tasks: ["pop WS due next tues"] }
        ],
        note: "由于今年选课复杂，仅列出9.1共同课程与Science。其余Elective的作业与通知需要大家自觉记录哦。如果你对本报有任何建议，可以在微信群里告诉我们。"
    },
    "111B": {
        date: "2025/11/24",
        subjects: [
            { name: "Eng Lang", tasks: ["Essay Draft", "Vocabulary Quiz prep"] },
            { name: "Chinese", tasks: ["古诗背诵"] },
            { name: "AP_physics", tasks: ["Lab report"] },
            { name: "Precalc", tasks: ["Textbook Pg. 42"] },
            { name: "History", tasks: ["Read Chapter 5"] }
        ],
        note: "请同学们按时完成作业，明天检查。"
    },
    // 其他班级可以按此格式继续补充，如果为空可以显示“暂无作业”
    "112": {
        date: "2025/11/24",
        subjects: [
            { name: "Eng Lang", tasks: ["Group presentation准备"] },
            { name: "AP_physics", tasks: ["错题整理"] }
        ],
        note: "112班通知：明天下午有物理测验。"
    },
    "113": {
        date: "2025/11/24",
        subjects: [],
        note: "今日暂无作业记录。"
    },
    "114": {
        date: "2025/11/24",
        subjects: [
            { name: "Chinese", tasks: ["作文大纲"] },
            { name: "Precalc", tasks: ["Worksheet"] }
        ],
        note: "注意：下周有历史大作业截止。"
    }
};

// 通知数据 (按时间倒序排列，最新的在第一个)
const noticesData = [
    {
        time: "2025-11-24 08:00",
        title: "关于近期校园活动的通知",
        content: "本周五下午将举行秋季运动会，请各位同学穿着运动服准时到达操场集合。"
    },
    {
        time: "2025-11-22 14:30",
        title: "AP物理考试提醒",
        content: "AP物理模拟考试定于下周三上午进行，请同学们做好复习准备。"
    },
    {
        time: "2025-11-20 09:00",
        title: "图书馆延长开放时间",
        content: "为迎接期末考试，即日起至下月底，图书馆闭馆时间延长至晚上十点。"
    }
];

// ==========================================
// 渲染与交互逻辑
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 主选项卡切换逻辑
    const navBtns = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            navBtns.forEach(b => b.classList.remove('active'));
            pageSections.forEach(s => s.classList.remove('active'));

            // 激活当前点击的
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 2. 作业页子选项卡逻辑
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    const homeworkContainer = document.getElementById('homework-content');

    function renderHomework(className) {
        const data = homeworkData[className];
        if (!data) return;

        // 构建科目HTML
        let subjectsHtml = '';
        if (data.subjects && data.subjects.length > 0) {
            data.subjects.forEach(sub => {
                subjectsHtml += `
                    <div class="subject-item">
                        <h4>${sub.name}</h4>
                        <ul>
                            ${sub.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });
        } else {
            subjectsHtml = '<p>暂无科目作业记录。</p>';
        }

        // 渲染报纸风格模板
        homeworkContainer.innerHTML = `
            <div class="news-header">
                <h2>每日头疼</h2>
                <h3>The Daily Headache - ${className}</h3>
                <div class="date">${data.date}</div>
            </div>
            <div class="news-body">
                <div class="news-column-left">
                    ${subjectsHtml}
                </div>
                <div class="news-column-right">
                    <div class="news-image-placeholder">
                        [SFLS 校徽 / 图片区域]
                    </div>
                    <div class="news-note">
                        ${data.note}
                    </div>
                </div>
            </div>
        `;
    }

    subNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const className = btn.getAttribute('data-class');
            renderHomework(className);
        });
    });

    // 初始渲染 111A 的作业
    renderHomework('111A');

    // 3. 渲染通知栏时间线
    const noticesList = document.getElementById('notices-list');
    let noticesHtml = '';
    
    noticesData.forEach((notice, index) => {
        // 左右交替布局
        const sideClass = index % 2 === 0 ? 'left' : 'right';
        noticesHtml += `
            <div class="timeline-item ${sideClass}">
                <div class="timeline-content">
                    <span class="time">${notice.time}</span>
                    <h4>${notice.title}</h4>
                    <p>${notice.content}</p>
                </div>
            </div>
        `;
    });
    
    noticesList.innerHTML = noticesHtml;
});
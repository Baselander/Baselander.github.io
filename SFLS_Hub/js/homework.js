// ============================================
// 作业页逻辑 — 读取 JSON 并渲染
// ============================================

let homeworkData = null;
let currentClass = '111A';

// 加载作业数据
async function loadHomework() {
  try {
    const res = await fetch('data/homework.json');
    homeworkData = await res.json();
    renderHomework(currentClass);
  } catch (err) {
    console.error('加载作业数据失败:', err);
    document.getElementById('homework-content').innerHTML =
      '<p>Failed to load homework data.</p>';
  }
}

// 渲染指定班级的作业
function renderHomework(className) {
  const data = homeworkData[className];
  if (!data) {
    document.getElementById('homework-content').innerHTML =
      '<p>No homework data for this class.</p>';
    return;
  }

  const subjectsHtml = data.subjects.map(sub => `
    <div class="subject-block">
      <div class="subject-name">${sub.name}</div>
      <ul class="subject-tasks">
        ${sub.tasks.map(task => `<li>${task}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  document.getElementById('homework-content').innerHTML = `
    <div class="news-header">
      <div class="news-header-date">${data.date}</div>
      <div class="news-header-title">${t('homework.title')}</div>
      <div class="news-header-subtitle">Class ${className}</div>
    </div>
    ${subjectsHtml}
    <div class="news-footer">
      <p>${t('footer.copyright')}</p>
      <p>${t('footer.suggestion')}</p>
    </div>
  `;
}

// 班级切换
document.addEventListener('DOMContentLoaded', () => {
  loadHomework();

  document.querySelectorAll('.class-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.class-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentClass = tab.dataset.class;
      renderHomework(currentClass);
    });
  });
});

// 语言切换时重新渲染
window.addEventListener('languageChanged', () => {
  if (homeworkData) renderHomework(currentClass);
});
// notifications 页面专用脚本

async function loadNotifications() {
  try {
    const res = await fetch('data/notifications.json');
    const data = await res.json();
    const list = document.getElementById('notif-list');
    list.innerHTML = data
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(n => `
        <div class="notif-item">
          <div class="notif-date">${n.date}</div>
          <div class="notif-title">${n.title}</div>
          <div class="notif-body">${n.body}</div>
        </div>
      `).join('');
  } catch (err) {
    console.error('加载通知失败:', err);
    document.getElementById('notif-list').innerHTML = '<p>Failed to load notifications.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadNotifications);
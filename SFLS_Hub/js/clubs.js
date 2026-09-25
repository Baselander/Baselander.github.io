// ============================================
// 社团列表逻辑 — 加载、搜索
// ============================================

let clubsData = [];

async function loadClubs() {
  try {
    const res = await fetch('data/clubs.json');
    clubsData = await res.json();
    renderClubs(clubsData);
  } catch (err) {
    console.error('加载社团数据失败:', err);
  }
}

function renderClubs(data) {
  const grid = document.getElementById('club-grid');
  if (!grid) return;

  if (data.length === 0) {
    grid.innerHTML = '<p style="color: var(--sfls-text-secondary);">No clubs found.</p>';
    return;
  }

  grid.innerHTML = data.map(club => `
    <a href="club-detail.html?id=${club.id}" class="club-card">
      <div class="club-card-poster">
        ${club.poster ? `<img src="${club.poster}" alt="${club.name}" style="width:100%;height:100%;object-fit:cover;">` : '🏛️'}
      </div>
      <div class="club-card-body">
        <div class="club-card-name">${club.name}</div>
        <div class="club-card-desc">${club.description}</div>
        <div class="club-card-meta">
          <span>📧 ${club.contact}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// 搜索功能
document.addEventListener('DOMContentLoaded', () => {
  loadClubs();
  const searchInput = document.getElementById('club-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = clubsData.filter(c =>
        c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
      renderClubs(filtered);
    });
  }
});
// club-detail 页面专用脚本

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get('id');
  if (!clubId) return;

  const res = await fetch('data/clubs.json');
  const clubs = await res.json();
  const club = clubs.find(c => c.id === clubId);
  if (!club) return;

  document.getElementById('club-detail').innerHTML = `
    <div class="club-detail-header">
      <div class="club-detail-poster">${club.poster ? `<img src="${club.poster}" style="width:100%;height:100%;object-fit:cover;">` : '🏛️'}</div>
      <div class="club-detail-name">${club.name}</div>
      <div class="club-detail-info">
        <p><strong>${t('clubs.contact')}:</strong> ${club.contact}</p>
        <p><strong>${t('clubs.activities')}:</strong> ${club.activities}</p>
        <p style="margin-top:12px;">${club.description}</p>
      </div>
    </div>
  `;

  initComments(clubId);
});
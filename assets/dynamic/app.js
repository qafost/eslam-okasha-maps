// ===== حالة المكتب =====
function checkStoreStatus() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const dot = document.querySelector('.status-dot');
  const label = document.getElementById('status-label');
  const text = document.getElementById('time-text');

  let isOpen = false;

  if (day === 0) {
    isOpen = false;
  } else if (day === 5) {
    if (hour >= 9 && hour < 21) isOpen = true;
  } else {
    if (hour >= 10 && hour < 22) isOpen = true;
  }

  if (isOpen) {
    dot.className = 'status-dot open';
    label.textContent = 'مفتوح الآن';
    text.textContent = 'نحن في انتظاركم';
  } else {
    dot.className = 'status-dot closed';
    label.textContent = 'مغلق الآن';
    text.textContent = day === 0 ? 'الأحد: إجازة أسبوعية' : 'مغلق حالياً';
  }
}

// ===== نسخ رقم الهاتف =====
function copyNumber(n) {
  navigator.clipboard.writeText(n);
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  checkStoreStatus();
  setInterval(checkStoreStatus, 60000);
});

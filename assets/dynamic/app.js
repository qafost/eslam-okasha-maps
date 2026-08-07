// ===== حالة المكتب المباشرة =====
function checkStoreStatus() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0:أحد, 1:اثنين ... 5:جمعة, 6:سبت
  
  const dot = document.querySelector('.dot');
  const label = document.getElementById('status-label');
  const text = document.getElementById('time-text');
  
  let isOpen = false;

  // المنطق: الأحد مغلق، الاثنين للسبت عمل.
  if (day === 0) {
    isOpen = false;
  } else if (day === 5) { // الجمعة: 9ص - 9م
    if (hour >= 9 && hour < 21) isOpen = true;
  } else { // باقي الأيام: 10ص - 10م
    if (hour >= 10 && hour < 22) isOpen = true;
  }

  if (isOpen) {
    dot.className = 'dot open';
    label.innerText = 'مفتوح الآن';
    text.innerText = 'نحن في انتظاركم الآن';
  } else {
    dot.className = 'dot closed';
    label.innerText = 'مغلق الآن';
    text.innerText = day === 0 ? 'نعتذر، إجازتنا الأسبوعية اليوم' : 'نحن مغلقون حالياً';
  }
}

// ===== نسخ رقم الهاتف =====
function copyNumber(n) {
  navigator.clipboard.writeText(n);
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ===== عدادات الإحصائيات المتحركة =====
function animateStats() {
  const stats = document.querySelectorAll('.stat-number:not(#tg-subscribers)');
  
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      stat.textContent = current.toLocaleString('ar-EG');
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target.toLocaleString('ar-EG');
      }
    }
    
    requestAnimationFrame(updateNumber);
  });
}

// ===== جلب معلومات قناة تليجرام =====
// ⚠️ مهم: استبدل YOUR_BOT_TOKEN بالتوكن الحقيقي من @BotFather
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHANNEL = '@EslamOkashaLingerie';

async function fetchTelegramChannelInfo() {
  const tgElement = document.getElementById('tg-subscribers');
  if (!tgElement) return;
  
  // إذا لم يتم وضع التوكن، استخدم قيمة افتراضية
  if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    tgElement.textContent = '46,862';
    return;
  }
  
  try {
    // 1️⃣ جلب معلومات القناة (الاسم، الوصف، عدد المشتركين)
    const chatResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${TELEGRAM_CHANNEL}`);
    const chatData = await chatResponse.json();
    
    // 2️⃣ جلب عدد المشتركين
    const countResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=${TELEGRAM_CHANNEL}`);
    const countData = await countResponse.json();
    
    if (chatData.ok && countData.ok) {
      const channelInfo = chatData.result;
      const subscriberCount = countData.result;
      
      // عرض عدد المشتركين
      tgElement.textContent = subscriberCount.toLocaleString('ar-EG');
      
      // يمكنك أيضاً استخدام معلومات القناة:
      // channelInfo.title - اسم القناة
      // channelInfo.description - وصف القناة
      // channelInfo.username - اسم المستخدم
      console.log('📢 معلومات القناة:', {
        name: channelInfo.title,
        description: channelInfo.description,
        subscribers: subscriberCount
      });
    } else {
      // رسالة خطأ من API
      console.error('خطأ في جلب معلومات القناة:', chatData.description || countData.description);
      tgElement.textContent = 'غير متاح';
    }
  } catch (error) {
    console.error('خطأ في الاتصال بتليجرام:', error);
    tgElement.textContent = 'غير متاح';
  }
}

// ===== تأثير الظهور عند التمرير =====
function setupScrollReveal() {
  const cards = document.querySelectorAll('.featured-card, .stat-item, .bento-btn, .hours-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// ===== تأثير نبض على شارة الرئيسي =====
function setupPulseEffect() {
  const branchTags = document.querySelectorAll('.branch-tag');
  branchTags.forEach(tag => {
    tag.style.animation = 'pulse 2s ease-in-out infinite';
  });
}

// ===== تأثير اهتزاز خفيف على أيقونات التواصل =====
function setupIconHover() {
  const socialBtns = document.querySelectorAll('.bento-btn');
  socialBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(10deg)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    btn.addEventListener('mouseleave', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
}

// ===== تفعيل عند التحميل =====
document.addEventListener('DOMContentLoaded', () => {
  checkStoreStatus();
  // تحديث الحالة كل دقيقة
  setInterval(checkStoreStatus, 60000);
  
  // تفعيل التأثيرات الديناميكية
  animateStats();
  fetchTelegramChannelInfo();
  setupScrollReveal();
  setupPulseEffect();
  setupIconHover();
});
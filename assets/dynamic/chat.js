// /**
//  * شات المكتب — يرد فقط على استفسارات المكتب
//  * mode: 'local' = ردود جاهزة | 'api' = ذكاء اصطناعي عبر السيرفر
//  */
// const CHAT_CONFIG = {
//   mode: 'api',
//   apiUrl: 'http://localhost:3001/api/chat',
//   officeOnly: true,
// };

// const OFFICE_KNOWLEDGE = {
//   name: 'مكتب إسلام عكاشة',
//   type: 'تجارة جملة لينجيري',
//   hours: {
//     weekdays: 'من الاثنين إلى السبت: 10 ص – 10 م',
//     friday: 'الجمعة: 9 ص – 9 م',
//     sunday: 'الأحد: إجازة',
//   },
//   branches: [
//     {
//       name: 'المقر الرئيسي (الموسكي)',
//       address: 'القاهرة، العتبة — شارع الموسكي الرئيسي',
//       phone: '01000000000',
//     },
//     {
//       name: 'إسلام عكاشة — عمارت فروح',
//       address: '48 شارع قصر النيل، ميدان مصطفى كامل (الدور الثاني) — و27 شارع الشواذلية، الموسكي',
//       phone: '01100000000',
//     },
//   ],
//   whatsapp: '201000000000',
//   telegram: 'https://t.me/EslamOkashaLingerie',
//   facebook: 'https://facebook.com/EslamOkashaOfficial',
//   instagram: 'https://instagram.com/EslamOkasha',
//   tiktok: 'https://tiktok.com/@EslamOkasha',
// };

// const QUICK_QUESTIONS = [
//   'مواعيد العمل؟',
//   'أين الفروع؟',
//   'رقم الواتساب',
//   'هل المكتب مفتوح؟',
// ];

// const OFF_TOPIC_REPLY =
//   'عذراً، أنا مساعد مخصص لاستفسارات مكتب إسلام عكاشة فقط (مواعيد، فروع، تواصل، جملة).\n' +
//   'للأسئلة الأخرى تواصل معنا على واتساب: ' + OFFICE_KNOWLEDGE.whatsapp;

// /** كلمات مفتاحية مسموح بها — أي سؤال لا يطابقها يُرفض */
// const OFFICE_KEYWORDS = [
//   'موعد', 'مواع', 'ساع', 'وقت', 'امتى', 'متى', 'يفتح', 'تقفل', 'مفتوح', 'مقفول', 'شغال', 'فاتح', 'إجاز',
//   'فرع', 'فروع', 'عنوان', 'مكان', 'موقع', 'موسك', 'عتب', 'فروح', 'وسط', 'قاهر',
//   'واتس', 'whatsapp', 'واتساب', 'تليجر', 'telegram', 'تلجر', 'فيس', 'facebook',
//   'انست', 'instagram', 'تيك', 'tiktok', 'سوش', 'تواصل', 'اتصال', 'تليف', 'هاتف', 'رقم',
//   'سعر', 'اسعار', 'كم', 'تكلف', 'جمل', 'minimum', 'حد', 'طلب', 'اوردر', 'شحن', 'توصيل',
//   'لينج', 'lingerie', 'موديل', 'مقاس', 'كatalog', 'كتalog', 'كتال',
//   'مكتب', 'عكاش', 'okasha', 'eslam', 'إسلام', 'اسلام',
//   'مرح', 'السلام', 'اهلا', 'أهلا', 'هاي', 'hello', 'صباح', 'مساء', 'ازيك', 'إزيك',
//   'مساعد', 'سؤال', 'استفس', 'help',
// ];

// function normalize(text) {
//   return text.trim().toLowerCase().replace(/\s+/g, ' ');
// }

// function isOfficeRelated(message) {
//   const q = normalize(message);
//   if (!q) return false;
//   return OFFICE_KEYWORDS.some(keyword => q.includes(keyword));
// }

// function getStoreStatus() {
//   const now = new Date();
//   const hour = now.getHours();
//   const day = now.getDay();

//   if (day === 0) return { open: false, text: 'مغلق — إجازة أسبوعية (الأحد)' };
//   if (day === 5) {
//     return hour >= 9 && hour < 21
//       ? { open: true, text: 'مفتوح الآن (الجمعة 9 ص – 9 م)' }
//       : { open: false, text: 'مغلق — مواعيد الجمعة 9 ص – 9 م' };
//   }
//   return hour >= 10 && hour < 22
//     ? { open: true, text: 'مفتوح الآن (10 ص – 10 م)' }
//     : { open: false, text: 'مغلق — مواعيد العمل 10 ص – 10 م' };
// }

// function localReply(message) {
//   const q = normalize(message);
//   const status = getStoreStatus();

//   if (/مواع|ساع|وقت|امتى|متى|يفتح|تقفل/.test(q)) {
//     return `مواعيد ${OFFICE_KNOWLEDGE.name}:\n• ${OFFICE_KNOWLEDGE.hours.weekdays}\n• ${OFFICE_KNOWLEDGE.hours.friday}\n• ${OFFICE_KNOWLEDGE.hours.sunday}`;
//   }

//   if (/مفتوح|مقفول|شغال|فاتح/.test(q)) {
//     return status.open
//       ? `نعم، ${status.text} ✅`
//       : `لا، ${status.text}. يمكنك مراسلتنا على واتساب وسنرد في أقرب وقت.`;
//   }

//   if (/فرع|فروع|عنوان|مكان|موقع|موسك|عتب|فروح|وسط/.test(q)) {
//     return OFFICE_KNOWLEDGE.branches
//       .map((b, i) => `${i + 1}. ${b.name}\n   📍 ${b.address}\n   📞 ${b.phone}`)
//       .join('\n\n');
//   }

//   if (/واتس|whatsapp|واتساب/.test(q)) {
//     return `رقم الواتساب: ${OFFICE_KNOWLEDGE.whatsapp}\nاضغط زر "تواصل على واتساب" في الصفحة أو راسلنا مباشرة.`;
//   }

//   if (/تليجر|telegram|تلجر/.test(q)) {
//     return `قناتنا على تليجرام:\n${OFFICE_KNOWLEDGE.telegram}`;
//   }

//   if (/فيس|facebook|انست|instagram|تيك|tiktok|سوش|تواصل/.test(q)) {
//     return `وسائل التواصل:\n• واتساب: ${OFFICE_KNOWLEDGE.whatsapp}\n• تليجرام: ${OFFICE_KNOWLEDGE.telegram}\n• فيسبوك: ${OFFICE_KNOWLEDGE.facebook}\n• انستجرام: ${OFFICE_KNOWLEDGE.instagram}`;
//   }

//   if (/سعر|اسعار|كم|تكلف|جمل|minimum|حد/.test(q)) {
//     return 'أسعار الجملة تختلف حسب الموديل والكمية. للأسعار الحالية تواصل معنا على واتساب أو زُر أقرب فرع.';
//   }

//   if (/مرح|السلام|اهلا|أهلا|هاي|hello|صباح|مساء|ازيك|إزيك/.test(q)) {
//     return `أهلاً بك في ${OFFICE_KNOWLEDGE.name}! 👋\nاسأل عن مواعيد العمل، الفروع، أو التواصل.`;
//   }

//   return OFF_TOPIC_REPLY;
// }

// async function apiReply(message) {
//   chatHistory.push({ role: 'user', content: message });

//   const res = await fetch(CHAT_CONFIG.apiUrl, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ messages: chatHistory }),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.error || 'فشل الاتصال بالسيرفر');
//   }

//   const data = await res.json();
//   const reply = data.reply || data.message || 'لم أتمكن من الرد، حاول مرة أخرى.';
//   chatHistory.push({ role: 'assistant', content: reply });
//   return reply;
// }

// function getReply(message) {
//   if (CHAT_CONFIG.officeOnly && !isOfficeRelated(message)) {
//     return OFF_TOPIC_REPLY;
//   }

//   if (CHAT_CONFIG.mode === 'api') {
//     return apiReply(message);
//   }

//   return Promise.resolve(localReply(message));
// }

// let chatHistory = [];
// let chatOpen = false;
// let isLoading = false;

// function addMessage(text, type) {
//   const box = document.getElementById('chat-messages');
//   const el = document.createElement('div');
//   el.className = `chat-msg chat-msg--${type}`;
//   el.textContent = text;
//   box.appendChild(el);
//   box.scrollTop = box.scrollHeight;
// }

// function setLoading(on) {
//   isLoading = on;
//   document.getElementById('chat-send').disabled = on;
//   document.getElementById('chat-input').disabled = on;

//   const existing = document.getElementById('chat-typing');
//   if (on && !existing) {
//     const typing = document.createElement('div');
//     typing.id = 'chat-typing';
//     typing.className = 'chat-msg chat-msg--bot chat-typing';
//     typing.innerHTML = '<span></span><span></span><span></span>';
//     document.getElementById('chat-messages').appendChild(typing);
//   } else if (!on && existing) {
//     existing.remove();
//   }
// }

// async function sendMessage(text) {
//   const message = text.trim();
//   if (!message || isLoading) return;

//   addMessage(message, 'user');
//   document.getElementById('chat-input').value = '';
//   setLoading(true);

//   try {
//     const reply = await getReply(message);
//     if (CHAT_CONFIG.mode === 'local') {
//       await new Promise(r => setTimeout(r, 350));
//     }
//     setLoading(false);
//     addMessage(reply, 'bot');
//   } catch (e) {
//     setLoading(false);
//     addMessage(`⚠️ ${e.message}\n\nتأكد أن السيرفر شغال وراجع README.md`, 'bot');
//   }
// }

// function toggleChat(force) {
//   chatOpen = force !== undefined ? force : !chatOpen;
//   const panel = document.getElementById('chat-panel');
//   const fab = document.getElementById('chat-fab');
//   panel.classList.toggle('chat-panel--open', chatOpen);
//   panel.setAttribute('aria-hidden', chatOpen ? 'false' : 'true');
//   fab.classList.toggle('chat-fab--hidden', chatOpen);
//   if (chatOpen) document.getElementById('chat-input').focus();
// }

// function initChat() {
//   const modeLabel = document.getElementById('chat-mode-label');
//   if (modeLabel) {
//     modeLabel.textContent = 'استفسارات المكتب — ذكاء اصطناعي';
//   }

//   checkAiConnection();

//   const quick = document.getElementById('chat-quick');
//   QUICK_QUESTIONS.forEach(q => {
//     const chip = document.createElement('button');
//     chip.type = 'button';
//     chip.className = 'chat-chip';
//     chip.textContent = q;
//     chip.addEventListener('click', () => sendMessage(q));
//     quick.appendChild(chip);
//   });

//   document.getElementById('chat-fab').addEventListener('click', () => toggleChat(true));
//   document.getElementById('chat-close').addEventListener('click', () => toggleChat(false));
//   document.getElementById('chat-form').addEventListener('submit', e => {
//     e.preventDefault();
//     sendMessage(document.getElementById('chat-input').value);
//   });

//   addMessage(
//     `أهلاً! أنا مساعد ${OFFICE_KNOWLEDGE.name} (ذكاء اصطناعي).\n` +
//     'أقدر أساعدك في: مواعيد العمل، الفروع، التواصل، وأسعار الجملة.\n' +
//     'أسئلة خارج نطاق المكتب مش هقدر أرد عليها.',
//     'bot'
//   );
// }

// async function checkAiConnection() {
//   if (CHAT_CONFIG.mode !== 'api') return;

//   try {
//     const res = await fetch('/health');
//     const data = await res.json();
//     if (!data.aiReady) {
//       addMessage(
//         '⚠️ الذكاء الاصطناعي غير مفعّل بعد.\n' +
//         'ضع مفتاح API في server/.env ثم أعد تشغيل: npm start\n' +
//         '(OpenAI أو Gemini — راجع README.md)',
//         'bot'
//       );
//     }
//   } catch {
//     addMessage(
//       '⚠️ افتح الموقع من السيرفر:\n' +
//       'cd server && npm start\n' +
//       'ثم افتح http://localhost:3001',
//       'bot'
//     );
//   }
// }

// document.addEventListener('DOMContentLoaded', initChat);

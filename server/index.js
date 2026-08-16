require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const SITE_ROOT = path.join(__dirname, '..');

const WHATSAPP = '201000000000';

const OFFICE_KEYWORDS = [
  'موعد', 'مواع', 'ساع', 'وقت', 'امتى', 'متى', 'يفتح', 'تقفل', 'مفتوح', 'مقفول', 'شغال', 'فاتح', 'إجاز',
  'فرع', 'فروع', 'عنوان', 'مكان', 'موقع', 'موسك', 'عتب', 'فروح', 'وسط', 'قاهر',
  'واتس', 'whatsapp', 'واتساب', 'تليجر', 'telegram', 'تلجر', 'فيس', 'facebook',
  'انست', 'instagram', 'تيك', 'tiktok', 'سوش', 'تواصل', 'اتصال', 'تليف', 'هاتف', 'رقم',
  'سعر', 'اسعار', 'كم', 'تكلف', 'جمل', 'minimum', 'حد', 'طلب', 'اوردر', 'شحن', 'توصيل',
  'لينج', 'lingerie', 'موديل', 'مقاس', 'كتalog', 'كتال',
  'مكتب', 'عكاش', 'okasha', 'eslam', 'إسلام', 'اسلام',
  'مرح', 'السلام', 'اهلا', 'أهلا', 'هاي', 'hello', 'صباح', 'مساء', 'ازيك', 'إزيك',
  'مساعد', 'سؤال', 'استفس', 'help',
];

const OFF_TOPIC_REPLY =
  `عذراً، أنا مساعد مخصص لاستفسارات مكتب إسلام عكاشة فقط (مواعيد، فروع، تواصل، جملة).\n` +
  `للأسئلة الأخرى تواصل معنا على واتساب: ${WHATSAPP}`;

function isOfficeRelated(text) {
  const q = String(text).trim().toLowerCase();
  if (!q) return false;
  return OFFICE_KEYWORDS.some(k => q.includes(k));
}

const OFFICE_SYSTEM_PROMPT = `أنت مساعد "مكتب إسلام عكاشة" — تجارة جملة لينجيري في القاهرة (العتبة ووسط البلد).
قواعد صارمة — لا تخالفها أبداً:
1. أجب فقط عن: مواعيد العمل، الفروع، التواصل، أسعار الجملة، المنتجات المتعلقة بالمكتب.
2. ممنوع الإجابة عن: السياسة، الرياضة، البرمجة، الطب، الدين، أخبار، أو أي موضوع خارج المكتب.
3. إذا السؤال خارج النطاق، قل بالضبط: "عذراً، أنا مساعد مخصص لاستفسارات مكتب إسلام عكاشة فقط. للأسئلة الأخرى تواصل على واتساب: ${WHATSAPP}"
4. لا تخترع معلومات — استخدم فقط البيانات أدناه.
5. رد بالعربية باختصار (3-5 جمل كحد أقصى).

معلومات المكتب:
- الاثنين–السبت: 10 ص – 10 م | الجمعة: 9 ص – 9 م | الأحد: إجازة
- المقر الرئيسي (الموسكي): العتبة، شارع الموسكي — 01000000000
- عمارت فروح: 48 شارع قصر النيل + 27 شارع الشواذلية — 01100000000
- واتساب: ${WHATSAPP} | تليجرام: https://t.me/EslamOkashaLingerie`;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '32kb' }));

app.get('/health', (_req, res) => {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const hasKey =
    (provider === 'openai' && !!process.env.OPENAI_API_KEY) ||
    (provider === 'gemini' && !!process.env.GEMINI_API_KEY);

  res.json({
    ok: true,
    provider,
    aiReady: hasKey,
  });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages مطلوبة' });
  }

  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  if (lastUser && !isOfficeRelated(lastUser.content)) {
    return res.json({ reply: OFF_TOPIC_REPLY });
  }

  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

  try {
    let reply;

    if (provider === 'openai') {
      reply = await callOpenAI(messages);
    } else if (provider === 'gemini') {
      reply = await callGemini(messages);
    } else {
      return res.status(500).json({ error: `مزود غير مدعوم: ${provider}` });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message || 'خطأ في الذكاء الاصطناعي' });
  }
});

async function callOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY غير موجود في .env');

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: OFFICE_SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      max_tokens: 400,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI error');
  return data.choices[0].message.content.trim();
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY غير موجود في .env');

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const contents = messages.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: OFFICE_SYSTEM_PROMPT }] },
      contents,
      generationConfig: { maxOutputTokens: 400, temperature: 0.5 },
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini error');
  return data.candidates[0].content.parts[0].text.trim();
}

// الموقع + API على نفس البورت (بدون مشاكل CORS)
app.use(express.static(SITE_ROOT));

app.get('*', (_req, res) => {
  res.sendFile(path.join(SITE_ROOT, 'index.html'));
});

app.listen(PORT, () => {
  const provider = process.env.AI_PROVIDER || 'openai';
  const hasKey =
    (provider === 'openai' && process.env.OPENAI_API_KEY) ||
    (provider === 'gemini' && process.env.GEMINI_API_KEY);

  console.log(`\n  الموقع + الشات → http://localhost:${PORT}`);
  console.log(`  AI Provider: ${provider}`);
  console.log(`  AI Ready: ${hasKey ? 'نعم ✓' : 'لا — ضع API Key في server/.env'}\n`);
});

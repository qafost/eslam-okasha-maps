# مكتب إسلام عكاشة — موقع + شات ذكي

موقع تعريفي بسيط لمكتب الجملة، مع **شات صغير** يرد على استفسارات العملاء (مواعيد، فروع، تواصل).

---

## محتويات المشروع

```
eslam-eo/
├── index.html              ← الصفحة الرئيسية
├── assets/
│   ├── styling/main.css    ← التصميم + شكل الشات
│   ├── dynamic/
│   │   ├── app.js          ← حالة المكتب والتوست
│   │   └── chat.js         ← الشات (محلي أو AI)
│   └── images/logo.jpg
└── server/                 ← سيرفر الربط بالذكاء الاصطناعي
    ├── index.js
    ├── package.json
    └── .env.example
```

---

## الشات — وضعان

| الوضع | الوصف | متى تستخدمه |
|-------|--------|-------------|
| `local` | ردود جاهزة بدون AI | تجربة فورية، بدون تكلفة |
| `api` | ذكاء اصطناعي حقيقي | للإنتاج — يحتاج سيرفر |

### تفعيل الوضع المحلي (افتراضي)

في `assets/dynamic/chat.js`:

```js
const CHAT_CONFIG = {
  mode: 'local',
  apiUrl: '/api/chat',
};
```

افتح `index.html` — زر الشات أسفل يسار الشاشة.

---

## ربط الشات بذكاء اصطناعي حقيقي

> **مهم:** لا تضع مفتاح API في `chat.js` أو أي ملف frontend. أي شخص يفتح الموقع يقدر يسرقه.  
> الحل: **سيرفر وسيط (proxy)** يستقبل الرسائل ويتصل بـ OpenAI أو Gemini.

### الخطوة 1 — احصل على مفتاح API

**OpenAI (موصى به للبداية):**
1. سجّل على [platform.openai.com](https://platform.openai.com)
2. من **API Keys** أنشئ مفتاح جديد
3. ضع رصيد (Billing) — `gpt-4o-mini` رخيص للشات

**Google Gemini (بديل مجاني محدود):**
1. من [aistudio.google.com](https://aistudio.google.com) احصل على API Key

---

### الخطوة 2 — شغّل السيرفر

```bash
cd server
cp .env.example .env
# عدّل .env وضع مفتاحك
npm install
npm start
```

مثال `.env`:

```env
PORT=3001
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxxxxx
OPENAI_MODEL=gpt-4o-mini
ALLOWED_ORIGIN=*
```

تأكد أن السيرفر شغال:

```bash
curl http://localhost:3001/health
# {"ok":true,"provider":"openai"}
```

---

### الخطوة 3 — فعّل وضع AI في الموقع

في `assets/dynamic/chat.js`:

```js
const CHAT_CONFIG = {
  mode: 'api',ff
  apiUrl: 'http://localhost:3001/api/chat',  // محلي للتجربة
};
```

للإنتاج غيّر الرابط لرابط السيرفر الحقيقي:

```js
apiUrl: 'https://your-domain.com/api/chat',
```

---

### الخطوة 4 — انشر السيرفر

#### خيار A: VPS (DigitalOcean, Hetzner, …)

```bash
# على السيرفر
git clone <repo>
cd eslam-eo/server
npm install
cp .env.example .env
nano .env          # ضع المفتاح
npm install -g pm2
pm2 start index.js --name chat-api
pm2 save
```

استخدم **Nginx** كـ reverse proxy:

```nginx
location /api/chat {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

#### خيار B: Render / Railway (مجاني للبداية)

1. ارفع مجلد `server/` فقط
2. Start command: `node index.js`
3. Environment variables من `.env.example`
4. انسخ رابط الخدمة في `CHAT_CONFIG.apiUrl`

#### خيار C: Vercel Serverless

أنشئ `server/api/chat.js` كـ serverless function — أو استخدم VPS للبساطة.

---

## تخصيص معلومات المكتب للـ AI

### في الوضع المحلي

عدّل `OFFICE_KNOWLEDGE` في `assets/dynamic/chat.js`.

### في وضع AI

عدّل `OFFICE_SYSTEM_PROMPT` في:
- `server/index.js` — للسيرفر
- `SYSTEM_PROMPT` في `chat.js` — للمرجع فقط

أضف: أسعار تقريبية، سياسة الاستبدال، طرق الشحن، إلخ.

---

## استخدام Gemini بدل OpenAI

في `.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash
```

---

## الأمان (Production)

1. **لا تكشف API Key** في frontend أبداً
2. **`ALLOWED_ORIGIN`**: ضع رابط موقعك فقط، ليس `*`
3. **Rate limiting**: أضف حد للطلبات (مثلاً 20 رسالة/دقيقة/IP)
4. **HTTPS** إلزامي للإنتاج

---

## اختبار سريع

```bash
# 1. شغّل السيرفر
cd server && npm start

# 2. جرّب API مباشرة
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"مواعيد العمل؟"}]}'
```

---

## الأسئلة الشائعة

**ليه محتاج سيرفر؟**  
OpenAI/Gemini يتطلبوا مفتاح سري. السيرفر يخفي المفتاح ويرسل فقط الرد للموقع.

**هل الوضع المحلي كافي؟**  
للأسئلة المتكررة (مواعيد، فروع) — نعم. للأسئلة المعقدة والمتنوعة — استخدم AI.

**التكلفة؟**  
`gpt-4o-mini`: تقريباً $0.15 لكل مليون token input — شات صغير = تكلفة قليلة جداً.

---

## الدعم

للاستفسارات التجارية: واتساب `201000000000` — تليجرام [@EslamOkashaLingerie](https://t.me/EslamOkashaLingerie)

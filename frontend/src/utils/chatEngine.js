/**
 * ============================================================
 *  BLUCONNET AI ASSISTANT ENGINE  v2.0
 * ============================================================
 *  A lightweight, dependency-free NLP engine that powers the
 *  24/7 website assistant. Features:
 *   - Intent detection (weighted keyword scoring + fuzzy match)
 *   - Context memory & follow-up handling
 *   - Multi-language (en/hi/de/fr/it/pt/es) with auto-detection
 *   - Multi-step conversational flows (Lead, Meeting, Apply, Handoff)
 *   - Entity extraction (email, phone, dates)
 *   - Anti-hallucination guardrails (never invents pricing/policies)
 * ============================================================
 */

/* ------------------------------------------------------------------ */
/*  MULTILINGUAL CHAT PACKS (de / fr / it / pt / es)                    */
/*  Live as ESM modules in src/i18n/chat/ — imported natively so the   */
/*  translations below are available in every supported language.      */
/* ------------------------------------------------------------------ */
import { CHAT_PACKS } from "../i18n/chat/index.js";

/* ------------------------------------------------------------------ */
/*  COMPANY KNOWLEDGE BASE                                             */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  COMPANY KNOWLEDGE BASE                                             */
/* ------------------------------------------------------------------ */

const COMPANY = {
  name: "BluConnet Media",
  shortName: "BluConnet",
  email: "info@bluconnetmedia.com",
  supportEmail: "support@bluconnetmedia.com",
  careersEmail: "careers@bluconnetmedia.com",
  phone: "+91 98765 43210",
  website: "https://www.bluconnetmedia.com",
  linkedin: "https://www.linkedin.com/company/bluconnetmedia/",
  hours: {
    weekdays: "Monday – Friday: 9:00 AM – 7:00 PM (IST)",
    saturday: "Saturday: 10:00 AM – 4:00 PM (IST)",
    sunday: "Sunday: Closed",
  },
  locations: {
    india: { city: "Kolkata", mode: "Work From Office", flag: "🇮🇳" },
    uk: { city: "United Kingdom", mode: "Remote", flag: "🇬🇧" },
    us: { city: "United States", mode: "Remote", flag: "🇺🇸" },
  },
};

const SERVICES = [
  {
    id: "seo",
    name: "SEO & Search Marketing",
    icon: "🔍",
    detail:
      "Our **SEO** services help you rank higher and grow organic traffic:\n\n• Keyword research & competitor analysis\n• On-page & technical optimization\n• High-authority link building\n• Local SEO & Google Business Profile\n• Monthly performance reports\n\nWould you like a **free SEO audit** of your website?",
  },
  {
    id: "social",
    name: "Social Media Marketing",
    icon: "📱",
    detail:
      "Our **Social Media Marketing** covers:\n\n• Strategy & content calendars\n• Creative design & reels\n• Community management\n• Paid social campaigns (Meta, LinkedIn)\n• Monthly growth analytics\n\nWhich platform matters most to you — Instagram, LinkedIn, or Facebook?",
  },
  {
    id: "web",
    name: "Website Design & Development",
    icon: "💻",
    detail:
      "We build fast, conversion-focused websites:\n\n• Business & corporate websites\n• E-commerce stores\n• Landing pages that convert\n• React / modern tech stacks\n• Speed, SEO & mobile-first builds\n\nWould you like to **start a project** with us?",
  },
  {
    id: "content",
    name: "Content Marketing",
    icon: "✍️",
    detail:
      "Our **Content Marketing** services include:\n\n• Blog & article writing\n• Website copywriting\n• Case studies & whitepapers\n• Video scripts & infographics\n• Content strategy & calendars\n\nGreat content = better SEO + more trust. Want to know how we can help your brand?",
  },
  {
    id: "email",
    name: "Email Marketing",
    icon: "📧",
    detail:
      "Our **Email Marketing** services:\n\n• Campaign strategy & design\n• Automated drip sequences\n• Newsletter management\n• A/B testing & optimization\n• Detailed performance reports\n\nEmail still delivers the **highest ROI** in digital marketing. Want to set up a campaign?",
  },
  {
    id: "ppc",
    name: "PPC & Performance Marketing",
    icon: "🎯",
    detail:
      "Our **PPC / Performance Marketing** covers:\n\n• Google Ads & Bing Ads\n• Meta & LinkedIn paid campaigns\n• Retargeting & remarketing\n• Landing page CRO\n• ROAS-focused optimization\n\nWe focus on **measurable returns**, not just clicks. Want a proposal?",
  },
  {
    id: "affiliate",
    name: "Affiliate Marketing",
    icon: "🤝",
    detail:
      "Our **Affiliate Marketing** services:\n\n• Affiliate program setup & management\n• Publisher/partner recruitment\n• Commission structure design\n• Fraud monitoring & reporting\n• Performance optimization\n\nWant to build a new revenue channel? Let's talk!",
  },
  {
    id: "leadgen",
    name: "Lead Generation",
    icon: "🧲",
    detail:
      "Our **Lead Generation** services:\n\n• B2B & B2C lead campaigns\n• Landing pages & funnels\n• LinkedIn & email outreach\n• Lead scoring & nurturing\n• CRM integration\n\nWant us to build a **predictable lead pipeline** for you?",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Marketing",
    icon: "🛒",
    detail:
      "Our **E-Commerce Marketing** services:\n\n• Amazon / Flipkart / Shopify growth\n• Product listing optimization\n• Marketplace ads management\n• Cart abandonment recovery\n• Sales funnel analytics\n\nReady to scale your online store?",
  },
  {
    id: "crm",
    name: "CRM & Graphic Design",
    icon: "🎨",
    detail:
      "Our **CRM & Graphic Design** services:\n\n• CRM setup & automation\n• Brand identity & logos\n• Social media creatives\n• Brochures, pitch decks & banners\n• Marketing collateral design\n\nTell us what your brand needs!",
  },
  {
    id: "analytics",
    name: "Data Analytics & Research",
    icon: "📊",
    detail:
      "Our **Data Analytics & Research** services:\n\n• GA4 & tracking setup\n• Custom dashboards\n• Market & competitor research\n• Customer behaviour analysis\n• Data-driven growth strategy\n\nLet's turn your data into decisions. Interested?",
  },
  {
    id: "mobile",
    name: "Mobile Marketing",
    icon: "📲",
    detail:
      "Our **Mobile Marketing** services:\n\n• ASO (App Store Optimization)\n• Mobile ad campaigns\n• SMS & WhatsApp marketing\n• Push notification strategy\n• App install campaigns\n\nWant to reach users on the go?",
  },
  {
    id: "ai",
    name: "AI Automation",
    icon: "🤖",
    detail:
      "Our **AI Automation** services:\n\n• AI chatbots & virtual assistants (like me! 😊)\n• Workflow automation\n• AI content pipelines\n• Predictive analytics\n• Custom GPT / LLM integrations\n\nWe build AI systems that save **100+ hours/month**. Want to explore what AI can do for your business?",
  },

];
/* ------------------------------------------------------------------ */
/*  DATE / TIME — real, runtime-generated, localized                   */
/* ------------------------------------------------------------------ */

const DATE_WORDS = {
  en: { today: "Today's date is", day: "Today is", time: "The current time is", dateTime: "The current date and time is", now: "Right now it's", at: "at", h24: false, clock: "" },
  de: { today: "Heute ist", day: "Heute ist", time: "Die aktuelle Uhrzeit ist", dateTime: "Das aktuelle Datum und die Uhrzeit sind", now: "Gerade ist es", at: "um", h24: true, clock: " Uhr" },
  fr: { today: "La date d'aujourd'hui est", day: "Aujourd'hui c'est", time: "L'heure actuelle est", dateTime: "La date et l'heure actuelles sont", now: "Actuellement il est", at: "à", h24: true, clock: "" },
  it: { today: "La data odierna è", day: "Oggi è", time: "L'ora attuale è", dateTime: "La data e l'ora attuali sono", now: "Adesso è", at: "alle", h24: true, clock: "" },
  pt: { today: "A data de hoje é", day: "Hoje é", time: "A hora atual é", dateTime: "A data e hora atuais são", now: "Agora são", at: "às", h24: true, clock: "" },
  es: { today: "La fecha de hoy es", day: "Hoy es", time: "La hora actual es", dateTime: "La fecha y hora actuales son", now: "Ahora mismo es", at: "a las", h24: true, clock: "" },
};

/* Locale-appropriate date ordering — each language gets its natural
 * day-month-year layout, built from the LIVE runtime clock. */
const DATE_FMT = {
  en: (p) => `${p.wd}, ${p.mo} ${p.d}, ${p.y}`,
  de: (p) => `${p.wd}, ${p.d}. ${p.mo} ${p.y}`,
  fr: (p) => `${p.wd} ${p.d} ${p.mo} ${p.y}`,
  it: (p) => `${p.wd} ${p.d} ${p.mo} ${p.y}`,
  pt: (p) => `${p.wd}, ${p.d} de ${p.mo} de ${p.y}`,
  es: (p) => `${p.wd}, ${p.d} de ${p.mo} de ${p.y}`,
};

const WEEKDAYS = {
  en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  de: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
  fr: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
  it: ["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],
  pt: ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],
  es: ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
};

const MONTHS = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  de: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
  fr: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
  it: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],
  pt: ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
  es: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
};

/* Multilingual triggers — English + native phrasings for all 5 other
 * supported languages, so date/time is always handled deterministically
 * (never Gemini) regardless of the language the question is asked in.
 * Keywords are chosen to avoid collisions (e.g. bare "data"/"ora"). */
const DATE_RE = /\b(todays date|today's date|current date|what date|what is the date|whats the date|date today|date is it|today date|datum|la data|a data|data odierna|data de hoje|data oggi|la fecha|fecha de hoy|datum heute|la date|date du jour|date d'aujourd)\b/i;
const DAY_RE = /\b(what day|what's the day|whats the day|which day|what day is it|day is it|what day is today|welcher tag|was für ein tag|quel jour|le jour aujourd|che giorno|giorno è oggi|que dia|día es hoy)\b/i;
const TIME_RE = /\b(current time|what time|what's the time|whats the time|time is it|time now|what time is it|present time|uhrzeit|wie spät|wie viel uhr|wieviel uhr|uhr ist es|quelle heure|heure est-il|che ora|che ore|ore sono|que horas|horas são|hora é|qué hora|hora es)\b/i;

/**
 * Deterministic current date/time answer.
 * Reads the REAL runtime clock (the user's local timezone) on every call —
 * nothing is hardcoded and this is never delegated to Gemini. processMessage()
 * always evaluates it BEFORE the Gemini fallback.
 */
function getDateTimeResponse(message, lang = "en") {
  const now = new Date();
  const L = DATE_WORDS[lang] || DATE_WORDS.en;
  const p = {
    wd: (WEEKDAYS[lang] || WEEKDAYS.en)[now.getDay()],
    mo: (MONTHS[lang] || MONTHS.en)[now.getMonth()],
    d: now.getDate(),
    y: now.getFullYear(),
  };
  const h = now.getHours();
  const min = String(now.getMinutes()).padStart(2, "0");
  // 12-hour AM/PM clock for English, 24-hour clock for the other locales
  const timeStr = L.h24
    ? String(h).padStart(2, "0") + ":" + min + (L.clock || "")
    : (h % 12 || 12) + ":" + min + " " + (h >= 12 ? "PM" : "AM");
  const dateStr = (DATE_FMT[lang] || DATE_FMT.en)(p);
  const isDate = DATE_RE.test(message);
  const isDay = DAY_RE.test(message);
  const isTime = TIME_RE.test(message);
  if (isDate && isTime) return L.dateTime + " " + dateStr + " " + L.at + " " + timeStr + ".";
  if (isDay) return L.day + " " + dateStr + ".";
  if (isDate) return L.today + " " + dateStr + ".";
  if (isTime) return L.time + " " + timeStr + ".";
  return L.now + " " + dateStr + ", " + timeStr + ".";
}

const JOBS = [
  {
    id: "seo-specialist",
    title: "SEO Specialist",
    department: "Digital Marketing",
    experience: "1–3 years",
    salary: "₹3.5 – 6 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Run end-to-end SEO campaigns for global clients",
      "Keyword research, on-page & technical audits",
      "Build white-hat link acquisition strategies",
      "Track rankings & report performance",
    ],
  },
  {
    id: "social-media-manager",
    title: "Social Media Manager",
    department: "Digital Marketing",
    experience: "2–4 years",
    salary: "₹4 – 7 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Own social strategy for multiple brands",
      "Plan content calendars & campaigns",
      "Grow engagement & community",
      "Analyze insights and iterate fast",
    ],
  },
  {
    id: "content-writer",
    title: "Content Writer",
    department: "Content",
    experience: "1–3 years",
    salary: "₹3 – 5.5 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Write blogs, web copy & marketing content",
      "Research industry topics in depth",
      "Write SEO-friendly, human-first content",
      "Collaborate with design & SEO teams",
    ],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    experience: "2–5 years",
    salary: "₹5 – 10 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Build responsive React interfaces",
      "Convert designs into pixel-perfect UI",
      "Optimize performance & accessibility",
      "Collaborate with backend & design",
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    department: "Engineering",
    experience: "2–5 years",
    salary: "₹5 – 12 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Design REST APIs & server architecture",
      "Work with Node.js, databases & cloud",
      "Ensure security & performance",
      "Build integrations & automation",
    ],
  },
  {
    id: "ppc-specialist",
    title: "PPC / Performance Marketing Specialist",
    department: "Digital Marketing",
    experience: "2–4 years",
    salary: "₹4.5 – 8 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Manage Google & Meta ad accounts",
      "Optimize ROAS and CPA",
      "Build landing page test plans",
      "Report on campaign performance",
    ],
  },
  {
    id: "affiliate-manager",
    title: "Affiliate Manager",
    department: "Growth",
    experience: "2–4 years",
    salary: "₹4 – 8 LPA (India) • Competitive (UK/US)",
    type: "Full-time",
    locations: { india: "Kolkata — Work From Office", uk: "Remote", us: "Remote" },
    responsibilities: [
      "Recruit & manage affiliate partners",
      "Design commission structures",
      "Monitor fraud & compliance",
      "Scale partner revenue",
    ],
  },
];

const FAQS = [
  {
    q: "What services does BluConnet Media offer?",
    a: "We offer SEO, Social Media Marketing, Content Marketing, Email Marketing, PPC, Affiliate Marketing, Lead Generation, Web Development, E-Commerce Marketing, AI Automation, Data Analytics and Mobile Marketing. Ask me about any of them! 😊",
  },
  {
    q: "How much do your services cost?",
    a: "Every project is unique, so we provide **custom quotes** based on your goals and scope. Share your requirements and I'll set up a free consultation with our team — no obligation!",
  },
  {
    q: "How fast will I see SEO results?",
    a: "SEO is a long-term investment. Most clients see meaningful movement in **3–6 months**, depending on competition and site health. We share transparent monthly reports so you can track progress.",
  },
  {
    q: "Do you work with international clients?",
    a: "Absolutely! 🌍 We serve clients across India 🇮🇳, the UK 🇬🇧 and the US 🇺🇸, with teams in Kolkata (WFO) and remote staff worldwide.",
  },
  {
    q: "How do I get started?",
    a: "Simple! Just say **\"Start a Project\"** or **\"Get a Quote\"** and I'll collect a few details. Our team will reach out within 24 hours. 🚀",
  },
  {
    q: "Are you hiring?",
    a: "Yes! We're hiring across India 🇮🇳 (Kolkata, WFO), UK 🇬🇧 (Remote) and US 🇺🇸 (Remote). Type **\"Careers\"** to see all open roles.",
  },
];

/* ------------------------------------------------------------------ */
/*  LANGUAGE DETECTION                                                 */
/* ------------------------------------------------------------------ */

const HINGLISH_WORDS = [
  "namaste", "namaskar", "kaise", "kaisa", "kya", "haan", "nahi", "nahin",
  "kitna", "kitne", "kimat", "keemat", "daam", "paisa", "paise", "rupaye",
  "chahiye", "chahta", "chahti", "batao", "bataiye", "karo", "karna", "karoge",
  "aap", "tum", "mera", "meri", "mujhe", "hamen", "humein", "kripya",
  "dhanyavad", "dhanyawad", "shukriya", "alvida", "accha", "achha", "theek",
  "nokri", "naukri", "kaam", "seva", "madad", "sahayata", "jankari", "jaankari",
  "bataye", "bataiye", "chahiye", "sakta", "sakte", "hogi", "hoga", "hai",
];

function detectLanguage(text) {
  if (!text) return "en";
  // Devanagari script → Hindi
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const words = text.toLowerCase().split(/\s+/);
  const hits = words.filter((w) => HINGLISH_WORDS.includes(w.replace(/[.,!?]/g, "")));
  return hits.length >= 1 ? "hi" : "en";
}

/* ------------------------------------------------------------------ */
/*  INPUT SANITIZATION & VALIDATION                                    */
/* ------------------------------------------------------------------ */

function sanitizeInput(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/(https?:\/\/)?(www\.)?\S+\.(com|net|org|in|io|co)(\/\S*)?/gi, (m) => m) // keep urls
    .slice(0, 1000)
    .trim();
}

const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

const isValidPhone = (v) =>
  /^[+]?[\d\s\-().]{7,18}$/.test(String(v).trim()) &&
  (String(v).match(/\d/g) || []).length >= 7;

function extractEmail(text) {
  const m = String(text).match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/);
  return m ? m[0] : null;
}

function extractPhone(text) {
  const m = String(text).match(/(\+?\d[\d\s\-().]{6,17}\d)/);
  return m ? m[0].trim() : null;
}

/* ------------------------------------------------------------------ */
/*  INTENT DEFINITIONS                                                 */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    greeting:
      "Hi 👋\nWelcome to **BluConnet Media**.\nI'm your AI Assistant, available **24/7**.\nHow can I help you today?",
    greetingBack:
      "Hello again! 😊 Great to see you.\nWhat would you like to explore — **services**, **pricing**, or maybe **start a project**?",
    howAreYou:
      "I'm doing great, thanks for asking! 😄 Always excited to help.\nWhat can I do for you today?",
    services:
      "We offer a complete suite of digital growth services:\n\n• 🔍 SEO & Search Marketing\n• 📱 Social Media Marketing\n• ✍️ Content Marketing\n• 📧 Email Marketing\n• 🎯 PPC / Performance Marketing\n• 🤝 Affiliate Marketing\n• 🧲 Lead Generation\n• 💻 Website Design & Development\n• 🛒 E-Commerce Marketing\n• 🤖 AI Automation\n• 📊 Data Analytics & Research\n• 📲 Mobile Marketing\n\nWhich one would you like to know more about?",
    pricing:
      "Great question! 💰\n\nOur pricing is **custom-tailored** to each project — it depends on scope, timeline and goals. We don't believe in one-size-fits-all packages, so I won't quote you a random number. 😉\n\nThe fastest way to get an accurate quote:\n\n1. Share your requirements with me\n2. Our team prepares a tailored proposal\n3. You get a **free consultation call**\n\nShall I collect your details for a custom quote?",
    careers:
      "We're hiring! 🎯 Here's a snapshot:\n\n🇮🇳 **India** — Kolkata | Work From Office\n🇬🇧 **UK** — Remote\n🇺🇸 **US** — Remote\n\n**Open roles:**\n• SEO Specialist\n• Social Media Manager\n• Content Writer\n• Frontend Developer\n• Backend Developer\n• PPC / Performance Marketing Specialist\n• Affiliate Manager\n\nWant details about a specific role, or shall I help you **apply**?",
    contact:
      "Here's how you can reach us: 📬\n\n📧 **Email:** info@bluconnetmedia.com\n📞 **Phone:** +91 98765 43210\n🌐 **Website:** www.bluconnetmedia.com\n💼 **LinkedIn:** linkedin.com/company/bluconnetmedia\n\nOr simply leave your details here and we'll get back to you within **24 hours**!",
    hours:
      "Our office hours: 🕘\n\n🕘 Monday – Friday: 9:00 AM – 7:00 PM (IST)\n🕘 Saturday: 10:00 AM – 4:00 PM (IST)\n❌ Sunday: Closed\n\nBut don't worry — **I'm available 24/7**, so feel free to ask me anything, anytime! 😊",
    support:
      "I'm sorry you're facing an issue — let's fix it! 🔧\n\nTell me briefly what's wrong, and I'll connect you with the right person. For urgent matters:\n\n📧 support@bluconnetmedia.com\n📞 +91 98765 43210\n\nOur support team typically responds within **2–4 business hours**.",
    about:
      "**BluConnet Media** is a full-stack digital growth agency. 🚀\n\nWe blend **data, creativity and AI** to deliver measurable results in SEO, paid media, social, content, web development and automation.\n\n• 🌍 Clients across India, UK & US\n• 🏆 Award-winning campaigns\n• 🤖 AI-first approach to marketing\n\nWant to know about our **services**, **team culture**, or **work with us**?",
    thanks:
      "You're most welcome! 😊 Happy to help, anytime.\nIs there anything else I can do for you?",
    bye: "Thank you for chatting with us.\nIf you have any other questions, I'm available **24/7**.\nHave a wonderful day! 😊",
    complaint:
      "I'm really sorry to hear that — that's not the experience we want for you. 🙏\n\nYour feedback matters, and I want to make this right. Could you share what happened? I'll escalate it to our team **with top priority**, or I can connect you with a human colleague right away.",
    compliment:
      "That just made my day! 🥹✨ Thank you so much!\nOur team works hard to deliver excellence — I'll pass your kind words along. Is there anything else I can help you with?",
    human:
      "Of course! 🙋 Sometimes a human touch is exactly what's needed.\n\nI can connect you with our team — just share:\n\n1. Your **name**\n2. Your **email**\n3. Your **message**\n\nAnd we'll get back to you quickly. Shall we start?",
    fallback:
      "Hmm, I'm not completely sure about that information. 🤔\n\nI don't want to give you a wrong answer — I can connect you with our team who'll know for sure. Would you like me to do that?",
    fallbackSoft:
      "I want to make sure you get accurate info. While I check with the team, here's what I *can* help with:\n\n• 💼 Services & Pricing\n• 📞 Book a Call\n• 💼 Careers\n• 🛠️ Support\n\nOr type **\"Agent\"** to chat with a human.",
    leadIntro:
      "Awesome — let's get you a custom quote! 🚀\nI'll ask a few quick questions (takes ~1 minute).",
    meetingIntro:
      "Let's get that call booked! 📅\nI just need a few details to schedule it.",
    applyIntro:
      "Let's get your application started! 🎉\nIt only takes a minute.",
    handoffIntro:
      "No problem — connecting you with our team. 🤝\nFirst, what's your **name**?",
    askName: "What's your **name**?",
    askEmail: "Nice to meet you, {name}! 😊 What's your **email address**?",
    askPhone: "And your **phone number** (with country code)?",
    askCompany: "Which **company** are you with? (or type *skip*)",
    askCountry: "Which **country** are you based in? 🌍",
    askBudget: "What's your approximate **budget**? (e.g., ₹50,000 / $1,000 / \"Not sure\")",
    askRequirements:
      "Finally, tell me about your **requirements** — goals, timeline, anything important. 📝",
    askDate: "What **date** would you prefer? (e.g., *tomorrow*, *25 Dec*, *05-01-2026*)",
    askTime: "What **time** works for you? (e.g., *3 PM*, *15:30*)",
    askTimezone: "Your **time zone**? (e.g., IST, GMT, EST — or your city)",
    askPurpose: "What would you like to discuss on the call? 💬",
    askExperience: "How many **years of experience** do you have with this role?",
    askPortfolio:
      "Share a link to your **portfolio / LinkedIn / resume** (or type *skip*).",
    askMessage: "What's your **message** for the team? ✍️",
    invalidEmail:
      "Hmm, that email doesn't look quite right. 🤔 Could you double-check and share it again? (e.g., *name@company.com*)",
    invalidPhone:
      "That phone number seems incomplete. 📱 Please share a valid number (with country code, e.g., +91 98765 43210).",
    invalidName:
      "Could you share your **full name**, please? (at least 2 characters)",
    invalidGeneric:
      "I didn't quite catch that. Could you share it again? 😊",
    leadDone:
      "🎉 **You're all set, {name}!**\n\nHere's what I've noted:\n{summary}\n\nOur team will reach out to **{email}** within **24 hours** with a tailored proposal. 📩\n\nAnything else I can help with?",
    meetingDone:
      "You're booked! 🎉\n\n📅 **Meeting Request Confirmed**\n{summary}\n\nA calendar invite will land in **{email}** shortly. We look forward to speaking with you!\n\nAnything else I can help with?",
    applyDone:
      "Application received! 🎊\n\n{summary}\n\nOur HR team will review your profile and contact you at **{email}** if it's a match. **Good luck!** 🍀\n\nAnything else I can help with?",
    handoffDone:
      "All set! ✅ Our team has been notified and will get back to you at **{email}** as soon as possible — usually within a few hours.\n\nThank you for your patience! 😊",
    cancelled: "No problem, I've cancelled that. 👍 What else can I help you with?",
    rateLimit:
      "You're sending messages quite fast! 🙏 Please wait a moment before trying again.",
    attachmentAck:
      "I've received your file **{name}** ({size}) ✅\nOur team will review it. {extra}",
    voiceHint: "🎙️ Listening… speak now. Tap the mic again to stop.",
    langSwitched:
      "Switched to **English**! 🇬🇧 How can I help you?",
    clearChat: "Chat cleared! Fresh start. ✨ How can I help you today?",
    searchEmpty: "No messages matched your search. 🔍",
    faqIntro: "Here are some frequently asked questions — tap any to see the answer: 👇",
    faqPick: "Here's the answer: 💡\n\n{answer}\n\nAnything else you'd like to know?",
    jobsDetail:
      "**{title}** 💼\n\n• **Department:** {department}\n• **Experience:** {experience}\n• **Type:** {type}\n• **Salary:** {salary}\n\n**Locations:**\n🇮🇳 {locIndia}\n🇬🇧 {locUK}\n🇺🇸 {locUS}\n\n**Responsibilities:**\n{responsibilities}\n\nWould you like to **apply** for this role?",
    applyWhichRole: "Which role would you like to **apply** for? 👇",
    applyRoleChosen:
      "Great choice — **{title}**! 🎯 Let's start your application.\n\nWhat's your **name**?",
    yesQuote: "Perfect! Let's get you that quote. 🚀",
    yesHandoff: "Great! Connecting you with our team. 🤝",
    yesMeeting: "Awesome! Let's find a time. 📅",
    moreHelp: "Is there anything else I can help you with? 😊",
    quickServices: ["🔍 SEO", "📱 Social Media", "💻 Web Development", "🤖 AI Automation", "💰 Get Pricing", "💼 Careers"],
    quickMain: ["💼 View Services", "💰 Get Pricing", "📞 Book a Call", "🚀 Start a Project", "💼 Careers", "❓ FAQs"],
    quickCareers: ["🇮🇳 Jobs in India", "🇬🇧 Remote (UK)", "🇺🇸 Remote (US)", "📝 How to Apply"],
    quickYesNo: ["✅ Yes", "❌ Not now"],
    quickAfterService: ["💰 Get a quote", "📞 Book a call", "🔍 More services"],
  },
  hi: {
    greeting:
      "नमस्ते 👋\n**BluConnet Media** में आपका स्वागत है।\nमैं आपका AI असिस्टेंट हूँ, **24/7** उपलब्ध।\nमैं आज आपकी कैसे मदद कर सकता हूँ?",
    greetingBack:
      "नमस्ते! आपसे फिर मिलकर खुशी हुई 😊\nक्या जानना चाहेंगे — **सेवाएँ**, **कीमत**, या **प्रोजेक्ट शुरू** करना है?",
    howAreYou:
      "मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! 😄\nआज मैं आपकी क्या मदद कर सकता हूँ?",
    services:
      "हमारी सेवाओं की पूरी श्रृंखला:\n\n• 🔍 SEO और सर्च मार्केटिंग\n• 📱 सोशल मीडिया मार्केटिंग\n• ✍️ कंटेंट मार्केटिंग\n• 📧 ईमेल मार्केटिंग\n• 🎯 PPC / परफॉरमेंस मार्केटिंग\n• 🤝 एफिलिएट मार्केटिंग\n• 🧲 लीड जनरेशन\n• 💻 वेबसाइट डिज़ाइन और डेवलपमेंट\n• 🛒 ई-कॉमर्स मार्केटिंग\n• 🤖 AI ऑटोमेशन\n• 📊 डेटा एनालिटिक्स\n• 📲 मोबाइल मार्केटिंग\n\nआप किसके बारे में जानना चाहेंगे?",
    pricing:
      "बढ़िया सवाल! 💰\n\nहमारी कीमत हर प्रोजेक्ट के लिए **कस्टम** होती है — यह स्कोप, टाइमलाइन और लक्ष्यों पर निर्भर करती है। बिना समझे कोई भी अंदाज़ा देना ठीक नहीं होगा। 😉\n\nसटीक कोटेशन पाने का सबसे तेज़ तरीका:\n\n1. मुझे अपनी आवश्यकताएँ बताएं\n2. हमारी टीम एक तैयार प्रस्ताव बनाएगी\n3. आपको **मुफ़्त कंसल्टेशन** मिलेगा\n\nक्या मैं आपकी जानकारी लूँ?",
    careers:
      "हम हायरिंग कर रहे हैं! 🎯\n\n🇮🇳 **भारत** — कोलकाता | ऑफिस से काम\n🇬🇧 **UK** — रिमोट\n🇺🇸 **US** — रिमोट\n\n**खुले पद:**\n• SEO स्पेशलिस्ट\n• सोशल मीडिया मैनेजर\n• कंटेंट राइटर\n• फ्रंटएंड डेवलपर\n• बैकएंड डेवलपर\n• PPC स्पेशलिस्ट\n• एफिलिएट मैनेजर\n\nकिसी रोल की जानकारी चाहिए, या **अप्लाई** करना चाहेंगे?",
    contact:
      "आप हमसे इस तरह संपर्क कर सकते हैं: 📬\n\n📧 **ईमेल:** info@bluconnetmedia.com\n📞 **फ़ोन:** +91 98765 43210\n🌐 **वेबसाइट:** www.bluconnetmedia.com\n\nया अपनी जानकारी छोड़ें — हम **24 घंटे** के भीतर संपर्क करेंगे!",
    hours:
      "हमारे कार्यकाल: 🕘\n\n🕘 सोमवार – शुक्रवार: सुबह 9 – शाम 7 (IST)\n🕘 शनिवार: सुबह 10 – दोपहर 4 (IST)\n❌ रविवार: बंद\n\nलेकिन चिंता मत कीजिए — मैं **24/7** उपलब्ध हूँ! 😊",
    support:
      "मुझे खेद है कि आपको परेशानी हो रही है — चलिए इसे ठीक करें! 🔧\n\nमुझे संक्षेप में बताइए क्या समस्या है, मैं आपको सही टीम से जोड़ूंगा। तत्काल मदद के लिए:\n\n📧 support@bluconnetmedia.com\n📞 +91 98765 43210\n\nहमारी टीम आमतौर पर **2–4 कार्य घंटों** में जवाब देती है।",
    about:
      "**BluConnet Media** एक फुल-स्टैक डिजिटल ग्रोथ एजेंसी है। 🚀\n\nहम **डेटा, क्रिएटिविटी और AI** का संगम करके SEO, पेड मीडिया, सोशल, कंटेंट, वेब डेवलपमेंट और ऑटोमेशन में शानदार नतीजे देते हैं।\n\n• 🌍 भारत, UK और US के क्लाइंट\n• 🏆 अवॉर्ड-विनिंग कैंपेन\n• 🤖 AI-फर्स्ट अप्रोच\n\nहमारी **सेवाएँ**, **टीम**, या **करियर** के बारे में जानना चाहेंगे?",
    thanks:
      "आपका स्वागत है! 😊 कभी भी पूछिए।\nऔर कुछ मदद चाहिए?",
    bye: "हमारे साथ चैट करने के लिए धन्यवाद।\nकोई भी सवाल हो तो मैं **24/7** उपलब्ध हूँ।\nआपका दिन शुभ हो! 😊",
    complaint:
      "मुझे वाकई खेद है कि ऐसा हुआ — हम इसे ठीक करेंगे। 🙏\n\nकृपया बताइए क्या हुआ। मैं इसे **टॉप प्रायोरिटी** पर टीम तक पहुँचाऊंगा, या चाहें तो आपको किसी सहयोगी से जोड़ दूँ?",
    compliment:
      "आपने तो मेरा दिन बना दिया! 🥹✨ बहुत धन्यवाद!\nमैं टीम को यह ज़रूर बताऊंगा। और कुछ मदद करूँ?",
    human:
      "बिल्कुल! 🙋 कभी-कभी इंसानी सहायता ही सही होती है।\n\nकृपया साझा करें:\n\n1. आपका **नाम**\n2. आपका **ईमेल**\n3. आपका **संदेश**\n\nहम जल्दी संपर्क करेंगे। शुरू करें?",
    fallback:
      "माफ़ कीजिए, मुझे इस बारे में पूरी जानकारी नहीं है। 🤔\n\nगलत जवाब देने से बेहतर है कि मैं आपको हमारी टीम से जोड़ दूँ। क्या मैं ऐसा करूँ?",
    fallbackSoft:
      "मैं यह सुनिश्चित करना चाहता हूँ कि आपको सही जानकारी मिले। तब तक मैं इनमें मदद कर सकता हूँ:\n\n• 💼 सेवाएँ और कीमत\n• 📞 कॉल बुक करें\n• 💼 करियर\n• 🛠️ सपोर्ट\n\nया **\"Agent\"** लिखें — मैं आपको टीम से जोड़ दूँगा।",
    leadIntro: "बढ़िया! आइए आपका कस्टम कोटेशन तैयार करें 🚀\nपहले, आपका **नाम** क्या है?",
    meetingIntro: "चलिए कॉल बुक करें! 📅\nआपका **नाम** क्या है?",
    applyIntro: "चलिए आपका आवेदन शुरू करें! 🎉\nआपका **नाम** क्या है?",
    handoffIntro: "ठीक है — आपको हमारी टीम से जोड़ रहा हूँ। 🤝\nपहले, आपका **नाम** क्या है?",
    askName: "आपका **नाम** क्या है?",
    askEmail: "आपसे मिलकर खुशी हुई, {name}! 😊 आपका **ईमेल** क्या है?",
    askPhone: "और आपका **फ़ोन नंबर**? (देश कोड सहित)",
    askCompany: "आप किस **कंपनी** से हैं? (या *skip* लिखें)",
    askCountry: "आप किस **देश** में हैं? 🌍",
    askBudget: "आपका अनुमानित **बजट** क्या है? (जैसे ₹50,000 / $1,000 / \"पता नहीं\")",
    askRequirements: "अंत में, अपनी **आवश्यकताएँ** बताइए — लक्ष्य, समय-सीमा, कुछ भी। 📝",
    askDate: "आपको कौन सी **तारीख** चाहिए? (जैसे *कल*, *05-01-2026*)",
    askTime: "कौन सा **समय** ठीक रहेगा? (जैसे *दोपहर 3 बजे*, *15:30*)",
    askTimezone: "आपका **टाइमज़ोन**? (जैसे IST, GMT, EST — या आपका शहर)",
    askPurpose: "कॉल पर क्या चर्चा करनी है? 💬",
    askExperience: "आपके पास इस क्षेत्र में कितने **साल का अनुभव** है?",
    askPortfolio: "अपना **पोर्टफोलियो / LinkedIn / रिज़्यूमे** लिंक साझा करें (या *skip* लिखें)।",
    askMessage: "टीम के लिए आपका **संदेश** क्या है? ✍️",
    invalidEmail: "यह ईमेल सही नहीं लग रहा। 🤔 कृपया दोबारा जाँच कर साझा करें। (जैसे *naam@company.com*)",
    invalidPhone: "यह नंबर पूरा नहीं लग रहा। 📱 कृपया सही नंबर साझा करें (जैसे +91 98765 43210)।",
    invalidName: "कृपया अपना **पूरा नाम** बताइए। (कम से कम 2 अक्षर)",
    invalidGeneric: "समझ नहीं आया। कृपया दोबारा बताइए? 😊",
    leadDone:
      "हो गया, {name}! 🎉\n\nमैंने यह नोट किया है:\n{summary}\n\nहमारी टीम **24 घंटों** के भीतर **{email}** पर संपर्क करेगी। 📩\n\nऔर कुछ मदद चाहिए?",
    meetingDone:
      "बुकिंग हो गई! 🎉\n\n📅 **मीटिंग रिक्वेस्ट कन्फर्म**\n{summary}\n\nकैलेंडर इनवाइट **{email}** पर आ जाएगी। हम आपसे बात करने के लिए उत्सुक हैं!\n\nऔर कुछ?",
    applyDone:
      "आवेदन प्राप्त हुआ! 🎊\n\n{summary}\n\nहमारी HR टीम आपकी प्रोफ़ाइल देखेगी और मैच होने पर **{email}** पर संपर्क करेगी। **शुभकामनाएँ!** 🍀",
    handoffDone:
      "हो गया! ✅ टीम को सूचित कर दिया गया है — वे जल्द से जल्द **{email}** पर संपर्क करेंगे।\n\nधन्यवाद! 😊",
    cancelled: "कोई बात नहीं, रद्द कर दिया। 👍 और किसमें मदद करूँ?",
    rateLimit: "आप बहुत तेज़ी से संदेश भेज रहे हैं! 🙏 कृपया एक क्षण रुकें।",
    attachmentAck: "आपकी फ़ाइल **{name}** ({size}) प्राप्त हो गई ✅\nहमारी टीम समीक्षा करेगी।",
    langSwitched: "भाषा बदल दी गई — **हिंदी**! 🇮🇳 बताइए, कैसे मदद करूँ?",
    clearChat: "चैट साफ़ हो गई! ✨ बताइए, क्या मदद करूँ?",
    searchEmpty: "खोज से कोई संदेश मेल नहीं खाया। 🔍",
    faqIntro: "यहाँ कुछ सामान्य प्रश्न हैं — उत्तर देखने के लिए किसी पर टैप करें: 👇",
    faqPick: "उत्तर: 💡\n\n{answer}\n\nऔर कुछ जानना चाहेंगे?",
    jobsDetail:
      "**{title}** 💼\n\n• **विभाग:** {department}\n• **अनुभव:** {experience}\n• **प्रकार:** {type}\n• **वेतन:** {salary}\n\n**स्थान:**\n🇮🇳 {locIndia}\n🇬🇧 {locUK}\n🇺🇸 {locUS}\n\n**जिम्मेदारियाँ:**\n{responsibilities}\n\nक्या आप इस भूमिका के लिए **अप्लाई** करना चाहेंगे?",
    applyWhichRole: "आप किस पद के लिए **अप्लाई** करना चाहते हैं? 👇",
    applyRoleChosen: "बढ़िया — **{title}**! 🎯 आइए शुरू करें।\nआपका **नाम** क्या है?",
    yesQuote: "बढ़िया! चलिए कोटेशन तैयार करें। 🚀",
    yesHandoff: "ठीक है! आपको टीम से जोड़ रहा हूँ। 🤝",
    yesMeeting: "शानदार! चलिए समय तय करें। 📅",
    moreHelp: "और कुछ मदद चाहिए? 😊",
    quickServices: ["🔍 SEO", "📱 सोशल मीडिया", "💻 वेब डेवलपमेंट", "🤖 AI ऑटोमेशन", "💰 कीमत", "💼 करियर"],
    quickMain: ["💼 सेवाएँ", "💰 कीमत", "📞 कॉल बुक करें", "🚀 प्रोजेक्ट शुरू करें", "💼 करियर", "❓ FAQ"],
    quickCareers: ["🇮🇳 भारत में नौकरियाँ", "🇬🇧 रिमोट (UK)", "🇺🇸 रिमोट (US)", "📝 अप्लाई कैसे करें"],
    quickYesNo: ["✅ हाँ", "❌ अभी नहीं"],
    quickAfterService: ["💰 कोटेशन लें", "📞 कॉल बुक करें", "🔍 और सेवाएँ"],
  },
  /* ---- multilingual chat packs (de/fr/it/pt/es) ---- */
  de: CHAT_PACKS.de,
  fr: CHAT_PACKS.fr,
  it: CHAT_PACKS.it,
  pt: CHAT_PACKS.pt,
  es: CHAT_PACKS.es,

};

/* ------------------------------------------------------------------ */
/*  INTENT PATTERNS                                                    */
/* ------------------------------------------------------------------ */

const INTENTS = [
  {
    id: "greeting",
    patterns: [
      /\b(hi|hii+|hello|hey|heyy+|yo|greetings|good\s?(morning|afternoon|evening|day))\b/i,
      /\b(namaste|namaskar|नमस्ते|नमस्कार|हैलो|हाय)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "how_are_you",
    patterns: [/\b(how\s?are\s?you|how's it going|what's up|sup)\b/i, /\b(kaise ho|kya haal|कैसे हो|क्या हाल)\b/i],
    weight: 1.0,
  },
  {
    id: "services",
    patterns: [
      /\b(what do you (do|offer|provide)|digital marketing|marketing services|all services|service list)\b/i,
      // Bare nouns (services/solutions/...) only count next to a company
      // context word, so generic phrases ("birthday party solutions")
      // never route here.
      /\b(your|you|company|offer|offers|provide|business|all)\b.{0,50}\b(services?|solutions?|offerings?)\b|\b(services?|solutions?|offerings?)\b.{0,50}\b(you|company|offer|offers|provide|business|all|list)\b|\btell\s+me\s+about\s+(your|you|company|business)\s+(services?|solutions?|offerings?)\b/i,
      /\b(seva|सेवाएं|सेवाएँ|सर्विस|काम क्या)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "pricing",
    patterns: [
      /\b(pric(e|ing)|cost|how much|charges?|fees?|rate|rates?|quote|quotation|package|packages|budget|estimate)\b/i,
      /\b(kitna|kitne|kimat|keemat|daam|paisa|पैसा|कीमत|कितना|दाम|बजट)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "careers",
    patterns: [
      /\b(job|jobs|career|careers|hiring|vacanc(y|ies)|opening|openings|position|recruit|work (with|for) (you|us)|join (your )?team|employment)\b/i,
      /\b(naukri|nokri|naukari|नौकरी|नोकरी|करियर|भर्ती|job milega)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "apply",
    patterns: [/\b(apply|application|submit resume|send cv|want to apply|interested in (the )?(role|job|position))\b/i, /\b(अप्लाई|आवेदन|रिज़्यूमे|रिज्यूमे)\b/i],
    weight: 1.0,
  },
  {
    id: "contact",
    patterns: [
      // Bare "email"/"mail"/"number" alone = too generic (matched generic
      // questions like "Tell me about email marketing" without company
      // context). Require a contact-seeking verb or company context.
      /\b(contact|whatsapp|get in touch|reach (you|us)|call (you|us)|your (email|phone|number|address|location)|email (address|id)|phone number|contact (details|info|us))\b/i,
      /\b(संपर्क|फोन|नंबर|पता|ईमेल|मेल)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "hours",
    patterns: [
      /\b(hours?|timing|timings|open|opening|closed?|closing|working hours|business hours|when.*(open|close|available))\b/i,
      /\b(समय|टाइम|खुलता|बंद|कब खुल|ऑफिस टाइम)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "support",
    patterns: [
      /\b(support|issue|problem|error|bug|not working|broken|help me|troubleshoot|fix|complaint about|stuck)\b/i,
      /\b(मदद|समस्या|दिक्कत|प्रॉब्लम|काम नहीं|एरर)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "seo",
    patterns: [/\b(seo|search engine optimi[sz]ation|rank(ing|ings)?|google ranking|organic traffic|backlinks?|keywords?)\b/i],
    weight: 0.9,
  },
  {
    id: "social",
    patterns: [
      /\b(social media|instagram|facebook|linkedin|twitter|youtube|social handling|followers?|engagement|smm)\b/i,
      /\b(सोशल मीडिया|इंस्टाग्राम|फेसबुक)\b/i,
    ],
    weight: 0.9,
  },
  {
    id: "web",
    patterns: [
      /\b(website|web ?site development|web ?design|landing page|e-?commerce (site|store|website)|wordpress|web app|build (a|my) (website|site))\b/i,
      /\b(वेबसाइट|वेब डेवलपमेंट)\b/i,
    ],
    weight: 0.9,
  },
  {
    id: "ai",
    patterns: [/\b(ai|a\.i\.|artificial intelligence|automation|chatbot|machine learning|gpt|llm|bot)\b/i, /\b(ऑटोमेशन|चैटबॉट)\b/i],
    weight: 0.9,
  },
  {
    id: "content",
    patterns: [/\b(content (marketing|writing|creation)|blog|copywriting|article|copy)\b/i, /\b(कंटेंट)\b/i],
    weight: 0.9,
  },
  {
    id: "email_mkt",
    patterns: [
      // "email marketing" only — bare "email" is contact info (your email address),
      // never email marketing; that bare-email match hijacked generic questions.
      /\b(email marketing|newsletter|drip campaign|mail campaign|mailchimp|klaviyo)\b/i,
    ],
    weight: 0.9,
  },
  {
    id: "ppc",
    patterns: [/\b(ppc|google ads|paid ads?|performance marketing|adwords|facebook ads|ad campaign)\b/i],
    weight: 0.9,
  },
  {
    id: "leadgen",
    patterns: [/\b(lead generation|leads?|b2b leads|prospect)\b/i, /\b(लीड)\b/i],
    weight: 0.9,
  },
  {
    id: "ecommerce",
    patterns: [/\b(e-?commerce|shopify|amazon|flipkart|online store|marketplace)\b/i],
    weight: 0.9,
  },
  {
    id: "analytics",
    patterns: [/\b(analytics|data (analytics|research)|reporting|dashboard|ga4|google analytics)\b/i],
    weight: 0.9,
  },
  {
    id: "mobile_mkt",
    patterns: [/\b(mobile marketing|aso|app (store|promotion|install)|sms marketing|push notification)\b/i],
    weight: 0.9,
  },
  {
    id: "affiliate",
    patterns: [/\b(affiliate|referral program|partner program)\b/i, /\b(एफिलिएट|एफिलिएट)\b/i],
    weight: 0.9,
  },
  {
    id: "about",
    patterns: [
      // NOTE: "tell me about" alone is too generic (it hijacked queries like
      // "Tell me about your services"). It only counts as About when followed
      // by a company referent; otherwise the topic word (services, SEO, ...)
      // decides the intent.
      /\b(about (you|us|your company|the company)|who (are|is) (you|bluconnet)|your company|tell me about (you|us|yourself|yourselves|your company|the company|bluconnet|it)|bluconnet|company (info|profile|details))\b/i,
      /\b(कंपनी के बारे|आप कौन)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "faq",
    patterns: [/\b(faq|faqs|frequently asked|common questions|queries)\b/i, /\b(सवाल|प्रश्न)\b/i],
    weight: 1.0,
  },
  {
    id: "thanks",
    patterns: [/\b(thanks?|thank you|thx|ty|appreciate|grateful)\b/i, /\b(धन्यवाद|शुक्रिया)\b/i],
    weight: 1.0,
  },
  {
    id: "bye",
    patterns: [/\b(bye|goodbye|see you|see ya|later|farewell|exit|quit)\b/i, /\b(अलविदा|फिर मिलेंगे)\b/i],
    weight: 1.0,
  },
  {
    id: "complaint",
    patterns: [
      /\b(complaint|complain|worst|terrible|horrible|awful|pathetic|useless|disappointed|disappointing|angry|frustrat(ed|ing)|refund|scam|fraud|poor (service|quality|experience)|bad (service|experience|work))\b/i,
      /\b(शिकायत|बेकार|घटिया|बुरा|गुस्सा)\b/i,
    ],
    weight: 1.1,
  },
  {
    id: "compliment",
    patterns: [
      /\b(great|awesome|amazing|excellent|wonderful|fantastic|love(d)? (it|you|your)|good job|well done|nice work|impressive|beautiful|perfect)\b/i,
      /\b(बढ़िया|शानदार|बहुत अच्छा|कमाल)\b/i,
    ],
    weight: 1.0,
  },
  {
    id: "human",
    patterns: [
      /\b(human|agent|real person|representative|talk to (someone|a person|support)|customer care|executive|operator|live chat|speak to)\b/i,
      /\b(इंसान|एजेंट|अधिकारी|टीम से बात)\b/i,
    ],
    weight: 1.1,
  },
  {
    id: "book",
    patterns: [
      /\b(book|booking|schedule|appointment|meeting|demo|consultation|consult|call|talk|discuss)\b/i,
      /\b(बुक|मीटिंग|कॉल|मिलना|समय)\b/i,
    ],
    weight: 0.95,
  },
  {
    id: "start_project",
    patterns: [
      /\b(start (a )?project|get started|hire you|work with you|want (a )?(website|marketing|seo|campaign)|need (a )?(website|marketing|seo|agency)|new project|onboard)\b/i,
      /\b(प्रोजेक्ट शुरू|शुरू करना|काम देना)\b/i,
    ],
    weight: 1.05,
  },
  {
    id: "language",
    patterns: [/\b(english|hindi|language|switch (to )?(english|hindi)|in hindi|in english)\b/i, /\b(हिंदी|अंग्रेज़ी|भाषा)\b/i],
    weight: 1.0,
  },
];

/* ------------------------------------------------------------------ */
/*  INTENT MATCHING (weighted scoring)                                 */
/* ------------------------------------------------------------------ */

function matchIntent(text) {
  const clean = String(text || "").toLowerCase().trim();
  if (!clean) return null;
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const p of intent.patterns) {
      if (p.test(clean)) {
        score += intent.weight;
        // bonus for early position match (stronger signal)
        const m = clean.match(p);
        if (m && m.index === 0) score += 0.15;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent.id;
    }
  }
  return bestScore >= 0.85 ? best : null;
}

/* ------------------------------------------------------------------ */
/*  CONVERSATIONAL FLOWS (multi-step slot filling)                     */
/* ------------------------------------------------------------------ */

const FLOW_STEPS = {
  lead: [
    { key: "name", promptKey: "askName", validate: (v) => (v.replace(/[^a-zA-Z\u0900-\u097F .'-]/g, "").trim().length >= 2 ? v.trim() : null), invalidKey: "invalidName" },
    { key: "email", promptKey: "askEmail", validate: (v) => (isValidEmail(v) ? extractEmail(v) : null), invalidKey: "invalidEmail" },
    { key: "phone", promptKey: "askPhone", validate: (v) => (isValidPhone(v) ? extractPhone(v) : null), invalidKey: "invalidPhone" },
    { key: "company", promptKey: "askCompany", optional: true, validate: (v) => v.trim() },
    { key: "country", promptKey: "askCountry", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidGeneric" },
    { key: "budget", promptKey: "askBudget", optional: true, validate: (v) => v.trim() },
    { key: "requirements", promptKey: "askRequirements", validate: (v) => (v.trim().length >= 5 ? v.trim() : null), invalidKey: "invalidGeneric" },
  ],
    meeting: [
    // Required order: Name → Email → Phone → Date → Time → Time Zone → Requirements
    { key: "name", promptKey: "askName", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidName" },
    { key: "email", promptKey: "askEmail", validate: (v) => (isValidEmail(v) ? extractEmail(v) : null), invalidKey: "invalidEmail" },
    { key: "phone", promptKey: "askPhone", validate: (v) => (isValidPhone(v) ? extractPhone(v) : null), invalidKey: "invalidPhone" },
    { key: "date", promptKey: "askDate", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidGeneric" },
    { key: "time", promptKey: "askTime", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidGeneric" },
    { key: "timezone", promptKey: "askTimezone", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidGeneric" },
    { key: "requirements", promptKey: "askRequirements", validate: (v) => (v.trim().length >= 3 ? v.trim() : null), invalidKey: "invalidGeneric" },
  ],
  application: [
    { key: "name", promptKey: "askName", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidName" },
    { key: "email", promptKey: "askEmail", validate: (v) => (isValidEmail(v) ? extractEmail(v) : null), invalidKey: "invalidEmail" },
    { key: "phone", promptKey: "askPhone", validate: (v) => (isValidPhone(v) ? extractPhone(v) : null), invalidKey: "invalidPhone" },
    { key: "experience", promptKey: "askExperience", validate: (v) => (v.trim().length >= 1 ? v.trim() : null), invalidKey: "invalidGeneric" },
    { key: "portfolio", promptKey: "askPortfolio", optional: true, validate: (v) => v.trim() },
  ],
  handoff: [
    { key: "name", promptKey: "askName", validate: (v) => (v.trim().length >= 2 ? v.trim() : null), invalidKey: "invalidName" },
    { key: "email", promptKey: "askEmail", validate: (v) => (isValidEmail(v) ? extractEmail(v) : null), invalidKey: "invalidEmail" },
    { key: "message", promptKey: "askMessage", validate: (v) => (v.trim().length >= 3 ? v.trim() : null), invalidKey: "invalidGeneric" },
  ],
};

const FLOW_LABELS = {
  lead:      { en: "📝 Get a Quote",     de: "📝 Angebot erhalten",       fr: "📝 Obtenir un devis",          it: "📝 Richiedi preventivo",     pt: "📝 Pedir orçamento",        es: "📝 Obtener presupuesto" },
  meeting:   { en: "📅 Book a Meeting",  de: "📅 Meeting buchen",        fr: "📅 Prendre rendez-vous",       it: "📅 Prenota riunione",        pt: "📅 Agendar reunião",         es: "📅 Reservar reunión" },
  application:{ en: "🎯 Job Application", de: "🎯 Bewerbung",             fr: "🎯 Candidature",               it: "🎯 Candidatura",             pt: "🎯 Candidatura",             es: "🎯 Solicitud de empleo" },
  handoff:   { en: "🤝 Team Support",    de: "🤝 Team-Support",          fr: "🤝 Support équipe",            it: "🤝 Supporto team",           pt: "🤝 Suporte da equipe",       es: "🤝 Soporte del equipo" },
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function fill(template, vars = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  );
}

const YES_RE = /^(yes|yep|yeah|sure|ok|okay|please|do it|go ahead|y|haan|ha|हाँ|हां|जी|जी हाँ|ठीक|ठीक है)\b/i;
const NO_RE = /^(no|nope|nah|not now|later|nahi|nahin|नहीं|नहीं|जी नहीं)\b/i;
const CANCEL_RE = /\b(cancel|stop|exit|quit|nevermind|never mind|forget it|रद्द|छोड़ो)\b/i;
const SKIP_RE = /^(skip|na|none|n\/a|no thanks|later|छोड़ो|स्किप)$/i;

function createInitialContext(lang = "en") {
  return {
    lang,
    flow: null, // { name, step, data, retries }
    lastIntent: null,
    pendingAction: null, // 'lead' | 'handoff' | 'meeting' | 'apply'
    userName: null,
    lastServiceId: null,
    lastJobId: null,
    lastFaqIndex: null,
    messageTimes: [],
  };
}

function summarize(data, keys) {
  const labels = {
    name: "Name", email: "Email", phone: "Phone", company: "Company",
    country: "Country", budget: "Budget", requirements: "Requirements",
    date: "Date", time: "Time", timezone: "Time zone", purpose: "Purpose",
    experience: "Experience", portfolio: "Portfolio", message: "Message",
    role: "Role",
  };
  return keys
    .filter((k) => data[k])
    .map((k) => `• **${labels[k] || k}:** ${data[k]}`)
    .join("\n");
}

function jobDetailText(job, lang) {
  const t = T[lang] || T.en;
  return fill(t.jobsDetail, {
    title: job.title,
    department: job.department,
    experience: job.experience,
    type: job.type,
    salary: job.salary,
    locIndia: job.locations.india,
    locUK: job.locations.uk,
    locUS: job.locations.us,
    responsibilities: job.responsibilities.map((r) => `• ${r}`).join("\n"),
  });
}

function findJob(text) {
  const clean = String(text).toLowerCase();
  const map = [
    { re: /seo/, id: "seo-specialist" },
    { re: /social/, id: "social-media-manager" },
    { re: /content|writer|writing/, id: "content-writer" },
    { re: /frontend|front-end|front end|react/, id: "frontend-developer" },
    { re: /backend|back-end|back end|node/, id: "backend-developer" },
    { re: /ppc|performance|ads specialist/, id: "ppc-specialist" },
    { re: /affiliate/, id: "affiliate-manager" },
  ];
  for (const { re, id } of map) {
    if (re.test(clean)) return JOBS.find((j) => j.id === id) || null;
  }
  // numeric selection e.g. "1", "first"
  const num = clean.match(/\b(1|2|3|4|5|6|7|first|second|third|fourth|fifth|sixth|seventh)\b/);
  if (num) {
    const ordinals = { "1": 0, first: 0, "2": 1, second: 1, "3": 2, third: 2, "4": 3, fourth: 3, "5": 4, fifth: 4, "6": 5, sixth: 5, "7": 6, seventh: 6 };
    const idx = ordinals[num[1]];
    if (idx !== undefined && JOBS[idx]) return JOBS[idx];
  }
  return null;
}

function isBareSelection(text) {
  // Bare list selections ("5", "option 2", "the second one") — short and
  // carrying no other topic words. Longer free-form sentences (e.g. "Give
  // me 5 creative birthday ideas") must NEVER be treated as selections.
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length > 4) return false;
  return /\b(1|2|3|4|5|6|7|8|9|10|11|12|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|option|number|no)\b/i.test(text);
}

function findService(text) {
  const clean = String(text).toLowerCase();
  // Topic-word matches below must never fire on long free-form sentences:
  // they only apply to short service-name mentions (<= 6 words), so generic
  // questions ("Give me 5 creative birthday ideas") can't match a service.
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length > 6) {
    // still honor bare numeric selections handled below
  } else {
  const map = [
    { re: /\bseo\b|search engine|ranking|organic/, id: "seo" },
    { re: /\bsocial\b|instagram|facebook|linkedin|\binsta\b/, id: "social" },
    { re: /\bwebsite\b|web ?design|web ?dev|landing|\bwordpress\b|\bshopify\b|e-?commerce (site|store|website)/, id: "web" },
    { re: /\bcontent\b|\bblog\b|\bcopy\b/, id: "content" },
    { re: /\bemail marketing\b|\bnewsletter\b|drip campaign|mail campaign/, id: "email" },
    { re: /\bppc\b|google ads|paid|performance/, id: "ppc" },
    { re: /\baffiliate\b/, id: "affiliate" },
    { re: /\blead generation\b|\bleads?\b|b2b leads|prospect/, id: "leadgen" },
    { re: /\be-?commerce\b|shopify|amazon|store/, id: "ecommerce" },
    { re: /\bcrm\b|graphic|\bdesign\b/, id: "crm" },
    { re: /\banalytics\b|data analytics|data research|\breporting\b|\bdashboard\b|\bga4\b|google analytics/, id: "analytics" },
    { re: /mobile marketing|\bmobile\b|\baso\b|\bapp\b/, id: "mobile" },
    { re: /\bai\b|automation|\bchatbot\b|\bbot\b/, id: "ai" },
  ];
  for (const { re, id } of map) {
    if (re.test(clean)) return SERVICES.find((s) => s.id === id) || null;
  }
  }
  // Numeric choice ("2", "second", "option 3") — only for bare selections.
  if (!isBareSelection(text)) return null;
  const num = clean.match(/\b(1|2|3|4|5|6|7|8|9|10|11|12|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\b/);
  if (num) {
    const ord = { "1": 0, first: 0, "2": 1, second: 1, "3": 2, third: 2, "4": 3, fourth: 3, "5": 4, fifth: 4, "6": 5, sixth: 5, "7": 6, seventh: 6, "8": 6, "9": 7, eighth: 7, "10": 8, ninth: 8, "11": 9, tenth: 9, "12": 10, eleventh: 10, twelfth: 11 };
    const idx = ord[num[1]];
    if (idx !== undefined && SERVICES[idx]) return SERVICES[idx];
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  MAIN MESSAGE PROCESSOR                                             */
/* ------------------------------------------------------------------ */

/**
 * @param {string} rawText   user message
 * @param {object} ctx       conversation context (mutated copy returned)
 * @param {object} opts      { attachment: {name,size} | null }
 * @returns {{ ctx, replies: Array<{text, quickReplies?, action?}>, submit?: {type, payload} }}
 */
function processMessage(rawText, ctxIn, opts = {}) {
  const text = sanitizeInput(rawText);
  const ctx = { ...ctxIn };
  const replies = [];
  let submit = null;
  let needsGeneralAI = false;

  // --- auto language detection (only when not manually locked) ---
  if (!ctx.langLocked) {
    const detected = detectLanguage(text);
    if (detected !== ctx.lang && text.length > 2) ctx.lang = detected;
  }
  const lang = T[ctx.lang] ? ctx.lang : "en";
  const t = T[lang];

  // --- rate limiting (client-side guard) ---
  const now = Date.now();
  ctx.messageTimes = (ctx.messageTimes || []).filter((ts) => now - ts < 60000);
  ctx.messageTimes.push(now);
  if (ctx.messageTimes.length > 22) {
    replies.push({ text: t.rateLimit });
    return { ctx, replies, submit, needsGeneralAI };
  }

  // ================================================================
  //  ACTIVE FLOW — slot filling
  // ================================================================
  if (ctx.flow) {
    const flowName = ctx.flow.name;

    // cancel anytime
    if (CANCEL_RE.test(text) && text.length < 20) {
      ctx.flow = null;
      ctx.pendingAction = null;
      replies.push({ text: t.cancelled, quickReplies: t.quickMain });
      return { ctx, replies, submit, needsGeneralAI };
    }

    const steps = FLOW_STEPS[flowName];
    const stepIdx = ctx.flow.step;
    const step = steps[stepIdx];

    if (step) {
      let value = null;
      if (step.optional && SKIP_RE.test(text.trim())) {
        value = "";
      } else {
        value = step.validate(text);
      }

      if (value === null) {
        ctx.flow.retries = (ctx.flow.retries || 0) + 1;
        if (ctx.flow.retries >= 3) {
          // too many retries → offer human handoff
          ctx.flow = null;
          replies.push({ text: t.invalidGeneric });
          replies.push({ text: t.fallback, quickReplies: t.quickYesNo });
          ctx.pendingAction = "handoff";
          return { ctx, replies, submit, needsGeneralAI };
        }
        replies.push({ text: t[step.invalidKey] || t.invalidGeneric });
        return { ctx, replies, submit, needsGeneralAI };
      }

      // save value
      ctx.flow.data = { ...ctx.flow.data, [step.key]: value };
      if (step.key === "name") ctx.userName = value;
      ctx.flow.retries = 0;
      ctx.flow.step += 1;

      // next prompt or completion
      const nextStep = steps[ctx.flow.step];
      if (nextStep) {
        let prompt = fill(t[nextStep.promptKey], { name: ctx.userName || "" });
        if (nextStep.key === "email" && !prompt.includes("{name}")) {
          // already personalized via template
        }
        replies.push({ text: prompt });
      } else {
        // flow complete → build payload
        const data = ctx.flow.data;
        let doneText = "";
        let payload = { ...data, lang };

        if (flowName === "lead") {
          submit = { type: "lead", payload };
          doneText = fill(t.leadDone, {
            name: data.name,
            email: data.email,
            summary: summarize(data, ["company", "country", "budget", "requirements", "phone"]),
          });
        } else if (flowName === "meeting") {
          payload.purpose = data.purpose || data.requirements || "General consultation"; // backend requires `purpose`
          submit = { type: "meeting", payload };
          doneText = fill(t.meetingDone, {
            email: data.email,
            summary: summarize(data, ["name", "date", "time", "timezone", "requirements", "phone"]),
          });
        } else if (flowName === "application") {
          payload.role = ctx.flow.data.role || "General Application";
          submit = { type: "application", payload };
          doneText = fill(t.applyDone, {
            email: data.email,
            summary: summarize(payload, ["role", "experience", "portfolio", "phone"]),
          });
        } else if (flowName === "handoff") {
          submit = { type: "handoff", payload };
          doneText = fill(t.handoffDone, { email: data.email });
        }

        ctx.flow = null;
        ctx.pendingAction = null;
        replies.push({ text: doneText, quickReplies: t.quickMain });
      }
      return { ctx, replies, submit, needsGeneralAI };
    }
  }

  // ================================================================
  //  NO FLOW — intent detection
  // ================================================================

  // attachment acknowledgement
  if (opts.attachment) {
    const extra = ctx.flow ? "" : "If it's related to a project, our team will review it shortly. 📎";
    replies.push({ text: fill(t.attachmentAck, { name: opts.attachment.name, size: opts.attachment.size, extra }) });
    return { ctx, replies, submit, needsGeneralAI };
  }

  // pending yes/no confirmation
  if (ctx.pendingAction && (YES_RE.test(text) || NO_RE.test(text)) && text.length < 25) {
    if (NO_RE.test(text)) {
      ctx.pendingAction = null;
      replies.push({ text: t.cancelled, quickReplies: t.quickMain });
      return { ctx, replies, submit, needsGeneralAI };
    }
    const action = ctx.pendingAction;
    ctx.pendingAction = null;
    if (action === "lead") {
      replies.push({ text: t.yesQuote });
      replies.push({ text: t.leadIntro });
      ctx.flow = { name: "lead", step: 0, data: {}, retries: 0 };
      return { ctx, replies, submit, needsGeneralAI };
    }
    if (action === "handoff") {
      replies.push({ text: t.yesHandoff });
      ctx.flow = { name: "handoff", step: 0, data: {}, retries: 0 };
      return { ctx, replies, submit, needsGeneralAI };
    }
    if (action === "meeting") {
      replies.push({ text: t.yesMeeting });
      ctx.flow = { name: "meeting", step: 0, data: {}, retries: 0 };
      return { ctx, replies, submit, needsGeneralAI };
    }
  }

  const intent = matchIntent(text);

  // language switch — supports all 6 website languages
  if (intent === "language") {
    const LANG_TRIGGERS = [
      { code: "de", re: /\b(german|deutsch|germany|allemand|alemania|tedesco)\b/i },
      { code: "fr", re: /\b(french|français|france|francés|francese)\b/i },
      { code: "it", re: /\b(italian|italiano|italia|italien|italiano)\b/i },
      { code: "pt", re: /\b(portuguese|portugal|português|portugués|portoghese)\b/i },
      { code: "es", re: /\b(spanish|español|spain|espagnol|espanhol|spagnolo)\b/i },
      { code: "en", re: /\b(english|anglais|inglés|inglese|inglês)\b/i },
      { code: "hi", re: /\b(hindi|हिंदी)\b/i },
    ];
    for (const { code, re } of LANG_TRIGGERS) {
      if (re.test(text) && ctx.lang !== code && T[code]) {
        ctx.lang = code;
        ctx.langLocked = true;
        replies.push({ text: T[code].langSwitched, quickReplies: T[code].quickMain });
        return { ctx, replies, submit, needsGeneralAI };
      }
    }
  }

  // ================================================================
  //  HIGH-PRIORITY CHECKS — before intent switch
  // ================================================================

  // DATE / TIME — deterministic, real runtime values (never Gemini,
  // never hardcoded). Must come before intent switch so questions like
  // "What is today's date?" always get the real date regardless of
  // what the intent matcher returns.
  if (DATE_RE.test(text) || DAY_RE.test(text) || TIME_RE.test(text)) {
    replies.push({ text: getDateTimeResponse(text, lang), quickReplies: t.quickMain });
    if (intent) ctx.lastIntent = intent;
    return { ctx, replies, submit, needsGeneralAI };
  }

  // GENERAL KNOWLEDGE — questions that ask for explanations, trends,
  // definitions, or "how things work" in a general (non-BluConnet)
  // sense. These must go to Gemini even when an intent pattern matches
  // (e.g. "Explain artificial intelligence" matches the AI service
  // pattern but the user wants a general explanation, not a sales pitch).
  // NOTE: company-specific intent phrasing always wins (e.g. "What is
  // BluConnet Media", "Who are you", "your services") — those are about
  // the company, not general knowledge. Service-topic questions
  // ("Tell me about SEO / email marketing / ...") also keep their
  // predefined service response here — GK only overrides explanation-style
  // prompts (explain X, how does X work, ...), which ask for a general
  // explanation rather than the company's offering.
  const COMPANY_CONTEXT_RE =
    /\b(blu ?connet|your (company|services?|work|team|agency)|about (you|us|your company|the company)|who (are|is) (you|bluconnet)|our (company|services?)|this (company|agency|website))\b/i;
  const SERVICE_TOPIC_RE =
    /\b(seo|social media|instagram|facebook|linkedin|email marketing|newsletter|ppc|google ads|website|web design|web development|content|ai|automation|chatbot|lead generation|e-?commerce|analytics|crm|mobile|affiliate)\b/i;
  const EXPLANATION_STYLE_RE =
    /\b(explain\s+.+|how\s+(does|do)\s+.+\s+work|what\s+is\s+the\s+difference\s+between|define\s+.+|in\s+simple\s+(words|terms))|^(why|how)\b/i;
  const GENERAL_KNOWLEDGE_RE =
    /\b(explain\s+.{3,}\s+(in\s+simple\s+(words|terms|language)|briefly|simply)|what\s+(are|is|'s)\s+(the\s+)?(latest|current|top|new)\s+(trends?|updates?|news|developments?)|how\s+(does|do)\s+.{3,}\s+work|what\s+(is|are)\s+.{3,}\s+(exactly|actually|in\s+simple)|define\s+.{3,}|what\s+is\s+the\s+difference\s+between)/i;
  const isServiceTopic = SERVICE_TOPIC_RE.test(text) && !COMPANY_CONTEXT_RE.test(text);
  if (
    GENERAL_KNOWLEDGE_RE.test(text) &&
    !COMPANY_CONTEXT_RE.test(text) &&
    !(isServiceTopic && !EXPLANATION_STYLE_RE.test(text))
  ) {
    needsGeneralAI = true;
    replies.push({ text: t.fallback, quickReplies: t.quickYesNo });
    ctx.pendingAction = "handoff";
    if (intent) ctx.lastIntent = intent;
    return { ctx, replies, submit, needsGeneralAI };
  }

  switch (intent) {
    case "greeting":
      replies.push({ text: ctx.lastIntent ? t.greetingBack : t.greeting, quickReplies: t.quickMain });
      break;

    case "how_are_you":
      replies.push({ text: t.howAreYou, quickReplies: t.quickMain });
      break;

    case "services":
      replies.push({ text: t.services, quickReplies: t.quickServices });
      break;

    case "pricing":
      replies.push({ text: t.pricing, quickReplies: t.quickYesNo });
      ctx.pendingAction = "lead";
      break;

    case "careers": {
      // country filter
      if (/india|kolkata|भारत|कोलकाता/i.test(text)) {
        const list = JOBS.map((j, i) => `${i + 1}. **${j.title}** — ${j.experience}`).join("\n");
        replies.push({ text: `🇮🇳 **Open roles in India (Kolkata — Work From Office):**\n\n${list}\n\nType a role name for details, or say **apply**.`, quickReplies: [...JOBS.slice(0, 4).map((j) => j.title), "📝 How to Apply"] });
      } else if (/\buk\b|united kingdom|britain|लंदन/i.test(text)) {
        const list = JOBS.map((j, i) => `${i + 1}. **${j.title}** — ${j.experience}`).join("\n");
        replies.push({ text: `🇬🇧 **Remote roles (UK):**\n\n${list}\n\nType a role name for details, or say **apply**.`, quickReplies: [...JOBS.slice(0, 4).map((j) => j.title), "📝 How to Apply"] });
      } else if (/\bus\b|usa|united states|america|अमेरिका/i.test(text)) {
        const list = JOBS.map((j, i) => `${i + 1}. **${j.title}** — ${j.experience}`).join("\n");
        replies.push({ text: `🇺🇸 **Remote roles (US):**\n\n${list}\n\nType a role name for details, or say **apply**.`, quickReplies: [...JOBS.slice(0, 4).map((j) => j.title), "📝 How to Apply"] });
      } else {
        replies.push({ text: t.careers, quickReplies: t.quickCareers });
      }
      break;
    }

    case "apply": {
      const job = findJob(text);
      if (job) {
        ctx.lastJobId = job.id;
        replies.push({ text: fill(t.applyRoleChosen, { title: job.title }) });
        ctx.flow = { name: "application", step: 0, data: { role: job.title }, retries: 0 };
      } else {
        const list = JOBS.map((j, i) => `${i + 1}. **${j.title}**`).join("\n");
        replies.push({ text: `${t.applyWhichRole}\n\n${list}`, quickReplies: JOBS.map((j) => j.title) });
      }
      break;
    }

    case "contact":
      replies.push({ text: t.contact, quickReplies: t.quickMain });
      break;

    case "hours":
      replies.push({ text: t.hours, quickReplies: t.quickMain });
      break;

    case "support":
      replies.push({ text: t.support, quickReplies: t.quickYesNo });
      ctx.pendingAction = "handoff";
      break;

    case "seo":
    case "social":
    case "web":
    case "content":
    case "email_mkt":
    case "ppc":
    case "leadgen":
    case "ecommerce":
    case "analytics":
    case "mobile_mkt":
    case "affiliate":
    case "ai": {
      // Intent ids and service ids mostly match, except `email_mkt`→`email`
      // and `mobile_mkt`→`mobile` — map them so the correct predefined
      // service detail is served (never silently fall back to SERVICES[0]).
      const svcId =
        intent === "email_mkt" ? "email" : intent === "mobile_mkt" ? "mobile" : intent;
      const svc = SERVICES.find((s) => s.id === svcId) || SERVICES[0];
      ctx.lastServiceId = svc.id;
      replies.push({ text: svc.detail, quickReplies: t.quickAfterService });
      break;
    }

    case "about":
      replies.push({ text: t.about, quickReplies: t.quickMain });
      break;

    case "faq": {
      const list = FAQS.map((f, i) => `${i + 1}. ${f.q}`).join("\n");
      replies.push({ text: `${t.faqIntro}\n\n${list}`, quickReplies: FAQS.map((f) => f.q.slice(0, 38) + "…") });
      break;
    }

    case "thanks":
      replies.push({ text: t.thanks, quickReplies: t.quickMain });
      break;

    case "bye":
      replies.push({ text: t.bye });
      break;

    case "complaint":
      replies.push({ text: t.complaint, quickReplies: t.quickYesNo });
      ctx.pendingAction = "handoff";
      break;

    case "compliment":
      replies.push({ text: t.compliment, quickReplies: t.quickMain });
      break;

    case "human":
      replies.push({ text: t.human });
      ctx.flow = { name: "handoff", step: 0, data: {}, retries: 0 };
      break;

    case "book":
      replies.push({ text: t.meetingIntro });
      ctx.flow = { name: "meeting", step: 0, data: {}, retries: 0 };
      break;

    case "start_project":
      replies.push({ text: t.leadIntro });
      ctx.flow = { name: "lead", step: 0, data: {}, retries: 0 };
      break;

    default: {
      // fuzzy: maybe they typed a service or job name directly.
      // Short mentions only (<= 6 words): long free-form sentences must
      // never fuzzy-match a service (e.g. "Give me 5 creative birthday
      // ideas" previously matched /creative|idea/ -> Email Marketing).
      const words = text.split(/\s+/).filter(Boolean);
      const svc = words.length <= 6 ? findService(text) : null;
      if (svc) {
        ctx.lastServiceId = svc.id;
        replies.push({ text: svc.detail, quickReplies: t.quickAfterService });
        break;
      }
      const job = findJob(text);
      if (job && /(role|job|position|detail|about|tell|salary|experience|responsibilit)/i.test(text)) {
        ctx.lastJobId = job.id;
        replies.push({ text: jobDetailText(job, lang), quickReplies: ["📝 Apply now", "💼 Other roles"] });
        break;
      }
      // FAQ direct match
      const faqIdx = FAQS.findIndex((f) => {
        const words = f.q.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter((w) => w.length > 3);
        const clean = text.toLowerCase();
        return words.filter((w) => clean.includes(w)).length >= Math.max(2, words.length - 2);
      });
      if (faqIdx >= 0) {
        ctx.lastFaqIndex = faqIdx;
        replies.push({ text: fill(t.faqPick, { answer: FAQS[faqIdx].a }), quickReplies: t.quickMain });
        break;
      }
      // (date/time check moved above the intent switch)
      // fallback — escalate to Gemini (general knowledge) with engine fallback
      needsGeneralAI = true;
      replies.push({ text: t.fallback, quickReplies: t.quickYesNo });
      ctx.pendingAction = "handoff";
    }
  }

  if (intent) ctx.lastIntent = intent;
  return { ctx, replies, submit, needsGeneralAI };
}

/* ------------------------------------------------------------------ */
/*  WELCOME / QUICK ACTIONS                                            */
/* ------------------------------------------------------------------ */

function getWelcome(lang = "en") {
  const t = T[lang] || T.en;
  return { text: t.greeting, quickReplies: t.quickMain, langSwitched: t.langSwitched };
}

function getQuickActions(lang = "en") {
  const t = T[lang] || T.en;
  return t.quickMain.map((label) => ({ label }));
}

function resolveQuickAction(label, lang = "en") {
  const l = String(label).toLowerCase();
  if (/service|सेवा/.test(l)) return "What services do you offer?";
  if (/pric|कीमत|कोटेशन|quote/.test(l)) return "I'd like to know about pricing";
  if (/book|call|कॉल|मीटिंग/.test(l)) return "I want to book a call";
  if (/contact|संपर्क/.test(l)) return "How can I contact you?";
  if (/start|project|प्रोजेक्ट/.test(l)) return "I want to start a project";
  if (/career|job|करियर|नौकरी/.test(l)) return "What job openings do you have?";
  if (/faq|सवाल/.test(l)) return "What are some common questions?";
  if (/seo/.test(l)) return "Tell me about SEO";
  if (/social|सोशल/.test(l)) return "Tell me about social media marketing";
  if (/web|वेब/.test(l)) return "Tell me about website development";
  if (/ai|ऑटोमेशन/.test(l)) return "Tell me about AI automation";
  if (/india|भारत/.test(l)) return "Jobs in India";
  if (/uk|remote \(uk\)/.test(l)) return "Jobs in UK";
  if (/\bus\b|america/.test(l)) return "Jobs in US";
  if (/apply|अप्लाई/.test(l)) return "I want to apply";
  if (/yes|हाँ|हां/.test(l)) return "Yes";
  if (/not now|अभी नहीं/.test(l)) return "No";
  if (/quote|कोटेशन/.test(l)) return "I'd like to get a quote";
  if (/more service|और सेवा/.test(l)) return "What services do you offer?";
  if (/how to apply/.test(l)) return "How do I apply for a job?";
  return label;
}

function findFaqByQuestion(q) {
  return FAQS.findIndex((f) => f.q === q || f.q.startsWith(q.replace(/…$/, "")));
}

export {
  processMessage,
  createInitialContext,
  getWelcome,
  getQuickActions,
  resolveQuickAction,
  findFaqByQuestion,
  getDateTimeResponse,
  SERVICES,
  JOBS,
  FAQS,
  T as TRANSLATIONS,
};




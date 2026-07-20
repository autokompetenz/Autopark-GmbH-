import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLangStore, useThemeStore } from '../store';

const RESPONSES = {
  fr: {
    default:  "Merci pour votre message ! Notre équipe vous répond rapidement.\n📞 +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    horaires: "Nos horaires :\n🕗 Lun–Ven : 08h00 – 18h00\n🕘 Samedi : 09h00 – 14h00\n❌ Dimanche : Fermé",
    prix:     "Nous proposons des tarifs compétitifs pour nos voitures neuves et d'occasion !\nDevis gratuit pour tout achat.\n\n💬 WhatsApp : +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    rdv:      "Pour prendre rendez-vous pour une visite ou un essai :\n\n💬 WhatsApp : +49 174 523 29 45\n📧 info@autopark-gmbh.com\n\nNous répondons rapidement !",
    adresse:  "📍 Notre concessionnaire :\nFranz-Julius-Haenel-Str. 3\n06618 Naumburg, Allemagne\n\n🅿️ Parking gratuit disponible !",
    bonjour:  "Bonjour ! Bienvenue chez Autopark GmbH 👋\n\nComment puis-je vous aider ?\n• Horaires d'ouverture\n• Prendre rendez-vous\n• Tarifs & devis\n• Notre adresse",
    garantie: "Oui ! Nous offrons une garantie sur :\n✅ Tous les véhicules vendus\n✅ Garantie constructeur et étendue\n✅ Service après-vente inclus\nVotre satisfaction est notre priorité !",
    marques:  "Nous proposons TOUTES les marques :\n🚗 BMW, Mercedes, VW, Audi, Toyota...\n⚡ Véhicules électriques & hybrides\n\nContactez-nous : +49 174 523 29 45",
  },
  en: {
    default:  "Thanks for your message! Our team will reply shortly.\n📞 +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    horaires: "Opening hours:\n🕗 Mon–Fri: 08:00 – 18:00\n🕘 Saturday: 09:00 – 14:00\n❌ Sunday: Closed",
    prix:     "We offer competitive pricing for our new and used cars!\nFree quote before any purchase.\n\n💬 WhatsApp: +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    rdv:      "To book an appointment for a visit or test drive:\n\n💬 WhatsApp: +49 174 523 29 45\n📧 info@autopark-gmbh.com\n\nWe respond quickly!",
    adresse:  "📍 Our dealership:\nFranz-Julius-Haenel-Str. 3\n06618 Naumburg, Germany\n\n🅿️ Free parking available!",
    bonjour:  "Hello! Welcome to Autopark GmbH 👋\n\nHow can I help you?\n• Opening hours\n• Book appointment\n• Pricing & quotes\n• Our address",
    garantie: "Yes! We offer warranty on:\n✅ All work carried out\n✅ All parts fitted\n\nYour satisfaction is our priority!",
    marques:  "We work with ALL makes:\n🔧 BMW, Mercedes, VW, Audi, Toyota...\n⚡ Electric & hybrid vehicles\n\nContact us: +49 174 523 29 45",
  },
  de: {
    default:  "Danke für Ihre Nachricht! Unser Team meldet sich bald.\n📞 +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    horaires: "Öffnungszeiten:\n🕗 Mo–Fr: 08:00–18:00\n🕘 Sa: 09:00–14:00\n❌ So: Geschlossen",
    prix:     "Faire & transparente Preise! Kostenloser Kostenvoranschlag.\n\n💬 WhatsApp: +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    rdv:      "Termin vereinbaren:\n\n💬 WhatsApp: +49 174 523 29 45\n📧 info@autopark-gmbh.com",
    adresse:  "📍 Unsere Werkstatt:\nFranz-Julius-Haenel-Str. 3\n06618 Naumburg\n\n🅿️ Kostenlose Parkplätze!",
    bonjour:  "Hallo! Willkommen bei Autopark GmbH 👋\n\nWie kann ich helfen?\n• Öffnungszeiten\n• Termin\n• Preise\n• Adresse",
    garantie: "Ja! Gewährleistung auf:\n✅ Alle Reparaturarbeiten\n✅ Alle verbauten Teile",
    marques:  "Alle Marken willkommen:\n🔧 BMW, Mercedes, VW, Audi...\n⚡ Elektro & Hybrid\n\nKontakt: +49 174 523 29 45",
  },
  ar: {
    default:  "شكراً على رسالتك! سيرد فريقنا قريباً.\n📞 74 232 888 157 49+\n📧 info@autopark-gmbh.com",
    horaires: "ساعات العمل:\n الجمعة-الإثنين: 08:00–18:00\n السبت: 09:00–14:00\n الأحد: مغلق",
    prix:     "أسعار عادلة وشفافة!\nعرض أسعار مجاني قبل أي عمل.\n\n💬 واتساب: 74 232 888 157 49+",
    rdv:      "لحجز موعد:\n\n💬 واتساب: 74 232 888 157 49+\n📧 info@autopark-gmbh.com",
    adresse:  "📍 ورشتنا:\nFranz-Julius-Haenel-Str. 3\n06618 Naumburg، ألمانيا\n\n🅿️ مواقف مجانية!",
    bonjour:  "مرحباً! أهلاً بك في Autopark GmbH 👋\n\nكيف يمكنني مساعدتك?\n• ساعات العمل\n• حجز موعد\n• الأسعار\n• العنوان",
    garantie: "نعم! نقدم ضماناً على:\n✅ جميع الأعمال المنجزة\n✅ جميع قطع الغيار المركبة",
    marques:  "نعمل مع جميع الماركات:\n🔧 BMW, Mercedes, VW, Audi...\n⚡ السيارات الكهربائية والهجينة",
  },
};

const QUICK_BUTTONS = {
  fr: ['Horaires', 'Rendez-vous', 'Adresse', 'Tarifs', 'Garantie'],
  en: ['Opening hours', 'Appointment', 'Address', 'Pricing', 'Warranty'],
  de: ['Öffnungszeiten', 'Termin', 'Adresse', 'Preise', 'Garantie'],
  ar: ['أوقات العمل', 'موعد', 'العنوان', 'الأسعار', 'الضمان'],
};

function detect(msg, lang) {
  const m = msg.toLowerCase();
  const R = RESPONSES[lang] || RESPONSES.fr;
  if (/hello|hallo|bonjour|hi|مرحب|سلام/.test(m)) return R.bonjour;
  if (/heure|horaire|öffnung|hour|open|uhrzeit|ساعة|وقت/.test(m)) return R.horaires;
  if (/prix|preis|price|cost|kosten|tarif|devis|سعر|تكلفة/.test(m)) return R.prix;
  if (/rendez|termin|appoint|rdv|réserv|موعد|حجز/.test(m)) return R.rdv;
  if (/adresse|address|wo|where|lieu|عنوان|أين/.test(m)) return R.adresse;
  if (/garantie|warranty|gewähr|ضمان/.test(m)) return R.garantie;
  if (/marque|brand|make|modèle|model|marke|ماركة|سيارة/.test(m)) return R.marques;
  return R.default;
}

export default function Chatbot() {
  const { lang } = useLangStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const R  = RESPONSES[lang] || RESPONSES.fr;
  const QB = QUICK_BUTTONS[lang] || QUICK_BUTTONS.fr;

  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([{ from: 'bot', text: R.bonjour }]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [notif, setNotif]   = useState(true);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  // Theme-aware colors — no more hardcoded dark values
  const winBg      = isDark ? '#0f0f0f'                 : '#ffffff';
  const winBorder  = isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.1)';
  const msgBotBg   = isDark ? '#1e1e1e'                 : '#f0f0f0';
  const msgBotText = isDark ? '#e8e8e8'                 : '#111111';
  const msgUserText= '#ffffff';
  const inputBg    = isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.04)';
  const inputBorder= isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.12)';
  const inputText  = isDark ? '#e8e8e8'                 : '#111111';
  const inputPh    = isDark ? 'rgba(255,255,255,0.35)'  : 'rgba(0,0,0,0.35)';
  const footerBg   = isDark ? '#141414'                 : '#f8f8f8';
  const footerBord = isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.08)';
  const dotBg      = isDark ? '#555'                    : '#bbb';
  const quickBg    = isDark ? 'rgba(19,40,83,0.08)'    : 'rgba(19,40,83,0.06)';
  const quickBd    = isDark ? 'rgba(19,40,83,0.2)'     : 'rgba(19,40,83,0.25)';
  const quickText  = isDark ? 'rgba(255,255,255,0.7)'   : '#132853';
  const quickHoverBg   = isDark ? 'rgba(19,40,83,0.18)' : 'rgba(19,40,83,0.14)';
  const quickHoverText = '#132853';

  useEffect(() => {
    const R2 = RESPONSES[lang] || RESPONSES.fr;
    setMsgs([{ from: 'bot', text: R2.bonjour }]);
  }, [lang]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) { setNotif(false); setTimeout(() => inputRef.current?.focus(), 300); } }, [open]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMsgs(m => [...m, { from: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', text: detect(msg, lang) }]);
    }, 800 + Math.random() * 600);
  };

  const placeholders  = { fr: 'Votre question...', en: 'Your question...', de: 'Ihre Frage...', ar: 'سؤالك...' };
  const headerStatus  = { fr: 'En ligne · Répond rapidement', en: 'Online · Replies quickly', de: 'Online · Antwortet schnell', ar: 'متصل · يرد بسرعة' };

  return (
    <>
      {/* Trigger button */}
      <button className="chat-btn" onClick={() => setOpen(o => !o)} aria-label="Chat">
        <span style={{ fontSize: 26 }}>{open ? '✕' : '💬'}</span>
        {!open && notif && <div className="chat-notif">1</div>}
      </button>

      {/* Window */}
      <div
        className={`chat-window ${open ? 'open' : 'closed'}`}
        style={{
          background: winBg,
          border: `1px solid ${winBorder}`,
          boxShadow: isDark
            ? '0 20px 60px rgba(0,0,0,0.6)'
            : '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header — always red gradient, always readable */}
        <div style={{ background: 'linear-gradient(135deg, #0E1E3D, #132853)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            🔧
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '0.02em' }}>
              Autopark GmbH
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ width: 7, height: 7, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
              {headerStatus[lang] || headerStatus.fr}
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4 }}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: winBg }}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                maxWidth: '88%',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: "'Outfit', sans-serif",
                background: m.from === 'bot' ? msgBotBg : '#132853',
                color:      m.from === 'bot' ? msgBotText : msgUserText,
                alignSelf:  m.from === 'bot' ? 'flex-start' : 'flex-end',
                borderBottomLeftRadius:  m.from === 'bot'  ? 3 : 12,
                borderBottomRightRadius: m.from === 'user' ? 3 : 12,
              }}
            >
              {m.text}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', gap: 5, padding: '12px 16px', background: msgBotBg, borderRadius: 12, alignSelf: 'flex-start', borderBottomLeftRadius: 3 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width: 7, height: 7, background: dotBg, borderRadius: '50%', display: 'block', animation: 'bounce 1.2s ease infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick replies */}
        {msgs.length <= 2 && (
          <div style={{ padding: '0 14px 12px', display: 'flex', flexWrap: 'wrap', gap: 6, background: winBg }}>
            {QB.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{
                  background: quickBg,
                  border: `1px solid ${quickBd}`,
                  color: quickText,
                  fontSize: 12, fontWeight: 600,
                  padding: '6px 12px', borderRadius: 20,
                  cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = quickHoverBg; e.currentTarget.style.color = quickHoverText; }}
                onMouseOut={e => { e.currentTarget.style.background = quickBg; e.currentTarget.style.color = quickText; }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderTop: `1px solid ${footerBord}`, background: footerBg, flexShrink: 0 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={placeholders[lang] || placeholders.fr}
            style={{
              flex: 1,
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              color: inputText,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#132853'}
            onBlur={e => e.target.style.borderColor = inputBorder}
          />
          {/* Placeholder color via CSS var trick */}
          <style>{`
            .chat-window input::placeholder { color: ${inputPh}; }
            @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-7px)} }
          `}</style>
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            style={{
              background: input.trim() ? '#132853' : (isDark ? 'rgba(19,40,83,0.3)' : 'rgba(19,40,83,0.2)'),
              border: 'none', borderRadius: 8,
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18, flexShrink: 0,
              transition: 'background 0.2s',
            }}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
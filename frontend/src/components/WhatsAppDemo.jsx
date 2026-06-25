import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, MoreVertical, Check, CheckCheck } from 'lucide-react';
import whatsappService from '../services/whatsappService';

const DEMO_MESSAGES = [
  {
    id: 1,
    sender: 'user',
    text: 'Main Savitribai hoon. 52 saal. Vidhwa kisan. Osmanabad MH. Salana aay ₹48,000.',
    time: '10:42 AM',
    delay: 600,
  },
  {
    id: 2,
    sender: 'typing',
    delay: 1400,
    duration: 2200,
  },
  {
    id: 3,
    sender: 'ai',
    text: `Namaste Savitribai Ji! 🙏\n\nAapke liye *9 schemes* mili hain:\n\n1. 🟢 Widow Pension — ₹1,500/month ✅\n2. 🌾 PM-KISAN — ₹6,000/year ✅\n3. 🔥 Free LPG PMUY — ₹1,600 subsidy ✅\n4. 💰 MahaDBT Grant — ₹25,000 ✅\n\nKul fayda: *₹1,37,000*\n\nKya main documents ki list bhejun?\nReply karo: *HAAN*`,
    time: '10:44 AM',
    delay: 3800,
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: '#1F2C34', maxWidth: '200px' }}>
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white/40"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatWhatsAppText(text) {
  return text
    .split('\n')
    .map((line, i) => {
      const formatted = line
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} className="block" />;
    });
}

function ChatBubble({ message, isNew }) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 10, scale: 0.95 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-sm flex-shrink-0">
          🤖
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[78%] ${
          isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
        }`}
        style={{
          background: isUser ? '#005C4B' : '#1F2C34',
          color: '#E9EDEF',
        }}
      >
        {formatWhatsAppText(message.text)}
        <div className={`flex items-center gap-1 mt-1 text-xs text-white/30 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.time}
          {isUser && <CheckCheck size={12} className="text-blue-400" />}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhatsAppDemo({ interactive = false }) {
  const [messages, setMessages] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const [showHaan, setShowHaan] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatRef = useRef(null);
  const demoPlayed = useRef(false);

  // Auto-play demo
  useEffect(() => {
    if (interactive || demoPlayed.current) return;
    demoPlayed.current = true;

    DEMO_MESSAGES.forEach((msg) => {
      if (msg.sender === 'typing') {
        setTimeout(() => setShowTyping(true), msg.delay);
        setTimeout(() => setShowTyping(false), msg.delay + msg.duration);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, { ...msg, isNew: true }]);
          if (msg.sender === 'ai') {
            setTimeout(() => setShowHaan(true), 600);
          }
        }, msg.delay);
      }
    });
  }, [interactive]);

  // Interactive chat
  useEffect(() => {
    if (!interactive) return;
    setChatMessages(whatsappService.getChatHistory());
  }, [interactive]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  useEffect(scrollToBottom, [messages, showTyping, chatMessages]);

  const sendMessage = async () => {
    if (!inputVal.trim() || isSending) return;
    const userMsg = { id: Date.now(), sender: 'user', text: inputVal, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), isNew: true };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setInputVal('');
    setIsSending(true);

    setTimeout(() => {
      const aiText = whatsappService.getSimulatorResponse(userMsg.text);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: aiText, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), isNew: true };
      const finalMessages = [...newMessages, aiMsg];
      setChatMessages(finalMessages);
      whatsappService.saveChatHistory(finalMessages);
      setIsSending(false);
    }, whatsappService.getTypingDelay());
  };

  const handleHaan = () => {
    const haanMsg = { id: Date.now(), sender: 'user', text: 'HAAN', time: '10:44 AM', isNew: true };
    setMessages(prev => [...prev, haanMsg]);
    setShowHaan(false);
    setTimeout(() => {
      const resp = whatsappService.getHaanResponse();
      setMessages(prev => [...prev, { ...resp, isNew: true }]);
    }, 1800);
  };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5"
      style={{ background: '#0B141A', maxWidth: 380, margin: '0 auto' }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {/* WhatsApp header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5" style={{ background: '#1F2C34' }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xl">
          🤖
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">BharatSahayak AI</div>
          <div className="text-secondary text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block" />
            Online — Scheme Bot Active
          </div>
        </div>
        <div className="flex gap-3 text-white/40">
          <Phone size={18} />
          <MoreVertical size={18} />
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={chatRef}
        className="px-3 py-4 overflow-y-auto scrollbar-hide"
        style={{ background: '#0B141A', minHeight: interactive ? 320 : 380, maxHeight: interactive ? 320 : 440 }}
      >
        {/* Date stamp */}
        <div className="text-center text-xs text-white/25 mb-4">
          <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            Today, 10:42 AM
          </span>
        </div>

        {/* Messages */}
        {(interactive ? chatMessages : messages).map((msg) => (
          <ChatBubble key={msg.id} message={msg} isNew={msg.isNew} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {(showTyping || (interactive && isSending)) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        {/* HAAN quick reply */}
        <AnimatePresence>
          {showHaan && !interactive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex justify-center mt-3"
            >
              <button
                onClick={handleHaan}
                className="px-6 py-2 rounded-full text-sm font-bold text-white border border-secondary transition-all hover:scale-105"
                style={{ background: 'rgba(29, 158, 117, 0.2)', borderColor: '#1D9E75' }}
              >
                ✅ HAAN — भेजो documents list
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area (interactive only) */}
      {interactive && (
        <div className="flex items-center gap-2 px-3 py-3 border-t border-white/5" style={{ background: '#1F2C34' }}>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm text-white placeholder-white/30 border border-white/10 outline-none focus:border-secondary/50 transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputVal.trim() || isSending}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ background: '#00A884' }}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

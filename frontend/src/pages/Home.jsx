import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Map, Smartphone, BarChart3, Star, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';
import UserPersona from '../components/UserPersona';
import FeatureCard from '../components/FeatureCard';
import WhatsAppDemo from '../components/WhatsAppDemo';
import Timeline from '../components/Timeline';

const FEATURES = [
  {
    icon: '📅',
    title: 'Life Timeline AI',
    description: 'Predicts future eligibility milestones. Know at age 58 you become eligible for ₹3,000/month senior pension — plan ahead.',
    badge: 'Predictive',
    color: '#7C3AED',
  },
  {
    icon: '🔍',
    title: 'Lost Benefit Detector',
    description: 'AI scans your entire life history and detects benefits you missed in the past 5 years. Retroactively recovers your money.',
    badge: 'AI Powered',
    color: '#E65100',
  },
  {
    icon: '📞',
    title: 'Voice Call Assistant',
    description: 'Our AI calls your basic keypad phone in your language — Hindi, Marathi, Telugu. No smartphone, no internet needed. Works on 2G.',
    badge: 'Works Offline',
    color: '#2196F3',
  },
  {
    icon: '💬',
    title: 'WhatsApp Sync',
    description: 'Your data, secured with a 4-digit PIN only you know. WhatsApp verified. Aadhaar authenticated. No middlemen.',
    badge: 'Seamless Sync',
    color: '#1D9E75',
  },
  {
    icon: '💰',
    title: 'Benefit Wallet',
    description: 'A single dashboard showing all schemes received, pending, and available. Like a bank account for your government benefits.',
    badge: 'Real-time Updates',
    color: '#1D9E75',
  },
];

const REDROB_STATS = [
  { value: '₹2.6L Cr', label: 'Annual unclaimed benefits' },
  { value: '800M+', label: 'Eligible citizens' },
  { value: '30 min', label: 'Setup time at CSC' },
  { value: '₹1.37L', label: 'Avg per-person recovery' },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <Hero />

      {/* Stats */}
      <StatsCounter />

      {/* Personas */}
      <UserPersona />

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Key Features
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl font-black text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              5 Ways BharatSahayak{' '}
              <span className="gradient-text-primary">Changes Everything</span>
            </motion.h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm flex">
                <FeatureCard {...f} index={i} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Demo Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #25D366, transparent)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6B3FA0, transparent)' }} />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: content */}
            <div>
              <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                WhatsApp Bot Demo
              </motion.p>
              <motion.h2
                className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Savitribai Discovers{' '}
                <span className="gradient-text-secondary">₹1,37,000</span>{' '}
                in 2 Minutes
              </motion.h2>
              <motion.p
                className="text-white/55 text-lg leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Savitribai — 52-year-old widow farmer from Osmanabad — sends one WhatsApp message.
                Our AI finds 9 schemes worth ₹1.37 lakh she's eligible for. All in her language.
              </motion.p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: '🌾', text: 'PM-KISAN — ₹6,000/year (3 installments)' },
                  { icon: '👩', text: 'Widow Pension — ₹1,500/month = ₹18,000/year' },
                  { icon: '🔥', text: 'PMUY Free LPG — ₹1,600 subsidy one-time' },
                  { icon: '💰', text: 'MahaDBT Grant — ₹25,000 for farm equipment' },
                ].map(item => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xl w-8">{item.icon}</span>
                    <span className="text-white/70 text-sm">{item.text}</span>
                    <span className="text-secondary ml-auto text-xs font-bold">✓</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/journey" className="btn-secondary inline-flex">
                Try Live Simulator
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: WhatsApp mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <WhatsAppDemo interactive={false} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* No Smartphone Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: 4-step process */}
            <div className="lg:col-span-7 space-y-6">
              <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                100% Offline Access
              </motion.p>
              <motion.h2
                className="text-3xl md:text-5xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                No Smartphone? <span className="text-accent">No Problem.</span>
              </motion.h2>
              <motion.p
                className="text-white/65 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                We believe that public welfare shouldn't require expensive technology. You can access all AI capabilities of BharatSahayak by dialing a toll-free number from any basic keypad phone.
              </motion.p>

              {/* 4-step process timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { step: '1', title: 'Dial Toll-Free', desc: 'Call +1 424 496 5091 from your phone.' },
                  { step: '2', title: 'Choose Language', desc: 'Listen & interact in Hindi or Marathi.' },
                  { step: '3', title: 'Speak to AI', desc: 'Answer simple profile questions.' },
                  { step: '4', title: 'Get SMS Alerts', desc: 'Receive schemes checklist via SMS.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="p-5 rounded-2xl border flex items-start gap-4"
                    style={{ background: '#221E3D', borderColor: '#2E2856' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Phone & Success Story */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border w-full max-w-[360px] text-center space-y-6 shadow-glow-accent/5"
                style={{ background: 'transparent', borderColor: '#2E2856' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto text-accent shadow-glow-accent/25">
                  <Phone size={28} />
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Toll-Free Helpline</p>
                  <a href="tel:+14244965091" className="text-2xl sm:text-3xl font-black text-white hover:text-accent transition-colors">
                    +1 424 496 5091
                  </a>
                </div>

                <div className="p-4 rounded-xl text-left bg-dark/30 border border-dark-border/50 text-xs space-y-2">
                  <span className="text-yellow-400 font-bold">⭐ SUCCESS STORY</span>
                  <p className="text-white/70 leading-relaxed italic">
                    "Ramdas Patil, 68, from a remote village in Maharashtra recovered ₹28,000 in unclaimed agricultural subsidies using just his basic Nokia keypad phone."
                  </p>
                </div>

                <a href="tel:+14244965091" className="btn-primary w-full justify-center" style={{ background: 'linear-gradient(135deg, #E65100, #F7841E)', boxShadow: '0 4px 16px rgba(230, 81, 0, 0.35)' }}>
                  <Phone size={15} />
                  Call Helpline Now
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Integration Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Chat info & Scanner */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-3xl border text-center space-y-5 w-full max-w-[360px] shadow-glow-secondary/10"
                style={{ background: '#221E3D', borderColor: '#2E2856' }}
              >
                {/* Real Twilio QR Scanner Code */}
                <div className="p-3 bg-white rounded-2xl inline-block mx-auto shadow-2xl relative group">
                  <div className="w-44 h-44 relative bg-white flex items-center justify-center p-1.5">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://wa.me/14155238886?text=join%20spent-opinion" 
                      alt="WhatsApp QR Code" 
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    
                    {/* Center WhatsApp Logo Badge */}
                    <div className="absolute w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white">
                      <MessageSquare size={20} className="fill-white stroke-none" />
                    </div>
                  </div>
                </div>

                {/* Twilio Sandbox Info Details */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50 font-semibold text-[11px]">Twilio WhatsApp Sandbox</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Bot
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-white/50 text-[11px]">Number:</span>
                    <span className="text-emerald-400 font-bold text-xs">+1 415 523 8886</span>
                  </div>
                  <div className="flex items-center justify-between text-white font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-white/50 text-[11px]">Send code:</span>
                    <span className="text-amber-300 font-bold text-xs">join spent-opinion</span>
                  </div>
                </div>

                <a 
                  href="https://wa.me/14155238886?text=join%20spent-opinion" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-secondary w-full justify-center text-sm font-bold py-3.5 shadow-glow-secondary/30"
                >
                  <MessageSquare size={18} />
                  Open Twilio WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Right: Info steps */}
            <div className="lg:col-span-7 space-y-6">
              <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                WhatsApp Sync
              </motion.p>
              <motion.h2
                className="text-3xl md:text-5xl font-black text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Get Schemes Directly on <span className="gradient-text-secondary">WhatsApp</span>
              </motion.h2>
              <motion.p
                className="text-white/60 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                No websites to navigate, no complex credentials. Our certified WhatsApp AI Bot connected to Twilio lets you manage your government benefits through simple chat messages.
              </motion.p>

              <div className="space-y-4 pt-4">
                {[
                  { step: '1', title: 'Scan or Tap', text: 'Scan the QR scanner code with your phone or click the button to open WhatsApp.' },
                  { step: '2', title: 'Connect to Twilio Bot', text: 'Send the message "join spent-opinion" to activate your chat session with +1 415 523 8886.' },
                  { step: '3', title: 'Instant AI Scheme Match', text: 'Receive your personalized document checklist and government scheme matches instantly.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/30 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="w-7 h-7 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-0.5">{item.title}</h4>
                      <p className="text-white/60 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — Timeline */}
      <Timeline />

      {/* Redrob banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(29, 158, 117, 0.1))', border: '1px solid rgba(124, 58, 237, 0.3)' }}
          >
            {/* Background shimmer */}
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(107, 63, 160, 0.05) 100%)' }} />

            <div className="relative z-10">
              <div className="text-5xl mb-4">🏆</div>
              <div className="badge bg-accent/15 text-accent mb-4 text-sm px-4 py-1.5">
                <Star size={12} className="fill-accent" /> Redrob Ideathon 2026
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Built for Track 3:{' '}
                <span className="gradient-text-secondary">AI for Social Impact</span>
              </h2>
              <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto">
                Team Binary Builders — PawanSingh Bhandari & Rahul Bramhankar — solving one of India's biggest public welfare gaps.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {REDROB_STATS.map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="font-black text-xl gradient-text-primary">{stat.value}</div>
                    <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn-primary inline-flex">
                Meet Team Binary Builders
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

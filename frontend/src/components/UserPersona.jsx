import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Wifi, WifiOff, IndianRupee } from 'lucide-react';

const PERSONAS = [
  {
    id: 'savitribai',
    name: 'Savitribai Patil',
    age: 52,
    emoji: '👩‍🌾',
    role: 'Widow Farmer',
    location: 'Osmanabad, Maharashtra',
    income: '₹48,000/year',
    internet: false,
    schemes: 9,
    totalBenefit: '₹1,37,000',
    phone: 'Basic Jio keypad',
    challenge: 'No smartphone, no internet, no awareness of widow benefits.',
    solution: 'WhatsApp Bot on feature phone + Voice Call in Marathi.',
    color: '#6B3FA0',
    accentColor: '#C9A9E9',
    avatarBg: 'from-purple-800 to-purple-600',
    tags: ['Farmer', 'Widow', 'No Internet'],
  },
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    age: 19,
    emoji: '🧑‍🎓',
    role: 'First-Gen Student',
    location: 'Meerut, Uttar Pradesh',
    income: '₹2.2L/year (family)',
    internet: true,
    schemes: 6,
    totalBenefit: '₹85,000',
    phone: 'Android smartphone',
    challenge: 'Missed scholarship deadlines due to lack of information.',
    solution: 'WhatsApp reminders + Document checklist in Hindi.',
    color: '#2196F3',
    accentColor: '#90CAF9',
    avatarBg: 'from-blue-800 to-blue-600',
    tags: ['Student', 'Youth', 'Scholarship'],
  },
  {
    id: 'rahul',
    name: 'Rahul Meena',
    age: 34,
    emoji: '👨‍💼',
    role: 'Street Vendor',
    location: 'Jaipur, Rajasthan',
    income: '₹1.8L/year',
    internet: true,
    schemes: 7,
    totalBenefit: '₹2,10,000',
    phone: 'Android smartphone',
    challenge: 'MUDRA loan rejected twice due to wrong documents.',
    solution: 'AI document guide + Loan eligibility checker.',
    color: '#1D9E75',
    accentColor: '#80CBC4',
    avatarBg: 'from-teal-800 to-teal-600',
    tags: ['Urban', 'Business', 'Loan Eligible'],
  },
];

function PersonaCard({ persona, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7 }}
      whileHover={{ y: -8 }}
      className="relative rounded-2xl border overflow-hidden group cursor-default"
      style={{ background: '#1A1A26', borderColor: '#2A2A3E' }}
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${persona.color}, ${persona.accentColor})` }} />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 60px ${persona.color}10` }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.avatarBg} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
            {persona.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{persona.name}</h3>
            <p className="text-sm font-medium" style={{ color: persona.color }}>{persona.role}</p>
            <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
              📍 {persona.location}
            </p>
          </div>
          {/* Internet status */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            persona.internet ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
          }`}>
            {persona.internet ? <Wifi size={11} /> : <WifiOff size={11} />}
            {persona.internet ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(26, 26, 38, 0.8)', border: '1px solid #2A2A3E' }}>
            <div className="text-xs text-white/40 mb-0.5">Schemes Eligible</div>
            <div className="font-bold text-white" style={{ color: persona.color }}>{persona.schemes}</div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(26, 26, 38, 0.8)', border: '1px solid #2A2A3E' }}>
            <div className="text-xs text-white/40 mb-0.5">Total Benefit</div>
            <div className="font-bold text-secondary rupee text-sm">{persona.totalBenefit}</div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(26, 26, 38, 0.8)', border: '1px solid #2A2A3E' }}>
            <div className="text-xs text-white/40 mb-0.5">Annual Income</div>
            <div className="font-bold text-white text-sm">{persona.income}</div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(26, 26, 38, 0.8)', border: '1px solid #2A2A3E' }}>
            <div className="text-xs text-white/40 mb-0.5 flex items-center gap-1"><Smartphone size={9} /> Phone</div>
            <div className="font-bold text-white text-xs leading-tight">{persona.phone}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {persona.tags.map(tag => (
            <span key={tag} className="badge text-xs px-2.5 py-1" style={{ background: `${persona.color}18`, color: persona.accentColor }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Challenge + Solution */}
        <div className="space-y-2 mb-5">
          <div className="flex gap-2">
            <span className="text-accent text-xs mt-0.5">⚠</span>
            <p className="text-white/50 text-xs leading-relaxed">{persona.challenge}</p>
          </div>
          <div className="flex gap-2">
            <span className="text-secondary text-xs mt-0.5">✓</span>
            <p className="text-white/70 text-xs leading-relaxed">{persona.solution}</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border group/btn"
          style={{ borderColor: `${persona.color}40`, color: persona.accentColor }}
          onMouseEnter={e => { e.currentTarget.style.background = `${persona.color}18`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          View {persona.name.split(' ')[0]}'s Wallet
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function UserPersona() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Who We Serve
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real People.{' '}
            <span className="gradient-text-secondary">Real Benefits.</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From widowed farmers in Osmanabad to students in Meerut — BharatSahayak reaches everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PERSONAS.map((persona, i) => (
            <PersonaCard key={persona.id} persona={persona} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

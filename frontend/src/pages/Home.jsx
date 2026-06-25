import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Map, Smartphone, BarChart3, Star } from 'lucide-react';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';
import UserPersona from '../components/UserPersona';
import FeatureCard from '../components/FeatureCard';
import WhatsAppDemo from '../components/WhatsAppDemo';
import Timeline from '../components/Timeline';

const FEATURES = [
  {
    icon: '📱',
    title: 'Zero Internet Call Bot',
    description: 'Our AI calls your basic keypad phone in your language — Hindi, Marathi, Telugu. No smartphone, no internet needed. Works on 2G.',
    badge: 'Works Offline',
    color: '#25D366',
  },
  {
    icon: '🔍',
    title: 'Lost Benefit Detector',
    description: 'AI scans your entire life history and detects benefits you missed in the past 5 years. Retroactively recovers your money.',
    badge: 'AI Powered',
    color: '#E65100',
  },
  {
    icon: '📅',
    title: 'Life Timeline AI',
    description: 'Predicts future eligibility milestones. Know at age 58 you become eligible for ₹3,000/month senior pension — plan ahead.',
    badge: 'Predictive',
    color: '#6B3FA0',
  },
  {
    icon: '🔐',
    title: 'WhatsApp + Aadhaar PIN',
    description: 'Your data, secured with a 4-digit PIN only you know. WhatsApp verified. Aadhaar authenticated. No middlemen.',
    badge: 'Bank-Grade Security',
    color: '#2196F3',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
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
            style={{ background: 'linear-gradient(135deg, rgba(107, 63, 160, 0.15), rgba(29, 158, 117, 0.1))', border: '1px solid rgba(107, 63, 160, 0.3)' }}
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

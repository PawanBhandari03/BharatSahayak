import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ──────────────── New 7-step website-first journey ────────────────
const JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Open BharatSahayak Website',
    description: 'Visit bharatsahayak.in on any browser — mobile or desktop. No app download needed. Works even on slow 2G connections.',
    icon: '🌐',
    color: '#6B3FA0',
    detail: 'Fully responsive · Works on any phone browser',
    tech: null,
  },
  {
    step: 2,
    title: 'Click "Check My Benefits"',
    description: 'Tap the green button on the homepage. Redirected to a simple 2-minute registration form. No prior account needed.',
    icon: '👆',
    color: '#9353D3',
    detail: '2-minute setup · No documents needed upfront',
    tech: 'React Form',
  },
  {
    step: 3,
    title: 'Fill Your Profile Form',
    description: 'Enter: Name, Age, State, Occupation (dropdown), Annual Income, Category (SC/ST/OBC/General), Mobile number, Family size. All in simple English or Hindi.',
    icon: '📝',
    color: '#2196F3',
    detail: '8 fields · Dropdown-based · No typing errors',
    tech: 'MongoDB',
  },
  {
    step: 4,
    title: 'Verify Mobile via OTP',
    description: 'Enter your mobile number. Receive a 6-digit OTP via SMS (Twilio). Verify in 30 seconds. Creates your Twilio WhatsApp channel automatically.',
    icon: '📱',
    color: '#25D366',
    detail: 'SMS OTP via Twilio · WhatsApp bot activated',
    tech: 'Twilio SMS',
  },
  {
    step: 5,
    title: 'Create Your 4-Digit PIN',
    description: 'Set a private 4-digit security PIN. This PIN protects your Benefit Wallet — use it to login from any device anytime. Never shared with anyone.',
    icon: '🔐',
    color: '#FF9800',
    detail: 'PIN stored hashed · Bank-grade security',
    tech: 'Aadhaar PIN System',
  },
  {
    step: 6,
    title: 'AI Finds Your Schemes + Sends WhatsApp',
    description: 'Claude AI cross-matches your profile against 1000+ scheme rules in real-time. Sends matched schemes list on WhatsApp in your language (Hindi/Marathi/English). Voice call scheduled.',
    icon: '🤖',
    color: '#E65100',
    detail: 'Claude API · Real-time matching · WhatsApp alert',
    tech: 'Claude API + Twilio WhatsApp',
  },
  {
    step: 7,
    title: 'Track Benefits in Wallet Dashboard',
    description: 'Login with Mobile + PIN to your Benefit Wallet. See received, pending, and available benefits. Get deadline reminders. Apply for schemes with one click — direct link to official portals.',
    icon: '💰',
    color: '#1D9E75',
    detail: 'Real-time dashboard · Deadline alerts · Direct apply links',
    tech: 'React + MongoDB',
  },
];

// ──────────────── Vertical Timeline (Journey page) ────────────────
export function VerticalTimeline({ activeStep = -1 }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[28px] top-8 bottom-8 w-0.5"
        style={{ background: 'linear-gradient(180deg, #6B3FA0, #1D9E75)' }} />

      <div className="space-y-6">
        {JOURNEY_STEPS.map((step, i) => {
          const isActive = activeStep >= i;
          const isCurrent = activeStep === i;

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative flex gap-5"
            >
              {/* Step circle */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-500"
                  style={{
                    background: isActive ? `${step.color}20` : '#221E3D',
                    borderColor: isActive ? step.color : '#2E2856',
                    boxShadow: isCurrent ? `0 0 20px ${step.color}40` : 'none',
                  }}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {step.icon}
                </motion.div>
                {/* Step number badge */}
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`font-bold text-base transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {step.title}
                  </h3>
                  {step.tech && (
                    <span className="badge text-xs px-2 py-0.5 flex-shrink-0"
                      style={{ background: `${step.color}15`, color: step.color }}>
                      {step.tech}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed mb-2 transition-colors duration-300 ${isActive ? 'text-white/65' : 'text-white/30'}`}>
                  {step.description}
                </p>
                <span className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: `${step.color}12`, color: step.color }}>
                  💡 {step.detail}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────── Horizontal Steps (Home page) ────────────────
export default function Timeline() {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.p className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            How It Works
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Website → Benefits{' '}
            <span className="gradient-text-secondary">in 7 Steps</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Open the website, fill a 2-minute form, verify your mobile — done.
            AI does the rest while you sleep.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 mx-16"
            style={{ background: 'linear-gradient(90deg, #6B3FA0, #1D9E75)' }} />

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-2">
            {JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.15, y: -4 }}
                  className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center mb-3 border-2 transition-all duration-300 cursor-default"
                  style={{ background: `${step.color}15`, borderColor: `${step.color}40` }}
                >
                  <span className="text-2xl mb-0.5">{step.icon}</span>
                  <span className="text-xs font-bold" style={{ color: step.color }}>0{step.step}</span>
                </motion.div>
                <h4 className="text-white font-semibold text-xs md:text-sm leading-tight mb-1">{step.title}</h4>
                <p className="text-white/30 text-xs leading-relaxed hidden md:block">{step.description.slice(0, 48)}...</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link to="/register" className="btn-secondary inline-flex text-base px-8 py-4">
            Start Now — It's Free
            <span className="ml-2">→</span>
          </Link>
          <p className="text-white/25 text-xs mt-3">No app download · Works on any phone · 2 minutes</p>
        </motion.div>
      </div>
    </section>
  );
}

// ──────────────── Life Timeline (Dashboard, horizontal scroll) ────────────────
export function LifeTimeline({ milestones }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-4 min-w-max px-1">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex-shrink-0 w-52 p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-default"
            style={{
              background: m.type === 'current' ? `${m.color}15` : '#221E3D',
              borderColor: m.type === 'current' ? m.color : '#2E2856',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-lg" style={{ color: m.color }}>{m.year}</span>
              <span className="text-xs text-white/30">Age {m.age}</span>
            </div>
            <span className={`badge text-xs mb-2 ${
              m.type === 'current' ? 'bg-secondary/15 text-secondary' :
              m.type === 'upcoming' ? 'bg-blue-500/15 text-blue-400' :
              'bg-white/5 text-white/30'
            }`}>
              {m.type === 'current' ? '🟢 Active' : m.type === 'upcoming' ? '🔵 Upcoming' : '🔮 Future'}
            </span>
            <p className="text-white/80 text-sm font-medium leading-snug">{m.event}</p>
            {m.source && (
              <p className="text-white/20 text-xs mt-2 truncate">📋 {m.source}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

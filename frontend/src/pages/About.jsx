import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Code2, Database, MessageSquare, ShieldCheck, Cpu, Zap, Target, Heart, ArrowRight, ExternalLink, Star } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const TEAM = [
  {
    name: 'PawanSingh Bhandari',
    role: 'Full-Stack Engineer + AI',
    username: 'PawanBhandari03',
    avatar: 'P',
    emoji: '👨‍💻',
    color: '#7C3AED',
    bg: 'from-purple-900 to-purple-700',
    skills: ['React', 'Node.js', 'Claude API', 'MongoDB'],
    contribution: 'Built the AI scheme matching engine, WhatsApp integration, and Benefit Wallet.',
    github: 'https://github.com/PawanBhandari03',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Rahul Bramhankar',
    role: 'Backend + Infrastructure',
    username: 'Rahul_Dev',
    avatar: 'R',
    emoji: '⚙️',
    color: '#1D9E75',
    bg: 'from-teal-900 to-teal-700',
    skills: ['Node.js', 'Twilio', 'Aadhaar API', 'DevOps'],
    contribution: 'Built the voice call system, Aadhaar PIN authentication, and CSC integration layer.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
];

const TECH_STACK = [
  { icon: Code2, label: 'React 18 + Vite', category: 'Frontend', color: '#61DAFB' },
  { icon: Database, label: 'Node.js + Express', category: 'Backend', color: '#68A063' },
  { icon: Database, label: 'MongoDB Atlas', category: 'Database', color: '#47A248' },
  { icon: MessageSquare, label: 'Twilio WhatsApp API', category: 'Messaging', color: '#F22F46' },
  { icon: Cpu, label: 'Claude API (Anthropic)', category: 'AI Engine', color: '#CC785C' },
  { icon: ShieldCheck, label: 'Aadhaar PIN System', category: 'Auth', color: '#FF6B35' },
];

const PROBLEM_STATS = [
  { value: 2.6, suffix: 'L Cr', label: 'Unclaimed annually', color: '#E65100' },
  { value: 800, suffix: 'M+', label: 'Eligible Indians', color: '#7C3AED' },
  { value: 5, prefix: '<', suffix: '%', label: 'Awareness rate', color: '#2196F3' },
  { value: 43000, prefix: '₹', label: 'Avg per person', color: '#1D9E75' },
];

function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.7 }}
      whileHover={{ y: -6 }}
      className="rounded-2xl border overflow-hidden group"
      style={{ background: '#221E3D', borderColor: '#2E2856' }}
    >
      {/* Cover */}
      <div className={`h-32 bg-gradient-to-br ${member.bg} relative flex items-center justify-center`}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
        <span className="text-5xl">{member.emoji}</span>
      </div>

      <div className="px-6 pb-6 -mt-6">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white border-4 mb-4"
          style={{ background: member.color, borderColor: '#221E3D' }}
        >
          {member.avatar}
        </div>

        <h3 className="text-white font-bold text-xl mb-0.5">{member.name}</h3>
        <p className="font-medium text-sm mb-1" style={{ color: member.color }}>{member.role}</p>
        <p className="text-white/30 text-xs mb-4">@{member.username}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.skills.map(skill => (
            <span key={skill} className="badge text-xs px-2.5 py-1" style={{ background: `${member.color}18`, color: member.color }}>
              {skill}
            </span>
          ))}
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-5">{member.contribution}</p>

        {/* Social links */}
        <div className="flex gap-2">
          <a href={member.github} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white border border-dark-border hover:border-primary/40 transition-all">
            <Github size={13} /> GitHub
          </a>
          <a href={member.linkedin} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white border border-dark-border hover:border-primary/40 transition-all">
            <Linkedin size={13} /> LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProblemStat({ stat, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-6 rounded-2xl border"
      style={{ background: `${stat.color}08`, borderColor: `${stat.color}30` }}
    >
      <div className="text-3xl font-black rupee mb-1" style={{ color: stat.color }}>
        {stat.prefix && <span>{stat.prefix}</span>}
        {inView ? (
          <CountUp end={stat.value} duration={2} separator="," decimals={stat.value < 10 ? 1 : 0} />
        ) : '0'}
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div className="text-white/60 text-sm">{stat.label}</div>
    </motion.div>
  );
}

export default function About() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl mb-6"
          >
            🏆
          </motion.div>
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Team Binary Builders
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Building AI for{' '}
            <span className="gradient-text-secondary">Bharat's Bottom Billion</span>
          </motion.h1>
          <motion.p
            className="text-white/55 text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            We're two engineers who believe technology should solve real problems —
            not just for those with smartphones, but for every Indian citizen.
          </motion.p>

          {/* Redrob badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mt-8"
            style={{ background: 'rgba(230, 81, 0, 0.1)', borderColor: 'rgba(230, 81, 0, 0.4)' }}
          >
            <Star size={16} className="text-accent fill-accent" />
            <span className="text-white font-semibold">Redrob Ideathon 2026</span>
            <span className="text-accent font-bold">Track 3: AI for Social Impact</span>
          </motion.div>
        </div>

        {/* Team */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl font-black text-white mb-2 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Meet the Team
          </motion.h2>
          <p className="text-white/40 text-center mb-10">Two builders. One mission. Zero compromises.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </section>

        {/* Problem statement */}
        <section className="mb-20">
          <div className="rounded-3xl p-8 md:p-12 border" style={{ background: '#12121A', borderColor: '#2A2A3E' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="section-label">The Problem</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                India's Biggest{' '}
                <span className="gradient-text-primary">Welfare Failure</span>
              </h2>
              <p className="text-white/55 text-lg max-w-2xl mx-auto">
                The Indian government spends ₹15+ lakh crore annually on welfare. Yet, less than 5% of eligible citizens know about all the schemes they qualify for.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {PROBLEM_STATS.map((stat, i) => <ProblemStat key={stat.label} stat={stat} index={i} />)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: '🔍', title: 'Discovery Problem', text: 'Schemes are buried in government portals — no single discovery engine exists.' },
                { icon: '📱', title: 'Access Problem', text: '67% of rural India has no smartphone. Applications require internet they don\'t have.' },
                { icon: '🗣️', title: 'Language Problem', text: 'Most scheme information is in English or urban Hindi — inaccessible to local dialects.' },
              ].map(item => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-xl border"
                  style={{ background: '#221E3D', borderColor: '#2E2856' }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl font-black text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our <span className="gradient-text-primary">Tech Stack</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TECH_STACK.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 p-4 rounded-xl border"
                  style={{ background: '#221E3D', borderColor: '#2E2856' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${tech.color}18` }}>
                    <Icon size={20} style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{tech.label}</div>
                    <div className="text-white/35 text-xs">{tech.category}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Mission */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-3xl p-10 border relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(107, 63, 160, 0.12), rgba(29, 158, 117, 0.08))', borderColor: 'rgba(107, 63, 160, 0.3)' }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Our Mission</h2>
            <blockquote className="text-xl text-white/70 italic max-w-2xl mx-auto leading-relaxed mb-6">
              "AI that finds what the government owes you —<br/>
              before you even know to ask."
            </blockquote>
            <p className="text-white/45 text-sm mb-8 max-w-xl mx-auto">
              We believe every Indian citizen deserves to access every benefit they're entitled to —
              regardless of education, language, or internet access. BharatSahayak is our answer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="btn-secondary">
                View Demo Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link to="/schemes" className="btn-ghost">
                Explore All Schemes
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}

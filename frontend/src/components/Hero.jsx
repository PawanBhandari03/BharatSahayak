import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';

// Animated SVG India map with pulsing scheme nodes
function IndiaMapSVG() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 400 480" className="w-full max-w-2xl h-auto" fill="none">
        {/* Simplified India outline */}
        <path
          d="M200 20 L240 30 L280 50 L310 80 L330 120 L340 160 L330 200 L310 240 L280 270 L260 300 L240 330 L220 370 L200 410 L185 430 L170 410 L155 380 L140 340 L120 300 L100 260 L80 220 L70 180 L80 140 L100 100 L130 70 L160 45 Z"
          stroke="url(#mapGrad)"
          strokeWidth="1.5"
          fill="url(#mapFill)"
        />
        <defs>
          <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B3FA0" />
            <stop offset="100%" stopColor="#1D9E75" />
          </linearGradient>
          <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B3FA0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Pulsing nodes — scheme hotspots */}
        {[
          { cx: 200, cy: 180, label: 'Delhi' },
          { cx: 160, cy: 250, label: 'Mumbai' },
          { cx: 250, cy: 230, label: 'Kolkata' },
          { cx: 180, cy: 330, label: 'Bengaluru' },
          { cx: 220, cy: 150, label: 'Chandigarh' },
          { cx: 130, cy: 200, label: 'Rajasthan' },
          { cx: 270, cy: 180, label: 'Bihar' },
        ].map((node, i) => (
          <g key={node.label}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="12"
              fill="#6B3FA0"
              opacity="0.1"
              style={{ animation: `pingRing ${1.5 + i * 0.3}s ease-out infinite`, animationDelay: `${i * 0.4}s` }}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="#9353D3"
              opacity="0.8"
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="2"
              fill="#C9A9E9"
            />
          </g>
        ))}

        {/* Connection lines */}
        {[
          [200, 180, 160, 250],
          [200, 180, 250, 230],
          [160, 250, 180, 330],
          [200, 180, 220, 150],
          [200, 180, 130, 200],
          [200, 180, 270, 180],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#6B3FA0"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        ))}
      </svg>
    </div>
  );
}

// Floating rupee badge
function FloatingBadge({ text, className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute glass px-4 py-2 rounded-xl text-sm font-semibold shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      style={{ animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      {text}
    </motion.div>
  );
}

const WORDS_HEADLINE = ['₹2.6', 'Lakh', 'Crore', 'Goes', 'Unclaimed', 'Every', 'Year.'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(107, 63, 160, 0.15) 0%, transparent 70%)' }} />
      </div>

      {/* India map background */}
      <IndiaMapSVG />

      {/* Floating badges */}
      <FloatingBadge text="✅ PM-KISAN ₹6,000" className="hidden xl:flex top-32 left-16 text-secondary" delay={1.2} />
      <FloatingBadge text="🏥 Ayushman ₹5L" className="hidden xl:flex top-48 right-16 text-blue-400" delay={1.6} />
      <FloatingBadge text="🏠 PMAY ₹1.30L" className="hidden xl:flex bottom-48 left-20 text-accent" delay={2} />
      <FloatingBadge text="📱 WhatsApp Bot" className="hidden xl:flex bottom-40 right-20 text-secondary" delay={2.4} />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
          style={{ background: 'rgba(107, 63, 160, 0.15)', borderColor: 'rgba(107, 63, 160, 0.4)', color: '#C9A9E9' }}
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          🏆 Redrob Ideathon 2026 — Track 3: AI for Social Impact
        </motion.div>

        {/* Word-by-word headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-balance">
          {WORDS_HEADLINE.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-3 mb-2 ${
                word === '₹2.6' ? 'gradient-text-secondary rupee text-6xl md:text-8xl' :
                word === 'Unclaimed' ? 'gradient-text-primary' :
                word === 'Year.' ? 'text-accent' : 'text-white'
              }`}
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-white/60 mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          BharatSahayak makes sure{' '}
          <span className="text-white font-semibold">yours reaches you.</span>
        </motion.p>

        {/* Hindi subtitle */}
        <motion.p
          className="hindi text-lg text-white/35 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          AI जो सरकारी योजनाएं आपके दरवाज़े तक पहुंचाए — बिना इंटरनेट, बिना झंझट
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <Link to="/register" className="btn-secondary text-base px-8 py-4 shadow-glow-secondary">
            <span>Check My Benefits</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/journey" className="btn-ghost text-base px-8 py-4">
            <Play size={16} className="fill-current" />
            <span>See How It Works</span>
          </Link>
        </motion.div>

        {/* Trust stat strip */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
        >
          {[
            { value: '1000+', label: 'Schemes Mapped' },
            { value: '80 Cr', label: 'Eligible Indians' },
            { value: '₹43,000', label: 'Avg Unclaimed/Person' },
            { value: '<5%', label: 'Current Awareness' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{value}</span>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}

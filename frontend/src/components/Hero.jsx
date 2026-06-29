import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import WhatsAppDemo from './WhatsAppDemo';

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

// Floating scheme badge with vibrant design and continuous floating motion
function FloatingBadge({ icon, title, amount, className, delay = 0, duration = 5, floatY = 14, borderGlow = 'rgba(124, 58, 237, 0.3)', badgeBg = 'rgba(26, 20, 51, 0.88)' }) {
  return (
    <motion.div
      className={`absolute flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -floatY, 0, floatY * 0.6, 0],
        rotate: [0, 1.8, 0, -1.8, 0]
      }}
      transition={{
        opacity: { delay, duration: 0.8 },
        scale: { delay, duration: 0.8 },
        y: { repeat: Infinity, duration: duration, ease: "easeInOut", delay: delay },
        rotate: { repeat: Infinity, duration: duration * 1.3, ease: "easeInOut", delay: delay }
      }}
      style={{
        background: badgeBg,
        borderColor: borderGlow,
        boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px 0 ${borderGlow}`
      }}
    >
      <span className="text-xl sm:text-2xl flex items-center justify-center shrink-0">{icon}</span>
      <div className="flex flex-col text-left">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-white/70 leading-tight">{title}</span>
        <span className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight">{amount}</span>
      </div>
    </motion.div>
  );
}

const WORDS_HEADLINE = ['₹2.6', 'Lakh', 'Crore', 'Goes', 'Unclaimed', 'Every', 'Year.'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)' }} />
      </div>

      {/* India map background */}
      <IndiaMapSVG />

      {/* Floating scheme badges - Vibrant, moving background elements */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-0 overflow-hidden">
        {/* Top Left: PM-KISAN */}
        <FloatingBadge 
          icon="🌽" 
          title="PM-KISAN" 
          amount="₹6,000 / year" 
          className="hidden md:flex top-24 left-4 xl:left-2 text-emerald-400" 
          delay={0.4} 
          duration={5.5}
          floatY={14}
          borderGlow="rgba(29, 158, 117, 0.45)"
        />
        
        {/* Top Right: Ayushman Bharat */}
        <FloatingBadge 
          icon="🏥" 
          title="Ayushman Bharat" 
          amount="₹5 Lakh Cover" 
          className="hidden md:flex top-24 right-4 xl:right-2 text-sky-400" 
          delay={0.8} 
          duration={6.2}
          floatY={16}
          borderGlow="rgba(56, 189, 248, 0.45)"
        />

        {/* Center-Top / Upper Center Gap: PM Ujjwala */}
        <FloatingBadge 
          icon="🔥" 
          title="Free LPG PMUY" 
          amount="₹1,600 Subsidy" 
          className="hidden lg:flex top-20 left-1/2 -translate-x-1/2 text-amber-400" 
          delay={1.2} 
          duration={5.8}
          floatY={12}
          borderGlow="rgba(245, 158, 11, 0.45)"
        />

        {/* Middle Center (Between text and mockup): MahaDBT Grant */}
        <FloatingBadge 
          icon="💰" 
          title="MahaDBT Grant" 
          amount="₹25,000 Benefit" 
          className="hidden xl:flex top-1/2 left-[56%] -translate-y-1/2 text-purple-300" 
          delay={1.5} 
          duration={6.5}
          floatY={18}
          borderGlow="rgba(168, 85, 247, 0.45)"
        />

        {/* Bottom Left: PMAY */}
        <FloatingBadge 
          icon="🏠" 
          title="PMAY Housing" 
          amount="₹1.30 Lakh" 
          className="hidden md:flex bottom-16 left-4 xl:left-4 text-orange-400" 
          delay={1.8} 
          duration={5.2}
          floatY={15}
          borderGlow="rgba(230, 81, 0, 0.45)"
        />

        {/* Bottom Center / Right: Widow Pension */}
        <FloatingBadge 
          icon="👵" 
          title="Widow Pension" 
          amount="₹1,500 / month" 
          className="hidden lg:flex bottom-14 right-1/3 text-teal-300" 
          delay={2.1} 
          duration={6.0}
          floatY={13}
          borderGlow="rgba(45, 212, 191, 0.45)"
        />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Ideathon Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border"
              style={{ background: 'rgba(124, 58, 237, 0.12)', borderColor: 'rgba(124, 58, 237, 0.3)', color: '#DDD6FE' }}
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              🏆 Redrob Ideathon 2026 — Track 3: AI for Social Impact
            </motion.div>

            {/* Word-by-word headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-balance">
              {WORDS_HEADLINE.map((word, i) => (
                <motion.span
                  key={i}
                  className={`inline-block mr-2.5 sm:mr-3 mb-1.5 sm:mb-2 ${
                    word === '₹2.6' ? 'gradient-text-secondary rupee text-5xl sm:text-6xl md:text-7xl lg:text-8xl' :
                    word === 'Unclaimed' ? 'gradient-text-primary' :
                    word === 'Year.' ? 'text-accent' : 'text-white'
                  }`}
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              BharatSahayak makes sure{' '}
              <span className="text-white font-semibold">yours reaches you.</span>
            </motion.p>

            {/* Hindi subtitle */}
            <motion.p
              className="hindi text-base sm:text-lg text-white/45 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              AI जो सरकारी योजनाएं आपके दरवाज़े तक पहुंचाए — बिना इंटरनेट, बिना झंझट
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <Link to="/register" className="btn-secondary text-base px-8 py-4 shadow-glow-secondary justify-center text-center">
                <span>Check My Benefits</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/journey" className="btn-ghost text-base px-8 py-4 justify-center text-center">
                <Play size={16} className="fill-current" />
                <span>See How It Works</span>
              </Link>
            </motion.div>

            {/* Trust stat strip */}
            <motion.div
              className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 text-sm text-white/40 border-t border-white/5 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {[
                { value: '1000+', label: 'Schemes Mapped' },
                { value: '80 Cr', label: 'Eligible Indians' },
                { value: '₹43,000', label: 'Avg Unclaimed/Person' },
                { value: '<5%', label: 'Current Awareness' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-white font-black text-lg">{value}</span>
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Live Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <motion.div
              className="relative w-full max-w-[340px] sm:max-w-[360px]"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            >
              {/* Outer decorative phone shell glow */}
              <div className="absolute inset-0 rounded-[36px] bg-primary/20 blur-xl -z-10" />
              
              <div className="rounded-[36px] border border-white/10 p-2.5 bg-black shadow-glow-primary/20">
                <WhatsAppDemo interactive={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest">Explore</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
}

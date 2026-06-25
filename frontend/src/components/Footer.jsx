import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, ExternalLink, Code2, Database, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Schemes', path: '/schemes' },
    { label: 'User Journey', path: '/journey' },
  ],
  Resources: [
    { label: 'PM-KISAN', path: '/schemes' },
    { label: 'Ayushman Bharat', path: '/schemes' },
    { label: 'Widow Pension', path: '/schemes' },
    { label: 'All Schemes →', path: '/schemes' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Binary Builders', path: '/about' },
    { label: 'Redrob Ideathon', path: '/about' },
    { label: 'Contact', path: '/about' },
  ],
};

const TECH_STACK = [
  { icon: Code2, label: 'React + Vite' },
  { icon: Database, label: 'MongoDB' },
  { icon: MessageSquare, label: 'Twilio WhatsApp' },
  { icon: Cpu, label: 'Claude API' },
  { icon: ShieldCheck, label: 'Aadhaar PIN' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-dark-border mt-auto" style={{ background: '#08080E' }}>
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #6B3FA0, #1D9E75, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #6B3FA0, #9353D3)' }}>
                🇮🇳
              </div>
              <span className="text-white font-bold text-xl">
                Bharat<span style={{ color: '#9353D3' }}>Sahayak</span>
              </span>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs italic">
              "AI that finds what the government owes you —<br/>
              before you even know to ask."
            </p>

            {/* Hindi tagline */}
            <p className="hindi text-white/30 text-sm mb-8">
              "सरकारी योजनाओं का फायदा, बिना झंझट के।"
            </p>

            {/* Tech stack chips */}
            <div className="space-y-2">
              <p className="text-xs text-white/30 uppercase tracking-wider font-semibold">Built with</p>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 border border-dark-border">
                    <Icon size={11} className="text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border my-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Team credit */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-white/40">
            <div className="flex items-center gap-1.5">
              Made with <Heart size={12} className="text-accent fill-accent" /> by
              <span className="text-white/70 font-semibold ml-1">Binary Builders</span>
            </div>
            <span className="hidden sm:block text-white/20">·</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-white">P</div>
              <span className="text-white/60">PawanSingh Bhandari</span>
              <span className="text-white/20">+</span>
              <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center text-xs font-bold text-white">R</div>
              <span className="text-white/60">Rahul Bramhankar</span>
            </div>
          </div>

          {/* Redrob badge */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-accent/30 text-sm"
            style={{ background: 'rgba(230, 81, 0, 0.08)' }}
          >
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-white/80 font-semibold text-xs">Redrob Ideathon 2026</div>
              <div className="text-accent text-xs">Track 3 — AI for Social Impact</div>
            </div>
            <ExternalLink size={12} className="text-white/30" />
          </motion.div>

          <div className="text-xs text-white/25">
            © 2026 BharatSahayak. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

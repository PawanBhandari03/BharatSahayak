import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe, Wallet, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { path: '/', label: 'Home', labelHi: 'होम', labelMr: 'मुख्यपृष्ठ' },
  { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', labelMr: 'डॅशबोर्ड' },
  { path: '/schemes', label: 'Schemes', labelHi: 'योजनाएं', labelMr: 'योजना' },
  { path: '/journey', label: 'Journey', labelHi: 'यात्रा', labelMr: 'प्रवास' },
  { path: '/about', label: 'About', labelHi: 'हमारे बारे में', labelMr: 'आमच्याबद्दल' },
];

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हिं', full: 'Hindi' },
  { code: 'mr', label: 'मर', full: 'Marathi' },
];

export default function Navbar({ darkMode, setDarkMode, language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getLabel = (link) => {
    if (language === 'hi') return link.labelHi;
    if (language === 'mr') return link.labelMr;
    return link.label;
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl border-b border-dark-border/50 shadow-glow-primary/10'
            : 'py-5'
        }`}
        style={{
          background: scrolled ? 'rgba(13, 11, 31, 0.85)' : 'transparent',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
                🇮🇳
              </div>
              <div className="leading-tight">
                <span className="text-white font-bold text-lg">Bharat</span>
                <span className="font-bold text-lg" style={{ color: '#7C3AED' }}>Sahayak</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative ${language !== 'en' ? 'hindi' : ''}`}>
                    {getLabel(link)}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right side controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Globe size={14} />
                  <span className="hindi">{LANGUAGES.find(l => l.code === language)?.label}</span>
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-dark-border overflow-hidden z-50"
                      style={{ background: '#221E3D' }}
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                            language === lang.code ? 'text-white bg-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="hindi font-semibold w-6">{lang.label}</span>
                          <span className="text-xs text-white/40">{lang.full}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => toast('BharatSahayak is optimized in Dark Mode for high readability! 🌙', { icon: '✨' })}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all"
                title="Toggle theme"
              >
                <Moon size={16} />
              </button>

              {/* CTA */}
              <Link to="/register" className="btn-secondary text-sm py-2.5 px-5">
                <Wallet size={15} />
                Check My Benefits
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-72 md:hidden border-l border-dark-border"
              style={{ background: '#1A1633' }}
            >
              <div className="flex flex-col h-full pt-20 pb-8 px-6">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                          location.pathname === link.path
                            ? 'text-white bg-primary/20 border border-primary/30'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className={language !== 'en' ? 'hindi' : ''}>{getLabel(link)}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto space-y-3">
                  {/* Language */}
                  <div className="flex gap-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold hindi transition-all ${
                          language === lang.code ? 'bg-primary text-white' : 'bg-dark-card text-white/50 hover:text-white'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toast('BharatSahayak is optimized in Dark Mode for high readability! 🌙', { icon: '✨' })}
                      className="flex-1 py-2.5 rounded-lg text-sm text-white/60 bg-dark-card hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Moon size={14} />
                      Dark Mode
                    </button>
                  </div>

                  <Link to="/register" className="btn-secondary w-full justify-center text-sm py-3">
                    <Wallet size={15} />
                    Check My Benefits
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

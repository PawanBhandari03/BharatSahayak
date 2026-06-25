import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Mic, ChevronDown, SlidersHorizontal, UserCheck } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import schemeService, { SCHEMES_DATA } from '../services/schemeService';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { matchSchemesForUser } from '../utils/schemeMatcher';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const CATEGORIES = ['All', 'Agriculture', 'Social Welfare', 'Housing', 'Health', 'Insurance', 'Energy', 'Entrepreneurship', 'Skill Development', 'Education'];
const FILTER_TABS = ['All Schemes', 'For You ✨'];
const STATES_FILTER = ['All India', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu', 'Karnataka', 'West Bengal', 'Gujarat', 'J&K / Ladakh'];
const AGE_GROUPS = ['Any Age', '18-30', '31-50', '51-60', '60+'];
const INCOME_GROUPS = ['Any Income', 'Up to ₹1L', '₹1L-₹2L', '₹2L-₹5L', '₹5L+'];
const OCCUPATIONS = ['Any', 'Farmer', 'Student', 'Business', 'Labor', 'Widow', 'Senior Citizen'];

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
        active
          ? 'text-white border-primary bg-primary/20'
          : 'text-white/50 border-dark-border hover:text-white hover:border-primary/40'
      }`}
    >
      {label}
    </button>
  );
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all"
        style={{
          background: value && value !== options[0] ? 'rgba(107, 63, 160, 0.15)' : '#1A1A26',
          borderColor: value && value !== options[0] ? 'rgba(107, 63, 160, 0.5)' : '#2A2A3E',
          color: value && value !== options[0] ? '#C9A9E9' : 'rgba(255,255,255,0.5)'
        }}
      >
        {label}: <span className="font-medium">{value || options[0]}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-44 rounded-xl border border-dark-border z-20 py-1 overflow-hidden shadow-xl"
            style={{ background: '#1A1A26' }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === opt ? 'text-white bg-primary/20' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full text-center py-20"
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-white font-bold text-xl mb-2">No schemes found</h3>
      <p className="text-white/40 text-sm">
        No results for "{query}". Try different keywords or remove filters.
      </p>
    </motion.div>
  );
}

function SchemeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-border p-5 space-y-3 animate-pulse" style={{ background: '#1A1A26' }}>
      <div className="h-4 bg-dark-border rounded w-3/4" />
      <div className="h-3 bg-dark-border rounded w-1/2" />
      <div className="h-8 bg-dark-border rounded" />
      <div className="flex gap-2">
        <div className="h-6 bg-dark-border rounded-full w-16" />
        <div className="h-6 bg-dark-border rounded-full w-20" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-dark-border rounded-xl flex-1" />
        <div className="h-9 bg-dark-border rounded-xl flex-1" />
      </div>
    </div>
  );
}

export default function Schemes() {
  const { user, matchedSchemes } = useUser();
  const [schemes, setSchemes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(FILTER_TABS[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [state, setState] = useState(user ? user.state || 'All India' : 'All India');
  const [age, setAge] = useState('Any Age');
  const [income, setIncome] = useState('Any Income');
  const [occupation, setOccupation] = useState('Any');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Use real-time matched schemes if user is on "For You" tab, otherwise use all schemes
    const baseSchemes = (activeTab === FILTER_TABS[1] && user) ? matchedSchemes : SCHEMES_DATA;
    setSchemes(baseSchemes);
    setFiltered(baseSchemes);
    setLoading(false);
  }, [activeTab, user, matchedSchemes]);

  useEffect(() => {
    let result = [...schemes];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (state !== 'All India') {
      result = result.filter(s => s.state === state || s.state === 'All India');
    }
    setFiltered(result);
  }, [search, activeCategory, state, age, income, occupation, schemes]);

  const handleVoiceSearch = () => {
    toast.success('🎙 Voice search coming soon! Type your query in Hindi or English.', {
      style: { background: '#1A1A26', color: '#F5F4F0', border: '1px solid #6B3FA0' }
    });
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setState('All India');
    setAge('Any Age');
    setIncome('Any Income');
    setOccupation('Any');
  };

  const hasFilters = search || activeCategory !== 'All' || state !== 'All India' || age !== 'Any Age' || income !== 'Any Income' || occupation !== 'Any';

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            1000+ Schemes
          </motion.p>
          <motion.h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Explore Government <span className="gradient-text-primary">Schemes</span>
          </motion.h1>
          <motion.p
            className="text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find the schemes you qualify for — search by keyword, category, state, age, or income.
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-5 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes by name, category... (e.g. 'kisan', 'widow', 'health')"
              className="w-full pl-12 pr-24 py-4 rounded-2xl text-white placeholder-white/25 border outline-none focus:border-primary/60 transition-colors text-sm"
              style={{ background: '#1A1A26', borderColor: '#2A2A3E' }}
            />
            <div className="absolute right-3 flex gap-2">
              <button
                onClick={handleVoiceSearch}
                className="p-2.5 rounded-xl transition-all hover:bg-primary/20"
                title="Voice search"
              >
                <Mic size={16} className="text-primary" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-all ${showFilters ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-white/40'}`}
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-4 rounded-2xl border border-dark-border" style={{ background: '#12121A' }}>
                <FilterDropdown label="State" options={STATES_FILTER} value={state} onChange={setState} />
                <FilterDropdown label="Age Group" options={AGE_GROUPS} value={age} onChange={setAge} />
                <FilterDropdown label="Income" options={INCOME_GROUPS} value={income} onChange={setIncome} />
                <FilterDropdown label="Occupation" options={OCCUPATIONS} value={occupation} onChange={setOccupation} />
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-accent border border-accent/30 hover:bg-accent/10 transition-all">
                    <X size={13} /> Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs and Categories */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === FILTER_TABS[1] && !user) {
                    toast.error('Please register first to see personalized schemes!', { style: { background: '#1A1A26', color: '#F5F4F0', border: '1px solid #E65100' }});
                    return;
                  }
                  setActiveTab(tab);
                }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  activeTab === tab
                    ? 'bg-secondary/20 text-secondary border-secondary'
                    : 'bg-[#1A1A26] text-white/50 border-dark-border hover:text-white'
                }`}
              >
                {tab === FILTER_TABS[1] && user ? `For You (${matchedSchemes.filter(s => s.isMatched).length}) ✨` : tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(cat => (
              <FilterChip
                key={cat}
         
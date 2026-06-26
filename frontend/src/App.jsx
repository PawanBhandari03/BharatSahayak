import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Schemes = lazy(() => import('./pages/Schemes'));
const UserJourney = lazy(() => import('./pages/UserJourney'));
const About = lazy(() => import('./pages/About'));
const Register = lazy(() => import('./pages/Register'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, #6B3FA0, #9353D3)' }}>
          🇮🇳
        </div>
        <div className="w-32 h-1 bg-dark-border rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-shimmer bg-gradient-to-r from-primary via-secondary to-primary background-size-300%" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Apply dark/light mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.style.backgroundColor = '#0D0B1F';
    document.body.style.color = '#F5F4F0';
  }, [darkMode]);

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-dark-bg text-white' : 'bg-light-bg text-dark-bg'}`}>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1A1A26',
            color: '#F5F4F0',
            border: '1px solid #2A2A3E',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/journey" element={<UserJourney />} />
              <Route path="/about" element={<About />} />
              {/* Catch-all */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 pt-20">
                  <div className="text-6xl">🔍</div>
                  <h1 className="text-3xl font-black text-white">Page Not Found</h1>
                  <p className="text-white/40">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

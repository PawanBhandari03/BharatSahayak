import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import WhatsAppDemo from '../components/WhatsAppDemo';
import { VerticalTimeline } from '../components/Timeline';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AUDIO_SCRIPT_HINDI = `Namaste! Main BharatSahayak AI hoon.

Savitribai Patil ji ke liye 9 sarkari yojanaon ki jaankari leke aaya hoon.

Sabse pehle — Vidhwa Pension Yojana. Aapko pratik maah paanch sau rupaye milenge. Is yojana mein apply karne ki last date 31 March hai. Documents mein Aadhaar card, pati ka death certificate aur BPL card chahiye.

Doosri yojana — PM-KISAN Samman Nidhi. Kisan parivaron ko pratik varsh chheh hazar rupaye teen installments mein milte hain.

Teesri yojana — MahaDBT Shetkari Grant. Maharashtra ke kisanon ko paanch hazar rupaye tak ka grant milta hai.

Kya aapko documents ki puri list WhatsApp par bhejun? Reply karo 1 for Haan.`;

function VoiceCallSimulator() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [callActive, setCallActive] = useState(false);

  const startCall = () => {
    setCallActive(true);
    toast.success('📞 Simulating AI voice call in Hindi...', {
      style: { background: '#1A1A26', color: '#F5F4F0', border: '1px solid #1D9E75' }
    });
    setPlaying(true);

    // Simulate playback progress
    let p = 0;
    const interval = setInterval(() => {
      p += 100 / 180; // 3 minute call
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setPlaying(false);
        setProgress(0);
        toast.success('✅ Call completed! Summary sent on WhatsApp.', {
          style: { background: '#1A1A26', color: '#F5F4F0', border: '1px solid #1D9E75' }
        });
      }
    }, 1000);
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#1A1A26', borderColor: '#2A2A3E' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border" style={{ background: '#12121A' }}>
        <h3 className="text-white font-bold flex items-center gap-2">
          <Phone size={18} className="text-secondary" />
          Voice Call Simulator
        </h3>
        <p className="text-white/40 text-xs mt-0.5">AI calls in Hindi/Marathi to deliver scheme info</p>
      </div>

      {/* Phone mockup */}
      <div className="p-6">
        <div
          className="rounded-2xl p-6 text-center mb-6"
          style={{ background: callActive ? 'rgba(29, 158, 117, 0.1)' : '#0A0A0F', border: '1px solid ' + (callActive ? 'rgba(29, 158, 117, 0.3)' : '#2A2A3E') }}
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center text-3xl mx-auto mb-3">
            🤖
          </div>
          <div className="text-white font-bold mb-0.5">BharatSahayak AI</div>
          <div className={`text-sm ${callActive ? 'text-secondary' : 'text-white/40'}`}>
            {callActive ? (playing ? '● Calling Savitribai...' : '✓ Call Ended') : 'AI Voice Bot — Hindi/Marathi'}
          </div>

          {/* Progress bar */}
          {callActive && (
            <div className="mt-4 mb-2">
              <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#1D9E75', width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>{Math.floor(progress * 180 / 100 / 60)}:{String(Math.floor(progress * 180 / 100 % 60)).padStart(2, '0')}</span>
                <span>3:00</span>
              </div>
            </div>
          )}

          {/* Audio waves */}
          {playing && (
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: '#1D9E75' }}
                  animate={{ height: [4, 16, 4] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hindi script preview */}
        <div
          className="rounded-xl p-4 mb-5 text-xs leading-relaxed hindi text-white/60 max-h-32 overflow-y-auto scrollbar-hide"
          style={{ background: '#12121A', border: '1px solid #2A2A3E' }}
        >
          {AUDIO_SCRIPT_HINDI}
        </div>

        {/* Call button */}
        <button
          onClick={startCall}
          disabled={playing}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all ${
            playing ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'
          }`}
          style={{ background: playing ? '#2A2A3E' : 'linear-gradient(135deg, #1D9E75, #2FB089)' }}
        >
          {playing ? (
            <>
              <Volume2 size={20} className="animate-pulse" />
              Playing AI Voice Call...
            </>
          ) : (
            <>
              <Play size={20} />
              Simulate AI Voice Call (Hindi)
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function UserJourney() {
  const [activeStep, setActiveStep] = useState(-1);

  const handleStepActivate = (step) => {
    setActiveStep(step);
  };

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
        <div className="text-center mb-16">
          <motion.p className="section-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Self-Serve — No CSC Needed
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            From <span className="gradient-text-primary">Website</span> to{' '}
            <span className="gradient-text-secondary">₹1,37,000</span> in Benefits
          </motion.h1>
          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No CSC visit. No middleman. Open the website → fill a 2-minute form → AI finds all your government benefits and alerts you via WhatsApp + Voice Call.
          </motion.p>
        </div>

        {/* Step activators */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => setActiveStep(-1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${activeStep === -1 ? 'border-white/30 text-white bg-white/10' : 'border-dark-border text-white/40 hover:text-white'}`}
          >
            Reset
          </button>
          {[1,2,3,4,5,6,7].map(i => (
            <button
              key={i}
              onClick={() => setActiveStep(i - 1)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${
                activeStep >= i - 1
                  ? 'border-primary bg-primary/20 text-white'
                  : 'border-dark-border text-white/40 hover:text-white'
              }`}
            >
              {i}
            </button>
          ))}
          <button
            onClick={() => setActiveStep(6)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-secondary/40 text-secondary bg-secondary/10 hover:bg-secondary/20"
          >
            Complete Journey
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Vertical timeline */}
          <div>
            <VerticalTimeline activeStep={activeStep} />
          </div>

          {/* Right: Simulators */}
          <div className="space-y-8 lg:sticky lg:top-28">
            {/* WhatsApp simulator */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                💬 WhatsApp Chat Simulator
                <span className="badge bg-secondary/15 text-secondary text-xs">Interactive</span>
              </h3>
              <WhatsAppDemo interactive={true} />
              <p className="text-white/30 text-xs mt-2 text-center">
                Try typing: "kisan", "pension", "help", "schemes", or your own query
              </p>
            </div>

            {/* Voice call simulator */}
            <VoiceCallSimulator />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

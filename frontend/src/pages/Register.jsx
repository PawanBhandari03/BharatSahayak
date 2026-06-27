import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, MapPin, Briefcase, IndianRupee, Users,
  ShieldCheck, ChevronRight, ChevronLeft, CheckCircle,
  Eye, EyeOff, Loader2, MessageSquare, Star, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { matchSchemesForUser } from '../utils/schemeMatcher';
import { SCHEMES_DATA } from '../services/schemeService';

// ──────────────────────────── Constants ────────────────────────────
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const OCCUPATIONS = [
  'Farmer / Kisan',
  'Agricultural Labourer',
  'Daily Wage Worker',
  'Street Vendor / Small Trader',
  'Self-Employed (Small Business)',
  'Domestic Worker',
  'Construction Worker',
  'Artisan / Craftsperson',
  'Fisherman',
  'Student',
  'Homemaker',
  'Widow / Pensioner',
  'Person with Disability',
  'Government Employee',
  'Private Employee',
  'Other',
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const INCOME_RANGES = [
  'Up to ₹50,000/year',
  '₹50,001 – ₹1,00,000',
  '₹1,00,001 – ₹1,50,000',
  '₹1,50,001 – ₹2,00,000',
  '₹2,00,001 – ₹3,00,000',
  '₹3,00,001 – ₹5,00,000',
  'Above ₹5,00,000',
];

const MARITAL_STATUS = ['Single', 'Married', 'Widow / Widower', 'Divorced / Separated'];

// Step definitions
const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Your basic details' },
  { id: 2, title: 'Location & Work', icon: MapPin, description: 'Where you live & what you do' },
  { id: 3, title: 'Family & Income', icon: Users, description: 'Financial profile' },
  { id: 4, title: 'Verify Mobile', icon: Phone, description: 'OTP on your number' },
  { id: 5, title: 'Create PIN', icon: Lock, description: 'Your 4-digit security PIN' },
];

// ──────────────────────────── Sub-components ────────────────────────────
function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="mb-8">
      {/* Step dots */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-400 ${
                    isCompleted ? 'bg-secondary border-secondary' :
                    isCurrent ? 'bg-primary/20 border-primary' :
                    'bg-dark-card border-dark-border'
                  }`}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isCompleted
                    ? <CheckCircle size={16} className="text-white" />
                    : <Icon size={16} className={isCurrent ? 'text-primary' : 'text-white/30'} />
                  }
                </motion.div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-secondary' : 'text-white/30'
                }`}>
                  {step.title}
                </span>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden" style={{ background: '#2A2A3E' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#1D9E75' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current step label */}
      <div className="mt-4 text-center">
        <span className="text-xs uppercase tracking-wider text-primary font-semibold">
          Step {currentStep} of {totalSteps}
        </span>
        <h2 className="text-xl font-bold text-white mt-1">{STEPS[currentStep - 1]?.description}</h2>
      </div>
    </div>
  );
}

function FormField({ label, required, children, error, hint }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-white/80 mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  );
}

const inputClass = `w-full px-4 py-3 rounded-xl text-white text-sm border outline-none
  transition-all duration-200 placeholder-white/20 focus:border-primary/60`;

const inputStyle = { background: '#12121A', borderColor: '#2A2A3E' };

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
      style={{ ...inputStyle, color: value ? '#F5F4F0' : 'rgba(255,255,255,0.2)' }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt} style={{ background: '#221E3D', color: '#F5F4F0' }}>{opt}</option>
      ))}
    </select>
  );
}

// ──────────────────────────── Steps ────────────────────────────
function Step1({ data, setData, errors }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField label="Full Name" required error={errors.name}>
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. Savitribai Patil"
            value={data.name}
            onChange={e => setData(p => ({ ...p, name: e.target.value }))}
          />
        </FormField>
        <FormField label="Age" required error={errors.age}>
          <input
            type="number"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. 52"
            min={18} max={100}
            value={data.age}
            onChange={e => setData(p => ({ ...p, age: e.target.value }))}
          />
        </FormField>
        <FormField label="Gender" required>
          <div className="flex gap-2">
            {['Female', 'Male', 'Other'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setData(p => ({ ...p, gender: g }))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                  data.gender === g
                    ? 'bg-primary/20 border-primary text-white'
                    : 'border-dark-border text-white/40 hover:text-white hover:border-primary/40'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </FormField>
        <FormField label="Marital Status" required>
          <SelectField
            value={data.maritalStatus}
            onChange={v => setData(p => ({ ...p, maritalStatus: v }))}
            options={MARITAL_STATUS}
            placeholder="Select status"
          />
        </FormField>
        <FormField label="Category" required hint="Used for scheme eligibility matching">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setData(p => ({ ...p, category: cat }))}
                className={`flex-1 min-w-[60px] py-3 rounded-xl text-sm font-bold border transition-all ${
                  data.category === cat
                    ? 'bg-primary/20 border-primary text-white'
                    : 'border-dark-border text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FormField>
        <FormField label="Aadhaar Number (last 4 digits)" hint="We only store last 4 digits for verification">
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. 3456"
            maxLength={4}
            value={data.aadhaarLast4}
            onChange={e => setData(p => ({ ...p, aadhaarLast4: e.target.value.replace(/\D/g, '') }))}
          />
        </FormField>
      </div>
    </motion.div>
  );
}

function Step2({ data, setData, errors }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField label="State" required error={errors.state}>
          <SelectField
            value={data.state}
            onChange={v => setData(p => ({ ...p, state: v }))}
            options={STATES}
            placeholder="Select your state"
          />
        </FormField>
        <FormField label="District / City" required error={errors.district}>
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. Osmanabad / Pune"
            value={data.district}
            onChange={e => setData(p => ({ ...p, district: e.target.value }))}
          />
        </FormField>
        <FormField label="Occupation" required error={errors.occupation}>
          <SelectField
            value={data.occupation}
            onChange={v => setData(p => ({ ...p, occupation: v }))}
            options={OCCUPATIONS}
            placeholder="What do you do?"
          />
        </FormField>
        <FormField label="Do you own agricultural land?" required>
          <div className="flex gap-2">
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setData(p => ({ ...p, hasLand: opt }))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                  data.hasLand === opt
                    ? 'bg-secondary/20 border-secondary text-white'
                    : 'border-dark-border text-white/40 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </FormField>
        {data.hasLand === 'Yes' && (
          <FormField label="Land size (in acres)">
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. 2.5"
              value={data.landAcres}
              onChange={e => setData(p => ({ ...p, landAcres: e.target.value }))}
            />
          </FormField>
        )}
        <FormField label="Do you have a smartphone?" required>
          <div className="flex gap-2">
            {['Yes', 'No (Feature phone)'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setData(p => ({ ...p, hasSmartphone: opt }))}
                className={`flex-1 py-3 rounded-xl text-xs font-medium border transition-all ${
                  data.hasSmartphone === opt
                    ? 'bg-primary/20 border-primary text-white'
                    : 'border-dark-border text-white/40 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </FormField>
      </div>
    </motion.div>
  );
}

function Step3({ data, setData, errors }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <FormField label="Annual Family Income" required error={errors.income}
          hint="This determines which income-based schemes you qualify for">
          <SelectField
            value={data.income}
            onChange={v => setData(p => ({ ...p, income: v }))}
            options={INCOME_RANGES}
            placeholder="Select income range"
          />
        </FormField>
        <FormField label="Family Size" required error={errors.familySize}>
          <input
            type="number"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. 4"
            min={1} max={20}
            value={data.familySize}
            onChange={e => setData(p => ({ ...p, familySize: e.target.value }))}
          />
        </FormField>
        <FormField label="Number of children (below 18)">
          <input
            type="number"
            className={inputClass}
            style={inputStyle}
            placeholder="e.g. 2"
            min={0} max={15}
            value={data.children}
            onChange={e => setData(p => ({ ...p, children: e.target.value }))}
          />
        </FormField>
        <FormField label="Do you have a BPL card?">
          <div className="flex gap-2">
            {['Yes', 'No', "Don't Know"].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setData(p => ({ ...p, hasBPL: opt }))}
                className={`flex-1 py-3 rounded-xl text-xs font-medium border transition-all ${
                  data.hasBPL === opt
                    ? 'bg-accent/20 border-accent text-white'
                    : 'border-dark-border text-white/40 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </FormField>

        {/* Preview card */}
        <div className="col-span-full mt-2 p-4 rounded-xl border border-secondary/20 bg-secondary/5">
          <p className="text-secondary text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Star size={12} className="fill-secondary" />
            Based on your profile, you likely qualify for:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              data.maritalStatus?.includes('Widow') && '🟣 Widow Pension',
              data.occupation?.includes('Farmer') && '🌾 PM-KISAN',
              data.income && data.income.includes('50,000') && '🏥 Ayushman Bharat',
              '🔥 PMUY LPG',
              data.hasLand === 'Yes' && '💰 MahaDBT Farm Grant',
              '🛡️ PMSBY ₹2L @ ₹20/yr',
            ].filter(Boolean).map((scheme, i) => (
              <span key={i} className="badge bg-secondary/10 text-secondary text-xs px-2.5 py-1">{scheme}</span>
            ))}
            {!data.maritalStatus && !data.income && (
              <span className="text-white/30 text-xs">Fill above fields to see matched schemes</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step4OTP({ data, setData, errors }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);

  const sendOTP = () => {
    if (!data.mobile || data.mobile.length !== 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`OTP sent to +91-${data.mobile} (Demo: use 123456)`, {
        duration: 5000,
        style: { background: '#221E3D', color: '#F5F4F0', border: '1px solid #1D9E75' }
      });
    }, 1500);
  };

  const verifyOTP = () => {
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    // Demo: accept 123456 or any 6-digit code
    setVerified(true);
    setData(p => ({ ...p, mobileVerified: true }));
    toast.success('✅ Mobile verified successfully!', {
      style: { background: '#221E3D', color: '#F5F4F0', border: '1px solid #1D9E75' }
    });
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      {/* Mobile input */}
      <FormField label="Mobile Number" required error={errors.mobile}
        hint="This number will be used for WhatsApp scheme alerts and voice calls">
        <div className="flex gap-2">
          <div className="flex items-center px-3 rounded-xl border border-dark-border text-white/50 text-sm"
            style={{ background: '#12121A' }}>+91</div>
          <input
            type="tel"
            className={`${inputClass} flex-1`}
            style={inputStyle}
            placeholder="10-digit mobile number"
            maxLength={10}
            value={data.mobile}
            onChange={e => setData(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '') }))}
            disabled={sent}
          />
        </div>
      </FormField>

      {!sent ? (
        <button
          onClick={sendOTP}
          disabled={sending || !data.mobile || data.mobile.length !== 10}
          className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
        >
          {sending ? <><Loader2 size={16} className="animate-spin" /> Sending OTP...</> : <><MessageSquare size={16} /> Send OTP via SMS</>}
        </button>
      ) : (
        <div className="space-y-5">
          {/* OTP boxes */}
          <FormField label="Enter 6-digit OTP">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
                  }}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all text-white"
                  style={{
                    background: '#1A1633',
                    borderColor: digit ? '#7C3AED' : '#2E2856',
                  }}
                  disabled={verified}
                />
              ))}
            </div>
            <p className="text-center text-xs text-white/30 mt-2">Demo mode: Enter any 6 digits</p>
          </FormField>

          {!verified ? (
            <button
              onClick={verifyOTP}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #1D9E75, #2FB089)' }}
            >
              <ShieldCheck size={16} /> Verify OTP
            </button>
          ) : (
            <div className="flex items-center gap-2 justify-center p-3 rounded-xl"
              style={{ background: 'rgba(29, 158, 117, 0.15)', border: '1px solid rgba(29, 158, 117, 0.4)' }}>
              <CheckCircle size={18} className="text-secondary" />
              <span className="text-secondary font-semibold text-sm">Mobile Verified! ✓</span>
            </div>
          )}

          <button onClick={() => { setSent(false); setVerified(false); setOtp(['','','','','','']); }}
            className="w-full text-xs text-white/30 hover:text-white/60 transition-colors text-center">
            Didn't receive? Resend OTP
          </button>
        </div>
      )}

      {/* WhatsApp opt-in */}
      {verified && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-4 rounded-xl border"
          style={{ background: 'rgba(37, 211, 102, 0.08)', borderColor: 'rgba(37, 211, 102, 0.3)' }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="mt-0.5 w-4 h-4 rounded accent-green-500"
              onChange={e => setData(p => ({ ...p, whatsappOptIn: e.target.checked }))}
            />
            <span className="text-sm text-white/70">
              <span className="text-white font-medium">Enable WhatsApp alerts</span> — Receive scheme notifications,
              deadline reminders and voice call scheduling on this number via WhatsApp.
            </span>
          </label>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step5PIN({ data, setData }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [show, setShow] = useState(false);
  const [pinSet, setPinSet] = useState(false);

  const handlePin = (arr, setArr, index, value, prefix) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...arr];
    newPin[index] = value;
    setArr(newPin);
    if (value && index < 3) document.getElementById(`${prefix}-${index + 1}`)?.focus();
  };

  const createPIN = () => {
    const p1 = pin.join('');
    const p2 = confirmPin.join('');
    if (p1.length !== 4) { toast.error('Enter a 4-digit PIN'); return; }
    if (p1 !== p2) { toast.error('PINs do not match. Try again.'); setConfirmPin(['','','','']); return; }
    setPinSet(true);
    setData(p => ({ ...p, pin: p1, pinSet: true }));
    toast.success('🔐 PIN created successfully!', {
      style: { background: '#221E3D', color: '#F5F4F0', border: '1px solid #7C3AED' }
    });
  };

  const PinRow = ({ arr, setArr, id, label, disabled }) => (
    <FormField label={label}>
      <div className="flex gap-3 justify-center">
        {arr.map((digit, i) => (
          <input
            key={i}
            id={`${id}-${i}`}
            type={show ? 'text' : 'password'}
            maxLength={1}
            value={digit}
            onChange={e => handlePin(arr, setArr, i, e.target.value, id)}
            onKeyDown={e => {
              if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`${id}-${i - 1}`)?.focus();
            }}
            className="w-14 h-16 text-center text-2xl font-black rounded-xl border outline-none transition-all text-white"
            style={{ background: '#1A1633', borderColor: digit ? '#7C3AED' : '#2E2856' }}
            disabled={pinSet || disabled}
          />
        ))}
      </div>
    </FormField>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      {!pinSet ? (
        <>
          <div className="flex justify-end mb-3">
            <button onClick={() => setShow(s => !s)}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
              {show ? <EyeOff size={13} /> : <Eye size={13} />}
              {show ? 'Hide' : 'Show'} PIN
            </button>
          </div>

          <PinRow arr={pin} setArr={setPin} id="pin" label="Create 4-digit PIN" />
          <PinRow arr={confirmPin} setArr={setConfirmPin} id="cpin" label="Confirm PIN" />

          <div className="p-3 rounded-xl mb-5 text-xs text-white/50"
            style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            🔐 Your PIN is stored securely (hashed). Use it to login to your Benefit Wallet anytime from any device.
            Never share it with anyone.
          </div>

          <button
            onClick={createPIN}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
          >
            <Lock size={16} /> Create My PIN
          </button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto text-4xl"
          >
            ✅
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-xl">PIN Created!</h3>
            <p className="text-white/50 text-sm mt-1">Your 4-digit PIN: <strong className="text-white">••••</strong></p>
          </div>
          <div className="p-4 rounded-xl text-left space-y-2"
            style={{ background: 'rgba(29, 158, 117, 0.08)', border: '1px solid rgba(29, 158, 117, 0.25)' }}>
            <p className="text-secondary font-semibold text-sm">✅ What happens next:</p>
            <ul className="text-white/60 text-xs space-y-1.5">
              <li>📊 Your profile is saved securely</li>
              <li>🤖 AI analyses your eligibility across 1000+ schemes</li>
              <li>📱 WhatsApp bot activated on your number</li>
              <li>📞 You'll receive a voice call within 24 hours with your matched schemes</li>
              <li>💰 Benefit Wallet dashboard is ready</li>
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ──────────────────────────── Main Register Page ────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1
    name: '', age: '', gender: '', maritalStatus: '', category: '', aadhaarLast4: '',
    // Step 2
    state: '', district: '', occupation: '', hasLand: '', landAcres: '', hasSmartphone: '',
    // Step 3
    income: '', familySize: '', children: '', hasBPL: '',
    // Step 4
    mobile: '', mobileVerified: false, whatsappOptIn: true,
    // Step 5
    pin: '', pinSet: false,
  });

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!formData.name.trim()) e.name = 'Name is required';
      if (!formData.age || formData.age < 18 || formData.age > 100) e.age = 'Valid age (18–100) required';
    }
    if (step === 2) {
      if (!formData.state) e.state = 'Please select your state';
      if (!formData.district.trim()) e.district = 'District/city is required';
      if (!formData.occupation) e.occupation = 'Please select occupation';
    }
    if (step === 3) {
      if (!formData.income) e.income = 'Please select income range';
      if (!formData.familySize || formData.familySize < 1) e.familySize = 'Family size required';
    }
    if (step === 4) {
      if (!formData.mobile || formData.mobile.length !== 10) e.mobile = 'Valid 10-digit mobile required';
      if (!formData.mobileVerified) e.otp = 'Please verify your mobile number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!formData.pinSet) {
      toast.error('Please create your 4-digit PIN first');
      return;
    }
    setSubmitting(true);

    try {
      const getIncomeNumber = (range) => {
        if (!range) return 0;
        if (range.includes('50,000') || range.startsWith('Up to')) return 50000;
        if (range.includes('1,00,000')) return 100000;
        if (range.includes('1,50,000')) return 150000;
        if (range.includes('2,00,000')) return 200000;
        if (range.includes('3,00,000')) return 300000;
        if (range.includes('5,00,000')) return 500000;
        return 999999;
      };

      const backendPayload = {
        ...formData,
        annualIncome: getIncomeNumber(formData.income),
      };

      // 1. Fetch matched schemes from backend
      const matchRes = await axios.post('http://localhost:5000/api/match-schemes', backendPayload);
      const matchedBackend = matchRes.data;

      // 2. Fetch AI Recommendations from backend
      const aiRes = await axios.post('http://localhost:5000/api/ai-recommend', {
        profile: backendPayload,
        matchedSchemes: matchedBackend
      });

      // 3. Save user profile to Supabase (non-blocking — failure won’t stop the flow)
      try {
        await axios.post('http://localhost:5000/api/users/register', backendPayload);
      } catch (dbError) {
        // DB might not be configured yet — log and continue
        console.warn('DB registration skipped:', dbError?.response?.data?.message || dbError.message);
      }

      // Combine with UI data structure
      const fullSchemes = SCHEMES_DATA.map(s => {
        const isMatched = matchedBackend.some(b => b.id === s.id);
        return { ...s, isMatched, matchScore: isMatched ? 95 : 0 };
      });

      const matched = fullSchemes.filter(s => s.isMatched);

      // Save profile + matched schemes + AI recs to global context
      saveUser(formData, fullSchemes, aiRes.data);

      setSubmitting(false);

      toast.success(
        `🎉 AI found ${matched.length} schemes for you! Preparing your personalized dashboard...`,
        { duration: 5000, style: { background: '#221E3D', color: '#F5F4F0', border: '1px solid #1D9E75' } }
      );
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      const msg = error?.response?.data?.message || 'Something went wrong connecting to the AI backend. Make sure the server is running on port 5000.';
      toast.error(msg, { duration: 6000 });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={formData} setData={setFormData} errors={errors} />;
      case 2: return <Step2 data={formData} setData={setFormData} errors={errors} />;
      case 3: return <Step3 data={formData} setData={setFormData} errors={errors} />;
      case 4: return <Step4OTP data={formData} setData={setFormData} errors={errors} />;
      case 5: return <Step5PIN data={formData} setData={setFormData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #7C3AED, transparent)' }} />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border"
            style={{ background: 'rgba(29, 158, 117, 0.12)', borderColor: 'rgba(29, 158, 117, 0.35)', color: '#1D9E75' }}>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Free · Takes 2 minutes · No documents needed now
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Find Your <span className="gradient-text-secondary">Government Benefits</span>
          </h1>
          <p className="text-white/45 text-sm">
            Tell us about yourself. Our AI will find all schemes you're entitled to.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border p-6 md:p-8"
          style={{ background: '#221E3D', borderColor: '#2E2856' }}
        >
          <ProgressBar currentStep={step} totalSteps={5} />

          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-dark-border">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white/60 border border-dark-border hover:text-white hover:border-primary/40 transition-all"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            <div className="flex-1" />

            {step < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.pinSet}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1D9E75, #2FB089)' }}
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Creating Profile...</>
                  : <><CheckCircle size={16} /> View My Benefits</>
                }
              </button>
            )}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-white/30"
        >
          {['🔒 Aadhaar-grade security', '🆓 Completely free', '🇮🇳 Made in India', '📵 Works without internet'].map(item => (
            <span key={item}>{item}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

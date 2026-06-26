import { useState } from 'react';
import { User, Phone, Calendar, UserRound, MapPin, Briefcase, IndianRupee, Heart, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { matchSchemes } from '../services/api';

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

export default function OnboardingForm({ onMatch }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', phone: '',
    age: 25, gender: 'male', state: '',
    category: 'general', occupation: 'student', annualIncome: 100000, maritalStatus: 'single'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' || name === 'annualIncome' ? Number(value) : value 
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.phone)) {
       setError("Please fill all fields."); return;
    }
    if (step === 2 && !formData.state) {
        setError("Please select a state."); return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const schemes = await matchSchemes(formData);
      onMatch(schemes, formData);
    } catch (err) {
      setError('Failed to fetch schemes. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-purple-900/50">
        <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {step === 1 && "Let's get started"}
          {step === 2 && "Tell us about yourself"}
          {step === 3 && "Final details"}
        </h2>
        <p className="text-purple-300">Step {step} of 3</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-200">{error}</div>}

      <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-purple-500" placeholder="Ramesh Kumar" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-purple-500" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" max="100" required
                    className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Gender</label>
                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <select name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">State</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <select name="state" value={formData.state} onChange={handleChange} required
                  className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                  <option value="">Select your state...</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
                  <select name="occupation" value={formData.occupation} onChange={handleChange}
                    className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                    <option value="student">Student</option>
                    <option value="farmer">Farmer</option>
                    <option value="professional">Professional</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-purple-200 mb-2">
                <span>Annual Income</span>
                <span className="text-purple-400 font-bold">₹ {formData.annualIncome.toLocaleString('en-IN')}</span>
              </label>
              <div className="relative flex items-center">
                <IndianRupee className="absolute left-4 w-5 h-5 text-purple-400" />
                <input type="range" name="annualIncome" min="0" max="2500000" step="10000" value={formData.annualIncome} onChange={handleChange}
                  className="w-full ml-12 accent-purple-500 h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Marital Status</label>
              <div className="relative">
                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}
                  className="w-full bg-purple-950/50 border border-purple-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widow">Widowed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-purple-800/50">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-purple-300 hover:text-white hover:bg-purple-800/30 transition-all font-medium">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all font-medium shadow-lg shadow-purple-600/30">
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white transition-all font-medium shadow-lg shadow-purple-500/30 disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Schemes'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

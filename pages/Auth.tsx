
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Phone, AlertCircle, ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import { api } from '../services/api.ts';

interface AuthProps {
  onLogin: (data: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [regStep, setRegStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Full Name and Phone Number are required.');
      return;
    }
    if (formData.phone.length < 10) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setRegStep(2);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && regStep === 1) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const identifier = formData.phone || formData.email;
        if (!identifier || !formData.password) throw new Error("Please enter your credentials.");

        const res = await api.login({
          identifier,
          password: formData.password
        });
        onLogin(res);
      } else {
        if (!formData.city.trim() || !formData.state.trim() || !formData.password) {
          throw new Error('All fields in step 2 are required.');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        await api.register({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          state: formData.state,
          password: formData.password
        });

        const res = await api.login({
          identifier: formData.phone,
          password: formData.password
        });
        onLogin(res);
      }
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 shadow-[0_40px_100px_rgba(79,70,229,0.12)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Dynamic Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 md:w-80 h-64 md:h-80 bg-purple-500/10 rounded-full blur-[60px] md:blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 md:w-80 h-64 md:h-80 bg-indigo-500/10 rounded-full blur-[60px] md:blur-[80px]"></div>

        <div className="relative z-10">
          <div className="mb-8 md:mb-12 text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 md:mb-8 hover:rotate-6 transition-transform duration-500">
              <img src="/logo.png" alt="Lucky Lubricants" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-2">
              {isLogin ? 'Member Access' : 'Join the Club'}
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">Lucky Lubricants Hub</p>

            {!isLogin && (
              <div className="mt-6 md:mt-8 flex items-center justify-center gap-2">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${regStep >= 1 ? 'w-10 md:w-12 bg-purple-600' : 'w-3 md:w-4 bg-purple-100'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-700 ${regStep >= 2 ? 'w-10 md:w-12 bg-purple-600' : 'w-3 md:w-4 bg-purple-100'}`}></div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 md:p-5 bg-rose-50 border border-rose-100 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 text-rose-600 text-[10px] md:text-[11px] font-black uppercase tracking-widest animate-in shake duration-300">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {isLogin ? (
              <div className="space-y-4 md:space-y-5 animate-in fade-in duration-500">
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="text" placeholder="Phone or Email" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 focus:bg-white outline-none font-bold uppercase transition-all shadow-inner" />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600 transition-colors" size={18} />
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 focus:bg-white outline-none font-bold transition-all shadow-inner" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5 overflow-hidden">
                {regStep === 1 ? (
                  <div className="animate-in slide-in-from-right duration-500 space-y-4 md:space-y-5">
                    <div className="flex items-center gap-2 px-1">
                      <Sparkles size={14} className="text-purple-500" />
                      <p className="text-[9px] md:text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Personal Details</p>
                    </div>
                    <div className="relative group">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={18} />
                      <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Full Name" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 outline-none font-bold uppercase transition-all" />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={18} />
                      <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Mobile Number" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 outline-none font-bold uppercase transition-all" />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={18} />
                      <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email (Optional)" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 outline-none font-bold uppercase transition-all" />
                    </div>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-right duration-500 space-y-4 md:space-y-5">
                    <button onClick={() => { setRegStep(1); setError(null); }} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 hover:bg-purple-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all">
                      <ChevronLeft size={16} /> Previous Step
                    </button>
                    <div className="flex items-center gap-2 px-1">
                      <MapPin size={14} className="text-purple-500" />
                      <p className="text-[9px] md:text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Location & Security</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={16} />
                        <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.5rem] py-4 md:py-4.5 pl-11 pr-4 text-xs focus:border-purple-500 outline-none font-bold uppercase transition-all" />
                      </div>
                      <input required name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.5rem] py-4 md:py-4.5 px-6 text-xs focus:border-purple-500 outline-none font-bold uppercase transition-all" />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={18} />
                      <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Create Password" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 outline-none font-bold transition-all" />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-600" size={18} />
                      <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password" className="w-full bg-purple-50/50 border-2 border-transparent rounded-2xl md:rounded-[1.8rem] py-4 md:py-5 pl-14 pr-6 text-sm focus:border-purple-500 outline-none font-bold transition-all" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type={(!isLogin && regStep === 1) ? "button" : "submit"}
              disabled={isLoading}
              onClick={(!isLogin && regStep === 1) ? handleNextStep : undefined}
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-3 md:gap-4 active:scale-95 transition-all mt-6 md:mt-10 uppercase tracking-[0.2em] italic text-xs md:text-sm`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {!isLogin && regStep === 1 ? 'Proceed to Step 2' : (isLogin ? 'Sign In Now' : 'Create My Account')}
                  <ArrowRight size={20} className="stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 md:mt-12 flex flex-col items-center gap-6">
            <button onClick={() => { setIsLogin(!isLogin); setRegStep(1); setError(null); }} className="text-purple-600 font-black text-[9px] md:text-[11px] tracking-[0.2em] uppercase hover:opacity-80 transition-opacity text-center leading-relaxed px-4">
              {isLogin ? "No account? Join the elite club" : "Already registered? Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

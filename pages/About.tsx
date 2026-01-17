
import React, { useState } from 'react';
import { ShieldCheck, Zap, Globe, Award, History, Target, Users, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Send, MessageCircle, PhoneCall, Mail, MapPin } from 'lucide-react';
import { api } from '../services/api.ts';

const FAQ_DATA = [
  {
    question: "How do I redeem my points?",
    answer: "Go to the Home tab and tap 'Get Gifts'. If you have enough points, you can select any unlocked item from the Rewards section to collect your gift."
  },
  {
    question: "Where can I find my voucher code?",
    answer: "Voucher codes are found on a scratch card inside the lid or under the label of Lucky Lubricant bottles. Use the Scanner tool to credit points instantly."
  },
  {
    question: "Do my reward points expire?",
    answer: "Points are valid for 12 months from the date of credit. We'll send you a notification 30 days before any points are set to expire."
  }
];

const About: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Points/Voucher Issue',
    message: ''
  });

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      await api.contactSupport(formData);
      setSubmitted(true);
      setFormData({ ...formData, message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1e1b4b] p-10 text-center shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/20 rounded-[1.5rem] mb-6 border border-white/10">
            <Award className="text-purple-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">LUCKY LUBRICANTS</h2>
          <p className="text-purple-200/60 mt-4 text-[11px] font-bold max-w-[280px] mx-auto leading-relaxed uppercase tracking-widest italic">
            Engineering Superior Performance & Reliability Since 1998.
          </p>
        </div>
      </div>

      {/* 2. Heritage & Stats */}
      <section className="px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-purple-600" size={24} />
                <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-widest">Our Mission</h3>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-loose uppercase tracking-tight">
                To empower motion through superior lubrication technology. We strive to extend engine life and maximize efficiency through continuous molecular innovation.
              </p>
           </div>
           
           <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black italic text-purple-400">25+</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Years</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-2xl font-black italic text-purple-400">120+</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Items</p>
              </div>
              <div>
                <p className="text-2xl font-black italic text-purple-400">5M+</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Users</p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Heritage Timeline */}
      <section className="px-1">
        <div className="flex items-center gap-3 mb-8">
          <History className="text-purple-600" size={24} />
          <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-widest">Our Journey</h3>
        </div>
        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
          <TimelineItem year="1998" title="Foundation" desc="Started with a focus on high-durability diesel engine formulas." />
          <TimelineItem year="2010" title="Going Global" desc="Expanded presence across 15+ international markets." />
          <TimelineItem year="Today" title="Digital Hub" desc="Pioneering smart loyalty systems for our valued partners." />
        </div>
      </section>

      {/* 4. HELP & SUPPORT SECTION (Moved from Contact page) */}
      <div className="pt-8 border-t border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-4">
            <HelpCircle className="text-purple-600" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Help & Support</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Common Questions & Direct Support</p>
        </div>

        {/* FAQs */}
        <div className="px-1 space-y-3 mb-12">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
              >
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{faq.question}</span>
                {openFaq === index ? <ChevronUp size={16} className="text-purple-500" /> : <ChevronDown size={16} className="text-slate-300" />}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Form */}
        <section className="px-1">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-6 uppercase italic tracking-widest flex items-center gap-2">
              <Send size={18} className="text-purple-500" /> Direct Assistance
            </h3>
            
            {submitted ? (
              <div className="py-12 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-sm font-black text-slate-800 uppercase italic">Ticket Created!</p>
                <p className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-widest">We will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-5">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Issue Category</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-5 text-[11px] font-black uppercase tracking-tight focus:border-purple-500 outline-none transition-all"
                  >
                    <option>Points/Voucher Issue</option>
                    <option>Reward Delivery</option>
                    <option>Product Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your query..."
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-5 text-[11px] font-bold focus:border-purple-500 outline-none resize-none transition-all shadow-inner"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#1e1b4b] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest italic text-xs"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Location & Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-8 px-1">
          <div className="bg-emerald-500 text-white p-5 rounded-[2rem] flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer">
             <MessageCircle size={20} />
             <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp</span>
          </div>
          <div className="bg-[#0f172a] text-white p-5 rounded-[2rem] flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer">
             <PhoneCall size={20} />
             <span className="text-[8px] font-black uppercase tracking-widest">Call Helpline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ year, title, desc }: { year: string, title: string, desc: string }) => (
  <div className="flex gap-6 items-start relative pl-1">
    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm shrink-0 z-10">
      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></div>
    </div>
    <div className="pt-1">
      <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest italic">{year}</span>
      <h4 className="font-black text-slate-800 text-sm mt-2 uppercase italic leading-none">{title}</h4>
      <p className="text-[10px] text-slate-500 mt-1 font-bold leading-relaxed uppercase tracking-tight">{desc}</p>
    </div>
  </div>
);

export default About;

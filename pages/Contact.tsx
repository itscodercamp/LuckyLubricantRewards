
import React, { useState } from 'react';
import { PhoneCall, MessageCircle, Mail, MapPin, ChevronDown, ChevronUp, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.ts';

const FAQ_DATA = [
  {
    question: "How do I redeem my points?",
    answer: "Go to the Home tab and tap 'Redeem Gift'. If you have enough points, you can select any unlocked item and follow the instructions to collect your reward."
  },
  {
    question: "Where can I find my voucher code?",
    answer: "Voucher codes are typically found on a scratch card inside the lid or under the label of Lucky Lubricant bottles."
  },
  {
    question: "Do my reward points expire?",
    answer: "Points are valid for 12 months from the date of credit. We'll send you a notification 30 days before any points are set to expire."
  }
];

const Contact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Points/Voucher Issue',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Support Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-50 rounded-full mb-4">
          <HelpCircle className="text-emerald-600" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Need Support?</h2>
        <p className="text-slate-400 text-sm font-medium mt-1">We're here to help you 24/7.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <QuickActionButton icon={<MessageCircle size={20} />} label="WhatsApp" color="bg-emerald-500" />
        <QuickActionButton icon={<PhoneCall size={20} />} label="Call Us" color="bg-[#0f172a]" />
        <QuickActionButton icon={<Mail size={20} />} label="Email" color="bg-blue-600" />
      </div>

      {/* FAQ Section */}
      <section className="px-1">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <HelpCircle className="text-emerald-500" size={20} />
          FAQs
        </h3>
        <div className="space-y-3">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="text-sm font-bold text-slate-700">{faq.question}</span>
                {openFaq === index ? <ChevronUp size={16} className="text-emerald-500" /> : <ChevronDown size={16} className="text-slate-300" />}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-1">
        <h3 className="text-lg font-black text-slate-800 mb-4">Send a Message</h3>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          {submitted ? (
            <div className="py-10 text-center animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
               </div>
               <p className="text-sm font-black text-slate-800 uppercase italic">Message Sent!</p>
               <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option>Points/Voucher Issue</option>
                  <option>Reward Delivery</option>
                  <option>Product Inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={16} />
                    SUBMIT MESSAGE
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Location */}
      <div className="flex items-center gap-4 p-5 bg-slate-100 rounded-3xl mx-1">
        <div className="p-3 bg-white rounded-2xl text-slate-400">
          <MapPin size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Main Headquarters</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Lucky Tower, Sector 12, Industrial Area</p>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
  <button className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90 group-hover:scale-105`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{label}</span>
  </button>
);

export default Contact;

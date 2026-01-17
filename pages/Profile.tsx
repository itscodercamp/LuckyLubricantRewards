
import React, { useRef, useState, useEffect } from 'react';
import { User as UserIcon, Settings, LogOut, ChevronRight, Phone, Mail, Edit3, ArrowUpRight, ArrowDownLeft, History, Gift, Camera, MapPin, Loader2 } from 'lucide-react';
import { User, Transaction } from '../types.ts';
import { api } from '../services/api.ts';

interface ProfileProps {
  user: any;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, redeemData] = await Promise.all([
          api.getTransactions(),
          api.getRedemptionHistory()
        ]);
        setHistory(Array.isArray(txData) ? txData : []);
        setRedemptions(Array.isArray(redeemData) ? redeemData : []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.uploadProfileImage(file);
      alert("Profile picture updated!");
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {/* Profile Header */}
      <div className="text-center py-6 relative">
        <div className="relative inline-block">
          <div onClick={handleImageClick} className="w-28 h-28 bg-[#0f172a] rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl mx-auto overflow-hidden rotate-2 cursor-pointer group relative">
            {user.profile_image ? (
               <img src={user.profile_image} className="w-full h-full object-cover" alt="Profile" />
            ) : (
               <UserIcon size={56} className="text-emerald-500 group-hover:opacity-20 transition-opacity" />
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <Camera className="text-white" size={32} />
            </div>
            {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}
          </div>
          <button onClick={handleImageClick} className="absolute -bottom-2 -right-2 p-2.5 bg-white text-[#0f172a] rounded-2xl shadow-lg border border-slate-100"><Edit3 size={16} /></button>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-6 italic uppercase">{user.name}</h2>
        <div className="flex items-center justify-center gap-1.5 mt-1 opacity-50">
           <MapPin size={12} className="text-emerald-500" />
           <p className="text-[10px] text-slate-800 font-bold uppercase tracking-widest">{user.city || 'Location'}, {user.state || 'State'}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <div className="bg-emerald-500 p-6 rounded-[2.5rem] shadow-lg shadow-emerald-500/20 text-white">
          <p className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-1">Available Pts</p>
          <p className="text-3xl font-black italic">{user.points}</p>
        </div>
        <div className="bg-[#0f172a] p-6 rounded-[2.5rem] shadow-lg shadow-slate-900/20 text-white">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Redemptions</p>
          <p className="text-3xl font-black text-emerald-500 italic">{redemptions.length}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm mx-1">
        <DetailItem icon={<Phone size={18} />} label="Registered Phone" value={user.phone} />
        <div className="h-px bg-slate-50 mx-6"></div>
        <DetailItem icon={<Mail size={18} />} label="Email Address" value={user.email || 'Not verified'} />
        <div className="h-px bg-slate-50 mx-6"></div>
        <DetailItem icon={<MapPin size={18} />} label="Residence" value={`${user.city || '-'}, ${user.state || '-'}`} />
      </div>

      {/* Points History */}
      <section className="px-1 space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic">
            <History size={16} className="text-emerald-500" /> Points Activity
          </h3>
        </div>
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="py-10 flex flex-col items-center opacity-30">
               <Loader2 className="animate-spin mb-2" size={24} />
               <p className="text-[10px] font-black uppercase tracking-widest">Fetching logs...</p>
            </div>
          ) : history.length > 0 ? (
            history.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase italic tracking-tight">{tx.description}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{tx.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-black italic ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-800'}`}>
                   {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-300 text-[10px] font-bold uppercase py-10">No recent activity found</p>
          )}
        </div>
      </section>

      {/* Redemption Gallery (Real Data) */}
      {redemptions.length > 0 && (
        <section className="px-1 space-y-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic">
            <Gift size={16} className="text-emerald-500" /> My Goodies
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {redemptions.map((r, i) => (
              <div key={i} className="min-w-[120px] bg-white p-3 rounded-3xl border border-slate-100 shadow-sm text-center">
                 <img src={r.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b'} className="w-full h-20 object-cover rounded-2xl mb-2" alt="Goody" />
                 <p className="text-[9px] font-black uppercase truncate">{r.name}</p>
                 <p className="text-[8px] text-emerald-500 font-bold uppercase mt-1">Status: Delivered</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Logout */}
      <div className="px-1 pt-4">
        <button onClick={onLogout} className="w-full flex items-center justify-between p-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[2rem] active:scale-95 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-600/20 group-hover:rotate-12 transition-transform"><LogOut size={20} /></div>
            <span className="text-sm font-black uppercase italic tracking-widest">Safe Sign Out</span>
          </div>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
     <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">{icon}</div>
     <div>
        <p className="text-[9px] font-black text-slate-300 uppercase leading-none mb-1.5 tracking-widest">{label}</p>
        <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{value}</p>
     </div>
  </div>
);

export default Profile;

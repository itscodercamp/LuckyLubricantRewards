
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Gift, Star, Loader2, Sparkles } from 'lucide-react';
import { Reward, User } from '../types.ts';
import { api } from '../services/api.ts';

interface RewardsProps {
  user: User;
  onBack: () => void;
  onSelectReward: (reward: Reward) => void;
}

const Rewards: React.FC<RewardsProps> = ({ user, onBack, onSelectReward }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await api.getRewards();
        setRewards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load rewards", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const getImg = (r: any) => r.image || r.image_url || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop';

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={onBack} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all md:hidden">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Redemption</h2>
        </div>
        
        <div className="bg-emerald-500 rounded-[2rem] md:rounded-[2.5rem] p-5 md:px-10 md:py-8 text-white shadow-2xl shadow-emerald-500/20 flex justify-between items-center overflow-hidden relative min-w-0 md:min-w-[320px]">
          <div className="absolute -right-8 -bottom-8 opacity-20 rotate-12">
            <Gift size={100} className="md:w-[120px] md:h-[120px]" />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-100 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Vault Balance</p>
            <p className="text-3xl md:text-4xl font-black tabular-nums italic tracking-tighter">{user.points} <span className="text-xs md:text-sm font-black text-emerald-200 uppercase not-italic">Pts</span></p>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
            <Sparkles className="text-white fill-white w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-inner">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
           <Star className="text-amber-500 fill-amber-500" size={20} />
           <h3 className="text-[10px] md:text-sm font-black text-slate-800 uppercase tracking-widest italic">Inventory Status: Ready</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-40">
            <Loader2 className="animate-spin text-emerald-500 mb-6" size={40} />
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Fetching Exclusive Items...</p>
          </div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-32 opacity-30">
            <p className="text-base md:text-lg font-black uppercase italic tracking-tighter">No items found in central vault</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {rewards.map((reward: any) => {
              const rewardPts = reward.pointsRequired ?? reward.points_required ?? 0;
              const hasEnough = user.points >= rewardPts;

              return (
                <div 
                  key={reward.id} 
                  onClick={() => onSelectReward(reward)}
                  className={`group bg-white border rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-sm transition-all active:scale-95 cursor-pointer flex flex-col ${
                    hasEnough 
                    ? 'border-slate-100 hover:shadow-2xl hover:border-emerald-100' 
                    : 'border-slate-100 opacity-90'
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden bg-slate-50">
                    <img 
                      src={getImg(reward)} 
                      alt={reward.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <div className={`p-2 md:p-2.5 rounded-xl md:rounded-2xl backdrop-blur-md shadow-lg border border-white/20 ${hasEnough ? 'bg-emerald-500/80 text-white' : 'bg-slate-900/40 text-white'}`}>
                        <Gift size={16} className="md:w-5 md:h-5" />
                      </div>
                    </div>
                    {!hasEnough && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2.5px] flex items-center justify-center text-center p-4">
                         <p className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-tight">Needs {rewardPts - user.points} Pts</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <h3 className="text-[10px] md:text-xs font-black text-slate-800 line-clamp-2 uppercase tracking-tight italic mb-2">{reward.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className={`text-sm md:text-base font-black italic tabular-nums leading-none ${hasEnough ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {rewardPts}
                        </p>
                        <span className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Lucky Pts</span>
                      </div>
                      {hasEnough && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;

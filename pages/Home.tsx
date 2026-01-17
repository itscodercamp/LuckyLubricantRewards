
import React, { useState, useEffect } from 'react';
import { Scan, Gift, ArrowUpRight, ArrowDownLeft, ChevronRight, Sparkles, Download, Loader2, Package } from 'lucide-react';
import { User, Transaction, Reward, Product } from '../types.ts';
import Scanner from '../components/Scanner.tsx';
import { api } from '../services/api.ts';

interface HomeProps {
  user: User;
  onNavigateRewards: () => void;
  onScanVoucher: (uuid: string) => void;
  canInstall: boolean;
  onInstall: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectReward: (reward: Reward) => void;
}

const Home: React.FC<HomeProps> = ({ 
  user, 
  onNavigateRewards, 
  onScanVoucher, 
  canInstall, 
  onInstall,
  onSelectProduct,
  onSelectReward
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, rewardData, productData] = await Promise.all([
          api.getTransactions(),
          api.getRewards(),
          api.getProducts()
        ]);
        setTransactions(Array.isArray(txData) ? txData : []);
        setRewards(Array.isArray(rewardData) ? rewardData : []);
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (e) {
        console.error("Home data sync failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScanSuccess = (uuid: string) => {
    setShowScanner(false);
    onScanVoucher(uuid);
  };

  const getImg = (obj: any) => obj.image || obj.image_url || 'https://images.unsplash.com/photo-1635848600716-52445e994e63?q=80&w=200&auto=format&fit=crop';

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-full overflow-x-hidden pt-4 pb-10">
      {showScanner && <Scanner onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />}

      {/* 1. Points Card */}
      <div className="px-4">
        <div className="relative bg-gradient-to-br from-[#4c1d95] via-[#5b21b6] to-[#1e1b4b] rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden border border-white/10 w-full min-h-[180px] flex flex-col justify-center">
          <div className="relative z-10">
            <p className="text-purple-200/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">Vault Balance</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-[900] text-white tabular-nums tracking-tighter italic leading-none">
                {user.points}
              </h2>
              <span className="text-purple-400 text-xs font-black uppercase italic tracking-widest">Points</span>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-xs font-black text-white uppercase tracking-tighter truncate max-w-[200px] italic">{user.name}</p>
              {canInstall && (
                <button onClick={onInstall} className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md active:scale-95 transition-all">App Install</button>
              )}
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px]"></div>
        </div>
      </div>

      {/* 2. Action Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <button 
          onClick={() => setShowScanner(true)} 
          className="flex items-center justify-center gap-3 bg-emerald-500 text-white py-4 px-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all border border-emerald-400/20"
        >
          <Scan size={18} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Scan Code</span>
        </button>
        <button 
          onClick={onNavigateRewards} 
          className="flex items-center justify-center gap-3 bg-[#1e1b4b] text-white py-4 px-4 rounded-2xl shadow-xl shadow-indigo-950/20 active:scale-95 transition-all border border-white/5"
        >
          <Gift size={18} className="text-purple-400" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Get Gifts</span>
        </button>
      </div>

      {/* 3. Goodies Section - Now Clickable to Modal */}
      <section className="w-full">
        <div className="flex justify-between items-end mb-4 px-5">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-[#1e1b4b] uppercase italic tracking-tighter leading-none">Goodies</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Unlocked Rewards</p>
          </div>
          <button onClick={onNavigateRewards} className="text-purple-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0">View All <ChevronRight size={14} /></button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-5 snap-x snap-mandatory">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="min-w-[140px] h-44 bg-slate-100 rounded-[2rem] animate-pulse"></div>)
          ) : rewards.length > 0 ? rewards.slice(0, 5).map((reward: any) => (
            <div 
              key={reward.id} 
              onClick={() => onSelectReward(reward)} 
              className="min-w-[140px] bg-white border border-slate-100 p-3 rounded-[2rem] shadow-sm hover:border-purple-200 transition-all cursor-pointer active:scale-95 group snap-start"
            >
              <div className="h-24 rounded-2xl overflow-hidden mb-3 bg-slate-50 relative">
                <img src={getImg(reward)} alt={reward.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-lg text-purple-600">
                  <Gift size={12} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-800 uppercase truncate mb-1 italic tracking-tight">{reward.name}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-[11px] font-black text-purple-600 italic leading-none">{reward.pointsRequired ?? reward.points_required ?? 0}</p>
                <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">PTS</span>
              </div>
            </div>
          )) : (
            <div className="w-full py-10 text-center opacity-20"><p className="text-[10px] font-black uppercase italic">Inventory Empty</p></div>
          )}
        </div>
      </section>

      {/* 4. Product Section - Now Clickable to Modal */}
      <section className="w-full">
        <div className="flex justify-between items-end mb-4 px-5">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-[#1e1b4b] uppercase italic tracking-tighter leading-none">Catalog</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Engine Formulas</p>
          </div>
          <button className="text-purple-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0">Shop All <ChevronRight size={14} /></button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-5 snap-x snap-mandatory">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="min-w-[140px] h-44 bg-slate-100 rounded-[2rem] animate-pulse"></div>)
          ) : products.length > 0 ? products.slice(0, 5).map((product) => (
            <div 
              key={product.id} 
              onClick={() => onSelectProduct(product)}
              className="min-w-[140px] bg-white border border-slate-100 p-3 rounded-[2rem] shadow-sm hover:border-emerald-200 transition-all cursor-pointer active:scale-95 group snap-start"
            >
              <div className="h-24 rounded-2xl overflow-hidden mb-3 bg-slate-50 relative">
                <img src={getImg(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 rounded-lg text-white">
                  <Package size={12} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-800 uppercase truncate leading-none mb-2 italic tracking-tight">{product.name}</p>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">In Stock</span>
              </div>
            </div>
          )) : (
            <div className="w-full py-10 text-center opacity-20"><p className="text-[10px] font-black uppercase italic">No Products</p></div>
          )}
        </div>
      </section>

      {/* 5. Activity Feed */}
      <section className="px-4">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-[#1e1b4b] uppercase italic tracking-tighter">Activity Feed</h3>
            <div className="px-3 py-1 bg-purple-50 rounded-full text-[9px] font-black text-purple-600 uppercase tracking-widest border border-purple-100 italic">History Log</div>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Transaction</th>
                  <th className="pb-3 text-right text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={2} className="py-8 text-center opacity-30"><Loader2 className="animate-spin mx-auto text-purple-600" size={24} /></td></tr>
                ) : transactions.length > 0 ? transactions.slice(0, 4).map((tx) => (
                  <tr key={tx.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-400'}`}>
                          {tx.type === 'credit' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownLeft size={14} strokeWidth={3} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-slate-800 uppercase italic leading-none truncate mb-1">{tx.description}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{tx.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex flex-col items-end">
                        <p className={`text-xs font-[900] italic tabular-nums ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-800'}`}>
                          {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                        </p>
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">PTS</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} className="py-12 text-center text-[10px] font-black text-slate-300 uppercase italic tracking-widest">No Activity Records</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

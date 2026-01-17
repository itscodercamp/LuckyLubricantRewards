
import React from 'react';
import { X, Gift, Info, CheckCircle2, ShoppingCart, MessageCircle, PhoneCall, Maximize2 } from 'lucide-react';

interface DetailModalProps {
  item: any;
  type: 'product' | 'reward';
  onClose: () => void;
  onAction: (message: string, actionType: 'cart' | 'reward') => void;
  onPreviewImage: (url: string) => void;
  userPoints: number;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, type, onClose, onAction, onPreviewImage, userPoints }) => {
  if (!item) return null;

  const isReward = type === 'reward';
  // Check for both camelCase and snake_case from API
  const requiredPts = item.pointsRequired ?? item.points_required ?? 0;
  const canAfford = isReward ? userPoints >= requiredPts : true;
  const SUPPORT_NUMBER = "+919876543210"; 

  const handleMainAction = () => {
    if (isReward) {
      if (canAfford) {
        onAction(`${item.name} Redeemed Successfully!`, 'reward');
      }
    } else {
      const message = `Bhai, I want to order this product: ${item.name}`;
      const whatsappUrl = `https://wa.me/${SUPPORT_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      onAction(`Redirecting to WhatsApp for ${item.name}...`, 'cart');
    }
  };

  const imageUrl = item.image || item.image_url;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-t-[3rem] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-full max-h-[92dvh] md:max-h-[80vh] shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-500 mt-auto md:mt-0">
        
        {/* Close Button - Mobile Only Top Bar Overlay */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[160] p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white active:scale-90 transition-all md:hidden"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Left Side: Image - Clickable for Preview */}
        <div 
          onClick={() => onPreviewImage(imageUrl)}
          className="relative w-full md:w-1/2 h-64 sm:h-80 md:h-auto shrink-0 bg-[#f1f5f9] cursor-zoom-in group"
        >
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
          />
          
          {/* Zoom Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white shadow-2xl">
                <Maximize2 size={24} strokeWidth={3} />
             </div>
          </div>

          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm flex items-center gap-2 border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest">Click to Preview</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Close Button Desktop */}
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-400 active:scale-90 transition-all z-20"
          >
            <X size={24} strokeWidth={3} />
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-14 pb-24 md:pb-14">
            <div className="space-y-6 md:space-y-8">
              {/* Tag & Title */}
              <div>
                <span className={`inline-block px-3 py-1.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4 border ${
                  isReward ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                }`}>
                  {isReward ? 'Lucky Reward' : 'Premium Catalog Item'}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-none uppercase tracking-tighter italic">
                  {item.name}
                </h2>
              </div>

              {/* Dark Stats Box */}
              <div className="bg-[#1e1b4b] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {isReward ? 'Redemption Cost' : 'Order Information'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-black italic tracking-tighter">
                      {isReward ? `${requiredPts} PTS` : 'Contact for Price'}
                    </span>
                  </div>
                </div>
                
                {isReward && (
                  <div className="text-left sm:text-right relative z-10 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 w-full sm:w-auto">
                     <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       Your Balance: <span className={userPoints >= requiredPts ? 'text-emerald-400' : 'text-rose-400'}>{userPoints} PTS</span>
                     </p>
                  </div>
                )}
              </div>

              {/* Information Card */}
              <div className="bg-slate-50/80 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 relative group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Info size={16} className="text-emerald-500" />
                  </div>
                  <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</h3>
                </div>
                <p className="text-slate-600 text-sm md:text-base font-bold italic leading-relaxed">
                  "{item.description || "Ye product best quality hai Lucky Lubricants ki taraf se. Order ke liye niche diye gaye button pe click karein."}"
                </p>
              </div>

              {!isReward && (
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <PhoneCall className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-blue-400 tracking-widest">Support Line</p>
                    <p className="text-xs font-black text-slate-800">{SUPPORT_NUMBER}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-14 bg-gradient-to-t from-white via-white to-transparent md:bg-white md:relative md:p-10 md:pt-0">
            {isReward ? (
              <button 
                onClick={handleMainAction}
                disabled={!canAfford}
                className={`w-full py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 md:gap-4 transition-all active:scale-95 italic ${
                  canAfford 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed grayscale'
                }`}
              >
                <Gift size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
                {canAfford ? 'CLAIM REWARD' : 'LACKING POINTS'}
              </button>
            ) : (
              <button 
                onClick={handleMainAction}
                className="w-full bg-[#1e1b4b] text-white py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-indigo-950/20 flex items-center justify-center gap-3 md:gap-4 active:scale-95 transition-all italic uppercase"
              >
                <MessageCircle size={20} className="md:w-6 md:h-6 text-emerald-400" strokeWidth={2.5} />
                ORDER ON WHATSAPP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;

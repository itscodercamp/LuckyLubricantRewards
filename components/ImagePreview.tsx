
import React from 'react';
import { X, ZoomIn, Info } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center animate-in fade-in duration-300 overflow-hidden">
      {/* 1. Dynamic Blurred Background Layer */}
      <div 
        className="absolute inset-0 bg-black z-0" 
        onClick={onClose}
      />
      <div 
        className="absolute inset-0 z-0 opacity-40 scale-110 blur-3xl saturate-150"
        style={{ 
          backgroundImage: `url(${imageUrl})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />
      
      {/* 2. Top Controls - Professional Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[610] bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
            <ZoomIn className="text-white/80" size={20} />
          </div>
          <div>
            <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">HD PREVIEW</p>
            <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mt-1">Lucky Lubricants Original</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      {/* 3. Main Image - Clean, No Border/Shadow Box */}
      <div 
        className="relative z-[605] w-full h-full flex items-center justify-center p-4 md:p-20"
        onClick={onClose}
      >
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-w-full max-h-[75vh] object-contain animate-in zoom-in-95 duration-500 pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          style={{ filter: 'contrast(1.02)' }}
        />
      </div>

      {/* 4. Bottom Hint */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[610] pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2">
          <Info size={14} className="text-white/40" />
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] italic">Tap anywhere to return</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;


import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';

interface ScannerProps {
  onClose: () => void;
  onScanSuccess: (code: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play();
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    }

    setupCamera();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !isDetected && !isProcessing) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data) {
            handleCodeFound(code.data);
            return;
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  const handleCodeFound = (data: string) => {
    setIsDetected(true);
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(() => {
      onScanSuccess(data);
    }, 800);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleCodeFound(code.data);
        } else {
          setError("No QR code found in this image.");
          setIsProcessing(false);
          // Clear error after 3 seconds
          setTimeout(() => setError(null), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be chosen again
    e.target.value = '';
  };

  useEffect(() => {
    if (hasPermission && !isDetected && !isProcessing) {
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hasPermission, isDetected, isProcessing]);

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/20">
          <X className="text-white" size={40} />
        </div>
        <h2 className="text-white text-xl font-[900] uppercase italic tracking-tighter">Permission Denied</h2>
        <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-widest leading-relaxed">Enable camera access to scan vouchers or use the gallery below.</p>
        <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
          <button onClick={handleGalleryClick} className="bg-emerald-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic flex items-center justify-center gap-2">
            <ImageIcon size={16} /> OPEN GALLERY
          </button>
          <button onClick={onClose} className="bg-white/10 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic border border-white/10">GO BACK</button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden animate-in fade-in duration-500">
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      <video 
        ref={videoRef} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isProcessing ? 'opacity-30' : 'opacity-70'}`}
      />

      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
          <button onClick={onClose} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white active:scale-90 transition-transform">
            <X size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-white text-sm font-black italic tracking-[0.2em] uppercase">Lucky Scanner</h2>
            <p className={`text-[9px] font-bold uppercase mt-1 ${isDetected ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isProcessing ? 'PROCESSING IMAGE...' : isDetected ? 'CODE CAPTURED!' : 'Detecting Voucher...'}
            </p>
          </div>
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
            <Zap size={20} />
          </button>
        </div>

        {/* Viewfinder */}
        <div className="flex-1 flex items-center justify-center relative">
          {error && (
            <div className="absolute top-10 left-4 right-4 z-[60] animate-in slide-in-from-top-4 duration-300">
              <div className="bg-rose-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
                <AlertCircle size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            </div>
          )}

          <div className="relative w-72 h-72">
            {/* Corners */}
            <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-3xl z-20 transition-colors duration-300 ${isDetected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'border-white/40'}`}></div>
            <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-3xl z-20 transition-colors duration-300 ${isDetected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'border-white/40'}`}></div>
            <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-3xl z-20 transition-colors duration-300 ${isDetected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'border-white/40'}`}></div>
            <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-3xl z-20 transition-colors duration-300 ${isDetected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'border-white/40'}`}></div>

            {/* Frame Body */}
            <div className={`absolute inset-0 rounded-3xl border transition-all duration-300 ${isDetected ? 'bg-emerald-500/20 border-emerald-500/50 scale-105' : 'bg-white/5 border-white/10'}`}></div>

            {/* Scanning Line / Success State */}
            {isDetected ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/30 backdrop-blur-[2px] rounded-3xl z-30 animate-in zoom-in duration-300">
                 <CheckCircle2 className="text-white mb-2" size={60} strokeWidth={3} />
                 <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Validated</p>
              </div>
            ) : isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                <Loader2 className="text-white animate-spin mb-3" size={48} />
                <p className="text-white text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Reading Image</p>
              </div>
            ) : (
              <div className="absolute left-6 right-6 h-[2px] bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-scan z-30"></div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-gradient-to-t from-black/90 to-transparent text-center z-50">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Align QR code within the frame</p>
          <div className="flex gap-4">
            <button 
              onClick={handleGalleryClick}
              disabled={isProcessing || isDetected}
              className="flex-1 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <ImageIcon size={18} /> GALLERY
            </button>
            <button 
              onClick={() => onScanSuccess('MANUAL-VOUCHER-ENTRY')}
              disabled={isProcessing || isDetected}
              className="flex-1 bg-white text-[#0f172a] py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              MANUAL ENTRY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;

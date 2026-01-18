import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, ArrowBigDownDash } from 'lucide-react';

interface InstallPromptProps {
    deferredPrompt: any;
    onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ deferredPrompt, onClose }) => {
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            // Check if the app is currently running in standalone mode (already installed)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true ||
                document.referrer.includes('android-app://');

            // If already installed, don't show prompt
            if (isStandalone) {
                setIsStandalone(true);
                return true;
            }

            // Also check if we previously flagged as installed
            const wasInstalled = localStorage.getItem('pwa_installed') === 'true';
            setIsStandalone(wasInstalled);
            return wasInstalled;
        };
        checkStandalone();
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            localStorage.setItem('pwa_installed', 'true');
            onClose();
        }
    };

    if (isStandalone) return null;

    return (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-[#1e1b4b] rounded-[2.5rem] border border-purple-500/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
                <div className="relative p-8 flex flex-col items-center text-center">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Logo Container */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-[#2e2a75] to-[#1e1b4b] rounded-3xl p-4 border border-purple-500/20 shadow-inner flex items-center justify-center">
                            <img src="/logo.png" alt="App Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-xl shadow-lg animate-bounce">
                            <Download size={16} />
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider mb-2">Install App</h2>
                    <p className="text-purple-200/60 text-sm leading-relaxed mb-8">
                        Install <span className="text-purple-400 font-bold italic">Lucky Lubricants</span> on your home screen for a premium experience and faster access to rewards.
                    </p>

                    <div className="grid grid-cols-1 w-full gap-3">
                        <button
                            onClick={handleInstall}
                            disabled={!deferredPrompt}
                            className="group relative w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] active:scale-95 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2">
                                Install Now <Download size={18} />
                            </span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-purple-400 font-bold italic uppercase tracking-wider text-xs hover:text-purple-300 transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Footer info */}
                <div className="bg-white/5 p-4 border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center justify-center gap-2 italic">
                        <Smartphone size={10} /> Progressive Web App Powered
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;

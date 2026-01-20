
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShoppingCart, Gift, AlertCircle, Download, X, CircleAlert, PackagePlus, ShoppingBag } from 'lucide-react';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import About from './pages/About.tsx';
import Profile from './pages/Profile.tsx';
import Rewards from './pages/Rewards.tsx';
import Auth from './pages/Auth.tsx';
import DetailModal from './components/DetailModal.tsx';
import NotificationPanel from './components/NotificationPanel.tsx';
import ImagePreview from './components/ImagePreview.tsx';
// import InstallPrompt from './components/InstallPrompt.tsx';
import { TabType, User, Reward, Product } from './types.ts';

import { api } from './services/api.ts';

interface SplashScreenProps {
  onContinue: () => void;
  onInstall: () => void;
  canInstall: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue, onInstall, canInstall }) => (
  <div className="fixed inset-0 bg-[#1e1b4b] flex flex-col items-center justify-center z-[200] p-6 text-center overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>

    <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
      <div className="w-36 h-36 bg-transparent flex items-center justify-center mb-8 animate-bounce">
        <img src="/logo.png" alt="Lucky Lubricants" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]" />
      </div>

      <h1 className="text-white text-3xl font-black tracking-[0.2em] italic mb-2 uppercase">LUCKY LUBRICANTS</h1>
      <p className="text-purple-300/60 text-xs font-black uppercase tracking-[0.4em] mb-12 italic">Premium Performance Hub</p>

      <div className="flex flex-col gap-4 w-full">
        {canInstall && (
          <button
            onClick={onInstall}
            className="group relative w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              <Download size={22} className="animate-bounce" /> Download Mobile App
            </span>
          </button>
        )}

        <button
          onClick={onContinue}
          className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black italic uppercase tracking-widest text-purple-200 hover:bg-white/10 active:scale-95 transition-all text-xs backdrop-blur-sm"
        >
          Continue on Web
        </button>
      </div>

      <p className="mt-12 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
        <span className="w-8 h-[1px] bg-white/10"></span>
        Welcome to the Rewards
        <span className="w-8 h-[1px] bg-white/10"></span>
      </p>
    </div>

    <div className="absolute bottom-8 flex gap-2">
      <div className="w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-bounce"></div>
    </div>
  </div>
);


const App: React.FC = () => {
  const SESSION_DURATION = 24 * 60 * 60 * 1000;

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('lucky_token');
    const sessionStart = localStorage.getItem('lucky_session_start');
    if (!token || !sessionStart) return false;

    const duration = Date.now() - parseInt(sessionStart, 10);
    return duration < SESSION_DURATION;
  });

  const [showSplash, setShowSplash] = useState(() => {
    // Check if running in standalone mode (PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      localStorage.getItem('pwa_installed') === 'true';

    if (isStandalone) return false;

    const token = localStorage.getItem('lucky_token');
    const sessionStart = localStorage.getItem('lucky_session_start');

    // If logged in and session is still valid, skip splash entirely
    if (token && sessionStart) {
      const duration = Date.now() - parseInt(sessionStart, 10);
      if (duration < SESSION_DURATION) return false;
    }

    return true;
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ item: any, type: 'product' | 'reward' } | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'cart' | 'reward' | 'error' | 'install' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);


  const [user, setUser] = useState<User>({
    name: "Guest User",
    email: "",
    phone: "",
    points: 0,
    notifications: []
  });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const checkSession = async () => {
      const token = localStorage.getItem('lucky_token');
      const sessionStart = localStorage.getItem('lucky_session_start');

      if (token && sessionStart) {
        const duration = Date.now() - parseInt(sessionStart, 10);
        if (duration < SESSION_DURATION) {
          try {
            await refreshUserData();
            setIsLoggedIn(true);
          } catch (e) {
            console.warn("Background session sync failed, keeping local session active", e);
          }
        } else {
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);


  const refreshUserData = async () => {
    try {
      const [profile, balanceData, notifications] = await Promise.all([
        api.getProfile(),
        api.getBalance(),
        api.getNotifications()
      ]);

      setUser({
        ...profile,
        points: balanceData.points || 0,
        notifications: Array.isArray(notifications) ? notifications : []
      });
    } catch (e) {
      console.error("Failed to sync with backend", e);
    }
  };

  const triggerToast = (message: string, type: 'success' | 'cart' | 'reward' | 'error' | 'install' = 'success') => {
    setToast({ message, type });
    if (type !== 'install') {
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleScanVoucher = async (uuid: string) => {
    setIsLoading(true);
    try {
      const result = await api.scanVoucher(uuid);
      triggerToast(`Success! ${result.points_earned || 0} points added.`, 'success');
      await refreshUserData();
    } catch (e: any) {
      triggerToast(e.message || 'Scan failed. Code may be invalid.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalAction = async (message: string, type: 'cart' | 'reward') => {
    if (type === 'reward' && selectedItem?.type === 'reward') {
      setIsLoading(true);
      try {
        const reward = selectedItem.item as Reward;
        const result = await api.redeemReward(reward.id);
        triggerToast(result.message || "Redemption Successful!", 'reward');
        await refreshUserData();
        setSelectedItem(null);
      } catch (e: any) {
        triggerToast(e.message || 'Redemption failed. Check points.', 'error');
      } finally {
        setIsLoading(false);
      }
    } else if (type === 'cart' && selectedItem?.type === 'product') {
      triggerToast(message, 'cart');
      setSelectedItem(null);
    }
  };

  const handleLogin = (data: any) => {
    refreshUserData().then(() => {
      setIsLoggedIn(true);
      setActiveTab('home');
    });

  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowSplash(false);
    }
  };

  if (showSplash) {
    return (
      <SplashScreen
        onContinue={() => setShowSplash(false)}
        onInstall={handleInstallClick}
        canInstall={!!deferredPrompt}
      />
    );
  }

  return (

    <>
      {!isLoggedIn ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onNotificationClick={() => setShowNotifications(true)}>
          {activeTab === 'home' && (
            <Home
              user={user}
              onNavigateRewards={() => setActiveTab('rewards')}
              onScanVoucher={handleScanVoucher}
              canInstall={!!deferredPrompt}
              onInstall={() => deferredPrompt?.prompt()}
              onSelectProduct={(p) => setSelectedItem({ item: p, type: 'product' })}
              onSelectReward={(r) => setSelectedItem({ item: r, type: 'reward' })}
            />
          )}
          {activeTab === 'products' && (
            <div className="relative">
              <Products onSelectProduct={(p) => setSelectedItem({ item: p, type: 'product' })} />
            </div>
          )}
          {activeTab === 'rewards' && <Rewards user={user} onBack={() => setActiveTab('home')} onSelectReward={(r) => setSelectedItem({ item: r, type: 'reward' })} />}
          {activeTab === 'about' && <About />}
          {activeTab === 'profile' && <Profile user={user} onLogout={handleLogout} />}
        </Layout>
      )}

      {toast && (
        <div className="fixed top-20 left-4 right-4 z-[300] animate-in fade-in slide-in-from-top-12 duration-500">
          <div className={`p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center gap-4 border backdrop-blur-xl ${toast.type === 'reward' ? 'bg-emerald-500 border-emerald-400 text-white' :
            toast.type === 'error' ? 'bg-rose-600 border-rose-400 text-white' :
              toast.type === 'cart' ? 'bg-indigo-600 border-indigo-400 text-white' :
                'bg-[#1e1b4b] border-purple-500/30 text-white'
            }`}>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20">
              {toast.type === 'reward' && <Gift size={24} />}
              {toast.type === 'error' && <CircleAlert size={24} />}
              {toast.type === 'cart' && <PackagePlus size={24} />}
              {(toast.type === 'success' || toast.type === 'install') && <CheckCircle2 size={24} />}
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-0.5 italic">
                Lucky System Alert
              </h4>
              <p className="text-sm font-black italic uppercase leading-tight tracking-tight">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-2 text-white/40 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {showNotifications && (
        <NotificationPanel notifications={user.notifications} onClose={() => setShowNotifications(false)} onClear={() => { }} onMarkAsRead={() => { }} />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem.item}
          type={selectedItem.type}
          userPoints={user.points}
          onClose={() => setSelectedItem(null)}
          onAction={handleModalAction}
          onPreviewImage={(url) => setPreviewImageUrl(url)}
        />
      )}

      {previewImageUrl && (
        <ImagePreview imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[400] bg-black/40 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-[#1e1b4b] p-10 rounded-[3rem] shadow-2xl flex flex-col items-center border border-purple-500/20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse italic">Processing Transaction...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

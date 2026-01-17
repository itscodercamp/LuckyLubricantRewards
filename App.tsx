
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
import { TabType, User, Reward, Product } from './types.ts';
import { api } from './services/api.ts';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-[#1e1b4b] flex flex-col items-center justify-center z-[200] animate-in fade-in duration-700">
    <div className="w-32 h-32 bg-transparent flex items-center justify-center mb-8 animate-bounce">
      <img src="/logo.png" alt="Lucky Lubricants" className="w-full h-full object-contain drop-shadow-2xl" />
    </div>
    <h1 className="text-white text-2xl font-black tracking-widest italic mb-4 animate-pulse uppercase">LUCKY LUBRICANTS</h1>
    <div className="flex gap-1.5">
      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
    </div>
    <p className="text-purple-100/40 text-[9px] font-black uppercase tracking-[0.3em] mt-12 italic">Premium Performance Hub</p>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{item: any, type: 'product' | 'reward'} | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'cart' | 'reward' | 'error' | 'install'} | null>(null);
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
      const userId = localStorage.getItem('lucky_user_id');
      if (token && userId) {
        try {
          await refreshUserData();
          setIsLoggedIn(true);
        } catch (e) {
          localStorage.removeItem('lucky_token');
          localStorage.removeItem('lucky_user_id');
        }
      }
      setTimeout(() => setShowSplash(false), 2000);
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

  if (showSplash) return <SplashScreen />;
  if (!isLoggedIn) return <Auth onLogin={handleLogin} />;

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onNotificationClick={() => setShowNotifications(true)}>
        {activeTab === 'home' && (
          <Home 
            user={user} 
            onNavigateRewards={() => setActiveTab('rewards')} 
            onScanVoucher={handleScanVoucher}
            canInstall={!!deferredPrompt}
            onInstall={() => deferredPrompt?.prompt()}
            onSelectProduct={(p) => setSelectedItem({item: p, type: 'product'})}
            onSelectReward={(r) => setSelectedItem({item: r, type: 'reward'})}
          />
        )}
        {activeTab === 'products' && (
          <div className="relative">
            <Products onSelectProduct={(p) => setSelectedItem({item: p, type: 'product'})} />
          </div>
        )}
        {activeTab === 'rewards' && <Rewards user={user} onBack={() => setActiveTab('home')} onSelectReward={(r) => setSelectedItem({item: r, type: 'reward'})} />}
        {activeTab === 'about' && <About />}
        {activeTab === 'profile' && <Profile user={user} onLogout={handleLogout} />}
      </Layout>

      {toast && (
        <div className="fixed top-20 left-4 right-4 z-[300] animate-in fade-in slide-in-from-top-12 duration-500">
          <div className={`p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center gap-4 border backdrop-blur-xl ${
            toast.type === 'reward' ? 'bg-emerald-500 border-emerald-400 text-white' : 
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
        <NotificationPanel notifications={user.notifications} onClose={() => setShowNotifications(false)} onClear={() => {}} onMarkAsRead={() => {}} />
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

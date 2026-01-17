
import React from 'react';
import { Bell, Wallet, Home, Package, Info, User as UserIcon, HelpCircle, LogOut } from 'lucide-react';
import { TabType, User } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: User;
  onNotificationClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onNotificationClick }) => {
  const notifications = Array.isArray(user.notifications) ? user.notifications : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Home' },
    { id: 'products', icon: <Package size={22} />, label: 'Catalog' },
    { id: 'rewards', icon: <Wallet size={22} />, label: 'Rewards' },
    { id: 'about', icon: <Info size={22} />, label: 'About' },
    { id: 'profile', icon: <UserIcon size={22} />, label: 'Account' },
  ];

  return (
    <div className="flex min-h-[100dvh] bg-[#f5f3ff] text-slate-900 overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#1e1b4b] text-white fixed h-screen z-50 border-r border-purple-500/10">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic leading-none uppercase">
            Lucky<br />
            <span className="text-purple-400 text-xs font-bold tracking-[0.2em] not-italic">Lubricants</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${activeTab === item.id || (item.id === 'home' && activeTab === 'rewards')
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20 translate-x-1'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Balance</p>
            <p className="text-2xl font-black text-purple-400 italic tabular-nums">{user.points} <span className="text-[10px] text-white/40 not-italic uppercase">Pts</span></p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 transition-all duration-300 min-h-[100dvh] w-full max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#1e1b4b] backdrop-blur-xl text-white px-4 md:px-6 py-3 md:py-6 flex justify-between items-center border-b border-purple-500/10 shadow-lg w-full shrink-0">
          <div className="flex items-center gap-2 md:hidden min-w-0">
            <div className="w-10 h-10 shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[10px] font-black tracking-tighter italic uppercase text-white leading-tight truncate">
              Lucky<br />
              <span className="text-purple-400 text-[8px] font-bold tracking-widest not-italic">Lubricants</span>
            </h1>
          </div>

          <div className="hidden md:block">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 italic">Member Dashboard</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 shadow-inner">
              <Wallet size={14} className="shrink-0" />
              <span className="text-xs font-black tabular-nums tracking-tighter">{user.points} PTS</span>
            </div>

            <button
              onClick={onNotificationClick}
              className="relative p-1.5 text-slate-400 hover:text-purple-400 transition-colors active:scale-90"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#1e1b4b] text-[8px] flex items-center justify-center font-black text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area - Fixed mobile padding */}
        <main className="flex-1 px-0 md:px-10 lg:px-12 max-w-7xl mx-auto w-full pb-28 md:pb-12 overflow-x-hidden">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e1b4b]/95 backdrop-blur-2xl border-t border-purple-500/10 flex justify-around items-center pt-3 pb-safe px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] z-50 rounded-t-[2rem]">
          <div className="w-full flex justify-around items-center pb-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center gap-1 transition-all relative px-2 py-1 ${activeTab === item.id || (item.id === 'home' && activeTab === 'rewards') ? 'text-purple-400' : 'text-slate-500'
                  }`}
              >
                <div className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110 -translate-y-0.5 nav-active-glow text-purple-400' : ''}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,1)]"></div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;

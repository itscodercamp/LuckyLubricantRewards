
import React from 'react';
/* Added ChevronRight to imports to resolve compilation error */
import { X, Bell, Trash2, Check, Clock, ChevronRight } from 'lucide-react';
import { AppNotification } from '../types.ts';

interface NotificationPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
  onClear: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications: rawNotifications, onClose, onClear, onMarkAsRead }) => {
  // Defensive check
  const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col rounded-l-[3rem] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0f172a] p-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black tracking-tight italic uppercase flex items-center gap-3">
              <Bell className="text-emerald-500" size={24} />
              Alerts
            </h2>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold">
                {notifications.length}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Messages</span>
            </div>
            <button 
              onClick={onClear}
              className="flex items-center gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-30">
              <Bell size={64} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">No new alerts</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => onMarkAsRead(notif.id)}
                className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer ${
                  notif.isRead 
                  ? 'bg-white border-slate-100 opacity-60' 
                  : 'bg-emerald-50/50 border-emerald-100 shadow-sm'
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
                <div className="flex justify-between items-start mb-2 pl-4">
                  <h3 className={`text-sm font-black uppercase tracking-tight ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                    {notif.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <Clock size={10} />
                    {notif.time}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed pl-4">
                  {notif.message}
                </p>
                <div className="mt-4 flex justify-end pl-4">
                  {notif.isRead ? (
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Check size={10} /> Read
                      </div>
                    </span>
                  ) : (
                    <button className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                      Mark as Read <ChevronRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-8 border-t border-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Lucky Lubricants Support</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;

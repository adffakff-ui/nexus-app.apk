import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Video, 
  Radio, 
  Mic, 
  MessageSquare, 
  Wallet, 
  BarChart3, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Download
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    logout, 
    notifications,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'feed', label: 'الرئيسية', icon: Home },
    { id: 'reels', label: 'ريلز قصيرة', icon: Video },
    { id: 'live', label: 'البث المباشر', icon: Radio, badge: 'مباشر' },
    { id: 'voice', label: 'دردشات صوتية مشفرة', icon: Mic },
    { id: 'messages', label: 'المحادثات الفورية', icon: MessageSquare },
    { id: 'saved', label: 'المحفوظات', icon: Bookmark },
    { id: 'wallet', label: 'المحفظة والدعم', icon: Wallet },
    { id: 'analytics', label: 'لوحة التحكم والتحليلات', icon: BarChart3 },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, count: unreadNotifs },
    { id: 'profile', label: 'الملف الشخصي', icon: UserIcon },
    { id: 'settings', label: 'الإعدادات والأمان', icon: Settings },
    { id: 'download', label: 'تنزيل تطبيق الجوال', icon: Download, badge: 'APK' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-16 right-0 h-screen lg:h-[calc(100vh-4rem)] w-72 lg:w-64 
        bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 
        z-50 lg:z-0 p-4 space-y-6 overflow-y-auto transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile Header (Only visible when side menu is open as a drawer) */}
        <div className="flex items-center justify-between lg:hidden mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">N</div>
             <span className="font-bold text-sm">نكسوس برو</span>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </button>
        </div>      
      {/* Current User Card */}
      {currentUser && (
        <div 
          onClick={() => handleNavClick('profile')}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-700/60"
        >
          <div className="relative">
            {currentUser.avatar && currentUser.avatar.length > 5 ? (
              <img src={currentUser.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <UserIcon className="w-6 h-6 text-slate-400" />
              </div>
            )}
            {currentUser.verified && (
              <CheckCircle2 className="w-4 h-4 text-indigo-500 absolute -bottom-1 -right-1 fill-white dark:fill-slate-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.username}</p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Security & Encryption Banner */}
      <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>حماية ومشفر بالكامل</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          البيانات والمحادثات محمية بنظام تشفير تاما بين الطرفين مع مصادقة ثنائية آمنة.
        </p>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>تسجيل الخروج</span>
      </button>

    </aside>
    </>
  );
};

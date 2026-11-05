import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Send, PlaySquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, chats } = useApp();

  const unreadMessagesCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around text-white sm:hidden select-none">
      {/* Home / الرئيسية */}
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex items-center justify-center p-2 rounded-2xl transition-all ${
          activeTab === 'feed'
            ? 'bg-slate-800/90 text-white shadow-inner scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
        title="الرئيسية"
      >
        <Home className="w-6 h-6 stroke-[2.2]" />
      </button>

      {/* Explore / Search */}
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex items-center justify-center p-2 rounded-2xl transition-all ${
          activeTab === 'search'
            ? 'bg-slate-800/90 text-white shadow-inner scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
        title="بحث واستكشاف"
      >
        <Search className="w-6 h-6 stroke-[2.2]" />
      </button>

      {/* Direct Messages / الرسائل مع نقطة الإشعار الحمراء */}
      <button
        onClick={() => setActiveTab('messages')}
        className={`relative flex items-center justify-center p-2 rounded-2xl transition-all ${
          activeTab === 'messages'
            ? 'bg-slate-800/90 text-white shadow-inner scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
        title="الرسائل والمحادثات"
      >
        <Send className="w-6 h-6 stroke-[2.2] -rotate-45 translate-x-0.5 -translate-y-0.5" />
        {unreadMessagesCount > 0 && (
          <span className="absolute bottom-1.5 left-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-black animate-pulse" />
        )}
      </button>

      {/* Reels / ريلز */}
      <button
        onClick={() => setActiveTab('reels')}
        className={`flex items-center justify-center p-2 rounded-2xl transition-all ${
          activeTab === 'reels'
            ? 'bg-slate-800/90 text-white shadow-inner scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
        title="مقاطع ريلز"
      >
        <div className="relative">
          <PlaySquare className="w-6 h-6 stroke-[2.2]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 border-t border-b border-l border-transparent border-l-current" />
          </div>
        </div>
      </button>

      {/* Profile Avatar / الملف الشخصي */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex items-center justify-center p-2 rounded-2xl transition-all ${
          activeTab === 'profile'
            ? 'bg-slate-800/90 text-white shadow-inner scale-105'
            : 'text-slate-400 hover:text-white'
        }`}
        title="الملف الشخصي"
      >
        <div className={`relative ${activeTab === 'profile' ? 'ring-2 ring-indigo-500 rounded-full' : ''}`}>
          {currentUser?.avatar && currentUser.avatar.length > 5 ? (
            <img
              src={currentUser.avatar}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className={`w-6 h-6 stroke-[2.2] ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
          )}
        </div>
      </button>
    </nav>
  );
};

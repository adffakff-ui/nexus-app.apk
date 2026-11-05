import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Bell, 
  Wallet, 
  Search, 
  Globe, 
  Moon, 
  Sun, 
  ShieldCheck, 
  X, 
  History, 
  Trash2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Menu,
  Download
} from 'lucide-react';
import { NotificationItem, Language } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    markNotificationsRead, 
    setIsAiModalOpen, 
    theme, 
    setTheme, 
    language, 
    setLanguage,
    setActiveTab,
    posts,
    reels,
    liveStreams,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Recent searches stored in state and localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return ['#تواصل', '#جديد', '#استكشاف'];
  });

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('nexus_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const deleteRecentSearch = (queryToDelete: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(q => q !== queryToDelete);
      try {
        localStorage.setItem('nexus_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('nexus_recent_searches');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectQuery = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    setIsSearchFocused(false);
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden p-2 -mr-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="القائمة"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer flex-1 lg:flex-none" onClick={() => setActiveTab('feed')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            N
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              نكسوس <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">Pro</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">عالمك الاجتماعي الذكي والمشفر</p>
          </div>
        </div>

        {/* Smart Instant Search Bar (Desktop) with Recent Searches Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-md relative hidden md:block">
          <div className="relative group">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن أشخاص، هاشتاقات، أو محتوى..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  saveRecentSearch(searchQuery);
                  setIsSearchFocused(false);
                }
              }}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-4 pr-10 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent dark:border-slate-700 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown: shows Recent Searches when query is empty, and filtered results when typing */}
          {isSearchFocused && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto no-scrollbar">
              {searchQuery.trim().length > 0 ? (
                <SearchDropdown 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  posts={posts} 
                  reels={reels} 
                  liveStreams={liveStreams} 
                  setActiveTab={(tab) => {
                    saveRecentSearch(searchQuery);
                    setActiveTab(tab);
                    setIsSearchFocused(false);
                  }}
                  onSelectQuery={(q) => {
                    saveRecentSearch(q);
                    setIsSearchFocused(false);
                  }}
                />
              ) : (
                /* Recent Searches Dropdown */
                <div>
                  <div className="p-3.5 px-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <History className="w-3.5 h-3.5 text-indigo-500" />
                      <span>عمليات البحث الأخيرة</span>
                    </div>
                    {recentSearches.length > 0 && (
                      <button 
                        onClick={clearAllRecentSearches}
                        className="text-[11px] text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>مسح الكل</span>
                      </button>
                    )}
                  </div>

                  {recentSearches.length > 0 ? (
                    <div className="py-1 divide-y divide-slate-100/60 dark:divide-slate-700/40">
                      {recentSearches.map((query) => (
                        <div 
                          key={query}
                          className="flex items-center justify-between p-2.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer group transition-colors"
                        >
                          <div 
                            onClick={() => handleSelectQuery(query)}
                            className="flex items-center gap-2.5 flex-1 min-w-0"
                          >
                            <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                              {query}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecentSearch(query);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                            title="إزالة من السجل"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                        <History className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">لا توجد عمليات بحث سابقة</p>
                      <p className="text-[10px] text-slate-400 mt-1">عمليات البحث التي تجريها ستظهر هنا للوصول السريع</p>
                    </div>
                  )}

                  {/* Quick trending tags preview */}
                  <div className="p-3 px-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-indigo-500" />
                      <span>اقتراحات رائجة</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['#رائج', '#محتوى', '#تواصل'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleSelectQuery(tag)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-medium transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
            title="البحث"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* PWA App Install Button */}
          <PWAInstallButton />

          {/* Download App View Button */}
          <button
            onClick={() => setActiveTab('download')}
            className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            title="تحميل تطبيق الأندرويد والتعليمات"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تحميل APK</span>
          </button>

          {/* AI Assistant Button with High Thinking */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">مساعد الذكاء الاصطناعي</span>
          </button>

          {/* Wallet Balance */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all"
            title="محفظة الأرباح والدعم"
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>${currentUser?.walletBalance.toFixed(2)}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">الإشعارات الفورية</h3>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer" onClick={markNotificationsRead}>الكل مقروء</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {notifications.map((n: NotificationItem) => (
                    <div key={n.id} className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex gap-3 transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                      {n.actorAvatar && n.actorAvatar.length > 5 ? (
                        <img src={n.actorAvatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
            title="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              const langs: Language[] = ['ar', 'en', 'fr', 'es'];
              const idx = langs.indexOf(language);
              setLanguage(langs[(idx + 1) % langs.length]);
            }}
            className="hidden lg:flex items-center gap-1.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
            title="تغيير اللغة"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{language}</span>
          </button>

        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-top duration-300 md:hidden flex flex-col">
          <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <button 
              onClick={() => setIsMobileSearchOpen(false)} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="ابحث عن أشخاص، هاشتاقات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    saveRecentSearch(searchQuery);
                  }
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-10 py-2.5 rounded-xl text-sm focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setIsMobileSearchOpen(false); }} 
              className="text-xs font-bold text-indigo-600 px-1"
            >
              إلغاء
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-20">
            {searchQuery.trim().length > 0 ? (
              <SearchDropdown 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                posts={posts} 
                reels={reels} 
                liveStreams={liveStreams} 
                setActiveTab={(tab) => { 
                  saveRecentSearch(searchQuery);
                  setActiveTab(tab); 
                  setIsMobileSearchOpen(false); 
                  setSearchQuery(''); 
                }} 
                onSelectQuery={(q) => {
                  saveRecentSearch(q);
                  setIsMobileSearchOpen(false);
                }}
              />
            ) : (
              /* Mobile Recent Searches */
              <div>
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span>عمليات البحث الأخيرة</span>
                  </div>
                  {recentSearches.length > 0 && (
                    <button 
                      onClick={clearAllRecentSearches}
                      className="text-xs text-rose-500 font-semibold"
                    >
                      مسح الكل
                    </button>
                  )}
                </div>

                {recentSearches.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentSearches.map((query) => (
                      <div 
                        key={query}
                        className="flex items-center justify-between p-3.5 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      >
                        <div 
                          onClick={() => {
                            setSearchQuery(query);
                            saveRecentSearch(query);
                          }}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {query}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecentSearch(query);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <History className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">لا توجد عمليات بحث سابقة</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ابدأ بالبحث عن أصدقائك أو المحتوى المميز</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Extracted SearchDropdown for reuse
const SearchDropdown: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  posts: any[];
  reels: any[];
  liveStreams: any[];
  setActiveTab: (tab: string) => void;
  onSelectQuery?: (q: string) => void;
}> = ({ searchQuery, setSearchQuery, posts, reels, liveStreams, setActiveTab, onSelectQuery }) => {
  const users = Array.from(new Set([
    ...posts.map(p => ({ id: p.userId, name: p.userName, handle: p.userHandle, avatar: p.userAvatar })),
    ...reels.map(r => ({ id: r.userId, name: r.userName, handle: `@${r.userName.replace(/\s/g, '_').toLowerCase()}`, avatar: r.userAvatar })),
    ...liveStreams.map(l => ({ id: l.streamerId, name: l.streamerName, handle: `@${l.streamerName.replace(/\s/g, '_').toLowerCase()}`, avatar: l.streamerAvatar }))
  ])).filter((u, index, self) => 
    self.findIndex(t => t.id === u.id) === index && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  const hashtags = Array.from(new Set(
    [...posts, ...reels]
      .map(item => ('content' in item ? item.content : item.caption) || '')
      .flatMap(text => text.match(/#[\w\u0621-\u064A]+/g) || [])
  )).filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);

  const contentResults = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const hasAnyResults = users.length > 0 || hashtags.length > 0 || contentResults.length > 0;

  return (
    <>
      {/* Users Results */}
      {users.length > 0 && (
        <div className="border-b border-slate-100 dark:border-slate-700/50">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            <span>الأشخاص</span>
          </div>
          {users.map(user => (
            <div 
              key={user.id} 
              onClick={() => {
                if (onSelectQuery) onSelectQuery(user.name);
                setActiveTab('profile');
              }}
              className="p-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 cursor-pointer transition-colors"
            >
              {user.avatar && user.avatar.length > 5 ? (
                <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600" alt="" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                <span className="text-xs text-slate-500 truncate">{user.handle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hashtags Results */}
      {hashtags.length > 0 && (
        <div className="border-b border-slate-100 dark:border-slate-700/50">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>الهاشتاقات المتصدرة</span>
          </div>
          <div className="p-2 px-3 flex flex-wrap gap-1.5">
            {hashtags.map(tag => (
              <button 
                key={tag}
                onClick={() => {
                  if (onSelectQuery) onSelectQuery(tag);
                  setSearchQuery(tag);
                  setActiveTab('feed');
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100/50 dark:border-indigo-800/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Results */}
      {contentResults.length > 0 && (
        <div>
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-1.5">
            <Search className="w-3 h-3" />
            <span>المنشورات والمحتوى</span>
          </div>
          {contentResults.map(post => (
            <div 
              key={post.id} 
              onClick={() => {
                if (onSelectQuery) onSelectQuery(post.content.slice(0, 25));
                setActiveTab('feed');
              }}
              className="p-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
            >
              <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-slate-400 font-medium">بواسطة {post.userName}</span>
                <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[10px] text-slate-400">{post.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Fallback */}
      {!hasAnyResults && (
        <div className="p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-slate-300 dark:text-slate-500" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">لم نجد ما تبحث عنه</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">حاول استخدام كلمات مفتاحية أخرى أو هاشتاقات مختلفة</p>
        </div>
      )}

      {/* View All Button */}
      {hasAnyResults && (
        <button 
          onClick={() => {
            if (onSelectQuery) onSelectQuery(searchQuery);
            setActiveTab('feed');
          }}
          className="w-full py-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border-t border-slate-100 dark:border-slate-700/50"
        >
          مشاهدة جميع نتائج البحث لـ "{searchQuery}"
        </button>
      )}
    </>
  );
};

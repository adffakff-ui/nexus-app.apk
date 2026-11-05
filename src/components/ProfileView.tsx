import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatArabicDigits } from '../utils/formatDigits';
import { sendBrowserNotification } from '../utils/browserNotifications';
import { 
  CheckCircle2, 
  Menu, 
  Plus, 
  ChevronDown, 
  LayoutGrid, 
  PlaySquare, 
  Repeat2, 
  Contact, 
  Search, 
  Share2, 
  Copy, 
  X, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  PhoneCall, 
  ExternalLink, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  QrCode, 
  LogOut, 
  Archive, 
  Activity, 
  Award,
  Edit3,
  Camera,
  Play,
  Calendar,
  Radio,
  BellRing,
  ChevronLeft,
  Trash2,
  Clock,
  Send,
  UserPlus,
  UserCheck,
  UserMinus,
  RefreshCw,
  User,
  PlusCircle
} from 'lucide-react';
import { Post, Reel } from '../types';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    posts, 
    reels, 
    updateCurrentUser, 
    setActiveTab, 
    logout,
    followingUserIds,
    followersList,
    toggleFollowUser,
    isFollowingUser,
    removeFollower,
    allCreators,
    followToast,
    resetAppData
  } = useApp();
  
  const [followersSearch, setFollowersSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  
  // Section Tabs (4 tabs matching Image 1)
  const [currentSection, setCurrentSection] = useState<'grid' | 'reels' | 'reposts' | 'tagged'>('grid');

  // Modals state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showShareProfileModal, setShowShareProfileModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showThreadsModal, setShowThreadsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [showEventsScheduleModal, setShowEventsScheduleModal] = useState(false);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);

  // Events Schedule State
  const [scheduledEvents, setScheduledEvents] = useState<any[]>([]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('حوار وثقافة');
  const [newEventDate, setNewEventDate] = useState('2026-11-15');
  const [newEventTime, setNewEventTime] = useState('21:00');
  const [newNotifyFollowers, setNewNotifyFollowers] = useState(true);
  const [eventScheduleToast, setEventScheduleToast] = useState<string | null>(null);

  const showScheduleToast = (msg: string) => {
    setEventScheduleToast(msg);
    setTimeout(() => {
      setEventScheduleToast(null);
    }, 4000);
  };

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent = {
      id: `ev_${Date.now()}`,
      title: newEventTitle.trim(),
      category: newEventCategory,
      scheduledTime: `${newEventDate}T${newEventTime}`,
      formattedDate: `${newEventDate} في تمام ${newEventTime}`,
      notifyFollowers: newNotifyFollowers,
      reminderSet: true,
      viewersCountInterest: 1
    };

    setScheduledEvents(prev => [newEvent, ...prev]);

    if (newNotifyFollowers) {
      sendBrowserNotification('تنبيه بث مباشر مجدول 🔴', {
        body: `تمت جدولة بثك "${newEvent.title}". تم إرسال تنبيه مسبق إلى متابعيك! 🔔`,
      });
      showScheduleToast(`تمت جدولة البث بنجاح! 🔔 تم إرسال تنبيه إلى متابعيك.`);
    } else {
      showScheduleToast(`تمت جدولة البث المباشر بنجاح.`);
    }

    setNewEventTitle('');
    setShowCreateEventForm(false);
  };

  const handleToggleNotify = (eventId: string) => {
    setScheduledEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const nextState = !ev.notifyFollowers;
        if (nextState) {
          showScheduleToast(`🔔 تم تفعيل تنبيه المتابعين للبث "${ev.title}"`);
        } else {
          showScheduleToast(`🔕 تم إيقاف تنبيه المتابعين للبث`);
        }
        return { ...ev, notifyFollowers: nextState };
      }
      return ev;
    }));
  };

  const handleToggleReminder = (eventId: string) => {
    setScheduledEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const nextReminder = !ev.reminderSet;
        if (nextReminder) {
          showScheduleToast(`⏰ تم ضبط تذكيرك بالبث المباشر`);
        }
        return { 
          ...ev, 
          reminderSet: nextReminder,
          viewersCountInterest: nextReminder ? ev.viewersCountInterest + 1 : Math.max(0, ev.viewersCountInterest - 1) 
        };
      }
      return ev;
    }));
  };

  const handleDeleteScheduledEvent = (eventId: string) => {
    setScheduledEvents(prev => prev.filter(ev => ev.id !== eventId));
    showScheduleToast('🗑️ تم إلغاء موعد البث المباشر المجدول.');
  };

  // Stories Archive State & Handlers
  const { addStory } = useApp();
  const [showStoriesArchiveModal, setShowStoriesArchiveModal] = useState(false);
  const [selectedArchivedStory, setSelectedArchivedStory] = useState<any | null>(null);
  const [archivedStoriesSearch, setArchivedStoriesSearch] = useState('');
  const [archivedStoriesFilter, setArchivedStoriesFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [archivedStories, setArchivedStories] = useState<any[]>([]);

  const handleShareArchivedStory = (story: any) => {
    addStory([story.mediaUrl], story.mediaType, 'normal', [], 'default', '#000000');
    alert(`تمت إعادة مشاركة القصة المؤرشفة في قصتك الحالية بنجاح! 🚀`);
  };

  const handleDownloadArchivedStory = (story: any) => {
    alert(`جاري تحميل قصة الذكريات بجودة عالية إلى جهازك 💾✨`);
  };

  const handleDeleteArchivedStory = (storyId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه القصة نهائياً من الأرشيف؟')) {
      setArchivedStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  const handleToggleHighlight = (storyId: string) => {
    setArchivedStories(prev => prev.map(s => s.id === storyId ? { ...s, isHighlight: !s.isHighlight } : s));
  };

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editNote, setEditNote] = useState(currentUser?.note || '');
  const [editCategory, setEditCategory] = useState(currentUser?.category || 'منشئ محتوى');

  // Add Link form state
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Reposts mock data
  const repostsList: any[] = [];

  // Tagged mock data
  const taggedList: any[] = [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      username: editUsername,
      bio: editBio,
      note: editNote,
      category: editCategory
    });
    setShowEditProfileModal(false);
  };

  const handleSaveNote = () => {
    updateCurrentUser({ note: editNote });
    setShowAddNoteModal(false);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel.trim()) return;
    const currentLinks = currentUser?.links || [];
    updateCurrentUser({
      links: [...currentLinks, { id: `link_${Date.now()}`, label: newLinkLabel, url: newLinkUrl || '#' }]
    });
    setNewLinkLabel('');
    setNewLinkUrl('');
    setShowAddLinkModal(false);
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-black text-white pb-24 font-sans select-none" dir="rtl">
      
      {/* 1. TOP BAR (Image 1 top header) */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-neutral-900">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button 
            onClick={() => setShowMenuSheet(true)}
            className="p-1 hover:opacity-75 transition-opacity"
            title="القائمة"
          >
            <Menu className="w-7 h-7 stroke-[2.2]" />
          </button>

          {/* Threads Icon */}
          <button 
            onClick={() => setShowThreadsModal(true)}
            className="p-1 hover:opacity-75 transition-opacity"
            title="Threads نكسوس"
          >
            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm leading-none">
              @
            </div>
          </button>
        </div>

        {/* Username with Chevron selector */}
        <button 
          onClick={() => setShowAccountSwitcher(true)}
          className="flex items-center gap-1.5 text-lg font-black tracking-wide hover:opacity-80 transition-opacity"
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          <span>{currentUser?.username?.replace('@', '') || 'user'}</span>
        </button>

        {/* Plus (+) Button for creating content */}
        <button 
          onClick={() => setShowCreateModal(true)}
          className="p-1 hover:opacity-75 transition-opacity"
          title="إنشاء جديد"
        >
          <Plus className="w-7 h-7 stroke-[2.2]" />
        </button>
      </header>

      {/* 2. PROFILE HEADER & AVATAR WITH NOTE (Image 1) */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-start justify-between">
          
          {/* User Display Name & Stats Column */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10 stroke-[2.5]" />
              <h2 className="text-base font-bold text-white tracking-tight">{currentUser?.name || 'اسم المستخدم'}</h2>
            </div>

            {/* Stats: منشورات | المتابعون | متابعة */}
            <div className="flex items-center gap-6 text-center text-sm">
              <button onClick={() => setCurrentSection('grid')} className="text-right hover:opacity-80 transition-opacity">
                <div className="font-bold text-base text-white">{formatArabicDigits(currentUser?.postsCount || 0)}</div>
                <div className="text-xs text-neutral-400">منشورات</div>
              </button>

              <button onClick={() => setShowFollowersModal(true)} className="text-right hover:opacity-80 transition-opacity">
                <div className="font-bold text-base text-white">{formatArabicDigits(followersList.length || 0)}</div>
                <div className="text-xs text-neutral-400">متابعون</div>
              </button>

              <button onClick={() => setShowFollowingModal(true)} className="text-right hover:opacity-80 transition-opacity">
                <div className="font-bold text-base text-white">{formatArabicDigits(followingUserIds.length || 0)}</div>
                <div className="text-xs text-neutral-400">متابعة</div>
              </button>
            </div>
          </div>

          {/* Avatar with Floating "Note" Speech Bubble (Top-Right) */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Note Speech Bubble as shown in Image 1 */}
            <div 
              onClick={() => setShowAddNoteModal(true)}
              className="absolute -top-7 -right-2 bg-neutral-900 border border-neutral-700/80 text-[11px] text-neutral-200 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1 cursor-pointer hover:bg-neutral-800 transition-all max-w-[130px] z-10"
              title="تعديل الملاحظة"
            >
              <p className="line-clamp-2 text-center text-[10px] leading-tight font-medium">
                {currentUser?.note || 'أضفي طابعك الشخصي على هذه المساحة...'}
              </p>
            </div>

            {/* Circular Avatar with Story Ring and (+) badge */}
            <div className="relative mt-4">
              <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-neutral-800 via-neutral-700 to-neutral-900 shadow-lg flex items-center justify-center">
                {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="" 
                    className="w-full h-full rounded-full object-cover bg-neutral-950"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
                    <User className="w-10 h-10 text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Plus Badge on bottom of avatar */}
              <button 
                onClick={() => setShowAddNoteModal(true)}
                className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform"
                title="إضافة ملاحظة أو قصة"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

        </div>

        {/* 3. BIO DESCRIPTION (Image 1) */}
        <div className="mt-4 text-xs text-neutral-200 leading-relaxed space-y-0.5">
          <p className="text-neutral-400 font-medium">{currentUser?.category || 'منشئ محتوى'}</p>
          <div className="whitespace-pre-wrap">{currentUser?.bio || 'لا توجد سيرة ذاتية بعد.'}</div>
        </div>

        {/* 4. ACTION PILLS / LINKS (واتساب | هواجيس الاعشى | + إضافة) */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {currentUser?.links?.map((link: any) => (
            <button 
              key={link.id}
              onClick={() => window.open(link.url, '_blank')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </button>
          ))}

          {/* + إضافة button */}
          <button 
            onClick={() => setShowAddLinkModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة رابط</span>
          </button>
        </div>

        {/* 5. PROFESSIONAL DASHBOARD (لوحة المعلومات الخاصة بك - Image 1) */}
        <div 
          onClick={() => setShowDashboardModal(true)}
          className="mt-4 p-3.5 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl cursor-pointer hover:bg-neutral-850 hover:border-neutral-700 transition-all flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-xs text-white">لوحة المعلومات الخاصة بك</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">0 من المشاهدات خلال آخر 30 يومًا.</p>
          </div>
          <TrendingUp className="w-4 h-4 text-neutral-400" />
        </div>

        {/* 6. MAIN ACTION BUTTONS (تعديل الملف الشخصي | مشاركة الملف الشخصي) */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button 
            onClick={() => setShowEditProfileModal(true)}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
          >
            تعديل الملف الشخصي
          </button>

          <button 
            onClick={() => setShowShareProfileModal(true)}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
          >
            مشاركة الملف الشخصي
          </button>
        </div>

        {/* 6.5. SCHEDULED EVENTS & LIVE BROADCAST BUTTON (جدول الأحداث والبث المباشر) */}
        <button
          onClick={() => setShowEventsScheduleModal(true)}
          className="w-full mt-2.5 p-3.5 bg-gradient-to-r from-rose-950/40 via-neutral-900 to-indigo-950/40 hover:from-rose-950/60 hover:to-indigo-950/60 border border-rose-900/40 hover:border-rose-500/50 rounded-2xl transition-all flex items-center justify-between group cursor-pointer text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">جدول الأحداث والبث المباشر</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-rose-400" />
                  {scheduledEvents.length} مجدول
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">جدولة مواعيد البث المباشر المستقبلي وتنبيه المتابعين 🔔</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
        </button>

        {/* 6.6. ARCHIVE & MEMORIES BUTTON (أرشيف القصص والذكريات التلقائي) */}
        <button
          onClick={() => setShowStoriesArchiveModal(true)}
          className="w-full mt-2 p-3.5 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-yellow-950/40 hover:from-amber-950/60 hover:to-yellow-950/60 border border-amber-900/40 hover:border-amber-500/50 rounded-2xl transition-all flex items-center justify-between group cursor-pointer text-right shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">أرشيف القصص والذكريات</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {archivedStories.length} قصة مؤرشفة
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">الوصول التلقائي للقصص المنتهية، إعادة نشرها أو تحميلها كذكريات 🗂️</p>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
        </button>

        {/* 6.7. HIGHLIGHTS REEL SHOWCASE (أبرز الذكريات والقصص المثبتة) */}
        <div className="mt-4 px-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              أبرز الذكريات (Highlights)
            </span>
            <button 
              onClick={() => setShowStoriesArchiveModal(true)}
              className="text-amber-400 hover:underline text-[11px] font-bold"
            >
              عرض الكل ({archivedStories.filter(s => s.isHighlight).length})
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {archivedStories.filter(s => s.isHighlight).map((story) => (
              <div 
                key={story.id} 
                onClick={() => setSelectedArchivedStory(story)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden border-2 border-neutral-950">
                    {story.mediaType === 'video' ? (
                      <video src={story.mediaUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={story.mediaUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-neutral-300 truncate max-w-[64px] text-center font-medium">
                  {story.caption.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. SECTION TABS (The 4 Icons from Image 1) */}
      <div className="mt-4 border-t border-neutral-900">
        <div className="grid grid-cols-4 text-center">
          
          {/* Tab 1: Grid (الشبكة) */}
          <button 
            onClick={() => setCurrentSection('grid')}
            className={`py-3 flex justify-center items-center transition-all border-b-2 ${
              currentSection === 'grid' 
                ? 'border-white text-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title="المنشورات"
          >
            <LayoutGrid className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Tab 2: Reels (ريلز) */}
          <button 
            onClick={() => setCurrentSection('reels')}
            className={`py-3 flex justify-center items-center transition-all border-b-2 ${
              currentSection === 'reels' 
                ? 'border-white text-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title="ريلز"
          >
            <PlaySquare className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Tab 3: Reposts (إعادة النشر) */}
          <button 
            onClick={() => setCurrentSection('reposts')}
            className={`py-3 flex justify-center items-center transition-all border-b-2 ${
              currentSection === 'reposts' 
                ? 'border-white text-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title="إعادة النشر"
          >
            <Repeat2 className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Tab 4: Tagged (الإشارات) */}
          <button 
            onClick={() => setCurrentSection('tagged')}
            className={`py-3 flex justify-center items-center transition-all border-b-2 ${
              currentSection === 'tagged' 
                ? 'border-white text-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title="الإشارات"
          >
            <Contact className="w-6 h-6 stroke-[2]" />
          </button>

        </div>
      </div>

      {/* 8. TAB CONTENTS WITH DISTINCT FEATURES FOR EACH */}
      <div className="pt-1">
        
        {/* --- SECTION 1: GRID POSTS (الشبكة) --- */}
        {currentSection === 'grid' && (
          <div>
            <div className="grid grid-cols-3 gap-0.5">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-neutral-900 relative group overflow-hidden cursor-pointer"
                >
                  {post.mediaUrl ? (
                    post.mediaType === 'video' ? (
                      <video src={post.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full p-2 flex items-center justify-center text-[10px] text-neutral-300 bg-neutral-950 text-center font-medium line-clamp-4">
                      {post.content}
                    </div>
                  )}

                  {/* Hover Overlay with Likes & Comments */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> {post.likesCount}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-white" /> {post.commentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 2: REELS (ريلز) --- */}
        {currentSection === 'reels' && (
          <div className="p-1">
            <div className="grid grid-cols-3 gap-1">
              {reels.map((reel) => (
                <div 
                  key={reel.id}
                  onClick={() => setSelectedReel(reel)}
                  className="aspect-[9/16] bg-neutral-900 rounded-lg relative overflow-hidden cursor-pointer group"
                >
                  <video src={reel.videoUrl} className="w-full h-full object-cover" />
                  
                  {/* Views count badge with play icon */}
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow-md">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{reel.likesCount * 3}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 3: REPOSTS (إعادة النشر) --- */}
        {currentSection === 'reposts' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-900">
              <span className="flex items-center gap-1.5"><Repeat2 className="w-4 h-4 text-indigo-400" /> منشورات قمت بإعادة نشرها</span>
              <span>{repostsList.length} عنصر</span>
            </div>

            {repostsList.map((rp) => (
              <div key={rp.id} className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={rp.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{rp.originalAuthor}</h4>
                      <p className="text-[10px] text-neutral-400">{rp.authorHandle} • {rp.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Repeat2 className="w-3 h-3 text-emerald-400" /> أعيد نشره
                  </span>
                </div>

                <p className="text-xs text-neutral-200 leading-relaxed">{rp.content}</p>

                {rp.image && (
                  <div className="h-44 rounded-xl overflow-hidden">
                    <img src={rp.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2 text-xs text-neutral-400 border-t border-neutral-800/80">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {rp.likes}</span>
                  <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> {rp.reposts}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- SECTION 4: TAGGED (الإشارات) --- */}
        {currentSection === 'tagged' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-900">
              <span className="flex items-center gap-1.5"><Contact className="w-4 h-4 text-blue-400" /> صور ومقاطع تم الإشارة إليك فيها</span>
              <span className="text-[11px] text-blue-400 cursor-pointer">إدارة الإشارات</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {taggedList.map((tg) => (
                <div key={tg.id} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-sm group">
                  <div className="h-48 relative overflow-hidden">
                    <img src={tg.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Contact className="w-3 h-3" /> {currentUser?.username}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img src={tg.byAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[11px] font-bold text-neutral-300 truncate">{tg.taggedBy}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{tg.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===================== MODALS & DRAWERS ===================== */}

      {/* 1. EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-white">تعديل الملف الشخصي</h3>
              <button onClick={() => setShowEditProfileModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">الاسم</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">اسم المستخدم</label>
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">الفئة</label>
                <input 
                  type="text" 
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">السيرة الذاتية (Bio)</label>
                <textarea 
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
              >
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. SHARE PROFILE MODAL (Instagram Style QR Card) */}
      {showShareProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">بطاقة الملف الشخصي</span>
              <button onClick={() => setShowShareProfileModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            {/* Glowing Gradient Card with Username */}
            <div className="p-8 rounded-3xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 border border-neutral-700 shadow-2xl relative overflow-hidden flex flex-col items-center">
              <div className="w-20 h-20 rounded-full p-1 bg-white mb-3 flex items-center justify-center">
                {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-neutral-600" />
                )}
              </div>
              <h3 className="font-bold text-lg text-white">{currentUser?.name}</h3>
              <p className="text-xs text-neutral-400 mb-4">{currentUser?.username}</p>

              {/* QR Code graphic */}
              <div className="p-3 bg-white rounded-2xl shadow-md">
                <QrCode className="w-24 h-24 text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://nexus.social/${currentUser?.username?.replace('@', '')}`);
                  alert('تم نسخ رابط الملف الشخصي!');
                }}
                className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200"
              >
                <Copy className="w-4 h-4" />
                <span>نسخ الرابط</span>
              </button>

              <button 
                onClick={() => {
                  alert('تمت مشاركة الملف الشخصي في قصتك بنجاح!');
                  setShowShareProfileModal(false);
                }}
                className="w-full py-3 bg-neutral-800 text-white font-bold text-xs rounded-xl hover:bg-neutral-700"
              >
                مشاركة في القصة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROFESSIONAL DASHBOARD MODAL */}
      {showDashboardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">لوحة المعلومات الاحترافية</h3>
              </div>
              <button onClick={() => setShowDashboardModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400">إجمالي المشاهدات</span>
                <div className="text-xl font-bold text-white mt-1">0</div>
                <span className="text-[10px] text-slate-400 font-bold">0% هذا الشهر</span>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                <span className="text-[10px] text-neutral-400">الحسابات التي تم الوصول إليها</span>
                <div className="text-xl font-bold text-white mt-1">840,210</div>
                <span className="text-[10px] text-emerald-400 font-bold">+24.1% نمو</span>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-white">توزيع المتابعين الجغرافي</h4>
              <div className="space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between"><span>المنطقة الأولى</span><span className="font-bold">0%</span></div>
                <div className="flex justify-between"><span>المنطقة الثانية</span><span className="font-bold">0%</span></div>
                <div className="flex justify-between"><span>مناطق أخرى</span><span className="font-bold">0%</span></div>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowDashboardModal(false);
                setActiveTab('analytics');
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              عرض التحليلات الكاملة
            </button>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT NOTE MODAL (أضفي طابعك الشخصي) */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">ملاحظة الحالة الشخصية</h3>
              <button onClick={() => setShowAddNoteModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
              <textarea 
                rows={3}
                maxLength={60}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="أضف فكرة سريعة أو شعورك اليوم (حتى 60 حرف)..."
                className="w-full bg-transparent text-white text-xs leading-relaxed focus:outline-none resize-none text-center font-medium"
              />
              <span className="text-[10px] text-neutral-500 block text-left">{editNote.length}/60</span>
            </div>

            <button 
              onClick={handleSaveNote}
              className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200"
            >
              مشاركة الملاحظة
            </button>
          </div>
        </div>
      )}

      {/* 5. FOLLOWERS MODAL (قائمة المتابعين) */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">المتابعون ({followersList.length})</h3>
              </div>
              <button onClick={() => setShowFollowersModal(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-white" />
              </button>
            </div>

            {/* Search Followers Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="ابحث في المتابعين..."
                value={followersSearch}
                onChange={(e) => setFollowersSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {followersList
                .filter(f => 
                  f.name.toLowerCase().includes(followersSearch.toLowerCase()) || 
                  f.username.toLowerCase().includes(followersSearch.toLowerCase())
                )
                .map((f) => {
                  const isFollowedBack = isFollowingUser(f.id);
                  return (
                    <div key={f.id} className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 hover:bg-neutral-800/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        {f.avatar && f.avatar.length > 5 ? (
                          <img src={f.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-neutral-800" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                            <User className="w-5 h-5 text-neutral-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-white">{f.name}</h4>
                            {f.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                          </div>
                          <p className="text-[10px] text-neutral-400 font-mono">{f.username}</p>
                          {f.bio && <p className="text-[10px] text-neutral-500 line-clamp-1">{f.bio}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Follow Back or Following Button */}
                        <button 
                          onClick={() => toggleFollowUser(f.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isFollowedBack
                              ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          }`}
                        >
                          {isFollowedBack ? (
                            <>
                              <UserCheck className="w-3 h-3 text-emerald-400" />
                              <span>متابَع</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>رد المتابعة</span>
                            </>
                          )}
                        </button>

                        {/* Remove Follower Button */}
                        <button 
                          onClick={() => removeFollower(f.id)}
                          className="px-2 py-1 bg-neutral-800/80 hover:bg-red-950/50 text-neutral-400 hover:text-red-400 rounded-xl text-xs font-medium transition-colors"
                          title="إزالة هذا المتابع"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  );
                })}

              {followersList.length === 0 && (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  لا يوجد متابعون حالياً
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. FOLLOWING MODAL (الحسابات التي تتابعها) */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">تتابعهم ({followingUserIds.length})</h3>
              </div>
              <button onClick={() => setShowFollowingModal(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-white" />
              </button>
            </div>

            {/* Search Following Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="ابحث في الحسابات التي تتابعها..."
                value={followingSearch}
                onChange={(e) => setFollowingSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {allCreators
                .filter(creator => followingUserIds.includes(creator.id))
                .filter(creator => 
                  creator.name.toLowerCase().includes(followingSearch.toLowerCase()) || 
                  creator.username.toLowerCase().includes(followingSearch.toLowerCase())
                )
                .map((creator) => (
                  <div key={creator.id} className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 hover:bg-neutral-800/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      {creator.avatar && creator.avatar.length > 5 ? (
                        <img src={creator.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-neutral-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                          <User className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-bold text-white">{creator.name}</h4>
                          {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">{creator.username}</p>
                        {creator.bio && <p className="text-[10px] text-neutral-500 line-clamp-1">{creator.bio}</p>}
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleFollowUser(creator.id)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-rose-950/40 text-neutral-300 hover:text-rose-400 border border-neutral-700 hover:border-rose-900/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      title="إلغاء المتابعة"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>إلغاء المتابعة</span>
                    </button>
                  </div>
                ))}

              {allCreators.filter(c => followingUserIds.includes(c.id)).length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <p className="text-neutral-400 text-xs">أنت لا تتابع أي حسابات حالياً.</p>
                  <span className="text-[11px] font-bold text-neutral-300 block">اقتراحات لمتابعيها:</span>
                  <div className="space-y-2">
                    {allCreators.slice(0, 3).map(c => (
                      <div key={c.id} className="flex items-center justify-between p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-2">
                          {c.avatar && c.avatar.length > 5 ? (
                            <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                              <User className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">{c.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{c.username}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFollowUser(c.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>متابعة</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. HAMBURGER MENU SHEET */}
      {showMenuSheet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md space-y-2 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-2">
              <h3 className="font-bold text-base text-white">خيارات الحساب</h3>
              <button onClick={() => setShowMenuSheet(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            {[
              { label: 'الإعدادات والخصوصية', icon: Settings, action: () => { setShowMenuSheet(false); setActiveTab('settings'); } },
              { label: 'لوحة التحكم والتحليلات', icon: TrendingUp, action: () => { setShowMenuSheet(false); setActiveTab('analytics'); } },
              { label: 'المحفوظات', icon: Bookmark, action: () => { setShowMenuSheet(false); setActiveTab('saved'); } },
              { label: 'رمز الاستجابة السريعة (QR)', icon: QrCode, action: () => { setShowMenuSheet(false); setShowShareProfileModal(true); } },
              { label: 'طلب شارة التوثيق', icon: Award, action: () => { alert('تم تقديم طلب التوثيق للمراجعة! 🛡️'); setShowMenuSheet(false); } },
              { label: 'تصفير وإعادة تعيين بيانات التطبيق', icon: RefreshCw, action: () => { setShowMenuSheet(false); resetAppData(); } },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 text-right hover:bg-neutral-800 rounded-xl text-xs font-bold text-neutral-200 transition-colors"
              >
                <item.icon className="w-4 h-4 text-neutral-400" />
                <span>{item.label}</span>
              </button>
            ))}

            <button 
              onClick={() => { setShowMenuSheet(false); logout(); }}
              className="w-full flex items-center gap-3 p-3 text-right hover:bg-rose-950/30 text-rose-500 rounded-xl text-xs font-bold transition-colors mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. ACCOUNT SWITCHER POPUP */}
      {showAccountSwitcher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-white">تبديل الحسابات</h3>
              <button onClick={() => setShowAccountSwitcher(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <div className="flex items-center gap-3">
                {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                  <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-400" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{currentUser?.name}</h4>
                  <p className="text-[10px] text-neutral-400">{currentUser?.username}</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/10" />
            </div>

            <button 
              onClick={() => {
                alert('فتح نموذج تسجيل الدخول بحساب جديد...');
                setShowAccountSwitcher(false);
              }}
              className="w-full py-3 border border-dashed border-neutral-700 text-neutral-300 font-bold text-xs rounded-xl hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب جديد</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. THREADS / هواجيس وثردز نكسوس MODAL */}
      {showThreadsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center font-bold text-xs">@</div>
                <h3 className="font-bold text-sm text-white">ثردز وهواجيس {currentUser?.username}</h3>
              </div>
              <button onClick={() => setShowThreadsModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                <p className="text-xs text-neutral-200 leading-relaxed text-center italic">
                  لا توجد خواطر منشورة حالياً.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                alert('تم فتح صفحة ثردز الرسمية');
                setShowThreadsModal(false);
              }}
              className="w-full py-2.5 bg-neutral-800 text-white font-bold text-xs rounded-xl hover:bg-neutral-700"
            >
              نشر خاطرة جديدة في ثردز
            </button>
          </div>
        </div>
      )}

      {/* 10. CREATE CONTENT BOTTOM SHEET MODAL (+) - Matching Instagram Screenshot */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="bg-[#171717] border-t border-neutral-800/80 rounded-t-[2.2rem] w-full max-w-md p-4 pb-8 shadow-2xl space-y-1 animate-in slide-in-from-bottom duration-300 select-none"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Top Drag Pill Handle */}
            <div 
              className="w-10 h-1 bg-neutral-600/80 hover:bg-neutral-500 rounded-full mx-auto my-2 cursor-pointer transition-colors" 
              onClick={() => setShowCreateModal(false)} 
            />

            {/* Header Title */}
            <div className="text-center pb-3 border-b border-neutral-800/80 mb-2">
              <h3 className="font-bold text-base text-white">إنشاء</h3>
            </div>

            {/* 7 Creation Options (Matching Screenshot) */}
            <div className="divide-y divide-neutral-800/50">
              {[
                { 
                  id: 'reels',
                  label: 'ريلز', 
                  icon: PlaySquare, 
                  action: () => { setShowCreateModal(false); setActiveTab('reels'); } 
                },
                { 
                  id: 'post',
                  label: 'منشور', 
                  icon: LayoutGrid, 
                  action: () => { setShowCreateModal(false); setActiveTab('feed'); } 
                },
                { 
                  id: 'story',
                  label: 'قصة', 
                  icon: PlusCircle, 
                  action: () => { setShowCreateModal(false); setActiveTab('feed'); } 
                },
                { 
                  id: 'highlights',
                  label: 'أبرز القصص', 
                  icon: Heart, 
                  action: () => { setShowCreateModal(false); setShowStoriesArchiveModal(true); } 
                },
                { 
                  id: 'live',
                  label: 'بث مباشر', 
                  icon: Radio, 
                  action: () => { setShowCreateModal(false); setShowEventsScheduleModal(true); } 
                },
                { 
                  id: 'ad',
                  label: 'إعلان', 
                  icon: TrendingUp, 
                  action: () => { setShowCreateModal(false); setShowDashboardModal(true); } 
                },
                { 
                  id: 'channel',
                  label: 'القناة', 
                  icon: MessageCircle, 
                  action: () => { setShowCreateModal(false); setShowChannelModal(true); } 
                }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-start gap-4 p-3.5 hover:bg-neutral-800/60 rounded-2xl transition-all group cursor-pointer text-right active:scale-[0.98]"
                >
                  <item.icon className="w-6 h-6 text-white stroke-[1.8] shrink-0 group-hover:scale-105 transition-transform" />
                  <span className="text-sm font-semibold text-neutral-100 group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. WHATSAPP CONTACT MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>تواصل عبر واتساب</span>
              </h3>
              <button onClick={() => setShowWhatsAppModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <p className="text-xs text-neutral-300">
              يمكنك التواصل المباشر مع صاحب الحساب:
            </p>

            <div className="p-3 bg-neutral-950 rounded-xl font-mono text-emerald-400 text-sm font-bold">
              +967 770 000 000
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  window.open('https://wa.me/967770000000', '_blank');
                  setShowWhatsAppModal(false);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
              >
                فتح محادثة واتساب الآن
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('+967770000000');
                  alert('تم نسخ رقم الواتساب!');
                }}
                className="w-full py-2.5 bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-700"
              >
                نسخ الرقم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. CHANNEL MODAL (هواجيس الاعشى) */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-neutral-400" />
                <span>قناة: هواجيس الاعشى</span>
              </h3>
              <button onClick={() => setShowChannelModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
              <span className="text-[10px] text-neutral-500 font-bold">المقتطف الأحدث:</span>
              <p className="text-xs text-neutral-200 leading-relaxed font-serif">
                "بين صمت الجبال وصخب الأزقة الحالمة، تولد الحكايات التي لا يمحوها النسيان."
              </p>
            </div>

            <button 
              onClick={() => {
                alert('تم الانضمام للقناة واستلام الإشعارات! 🔔');
                setShowChannelModal(false);
              }}
              className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200"
            >
              الانضمام إلى القناة (مجاناً)
            </button>
          </div>
        </div>
      )}

      {/* 13. ADD LINK MODAL (+ إضافة) */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-white">إضافة رابط أو ميزة جديدة</h3>
              <button onClick={() => setShowAddLinkModal(false)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">عنوان الزر</label>
                <input 
                  type="text" 
                  placeholder="عنوان الرابط أو القناة"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">الرابط (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 mt-2"
              >
                إضافة الزر للملف الشخصي
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 14. POST DETAIL VIEWER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden w-full max-w-md shadow-2xl">
            <div className="p-3 border-b border-neutral-800 flex justify-between items-center">
              <span className="text-xs font-bold text-white">{selectedPost.userName}</span>
              <button onClick={() => setSelectedPost(null)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>

            {selectedPost.mediaUrl && (
              <div className="max-h-80 bg-black flex items-center justify-center overflow-hidden">
                <img src={selectedPost.mediaUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-4 space-y-3">
              <p className="text-xs text-neutral-200 leading-relaxed">{selectedPost.content}</p>
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> {selectedPost.likesCount} إعجاب</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {selectedPost.commentsCount} تعليق</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. REEL DETAIL VIEWER MODAL */}
      {selectedReel && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedReel(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black">
            <video src={selectedReel.videoUrl} autoPlay loop controls className="w-full h-full object-cover" />
            <div className="absolute bottom-12 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-bold text-xs text-white">{selectedReel.userName}</h4>
              <p className="text-[11px] text-neutral-300 mt-1">{selectedReel.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* 16. EVENTS SCHEDULE & LIVE BROADCAST MODAL (جدول الأحداث والبث المباشر) */}
      {showEventsScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/95 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    جدول الأحداث والبث المباشر
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                      {scheduledEvents.length} قادمة
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">جدولة البث المستقبلي وإشعار متابعيك فوراً 🔔</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowEventsScheduleModal(false);
                  setShowCreateEventForm(false);
                }}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Toast feedback notice */}
              {eventScheduleToast && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{eventScheduleToast}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowCreateEventForm(!showCreateEventForm)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    showCreateEventForm
                      ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30 active:scale-[0.98]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{showCreateEventForm ? 'إخفاء نموذج الجدولة' : 'جدولة بث مباشر جديد'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowEventsScheduleModal(false);
                    setActiveTab('live');
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>بدء بث مباشر الآن 🔴</span>
                </button>
              </div>

              {/* Create Event Form */}
              {showCreateEventForm && (
                <form onSubmit={handleScheduleEvent} className="bg-neutral-950/70 border border-rose-900/30 rounded-2xl p-4 space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      تفاصيل البث المباشر القادم
                    </span>
                    <span className="text-[10px] text-neutral-400">سيظهر في جدول حسابك</span>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      عنوان البث المباشر *
                    </label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="عنوان البث المباشر"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  {/* Category & Date/Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        التصنيف / الموضوع
                      </label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="حوار وثقافة">حوار وثقافة</option>
                        <option value="سينما وتصوير">سينما وتصوير</option>
                        <option value="تكنولوجيا وبرمجة">تكنولوجيا وبرمجة</option>
                        <option value="ألعاب وترفيه">ألعاب وترفيه</option>
                        <option value="فنون وتصميم">فنون وتصميم</option>
                        <option value="سياحة ويوميات">سياحة ويوميات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                        تاريخ البث
                      </label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      وقت البدء
                    </label>
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  {/* Follower Notification Checkbox (تنبيه المتابعين) */}
                  <div 
                    onClick={() => setNewNotifyFollowers(!newNotifyFollowers)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      newNotifyFollowers 
                        ? 'bg-rose-950/30 border-rose-500/40' 
                        : 'bg-neutral-900/60 border-neutral-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={newNotifyFollowers}
                      onChange={() => {}}
                      className="mt-0.5 accent-rose-500 w-4 h-4 rounded cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <BellRing className="w-3.5 h-3.5 text-rose-400" />
                          تنبيه المتابعين بالبث المباشر
                        </span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-bold">موصى به</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        إرسال إشعار فوري وتذكير في صندوق الإشعارات وإشعار المتصفح لجميع متابعيك لحثهم على حفظ الموعد وحضور البث.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                    >
                      تأكيد وجدولة البث 🔔
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateEventForm(false)}
                      className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {/* Scheduled Events List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    المواعيد المجدولة القادمة
                  </span>
                  <span>{scheduledEvents.length} أحداث مسجلة</span>
                </div>

                {scheduledEvents.length === 0 ? (
                  <div className="text-center py-8 bg-neutral-950/40 rounded-2xl border border-neutral-800/60 p-6">
                    <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-white mb-1">لا توجد أحداث مجدولة حالياً</h4>
                    <p className="text-[11px] text-neutral-400 mb-3">قم بجدولة أول بث مباشر لك ونبّه متابعيك لحضوره!</p>
                    <button
                      onClick={() => setShowCreateEventForm(true)}
                      className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl"
                    >
                      جدولة بث الآن
                    </button>
                  </div>
                ) : (
                  scheduledEvents.map((ev) => (
                    <div 
                      key={ev.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Radio className="w-4 h-4 animate-pulse" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full font-medium">
                                {ev.category}
                              </span>
                              <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {ev.formattedDate}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white leading-snug">
                              {ev.title}
                            </h4>
                          </div>
                        </div>

                        {/* Delete Event Button */}
                        <button
                          onClick={() => handleDeleteScheduledEvent(ev.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors shrink-0"
                          title="حذف البث المجدول"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Notification and Reminder status row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/70 text-xs">
                        
                        {/* Notify Followers Switch/Badge */}
                        <button
                          onClick={() => handleToggleNotify(ev.id)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                            ev.notifyFollowers 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
                          }`}
                          title="انقر لتغيير حالة تنبيه المتابعين"
                        >
                          <BellRing className={`w-3.5 h-3.5 ${ev.notifyFollowers ? 'text-emerald-400' : 'text-neutral-500'}`} />
                          <span>{ev.notifyFollowers ? '🔔 تم تنبيه المتابعين' : '🔕 التنبيه متوقف (تفعيل)'}</span>
                        </button>

                        {/* Reminder & Start Live Actions */}
                        <div className="flex items-center gap-2">
                          {/* Reminder toggle */}
                          <button
                            onClick={() => handleToggleReminder(ev.id)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
                              ev.reminderSet
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <span>{ev.reminderSet ? '⏰ مفعل التذكير' : 'ضبط تذكير'}</span>
                            <span className="text-[10px] opacity-75">({ev.viewersCountInterest})</span>
                          </button>

                          {/* Quick Go Live button */}
                          <button
                            onClick={() => {
                              setShowEventsScheduleModal(false);
                              setActiveTab('live');
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>بدء البث</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 17. STORIES ARCHIVE & MEMORY HIGHLIGHTS MODAL (أرشيف القصص والذكريات التلقائي) */}
      {showStoriesArchiveModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-right">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/90 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-950/50">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    أرشيف القصص والذكريات 🗂️
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      {archivedStories.length} قصة محفوظة تلقائياً
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">تخزين تلقائي للقصص المنتهية بعد 24 ساعة، مع إمكانية المشاركة أو التحميل أو التثبيت كأبرز الذكريات</p>
                </div>
              </div>

              <button
                onClick={() => setShowStoriesArchiveModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Archive Search & Filter Bar */}
            <div className="p-4 bg-neutral-950/50 border-b border-neutral-800/80 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3" />
                <input
                  type="text"
                  placeholder="ابحث في أرشيف القصص والذكريات..."
                  value={archivedStoriesSearch}
                  onChange={(e) => setArchivedStoriesSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setArchivedStoriesFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    archivedStoriesFilter === 'all'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  الكل ({archivedStories.length})
                </button>
                <button
                  onClick={() => setArchivedStoriesFilter('images')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    archivedStoriesFilter === 'images'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  صور مؤرشفة
                </button>
                <button
                  onClick={() => setArchivedStoriesFilter('videos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    archivedStoriesFilter === 'videos'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  فيديوهات مؤرشفة
                </button>
              </div>
            </div>

            {/* Archived Stories Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[60vh]">
              {archivedStories.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Archive className="w-12 h-12 text-neutral-600 mx-auto" />
                  <h4 className="text-xs font-bold text-white">الأرشيف فارغ حالياً</h4>
                  <p className="text-[11px] text-neutral-400">ستظهر هنا تلقائياً جميع قصتك بعد انتهاء مدة عرضها (24 ساعة).</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {archivedStories
                    .filter(s => {
                      if (archivedStoriesFilter === 'images' && s.mediaType !== 'image') return false;
                      if (archivedStoriesFilter === 'videos' && s.mediaType !== 'video') return false;
                      if (archivedStoriesSearch && !s.caption.toLowerCase().includes(archivedStoriesSearch.toLowerCase())) return false;
                      return true;
                    })
                    .map((story) => (
                      <div 
                        key={story.id}
                        className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden p-3 space-y-3 transition-all group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                            {story.dateAdded}
                          </span>

                          <button
                            onClick={() => handleToggleHighlight(story.id)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                              story.isHighlight 
                                ? 'bg-amber-500 text-black border-amber-400' 
                                : 'bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{story.isHighlight ? 'مثبت كـ Highlight' : 'تثبيت كذكريات'}</span>
                          </button>
                        </div>

                        {/* Media Preview Box */}
                        <div 
                          onClick={() => setSelectedArchivedStory(story)}
                          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black cursor-pointer group/media"
                        >
                          {story.mediaType === 'video' ? (
                            <video src={story.mediaUrl} className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300" />
                          ) : (
                            <img src={story.mediaUrl} alt="" className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300" />
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/0 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md opacity-80 group-hover/media:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>

                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[10px] text-white flex items-center gap-2">
                            <span>👁️ {story.viewersCount}</span>
                            <span>❤️ {story.reactionsCount}</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                          {story.caption}
                        </p>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-neutral-800/80">
                          <button
                            onClick={() => handleShareArchivedStory(story)}
                            className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                            title="إعادة نشر"
                          >
                            <Repeat2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>مشاركة</span>
                          </button>

                          <button
                            onClick={() => handleDownloadArchivedStory(story)}
                            className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                            title="تحميل كذكريات"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تحميل 💾</span>
                          </button>

                          <button
                            onClick={() => handleDeleteArchivedStory(story.id)}
                            className="py-1.5 px-2 bg-neutral-900 hover:bg-red-950/40 border border-neutral-800 hover:border-red-900/50 text-neutral-400 hover:text-red-400 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                            title="حذف من الأرشيف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 18. ARCHIVED STORY LIGHTBOX VIEWER MODAL */}
      {selectedArchivedStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedArchivedStory(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between">
            {selectedArchivedStory.mediaType === 'video' ? (
              <video src={selectedArchivedStory.mediaUrl} autoPlay loop controls className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src={selectedArchivedStory.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}

            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
              <span className="text-xs text-white font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {selectedArchivedStory.dateAdded}
              </span>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/20 backdrop-blur-md px-3 py-1 rounded-full">
                أرشيف الذكريات 🗂️
              </span>
            </div>

            <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-3">
              <p className="text-white text-xs leading-relaxed">{selectedArchivedStory.caption}</p>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    handleShareArchivedStory(selectedArchivedStory);
                    setSelectedArchivedStory(null);
                    setShowStoriesArchiveModal(false);
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  إعادة النشر في القصة 🚀
                </button>
                <button
                  onClick={() => handleDownloadArchivedStory(selectedArchivedStory)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold"
                >
                  تحميل 💾
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

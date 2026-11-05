import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Mic,
  Send,
  Image as ImageIcon,
  Smile,
  Plus,
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  PhoneCall,
  Video,
  Info,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  X,
  ChevronDown,
  MapPin,
  TrendingUp,
  Tag,
  PhoneOff,
  MicOff,
  Volume2,
  DollarSign,
  AlertTriangle,
  UserCheck,
  User
} from 'lucide-react';
import { ChatConversation, ChatMessage, FriendNote } from '../types';
import { initialFriendNotes } from '../data/mockData';
import { moderateContent } from '../utils/moderation';
import { ReportBlockModal } from './ReportBlockModal';
import { ReactionPicker } from './ReactionPicker';

export const ChatView: React.FC = () => {
  const {
    chats,
    sendMessage,
    currentUser,
    markMessagesAsSeen,
    blockedUserIds,
    toggleMessageHeart,
    acceptMessageRequest,
    declineMessageRequest,
    addReaction,
    sendTip,
    setChats
  } = useApp() as any;

  // Selected chat state - default to majed if available
  const [selectedChatId, setSelectedChatId] = useState<string>(() => chats[0]?.id || '');

  // Navigation state for mobile/tablet
  const [mobileView, setMobileView] = useState<'inbox' | 'chat'>('inbox');

  // Filter tabs: 'primary' (أساسي), 'requests' (الطلبات), 'general' (عام), 'unread'
  const [activeFilterTab, setActiveFilterTab] = useState<'primary' | 'requests' | 'general' | 'unread'>('primary');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [currentAccountName, setCurrentAccountName] = useState(currentUser?.username?.replace('@', '') || '');

  // User note state
  const [userNoteText, setUserNoteText] = useState('ملاحظة...');
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [friendNotes, setFriendNotes] = useState<FriendNote[]>([]);

  // Message input state
  const [messageText, setMessageText] = useState('');
  const [showStickersSheet, setShowStickersSheet] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Modals state
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showAudioCallModal, setShowAudioCallModal] = useState(false);
  const [callDuration, setCallDuration] = useState(42);
  const [isMuted, setIsMuted] = useState(false);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState<string | null>(null);

  // Quick Tip state
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState('10');

  // Currently active conversation
  const currentChat: ChatConversation | undefined = chats.find((c: ChatConversation) => c.id === selectedChatId) || chats[0];

  // Counts for pills
  const primaryCount = chats.filter((c: ChatConversation) => c.category === 'primary' || !c.category).length;
  const requestsCount = chats.filter((c: ChatConversation) => c.category === 'requests').length;

  // Filtered chats based on active tab and search
  const visibleChats = chats.filter((chat: ChatConversation) => {
    if (blockedUserIds?.includes(chat.id)) return false;
    
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = chat.name.toLowerCase().includes(q);
      const matchHandle = chat.handle?.toLowerCase().includes(q);
      const matchMsg = chat.lastMessage?.toLowerCase().includes(q);
      if (!matchName && !matchHandle && !matchMsg) return false;
    }

    if (activeFilterTab === 'primary') {
      return chat.category === 'primary' || (!chat.category && !chat.isGroup);
    }
    if (activeFilterTab === 'requests') {
      return chat.category === 'requests';
    }
    if (activeFilterTab === 'general') {
      return chat.category === 'general' || chat.isGroup;
    }
    if (activeFilterTab === 'unread') {
      return chat.unreadCount > 0;
    }
    return true;
  });

  // Handle select chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    markMessagesAsSeen(chatId);
    setMobileView('chat');
  };

  // Handle send text
  const handleSendText = () => {
    if (!messageText.trim() || !currentChat) return;
    sendMessage(currentChat.id, messageText.trim());
    setMessageText('');
  };

  // Handle send sticker or wave
  const handleSendWave = () => {
    if (!currentChat) return;
    sendMessage(currentChat.id, '👋', undefined, undefined, true);
    setShowStickersSheet(false);
  };

  const handleSendSticker = (emoji: string) => {
    if (!currentChat) return;
    sendMessage(currentChat.id, emoji);
    setShowStickersSheet(false);
  };

  // Handle image upload from file picker or camera button
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentChat) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          sendMessage(currentChat.id, '📷 صورة', undefined, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const audioUrl = URL.createObjectURL(blob);
        if (currentChat) {
          sendMessage(currentChat.id, '🎤 رسالة صوتية', audioUrl);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.warn('Microphone permission error or simulated fallback:', err);
      // Fallback simulated voice note
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
  };

  const stopRecording = (shouldSend: boolean) => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      if (!shouldSend) {
        mediaRecorder.onstop = () => {};
      }
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    } else if (shouldSend && currentChat) {
      // Send simulated voice message if hardware recording was simulated
      sendMessage(currentChat.id, '🎤 رسالة صوتية', 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingTime(0);
    setMediaRecorder(null);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  // Send tip handler
  const handleSendTip = () => {
    if (!currentChat) return;
    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount <= 0) return;
    const success = sendTip(currentChat.name, amount);
    if (success) {
      sendMessage(currentChat.id, `🎁 تم إرسال دعم مالي بقيمة $${amount.toFixed(2)} بنجاح! شكراً لك.`);
      setShowTipModal(false);
      setShowActionSheet(false);
    } else {
      alert('رصيدك الحالي غير كافٍ. يرجى شحن المحفظة أولاً.');
    }
  };

  // Share location simulation
  const handleShareLocation = () => {
    if (!currentChat) return;
    sendMessage(currentChat.id, `📍 مشاركة الموقع الحالي: (موقعك المكتشف حالياً)`);
    setShowActionSheet(false);
  };

  // Add friend note reply
  const handleFriendNoteClick = (note: FriendNote) => {
    // Look for chat with user or select first
    const friendChat = chats.find((c: ChatConversation) => c.name.includes(note.userName) || c.id === note.userId);
    if (friendChat) {
      handleSelectChat(friendChat.id);
    } else {
      alert(`الرد على ملاحظة ${note.userName}: "${note.noteText}"`);
    }
  };

  // Save new user note
  const handleSaveUserNote = () => {
    if (newNoteInput.trim()) {
      setUserNoteText(newNoteInput.trim());
    }
    setShowNoteEditor(false);
    setNewNoteInput('');
  };

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6.5rem)] max-w-7xl mx-auto flex flex-col bg-black text-white rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl relative select-none">
      
      {/* Container: Responsive Split Layout */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        
        {/* ============================================================== */}
        {/* VIEW 1: DIRECT MESSAGES INBOX (Exact match to Image 1)         */}
        {/* ============================================================== */}
        <div className={`w-full md:w-[410px] md:min-w-[380px] lg:w-[440px] flex flex-col h-full bg-black border-l border-neutral-800/90 z-10 transition-all duration-200 ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* 1. Header (Image 1) */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            {/* Right in RTL: Activity chart icon */}
            <button 
              className="p-1.5 text-neutral-200 hover:text-white hover:bg-neutral-900 rounded-full transition-colors"
              title="مستوى النشاط والإحصائيات"
            >
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </button>

            {/* Center: Username dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowAccountDropdown(prev => !prev)}
                className="flex items-center gap-1 text-lg font-bold text-white hover:text-neutral-300 transition-colors"
              >
                <span>{currentAccountName}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 stroke-[2.5]" />
              </button>

              {/* Account Switcher Dropdown */}
              {showAccountDropdown && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-semibold">
                    <span>تبديل الحساب</span>
                    <button onClick={() => setShowAccountDropdown(false)}><X className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={() => { setCurrentAccountName(currentUser?.username?.replace('@', '') || ''); setShowAccountDropdown(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800 text-sm font-semibold transition-colors text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-neutral-500" />
                        </div>
                      )}
                      <span>{currentUser?.username?.replace('@', '') || 'الحساب الحالي'}</span>
                    </div>
                    {currentAccountName === (currentUser?.username?.replace('@', '') || '') && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  </button>
                  <button 
                    onClick={() => { alert('يمكنك إضافة حساب جديد من إعدادات الحساب.'); setShowAccountDropdown(false); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-800 text-xs font-bold text-blue-400 transition-colors mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة حساب جديد</span>
                  </button>
                </div>
              )}
            </div>

            {/* Left in RTL: List / Edit Icon */}
            <button 
              onClick={() => setShowFilterDropdown(prev => !prev)}
              className="p-1.5 text-neutral-200 hover:text-white hover:bg-neutral-900 rounded-full transition-colors"
              title="تعديل وتصفية القائمة"
            >
              <SlidersHorizontal className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* 2. Search Pill Input (Image 1) */}
          <div className="px-4 py-2">
            <div className="bg-neutral-900/90 hover:bg-neutral-900 focus-within:bg-neutral-900 border border-neutral-800 focus-within:border-neutral-700 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 transition-all">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن رسائل أو أصدقاء..."
                className="w-full bg-transparent text-neutral-200 placeholder-neutral-500 text-sm focus:outline-none text-right font-medium"
              />
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            </div>
          </div>

          {/* 3. Notes Carousel Row (Image 1) */}
          <div className="px-4 pt-3 pb-2 border-b border-neutral-900/60">
            <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-1">
              
              {/* User Note Bubble (Item 1 in Image 1) */}
              <div className="flex flex-col items-center flex-shrink-0 w-24">
                {/* Speech Bubble on top of avatar */}
                <button 
                  onClick={() => setShowNoteEditor(true)}
                  className="relative bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium px-3 py-1.5 rounded-2xl rounded-br-xs max-w-[88px] truncate shadow-lg transition-transform active:scale-95 text-center group cursor-pointer"
                  title="تعديل ملاحظتك"
                >
                  <span className="truncate block">{userNoteText}</span>
                  {/* Bubble tail pointing downwards */}
                  <div className="absolute -bottom-1 right-3 w-2 h-2 bg-neutral-800 group-hover:bg-neutral-700 rotate-45"></div>
                </button>

                {/* Avatar with plus badge */}
                <div 
                  onClick={() => setShowNoteEditor(true)}
                  className="relative mt-1.5 cursor-pointer group"
                >
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser?.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-neutral-800 group-hover:border-neutral-600 transition-colors shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border-2 border-neutral-800 group-hover:border-neutral-600 transition-colors shadow-md">
                      <User className="w-8 h-8 text-neutral-600" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                    +
                  </div>
                </div>

                {/* Subtext 1: ملاحظتك */}
                <span className="text-xs font-medium text-neutral-300 mt-1.5">ملاحظتك</span>
                
                {/* Subtext 2: مشاركة الموقع متوقفة 📍❌ */}
                <span className="text-[10px] text-neutral-500 flex items-center gap-0.5 mt-0.5 text-center whitespace-nowrap">
                  {isLocationSharing ? '📍 الموقع نشط' : 'مشاركة الموقع متوقفة 📍❌'}
                </span>
              </div>

              {/* Friends Notes List */}
              {friendNotes.map((note) => (
                <div 
                  key={note.id}
                  onClick={() => handleFriendNoteClick(note)}
                  className="flex flex-col items-center flex-shrink-0 w-24 cursor-pointer group"
                >
                  {/* Friend speech bubble */}
                  <div className="relative bg-neutral-800 group-hover:bg-neutral-700 text-neutral-200 text-xs font-medium px-2.5 py-1.5 rounded-2xl rounded-br-xs max-w-[88px] truncate shadow-lg text-center transition-transform active:scale-95">
                    <span className="truncate block">{note.noteText}</span>
                    <div className="absolute -bottom-1 right-3 w-2 h-2 bg-neutral-800 group-hover:bg-neutral-700 rotate-45"></div>
                  </div>

                  {/* Friend avatar */}
                  <div className="relative mt-1.5">
                    <img 
                      src={note.userAvatar} 
                      alt={note.userName} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-neutral-800 group-hover:border-neutral-600 transition-colors shadow-md"
                    />
                  </div>

                  {/* Friend name */}
                  <span className="text-xs font-medium text-neutral-300 mt-1.5 truncate max-w-[80px] text-center">
                    {note.userName}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">
                    {note.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Filter Pills Bar (Image 1: الفلاتر ⌵, أساسي 4, الطلبات 2, عام) */}
          <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-neutral-900/60">
            {/* Pill 1: الفلاتر ⌵ */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(prev => !prev)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                  showFilterDropdown || activeFilterTab === 'unread'
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-800/80'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>الفلاتر</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Filter Sub-dropdown */}
              {showFilterDropdown && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <button 
                    onClick={() => { setActiveFilterTab('primary'); setShowFilterDropdown(false); }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    جميع المحادثات
                  </button>
                  <button 
                    onClick={() => { setActiveFilterTab('unread'); setShowFilterDropdown(false); }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>الرسائل غير المقروءة</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </button>
                  <button 
                    onClick={() => { setActiveFilterTab('general'); setShowFilterDropdown(false); }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    المجموعات والقنوات
                  </button>
                </div>
              )}
            </div>

            {/* Pill 2: أساسي 4 with red notification dot */}
            <button 
              onClick={() => setActiveFilterTab('primary')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                activeFilterTab === 'primary' 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 border border-neutral-800/80'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
              <span>أساسي</span>
              <span className="text-[11px] font-mono">{primaryCount}</span>
            </button>

            {/* Pill 3: الطلبات 2 with red notification dot */}
            <button 
              onClick={() => setActiveFilterTab('requests')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                activeFilterTab === 'requests' 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 border border-neutral-800/80'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
              <span>الطلبات</span>
              <span className="text-[11px] font-mono">{requestsCount}</span>
            </button>

            {/* Pill 4: عام */}
            <button 
              onClick={() => setActiveFilterTab('general')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                activeFilterTab === 'general' 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 border border-neutral-800/80'
              }`}
            >
              <span>عام</span>
            </button>
          </div>

          {/* 5. Conversations List (Image 1) */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900/40">
            {visibleChats.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs font-medium">
                لا توجد محادثات في هذا القسم
              </div>
            ) : (
              visibleChats.map((chat: ChatConversation) => {
                const isSelected = selectedChatId === chat.id;
                const isUnread = chat.unreadCount > 0;

                return (
                  <div 
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors group ${
                      isSelected ? 'bg-neutral-900/90' : 'hover:bg-neutral-900/50'
                    }`}
                  >
                    {/* Right side in RTL: Avatar + Name + Message snippet */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar with online green status dot */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        {chat.avatar && chat.avatar.length > 5 ? (
                          <img 
                            src={chat.avatar} 
                            alt={chat.name} 
                            className="w-13 h-13 rounded-full object-cover border border-neutral-800 shadow"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                            <User className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                        {chat.isOnline && (
                          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full shadow"></span>
                        )}
                      </div>

                      {/* Text info */}
                      <div className="flex flex-col min-w-0 flex-1 text-right">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'font-semibold text-neutral-200'}`}>
                            {chat.name}
                          </span>
                          {!chat.isGroup && (
                            <span className="text-[10px] text-neutral-500 font-mono">@{chat.handle || 'user'}</span>
                          )}
                        </div>

                        {/* Last message & timestamp */}
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 truncate">
                          <span className={`truncate ${isUnread ? 'font-semibold text-white' : 'text-neutral-400'}`}>
                            {chat.lastMessage || 'بدء محادثة جديدة'}
                          </span>
                          <span className="text-neutral-600 shrink-0">·</span>
                          <span className="text-neutral-500 shrink-0 text-[11px] font-mono">{chat.updatedAt}</span>
                        </div>

                        {/* Action buttons if in Requests mode */}
                        {activeFilterTab === 'requests' && (
                          <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => acceptMessageRequest(chat.id)}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors"
                            >
                              قبول
                            </button>
                            <button 
                              onClick={() => declineMessageRequest(chat.id)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold px-3 py-1 rounded-lg transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Left side in RTL: Quick Camera shortcut button & Unread dot */}
                    <div className="flex items-center gap-2.5 shrink-0 pr-2">
                      {isUnread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      )}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChatId(chat.id);
                          setMobileView('chat');
                          fileInputRef.current?.click();
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
                        title="إرسال صورة سريعة"
                      >
                        <Camera className="w-5 h-5 stroke-[1.8]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 2: ACTIVE CHAT ROOM (Exact match to Image 2)              */}
        {/* ============================================================== */}
        {currentChat ? (
          <div className={`flex-1 flex flex-col h-full bg-black relative transition-all duration-200 ${
            mobileView === 'inbox' ? 'hidden md:flex' : 'flex'
          }`}>
            
            {/* 1. Header (Image 2) */}
            <div className="h-16 px-4 bg-black/95 border-b border-neutral-900/90 flex items-center justify-between shrink-0 z-20">
              
              {/* Right side in RTL: Back arrow + Avatar + Name & Username */}
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Back button (Mobile back to inbox) */}
                <button 
                  onClick={() => setMobileView('inbox')}
                  className="p-1.5 -mr-1 text-white hover:text-neutral-300 hover:bg-neutral-900 rounded-full transition-colors md:hidden"
                  title="العودة لصندوق الرسائل"
                >
                  <ArrowRight className="w-6 h-6 stroke-[2.2]" />
                </button>

                {/* Avatar with click to open profile modal */}
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="relative cursor-pointer shrink-0 flex items-center justify-center"
                >
                  {currentChat.avatar && currentChat.avatar.length > 5 ? (
                    <img 
                      src={currentChat.avatar} 
                      alt={currentChat.name} 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800 shadow"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                      <User className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}
                  {currentChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></span>
                  )}
                </div>

                {/* Name & Handle */}
                <div 
                  onClick={() => setShowProfileModal(true)}
                  className="flex flex-col min-w-0 cursor-pointer text-right"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-white truncate max-w-[150px] sm:max-w-xs">
                      {currentChat.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono truncate">
                    {currentChat.handle ? `@${currentChat.handle}` : currentChat.name}
                  </span>
                </div>
              </div>

              {/* Left side in RTL: Tag/Audio icon, Video call icon, Info icon */}
              <div className="flex items-center gap-1 sm:gap-2 text-white shrink-0">
                {/* Audio call / Tag icon */}
                <button 
                  onClick={() => setShowAudioCallModal(true)}
                  className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
                  title="مكالمة صوتية"
                >
                  <Tag className="w-5 h-5 stroke-[2]" />
                </button>

                {/* Video call icon */}
                <button 
                  onClick={() => setShowVideoCallModal(true)}
                  className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
                  title="مكالمة فيديو"
                >
                  <Video className="w-6 h-6 stroke-[2]" />
                </button>

                {/* Info details icon */}
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
                  title="معلومات الحساب"
                >
                  <Info className="w-5 h-5 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* 2. Messages Scrollable Body (Image 2) */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              
              {/* Contact Profile Intro Header (Top of Image 2) */}
              <div className="flex flex-col items-center text-center pt-4 pb-6 px-2">
                {/* Large Avatar */}
                <div className="relative mb-3">
                  <img 
                    src={currentChat.avatar} 
                    alt={currentChat.name} 
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-neutral-800 shadow-2xl"
                  />
                  {currentChat.isOnline && (
                    <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full shadow"></span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-white mb-0.5">{currentChat.name}</h2>
                {/* Username */}
                <p className="text-xs text-neutral-400 font-mono mb-2">{currentChat.handle ? `@${currentChat.handle}` : currentChat.name}</p>

                <div className="text-xs text-neutral-300 font-medium mb-1">
                  <span>{currentChat.followersCount ? `${currentChat.followersCount.toLocaleString('ar-EG')} متابع` : '0 متابع'}</span>
                  <span className="mx-1.5">·</span>
                  <span>{currentChat.postsCount ? `${currentChat.postsCount} منشور` : '0 منشور'}</span>
                </div>

                {/* Mutual connection text */}
                <p className="text-xs text-neutral-400 mb-0.5">كلاكما يتابع الآخر على Nexus</p>
                <p className="text-xs text-neutral-400 mb-4">{currentChat.mutualFriendsText || 'كلاكما يتابع 1khadej و١٠ من الأشخاص الآخرين'}</p>

                {/* "عرض الملف الشخصي" Button */}
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg px-6 py-1.5 text-xs transition-colors shadow-sm active:scale-95"
                >
                  عرض الملف الشخصي
                </button>
              </div>

              {/* Date Header: ١٩ سبتمبر ٩:٣١ م */}
              <div className="flex items-center justify-center my-3">
                <span className="text-[11px] text-neutral-500 font-medium">محادثة مشفرة آمنة</span>
              </div>

              {/* Messages Thread */}
              {currentChat.messages.map((m: ChatMessage) => {
                const isMe = m.senderId === currentUser?.id;
                const { moderatedText, isSafe } = moderateContent(m.content);

                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} mb-3`}
                  >
                    {/* Reaction picker on long-press or click */}
                    {activeReactionPickerMsgId === m.id && (
                      <ReactionPicker 
                        onSelect={(emoji) => {
                          addReaction('message', m.id, emoji);
                          setActiveReactionPickerMsgId(null);
                        }} 
                        onClose={() => setActiveReactionPickerMsgId(null)} 
                      />
                    )}

                    <div className="flex items-end gap-2 group max-w-[85%] sm:max-w-md">
                      
                      {/* Avatar next to incoming messages */}
                      {!isMe && (
                        currentChat.avatar && currentChat.avatar.length > 5 ? (
                          <img 
                            src={currentChat.avatar} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" 
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 mb-1">
                            <User className="w-4 h-4 text-neutral-400" />
                          </div>
                        )
                      )}

                      {/* Content block */}
                      <div className="relative">
                        
                        {/* 1. Large Wave Sticker 👋 */}
                        {m.isWave ? (
                          <div 
                            onDoubleClick={() => toggleMessageHeart(currentChat.id, m.id)}
                            className="text-4xl py-1 px-2 select-none animate-pulse hover:scale-110 transition-transform cursor-pointer"
                            title="انقر مرتين لإضافة قلب ❤️"
                          >
                            👋
                          </div>
                        ) : m.imageUrl ? (
                          /* Image attachment */
                          <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-md">
                            {m.imageUrl && m.imageUrl.length > 5 && (
                              <img src={m.imageUrl} alt="attachment" className="max-w-xs max-h-60 object-cover" />
                            )}
                          </div>
                        ) : m.audioUrl ? (
                          /* Voice note audio player */
                          <div className={`p-3 rounded-2xl flex items-center gap-3 shadow-sm ${
                            isMe ? 'bg-blue-600 text-white rounded-bl-sm' : 'bg-neutral-800 text-white rounded-br-sm'
                          }`}>
                            <button 
                              onClick={() => {
                                const audio = new Audio(m.audioUrl);
                                audio.play();
                              }}
                              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                              <Play className="w-4 h-4 fill-white" />
                            </button>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-1 h-3">
                                <span className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></span>
                                <span className="w-1 h-4 bg-white rounded-full"></span>
                                <span className="w-1 h-3 bg-white/80 rounded-full"></span>
                                <span className="w-1 h-5 bg-white rounded-full"></span>
                                <span className="w-1 h-2 bg-white/50 rounded-full"></span>
                                <span className="w-1 h-3 bg-white/80 rounded-full"></span>
                              </div>
                              <span className="text-[10px] font-mono opacity-80">0:12</span>
                            </div>
                          </div>
                        ) : (
                          /* Standard Text Speech Bubble (e.g. هلا والله ومليون غلا) */
                          <div 
                            onDoubleClick={() => toggleMessageHeart(currentChat.id, m.id)}
                            className={`px-4 py-2.5 text-sm sm:text-base leading-relaxed shadow-sm transition-all select-none ${
                              isMe 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-bl-xs' 
                                : 'bg-neutral-800 text-white rounded-2xl rounded-br-xs hover:bg-neutral-750'
                            }`}
                          >
                            <p className={!isSafe ? 'italic text-neutral-400' : ''}>
                              {moderatedText}
                            </p>
                          </div>
                        )}

                        {/* Attached Heart Reaction Badge ❤️ (Exact match to Image 2) */}
                        {m.hasHeartReaction && (
                          <div 
                            onClick={() => toggleMessageHeart(currentChat.id, m.id)}
                            className={`absolute -bottom-2.5 ${isMe ? 'left-2' : 'right-2'} bg-neutral-900 border border-neutral-700/80 rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-transform z-10`}
                            title="إلغاء التفاعل"
                          >
                            <span className="text-xs">❤️</span>
                          </div>
                        )}

                        {/* Extra Reactions if any */}
                        {m.reactions && Object.keys(m.reactions).length > 0 && !m.hasHeartReaction && (
                          <div className={`absolute -bottom-2.5 ${isMe ? 'left-2' : 'right-2'} bg-neutral-900 border border-neutral-700 rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-md text-xs`}>
                            {Object.entries(m.reactions).map(([emoji, count]) => (
                              <span key={emoji}>{emoji} {count > 1 ? count : ''}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick options: Report or reaction button on hover */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button 
                          onClick={() => setActiveReactionPickerMsgId(activeReactionPickerMsgId === m.id ? null : m.id)}
                          className="p-1 text-neutral-500 hover:text-white transition-colors"
                          title="تفاعل"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                        {!isMe && (
                          <button 
                            onClick={() => setReportingMessage(m)}
                            className="p-1 text-neutral-500 hover:text-rose-500 transition-colors"
                            title="إبلاغ عن الرسالة"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticker Drawer Sheet */}
            {showStickersSheet && (
              <div className="p-3 bg-neutral-900 border-t border-neutral-800 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs text-neutral-400 font-semibold">
                  <span>الملصقات والتفاعلات السريعة</span>
                  <button onClick={() => setShowStickersSheet(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-4 text-3xl overflow-x-auto py-2">
                  <button onClick={handleSendWave} className="hover:scale-125 transition-transform" title="موجة ترحيب">👋</button>
                  <button onClick={() => handleSendSticker('❤️')} className="hover:scale-125 transition-transform" title="قلب">❤️</button>
                  <button onClick={() => handleSendSticker('🔥')} className="hover:scale-125 transition-transform" title="نار">🔥</button>
                  <button onClick={() => handleSendSticker('😂')} className="hover:scale-125 transition-transform" title="ضحك">😂</button>
                  <button onClick={() => handleSendSticker('👏')} className="hover:scale-125 transition-transform" title="تصفيق">👏</button>
                  <button onClick={() => handleSendSticker('☕')} className="hover:scale-125 transition-transform" title="قهوة">☕</button>
                  <button onClick={() => handleSendSticker('🚀')} className="hover:scale-125 transition-transform" title="صاروخ">🚀</button>
                  <button onClick={() => handleSendSticker('🌹')} className="hover:scale-125 transition-transform" title="وردة">🌹</button>
                </div>
              </div>
            )}

            {/* Plus Action Sheet */}
            {showActionSheet && (
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800 text-xs text-neutral-400 font-semibold">
                  <span>إجراءات إضافية</span>
                  <button onClick={() => setShowActionSheet(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => { setShowTipModal(true); setShowActionSheet(false); }}
                    className="flex flex-col items-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-750 rounded-2xl transition-colors text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-200">إرسال إكرامية</span>
                  </button>

                  <button 
                    onClick={handleShareLocation}
                    className="flex flex-col items-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-750 rounded-2xl transition-colors text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-200">مشاركة الموقع</span>
                  </button>

                  <button 
                    onClick={() => { setShowAudioCallModal(true); setShowActionSheet(false); }}
                    className="flex flex-col items-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-750 rounded-2xl transition-colors text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-200">مكالمة فورية</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Bottom Input Bar (Exact match to Image 2!) */}
            <div className="p-3 bg-black border-t border-neutral-900/90 shrink-0">
              {isRecording ? (
                /* Voice recording live interface */
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-full animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-xs font-bold text-rose-400">
                      جاري تسجيل صوتي... {formatSeconds(recordingTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => stopRecording(false)} 
                      className="p-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                      title="إلغاء التسجيل"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => stopRecording(true)} 
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-transform active:scale-95"
                      title="إرسال التسجيل"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  
                  {/* 1. Blue Circular Camera Button (Image 2) */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform shrink-0"
                    title="التقاط أو إرسال صورة"
                  >
                    <Camera className="w-5 h-5 stroke-[2.2]" />
                  </button>

                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />

                  {/* 2. Message Input Pill (Image 2: ...مراسلة) */}
                  <div className="flex-1 bg-neutral-900 border border-neutral-800 focus-within:border-neutral-700 rounded-full px-4 py-2 flex items-center gap-2">
                    <input 
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendText();
                        }
                      }}
                      placeholder="...مراسلة"
                      className="w-full bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none text-right font-normal"
                    />

                    {/* Send button when typing */}
                    {messageText.trim() && (
                      <button 
                        onClick={handleSendText}
                        className="text-blue-500 hover:text-blue-400 font-bold text-sm px-2 transition-colors shrink-0"
                      >
                        إرسال
                      </button>
                    )}
                  </div>

                  {/* 3. Action icons when not typing: Mic, Gallery, Stickers, Plus (Image 2) */}
                  {!messageText.trim() && (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-white shrink-0">
                      
                      {/* Microphone for Voice Notes */}
                      <button 
                        type="button" 
                        onClick={startRecording}
                        className="p-2 hover:bg-neutral-900 rounded-full text-white transition-colors"
                        title="تسجيل رسالة صوتية"
                      >
                        <Mic className="w-5 h-5 stroke-[2]" />
                      </button>

                      {/* Gallery */}
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-neutral-900 rounded-full text-white transition-colors"
                        title="إرسال صورة من المعرض"
                      >
                        <ImageIcon className="w-5 h-5 stroke-[2]" />
                      </button>

                      {/* Sticker / Smile */}
                      <button 
                        type="button" 
                        onClick={() => setShowStickersSheet(prev => !prev)}
                        className="p-2 hover:bg-neutral-900 rounded-full text-white transition-colors"
                        title="ملصقات وموجات ترحيب"
                      >
                        <Smile className="w-5 h-5 stroke-[2]" />
                      </button>

                      {/* Plus icon */}
                      <button 
                        type="button" 
                        onClick={() => setShowActionSheet(prev => !prev)}
                        className="p-2 hover:bg-neutral-900 rounded-full text-white transition-colors"
                        title="المزيد من الخيارات"
                      >
                        <Plus className="w-5 h-5 stroke-[2]" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-neutral-500 text-sm">
            اختر محادثة لعرض الرسائل
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: USER NOTE EDITOR (ملاحظتك)                            */}
      {/* ============================================================== */}
      {showNoteEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">ملاحظتك</h3>
              <button onClick={() => setShowNoteEditor(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-3">
              {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                <img src={currentUser.avatar} className="w-14 h-14 rounded-full object-cover border border-neutral-700" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <User className="w-7 h-7 text-neutral-400" />
                </div>
              )}
              <div>
                <span className="font-bold text-sm text-white block">{currentUser?.name}</span>
                <span className="text-xs text-neutral-400">شارك فكرة سريعة أو حالة مع أصدقائك</span>
              </div>
            </div>

            <div>
              <input 
                type="text"
                maxLength={60}
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="شارك ما يدور في ذهنك..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 text-right"
              />
              <span className="text-[10px] text-neutral-500 block text-left mt-1 font-mono">
                {60 - newNoteInput.length} حرف متبقي
              </span>
            </div>

            {/* Quick emoji suggestions */}
            <div className="flex items-center gap-2 justify-center py-1 text-xl">
              {['🚗💨', '☕📖', '🎬🌿', '🤖✨', '🎧🎵', '✈️🌍'].map(emoji => (
                <button 
                  key={emoji} 
                  type="button" 
                  onClick={() => setNewNoteInput(prev => prev + ' ' + emoji)}
                  className="hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Toggle Location Sharing */}
            <div className="flex items-center justify-between p-3 bg-neutral-800/80 rounded-2xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-semibold text-neutral-200">مشاركة الموقع الحالي</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsLocationSharing(prev => !prev)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isLocationSharing ? 'bg-blue-600' : 'bg-neutral-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isLocationSharing ? 'right-1' : 'right-6'}`}></div>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleSaveUserNote}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/20"
              >
                حفظ ونشر الملاحظة
              </button>
              <button 
                type="button" 
                onClick={() => setShowNoteEditor(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: CONTACT PROFILE MODAL ("عرض الملف الشخصي")            */}
      {/* ============================================================== */}
      {showProfileModal && currentChat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs font-mono text-neutral-400">@{currentChat.handle || 'user'}</span>
              <button onClick={() => setShowProfileModal(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex flex-col items-center text-center">
              {currentChat.avatar && currentChat.avatar.length > 5 ? (
                <img src={currentChat.avatar} className="w-24 h-24 rounded-full object-cover border-2 border-neutral-700 shadow-xl mb-2" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-neutral-700 shadow-xl mb-2">
                  <User className="w-12 h-12 text-neutral-400" />
                </div>
              )}
              <h3 className="font-bold text-lg text-white">{currentChat.name}</h3>
              <p className="text-xs text-neutral-400 font-mono mb-3">@{currentChat.handle}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-center py-2 px-6 bg-neutral-800/60 rounded-2xl mb-4">
                <div>
                  <span className="block font-bold text-white text-sm">{currentChat.postsCount || 30}</span>
                  <span className="text-[11px] text-neutral-400">منشور</span>
                </div>
                <div className="h-6 w-px bg-neutral-700"></div>
                <div>
                  <span className="block font-bold text-white text-sm">{currentChat.followersCount ? currentChat.followersCount.toLocaleString('ar-EG') : '٢٠٢'}</span>
                  <span className="text-[11px] text-neutral-400">متابع</span>
                </div>
                <div className="h-6 w-px bg-neutral-700"></div>
                <div>
                  <span className="block font-bold text-white text-sm">١٤٥</span>
                  <span className="text-[11px] text-neutral-400">متابعة</span>
                </div>
              </div>

              {/* Mutual connections */}
              <p className="text-xs text-neutral-400 mb-1">{currentChat.mutualFriendsText || 'كلاكما يتابع 1khadej و١٠ من الأشخاص الآخرين'}</p>
              <p className="text-xs text-neutral-500 mb-4">كلاكما يتابع الآخر على Nexus</p>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full">
                <button 
                  onClick={() => {
                    alert(`أنت تتابع ${currentChat.name} بالفعل.`);
                  }}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>تتابعه</span>
                </button>
                <button 
                  onClick={() => { setShowTipModal(true); setShowProfileModal(false); }}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-1"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>دعم</span>
                </button>
              </div>

              {/* Posts Grid Preview */}
              <div className="w-full mt-4 pt-4 border-t border-neutral-800">
                <span className="text-xs font-bold text-neutral-400 block text-right mb-2">أحدث المنشورات</span>
                <div className="bg-neutral-800/50 rounded-2xl p-4 text-center border border-neutral-800">
                  <p className="text-[11px] text-neutral-500">لا توجد منشورات حصرية مضافة لهذه القناة حتى الآن</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: SIMULATED VIDEO CALL OVERLAY                          */}
      {/* ============================================================== */}
      {showVideoCallModal && currentChat && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-in fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              {currentChat.avatar && currentChat.avatar.length > 5 ? (
                <img src={currentChat.avatar} className="w-10 h-10 rounded-full object-cover border border-neutral-700" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm text-white">{currentChat.name}</h4>
                <span className="text-xs text-emerald-400 font-mono">متصل · 00:{callDuration}</span>
              </div>
            </div>
            <button onClick={() => setShowVideoCallModal(false)} className="p-2 text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Video View */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <img 
              src={currentChat.avatar} 
              alt={currentChat.name} 
              className="w-36 h-36 rounded-full object-cover border-4 border-neutral-700/60 shadow-2xl animate-pulse mb-4"
            />
            <span className="text-lg font-bold text-white">{currentChat.name}</span>
            <span className="text-xs text-neutral-400 mt-1">مكالمة فيديو مشفرة بين الطرفين 🔒</span>

            {/* Self Camera Box */}
            <div className="absolute bottom-4 left-4 w-28 h-40 bg-neutral-900 border-2 border-neutral-700 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-neutral-500" />
              )}
              <span className="absolute bottom-1 right-2 text-[10px] text-white/90 bg-black/60 px-1 rounded">أنت</span>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="flex items-center justify-center gap-6 py-4 z-10">
            <button 
              onClick={() => setIsMuted(prev => !prev)}
              className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-white'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setShowVideoCallModal(false)}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl active:scale-95 transition-transform"
              title="إنهاء المكالمة"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <button 
              className="p-4 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: SIMULATED AUDIO CALL OVERLAY                          */}
      {/* ============================================================== */}
      {showAudioCallModal && currentChat && (
        <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-6 animate-in fade-in">
          <div className="flex justify-end">
            <button onClick={() => setShowAudioCallModal(false)} className="text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Ripple avatar */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-44 h-44 rounded-full bg-blue-500/20 animate-ping"></div>
              <div className="absolute w-36 h-36 rounded-full bg-blue-500/30"></div>
              <img 
                src={currentChat.avatar} 
                alt={currentChat.name} 
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-2xl relative z-10"
              />
            </div>

            <h3 className="font-bold text-2xl text-white mb-1">{currentChat.name}</h3>
            <span className="text-xs text-neutral-400 font-mono mb-2">@{currentChat.handle}</span>
            <span className="text-sm font-semibold text-emerald-400">جاري الاتصال... 01:15</span>
          </div>

          <div className="flex items-center justify-center gap-6 py-6">
            <button 
              onClick={() => setIsMuted(prev => !prev)}
              className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-white'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setShowAudioCallModal(false)}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl active:scale-95 transition-transform"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <button className="p-4 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: TIP MODAL                                             */}
      {/* ============================================================== */}
      {showTipModal && currentChat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="font-bold text-white text-base">إرسال إكرامية ودعم</h3>
              <button onClick={() => setShowTipModal(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-neutral-400">
              أرسل دعماً مالياً مباشراً إلى <span className="font-bold text-white">{currentChat.name}</span> عبر رصيد محفظتك.
            </p>

            <div className="flex gap-2 justify-center py-2">
              {['5', '10', '25', '50'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTipAmount(amt)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    tipAmount === amt ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-xl">
              <span className="text-amber-400 font-bold">$</span>
              <input 
                type="number" 
                value={tipAmount} 
                onChange={(e) => setTipAmount(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
              />
            </div>

            <button 
              type="button" 
              onClick={handleSendTip}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-xs shadow-lg transition-transform active:scale-95"
            >
              تأكيد إرسال ${tipAmount}
            </button>
          </div>
        </div>
      )}

      {/* Moderation Report & Block Modal */}
      {reportingMessage && (
        <ReportBlockModal 
          userId={reportingMessage.senderId}
          userName={reportingMessage.senderName}
          type="message"
          itemId={reportingMessage.id}
          onClose={() => setReportingMessage(null)}
        />
      )}

    </div>
  );
};

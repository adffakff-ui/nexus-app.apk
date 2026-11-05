import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Reel, LiveStream, VoiceRoom, ChatConversation, NotificationItem, Transaction, Language, ThemeMode, AccentColor, Story, FollowerUser } from '../types';
import { currentUser as defaultUser, initialPosts, initialReels, initialLiveStreams, initialVoiceRooms, initialChats, initialNotifications, initialTransactions } from '../data/mockData';
import { initialStories } from '../data/storiesData';
import { moderateContent } from '../utils/moderation';
import { 
  getBrowserNotificationPermission, 
  requestBrowserNotificationPermission, 
  sendNewMessageNotification, 
  sendFollowRequestNotification 
} from '../utils/browserNotifications';

export const AVAILABLE_CREATORS: FollowerUser[] = [];
export const INITIAL_FOLLOWERS: FollowerUser[] = [];

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: Post[];
  reels: Reel[];
  liveStreams: LiveStream[];
  voiceRooms: VoiceRoom[];
  chats: ChatConversation[];
  notifications: NotificationItem[];
  transactions: Transaction[];
  stories: Story[];
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiPromptResult: string;
  setAiPromptResult: (res: string) => void;
  runAiAssistant: (prompt: string, useHighThinking?: boolean) => Promise<string>;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string, username?: string) => void;
  logout: () => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  createPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', isExclusive?: boolean, exclusivePrice?: number, poll?: any) => void;
  votePoll: (postId: string, optionIndex: number) => void;
  sendTip: (recipientName: string, amount: number) => boolean;
  depositFunds: (amount: number) => void;
  sendMessage: (chatId: string, content: string, audioUrl?: string, imageUrl?: string, isWave?: boolean) => void;
  toggleMessageHeart: (chatId: string, messageId: string) => void;
  acceptMessageRequest: (chatId: string) => void;
  declineMessageRequest: (chatId: string) => void;
  addReaction: (type: 'post' | 'message', id: string, reaction: string) => void;
  markMessagesAsSeen: (chatId: string) => void;
  markNotificationsRead: () => void;
  activeCallRoom: VoiceRoom | null;
  setActiveCallRoom: (room: VoiceRoom | null) => void;
  activeLiveStream: LiveStream | null;
  setActiveLiveStream: (stream: LiveStream | null) => void;
  reportItem: (type: 'post' | 'message' | 'user', id: string, reason: string) => void;
  banUser: (userId: string) => void;
  isUserBanned: (userId: string) => boolean;
  shareToStory: (postId: string) => void;
  addStory: (mediaUrls: string[], mediaType: 'image' | 'video', filter?: string, overlays?: any[], layout?: string, backgroundColor?: string) => void;
  addReel: (reelData: { caption: string; videoUrl: string; musicTitle?: string; filter?: string; trimStart?: number; trimEnd?: number }) => void;
  shareToChat: (postId: string, chatId: string) => void;
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
  followingUserIds: string[];
  followersList: FollowerUser[];
  toggleFollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  removeFollower: (followerId: string) => void;
  allCreators: FollowerUser[];
  followToast: string | null;
  dismissFollowToast: () => void;
  browserNotificationPermission: NotificationPermission;
  requestBrowserNotifications: () => Promise<NotificationPermission>;
  sendIncomingMessageNotification: (senderName: string, messageText: string, avatar?: string) => void;
  sendIncomingFollowRequestNotification: (requesterName: string, requesterHandle?: string, avatar?: string) => void;
  updateCurrentUser: (fields: Partial<User>) => void;
  setChats: React.Dispatch<React.SetStateAction<ChatConversation[]>>;
  resetAppData: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = localStorage.getItem('nexus_auth_session');
    if (session) {
      try {
        return JSON.parse(session);
      } catch (e) {
        console.error('Failed to parse saved auth session:', e);
      }
    }
    return {
      ...defaultUser,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      walletBalance: 0,
      note: ''
    };
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const session = localStorage.getItem('nexus_auth_session');
    return !!session;
  });
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [voiceRooms, setVoiceRooms] = useState<VoiceRoom[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [accent, setAccent] = useState<AccentColor>('indigo');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nexus_lang') as Language;
    const supported: Language[] = ['ar', 'en', 'fr', 'es'];
    if (saved && supported.includes(saved)) return saved;

    const browserLang = navigator.language.split('-')[0] as Language;
    return supported.includes(browserLang) ? browserLang : 'ar';
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPromptResult, setAiPromptResult] = useState<string>('');

  const [activeCallRoom, setActiveCallRoom] = useState<VoiceRoom | null>(null);
  const [activeLiveStream, setActiveLiveStream] = useState<LiveStream | null>(null);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  const [followersList, setFollowersList] = useState<FollowerUser[]>([]);
  const [followToast, setFollowToast] = useState<string | null>(null);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<NotificationPermission>(() => getBrowserNotificationPermission());

  useEffect(() => {
    // Apply theme to document element
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Apply language and dir attribute
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('nexus_lang', language);
  }, [language]);

  const runAiAssistant = async (prompt: string, useHighThinking?: boolean): Promise<string> => {
    try {
      const res = await fetch('/api/gemini/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, useHighThinking }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiPromptResult(data.text);
      return data.text;
    } catch (err: any) {
      console.error(err);
      const fallback = 'عذراً، حدث خطأ أثناء الاتصال بمساعد الذكاء الاصطناعي. تأكد من إعداد المفتاح بنجاح.';
      setAiPromptResult(fallback);
      return fallback;
    }
  };

  const login = (loginInput: string, pass: string): boolean => {
    if (!loginInput || !loginInput.trim() || !pass) return false;

    const rawInput = loginInput.trim();
    const cleanInput = rawInput.toLowerCase();
    const handleWithoutAt = cleanInput.startsWith('@') ? cleanInput.slice(1) : cleanInput;
    const handleWithAt = `@${handleWithoutAt}`;

    // Read saved accounts from localStorage
    let registeredUsers: User[] = [];
    try {
      const savedUsers = localStorage.getItem('nexus_registered_users');
      if (savedUsers) registeredUsers = JSON.parse(savedUsers);
    } catch (e) {
      console.error(e);
    }

    // Attempt to match by handle, email, or username
    const foundUser = registeredUsers.find(u => 
      u.username.toLowerCase() === handleWithAt ||
      u.username.toLowerCase() === cleanInput ||
      u.username.toLowerCase().replace('@', '') === handleWithoutAt ||
      u.email.toLowerCase() === cleanInput
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('nexus_auth_session', JSON.stringify(foundUser));
      return true;
    }

    // If account doesn't exist in saved list, build a new user profile dynamically for this handle or email!
    const isEmail = cleanInput.includes('@') && cleanInput.includes('.');
    const displayName = isEmail ? rawInput.split('@')[0] : (rawInput.startsWith('@') ? rawInput.slice(1) : rawInput);
    const formattedHandle = isEmail ? `@${rawInput.split('@')[0]}` : handleWithAt;

    const newProfile: User = {
      ...defaultUser,
      id: `u_${Date.now()}`,
      name: displayName || 'مستخدم نكسوس',
      username: formattedHandle,
      email: isEmail ? cleanInput : `${handleWithoutAt}@nexus.social`,
      avatar: defaultUser.avatar || '',
      bio: 'مرحباً بك في نكسوس! 🚀',
      category: 'منشئ محتوى',
      verified: true,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      walletBalance: 0.00,
      note: ''
    };

    const updatedUsers = [newProfile, ...registeredUsers.filter(u => u.username !== formattedHandle)];
    try {
      localStorage.setItem('nexus_registered_users', JSON.stringify(updatedUsers));
      localStorage.setItem('nexus_auth_session', JSON.stringify(newProfile));
    } catch (e) {}

    setCurrentUser(newProfile);
    setIsAuthenticated(true);
    return true;
  };

  const register = (name: string, email: string, pass: string, username?: string) => {
    const cleanName = name.trim();
    const rawUsername = username?.trim() || cleanName.toLowerCase().replace(/\s+/g, '_');
    const handleWithoutAt = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
    const formattedUsername = `@${handleWithoutAt}`;

    const newUser: User = {
      ...defaultUser,
      id: `u_${Date.now()}`,
      name: cleanName,
      username: formattedUsername,
      email: email.trim(),
      avatar: defaultUser.avatar || '',
      bio: 'مرحباً بك في نكسوس! 🚀',
      category: 'منشئ محتوى',
      verified: true,
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      walletBalance: 0.00,
      note: ''
    };

    let registeredUsers: User[] = [];
    try {
      const saved = localStorage.getItem('nexus_registered_users');
      if (saved) registeredUsers = JSON.parse(saved);
    } catch (e) {}

    const updatedUsers = [newUser, ...registeredUsers.filter(u => u.username !== formattedUsername && u.email !== email)];
    try {
      localStorage.setItem('nexus_registered_users', JSON.stringify(updatedUsers));
      localStorage.setItem('nexus_auth_session', JSON.stringify(newUser));
    } catch (e) {}

    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('nexus_auth_session');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newC = {
          id: `c_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content,
          createdAt: 'الآن',
          likes: 0
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newC, ...p.comments]
        };
      }
      return p;
    }));
  };

  const createPost = (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', isExclusive?: boolean, exclusivePrice?: number, poll?: any) => {
    if (!currentUser || bannedUserIds.includes(currentUser.id)) return;
    
    const { moderatedText, isSafe } = moderateContent(content);
    
    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.username,
      userAvatar: currentUser.avatar,
      verified: currentUser.verified,
      content: moderatedText,
      mediaUrl,
      mediaType,
      poll: poll ? { ...poll, id: `poll_${Date.now()}` } : undefined,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      tipsTotal: 0,
      isLiked: false,
      isSaved: false,
      isExclusive,
      exclusivePrice,
      createdAt: 'الآن',
      comments: [],
      reactions: {}
    };
    setPosts([newPost, ...posts]);
    
    if (!isSafe) {
      console.log("Post contains prohibited terms. Moderation applied.");
    }
  };

  const votePoll = (postId: string, optionIndex: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId && p.poll && p.poll.userVote === undefined) {
        const newOptions = [...p.poll.options];
        newOptions[optionIndex].votes += 1;
        return {
          ...p,
          poll: {
            ...p.poll,
            options: newOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVote: optionIndex
          }
        };
      }
      return p;
    }));
  };

  const sendTip = (recipientName: string, amount: number): boolean => {
    if (!currentUser || currentUser.walletBalance < amount) return false;
    const updatedBalance = currentUser.walletBalance - amount;
    setCurrentUser({ ...currentUser, walletBalance: updatedBalance });

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      title: `إرسال دعم إلى ${recipientName}`,
      amount,
      type: 'tip',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
    return true;
  };

  const depositFunds = (amount: number) => {
    if (!currentUser) return;
    const updatedBalance = currentUser.walletBalance + amount;
    setCurrentUser({ ...currentUser, walletBalance: updatedBalance });

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      title: 'إيداع رصيد في المحفظة',
      amount,
      type: 'deposit',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    setTransactions([newTx, ...transactions]);
  };

  const sendMessage = (chatId: string, content: string, audioUrl?: string, imageUrl?: string, isWave?: boolean) => {
    if (!currentUser || bannedUserIds.includes(currentUser.id)) return;
    
    const { moderatedText, isSafe } = moderateContent(content);
    
    setChats(prev => prev.map(ch => {
      if (ch.id === chatId) {
        const msg = {
          id: `m_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: isWave ? '👋' : moderatedText,
          audioUrl,
          imageUrl,
          isWave,
          timestamp: 'الآن',
          isEncrypted: true,
          reactions: {},
          status: 'sent' as const
        };
        
        if (!isSafe) {
          console.log(`System auto-report: Abusive content from ${currentUser.name}`);
        }

        let lastMsg = moderatedText;
        if (isWave) lastMsg = '👋 موجة ترحيب';
        else if (audioUrl) lastMsg = '🎤 رسالة صوتية';
        else if (imageUrl) lastMsg = '📷 صورة';

        return {
          ...ch,
          lastMessage: lastMsg,
          updatedAt: 'الآن',
          messages: [...ch.messages, msg]
        };
      }
      return ch;
    }));

    // Trigger simulated partner reply after 3 seconds to demonstrate real-time browser push notification
    setTimeout(() => {
      const partnerReplies = [
        'تسلم يا غالي، شرفني كلامك جداً! ✨',
        'أهلاً بك! فكرة ممتازة وسأشاركها معك قريباً 🚀',
        'وصلتني رسالتك وسأوافيك بالتفاصيل في أقرب وقت 👍'
      ];
      const replyText = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      
      setChats(prev => {
        const targetChat = prev.find(c => c.id === chatId);
        if (!targetChat || targetChat.isGroup) return prev;

        // Fire browser notification
        sendNewMessageNotification(targetChat.name, replyText, targetChat.avatar, () => {
          setActiveTab('messages');
        });

        const incomingMsg = {
          id: `m_${Date.now()}`,
          senderId: targetChat.id,
          senderName: targetChat.name,
          content: replyText,
          timestamp: 'الآن',
          isEncrypted: true,
          reactions: {},
          status: 'delivered' as const
        };

        return prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: replyText,
              updatedAt: 'الآن',
              unreadCount: (c.unreadCount || 0) + 1,
              messages: [...c.messages, incomingMsg]
            };
          }
          return c;
        });
      });
    }, 3200);
  };

  const toggleMessageHeart = (chatId: string, messageId: string) => {
    setChats(prev => prev.map(ch => {
      if (ch.id === chatId) {
        return {
          ...ch,
          messages: ch.messages.map(m => {
            if (m.id === messageId) {
              const hasHeart = !m.hasHeartReaction;
              const currentHearts = m.reactions?.['❤️'] || 0;
              const newReactions = { ...m.reactions };
              if (hasHeart) {
                newReactions['❤️'] = currentHearts + 1;
              } else {
                if (currentHearts > 1) {
                  newReactions['❤️'] = currentHearts - 1;
                } else {
                  delete newReactions['❤️'];
                }
              }
              return {
                ...m,
                hasHeartReaction: hasHeart,
                reactions: newReactions
              };
            }
            return m;
          })
        };
      }
      return ch;
    }));
  };

  const acceptMessageRequest = (chatId: string) => {
    setChats(prev => prev.map(ch => {
      if (ch.id === chatId) {
        return { ...ch, category: 'primary' as const };
      }
      return ch;
    }));
    alert('تم قبول طلب المراسلة ونقله إلى صندوق الرسائل الأساسي! ✅');
  };

  const declineMessageRequest = (chatId: string) => {
    setChats(prev => prev.filter(ch => ch.id !== chatId));
    alert('تم حذف طلب المراسلة.');
  };

  const reportItem = (type: 'post' | 'message' | 'user', id: string, reason: string) => {
    alert(`تم إرسال بلاغ عن ${type === 'post' ? 'منشور' : type === 'message' ? 'رسالة' : 'مستخدم'} (ID: ${id}) لسبب: ${reason}. سيقوم فريق الإشراف بمراجعته.`);
    
    // Simulate auto-ban for certain reasons in this mock
    if (reason.includes('عنف') || reason.includes('كراهية')) {
       console.log("Severe violation detected. Potential ban action pending.");
    }
  };

  const banUser = (userId: string) => {
    setBannedUserIds(prev => [...prev, userId]);
    alert(`تم حظر المستخدم ${userId} بنجاح لمخالفته سياسة الخصوصية.`);
  };

  const isUserBanned = (userId: string) => bannedUserIds.includes(userId);

  const shareToStory = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && currentUser) {
      addStory([post.mediaUrl || ''], post.mediaType || 'image');
      alert(`تمت مشاركة المنشور في قصتك بنجاح!`);
    }
  };

  const addStory = (mediaUrls: string[], mediaType: 'image' | 'video', filter?: string, overlays?: any[], layout?: string, backgroundColor?: string) => {
    if (!currentUser) return;
    const newStory: Story = {
      id: `s_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrls,
      mediaType,
      filter,
      layout,
      backgroundColor,
      overlays,
      createdAt: new Date().toISOString(),
      isViewed: false
    };
    setStories([newStory, ...stories]);
  };

  const addReel = (reelData: { caption: string; videoUrl: string; musicTitle?: string; filter?: string; trimStart?: number; trimEnd?: number }) => {
    if (!currentUser) return;
    const newReelItem: Reel = {
      id: `r_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      verified: currentUser.verified,
      videoUrl: reelData.videoUrl,
      caption: reelData.caption,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      musicTitle: reelData.musicTitle || `صوت أصلي - ${currentUser.name}`,
      filter: reelData.filter || 'none',
      trimStart: reelData.trimStart,
      trimEnd: reelData.trimEnd
    };
    setReels(prev => [newReelItem, ...prev]);
  };

  const shareToChat = (postId: string, chatId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      sendMessage(chatId, `لقد شاركت معك هذا المنشور: ${post.content.substring(0, 30)}...`);
      alert(`تمت مشاركة المنشور في الدردشة!`);
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    alert(`تم حظر المستخدم بنجاح. لن ترى محتواه بعد الآن.`);
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    alert(`تم إلغاء حظر المستخدم.`);
  };

  const isUserBlocked = (userId: string) => blockedUserIds.includes(userId);

  const dismissFollowToast = () => setFollowToast(null);

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds(prev => {
      const isCurrentlyFollowing = prev.includes(userId);
      const targetCreator = AVAILABLE_CREATORS.find(c => c.id === userId) || 
                            followersList.find(f => f.id === userId);
      const targetName = targetCreator ? targetCreator.name : 'المستخدم';

      let updated: string[];
      if (isCurrentlyFollowing) {
        updated = prev.filter(id => id !== userId);
        setFollowToast(`تم إلغاء متابعة ${targetName}`);
      } else {
        updated = [...prev, userId];
        setFollowToast(`أنت تتابع الآن ${targetName} بنجاح ✨`);
        sendIncomingFollowRequestNotification(targetName, targetCreator?.username, targetCreator?.avatar);
      }

      if (currentUser) {
        setCurrentUser(u => u ? { ...u, followingCount: Math.max(0, (u.followingCount || 0) + (isCurrentlyFollowing ? -1 : 1)) } : null);
      }

      setTimeout(() => {
        setFollowToast(null);
      }, 3500);

      return updated;
    });
  };

  const removeFollower = (followerId: string) => {
    const target = followersList.find(f => f.id === followerId);
    setFollowersList(prev => prev.filter(f => f.id !== followerId));
    if (currentUser) {
      setCurrentUser(u => u ? { ...u, followersCount: Math.max(0, (u.followersCount || 0) - 1) } : null);
    }
    setFollowToast(`تمت إزالة ${target ? target.name : 'المتابع'} من قائمة متابعيك`);
    setTimeout(() => {
      setFollowToast(null);
    }, 3500);
  };

  const resetAppData = () => {
    if (confirm('هل أنت متأكد من تصفير وحذف جميع بيانات التطبيق والعودة للوضع الافتراضي النظيف؟')) {
      setPosts([]);
      setReels([]);
      setLiveStreams([]);
      setVoiceRooms([]);
      setChats([]);
      setNotifications([]);
      setTransactions([]);
      setStories([]);
      setFollowingUserIds([]);
      setFollowersList([]);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          walletBalance: 0,
          note: ''
        });
      }
      localStorage.clear();
      setFollowToast('🔄 تم تصفير جميع بيانات التطبيق بنجاح وأصبح جاهزاً للعمل!');
      setTimeout(() => {
        setFollowToast(null);
      }, 4000);
    }
  };

  const isFollowingUser = (userId: string) => followingUserIds.includes(userId);

  const requestBrowserNotifications = async (): Promise<NotificationPermission> => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserNotificationPermission(perm);
    return perm;
  };

  const sendIncomingMessageNotification = (senderName: string, messageText: string, avatar?: string) => {
    sendNewMessageNotification(senderName, messageText, avatar, () => {
      setActiveTab('messages');
    });

    const newNotif: NotificationItem = {
      id: `n_msg_${Date.now()}`,
      type: 'message',
      title: `رسالة جديدة من ${senderName} 💬`,
      message: messageText || 'أرسل لك رسالة خاصة في المحادثات المشفرة.',
      timestamp: 'الآن',
      read: false,
      actorAvatar: avatar
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const sendIncomingFollowRequestNotification = (requesterName: string, requesterHandle?: string, avatar?: string) => {
    sendFollowRequestNotification(requesterName, requesterHandle, avatar, () => {
      setActiveTab('notifications');
    });

    const newNotif: NotificationItem = {
      id: `n_req_${Date.now()}`,
      type: 'follow',
      title: 'طلب متابعة جديد 👤',
      message: `يرغب ${requesterName} ${requesterHandle ? `(${requesterHandle})` : ''} بمتابعة حسابك.`,
      timestamp: 'الآن',
      read: false,
      actorAvatar: avatar
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addReaction = (type: 'post' | 'message', id: string, reaction: string) => {
    // ... (existing code for addReaction) ...
    if (type === 'post') {
      setPosts(posts.map(p => {
        if (p.id === id) {
          const reactions = { ...(p.reactions || {}), [reaction]: ((p.reactions || {})[reaction] || 0) + 1 };
          return { ...p, reactions };
        }
        return p;
      }));
    } else {
      setChats(chats.map(ch => ({
        ...ch,
        messages: ch.messages.map(m => {
          if (m.id === id) {
            const reactions = { ...(m.reactions || {}), [reaction]: ((m.reactions || {})[reaction] || 0) + 1 };
            return { ...m, reactions };
          }
          return m;
        })
      })));
    }
  };

  const markMessagesAsSeen = (chatId: string) => {
    setChats(prev => {
      const chat = prev.find(ch => ch.id === chatId);
      if (!chat) return prev;
      const hasUnseen = chat.messages.some(m => m.status !== 'seen') || chat.unreadCount > 0;
      if (!hasUnseen) return prev;
      return prev.map(ch => {
        if (ch.id === chatId) {
          return {
            ...ch,
            unreadCount: 0,
            messages: ch.messages.map(m => (m.status !== 'seen' ? { ...m, status: 'seen' as const } : m))
          };
        }
        return ch;
      });
    });
  };

  const markNotificationsRead = () => {
    setNotifications(prev => {
      if (!prev.some(n => !n.read)) return prev;
      return prev.map(n => ({ ...n, read: true }));
    });
  };

  const updateCurrentUser = (fields: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...fields } : null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeTab,
        setActiveTab,
        posts,
        reels,
        liveStreams,
        voiceRooms,
        chats,
        notifications,
        transactions,
        stories,
        theme,
        setTheme,
        accent,
        setAccent,
        language,
        setLanguage,
        isAiModalOpen,
        setIsAiModalOpen,
        aiPromptResult,
        setAiPromptResult,
        runAiAssistant,
        login,
        register,
        logout,
        toggleLikePost,
        addComment,
        createPost,
        sendTip,
        depositFunds,
        sendMessage,
        toggleMessageHeart,
        acceptMessageRequest,
        declineMessageRequest,
        addReaction,
        markMessagesAsSeen,
        markNotificationsRead,
        activeCallRoom,
        setActiveCallRoom,
        activeLiveStream,
        setActiveLiveStream,
        reportItem,
        banUser,
        isUserBanned,
        shareToStory,
        addStory,
        addReel,
        shareToChat,
        blockedUserIds,
        blockUser,
        unblockUser,
        isUserBlocked,
        followingUserIds,
        followersList,
        toggleFollowUser,
        isFollowingUser,
        removeFollower,
        allCreators: AVAILABLE_CREATORS,
        followToast,
        dismissFollowToast,
        browserNotificationPermission,
        requestBrowserNotifications,
        sendIncomingMessageNotification,
        sendIncomingFollowRequestNotification,
        votePoll,
        updateCurrentUser,
        setChats,
        resetAppData,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

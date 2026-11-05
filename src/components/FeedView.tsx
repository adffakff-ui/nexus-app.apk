import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Send, 
  CheckCircle2, 
  Gift, 
  Lock, 
  Bookmark,
  Plus,
  AlertTriangle,
  History,
  MapPin,
  Camera,
  Vote,
  BarChart3,
  X,
  RefreshCw,
  Clock,
  Flame,
  Users,
  User,
  UserCheck,
  UserPlus,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Post } from '../types';
import { useLongPress } from '../hooks/useLongPress';
import { ReactionPicker } from './ReactionPicker';
import { StoriesBar } from './StoriesBar';
import { ShareModal } from './ShareModal';
import { ReportBlockModal } from './ReportBlockModal';
import { StoryEditor } from './StoryEditor';
import { FeedSkeleton } from './FeedSkeleton';

const PostItem = ({ post }: { post: Post }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { 
    toggleLikePost, 
    addReaction, 
    addComment, 
    sendTip, 
    currentUser, 
    votePoll,
    toggleFollowUser,
    isFollowingUser
  } = useApp(); 
  const longPress = useLongPress(() => setShowPicker(true), () => {});
  
  const isMe = currentUser?.id === post.userId;
  const isFollowingAuthor = isFollowingUser ? isFollowingUser(post.userId) : false;

  return (
    <div {...longPress} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700/80">
      {showPicker && <ReactionPicker onSelect={(r) => { addReaction('post', post.id, r); setShowPicker(false); }} onClose={() => setShowPicker(false)} />}
      {showShare && <ShareModal post={post} onClose={() => setShowShare(false)} />}
      {isReportOpen && (
        <ReportBlockModal 
          userId={post.userId}
          userName={post.userName}
          type="post"
          itemId={post.id}
          onClose={() => setIsReportOpen(false)}
        />
      )}
      
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.userAvatar && post.userAvatar.length > 5 ? (
            <img src={post.userAvatar} alt="" className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-100 dark:ring-slate-800" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{post.userName}</h3>
              {post.verified && <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />}
              
              {/* Follow / Unfollow inline button */}
              {!isMe && (
                <button
                  type="button"
                  onClick={() => toggleFollowUser && toggleFollowUser(post.userId)}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all mr-1.5 ${
                    isFollowingAuthor
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  }`}
                  title={isFollowingAuthor ? 'إلغاء المتابعة' : 'متابعة الكاتب'}
                >
                  {isFollowingAuthor ? (
                    <>
                      <UserCheck className="w-3 h-3 text-emerald-500" />
                      <span>متابع</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 text-indigo-500" />
                      <span>متابعة</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{post.userHandle}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {!isMe && (
              <button 
                onClick={() => setIsReportOpen(true)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="إبلاغ أو حظر"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
           )}
           {post.isExclusive && (
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200 dark:border-amber-900">
              <Lock className="w-3.5 h-3.5" /> حصري (${post.exclusivePrice})
            </span>
           )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="w-full bg-slate-950 max-h-[450px] overflow-hidden flex items-center justify-center relative">
          {post.mediaType === 'video' ? (
            <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {/* Poll Display */}
      {post.poll && (
        <div className="mx-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{post.poll.question}</h4>
          </div>
          <div className="space-y-3">
            {post.poll.options.map((opt, idx) => {
              const percentage = post.poll!.totalVotes > 0 ? Math.round((opt.votes / post.poll!.totalVotes) * 100) : 0;
              const isVoted = post.poll!.userVote !== undefined;
              return (
                <button
                  key={idx}
                  disabled={isVoted}
                  onClick={() => votePoll(post.id, idx)}
                  className={`w-full text-right relative group overflow-hidden transition-all ${!isVoted ? 'hover:scale-[1.01]' : ''}`}
                >
                  <div className="flex justify-between items-center mb-1 text-xs font-bold px-1 text-slate-700 dark:text-slate-300">
                    <span>{opt.text}</span>
                    {isVoted && <span>{percentage}%</span>}
                  </div>
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 rounded-full ${post.poll!.userVote === idx ? 'bg-indigo-600' : 'bg-slate-400 dark:bg-slate-500'}`}
                      style={{ width: `${isVoted ? percentage : 0}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 text-center">
            إجمالي الأصوات: {post.poll.totalVotes} • {post.poll.userVote !== undefined ? 'تم التصويت' : 'بانتظار تصويتك'}
          </div>
        </div>
      )}

      {/* Post Reactions Display */}
      {post.reactions && Object.keys(post.reactions).length > 0 && (
        <div className="px-4 py-2 flex gap-2">
          {Object.entries(post.reactions).map(([emoji, count]) => (
            <span key={emoji} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-xs">
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      {/* Post Actions Bar */}
      <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => toggleLikePost(post.id)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500' : ''}`} />
            <span>{post.likesCount}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-medium hover:text-indigo-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount}</span>
          </button>

          <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 text-xs font-medium hover:text-indigo-500 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{post.sharesCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>دعم صانع المحتوى (${post.tipsTotal})</span>
          </button>
        </div>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-2 text-xs">
                  {c.userAvatar && c.userAvatar.length > 5 ? (
                    <img src={c.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block">{c.userName}</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-2">كن أول من يعلق على هذا المنشور!</p>
            )}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              addComment(post.id, newComment);
              setNewComment('');
            }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              placeholder="اكتب تعليقاً لطيفاً..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
            >
              إرسال
            </button>
          </form>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">دعم {post.userName}</h4>
              <p className="text-xs text-slate-500 mt-1">اختر المبلغ الذي تود إرساله كهدية تقديرية</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 25].map(amt => (
                <button
                  key={amt}
                  onClick={() => {
                    const success = sendTip(post.userName, amt);
                    if (success) {
                      setShowTipModal(false);
                      alert(`تم إرسال دعم بقيمة $${amt} إلى ${post.userName}! 🎁`);
                    } else {
                      alert('رصيد المحفظة غير كافٍ. يرجى شحن المحفظة أولاً.');
                    }
                  }}
                  className="py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowTipModal(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const FeedView: React.FC = () => {
  const { 
    posts, 
    currentUser, 
    createPost, 
    runAiAssistant, 
    blockedUserIds, 
    blockedKeywords,
    followingUserIds = [], 
    toggleFollowUser 
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState<'latest' | 'popular' | 'following'>('latest');
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>(undefined);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [exclusivePrice, setExclusivePrice] = useState(5);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [editingStory, setEditingStory] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const { addStory, votePoll } = useApp();

  const handleStoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setEditingStory({ url, type });
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNewPostContent(prev => prev + ` 📍 موقعي الحالي: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        },
        (err) => {
          alert("تعذر الوصول للموقع الجغرافي. يرجى تفعيل الإذن.");
        }
      );
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !pollQuestion.trim()) return;
    
    let poll = undefined;
    if (pollQuestion.trim() && pollOptions.every(o => o.trim())) {
      poll = {
        question: pollQuestion,
        options: pollOptions.map(o => ({ text: o, votes: 0 })),
        totalVotes: 0
      };
    }

    createPost(newPostContent, mediaUrl || undefined, mediaType, isExclusive, isExclusive ? exclusivePrice : undefined, poll);
    setNewPostContent('');
    setMediaUrl('');
    setMediaType(undefined);
    setIsExclusive(false);
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleAiCaption = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: newPostContent || 'موضوع عام', 
          imageUrl: mediaUrl 
        }),
      });
      const data = await res.json();
      if (data.caption) {
        setNewPostContent(data.caption);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء توليد التعليق.');
    }
    setIsAiGenerating(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Base list of non-blocked posts
  const basePosts = posts.filter(post => 
    !blockedUserIds.includes(post.userId) &&
    !blockedKeywords.some(keyword => post.content.toLowerCase().includes(keyword.toLowerCase()))
  );

  // Engagement score calculator for 'Popular' filter
  const getEngagementScore = (p: Post) => {
    const likes = p.likesCount || 0;
    const comments = p.commentsCount || 0;
    const shares = p.sharesCount || 0;
    const tips = p.tipsTotal || 0;
    const pollVotes = p.poll?.totalVotes || 0;
    return likes + (comments * 2) + (shares * 2) + (tips * 3) + (pollVotes * 2);
  };

  // Filtered and sorted posts according to the selected tab
  const displayedPosts = [...basePosts].filter(post => {
    if (sortFilter === 'following') {
      return (followingUserIds && followingUserIds.includes(post.userId)) || post.userId === currentUser?.id;
    }
    return true;
  }).sort((a, b) => {
    if (sortFilter === 'popular') {
      return getEngagementScore(b) - getEngagementScore(a);
    }
    // 'latest': keep newest posts (which are created and placed at beginning)
    return 0;
  });

  // Post counts for tab badges
  const latestCount = basePosts.length;
  const popularCount = basePosts.length;
  const followingCount = basePosts.filter(p => (followingUserIds && followingUserIds.includes(p.userId)) || p.userId === currentUser?.id).length;

  // Suggested popular creators to follow when Following tab is empty
  const suggestedCreators: any[] = [];

  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* Top Header & Refresh */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 -mb-3">
        <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Compass className="w-3.5 h-3.5 text-indigo-500" />
          <span>خلاصة المحتوى</span>
        </span>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
          title="إعادة تحميل المنشورات"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث الخلاصة</span>
        </button>
      </div>

      {/* Stories Bar */}
      <StoriesBar />

      {/* Create Post Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="شارك تجربتك اليومية، أفكارك، أو صورك مع العالم..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white p-3 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                type="button" 
                onClick={() => storyInputRef.current?.click()}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold"
                title="نشر قصة"
              >
                <History className="w-4 h-4" />
                <span>قصة</span>
              </button>
              <input 
                type="file" 
                ref={storyInputRef} 
                onChange={handleStoryFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
              
              <button 
                type="button" 
                onClick={handleLocation}
                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
                title="إضافة الموقع"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <button 
                type="button" 
                onClick={() => setShowPollCreator(!showPollCreator)}
                className={`p-2 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold ${showPollCreator ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'}`}
                title="إضافة استطلاع"
              >
                <Vote className="w-4 h-4" />
                <span>استطلاع</span>
              </button>

              <button type="button" onClick={handleAiCaption} className="text-xs text-slate-500 flex items-center gap-1 hover:text-indigo-600 transition-colors">
                  <Sparkles className="w-4 h-4" /> {isAiGenerating ? 'جاري التوليد...' : 'تحسين بالذكاء الاصطناعي'}
              </button>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all">نشر منشور</button>
          </div>

          {/* Poll Creator inline */}
          {showPollCreator && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 animate-in slide-in-from-top duration-200">
              <input 
                type="text"
                placeholder="اسأل مجتمعك شيئاً..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={`الخيار ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[i] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        type="button"
                        onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button 
                    type="button" 
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] rounded-xl hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" /> إضافة خيار
                  </button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {editingStory && (
        <StoryEditor 
          mediaUrl={editingStory.url}
          mediaType={editingStory.type}
          onClose={() => setEditingStory(null)}
          onPost={(urls, filter, overlays, layout, bgColor) => {
            addStory(urls, editingStory.type, filter, overlays, layout, bgColor);
            setEditingStory(null);
          }}
        />
      )}

      {/* ============================================================== */}
      {/* SORTING FILTER TABS: 'Latest', 'Popular', 'Following'         */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs flex items-center gap-1.5">
        
        {/* Latest (الأحدث) */}
        <button
          type="button"
          onClick={() => setSortFilter('latest')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            sortFilter === 'latest'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="ترتيب المنشورات بحسب وقت النشر الأحدث أولاً"
        >
          <Clock className={`w-4 h-4 ${sortFilter === 'latest' ? 'text-white' : 'text-slate-400'}`} />
          <span>الأحدث</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            sortFilter === 'latest' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            {latestCount}
          </span>
        </button>

        {/* Popular (الأكثر تفاعلاً) */}
        <button
          type="button"
          onClick={() => setSortFilter('popular')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            sortFilter === 'popular'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="ترتيب المنشورات بحسب حجم التفاعل والإعجابات والتعليقات والدعم"
        >
          <Flame className={`w-4 h-4 ${sortFilter === 'popular' ? 'text-amber-300' : 'text-amber-500'}`} />
          <span>الأكثر تفاعلاً</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            sortFilter === 'popular' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            {popularCount}
          </span>
        </button>

        {/* Following (المتابَعون) */}
        <button
          type="button"
          onClick={() => setSortFilter('following')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            sortFilter === 'following'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="عرض منشورات الأشخاص الذين تتابعهم فقط"
        >
          <Users className={`w-4 h-4 ${sortFilter === 'following' ? 'text-white' : 'text-slate-400'}`} />
          <span>المتابَعون</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
            sortFilter === 'following' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            {followingCount}
          </span>
        </button>

      </div>

      {/* Posts Feed or Empty State */}
      {displayedPosts.length > 0 ? (
        <div className="space-y-6">
          {displayedPosts.map((post: Post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty State for Following filter */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">لم تنشر الحسابات التي تتابعها أي محتوى بعد</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              يمكنك استكشاف منشورات صناع المحتوى المميزين ومتابعتهم لتظهر منشوراتهم هنا تلقائياً.
            </p>
          </div>

          {/* Suggested Creators */}
          <div className="pt-2 text-right">
            <span className="text-xs font-bold text-slate-400 block mb-3">اقتراحات للمتابعة:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedCreators.map(creator => {
                const isFollowed = followingUserIds && followingUserIds.includes(creator.id);
                return (
                  <div key={creator.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    {creator.avatar && creator.avatar.length > 5 ? (
                      <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover mb-2 border border-slate-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate w-full">{creator.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono mb-2 truncate w-full">{creator.handle}</span>
                    <button
                      onClick={() => toggleFollowUser && toggleFollowUser(creator.id)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isFollowed 
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>متابع</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>متابعة</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSortFilter('latest')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              العودة إلى عرض أحدث المنشورات العامة ←
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

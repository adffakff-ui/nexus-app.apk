import React, { useState, useRef } from 'react';
import { Plus, X, Share2, Send, LayoutGrid, Eye, Heart, BarChart2, User, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Story } from '../types';
import { StoryEditor } from './StoryEditor';

export const StoriesBar: React.FC = () => {
  const { currentUser, createPost, sendMessage, chats, stories, addStory } = useApp();
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [editingMedia, setEditingMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const viewStory = (story: Story) => {
    setActiveStory(story);
    setShowInsights(false);
  };

  const shareToFeed = () => {
    if (!activeStory) return;
    createPost(
      `مشاركة لقصة ${activeStory.userName}: أعجبني هذا المحتوى!`,
      activeStory.mediaUrls[0],
      activeStory.mediaType
    );
    alert('تمت مشاركة القصة في خلاصة منشوراتك! 🚀');
    setIsSharing(false);
  };

  const shareToDirect = (chatId: string) => {
    if (!activeStory) return;
    sendMessage(chatId, `شاهد هذه القصة من ${activeStory.userName}: ${activeStory.mediaUrls[0]}`);
    alert('تم إرسال القصة في الدردشة! ✅');
    setIsSharing(false);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setEditingMedia({ url, type });
    }
  };

  const handlePostStory = (urls: string[], filter: string, overlays: any[], layout: string, bgColor: string) => {
    if (editingMedia) {
      addStory(urls, editingMedia.type, filter, overlays, layout, bgColor);
      setEditingMedia(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm overflow-x-auto flex items-center gap-4 scrollbar-none">
        {/* User Story */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center shrink-0 cursor-pointer group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            className="hidden" 
          />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 p-0.5 shadow-md group-active:scale-95 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center relative p-0.5">
              {currentUser?.avatar && currentUser.avatar.length > 5 ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full opacity-90" />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1.5">قصتك</span>
        </div>

        {/* Stories */}
        {stories.map((story) => (
          <div key={story.id} onClick={() => viewStory(story)} className="flex flex-col items-center shrink-0 cursor-pointer group">
            <div className={`w-16 h-16 rounded-full p-0.5 shadow-md ${story.isViewed ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-tr from-indigo-500 to-pink-500'}`}>
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full p-0.5 flex items-center justify-center">
                {story.userAvatar && story.userAvatar.length > 5 ? (
                  <img src={story.userAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1.5 truncate max-w-[64px]">{story.userName}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 sm:p-4">
          <button onClick={() => { setActiveStory(null); setIsSharing(false); }} className="absolute top-5 right-5 text-white/70 hover:text-white z-20 transition-colors"><X className="w-8 h-8" /></button>
          
          <div 
            className="w-full max-w-sm aspect-[9/16] rounded-none sm:rounded-3xl overflow-hidden relative shadow-2xl ring-1 ring-white/10"
            style={{ backgroundColor: activeStory.backgroundColor || '#000000' }}
          >
            <div className={`w-full h-full grid ${
              activeStory.layout === 'split-v' ? 'grid-cols-2' : 
              activeStory.layout === 'split-h' ? 'grid-rows-2' : 
              activeStory.layout === 'grid' ? 'grid-cols-2 grid-rows-2' : 
              'grid-cols-1'
            }`}>
              {activeStory.mediaUrls.map((url, i) => (
                <div key={i} className="relative w-full h-full overflow-hidden">
                  {activeStory.mediaType === 'video' ? (
                    <video 
                      src={url} 
                      autoPlay 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover" 
                      style={{ filter: activeStory.filter }}
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      style={{ filter: activeStory.filter }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Overlays */}
            {activeStory.overlays && activeStory.overlays.map((ov, i) => (
              <div 
                key={i}
                className="absolute pointer-events-none"
                style={{ left: `${ov.x}%`, top: `${ov.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {ov.type === 'text' ? (
                  <span 
                    className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 font-bold text-white shadow-lg"
                    style={{ fontSize: `${ov.fontSize}px`, color: ov.color }}
                  >
                    {ov.content}
                  </span>
                ) : (
                  <span className="text-5xl drop-shadow-xl">{ov.content}</span>
                )}
              </div>
            ))}
            
            {/* Story Header */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {activeStory.userAvatar && activeStory.userAvatar.length > 5 ? (
                  <img src={activeStory.userAvatar} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
                <span className="text-white font-bold text-sm shadow-sm">{activeStory.userName}</span>
              </div>
              <button 
                onClick={() => setIsSharing(!isSharing)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all shadow-lg"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Sharing Options Overlay */}
            {isSharing && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 space-y-6 animate-in fade-in duration-300">
                <h3 className="text-white font-bold text-lg mb-4">أين تود مشاركة هذه القصة؟</h3>
                
                <div className="w-full space-y-3">
                  <button 
                    onClick={shareToFeed}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    <span>نشر في الخلاصة الرئيسية</span>
                  </button>

                  <div className="pt-4 border-t border-white/10 w-full text-center">
                    <p className="text-white/60 text-xs mb-4">إرسال إلى محادثة مباشرة</p>
                    <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto p-2 scrollbar-none">
                      {chats.map(chat => (
                        <button 
                          key={chat.id} 
                          onClick={() => shareToDirect(chat.id)}
                          className="flex flex-col items-center gap-2 group"
                        >
                          {chat.avatar && chat.avatar.length > 5 ? (
                            <img src={chat.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                              <User className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <span className="text-white/80 text-[10px] truncate w-full text-center">{chat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSharing(false)}
                  className="mt-4 text-white/50 text-sm font-medium hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            )}
            
            <div className="absolute top-12 left-4 right-4 flex gap-1 z-10 px-2">
              {stories.map((s, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${s.id === activeStory.id ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>

            {/* View Count & Swipe Up for Owner */}
            {activeStory.userId === currentUser?.id && !showInsights && (
              <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-1 text-white animate-bounce cursor-pointer z-10" onClick={() => setShowInsights(true)}>
                <ChevronUp className="w-5 h-5" />
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{activeStory.viewers?.length || 0} مشاهدة</span>
                </div>
              </div>
            )}

            {/* Story Insights Overlay */}
            {showInsights && (
              <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-xl animate-in slide-in-from-bottom duration-300 flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">إحصائيات القصة</h3>
                  <button onClick={() => setShowInsights(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Reaction Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="flex justify-center mb-2">
                        <Eye className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="text-xl font-bold text-white">{activeStory.viewers?.length || 0}</div>
                      <div className="text-[10px] text-white/50">إجمالي المشاهدات</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                      <div className="flex justify-center mb-2">
                        <Heart className="w-6 h-6 text-rose-400" />
                      </div>
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-white/50">تفاعلات القلب</div>
                    </div>
                  </div>

                  {/* Viewers List */}
                  <div>
                    <h4 className="text-white/60 text-[10px] font-bold uppercase mb-3 px-1">المشاهدون</h4>
                    <div className="space-y-4">
                      {/* Real viewers if any, plus some mocks for demonstration */}
                      {activeStory.viewers?.map(v => (
                        <div key={v.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {v.userAvatar && v.userAvatar.length > 5 ? (
                              <img src={v.userAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-white">{v.userName}</div>
                              <div className="text-[9px] text-white/40">{v.viewedAt}</div>
                            </div>
                          </div>
                          <button className="text-white/30 hover:text-white transition-colors"><Send className="w-4 h-4" /></button>
                        </div>
                      ))}
                      
                      {(!activeStory.viewers || activeStory.viewers.length === 0) && (
                        <div className="text-center py-4">
                          <p className="text-[10px] text-white/30">لا توجد مشاهدات بعد</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border-t border-white/5">
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <BarChart2 className="w-4 h-4" />
                    <span>عرض التحليلات التفصيلية</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Story Editor Modal */}
      {editingMedia && (
        <StoryEditor 
          mediaUrl={editingMedia.url}
          mediaType={editingMedia.type}
          onClose={() => setEditingMedia(null)}
          onPost={handlePostStory}
        />
      )}
    </>
  );
};

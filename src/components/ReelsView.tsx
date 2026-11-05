import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Gift, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Scissors,
  Sparkles,
  Plus,
  Palette,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { ReelsSkeleton } from './ReelsSkeleton';
import { ReelEditorModal } from './ReelEditorModal';

export const ReelsView: React.FC = () => {
  const { reels, currentUser, toggleFollowUser, isFollowingUser } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialVideo, setEditorInitialVideo] = useState<string | undefined>(undefined);
  const [editorInitialCaption, setEditorInitialCaption] = useState<string | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const currentReel = reels[activeIndex] || reels[0];

  useEffect(() => {
    if (videoRef.current && currentReel?.trimStart !== undefined) {
      videoRef.current.currentTime = currentReel.trimStart;
    }
  }, [activeIndex, currentReel]);

  const handleTimeUpdate = () => {
    if (videoRef.current && currentReel?.trimStart !== undefined && currentReel?.trimEnd !== undefined) {
      if (videoRef.current.currentTime >= currentReel.trimEnd) {
        videoRef.current.currentTime = currentReel.trimStart;
      } else if (videoRef.current.currentTime < currentReel.trimStart) {
        videoRef.current.currentTime = currentReel.trimStart;
      }
    }
  };

  const handleOpenNewEditor = () => {
    setEditorInitialVideo(undefined);
    setEditorInitialCaption(undefined);
    setIsEditorOpen(true);
  };

  const handleEditCurrentReel = () => {
    if (currentReel) {
      setEditorInitialVideo(currentReel.videoUrl);
      setEditorInitialCaption(`إعادة تحرير: ${currentReel.caption}`);
      setIsEditorOpen(true);
    }
  };

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return <ReelsSkeleton />;
  }

  if (!currentReel) return <div className="text-center py-20">لا توجد مقاطع ريلز متاحة</div>;

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-6rem)] flex flex-col justify-center items-center pb-6">
      <div className="w-full h-full bg-slate-950 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
        
        {/* Video Player */}
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          style={{ filter: currentReel.filter || 'none' }}
          className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-200"
        />

        {/* Top Overlay Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xs sm:text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>ريلز نكسوس 🎬</span>
            </span>

            {/* Quick Create / Edit Reel Button */}
            <button
              onClick={handleOpenNewEditor}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
              title="قص مقطع جديد وإضافة فلاتر لونية ونشره"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>تحرير وقص ريلز ✂️</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Active filter badge if reel has custom filter */}
            {currentReel.filter && currentReel.filter !== 'none' && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30 backdrop-blur-md px-2 py-0.5 rounded-full font-bold">
                <Palette className="w-3 h-3" />
                فلتر مخصص
              </span>
            )}

            <button
              onClick={handleReload}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
              title="إعادة تحميل المقطع"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-3.5">
          {/* Edit / Trim This Reel Button */}
          <button 
            onClick={handleEditCurrentReel}
            className="flex flex-col items-center gap-1 group"
            title="تحرير وقص هذا المقطع أو إضافة فلاتر لونية"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600/70 to-rose-600/70 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-lg">
              <Scissors className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-white text-[10px] font-bold">تحرير</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-rose-500 transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-white text-xs font-bold">{currentReel.likesCount}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-white text-xs font-bold">{currentReel.commentsCount}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-white text-xs font-bold">دعم</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-violet-500 transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-white text-xs font-bold">{currentReel.sharesCount}</span>
          </button>
        </div>

        {/* Bottom Details & Navigation */}
        <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-3">
          <div className="flex items-center gap-3">
            <img src={currentReel.userAvatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-white/80" />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-white text-sm">{currentReel.userName}</h4>
                {currentReel.verified && <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />}
              </div>
              {currentUser?.id !== currentReel.userId && (
                <button 
                  onClick={() => toggleFollowUser(currentReel.userId)}
                  className={`text-xs px-3 py-1 rounded-full font-bold mt-1 shadow-sm transition-all flex items-center gap-1 active:scale-95 ${
                    isFollowingUser(currentReel.userId)
                      ? 'bg-white/20 hover:bg-rose-500/30 text-white hover:text-rose-200 border border-white/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50'
                  }`}
                  title={isFollowingUser(currentReel.userId) ? 'إلغاء المتابعة' : 'متابعة هذا المنشئ'}
                >
                  {isFollowingUser(currentReel.userId) ? (
                    <>
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>متابَع</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>متابعة</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
            {currentReel.caption}
          </p>

          <div className="flex items-center gap-2 text-white/80 text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl w-fit">
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate max-w-[200px]">{currentReel.musicTitle}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="px-4 py-1.5 rounded-xl bg-white/20 disabled:opacity-30 text-white text-xs font-bold backdrop-blur-md"
            >
              السابق ⬆
            </button>
            <span className="text-xs text-white/70">{activeIndex + 1} / {reels.length}</span>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
            >
              التالي ⬇
            </button>
          </div>
        </div>

      </div>

      {/* REEL VIDEO EDITOR & FILTER MODAL */}
      <ReelEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setActiveIndex(0); // Jump to top in case a new reel was just created
        }}
        initialVideoUrl={editorInitialVideo}
        initialCaption={editorInitialCaption}
      />
    </div>
  );
};

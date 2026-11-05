import React from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { Post, Reel } from '../types';

export const SavedView: React.FC = () => {
  const { posts, reels } = useApp();
  
  const savedPosts = posts.filter(p => p.isSaved);
  const savedReels = reels.filter(r => r.isSaved);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>العناصر المحفوظة</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">شاهد المنشورات والريلز التي قمت بحفظها للرجوع إليها لاحقاً</p>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">المنشورات المحفوظة</h3>
        {savedPosts.length === 0 && <p className="text-sm text-slate-500">لا توجد منشورات محفوظة حالياً.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPosts.map((post: Post) => (
            <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">الريلز المحفوظة</h3>
        {savedReels.length === 0 && <p className="text-sm text-slate-500">لا توجد ريلز محفوظة حالياً.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {savedReels.map((reel: Reel) => (
            <div key={reel.id} className="aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden relative">
              <video src={reel.videoUrl} className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded-full">
                {reel.caption.substring(0, 15)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

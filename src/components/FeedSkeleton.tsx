import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 select-none animate-in fade-in duration-300" aria-label="جاري تحميل المنشورات...">
      {/* Stories Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm overflow-hidden flex items-center gap-4">
        {/* User Story placeholder */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 shimmer-wave">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="w-10 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 shimmer-wave" />
        </div>

        {/* 5 Stories placeholders */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className="w-16 h-16 rounded-full p-0.5 bg-slate-200 dark:bg-slate-800 shimmer-wave">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-850 rounded-full" />
            </div>
            <div className="w-12 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 shimmer-wave" />
          </div>
        ))}
      </div>

      {/* Create Post Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="w-full h-20 bg-slate-100 dark:bg-slate-800/60 rounded-xl shimmer-wave" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded-xl shimmer-wave" />
            <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-xl shimmer-wave" />
            <div className="w-16 h-7 bg-slate-100 dark:bg-slate-800 rounded-xl shimmer-wave" />
            <div className="w-24 h-5 bg-slate-100 dark:bg-slate-800/60 rounded-lg shimmer-wave hidden sm:block" />
          </div>
          <div className="w-24 h-8 bg-indigo-500/20 dark:bg-indigo-600/30 rounded-xl shimmer-wave" />
        </div>
      </div>

      {/* Posts Skeletons (3 post cards) */}
      {[1, 2, 3].map((postIdx) => (
        <div 
          key={postIdx} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Post Header Skeleton */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0 shimmer-wave" />
              <div className="space-y-1.5">
                <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full shimmer-wave" />
                <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full shimmer-wave" />
              </div>
            </div>
            <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg shimmer-wave" />
          </div>

          {/* Post Content Lines Skeleton */}
          <div className="px-4 pb-3 space-y-2">
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full shimmer-wave" />
            <div className="w-4/5 h-3 bg-slate-200 dark:bg-slate-800 rounded-full shimmer-wave" />
            {postIdx % 2 === 0 && (
              <div className="w-3/5 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full shimmer-wave" />
            )}
          </div>

          {/* Post Media Skeleton (alternating sizes for realistic rhythm) */}
          <div className={`w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden shimmer-wave ${postIdx === 2 ? 'h-64' : 'h-80'}`}>
            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-800/80" />
          </div>

          {/* Post Actions Bar Skeleton */}
          <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 shimmer-wave" />
                <div className="w-6 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 shimmer-wave" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 shimmer-wave" />
                <div className="w-6 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 shimmer-wave" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 shimmer-wave" />
                <div className="w-6 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 shimmer-wave" />
              </div>
            </div>

            <div className="w-28 h-7 rounded-xl bg-slate-100 dark:bg-slate-800/70 shimmer-wave" />
          </div>
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { Film } from 'lucide-react';

export const ReelsSkeleton: React.FC = () => {
  return (
    <div className="max-w-md mx-auto h-[calc(100vh-6rem)] flex flex-col justify-center items-center pb-6 select-none animate-in fade-in duration-300" aria-label="جاري تحميل الريلز...">
      <div className="w-full h-full bg-slate-950 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col justify-between">
        
        {/* Shimmering Video Area Background with subtle film watermark */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center shimmer-wave">
          <Film className="w-16 h-16 text-slate-800/60" />
        </div>

        {/* Top Overlay Bar Skeleton */}
        <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
          <div className="h-7 w-28 rounded-full bg-white/10 backdrop-blur-md shimmer-wave" />
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md shimmer-wave" />
        </div>

        {/* Right Side Action Buttons Skeleton */}
        <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-4">
          {[1, 2, 3, 4].map((btn) => (
            <div key={btn} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/5 shimmer-wave" />
              <div className="w-6 h-2 rounded-full bg-white/20 shimmer-wave" />
            </div>
          ))}
        </div>

        {/* Bottom Details & Navigation Skeleton */}
        <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-3">
          {/* Streamer/Creator Row */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 shimmer-wave shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-28 h-3.5 bg-white/25 rounded-full shimmer-wave" />
              <div className="w-16 h-5 bg-indigo-500/30 rounded-full shimmer-wave" />
            </div>
          </div>

          {/* Caption Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="w-3/4 h-3 bg-white/20 rounded-full shimmer-wave" />
            <div className="w-1/2 h-2.5 bg-white/15 rounded-full shimmer-wave" />
          </div>

          {/* Music pill */}
          <div className="w-40 h-6 bg-white/10 backdrop-blur-md rounded-xl shimmer-wave" />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="w-20 h-7 rounded-xl bg-white/15 shimmer-wave" />
            <div className="w-12 h-3 rounded-full bg-white/20 shimmer-wave" />
            <div className="w-20 h-7 rounded-xl bg-indigo-600/40 shimmer-wave" />
          </div>
        </div>

      </div>
    </div>
  );
};

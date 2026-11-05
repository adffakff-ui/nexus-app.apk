import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Scissors, 
  Sparkles, 
  Palette, 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Music, 
  Check, 
  Film, 
  Clock, 
  Sliders, 
  Video,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideoUrl?: string;
  initialCaption?: string;
}

export interface ColorFilterPreset {
  id: string;
  name: string;
  css: string;
  gradient: string;
  description: string;
}

export const COLOR_FILTERS: ColorFilterPreset[] = [
  {
    id: 'normal',
    name: 'عادي (أصلي)',
    css: 'none',
    gradient: 'from-neutral-700 to-neutral-900',
    description: 'الألوان الطبيعية بدون أي تعديل'
  },
  {
    id: 'cinema',
    name: 'سينمائي دافئ',
    css: 'sepia(0.3) saturate(1.4) contrast(1.1) brightness(1.05)',
    gradient: 'from-amber-600 to-orange-700',
    description: 'ألوان دافئة تحاكي درجات كاميرات السينما'
  },
  {
    id: 'mono',
    name: 'أبيض وأسود كلاسيك',
    css: 'grayscale(1) contrast(1.25) brightness(0.95)',
    gradient: 'from-zinc-400 to-zinc-900',
    description: 'تدرجات رمادية درامية فائقة التباين'
  },
  {
    id: 'cyber',
    name: 'نيون سايبر',
    css: 'hue-rotate(170deg) saturate(1.9) contrast(1.2)',
    gradient: 'from-cyan-500 to-fuchsia-600',
    description: 'إضاءة نيون ليلية مستقبلية مشعة'
  },
  {
    id: 'vintage',
    name: 'فينتاج السبعينات',
    css: 'sepia(0.55) contrast(0.95) brightness(1.1) saturate(1.25)',
    gradient: 'from-yellow-700 to-amber-900',
    description: 'مظهر الأفلام التناظرية القديمة والنوستالجيا'
  },
  {
    id: 'cold_blue',
    name: 'كولد دريم',
    css: 'hue-rotate(205deg) saturate(1.35) brightness(1.05)',
    gradient: 'from-blue-600 to-indigo-900',
    description: 'ألوان باردة منعشة وهادئة'
  },
  {
    id: 'vivid',
    name: 'ألوان زاهية HDR',
    css: 'saturate(2.1) contrast(1.2) brightness(1.05)',
    gradient: 'from-rose-500 to-amber-500',
    description: 'تشبع لوني مكثف يبرز كافة تفاصيل المشهد'
  },
  {
    id: 'dreamy',
    name: 'سوفت دريم',
    css: 'brightness(1.18) contrast(0.9) saturate(1.3)',
    gradient: 'from-pink-400 to-purple-600',
    description: 'إضاءة ناعمة حالمة ودرجات مخملية'
  }
];

const SAMPLE_VIDEOS = [
  {
    id: 'v1',
    name: 'إضاءة نيون دبي',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lights-41642-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'v2',
    name: 'أمواج البحر الهادئة',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'v3',
    name: 'شلالات الطبيعة',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'v4',
    name: 'حركة المدينة ليلاً',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41584-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=150&auto=format&fit=crop&q=80'
  }
];

const MUSIC_TRACKS = [
  'صوت أصلي للمقطع 🎙️',
  'ريمكس إلكتروني حماسي ⚡',
  'صوت الأمواج الطبيعي والاسترخاء 🌊',
  'عزف عود يمني تقليدي 🇾🇪',
  'بيانو هادئ حالم 🎹',
  'إيقاع عصري ترند نكسوس 🔥'
];

export const ReelEditorModal: React.FC<ReelEditorModalProps> = ({
  isOpen,
  onClose,
  initialVideoUrl,
  initialCaption
}) => {
  const { addReel } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState<'trim' | 'filters' | 'publish'>('trim');

  // Video State
  const [videoUrl, setVideoUrl] = useState<string>(
    initialVideoUrl || SAMPLE_VIDEOS[0].url
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(15);
  const [currentTime, setCurrentTime] = useState(0);

  // Trimming State (in seconds)
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(15);

  // Filter State
  const [selectedFilterId, setSelectedFilterId] = useState('normal');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Publishing State
  const [caption, setCaption] = useState(initialCaption || 'مقطع ريلز جديد تم تحريره وإخراجه عبر نكسوس 🎬✨ #ريلز #فيديو');
  const [selectedMusic, setSelectedMusic] = useState(MUSIC_TRACKS[0]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Calculate composite CSS filter string
  const activePreset = COLOR_FILTERS.find(f => f.id === selectedFilterId) || COLOR_FILTERS[0];
  const combinedFilterCss = `${activePreset.css === 'none' ? '' : activePreset.css} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`.trim();

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
        setTrimStart(0);
        setTrimEnd(Math.min(dur, 30)); // default cap to 30s or full
      }
    }
  };

  // Enforce trim boundaries during playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);

      // Loop within trimmed region
      if (curr >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      } else if (curr < trimStart) {
        videoRef.current.currentTime = trimStart;
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Seek video when user moves trim start
  const handleTrimStartChange = (val: number) => {
    const newStart = Math.min(val, trimEnd - 1);
    setTrimStart(newStart);
    if (videoRef.current) {
      videoRef.current.currentTime = newStart;
    }
  };

  // Seek video when user moves trim end
  const handleTrimEndChange = (val: number) => {
    const newEnd = Math.max(val, trimStart + 1);
    setTrimEnd(newEnd);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedFilterId('normal');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  // Preset Trim helpers
  const applyTrimPreset = (type: 'full' | 'first5' | 'first15' | 'middle') => {
    if (!duration) return;
    if (type === 'full') {
      setTrimStart(0);
      setTrimEnd(duration);
    } else if (type === 'first5') {
      setTrimStart(0);
      setTrimEnd(Math.min(5, duration));
    } else if (type === 'first15') {
      setTrimStart(0);
      setTrimEnd(Math.min(15, duration));
    } else if (type === 'middle') {
      const mid = duration / 2;
      const start = Math.max(0, mid - 3);
      const end = Math.min(duration, mid + 3);
      setTrimStart(start);
      setTrimEnd(end);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart;
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
    }
  };

  // Handle Publish
  const handlePublishReel = () => {
    if (!caption.trim()) return;

    setIsPublishing(true);

    setTimeout(() => {
      addReel({
        caption: caption.trim(),
        videoUrl,
        musicTitle: selectedMusic,
        filter: combinedFilterCss,
        trimStart: Math.round(trimStart * 10) / 10,
        trimEnd: Math.round(trimEnd * 10) / 10
      });

      setIsPublishing(false);
      setPublishSuccess(true);

      setTimeout(() => {
        setPublishSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-right">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                أداة تحرير واستوديو الريلز 🎬
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                  قص وفلاتر ونشر
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">قص المقاطع بدقة، إضافة الفلاتر السينمائية، والتجهيز للنشر</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Content: Left side preview, Right side editor controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* VIDEO PREVIEW AREA (md:col-span-5) */}
          <div className="md:col-span-5 bg-black/70 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-neutral-800 relative">
            <div className="relative w-full max-w-[260px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group">
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                loop
                playsInline
                muted={false}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                style={{ filter: combinedFilterCss }}
                className="w-full h-full object-cover transition-[filter] duration-200"
              />

              {/* Play / Pause Overlay Button */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group-hover:opacity-100 opacity-0"
              >
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-white" />}
                </div>
              </button>

              {/* Top Watermark & Filter Badge */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  {activePreset.name}
                </span>
                <span className="text-[10px] font-mono text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  {formatSeconds(currentTime)} / {formatSeconds(trimEnd - trimStart)}
                </span>
              </div>

              {/* Bottom Trimming Progress Indicator */}
              <div className="absolute bottom-2 inset-x-2 h-1.5 bg-white/20 rounded-full overflow-hidden z-10">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full transition-all duration-75"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((currentTime - trimStart) / Math.max(0.1, trimEnd - trimStart)) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Quick Sample Selector & Upload */}
            <div className="w-full max-w-[260px] mt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>مقاطع جاهزة أو رفع:</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  رفع فيديو
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setVideoUrl(sample.url);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-video border text-[9px] font-bold transition-all ${
                      videoUrl === sample.url
                        ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={sample.thumb} alt="" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] truncate p-0.5">
                      {sample.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* EDITING CONTROLS AREA (md:col-span-7) */}
          <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4">
            
            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
              <button
                onClick={() => setActiveTab('trim')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'trim'
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-rose-400" />
                <span>قص وتقطيع</span>
              </button>

              <button
                onClick={() => setActiveTab('filters')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'filters'
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>فلاتر لونية</span>
              </button>

              <button
                onClick={() => setActiveTab('publish')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'publish'
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>تجهيز ونشر</span>
              </button>
            </div>

            {/* TAB 1: TRIMMING (قص الفيديو) */}
            {activeTab === 'trim' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-rose-500" />
                      التحكم في نقاط بداية ونهاية المقطع
                    </span>
                    <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 font-bold">
                      المدة المقصوصة: {(trimEnd - trimStart).toFixed(1)} ثانية
                    </span>
                  </div>

                  {/* Sliders Box */}
                  <div className="space-y-4">
                    {/* Start Time Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-300 mb-1.5">
                        <span className="font-bold">نقطة البداية (Start Cut):</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatSeconds(trimStart)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(1, duration - 1)}
                        step={0.2}
                        value={trimStart}
                        onChange={(e) => handleTrimStartChange(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                      />
                    </div>

                    {/* End Time Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-300 mb-1.5">
                        <span className="font-bold">نقطة النهاية (End Cut):</span>
                        <span className="font-mono text-rose-400 font-bold">{formatSeconds(trimEnd)}</span>
                      </div>
                      <input
                        type="range"
                        min={Math.min(trimStart + 0.5, duration)}
                        max={duration || 30}
                        step={0.2}
                        value={trimEnd}
                        onChange={(e) => handleTrimEndChange(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Visual Trim Track Representation */}
                  <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 space-y-1">
                    <div className="text-[10px] text-neutral-400 flex justify-between">
                      <span>00:00</span>
                      <span className="text-indigo-400 font-bold">المقطع المحدد بين {formatSeconds(trimStart)} و {formatSeconds(trimEnd)}</span>
                      <span>{formatSeconds(duration)}</span>
                    </div>
                    <div className="relative h-6 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 flex items-center">
                      <div 
                        className="absolute h-full bg-indigo-600/30 border-x-2 border-indigo-400"
                        style={{
                          left: `${(trimStart / (duration || 1)) * 100}%`,
                          width: `${((trimEnd - trimStart) / (duration || 1)) * 100}%`
                        }}
                      />
                      <div className="w-full flex justify-around opacity-30 pointer-events-none">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="w-0.5 h-3 bg-white rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Trim Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-neutral-400 block">خيارات قص سريعة:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => applyTrimPreset('first5')}
                        className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 font-medium text-center"
                      >
                        أول 5 ثواني
                      </button>
                      <button
                        onClick={() => applyTrimPreset('first15')}
                        className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 font-medium text-center"
                      >
                        أول 15 ثانية
                      </button>
                      <button
                        onClick={() => applyTrimPreset('middle')}
                        className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 font-medium text-center"
                      >
                        قص المنتصف
                      </button>
                      <button
                        onClick={() => applyTrimPreset('full')}
                        className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 font-medium text-center"
                      >
                        كامل المقطع
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('filters')}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>المتابعة إلى الفلاتر اللونية</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: COLOR FILTERS (الفلاتر اللونية) */}
            {activeTab === 'filters' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-amber-500" />
                      فلاتر الألوان والمؤثرات البصرية
                    </span>
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      إعادة ضبط
                    </button>
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFilterId(f.id)}
                        className={`p-2 rounded-2xl border text-right transition-all flex flex-col justify-between h-20 relative overflow-hidden group ${
                          selectedFilterId === f.id
                            ? 'bg-neutral-850 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className={`w-full h-2 rounded-full bg-gradient-to-r ${f.gradient}`} />
                        <div>
                          <div className="font-bold text-xs text-white flex items-center justify-between">
                            <span>{f.name}</span>
                            {selectedFilterId === f.id && (
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>
                          <p className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">{f.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Manual Tone Adjustments */}
                  <div className="pt-2 border-t border-neutral-800/80 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300">
                      <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                      <span>تعديل درجات الألوان المتقدمة:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                          <span>السطوع</span>
                          <span className="font-mono text-white">{brightness}%</span>
                        </div>
                        <input
                          type="range"
                          min={60}
                          max={140}
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                          <span>التباين</span>
                          <span className="font-mono text-white">{contrast}%</span>
                        </div>
                        <input
                          type="range"
                          min={60}
                          max={150}
                          value={contrast}
                          onChange={(e) => setContrast(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                          <span>التشبع</span>
                          <span className="font-mono text-white">{saturation}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={200}
                          value={saturation}
                          onChange={(e) => setSaturation(parseInt(e.target.value))}
                          className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveTab('trim')}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-bold"
                  >
                    السابق (القص)
                  </button>
                  <button
                    onClick={() => setActiveTab('publish')}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>المتابعة إلى تفاصيل النشر</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PUBLISH & DETAILS (تجهيز ونشر) */}
            {activeTab === 'publish' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      تفاصيل ونشر الريلز في الخلاصة العامة
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">
                      جاهز للنشر
                    </span>
                  </div>

                  {/* Caption Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      وصف الريلز والهاشتاقات *
                    </label>
                    <textarea
                      rows={3}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="اكتب وصفاً معبراً عن محتوى الفيديو..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Audio Track Selector */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-indigo-400" />
                      المسار الصوتي للريلز
                    </label>
                    <select
                      value={selectedMusic}
                      onChange={(e) => setSelectedMusic(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {MUSIC_TRACKS.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Edit Summary Card */}
                  <div className="p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                    <div className="font-bold text-white text-[11px]">ملخص التعديلات على الفيديو:</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                      <div>✂️ المدة بعد القص: <span className="text-white font-mono">{(trimEnd - trimStart).toFixed(1)} ثانية</span></div>
                      <div>🎨 الفلتر المطبق: <span className="text-amber-400 font-bold">{activePreset.name}</span></div>
                    </div>
                  </div>
                </div>

                {/* Publish Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handlePublishReel}
                    disabled={isPublishing || publishSuccess}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-500 hover:opacity-95 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري معالجة ونشر الريلز...</span>
                      </>
                    ) : publishSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-300" />
                        <span>تم نشر الريلز بنجاح! 🎉</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>نشر الريلز في الخلاصة العامة الآن 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

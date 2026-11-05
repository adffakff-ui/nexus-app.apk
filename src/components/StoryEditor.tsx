import React, { useState, useRef } from 'react';
import { X, Check, Type, Smile, Wand2, Trash2, Download, Send, Layout, Palette, ImagePlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoryOverlay } from '../types';
import { moderateContent } from '../utils/moderation';

interface StoryEditorProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  onClose: () => void;
  onPost: (mediaUrls: string[], filter: string, overlays: StoryOverlay[], layout: string, backgroundColor: string) => void;
}

const FILTERS = [
  { name: 'الأصلي', value: 'none' },
  { name: 'رمادي', value: 'grayscale(100%)' },
  { name: 'سيبيا', value: 'sepia(80%)' },
  { name: 'ساطع', value: 'brightness(130%)' },
  { name: 'داكن', value: 'brightness(70%)' },
  { name: 'تباين', value: 'contrast(150%)' },
  { name: 'باهت', value: 'saturate(0.5)' },
  { name: 'حيوية', value: 'saturate(2)' },
];

const STICKERS = ['🔥', '❤️', '😂', '✨', '🚀', '🙌', '💯', '📍', '🕒', '❄️', '🌈', '🎉'];

const LAYOUTS = [
  { id: 'single', name: 'منفرد', icon: <div className="w-6 h-6 border-2 border-current rounded-sm" /> },
  { id: 'split-v', name: 'عمودي', icon: <div className="w-6 h-6 border-2 border-current rounded-sm flex"><div className="w-1/2 border-r border-current" /></div> },
  { id: 'split-h', name: 'أفقي', icon: <div className="w-6 h-6 border-2 border-current rounded-sm flex flex-col"><div className="h-1/2 border-b border-current" /></div> },
  { id: 'grid', name: 'شبكة', icon: <div className="w-6 h-6 border-2 border-current rounded-sm grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-current" /><div className="border-b border-current" /><div className="border-r border-current" /></div> },
];

const COLORS = [
  '#000000', '#4f46e5', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#6366f1'
];

export const StoryEditor: React.FC<StoryEditorProps> = ({ mediaUrl, mediaType, onClose, onPost }) => {
  const { language } = useApp();
  const [filter, setFilter] = useState('none');
  const [layout, setLayout] = useState('single');
  const [bgColor, setBgColor] = useState('#000000');
  const [mediaUrls, setMediaUrls] = useState<string[]>([mediaUrl]);
  const [overlays, setOverlays] = useState<StoryOverlay[]>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showLayouts, setShowLayouts] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addText = () => {
    if (!currentText.trim()) return;
    
    const { moderatedText } = moderateContent(currentText);
    
    const newOverlay: StoryOverlay = {
      type: 'text',
      content: moderatedText,
      x: 50,
      y: 50,
      color: 'white',
      fontSize: 24,
    };
    setOverlays([...overlays, newOverlay]);
    setCurrentText('');
    setIsAddingText(false);
  };

  const addSticker = (sticker: string) => {
    const newOverlay: StoryOverlay = {
      type: 'sticker',
      content: sticker,
      x: 50,
      y: 50,
    };
    setOverlays([...overlays, newOverlay]);
    setShowStickers(false);
  };

  const removeOverlay = (index: number) => {
    setOverlays(overlays.filter((_, i) => i !== index));
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrls([...mediaUrls, url]);
    }
  };

  const handlePost = () => {
    onPost(mediaUrls, filter, overlays, layout, bgColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setShowLayouts(!showLayouts); setShowFilters(false); setShowStickers(false); setShowColors(false); }} 
            className={`p-2 rounded-full transition-colors ${showLayouts ? 'bg-indigo-600 text-white' : 'text-white hover:bg-white/10'}`}
          >
            <Layout className="w-6 h-6" />
          </button>
          <button 
            onClick={() => { setShowColors(!showColors); setShowFilters(false); setShowStickers(false); setShowLayouts(false); }} 
            className={`p-2 rounded-full transition-colors ${showColors ? 'bg-indigo-600 text-white' : 'text-white hover:bg-white/10'}`}
          >
            <Palette className="w-6 h-6" />
          </button>
          <button 
            onClick={() => { setShowFilters(!showFilters); setShowStickers(false); setShowLayouts(false); setShowColors(false); }} 
            className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'text-white hover:bg-white/10'}`}
          >
            <Wand2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsAddingText(true)} 
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Type className="w-6 h-6" />
          </button>
          <button 
            onClick={() => { setShowStickers(!showStickers); setShowFilters(false); setShowLayouts(false); setShowColors(false); }} 
            className={`p-2 rounded-full transition-colors ${showStickers ? 'bg-indigo-600 text-white' : 'text-white hover:bg-white/10'}`}
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-md aspect-[9/16] overflow-hidden shadow-2xl transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      >
        <div className={`w-full h-full grid transition-all duration-500 ${
          layout === 'split-v' ? 'grid-cols-2' : 
          layout === 'split-h' ? 'grid-rows-2' : 
          layout === 'grid' ? 'grid-cols-2 grid-rows-2' : 
          'grid-cols-1'
        }`}>
          {Array.from({ length: layout === 'grid' ? 4 : layout.startsWith('split') ? 2 : 1 }).map((_: any, i: number) => (
            <div key={i} className="relative w-full h-full border border-white/5 overflow-hidden group/item">
              {mediaUrls[i] ? (
                mediaType === 'video' ? (
                  <video src={mediaUrls[i]} autoPlay loop muted className="w-full h-full object-cover" style={{ filter }} />
                ) : (
                  <img src={mediaUrls[i]} alt="" className="w-full h-full object-cover transition-all" style={{ filter }} />
                )
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 cursor-pointer text-white/30 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-bold">إضافة صورة</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <input type="file" ref={fileInputRef} onChange={handleAddMedia} accept="image/*" className="hidden" />

        {/* Overlays */}
        {overlays.map((ov: any, i: number) => (
          <div 
            key={i}
            className="absolute cursor-move select-none group"
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
            <button 
              onClick={() => removeOverlay(i)}
              className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Text Input Modal Overlay */}
        {isAddingText && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-6">
            <textarea
              autoFocus
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="اكتب شيئاً..."
              className="w-full bg-transparent text-white text-center text-3xl font-bold focus:outline-none placeholder:text-white/30 resize-none h-32"
            />
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsAddingText(false)}
                className="px-6 py-2 rounded-full bg-white/10 text-white font-medium"
              >
                إلغاء
              </button>
              <button 
                onClick={addText}
                className="px-8 py-2 rounded-full bg-indigo-600 text-white font-bold"
              >
                تم
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Controls */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between z-50 bg-gradient-to-t from-black/50 to-transparent">
        <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
          <Download className="w-6 h-6" />
          <span className="text-[10px] font-medium">حفظ</span>
        </button>

        <button 
          onClick={handlePost}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
        >
          <span>نشر في قصتك</span>
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Sheet */}
      {showFilters && (
        <div className="absolute bottom-0 inset-x-0 z-[80] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">الفلاتر</h3>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-white/50" /></button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.name}
                onClick={() => setFilter(f.value)}
                className={`flex flex-col items-center gap-2 shrink-0 group`}
              >
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${filter === f.value ? 'border-indigo-500 scale-105' : 'border-white/10'}`}>
                  <img 
                    src={mediaUrl} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    style={{ filter: f.value }}
                  />
                </div>
                <span className={`text-[10px] font-medium ${filter === f.value ? 'text-indigo-400' : 'text-white/60'}`}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stickers Sheet */}
      {showStickers && (
        <div className="absolute bottom-0 inset-x-0 z-[80] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">الملصقات</h3>
            <button onClick={() => setShowStickers(false)}><X className="w-5 h-5 text-white/50" /></button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {STICKERS.map((s) => (
              <button
                key={s}
                onClick={() => addSticker(s)}
                className="text-4xl hover:scale-125 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layouts Sheet */}
      {showLayouts && (
        <div className="absolute bottom-0 inset-x-0 z-[80] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">تنسيقات التصميم</h3>
            <button onClick={() => setShowLayouts(false)}><X className="w-5 h-5 text-white/50" /></button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLayout(l.id); setShowLayouts(false); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${layout === l.id ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 text-white/50 hover:bg-white/5'}`}
              >
                {l.icon}
                <span className="text-[10px] font-medium">{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors Sheet */}
      {showColors && (
        <div className="absolute bottom-0 inset-x-0 z-[80] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">لون الخلفية</h3>
            <button onClick={() => setShowColors(false)}><X className="w-5 h-5 text-white/50" /></button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setBgColor(c); setShowColors(false); }}
                className={`w-12 h-12 rounded-full shrink-0 border-2 transition-all ${bgColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

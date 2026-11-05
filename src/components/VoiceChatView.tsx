import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, ShieldCheck, Users, Radio, Volume2, Plus, Sparkles } from 'lucide-react';
import { VoiceRoom } from '../types';

export const VoiceChatView: React.FC = () => {
  const { voiceRooms, activeCallRoom, setActiveCallRoom, currentUser } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const room = activeCallRoom || (voiceRooms.length > 0 ? voiceRooms[0] : null);

  if (!room && !isJoined) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <Mic className="w-16 h-16 text-slate-300 mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">لا توجد غرف صوتية نشطة</h2>
        <p className="text-sm text-slate-500">ابدأ أول غرفة صوتية مشفرة وتواصل مع أصدقائك!</p>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 mx-auto mt-4">
          <Plus className="w-4 h-4" />
          <span>إنشاء غرفة صوتية</span>
        </button>
      </div>
    );
  }

  const handleJoinRoom = async (r: VoiceRoom) => {
    try {
      // Real permission request demonstration
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");
      }
      setActiveCallRoom(r);
      setIsJoined(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("عذراً، يجب منح إذن الوصول للميكروفون للانضمام للغرفة الصوتية.");
    }
  };

  const handleLeaveRoom = () => {
    setActiveCallRoom(null);
    setIsJoined(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>الدردشات الصوتية المشفرة</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">مناقشات صوتية حية وآمنة تماماً بضمان التشفير التام E2EE</p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>إنشاء غرفة صوتية</span>
        </button>
      </div>

      {/* Active Call Room Full View if Joined */}
      {isJoined && room && (
        <div className="bg-gradient-to-tr from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" /> مشفر بالكامل E2EE
              </span>
              <span className="text-xs text-indigo-300">غرفة نشطة</span>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md"
            >
              مغادرة الغرفة
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{room.title}</h3>
            <p className="text-xs text-indigo-200">إشراف: {room.hostName}</p>
          </div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
            {room.speakers.map((sp) => (
              <div key={sp.id} className="flex flex-col items-center gap-3 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="relative">
                  <img src={sp.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                    🎙️
                  </div>
                </div>
                <span className="font-bold text-xs">{sp.name}</span>
                <span className="text-[10px] text-emerald-400">يتحدث الآن</span>
              </div>
            ))}

            {/* Listener Slot */}
            <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed text-white/50">
              <Users className="w-8 h-8" />
              <span className="text-xs">{room.listenersCount} مستمع</span>
            </div>
          </div>

          {/* Audio Wave Simulation */}
          <div className="flex items-center justify-center gap-1.5 h-10">
            {[40, 70, 90, 50, 30, 80, 100, 60, 40, 70, 50, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-indigo-400 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDuration: `${0.5 + (i % 3) * 0.3}s` }}
              ></div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-2xl font-bold flex items-center gap-2 transition-all ${isMuted ? 'bg-rose-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-xs">{isMuted ? 'الغاء كتم الميكروفون' : 'كتم الميكروفون'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voiceRooms.map((rv: VoiceRoom) => (
          <div
            key={rv.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-500 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> مشفر E2EE
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {rv.listenersCount} مستمع
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{rv.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">المضيف: {rv.hostName}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex -space-x-2 space-x-reverse">
                {rv.speakers.map((sp, idx) => (
                  <img key={idx} src={sp.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-900" />
                ))}
              </div>

              <button
                onClick={() => handleJoinRoom(rv)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
              >
                انضمام للغرفة
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

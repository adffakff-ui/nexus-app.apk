import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, Users, Gift, Send, Heart, ShieldCheck, Sparkles, X, Vote, Plus, BarChart3 } from 'lucide-react';
import { LiveStream } from '../types';

export const LiveStreamView: React.FC = () => {
  const { liveStreams, activeLiveStream, setActiveLiveStream, currentUser } = useApp();
  const [chatMessages, setChatMessages] = useState<{ id: string, user: string, text: string }[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [activePoll, setActivePoll] = useState<{
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVote: number | null;
  } | null>(null);

  // Poll Creator State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const selectedStream = activeLiveStream || liveStreams[0];
  
  if (!selectedStream) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center space-y-4">
        <Radio className="w-16 h-16 text-slate-300 mx-auto opacity-50" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">لا توجد بثوث مباشرة حالياً</h2>
        <p className="text-sm text-slate-500">كن أول من يبدأ بثاً مباشراً وتفاعل مع جمهورك!</p>
      </div>
    );
  }

  const isStreamer = selectedStream.streamerId === currentUser?.id;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([...chatMessages, { id: String(Date.now()), user: 'أنت', text: inputMsg }]);
    setInputMsg('');
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;
    setActivePoll({
      question: pollQuestion,
      options: pollOptions.map(opt => ({ text: opt, votes: 0 })),
      totalVotes: 0,
      userVote: null
    });
    setShowPollCreator(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleVote = (index: number) => {
    if (!activePoll || activePoll.userVote !== null) return;
    const newOptions = [...activePoll.options];
    newOptions[index].votes += 1;
    setActivePoll({
      ...activePoll,
      options: newOptions,
      totalVotes: activePoll.totalVotes + 1,
      userVote: index
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
            <span>غرف البث المباشر والتفاعل الفوري</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">شاهد صنّاع المحتوى المفضلين وتفاعل معهم مباشرة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Stream Player */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[520px] relative">
          
          <img src={selectedStream.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          
          {/* Top Live Badge */}
          <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                مباشر
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{selectedStream.viewersCount} مشاهد</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs">
              <span>{selectedStream.category}</span>
            </div>
          </div>

          {/* Streamer Info Center Overlay */}
          <div className="absolute top-20 left-4 z-10 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <img src={selectedStream.streamerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h4 className="font-bold text-white text-sm">{selectedStream.streamerName}</h4>
              <p className="text-[10px] text-white/70">صانع محتوى معتمد</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md ml-2">
              متابعة
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="relative z-auto mt-auto p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
            <h3 className="font-bold text-white text-sm truncate max-w-md">{selectedStream.title}</h3>
            
            <div className="flex items-center gap-3">
              {isStreamer && !activePoll && (
                <button 
                  onClick={() => setShowPollCreator(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20"
                >
                  <Vote className="w-4 h-4" />
                  <span>بدء استطلاع</span>
                </button>
              )}
              <button className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20">
                <Gift className="w-4 h-4" />
                <span>إرسال هدية</span>
              </button>
            </div>
          </div>

          {/* Active Poll Overlay */}
          {activePoll && (
            <div className="absolute right-4 top-40 z-20 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase">استطلاع مباشر</span>
                </div>
                {isStreamer && (
                  <button onClick={() => setActivePoll(null)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                )}
              </div>
              
              <h4 className="text-xs font-bold mb-3">{activePoll.question}</h4>
              
              <div className="space-y-3">
                {activePoll.options.map((opt, idx) => {
                  const percentage = activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0;
                  return (
                    <button 
                      key={idx}
                      disabled={activePoll.userVote !== null}
                      onClick={() => handleVote(idx)}
                      className={`w-full text-right relative group overflow-hidden transition-all ${activePoll.userVote === null ? 'hover:scale-[1.02]' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[10px] font-bold px-1">
                        <span>{opt.text}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 rounded-full ${activePoll.userVote === idx ? 'bg-indigo-500' : 'bg-white/40'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-3 text-[9px] text-white/50 text-center">
                إجمالي الأصوات: {activePoll.totalVotes}
              </div>
            </div>
          )}

        </div>

        {/* Live Chat Sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col h-[520px] shadow-sm">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">دردشة البث المباشر</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">مشفّر وآمن</span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-2">{msg.user}:</span>
                <span className="text-slate-800 dark:text-slate-200">{msg.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="اكتب تعليقاً في البث..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Other Live Streams Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">البثوث النشطة الأخرى</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveStreams.map((stream: LiveStream) => (
            <div 
              key={stream.id}
              onClick={() => setActiveLiveStream(stream)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-indigo-500 transition-all shadow-sm"
            >
              <div className="w-32 h-24 rounded-xl overflow-hidden relative shrink-0">
                <img src={stream.thumbnail} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  مباشر
                </span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{stream.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stream.streamerName}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{stream.viewersCount} مشاهد</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Poll Creator Modal */}
      {showPollCreator && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">إنشاء استطلاع جديد</h3>
              </div>
              <button onClick={() => setShowPollCreator(false)} className="text-slate-400 hover:text-rose-500"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">السؤال</label>
                <input 
                  type="text"
                  placeholder="ما هو رأيك في..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">الخيارات</label>
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
                      className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                        className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <button 
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs rounded-xl hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة خيار
                  </button>
                )}
              </div>
            </div>

            <button 
              onClick={handleCreatePoll}
              disabled={!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              نشر الاستطلاع الآن
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

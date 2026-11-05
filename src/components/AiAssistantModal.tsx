import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, X, Bot, Brain } from 'lucide-react';

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, runAiAssistant, aiPromptResult } = useApp();
  const [prompt, setPrompt] = useState('');
  const [useHighThinking, setUseHighThinking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    await runAiAssistant(prompt, useHighThinking);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 relative overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">مساعد الذكاء الاصطناعي الذكي</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">مدعوم بنماذج Gemini المتقدمة والتفكير العالي</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            مرحباً بك! أنا مساعدك الذكي في منصة نكسوس. اسألني عن أي شيء: كتابة مقالات، تلخيص نصوص، ابتكار أفكار لمحتواك، أو تحليل اتجاهات المتابعين.
          </div>

          {aiPromptResult && (
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-xs text-slate-900 dark:text-white leading-relaxed space-y-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1">
                <Bot className="w-4 h-4" /> رد الذكاء الاصطناعي:
              </span>
              <p className="whitespace-pre-wrap">{aiPromptResult}</p>
            </div>
          )}

        </div>

        {/* Input & Options */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={useHighThinking}
                onChange={(e) => setUseHighThinking(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                <Brain className="w-4 h-4" /> تفعيل التفكير المتقدم (غير متاح حالياً للنسخة المجانية)
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب سؤالك أو اطلب فكرة محتوى..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'جاري التفكير...' : 'إرسال'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

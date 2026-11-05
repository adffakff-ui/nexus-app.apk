import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Users, Eye, TrendingUp, DollarSign, Sparkles } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>لوحة تحكم الأنشطة والإحصائيات</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">متابعة تفصيلية لنمو حسابك، مشاهدات المنشورات، وأرباح صانع المحتوى</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">إجمالي المتابعين</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentUser?.followersCount.toLocaleString()}
          </h3>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 0% هذا الأسبوع
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">مشاهدات الملف الشخصي</span>
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">0</h3>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 0% مقارنة بالأمس
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">معدل التفاعل</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">0%</h3>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            ابدأ بنشر محتوى لزيادة التفاعل
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">أرباح المحتوى</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">$0.00</h3>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            لا توجد أرباح حالياً
          </span>
        </div>

      </div>

      {/* Engagement Graph Simulation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">نمو التفاعل والمشاهدات خلال الأسبوع</h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl">
            محدث فورياً
          </span>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
          {[0, 0, 0, 0, 0, 0, 0].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl transition-all"
                style={{ height: `5%` }}
              ></div>
              <span className="text-[10px] text-slate-400">اليوم {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

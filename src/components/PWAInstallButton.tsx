import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, Smartphone, PlusSquare, X, Info, HelpCircle, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'button' | 'banner' | 'menu' }> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  if (isInstalled) return null;

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/20 text-white p-3 px-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/30 shrink-0">
            N
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>تثبيت تطبيق نكسوس Social</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">مباشر ومجاني</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">ثبّت التطبيق مباشرة على شاشة جوالك بدون الحاجة لتنصيب ملفات ZIP أو متاجر</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={install}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت الآن</span>
            </button>
          ) : (
            <button
              onClick={() => isIOS ? setShowIOSModal(true) : setShowHelpModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
            >
              <Smartphone className="w-4 h-4" />
              <span>كيف أثبت التطبيق؟</span>
            </button>
          )}
        </div>

        {/* iOS Instructions Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-right space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowIOSModal(false)}
                className="absolute left-4 top-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="font-bold text-base text-white">تثبيت التطبيق على iPhone / iPad</h3>
                <p className="text-xs text-slate-400 mt-1">اتبع الخطوات التالية لإضافة نكسوس لشاشتك الرئيسية:</p>
              </div>

              <div className="space-y-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">1</div>
                  <p className="text-slate-200">اضغط على زر <strong className="text-indigo-400">مشاركة (Share) <Share2 className="w-3.5 h-3.5 inline text-indigo-400" /></strong> في Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">2</div>
                  <p className="text-slate-200">اختر <strong className="text-indigo-400">إضافة إلى الشاشة الرئيسية (Add to Home Screen) <PlusSquare className="w-3.5 h-3.5 inline text-indigo-400" /></strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">3</div>
                  <p className="text-slate-200">اضغط على <strong className="text-indigo-400">إضافة</strong> ليظهر كتطبيق مستقل في جوالك.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}

        {/* Android / ZIP Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-right space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="absolute left-4 top-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div className="text-center">
                <h3 className="font-bold text-base text-white">كيفية تثبيت التطبيق على الجوال مباشرة</h3>
                <p className="text-xs text-amber-400/90 font-medium mt-1">تنبيه: ملف الـ ZIP هو كود المبرمج المصدري وليس تطبيقاً تثبيتاً (APK).</p>
              </div>

              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white block mb-0.5">1. افتح رابط التطبيق في متصفح Chrome:</strong>
                    افتح هذا الرابط مباشرة من هاتف الأندرويد في متصفح Google Chrome أو Edge.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white block mb-0.5">2. اضغط على خيارات المتصفح (⋮):</strong>
                    اضغط على خيارات المتصفح الثلاث نقاط في أعلى الزاوية، ثم اختر <span className="text-indigo-400 font-bold">"إضافة إلى الشاشة الرئيسية"</span> أو <span className="text-indigo-400 font-bold">"تثبيت التطبيق"</span>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white block mb-0.5">3. تثبيت تلقائي فوري:</strong>
                    يقوم نظام أندرويد تلقائياً بتنصيب تطبيق WebAPK كامل بجميع الميزات وبدون الحاجة لفتح أي ملفات ZIP!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                حسنًا، سأثبته مباشرة من المتصفح الآن
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default Button / Menu Variant
  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else if (isIOS) {
            setShowIOSModal(true);
          } else {
            setShowHelpModal(true);
          }
        }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        title="تثبيت التطبيق على الجوال أو الكمبيوتر"
      >
        <Download className="w-4 h-4" />
        <span>تثبيت التطبيق</span>
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-right space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-base text-white">كيفية تثبيت التطبيق على الجوال مباشرة</h3>
              <p className="text-xs text-amber-400/90 font-medium mt-1">تنبيه: ملف الـ ZIP هو كود المبرمج المصدري وليس تطبيقاً تثبيتاً (APK).</p>
            </div>

            <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-200">
                  <strong className="text-white block mb-0.5">1. افتح رابط التطبيق في متصفح Chrome:</strong>
                  افتح هذا الرابط مباشرة من هاتف الأندرويد في متصفح Google Chrome أو Edge.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-200">
                  <strong className="text-white block mb-0.5">2. اضغط على خيارات المتصفح (⋮):</strong>
                  اضغط على خيارات المتصفح الثلاث نقاط في أعلى الزاوية، ثم اختر <span className="text-indigo-400 font-bold">"إضافة إلى الشاشة الرئيسية"</span> أو <span className="text-indigo-400 font-bold">"تثبيت التطبيق"</span>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-200">
                  <strong className="text-white block mb-0.5">3. تثبيت تلقائي فوري:</strong>
                  يقوم نظام أندرويد تلقائياً بتنصيب تطبيق WebAPK كامل بجميع الميزات وبدون الحاجة لفتح أي ملفات ZIP!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors"
            >
              فهمت ذلك، سأثبته مباشرة من المتصفح الآن
            </button>
          </div>
        </div>
      )}
    </>
  );
};

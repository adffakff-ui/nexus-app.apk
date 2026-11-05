import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Moon, Sun, Globe, ShieldCheck, Lock, Cloud, Bell, CheckCircle2, Mic, Camera, MapPin, Bluetooth, Clipboard, Cpu, Usb } from 'lucide-react';

import { PermissionManager } from './PermissionManager';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, language, setLanguage, currentUser } = useApp();
  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled ?? true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>الإعدادات والأمان المتقدم</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تخصيص مظهر التطبيق، إدارة اللغات، إعدادات الأمان والمصادقة الثنائية</p>
      </div>

      <div className="space-y-4">
        
        {/* Appearance Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" /> المظهر والوضع المظلي
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">الوضع المظلي (Dark Mode)</h4>
              <p className="text-[11px] text-slate-500">توفير تجربة مريحة للعين في الإضاءة الخافتة</p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? '-translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" /> لغة التطبيق
          </h3>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English (الإنجليزية)</option>
            <option value="fr">Français (الفرنسية)</option>
            <option value="es">Español (الإسبانية)</option>
          </select>
        </div>

        {/* Security & 2FA Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> الأمان والمصادقة الثنائية (2FA)
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">التحقق بخطوتين عبر تطبيق المصادقة</h4>
              <p className="text-[11px] text-slate-500">حماية فائقة لحسابك ضد أي محاولات دخول غير مصرح بها</p>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${twoFactor ? 'bg-emerald-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${twoFactor ? '-translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* Privacy Policy Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500" /> سياسة الخصوصية وقواعد المجتمع
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                في نكسوس، نلتزم بتوفير بيئة آمنة ومحترمة للجميع. يرجى اتباع القواعد التالية:
            </p>
            <ul className="text-[11px] text-slate-500 dark:text-slate-400 list-disc list-inside space-y-1">
                <li>يمنع منعاً باتاً نشر محتوى يحرض على العنف أو الكراهية.</li>
                <li>يمنع استخدام الألفاظ النابية أو الإساءة للأعضاء الآخرين.</li>
                <li>يمنع انتحال الشخصيات أو نشر بيانات مضللة.</li>
                <li>يمنع نشر المحتوى الإباحي أو غير اللائق.</li>
            </ul>
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                ⚠️ أي انتهاك لهذه السياسات سيؤدي إلى حظر الحساب فوراً وفقدان الوصول إلى كافة الميزات.
            </p>
          </div>
        </div>

        {/* Hardware & Permissions Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" /> صلاحيات الوصول والعتاد
          </h3>
          
          <PermissionManager />
        </div>

        {/* Cloud Sync & Backup */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-violet-500" /> المزامنة السحابية الفورية
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
            <span>حالة المزامنة السحابية: متصل وآمن</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> مُزامن الآن
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

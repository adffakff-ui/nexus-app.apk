import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  BellRing, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Gift, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Sliders, 
  SlidersHorizontal,
  X,
  Volume2,
  Check
} from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationsRead, 
    browserNotificationPermission, 
    requestBrowserNotifications,
    sendIncomingMessageNotification,
    sendIncomingFollowRequestNotification
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'message' | 'follow' | 'like' | 'tip'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState<string | null>(null);

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    messages: true,
    follows: true,
    likes: true,
    comments: true,
    tips: true
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const perm = await requestBrowserNotifications();
      if (perm === 'granted') {
        sendIncomingMessageNotification('نكسوس', 'تم تفعيل إشعارات المتصفح بنجاح! 🎉');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestMessageNotification = () => {
    sendIncomingMessageNotification(
      'مستخدم جديد',
      'أهلاً بك! هذا إشعار فوري لرسالة واردة عبر المتصفح 💬'
    );
    setTestNotificationSent('message');
    setTimeout(() => setTestNotificationSent(null), 3500);
  };

  const handleTestFollowNotification = () => {
    sendIncomingFollowRequestNotification(
      'سلطان الغامدي',
      '@sultan_g'
    );
    setTestNotificationSent('follow');
    setTimeout(() => setTestNotificationSent(null), 3500);
  };

  // Filter notifications based on tab & preferences
  const filteredNotifications = notifications.filter((n: NotificationItem) => {
    if (activeFilter === 'message') return n.type === 'message';
    if (activeFilter === 'follow') return n.type === 'follow';
    if (activeFilter === 'like') return n.type === 'like';
    if (activeFilter === 'tip') return n.type === 'tip';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>الإشعارات الفورية والتنبيهات</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                {unreadCount} جديد
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            متابعة كافة الأنشطة والتفاعلات والرسائل الواردة لحظة بلحظة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="تخصيص أنواع الإشعارات"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">تخصيص</span>
          </button>

          <button
            onClick={markNotificationsRead}
            className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BROWSER NOTIFICATIONS PERMISSION PROMPT & STATUS BANNER       */}
      {/* ============================================================== */}
      <div className="rounded-3xl border overflow-hidden shadow-xs transition-all">
        {browserNotificationPermission === 'granted' ? (
          /* Permission Granted State with Test Actions */
          <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-500/20 dark:border-emerald-500/30 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">إشعارات المتصفح الفورية مفعّلة (Browser Push)</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">نشط</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    ستصلك تنبيهات فورية مباشرة على جهازك عند تلقي رسالة جديدة أو طلب متابعة.
                  </p>
                </div>
              </div>

              {/* Real-time Push Notification Test Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleTestMessageNotification}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all active:scale-95"
                  title="إرسال إشعار رسالة للمتصفح الآن للتجربة"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>تجربة إشعار رسالة</span>
                </button>

                <button
                  onClick={handleTestFollowNotification}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all active:scale-95"
                  title="إرسال إشعار طلب متابعة للمتصفح الآن للتجربة"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>تجربة طلب متابعة</span>
                </button>
              </div>
            </div>

            {testNotificationSent && (
              <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>
                  تم إرسال إشعار {testNotificationSent === 'message' ? 'الرسالة' : 'طلب المتابعة'} إلى المتصفح بنجاح! تفقّد زاوية شاشتك.
                </span>
              </div>
            )}
          </div>
        ) : browserNotificationPermission === 'denied' ? (
          /* Permission Denied State */
          <div className="p-5 bg-amber-500/10 border-amber-500/30 dark:bg-slate-900 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">إشعارات المتصفح محظورة حالياً</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                تم رفض إذن إشعارات المتصفح سابقاً. لاستلام تنبيهات الرسائل وطلبات المتابعة، يرجى النقر على أيقونة القفل بجانب شريط العنوان في المتصفح وتعيين الإشعارات إلى "سماح".
              </p>
            </div>
          </div>
        ) : (
          /* Gated Permission Prompt (Default / Not Asked Yet) */
          <div className="p-5 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border-indigo-500/30 dark:bg-slate-900 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3.5 max-w-xl">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30 animate-pulse">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>تفعيل إشعارات المتصفح للرسائل وطلبات المتابعة</span>
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">مستحسن</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  احصل على تنبيهات سطح المكتب أو شاشة القفل فور استلام رسالة جديدة في المحادثات المشفرة أو عند تلقي طلب متابعة جديد حتى أثناء تصغير المتصفح.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Bell className="w-4 h-4" />
              <span>{isRequesting ? 'جاري طلب الإذن...' : 'تفعيل الإشعارات الآن'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'message', label: 'الرسائل' },
          { key: 'follow', label: 'المتابعات' },
          { key: 'like', label: 'الإعجابات' },
          { key: 'tip', label: 'الدعم المالي' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n: NotificationItem) => (
            <div 
              key={n.id} 
              className={`p-4 flex items-start gap-4 transition-colors ${
                !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {n.actorAvatar && n.actorAvatar.length > 5 ? (
                <img src={n.actorAvatar} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0 ring-1 ring-slate-100 dark:ring-slate-800" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  {n.type === 'message' ? <MessageCircle className="w-6 h-6" /> :
                   n.type === 'follow' ? <UserPlus className="w-6 h-6" /> :
                   n.type === 'tip' ? <Gift className="w-6 h-6" /> :
                   n.type === 'like' ? <Heart className="w-6 h-6" /> :
                   <Bell className="w-6 h-6" />}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{n.title}</h3>
                  {n.type === 'message' && (
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">رسالة</span>
                  )}
                  {n.type === 'follow' && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">متابعة</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">{n.timestamp}</span>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-2 shadow-sm shadow-indigo-600"></span>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">لا توجد إشعارات في هذا التصنيف</p>
            <p className="text-xs text-slate-400 mt-1">ستظهر أي تنبيهات جديدة هنا فور وصولها</p>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* NOTIFICATION PREFERENCES MODAL                                */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">تخصيص الإشعارات والتنبيهات</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر أنواع التنبيهات التي ترغب باستلامها وإظهارها في التطبيق وعبر المتصفح:
            </p>

            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { key: 'messages', label: 'الرسائل والمحادثات المشفرة', desc: 'تنبيهات عند وصول رسالة جديدة في الدردشة', icon: MessageCircle },
                { key: 'follows', label: 'طلبات المتابعة والمتابعون الجدد', desc: 'تنبيهات عند متابعة حسابك أو إرسال طلب', icon: UserPlus },
                { key: 'likes', label: 'الإعجابات والتفاعلات', desc: 'تنبيهات عند تفاعل المستخدمين مع منشوراتك', icon: Heart },
                { key: 'comments', label: 'التعليقات والردود', desc: 'تنبيهات عندما يعلق شخص على محتواك', icon: MessageCircle },
                { key: 'tips', label: 'الدعم المالي والهدايا', desc: 'تنبيهات عند استلام إكرامية أو هدية نقدية', icon: Gift }
              ].map(item => {
                const Icon = item.icon;
                const isEnabled = preferences[item.key as keyof typeof preferences];
                return (
                  <div key={item.key} className="pt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.label}</span>
                        <span className="text-[10px] text-slate-500">{item.desc}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePreference(item.key as keyof typeof preferences)}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isEnabled ? 'right-1' : 'right-6'}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              حفظ التفضيلات
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

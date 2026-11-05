import React, { useState, useEffect } from 'react';
import { Mic, Camera, MapPin, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'loading';

interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  location: PermissionStatus;
}

export const PermissionManager: React.FC = () => {
  const [status, setStatus] = useState<PermissionState>({
    camera: 'prompt',
    microphone: 'prompt',
    location: 'prompt',
  });

  const checkPermissions = async () => {
    const updated: Partial<PermissionState> = {};

    // Geolocation permission check via Permissions API if available
    try {
      if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions.query) {
        const locRes = await navigator.permissions.query({ name: 'geolocation' as any });
        if (locRes && locRes.state) {
          updated.location = locRes.state as PermissionStatus;
        }
      }
    } catch {
      // Permission query not supported or restricted in iframe
    }

    if (Object.keys(updated).length > 0) {
      setStatus(prev => ({ ...prev, ...updated }));
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const requestPermission = async (type: keyof PermissionState) => {
    try {
      if (type === 'camera') {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('getUserMedia not supported');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setStatus(prev => ({ ...prev, camera: 'granted' }));
      } else if (type === 'microphone') {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('getUserMedia not supported');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setStatus(prev => ({ ...prev, microphone: 'granted' }));
      } else if (type === 'location') {
        if (!navigator.geolocation?.getCurrentPosition) {
          throw new Error('geolocation not supported');
        }
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        setStatus(prev => ({ ...prev, location: 'granted' }));
      }
    } catch (err) {
      console.warn(`Permission request for ${type} was denied or unavailable:`, err);
      setStatus(prev => ({ ...prev, [type]: 'denied' }));
    }
  };

  const getStatusUI = (typeStatus: PermissionStatus) => {
    switch (typeStatus) {
      case 'granted':
        return (
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ممنوح</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-1.5 text-rose-500 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>مرفوض</span>
          </div>
        );
      case 'loading':
        return <div className="animate-pulse text-slate-400">جاري التحقق...</div>;
      default:
        return <div className="text-slate-400">غير محدد (بانتظار الإذن)</div>;
    }
  };

  const permissionsList = [
    { id: 'camera', label: 'الكاميرا (الصور والفيديو)', icon: <Camera className="w-5 h-5" />, color: 'bg-rose-500' },
    { id: 'microphone', label: 'الميكروفون (التسجيل والمحادثات)', icon: <Mic className="w-5 h-5" />, color: 'bg-indigo-500' },
    { id: 'location', label: 'الموقع الجغرافي (إضافة الموقع للمنشور)', icon: <MapPin className="w-5 h-5" />, color: 'bg-emerald-500' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">تحكم في أذونات الوصول الممنوحة للمتصفح لاستخدام ميزات نكسوس المتقدمة.</p>
        <button 
          onClick={checkPermissions}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
          title="تحديث الحالة"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {permissionsList.map((perm) => (
          <div 
            key={perm.id} 
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl text-white shadow-sm ${perm.color}`}>
                {perm.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{perm.label}</h4>
                <div className="text-[10px] mt-0.5">
                  {getStatusUI(status[perm.id])}
                </div>
              </div>
            </div>

            {status[perm.id] !== 'granted' && (
              <button
                onClick={() => requestPermission(perm.id)}
                className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
              >
                تفعيل الإذن
              </button>
            )}
          </div>
        ))}
      </div>

      {Object.values(status).some(s => s === 'denied') && (
        <div className="p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-3 mt-4">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-relaxed">
            يبدو أن بعض الأذونات قد تم رفضها من قبل المتصفح. لتفعيلها، يرجى النقر على أيقونة القفل في شريط عنوان المتصفح وإعادة ضبط الأذونات.
          </p>
        </div>
      )}
    </div>
  );
};

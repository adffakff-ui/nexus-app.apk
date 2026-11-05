import React, { useState } from 'react';
import { X, AlertTriangle, ShieldOff, Flag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportBlockModalProps {
  userId: string;
  userName: string;
  type: 'post' | 'message' | 'user';
  itemId?: string;
  onClose: () => void;
}

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({ userId, userName, type, itemId, onClose }) => {
  const { reportItem, blockUser } = useApp();
  const [reason, setReason] = useState('');
  const [step, setReasonStep] = useState<'select' | 'confirm_block'>('select');

  const reasons = [
    'محتوى غير لائق أو مسيء',
    'كراهية أو عنف',
    'سب أو شتم',
    'محتوى غير مرغوب فيه (Spam)',
    'انتحال شخصية',
  ];

  const handleReport = () => {
    if (!reason) {
      alert('يرجى اختيار سبب للبلاغ');
      return;
    }
    reportItem(type, itemId || userId, reason);
    onClose();
  };

  const handleBlock = () => {
    blockUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {step === 'select' ? <Flag className="w-5 h-5 text-rose-500" /> : <ShieldOff className="w-5 h-5 text-rose-500" />}
                <span>{step === 'select' ? 'إبلاغ عن محتوى' : 'تأكيد الحظر'}</span>
            </h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        {step === 'select' ? (
            <>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    ساعدنا في الحفاظ على مجتمع نكسوس آمناً. لماذا تود الإبلاغ عن هذا {type === 'post' ? 'المنشور' : type === 'message' ? 'الرسالة' : 'المستخدم'}؟
                </p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {reasons.map((r, i) => (
                        <button
                            key={i}
                            onClick={() => setReason(r)}
                            className={`w-full text-right p-3 rounded-xl text-xs font-medium border transition-all ${reason === r ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                    <button 
                        onClick={handleReport}
                        className="w-full py-3 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20"
                    >
                        إرسال البلاغ
                    </button>
                    <button 
                        onClick={() => setReasonStep('confirm_block')}
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        حظر {userName}
                    </button>
                </div>
            </>
        ) : (
            <>
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-2xl text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                    <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm">هل أنت متأكد من حظر {userName}؟</h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-300 leading-relaxed">
                        عند حظر هذا المستخدم، لن تتمكن من رؤية منشوراته أو قصصه، ولن يتمكن من إرسال رسائل إليك. يمكن إلغاء الحظر لاحقاً من الإعدادات.
                    </p>
                </div>

                <div className="pt-2 flex gap-3">
                    <button 
                        onClick={() => setReasonStep('select')}
                        className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold"
                    >
                        رجوع
                    </button>
                    <button 
                        onClick={handleBlock}
                        className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20"
                    >
                        تأكيد الحظر
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

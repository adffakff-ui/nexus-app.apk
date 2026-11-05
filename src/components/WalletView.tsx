import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, CreditCard, ShieldCheck, ArrowDownRight, ArrowUpRight, Plus, Gift, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';

export const WalletView: React.FC = () => {
  const { currentUser, transactions, depositFunds } = useApp();
  const [depositAmount, setDepositAmount] = useState(50);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleDepositSubmit = () => {
    depositFunds(depositAmount);
    setIsDepositOpen(false);
    alert(`تم شحن المحفظة بنجاح بقيمة $${depositAmount}! 💳`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-500" />
            <span>المحفظة الرقمية ودعم صنّاع المحتوى</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">إدارة أرباحك، شحن الرصيد بأمان، ودعم صانعيك المفضلين</p>
        </div>

        <button
          onClick={() => setIsDepositOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>شحن المحفظة</span>
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-tr from-indigo-900 via-violet-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs text-indigo-200 font-medium">الرصيد الحالي المتاح</span>
            <h2 className="text-4xl font-extrabold mt-1 tracking-tight">${currentUser?.walletBalance.toFixed(2)}</h2>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-white/10 relative z-10 text-xs">
          <div>
            <span className="text-indigo-200 block">إجمالي الأرباح</span>
            <span className="text-lg font-bold mt-0.5 block">$0.00</span>
          </div>
          <div>
            <span className="text-indigo-200 block">الدعم المرسل</span>
            <span className="text-lg font-bold mt-0.5 block">$0.00</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-indigo-200 block">طريقة الدفع الأساسية</span>
            <span className="text-lg font-bold mt-0.5 block">لا توجد وسيلة دفع</span>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white text-center">شحن رصيد المحفظة الآمن</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">اختر المبلغ المراد إضافته عبر بوابة الدفع المشفرة.</p>

            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDepositAmount(amt)}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${depositAmount === amt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsDepositOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleDepositSubmit}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                إتمام الشحن (${depositAmount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">سجل المعاملات المالية</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((tx: Transaction) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'earning' || tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  {tx.type === 'earning' || tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{tx.title}</h4>
                  <span className="text-[10px] text-slate-400">{tx.date}</span>
                </div>
              </div>

              <div className="text-left">
                <span className={`font-bold text-sm ${tx.type === 'earning' || tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {tx.type === 'earning' || tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full block mt-0.5">
                  مكتمل
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  X,
  AlertCircle,
  AtSign
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthenticated, login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(0); // 0: Name/Login, 1: Username, 2: Email/Pass
  
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [error, setError] = useState('');

  if (isAuthenticated) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 0) {
      if (!name.trim()) {
        setError('يرجى إدخال اسمك بالكامل للمتابعة');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!username.trim()) {
        setError('اختر اسم مستخدم للمتابعة.');
        return;
      }
      if (username.trim().replace('@', '').length < 2) {
        setError('يجب أن يكون اسم المستخدم حرفين على الأقل');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!email.trim() || !password) {
        setError('يرجى تعبئة البريد الإلكتروني وكلمة المرور');
        return;
      }
      register(name, email, password, username);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginIdentifier.trim()) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    const success = login(loginIdentifier, password);
    if (!success) {
      setError('تعذر تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.');
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setStep(0);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 min-h-[500px] flex flex-col">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          {isRegister && step > 0 ? (
            <button 
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {isRegister ? `الخطوة ${step + 1} من 3` : 'نكسوس Social'}
          </span>
        </div>

        {/* Content based on Step */}
        <div className="flex-1 flex flex-col">
          {!isRegister ? (
            /* LOGIN FLOW */
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20 mb-5">
                  N
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
                <p className="text-sm text-neutral-400">مرحباً بك مجدداً في نكسوس</p>
              </div>

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div className="space-y-3.5">
                  <div className="relative">
                    <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      placeholder="اسم المستخدم أو البريد الإلكتروني"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full bg-neutral-800 text-white pr-11 pl-4 py-4 rounded-2xl text-sm border border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-800 text-white pr-11 pl-4 py-4 rounded-2xl text-sm border border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-full font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                >
                  <span>تسجيل الدخول</span>
                </button>
              </form>
            </>
          ) : (
            /* REGISTER FLOW - MULTI STEP */
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">ما هو اسمك؟</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      أضف اسمك حتى يتمكن أصدقاؤك من العثور عليك.
                    </p>
                  </div>

                  <form onSubmit={handleNext} noValidate className="space-y-4">
                    <div className="relative">
                      <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="الاسم الكامل"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-800 text-white pr-11 pl-4 py-4 rounded-2xl text-sm border border-transparent focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    {error && (
                      <p className="text-rose-500 text-xs font-bold text-center">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-full font-bold text-sm shadow-lg transition-all"
                    >
                      التالي
                    </button>
                  </form>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">إنشاء اسم مستخدم</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed px-4">
                      لبدء إنشاء ملف شخصي، أضف اسم مستخدم من اختيارك.
                    </p>
                  </div>

                  <form onSubmit={handleNext} noValidate className="space-y-3">
                    <div className={`relative rounded-2xl border ${error ? 'border-rose-500/50 bg-rose-500/10' : 'border-neutral-800 bg-neutral-800'} transition-all`}>
                      {error && (
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-rose-500 rounded-full p-1 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-white" />
                         </div>
                      )}
                      <input
                        type="text"
                        autoFocus
                        placeholder="اسم المستخدم"
                        dir="ltr"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent text-white text-left px-5 py-4 text-base font-medium outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-xs pointer-events-none">
                        اسم المستخدم
                      </span>
                    </div>
                    
                    {error && (
                      <p className="text-rose-500 text-xs font-medium px-1 pr-2 mt-1">
                        {error}
                      </p>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-full font-bold text-sm transition-all active:scale-[0.98]"
                      >
                        التالي
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">البريد وكلمة المرور</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      أدخل بريدك الإلكتروني وكلمة المرور لربط حسابك وتفعيله بأمان.
                    </p>
                  </div>

                  <form onSubmit={handleNext} noValidate className="space-y-4">
                    <div className="space-y-3.5">
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="البريد الإلكتروني"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-neutral-800 text-white pr-11 pl-4 py-4 rounded-2xl text-sm border border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-500"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="password"
                          placeholder="كلمة المرور"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-neutral-800 text-white pr-11 pl-4 py-4 rounded-2xl text-sm border border-transparent focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-500"
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="text-rose-500 text-xs font-bold text-center px-2">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-full font-bold text-sm shadow-lg transition-all"
                    >
                      إنشاء حسابي الآمن
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 text-center">
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-4 text-neutral-500 text-[10px] uppercase font-bold tracking-widest">أو</span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          <button
            type="button"
            onClick={toggleMode}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors py-2"
          >
            {!isRegister ? 'إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>بياناتك محمية بتشفير نكسوس الآمن</span>
          </div>
        </div>

      </div>
    </div>
  );
};


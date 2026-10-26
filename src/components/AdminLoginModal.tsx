import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1971 or 1234
    if (pin === '1971' || pin === '1234' || pin === 'admin') {
      onSuccess();
    } else {
      setError('ভুল এডমিন পিন! অনুগ্রহ করে সঠিক পিন দিন (টেস্টিং পিন: 1971)');
    }
  };

  const handleQuickDemo = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">এডমিন প্যানেল প্রবেশ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          সদস্যদের তথ্য পরিবর্তন, আবেদন অনুমোদন ও ডেটা এক্সপোর্ট করতে এডমিন সিকিউরিটি পিন দিন।
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              এডমিন সিকিউরিটি পিন
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="পিন লিখুন (যেমন: 1971)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 tracking-widest font-mono text-center"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              এডমিন প্যানেলে প্রবেশ করুন
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
            >
              দ্রুত ডেমো এক্সেস (Default PIN: 1971)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/mockData';
import { Phone, Shield, HeartPulse, GraduationCap, Users } from 'lucide-react';

export const EmergencyHelp: React.FC = () => {
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const categories = [
    { key: 'সমিতি প্রতিনিধি', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { key: 'অ্যাম্বুলেন্স / স্বাস্থ্য', icon: HeartPulse, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { key: 'ছাত্র কল্যাণ', icon: GraduationCap, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { key: 'রক্তদান সমন্বয়কারী', icon: Shield, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">জরুরি সহায়তা ও হেল্পলাইন ডেসপ্যাচ</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          ঢাকায় বসবাসরত ঝিনাইদহের যেকোনো মানুষের চিকিৎসা, রক্তদান, দুর্ঘটনা, আইনগত জটিলতা বা যেকোনো জরুরি প্রয়োজনে আমাদের দায়িত্বপ্রাপ্ত প্রতিনিধিদের সাথে সরাসরি যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EMERGENCY_CONTACTS.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 hover:border-emerald-300 transition-all"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-500">{item.category}</span>
              <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
              <p className="text-xs text-slate-600">{item.designation}</p>
              <p className="text-xs text-emerald-700 font-medium">{item.areaOrType}</p>
            </div>

            <button
              onClick={() => handleCall(item.phone)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>কল দিন</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

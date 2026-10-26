import React, { useRef } from 'react';
import { Member } from '../types';
import { Printer, Download, CheckCircle2, ShieldCheck, Heart, MapPin, Phone, Building } from 'lucide-react';

interface Props {
  member: Member;
  onClose?: () => void;
}

export const DigitalIdCard: React.FC<Props> = ({ member, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 no-print">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-800 text-sm">ডিজিটাল মেম্বারশিপ কার্ড</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="কার্ড প্রিন্ট বা সেভ করুন"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* ID Card Front */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border-2 border-emerald-700 bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white p-5 shadow-lg"
      >
        {/* Subtle decorative background curves */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-white/10 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/assets/jhenaidah-pigeon-logo.png"
                alt="লোগো"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-emerald-100 leading-tight">
                ঢাকাস্থ ঝিনাইদহ জেলার মানুষ
              </h4>
              <p className="text-[10px] text-emerald-300/80 font-medium tracking-wide">
                DHAKA-JHENAIDAH COMMUNITY FORUM
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
              {member.memberCode}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Avatar / Photo Slot */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-20 h-24 rounded-xl bg-emerald-950/80 border-2 border-emerald-400/40 p-1 flex items-center justify-center overflow-hidden shadow-inner">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.fullName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-emerald-800/60 flex flex-col items-center justify-center text-center p-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-lg text-emerald-100">
                    {member.fullName.charAt(0)}
                  </div>
                  <span className="text-[9px] text-emerald-300 mt-1">সদস্য</span>
                </div>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{member.status === 'verified' ? 'Verified Person' : 'Pending'}</span>
            </div>
          </div>

          {/* Member Details */}
          <div className="col-span-8 space-y-1.5 text-xs">
            <div>
              <p className="text-[10px] text-emerald-300/70">নাম / Name</p>
              <h5 className="font-bold text-sm text-white leading-tight">{member.fullName}</h5>
              {member.isExecutiveMember && member.executiveDesignation && (
                <span className="text-[10px] text-amber-300 font-medium">
                  ★ {member.executiveDesignation}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-800/40">
              <div>
                <p className="text-[10px] text-emerald-300/70">নিজ উপজেলা</p>
                <p className="font-semibold text-emerald-100 truncate">{member.upazila}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-300/70">রক্তের গ্রুপ</p>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span className="font-bold text-rose-300">{member.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="pt-1 border-t border-emerald-800/40">
              <p className="text-[10px] text-emerald-300/70">ঢাকার ঠিকানা ও পেশা</p>
              <p className="font-medium text-slate-200 truncate">{member.dhakaArea} · {member.occupationCategory}</p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-300/70">
          <div>
            যোগদান: <span className="text-slate-200">{member.joinedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-emerald-400/90 font-mono">ঝিনাইদহ ⇄ ঢাকা</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-3 no-print">
        এই ডিজিটাল কার্ডটি ঢাকাস্থ ঝিনাইদহ জেলা ফোরামের অফিশিয়াল অনলাইন মেম্বার আইডি।
      </p>
    </div>
  );
};

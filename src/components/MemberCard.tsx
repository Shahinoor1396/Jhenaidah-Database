import React from 'react';
import { Member } from '../types';
import { Phone, MessageCircle, Heart, CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface Props {
  member: Member;
  onSelect: (member: Member) => void;
  onViewIdCard: (member: Member) => void;
}

export const MemberCard: React.FC<Props> = ({ member, onSelect, onViewIdCard }) => {
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${member.phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = member.phone.replace(/[^0-9]/g, '');
    const intlNumber = cleanNumber.startsWith('0') ? '88' + cleanNumber : cleanNumber;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${member.fullName} ভাই/আপু, আমি "ঢাকাস্থ ঝিনাইদহ জেলার মানুষ" গ্রুপ থেকে যোগাযোগ করছি।`
    );
    window.open(`https://wa.me/${intlNumber}?text=${msg}`, '_blank');
  };

  const handleFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!member.facebookProfile) {
      onSelect(member);
      return;
    }
    let url = member.facebookProfile.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('facebook.com/') || url.startsWith('www.facebook.com/')) {
        url = 'https://' + url;
      } else {
        url = `https://facebook.com/${url.replace('@', '')}`;
      }
    }
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(member)}
      className="bg-white/92 backdrop-blur-sm rounded-2xl border border-slate-200/85 p-4 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-0.5"
    >
      <div>
        {/* Top Header: Avatar, Name and Blood Group */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {/* Profile Picture Slot */}
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-base shrink-0 overflow-hidden shadow-2xs group-hover:border-emerald-300 transition-colors">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-800 font-bold text-lg">
                  {member.fullName.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-emerald-800 transition-colors truncate">
                  {member.fullName}
                </h3>
                {member.status === 'verified' && (
                  <span title="Verified Person" className="inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </span>
                )}
              </div>

              {member.isExecutiveMember && member.executiveDesignation && (
                <div className="flex items-center gap-1 text-xs text-amber-700 font-medium mt-0.5">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{member.executiveDesignation}</span>
                </div>
              )}

              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {member.memberCode}
              </p>
            </div>
          </div>

          {/* Blood Group Display - unboxed clean text */}
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1 text-rose-600 font-bold text-sm">
              <Heart className="w-3.5 h-3.5 fill-rose-600" />
              <span>{member.bloodGroup}</span>
            </div>
            {member.isBloodDonor && (
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded block mt-0.5">
                রক্তদাতা
              </span>
            )}
          </div>
        </div>

        {/* Unboxed Metadata with · separator */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="font-semibold text-slate-800">{member.upazila}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>গ্রাম: {member.unionOrVillage}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="text-emerald-800 font-medium">ঢাকা: {member.dhakaArea}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="truncate max-w-[200px]">{member.occupationCategory}</span>
        </div>

        {member.professionDetails && (
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-1 italic">
            {member.professionDetails}
          </p>
        )}
      </div>

      {/* Action Footer: Call, WhatsApp, Facebook, ID Card */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleCall}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="সরাসরি কল দিন"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>কল</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="হোয়াটসঅ্যাপে বার্তা পাঠান"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপ</span>
          </button>

          {/* Facebook Link Option */}
          <button
            onClick={handleFacebook}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
              member.facebookProfile
                ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'
                : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
            title={member.facebookProfile ? 'ফেসবুক প্রোফাইল দেখুন' : 'ফেসবুক লিংক যুক্ত করুন'}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
              f
            </span>
            <span>ফেসবুক</span>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewIdCard(member);
          }}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="ডিজিটাল আইডি কার্ড"
        >
          আইডি
        </button>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Member } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import {
  X,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  AlertCircle,
  CreditCard,
  User,
  ShieldCheck,
  Building2,
  Camera,
  ExternalLink,
  Edit2,
  Save,
} from 'lucide-react';

interface Props {
  member: Member;
  onClose: () => void;
  onUpdateMember?: (updated: Member) => void;
  initialShowIdCard?: boolean;
  currentUser?: Member | null;
  isAdminLoggedIn?: boolean;
}

export const MemberDetailsModal: React.FC<Props> = ({
  member,
  onClose,
  onUpdateMember,
  initialShowIdCard = false,
  currentUser,
  isAdminLoggedIn = false,
}) => {
  const [showIdCard, setShowIdCard] = useState(initialShowIdCard);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [editingFb, setEditingFb] = useState(false);
  const [fbInput, setFbInput] = useState(member.facebookProfile || '');
  const [currentAvatar, setCurrentAvatar] = useState(member.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user is the owner of this profile or an admin
  const isOwner = Boolean(
    currentUser &&
      (currentUser.id === member.id ||
        (currentUser.phone && member.phone && currentUser.phone === member.phone) ||
        (currentUser.email && member.email && currentUser.email.toLowerCase() === member.email.toLowerCase()))
  );
  const canEditPhoto = isOwner || Boolean(isAdminLoggedIn);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(member.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCall = () => {
    window.location.href = `tel:${member.phone}`;
  };

  const handleWhatsApp = () => {
    const cleanNumber = member.phone.replace(/[^0-9]/g, '');
    const intlNumber = cleanNumber.startsWith('0') ? '88' + cleanNumber : cleanNumber;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম ${member.fullName} ভাই/আপু, আমি "ঢাকাস্থ ঝিনাইদহ জেলার মানুষ" গ্রুপ থেকে যোগাযোগ করছি।`
    );
    window.open(`https://wa.me/${intlNumber}?text=${msg}`, '_blank');
  };

  const handleOpenFacebook = () => {
    if (!member.facebookProfile) {
      setEditingFb(true);
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

  const handleSaveFacebook = () => {
    const updated = { ...member, facebookProfile: fbInput.trim() };
    onUpdateMember?.(updated);
    setEditingFb(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট পর্যন্ত হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCurrentAvatar(result);
        const updated = { ...member, avatarUrl: result };
        onUpdateMember?.(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIdCard(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                !showIdCard ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              বিস্তারিত তথ্য
            </button>
            <button
              onClick={() => setShowIdCard(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                showIdCard ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>ডিজিটাল কার্ড</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {showIdCard ? (
            <DigitalIdCard member={{ ...member, avatarUrl: currentAvatar }} onClose={onClose} />
          ) : (
            <div className="space-y-6">
              {/* Profile Header Summary */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center text-3xl font-bold overflow-hidden shadow-sm">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt={member.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      member.fullName.charAt(0)
                    )}
                  </div>

                  {/* Upload photo button: ONLY visible to profile owner or admin */}
                  {canEditPhoto && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition-all cursor-pointer ring-2 ring-white"
                        title={isOwner ? "আপনার প্রোফাইল ছবি পরিবর্তন করুন" : "এডমিন হিসেবে ছবি পরিবর্তন করুন"}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                      {member.fullName}
                    </h2>
                    {member.status === 'verified' ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Person
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        অপেক্ষমাণ আবেদন
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{member.memberCode}</p>
                  {member.isExecutiveMember && member.executiveDesignation && (
                    <p className="text-xs text-amber-800 font-bold mt-1">
                      ★ {member.executiveDesignation}
                    </p>
                  )}
                  {canEditPhoto && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      {isOwner
                        ? 'আপনার প্রোফাইল ছবি পরিবর্তন করতে ক্যামেরায় ক্লিক করুন'
                        : 'অ্যাডমিন অনুমতি: ছবি পরিবর্তন করতে ক্যামেরায় ক্লিক করুন'}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Call, WhatsApp, Facebook, Copy */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>কল দিন</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>হোয়াটসঅ্যাপ</span>
                </button>

                <button
                  onClick={handleOpenFacebook}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  title="ফেসবুক প্রোফাইল দেখুন বা যোগ করুন"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    f
                  </span>
                  <span>{member.facebookProfile ? 'ফেসবুক' : '+ ফেসবুক'}</span>
                </button>

                <button
                  onClick={handleCopyPhone}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>নম্বর কপি</span>
                    </>
                  )}
                </button>
              </div>

              {/* Facebook Profile Edit Option */}
              {editingFb ? (
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-semibold text-blue-900">
                    ফেসবুক প্রোফাইল লিংক / ইউজারনেম সংরক্ষণ করুন:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="যেমন: facebook.com/username অথবা @username"
                      value={fbInput}
                      onChange={(e) => setFbInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-600"
                    />
                    <button
                      onClick={handleSaveFacebook}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>সংরক্ষণ</span>
                    </button>
                    <button
                      onClick={() => setEditingFb(false)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                </div>
              ) : member.facebookProfile ? (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-900">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      f
                    </span>
                    <span className="font-medium truncate max-w-xs">{member.facebookProfile}</span>
                  </div>
                  <button
                    onClick={() => setEditingFb(true)}
                    className="text-blue-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>পরিবর্তন</span>
                  </button>
                </div>
              ) : null}

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Contact & Blood */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>রক্ত ও স্বাস্থ্য তথ্য</span>
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong className="text-slate-800">রক্তের গ্রুপ:</strong>{' '}
                      <span className="font-bold text-rose-600 text-sm ml-1">{member.bloodGroup}</span>
                    </p>
                    <p>
                      <strong className="text-slate-800">রক্তদানে ইচ্ছুক:</strong>{' '}
                      {member.isBloodDonor ? 'হ্যাঁ (প্রয়োজনে রক্ত দেন)' : 'না'}
                    </p>
                    {member.lastDonationDate && (
                      <p>
                        <strong className="text-slate-800">সর্বশেষ রক্তদান:</strong> {member.lastDonationDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Upazila Address */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ঝিনাইদহের স্থায়ী ঠিকানা</span>
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong className="text-slate-800">উপজেলা:</strong> {member.upazila}
                    </p>
                    <p>
                      <strong className="text-slate-800">গ্রাম / ইউনিয়ন:</strong> {member.unionOrVillage}
                    </p>
                    {member.fatherName && (
                      <p>
                        <strong className="text-slate-800">পিতার নাম:</strong> {member.fatherName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dhaka Address */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>ঢাকার বর্তমান ঠিকানা</span>
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong className="text-slate-800">এলাকা:</strong> {member.dhakaArea}
                    </p>
                    <p>
                      <strong className="text-slate-800">পূর্ণ ঠিকানা:</strong> {member.dhakaAddress}
                    </p>
                  </div>
                </div>

                {/* Profession & Education */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>পেশা ও শিক্ষা</span>
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <p>
                      <strong className="text-slate-800">পেশা বিভাগ:</strong> {member.occupationCategory}
                    </p>
                    {member.professionDetails && (
                      <p>
                        <strong className="text-slate-800">পদবী ও প্রতিষ্ঠান:</strong> {member.professionDetails}
                      </p>
                    )}
                    {member.educationalInstitute && (
                      <p>
                        <strong className="text-slate-800">শিক্ষা প্রতিষ্ঠান:</strong> {member.educationalInstitute}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {member.emergencyContact && (
                <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>জরুরি প্রয়োজনে যোগাযোগের তথ্য</span>
                  </h4>
                  <p className="text-amber-800">{member.emergencyContact}</p>
                </div>
              )}

              {/* Metadata footer */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>যোগদানের তারিখ: {member.joinedDate}</span>
                <span>ঢাকাস্থ ঝিনাইদহ জেলার মানুষ</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

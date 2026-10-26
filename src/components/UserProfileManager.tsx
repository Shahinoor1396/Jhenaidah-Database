import React, { useState, useRef } from 'react';
import { Member, JhenaidahUpazila, BloodGroup, ProfessionCategory } from '../types';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';
import { DigitalIdCard } from './DigitalIdCard';
import {
  User,
  Camera,
  Heart,
  MapPin,
  Building,
  Briefcase,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  LogOut,
  UploadCloud,
  ShieldCheck,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: Member;
  onUpdateUser: (updatedUser: Member) => void;
  onLogout: () => void;
  onViewDirectory: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PROFESSIONS: ProfessionCategory[] = [
  'চাকরিজীবী',
  'ব্যবসায়ী',
  'শিক্ষার্থী',
  'চিকিৎসক',
  'প্রকৌশলী',
  'আইনজীবী',
  'শিক্ষক',
  'ব্যাংকার',
  'ফ্রিল্যান্সার / আইটি',
  'অন্যান্য',
];

export const UserProfileManager: React.FC<Props> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onViewDirectory,
}) => {
  const [formData, setFormData] = useState<Member>({ ...currentUser });
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ছবির আকার সর্বোচ্চ ২ মেগাবাইট পর্যন্ত হতে পারে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Welcome & Identity Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar with Camera Overlay */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-emerald-400/80 p-1 flex items-center justify-center overflow-hidden shadow-xl">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-3xl text-emerald-100">
                    {formData.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
                title="নতুন প্রোফাইল ছবি আপলোড করুন"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {formData.fullName}
                </h2>
                {formData.status === 'verified' ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    সক্রিয় সদস্য
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700/60">
                    যাচাই অপেক্ষমাণ
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-emerald-300">
                সদস্য আইডি: {formData.memberCode}
              </p>

              <p className="text-xs text-slate-300">
                ঝিনাইদহ ({formData.upazila}) ⇄ ঢাকা ({formData.dhakaArea})
              </p>

              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-[11px] text-emerald-200/80">
                <span>রক্তের গ্রুপ: <strong className="text-rose-400 font-bold">{formData.bloodGroup}</strong></span>
                <span>·</span>
                <span>{formData.occupationCategory}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
            <button
              onClick={() => setShowIdCardModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>আইডি কার্ড প্রিন্ট</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl transition-colors cursor-pointer border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              আপনার প্রোফাইলের সকল তথ্য ও ছবি সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!
            </span>
          </div>
          <button
            onClick={onViewDirectory}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            ডিরেক্টরিতে দেখুন →
          </button>
        </div>
      )}

      {/* Profile Editing Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              প্রোফাইল তথ্য সম্পাদনা ও আপলোড
            </h3>
            <p className="text-xs text-slate-500">
              আপনার ব্যক্তিগত, পেশাগত ও আবাসিক তথ্য নিয়মিত আপডেট রাখুন
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>

        {/* Section 1: Personal Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800 border-b border-slate-100 pb-1.5">
            <User className="w-4 h-4 text-emerald-700" />
            <span>১. ব্যক্তিগত ও যোগাযোগ তথ্য</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">পিতার নাম</label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">জিমেইল / ইমেইল</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Blood & Health */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-rose-700 border-b border-slate-100 pb-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>২. রক্ত ও স্বাস্থ্য তথ্য</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-center">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">রক্তের গ্রুপ *</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">সর্বশেষ রক্তদানের তারিখ</label>
              <input
                type="date"
                value={formData.lastDonationDate || ''}
                onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBloodDonor}
                  onChange={(e) => setFormData({ ...formData, isBloodDonor: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="font-semibold text-slate-800">
                  জরুরি প্রয়োজনে ঢাকা শহরে রক্তদানে আগ্রহী
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Jhenaidah Native Address */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-emerald-800 border-b border-slate-100 pb-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>৩. ঝিনাইদহ জেলার স্থায়ী ঠিকানা</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">মূল উপজেলা *</label>
              <select
                value={formData.upazila}
                onChange={(e) => setFormData({ ...formData, upazila: e.target.value as JhenaidahUpazila })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                {UPAZILAS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">গ্রাম / ইউনিয়ন / ওয়ার্ড *</label>
              <input
                type="text"
                required
                value={formData.unionOrVillage}
                onChange={(e) => setFormData({ ...formData, unionOrVillage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Dhaka Living Address */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-blue-800 border-b border-slate-100 pb-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            <span>৪. ঢাকার বর্তমান ঠিকানা</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">ঢাকার এলাকা / থানা *</label>
              <select
                value={formData.dhakaArea}
                onChange={(e) => setFormData({ ...formData, dhakaArea: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                {DHAKA_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">ঢাকার বিস্তারিত বাসস্থান ঠিকানা *</label>
              <input
                type="text"
                required
                placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট, এলাকা, ঢাকা"
                value={formData.dhakaAddress}
                onChange={(e) => setFormData({ ...formData, dhakaAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Profession & Education */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-amber-800 border-b border-slate-100 pb-1.5">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>৫. পেশাগত ও শিক্ষাগত তথ্য</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">পেশা বিভাগ *</label>
              <select
                value={formData.occupationCategory}
                onChange={(e) => setFormData({ ...formData, occupationCategory: e.target.value as ProfessionCategory })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              >
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">পদবী ও কর্মক্ষেত্র</label>
              <input
                type="text"
                placeholder="যেমন: সিনিয়র অফিসার, সোনালী ব্যাংক"
                value={formData.professionDetails}
                onChange={(e) => setFormData({ ...formData, professionDetails: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">শিক্ষা প্রতিষ্ঠান / বিভাগ</label>
              <input
                type="text"
                placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                value={formData.educationalInstitute || ''}
                onChange={(e) => setFormData({ ...formData, educationalInstitute: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Social & Emergency */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-blue-900 border-b border-slate-100 pb-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              f
            </span>
            <span>৬. ফেসবুক প্রোফাইল ও জরুরি যোগাযোগ</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">ফেসবুক প্রোফাইল লিংক বা আইডি</label>
              <input
                type="text"
                placeholder="যেমন: facebook.com/your.username"
                value={formData.facebookProfile || ''}
                onChange={(e) => setFormData({ ...formData, facebookProfile: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">জরুরি প্রয়োজনে যোগাযোগের নাম ও ফোন</label>
              <input
                type="text"
                placeholder="যেমন: মোজাম্মেল হক (ভাই) - 017XXXXXXXX"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Form Footer Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            পরিবর্তনগুলো সাথে সাথে অনলাইন ডিরেক্টরি ও আইডি কার্ডে কার্যকর হবে।
          </p>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>তথ্য সংরক্ষণ ও আপডেট করুন</span>
          </button>
        </div>
      </form>

      {/* Digital ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <DigitalIdCard member={formData} onClose={() => setShowIdCardModal(false)} />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

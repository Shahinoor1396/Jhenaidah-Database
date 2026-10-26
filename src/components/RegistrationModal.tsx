import React, { useState, useRef } from 'react';
import { Member, JhenaidahUpazila, BloodGroup, ProfessionCategory } from '../types';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';
import {
  X,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Heart,
  MapPin,
  Building,
  Camera,
  Trash2,
  UploadCloud,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onSubmit: (memberData: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>) => void;
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

export const RegistrationModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    phone: '',
    alternativePhone: '',
    email: '',
    bloodGroup: 'B+' as BloodGroup,
    isBloodDonor: true,
    lastDonationDate: '',
    upazila: 'ঝিনাইদহ সদর' as JhenaidahUpazila,
    unionOrVillage: '',
    dhakaArea: 'মিরপুর',
    dhakaAddress: '',
    occupationCategory: 'চাকরিজীবী' as ProfessionCategory,
    professionDetails: '',
    educationalInstitute: '',
    emergencyContact: '',
    facebookProfile: '',
    avatarUrl: '',
  });

  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('ছবির আকার সর্বোচ্চ ২ মেগাবাইট পর্যন্ত হতে পারে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewAvatar(result);
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewAvatar('');
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01711223344)');
      return;
    }
    if (!formData.unionOrVillage.trim()) {
      setError('ঝিনাইদহের গ্রাম বা ইউনিয়নের নাম লিখুন');
      return;
    }
    if (!formData.dhakaAddress.trim()) {
      setError('ঢাকার বর্তমান পূর্ণ ঠিকানা লিখুন');
      return;
    }

    setError(null);
    onSubmit({
      ...formData,
      status: 'pending', // Submits for admin approval
      isExecutiveMember: false,
    });
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-600/70 shadow-xs shrink-0 bg-emerald-50">
              <img
                src="/assets/jhenaidah-pigeon-logo.png"
                alt="লোগো"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                নতুন সদস্য নিবন্ধন ফরম
              </h2>
              <p className="text-[11px] text-slate-500">
                ঢাকাস্থ ঝিনাইদহ জেলার মানুষ কমিউনিটি ডিরেক্টরি
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                আপনার আবেদন সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                এডমিন প্যানেলে আপনার তথ্য ও ছবি যাচাইয়ের পর আপনার সদস্যপদ চূড়ান্ত অনুমোদন করা হবে এবং ডিজিটাল মেম্বার কার্ড সক্রিয় হবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 0. Profile Photo Upload Section */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  প্রোফাইল ছবি আপলোড (ডিজিটাল আইডি কার্ডের জন্য)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-7 h-7 text-emerald-600/70" />
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>ছবি সিলেক্ট করুন</span>
                      </button>

                      {previewAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছুন</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      মোবাইল বা কম্পিউটার থেকে স্পষ্ট পাসপোর্ট সাইজ ছবি দিন (সর্বোচ্চ ২ MB)।
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Personal & Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ব্যক্তিগত ও যোগাযোগ তথ্য</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      পূর্ণ নাম (বাংলায়) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মো: কামরুল হাসান"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      পিতার নাম
                    </label>
                    <input
                      type="text"
                      placeholder="পিতার নাম লিখুন"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      ফেসবুক প্রোফাইল লিংক / ইউজারনেম
                    </label>
                    <input
                      type="text"
                      placeholder="facebook.com/username বা ইউজার আইডি"
                      value={formData.facebookProfile}
                      onChange={(e) => setFormData({ ...formData, facebookProfile: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Blood & Health */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>রক্তের গ্রুপ ও রক্তদান</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      রক্তের গ্রুপ <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isBloodDonor}
                        onChange={(e) => setFormData({ ...formData, isBloodDonor: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        জরুরি প্রয়োজনে ঢাকা শহরে রক্তদানে আগ্রহী
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Jhenaidah Native Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ঝিনাইদহ জেলার স্থায়ী ঠিকানা</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      মূল উপজেলা <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.upazila}
                      onChange={(e) => setFormData({ ...formData, upazila: e.target.value as JhenaidahUpazila })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {UPAZILAS.map((up) => (
                        <option key={up} value={up}>
                          {up}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      গ্রাম / ইউনিয়ন / ওয়ার্ড <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: পাগলাকানাই, চুয়াডাঙ্গা বাসস্ট্যান্ড"
                      value={formData.unionOrVillage}
                      onChange={(e) => setFormData({ ...formData, unionOrVillage: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Dhaka Address & Occupation */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>ঢাকার বর্তমান ঠিকানা ও পেশা</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      ঢাকার এলাকা / থানা <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.dhakaArea}
                      onChange={(e) => setFormData({ ...formData, dhakaArea: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {DHAKA_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      পেশা বিভাগ <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.occupationCategory}
                      onChange={(e) => setFormData({ ...formData, occupationCategory: e.target.value as ProfessionCategory })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    >
                      {PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      ঢাকার পূর্ণ বাসস্থান ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="বাড়ি নম্বর, রোড নম্বর, এলাকা, ঢাকা"
                      value={formData.dhakaAddress}
                      onChange={(e) => setFormData({ ...formData, dhakaAddress: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      পদবী ও কর্মক্ষেত্র / প্রতিষ্ঠানের নাম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: সিনিয়র অফিসার, সোনালী ব্যাংক"
                      value={formData.professionDetails}
                      onChange={(e) => setFormData({ ...formData, professionDetails: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      জরুরি প্রয়োজনে যোগাযোগ (নাম ও ফোন)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: মোজাম্মেল হক (ভাই) - 01711XXXXXX"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  নিবন্ধন আবেদন জমা দিন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

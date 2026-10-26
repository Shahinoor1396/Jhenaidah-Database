import React, { useState, useRef } from 'react';
import { Member, JhenaidahUpazila, BloodGroup, ProfessionCategory } from '../types';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';
import { getMembers, addMember, setCurrentUser } from '../utils/storage';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Heart,
  Briefcase,
  Clock,
  Camera,
} from 'lucide-react';

interface Props {
  onSuccess: (user: Member) => void;
  onClose: () => void;
  onMemberAdded?: (user: Member) => void;
  initialIsSignUp?: boolean;
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

export const UserAuthModal: React.FC<Props> = ({
  onSuccess,
  onClose,
  onMemberAdded,
  initialIsSignUp = false,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Additional Profile Fields for Sign Up
  const [upazila, setUpazila] = useState<JhenaidahUpazila>('ঝিনাইদহ সদর');
  const [unionOrVillage, setUnionOrVillage] = useState('');
  const [dhakaArea, setDhakaArea] = useState<string>('মিরপুর');
  const [dhakaAddress, setDhakaAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [isBloodDonor, setIsBloodDonor] = useState(true);
  const [occupationCategory, setOccupationCategory] = useState<ProfessionCategory>('চাকরিজীবী');
  const [professionDetails, setProfessionDetails] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [signupSuccessMember, setSignupSuccessMember] = useState<Member | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const members = getMembers();

    if (isSignUp) {
      // Validation for Sign Up
      if (!fullName.trim()) {
        setError('দয়া করে আপনার পূর্ণ নাম লিখুন');
        return;
      }
      if (!phone.trim() || phone.length < 11) {
        setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711223344)');
        return;
      }
      if (password.length < 4) {
        setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
        return;
      }

      if (authMethod === 'email') {
        if (!email.trim() || !email.includes('@')) {
          setError('সঠিক জিমেইল বা ইমেইল ঠিকানা দিন');
          return;
        }
        // Check if email already registered
        const exists = members.find((m) => m.email?.toLowerCase() === email.trim().toLowerCase());
        if (exists) {
          setError('এই জিমেইল দিয়ে ইতিমধ্যে একাউন্ট তৈরি করা আছে। লগইন করুন।');
          return;
        }

        const phoneExists = members.find((m) => m.phone === phone.trim());
        if (phoneExists) {
          setError('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একাউন্ট আছে।');
          return;
        }

        // Create new member with status: 'pending' for admin review
        const newMember = addMember({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
          authProvider: 'email',
          avatarUrl: avatarUrl.trim() || undefined,
          bloodGroup: bloodGroup,
          isBloodDonor: isBloodDonor,
          upazila: upazila,
          unionOrVillage: unionOrVillage.trim() || 'সদর',
          dhakaArea: dhakaArea,
          dhakaAddress: dhakaAddress.trim() || dhakaArea,
          occupationCategory: occupationCategory,
          professionDetails: professionDetails.trim() || occupationCategory,
          emergencyContact: phone.trim(),
          status: 'pending', // Pending for admin verification
        });
        setCurrentUser(newMember);
        setSignupSuccessMember(newMember);
        onMemberAdded?.(newMember);
      } else {
        // Phone Sign Up
        const exists = members.find((m) => m.phone === phone.trim());
        if (exists) {
          setError('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একাউন্ট আছে। লগইন করুন।');
          return;
        }

        const newMember = addMember({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          password: password,
          authProvider: 'phone',
          avatarUrl: avatarUrl.trim() || undefined,
          bloodGroup: bloodGroup,
          isBloodDonor: isBloodDonor,
          upazila: upazila,
          unionOrVillage: unionOrVillage.trim() || 'সদর',
          dhakaArea: dhakaArea,
          dhakaAddress: dhakaAddress.trim() || dhakaArea,
          occupationCategory: occupationCategory,
          professionDetails: professionDetails.trim() || occupationCategory,
          emergencyContact: phone.trim(),
          status: 'pending', // Pending for admin verification
        });
        setCurrentUser(newMember);
        setSignupSuccessMember(newMember);
        onMemberAdded?.(newMember);
      }
    } else {
      // Login Flow
      if (authMethod === 'email') {
        if (!email.trim()) {
          setError('আপনার জিমেইল বা ইমেইল লিখুন');
          return;
        }
        const found = members.find(
          (m) => m.email?.toLowerCase() === email.trim().toLowerCase()
        );
        if (found) {
          setCurrentUser(found);
          onSuccess(found);
        } else {
          setError('এই জিমেইলটি পাওয়া যায়নি। অনুগ্রহ করে "নতুন একাউন্ট তৈরি করুন"-এ যান।');
        }
      } else {
        // Phone Login
        if (!phone.trim() || phone.length < 11) {
          setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
          return;
        }
        const found = members.find((m) => m.phone === phone.trim());
        if (found) {
          setCurrentUser(found);
          onSuccess(found);
        } else {
          setError('এই মোবাইল নম্বর দিয়ে কোনো একাউন্ট নেই। "নতুন একাউন্ট তৈরি করুন"-এ যান।');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600/70 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/assets/jhenaidah-pigeon-logo.png"
                alt="লোগো"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {signupSuccessMember
                  ? 'নিবন্ধন সম্পন্ন হয়েছে'
                  : isSignUp
                  ? 'নতুন সদস্য একাউন্ট ও তথ্য আপলোড'
                  : 'সদস্য একাউন্টে প্রবেশ'}
              </h3>
              <p className="text-xs text-slate-500">
                ঢাকাস্থ ঝিনাইদহ জেলার মানুষ কমিউনিটি পোর্টাল
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

        {/* If Signup Success: Show Informative Pending Screen */}
        {signupSuccessMember ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                অপেক্ষমাণ আবেদন (Pending Verification)
              </span>
              <h4 className="text-lg font-bold text-slate-900">
                অভিনন্দন, {signupSuccessMember.fullName}!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                আপনার নাম ও মোবাইল নম্বর সহ সমস্ত তথ্য সফলভাবে ডাটাবেসে জমা হয়েছে।
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>অ্যাডমিন প্যানেল যাচাই প্রক্রিয়া:</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-normal">
                অ্যাডমিন প্যানেলের <strong>'নতুন আবেদন যাচাই'</strong> সেকশনে আপনার তথ্য পেন্ডিং হিসেবে তালিকাভুক্ত রয়েছে। অ্যাডমিন কর্তৃক যাচাই শেষে 'অনুমোদন করুন' বাটনে ক্লিক করার সাথে সাথে আপনার সমস্ত তথ্য স্বয়ংক্রিয়ভাবে <strong>সদস্য ডিরেক্টরি</strong> এবং <strong>রক্তদাতা তালিকায়</strong> শো করবে।
              </p>
              <div className="pt-1 text-[11px] text-slate-500">
                সদস্য কোড: <strong className="font-mono text-slate-800">{signupSuccessMember.memberCode}</strong> · মোবাইল: <strong className="font-mono text-slate-800">{signupSuccessMember.phone}</strong>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => onSuccess(signupSuccessMember)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                <span>আমার প্রোফাইলে যান ও ছবি/তথ্য হালনাগাদ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                ঠিক আছে, আবেদন জমা হয়েছে (বন্ধ করুন)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Switcher: Gmail vs Phone */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>জিমেইল ও পাসওয়ার্ড</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>মোবাইল নম্বর ও পিন</span>
              </button>
            </div>

            {/* Error notification */}
            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
              {/* Profile Photo & Full Name for Sign Up */}
              {isSignUp && (
                <>
                  {/* Photo Upload Widget */}
                  <div className="flex items-center gap-3.5 p-3 bg-slate-50 border border-slate-200/90 rounded-2xl">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center font-bold text-lg overflow-hidden shadow-xs">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="প্রোফাইল ছবি" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-7 h-7 text-emerald-600" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm cursor-pointer"
                        title="ছবি নির্বাচন করুন"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">প্রোফাইল ছবি আপলোড</span>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                          >
                            মুছে ফেলুন
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {avatarUrl ? 'ছবি সংযুক্ত করা হয়েছে' : 'পাসপোর্ট সাইজ বা স্পষ্ট ছবি (ঐচ্ছিক)'}
                      </p>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="mt-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                      >
                        {avatarUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}
                      </button>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="যেমন: মো: তানভীর আহমেদ"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </>
              )}

              {/* Email field if email auth */}
              {authMethod === 'email' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    জিমেইল / ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              )}

              {/* Mobile Phone Field */}
              {(authMethod === 'phone' || isSignUp) && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              )}

              {/* Detailed profile inputs during Sign-Up */}
              {isSignUp && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Jhenaidah Upazila */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        ঝিনাইদহের উপজেলা <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value as JhenaidahUpazila)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs bg-white"
                      >
                        {UPAZILAS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    {/* Village / Union */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        গ্রাম বা ইউনিয়নের নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: বিষয়খালী, গান্না"
                        value={unionOrVillage}
                        onChange={(e) => setUnionOrVillage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Dhaka Area */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        ঢাকার বর্তমান এলাকা <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={dhakaArea}
                        onChange={(e) => setDhakaArea(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs bg-white"
                      >
                        {DHAKA_AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        রক্তের গ্রুপ <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs font-bold text-rose-700 bg-white"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dhaka Address */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ঢাকার বর্তমান বিস্তারিত ঠিকানা
                    </label>
                    <input
                      type="text"
                      placeholder="রোড নম্বর, বাড়ি/ফ্ল্যাট নম্বর, ঢাকা"
                      value={dhakaAddress}
                      onChange={(e) => setDhakaAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Profession */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        পেশার ধরণ
                      </label>
                      <select
                        value={occupationCategory}
                        onChange={(e) => setOccupationCategory(e.target.value as ProfessionCategory)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs bg-white"
                      >
                        {PROFESSIONS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* Designation / Organization */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        পদবী ও প্রতিষ্ঠানের নাম
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: কর্মকর্তা, ব্যাংক"
                        value={professionDetails}
                        onChange={(e) => setProfessionDetails(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-xs"
                      />
                    </div>
                  </div>

                  {/* Blood Donor Toggle */}
                  <label className="flex items-center gap-2 p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBloodDonor}
                      onChange={(e) => setIsBloodDonor(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span className="text-xs text-rose-900 font-medium">
                      আমি জরুরি প্রয়োজনে রক্তদানে আগ্রহী (রক্তদাতা হিসেবে তালিকাভুক্ত করুন)
                    </span>
                  </label>

                  {/* Notice about admin verification */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      নিবন্ধন সম্পন্ন হলে আপনার তথ্য অ্যাডমিন প্যানেলে <strong>'নতুন আবেদন যাচাই'</strong> সেকশনে পেন্ডিং থাকবে। অ্যাডমিন অনুমোদনের পর সদস্য ডিরেক্টরিতে প্রদর্শিত হবে।
                    </span>
                  </div>
                </>
              )}

              {/* Password / PIN */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {authMethod === 'phone' ? '৪ ডিজিটের গোপন পিন' : 'পাসওয়ার্ড'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder={authMethod === 'phone' ? 'যেমন: ১২৩৪' : 'কমপক্ষে ৪ অক্ষর'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSignUp ? 'নিবন্ধন সম্পন্ন করুন (পেন্ডিং যাচাইয়ের জন্য জমা)' : 'প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Sign Up vs Login */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
              {isSignUp ? (
                <p>
                  ইতিমধ্যে একাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    লগইন করুন
                  </button>
                </p>
              ) : (
                <p>
                  নতুন সদস্য?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError(null);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    নতুন একাউন্ট তৈরি করুন
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

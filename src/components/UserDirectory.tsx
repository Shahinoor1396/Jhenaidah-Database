import React, { useState, useMemo } from 'react';
import { Member, JhenaidahUpazila, BloodGroup, ProfessionCategory } from '../types';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';
import { MemberCard } from './MemberCard';
import { PrayerTimesCard } from './PrayerTimesCard';
import { Search, Filter, RotateCcw, Heart, UserPlus, Sparkles, Building, MapPin } from 'lucide-react';

interface Props {
  members: Member[];
  currentUser?: Member | null;
  onSelectMember: (member: Member) => void;
  onViewIdCard: (member: Member) => void;
  onOpenRegistration: () => void;
  selectedLocation: 'dhaka' | 'jhenaidah';
  onLocationChange: (loc: 'dhaka' | 'jhenaidah') => void;
  onOpenPrayerModal: () => void;
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

export const UserDirectory: React.FC<Props> = ({
  members,
  currentUser,
  onSelectMember,
  onViewIdCard,
  onOpenRegistration,
  selectedLocation,
  onLocationChange,
  onOpenPrayerModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('ALL');
  const [selectedDhakaArea, setSelectedDhakaArea] = useState<string>('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedProfession, setSelectedProfession] = useState<string>('ALL');
  const [onlyDonors, setOnlyDonors] = useState(false);

  // Filter only verified members for public directory
  const verifiedMembers = useMemo(() => {
    return members.filter((m) => m.status === 'verified');
  }, [members]);

  const filteredMembers = useMemo(() => {
    return verifiedMembers.filter((m) => {
      // Upazila
      if (selectedUpazila !== 'ALL' && m.upazila !== selectedUpazila) return false;
      // Dhaka Area
      if (selectedDhakaArea !== 'ALL' && m.dhakaArea !== selectedDhakaArea) return false;
      // Blood Group
      if (selectedBloodGroup !== 'ALL' && m.bloodGroup !== selectedBloodGroup) return false;
      // Profession
      if (selectedProfession !== 'ALL' && m.occupationCategory !== selectedProfession) return false;
      // Donor
      if (onlyDonors && !m.isBloodDonor) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.fullName.toLowerCase().includes(q) ||
          m.dhakaArea.toLowerCase().includes(q) ||
          m.upazila.toLowerCase().includes(q) ||
          m.unionOrVillage.toLowerCase().includes(q) ||
          m.occupationCategory.toLowerCase().includes(q) ||
          m.professionDetails.toLowerCase().includes(q) ||
          m.memberCode.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [
    members,
    selectedUpazila,
    selectedDhakaArea,
    selectedBloodGroup,
    selectedProfession,
    onlyDonors,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedUpazila('ALL');
    setSelectedDhakaArea('ALL');
    setSelectedBloodGroup('ALL');
    setSelectedProfession('ALL');
    setOnlyDonors(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedUpazila !== 'ALL' ||
    selectedDhakaArea !== 'ALL' ||
    selectedBloodGroup !== 'ALL' ||
    selectedProfession !== 'ALL' ||
    onlyDonors;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Animated Monument Logo */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/90 shadow-xl relative overflow-hidden">
        {/* Subtle background ambient blur */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ঝিনাইদহ ⇄ ঢাকা কমিউনিটি নেটওয়ার্ক</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              ঢাকায় বসবাসরত ঝিনাইদহের প্রিয়জনদের ডিজিটাল প্ল্যাটফর্ম
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              ফেসবুক গ্রুপ <strong className="text-white">“ঢাকাস্থ ঝিনাইদহ জেলার মানুষ”</strong>-এর সদস্যদের পূর্ণাঙ্গ ডিজিটাল ডিরেক্টরি। জরুরি রক্তের সন্ধান, ঢাকার এলাকাভিত্তিক পরিচয় বা পারস্পরিক সহযোগিতায় আমরা সবাই একই সূত্রে গাঁথা।
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegistration}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>একাউন্ট তৈরি / প্রোফাইল তথ্য আপলোড</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-900/60 px-3.5 py-2 rounded-xl border border-emerald-700/50">
                <span className="font-mono font-bold text-white tabular-nums">{verifiedMembers.length}</span>
                <span>জন অনুমোদিত সক্রিয় সদস্য</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Monument Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Animated Outer Glowing Rings */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-300 to-amber-400 opacity-70 blur-md animate-glow-ring pointer-events-none" />

              {/* Animated Floating Monument Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/90 bg-emerald-950 shadow-2xl overflow-hidden flex items-center justify-center animate-monument">
                <img
                  src="/assets/jhenaidah-pigeon-logo.png"
                  alt="ঝিনাইদহ শহরের কেন্দ্রীয় পায়রা চত্বর (শান্তির প্রতীক)"
                  className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-500"
                />

                {/* Subtle Inner Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-0 right-0 text-center">
                  <span className="text-[10px] font-bold text-emerald-200 bg-slate-900/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs">
                    পায়রা চত্বর
                  </span>
                </div>
              </div>
            </div>

            {/* Caption below the animated emblem */}
            <div className="text-center mt-3 space-y-0.5">
              <p className="text-xs font-bold text-emerald-200 tracking-wide flex items-center justify-center gap-1">
                <span>পায়রা চত্বর (শান্তির প্রতীক)</span>
              </p>
              <p className="text-[11px] text-emerald-300/80">
                ঝিনাইদহ শহরের প্রাণকেন্দ্র ও প্রবেশদ্বার
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending status notification for logged-in user whose registration is awaiting approval */}
      {currentUser && currentUser.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-lg">⏳</span>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                আপনার সদস্য আবেদনটি বর্তমানে অ্যাডমিন যাচাইয়ের জন্য অপেক্ষমাণ (Pending)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                এডমিন প্যানেলে 'নতুন আবেদন যাচাই' অংশে অনুমোদন সম্পন্ন হলেই আপনার তথ্য এই ডিরেক্টরিতে লাইভ প্রদর্শিত হবে।
              </p>
            </div>
          </div>
          <button
            onClick={onOpenRegistration}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors cursor-pointer self-start sm:self-auto"
          >
            আমার প্রোফাইল দেখুন
          </button>
        </div>
      )}

      {/* Live Bangladesh Standard Time & 5 Daily Prayer Times Card */}
      <PrayerTimesCard
        selectedLocation={selectedLocation}
        onLocationChange={onLocationChange}
        onOpenDetailsModal={onOpenPrayerModal}
      />

      {/* Upazila Filter Tabs (Functional segmented controls) */}
      <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedUpazila('ALL')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedUpazila === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            সকল উপজেলা ({verifiedMembers.length})
          </button>
          {UPAZILAS.map((up) => {
            const count = verifiedMembers.filter((m) => m.upazila === up).length;
            return (
              <button
                key={up}
                onClick={() => setSelectedUpazila(up)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedUpazila === up
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{up}</span>
                <span className="text-[10px] ml-1.5 opacity-80 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters & Search Bar */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="নাম, গ্রাম, বা পদবী দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Dhaka Area Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDhakaArea}
              onChange={(e) => setSelectedDhakaArea(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-700"
            >
              <option value="ALL">ঢাকার সকল এলাকা / থানা</option>
              {DHAKA_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-700"
            >
              <option value="ALL">রক্তের গ্রুপ</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  গ্রুপ: {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Profession Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-700"
            >
              <option value="ALL">সকল পেশা বিভাগ</option>
              {PROFESSIONS.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Toggles & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyDonors}
                onChange={(e) => setOnlyDonors(e.target.checked)}
                className="w-3.5 h-3.5 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <span className="font-medium flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                কেবল সক্রিয় রক্তদাতা
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-mono">
              পাওয়া গেছে: <strong className="text-slate-900">{filteredMembers.length}</strong> জন
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফিল্টার মুছুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">কোনো সদস্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি। বানান পরীক্ষা করুন অথবা ফিল্টারগুলো রিসেট করুন।
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
          >
            সকল ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onSelect={onSelectMember}
              onViewIdCard={onViewIdCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

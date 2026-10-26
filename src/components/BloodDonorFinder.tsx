import React, { useState, useMemo } from 'react';
import { Member, BloodGroup } from '../types';
import { Heart, Search, Phone, MessageCircle, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';

interface Props {
  members: Member[];
  onSelectMember: (m: Member) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodDonorFinder: React.FC<Props> = ({ members, onSelectMember }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only verified blood donors
  const donors = useMemo(() => {
    return members.filter((m) => {
      if (m.status !== 'verified') return false;
      if (!m.isBloodDonor) return false;
      if (selectedGroup !== 'ALL' && m.bloodGroup !== selectedGroup) return false;
      if (selectedArea !== 'ALL' && m.dhakaArea !== selectedArea) return false;
      if (selectedUpazila !== 'ALL' && m.upazila !== selectedUpazila) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          m.fullName.toLowerCase().includes(query) ||
          m.dhakaArea.toLowerCase().includes(query) ||
          m.upazila.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [members, selectedGroup, selectedArea, selectedUpazila, searchQuery]);

  const handleCall = (_phone: string) => {
    // Direct call redirect disabled on public site
  };

  const handleWhatsApp = (_member: Member) => {
    // Direct WhatsApp redirect disabled on public site
  };

  return (
    <div className="space-y-6">
      {/* Emergency Blood Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-2xl p-6 border border-rose-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-rose-800/80 rounded-lg text-rose-200">
                <Heart className="w-5 h-5 fill-rose-400 text-rose-400" />
              </span>
              <h2 className="text-lg font-bold text-white">জরুরি রক্তদাতা অনুসন্ধান</h2>
            </div>
            <p className="text-xs text-rose-200 max-w-xl leading-relaxed">
              ঢাকায় চিকিৎসাধীন ঝিনাইদহবাসীর জন্য কিংবা যেকোনো মুমূর্ষু রোগীর প্রয়োজনে আমাদের নিবন্ধিত রক্তদাতাদের সাথে তাৎক্ষণিক যোগাযোগ করুন।
            </p>
          </div>

          <div className="bg-rose-950/80 border border-rose-800/60 rounded-xl p-3.5 text-center min-w-[150px]">
            <p className="text-[11px] text-rose-300">নিবন্ধিত সক্রিয় রক্তদাতা</p>
            <p className="text-2xl font-bold font-mono text-white mt-0.5">
              {members.filter((m) => m.isBloodDonor).length} জন
            </p>
          </div>
        </div>

        {/* Blood Group Selectors (Functional segmented filter controls) */}
        <div className="mt-6 pt-5 border-t border-rose-800/60">
          <p className="text-xs text-rose-300 font-medium mb-2.5">রক্তের গ্রুপ নির্বাচন করুন:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedGroup === 'ALL'
                  ? 'bg-white text-rose-950 shadow-sm'
                  : 'bg-rose-900/60 text-rose-200 hover:bg-rose-800/80 border border-rose-700/50'
              }`}
            >
              সকল গ্রুপ ({members.filter((m) => m.isBloodDonor).length})
            </button>
            {BLOOD_GROUPS.map((bg) => {
              const count = members.filter((m) => m.isBloodDonor && m.bloodGroup === bg).length;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedGroup === bg
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-rose-900/60 text-rose-100 hover:bg-rose-800/80 border border-rose-700/50'
                  }`}
                >
                  <span>{bg}</span>
                  <span className="text-[10px] opacity-80 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Location & Name Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            ঢাকার এলাকা অনুযায়ী ফিল্টার
          </label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          >
            <option value="ALL">সকল ঢাকা এলাকা</option>
            {DHAKA_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            ঝিনাইদহ উপজেলা অনুযায়ী
          </label>
          <select
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
          >
            <option value="ALL">সকল উপজেলা</option>
            {UPAZILAS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            রক্তদাতার নাম বা এলাকা খুঁজুন
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="নাম বা এলাকা..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
          <span>
            পাওয়া গেছে: <strong className="text-slate-900">{donors.length}</strong> জন রক্তদাতা
          </span>
          {selectedGroup !== 'ALL' && (
            <span className="text-rose-700 font-semibold">গ্রুপ: {selectedGroup}</span>
          )}
        </div>

        {donors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h4 className="font-semibold text-slate-800 text-sm">এই ফিল্টারে কোনো রক্তদাতা পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              দয়া করে রক্তের গ্রুপ বা এলাকার ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন, অথবা সার্বক্ষণিক হেল্পলাইনে যোগাযোগ করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {donors.map((donor) => (
              <div
                key={donor.id}
                onClick={() => onSelectMember(donor)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{donor.fullName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {donor.upazila} · {donor.dhakaArea}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-bold text-rose-700 text-sm shrink-0">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  {donor.lastDonationDate && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      শেষ রক্তদান: <span className="text-slate-700">{donor.lastDonationDate}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(donor.phone);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল দিন</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(donor);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

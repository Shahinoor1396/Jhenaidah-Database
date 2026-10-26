import React, { useState, useMemo } from 'react';
import { HeritageSpot, Dignitary, JhenaidahUpazila } from '../types';
import { HERITAGE_SPOTS, PROMINENT_DIGNITARIES, UPAZILAS } from '../data/mockData';
import {
  Landmark,
  Award,
  MapPin,
  Calendar,
  BookOpen,
  Search,
  Sparkles,
  Compass,
  Scroll,
} from 'lucide-react';

export const HeritageAndDignitaries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'places' | 'people'>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'place' | 'person';
    data: HeritageSpot | Dignitary;
  } | null>(null);

  // Filter heritage spots
  const filteredSpots = useMemo(() => {
    if (activeTab === 'people') return [];
    return HERITAGE_SPOTS.filter((spot) => {
      if (selectedUpazila !== 'ALL' && spot.upazila !== selectedUpazila) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          spot.name.toLowerCase().includes(q) ||
          spot.description.toLowerCase().includes(q) ||
          spot.upazila.toLowerCase().includes(q) ||
          spot.locationDetails.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, selectedUpazila, searchQuery]);

  // Filter dignitaries
  const filteredDignitaries = useMemo(() => {
    if (activeTab === 'places') return [];
    return PROMINENT_DIGNITARIES.filter((person) => {
      if (selectedUpazila !== 'ALL' && person.upazila !== selectedUpazila) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          person.name.toLowerCase().includes(q) ||
          person.title.toLowerCase().includes(q) ||
          person.upazila.toLowerCase().includes(q) ||
          person.bio.toLowerCase().includes(q) ||
          person.achievements.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, selectedUpazila, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium">
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>ইতিহাস, ঐতিহ্য ও অহংকার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            ঝিনাইদহের দর্শনীয় স্থান ও কৃতি ব্যক্তিবর্গ
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            নবগঙ্গার কোল ঘেঁষে গড়ে ওঠা লালন সাঁইয়ের পদধন্য, বাঘা যতীন ও বীরশ্রেষ্ঠ হামিদুর রহমানের পুণ্যভূমি ঝিনাইদহের ঐতিহাসিক নিদর্শন ও সূর্যসন্তানদের পরিচিতি।
          </p>
        </div>

        {/* Decorative badge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 hidden md:block">
          <Landmark className="w-48 h-48 text-emerald-300" />
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল ঐতিহ্য ({HERITAGE_SPOTS.length + PROMINENT_DIGNITARIES.length})
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'places'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>দর্শনীয় স্থান ({HERITAGE_SPOTS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'people'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>গুণী ব্যক্তিবর্গ ({PROMINENT_DIGNITARIES.length})</span>
            </button>
          </div>

          {/* Upazila Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-700 bg-white"
            >
              <option value="ALL">সকল উপজেলা</option>
              {UPAZILAS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="অনুসন্ধান..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Tourist & Heritage Places Section */}
      {filteredSpots.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-700" />
              <span>ঝিনাইদহ জেলার ঐতিহাসিক ও দর্শনীয় স্থানসমূহ</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {filteredSpots.length} টি স্থান
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedItem({ type: 'place', data: spot })}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Image slot */}
                  {spot.imageUrl ? (
                    <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                        {spot.category}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center relative p-4 text-center">
                      <Landmark className="w-10 h-10 text-emerald-300/40 absolute" />
                      <span className="relative z-10 text-xs font-semibold text-emerald-100">
                        {spot.category}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-800">{spot.upazila}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{spot.locationDetails}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {spot.name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {spot.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg">
                      <strong>ঐতিহাসিক পটভূমি:</strong> {spot.historySnippet}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
                  <span>বিস্তারিত ও ইতিহাস পড়ুন</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Prominent Dignitaries Section */}
      {filteredDignitaries.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>ঝিনাইদহের চিরস্মরণীয় ও প্রথিতযশা কৃতি ব্যক্তিবর্গ</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {filteredDignitaries.length} জন বরেণ্য ব্যক্তিত্ব
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDignitaries.map((person) => (
              <div
                key={person.id}
                onClick={() => setSelectedItem({ type: 'person', data: person })}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      {person.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] bg-amber-50 text-amber-800 font-medium px-2.5 py-1 rounded-lg border border-amber-200">
                        {person.category}
                      </span>
                      {person.lifeSpan && (
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          {person.lifeSpan}
                        </p>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base leading-snug group-hover:text-amber-800 transition-colors">
                    {person.name}
                  </h4>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    {person.title}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>উপজেলা: <strong>{person.upazila}</strong></span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {person.bio}
                  </p>

                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <strong className="text-slate-900">অসামান্য অবদান:</strong> {person.achievements}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
                  <span>জীবন ও অবদান দেখুন</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Place or Person */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {selectedItem.type === 'place' ? (
              <div className="space-y-4">
                {(selectedItem.data as HeritageSpot).imageUrl && (
                  <div className="h-56 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                    <img
                      src={(selectedItem.data as HeritageSpot).imageUrl}
                      alt={selectedItem.data.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {(selectedItem.data as HeritageSpot).category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {selectedItem.data.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedItem.data.upazila} · {(selectedItem.data as HeritageSpot).locationDetails}</span>
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">বিস্তারিত বিবরণ ও ঐতিহ্য</h4>
                  <p>{(selectedItem.data as HeritageSpot).description}</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <h4 className="font-bold text-xs">ঐতিহাসিক তাৎপর্য:</h4>
                  <p>{(selectedItem.data as HeritageSpot).historySnippet}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                    {selectedItem.data.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedItem.data.name}</h3>
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">
                      {(selectedItem.data as Dignitary).title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      মূল উপজেলা: {selectedItem.data.upazila} · জীবনকাল: {(selectedItem.data as Dignitary).lifeSpan}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <h4 className="font-bold text-slate-900 text-sm">জীবনবৃত্তান্ত ও কর্মযজ্ঞ</h4>
                  <p>{(selectedItem.data as Dignitary).bio}</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1 leading-relaxed">
                  <h4 className="font-bold text-xs">অমর কীর্তি ও অর্জন:</h4>
                  <p>{(selectedItem.data as Dignitary).achievements}</p>
                </div>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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

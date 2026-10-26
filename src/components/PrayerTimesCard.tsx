import React, { useState, useEffect } from 'react';
import {
  calculatePrayerTimes,
  getBangladeshLiveClock,
  WaqtInfo,
} from '../utils/prayerTimes';
import {
  Compass,
  Clock,
  Calendar,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

interface Props {
  selectedLocation: 'dhaka' | 'jhenaidah';
  onLocationChange: (loc: 'dhaka' | 'jhenaidah') => void;
  onOpenDetailsModal?: () => void;
}

export const PrayerTimesCard: React.FC<Props> = ({
  selectedLocation,
  onLocationChange,
  onOpenDetailsModal,
}) => {
  const [clock, setClock] = useState(getBangladeshLiveClock());
  const [schedule, setSchedule] = useState(calculatePrayerTimes(selectedLocation));

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getBangladeshLiveClock());
      setSchedule(calculatePrayerTimes(selectedLocation));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedLocation]);

  const prayers: {
    id: string;
    nameBn: string;
    waqt: WaqtInfo;
    icon: React.ReactNode;
    color: string;
    accent: string;
  }[] = [
    {
      id: 'fajr',
      nameBn: 'ফজর',
      waqt: schedule.fajr,
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      color: 'text-amber-700',
      accent: 'border-amber-200 bg-amber-50/50',
    },
    {
      id: 'dhuhr',
      nameBn: 'যোহর',
      waqt: schedule.dhuhr,
      icon: <Sun className="w-4 h-4 text-emerald-600" />,
      color: 'text-emerald-700',
      accent: 'border-emerald-200 bg-emerald-50/50',
    },
    {
      id: 'asr',
      nameBn: 'আসর',
      waqt: schedule.asr,
      icon: <Sun className="w-4 h-4 text-orange-500" />,
      color: 'text-orange-700',
      accent: 'border-orange-200 bg-orange-50/50',
    },
    {
      id: 'maghrib',
      nameBn: 'মাগরিব (ইফতার)',
      waqt: schedule.maghrib,
      icon: <Sunset className="w-4 h-4 text-rose-500" />,
      color: 'text-rose-700',
      accent: 'border-rose-200 bg-rose-50/50',
    },
    {
      id: 'isha',
      nameBn: 'ইশা',
      waqt: schedule.isha,
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      color: 'text-indigo-700',
      accent: 'border-indigo-200 bg-indigo-50/50',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm space-y-4">
      {/* Header with Title & Location Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Compass className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                বাংলাদেশ সময় ও ৫ ওয়াক্ত নামাজের সময়সূচি
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                BST • UTC+6
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              লাইভ সময়: <span className="font-semibold text-slate-800">{clock.dayNameBn}, {clock.dateBn}</span> ({clock.banglaSeasonDate})
            </p>
          </div>
        </div>

        {/* Location Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 hidden lg:inline">এলাকা:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onLocationChange('dhaka')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLocation === 'dhaka'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ঢাকা শহর
            </button>
            <button
              onClick={() => onLocationChange('jhenaidah')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLocation === 'jhenaidah'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ঝিনাইদহ ঢাকার ৪ মিনিট পরে"
            >
              ঝিনাইদহ (+৪ মি.)
            </button>
          </div>
        </div>
      </div>

      {/* Ongoing Waqt & Live Time Row */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="text-[10px] text-emerald-300 font-medium block">
              বাংলাদেশ মান সময় (লাইভ ঘড়ি)
            </span>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-baseline gap-1.5">
              <span>{clock.timeStrBn}:{clock.secondsBn}</span>
              <span className="text-xs text-emerald-300 font-sans font-medium">{clock.periodBn}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-emerald-200">
            {schedule.currentWaqt ? (
              <>
                এখন <strong className="text-white underline">{schedule.currentWaqt.nameBn}</strong>-এর ওয়াক্ত চলছে
              </>
            ) : (
              <>ইশরাক / চাশতের সময়</>
            )}
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">
            পরবর্তী ওয়াক্ত {schedule.nextWaqt.nameBn} শুরু হতে বাকি: {schedule.timeToNextWaqt}
          </div>
        </div>
      </div>

      {/* 5 Daily Waqt Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {prayers.map((item) => {
          const isCurrent = schedule.currentWaqt?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={onOpenDetailsModal}
              className={`p-3 rounded-2xl border transition-all text-center cursor-pointer hover:shadow-md ${
                isCurrent
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : `${item.accent} border-slate-200 hover:border-slate-300`
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                {item.icon}
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {item.nameBn}
                </span>
              </div>

              {isCurrent && (
                <span className="inline-block text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold mb-1 animate-pulse">
                  চলমান
                </span>
              )}

              <div className="text-sm sm:text-base font-extrabold text-slate-800">
                {item.waqt.timeBn}
              </div>

              <div className="text-[10px] text-emerald-700 font-medium mt-1 bg-white/70 py-0.5 px-1 rounded-md border border-slate-200/50">
                জামাত: {item.waqt.jamatBn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Highlights: Sahri & Iftar + View details button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600">
        <div className="flex items-center gap-4 text-[11px]">
          <div>
            <span className="text-slate-400">সেহরি শেষ:</span>{' '}
            <strong className="text-slate-800">{schedule.sahriEndBn}</strong>
          </div>
          <div>
            <span className="text-slate-400">সূর্যোদয়:</span>{' '}
            <strong className="text-slate-800">{schedule.sunrise.timeBn}</strong>
          </div>
          <div>
            <span className="text-slate-400">ইফতার:</span>{' '}
            <strong className="text-rose-700 font-bold">{schedule.iftarBn}</strong>
          </div>
        </div>

        {onOpenDetailsModal && (
          <button
            onClick={onOpenDetailsModal}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            পূর্ণাঙ্গ নামাজের জামাত বিবরণী ও রাকাত সংখ্যা →
          </button>
        )}
      </div>
    </div>
  );
};

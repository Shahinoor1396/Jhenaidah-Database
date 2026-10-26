import React, { useState, useEffect } from 'react';
import {
  getBangladeshLiveClock,
  calculatePrayerTimes,
  toBnDigits,
} from '../utils/prayerTimes';
import { Clock, Calendar, Compass, Sun, Moon, MapPin, ChevronRight, Bell } from 'lucide-react';

interface Props {
  onOpenPrayerModal: () => void;
  selectedLocation: 'dhaka' | 'jhenaidah';
  onLocationChange: (loc: 'dhaka' | 'jhenaidah') => void;
}

export const BangladeshTimeBar: React.FC<Props> = ({
  onOpenPrayerModal,
  selectedLocation,
  onLocationChange,
}) => {
  const [clock, setClock] = useState(getBangladeshLiveClock());
  const [schedule, setSchedule] = useState(calculatePrayerTimes(selectedLocation));

  // Ticking live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getBangladeshLiveClock());
      setSchedule(calculatePrayerTimes(selectedLocation));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedLocation]);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white text-xs border-b border-emerald-800/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left Side: Live BST Clock & Date */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-200">
          <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-emerald-300 font-medium">বাংলাদেশ সময়:</span>
            <span className="font-bold text-white tracking-wider font-mono">
              {clock.timeStrBn}:{clock.secondsBn} {clock.periodBn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {clock.dayNameBn}, {clock.dateBn}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-emerald-300/90 text-[10px]">
              {clock.banglaSeasonDate}
            </span>
          </div>
        </div>

        {/* Right Side: Five Waqt Prayer Indicator & Location Switch */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
          {/* Current / Next Prayer Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              {schedule.currentWaqt ? (
                <>
                  এখন <strong className="text-emerald-300 font-semibold">{schedule.currentWaqt.nameBn}</strong>-এর ওয়াক্ত
                </>
              ) : (
                <>ইশরাকের সময়</>
              )}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-medium">
              পরবর্তী: {schedule.nextWaqt.nameBn} ({schedule.timeToNextWaqt})
            </span>
          </div>

          {/* Quick Location Switcher */}
          <div className="inline-flex p-0.5 bg-slate-800 rounded-lg text-[10px] border border-slate-700">
            <button
              onClick={() => onLocationChange('dhaka')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                selectedLocation === 'dhaka'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ঢাকা শহরের নামাজের সময়"
            >
              ঢাকা
            </button>
            <button
              onClick={() => onLocationChange('jhenaidah')}
              className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                selectedLocation === 'jhenaidah'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ঝিনাইদহ জেলার নামাজের সময় (+৪ মিনিট)"
            >
              ঝিনাইদহ
            </button>
          </div>

          {/* Full Schedule Modal Trigger Button */}
          <button
            onClick={onOpenPrayerModal}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
          >
            <span>৫ ওয়াক্তের সময়সূচি</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

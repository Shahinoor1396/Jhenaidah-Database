import React, { useState } from 'react';
import {
  calculatePrayerTimes,
  LOCATIONS,
  toBnDigits,
  getBangladeshLiveClock,
  WaqtInfo,
} from '../utils/prayerTimes';
import {
  Clock,
  MapPin,
  X,
  Compass,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Volume2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: 'dhaka' | 'jhenaidah';
  onLocationChange: (loc: 'dhaka' | 'jhenaidah') => void;
}

export const PrayerTimesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedLocation,
  onLocationChange,
}) => {
  if (!isOpen) return null;

  const schedule = calculatePrayerTimes(selectedLocation);
  const liveClock = getBangladeshLiveClock();

  const prayerCards: {
    title: string;
    waqt: WaqtInfo;
    icon: React.ReactNode;
    color: string;
    accentBg: string;
    accentBorder: string;
    rakat: string;
  }[] = [
    {
      title: 'ফজর',
      waqt: schedule.fajr,
      icon: <Sunrise className="w-5 h-5 text-amber-500" />,
      color: 'text-amber-700',
      accentBg: 'bg-amber-50/70',
      accentBorder: 'border-amber-200',
      rakat: '৪ রাকাত (২ সুন্নত + ২ ফরজ)',
    },
    {
      title: 'যোহর',
      waqt: schedule.dhuhr,
      icon: <Sun className="w-5 h-5 text-emerald-600" />,
      color: 'text-emerald-700',
      accentBg: 'bg-emerald-50/70',
      accentBorder: 'border-emerald-200',
      rakat: '১২ রাকাত (৪ সুন্নত + ৪ ফরজ + ২ সুন্নত + ২ নফল)',
    },
    {
      title: 'আসর',
      waqt: schedule.asr,
      icon: <Sun className="w-5 h-5 text-orange-500" />,
      color: 'text-orange-700',
      accentBg: 'bg-orange-50/70',
      accentBorder: 'border-orange-200',
      rakat: '৮ রাকাত (৪ সুন্নত + ৪ ফরজ)',
    },
    {
      title: 'মাগরিব (ইফতার)',
      waqt: schedule.maghrib,
      icon: <Sunset className="w-5 h-5 text-rose-500" />,
      color: 'text-rose-700',
      accentBg: 'bg-rose-50/70',
      accentBorder: 'border-rose-200',
      rakat: '৭ রাকাত (৩ ফরজ + ২ সুন্নত + ২ নফল)',
    },
    {
      title: 'ইশা ও বিতর',
      waqt: schedule.isha,
      icon: <Moon className="w-5 h-5 text-indigo-500" />,
      color: 'text-indigo-700',
      accentBg: 'bg-indigo-50/70',
      accentBorder: 'border-indigo-200',
      rakat: '১৭ রাকাত (৪ সুন্নত + ৪ ফরজ + ২ সুন্নত + ২ নফল + ৩ বিতর + ২ নফল)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                পাঁচ ওয়াক্ত নামাজের সময়সূচি ও জামাত
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              বাংলাদেশ মান সময় (BST, UTC+6) এবং ইসলামিক ফাউন্ডেশন বাংলাদেশ মানদণ্ডে হিসাবকৃত
            </p>
          </div>

          {/* Location Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => onLocationChange('dhaka')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLocation === 'dhaka'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ঢাকা শহর
            </button>
            <button
              onClick={() => onLocationChange('jhenaidah')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLocation === 'jhenaidah'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ঝিনাইদহ জেলা (+৪ মি.)
            </button>
          </div>
        </div>

        {/* Live BST Banner Inside Modal */}
        <div className="mt-4 p-3.5 bg-emerald-950 text-emerald-50 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-[11px] text-emerald-300 font-medium">
                লাইভ বাংলাদেশ সময় (BST)
              </div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>
                  {liveClock.timeStrBn} {liveClock.periodBn}
                </span>
                <span className="text-xs text-emerald-400 font-normal">
                  ({liveClock.secondsBn} সে.)
                </span>
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-emerald-200">
            <div className="font-semibold text-white">
              {liveClock.dayNameBn}, {liveClock.dateBn}
            </div>
            <div className="text-[10px] text-emerald-300">
              {schedule.banglaDate} • {schedule.hijriDate}
            </div>
          </div>
        </div>

        {/* Currently Active Waqt Banner */}
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-slate-700">
              {schedule.currentWaqt ? (
                <>
                  এখন <strong className="text-emerald-800 font-bold">{schedule.currentWaqt.nameBn}</strong>-এর ওয়াক্ত চলছে
                </>
              ) : (
                <>ইশরাক / চাশতের সময়</>
              )}
            </span>
          </div>
          <div className="text-emerald-800 font-medium text-[11px]">
            পরবর্তী ওয়াক্ত <strong>{schedule.nextWaqt.nameBn}</strong> শুরু হতে বাকি:{' '}
            <span className="font-bold underline">{schedule.timeToNextWaqt}</span>
          </div>
        </div>

        {/* Five Daily Prayer Cards */}
        <div className="mt-4 space-y-2.5">
          {prayerCards.map((item) => {
            const isCurrent = schedule.currentWaqt?.id === item.waqt.id;
            return (
              <div
                key={item.title}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/80 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.accentBg} ${item.accentBorder} border`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-semibold animate-pulse">
                            চলমান ওয়াক্ত
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.rakat}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">ওয়াক্ত শুরু</div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.waqt.timeBn}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium">
                      মসজিদে জামাত: {item.waqt.jamatBn}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Timings: Sahri, Sunrise, Ishraq */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">সেহরি শেষ (সতর্কতা সহ)</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">{schedule.sahriEndBn}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">সূর্যোদয় (নিষেধ সময় শেষ)</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">{schedule.sunrise.timeBn}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">ইফতার ও সূর্যাস্ত</span>
            <span className="font-bold text-rose-700 text-xs sm:text-sm">{schedule.iftarBn}</span>
          </div>
        </div>

        {/* Notice on Jhenaidah vs Dhaka time offset */}
        <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>স্থানভেদে সময়ের পার্থক্য:</strong> ঝিনাইদহ জেলা ঢাকার প্রায় ১৮০ কিমি পশ্চিমে অবস্থিত। তাই ঝিনাইদহে সূর্যোদয়, সেহরি, সূর্যাস্ত ও ইফতারের সময় ঢাকা শহর থেকে প্রায় <strong>৪ মিনিট পর</strong> ঘটে থাকে। আপনি উপরের বাটনে ক্লিক করে মুহূর্তেই নিজ নিজ এলাকার সময় দেখে নিতে পারেন।
          </div>
        </div>

        {/* Hadith / Spiritual inspiration */}
        <div className="mt-3 p-3 bg-slate-100/70 rounded-xl text-center text-[11px] text-slate-600 italic">
          “নিশ্চয়ই নির্দিষ্ট সময়ে নামাজ কায়েম করা মুমিনদের জন্য একটি বাধ্যতামূলক দায়িত্ব।” — (সূরা আন-নিসা: ১০৩)
        </div>
      </div>
    </div>
  );
};

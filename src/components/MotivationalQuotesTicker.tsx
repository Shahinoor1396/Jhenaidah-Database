import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface MotivationalQuote {
  id: number;
  quote: string;
  author: string;
  designation?: string;
}

const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 1,
    quote: 'স্বপ্ন সেটা নয় যা তুমি ঘুমিয়ে দেখো, স্বপ্ন সেটাই যা তোমাকে ঘুমাতে দেয় না।',
    author: 'এ পি জে আবদুল কালাম',
    designation: 'বিজ্ঞানী ও সাবেক রাষ্ট্রপতি',
  },
  {
    id: 2,
    quote: 'মানুষকে ভালোবাসলে মানুষও ভালোবাসে। যদি সামান্য ত্যাগ স্বীকার করেন, তবে জনসাধারণ আপনার জন্য জীবন দিতেও পারে।',
    author: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান',
    designation: 'জাতির জনক',
  },
  {
    id: 3,
    quote: 'যে নদীর গভীরতা বেশি, তার বয়ে যাওয়ার শব্দ কম।',
    author: 'রবীন্দ্রনাথ ঠাকুর',
    designation: 'বিশ্বকবি',
  },
  {
    id: 4,
    quote: 'সাম্যের গান গাই— আমার চক্ষে পুরুষ-রমণী কোনো ভেদাভেদ নাই।',
    author: 'কাজী নজরুল ইসলাম',
    designation: 'জাতীয় কবি',
  },
  {
    id: 5,
    quote: 'এমন মানব জনম আর কি হবে, মন যা করো ত্বরায় করো এই ভবে।',
    author: 'লালন শাহ',
    designation: 'বাউল সম্রাট',
  },
  {
    id: 6,
    quote: 'কখনো না পড়ে যাওয়াটা বড় গৌরব নয়, বরং প্রতিবার পড়ে যাওয়ার পর আবার উঠে দাঁড়ানোটাই সবচেয়ে বড় গৌরব।',
    author: 'নেলসন ম্যান্ডেলা',
    designation: 'শান্তিতে নোবেলজয়ী নেতা',
  },
  {
    id: 7,
    quote: 'আপনার সময় সীমিত, তাই অন্যের অনুকরণ করে তা নষ্ট করবেন না। নিজের অন্তরের কণ্ঠস্বর শুনুন।',
    author: 'স্টিভ জবস',
    designation: 'অ্যাপল প্রতিষ্ঠাতা',
  },
  {
    id: 8,
    quote: 'কঠিন পরিস্থিতির গভীরেই লুকিয়ে থাকে নতুন কোনো অপার সুযোগ।',
    author: 'আলবার্ট আইনস্টাইন',
    designation: 'বিশ্ববিখ্যাত পদার্থবিজ্ঞানী',
  },
  {
    id: 9,
    quote: 'এমনভাবে শিখুন যেন আপনি চিরকাল বাঁচবেন, আর এমনভাবে বাঁচুন যেন কালই আপনার শেষ দিন।',
    author: 'মহাত্মা গান্ধী',
    designation: 'অহিংসার প্রবক্তা',
  },
  {
    id: 10,
    quote: 'মন তোর খাঁচায় বসত অচিন পাখি, কবে জানি উড়াল দেবে ফাঁকি দিয়া রে...',
    author: 'পাগলা কানাই',
    designation: 'ঝিনাইদহের মরমি চারণকবি',
  },
  {
    id: 11,
    quote: 'অন্যায় দেখে যে নীরব থাকে, সে অন্যায়কারীর সমান অপরাধী।',
    author: 'সক্রেটিস',
    designation: 'গ্রিক দার্শনিক',
  },
  {
    id: 12,
    quote: 'আমরা যদি একে অপরের পাশে দাঁড়াই, তবে যে কোনো কঠিন পথও সহজ হয়ে যায়।',
    author: 'মাদার তেরেসা',
    designation: 'মানবতার প্রতীক',
  },
];

export const MotivationalQuotesTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Changes every 12 seconds (between 10-15s as requested)
    const interval = setInterval(() => {
      handleNext();
    }, 12000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setIsFading(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length);
      setIsFading(false);
    }, 300);
  };

  const current = MOTIVATIONAL_QUOTES[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="flex items-center gap-2 w-full mx-auto px-3 py-1.5 rounded-full bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 transition-all text-xs text-slate-700 shadow-2xs"
      title="মনীষীদের অনুপ্রেরণামূলক উক্তি (প্রতি ১২ সেকেন্ড পর পরিবর্তনশীল)"
    >
      <div className="flex items-center gap-1.5 shrink-0 text-emerald-700">
        <Quote className="w-3.5 h-3.5 fill-emerald-600/30 text-emerald-700 shrink-0" />
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded-md hidden sm:inline">
          অনুপ্রেরণা
        </span>
      </div>

      <div
        className={`flex-1 min-w-0 transition-opacity duration-300 flex items-center justify-center sm:justify-start flex-wrap sm:flex-nowrap gap-1.5 text-center sm:text-left ${
          isFading ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'
        }`}
        title={`"${current.quote}" — ${current.author}`}
      >
        <span className="italic font-medium text-slate-800">“{current.quote}”</span>
        <span className="text-emerald-800 font-bold text-[11px] shrink-0 whitespace-nowrap">
          — {current.author}
        </span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={handlePrev}
          className="p-1 hover:text-emerald-900 hover:bg-emerald-200/50 rounded-full transition-colors cursor-pointer text-slate-500"
          aria-label="পূর্ববর্তী উক্তি"
          title="পূর্ববর্তী উক্তি"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={handleNext}
          className="p-1 hover:text-emerald-900 hover:bg-emerald-200/50 rounded-full transition-colors cursor-pointer text-slate-500"
          aria-label="পরবর্তী উক্তি"
          title="পরবর্তী উক্তি"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Member } from '../types';
import { Shield, Sparkles, UserPlus, LogIn, Heart, User, Compass } from 'lucide-react';

interface Props {
  activeSection: string;
  onSelectSection: (section: string) => void;
  currentUser: Member | null;
  onOpenUserAuth: () => void;
  isAdminLoggedIn: boolean;
  isAdminView: boolean;
  onOpenAdminLogin: () => void;
  onToggleAdminView: () => void;
  onOpenRegistration: () => void;
  onOpenArchitectureGuide: () => void;
  onOpenPrayerTimes: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  currentUser,
  onOpenUserAuth,
  isAdminLoggedIn,
  isAdminView,
  onOpenAdminLogin,
  onToggleAdminView,
  onOpenRegistration,
  onOpenArchitectureGuide,
  onOpenPrayerTimes,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand logo & name */}
        <div
          onClick={() => {
            if (isAdminView) onToggleAdminView();
            onSelectSection('directory');
          }}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
        >
          <div className="relative w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-600/80 p-0.5 shadow-sm overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/assets/jhenaidah-pigeon-logo.png"
              alt="শান্তির পায়রা লোগো - ঢাকাস্থ ঝিনাইদহ জেলার মানুষ"
              className="w-full h-full object-cover object-center rounded-full"
            />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group-hover:text-emerald-800 transition-colors">
            ঢাকাস্থ ঝিনাইদহ জেলার মানুষ
          </span>
        </div>

        {/* Zone 2: clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-3.5 text-xs font-medium text-slate-600">
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('directory');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isAdminView && activeSection === 'directory' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            সদস্য ডিরেক্টরি
          </button>
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('blood');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 ${
              !isAdminView && activeSection === 'blood' ? 'text-rose-700 font-bold' : ''
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>জরুরি রক্তদাতা</span>
          </button>
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('heritage');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isAdminView && activeSection === 'heritage' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            ঐতিহ্য ও কৃতি সন্তান
          </button>
          <button
            onClick={onOpenPrayerTimes}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-emerald-800 font-medium"
            title="৫ ওয়াক্ত নামাজের জামাতের সময়সূচি"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>নামাজ ও সময়সূচি</span>
          </button>
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('notices');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isAdminView && activeSection === 'notices' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            নোটিশ ও ইভেন্ট
          </button>
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('business');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isAdminView && activeSection === 'business' ? 'text-emerald-800 font-bold' : ''
            }`}
          >
            ব্যবসা ও ক্যারিয়ার
          </button>

          {currentUser && (
            <button
              onClick={() => {
                if (isAdminView) onToggleAdminView();
                onSelectSection('profile');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold ${
                !isAdminView && activeSection === 'profile'
                  ? 'text-emerald-700 underline decoration-2'
                  : 'text-emerald-800'
              }`}
            >
              আমার প্রোফাইল
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenArchitectureGuide}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="অ্যাপটির বিস্তারিত টেকনিক্যাল আইডিয়া ও কাঠামো দেখুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>আর্কিটেকচার</span>
          </button>

          {!isAdminView ? (
            <>
              {/* User Account / Profile Button */}
              {currentUser ? (
                <button
                  onClick={() => {
                    if (isAdminView) onToggleAdminView();
                    onSelectSection('profile');
                  }}
                  className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.fullName}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenUserAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                  <span>লগইন / সাইন-আপ</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    onToggleAdminView();
                  } else {
                    onOpenAdminLogin();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">এডমিন</span>
              </button>
            </>
          ) : (
            <button
              onClick={onToggleAdminView}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>ইউজার মোড</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

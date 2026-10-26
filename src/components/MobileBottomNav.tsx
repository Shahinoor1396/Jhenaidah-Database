import React from 'react';
import { Member } from '../types';
import { Users, Heart, Landmark, User, Shield, LogIn } from 'lucide-react';

interface Props {
  activeSection: string;
  onSelectSection: (section: string) => void;
  currentUser: Member | null;
  onOpenUserAuth: () => void;
  isAdminView: boolean;
  onToggleAdminView: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  currentUser,
  onOpenUserAuth,
  isAdminView,
  onToggleAdminView,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg no-print">
      <div className="grid grid-cols-5 items-center">
        {/* Tab 1: Directory */}
        <button
          onClick={() => {
            if (isAdminView) onToggleAdminView();
            onSelectSection('directory');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
            !isAdminView && activeSection === 'directory'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">ডিরেক্টরি</span>
        </button>

        {/* Tab 2: Blood */}
        <button
          onClick={() => {
            if (isAdminView) onToggleAdminView();
            onSelectSection('blood');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
            !isAdminView && activeSection === 'blood'
              ? 'text-rose-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${!isAdminView && activeSection === 'blood' ? 'fill-rose-600' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">রক্তদাতা</span>
        </button>

        {/* Tab 3: Heritage & Landmarks */}
        <button
          onClick={() => {
            if (isAdminView) onToggleAdminView();
            onSelectSection('heritage');
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
            !isAdminView && activeSection === 'heritage'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">ঐতিহ্য</span>
        </button>

        {/* Tab 4: Profile or Login */}
        {currentUser ? (
          <button
            onClick={() => {
              if (isAdminView) onToggleAdminView();
              onSelectSection('profile');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
              !isAdminView && activeSection === 'profile'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">প্রোফাইল</span>
          </button>
        ) : (
          <button
            onClick={onOpenUserAuth}
            className="min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl text-slate-500 hover:text-emerald-700 cursor-pointer"
          >
            <LogIn className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] tracking-tight mt-0.5">লগইন</span>
          </button>
        )}

        {/* Tab 5: Admin Switch */}
        <button
          onClick={() => {
            onToggleAdminView();
          }}
          className={`min-h-[48px] flex flex-col items-center justify-center p-1 rounded-xl transition-colors cursor-pointer ${
            isAdminView ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">
            {isAdminView ? 'ইউজার' : 'এডমিন'}
          </span>
        </button>
      </div>
    </div>
  );
};

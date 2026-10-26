import React from 'react';
import { X, CheckCircle, Database, Smartphone, Shield, DollarSign, Share2, Sparkles, Server } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                “ঢাকাস্থ ঝিনাইদহ জেলার মানুষ” অ্যাপ তৈরির পূর্ণাঙ্গ রূপরেখা ও আইডিয়া
              </h2>
              <p className="text-[11px] text-slate-500">
                ১০০০-১৫০০ সদস্যের কমিউনিটি ডিরেক্টরি বাস্তবায়নের টেকনিক্যাল ও ব্যবহারিক গাইড
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Best Tech Stack */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>১. কি ধরনের অ্যাপ তৈরি করা সবচেয়ে কার্যকর হবে?</span>
            </h3>
            <p>
              ১০০০–১৫০০ সদস্যের ফেসবুক গ্রুপের জন্য সবচেয়ে সাশ্রয়ী, দ্রুত এবং সহজে সবার কাছে পৌঁছানোর মাধ্যম হলো <strong>PWA (Progressive Web App) + ক্রস প্ল্যাটফর্ম মোবাইল ফ্রেমওয়ার্ক</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mt-2">
              <li>
                <strong>PWA মোবাইল ওয়েব অ্যাপ (সবচেয়ে সুপারিশকৃত):</strong> ফেসবুক গ্রুপে একটি সিঙ্গেল লিংক (যেমন: <code>jhenaidah-dhaka.com</code>) শেয়ার করবেন। মেম্বারদের প্লে-স্টোরে যেতে হবে না; লিংকে ঢুকলেই মোবাইলের হোম স্ক্রিনে "Install App" বা "Add to Home Screen" অপশন আসবে। অ্যান্ড্রয়েড ও আইফোন দুটিতেই হুবহু নেটিভ অ্যাপের মতো চলবে।
              </li>
              <li>
                <strong>Flutter বা React Native (যদি প্লে-স্টোর ফাইল জরুরি হয়):</strong> একই কোডবেস দিয়ে গুগল প্লে-স্টোর (.apk) এবং অ্যাপল অ্যাপস্টোরের জন্য বিল্ড করা সম্ভব।
              </li>
            </ul>
          </div>

          {/* Section 2: Two Panels Structure */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>২. এডমিন প্যানেল ও ইউজার প্যানেলের কাজের বিভাজন</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-1.5 text-emerald-700">
                  📱 ইউজার প্যানেল (সাধারণ সদস্য ও পাবলিক)
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• ঝিনাইদহের ৬টি উপজেলা অনুযায়ী দ্রুত মেম্বার সার্চ</li>
                  <li>• ঢাকার এলাকাভিত্তিক (মিরপুর, উত্তরা, ইত্যাদি) ফিল্টার</li>
                  <li>• জরুরি রক্তদাতা সন্ধান ও সরাসরি ১-ট্যাপ কল/হোয়াটসঅ্যাপ</li>
                  <li>• নতুন সদস্য নিবন্ধন ফর্ম ও ফটো আপলোড</li>
                  <li>• নিজস্ব ডিজিটাল মেম্বারশিপ কার্ড ও কিউআর আইডি প্রদর্শন</li>
                  <li>• সমিতি বা ফোরামের জরুরি নোটিশ ও ইভেন্ট দর্শন</li>
                  <li>• ঝিনাইদহবাসীর ব্যবসায়িক পণ্য ও ক্যারিয়ার নিয়োগের পোস্ট</li>
                </ul>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-1.5 text-slate-900">
                  🔐 এডমিন প্যানেল (মডারেটর ও কার্যনির্বাহী পরিষদ)
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• সিকিউর পাসওয়ার্ড / ওটিপি / পিন অথেনটিকেশন</li>
                  <li>• নতুন আবেদন রিভিউ, অনুমোদন (Approve) বা রিজেক্ট</li>
                  <li>• ভুল তথ্য থাকলে সংশোধন ও ফেক মেম্বার মুছে ফেলা</li>
                  <li>• এক্সেল (CSV) ও JSON ফরম্যাটে ১-ক্লিকে ডেটা ব্যাকআপ</li>
                  <li>• নোটিশ প্রকাশনা ও ব্যানার আপডেট</li>
                  <li>• গ্রুপ ব্রডকাস্ট মেসেজ জেনারেটর (হোয়াটসঅ্যাপ ও এফবি)</li>
                  <li>• উপজেলা ও রক্তদাতার রিয়েলটাইম অ্যানালিটিক্স গ্রাফ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Database & Hosting Costs */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-700" />
              <span>৩. ডাটাবেস ও খরচের হিসাব (১০০০–১৫০০ সদস্যের জন্য)</span>
            </h3>
            <p>
              ১০০০ থেকে ১৫০০ মানুষের টেক্সট ও ফটো ডাটাবেসের সাইজ বড়জোর ৫০ মেগাবাইট থেকে ১০০ মেগাবাইট। এর জন্য কোনো বড় ব্যয়বহুল সার্ভার নেওয়ার প্রয়োজন নেই:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2 text-[11px]">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">Firebase Firestore</span>
                <span className="text-emerald-700 font-semibold block mt-0.5">১০০% ফ্রি টিয়ার পর্যাপ্ত</span>
                <p className="text-slate-500 mt-1">প্রতিদিন ৫০,০০০ রিড এবং ২০,০০০ রাইট ফ্রি। ১৫০০ সদস্যের জন্য এটি আজীবন ফ্রিতে চালানো সম্ভব।</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">Cloud SQL / PostgreSQL</span>
                <span className="text-blue-700 font-semibold block mt-0.5">রিলেশনাল ও ব্যাকআপ ফ্রেন্ডলি</span>
                <p className="text-slate-500 mt-1">Drizzle ORM দিয়ে ফুল রিলেশনাল ডাটা সংরক্ষণ ও এক্সেলে এক্সপোর্ট করা অত্যন্ত সহজ।</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">ডোমেইন খরচ (ঐচ্ছিক)</span>
                <span className="text-amber-700 font-semibold block mt-0.5">৳ ১,০০০ - ১,২০০ / বছর</span>
                <p className="text-slate-500 mt-1">একটি সুন্দর ডটকম ডোমেইন (যেমন: jhenaidahdhaka.com) বা ফ্রি ক্লাউড সাবডোমেইনেই পরিচালিত হতে পারে।</p>
              </div>
            </div>
          </div>

          {/* Section 4: Privacy & Security */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-700" />
              <span>৪. তথ্য সংরক্ষণ ও গোপনীয়তা রক্ষার বিশেষ টিপস</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>ফোন নম্বর সুরক্ষা:</strong> ইউজারদের অপশন থাকবে তারা কি তাদের ফোন নম্বর সবার জন্য দৃশ্যমান রাখবেন নাকি কেবল এডমিন ও জরুরি রক্তদানের সময়ে কল করার জন্য রাখবেন।
              </li>
              <li>
                <strong>মেম্বার কোড সিস্টেম:</strong> প্রত্যেক সদস্যকে একটি স্বয়ংক্রিয় ইউনিক কোড (যেমন: <code>JHD-DHK-1001</code>) দেওয়া হবে, যা দিয়ে ফেসবুক গ্রুপে ও অফলাইন ইভেন্টে সহজেই পরিচয় নিশ্চিত করা যাবে।
              </li>
              <li>
                <strong>নিয়মিত এক্সেল ব্যাকআপ:</strong> প্রতি সপ্তাহে বা মাসে এডমিন প্যানেল থেকে একটি ক্লিকেই সম্পূর্ণ ডাটাবেস এক্সেল ফাইলে সেভ করে কমিটির গুগল ড্রাইভে ব্যাকআপ রাখা যাবে।
              </li>
            </ul>
          </div>

          {/* Section 5: Summary */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
            <h4 className="font-bold text-xs mb-1">💡 আপনার তৈরি করা অ্যাপের বর্তমান অবস্থা:</h4>
            <p className="text-[11px] leading-relaxed">
              আমরা ইতিমধ্যে আপনার জন্য এই অ্যাপটির একটি পূর্ণাঙ্গ, রিয়েল-টাইম কার্যকর সংস্করণ তৈরি করে দিয়েছি! আপনি এখনই উপরের <strong>"এডমিন প্যানেল"</strong> বাটনে ক্লিক করে (পিন: <strong>1971</strong> দিয়ে) ড্যাশবোর্ড, অনুমোদন, মেম্বার এডিট, এক্সেল ডাউনলোড ও ব্রডকাস্ট পরীক্ষা করতে পারবেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

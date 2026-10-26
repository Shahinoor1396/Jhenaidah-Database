import React, { useState } from 'react';
import { Notice } from '../types';
import { Bell, Calendar, MapPin, User, Tag, Plus, CheckCircle2 } from 'lucide-react';

interface Props {
  notices: Notice[];
  isAdmin?: boolean;
  onAddNotice?: (notice: Omit<Notice, 'id' | 'date'>) => void;
  onDeleteNotice?: (id: string) => void;
}

export const NoticeBoard: React.FC<Props> = ({ notices, isAdmin, onAddNotice, onDeleteNotice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'ইভেন্ট' as Notice['category'],
    content: '',
    eventDate: '',
    eventLocation: '',
    author: 'কার্যনির্বাহী পরিষদ',
    isImportant: false,
  });

  const filteredNotices = notices.filter(
    (n) => selectedCategory === 'ALL' || n.category === selectedCategory
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    onAddNotice?.(newNotice);
    setShowAddModal(false);
    setNewNotice({
      title: '',
      category: 'ইভেন্ট',
      content: '',
      eventDate: '',
      eventLocation: '',
      author: 'কার্যনির্বাহী পরিষদ',
      isImportant: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">কমিউনিটি নোটিশ ও ইভেন্ট বোর্ড</h2>
          <p className="text-xs text-slate-500">
            ঢাকাস্থ ঝিনাইদহ জেলার মানুষের আসন্ন সম্মেলন, ইভেন্ট ও গুরুত্বপূর্ণ নোটিশ
          </p>
        </div>

        {isAdmin && onAddNotice && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন নোটিশ প্রকাশ করুন</span>
          </button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'ইভেন্ট', 'জরুরি বিজ্ঞপ্তি', 'সাধারণ নোটিশ', 'শোকবার্তা'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'সকল নোটিশ' : cat}
          </button>
        ))}
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              notice.isImportant
                ? 'border-emerald-300 ring-1 ring-emerald-100 shadow-sm'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">{notice.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{notice.date}</span>
                  {notice.author && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>প্রকাশনায়: {notice.author}</span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {notice.title}
                </h3>
              </div>

              {isAdmin && onDeleteNotice && (
                <button
                  onClick={() => onDeleteNotice(notice.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer shrink-0"
                >
                  মুছুন
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>

            {(notice.eventDate || notice.eventLocation) && (
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                {notice.eventDate && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>তারিখ ও সময়:</strong> {notice.eventDate}</span>
                  </div>
                )}
                {notice.eventLocation && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span><strong>স্থান:</strong> {notice.eventLocation}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">নতুন নোটিশ / ইভেন্ট তৈরি করুন</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">নোটিশের শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ইফতার ও দোয়া মাহফিল ২০২৬"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as Notice['category'] })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="ইভেন্ট">ইভেন্ট</option>
                    <option value="জরুরি বিজ্ঞপ্তি">জরুরি বিজ্ঞপ্তি</option>
                    <option value="সাধারণ নোটিশ">সাধারণ নোটিশ</option>
                    <option value="শোকবার্তা">শোকবার্তা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">প্রকাশকের নাম/পদবী</label>
                  <input
                    type="text"
                    value={newNotice.author}
                    onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">নোটিশের বিস্তারিত বিবরণ</label>
                <textarea
                  rows={4}
                  required
                  placeholder="বিস্তারিত তথ্য লিখুন..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ইভেন্ট তারিখ ও সময় (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ১৫ নভেম্বর, ২০২৬ বিকাল ৪টা"
                    value={newNotice.eventDate}
                    onChange={(e) => setNewNotice({ ...newNotice, eventDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ইভেন্টের স্থান (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ধানমন্ডি কমিউনিটি সেন্টার"
                    value={newNotice.eventLocation}
                    onChange={(e) => setNewNotice({ ...newNotice, eventLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

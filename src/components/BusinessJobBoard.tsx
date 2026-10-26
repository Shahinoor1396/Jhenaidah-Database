import React, { useState } from 'react';
import { CommunityPost, JhenaidahUpazila } from '../types';
import { UPAZILAS } from '../data/mockData';
import { Briefcase, ShoppingBag, Plus, Phone, MapPin, Tag, Calendar, UserCheck } from 'lucide-react';

interface Props {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'date'>) => void;
}

export const BusinessJobBoard: React.FC<Props> = ({ posts, onAddPost }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'business' | 'job' | 'service'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    type: 'business' as CommunityPost['type'],
    providerName: '',
    providerUpazila: 'ঝিনাইদহ সদর' as JhenaidahUpazila,
    dhakaLocation: '',
    phone: '',
    details: '',
    priceOrSalary: '',
  });

  const filteredPosts = posts.filter((p) => (activeTab === 'all' ? true : p.type === activeTab));

  const handleCall = (_phone: string) => {
    // Direct call redirect disabled on public site
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.providerName || !newPost.phone) return;
    onAddPost(newPost);
    setShowAddModal(false);
    setNewPost({
      title: '',
      type: 'business',
      providerName: '',
      providerUpazila: 'ঝিনাইদহ সদর',
      dhakaLocation: '',
      phone: '',
      details: '',
      priceOrSalary: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">ব্যবসা, ক্যারিয়ার ও সেবা সংযোগ</h2>
          <p className="text-xs text-slate-500">
            ঝিনাইদহের সদস্যদের ব্যবসা প্রসার, চাকরি নিয়োগ ও পেশাগত সেবা
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অফার বা বিজ্ঞপ্তি দিন</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          সকল তালিকা ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'business' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          পণ্য ও ব্যবসা
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'job' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          চাকরি ও নিয়োগ
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'service' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          পেশাগত সেবা
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-800">
                  {post.type === 'business'
                    ? 'পণ্য ও ব্যবসা'
                    : post.type === 'job'
                    ? 'চাকরি নিয়োগ'
                    : 'পেশাগত সেবা'}
                </span>
                <span>{post.date}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">{post.title}</h3>

              <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-slate-700">{post.providerName}</span>
                <span aria-hidden="true">·</span>
                <span>{post.providerUpazila}</span>
                <span aria-hidden="true">·</span>
                <span>{post.dhakaLocation}</span>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                {post.details}
              </p>

              {post.priceOrSalary && (
                <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg inline-block">
                  {post.priceOrSalary}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">নম্বর গোপন</span>
              <button
                onClick={() => handleCall(post.phone)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>যোগাযোগ করুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">নতুন ব্যবসা বা চাকরির পোস্ট দিন</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঝিনাইদহের খাঁটি মিষ্টি ও ঘি ঢাকায় ডেলিভারি"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({ ...newPost, type: e.target.value as CommunityPost['type'] })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="business">পণ্য ও ব্যবসা</option>
                    <option value="job">চাকরি ও নিয়োগ</option>
                    <option value="service">পেশাগত সেবা</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ঝিনাইদহ উপজেলা</label>
                  <select
                    value={newPost.providerUpazila}
                    onChange={(e) => setNewPost({ ...newPost, providerUpazila: e.target.value as JhenaidahUpazila })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    {UPAZILAS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">আপনার নাম / প্রতিষ্ঠান</label>
                  <input
                    type="text"
                    required
                    placeholder="নাম লিখুন"
                    value={newPost.providerName}
                    onChange={(e) => setNewPost({ ...newPost, providerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={newPost.phone}
                    onChange={(e) => setNewPost({ ...newPost, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ঢাকার লোকেশন</label>
                  <input
                    type="text"
                    placeholder="যেমন: মিরপুর ১০, ঢাকা"
                    value={newPost.dhakaLocation}
                    onChange={(e) => setNewPost({ ...newPost, dhakaLocation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">মূল্য বা বেতন স্কেল (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ২০,০০০ - ২৫,০০০ টাকা"
                    value={newPost.priceOrSalary}
                    onChange={(e) => setNewPost({ ...newPost, priceOrSalary: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  required
                  placeholder="পণ্য বা চাকরির যোগ্যতা সম্পর্কে বিস্তারিত লিখুন..."
                  value={newPost.details}
                  onChange={(e) => setNewPost({ ...newPost, details: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
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
                  পোস্ট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

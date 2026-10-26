import React, { useState, useMemo } from 'react';
import { Member, Notice, JhenaidahUpazila, BloodGroup, ProfessionCategory } from '../types';
import { UPAZILAS, DHAKA_AREAS } from '../data/mockData';
import {
  Users,
  UserCheck,
  Clock,
  Heart,
  FileSpreadsheet,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  MessageSquare,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Award,
  Phone,
  Globe,
} from 'lucide-react';
import { exportMembersToCSV, exportMembersToJSON, resetToDefaultData } from '../utils/storage';

interface Props {
  members: Member[];
  notices: Notice[];
  onUpdateMember: (m: Member) => void;
  onDeleteMember: (id: string) => void;
  onSetMemberStatus: (id: string, status: 'verified' | 'pending' | 'rejected') => void;
  onAddMember: (m: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>) => void;
  onAddNotice: (n: Omit<Notice, 'id' | 'date'>) => void;
  onDeleteNotice: (id: string) => void;
  onResetData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  members,
  notices,
  onUpdateMember,
  onDeleteMember,
  onSetMemberStatus,
  onAddMember,
  onAddNotice,
  onDeleteNotice,
  onResetData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'members' | 'backup' | 'broadcast'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [broadcastTemplate, setBroadcastTemplate] = useState<'blood' | 'picnic' | 'meeting'>('picnic');
  const [broadcastCustomText, setBroadcastCustomText] = useState('');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Analytics
  const totalCount = members.length;
  const verifiedCount = members.filter((m) => m.status === 'verified').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const donorCount = members.filter((m) => m.isBloodDonor).length;

  const pendingMembers = useMemo(() => members.filter((m) => m.status === 'pending'), [members]);

  // Upazila distribution
  const upazilaStats = useMemo(() => {
    return UPAZILAS.map((u) => ({
      name: u,
      count: members.filter((m) => m.upazila === u).length,
    }));
  }, [members]);

  // Dhaka Area distribution top 5
  const areaStats = useMemo(() => {
    const counts: { [key: string]: number } = {};
    members.forEach((m) => {
      counts[m.dhakaArea] = (counts[m.dhakaArea] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [members]);

  // Filtered members for member table
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.memberCode.toLowerCase().includes(q) ||
        m.upazila.toLowerCase().includes(q) ||
        m.dhakaArea.toLowerCase().includes(q) ||
        m.occupationCategory.toLowerCase().includes(q)
      );
    });
  }, [members, searchQuery]);

  // Broadcast text generator
  const getBroadcastMessage = () => {
    if (broadcastTemplate === 'picnic') {
      return `🎉 ঢাকাস্থ ঝিনাইদহ জেলার মানুষ - বার্ষিক পারিবারিক মিলনমেলা ও বনভোজন\n\nআসসালামু আলাইকুম প্রিয় ঝিনাইদহবাসী ভাই ও বোনেরা,\nঢাকার যান্ত্রিক জীবনের ক্লান্তি কাটিয়ে একে অপরের সাথে বন্ধন সুদৃঢ় করতে আগামী ১২ ডিসেম্বর আমাদের বার্ষিক মিলনমেলা অনুষ্ঠিত হতে যাচ্ছে!\n\n📍 স্থান: ছুটি রিসোর্ট, গাজীপুর\n📅 তারিখ: ১২ ডিসেম্বর, ২০২৬ (সকাল ৮টা - সন্ধ্যা ৬টা)\n\nরেজিস্ট্রেশন করতে ও ডিজিটাল মেম্বারশিপ কার্ড দেখতে আমাদের অ্যাপ ভিজিট করুন।\nধন্যবাদান্তে,\nকার্যনির্বাহী কমিটি, ঢাকাস্থ ঝিনাইদহ ফোরাম।`;
    } else if (broadcastTemplate === 'blood') {
      return `🚨 জরুরি রক্তের আবেদন - ঢাকাস্থ ঝিনাইদহ ব্লাড সেল\n\nআসসালামু আলাইকুম,\nঢাকা শহরের হাসপাতালে চিকিৎসাধীন আমাদের একজন ঝিনাইদহবাসীর জন্য জরুরি ভিত্তিতে রক্তের প্রয়োজন।\n\n🩸 রক্তের গ্রুপ: [গ্রুপ উল্লেখ করুন]\n🏥 হাসপাতাল: [হাসপাতালের নাম]\n📞 সমন্বয়কারী নম্বর: 01711223344\n\nআপনি যদি এই গ্রুপের রক্তদাতা হন, দয়া করে দ্রুত যোগাযোগ করুন। ধন্যবাদ!`;
    } else {
      return `📢 ঢাকাস্থ ঝিনাইদহ ফোরামের মাসিক সাধারণ সভা\n\nআসসালামু আলাইকুম,\nআগামী শুক্রবার সন্ধ্যা ৭:০০ টায় আমাদের ঢাকা কেন্দ্রীয় কার্যালয়ে (মিরপুর-২) ফোরামের অগ্রগতি ও নতুন সদস্য যাচাই নিয়ে সাধারণ সভা অনুষ্ঠিত হবে। সকল উপজেলার প্রতিনিধিদের উপস্থিত থাকার জন্য অনুরোধ জানানো যাচ্ছে।`;
    }
  };

  const handleCopyBroadcast = () => {
    const text = broadcastCustomText || getBroadcastMessage();
    navigator.clipboard.writeText(text);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold tracking-tight">এডমিন কন্ট্রোল সেন্টার</h2>
          </div>
          <p className="text-xs text-slate-300">
            ঢাকাস্থ ঝিনাইদহ জেলার মানুষ — সদস্য ডাটাবেস, অনুমোদন ও নোটিশ পরিচালনা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportMembersToCSV(members)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
            title="Excel-friendly CSV এক্সপোর্ট"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>এক্সেল (CSV) এক্সপোর্ট</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            ইউজার মোডে ফিরুন
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>পরিসংখ্যান ও ওভারভিউ</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>নতুন আবেদন যাচাই ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>সদস্য তালিকা ও সম্পাদনা ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'broadcast'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>গ্রুপ বার্তা প্রস্তুতকারক</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>ব্যাকআপ ও রিস্টোর</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">মোট নিবন্ধিত সদস্য</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {totalCount}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">১০০০-১৫০০ লক্ষ্যমাত্রা</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-emerald-600 font-medium">অনুমোদিত সক্রিয় সদস্য</p>
              <p className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                {verifiedCount}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">ডিজিটাল আইডি সক্রিয়</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-amber-600 font-medium">অপেক্ষমাণ আবেদন</p>
              <p className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
                {pendingCount}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">যাচাইয়ের অপেক্ষায়</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <p className="text-xs text-rose-600 font-medium">সক্রিয় রক্তদাতা</p>
              <p className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
                {donorCount}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">জরুরি সেবায় প্রস্তুত</p>
            </div>
          </div>

          {/* Upazila Distribution & Dhaka Area Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upazila Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                ঝিনাইদহ উপজেলাভিত্তিক সদস্য সংখ্যা
              </h3>
              <div className="space-y-3">
                {upazilaStats.map((item) => {
                  const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {item.count} জন ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dhaka Area Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                ঢাকার প্রধান এলাকায় ঝিনাইদহবাসীর বসবাস
              </h3>
              <div className="space-y-3">
                {areaStats.slice(0, 6).map((item) => {
                  const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {item.count} জন ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pending Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>নতুন আবেদন যাচাই ও অনুমোদন তালিকা</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingMembers.length} জন অপেক্ষমাণ
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                নতুন নিবন্ধিত সদস্যদের ডাটা যাচাই করুন। 'অনুমোদন করুন' বাটনে চাপলে সদস্য ডিরেক্টরি এবং রক্তদাতা তালিকায় তাৎক্ষণিক শো হবে।
              </p>
            </div>
          </div>

          {/* Action Success / Reject Banner */}
          {actionFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{actionFeedback}</span>
            </div>
          )}

          {/* Explanatory Info Card */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 text-blue-900 rounded-2xl text-xs flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <strong className="text-blue-950">যাচাইকরণ প্রক্রিয়া:</strong> ওয়েবসাইটে নতুন কোনো সদস্য একাউন্ট তৈরি ও তথ্য আপলোড করলে নিরাপত্তার স্বার্থে সরাসরি ডিরেক্টরিতে প্রকাশিত হয় না। এডমিন কর্তৃক এখানে 'অনুমোদন' নিশ্চিত করার পরই তাদের প্রোফাইল ও রক্তদাতার তথ্য ওয়েবসাইটে সকলের জন্য উন্মুক্ত হয়।
            </div>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">বর্তমানে কোনো নতুন অপেক্ষমাণ আবেদন নেই!</h4>
              <p className="text-xs text-slate-500">
                সকল সদস্যপদ ইতিমধ্যে যাচাই ও অনুমোদিত হয়ে মূল ডিরেক্টরিতে যুক্ত রয়েছে।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-200/90 shadow-sm flex flex-col lg:flex-row lg:items-start justify-between gap-5 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-2.5 flex-1">
                    {/* Header Row */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          m.fullName.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{m.fullName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            পেন্ডিং আবেদন
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          আইডি: {m.memberCode} · আবেদন তারিখ: {m.joinedDate}
                        </p>
                      </div>
                    </div>

                    {/* Member Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">মোবাইল নম্বর:</span>
                        <a href={`tel:${m.phone}`} className="font-mono font-bold text-slate-800 hover:text-emerald-700">
                          {m.phone}
                        </a>
                      </div>

                      {m.email && (
                        <div>
                          <span className="text-slate-400 block text-[10px]">জিমেইল / ইমেইল:</span>
                          <span className="font-mono text-slate-800 truncate block">{m.email}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 block text-[10px]">রক্তের গ্রুপ:</span>
                        <span className="font-bold text-rose-600">{m.bloodGroup}</span>
                        {m.isBloodDonor && (
                          <span className="ml-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-medium">
                            রক্তদাতা
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">ঝিনাইদহের স্থায়ী ঠিকানা:</span>
                        <span className="font-medium text-slate-800">{m.upazila} (গ্রাম: {m.unionOrVillage})</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">ঢাকার বর্তমান ঠিকানা:</span>
                        <span className="font-medium text-slate-800">{m.dhakaArea} {m.dhakaAddress ? `(${m.dhakaAddress})` : ''}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">পেশা ও পদবী:</span>
                        <span className="font-medium text-slate-800">
                          {m.occupationCategory} {m.professionDetails ? `· ${m.professionDetails}` : ''}
                        </span>
                      </div>
                    </div>

                    {m.emergencyContact && m.emergencyContact !== m.phone && (
                      <p className="text-[11px] text-slate-500">
                        জরুরি যোগাযোগ: <strong className="font-mono text-slate-700">{m.emergencyContact}</strong>
                      </p>
                    )}

                    {m.note && (
                      <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <strong>আবেদনের নোট:</strong> {m.note}
                      </p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => {
                        onSetMemberStatus(m.id, 'verified');
                        setActionFeedback(`সদস্য "${m.fullName}" সফলভাবে অনুমোদিত হয়েছে এবং সদস্য ডিরেক্টরিতে প্রকাশিত হয়েছে!`);
                        setTimeout(() => setActionFeedback(null), 4000);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                      title="অনুমোদন করে ওয়েবসাইটের সদস্য ডিরেক্টরিতে প্রকাশ করুন"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>অনুমোদন করুন</span>
                    </button>

                    <button
                      onClick={() => {
                        onSetMemberStatus(m.id, 'rejected');
                        setActionFeedback(`সদস্য "${m.fullName}" এর আবেদন বাতিল করা হয়েছে।`);
                        setTimeout(() => setActionFeedback(null), 4000);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      title="আবেদনটি বাতিল করুন"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>বাতিল</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Member List & Editing */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="নাম, ফোন নম্বর, উপজেলা বা ঢাকা এলাকা দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>সরাসরি সদস্য যোগ করুন</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">কোড</th>
                    <th className="py-3 px-4">নাম ও পিতার নাম</th>
                    <th className="py-3 px-4">ফোন নম্বর</th>
                    <th className="py-3 px-4">রক্তের গ্রুপ</th>
                    <th className="py-3 px-4">উপজেলা</th>
                    <th className="py-3 px-4">ঢাকার এলাকা</th>
                    <th className="py-3 px-4">পেশা</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {m.memberCode}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 text-emerald-800">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt={m.fullName} className="w-full h-full object-cover" />
                            ) : (
                              m.fullName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{m.fullName}</div>
                            {m.facebookProfile && (
                              <span className="text-[10px] text-blue-600 block">FB: {m.facebookProfile}</span>
                            )}
                            {m.isExecutiveMember && (
                              <div className="text-[10px] text-amber-700 font-medium">★ {m.executiveDesignation}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap">{m.phone}</td>
                      <td className="py-3 px-4 font-bold text-rose-600 whitespace-nowrap">
                        {m.bloodGroup} {m.isBloodDonor && <span className="text-[10px] text-emerald-600">(দাতা)</span>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{m.upazila}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{m.dhakaArea}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{m.occupationCategory}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {m.status === 'verified' ? (
                          <span className="text-emerald-700 font-medium">অনুমোদিত</span>
                        ) : m.status === 'pending' ? (
                          <span className="text-amber-700 font-medium">অপেক্ষমাণ</span>
                        ) : (
                          <span className="text-rose-600 font-medium">বাতিল</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingMember(m)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`${m.fullName}-কে ডাটাবেস থেকে মুছে ফেলতে চান?`)) {
                                onDeleteMember(m.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Broadcast Generator */}
      {activeTab === 'broadcast' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              গ্রুপ ব্রডকাস্ট বার্তা প্রস্তুতকারক (হোয়াটসঅ্যাপ ও ফেসবুক)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ১০০০-১৫০০ সদস্যের ফেসবুক গ্রুপ বা হোয়াটসঅ্যাপ কমিউনিটিতে সহজে ঘোষণা পাঠাতে রেডিমেড টেমপ্লেট ব্যবহার করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setBroadcastTemplate('picnic');
                setBroadcastCustomText('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                broadcastTemplate === 'picnic'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              বার্ষিক বনভোজন ও মিলনমেলা
            </button>
            <button
              onClick={() => {
                setBroadcastTemplate('blood');
                setBroadcastCustomText('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                broadcastTemplate === 'blood'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              জরুরি রক্তের আবেদন
            </button>
            <button
              onClick={() => {
                setBroadcastTemplate('meeting');
                setBroadcastCustomText('');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                broadcastTemplate === 'meeting'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সাধারণ সভা নোটিশ
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">বার্তার খসড়া (সম্পাদনাযোগ্য):</label>
            <textarea
              rows={8}
              value={broadcastCustomText || getBroadcastMessage()}
              onChange={(e) => setBroadcastCustomText(e.target.value)}
              className="w-full p-3.5 text-xs font-sans border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyBroadcast}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              {copiedBroadcast ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>বার্তা ক্লিপবোর্ডে কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>কপি করুন (গ্রুপে পেস্ট করতে)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">ডেটা ব্যাকআপ ও এক্সপোর্ট/ইমপোর্ট</h3>
            <p className="text-xs text-slate-500 mt-1">
              সদস্যদের পূর্ণাঙ্গ তথ্য এক্সেলে সংরক্ষণ করুন অথবা সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-800 text-xs">Excel (CSV) এক্সপোর্ট</h4>
              <p className="text-[11px] text-slate-500">
                বাংলা ফন্ট যাতে এক্সেলে নষ্ট না হয় (UTF-8 BOM যুক্ত) সেই ফরম্যাটে ফুল মেম্বার ডাটাবেস ডাউনলোড হবে।
              </p>
              <button
                onClick={() => exportMembersToCSV(members)}
                className="w-full py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                CSV ফাইল ডাউনলোড করুন
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-semibold text-slate-800 text-xs">JSON ফুল সিস্টেম ব্যাকআপ</h4>
              <p className="text-[11px] text-slate-500">
                অন্য কোনো সার্ভার বা নতুন ডিভাইসে ডাটা রিস্টোর করার জন্য আদর্শ ফুল ফরম্যাট।
              </p>
              <button
                onClick={() => exportMembersToJSON(members)}
                className="w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                JSON ব্যাকআপ ডাউনলোড
              </button>
            </div>

            <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-3">
              <h4 className="font-semibold text-rose-800 text-xs">ডেমো ডাটা রিস্টোর</h4>
              <p className="text-[11px] text-rose-600">
                সকল ৬টি উপজেলার প্রতিনিধিত্বমূলক সদস্য সহ ডিফল্ট ডেমো ডাটায় রিসেট করুন।
              </p>
              <button
                onClick={() => {
                  if (window.confirm('আপনি কি ডিফল্ট ডেমো ডাটায় রিসেট করতে চান?')) {
                    onResetData();
                  }
                }}
                className="w-full py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors cursor-pointer"
              >
                ডিফল্ট ডাটায় রিসেট করুন
              </button>
            </div>
          </div>

          {/* Web Hosting & Deployment Guide */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  ওয়েবসাইট হোস্টিং ও লাইভ ডেপ্লয়মেন্ট গাইড (Netlify, GitHub Pages & cPanel)
                </h4>
                <p className="text-[11px] text-slate-500">
                  কোনো মাসিক খরচ ছাড়াই সম্পূর্ণ ফ্রিতে আপনার ওয়েবসাইট ইন্টারনেটে প্রকাশ করার ধাপসমূহ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Option 1: Netlify */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">১. Netlify (সবচেয়ে সহজ - ফ্রি)</span>
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded font-medium">সুপারিশকৃত</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                  <li>টার্মিনালে <code className="bg-white px-1 py-0.5 rounded border border-emerald-200 text-emerald-800">npm run build</code> কমান্ড দিন।</li>
                  <li>প্রোজেক্ট ফোল্ডারে তৈরি হওয়া <code className="font-bold text-slate-800">dist</code> ফোল্ডারটি ব্রাউজারে <strong className="text-emerald-800">app.netlify.com/drop</strong> পেজে ড্র্যাগ করে ছেড়ে দিন।</li>
                  <li>মুহূর্তেই আপনার ওয়েবসাইট লাইভ হয়ে যাবে এবং ফ্রি SSL সিকিউরিটি পাবেন।</li>
                </ol>
              </div>

              {/* Option 2: cPanel Hosting */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">২. cPanel / যেকোনো ওয়েব হোস্টিং</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">কাস্টম ডোমেইন</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                  <li><code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-800">npm run build</code> চালানোর পর <code className="font-bold text-slate-800">dist</code> ফোল্ডারটিকে জিপ (zip) করুন।</li>
                  <li>cPanel ফাইল ম্যানেজারে গিয়ে <code className="font-bold text-slate-800">public_html</code> ফোল্ডারে জিপটি আপলোড করে Extract করুন।</li>
                  <li>আপনার ডোমেইনে (যেমন: jhenaidah-dhaka.org) ওয়েবসাইট সরাসরি চালু হয়ে যাবে।</li>
                </ol>
              </div>

              {/* Option 3: Future Mobile App Conversion */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">৩. ভবিষ্যতে মোবাইল অ্যাপ তৈরি</span>
                  <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-medium">Android APK</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  এই ওয়েবসাইটটি ১০০% রেসপন্সিভ ও PWA অনুসারী। পরবর্তীতে যেকোনো সময় <strong className="text-blue-900">Capacitor</strong> টুল দিয়ে মাত্র ১৫ মিনিটে গুগল প্লে-স্টোরের জন্য <strong>Android APK</strong> ও অ্যাপস্টোরের জন্য বিল্ড করা সম্ভব।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              সদস্য তথ্য সম্পাদনা: {editingMember.fullName}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={editingMember.fullName}
                  onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">রক্তের গ্রুপ</label>
                  <input
                    type="text"
                    value={editingMember.bloodGroup}
                    onChange={(e) => setEditingMember({ ...editingMember, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ঝিনাইদহ উপজেলা</label>
                  <select
                    value={editingMember.upazila}
                    onChange={(e) => setEditingMember({ ...editingMember, upazila: e.target.value as JhenaidahUpazila })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {UPAZILAS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ঢাকার এলাকা</label>
                  <input
                    type="text"
                    value={editingMember.dhakaArea}
                    onChange={(e) => setEditingMember({ ...editingMember, dhakaArea: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ফেসবুক প্রোফাইল লিংক</label>
                  <input
                    type="text"
                    placeholder="facebook.com/username"
                    value={editingMember.facebookProfile || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, facebookProfile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">প্রোফাইল ছবি (আপলোড করুন)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-member-photo-input"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditingMember({ ...editingMember, avatarUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-member-photo-input"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg cursor-pointer border border-emerald-200"
                    >
                      ছবি নির্বাচন
                    </label>
                    {editingMember.avatarUrl && (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={editingMember.avatarUrl}
                          alt=""
                          className="w-7 h-7 rounded-md object-cover border border-slate-300"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingMember({ ...editingMember, avatarUrl: '' })}
                          className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                        >
                          মুছুন
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">পেশাগত পদবী ও কর্মক্ষেত্র</label>
                <input
                  type="text"
                  value={editingMember.professionDetails}
                  onChange={(e) => setEditingMember({ ...editingMember, professionDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMember.isExecutiveMember || false}
                    onChange={(e) => setEditingMember({ ...editingMember, isExecutiveMember: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">কার্যনির্বাহী পরিষদ / উপদেষ্টা সদস্য</span>
                </label>
                {editingMember.isExecutiveMember && (
                  <input
                    type="text"
                    placeholder="কমিটির পদবী (যেমন: সহ-সভাপতি)"
                    value={editingMember.executiveDesignation || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, executiveDesignation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingMember(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onUpdateMember(editingMember);
                  setEditingMember(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directly Add Member Modal for Admin */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              এডমিন দ্বারা সরাসরি সদস্য এন্ট্রি
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              সরাসরি অনুমোদিত স্ট্যাটাসে ডাটাবেসে যোগ হবে।
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                onAddMember({
                  fullName: form.fullName.value,
                  phone: form.phone.value,
                  bloodGroup: form.bloodGroup.value,
                  isBloodDonor: form.isBloodDonor.checked,
                  upazila: form.upazila.value,
                  unionOrVillage: form.unionOrVillage.value || 'সদর',
                  dhakaArea: form.dhakaArea.value,
                  dhakaAddress: form.dhakaAddress.value || form.dhakaArea.value,
                  occupationCategory: form.occupationCategory.value,
                  professionDetails: form.professionDetails.value,
                  emergencyContact: form.emergencyContact.value,
                  facebookProfile: form.facebookProfile.value || undefined,
                  avatarUrl: form.avatarUrl.value || undefined,
                  status: 'verified',
                });
                setShowAddMemberModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">পূর্ণ নাম *</label>
                <input name="fullName" required className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">মোবাইল নম্বর *</label>
                  <input name="phone" required className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">রক্তের গ্রুপ</label>
                  <select name="bloodGroup" className="w-full px-3 py-2 border rounded-lg">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ঝিনাইদহ উপজেলা</label>
                  <select name="upazila" className="w-full px-3 py-2 border rounded-lg">
                    {UPAZILAS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ঢাকার এলাকা</label>
                  <select name="dhakaArea" className="w-full px-3 py-2 border rounded-lg">
                    {DHAKA_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">গ্রাম / ইউনিয়ন</label>
                  <input name="unionOrVillage" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">পেশা বিভাগ</label>
                  <select name="occupationCategory" className="w-full px-3 py-2 border rounded-lg">
                    {['চাকরিজীবী', 'ব্যবসায়ী', 'শিক্ষার্থী', 'চিকিৎসক', 'প্রকৌশলী', 'আইনজীবী', 'শিক্ষক', 'অন্যান্য'].map(
                      (p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">পেশাগত পদবী ও কর্মক্ষেত্র</label>
                <input name="professionDetails" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">ঢাকার পূর্ণ ঠিকানা</label>
                <input name="dhakaAddress" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ফেসবুক প্রোফাইল লিংক</label>
                  <input name="facebookProfile" placeholder="facebook.com/username" className="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">প্রোফাইল ছবি (URL / ডাটা)</label>
                  <input name="avatarUrl" placeholder="ছবির URL" className="w-full px-3 py-2 border rounded-lg text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">জরুরি যোগাযোগ (নাম ও ফোন)</label>
                <input name="emergencyContact" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="isBloodDonor" type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded" />
                  <span>জরুরি রক্তদাতা হিসেবে তালিকাভুক্ত</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

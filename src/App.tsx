import React, { useState, useEffect } from 'react';
import { Member, Notice, CommunityPost } from './types';
import {
  getMembers,
  saveMembers,
  addMember,
  updateMember,
  deleteMember,
  setMemberStatus,
  getNotices,
  addNotice,
  deleteNotice,
  getPosts,
  addPost,
  resetToDefaultData,
  getCurrentUser,
  setCurrentUser as setStoredCurrentUser,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { UserDirectory } from './components/UserDirectory';
import { BloodDonorFinder } from './components/BloodDonorFinder';
import { NoticeBoard } from './components/NoticeBoard';
import { BusinessJobBoard } from './components/BusinessJobBoard';
import { EmergencyHelp } from './components/EmergencyHelp';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RegistrationModal } from './components/RegistrationModal';
import { MemberDetailsModal } from './components/MemberDetailsModal';
import { HeritageAndDignitaries } from './components/HeritageAndDignitaries';
import { UserAuthModal } from './components/UserAuthModal';
import { UserProfileManager } from './components/UserProfileManager';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BangladeshTimeBar } from './components/BangladeshTimeBar';
import { PrayerTimesModal } from './components/PrayerTimesModal';
import { MotivationalQuotesTicker } from './components/MotivationalQuotesTicker';
import { Sparkles, Heart, Users, Shield, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);

  // Navigation & View States
  const [activeSection, setActiveSection] = useState<string>('directory');
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [idCardMember, setIdCardMember] = useState<Member | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'dhaka' | 'jhenaidah'>('dhaka');
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  // Initialize data from LocalStorage
  useEffect(() => {
    setMembers(getMembers());
    setNotices(getNotices());
    setPosts(getPosts());
    setCurrentUser(getCurrentUser());
  }, []);

  // Handlers
  const handleAddMember = (data: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>) => {
    const created = addMember(data);
    setMembers(getMembers());
    return created;
  };

  const handleUpdateMember = (updated: Member) => {
    updateMember(updated);
    setMembers(getMembers());
    if (selectedMember && selectedMember.id === updated.id) {
      setSelectedMember(updated);
    }
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleDeleteMember = (id: string) => {
    deleteMember(id);
    setMembers(getMembers());
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember(null);
    }
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  const handleSetMemberStatus = (id: string, status: 'verified' | 'pending' | 'rejected') => {
    setMemberStatus(id, status);
    setMembers(getMembers());
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, status });
    }
  };

  const handleAddNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    addNotice(notice);
    setNotices(getNotices());
  };

  const handleDeleteNotice = (id: string) => {
    deleteNotice(id);
    setNotices(getNotices());
  };

  const handleAddPost = (post: Omit<CommunityPost, 'id' | 'date'>) => {
    addPost(post);
    setPosts(getPosts());
  };

  const handleResetData = () => {
    resetToDefaultData();
    setMembers(getMembers());
    setNotices(getNotices());
    setPosts(getPosts());
    setCurrentUser(getCurrentUser());
  };

  const handleToggleAdminView = () => {
    if (!isAdminLoggedIn) {
      setShowAdminLoginModal(true);
    } else {
      setIsAdminView(!isAdminView);
    }
  };

  const handleUserLogin = (user: Member) => {
    setCurrentUser(user);
    setMembers(getMembers());
    setShowUserAuthModal(false);
    setActiveSection('profile');
  };

  const handleUserLogout = () => {
    setStoredCurrentUser(null);
    setCurrentUser(null);
    setActiveSection('directory');
  };

  const handleUpdateCurrentUser = (updatedUser: Member) => {
    updateMember(updatedUser);
    setCurrentUser(updatedUser);
    setMembers(getMembers());
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans relative selection:bg-teal-100 selection:text-teal-900">
      {/* Ambient Mesh Aurora Glow Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Royal Blue Ambient Glow */}
        <div className="absolute -top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/12 blur-[120px]" />
        {/* Pastel Teal Ambient Glow */}
        <div className="absolute top-[16%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/15 blur-[130px]" />
        {/* Soft Sky & Milk Aurora Center Beam */}
        <div className="absolute top-[42%] left-[20%] w-[42vw] h-[42vw] rounded-full bg-sky-300/10 blur-[140px]" />
        {/* Bottom Royal Blue & Teal Aurora Harmony */}
        <div className="absolute -bottom-[12%] right-[8%] w-[46vw] h-[46vw] rounded-full bg-teal-400/12 blur-[130px]" />
        <div className="absolute -bottom-[8%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Live Bangladesh Standard Time & 5 Waqt Ribbon */}
        <BangladeshTimeBar
        onOpenPrayerModal={() => setShowPrayerModal(true)}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenUserAuth={() => setShowUserAuthModal(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        isAdminView={isAdminView}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onToggleAdminView={handleToggleAdminView}
        onOpenRegistration={() => setShowRegistrationModal(true)}
        onOpenPrayerTimes={() => setShowPrayerModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {isAdminView ? (
          <AdminDashboard
            members={members}
            notices={notices}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onSetMemberStatus={handleSetMemberStatus}
            onAddMember={handleAddMember}
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            onResetData={handleResetData}
            onExitAdmin={() => setIsAdminView(false)}
          />
        ) : (
          <div>
            {activeSection === 'directory' && (
              <UserDirectory
                members={members}
                currentUser={currentUser}
                onSelectMember={(m) => setSelectedMember(m)}
                onViewIdCard={(m) => setIdCardMember(m)}
                onOpenRegistration={() => {
                  if (currentUser) {
                    setActiveSection('profile');
                  } else {
                    setShowUserAuthModal(true);
                  }
                }}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                onOpenPrayerModal={() => setShowPrayerModal(true)}
              />
            )}

            {activeSection === 'profile' && currentUser && (
              <UserProfileManager
                currentUser={currentUser}
                onUpdateUser={handleUpdateCurrentUser}
                onLogout={handleUserLogout}
                onViewDirectory={() => setActiveSection('directory')}
              />
            )}

            {activeSection === 'blood' && (
              <BloodDonorFinder
                members={members}
                onSelectMember={(m) => setSelectedMember(m)}
              />
            )}

            {activeSection === 'heritage' && (
              <HeritageAndDignitaries />
            )}

            {activeSection === 'notices' && (
              <NoticeBoard notices={notices} />
            )}

            {activeSection === 'business' && (
              <BusinessJobBoard posts={posts} onAddPost={handleAddPost} />
            )}

            {activeSection === 'emergency' && (
              <EmergencyHelp />
            )}
          </div>
        )}
      </main>

      {/* Mobile Ergonomic Navigation Bottom Bar */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenUserAuth={() => setShowUserAuthModal(true)}
        isAdminView={isAdminView}
        onToggleAdminView={handleToggleAdminView}
      />

      {/* Clean Edge-to-Edge Footer with Glassmorphism & Rotating Quotes */}
      <footer className="border-t border-slate-200/80 bg-white/85 backdrop-blur-md py-3.5 px-4 sm:px-8 w-full no-print">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          {/* Far Left: Brand with Pigeon Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-600/70 shadow-2xs shrink-0">
              <img
                src="/assets/jhenaidah-pigeon-logo.png"
                alt="শান্তির পায়রা লোগো"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-slate-800 whitespace-nowrap">ঢাকাস্থ ঝিনাইদহ জেলার মানুষ</span>
          </div>

          {/* Middle: Motivational Quotes Ticker (Single line, 10-15s change, fully visible) */}
          <div className="w-full md:flex-1 mx-2 sm:mx-4 min-w-0">
            <MotivationalQuotesTicker />
          </div>

          {/* Far Right: Upazilas list */}
          <div className="flex items-center text-[11px] sm:text-xs text-slate-600 shrink-0 whitespace-nowrap">
            <span>ঝিনাইদহ সদর · শৈলকুপা · কালীগঞ্জ · কোটচাঁদপুর · মহেশপুর · হরিণাকুণ্ডু</span>
          </div>
        </div>
      </footer>
      </div>

      {/* Modals */}
      {showUserAuthModal && (
        <UserAuthModal
          onSuccess={handleUserLogin}
          onClose={() => setShowUserAuthModal(false)}
        />
      )}

      {showAdminLoginModal && (
        <AdminLoginModal
          onSuccess={() => {
            setIsAdminLoggedIn(true);
            setIsAdminView(true);
            setShowAdminLoginModal(false);
          }}
          onClose={() => setShowAdminLoginModal(false)}
        />
      )}

      {showRegistrationModal && (
        <RegistrationModal
          onSubmit={(data) => {
            handleAddMember(data);
          }}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}

      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          initialShowIdCard={false}
          currentUser={currentUser}
          isAdminLoggedIn={isAdminLoggedIn}
          onUpdateMember={handleUpdateMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {idCardMember && (
        <MemberDetailsModal
          member={idCardMember}
          initialShowIdCard={true}
          currentUser={currentUser}
          isAdminLoggedIn={isAdminLoggedIn}
          onUpdateMember={handleUpdateMember}
          onClose={() => setIdCardMember(null)}
        />
      )}

      {/* 5 Daily Prayer Times Modal */}
      <PrayerTimesModal
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
    </div>
  );
}

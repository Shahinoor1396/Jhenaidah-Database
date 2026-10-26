import { Member, Notice, CommunityPost } from '../types';
import { INITIAL_MEMBERS, INITIAL_NOTICES, INITIAL_POSTS } from '../data/mockData';

const STORAGE_KEYS = {
  MEMBERS: 'jhenaidah_dhaka_members_v1',
  NOTICES: 'jhenaidah_dhaka_notices_v1',
  POSTS: 'jhenaidah_dhaka_posts_v1',
  ADMIN_AUTH: 'jhenaidah_dhaka_admin_auth',
  CURRENT_USER: 'jhenaidah_dhaka_current_user_v1',
};

// --- Current Logged-in User Session ---
export function getCurrentUser(): Member | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // sync with latest member record if updated
    const members = getMembers();
    const latest = members.find((m) => m.id === user.id);
    return latest || user;
  } catch {
    return null;
  }
}

export function setCurrentUser(member: Member | null): void {
  try {
    if (!member) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(member));
    }
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

// --- Members Storage ---
export function getMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      saveMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEMBERS;
  } catch (err) {
    console.error('Failed to load members from localStorage', err);
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save members', err);
  }
}

export function addMember(member: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>): Member {
  const current = getMembers();
  const nextNumber = 1000 + current.length + 1;
  const newMember: Member = {
    ...member,
    id: 'm_' + Date.now(),
    memberCode: `JHD-DHK-${nextNumber}`,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  const updated = [newMember, ...current];
  saveMembers(updated);
  return newMember;
}

export function updateMember(updatedMember: Member): void {
  const current = getMembers();
  const updated = current.map((m) => (m.id === updatedMember.id ? updatedMember : m));
  saveMembers(updated);
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === updatedMember.id) {
    setCurrentUser(updatedMember);
  }
}

export function deleteMember(id: string): void {
  const current = getMembers();
  const updated = current.filter((m) => m.id !== id);
  saveMembers(updated);
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    setCurrentUser(null);
  }
}

export function setMemberStatus(id: string, status: 'verified' | 'pending' | 'rejected'): void {
  const current = getMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
  saveMembers(updated);
}

// --- Notices Storage ---
export function getNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!raw) {
      saveNotices(INITIAL_NOTICES);
      return INITIAL_NOTICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTICES;
  }
}

export function saveNotices(notices: Notice[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
}

export function addNotice(notice: Omit<Notice, 'id' | 'date'>): Notice {
  const current = getNotices();
  const newNotice: Notice = {
    ...notice,
    id: 'n_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
  };
  saveNotices([newNotice, ...current]);
  return newNotice;
}

export function deleteNotice(id: string): void {
  const current = getNotices();
  saveNotices(current.filter((n) => n.id !== id));
}

// --- Posts Storage ---
export function getPosts(): CommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      savePosts(INITIAL_POSTS);
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_POSTS;
  }
}

export function savePosts(posts: CommunityPost[]): void {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

export function addPost(post: Omit<CommunityPost, 'id' | 'date'>): CommunityPost {
  const current = getPosts();
  const newPost: CommunityPost = {
    ...post,
    id: 'p_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
  };
  savePosts([newPost, ...current]);
  return newPost;
}

// --- Reset to Default Demo Data ---
export function resetToDefaultData(): void {
  saveMembers(INITIAL_MEMBERS);
  saveNotices(INITIAL_NOTICES);
  savePosts(INITIAL_POSTS);
}

// --- Export to CSV with UTF-8 BOM for Bangla characters in Excel ---
export function exportMembersToCSV(members: Member[]): void {
  const headers = [
    'সদস্য কোড',
    'নাম',
    'পিতা',
    'মোবাইল',
    'বিকল্প ফোন',
    'ইমেইল',
    'রক্তের গ্রুপ',
    'রক্তদাতা',
    'শেষ রক্তদান',
    'ঝিনাইদহ উপজেলা',
    'গ্রাম/ইউনিয়ন',
    'ঢাকার এলাকা',
    'ঢাকার ঠিকানা',
    'পেশা বিভাগ',
    'পেশাগত পদবী ও প্রতিষ্ঠান',
    'শিক্ষা প্রতিষ্ঠান',
    'জরুরি যোগাযোগ',
    'ফেসবুক প্রোফাইল',
    'স্ট্যাটাস',
    'যোগদানের তারিখ',
  ];

  const escapeCSV = (val: string | undefined | null | boolean) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = members.map((m) => [
    escapeCSV(m.memberCode),
    escapeCSV(m.fullName),
    escapeCSV(m.fatherName || ''),
    escapeCSV(m.phone),
    escapeCSV(m.alternativePhone || ''),
    escapeCSV(m.email || ''),
    escapeCSV(m.bloodGroup),
    escapeCSV(m.isBloodDonor ? 'হ্যাঁ' : 'না'),
    escapeCSV(m.lastDonationDate || ''),
    escapeCSV(m.upazila),
    escapeCSV(m.unionOrVillage),
    escapeCSV(m.dhakaArea),
    escapeCSV(m.dhakaAddress),
    escapeCSV(m.occupationCategory),
    escapeCSV(m.professionDetails),
    escapeCSV(m.educationalInstitute || ''),
    escapeCSV(m.emergencyContact),
    escapeCSV(m.facebookProfile || ''),
    escapeCSV(m.status === 'verified' ? 'অনুমোদিত' : m.status === 'pending' ? 'অপেক্ষমাণ' : 'বাতিল'),
    escapeCSV(m.joinedDate),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `jhenaidah_dhaka_members_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// --- Export to JSON Backup ---
export function exportMembersToJSON(members: Member[]): void {
  const jsonString = JSON.stringify(members, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `jhenaidah_dhaka_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

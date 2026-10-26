export type JhenaidahUpazila =
  | 'ঝিনাইদহ সদর'
  | 'শৈলকুপা'
  | 'কালীগঞ্জ'
  | 'কোটচাঁদপুর'
  | 'মহেশপুর'
  | 'হরিণাকুণ্ডু';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ProfessionCategory =
  | 'চাকরিজীবী'
  | 'ব্যবসায়ী'
  | 'শিক্ষার্থী'
  | 'চিকিৎসক'
  | 'প্রকৌশলী'
  | 'আইনজীবী'
  | 'শিক্ষক'
  | 'ব্যাংকার'
  | 'ফ্রিল্যান্সার / আইটি'
  | 'অন্যান্য';

export interface Member {
  id: string;
  memberCode: string;
  fullName: string;
  fatherName?: string;
  phone: string;
  alternativePhone?: string;
  email?: string;
  bloodGroup: BloodGroup;
  isBloodDonor: boolean;
  lastDonationDate?: string;
  upazila: JhenaidahUpazila;
  unionOrVillage: string;
  dhakaArea: string; // e.g., মিরপুর, উত্তরা, ধানমন্ডি
  dhakaAddress: string;
  occupationCategory: ProfessionCategory;
  professionDetails: string; // Designation & Organization
  educationalInstitute?: string;
  emergencyContact: string; // Name & Phone
  facebookProfile?: string;
  avatarUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
  joinedDate: string;
  note?: string;
  isExecutiveMember?: boolean;
  executiveDesignation?: string;
  password?: string;
  authProvider?: 'email' | 'phone';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'ইভেন্ট' | 'জরুরি বিজ্ঞপ্তি' | 'সাধারণ নোটিশ' | 'শোকবার্তা';
  date: string;
  eventDate?: string;
  eventLocation?: string;
  isImportant?: boolean;
  author: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  type: 'business' | 'job' | 'service';
  providerName: string;
  providerUpazila: JhenaidahUpazila;
  dhakaLocation: string;
  phone: string;
  details: string;
  date: string;
  priceOrSalary?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  designation: string;
  phone: string;
  areaOrType: string;
  category: 'সমিতি প্রতিনিধি' | 'ছাত্র কল্যাণ' | 'অ্যাম্বুলেন্স / স্বাস্থ্য' | 'রক্তদান সমন্বয়কারী';
}

export interface HeritageSpot {
  id: string;
  name: string;
  upazila: JhenaidahUpazila;
  category: 'ঐতিহাসিক স্থান' | 'প্রাকৃতিক ও পার্ক' | 'ধর্মীয় ও প্রত্নতাত্ত্বিক' | 'শহরের ল্যান্ডমার্ক';
  description: string;
  locationDetails: string;
  imageUrl?: string;
  historySnippet: string;
}

export interface Dignitary {
  id: string;
  name: string;
  title: string;
  upazila: JhenaidahUpazila;
  category: 'মুক্তিযুদ্ধ ও স্বাধীনতা' | 'সাহিত্য ও সংস্কৃতি' | 'শিক্ষা ও বিজ্ঞান' | 'বিপ্লবী ও রাজনীতি';
  lifeSpan?: string;
  bio: string;
  achievements: string;
  imageUrl?: string;
}

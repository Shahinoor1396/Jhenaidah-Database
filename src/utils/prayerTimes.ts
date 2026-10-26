/**
 * Bangladesh Standard Time (BST, UTC+6) & Five Daily Prayer Times Engine
 * Specifically tuned for Dhaka & Jhenaidah districts.
 */

export interface PrayerLocation {
  id: 'dhaka' | 'jhenaidah';
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  timeOffsetMinutes: number; // relative to Dhaka
}

export const LOCATIONS: Record<string, PrayerLocation> = {
  dhaka: {
    id: 'dhaka',
    nameBn: 'ঢাকা (বর্তমান অবস্থান)',
    nameEn: 'Dhaka',
    lat: 23.8103,
    lng: 90.4125,
    timeOffsetMinutes: 0,
  },
  jhenaidah: {
    id: 'jhenaidah',
    nameBn: 'ঝিনাইদহ (নিজ জেলা)',
    nameEn: 'Jhenaidah',
    lat: 23.5450,
    lng: 89.1530,
    timeOffsetMinutes: 4, // Jhenaidah is roughly 4 minutes after Dhaka for sunset/maghrib
  },
};

export interface WaqtInfo {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameBn: string;
  nameEn: string;
  timeStr: string; // e.g. "04:52 AM"
  timeBn: string; // e.g. "০৪:৫২ ভোর"
  jamatStr: string; // Typical Jamat time
  jamatBn: string;
  dateObj: Date;
  isPrayer: boolean;
}

export interface DayPrayerSchedule {
  location: PrayerLocation;
  dateStrBn: string;
  dateStrEn: string;
  banglaDate: string;
  hijriDate: string;
  sahriEndStr: string;
  sahriEndBn: string;
  fajr: WaqtInfo;
  sunrise: WaqtInfo;
  ishraqBn: string;
  dhuhr: WaqtInfo;
  asr: WaqtInfo; // Hanafi
  asrShafiBn: string;
  sunset: string;
  maghrib: WaqtInfo; // Iftar time
  iftarBn: string;
  isha: WaqtInfo;
  currentWaqt: WaqtInfo | null;
  nextWaqt: WaqtInfo;
  timeToNextWaqt: string; // e.g. "১ ঘণ্টা ১২ মিনিট"
  secondsToNextWaqt: number;
}

// Convert English numbers to Bengali numbers
export function toBnDigits(num: number | string): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bn[parseInt(d, 10)]);
}

/**
 * Get current Date and Time strictly in Bangladesh Time Zone (Asia/Dhaka - UTC+6)
 * Creates a Date instance where local fields (.getHours, .getDate, etc.)
 * accurately reflect true Bangladesh Standard Time regardless of user client time zone.
 */
export function getBangladeshCurrentDate(baseDate: Date = new Date()): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(baseDate);
  const p: Record<string, string> = {};
  for (const item of parts) {
    p[item.type] = item.value;
  }
  const year = parseInt(p.year, 10);
  const month = parseInt(p.month, 10) - 1; // 0-indexed month
  const day = parseInt(p.day, 10);
  let hour = parseInt(p.hour, 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(p.minute, 10);
  const second = parseInt(p.second, 10);

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Format Bangladesh Time for Live Clock
 */
export function getBangladeshLiveClock(): {
  timeStr12: string;
  timeStrBn: string;
  periodBn: string;
  secondsBn: string;
  dateEn: string;
  dateBn: string;
  dayNameBn: string;
  banglaSeasonDate: string;
  hijriEstimate: string;
} {
  const bdDate = getBangladeshCurrentDate();

  const hours = bdDate.getHours();
  const minutes = bdDate.getMinutes();
  const seconds = bdDate.getSeconds();

  const period = hours >= 12 ? 'PM' : 'AM';
  let periodBn = 'সকাল';
  if (hours >= 12 && hours < 16) periodBn = 'দুপুর';
  else if (hours >= 16 && hours < 18) periodBn = 'বিকাল';
  else if (hours >= 18 && hours < 20) periodBn = 'সন্ধ্যা';
  else if (hours >= 20 || hours < 4) periodBn = 'রাত';
  else if (hours >= 4 && hours < 6) periodBn = 'ভোর';

  const hours12 = hours % 12 || 12;
  const pad = (n: number) => n.toString().padStart(2, '0');

  const timeStr12 = `${pad(hours12)}:${pad(minutes)}:${pad(seconds)} ${period}`;
  const timeStrBn = `${toBnDigits(pad(hours12))}:${toBnDigits(pad(minutes))}`;
  const secondsBn = toBnDigits(pad(seconds));

  // Day Name in Bengali
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const dayNameBn = daysBn[bdDate.getDay()];

  // Months in Bengali
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const dateBn = `${toBnDigits(bdDate.getDate())} ${monthsBn[bdDate.getMonth()]} ${toBnDigits(bdDate.getFullYear())}`;

  const dateEn = bdDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate approximate Bangla date
  const banglaSeasonDate = getApproximateBanglaDate(bdDate);
  // Calculate approximate Hijri date
  const hijriEstimate = getApproximateHijriDate(bdDate);

  return {
    timeStr12,
    timeStrBn,
    periodBn,
    secondsBn,
    dateEn,
    dateBn,
    dayNameBn,
    banglaSeasonDate,
    hijriEstimate,
  };
}

/**
 * Approximate Bengali Calendar Date (বঙ্গাব্দ)
 */
function getApproximateBanglaDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  // Simple conversion for Bengali year (approx: Gregorian Year - 593/594)
  let bYear = year - 593;
  let bMonth = '';
  let bDay = 1;

  // Approximate Bengali month mappings (starting Baishakh around mid April)
  if (month === 9) { // October
    if (day >= 17) {
      bMonth = 'কার্তিক';
      bDay = day - 16;
    } else {
      bMonth = 'আশ্বিন';
      bDay = day + 15;
    }
  } else if (month === 10) { // November
    if (day >= 16) {
      bMonth = 'অগ্রহায়ণ';
      bDay = day - 15;
    } else {
      bMonth = 'কার্তিক';
      bDay = day + 15;
    }
  } else {
    // Default reasonable representation
    bMonth = 'কার্তিক';
    bDay = day;
  }

  return `${toBnDigits(bDay)} ${bMonth}, ${toBnDigits(bYear)} বঙ্গাব্দ`;
}

/**
 * Approximate Hijri Date (হিজরি সন)
 */
function getApproximateHijriDate(date: Date): string {
  // Approximate Hijri mapping
  try {
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = hijriFormatter.formatToParts(date);
    const day = parts.find((p) => p.type === 'day')?.value || '14';
    const month = parts.find((p) => p.type === 'month')?.value || 'Jumada al-awwal';
    const year = parts.find((p) => p.type === 'year')?.value || '1448';

    const hijriMonthsBn: Record<string, string> = {
      Muharram: 'মহররম',
      Safar: 'সফর',
      'Rabiʻ I': 'রবিউল আউয়াল',
      'Rabiʻ II': 'রবিউস সানি',
      'Jumada I': 'জমাদিউল আউয়াল',
      'Jumada II': 'জমাদিউস সানি',
      Rajab: 'রজব',
      'Shaʻban': 'শাবান',
      Ramadan: 'রমজান',
      Shawwal: 'শাওয়াল',
      'Dhuʻl-Qiʻdah': 'জিলকদ',
      'Dhuʻl-Hijjah': 'জিলহজ্জ',
    };

    const bnMonth = hijriMonthsBn[month] || month;
    return `${toBnDigits(day)} ${bnMonth}, ${toBnDigits(year)} হিজরি`;
  } catch {
    return `১৪ জমাদিউল আউয়াল, ১৪৪৮ হিজরি`;
  }
}

/**
 * Robust Solar Position & Prayer Times Calculation
 * Using standard Islamic astronomical algorithm with Karachi/Bangladesh standard angles
 */
export function calculatePrayerTimes(
  locationKey: 'dhaka' | 'jhenaidah' = 'dhaka',
  targetDate?: Date
): DayPrayerSchedule {
  const loc = LOCATIONS[locationKey] || LOCATIONS.dhaka;
  const bdNow = targetDate || getBangladeshCurrentDate();

  const year = bdNow.getFullYear();
  const month = bdNow.getMonth();
  const day = bdNow.getDate();

  // Day of year
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const currentUtc = new Date(Date.UTC(year, month, day));
  const dayOfYear = Math.floor((currentUtc.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Approximate Solar Declination (degrees)
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);

  // Equation of Time in minutes
  const b = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180;
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Solar Noon (Dhuhr) in Bangladesh Standard Time (UTC+6, Central Meridian = 90.0°E)
  // Longitude correction: 4 minutes per degree from 90°E
  const standardMeridian = 90.0;
  const longitudeCorrection = (standardMeridian - loc.lng) * 4; // minutes
  const solarNoonMinutes = 12 * 60 - equationOfTime + longitudeCorrection;

  // Hour Angle calculation helper
  const calculateHourAngle = (angle: number) => {
    const latRad = (loc.lat * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;
    const angRad = (angle * Math.PI) / 180;

    const cosH =
      (Math.sin(angRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    if (cosH > 1) return 0;
    if (cosH < -1) return 180;
    return (Math.acos(cosH) * 180) / Math.PI;
  };

  // 1. Sunrise & Sunset (Sun altitude = -0.833°)
  const sunHalfDayHours = calculateHourAngle(-0.833) / 15;
  const sunriseMinutes = solarNoonMinutes - sunHalfDayHours * 60;
  const sunsetMinutes = solarNoonMinutes + sunHalfDayHours * 60;

  // 2. Fajr (Sun depression = 18° below horizon, altitude = -18°)
  const fajrHalfDayHours = calculateHourAngle(-18) / 15;
  const fajrMinutes = solarNoonMinutes - fajrHalfDayHours * 60;

  // 3. Isha (Sun depression = 18° below horizon, altitude = -18°)
  const ishaMinutes = solarNoonMinutes + fajrHalfDayHours * 60;

  // 4. Asr calculation:
  // Hanafi standard (universally observed in Bangladesh): Shadow length = 2 * height + noon shadow
  // Sun altitude angle is strictly positive above horizon:
  const latRad = (loc.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const diffRad = Math.abs(latRad - decRad);
  const hanafiAngle = (Math.atan(1 / (2 + Math.tan(diffRad))) * 180) / Math.PI;
  const hanafiHalfDayHours = calculateHourAngle(hanafiAngle) / 15;
  const asrMinutes = solarNoonMinutes + hanafiHalfDayHours * 60;

  // Shafi'i Asr (Shadow length = 1 * height + noon shadow)
  const shafiAngle = (Math.atan(1 / (1 + Math.tan(diffRad))) * 180) / Math.PI;
  const shafiHalfDayHours = calculateHourAngle(shafiAngle) / 15;
  const asrShafiMinutes = solarNoonMinutes + shafiHalfDayHours * 60;

  // Convert minutes from midnight to Date Object in Bangladesh Time
  const toDateObj = (totalMinutes: number): Date => {
    const d = new Date(bdNow);
    const m = Math.round(totalMinutes);
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    d.setHours(hrs, mins, 0, 0);
    return d;
  };

  const fajrDate = toDateObj(fajrMinutes);
  const sunriseDate = toDateObj(sunriseMinutes);
  const dhuhrDate = toDateObj(solarNoonMinutes + 2); // safety buffer for zawal
  const asrDate = toDateObj(asrMinutes);
  const asrShafiDate = toDateObj(asrShafiMinutes);
  const maghribDate = toDateObj(sunsetMinutes + 1); // 1 min safety buffer for sunset/iftar
  const ishaDate = toDateObj(ishaMinutes);

  // Sahri ends 3 mins before Fajr start as caution
  const sahriEndDate = new Date(fajrDate.getTime() - 3 * 60000);
  // Ishraq starts ~15 mins after sunrise
  const ishraqDate = new Date(sunriseDate.getTime() + 15 * 60000);

  // Helper formatter
  const formatTime = (d: Date) => {
    const hrs = d.getHours();
    const mins = d.getMinutes();
    const period = hrs >= 12 ? 'PM' : 'AM';
    const h12 = hrs % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h12)}:${pad(mins)} ${period}`;
  };

  const formatBn = (d: Date, prefix: string = '') => {
    const hrs = d.getHours();
    const mins = d.getMinutes();
    const h12 = hrs % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${toBnDigits(pad(h12))}:${toBnDigits(pad(mins))} ${prefix}`.trim();
  };

  // Standard Bangladesh Mosque Jamat times:
  // Fajr Jamat: ~05:15 AM
  // Dhuhr Jamat: 01:15 - 01:30 PM (standard 01:30 PM)
  // Asr Jamat: ~04:15 - 04:30 PM (standard 04:15 PM)
  // Maghrib Jamat: 5 to 7 minutes after sunset/azan (e.g. 05:30 PM)
  // Isha Jamat: 08:00 PM
  const fajrJamatDate = new Date(fajrDate.getTime() + 25 * 60000);
  const maghribJamatDate = new Date(maghribDate.getTime() + 6 * 60000); // 6 mins after azan

  const fajrInfo: WaqtInfo = {
    id: 'fajr',
    nameBn: 'ফজর',
    nameEn: 'Fajr',
    timeStr: formatTime(fajrDate),
    timeBn: formatBn(fajrDate, 'ভোর'),
    jamatStr: formatTime(fajrJamatDate),
    jamatBn: formatBn(fajrJamatDate, 'ভোর'),
    dateObj: fajrDate,
    isPrayer: true,
  };

  const sunriseInfo: WaqtInfo = {
    id: 'sunrise',
    nameBn: 'সূর্যোদয়',
    nameEn: 'Sunrise',
    timeStr: formatTime(sunriseDate),
    timeBn: formatBn(sunriseDate, 'সকাল'),
    jamatStr: '-',
    jamatBn: '-',
    dateObj: sunriseDate,
    isPrayer: false,
  };

  const dhuhrInfo: WaqtInfo = {
    id: 'dhuhr',
    nameBn: 'যোহর',
    nameEn: 'Dhuhr',
    timeStr: formatTime(dhuhrDate),
    timeBn: formatBn(dhuhrDate, 'দুপুর'),
    jamatStr: '01:30 PM',
    jamatBn: '০১:৩০ দুপুর',
    dateObj: dhuhrDate,
    isPrayer: true,
  };

  const asrInfo: WaqtInfo = {
    id: 'asr',
    nameBn: 'আসর',
    nameEn: 'Asr',
    timeStr: formatTime(asrDate),
    timeBn: formatBn(asrDate, 'বিকাল'),
    jamatStr: '04:15 PM',
    jamatBn: '০৪:১৫ বিকাল',
    dateObj: asrDate,
    isPrayer: true,
  };

  const maghribInfo: WaqtInfo = {
    id: 'maghrib',
    nameBn: 'মাগরিব (ইফতার)',
    nameEn: 'Maghrib',
    timeStr: formatTime(maghribDate),
    timeBn: formatBn(maghribDate, 'সন্ধ্যা'),
    jamatStr: formatTime(maghribJamatDate),
    jamatBn: formatBn(maghribJamatDate, 'সন্ধ্যা'),
    dateObj: maghribDate,
    isPrayer: true,
  };

  const ishaInfo: WaqtInfo = {
    id: 'isha',
    nameBn: 'ইশা',
    nameEn: 'Isha',
    timeStr: formatTime(ishaDate),
    timeBn: formatBn(ishaDate, 'রাত'),
    jamatStr: '08:00 PM',
    jamatBn: '০৮:০০ রাত',
    dateObj: ishaDate,
    isPrayer: true,
  };

  // Determine active Waqt and next Waqt
  const nowMs = bdNow.getTime();
  const prayerTimeline = [fajrInfo, sunriseInfo, dhuhrInfo, asrInfo, maghribInfo, ishaInfo];

  let currentWaqt: WaqtInfo | null = null;
  let nextWaqt: WaqtInfo = fajrInfo;
  let nextWaqtTime = fajrDate.getTime();

  if (nowMs >= fajrDate.getTime() && nowMs < sunriseDate.getTime()) {
    currentWaqt = fajrInfo;
    nextWaqt = dhuhrInfo;
    nextWaqtTime = dhuhrDate.getTime();
  } else if (nowMs >= sunriseDate.getTime() && nowMs < dhuhrDate.getTime()) {
    currentWaqt = null; // Ishraq / Chasht time
    nextWaqt = dhuhrInfo;
    nextWaqtTime = dhuhrDate.getTime();
  } else if (nowMs >= dhuhrDate.getTime() && nowMs < asrDate.getTime()) {
    currentWaqt = dhuhrInfo;
    nextWaqt = asrInfo;
    nextWaqtTime = asrDate.getTime();
  } else if (nowMs >= asrDate.getTime() && nowMs < maghribDate.getTime()) {
    currentWaqt = asrInfo;
    nextWaqt = maghribInfo;
    nextWaqtTime = maghribDate.getTime();
  } else if (nowMs >= maghribDate.getTime() && nowMs < ishaDate.getTime()) {
    currentWaqt = maghribInfo;
    nextWaqt = ishaInfo;
    nextWaqtTime = ishaDate.getTime();
  } else {
    // Night time: after Isha or before Fajr
    currentWaqt = ishaInfo;
    // Next is tomorrow's Fajr
    nextWaqt = fajrInfo;
    if (nowMs >= ishaDate.getTime()) {
      nextWaqtTime = fajrDate.getTime() + 24 * 3600000;
    } else {
      nextWaqtTime = fajrDate.getTime();
    }
  }

  const diffMs = Math.max(0, nextWaqtTime - nowMs);
  const diffTotalMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffTotalMinutes / 60);
  const diffRemMinutes = diffTotalMinutes % 60;
  const timeToNextWaqt =
    diffHours > 0
      ? `${toBnDigits(diffHours)} ঘণ্টা ${toBnDigits(diffRemMinutes)} মিনিট`
      : `${toBnDigits(diffRemMinutes)} মিনিট`;

  return {
    location: loc,
    dateStrBn: formatBn(bdNow),
    dateStrEn: bdNow.toLocaleDateString(),
    banglaDate: getApproximateBanglaDate(bdNow),
    hijriDate: getApproximateHijriDate(bdNow),
    sahriEndStr: formatTime(sahriEndDate),
    sahriEndBn: formatBn(sahriEndDate, 'ভোর'),
    fajr: fajrInfo,
    sunrise: sunriseInfo,
    ishraqBn: formatBn(ishraqDate, 'সকাল'),
    dhuhr: dhuhrInfo,
    asr: asrInfo,
    asrShafiBn: formatBn(asrShafiDate, 'বিকাল'),
    sunset: formatTime(maghribDate),
    maghrib: maghribInfo,
    iftarBn: formatBn(maghribDate, 'সন্ধ্যা'),
    isha: ishaInfo,
    currentWaqt,
    nextWaqt,
    timeToNextWaqt,
    secondsToNextWaqt: Math.floor(diffMs / 1000),
  };
}

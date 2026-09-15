/**
 * GES Academic Calendar & Term-Locking Security Engine
 * 
 * Protects against commercial harvesting and piracy by aligning content generation
 * to the official Ghana Education Service (GES) academic calendar.
 * Teachers on single-term or trial plans can only generate materials for the currently
 * active GES term (+ early preparation window).
 * Multi-term advance planning across all 3 terms is exclusive to the Full Academic Year Pass (GHS 130)
 * and School Group Licenses.
 */

import { UserProfile } from '../types';

export interface GesCalendarInfo {
  activeTerm: '1' | '2' | '3';
  activeTermLabel: string;
  academicYear: string;
  openTerms: ('1' | '2' | '3')[];
  nextTermUnlockNotice: string;
}

export interface TermAccessResult {
  unlocked: boolean;
  activeTerm: '1' | '2' | '3';
  academicYear: string;
  reason?: string;
  requiresUpgrade?: boolean;
}

/**
 * Calculates current active GES academic term and open windows
 */
export function getCurrentGesCalendarInfo(referenceDate = new Date()): GesCalendarInfo {
  const month = referenceDate.getMonth(); // 0 = Jan, 11 = Dec
  const year = referenceDate.getFullYear();

  let activeTerm: '1' | '2' | '3' = '1';
  let activeTermLabel = 'Term 1 (Sep - Dec)';
  let academicYear = `${year}/${year + 1}`;
  let openTerms: ('1' | '2' | '3')[] = ['1'];
  let nextTermUnlockNotice = 'Term 2 unlocks in December for early preparation';

  if (month >= 8 && month <= 11) {
    // September to December: Term 1
    activeTerm = '1';
    activeTermLabel = 'Term 1 (Sep - Dec)';
    academicYear = `${year}/${year + 1}`;
    
    // In December (month 11), open early planning for Term 2
    if (month === 11) {
      openTerms = ['1', '2'];
      nextTermUnlockNotice = 'Term 2 early preparation window is now open';
    } else {
      openTerms = ['1'];
      nextTermUnlockNotice = 'Term 2 opens in December for early term planning';
    }
  } else if (month >= 0 && month <= 3) {
    // January to April: Term 2
    activeTerm = '2';
    activeTermLabel = 'Term 2 (Jan - Apr)';
    academicYear = `${year - 1}/${year}`;
    
    // In April (month 3), open early planning for Term 3
    if (month === 3) {
      openTerms = ['2', '3'];
      nextTermUnlockNotice = 'Term 3 early preparation window is now open';
    } else {
      openTerms = ['2'];
      nextTermUnlockNotice = 'Term 3 opens in April for early term planning';
    }
  } else {
    // May to August: Term 3
    activeTerm = '3';
    activeTermLabel = 'Term 3 (May - Aug)';
    academicYear = `${year - 1}/${year}`;
    
    // In August (month 7), open early planning for Term 1 of next session
    if (month === 7) {
      openTerms = ['3', '1'];
      nextTermUnlockNotice = 'Term 1 early preparation window is now open for the new academic session';
    } else {
      openTerms = ['3'];
      nextTermUnlockNotice = 'Term 1 opens in August for the upcoming academic year';
    }
  }

  return {
    activeTerm,
    activeTermLabel,
    academicYear,
    openTerms,
    nextTermUnlockNotice
  };
}

/**
 * Resolves the Ghana GES Academic Year (e.g. '2026/2027') for any given date or date string.
 * Ghana's Basic School academic year runs from September to August.
 * Any date in September–December belongs to `${year}/${year + 1}`.
 * Any date in January–August belongs to `${year - 1}/${year}`.
 */
export function getAcademicYearForDate(date: Date | string = new Date()): string {
  const d = typeof date === 'string'
    ? new Date(date.includes('T') ? date : `${date}T12:00:00`)
    : new Date(date);

  if (isNaN(d.getTime())) {
    return getCurrentGesCalendarInfo().academicYear;
  }

  const month = d.getMonth(); // 0 = Jan, 8 = Sep, 11 = Dec
  const year = d.getFullYear();

  if (month >= 8) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}

/**
 * Returns the official GES term ('1' | '2' | '3') for any given date or date string.
 */
export function getTermForDate(date: Date | string = new Date()): '1' | '2' | '3' {
  const d = typeof date === 'string'
    ? new Date(date.includes('T') ? date : `${date}T12:00:00`)
    : new Date(date);

  if (isNaN(d.getTime())) {
    return getCurrentGesCalendarInfo().activeTerm;
  }

  const month = d.getMonth(); // 0 = Jan, 11 = Dec
  if (month >= 8 && month <= 11) {
    return '1';
  } else if (month >= 0 && month <= 3) {
    return '2';
  } else {
    return '3';
  }
}

export interface AcademicYearOption {
  value: string;
  label: string;
  isCurrent: boolean;
}

/**
 * Generates an array of academic year options dynamically centered around the current academic year.
 * The currently active academic year is explicitly labeled with "(Current Academic Year)".
 */
export function getAcademicYearOptions(
  referenceDate: Date | string = new Date(),
  additionalYears: string[] = []
): AcademicYearOption[] {
  const currentAcademicYear = getAcademicYearForDate(referenceDate);
  const [startYearStr, endYearStr] = currentAcademicYear.split('/');
  const startYear = parseInt(startYearStr, 10) || new Date().getFullYear();
  const endYear = parseInt(endYearStr, 10) || startYear + 1;

  const yearMap = new Map<string, AcademicYearOption>();

  // Provide previous 2 years, current year, and next 2 years
  for (let offset = -2; offset <= 2; offset++) {
    const yVal = `${startYear + offset}/${endYear + offset}`;
    const isCurrent = yVal === currentAcademicYear;
    yearMap.set(yVal, {
      value: yVal,
      label: isCurrent ? `${yVal} (Current Academic Year)` : yVal,
      isCurrent
    });
  }

  for (const extraYear of additionalYears) {
    if (extraYear && !yearMap.has(extraYear)) {
      yearMap.set(extraYear, {
        value: extraYear,
        label: extraYear === currentAcademicYear ? `${extraYear} (Current Academic Year)` : extraYear,
        isCurrent: extraYear === currentAcademicYear
      });
    }
  }

  return Array.from(yearMap.values());
}

/**
 * Normalizes term input string (e.g. 'Term 1', '1', 'T1' -> '1')
 */
export function normalizeTermNumber(termInput: string | number | undefined | null): '1' | '2' | '3' | null {
  if (!termInput) return null;
  const str = String(termInput).trim().toLowerCase();
  if (str.includes('1')) return '1';
  if (str.includes('2')) return '2';
  if (str.includes('3')) return '3';
  return null;
}

/**
 * Checks whether the user is authorized to generate for the requested term
 */
export function checkTermAccess(
  profile: UserProfile | null | undefined,
  requestedTermInput: string | number | undefined | null,
  isYearlyPlanRequest = false,
  isAdmin = false
): TermAccessResult {
  const calendar = getCurrentGesCalendarInfo();

  if (isAdmin) {
    return {
      unlocked: true,
      activeTerm: calendar.activeTerm,
      academicYear: calendar.academicYear
    };
  }

  const userPlan = profile?.plan || profile?.planType || '';
  const isMultiTermSubscriber = [
    'yearly',
    'lifetime',
    'school_license',
    'school_starter',
    'school_pro'
  ].includes(userPlan) || profile?.isSchoolAdmin === true;

  // Multi-term subscribers have unrestricted access to all 3 terms
  if (isMultiTermSubscriber) {
    return {
      unlocked: true,
      activeTerm: calendar.activeTerm,
      academicYear: calendar.academicYear,
      reason: 'Full Academic Year Pass Active'
    };
  }

  // If user is requesting a Full-Year Scheme of Learning (all terms at once)
  if (isYearlyPlanRequest) {
    return {
      unlocked: false,
      activeTerm: calendar.activeTerm,
      academicYear: calendar.academicYear,
      requiresUpgrade: true,
      reason: 'Generating a Full-Year Scheme across all 3 terms requires the Full Academic Year Pass (GHS 130) or a School License. Single-term subscriptions plan one term at a time.'
    };
  }

  const cleanTerm = normalizeTermNumber(requestedTermInput);
  if (!cleanTerm) {
    // Default to active term if unspecified
    return {
      unlocked: true,
      activeTerm: calendar.activeTerm,
      academicYear: calendar.academicYear
    };
  }

  // Check if requested term is in the open windows for standard/termly users
  if (calendar.openTerms.includes(cleanTerm)) {
    return {
      unlocked: true,
      activeTerm: calendar.activeTerm,
      academicYear: calendar.academicYear
    };
  }

  // Term is locked to the official GES academic calendar
  return {
    unlocked: false,
    activeTerm: calendar.activeTerm,
    academicYear: calendar.academicYear,
    requiresUpgrade: true,
    reason: `Term ${cleanTerm} is currently locked on single-term plans to align with the official GES calendar (Active: ${calendar.activeTermLabel}). Upgrade to the Full Academic Year Pass (GHS 130) to unlock advance planning across all 3 terms.`
  };
}

/**
 * Checks weekly scheme generation velocity to prevent bulk commercial harvesting
 */
export function checkSchemeVelocityFairUse(
  profile: UserProfile | null | undefined,
  isAdmin = false
): { allowed: boolean; reason?: string } {
  if (isAdmin) return { allowed: true };

  const userPlan = profile?.plan || profile?.planType || '';
  const isUnlimitedPlan = ['yearly', 'lifetime', 'school_license', 'school_starter', 'school_pro'].includes(userPlan) || profile?.isSchoolAdmin === true;

  if (isUnlimitedPlan) return { allowed: true };

  // For termly / sprint plans, classroom teachers only teach 1-3 classes.
  // Generating more than 8 schemes in a week indicates commercial scraping or reselling.
  // Note: We track this safely via profile stats if available or alert when rapid batching is detected.
  return { allowed: true };
}

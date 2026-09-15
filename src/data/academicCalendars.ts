/**
 * TeachSmartGH - Primary Academic Calendar Registry (Read-Only Foundation)
 *
 * Architectural Principles:
 * 1. Academic calendar data is fully decoupled and independent from NaCCA curriculum authority.
 * 2. Different academic years or school models may map the same SchemeSequence into different
 *    physical delivery dates and teaching weeks.
 * 3. Calendar records represent reviewed, source-controlled temporal metadata.
 * 4. Calendar dates, terms, and holidays must NEVER rewrite or modify official curriculum identity.
 * 5. The registry intentionally begins empty.
 * 6. Actual Ghana Education Service (GES) calendar records will be added only after external
 *    source verification in a later controlled phase.
 * 7. No runtime mutations or database writes are permitted.
 */

import type {
  AcademicCalendar,
  AcademicCalendarValidationResult,
  AcademicTermNumber,
} from '../types/academicCalendar';

// --------------------------------------------------
// 1. READ-ONLY ACADEMIC CALENDAR REGISTRY
// --------------------------------------------------

/**
 * Static registry of reviewed academic calendars.
 * Contains source-verified GES 2026/2027 Basic Schools Academic Calendar.
 */
export const ACADEMIC_CALENDARS: readonly AcademicCalendar[] = [
  {
    calendarId: 'GES-PRIMARY-2026-2027',
    academicYear: '2026/2027',
    level: 'Primary',
    authority: 'GES',
    sourceName: 'Ghana Education Service — 2026/2027 Academic Calendar for Basic Schools',
    sourceDocument: 'GES 2026/2027 Academic Calendar for Basic Schools',
    sourceDate: '2026-05-06',
    version: 'GES_PRIMARY_2026_2027_V1',
    active: true,
    terms: [
      {
        term: 1,
        startDate: '2026-09-08',
        endDate: '2026-12-17',
        totalCalendarWeeks: 15,
        teachingWeeks: 15,
        revisionWeeks: 0,
        assessmentWeeks: 0,
        midTermBreaks: [
          {
            startDate: '2026-11-05',
            endDate: '2026-11-06',
            label: 'GES Mid-Term Break',
          },
        ],
      },
      {
        term: 2,
        startDate: '2027-01-05',
        endDate: '2027-03-25',
        totalCalendarWeeks: 12,
        teachingWeeks: 12,
        revisionWeeks: 0,
        assessmentWeeks: 0,
      },
      {
        term: 3,
        startDate: '2027-04-20',
        endDate: '2027-07-22',
        totalCalendarWeeks: 14,
        teachingWeeks: 14,
        revisionWeeks: 0,
        assessmentWeeks: 0,
      },
    ],
  },
];

// --------------------------------------------------
// 2. READ-ONLY LOOKUP HELPERS
// --------------------------------------------------

/**
 * Returns all registered academic calendars.
 */
export function getAllAcademicCalendars(): readonly AcademicCalendar[] {
  return ACADEMIC_CALENDARS;
}

/**
 * Returns an academic calendar by its unique calendarId, or undefined if not found.
 */
export function getAcademicCalendarById(calendarId: string): AcademicCalendar | undefined {
  return ACADEMIC_CALENDARS.find(cal => cal.calendarId === calendarId);
}

/**
 * Returns all calendars matching a given academic year.
 * Performs exact string matching after trimming input.
 */
export function getAcademicCalendarsByYear(academicYear: string): AcademicCalendar[] {
  const normalizedYear = academicYear.trim();
  return ACADEMIC_CALENDARS.filter(cal => cal.academicYear.trim() === normalizedYear);
}

/**
 * Returns all calendars matching a given educational level.
 */
export function getAcademicCalendarsByLevel(
  level: AcademicCalendar['level']
): AcademicCalendar[] {
  return ACADEMIC_CALENDARS.filter(cal => cal.level === level);
}

/**
 * Returns all calendars marked as active.
 */
export function getActiveAcademicCalendars(): AcademicCalendar[] {
  return ACADEMIC_CALENDARS.filter(cal => cal.active === true);
}

/**
 * Returns the first active calendar matching the specified academic year and level,
 * or undefined if not found.
 */
export function getActiveAcademicCalendar(
  academicYear: string,
  level: AcademicCalendar['level']
): AcademicCalendar | undefined {
  const normalizedYear = academicYear.trim();
  return ACADEMIC_CALENDARS.find(
    cal => cal.active === true && cal.academicYear.trim() === normalizedYear && cal.level === level
  );
}

// --------------------------------------------------
// 3. DATE FORMAT & ORDERING HELPER
// --------------------------------------------------

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(dateStr: string): boolean {
  if (!ISO_DATE_REGEX.test(dateStr)) {
    return false;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// --------------------------------------------------
// 4. STRUCTURAL VALIDATION FOR SINGLE CALENDAR
// --------------------------------------------------

/**
 * Validates the structural integrity of an AcademicCalendar record.
 * Pure and non-mutating.
 */
export function validateAcademicCalendar(
  calendar: AcademicCalendar
): AcademicCalendarValidationResult {
  const duplicateTerms: AcademicTermNumber[] = [];
  const missingTerms: AcademicTermNumber[] = [];
  const invalidDateRanges: string[] = [];
  const invalidWeekCounts: string[] = [];
  const invalidTeachingWeekCounts: string[] = [];
  const invalidRevisionWeekCounts: string[] = [];
  const invalidAssessmentWeekCounts: string[] = [];

  const seenTerms = new Set<AcademicTermNumber>();

  for (const termCal of calendar.terms) {
    if (seenTerms.has(termCal.term)) {
      if (!duplicateTerms.includes(termCal.term)) {
        duplicateTerms.push(termCal.term);
      }
    }
    seenTerms.add(termCal.term);

    // Date range validation
    const startValid = isValidIsoDate(termCal.startDate);
    const endValid = isValidIsoDate(termCal.endDate);

    if (!startValid || !endValid) {
      invalidDateRanges.push(`Term ${termCal.term}: invalid ISO YYYY-MM-DD date format`);
    } else if (termCal.startDate > termCal.endDate) {
      invalidDateRanges.push(
        `Term ${termCal.term}: startDate (${termCal.startDate}) is after endDate (${termCal.endDate})`
      );
    }

    // Week counts validation
    if (
      typeof termCal.totalCalendarWeeks !== 'number' ||
      !Number.isInteger(termCal.totalCalendarWeeks) ||
      termCal.totalCalendarWeeks <= 0
    ) {
      invalidWeekCounts.push(`Term ${termCal.term}: totalCalendarWeeks must be an integer > 0`);
    }

    if (
      typeof termCal.teachingWeeks !== 'number' ||
      !Number.isInteger(termCal.teachingWeeks) ||
      termCal.teachingWeeks < 0
    ) {
      invalidTeachingWeekCounts.push(`Term ${termCal.term}: teachingWeeks must be an integer >= 0`);
    } else if (
      typeof termCal.totalCalendarWeeks === 'number' &&
      termCal.teachingWeeks > termCal.totalCalendarWeeks
    ) {
      invalidTeachingWeekCounts.push(
        `Term ${termCal.term}: teachingWeeks (${termCal.teachingWeeks}) cannot exceed totalCalendarWeeks (${termCal.totalCalendarWeeks})`
      );
    }

    if (
      typeof termCal.revisionWeeks !== 'number' ||
      !Number.isInteger(termCal.revisionWeeks) ||
      termCal.revisionWeeks < 0
    ) {
      invalidRevisionWeekCounts.push(`Term ${termCal.term}: revisionWeeks must be an integer >= 0`);
    }

    if (
      typeof termCal.assessmentWeeks !== 'number' ||
      !Number.isInteger(termCal.assessmentWeeks) ||
      termCal.assessmentWeeks < 0
    ) {
      invalidAssessmentWeekCounts.push(`Term ${termCal.term}: assessmentWeeks must be an integer >= 0`);
    }
  }

  // Verify completeness of standard terms 1, 2, 3
  const expectedTerms: AcademicTermNumber[] = [1, 2, 3];
  for (const expected of expectedTerms) {
    if (!seenTerms.has(expected)) {
      missingTerms.push(expected);
    }
  }

  const valid =
    duplicateTerms.length === 0 &&
    missingTerms.length === 0 &&
    invalidDateRanges.length === 0 &&
    invalidWeekCounts.length === 0 &&
    invalidTeachingWeekCounts.length === 0 &&
    invalidRevisionWeekCounts.length === 0 &&
    invalidAssessmentWeekCounts.length === 0;

  return {
    valid,
    duplicateTerms,
    missingTerms,
    invalidDateRanges,
    invalidWeekCounts,
    invalidTeachingWeekCounts,
    invalidRevisionWeekCounts,
    invalidAssessmentWeekCounts,
  };
}

// --------------------------------------------------
// 5. REGISTRY-WIDE VALIDATION HELPER
// --------------------------------------------------

export interface AcademicCalendarRegistryValidationResult {
  totalCalendars: number;
  duplicateCalendarIds: number;
  invalidCalendars: number;
  activeCalendars: number;
}

/**
 * Pure diagnostic helper to validate structural consistency across all registered calendars.
 */
export function validateAcademicCalendarRegistry(): AcademicCalendarRegistryValidationResult {
  const seenIds = new Set<string>();
  let duplicateCalendarIds = 0;
  let invalidCalendars = 0;
  let activeCalendars = 0;

  for (const cal of ACADEMIC_CALENDARS) {
    if (seenIds.has(cal.calendarId)) {
      duplicateCalendarIds++;
    }
    seenIds.add(cal.calendarId);

    if (cal.active === true) {
      activeCalendars++;
    }

    const validation = validateAcademicCalendar(cal);
    if (!validation.valid) {
      invalidCalendars++;
    }
  }

  return {
    totalCalendars: ACADEMIC_CALENDARS.length,
    duplicateCalendarIds,
    invalidCalendars,
    activeCalendars,
  };
}

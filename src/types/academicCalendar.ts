/**
 * TeachSmartGH - Primary Scheme of Learning V2 Academic Calendar Types
 *
 * Architectural Principles:
 * 1. Curriculum sequencing must NOT permanently hardcode absolute calendar weeks (e.g. Week 4, Week 5).
 *    Academic terms shift each year depending on Ghana Education Service (GES) directives,
 *    public holidays, election days, and school-specific adjustments.
 * 2. `SchemeSequence` stores recommended term, sequence order, and pacing duration.
 *    `AcademicCalendar` is the external temporal lens that maps those recommendations
 *    into concrete classroom dates and delivery weeks for a given academic year.
 * 3. Calendar weeks (`weekNumber`) and teaching weeks (`teachingWeekNumber`) are distinct concepts:
 *    - `weekNumber`: 1-based index of physical weeks elapsed in a school term.
 *    - `teachingWeekNumber`: Sequential counter of actual instructional delivery weeks.
 * 4. Mid-term breaks, public holidays, revision, and assessment periods must not be treated
 *    as ordinary instructional teaching weeks.
 * 5. Different terms and academic years possess variable lengths (e.g. 12-week Term 1 vs 14-week Term 2).
 * 6. Academic calendar metadata must NEVER modify or overwrite official NaCCA curriculum records.
 * 7. Calendar authority (GES / Ministry of Education) is fully independent from curriculum authority (NaCCA).
 */

// --------------------------------------------------
// 1. TERM NUMBER
// --------------------------------------------------

export type AcademicTermNumber = 1 | 2 | 3;

// --------------------------------------------------
// 2. CALENDAR DATE RANGE
// --------------------------------------------------

export interface CalendarDateRange {
  /** ISO 8601 calendar date format: YYYY-MM-DD */
  startDate: string;
  /** ISO 8601 calendar date format: YYYY-MM-DD */
  endDate: string;
  label?: string;
}

// --------------------------------------------------
// 3. WEEK ROLE
// --------------------------------------------------

export type AcademicWeekRole =
  | 'INSTRUCTION'
  | 'MID_TERM'
  | 'REVISION'
  | 'ASSESSMENT'
  | 'HOLIDAY'
  | 'NON_TEACHING';

// --------------------------------------------------
// 4. CALENDAR WEEK
// --------------------------------------------------

export interface AcademicCalendarWeek {
  /** Sequential calendar position within the school term (1 to totalCalendarWeeks) */
  weekNumber: number;

  /** ISO 8601 calendar date format: YYYY-MM-DD */
  startDate?: string;
  /** ISO 8601 calendar date format: YYYY-MM-DD */
  endDate?: string;

  /** Functional role of this calendar week */
  role: AcademicWeekRole;

  /**
   * Sequential instructional progression number.
   * Only assigned if the week permits instructional lesson delivery.
   * Omitted for holiday, mid-term break, or dedicated non-teaching weeks.
   */
  teachingWeekNumber?: number;

  label?: string;
}

// --------------------------------------------------
// 5. TERM CALENDAR
// --------------------------------------------------

export interface AcademicTermCalendar {
  term: AcademicTermNumber;

  /** ISO 8601 calendar date format: YYYY-MM-DD */
  startDate: string;
  /** ISO 8601 calendar date format: YYYY-MM-DD */
  endDate: string;

  totalCalendarWeeks: number;
  teachingWeeks: number;

  revisionWeeks: number;
  assessmentWeeks: number;

  midTermBreaks?: readonly CalendarDateRange[];
  holidays?: readonly CalendarDateRange[];

  weeks?: readonly AcademicCalendarWeek[];
}

// --------------------------------------------------
// 6. CALENDAR AUTHORITY
// --------------------------------------------------

export type AcademicCalendarAuthority =
  | 'GES'
  | 'MINISTRY_OF_EDUCATION'
  | 'SCHOOL_ADAPTED'
  | 'MANUAL';

// --------------------------------------------------
// 7. ACADEMIC CALENDAR
// --------------------------------------------------

export interface AcademicCalendar {
  calendarId: string;

  academicYear: string;

  level:
    | 'KG'
    | 'Primary'
    | 'JHS'
    | 'SHS'
    | 'TVET'
    | 'Other';

  authority: AcademicCalendarAuthority;

  terms: readonly AcademicTermCalendar[];

  sourceName?: string;
  sourceDocument?: string;
  sourceDate?: string;

  version: string;

  active: boolean;
}

// --------------------------------------------------
// 8. CALENDAR VALIDATION RESULT
// --------------------------------------------------

export interface AcademicCalendarValidationResult {
  valid: boolean;

  duplicateTerms: AcademicTermNumber[];

  missingTerms: AcademicTermNumber[];

  invalidDateRanges: string[];

  invalidWeekCounts: string[];

  invalidTeachingWeekCounts: string[];

  invalidRevisionWeekCounts: string[];

  invalidAssessmentWeekCounts: string[];
}

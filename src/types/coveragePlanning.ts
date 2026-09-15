/**
 * TeachSmartGH - Primary Scheme of Learning Coverage Planning Types
 *
 * Architectural Principles:
 * 1. Separation of Concerns:
 *    - CurriculumRecord answers: "WHAT does NaCCA officially mandate?" (Immutable)
 *    - SchemeSequence / CoveragePlan answers: "WHEN and HOW does TeachSmartGH suggest teaching it?" (Editable)
 *    - AcademicCalendar answers: "WHAT are the physical school term dates and breaks?" (Administrative)
 * 2. Sequence Authority:
 *    - 'OFFICIAL_PUBLISHED_SEQUENCE': Only when an official NaCCA publication prescribes the exact term/week sequence.
 *    - 'NACCA_GUIDANCE_DERIVED': Mathematically derived from NaCCA Resource Pack guidelines (e.g. 3-term indicator split).
 *    - 'TEACHSMARTGH_SUGGESTED_COVERAGE': Pedagogical suggested pacing developed by TeachSmartGH.
 *    - 'TEACHER_CUSTOMIZED': Customized or reordered by the individual teacher/school.
 * 3. Calendar Slots vs Teaching Weeks:
 *    - calendarWeek (1..N): Physical calendar progression.
 *    - slotType: 'INSTRUCTION' | 'REVISION' | 'ASSESSMENT' | 'BREAK' | 'INTERRUPTION'.
 *    - A calendar week is NOT automatically an instructional teaching week.
 * 4. Extensive Reading (Strand 6):
 *    - B4.6.1.1.1 is NOT a one-off indicator. It possesses PRIMARY COVERAGE (initial setup/orientation)
 *      and RECURRING PRACTICE (continuous weekly library/reading log application).
 */

import type { SequenceAuthority } from './curriculumV2';

// --------------------------------------------------
// 1. CALENDAR SLOT TYPE
// --------------------------------------------------

export type CalendarSlotType =
  | 'INSTRUCTION'
  | 'REVISION'
  | 'ASSESSMENT'
  | 'BREAK'
  | 'INTERRUPTION';

// --------------------------------------------------
// 2. COVERAGE PLAN STATUS
// --------------------------------------------------

export type CoveragePlanStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

// --------------------------------------------------
// 3. EXTENSIVE READING DELIVERY MODE
// --------------------------------------------------

export type ExtensiveReadingMode =
  | 'PRIMARY_COVERAGE'
  | 'RECURRING_PRACTICE'
  | 'BOTH';

// --------------------------------------------------
// 4. COVERAGE ITEM TYPE
// --------------------------------------------------

export type CoverageItemType =
  | 'PRIMARY_INTRODUCTION'
  | 'RECURRING_CONSOLIDATION'
  | 'EXTENSIVE_READING_HABIT';

// --------------------------------------------------
// 5. PLANNING GUIDANCE PROFILE
// --------------------------------------------------

export interface PlanningGuidanceProfile {
  profileId: string;
  subject: string;
  classLevel: string;
  source: string;
  sourceDocument: string;
  sourceDocumentDate: string;
  planningModel: string;
  regularInstructionalStrands: readonly string[];
  extensiveReadingStrand?: string;
  weeklyPeriods: number;
  teacherReorderingAllowed: boolean;
  indicatorDistributionGuidance: string;
  pedagogicalInterpretationNotes: string;
}

// --------------------------------------------------
// 6. COVERAGE SLOT
// --------------------------------------------------

export interface CoverageSlot {
  slotId: string;
  term: 1 | 2 | 3;
  calendarWeek: number;
  slotType: CalendarSlotType;
  instructionalWeekNumber?: number;
  label: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// --------------------------------------------------
// 7. COVERAGE PLAN ITEM
// --------------------------------------------------

export interface CoveragePlanItem {
  coverageItemId: string;
  /** Primary link to immutable CurriculumRecord.recordId */
  curriculumRecordId: string;
  officialStandardCode: string;
  officialIndicatorCode: string;
  strand: string;
  subStrand: string;
  term: 1 | 2 | 3;
  slotId: string;
  calendarWeek: number;
  instructionalWeekNumber?: number;
  sequenceOrder: number;
  itemType: CoverageItemType;
  suggestedDurationPeriods?: number;
  notes?: string;
}

// --------------------------------------------------
// 8. COVERAGE PLAN IDENTITY & CONTAINER
// --------------------------------------------------

export interface CoveragePlan {
  planId: string;
  level: string;
  classLevel: string;
  subject: string;
  academicYear: string;
  calendarId: string;
  sequenceAuthority: SequenceAuthority;
  createdFromCurriculumVersion: string;
  teacherEditable: boolean;
  createdAt: string;
  updatedAt: string;
  status: CoveragePlanStatus;
  guidanceProfileId: string;
  slots: CoverageSlot[];
  items: CoveragePlanItem[];
  notes?: string;
}

// --------------------------------------------------
// 9. COVERAGE COMPLETENESS METRICS
// --------------------------------------------------

export interface CoverageCompletenessMetrics {
  totalAuthorityIndicators: number;
  sequencedUniqueIndicators: number;
  unsequencedIndicators: number;
  duplicateIntroErrors: number;
  recurringPracticeCount: number;
  invalidIndicators: number;
  termDistribution: {
    term1: number;
    term2: number;
    term3: number;
  };
  isComplete: boolean;
  unsequencedRecordIds: string[];
}

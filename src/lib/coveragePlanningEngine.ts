/**
 * TeachSmartGH - Basic 4 English Curriculum Coverage Planning Engine
 *
 * Architectural Principles:
 * 1. Statutory syllabus (CurriculumRecord) is immutable and authoritative.
 * 2. CoveragePlan is a temporal roadmap (WHEN to teach) with authority:
 *    'TEACHSMARTGH_SUGGESTED_COVERAGE'. It does not claim national statutory authority.
 * 3. Calendar weeks (calendarWeek) are decoupled from teaching weeks (instructionalWeekNumber).
 * 4. Slot types allow designation of INSTRUCTION, REVISION, ASSESSMENT, BREAK, and INTERRUPTION.
 * 5. Strand 6 (Extensive Reading: B4.6.1.1.1) is supported via PRIMARY_INTRODUCTION plus
 *    recurring weekly EXTENSIVE_READING_HABIT occurrences.
 * 6. Completeness metrics mathematically verify that all 131 indicators are sequenced
 *    with zero omissions, zero false duplicates, and zero cross-class contamination.
 */

import type { CurriculumRecord } from '../types/curriculumV2';
import type {
  CalendarSlotType,
  CoverageCompletenessMetrics,
  CoverageItemType,
  CoveragePlan,
  CoveragePlanItem,
  CoverageSlot,
  PlanningGuidanceProfile,
} from '../types/coveragePlanning';
import type { AcademicCalendar } from '../types/academicCalendar';
import { BASIC_4_ENGLISH_PLANNING_GUIDANCE } from '../data/planningGuidanceProfiles';
import { getB4EnglishAuthoritativeCurriculumRecords } from '../data/curriculumRegistry';
import { getActiveAcademicCalendar } from '../data/academicCalendars';

// --------------------------------------------------
// 1. CALENDAR SLOT GENERATION
// --------------------------------------------------

export interface GenerateSlotsOptions {
  calendar: AcademicCalendar;
  term: 1 | 2 | 3;
  defaultRevisionWeeks?: number;
  defaultAssessmentWeeks?: number;
}

/**
 * Generates decoupled calendar slots for a specified academic calendar and term.
 * Distinguishes chronological calendar weeks from actual instructional delivery weeks.
 */
export function generateCoverageSlotsForTerm(options: GenerateSlotsOptions): CoverageSlot[] {
  const { calendar, term, defaultRevisionWeeks = 1, defaultAssessmentWeeks = 1 } = options;

  const termCal = calendar.terms.find(t => t.term === term);
  if (!termCal) {
    throw new Error(
      `Term ${term} not found in academic calendar ${calendar.calendarId}`
    );
  }

  const totalWeeks = termCal.totalCalendarWeeks;
  const nonInstructionalWeeks = defaultRevisionWeeks + defaultAssessmentWeeks;
  const targetInstructionalWeeks = Math.max(1, totalWeeks - nonInstructionalWeeks);

  const slots: CoverageSlot[] = [];
  let instructionalCounter = 1;

  for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
    let slotType: CalendarSlotType = 'INSTRUCTION';
    let label = `Week ${weekNum} (Instructional)`;
    let instWeekNum: number | undefined = instructionalCounter;

    if (weekNum > targetInstructionalWeeks) {
      const offset = weekNum - targetInstructionalWeeks;
      if (offset <= defaultRevisionWeeks) {
        slotType = 'REVISION';
        label = `Week ${weekNum} (Revision & Consolidation)`;
        instWeekNum = undefined;
      } else {
        slotType = 'ASSESSMENT';
        label = `Week ${weekNum} (End of Term Assessment)`;
        instWeekNum = undefined;
      }
    } else {
      instructionalCounter++;
    }

    // Check for mid-term breaks or events
    let notes: string | undefined;
    if (termCal.midTermBreaks && termCal.midTermBreaks.length > 0) {
      // If mid-term break falls around the middle week of instruction
      const midPoint = Math.floor(targetInstructionalWeeks / 2);
      if (weekNum === midPoint) {
        const breakLabel = termCal.midTermBreaks[0].label || 'Mid-Term Break';
        notes = `${breakLabel} (${termCal.midTermBreaks[0].startDate} to ${termCal.midTermBreaks[0].endDate})`;
      }
    }

    slots.push({
      slotId: `SLOT-${calendar.calendarId}-T${term}-W${weekNum}`,
      term,
      calendarWeek: weekNum,
      slotType,
      instructionalWeekNumber: instWeekNum,
      label,
      notes,
    });
  }

  return slots;
}

// --------------------------------------------------
// 2. COVERAGE COMPLETENESS AUDIT
// --------------------------------------------------

/**
 * Pure audit function that validates whether all 131 authoritative indicators
 * are covered by the plan, checking for omissions, false duplicates, and invalid references.
 */
export function computeCoverageCompletenessMetrics(
  plan: CoveragePlan,
  authorityRecords?: readonly CurriculumRecord[]
): CoverageCompletenessMetrics {
  const records = authorityRecords ?? getB4EnglishAuthoritativeCurriculumRecords();
  const totalAuthority = records.length; // 131 for Basic 4 English

  const validRecordIds = new Set(records.map(r => r.recordId));
  const validIndicatorCodes = new Set(records.map(r => r.officialIndicatorCode));

  const primaryIntroducedRecordIds = new Set<string>();
  let duplicateIntroErrors = 0;
  let recurringPracticeCount = 0;
  let invalidIndicators = 0;

  const termDistribution = {
    term1: 0,
    term2: 0,
    term3: 0,
  };

  for (const item of plan.items) {
    // Validate existence in curriculum authority
    const isValidId = validRecordIds.has(item.curriculumRecordId);
    const isValidCode = validIndicatorCodes.has(item.officialIndicatorCode);

    if (!isValidId || !isValidCode) {
      invalidIndicators++;
      continue;
    }

    if (item.itemType === 'PRIMARY_INTRODUCTION') {
      if (primaryIntroducedRecordIds.has(item.curriculumRecordId)) {
        duplicateIntroErrors++;
      } else {
        primaryIntroducedRecordIds.add(item.curriculumRecordId);
        if (item.term === 1) termDistribution.term1++;
        else if (item.term === 2) termDistribution.term2++;
        else if (item.term === 3) termDistribution.term3++;
      }
    } else {
      recurringPracticeCount++;
    }
  }

  const sequencedUniqueIndicators = primaryIntroducedRecordIds.size;
  const unsequencedIndicators = totalAuthority - sequencedUniqueIndicators;

  const unsequencedRecordIds: string[] = [];
  for (const rec of records) {
    if (!primaryIntroducedRecordIds.has(rec.recordId)) {
      unsequencedRecordIds.push(rec.recordId);
    }
  }

  const isComplete =
    sequencedUniqueIndicators === totalAuthority &&
    unsequencedIndicators === 0 &&
    duplicateIntroErrors === 0 &&
    invalidIndicators === 0;

  return {
    totalAuthorityIndicators: totalAuthority,
    sequencedUniqueIndicators,
    unsequencedIndicators,
    duplicateIntroErrors,
    recurringPracticeCount,
    invalidIndicators,
    termDistribution,
    isComplete,
    unsequencedRecordIds,
  };
}

// --------------------------------------------------
// 3. DETERMINISTIC BASIC 4 ENGLISH COVERAGE PLAN GENERATOR
// --------------------------------------------------

export interface GenerateB4EnglishPlanOptions {
  academicYear?: string;
  calendarId?: string;
  status?: CoveragePlan['status'];
}

/**
 * Builds a 100% complete, deterministic curriculum coverage plan for Basic 4 English.
 * Strictly respects:
 * 1. Authority = 'TEACHSMARTGH_SUGGESTED_COVERAGE'
 * 2. All 131 official indicators are allocated as PRIMARY_INTRODUCTION across 3 terms (zero omissions).
 * 3. Strand 6 (B4.6.1.1.1) is introduced in Term 1 and recurs across terms as EXTENSIVE_READING_HABIT.
 * 4. Pacing follows the NaCCA Resource Pack (p. 71) formula: 5 regular strands taught in parallel weekly.
 */
export function generateDeterministicB4EnglishCoveragePlan(
  options: GenerateB4EnglishPlanOptions = {}
): CoveragePlan {
  const academicYear = options.academicYear || '2026/2027';
  const calendar = getActiveAcademicCalendar(academicYear, 'Primary');
  if (!calendar) {
    throw new Error(`No active Primary calendar found for academic year ${academicYear}`);
  }

  const calendarId = options.calendarId || calendar.calendarId;
  const authorityRecords = getB4EnglishAuthoritativeCurriculumRecords();
  const guidanceProfile: PlanningGuidanceProfile = BASIC_4_ENGLISH_PLANNING_GUIDANCE;

  // Generate slots for all 3 terms
  const allSlots: CoverageSlot[] = [
    ...generateCoverageSlotsForTerm({ calendar, term: 1 }),
    ...generateCoverageSlotsForTerm({ calendar, term: 2 }),
    ...generateCoverageSlotsForTerm({ calendar, term: 3 }),
  ];

  // Group authority records by strand (preserving official curriculum order)
  const strandGroups = new Map<string, CurriculumRecord[]>();
  for (const rec of authorityRecords) {
    const list = strandGroups.get(rec.strand) || [];
    list.push(rec);
    strandGroups.set(rec.strand, list);
  }

  // Partition each strand across 3 terms according to NaCCA p. 71 formula
  const term1Records: CurriculumRecord[] = [];
  const term2Records: CurriculumRecord[] = [];
  const term3Records: CurriculumRecord[] = [];

  for (const [strandName, recs] of strandGroups.entries()) {
    if (strandName === 'Extensive Reading') {
      // Strand 6: Primary introduction in Term 1
      term1Records.push(...recs);
      continue;
    }

    const count = recs.length;
    const base = Math.floor(count / 3);
    const remainder = count % 3;

    // Distribute remainder to earlier terms
    const t1Count = base + (remainder >= 1 ? 1 : 0);
    const t2Count = base + (remainder === 2 ? 1 : 0);

    const t1Recs = recs.slice(0, t1Count);
    const t2Recs = recs.slice(t1Count, t1Count + t2Count);
    const t3Recs = recs.slice(t1Count + t2Count);

    term1Records.push(...t1Recs);
    term2Records.push(...t2Recs);
    term3Records.push(...t3Recs);
  }

  const items: CoveragePlanItem[] = [];
  let itemSequenceCounter = 1;

  // Helper to map term records into instructional slots of that term
  const mapRecordsToTermSlots = (
    term: 1 | 2 | 3,
    termRecs: CurriculumRecord[]
  ) => {
    const termSlots = allSlots.filter(s => s.term === term && s.slotType === 'INSTRUCTION');
    const totalInstWeeks = termSlots.length;

    // Group term records by strand
    const termStrands = new Map<string, CurriculumRecord[]>();
    for (const rec of termRecs) {
      const list = termStrands.get(rec.strand) || [];
      list.push(rec);
      termStrands.set(rec.strand, list);
    }

    // For each strand in this term, distribute indicators across the available instructional weeks
    for (const [strandName, recs] of termStrands.entries()) {
      if (strandName === 'Extensive Reading') {
        // Primary introduction in Week 1/2
        const slot = termSlots[0] || allSlots.find(s => s.term === term);
        if (slot) {
          recs.forEach(rec => {
            items.push({
              coverageItemId: `COV-ITEM-${planIdPrefix}-${itemSequenceCounter++}`,
              curriculumRecordId: rec.recordId,
              officialStandardCode: rec.officialStandardCode,
              officialIndicatorCode: rec.officialIndicatorCode,
              strand: rec.strand,
              subStrand: rec.subStrand,
              term,
              slotId: slot.slotId,
              calendarWeek: slot.calendarWeek,
              instructionalWeekNumber: slot.instructionalWeekNumber,
              sequenceOrder: itemSequenceCounter,
              itemType: 'PRIMARY_INTRODUCTION',
              suggestedDurationPeriods: 1,
              notes: 'Primary introduction: Book selection, reading log setup, and 2-paragraph summary criteria.',
            });
          });
        }
        continue;
      }

      // Distribute regular strand indicators across instructional weeks
      recs.forEach((rec, idx) => {
        const slotIndex = totalInstWeeks > 0 ? idx % totalInstWeeks : 0;
        const slot = termSlots[slotIndex];

        if (slot) {
          items.push({
            coverageItemId: `COV-ITEM-${planIdPrefix}-${itemSequenceCounter++}`,
            curriculumRecordId: rec.recordId,
            officialStandardCode: rec.officialStandardCode,
            officialIndicatorCode: rec.officialIndicatorCode,
            strand: rec.strand,
            subStrand: rec.subStrand,
            term,
            slotId: slot.slotId,
            calendarWeek: slot.calendarWeek,
            instructionalWeekNumber: slot.instructionalWeekNumber,
            sequenceOrder: itemSequenceCounter,
            itemType: 'PRIMARY_INTRODUCTION',
            suggestedDurationPeriods: 2,
          });
        }
      });
    }

    // Add recurring Extensive Reading habit entries for subsequent weeks/terms
    const extensiveReadingRec = authorityRecords.find(r => r.officialIndicatorCode === 'B4.6.1.1.1');
    if (extensiveReadingRec) {
      termSlots.forEach((slot, sIdx) => {
        // If it's not the primary introduction slot, add a recurring habit item
        if (!(term === 1 && sIdx === 0)) {
          items.push({
            coverageItemId: `COV-ITEM-${planIdPrefix}-${itemSequenceCounter++}`,
            curriculumRecordId: extensiveReadingRec.recordId,
            officialStandardCode: extensiveReadingRec.officialStandardCode,
            officialIndicatorCode: extensiveReadingRec.officialIndicatorCode,
            strand: extensiveReadingRec.strand,
            subStrand: extensiveReadingRec.subStrand,
            term,
            slotId: slot.slotId,
            calendarWeek: slot.calendarWeek,
            instructionalWeekNumber: slot.instructionalWeekNumber,
            sequenceOrder: itemSequenceCounter,
            itemType: 'EXTENSIVE_READING_HABIT',
            suggestedDurationPeriods: 1,
            notes: 'Recurring library period / free reading time & reading log review.',
          });
        }
      });
    }
  };

  const planIdPrefix = `B4-ENG-${academicYear.replace('/', '-')}`;

  mapRecordsToTermSlots(1, term1Records);
  mapRecordsToTermSlots(2, term2Records);
  mapRecordsToTermSlots(3, term3Records);

  const plan: CoveragePlan = {
    planId: `PLAN-${planIdPrefix}-SUGGESTED`,
    level: 'Primary',
    classLevel: 'Basic 4',
    subject: 'English',
    academicYear,
    calendarId,
    sequenceAuthority: 'TEACHSMARTGH_SUGGESTED_COVERAGE',
    createdFromCurriculumVersion: 'PRIMARY_B4_ENGLISH_NACCA_OFFICIAL_2019_V1',
    teacherEditable: true,
    createdAt: '2026-09-12T00:00:00.000Z',
    updatedAt: '2026-09-12T00:00:00.000Z',
    status: options.status || 'ACTIVE',
    guidanceProfileId: guidanceProfile.profileId,
    slots: allSlots,
    items,
    notes:
      'Grounded in the 2019 NaCCA Primary English Curriculum and Teacher Resource Pack pedagogical principles. Pacing is suggested and fully customizable by the classroom teacher.',
  };

  return plan;
}

// --------------------------------------------------
// 4. TEACHER CUSTOMIZATION HELPERS
// --------------------------------------------------

/**
 * Moves a coverage item to a different slot (week/term) while preserving curriculum immutability.
 * Non-mutating pure function.
 */
export function moveCoverageItemToSlot(
  plan: CoveragePlan,
  coverageItemId: string,
  targetSlotId: string,
  newOrder?: number
): CoveragePlan {
  const targetSlot = plan.slots.find(s => s.slotId === targetSlotId);
  if (!targetSlot) {
    throw new Error(`Target slot ${targetSlotId} not found in plan`);
  }

  const updatedItems = plan.items.map(item => {
    if (item.coverageItemId === coverageItemId) {
      return {
        ...item,
        slotId: targetSlot.slotId,
        term: targetSlot.term,
        calendarWeek: targetSlot.calendarWeek,
        instructionalWeekNumber: targetSlot.instructionalWeekNumber,
        sequenceOrder: newOrder !== undefined ? newOrder : item.sequenceOrder,
      };
    }
    return item;
  });

  return {
    ...plan,
    sequenceAuthority: 'TEACHER_CUSTOMIZED',
    updatedAt: new Date().toISOString(),
    items: updatedItems,
  };
}

/**
 * Updates a slot type (e.g. converting an instructional week to a school sports/holiday interruption).
 * Non-mutating pure function.
 */
export function updateCoverageSlotType(
  plan: CoveragePlan,
  slotId: string,
  newType: CalendarSlotType,
  label?: string
): CoveragePlan {
  const updatedSlots = plan.slots.map(slot => {
    if (slot.slotId === slotId) {
      return {
        ...slot,
        slotType: newType,
        label: label || `${slot.label.split('(')[0].trim()} (${newType})`,
        instructionalWeekNumber: newType === 'INSTRUCTION' ? slot.instructionalWeekNumber : undefined,
      };
    }
    return slot;
  });

  return {
    ...plan,
    sequenceAuthority: 'TEACHER_CUSTOMIZED',
    updatedAt: new Date().toISOString(),
    slots: updatedSlots,
  };
}

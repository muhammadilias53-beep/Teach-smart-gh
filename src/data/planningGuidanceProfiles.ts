/**
 * TeachSmartGH - Planning Guidance Profiles Registry (Read-Only Foundation)
 *
 * Architectural Principles:
 * 1. Guidance profiles represent official pedagogical planning principles from NaCCA/GES
 *    (such as the 2019 Primary Teacher Resource Pack).
 * 2. They do NOT mutate statutory curriculum standards or indicators.
 * 3. They provide the configuration parameters used by the coverage planning engine to
 *    generate balanced, teacher-editable coverage plans.
 */

import type { PlanningGuidanceProfile } from '../types/coveragePlanning';

export const BASIC_4_ENGLISH_PLANNING_GUIDANCE: PlanningGuidanceProfile = {
  profileId: 'B4-ENGLISH-NACCA-2019',
  subject: 'English',
  classLevel: 'Basic 4',
  source: 'NaCCA Teacher Resource Pack 2019',
  sourceDocument:
    'Resource Guide for the Orientation of Primary School Teachers Towards the Implementation of the Revised Curriculum for Primary Schools',
  sourceDocumentDate: '2019',
  planningModel: '12-week baseline term model',
  regularInstructionalStrands: [
    'Oral Language',
    'Reading',
    'Grammar Usage at Word and Phrase Levels',
    'Writing',
    'Using Writing Conventions/ Grammar Usage',
  ] as const,
  extensiveReadingStrand: 'Extensive Reading',
  weeklyPeriods: 10,
  teacherReorderingAllowed: true,
  indicatorDistributionGuidance:
    'Divide indicator coverage across three terms; teach an aspect of each regular strand weekly.',
  pedagogicalInterpretationNotes:
    'The 2019 Teacher Resource Pack (Section 3.1, p. 71) instructs teachers to rotate through five core instructional strands across 10 weekly periods and distribute sub-strand indicators across 3 terms. Strand 6 (Extensive Reading: B4.6.1.1.1) is delivered through recurring library periods, reading corners, and personal reading logs as detailed in the official curriculum exemplar (p. 69). This structure reflects a TeachSmartGH coverage interpretation grounded in official NaCCA pedagogical principles and does not represent an official statutory declaration that Strand 6 is formally outside the 10 weekly English periods.',
};

export const PLANNING_GUIDANCE_PROFILES: readonly PlanningGuidanceProfile[] = [
  BASIC_4_ENGLISH_PLANNING_GUIDANCE,
];

/**
 * Returns all registered planning guidance profiles.
 */
export function getAllPlanningGuidanceProfiles(): readonly PlanningGuidanceProfile[] {
  return PLANNING_GUIDANCE_PROFILES;
}

/**
 * Retrieves a planning guidance profile for a specific subject and class level.
 */
export function getPlanningGuidanceProfile(
  subject: string,
  classLevel: string
): PlanningGuidanceProfile | undefined {
  const normSubject = subject.trim().toLowerCase();
  const normClass = classLevel.trim().toLowerCase();

  return PLANNING_GUIDANCE_PROFILES.find(
    p =>
      p.subject.trim().toLowerCase() === normSubject &&
      p.classLevel.trim().toLowerCase() === normClass
  );
}

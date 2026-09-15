/**
 * TeachSmartGH - Primary Scheme Sequence Registry (Read-Only Foundation)
 *
 * Architectural Principles:
 * 1. Scheme sequencing is pedagogical recommendation metadata and is strictly separate
 *    from NaCCA official curriculum authority.
 *    - CurriculumRecord answers: "What does NaCCA officially mandate?"
 *    - SchemeSequence answers: "Where and how does TeachSmartGH recommend pacing/scheduling it?"
 * 2. `curriculumRecordId` is the relationship key connecting sequences to curriculum records.
 * 3. Official NaCCA standard/indicator codes are NOT safe unique identities.
 * 4. Multiple sequence records may reference the same `curriculumRecordId`:
 *    - Subject pedagogy often requires repeated exposures (e.g. Physical Education practical loops),
 *      parallel strands (e.g. English oral/reading/writing concurrently), alternating weeks
 *      (e.g. Creative Arts visual vs performing arts), or multi-week blocks (History / RME).
 *    - Therefore, uniqueness is enforced ONLY on `sequenceId`, NEVER on `curriculumRecordId`.
 * 5. `recommendedDuration` represents pacing guidance in weeks/periods, not official identity.
 * 6. The initial registry is intentionally empty until reviewed sequencing evidence is audited.
 * 7. This is source-controlled static metadata: no runtime mutations or database writes are allowed.
 */

import type { SchemeSequence } from '../types/curriculumV2';

// --------------------------------------------------
// 1. READ-ONLY SEQUENCE REGISTRY
// --------------------------------------------------

/**
 * Static registry of reviewed curriculum scheme sequences.
 * Initialized empty as a baseline foundation.
 */
export const SCHEME_SEQUENCES: readonly SchemeSequence[] = [];

// --------------------------------------------------
// 2. READ-ONLY LOOKUP HELPERS
// --------------------------------------------------

/**
 * Returns all registered scheme sequences.
 */
export function getAllSchemeSequences(): readonly SchemeSequence[] {
  return SCHEME_SEQUENCES;
}

/**
 * Returns a specific scheme sequence by its unique sequenceId, or undefined if not found.
 */
export function getSchemeSequenceById(sequenceId: string): SchemeSequence | undefined {
  return SCHEME_SEQUENCES.find(seq => seq.sequenceId === sequenceId);
}

/**
 * Returns every sequence entry associated with a specific TeachSmartGH curriculumRecordId.
 * Matches strictly against curriculumRecordId, NOT officialIndicatorCode.
 */
export function getSchemeSequencesForRecord(curriculumRecordId: string): SchemeSequence[] {
  return SCHEME_SEQUENCES.filter(seq => seq.curriculumRecordId === curriculumRecordId);
}

/**
 * Returns all sequences whose recommendedTerm matches the requested term.
 */
export function getSchemeSequencesForTerm(term: 1 | 2 | 3): SchemeSequence[] {
  return SCHEME_SEQUENCES.filter(seq => seq.recommendedTerm === term);
}

/**
 * Returns true if at least one sequence entry exists for the specified curriculum record.
 */
export function hasSchemeSequence(curriculumRecordId: string): boolean {
  return SCHEME_SEQUENCES.some(seq => seq.curriculumRecordId === curriculumRecordId);
}

// --------------------------------------------------
// 3. ORDERING HELPER
// --------------------------------------------------

/**
 * Pure helper that returns a new array of sequences sorted ascending by sequenceOrder.
 * Breaks ties deterministically using sequenceId. Never mutates input array.
 */
export function sortSchemeSequencesByOrder(
  sequences: readonly SchemeSequence[]
): SchemeSequence[] {
  return [...sequences].sort((a, b) => {
    if (a.sequenceOrder !== b.sequenceOrder) {
      return a.sequenceOrder - b.sequenceOrder;
    }
    return a.sequenceId.localeCompare(b.sequenceId);
  });
}

// --------------------------------------------------
// 4. READ-ONLY VALIDATION HELPER
// --------------------------------------------------

export interface SchemeSequenceRegistryValidationResult {
  totalSequences: number;
  duplicateSequenceIds: number;
  invalidTerms: number;
  invalidSequenceOrders: number;
  invalidDurations: number;
  missingCurriculumRecordIds: number;
}

/**
 * Pure, side-effect-free diagnostic helper to validate sequence registry structural integrity.
 * Validates registry structure only without external dependencies.
 */
export function validateSchemeSequenceRegistry(): SchemeSequenceRegistryValidationResult {
  const seenIds = new Set<string>();
  let duplicateSequenceIds = 0;
  let invalidTerms = 0;
  let invalidSequenceOrders = 0;
  let invalidDurations = 0;
  let missingCurriculumRecordIds = 0;

  for (const seq of SCHEME_SEQUENCES) {
    if (seenIds.has(seq.sequenceId)) {
      duplicateSequenceIds++;
    }
    seenIds.add(seq.sequenceId);

    if (seq.recommendedTerm !== 1 && seq.recommendedTerm !== 2 && seq.recommendedTerm !== 3) {
      invalidTerms++;
    }

    if (typeof seq.sequenceOrder !== 'number' || !Number.isFinite(seq.sequenceOrder) || seq.sequenceOrder < 0) {
      invalidSequenceOrders++;
    }

    if (
      seq.recommendedDuration !== undefined &&
      (typeof seq.recommendedDuration !== 'number' ||
        !Number.isFinite(seq.recommendedDuration) ||
        seq.recommendedDuration <= 0)
    ) {
      invalidDurations++;
    }

    if (!seq.curriculumRecordId || seq.curriculumRecordId.trim() === '') {
      missingCurriculumRecordIds++;
    }
  }

  return {
    totalSequences: SCHEME_SEQUENCES.length,
    duplicateSequenceIds,
    invalidTerms,
    invalidSequenceOrders,
    invalidDurations,
    missingCurriculumRecordIds,
  };
}

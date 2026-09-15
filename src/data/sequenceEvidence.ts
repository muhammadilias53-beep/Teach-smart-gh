/**
 * TeachSmartGH - Primary Sequence Evidence Registry (Read-Only Foundation)
 *
 * Architectural Principles:
 * 1. Evidence does NOT modify official NaCCA curriculum content.
 *    Official curriculum standards and indicators remain immutable as published by NaCCA.
 * 2. Evidence does NOT automatically determine the final sequence.
 *    Evidence answers: "Why does TeachSmartGH recommend this sequence placement?",
 *    serving as provenance, justification, and audit trail for pedagogical choices.
 * 3. Evidence may support OR conflict with a recommendation.
 *    Conflicting evidence (e.g. divergence between publisher schemes and regional practices)
 *    is preserved with `supportsRecommendation: false` rather than discarded.
 * 4. Multiple independent evidence entries may reference the same `sequenceId`.
 *    Cross-verification requires linking multiple sources to one sequence recommendation.
 * 5. Publisher evidence (e.g. Best Brain, PB Pagez) is supporting evidence only
 *    and is never itself official NaCCA curriculum authority.
 * 6. The initial registry is intentionally empty until evidence is verified through
 *    a controlled research reconciliation process.
 * 7. This is source-controlled static metadata: no runtime mutations or database writes are allowed.
 */

import type { SequenceEvidence } from '../types/curriculumV2';

// --------------------------------------------------
// 1. READ-ONLY EVIDENCE REGISTRY
// --------------------------------------------------

/**
 * Static registry of reviewed sequence pacing and term placement evidence.
 * Initialized empty as a baseline foundation.
 */
export const SEQUENCE_EVIDENCE: readonly SequenceEvidence[] = [];

// --------------------------------------------------
// 2. READ-ONLY LOOKUP HELPERS
// --------------------------------------------------

/**
 * Returns all registered sequence evidence.
 */
export function getAllSequenceEvidence(): readonly SequenceEvidence[] {
  return SEQUENCE_EVIDENCE;
}

/**
 * Returns a specific sequence evidence item by its unique evidenceId, or undefined if not found.
 */
export function getSequenceEvidenceById(evidenceId: string): SequenceEvidence | undefined {
  return SEQUENCE_EVIDENCE.find(evidence => evidence.evidenceId === evidenceId);
}

/**
 * Returns all evidence entries linked to one SchemeSequence.
 * Matches strictly against sequenceId, NOT curriculumRecordId or official indicator codes.
 */
export function getSequenceEvidenceForSequence(sequenceId: string): SequenceEvidence[] {
  return SEQUENCE_EVIDENCE.filter(evidence => evidence.sequenceId === sequenceId);
}

/**
 * Returns only evidence entries that support the sequence recommendation.
 */
export function getSupportingEvidenceForSequence(sequenceId: string): SequenceEvidence[] {
  return SEQUENCE_EVIDENCE.filter(
    evidence => evidence.sequenceId === sequenceId && evidence.supportsRecommendation === true
  );
}

/**
 * Returns only evidence entries that conflict with or diverge from the sequence recommendation.
 * Preserves conflicting evidence for complete transparency.
 */
export function getConflictingEvidenceForSequence(sequenceId: string): SequenceEvidence[] {
  return SEQUENCE_EVIDENCE.filter(
    evidence => evidence.sequenceId === sequenceId && evidence.supportsRecommendation === false
  );
}

/**
 * Returns all evidence from the specified source category.
 */
export function getSequenceEvidenceBySourceCategory(
  sourceCategory: SequenceEvidence['sourceCategory']
): SequenceEvidence[] {
  return SEQUENCE_EVIDENCE.filter(evidence => evidence.sourceCategory === sourceCategory);
}

// --------------------------------------------------
// 3. READ-ONLY VALIDATION HELPER
// --------------------------------------------------

export interface SequenceEvidenceRegistryValidationResult {
  totalEvidence: number;
  duplicateEvidenceIds: number;
  missingSequenceIds: number;
  missingSourceNames: number;
  invalidObservedTerms: number;
  invalidObservedWeeks: number;
}

/**
 * Pure, side-effect-free diagnostic helper to validate sequence evidence registry structural integrity.
 */
export function validateSequenceEvidenceRegistry(): SequenceEvidenceRegistryValidationResult {
  const seenIds = new Set<string>();
  let duplicateEvidenceIds = 0;
  let missingSequenceIds = 0;
  let missingSourceNames = 0;
  let invalidObservedTerms = 0;
  let invalidObservedWeeks = 0;

  for (const evidence of SEQUENCE_EVIDENCE) {
    if (seenIds.has(evidence.evidenceId)) {
      duplicateEvidenceIds++;
    }
    seenIds.add(evidence.evidenceId);

    if (!evidence.sequenceId || evidence.sequenceId.trim() === '') {
      missingSequenceIds++;
    }

    if (!evidence.sourceName || evidence.sourceName.trim() === '') {
      missingSourceNames++;
    }

    if (
      evidence.observedTerm !== undefined &&
      evidence.observedTerm !== 1 &&
      evidence.observedTerm !== 2 &&
      evidence.observedTerm !== 3
    ) {
      invalidObservedTerms++;
    }

    if (
      evidence.observedWeek !== undefined &&
      (typeof evidence.observedWeek !== 'number' ||
        !Number.isFinite(evidence.observedWeek) ||
        evidence.observedWeek <= 0)
    ) {
      invalidObservedWeeks++;
    }
  }

  return {
    totalEvidence: SEQUENCE_EVIDENCE.length,
    duplicateEvidenceIds,
    missingSequenceIds,
    missingSourceNames,
    invalidObservedTerms,
    invalidObservedWeeks,
  };
}

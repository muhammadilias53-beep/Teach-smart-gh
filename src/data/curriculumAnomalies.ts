/**
 * TeachSmartGH - Primary Curriculum Anomaly Registry (Read-Only Foundation)
 *
 * Architectural Principles:
 * 1. Official source anomalies are preserved rather than silently corrected.
 *    Any discrepancies, code numbering collisions, or formatting idiosyncrasies present
 *    in official NaCCA printed curricula are explicitly captured and documented here.
 * 2. `curriculumRecordId` is the authoritative relationship key between a curriculum
 *    record and its anomaly metadata.
 * 3. NaCCA standard and indicator codes are NOT safe unique identities.
 *    Because official syllabi contain repeated or non-standard indicator codes,
 *    anomalies must attach to the TeachSmartGH surrogate `curriculumRecordId`.
 * 4. The registry is intentionally initialized empty until source-verified anomalies
 *    are audited and introduced in later controlled phases.
 * 5. This is static, source-controlled metadata: no runtime mutations or user-generated
 *    modifications are permitted.
 */

import type { CurriculumAnomaly } from '../types/curriculumV2';

// --------------------------------------------------
// 1. READ-ONLY ANOMALY REGISTRY
// --------------------------------------------------

/**
 * Static registry of documented official curriculum source anomalies.
 * Initialized empty as a baseline foundation.
 */
export const CURRICULUM_ANOMALIES: readonly CurriculumAnomaly[] = [];

// --------------------------------------------------
// 2. READ-ONLY LOOKUP HELPERS
// --------------------------------------------------

/**
 * Returns all registered curriculum anomalies.
 */
export function getAllCurriculumAnomalies(): readonly CurriculumAnomaly[] {
  return CURRICULUM_ANOMALIES;
}

/**
 * Returns a specific anomaly by its unique anomalyId, or undefined if not found.
 */
export function getCurriculumAnomalyById(anomalyId: string): CurriculumAnomaly | undefined {
  return CURRICULUM_ANOMALIES.find(anomaly => anomaly.anomalyId === anomalyId);
}

/**
 * Returns every anomaly associated with a specific TeachSmartGH curriculumRecordId.
 * Matches strictly against curriculumRecordId, NOT officialIndicatorCode.
 */
export function getCurriculumAnomaliesForRecord(curriculumRecordId: string): CurriculumAnomaly[] {
  return CURRICULUM_ANOMALIES.filter(anomaly => anomaly.curriculumRecordId === curriculumRecordId);
}

/**
 * Returns true only when at least one anomaly exists for the specified curriculum record.
 */
export function hasCurriculumAnomalies(curriculumRecordId: string): boolean {
  return CURRICULUM_ANOMALIES.some(anomaly => anomaly.curriculumRecordId === curriculumRecordId);
}

// --------------------------------------------------
// 3. READ-ONLY VALIDATION HELPER
// --------------------------------------------------

export interface CurriculumAnomalyRegistryValidationResult {
  totalAnomalies: number;
  duplicateAnomalyIds: number;
  missingCurriculumRecordIds: number;
}

/**
 * Pure, side-effect-free diagnostic helper to validate anomaly registry integrity.
 */
export function validateCurriculumAnomalyRegistry(): CurriculumAnomalyRegistryValidationResult {
  const seenIds = new Set<string>();
  let duplicateAnomalyIds = 0;
  let missingCurriculumRecordIds = 0;

  for (const anomaly of CURRICULUM_ANOMALIES) {
    if (seenIds.has(anomaly.anomalyId)) {
      duplicateAnomalyIds++;
    }
    seenIds.add(anomaly.anomalyId);

    if (!anomaly.curriculumRecordId || anomaly.curriculumRecordId.trim() === '') {
      missingCurriculumRecordIds++;
    }
  }

  return {
    totalAnomalies: CURRICULUM_ANOMALIES.length,
    duplicateAnomalyIds,
    missingCurriculumRecordIds,
  };
}

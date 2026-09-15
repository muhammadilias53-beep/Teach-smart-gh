/**
 * TeachSmartGH - Primary Scheme of Learning V2 Types Foundation
 *
 * Architectural Principles:
 * 1. Official Curriculum Authority is strictly separated from Scheme Sequencing.
 *    Authoritative NaCCA curriculum records capture the official syllabus as published,
 *    whereas SchemeSequence models recommended term/week distribution, duration, and pacing.
 * 2. `recordId` is independent of the official NaCCA code.
 *    Official indicator codes cannot be assumed to be globally unique due to known anomalies
 *    (e.g., duplicated numbering or erratic code prefixes in printed NaCCA curriculum handbooks).
 *    `recordId` serves as the surrogate primary identity across TeachSmartGH.
 * 3. Official source anomalies are preserved rather than silently corrected.
 *    Discrepancies, code collisions, and typography variations in official source documents
 *    are recorded explicitly via `CurriculumAnomaly` to maintain full provenance and auditability.
 */

// --------------------------------------------------
// 1. CURRICULUM VERIFICATION STATUS
// --------------------------------------------------

/**
 * Status of curriculum verification against official sources:
 * - 'VERIFIED_OFFICIAL_SOURCE': Authoritative fields verified directly against the official NaCCA curriculum publication.
 *                               (Does NOT imply NaCCA endorsement of TeachSmartGH).
 * - 'VERIFIED_EXACT': Exact match with verified dataset.
 * - 'VERIFIED_WITH_SOURCE_ANOMALY': Verified with documented printed source anomaly.
 * - 'REQUIRES_MANUAL_REVIEW': Staged or legacy record awaiting source audit.
 */
export type CurriculumVerificationStatus =
  | 'VERIFIED_OFFICIAL_SOURCE'
  | 'VERIFIED_EXACT'
  | 'VERIFIED_WITH_SOURCE_ANOMALY'
  | 'REQUIRES_MANUAL_REVIEW';

// --------------------------------------------------
// 2. CURRICULUM ANOMALY TYPE
// --------------------------------------------------

export type CurriculumAnomalyType =
  | 'DUPLICATE_OFFICIAL_CODE'
  | 'SOURCE_CODE_CONFLICT'
  | 'SOURCE_RANGE_CONFLICT'
  | 'SOURCE_CODE_STRUCTURE'
  | 'PDF_EXTRACTION'
  | 'TYPOGRAPHY'
  | 'WORDING_CONFLICT';

// --------------------------------------------------
// 3. ANOMALY RESOLUTION STATUS
// --------------------------------------------------

export type CurriculumAnomalyResolutionStatus =
  | 'DOCUMENTED'
  | 'NORMALIZATION_VERIFIED'
  | 'MANUAL_REVIEW_REQUIRED';

// --------------------------------------------------
// 4. CURRICULUM RECORD
// --------------------------------------------------

export interface CurriculumRecord {
  /** TeachSmartGH immutable surrogate primary identity */
  recordId: string;

  classLevel: string;
  subject: string;

  strand: string;
  subStrand: string;

  officialStandardCode: string;
  officialStandardText: string;

  /**
   * Official NaCCA indicator code.
   * NOTE: MUST NOT be assumed globally unique due to official source anomalies.
   */
  officialIndicatorCode: string;
  officialIndicatorText: string;

  authority: 'NaCCA';

  sourceDocument: string;
  sourceOrganization?: string;
  sourceDocumentDate?: string;
  sourcePage?: number;
  sourceOccurrence?: number;

  sourcePrintedStandardCode?: string;
  sourcePrintedIndicatorCode?: string;

  verificationStatus: CurriculumVerificationStatus;

  anomalyId?: string;

  curriculumVersion: string;

  active: boolean;
}

// --------------------------------------------------
// 5. CURRICULUM ANOMALY
// --------------------------------------------------

export interface CurriculumAnomaly {
  anomalyId: string;

  curriculumRecordId: string;

  type: CurriculumAnomalyType;

  sourceValue?: string;
  normalizedValue?: string;

  resolutionStatus: CurriculumAnomalyResolutionStatus;

  note: string;
}

// --------------------------------------------------
// 6. SEQUENCE AUTHORITY
// --------------------------------------------------

export type SequenceAuthority =
  | 'OFFICIAL_PUBLISHED_SEQUENCE'
  | 'NACCA_GUIDANCE_DERIVED'
  | 'TEACHSMARTGH_SUGGESTED_COVERAGE'
  | 'TEACHER_CUSTOMIZED'
  | 'NACCA_EXPLICIT'
  | 'CROSS_VERIFIED_HIGH'
  | 'CROSS_VERIFIED_MEDIUM'
  | 'PROVISIONAL';

// --------------------------------------------------
// 7. SCHEDULING MODE
// --------------------------------------------------

export type SchedulingMode =
  | 'PARALLEL'
  | 'SEQUENTIAL'
  | 'THEMATIC_BLOCK'
  | 'ALTERNATING'
  | 'PRACTICAL';

// --------------------------------------------------
// 8. SCHEME SEQUENCE
// --------------------------------------------------

export interface SchemeSequence {
  sequenceId: string;

  /** References CurriculumRecord.recordId, NOT officialIndicatorCode */
  curriculumRecordId: string;

  recommendedTerm: 1 | 2 | 3;

  sequenceOrder: number;

  recommendedDuration?: number;

  schedulingMode: SchedulingMode;

  sequenceAuthority: SequenceAuthority;

  teacherReviewRecommended: boolean;
}

// --------------------------------------------------
// 9. SEQUENCE EVIDENCE SOURCE CATEGORY
// --------------------------------------------------

export type SequenceEvidenceSourceCategory =
  | 'NACCA_RESOURCE_PACK'
  | 'NACCA_TRAINING_GUIDE'
  | 'NACCA_APPROVED_MATERIAL'
  | 'DIRECTORATE_SCHEME'
  | 'BEST_BRAIN'
  | 'PB_PAGEZ'
  | 'OTHER_REVIEWED_SOURCE';

// --------------------------------------------------
// 10. SEQUENCE EVIDENCE
// --------------------------------------------------

export interface SequenceEvidence {
  evidenceId: string;

  sequenceId: string;

  sourceCategory: SequenceEvidenceSourceCategory;

  sourceName: string;

  sourceDocument?: string;
  sourcePage?: number;

  academicYear?: string;

  observedTerm?: 1 | 2 | 3;
  observedWeek?: number;

  supportsRecommendation: boolean;

  note?: string;
}

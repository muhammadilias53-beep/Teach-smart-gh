/**
 * TeachSmartGH - Primary Scheme of Learning V2 Integrity Validator (Read-Only)
 *
 * Architectural Principles:
 * 1. Pure, non-mutating validation of the V2 metadata layer.
 * 2. Verifies referential integrity across:
 *    CurriculumRecord -> CurriculumAnomaly -> SchemeSequence -> SequenceEvidence -> AcademicCalendar
 * 3. Does not modify any registry or write to any persistence layer.
 * 4. Distinctly separates critical structural errors (which invalidate the package)
 *    from informative readiness warnings (which document staging limitations).
 */

import {
  getB4EnglishLegacyCurriculumRecordsV2,
  B4_ENGLISH_LEGACY_PACKAGE,
} from '../data/curriculumRegistry';
import { getAllCurriculumAnomalies } from '../data/curriculumAnomalies';
import { getAllSchemeSequences } from '../data/schemeSequences';
import { getAllSequenceEvidence } from '../data/sequenceEvidence';
import {
  getAllAcademicCalendars,
  validateAcademicCalendar,
} from '../data/academicCalendars';
import type {
  CurriculumRecord,
  CurriculumVerificationStatus,
  SchemeSequence,
  SequenceEvidence,
} from '../types/curriculumV2';

// --------------------------------------------------
// 1. REPORT INTERFACE
// --------------------------------------------------

export interface CurriculumV2IntegrityReport {
  valid: boolean;

  curriculumRecordCount: number;
  anomalyCount: number;
  sequenceCount: number;
  evidenceCount: number;
  calendarCount: number;

  duplicateCurriculumRecordIds: string[];
  duplicateAnomalyIds: string[];
  duplicateSequenceIds: string[];
  duplicateEvidenceIds: string[];
  duplicateCalendarIds: string[];

  orphanAnomalyRecordIds: string[];
  orphanSequenceRecordIds: string[];
  orphanEvidenceSequenceIds: string[];

  invalidCurriculumRecords: string[];
  invalidSequences: string[];
  invalidEvidence: string[];
  invalidCalendars: string[];

  warnings: string[];
}

// --------------------------------------------------
// 2. HELPER FUNCTIONS
// --------------------------------------------------

function findDuplicateIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    } else {
      seen.add(id);
    }
  }

  return Array.from(duplicates);
}

const VALID_VERIFICATION_STATUSES: Set<CurriculumVerificationStatus> = new Set([
  'VERIFIED_OFFICIAL_SOURCE',
  'VERIFIED_EXACT',
  'VERIFIED_WITH_SOURCE_ANOMALY',
  'REQUIRES_MANUAL_REVIEW',
]);

function validateCurriculumRecord(record: CurriculumRecord): boolean {
  if (typeof record.recordId !== 'string' || record.recordId.trim().length === 0) return false;
  if (typeof record.classLevel !== 'string' || record.classLevel.trim().length === 0) return false;
  if (typeof record.subject !== 'string' || record.subject.trim().length === 0) return false;
  if (typeof record.strand !== 'string' || record.strand.trim().length === 0) return false;
  if (typeof record.subStrand !== 'string' || record.subStrand.trim().length === 0) return false;
  if (typeof record.officialStandardCode !== 'string' || record.officialStandardCode.trim().length === 0) return false;
  if (typeof record.officialStandardText !== 'string' || record.officialStandardText.trim().length === 0) return false;
  if (typeof record.officialIndicatorCode !== 'string' || record.officialIndicatorCode.trim().length === 0) return false;
  if (typeof record.officialIndicatorText !== 'string' || record.officialIndicatorText.trim().length === 0) return false;
  if (record.authority !== 'NaCCA') return false;
  if (typeof record.sourceDocument !== 'string' || record.sourceDocument.trim().length === 0) return false;
  if (typeof record.curriculumVersion !== 'string' || record.curriculumVersion.trim().length === 0) return false;
  if (!VALID_VERIFICATION_STATUSES.has(record.verificationStatus)) return false;
  if (typeof record.active !== 'boolean') return false;

  return true;
}

function validateSchemeSequence(sequence: SchemeSequence): boolean {
  if (typeof sequence.sequenceId !== 'string' || sequence.sequenceId.trim().length === 0) return false;
  if (typeof sequence.curriculumRecordId !== 'string' || sequence.curriculumRecordId.trim().length === 0) return false;
  if (sequence.recommendedTerm !== 1 && sequence.recommendedTerm !== 2 && sequence.recommendedTerm !== 3) return false;
  if (typeof sequence.sequenceOrder !== 'number' || !Number.isFinite(sequence.sequenceOrder) || sequence.sequenceOrder < 0) return false;
  if (
    sequence.recommendedDuration !== undefined &&
    (typeof sequence.recommendedDuration !== 'number' || !Number.isFinite(sequence.recommendedDuration) || sequence.recommendedDuration <= 0)
  ) {
    return false;
  }

  return true;
}

function validateSequenceEvidence(evidence: SequenceEvidence): boolean {
  if (typeof evidence.evidenceId !== 'string' || evidence.evidenceId.trim().length === 0) return false;
  if (typeof evidence.sequenceId !== 'string' || evidence.sequenceId.trim().length === 0) return false;
  if (typeof evidence.sourceName !== 'string' || evidence.sourceName.trim().length === 0) return false;

  if (
    evidence.observedTerm !== undefined &&
    evidence.observedTerm !== 1 &&
    evidence.observedTerm !== 2 &&
    evidence.observedTerm !== 3
  ) {
    return false;
  }

  if (
    evidence.observedWeek !== undefined &&
    (typeof evidence.observedWeek !== 'number' || !Number.isFinite(evidence.observedWeek) || evidence.observedWeek <= 0)
  ) {
    return false;
  }

  return true;
}

// --------------------------------------------------
// 3. PUBLIC VALIDATOR
// --------------------------------------------------

/**
 * Pure, read-only integrity validator for the Primary Scheme V2 metadata architecture.
 * Validates surrogate record IDs, foreign reference integrity, structural properties, and calendar records.
 */
export function validatePrimarySchemeV2Integrity(): CurriculumV2IntegrityReport {
  const curriculumRecords = getB4EnglishLegacyCurriculumRecordsV2();
  const anomalies = getAllCurriculumAnomalies();
  const sequences = getAllSchemeSequences();
  const evidenceList = getAllSequenceEvidence();
  const calendars = getAllAcademicCalendars();

  // 1. Duplicate ID checks
  const duplicateCurriculumRecordIds = findDuplicateIds(curriculumRecords.map(r => r.recordId));
  const duplicateAnomalyIds = findDuplicateIds(anomalies.map(a => a.anomalyId));
  const duplicateSequenceIds = findDuplicateIds(sequences.map(s => s.sequenceId));
  const duplicateEvidenceIds = findDuplicateIds(evidenceList.map(e => e.evidenceId));
  const duplicateCalendarIds = findDuplicateIds(calendars.map(c => c.calendarId));

  // 2. Curriculum Record Set for referential integrity
  const recordIdSet = new Set(curriculumRecords.map(r => r.recordId));

  // 3. Anomaly relationship checks
  const orphanAnomalyRecordIds: string[] = [];
  for (const anomaly of anomalies) {
    if (!recordIdSet.has(anomaly.curriculumRecordId)) {
      orphanAnomalyRecordIds.push(anomaly.curriculumRecordId);
    }
  }

  // 4. Sequence relationship and structure checks
  const orphanSequenceRecordIds: string[] = [];
  const invalidSequences: string[] = [];
  const sequenceIdSet = new Set<string>();

  for (const sequence of sequences) {
    sequenceIdSet.add(sequence.sequenceId);

    if (!recordIdSet.has(sequence.curriculumRecordId)) {
      orphanSequenceRecordIds.push(sequence.curriculumRecordId);
    }

    if (!validateSchemeSequence(sequence)) {
      invalidSequences.push(sequence.sequenceId || 'UNKNOWN_SEQUENCE');
    }
  }

  // 5. Evidence relationship and structure checks
  const orphanEvidenceSequenceIds: string[] = [];
  const invalidEvidence: string[] = [];

  for (const evidence of evidenceList) {
    if (!sequenceIdSet.has(evidence.sequenceId)) {
      orphanEvidenceSequenceIds.push(evidence.sequenceId);
    }

    if (!validateSequenceEvidence(evidence)) {
      invalidEvidence.push(evidence.evidenceId || 'UNKNOWN_EVIDENCE');
    }
  }

  // 6. Curriculum record validation
  const invalidCurriculumRecords: string[] = [];
  for (const record of curriculumRecords) {
    if (!validateCurriculumRecord(record)) {
      invalidCurriculumRecords.push(record.recordId || 'UNKNOWN_RECORD');
    }
  }

  // 7. Academic calendar structural validation
  const invalidCalendars: string[] = [];
  for (const calendar of calendars) {
    const result = validateAcademicCalendar(calendar);
    if (!result.valid) {
      invalidCalendars.push(calendar.calendarId);
    }
  }

  // 8. Warnings for known current V2 staging limitations
  const warnings: string[] = [];

  if (curriculumRecords.length > 0 && sequences.length === 0) {
    warnings.push(
      'B4 English V2 curriculum records exist but no reviewed SchemeSequence metadata has been loaded yet.'
    );
  }

  if (calendars.length > 0) {
    warnings.push(
      'Verified academic calendar metadata exists but is not yet active in the live Scheme generator.'
    );
  }

  if ((B4_ENGLISH_LEGACY_PACKAGE.completenessStatus as string) === 'PRODUCTION_SUBSET') {
    warnings.push(
      'B4 English V2 package is a production subset and must not be treated as the complete official curriculum.'
    );
  }

  // 9. Overall validity check
  const valid =
    duplicateCurriculumRecordIds.length === 0 &&
    duplicateAnomalyIds.length === 0 &&
    duplicateSequenceIds.length === 0 &&
    duplicateEvidenceIds.length === 0 &&
    duplicateCalendarIds.length === 0 &&
    orphanAnomalyRecordIds.length === 0 &&
    orphanSequenceRecordIds.length === 0 &&
    orphanEvidenceSequenceIds.length === 0 &&
    invalidCurriculumRecords.length === 0 &&
    invalidSequences.length === 0 &&
    invalidEvidence.length === 0 &&
    invalidCalendars.length === 0;

  return {
    valid,
    curriculumRecordCount: curriculumRecords.length,
    anomalyCount: anomalies.length,
    sequenceCount: sequences.length,
    evidenceCount: evidenceList.length,
    calendarCount: calendars.length,

    duplicateCurriculumRecordIds,
    duplicateAnomalyIds,
    duplicateSequenceIds,
    duplicateEvidenceIds,
    duplicateCalendarIds,

    orphanAnomalyRecordIds,
    orphanSequenceRecordIds,
    orphanEvidenceSequenceIds,

    invalidCurriculumRecords,
    invalidSequences,
    invalidEvidence,
    invalidCalendars,

    warnings,
  };
}

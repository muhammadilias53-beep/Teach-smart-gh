import fs from 'fs';
import path from 'path';

// Load parsed official NaCCA Basic 4 English curriculum from previous extraction
const tempFile = '/tmp/tsx-0/17891-cf845f577714adb7bbfc7134e6c3cf8e8a9b261d';
if (!fs.existsSync(tempFile)) {
  throw new Error(`Extraction temp file not found at ${tempFile}`);
}

const data = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
const match = data.code.match(/const OFFICIAL_B4_ENGLISH\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  throw new Error('Could not extract OFFICIAL_B4_ENGLISH from temp file');
}

export interface OfficialCurriculumItem {
  strandNum: number;
  strand: string;
  subStrandNum: number;
  subStrand: string;
  stdCode: string;
  stdText: string;
  indCode: string;
  indText: string;
  page: number;
}

const officialList: OfficialCurriculumItem[] = eval(match[1]);

if (officialList.length !== 131) {
  throw new Error(`Expected exactly 131 official items, got ${officialList.length}`);
}

// 51 Preserved Legacy IDs from V2 baseline
const PRESERVED_LEGACY_MAP: Record<string, string> = {
  'B4.1.1.1.1': 'B4-ENG-LEGACY-0001',
  'B4.1.1.1.2': 'B4-ENG-LEGACY-0002',
  'B4.1.3.1.1': 'B4-ENG-LEGACY-0003',
  'B4.1.4.1.1': 'B4-ENG-LEGACY-0004',
  'B4.1.4.1.2': 'B4-ENG-LEGACY-0005',
  'B4.1.5.1.1': 'B4-ENG-LEGACY-0006',
  'B4.1.6.1.1': 'B4-ENG-LEGACY-0007',
  'B4.1.7.1.1': 'B4-ENG-LEGACY-0009',
  'B4.1.7.1.2': 'B4-ENG-LEGACY-0010',
  'B4.1.8.1.1': 'B4-ENG-LEGACY-0011',
  'B4.1.9.1.1': 'B4-ENG-LEGACY-0012',
  'B4.1.10.1.1': 'B4-ENG-LEGACY-0013',
  'B4.2.2.1.1': 'B4-ENG-LEGACY-0014',
  'B4.2.3.1.1': 'B4-ENG-LEGACY-0015',
  'B4.2.4.1.1': 'B4-ENG-LEGACY-0016',
  'B4.2.5.1.1': 'B4-ENG-LEGACY-0017',
  'B4.2.6.1.1': 'B4-ENG-LEGACY-0018',
  'B4.2.7.1.1': 'B4-ENG-LEGACY-0019',
  'B4.2.8.1.1': 'B4-ENG-LEGACY-0020',
  'B4.2.9.1.1': 'B4-ENG-LEGACY-0021',
  'B4.2.10.1.1': 'B4-ENG-LEGACY-0022',
  'B4.2.10.1.2': 'B4-ENG-LEGACY-0023',
  'B4.3.1.1.1': 'B4-ENG-LEGACY-0024',
  'B4.3.2.1.1': 'B4-ENG-LEGACY-0025',
  'B4.3.2.1.2': 'B4-ENG-LEGACY-0026',
  'B4.3.3.1.1': 'B4-ENG-LEGACY-0027',
  'B4.3.4.1.1': 'B4-ENG-LEGACY-0028',
  'B4.3.5.1.1': 'B4-ENG-LEGACY-0029',
  'B4.3.6.1.1': 'B4-ENG-LEGACY-0030',
  'B4.3.7.1.1': 'B4-ENG-LEGACY-0031',
  'B4.3.8.1.1': 'B4-ENG-LEGACY-0032',
  'B4.3.9.1.1': 'B4-ENG-LEGACY-0033',
  'B4.3.10.1.1': 'B4-ENG-LEGACY-0034',
  'B4.4.2.1.1': 'B4-ENG-LEGACY-0039',
  'B4.4.6.1.1': 'B4-ENG-LEGACY-0041',
  'B4.4.9.1.1': 'B4-ENG-LEGACY-0042',
  'B4.4.10.1.1': 'B4-ENG-LEGACY-0043',
  'B4.4.11.1.1': 'B4-ENG-LEGACY-0044',
  'B4.4.12.1.1': 'B4-ENG-LEGACY-0045',
  'B4.4.13.1.1': 'B4-ENG-LEGACY-0046',
  'B4.4.14.1.1': 'B4-ENG-LEGACY-0047',
  'B4.4.15.1.1': 'B4-ENG-LEGACY-0048',
  'B4.5.2.1.1': 'B4-ENG-LEGACY-0050',
  'B4.5.3.1.1': 'B4-ENG-LEGACY-0052',
  'B4.5.4.1.1': 'B4-ENG-LEGACY-0053',
  'B4.5.5.1.1': 'B4-ENG-LEGACY-0054',
  'B4.5.6.1.1': 'B4-ENG-LEGACY-0055',
  'B4.5.7.1.1': 'B4-ENG-LEGACY-0056',
  'B4.5.8.1.1': 'B4-ENG-LEGACY-0057',
  'B4.5.10.1.1': 'B4-ENG-LEGACY-0058',
  'B4.6.1.1.1': 'B4-ENG-LEGACY-0059',
};

// 8 Non-Authority Legacy Records
export const B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS = [
  {
    legacyRecordId: 'B4-ENG-LEGACY-0008',
    legacyStandardCode: 'B4.1.6.1',
    legacyIndicatorCode: 'B4.1.6.1.2',
    strand: 'Oral Language',
    subStrand: 'Conversation',
    text: 'Describe objects, events, dates, and time using appropriate vocabulary',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Content standard B4.1.6.1 (printed page 6) defines only indicator B4.1.6.1.1 ("Describe/talk about objects, events, dates and time"). B4.1.6.1.2 does not exist.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0035',
    legacyStandardCode: 'B4.3.11.1',
    legacyIndicatorCode: 'B4.3.11.1.1',
    strand: 'Grammar Usage',
    subStrand: 'Adjective Phrase',
    text: 'Identify and construct adjective phrases to describe nouns in sentences',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Basic 4 Strand 3 has 10 sub-strands ending at Prepositions (p. 46). Sub-Strand 11 does not exist in Basic 4.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0036',
    legacyStandardCode: 'B4.3.12.1',
    legacyIndicatorCode: 'B4.3.12.1.1',
    strand: 'Grammar Usage',
    subStrand: 'Adverb Phrase',
    text: 'Identify and construct adverb phrases answering how, when, and where',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Basic 4 Strand 3 has 10 sub-strands ending at Prepositions (p. 46). Sub-Strand 12 does not exist in Basic 4.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0037',
    legacyStandardCode: 'B4.3.13.1',
    legacyIndicatorCode: 'B4.3.13.1.1',
    strand: 'Grammar Usage',
    subStrand: 'Direct and Reported Speech',
    text: 'Identify and convert simple direct speech statements into reported speech',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Direct and Reported Speech belongs to Basic 6 (p. 186). Sub-Strand 13 does not exist in Basic 4.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0038',
    legacyStandardCode: 'B4.4.1.1',
    legacyIndicatorCode: 'B4.4.1.1.1',
    strand: 'Writing',
    subStrand: 'Pre-writing Activities / Planning',
    text: 'Plan narrative writing and demonstrate the use of appropriate punctuation marks',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Basic 4 Strand 4 starts at Sub-Strand 2 (p. 47). Sub-Strand 1 exists only in Lower Primary.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0040',
    legacyStandardCode: 'B4.4.3.1',
    legacyIndicatorCode: 'B4.4.3.1.1',
    strand: 'Writing',
    subStrand: 'Writing Sentences',
    text: 'Write compound sentences using coordinating conjunctions and appropriate punctuation',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Sub-Strand 3 does not exist in Basic 4 Strand 4. (Basic 4 proceeds from Sub-Strand 2 Penmanship to Sub-Strand 6 Paragraph Development).',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0049',
    legacyStandardCode: 'B4.5.1.1',
    legacyIndicatorCode: 'B4.5.1.1.1',
    strand: 'Writing Conventions',
    subStrand: 'Capitalization',
    text: 'Apply rules of capitalization (names of persons, places, days of week, months, holidays, titles, and beginning of sentences)',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Basic 4 Strand 5 starts at Sub-Strand 2 (p. 58). Sub-Strand 1 exists only in Lower Primary.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
  {
    legacyRecordId: 'B4-ENG-LEGACY-0051',
    legacyStandardCode: 'B4.5.2.1',
    legacyIndicatorCode: 'B4.5.2.1.2',
    strand: 'Writing Conventions',
    subStrand: 'Punctuation',
    text: 'Use commas in dates, addresses, series of items, and before/after direct quotations or direct address',
    reason: 'Absent from official NaCCA Basic 4 curriculum. Content standard B4.5.2.1 (p. 58) contains only indicator B4.5.2.1.1 ("Use the comma: before and after Yes and No... after addressing a person"). Indicator B4.5.2.1.2 does not exist.',
    status: 'NON_AUTHORITY_LEGACY_RECORD',
  },
];

// 1. Group official items into standards for verifiedCurriculum.ts
const standardsMap = new Map<string, {
  code: string;
  text: string;
  strand: string;
  subStrand: string;
  classLevel: string;
  subject: string;
  indicators: { code: string; text: string; page: number }[];
}>();

for (const item of officialList) {
  if (!standardsMap.has(item.stdCode)) {
    standardsMap.set(item.stdCode, {
      code: item.stdCode,
      text: item.stdText,
      strand: item.strand,
      subStrand: item.subStrand,
      classLevel: 'Basic 4',
      subject: 'English',
      indicators: []
    });
  }
  standardsMap.get(item.stdCode)!.indicators.push({
    code: item.indCode,
    text: item.indText,
    page: item.page
  });
}

const standardsArray = Array.from(standardsMap.values());

// Generate verifiedCurriculum.ts content
const verifiedContent = `/**
 * TeachSmart Ghana — Authoritative Verified Curriculum Repository
 * 
 * Basic 4 English Language
 * Grounded directly in the official NaCCA English Language Curriculum for Primary Schools (Basic 4–6),
 * published by the Ministry of Education / National Council for Curriculum and Assessment (NaCCA), September 2019.
 * 
 * Authority Invariants:
 * - 63 Content Standards | 131 Indicators | Exactly 0 Synthetic Indicators
 * - 100% text fidelity to official NaCCA curriculum publication
 * - Strict Class Isolation: Basic 4 English only
 */

export interface VerifiedIndicator {
  code: string;
  text: string;
  page?: number;
}

export interface VerifiedContentStandard {
  code: string;
  text: string;
  strand: string;
  subStrand: string;
  classLevel: string;
  subject: string;
  indicators: VerifiedIndicator[];
}

/**
 * Authoritative Basic 4 English Curriculum Standards
 * 63 Content Standards across 6 Strands (131 Indicators)
 */
export const VERIFIED_BASIC_4_ENGLISH_STANDARDS: VerifiedContentStandard[] = ${JSON.stringify(standardsArray, null, 2)};

/**
 * Normalized check whether a subject and classLevel have completed NaCCA verification
 */
export function isSubjectClassVerified(subject: string, classLevel: string): boolean {
  const normSubject = (subject || '').trim().toLowerCase();
  const normClass = (classLevel || '').trim().toLowerCase();

  const isEnglish = normSubject === 'english' || normSubject === 'english language';
  const isBasic4 = normClass === 'basic 4' || normClass === 'b4' || normClass === 'primary 4' || normClass === 'p4';

  return isEnglish && isBasic4;
}

/**
 * Retrieve all verified standards for a verified subject and class
 */
export function getVerifiedStandards(subject: string, classLevel: string): VerifiedContentStandard[] {
  if (isSubjectClassVerified(subject, classLevel)) {
    return VERIFIED_BASIC_4_ENGLISH_STANDARDS;
  }
  return [];
}

/**
 * Fast lookup map for standard codes to indicators
 */
const VERIFIED_INDICATORS_BY_STANDARD = new Map<string, VerifiedIndicator[]>();
for (const std of VERIFIED_BASIC_4_ENGLISH_STANDARDS) {
  VERIFIED_INDICATORS_BY_STANDARD.set(std.code, std.indicators);
}

/**
 * Get verified indicators for a given standard code.
 * Returns null if the standard is not in the verified database.
 */
export function getVerifiedIndicatorsForStandard(standardCode: string): VerifiedIndicator[] | null {
  const cleanCode = standardCode.trim();
  return VERIFIED_INDICATORS_BY_STANDARD.get(cleanCode) || null;
}

/**
 * Curriculum Verification Error thrown when strict verified mode rejects unverified content
 */
export class CurriculumVerificationError extends Error {
  public readonly subject: string;
  public readonly classLevel: string;
  public readonly userMessage: string;

  constructor(subject: string, classLevel: string) {
    const userMsg = \`Curriculum data for \${classLevel} \${subject} has not yet completed official NaCCA syllabus verification. In Strict Verified Mode, TeachSmartGH requires authoritative NaCCA standards and indicators. Currently, Basic 4 English is 100% verified (131 official indicators). Full syllabus authority verification for \${classLevel} \${subject} is in progress.\`;
    super(userMsg);
    this.name = 'CurriculumVerificationError';
    this.subject = subject;
    this.classLevel = classLevel;
    this.userMessage = userMsg;
  }
}
`;

// 2. Build 131 CurriculumRecord objects for curriculumRegistry.ts
const authoritativeRecords = officialList.map((item) => {
  const preservedId = PRESERVED_LEGACY_MAP[item.indCode];
  const recordId = preservedId ? preservedId : `B4-ENG-OFFICIAL-${item.indCode.replace(/\\./g, '-')}`;

  return {
    recordId,
    classLevel: 'Basic 4',
    subject: 'English',
    strand: item.strand,
    subStrand: item.subStrand,
    officialStandardCode: item.stdCode,
    officialStandardText: item.stdText,
    officialIndicatorCode: item.indCode,
    officialIndicatorText: item.indText,
    authority: 'NaCCA',
    sourceDocument: 'English Language Curriculum for Primary Schools (Basic 4–6)',
    sourceOrganization: 'NaCCA / Ministry of Education',
    sourceDocumentDate: 'September 2019',
    sourcePage: item.page,
    sourcePrintedStandardCode: item.stdCode,
    sourcePrintedIndicatorCode: item.indCode,
    verificationStatus: 'VERIFIED_OFFICIAL_SOURCE',
    curriculumVersion: 'PRIMARY_B4_ENGLISH_NACCA_OFFICIAL_2019_V1',
    active: true,
  };
});

// Generate curriculumRegistry.ts content
const registryContent = `/**
 * TeachSmartGH - Primary Curriculum Registry (Authoritative V2 Adapter)
 *
 * Grounded in the official Ministry of Education / NaCCA English Language Curriculum
 * for Primary Schools (Basic 4–6), September 2019.
 *
 * Invariants:
 * - Total Authoritative Records: 131
 * - Preserved Valid Legacy IDs: 51
 * - Newly Added Authoritative Deterministic IDs: 80
 * - Excluded Non-Authority Legacy Records: 8 (documented in B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS)
 * - Complete 6-Strand Coverage (Oral Language: 37, Reading: 32, Grammar: 24, Writing: 21, Writing Conventions: 16, Extensive Reading: 1)
 */

import { VERIFIED_BASIC_4_ENGLISH_STANDARDS } from './verifiedCurriculum';
import { CurriculumRecord } from '../types/curriculumV2';

// --------------------------------------------------
// 1. B4 ENGLISH AUTHORITATIVE PACKAGE METADATA
// --------------------------------------------------

export const B4_ENGLISH_AUTHORITATIVE_PACKAGE = {
  packageId: 'PRIMARY-B4-ENGLISH-NACCA-OFFICIAL-131',
  classLevel: 'Basic 4',
  subject: 'English',
  standardCount: 63,
  indicatorCount: 131,
  curriculumVersion: 'PRIMARY_B4_ENGLISH_NACCA_OFFICIAL_2019_V1',
  completenessStatus: 'AUTHORITATIVE_COMPLETE',
} as const;

/** Backwards-compatibility alias for package metadata */
export const B4_ENGLISH_LEGACY_PACKAGE = {
  ...B4_ENGLISH_AUTHORITATIVE_PACKAGE,
  packageId: 'PRIMARY-B4-ENGLISH-NACCA-OFFICIAL-131',
  completenessStatus: 'AUTHORITATIVE_COMPLETE',
} as const;

// --------------------------------------------------
// 2. NON-AUTHORITY LEGACY AUDIT ARCHIVE
// --------------------------------------------------

export interface NonAuthorityLegacyRecord {
  legacyRecordId: string;
  legacyStandardCode: string;
  legacyIndicatorCode: string;
  strand: string;
  subStrand: string;
  text: string;
  reason: string;
  status: 'NON_AUTHORITY_LEGACY_RECORD';
  replacementOfficialCode?: string;
}

/**
 * Historical audit log of 8 legacy records confirmed absent from the official NaCCA Basic 4 curriculum.
 * Excluded from the active authoritative registry.
 */
export const B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS: readonly NonAuthorityLegacyRecord[] = ${JSON.stringify(B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS, null, 2)};

// --------------------------------------------------
// 3. AUTHORITATIVE BASIC 4 ENGLISH DATASET (131 RECORDS)
// --------------------------------------------------

const B4_ENGLISH_AUTHORITATIVE_RECORDS: CurriculumRecord[] = ${JSON.stringify(authoritativeRecords, null, 2)};

// --------------------------------------------------
// 4. READ-ONLY V2 ADAPTERS
// --------------------------------------------------

/**
 * Returns the 131 active authoritative Basic 4 English curriculum records
 * transcribed directly from the official NaCCA September 2019 curriculum.
 */
export function getB4EnglishAuthoritativeCurriculumRecords(): CurriculumRecord[] {
  return B4_ENGLISH_AUTHORITATIVE_RECORDS.map(r => ({ ...r }));
}

/**
 * Backwards compatibility adapter. Resolves to the 131 authoritative active records.
 * The 51 valid legacy record IDs are preserved with corrected authoritative metadata.
 * The 8 non-authority records are completely excluded.
 */
export function getB4EnglishLegacyCurriculumRecordsV2(): CurriculumRecord[] {
  return getB4EnglishAuthoritativeCurriculumRecords();
}

// --------------------------------------------------
// 5. PACKAGE SUMMARY DIAGNOSTIC
// --------------------------------------------------

export interface AuthoritativePackageSummary {
  standardCount: number;
  indicatorCount: number;
  recordCount: number;
  legacyPreservedCount: number;
  newOfficialCount: number;
  nonAuthorityExcludedCount: number;
  completenessStatus: string;
}

export function getB4EnglishPackageSummary(): AuthoritativePackageSummary {
  const records = getB4EnglishAuthoritativeCurriculumRecords();
  const legacyPreserved = records.filter(r => r.recordId.startsWith('B4-ENG-LEGACY-')).length;
  const newOfficial = records.filter(r => r.recordId.startsWith('B4-ENG-OFFICIAL-')).length;

  return {
    standardCount: VERIFIED_BASIC_4_ENGLISH_STANDARDS.length,
    indicatorCount: records.length,
    recordCount: records.length,
    legacyPreservedCount: legacyPreserved,
    newOfficialCount: newOfficial,
    nonAuthorityExcludedCount: B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS.length,
    completenessStatus: B4_ENGLISH_AUTHORITATIVE_PACKAGE.completenessStatus,
  };
}

/** Backwards-compatibility diagnostic helper */
export function getB4EnglishLegacyPackageSummary() {
  const summary = getB4EnglishPackageSummary();
  return {
    standardCount: summary.standardCount,
    indicatorCount: summary.indicatorCount,
    recordCount: summary.recordCount,
  };
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/verifiedCurriculum.ts'), verifiedContent, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'src/data/curriculumRegistry.ts'), registryContent, 'utf8');

console.log('Successfully wrote src/data/verifiedCurriculum.ts and src/data/curriculumRegistry.ts');

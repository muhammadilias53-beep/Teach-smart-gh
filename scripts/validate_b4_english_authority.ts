/**
 * TeachSmartGH - Phase B11D Authoritative Integrity & Regression Suite
 *
 * Validates the 131-record Basic 4 English curriculum registry against official NaCCA authority:
 * 1. Authority Integrity Invariants (A-L)
 * 2. Source-Fidelity Regression Tests (Section 18)
 * 3. Legacy-Compatibility Tests for 51 Preserved IDs (Section 19)
 */

import {
  getB4EnglishAuthoritativeCurriculumRecords,
  B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS,
  B4_ENGLISH_AUTHORITATIVE_PACKAGE,
  getB4EnglishPackageSummary,
} from '../src/data/curriculumRegistry';
import {
  VERIFIED_BASIC_4_ENGLISH_STANDARDS,
  getVerifiedStandards,
  getVerifiedIndicatorsForStandard,
} from '../src/data/verifiedCurriculum';
import { validatePrimarySchemeV2Integrity } from '../src/lib/curriculumV2Integrity';

console.log('================================================================');
console.log('TEACHSMARTGH — PHASE B11D AUTHORITATIVE INTEGRITY VALIDATION');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: any) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName}`, failureDetails || '');
  }
}

const records = getB4EnglishAuthoritativeCurriculumRecords();

// --------------------------------------------------
// SECTION 17: AUTHORITATIVE INTEGRITY VALIDATION
// --------------------------------------------------
console.log('\n--- 1. SECTION 17: STRUCTURAL INTEGRITY INVARIANTS ---');

// A. Active record count = 131
assert(records.length === 131, 'A. Active Basic 4 English record count = 131', { count: records.length });

// B. Unique active internal record IDs = 131
const recordIdSet = new Set(records.map(r => r.recordId));
assert(recordIdSet.size === 131, 'B. Unique active internal record IDs = 131', { size: recordIdSet.size });

// C. Unique official indicator codes = 131
const indicatorCodeSet = new Set(records.map(r => r.officialIndicatorCode));
assert(indicatorCodeSet.size === 131, 'C. Unique official indicator codes = 131', { size: indicatorCodeSet.size });

// D. Duplicate official indicator codes = 0
const codeCounts = new Map<string, number>();
for (const r of records) {
  codeCounts.set(r.officialIndicatorCode, (codeCounts.get(r.officialIndicatorCode) || 0) + 1);
}
const duplicateCodes = Array.from(codeCounts.entries()).filter(([_, count]) => count > 1);
assert(duplicateCodes.length === 0, 'D. Duplicate official indicator codes = 0', duplicateCodes);

// E. All standard codes begin with B4
const nonB4Standards = records.filter(r => !r.officialStandardCode.startsWith('B4.'));
assert(nonB4Standards.length === 0, 'E. All standard codes begin B4', nonB4Standards);

// F. All indicator codes begin with B4
const nonB4Indicators = records.filter(r => !r.officialIndicatorCode.startsWith('B4.'));
assert(nonB4Indicators.length === 0, 'F. All indicator codes begin B4', nonB4Indicators);

// G. All indicator-parent relationships are structurally valid
const invalidParentChild = records.filter(
  r => !r.officialIndicatorCode.startsWith(r.officialStandardCode + '.')
);
assert(invalidParentChild.length === 0, 'G. All indicator-parent relationships are structurally valid', invalidParentChild);

// H. Strand totals: 37, 32, 24, 21, 16, 1
const strandCounts: Record<string, number> = {};
for (const r of records) {
  strandCounts[r.strand] = (strandCounts[r.strand] || 0) + 1;
}

assert(strandCounts['Oral Language'] === 37, 'H1. Strand 1 (Oral Language) = 37', { count: strandCounts['Oral Language'] });
assert(strandCounts['Reading'] === 32, 'H2. Strand 2 (Reading) = 32', { count: strandCounts['Reading'] });
assert(strandCounts['Grammar Usage at Word and Phrase Levels'] === 24, 'H3. Strand 3 (Grammar Usage at Word and Phrase Levels) = 24', { count: strandCounts['Grammar Usage at Word and Phrase Levels'] });
assert(strandCounts['Writing'] === 21, 'H4. Strand 4 (Writing) = 21', { count: strandCounts['Writing'] });
assert(strandCounts['Using Writing Conventions/ Grammar Usage'] === 16, 'H5. Strand 5 (Using Writing Conventions/ Grammar Usage) = 16', { count: strandCounts['Using Writing Conventions/ Grammar Usage'] });
assert(strandCounts['Extensive Reading'] === 1, 'H6. Strand 6 (Extensive Reading) = 1', { count: strandCounts['Extensive Reading'] });

const totalStrandSum = Object.values(strandCounts).reduce((a, b) => a + b, 0);
assert(totalStrandSum === 131, 'H7. Total strand indicator sum = 131', { totalStrandSum });

// I. All eight rejected indicator codes are absent from ACTIVE registry
const REJECTED_CODES = [
  'B4.1.6.1.2',
  'B4.3.11.1.1',
  'B4.3.12.1.1',
  'B4.3.13.1.1',
  'B4.4.1.1.1',
  'B4.4.3.1.1',
  'B4.5.1.1.1',
  'B4.5.2.1.2',
];

const foundRejectedInActive = records.filter(r => REJECTED_CODES.includes(r.officialIndicatorCode));
assert(foundRejectedInActive.length === 0, 'I. All 8 rejected indicator codes are absent from ACTIVE registry', foundRejectedInActive);

// J. All 80 previously missing official codes are present
const PRESERVED_51_CODES = new Set([
  'B4.1.1.1.1', 'B4.1.1.1.2', 'B4.1.3.1.1', 'B4.1.4.1.1', 'B4.1.4.1.2',
  'B4.1.5.1.1', 'B4.1.6.1.1', 'B4.1.7.1.1', 'B4.1.7.1.2', 'B4.1.8.1.1',
  'B4.1.9.1.1', 'B4.1.10.1.1', 'B4.2.2.1.1', 'B4.2.3.1.1', 'B4.2.4.1.1',
  'B4.2.5.1.1', 'B4.2.6.1.1', 'B4.2.7.1.1', 'B4.2.8.1.1', 'B4.2.9.1.1',
  'B4.2.10.1.1', 'B4.2.10.1.2', 'B4.3.1.1.1', 'B4.3.2.1.1', 'B4.3.2.1.2',
  'B4.3.3.1.1', 'B4.3.4.1.1', 'B4.3.5.1.1', 'B4.3.6.1.1', 'B4.3.7.1.1',
  'B4.3.8.1.1', 'B4.3.9.1.1', 'B4.3.10.1.1', 'B4.4.2.1.1', 'B4.4.6.1.1',
  'B4.4.9.1.1', 'B4.4.10.1.1', 'B4.4.11.1.1', 'B4.4.12.1.1', 'B4.4.13.1.1',
  'B4.4.14.1.1', 'B4.4.15.1.1', 'B4.5.2.1.1', 'B4.5.3.1.1', 'B4.5.4.1.1',
  'B4.5.5.1.1', 'B4.5.6.1.1', 'B4.5.7.1.1', 'B4.5.8.1.1', 'B4.5.10.1.1',
  'B4.6.1.1.1'
]);

const newlyAddedRecords = records.filter(r => !PRESERVED_51_CODES.has(r.officialIndicatorCode));
assert(newlyAddedRecords.length === 80, 'J1. Exactly 80 newly added official records', { count: newlyAddedRecords.length });
assert(
  newlyAddedRecords.every(r => r.recordId.startsWith('B4-ENG-OFFICIAL-')),
  'J2. All 80 newly added records use deterministic B4-ENG-OFFICIAL- prefix'
);

// K. Source evidence exists for every active record
const missingEvidence = records.filter(
  r =>
    !r.sourceDocument ||
    !r.sourceOrganization ||
    !r.sourceDocumentDate ||
    typeof r.sourcePage !== 'number' ||
    r.sourcePage <= 0 ||
    r.authority !== 'NaCCA' ||
    r.verificationStatus !== 'VERIFIED_OFFICIAL_SOURCE'
);
assert(missingEvidence.length === 0, 'K. Complete source evidence on all 131 active records', missingEvidence);

// L. No active record remains based solely on synthetic/paraphrased legacy authority text
assert(
  records.every(r => r.curriculumVersion === 'PRIMARY_B4_ENGLISH_NACCA_OFFICIAL_2019_V1'),
  'L1. All active records tagged with PRIMARY_B4_ENGLISH_NACCA_OFFICIAL_2019_V1'
);
assert(
  records.every(r => r.verificationStatus === 'VERIFIED_OFFICIAL_SOURCE'),
  'L2. All active records tagged with VERIFIED_OFFICIAL_SOURCE'
);

// --------------------------------------------------
// SECTION 18: SOURCE-FIDELITY REGRESSION TESTS
// --------------------------------------------------
console.log('\n--- 2. SECTION 18: SOURCE-FIDELITY REGRESSION TESTS ---');

const REGRESSION_TARGETS = [
  {
    code: 'B4.1.1.1.1',
    strand: 'Oral Language',
    subStrand: 'Songs',
    stdCode: 'B4.1.1.1',
    page: 2,
    indSnippet: 'Listen attentively to songs and sing them with appropriate stress',
  },
  {
    code: 'B4.1.6.1.1',
    strand: 'Oral Language',
    subStrand: 'Conversation - Talking about Oneself, Family, People, Customs, Social/Cultural Values and Manners',
    stdCode: 'B4.1.6.1',
    page: 6,
    indSnippet: 'Describe/talk about objects, events, dates and time',
  },
  {
    code: 'B4.1.6.2.1',
    strand: 'Oral Language',
    subStrand: 'Conversation - Talking about Oneself, Family, People, Customs, Social/Cultural Values and Manners',
    stdCode: 'B4.1.6.2',
    page: 7,
    indSnippet: 'Listen and view attentively and for a sustained period',
  },
  {
    code: 'B4.1.7.1.3',
    strand: 'Oral Language',
    subStrand: 'Listening Comprehension',
    stdCode: 'B4.1.7.1',
    page: 10,
    indSnippet: 'Recognise and discuss moral lessons in a story',
  },
  {
    code: 'B4.2.6.1.1',
    strand: 'Reading',
    subStrand: 'Vocabulary',
    stdCode: 'B4.2.6.1',
    page: 23,
    indSnippet: 'Use level-appropriate content words (nouns, verbs, adjectives and adverbs)',
  },
  {
    code: 'B4.2.7.1.2',
    strand: 'Reading',
    subStrand: 'Comprehension',
    stdCode: 'B4.2.7.1',
    page: 27,
    indSnippet: 'Note and recall main ideas in a sequence',
  },
  {
    code: 'B4.3.10.1.1',
    strand: 'Grammar Usage at Word and Phrase Levels',
    subStrand: 'Prepositions',
    stdCode: 'B4.3.10.1',
    page: 46,
    indSnippet: 'Use prepositions to convey a variety of meanings',
  },
  {
    code: 'B4.4.2.1.1',
    strand: 'Writing',
    subStrand: 'Penmanship and Handwriting',
    stdCode: 'B4.4.2.1',
    page: 47,
    indSnippet: 'Write clearly using joined letters of consistent size',
  },
  {
    code: 'B4.5.2.1.1',
    strand: 'Using Writing Conventions/ Grammar Usage',
    subStrand: 'Using Punctuation',
    stdCode: 'B4.5.2.1',
    page: 58,
    indSnippet: 'Use the comma',
  },
  {
    code: 'B4.6.1.1.1',
    strand: 'Extensive Reading',
    subStrand: 'Building the Love and Culture of Reading',
    stdCode: 'B4.6.1.1',
    page: 69,
    indSnippet: 'Read a variety of age- and level appropriate books and present a-two-paragraph summary',
  },
];

for (const target of REGRESSION_TARGETS) {
  const rec = records.find(r => r.officialIndicatorCode === target.code);
  assert(!!rec, `Regression target exists: ${target.code}`);
  if (rec) {
    assert(rec.strand === target.strand, `${target.code} correct strand: "${target.strand}"`, { actual: rec.strand });
    assert(rec.subStrand === target.subStrand, `${target.code} correct subStrand: "${target.subStrand}"`, { actual: rec.subStrand });
    assert(rec.officialStandardCode === target.stdCode, `${target.code} correct stdCode: ${target.stdCode}`, { actual: rec.officialStandardCode });
    assert(rec.sourcePage === target.page, `${target.code} correct printed page: ${target.page}`, { actual: rec.sourcePage });
    assert(rec.officialIndicatorText.includes(target.indSnippet), `${target.code} text contains snippet: "${target.indSnippet}"`);
  }
}

for (const rejectedCode of REJECTED_CODES) {
  const rec = records.find(r => r.officialIndicatorCode === rejectedCode);
  assert(!rec, `Explicitly asserted ABSENT from active registry: ${rejectedCode}`);
}

// --------------------------------------------------
// SECTION 19: LEGACY-COMPATIBILITY TESTS
// --------------------------------------------------
console.log('\n--- 3. SECTION 19: LEGACY-COMPATIBILITY FOR 51 PRESERVED IDS ---');

const legacyRecords = records.filter(r => r.recordId.startsWith('B4-ENG-LEGACY-'));
assert(legacyRecords.length === 51, 'Legacy records preserved in active registry = 51', { count: legacyRecords.length });

// Verify B4-ENG-LEGACY-0018 resolves to B4.2.6.1.1 with corrected authoritative text
const rec0018 = records.find(r => r.recordId === 'B4-ENG-LEGACY-0018');
assert(!!rec0018, 'B4-ENG-LEGACY-0018 preserved');
if (rec0018) {
  assert(rec0018.officialIndicatorCode === 'B4.2.6.1.1', 'B4-ENG-LEGACY-0018 resolves to B4.2.6.1.1');
  assert(rec0018.strand === 'Reading', 'B4-ENG-LEGACY-0018 strand is Reading');
  assert(rec0018.officialStandardText === 'Understand word meanings and usages', 'B4-ENG-LEGACY-0018 standard text corrected to official NaCCA wording');
  assert(rec0018.officialIndicatorText.startsWith('Use level-appropriate content words'), 'B4-ENG-LEGACY-0018 indicator text corrected to official NaCCA wording');
}

// Check non-authority legacy records archive
assert(
  B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS.length === 8,
  'Non-authority legacy records archive contains exactly 8 entries',
  { count: B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS.length }
);

const archiveIds = B4_ENGLISH_NON_AUTHORITY_LEGACY_RECORDS.map(r => r.legacyRecordId);
const expectedArchiveIds = [
  'B4-ENG-LEGACY-0008',
  'B4-ENG-LEGACY-0035',
  'B4-ENG-LEGACY-0036',
  'B4-ENG-LEGACY-0037',
  'B4-ENG-LEGACY-0038',
  'B4-ENG-LEGACY-0040',
  'B4-ENG-LEGACY-0049',
  'B4-ENG-LEGACY-0051',
];
assert(
  expectedArchiveIds.every(id => archiveIds.includes(id)),
  'All 8 rejected legacy IDs are documented in non-authority audit archive'
);

// --------------------------------------------------
// 4. INTEGRITY ADAPTER CHECK
// --------------------------------------------------
console.log('\n--- 4. V2 INTEGRITY ADAPTER VERIFICATION ---');
const v2Report = validatePrimarySchemeV2Integrity();
assert(v2Report.valid, 'validatePrimarySchemeV2Integrity() is VALID');
assert(v2Report.curriculumRecordCount === 131, 'Integrity report record count = 131');
assert(v2Report.duplicateCurriculumRecordIds.length === 0, 'No duplicate IDs in integrity report');
assert(v2Report.invalidCurriculumRecords.length === 0, 'No invalid records in integrity report');

// --------------------------------------------------
// 5. SUMMARY
// --------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}

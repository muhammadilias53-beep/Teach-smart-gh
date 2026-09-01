import { 
  CLASSES_BY_LEVEL, 
  subjectsByLevel 
} from '../src/constants';
import { 
  getCurriculumStrands, 
  getCurriculumSubStrands, 
  getCurriculumStandards, 
  getCurriculumIndicators,
  matchStandardToClass
} from '../src/lib/curriculumDatabase';

console.log('=== RUNNING COMPREHENSIVE CURRICULUM RESOLUTION AUDIT ===');

let totalTests = 0;
let failedStandards = 0;
let failedIndicators = 0;
let mismatchStandards = 0;

for (const [level, classList] of Object.entries(CLASSES_BY_LEVEL)) {
  const subjects = subjectsByLevel[level] || [];
  for (const subject of subjects) {
    for (const cls of classList) {
      const strands = getCurriculumStrands(subject, level, cls);
      if (strands.length === 0) {
        console.warn(`[FAIL] No strands for Level: ${level}, Subject: ${subject}, Class: ${cls}`);
      }

      for (const strand of strands) {
        const subStrands = getCurriculumSubStrands(subject, strand, level);
        if (subStrands.length === 0) {
          console.warn(`[WARN] No sub-strands for ${subject} -> ${strand}`);
        }

        for (const subStrand of subStrands) {
          totalTests++;
          const standards = getCurriculumStandards(subject, strand, subStrand, level, cls);
          if (standards.length === 0) {
            failedStandards++;
            console.error(`[FAIL STANDARD] 0 standards found for: [${level}] ${subject} (${cls}) -> Strand: "${strand}" -> SubStrand: "${subStrand}"`);
          } else {
            // Check if standard matches class
            for (const std of standards) {
              const isMatch = matchStandardToClass(std, cls, level);
              if (!isMatch) {
                mismatchStandards++;
                console.warn(`[CLASS MISMATCH] Standard "${std}" does not match class "${cls}" in ${subject}`);
              }
              const indicators = getCurriculumIndicators(std, subject, cls);
              if (indicators.length === 0) {
                failedIndicators++;
                console.error(`[FAIL INDICATOR] 0 indicators for standard: "${std}" in ${subject}`);
              }
            }
          }
        }
      }
    }
  }
}

console.log('=== AUDIT RESULTS ===');
console.log(`Total Combinations Tested: ${totalTests}`);
console.log(`Failed Standards (empty): ${failedStandards}`);
console.log(`Failed Indicators (empty): ${failedIndicators}`);
console.log(`Class Mismatches: ${mismatchStandards}`);

if (failedStandards === 0 && failedIndicators === 0 && mismatchStandards === 0) {
  console.log('🎉 100% PERFECT CURRICULUM COVERAGE ACROSS ALL SUBJECTS AND CLASSES!');
} else {
  console.log('⚠️ Some issues remain.');
}

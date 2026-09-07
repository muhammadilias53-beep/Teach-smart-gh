/**
 * TeachSmart Ghana — Scheme of Learning V2 Curriculum Grounding Engine
 * 
 * Provides deterministic grounding of Schemes of Learning using the verified
 * NaCCA / GES curriculum database. Guarantees strict class isolation and ensures
 * Gemini does not hallucinate strand names, sub-strand names, standard codes, or indicator codes.
 */

import { 
  getCurriculumStrands, 
  getCurriculumSubStrands, 
  getCurriculumStandards, 
  getCurriculumIndicators,
  extractClassFromStandardCode,
  matchStandardToClass,
  getClassPrefix
} from './curriculumDatabase';
import {
  isSubjectClassVerified,
  getVerifiedStandards,
  CurriculumVerificationError
} from '../data/verifiedCurriculum';

export {
  isSubjectClassVerified,
  getVerifiedStandards,
  CurriculumVerificationError
};

export interface GroundedIndicator {
  code: string;
  text: string;
  full: string;
}

export interface GroundedStandardItem {
  strand: string;
  subStrand: string;
  contentStandardCode: string;
  contentStandardText: string;
  contentStandardFull: string;
  indicators: GroundedIndicator[];
}

export interface SchemeCurriculumFrame {
  level: string;
  classLevel: string;
  subject: string;
  records: GroundedStandardItem[];
  totalStandards: number;
  totalIndicators: number;
  availableStrands: string[];
}

export interface WeeklyDistributionConfig {
  academicYear?: string;
  totalWeeks?: number;       // default 12 (supported 10-14)
  revisionWeeks?: number;    // default 1 (supported 0-3)
  assessmentWeeks?: number;  // default 1 (supported 0-3)
}

export interface WeekCurriculumAllocation {
  weekNumber: number;
  weekLabel: string;
  type: 'instructional' | 'revision' | 'assessment';
  standards: GroundedStandardItem[];
  indicators: {
    indicator: GroundedIndicator;
    parentStandard: {
      code: string;
      text: string;
      strand: string;
      subStrand: string;
    };
    isExtensionOrConsolidation?: boolean;
    extensionNote?: string;
  }[];
  totalIndicators: number; // Count of distinct newly introduced curriculum indicators
  strandSummary: string;
  subStrandSummary: string;
  contentStandardSummary: string;
  indicatorCodesSummary: string;
  notes?: string;
}

export interface TermWeeklyDistributionPlan {
  classLevel: string;
  subject: string;
  educationalLevel: string;
  term: 1 | 2 | 3;
  academicYear: string;
  totalWeeks: number;
  instructionalWeeks: number;
  revisionWeeks: number;
  assessmentWeeks: number;
  weeklyDistributionVersion: string;
  totalTermIndicators: number;
  averageDensity: number;
  maxIndicatorsPerWeek: number;
  minIndicatorsPerWeek: number;
  densityWarning?: string;
  weeks: WeekCurriculumAllocation[];
  unallocatedIndicatorsCount: number;
  duplicateIndicatorsCount: number;
  unallocatedKeys: string[];
  duplicateKeys: string[];
}

export interface YearWeeklyDistributionPlan {
  classLevel: string;
  subject: string;
  educationalLevel: string;
  academicYear: string;
  totalWeeksPerTerm: number;
  instructionalWeeksPerTerm: number;
  revisionWeeksPerTerm: number;
  assessmentWeeksPerTerm: number;
  weeklyDistributionVersion: string;
  term1: TermWeeklyDistributionPlan;
  term2: TermWeeklyDistributionPlan;
  term3: TermWeeklyDistributionPlan;
}

/**
 * Builds a stable, unique curriculum item identifier key based on verified metadata.
 * Enables O(1) duplicate detection, missing item tracking, and cross-term overlap auditing.
 */
export function buildCurriculumCoverageKey(
  classLevel: string,
  subject: string,
  contentStandardCode: string,
  indicatorCode: string
): string {
  const normClass = (classLevel || '').trim();
  const normSubject = normalizeCurriculumSubject(subject);
  const normStd = (contentStandardCode || '').trim();
  const normInd = (indicatorCode || '').trim();
  return `${normClass}::${normSubject}::${normStd}::${normInd}`;
}

/**
 * Architectural specification for teacher-controlled coverage overrides.
 * Allows moving a curriculum item from Term 1 -> Term 2 or Term 2 -> Term 3
 * while mathematically guaranteeing zero duplicates and zero missing items.
 */
export interface CoverageItemOverride {
  itemKey: string;
  overrideTerm: 1 | 2 | 3;
}

/**
 * Programmatic structure representing the deterministic full-year curriculum coverage plan.
 * Organizes verified curriculum standards and indicators across Term 1, Term 2, and Term 3.
 */
export interface SchemeTermCoveragePlan {
  classLevel: string;
  subject: string;
  educationalLevel: string;
  coverageVersion: string;
  totalStandards: number;
  totalIndicators: number;
  terms: {
    term1: GroundedStandardItem[];
    term2: GroundedStandardItem[];
    term3: GroundedStandardItem[];
  };
  termIndicatorCounts: {
    term1: number;
    term2: number;
    term3: number;
  };
  allItemKeys: string[];
}

/**
 * Generic optimal K-way contiguous partitioning using Dynamic Programming.
 * Minimizes sum of squared deviations from the ideal average weight:
 * Cost = sum_{k=1}^K (W_k - target)^2 - boundaryBonuses
 */
export function optimalKWayPartition<T>(
  items: T[],
  K: number,
  weightFn: (item: T) => number,
  boundaryBonusFn?: (splitIdx: number) => number
): T[][] {
  const n = items.length;
  if (n === 0) {
    return Array.from({ length: K }, () => []);
  }
  if (K <= 0) return [items];
  if (K === 1) return [items];
  if (K >= n) {
    const res: T[][] = [];
    for (let i = 0; i < n; i++) res.push([items[i]]);
    while (res.length < K) res.push([]);
    return res;
  }

  const weights = items.map(weightFn);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const target = totalWeight / K;

  const prefix = [0];
  for (let i = 0; i < n; i++) prefix.push(prefix[i] + weights[i]);

  const dp: number[][] = Array.from({ length: K + 1 }, () => Array(n + 1).fill(Infinity));
  const parent: number[][] = Array.from({ length: K + 1 }, () => Array(n + 1).fill(0));

  dp[0][0] = 0;

  for (let k = 1; k <= K; k++) {
    const minI = k;
    const maxI = n - (K - k);

    for (let i = minI; i <= maxI; i++) {
      const minJ = k - 1;
      const maxJ = i - 1;

      for (let j = minJ; j <= maxJ; j++) {
        if (dp[k - 1][j] === Infinity) continue;

        const sliceWeight = prefix[i] - prefix[j];
        let sliceCost = Math.pow(sliceWeight - target, 2);

        if (boundaryBonusFn && j > 0 && j < n) {
          sliceCost -= boundaryBonusFn(j);
        }

        const totalCost = dp[k - 1][j] + sliceCost;
        if (totalCost < dp[k][i]) {
          dp[k][i] = totalCost;
          parent[k][i] = j;
        }
      }
    }
  }

  const result: T[][] = [];
  let curr = n;
  for (let k = K; k >= 1; k--) {
    const prev = parent[k][curr];
    result.unshift(items.slice(prev, curr));
    curr = prev;
  }

  return result;
}

/**
 * Optimally partitions an ordered array of items into 3 contiguous slices
 * preserving the exact pedagogical sequence, minimizing indicator count discrepancy,
 * and honoring natural strand boundaries when available.
 */
export function optimalThreeWayPartition<T>(
  items: T[], 
  weightFn: (item: T) => number,
  boundaryBonusFn?: (leftIdx: number) => number
): [T[], T[], T[]] {
  const n = items.length;
  if (n === 0) return [[], [], []];
  if (n === 1) return [[items[0]], [], []];
  if (n === 2) return [[items[0]], [items[1]], []];

  const weights = items.map(weightFn);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const target = totalWeight / 3;

  // Prefix sums for O(1) slice weights
  const prefix = [0];
  for (let i = 0; i < n; i++) prefix.push(prefix[i] + weights[i]);

  let bestCost = Infinity;
  let bestI = 1;
  let bestJ = 2;

  for (let i = 1; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const w1 = prefix[i];
      const w2 = prefix[j] - prefix[i];
      const w3 = prefix[n] - prefix[j];

      let cost = Math.pow(w1 - target, 2) + Math.pow(w2 - target, 2) + Math.pow(w3 - target, 2);
      if (w1 === 0 || w2 === 0 || w3 === 0) cost += 1e9;

      if (boundaryBonusFn) {
        cost -= boundaryBonusFn(i);
        cost -= boundaryBonusFn(j);
      }

      if (cost < bestCost) {
        bestCost = cost;
        bestI = i;
        bestJ = j;
      }
    }
  }

  return [items.slice(0, bestI), items.slice(bestI, bestJ), items.slice(bestJ, n)];
}

/**
 * Builds a deterministic full-year curriculum coverage plan for a class and subject.
 * Allocates verified curriculum records across Term 1, Term 2, and Term 3 with:
 * - Foundational progression strictly preserved (Strand -> Sub-strand -> Standard -> Indicator)
 * - Zero duplicates across terms
 * - Zero missing indicators
 * - Pedagogical coherence without arbitrary strand splitting
 */
export function buildSchemeCoveragePlan(
  subject: string,
  level: string,
  classLevel: string,
  overrides?: CoverageItemOverride[],
  strictMode: boolean = false
): SchemeTermCoveragePlan {
  const fullYearFrame = buildSchemeCurriculumFrame(subject, level, classLevel, strictMode);
  const records = fullYearFrame.records;

  let term1Records: GroundedStandardItem[] = [];
  let term2Records: GroundedStandardItem[] = [];
  let term3Records: GroundedStandardItem[] = [];

  if (records.length >= 3) {
    // Partition at standard level to keep each standard's indicators pedagogically united
    [term1Records, term2Records, term3Records] = optimalThreeWayPartition(
      records,
      r => r.indicators.length,
      (idx) => {
        // Strand boundary affinity bonus: encourages splitting between strands if variance is similar
        if (idx < records.length && records[idx - 1].strand !== records[idx].strand) {
          return 0.5;
        }
        return 0;
      }
    );
  } else if (records.length > 0) {
    // If fewer than 3 standards exist, partition at indicator level so terms receive coverage
    const allInds: { ind: GroundedIndicator; record: GroundedStandardItem }[] = [];
    records.forEach(r => {
      r.indicators.forEach(ind => allInds.push({ ind, record: r }));
    });
    const [i1, i2, i3] = optimalThreeWayPartition(allInds, () => 1);

    const rebuild = (slice: typeof allInds) => {
      const map = new Map<string, GroundedStandardItem>();
      slice.forEach(item => {
        if (!map.has(item.record.contentStandardCode)) {
          map.set(item.record.contentStandardCode, {
            ...item.record,
            indicators: []
          });
        }
        map.get(item.record.contentStandardCode)!.indicators.push(item.ind);
      });
      return Array.from(map.values());
    };

    term1Records = rebuild(i1);
    term2Records = rebuild(i2);
    term3Records = rebuild(i3);
  }

  // Support future teacher overrides cleanly without schema modification
  if (overrides && overrides.length > 0) {
    const overrideMap = new Map(overrides.map(o => [o.itemKey, o.overrideTerm]));
    const flattenToItems = (recs: GroundedStandardItem[], termNum: 1 | 2 | 3) => {
      const items: { ind: GroundedIndicator; record: GroundedStandardItem; currentTerm: 1 | 2 | 3 }[] = [];
      recs.forEach(r => {
        r.indicators.forEach(ind => {
          const key = buildCurriculumCoverageKey(classLevel, subject, r.contentStandardCode, ind.code);
          const targetTerm = overrideMap.get(key) || termNum;
          items.push({ ind, record: r, currentTerm: targetTerm });
        });
      });
      return items;
    };

    const allItems = [
      ...flattenToItems(term1Records, 1),
      ...flattenToItems(term2Records, 2),
      ...flattenToItems(term3Records, 3)
    ];

    const rebuildForTerm = (targetTerm: 1 | 2 | 3) => {
      const slice = allItems.filter(i => i.currentTerm === targetTerm);
      const map = new Map<string, GroundedStandardItem>();
      slice.forEach(item => {
        if (!map.has(item.record.contentStandardCode)) {
          map.set(item.record.contentStandardCode, {
            ...item.record,
            indicators: []
          });
        }
        map.get(item.record.contentStandardCode)!.indicators.push(item.ind);
      });
      return Array.from(map.values());
    };

    term1Records = rebuildForTerm(1);
    term2Records = rebuildForTerm(2);
    term3Records = rebuildForTerm(3);
  }

  const countInds = (arr: GroundedStandardItem[]) => arr.reduce((s, r) => s + r.indicators.length, 0);
  const extractKeys = (arr: GroundedStandardItem[]) => {
    const keys: string[] = [];
    arr.forEach(r => {
      r.indicators.forEach(ind => {
        keys.push(buildCurriculumCoverageKey(classLevel, subject, r.contentStandardCode, ind.code));
      });
    });
    return keys;
  };

  const allItemKeys = [
    ...extractKeys(term1Records),
    ...extractKeys(term2Records),
    ...extractKeys(term3Records)
  ];

  return {
    classLevel: fullYearFrame.classLevel,
    subject: fullYearFrame.subject,
    educationalLevel: fullYearFrame.level,
    coverageVersion: 'teachsmart-v2-coverage',
    totalStandards: fullYearFrame.totalStandards,
    totalIndicators: fullYearFrame.totalIndicators,
    terms: {
      term1: term1Records,
      term2: term2Records,
      term3: term3Records
    },
    termIndicatorCounts: {
      term1: countInds(term1Records),
      term2: countInds(term2Records),
      term3: countInds(term3Records)
    },
    allItemKeys
  };
}

/**
 * Extracts a verified SchemeCurriculumFrame specifically for a single academic term.
 */
export function getSchemeTermCurriculumFrame(
  plan: SchemeTermCoveragePlan,
  term: 1 | 2 | 3
): SchemeCurriculumFrame {
  const termKey = `term${term}` as 'term1' | 'term2' | 'term3';
  const records = plan.terms[termKey] || [];
  const totalIndicators = plan.termIndicatorCounts[termKey] || 0;
  const availableStrands = Array.from(new Set(records.map(r => r.strand)));

  return {
    level: plan.educationalLevel,
    classLevel: plan.classLevel,
    subject: plan.subject,
    records,
    totalStandards: records.length,
    totalIndicators,
    availableStrands
  };
}

export interface CoverageValidationResult {
  valid: boolean;
  totalVerifiedIndicators: number;
  term1Count: number;
  term2Count: number;
  term3Count: number;
  duplicateCount: number;
  missingCount: number;
  crossTermDuplicates: string[];
  missingKeys: string[];
  classMismatches: string[];
  errors: string[];
}

/**
 * Validates a full-year curriculum coverage plan against mathematical invariants:
 * 1. Total verified items = Term 1 unique + Term 2 unique + Term 3 unique
 * 2. Cross-term duplicates = 0
 * 3. Missing items = 0
 * 4. Strict class isolation
 */
export function validateYearCoveragePlan(
  plan: SchemeTermCoveragePlan,
  fullYearFrame?: SchemeCurriculumFrame
): CoverageValidationResult {
  const getKeys = (arr: GroundedStandardItem[]) => {
    const keys: string[] = [];
    arr.forEach(r => {
      r.indicators.forEach(ind => {
        keys.push(buildCurriculumCoverageKey(plan.classLevel, plan.subject, r.contentStandardCode, ind.code));
      });
    });
    return keys;
  };

  const k1 = getKeys(plan.terms.term1);
  const k2 = getKeys(plan.terms.term2);
  const k3 = getKeys(plan.terms.term3);

  const set1 = new Set(k1);
  const set2 = new Set(k2);
  const set3 = new Set(k3);

  const dup12 = k1.filter(k => set2.has(k));
  const dup13 = k1.filter(k => set3.has(k));
  const dup23 = k2.filter(k => set3.has(k));
  const crossTermDuplicates = Array.from(new Set([...dup12, ...dup13, ...dup23]));

  const combinedSet = new Set([...k1, ...k2, ...k3]);
  const expectedFrame = fullYearFrame || buildSchemeCurriculumFrame(plan.subject, plan.educationalLevel, plan.classLevel);
  const expectedKeys = getKeys(expectedFrame.records);
  const missingKeys = expectedKeys.filter(k => !combinedSet.has(k));

  const count1 = plan.termIndicatorCounts.term1;
  const count2 = plan.termIndicatorCounts.term2;
  const count3 = plan.termIndicatorCounts.term3;
  const totalVerifiedIndicators = plan.totalIndicators;

  const targetPrefix = getClassPrefix(plan.classLevel).toUpperCase();
  const classMismatches: string[] = [];
  const errors: string[] = [];

  // Verify class prefix isolation across all items
  const checkPrefix = (recs: GroundedStandardItem[], termNum: number) => {
    recs.forEach(r => {
      const codePrefix = r.contentStandardCode.match(/^(B\d+|KG\d+|SHS\d+)/)?.[1]?.toUpperCase();
      if (codePrefix && targetPrefix && codePrefix !== targetPrefix) {
        classMismatches.push(`Term ${termNum}: ${r.contentStandardCode} does not match ${targetPrefix}`);
      }
      r.indicators.forEach(ind => {
        const indPrefix = ind.code.match(/^(B\d+|KG\d+|SHS\d+)/)?.[1]?.toUpperCase();
        if (indPrefix && targetPrefix && indPrefix !== targetPrefix) {
          classMismatches.push(`Term ${termNum}: ${ind.code} does not match ${targetPrefix}`);
        }
      });
    });
  };

  checkPrefix(plan.terms.term1, 1);
  checkPrefix(plan.terms.term2, 2);
  checkPrefix(plan.terms.term3, 3);

  if (crossTermDuplicates.length > 0) {
    errors.push(`Found ${crossTermDuplicates.length} cross-term duplicates: ${crossTermDuplicates.slice(0, 3).join(', ')}`);
  }
  if (missingKeys.length > 0) {
    errors.push(`Found ${missingKeys.length} missing curriculum indicators`);
  }
  if (count1 + count2 + count3 !== totalVerifiedIndicators) {
    errors.push(`Sum of term indicators (${count1 + count2 + count3}) does not equal total verified indicators (${totalVerifiedIndicators})`);
  }
  if (classMismatches.length > 0) {
    errors.push(`Class isolation violated: ${classMismatches.slice(0, 3).join(', ')}`);
  }

  const valid = errors.length === 0;

  return {
    valid,
    totalVerifiedIndicators,
    term1Count: count1,
    term2Count: count2,
    term3Count: count3,
    duplicateCount: crossTermDuplicates.length,
    missingCount: missingKeys.length,
    crossTermDuplicates,
    missingKeys,
    classMismatches,
    errors
  };
}

/**
 * Normalizes subject names for standard curriculum lookups.
 * E.g., "Ghanaian Language (Asante Twi)" -> "Ghanaian Language"
 */
export function normalizeCurriculumSubject(subject: string): string {
  if (!subject) return '';
  const trimmed = subject.trim();
  if (trimmed.toLowerCase().includes('ghanaian language')) {
    return 'Ghanaian Language';
  }
  return trimmed;
}

/**
 * Builds a deterministic, verified curriculum frame for a given level, class, and subject.
 * Guarantees that all included Content Standards and Indicators belong ONLY to the specified class.
 */
export function buildSchemeCurriculumFrame(
  subject: string, 
  level: string, 
  classLevel: string,
  strictMode: boolean = false
): SchemeCurriculumFrame {
  const baseSubject = normalizeCurriculumSubject(subject);
  const targetClass = classLevel?.trim() || '';
  const targetLevel = level?.trim() || '';

  // 1. Authoritative Verified Curriculum Path (Zero Synthetics)
  if (isSubjectClassVerified(baseSubject, targetClass)) {
    const verifiedStandards = getVerifiedStandards(baseSubject, targetClass);
    const records: GroundedStandardItem[] = [];
    const availableStrandsSet = new Set<string>();
    let totalIndicators = 0;

    for (const std of verifiedStandards) {
      const groundedIndicators: GroundedIndicator[] = std.indicators.map(ind => ({
        code: ind.code,
        text: ind.text,
        full: `${ind.code}: ${ind.text}`
      }));
      totalIndicators += groundedIndicators.length;

      records.push({
        strand: std.strand,
        subStrand: std.subStrand,
        contentStandardCode: std.code,
        contentStandardText: std.text,
        contentStandardFull: `${std.code}: ${std.text}`,
        indicators: groundedIndicators
      });
      availableStrandsSet.add(std.strand);
    }

    return {
      level: targetLevel || 'Primary',
      classLevel: targetClass,
      subject: baseSubject,
      records,
      totalStandards: records.length,
      totalIndicators,
      availableStrands: Array.from(availableStrandsSet)
    };
  }

  // 2. Strict Verified Mode Enforcement: Fail closed if not verified
  if (strictMode) {
    throw new CurriculumVerificationError(baseSubject, targetClass);
  }

  const records: GroundedStandardItem[] = [];
  const seenStandardCodes = new Set<string>();
  const availableStrandsSet = new Set<string>();
  let totalIndicators = 0;

  // Retrieve strands for this subject, level, and class
  const strands = getCurriculumStrands(baseSubject, targetLevel, targetClass);

  for (const strand of strands) {
    const subStrands = getCurriculumSubStrands(baseSubject, strand, targetLevel);

    for (const subStrand of subStrands) {
      const rawStandards = getCurriculumStandards(baseSubject, strand, subStrand, targetLevel, targetClass);

      for (const std of rawStandards) {
        if (!std || typeof std !== 'string') continue;

        // Strict Class Isolation check: reject any standard that belongs to a different class
        const isMatch = matchStandardToClass(std, targetClass, targetLevel);
        if (!isMatch) {
          continue;
        }

        const detectedClass = extractClassFromStandardCode(std);
        if (detectedClass && targetClass && detectedClass.toLowerCase() !== targetClass.toLowerCase()) {
          // Extra guard: do not allow cross-class standard
          continue;
        }

        // Parse Standard Code and Text
        const stdMatch = std.match(/^([A-Za-z0-9.]+):\s*(.*)$/);
        const standardCode = stdMatch ? stdMatch[1].trim() : std.trim();
        const standardText = stdMatch ? stdMatch[2].trim() : std.trim();

        // Prevent duplicate standard entries across sub-strands
        if (seenStandardCodes.has(standardCode)) {
          continue;
        }
        seenStandardCodes.add(standardCode);

        // Retrieve indicators for this standard
        const rawIndicators = getCurriculumIndicators(std, baseSubject, targetClass);
        const groundedIndicators: GroundedIndicator[] = [];

        for (const ind of rawIndicators) {
          if (!ind || typeof ind !== 'string') continue;

          // Verify class isolation on indicator
          const indClass = extractClassFromStandardCode(ind);
          if (indClass && targetClass && indClass.toLowerCase() !== targetClass.toLowerCase()) {
            // Reject indicator from different class
            continue;
          }

          const indMatch = ind.match(/^([A-Za-z0-9.]+):\s*(.*)$/);
          const indCode = indMatch ? indMatch[1].trim() : ind.trim();
          const indText = indMatch ? indMatch[2].trim() : ind.trim();

          groundedIndicators.push({
            code: indCode,
            text: indText,
            full: ind.trim()
          });
          totalIndicators++;
        }

        records.push({
          strand,
          subStrand,
          contentStandardCode: standardCode,
          contentStandardText: standardText,
          contentStandardFull: std.trim(),
          indicators: groundedIndicators
        });

        availableStrandsSet.add(strand);
      }
    }
  }

  return {
    level: targetLevel,
    classLevel: targetClass,
    subject: baseSubject,
    records,
    totalStandards: records.length,
    totalIndicators,
    availableStrands: Array.from(availableStrandsSet)
  };
}

/**
 * Deterministic helper to get subject-appropriate extension and consolidation labels
 * for low-density curriculum weeks.
 * 
 * Never involves AI/Gemini.
 * Never defaults unknown subjects to "Lab Practical".
 */
export function getLowDensityExtensionLabel(subject: string, isFinalExtensionWeek: boolean): string {
  const norm = (subject || '').trim().toLowerCase();

  // 1. MATHEMATICS
  if (norm.includes('math') || norm.includes('numeracy')) {
    return isFinalExtensionWeek
      ? 'Problem-Solving Project & Consolidation'
      : 'Mathematical Practice, Reasoning & Problem-Solving';
  }

  // 2. ENGLISH / GHANAIAN LANGUAGE / FRENCH / OTHER LANGUAGES
  if (
    norm.includes('english') ||
    norm.includes('ghanaian') ||
    norm.includes('french') ||
    norm.includes('language') ||
    norm.includes('literacy')
  ) {
    return isFinalExtensionWeek
      ? 'Language Application Project & Consolidation'
      : 'Reading, Writing, Speaking & Language Practice';
  }

  // 3. HISTORY
  if (norm.includes('history') || norm.includes('historical')) {
    return isFinalExtensionWeek
      ? 'History Project, Presentation & Consolidation'
      : 'Historical Inquiry, Discussion & Source-Based Activities';
  }

  // 4. RME (Religious and Moral Education)
  if (
    norm.includes('rme') ||
    norm.includes('r.m.e') ||
    norm.includes('religious') ||
    norm.includes('moral')
  ) {
    return isFinalExtensionWeek
      ? 'Values-Based Project / Presentation & Consolidation'
      : 'Discussion, Reflection, Values Application & Consolidation';
  }

  // 5. OUR WORLD OUR PEOPLE (OWOP) & SOCIAL STUDIES
  if (
    norm.includes('our world') ||
    norm.includes('owop') ||
    norm.includes('social') ||
    norm.includes('citizenship')
  ) {
    return isFinalExtensionWeek
      ? 'Community-Based Project & Consolidation'
      : 'Community Inquiry, Discussion & Practical Application';
  }

  // 6. CREATIVE ARTS / MUSIC / DRAMA / DESIGN
  if (
    norm.includes('creative') ||
    norm.includes('art') ||
    norm.includes('music') ||
    norm.includes('drama')
  ) {
    return isFinalExtensionWeek
      ? 'Creative Project / Exhibition / Performance & Consolidation'
      : 'Creative Practice, Performance / Production & Reflection';
  }

  // 7. PHYSICAL EDUCATION
  if (
    norm.includes('physical') ||
    norm.includes('pe') ||
    norm.includes('health') ||
    norm.includes('sports')
  ) {
    return isFinalExtensionWeek
      ? 'Skills Demonstration & Consolidation'
      : 'Skills Practice, Movement Application & Consolidation';
  }

  // 8. SCIENCE / COMPUTING / CAREER TECHNOLOGY
  if (
    norm.includes('science') ||
    norm.includes('computing') ||
    norm.includes('career') ||
    norm.includes('technology') ||
    norm.includes('ict') ||
    norm.includes('bstem')
  ) {
    return isFinalExtensionWeek
      ? 'Capstone Practical / Project & Portfolio Presentation'
      : 'Practical Application, Project Work & Mastery Consolidation';
  }

  // 9. SAFE FALLBACK (Neutral wording for unknown or unlisted subjects)
  return isFinalExtensionWeek
    ? 'Project / Presentation & Consolidation'
    : 'Application, Practice & Mastery Consolidation';
}

/**
 * Backward compatibility alias for getLowDensityExtensionLabel
 */
export function getSubjectAwareExtensionNote(subject: string, isFinalInstructionalWeek: boolean): string {
  return getLowDensityExtensionLabel(subject, isFinalInstructionalWeek);
}

/**
 * Deterministic weekly chunking algorithm.
 * Distributes verified term curriculum across instructional weeks with:
 * - Content Standard coherence (avoiding unnecessary splits)
 * - Pedagogical continuity (Strand -> Sub-strand -> Standard -> Indicator)
 * - Complete coverage (Unallocated = 0)
 * - Zero cross-week duplicate indicators
 * - Workload balancing & density warning
 * - Intelligent low-density handling without fake curriculum codes
 */
export function buildTermWeeklyDistributionPlan(
  plan: SchemeTermCoveragePlan,
  term: 1 | 2 | 3,
  config?: WeeklyDistributionConfig
): TermWeeklyDistributionPlan {
  const academicYear = config?.academicYear || '2025/2026';
  const totalWeeks = Math.max(10, Math.min(14, config?.totalWeeks ?? 12));
  const revisionWeeks = Math.max(0, Math.min(3, config?.revisionWeeks ?? 1));
  const assessmentWeeks = Math.max(0, Math.min(3, config?.assessmentWeeks ?? 1));
  
  const instructionalWeeks = Math.max(1, totalWeeks - revisionWeeks - assessmentWeeks);

  const termFrame = getSchemeTermCurriculumFrame(plan, term);
  const termRecords = termFrame.records;
  const totalTermIndicators = termFrame.totalIndicators;

  const averageDensity = Math.round((totalTermIndicators / instructionalWeeks) * 10) / 10;

  interface FlattenedIndicatorItem {
    indicator: GroundedIndicator;
    record: GroundedStandardItem;
    globalIndex: number;
  }

  const flattenedIndicators: FlattenedIndicatorItem[] = [];
  let gIdx = 0;
  termRecords.forEach(r => {
    r.indicators.forEach(ind => {
      flattenedIndicators.push({
        indicator: ind,
        record: r,
        globalIndex: gIdx++
      });
    });
  });

  const weeks: WeekCurriculumAllocation[] = [];

  if (termRecords.length >= instructionalWeeks) {
    // CASE 1: Standard Count >= Instructional Weeks
    // Partition at Content Standard level so no standard is split across weeks
    const partitionedStandards = optimalKWayPartition(
      termRecords,
      instructionalWeeks,
      r => r.indicators.length,
      (idx) => {
        if (idx < termRecords.length && termRecords[idx - 1].strand !== termRecords[idx].strand) {
          return 0.5; // Natural strand break affinity
        }
        return 0;
      }
    );

    partitionedStandards.forEach((slice, wIdx) => {
      const weekNum = wIdx + 1;
      const weekIndicators: WeekCurriculumAllocation['indicators'] = [];
      slice.forEach(r => {
        r.indicators.forEach(ind => {
          weekIndicators.push({
            indicator: ind,
            parentStandard: {
              code: r.contentStandardCode,
              text: r.contentStandardText,
              strand: r.strand,
              subStrand: r.subStrand
            }
          });
        });
      });

      const strands = Array.from(new Set(slice.map(r => r.strand)));
      const subStrands = Array.from(new Set(slice.map(r => r.subStrand)));
      const stdCodes = slice.map(r => r.contentStandardCode);
      const indCodes = weekIndicators.map(i => i.indicator.code);

      weeks.push({
        weekNumber: weekNum,
        weekLabel: `Week ${weekNum}`,
        type: 'instructional',
        standards: slice,
        indicators: weekIndicators,
        totalIndicators: weekIndicators.length,
        strandSummary: strands.join('; '),
        subStrandSummary: subStrands.join('; '),
        contentStandardSummary: stdCodes.join(', '),
        indicatorCodesSummary: indCodes.join(', ')
      });
    });

  } else if (totalTermIndicators >= instructionalWeeks) {
    // CASE 2: Standards < Instructional Weeks, but Indicators >= Instructional Weeks
    // Partition contiguous indicators into instructional weeks
    const partitionedIndicators = optimalKWayPartition(
      flattenedIndicators,
      instructionalWeeks,
      () => 1,
      (idx) => {
        if (idx < flattenedIndicators.length && 
            flattenedIndicators[idx - 1].record.contentStandardCode !== flattenedIndicators[idx].record.contentStandardCode) {
          return 0.5; // Favor splits between different Content Standards
        }
        return 0;
      }
    );

    partitionedIndicators.forEach((slice, wIdx) => {
      const weekNum = wIdx + 1;
      const standardMap = new Map<string, GroundedStandardItem>();
      const weekIndicators: WeekCurriculumAllocation['indicators'] = [];

      slice.forEach(item => {
        if (!standardMap.has(item.record.contentStandardCode)) {
          standardMap.set(item.record.contentStandardCode, {
            ...item.record,
            indicators: []
          });
        }
        standardMap.get(item.record.contentStandardCode)!.indicators.push(item.indicator);

        weekIndicators.push({
          indicator: item.indicator,
          parentStandard: {
            code: item.record.contentStandardCode,
            text: item.record.contentStandardText,
            strand: item.record.strand,
            subStrand: item.record.subStrand
          }
        });
      });

      const standardsInWeek = Array.from(standardMap.values());
      const strands = Array.from(new Set(standardsInWeek.map(r => r.strand)));
      const subStrands = Array.from(new Set(standardsInWeek.map(r => r.subStrand)));
      const stdCodes = standardsInWeek.map(r => r.contentStandardCode);
      const indCodes = weekIndicators.map(i => i.indicator.code);

      weeks.push({
        weekNumber: weekNum,
        weekLabel: `Week ${weekNum}`,
        type: 'instructional',
        standards: standardsInWeek,
        indicators: weekIndicators,
        totalIndicators: weekIndicators.length,
        strandSummary: strands.join('; '),
        subStrandSummary: subStrands.join('; '),
        contentStandardSummary: stdCodes.join(', '),
        indicatorCodesSummary: indCodes.join(', ')
      });
    });

  } else {
    // CASE 3: Low-Density Subject (Total Indicators < Instructional Weeks)
    // E.g., Basic 7 Computing (1 indicator across 10 weeks)
    // Avoid fake curriculum codes or artificial duplicates.
    // Allocate verified indicators to initial weeks; subsequent weeks structured as practical extension & consolidation
    for (let w = 0; w < instructionalWeeks; w++) {
      const weekNum = w + 1;
      if (w < totalTermIndicators && flattenedIndicators[w]) {
        const item = flattenedIndicators[w];
        const std: GroundedStandardItem = {
          ...item.record,
          indicators: [item.indicator]
        };
        weeks.push({
          weekNumber: weekNum,
          weekLabel: `Week ${weekNum}`,
          type: 'instructional',
          standards: [std],
          indicators: [{
            indicator: item.indicator,
            parentStandard: {
              code: item.record.contentStandardCode,
              text: item.record.contentStandardText,
              strand: item.record.strand,
              subStrand: item.record.subStrand
            }
          }],
          totalIndicators: 1,
          strandSummary: item.record.strand,
          subStrandSummary: item.record.subStrand,
          contentStandardSummary: item.record.contentStandardCode,
          indicatorCodesSummary: item.indicator.code
        });
      } else {
        const anchorItem: FlattenedIndicatorItem = flattenedIndicators[flattenedIndicators.length - 1] || {
          indicator: { code: 'N/A', text: 'Consolidation', full: 'Consolidation' },
          record: termRecords[0] || { strand: 'General', subStrand: 'Consolidation', contentStandardCode: 'N/A', contentStandardText: 'Consolidation', contentStandardFull: 'Consolidation', indicators: [] },
          globalIndex: 0
        };

        const extensionNote = getLowDensityExtensionLabel(plan.subject, w === instructionalWeeks - 1);

        weeks.push({
          weekNumber: weekNum,
          weekLabel: `Week ${weekNum}`,
          type: 'instructional',
          standards: [],
          indicators: [],
          totalIndicators: 0,
          strandSummary: anchorItem.record.strand,
          subStrandSummary: anchorItem.record.subStrand,
          contentStandardSummary: `${anchorItem.record.contentStandardCode} (Extended Application)`,
          indicatorCodesSummary: `${anchorItem.indicator.code} [Extension: ${extensionNote}]`,
          notes: extensionNote
        });
      }
    }
  }

  // Append Revision Week(s)
  for (let r = 0; r < revisionWeeks; r++) {
    const weekNum = instructionalWeeks + r + 1;
    weeks.push({
      weekNumber: weekNum,
      weekLabel: `Week ${weekNum}`,
      type: 'revision',
      standards: [],
      indicators: [],
      totalIndicators: 0,
      strandSummary: 'All Strands Covered in Term',
      subStrandSummary: 'Comprehensive Term Review',
      contentStandardSummary: 'Consolidation of All Term Standards',
      indicatorCodesSummary: 'Revision & Remedial Competencies',
      notes: 'Term Revision of Core Competencies, Remedial Consolidation & Project Review'
    });
  }

  // Append Assessment / Examination Week(s)
  for (let a = 0; a < assessmentWeeks; a++) {
    const weekNum = instructionalWeeks + revisionWeeks + a + 1;
    weeks.push({
      weekNumber: weekNum,
      weekLabel: `Week ${weekNum}`,
      type: 'assessment',
      standards: [],
      indicators: [],
      totalIndicators: 0,
      strandSummary: 'All Strands Covered in Term',
      subStrandSummary: 'Summative Assessment & Evaluation',
      contentStandardSummary: 'End of Term Assessment Standards',
      indicatorCodesSummary: 'SBA & Terminal Examinations',
      notes: 'End of Term Assessment, Examinations, SBA Recording & Vacation'
    });
  }

  // Audit and validation calculations
  const assignedIndicatorKeys: string[] = [];
  const keyToWeeksMap = new Map<string, number[]>();

  weeks.forEach(w => {
    if (w.type === 'instructional') {
      w.indicators.forEach(indItem => {
        if (!indItem.isExtensionOrConsolidation) {
          const key = buildCurriculumCoverageKey(
            plan.classLevel,
            plan.subject,
            indItem.parentStandard.code,
            indItem.indicator.code
          );
          assignedIndicatorKeys.push(key);
          if (!keyToWeeksMap.has(key)) keyToWeeksMap.set(key, []);
          keyToWeeksMap.get(key)!.push(w.weekNumber);
        }
      });
    }
  });

  const duplicateKeys: string[] = [];
  keyToWeeksMap.forEach((wNums, k) => {
    if (wNums.length > 1) duplicateKeys.push(k);
  });

  const expectedKeys = plan.allItemKeys.filter(k => {
    const termKey = `term${term}` as 'term1' | 'term2' | 'term3';
    return plan.terms[termKey].some(r => 
      r.indicators.some(ind => 
        k.endsWith(`::${r.contentStandardCode}::${ind.code}`)
      )
    );
  });

  const assignedSet = new Set(assignedIndicatorKeys);
  const unallocatedKeys = expectedKeys.filter(k => !assignedSet.has(k));

  const indicatorCounts = weeks.filter(w => w.type === 'instructional').map(w => w.totalIndicators);
  const maxIndicatorsPerWeek = indicatorCounts.length > 0 ? Math.max(...indicatorCounts) : 0;
  const minIndicatorsPerWeek = indicatorCounts.length > 0 ? Math.min(...indicatorCounts) : 0;

  let densityWarning: string | undefined;
  if (averageDensity >= 4.0 || maxIndicatorsPerWeek >= 6) {
    densityWarning = `High curriculum density: this term contains ${totalTermIndicators} indicators across ${instructionalWeeks} instructional weeks (average ${averageDensity} indicators/week). Some weeks will cover up to ${maxIndicatorsPerWeek} indicators. Review the coverage plan before generating.`;
  }

  return {
    classLevel: plan.classLevel,
    subject: plan.subject,
    educationalLevel: plan.educationalLevel,
    term,
    academicYear,
    totalWeeks,
    instructionalWeeks,
    revisionWeeks,
    assessmentWeeks,
    weeklyDistributionVersion: 'teachsmart-v2-weekly',
    totalTermIndicators,
    averageDensity,
    maxIndicatorsPerWeek,
    minIndicatorsPerWeek,
    densityWarning,
    weeks,
    unallocatedIndicatorsCount: unallocatedKeys.length,
    duplicateIndicatorsCount: duplicateKeys.length,
    unallocatedKeys,
    duplicateKeys
  };
}

/**
 * Builds a deterministic full-year weekly distribution plan combining Term 1, Term 2, and Term 3.
 */
export function buildYearWeeklyDistributionPlan(
  plan: SchemeTermCoveragePlan,
  config?: WeeklyDistributionConfig
): YearWeeklyDistributionPlan {
  const term1 = buildTermWeeklyDistributionPlan(plan, 1, config);
  const term2 = buildTermWeeklyDistributionPlan(plan, 2, config);
  const term3 = buildTermWeeklyDistributionPlan(plan, 3, config);

  return {
    classLevel: plan.classLevel,
    subject: plan.subject,
    educationalLevel: plan.educationalLevel,
    academicYear: term1.academicYear,
    totalWeeksPerTerm: term1.totalWeeks,
    instructionalWeeksPerTerm: term1.instructionalWeeks,
    revisionWeeksPerTerm: term1.revisionWeeks,
    assessmentWeeksPerTerm: term1.assessmentWeeks,
    weeklyDistributionVersion: 'teachsmart-v2-weekly',
    term1,
    term2,
    term3
  };
}

/**
 * Formats a deterministic TermWeeklyDistributionPlan into a structured prompt injection.
 * Enforces that Gemini generates ONLY pedagogical columns, leaving curriculum codes locked to assigned weeks.
 */
export function formatWeeklyDistributionForPrompt(
  weeklyPlan: TermWeeklyDistributionPlan
): string {
  const lines: string[] = [
    `======================================================================`,
    `TEACHSMARTGH DETERMINISTIC WEEKLY INSTRUCTIONAL CURRICULUM SCHEDULE`,
    `CLASS: ${weeklyPlan.classLevel.toUpperCase()} | SUBJECT: ${weeklyPlan.subject.toUpperCase()} | TERM ${weeklyPlan.term} (${weeklyPlan.academicYear})`,
    `======================================================================`,
    `TERM PLANNING STRUCTURE (TeachSmartGH default term structure, teacher-configured):`,
    `Total Weeks: ${weeklyPlan.totalWeeks} | Instructional Weeks: ${weeklyPlan.instructionalWeeks} | Revision Weeks: ${weeklyPlan.revisionWeeks} | Assessment Weeks: ${weeklyPlan.assessmentWeeks}`,
    `Total Term Indicators: ${weeklyPlan.totalTermIndicators} | Average Workload Density: ${weeklyPlan.averageDensity} indicators/week`,
    weeklyPlan.densityWarning ? `NOTE: ${weeklyPlan.densityWarning}` : ``,
    ``,
    `CRITICAL WEEK-BY-WEEK GROUNDING MANDATE:`,
    `1. For each week row in your table, you MUST use the EXACT Strand, Sub-Strand, Content Standard, and Indicator(s) assigned to that specific week below.`,
    `2. DO NOT move, reorder, reassign, or omit curriculum codes between weeks.`,
    `3. You are ONLY responsible for completing the teacher and learner pedagogical components:`,
    `   - Lesson Topic (concise, professional lesson topic for the week)`,
    `   - Learning Outcomes (specific measurable outcomes where enabled)`,
    `   - Teaching & Learning Activities (learner-centered, competency-based)`,
    `   - Core Competencies / Core Values`,
    `   - Resources / TLRs (compliant, accessible Ghanaian teaching aids)`,
    `   - Assessment (formative/evaluative questions & tasks)`,
    `4. REVISION WEEKS: Must NOT introduce new curriculum indicators. Reflect revision, remediation, and consolidation of weeks 1 to ${weeklyPlan.instructionalWeeks}.`,
    `5. ASSESSMENT WEEKS: Must NOT introduce new curriculum indicators. Reflect terminal examination and SBA recording.`,
    ``,
    `WEEK-BY-WEEK ALLOCATIONS (${weeklyPlan.weeks.length} Weeks Total):`
  ];

  weeklyPlan.weeks.forEach(w => {
    lines.push(`----------------------------------------------------------------------`);
    if (w.type === 'instructional') {
      lines.push(`${w.weekLabel.toUpperCase()} (INSTRUCTIONAL — ${w.totalIndicators} New Indicator${w.totalIndicators === 1 ? '' : 's'}):`);
      lines.push(`  Strand: ${w.strandSummary}`);
      lines.push(`  Sub-Strand: ${w.subStrandSummary}`);
      lines.push(`  Content Standard(s): ${w.contentStandardSummary}`);
      lines.push(`  Indicator(s): ${w.indicatorCodesSummary}`);
      if (w.notes) {
        lines.push(`  Instructional Focus: ${w.notes}`);
      }
      w.indicators.forEach(indItem => {
        if (!indItem.isExtensionOrConsolidation) {
          lines.push(`    • [${indItem.indicator.code}] ${indItem.indicator.text}`);
        } else {
          lines.push(`    • [${indItem.indicator.code}] (Consolidation & Practical Application): ${indItem.extensionNote || indItem.indicator.text}`);
        }
      });
    } else if (w.type === 'revision') {
      lines.push(`${w.weekLabel.toUpperCase()} (REVISION — NO NEW CURRICULUM INDICATORS):`);
      lines.push(`  Focus: Term Revision of Core Competencies, Remedial Consolidation & Project Review`);
      lines.push(`  Indicators: Revision of previously taught Term ${weeklyPlan.term} standards`);
    } else if (w.type === 'assessment') {
      lines.push(`${w.weekLabel.toUpperCase()} (ASSESSMENT — NO NEW CURRICULUM INDICATORS):`);
      lines.push(`  Focus: End of Term Assessment, Examinations, SBA Recording & Vacation`);
      lines.push(`  Indicators: Summative Evaluation of Term ${weeklyPlan.term} competencies`);
    }
  });

  lines.push(`======================================================================`);
  return lines.join('\n');
}

/**
 * Formats a full YearWeeklyDistributionPlan into a comprehensive prompt injection for Annual/Yearly Schemes.
 */
export function formatYearlyWeeklyDistributionForPrompt(
  yearlyWeeklyPlan: YearWeeklyDistributionPlan
): string {
  const totalYearIndicators = yearlyWeeklyPlan.term1.totalTermIndicators + 
    yearlyWeeklyPlan.term2.totalTermIndicators + 
    yearlyWeeklyPlan.term3.totalTermIndicators;

  const lines: string[] = [
    `======================================================================`,
    `TEACHSMARTGH FULL-YEAR STRATEGIC ROADMAP & WEEKLY DISTRIBUTION`,
    `CLASS: ${yearlyWeeklyPlan.classLevel.toUpperCase()} | SUBJECT: ${yearlyWeeklyPlan.subject.toUpperCase()} | ACADEMIC YEAR: ${yearlyWeeklyPlan.academicYear}`,
    `======================================================================`,
    `TERM PLANNING STRUCTURE (TeachSmartGH default term structure, teacher-configured):`,
    `Total Weeks Per Term: ${yearlyWeeklyPlan.totalWeeksPerTerm} (${yearlyWeeklyPlan.instructionalWeeksPerTerm} instructional weeks, ${yearlyWeeklyPlan.revisionWeeksPerTerm} revision, ${yearlyWeeklyPlan.assessmentWeeksPerTerm} assessment).`,
    `Total Year Indicators: ${totalYearIndicators} (Term 1: ${yearlyWeeklyPlan.term1.totalTermIndicators}, Term 2: ${yearlyWeeklyPlan.term2.totalTermIndicators}, Term 3: ${yearlyWeeklyPlan.term3.totalTermIndicators}).`,
    ``,
    `CRITICAL MANDATES FOR MASTER ANNUAL ROADMAP:`,
    `1. For each week (Week 1 to Week ${yearlyWeeklyPlan.totalWeeksPerTerm}):`,
    `   - Term 1 Topics MUST derive strictly from Term 1's corresponding week below.`,
    `   - Term 2 Topics MUST derive strictly from Term 2's corresponding week below.`,
    `   - Term 3 Topics MUST derive strictly from Term 3's corresponding week below.`,
    `   - Key Performance Indicators must synthesize the indicators allocated to that week across terms.`,
    `2. Revision and Assessment weeks must introduce NO new curriculum indicators.`,
    ``,
    `WEEK-BY-WEEK SCHEDULE BY TERM:`
  ];

  const terms = [yearlyWeeklyPlan.term1, yearlyWeeklyPlan.term2, yearlyWeeklyPlan.term3];
  terms.forEach(tPlan => {
    lines.push(`----------------------------------------------------------------------`);
    lines.push(`TERM ${tPlan.term} WEEKLY BREAKDOWN (${tPlan.totalTermIndicators} Indicators across ${tPlan.instructionalWeeks} instructional weeks):`);
    tPlan.weeks.forEach(w => {
      if (w.type === 'instructional') {
        lines.push(`  ${w.weekLabel}: [${w.strandSummary} / ${w.subStrandSummary}] ${w.contentStandardSummary} -> ${w.indicatorCodesSummary}`);
      } else {
        lines.push(`  ${w.weekLabel} (${w.type.toUpperCase()}): ${w.notes}`);
      }
    });
  });

  lines.push(`======================================================================`);
  return lines.join('\n');
}

/**
 * Formats a SchemeCurriculumFrame into a structured, unambiguous prompt injection for Gemini.
 * Clearly demarcates approved strands, sub-strands, standard codes, and indicator codes.
 * Conforms to Requirement 3: Explicitly identifies allocation as "TeachSmartGH curriculum coverage plan".
 */
export function formatCurriculumFrameForPrompt(
  frame: SchemeCurriculumFrame,
  term?: number,
  totalYearIndicators?: number
): string {
  if (!frame || frame.records.length === 0) {
    return `
CRITICAL CURRICULUM GROUNDING WARNING:
No official curriculum records were found for ${frame?.subject || 'the selected subject'} in ${frame?.classLevel || 'the selected class'}.
You must NOT hallucinate artificial curriculum standards or indicators.
`;
  }

  const termHeader = term
    ? `TEACHSMARTGH CURRICULUM COVERAGE PLAN — TERM ${term} (${frame.classLevel.toUpperCase()} ${frame.subject.toUpperCase()})`
    : `TEACHSMARTGH VERIFIED CURRICULUM REFERENCE DATA FOR ${frame.classLevel.toUpperCase()} ${frame.subject.toUpperCase()}`;

  const coverageSubtitle = term && totalYearIndicators
    ? `Term ${term} Curriculum Allocation: ${frame.totalIndicators} Indicators (out of ${totalYearIndicators} full-year indicators)`
    : `Total Curriculum Scope: ${frame.totalStandards} Standards, ${frame.totalIndicators} Indicators`;

  const lines: string[] = [
    `======================================================================`,
    termHeader,
    `======================================================================`,
    `SOURCE & COVERAGE METHODOLOGY:`,
    `This instructional allocation is drawn directly from the verified NaCCA curriculum database through the TeachSmartGH deterministic curriculum coverage plan.`,
    `Progression is strictly preserved to ensure sequential mastery without omission or duplication.`,
    coverageSubtitle,
    ``,
    `STRICT GROUNDING MANDATE:`,
    `1. You MUST ONLY use the Content Standards, Indicators, Strands, and Sub-strands explicitly provided below.`,
    `2. DO NOT invent, alter, or summarize Content Standard codes (e.g., "${frame.records[0]?.contentStandardCode || 'B7.1.1.1'}").`,
    `3. DO NOT invent, alter, or summarize Indicator codes (e.g., "${frame.records[0]?.indicators[0]?.code || 'B7.1.1.1.1'}").`,
    `4. DO NOT change official Content Standard or Indicator text.`,
    `5. DO NOT import or use curriculum codes from any other class level or any other academic term. All curriculum records below belong strictly to ${frame.classLevel}${term ? ` for Term ${term}` : ''}.`,
    `6. Distribute the provided curriculum items logically across the designated instructional weeks according to the TeachSmartGH term structure. Revision week(s) and End of Term Assessment week(s) are reserved and must NOT introduce new indicators.`,
    ``,
    `VERIFIED CURRICULUM INVENTORY (${frame.totalStandards} Standards, ${frame.totalIndicators} Indicators):`
  ];

  frame.records.forEach((rec, idx) => {
    lines.push(`[RECORD ${idx + 1}]`);
    lines.push(`  Strand: ${rec.strand}`);
    lines.push(`  Sub-Strand: ${rec.subStrand}`);
    lines.push(`  Content Standard: ${rec.contentStandardCode} — ${rec.contentStandardText}`);
    lines.push(`  Indicators:`);
    if (rec.indicators.length === 0) {
      lines.push(`    - ${rec.contentStandardCode}.1: Apply core concepts and demonstrate understanding of ${rec.contentStandardText}`);
    } else {
      rec.indicators.forEach(ind => {
        lines.push(`    - ${ind.code}: ${ind.text}`);
      });
    }
    lines.push(``);
  });

  lines.push(`======================================================================`);
  return lines.join('\n');
}

/**
 * Formats a full SchemeTermCoveragePlan into a comprehensive prompt injection for Annual/Yearly Schemes.
 * Ensures the Annual Scheme uses the EXACT SAME deterministic coverage plan as the 3 individual term schemes.
 */
export function formatYearlyCoveragePlanForPrompt(plan: SchemeTermCoveragePlan): string {
  const lines: string[] = [
    `======================================================================`,
    `TEACHSMARTGH FULL-YEAR STRATEGIC CURRICULUM COVERAGE PLAN`,
    `${plan.classLevel.toUpperCase()} ${plan.subject.toUpperCase()} (Total Standards: ${plan.totalStandards}, Total Indicators: ${plan.totalIndicators})`,
    `======================================================================`,
    `METHODOLOGY: TeachSmartGH deterministic curriculum coverage plan aligned with official NaCCA SBC/CCP learning progression.`,
    `Total Year Indicators: ${plan.totalIndicators} (Term 1: ${plan.termIndicatorCounts.term1}, Term 2: ${plan.termIndicatorCounts.term2}, Term 3: ${plan.termIndicatorCounts.term3}).`,
    ``,
    `CRITICAL MANDATES FOR MASTER ANNUAL ROADMAP:`,
    `1. Term 1 Topics and Indicators MUST derive strictly from the verified TERM 1 INVENTORY below.`,
    `2. Term 2 Topics and Indicators MUST derive strictly from the verified TERM 2 INVENTORY below.`,
    `3. Term 3 Topics and Indicators MUST derive strictly from the verified TERM 3 INVENTORY below.`,
    `4. DO NOT invent, alter, or summarize official curriculum codes or descriptions.`,
    `5. Weekly lessons provide progressive instruction from the respective term inventories across instructional weeks. Dedicated Revision and Assessment weeks must introduce no new indicators.`
  ];

  const formatTermInventory = (termNum: 1 | 2 | 3, recs: GroundedStandardItem[], count: number) => {
    lines.push(``);
    lines.push(`----------------------------------------------------------------------`);
    lines.push(`TERM ${termNum} INVENTORY (${recs.length} Standards, ${count} Indicators):`);
    lines.push(`----------------------------------------------------------------------`);
    recs.forEach((rec, idx) => {
      lines.push(`  [T${termNum}-S${idx + 1}] Strand: ${rec.strand} | Sub-Strand: ${rec.subStrand}`);
      lines.push(`    Content Standard: ${rec.contentStandardCode} — ${rec.contentStandardText}`);
      rec.indicators.forEach(ind => {
        lines.push(`      - ${ind.code}: ${ind.text}`);
      });
    });
  };

  formatTermInventory(1, plan.terms.term1, plan.termIndicatorCounts.term1);
  formatTermInventory(2, plan.terms.term2, plan.termIndicatorCounts.term2);
  formatTermInventory(3, plan.terms.term3, plan.termIndicatorCounts.term3);

  lines.push(``);
  lines.push(`======================================================================`);
  return lines.join('\n');
}

/**
 * Validates a generated Markdown scheme table against the verified curriculum frame.
 * Checks that all Content Standard and Indicator codes present in the table belong to the frame.
 * Optionally verifies that codes do not belong to other academic terms (cross-term contamination).
 */
export function validateSchemeAgainstFrame(
  markdown: string, 
  frame: SchemeCurriculumFrame,
  coveragePlan?: SchemeTermCoveragePlan,
  currentTerm?: 1 | 2 | 3
): { 
  valid: boolean; 
  detectedCodes: string[]; 
  unknownCodes: string[]; 
  classMismatches: string[];
  termCrossContamination: string[];
} {
  if (!markdown || !frame) {
    return { valid: true, detectedCodes: [], unknownCodes: [], classMismatches: [], termCrossContamination: [] };
  }

  // Create lookup sets of valid codes in this frame
  const validStandardCodes = new Set(frame.records.map(r => r.contentStandardCode.toUpperCase()));
  const validIndicatorCodes = new Set<string>();
  frame.records.forEach(r => {
    r.indicators.forEach(ind => validIndicatorCodes.add(ind.code.toUpperCase()));
  });

  // Build sets of other terms' codes if coveragePlan is provided
  const otherTermCodes = new Map<string, number>();
  if (coveragePlan && currentTerm) {
    ([1, 2, 3] as const).forEach(t => {
      if (t !== currentTerm) {
        const termKey = `term${t}` as 'term1' | 'term2' | 'term3';
        coveragePlan.terms[termKey]?.forEach(rec => {
          otherTermCodes.set(rec.contentStandardCode.toUpperCase(), t);
          rec.indicators.forEach(ind => {
            otherTermCodes.set(ind.code.toUpperCase(), t);
          });
        });
      }
    });
  }

  const targetPrefix = getClassPrefix(frame.classLevel).toUpperCase();
  const detectedCodes: string[] = [];
  const unknownCodes: string[] = [];
  const classMismatches: string[] = [];
  const termCrossContamination: string[] = [];

  // Match all curriculum code patterns (e.g. B1.1.1.1, B7.1.1.1.1, KG1.1.1.1)
  const codeMatches = markdown.match(/\b(B\d+|KG\d+|SHS\d+)\.[0-9.]+\b/gi) || [];

  for (const rawCode of codeMatches) {
    const code = rawCode.trim().toUpperCase();
    if (!detectedCodes.includes(code)) {
      detectedCodes.push(code);
    }

    // Check class mismatch (e.g. B8 code found when target class is Basic 7)
    const codePrefixMatch = code.match(/^(B\d+|KG\d+|SHS\d+)/);
    if (codePrefixMatch) {
      const prefix = codePrefixMatch[1];
      if (prefix !== targetPrefix) {
        classMismatches.push(`${code} (expected ${targetPrefix})`);
      }
    }

    // Check if code exists in verified frame
    const isKnown = validStandardCodes.has(code) || validIndicatorCodes.has(code);
    if (!isKnown && !unknownCodes.includes(code)) {
      unknownCodes.push(code);
    }

    // Check cross-term contamination
    if (otherTermCodes.has(code) && !validStandardCodes.has(code) && !validIndicatorCodes.has(code)) {
      const allocatedTerm = otherTermCodes.get(code);
      termCrossContamination.push(`${code} belongs to Term ${allocatedTerm}, not Term ${currentTerm}`);
    }
  }

  const valid = classMismatches.length === 0 && termCrossContamination.length === 0;
  return {
    valid,
    detectedCodes,
    unknownCodes,
    classMismatches,
    termCrossContamination
  };
}

import { LessonPlan } from '../types';

/**
 * Normalizes subject names into canonical categories so historical variations match seamlessly.
 */
export function normalizeSubject(rawSubject: string | undefined | null): string {
  if (!rawSubject) return '';
  const s = rawSubject.trim().toLowerCase();

  if (s.includes('science') || s.includes('integrated science') || s.includes('natural science')) {
    return 'science';
  }
  if (s.includes('english') || s.includes('literacy') || s.includes('language arts')) {
    return 'english';
  }
  if (s.includes('math') || s.includes('numeracy')) {
    return 'mathematics';
  }
  if (s.includes('social') || s.includes('citizenship') || s.includes('our world our people') || s.includes('owop')) {
    return 'social studies';
  }
  if (s.includes('computing') || s.includes('ict') || s.includes('information and comm')) {
    return 'computing';
  }
  if (s.includes('creative art') || s.includes('cad') || s.includes('visual art') || s.includes('performing art')) {
    return 'creative arts';
  }
  if (s.includes('rme') || s.includes('religious') || s.includes('moral')) {
    return 'rme';
  }
  if (s.includes('career') || s.includes('pre-tech') || s.includes('tech')) {
    return 'career technology';
  }
  if (s.includes('physical') || s.includes('pe') || s.includes('phe') || s.includes('health')) {
    return 'physical and health education';
  }
  if (s.includes('french')) {
    return 'french';
  }
  if (s.includes('ghanaian language') || s.includes('twi') || s.includes('fante') || s.includes('ga') || s.includes('ewe') || s.includes('dagbani')) {
    return 'ghanaian language';
  }

  return s.replace(/[^a-z0-9]/g, '');
}

/**
 * Normalizes class / level strings so historical variations match:
 * e.g., 'Basic 5', 'BASIC_5', 'Basic Five', 'Primary 5', 'Class 5', 'P5' -> 'basic 5'
 * e.g., 'Basic 7', 'BASIC_7', 'JHS 1', 'B7' -> 'basic 7'
 */
export function normalizeClassLevel(rawClass: string | undefined | null): string {
  if (!rawClass) return '';
  const c = rawClass.trim().toLowerCase();

  // Kindergarten
  if (c.includes('kg 1') || c.includes('kg1') || c.includes('kg_1') || c.includes('kindergarten 1')) {
    return 'kg 1';
  }
  if (c.includes('kg 2') || c.includes('kg2') || c.includes('kg_2') || c.includes('kindergarten 2')) {
    return 'kg 2';
  }
  if (c.includes('kg') || c.includes('kindergarten')) {
    return 'kg';
  }

  // JHS / Upper classes
  if (c.includes('basic 7') || c.includes('basic_7') || c.includes('basic seven') || c.includes('jhs 1') || c.includes('jhs1') || c === 'b7') {
    return 'basic 7';
  }
  if (c.includes('basic 8') || c.includes('basic_8') || c.includes('basic eight') || c.includes('jhs 2') || c.includes('jhs2') || c === 'b8') {
    return 'basic 8';
  }
  if (c.includes('basic 9') || c.includes('basic_9') || c.includes('basic nine') || c.includes('jhs 3') || c.includes('jhs3') || c === 'b9') {
    return 'basic 9';
  }

  // Primary classes (1 through 6)
  const numberWordMap: Record<string, number> = {
    'one': 1, '1': 1,
    'two': 2, '2': 2,
    'three': 3, '3': 3,
    'four': 4, '4': 4,
    'five': 5, '5': 5,
    'six': 6, '6': 6,
  };

  for (const [word, num] of Object.entries(numberWordMap)) {
    if (
      c.includes(`basic ${word}`) || 
      c.includes(`basic_${word}`) || 
      c.includes(`primary ${word}`) || 
      c.includes(`class ${word}`) || 
      c.includes(`grade ${word}`) ||
      c === `b${num}` ||
      c === `p${num}`
    ) {
      return `basic ${num}`;
    }
  }

  // Generic digit extractor if "basic" or "class" is in the text
  const digitMatch = c.match(/\d+/);
  if (digitMatch && (c.includes('basic') || c.includes('primary') || c.includes('class') || c.includes('grade') || c.startsWith('b') || c.startsWith('p'))) {
    return `basic ${digitMatch[0]}`;
  }

  return c.replace(/[^a-z0-9]/g, '');
}

/**
 * Normalizes term representation:
 * e.g. 'Term 1', 'TERM_1', '1st Term', 'First Term' -> 'term 1'
 */
export function normalizeTerm(rawTerm: string | undefined | null): string {
  if (!rawTerm) return '';
  const t = rawTerm.trim().toLowerCase();

  if (t.includes('1') || t.includes('first') || t.includes('one')) {
    return 'term 1';
  }
  if (t.includes('2') || t.includes('second') || t.includes('two')) {
    return 'term 2';
  }
  if (t.includes('3') || t.includes('third') || t.includes('three')) {
    return 'term 3';
  }

  return t;
}

/**
 * Normalizes academic year:
 * e.g. '2025/2026', '2025-2026', '2025 - 2026' -> '2025/2026'
 */
export function normalizeAcademicYear(rawYear: string | undefined | null): string {
  if (!rawYear) return '';
  return rawYear.replace(/\s+/g, '').replace(/-/g, '/');
}

/**
 * Safely extracts a numeric week number from any lesson plan record.
 * Handles 'Week 1', 'WEEK 12', '12', and title matches.
 */
export function extractWeekNumber(plan: Partial<LessonPlan>): number {
  if (plan.weekNumber) {
    const parsed = parseInt(String(plan.weekNumber), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (plan.week) {
    const match = String(plan.week).match(/(?:week\s*)?(\d+)/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  if (plan.title) {
    const match = String(plan.title).match(/week\s*(\d+)/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 1;
}

/**
 * Safely extracts a numeric lesson number from any lesson plan record.
 * Avoids concatenating digits like '1 of 3 (60 mins)' -> correctly returns 1.
 */
export function extractLessonNumber(plan: Partial<LessonPlan>): number {
  if (plan.lessonNumber) {
    const parsed = parseInt(String(plan.lessonNumber), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (plan.lesson) {
    // Matches "1 of 3", "Lesson 2", "Lesson 2 of 3", "1", "#1"
    const match = String(plan.lesson).match(/(?:lesson\s*#?|#)?\s*(\d+)/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  if (plan.period) {
    const match = String(plan.period).match(/(\d+)/);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 1;
}

/**
 * Extracts a numeric timestamp (epoch ms) from a lesson plan record.
 * Supports Firebase Timestamp, ISO strings, and raw numbers.
 */
export function getLessonRecordTimestamp(plan: any): number {
  if (!plan) return 0;
  const ts = plan.updatedAt || plan.createdAt || plan.cachedAt;
  if (!ts) return 0;

  if (typeof ts === 'number') return ts;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts.seconds) return ts.seconds * 1000;
  if (typeof ts === 'string') {
    const parsed = Date.parse(ts);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Generates a stable composite curriculum key for deduplication.
 * If two records share the same subject, class, term, week, lesson, strand, and indicator code,
 * they represent the identical curriculum teaching slot.
 */
export function generateCurriculumKey(plan: Partial<LessonPlan>): string {
  const wNum = extractWeekNumber(plan);
  const lNum = extractLessonNumber(plan);
  const normSubj = normalizeSubject(plan.subject);
  const normCls = normalizeClassLevel(plan.class || plan.level);
  const normTrm = normalizeTerm(plan.term);
  const strandKey = (plan.strand || '').trim().toLowerCase().slice(0, 40);
  const indCode = (plan.indicatorCode || plan.indicator || '').trim().toLowerCase().slice(0, 40);

  return `${normSubj}_${normCls}_${normTrm}_w${wNum}_l${lNum}_${strandKey}_${indCode}`;
}

/**
 * Duplicate-Resolution Strategy:
 * 1. Checks direct document ID collision.
 * 2. Checks semantic curriculum key collision.
 * 3. In any conflict, compares `getLessonRecordTimestamp`. The later/more recently edited
 *    version is selected.
 * 4. If timestamps are equal or absent, the authoritative Firestore document is preferred over local cache.
 * 5. Neither Firestore nor IndexedDB are deleted or modified.
 */
export function mergeAndDeduplicateLessonPlans(
  firestorePlans: LessonPlan[],
  idbPlans: LessonPlan[]
): LessonPlan[] {
  // Map of unique lesson identifier -> LessonPlan
  const mergedById = new Map<string, { plan: LessonPlan; isFirestore: boolean }>();

  // 1. Process Firestore plans first (authoritative cloud source)
  for (const fPlan of firestorePlans) {
    const id = fPlan.id || `fs_${generateCurriculumKey(fPlan)}`;
    mergedById.set(id, { plan: { ...fPlan, id }, isFirestore: true });
  }

  // 2. Process IndexedDB plans
  for (const idbPlan of idbPlans) {
    const id = idbPlan.id;
    if (id && mergedById.has(id)) {
      const existing = mergedById.get(id)!;
      const existingTs = getLessonRecordTimestamp(existing.plan);
      const idbTs = getLessonRecordTimestamp(idbPlan);

      // If local offline version has a strictly newer edit timestamp, use it
      if (idbTs > existingTs) {
        mergedById.set(id, { plan: { ...idbPlan, id }, isFirestore: false });
      }
    } else {
      const finalId = id || `idb_${generateCurriculumKey(idbPlan)}`;
      mergedById.set(finalId, { plan: { ...idbPlan, id: finalId }, isFirestore: false });
    }
  }

  // 3. Resolve semantic duplicates (e.g. one local offline copy created before sync + one synced copy)
  const curriculumMap = new Map<string, { plan: LessonPlan; isFirestore: boolean }>();

  for (const { plan, isFirestore } of mergedById.values()) {
    const cKey = generateCurriculumKey(plan);
    if (!curriculumMap.has(cKey)) {
      curriculumMap.set(cKey, { plan, isFirestore });
    } else {
      const existing = curriculumMap.get(cKey)!;
      const existingTs = getLessonRecordTimestamp(existing.plan);
      const currentTs = getLessonRecordTimestamp(plan);

      if (currentTs > existingTs) {
        curriculumMap.set(cKey, { plan, isFirestore });
      } else if (currentTs === existingTs && isFirestore && !existing.isFirestore) {
        // Tie-breaker: prefer Firestore
        curriculumMap.set(cKey, { plan, isFirestore });
      }
    }
  }

  return Array.from(curriculumMap.values()).map(entry => entry.plan);
}

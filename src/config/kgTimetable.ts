/**
 * TeachSmartGH — Directorate KG Timetable Configuration
 * Authoritative source: Universal KG Timetable & Daily Lesson Plan format
 * supplied by the Nanumba South District Education Directorate.
 */

export interface KGTimetableBlock {
  periodNumber: number;
  blockName: string;
  duration?: string;
  isInstructional: boolean;
  defaultDescription?: string;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export const KG_TIMETABLE_BY_DAY: Record<Weekday, KGTimetableBlock[]> = {
  Monday: [
    { periodNumber: 1, blockName: "Assembly / Registration", isInstructional: false, defaultDescription: "Welcoming learners, roll call, and personal hygiene inspection." },
    { periodNumber: 2, blockName: "Circle Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Calendar check, weather observation, theme introduction rhyme/song." },
    { periodNumber: 3, blockName: "Group Activity 1 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Play-based thematic inquiry using concrete manipulatives." },
    { periodNumber: 4, blockName: "Break", isInstructional: false, defaultDescription: "Handwashing with soap, healthy snack, and supervised rest." },
    { periodNumber: 5, blockName: "Group Activity 2 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Hands-on numeracy, sorting, spatial concepts, and creative exploration." },
    { periodNumber: 6, blockName: "Phonics Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Letter sounds, phonemic awareness, and vocabulary chant connected to the theme." },
    { periodNumber: 7, blockName: "Break", isInstructional: false, defaultDescription: "Supervised hydration, hygiene routine, and rest." },
    { periodNumber: 8, blockName: "Learning Centres / Choice Time", isInstructional: true, defaultDescription: "Child-directed discovery in Book, Manipulative, Dramatic, and Nature corners." },
    { periodNumber: 9, blockName: "Story Sharing", isInstructional: true, defaultDescription: "Interactive short theme-related story with learner participation." }
  ],
  Tuesday: [
    { periodNumber: 1, blockName: "Assembly / Registration", isInstructional: false, defaultDescription: "Welcoming learners, roll call, and personal hygiene inspection." },
    { periodNumber: 2, blockName: "Circle Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Calendar check, weather observation, theme introduction rhyme/song." },
    { periodNumber: 3, blockName: "Group Activity 1 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Play-based thematic inquiry using concrete manipulatives." },
    { periodNumber: 4, blockName: "Break", isInstructional: false, defaultDescription: "Handwashing with soap, healthy snack, and supervised rest." },
    { periodNumber: 5, blockName: "Group Activity 2 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Hands-on numeracy, sorting, spatial concepts, and creative exploration." },
    { periodNumber: 6, blockName: "Phonics Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Letter sounds, phonemic awareness, and vocabulary chant connected to the theme." },
    { periodNumber: 7, blockName: "Break", isInstructional: false, defaultDescription: "Supervised hydration, hygiene routine, and rest." },
    { periodNumber: 8, blockName: "Learning Centres / Choice Time", isInstructional: true, defaultDescription: "Child-directed discovery in Book, Manipulative, Dramatic, and Nature corners." },
    { periodNumber: 9, blockName: "Story Sharing", isInstructional: true, defaultDescription: "Interactive short theme-related story with learner participation." }
  ],
  Wednesday: [
    { periodNumber: 1, blockName: "Assembly / Registration", isInstructional: false, defaultDescription: "Welcoming learners, roll call, and personal hygiene inspection." },
    { periodNumber: 2, blockName: "Worship", isInstructional: true, defaultDescription: "Spiritual reflection, worship song, moral story, and prayer." },
    { periodNumber: 3, blockName: "Circle Time 1", duration: "30 minutes", isInstructional: true, defaultDescription: "Calendar, weather chart, news sharing, and daily focus discussion." },
    { periodNumber: 4, blockName: "Break", isInstructional: false, defaultDescription: "Handwashing with soap, healthy snack, and supervised rest." },
    { periodNumber: 5, blockName: "Group Activity 1 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Play-based thematic inquiry using concrete manipulatives." },
    { periodNumber: 6, blockName: "Phonics Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Letter sounds, phonemic awareness, and vocabulary chant connected to the theme." },
    { periodNumber: 7, blockName: "Break", isInstructional: false, defaultDescription: "Supervised hydration, hygiene routine, and rest." },
    { periodNumber: 8, blockName: "Learning Centres / Choice Time", isInstructional: true, defaultDescription: "Child-directed discovery in Book, Manipulative, Dramatic, and Nature corners." },
    { periodNumber: 9, blockName: "Story Sharing", isInstructional: true, defaultDescription: "Interactive short theme-related story with learner participation." }
  ],
  Thursday: [
    { periodNumber: 1, blockName: "Assembly / Registration", isInstructional: false, defaultDescription: "Welcoming learners, roll call, and personal hygiene inspection." },
    { periodNumber: 2, blockName: "Circle Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Calendar check, weather observation, theme introduction rhyme/song." },
    { periodNumber: 3, blockName: "Group Activity 1 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Play-based thematic inquiry using concrete manipulatives." },
    { periodNumber: 4, blockName: "Break", isInstructional: false, defaultDescription: "Handwashing with soap, healthy snack, and supervised rest." },
    { periodNumber: 5, blockName: "Group Activity 2 (Indoor/Outdoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Hands-on numeracy, sorting, spatial concepts, and creative exploration." },
    { periodNumber: 6, blockName: "Phonics Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Letter sounds, phonemic awareness, and vocabulary chant connected to the theme." },
    { periodNumber: 7, blockName: "Break", isInstructional: false, defaultDescription: "Supervised hydration, hygiene routine, and rest." },
    { periodNumber: 8, blockName: "Learning Centres / Choice Time", isInstructional: true, defaultDescription: "Child-directed discovery in Book, Manipulative, Dramatic, and Nature corners." },
    { periodNumber: 9, blockName: "Story Sharing", isInstructional: true, defaultDescription: "Interactive short theme-related story with learner participation." }
  ],
  Friday: [
    { periodNumber: 1, blockName: "Assembly / Registration", isInstructional: false, defaultDescription: "Welcoming learners, roll call, and personal hygiene inspection." },
    { periodNumber: 2, blockName: "Outdoor", isInstructional: true, defaultDescription: "Structured outdoor psychomotor movement, physical balance, and active games." },
    { periodNumber: 3, blockName: "Outdoor", isInstructional: true, defaultDescription: "Gross-motor obstacle courses, ball games, and sensory environmental play." },
    { periodNumber: 4, blockName: "Break", isInstructional: false, defaultDescription: "Handwashing with soap, healthy snack, and supervised rest." },
    { periodNumber: 5, blockName: "Group Activity 2 (Indoor)", duration: "1 hour", isInstructional: true, defaultDescription: "Indoor cognitive exploration, sorting, puzzles, and creative arts modeling." },
    { periodNumber: 6, blockName: "Phonics Time", duration: "30 minutes", isInstructional: true, defaultDescription: "Letter sounds, phonemic awareness, and vocabulary chant connected to the theme." },
    { periodNumber: 7, blockName: "Break", isInstructional: false, defaultDescription: "Supervised hydration, hygiene routine, and rest." },
    { periodNumber: 8, blockName: "Learning Centres / Choice Time", isInstructional: true, defaultDescription: "Child-directed discovery in Book, Manipulative, Dramatic, and Nature corners." },
    { periodNumber: 9, blockName: "Story Sharing", isInstructional: true, defaultDescription: "Interactive short theme-related story with learner participation." }
  ]
};

/**
 * Returns strictly supported duration for a given KG timetable block.
 * Blocks without explicit Directorate duration return an empty string.
 */
export function getSupportedKGBlockDuration(blockName?: string): string {
  if (!blockName) return '';
  const name = blockName.toLowerCase().trim();
  if (name.includes('circle time')) return '30 minutes';
  if (name.includes('group activity 1')) return '1 hour';
  if (name.includes('group activity 2')) return '1 hour';
  if (name.includes('phonics')) return '30 minutes';
  return '';
}

export function getKGScheduleForDay(day?: string): KGTimetableBlock[] {
  if (!day) return KG_TIMETABLE_BY_DAY.Monday;
  const d = day.trim().toLowerCase();
  if (d.includes('tue')) return KG_TIMETABLE_BY_DAY.Tuesday;
  if (d.includes('wed')) return KG_TIMETABLE_BY_DAY.Wednesday;
  if (d.includes('thu')) return KG_TIMETABLE_BY_DAY.Thursday;
  if (d.includes('fri')) return KG_TIMETABLE_BY_DAY.Friday;
  return KG_TIMETABLE_BY_DAY.Monday;
}

/**
 * Deterministically reconciles raw blocks with the authoritative daily KG timetable.
 * Ensures all 9 blocks for the given day (including non-instructional Break blocks and Worship)
 * are present in the exact official sequence.
 */
export function reconcileKGBlocks(rawBlocks?: any[], day?: string): KGDailyLessonBlockData[] {
  const schedule = getKGScheduleForDay(day);
  const rawList = Array.isArray(rawBlocks) ? rawBlocks : [];
  const usedIndices = new Set<number>();

  return schedule.map((canonical) => {
    let matchedRaw: any = null;
    let matchedRawIdx = -1;

    // 1. Exact match by periodNumber and compatible blockName
    for (let i = 0; i < rawList.length; i++) {
      if (usedIndices.has(i)) continue;
      const r = rawList[i];
      if (r && Number(r.periodNumber) === canonical.periodNumber) {
        const rName = String(r.blockName || '').toLowerCase();
        const cName = canonical.blockName.toLowerCase();
        // If names are generally compatible or both are break/instructional
        if (
          (cName.includes('break') && (rName.includes('break') || rName.includes('snack'))) ||
          (cName.includes('worship') && rName.includes('worship')) ||
          (cName.includes('circle time') && rName.includes('circle')) ||
          (cName.includes('group activity 1') && rName.includes('group activity 1')) ||
          (cName.includes('group activity 2') && rName.includes('group activity 2')) ||
          (cName.includes('phonics') && rName.includes('phonic')) ||
          (cName.includes('outdoor') && rName.includes('outdoor')) ||
          (cName.includes('learning centre') && (rName.includes('learning centre') || rName.includes('choice'))) ||
          (cName.includes('story') && rName.includes('story')) ||
          (cName.includes('assembly') && rName.includes('assembly'))
        ) {
          matchedRaw = r;
          matchedRawIdx = i;
          break;
        }
      }
    }

    // 2. Semantic name match if period numbers shifted
    if (!matchedRaw) {
      const cName = canonical.blockName.toLowerCase();
      for (let i = 0; i < rawList.length; i++) {
        if (usedIndices.has(i)) continue;
        const r = rawList[i];
        if (!r || !r.blockName) continue;
        const rName = String(r.blockName).toLowerCase();

        let isMatch = false;
        if (cName.includes('assembly') && (rName.includes('assembly') || rName.includes('registration'))) {
          isMatch = true;
        } else if (cName.includes('worship') && (rName.includes('worship') || rName.includes('devotion') || rName.includes('prayer'))) {
          isMatch = true;
        } else if (cName.includes('circle time') && rName.includes('circle time')) {
          isMatch = true;
        } else if (cName.includes('group activity 1') && (rName.includes('group activity 1') || (rName.includes('group activity') && !rName.includes('2')))) {
          isMatch = true;
        } else if (cName.includes('group activity 2') && rName.includes('group activity 2')) {
          isMatch = true;
        } else if (cName.includes('outdoor') && rName.includes('outdoor') && !rName.includes('group')) {
          isMatch = true;
        } else if (cName.includes('phonics') && rName.includes('phonic')) {
          isMatch = true;
        } else if (cName === 'break' && (rName.includes('break') || rName.includes('snack') || rName.includes('recess'))) {
          isMatch = true;
        } else if (cName.includes('learning centre') && (rName.includes('learning centre') || rName.includes('learning center') || rName.includes('choice time') || rName.includes('interest corner'))) {
          isMatch = true;
        } else if (cName.includes('story') && rName.includes('story')) {
          isMatch = true;
        }

        if (isMatch) {
          matchedRaw = r;
          matchedRawIdx = i;
          break;
        }
      }
    }

    if (matchedRawIdx >= 0) {
      usedIndices.add(matchedRawIdx);
    }

    const duration = getSupportedKGBlockDuration(canonical.blockName);

    return {
      periodNumber: canonical.periodNumber,
      time: duration,
      blockName: canonical.blockName,
      isInstructional: canonical.isInstructional,
      teacherActivities: (matchedRaw?.teacherActivities && String(matchedRaw.teacherActivities).trim())
        ? String(matchedRaw.teacherActivities)
        : (canonical.isInstructional ? `Teacher facilitates ${canonical.blockName.toLowerCase()} using age-appropriate play strategies.` : (canonical.defaultDescription || '')),
      learnerActivities: (matchedRaw?.learnerActivities && String(matchedRaw.learnerActivities).trim())
        ? String(matchedRaw.learnerActivities)
        : (canonical.isInstructional ? `Learners actively engage in ${canonical.blockName.toLowerCase()} with concrete manipulatives.` : 'Participate in routine.'),
      playBasedTechnique: matchedRaw?.playBasedTechnique ? String(matchedRaw.playBasedTechnique) : undefined,
      resources: matchedRaw?.resources ? String(matchedRaw.resources) : (canonical.isInstructional ? 'Concrete manipulatives, charts, realia' : ''),
      coreCompetency: matchedRaw?.coreCompetency ? String(matchedRaw.coreCompetency) : undefined,
      assessment: matchedRaw?.assessment ? String(matchedRaw.assessment) : (canonical.isInstructional ? 'Active observation and checklist' : '')
    };
  });
}

export interface KGDailyLessonBlockData {
  periodNumber: number;
  time?: string;
  blockName: string;
  isInstructional?: boolean;
  teacherActivities?: string;
  learnerActivities?: string;
  playBasedTechnique?: string;
  resources?: string;
  coreCompetency?: string;
  assessment?: string;
  formativeCheck?: string;
}

export interface KGDailyLessonPlanResult {
  title: string;
  classLevel: 'KG 1' | 'KG 2';
  date: string;
  day: string;
  weekEnding: string;
  weekNumber: string;
  classSize: string;
  strand: string;
  subStrand: string;
  contentStandard: string;
  contentStandardCode: string;
  indicator: string;
  indicatorCode: string;
  lessonFocus: string;
  performanceIndicator: string;
  coreCompetencies: string;
  keyWords: string;
  tlrs: string;
  references: string;
  blocks: KGDailyLessonBlockData[];
  differentiation?: {
    strugglingLearners: { activities: string; resources: string; assessments: string };
    averageLearners: { activities: string; resources: string; assessments: string };
    advancedLearners: { activities: string; resources: string; assessments: string };
  };
  assessmentEvidence?: string;
  learnersNeedingSupport?: string;
  teacherReflection?: string;
  headteacherRemarks?: string;
}

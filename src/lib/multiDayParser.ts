import { SchoolWeekDays, getSchoolWeekDaysFromWeekEnding } from './utils';

export interface MultiDayLessonPhase {
  dayName: string;
  dayDate?: string;
  duration?: string;
  starter: string;
  main: string;
  plenary: string;
  differentiation?: {
    strugglingLearners?: { activities?: string; resources?: string; assessments?: string };
    averageLearners?: { activities?: string; resources?: string; assessments?: string };
    advancedLearners?: { activities?: string; resources?: string; assessments?: string };
  };
}

/**
 * Extracts a list of distinct days from the input day string or array.
 * E.g. "Monday & Wednesday" -> ["Monday", "Wednesday"]
 * "Monday, Wednesday & Friday" -> ["Monday", "Wednesday", "Friday"]
 */
export function parseDaysList(rawDay: string | string[] | undefined | null): string[] {
  if (!rawDay) return ['Monday'];
  if (Array.isArray(rawDay)) {
    const list = rawDay.filter(Boolean).map(d => String(d).trim());
    return list.length > 0 ? list : ['Monday'];
  }
  const str = String(rawDay).trim();
  if (!str) return ['Monday'];

  // Split on & or comma or "and"
  const tokens = str.split(/[,&]+|\band\b/i).map(t => t.trim()).filter(Boolean);
  const validDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const matched: string[] = [];
  for (const token of tokens) {
    const found = validDayNames.find(v => v.toLowerCase() === token.toLowerCase() || token.toLowerCase().includes(v.toLowerCase().slice(0, 3)));
    if (found && !matched.includes(found)) {
      matched.push(found);
    } else if (!matched.includes(token) && token.length > 2) {
      matched.push(token);
    }
  }

  return matched.length > 0 ? matched : [str];
}

/**
 * Parses day-specific content from text blocks if organized by day.
 * E.g. "**DAY 1 (Monday):** ... \n\n**DAY 2 (Wednesday):** ..."
 * or "Monday: ... \n\nWednesday: ..."
 */
function extractSectionForDay(fullText: string | undefined | null, dayIndex: number, dayName: string, totalDays: number): string {
  if (!fullText) return '';
  if (totalDays <= 1) return fullText;

  const text = fullText.trim();

  // Regex patterns to identify day sections
  // E.g. (DAY 1|Day 1|DAY 1: Monday|Monday:)
  const dayPatterns = [
    new RegExp(`(?:\\*\\*|#{1,3}\\s*)?(?:DAY\\s*${dayIndex + 1}|Day\\s*${dayIndex + 1}|DAY\\s*#?${dayIndex + 1}\\s*[:\\-\\–\\(]|${dayName}\\s*[:\\-\\–])([^#\\*]*(?:\\n(?!\\s*(?:\\*\\*|#{1,3}\\s*)?(?:DAY\\s*\\d+|Day\\s*\\d+|Tuesday|Wednesday|Thursday|Friday|Monday))[\\s\\S]*)*)`, 'i'),
    new RegExp(`(?:^|\\n)(?:\\*\\*)?(?:DAY\\s*${dayIndex + 1}|Day\\s*${dayIndex + 1}|${dayName})[\\s\\S]*?(?=(?:\\n(?:\\*\\*)?(?:DAY\\s*\\d+|Day\\s*\\d+|Tuesday|Wednesday|Thursday|Friday|Monday))|$)`, 'i')
  ];

  for (const pattern of dayPatterns) {
    const match = text.match(pattern);
    if (match && match[0] && match[0].trim().length > 20) {
      return match[0].trim();
    }
  }

  // If text already has Day 1 / Day 2 markers, split by marker
  const splitChunks = text.split(/(?=(?:^|\n)(?:\*\*|#{1,3}\s*)?(?:DAY\s*\d+|Day\s*\d+))/i).filter(c => c.trim().length > 0);
  if (splitChunks.length === totalDays && splitChunks[dayIndex]) {
    return splitChunks[dayIndex].trim();
  }

  // If no day-specific split is found, return the full text for each day so no instructional step is omitted
  return text;
}

/**
 * Builds individual day rows for Table 2.
 * Ensures each day has its own aligned row with distinct Day column, Starter, Main, and Plenary.
 */
export function buildMultiDayLessonPhases(params: {
  day: string | string[];
  weekEnding?: string;
  duration?: string;
  phase1?: string;
  phase2?: string;
  phase3?: string;
  differentiation?: any;
}): MultiDayLessonPhase[] {
  const dayList = parseDaysList(params.day);
  const weekEnding = params.weekEnding || new Date().toISOString().split('T')[0];
  const weekDays = getSchoolWeekDaysFromWeekEnding(weekEnding);
  const totalDays = dayList.length;

  return dayList.map((dName, idx) => {
    // Find matching date from Week Ending
    const matchKey = (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Array<keyof SchoolWeekDays>).find(
      k => k.toLowerCase() === dName.toLowerCase() || dName.toLowerCase().includes(k.toLowerCase().slice(0, 3))
    );
    const dayDate = matchKey ? weekDays[matchKey] : undefined;

    const starter = extractSectionForDay(params.phase1, idx, dName, totalDays);
    const main = extractSectionForDay(params.phase2, idx, dName, totalDays);
    const plenary = extractSectionForDay(params.phase3, idx, dName, totalDays);

    return {
      dayName: dName,
      dayDate,
      duration: params.duration || '60 mins',
      starter,
      main,
      plenary,
      differentiation: idx === 0 || totalDays === 1 ? params.differentiation : undefined
    };
  });
}

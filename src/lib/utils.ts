import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formats any indicator text, objective string or learning target into the standard GES/NaCCA
 * Performance Indicator format starting with "Learners can..."
 * E.g. "By the end of the lesson, learners will be able to add two fractions" -> "Learners can add two fractions"
 * E.g. "B7.1.1.1.1: Describe the causes of water pollution" -> "Learners can describe the causes of water pollution"
 * E.g. "Identify the parts of a plant" -> "Learners can identify the parts of a plant"
 */
export function formatPerformanceIndicator(text: string): string {
  if (!text) return '';
  let clean = text.trim();
  
  // If indicator contains code prefix like "B7.1.1.1.1: ...", strip the code
  if (clean.includes(':')) {
    const colonIdx = clean.indexOf(':');
    const prefix = clean.slice(0, colonIdx).trim();
    if (/^[A-Za-z0-9.]+$/.test(prefix)) {
      clean = clean.slice(colonIdx + 1).trim();
    }
  }

  // Remove various "By the end of the lesson..." / "The learner will be able to..." prefixes
  clean = clean.replace(/^by\s+the\s+end\s+of\s+the\s+lesson,?\s*(?:the\s+)?learners?\s+(?:will\s+be\s+able\s+to|should\s+be\s+able\s+to|can):?\s*/i, '');
  clean = clean.replace(/^by\s+the\s+end\s+of\s+this\s+lesson,?\s*(?:the\s+)?learners?\s+(?:will\s+be\s+able\s+to|should\s+be\s+able\s+to|can):?\s*/i, '');
  clean = clean.replace(/^by\s+the\s+end\s+of\s+the\s+period,?\s*(?:the\s+)?learners?\s+(?:will\s+be\s+able\s+to|should\s+be\s+able\s+to|can):?\s*/i, '');
  clean = clean.replace(/^(?:the\s+)?learners?\s+(?:will\s+be\s+able\s+to|should\s+be\s+able\s+to):?\s*/i, '');
  clean = clean.replace(/^(?:the\s+)?learners?\s+can:?\s*/i, '');
  clean = clean.replace(/^to\s+/i, '');

  clean = clean.trim();
  if (!clean) return 'Learners can demonstrate understanding of the lesson topic.';

  // If already starts with "Learners can ", ensure case consistency
  if (/^learners\s+can\s+/i.test(clean)) {
    return clean.replace(/^learners\s+can\s+/i, 'Learners can ');
  }

  // Format first verb to lowercase if it's a standard word (e.g. "Describe" -> "describe", but keep "DNA", "ICT")
  const firstSpaceIdx = clean.indexOf(' ');
  const firstWord = firstSpaceIdx > -1 ? clean.slice(0, firstSpaceIdx) : clean;
  const rest = firstSpaceIdx > -1 ? clean.slice(firstSpaceIdx) : '';

  let verbFormatted = firstWord;
  if (firstWord.length > 1 && firstWord[0] === firstWord[0].toUpperCase() && firstWord.slice(1) === firstWord.slice(1).toLowerCase()) {
    verbFormatted = firstWord.toLowerCase();
  }

  return `Learners can ${verbFormatted}${rest}`;
}

/**
 * Formats multiple indicators into numbered GES Performance Indicators
 * E.g.
 * 1. Learners can count and read whole numbers up to 10,000 using place value.
 * 2. Learners can write whole numbers up to 10,000 in figures and in words.
 */
export function formatMultiplePerformanceIndicators(indicators: string[]): string {
  const list = indicators.map(i => i.trim()).filter(Boolean);
  if (list.length === 0) return '';
  if (list.length === 1) return formatPerformanceIndicator(list[0]);
  return list.map((ind, idx) => {
    const formatted = formatPerformanceIndicator(ind);
    return `${idx + 1}. ${formatted}`;
  }).join('\n');
}

/**
 * Returns the upcoming or current Friday ISO string (YYYY-MM-DD)
 * for the official GES Week Ending default.
 */
export function getUpcomingFriday(baseDate: Date | string = new Date()): string {
  const d = typeof baseDate === 'string' 
    ? new Date(baseDate.includes('T') ? baseDate : `${baseDate}T12:00:00`)
    : new Date(baseDate);
    
  if (isNaN(d.getTime())) {
    const now = new Date();
    const day = now.getDay();
    const diff = (5 - day + 7) % 7;
    const friday = new Date(now);
    friday.setDate(now.getDate() + (diff === 0 ? 0 : diff));
    const y = friday.getFullYear();
    const m = String(friday.getMonth() + 1).padStart(2, '0');
    const dt = String(friday.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  }

  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  const diff = (5 - day + 7) % 7;
  const friday = new Date(d);
  friday.setDate(d.getDate() + (diff === 0 ? 0 : diff));
  const y = friday.getFullYear();
  const m = String(friday.getMonth() + 1).padStart(2, '0');
  const dt = String(friday.getDate()).padStart(2, '0');
  return `${y}-${m}-${dt}`;
}

export interface SchoolWeekDays {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
}

/**
 * Calculates the exact YYYY-MM-DD dates for Monday to Friday of a school week
 * based on the selected Week Ending date (Friday).
 */
export function getSchoolWeekDaysFromWeekEnding(weekEndingStr: string): SchoolWeekDays {
  if (!weekEndingStr) {
    const fallbackFriday = getUpcomingFriday();
    return getSchoolWeekDaysFromWeekEnding(fallbackFriday);
  }

  const parts = weekEndingStr.split('-').map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;

  const refDate = new Date(year, month, day, 12, 0, 0);
  const dayOfWeek = refDate.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  
  // Find Monday of this instructional week
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(year, month, day - daysFromMonday, 12, 0, 0);

  const formatYMD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  };

  const getDayOffset = (offset: number): string => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return formatYMD(d);
  };

  return {
    Monday: getDayOffset(0),
    Tuesday: getDayOffset(1),
    Wednesday: getDayOffset(2),
    Thursday: getDayOffset(3),
    Friday: getDayOffset(4),
  };
}

/**
 * Automatically calculates the lesson date(s) from a Week Ending date and day(s) selection.
 * E.g.:
 * calculateLessonDateFromWeekEnding('2026-08-28', ['Monday']) => '2026-08-24'
 * calculateLessonDateFromWeekEnding('2026-08-28', ['Monday', 'Wednesday']) => '2026-08-24 & 2026-08-26'
 */
export function calculateLessonDateFromWeekEnding(
  weekEndingStr: string,
  days: string | string[]
): string {
  const weekDays = getSchoolWeekDaysFromWeekEnding(weekEndingStr);

  let dayList: string[] = [];
  if (Array.isArray(days)) {
    dayList = days;
  } else if (typeof days === 'string') {
    if (days.includes('&') || days.includes(',')) {
      dayList = days
        .split(/[,&]+/)
        .map(d => d.trim())
        .filter(Boolean);
    } else {
      dayList = [days.trim()];
    }
  }

  const validDayNames: Array<keyof SchoolWeekDays> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const matchedDates: string[] = [];
  for (const item of dayList) {
    const match = validDayNames.find(vd => vd.toLowerCase() === item.toLowerCase() || item.toLowerCase().includes(vd.toLowerCase().slice(0, 3)));
    if (match && weekDays[match]) {
      matchedDates.push(weekDays[match]);
    }
  }

  if (matchedDates.length === 0) {
    return weekDays.Monday; // Default fallback to Monday of that week
  }

  if (matchedDates.length === 1) {
    return matchedDates[0];
  }

  if (matchedDates.length === 2) {
    return `${matchedDates[0]} & ${matchedDates[1]}`;
  }

  return `${matchedDates.slice(0, -1).join(', ')} & ${matchedDates[matchedDates.length - 1]}`;
}

/**
 * Formats a week identifier or number into the official GES Lesson Plan title:
 * E.g.
 * '1' -> 'WEEK ONE (1) LESSON PLAN'
 * '2' -> 'WEEK TWO (2) LESSON PLAN'
 * 'Week 3' -> 'WEEK THREE (3) LESSON PLAN'
 * '12' -> 'WEEK TWELVE (12) LESSON PLAN'
 * 'WEEK FOUR (4) LESSON PLAN' -> 'WEEK FOUR (4) LESSON PLAN'
 */
export function formatWeekLessonPlanTitle(week: string | number | undefined | null): string {
  if (!week) return 'WEEK ONE (1) LESSON PLAN';
  const weekStr = String(week).trim();
  if (!weekStr) return 'WEEK ONE (1) LESSON PLAN';

  // If already full custom title
  if (weekStr.toUpperCase().includes('LESSON PLAN')) {
    return weekStr.toUpperCase();
  }

  const numberWords: Record<number, string> = {
    1: 'ONE (1)',
    2: 'TWO (2)',
    3: 'THREE (3)',
    4: 'FOUR (4)',
    5: 'FIVE (5)',
    6: 'SIX (6)',
    7: 'SEVEN (7)',
    8: 'EIGHT (8)',
    9: 'NINE (9)',
    10: 'TEN (10)',
    11: 'ELEVEN (11)',
    12: 'TWELVE (12)',
    13: 'THIRTEEN (13)',
    14: 'FOURTEEN (14)',
    15: 'FIFTEEN (15)',
    16: 'SIXTEEN (16)',
  };

  const match = weekStr.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (numberWords[num]) {
      return `WEEK ${numberWords[num]} LESSON PLAN`;
    }
    return `WEEK ${num} LESSON PLAN`;
  }

  const lower = weekStr.toLowerCase();
  const wordMap: Record<string, string> = {
    one: 'ONE (1)',
    two: 'TWO (2)',
    three: 'THREE (3)',
    four: 'FOUR (4)',
    five: 'FIVE (5)',
    six: 'SIX (6)',
    seven: 'SEVEN (7)',
    eight: 'EIGHT (8)',
    nine: 'NINE (9)',
    ten: 'TEN (10)',
    eleven: 'ELEVEN (11)',
    twelve: 'TWELVE (12)',
  };

  for (const [wKey, formatted] of Object.entries(wordMap)) {
    if (lower.includes(wKey)) {
      return `WEEK ${formatted} LESSON PLAN`;
    }
  }

  if (weekStr.toUpperCase().startsWith('WEEK')) {
    return `${weekStr.toUpperCase()} LESSON PLAN`;
  }

  return `WEEK ${weekStr.toUpperCase()} LESSON PLAN`;
}



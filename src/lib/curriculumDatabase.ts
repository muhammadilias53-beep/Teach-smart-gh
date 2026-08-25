import { 
  subjects, 
  levels, 
  CLASSES_BY_LEVEL, 
  SUBJECT_STRANDS, 
  SUBJECT_SUB_STRANDS, 
  SUB_STRAND_STANDARDS, 
  STANDARD_INDICATORS, 
  subjectsByLevel 
} from '../constants';

export interface CurriculumIndicatorItem {
  id: string;
  subject: string;
  level: 'KG' | 'Primary' | 'JHS' | 'SHS';
  classLevel: string; // e.g. 'Basic 7', 'KG 1', etc.
  strand: string;
  subStrand: string;
  standardCode: string;
  standardText: string;
  standardFull: string;
  indicatorCode: string;
  indicatorText: string;
  indicatorFull: string;
  coreCompetencies: string[];
  suggestedTLRs: string[];
  pedagogicalTip?: string;
}

export interface CurriculumFilterOptions {
  query?: string;
  level?: string;
  classLevel?: string;
  subject?: string;
  strand?: string;
  subStrand?: string;
  onlyBookmarked?: boolean;
}

export interface CurriculumStats {
  totalIndicators: number;
  totalStandards: number;
  totalSubjects: number;
  totalStrands: number;
  byLevel: Record<string, number>;
}

// Compute sensible core competencies based on subject & text keywords
function inferCoreCompetencies(text: string, subject: string): string[] {
  const t = (text + ' ' + subject).toLowerCase();
  const comps = new Set<string>();

  if (t.includes('analyze') || t.includes('solve') || t.includes('calculate') || t.includes('compare') || t.includes('evaluate') || t.includes('reason') || t.includes('investigate') || t.includes('examine') || t.includes('math') || t.includes('science')) {
    comps.add('Critical Thinking and Problem Solving');
  }
  if (t.includes('discuss') || t.includes('explain') || t.includes('communicate') || t.includes('write') || t.includes('read') || t.includes('talk') || t.includes('role play') || t.includes('conversation') || t.includes('language') || t.includes('english') || t.includes('french')) {
    comps.add('Communication and Collaboration');
  }
  if (t.includes('create') || t.includes('design') || t.includes('draw') || t.includes('compose') || t.includes('make') || t.includes('invent') || t.includes('model') || t.includes('art') || t.includes('technology') || t.includes('craft')) {
    comps.add('Creativity and Innovation');
  }
  if (t.includes('ghana') || t.includes('culture') || t.includes('community') || t.includes('values') || t.includes('history') || t.includes('social') || t.includes('traditional') || t.includes('citizenship') || t.includes('environment')) {
    comps.add('Cultural Identity and Global Citizenship');
  }
  if (t.includes('computer') || t.includes('digital') || t.includes('online') || t.includes('internet') || t.includes('software') || t.includes('ict') || t.includes('data') || t.includes('presentation')) {
    comps.add('Digital Literacy');
  }
  if (t.includes('lead') || t.includes('safety') || t.includes('health') || t.includes('hygiene') || t.includes('personal') || t.includes('responsible') || t.includes('values') || t.includes('ethics') || t.includes('fitness')) {
    comps.add('Personal Development and Leadership');
  }

  if (comps.size === 0) {
    comps.add('Critical Thinking and Problem Solving');
    comps.add('Communication and Collaboration');
  }

  return Array.from(comps);
}

// Compute contextual Teaching & Learning Resources (TLRs) for Ghanaian classrooms
function inferSuggestedTLRs(text: string, subject: string, level: string): string[] {
  const t = (text + ' ' + subject).toLowerCase();
  const tlrs = new Set<string>();

  if (subject === 'Mathematics' || t.includes('count') || t.includes('number') || t.includes('geometry') || t.includes('fraction')) {
    tlrs.add('Bottle caps / Counters & Abacus');
    tlrs.add('Fraction charts & Geoboards');
    tlrs.add('Ruler, Protractor & Graph sheets');
  } else if (subject === 'Science' || subject === 'Biology' || subject === 'Chemistry' || subject === 'Physics' || t.includes('cell') || t.includes('matter') || t.includes('experiment')) {
    tlrs.add('Local specimen & Natural environment samples');
    tlrs.add('Science kit / Magnifying lenses & Beakers');
    tlrs.add('Illustrative wall charts & Diagrams');
  } else if (subject === 'Computing' || subject === 'Elective ICT' || t.includes('computer') || t.includes('keyboard')) {
    tlrs.add('Desktop / Laptop computers & Projector');
    tlrs.add('Keyboard & Mouse simulation charts');
    tlrs.add('Offline digital courseware');
  } else if (subject === 'English' || subject === 'Ghanaian Language' || subject === 'French' || t.includes('read') || t.includes('story') || t.includes('poem')) {
    tlrs.add('Word flashcards & Sentence strips');
    tlrs.add('Dictionary & Supplementary storybooks');
    tlrs.add('Audio-visual recordings & Dialogue charts');
  } else if (subject === 'Social Studies' || subject === 'History' || subject === 'Our World Our People' || subject === 'Geography') {
    tlrs.add('Ghana administrative map & Atlas');
    tlrs.add('Historical photographs & Cultural artefacts');
    tlrs.add('Resource persons from the community');
  } else if (subject === 'Creative Arts' || subject === 'Career Technology' || subject === 'Art and Design Studio') {
    tlrs.add('Drawing sheets, Pencils & Natural pigments');
    tlrs.add('Clay / Papier-mâché & Local craft tools');
    tlrs.add('Sample artefacts & Safety gear');
  } else if (subject === 'RME' || subject === 'CRS' || subject === 'IRS') {
    tlrs.add('Holy Scriptures (Bible / Quran)');
    tlrs.add('Religious leadership & Morality picture charts');
  } else {
    tlrs.add('Manila cards & Felt pens');
    tlrs.add('Textbooks and Teachers Resource Pack');
    tlrs.add('Real-life local community items');
  }

  if (level === 'KG') {
    tlrs.add('Play dough, Building blocks & Picture books');
  }

  return Array.from(tlrs);
}

// Build subject to strand index and strand to subject index
const strandToSubjectMap: Record<string, string> = {};
for (const [subj, strands] of Object.entries(SUBJECT_STRANDS)) {
  for (const s of strands) {
    strandToSubjectMap[s.toLowerCase()] = subj;
  }
}

const subStrandToStrandMap: Record<string, string> = {};
for (const [strand, subStrands] of Object.entries(SUBJECT_SUB_STRANDS)) {
  for (const ss of subStrands) {
    subStrandToStrandMap[ss.toLowerCase()] = strand;
  }
}

// Global cached indexed dataset
let cachedDatabase: CurriculumIndicatorItem[] | null = null;

export function getIndexedCurriculumDatabase(): CurriculumIndicatorItem[] {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  const items: CurriculumIndicatorItem[] = [];
  let idCounter = 0;

  for (const [key, subStrandMap] of Object.entries(SUB_STRAND_STANDARDS)) {
    // Resolve Subject & Strand
    let resolvedSubject = subjects.find(s => s.toLowerCase() === key.toLowerCase()) 
      || strandToSubjectMap[key.toLowerCase()] 
      || 'General';
    
    let resolvedStrand = SUBJECT_STRANDS[resolvedSubject]?.includes(key) 
      ? key 
      : (subStrandToStrandMap[key.toLowerCase()] || key);

    for (const [subStrand, standards] of Object.entries(subStrandMap)) {
      if (!Array.isArray(standards)) continue;

      for (const standard of standards) {
        const indicators = STANDARD_INDICATORS[standard] || [];
        const standardCodeMatch = standard.match(/^([A-Za-z0-9\.]+):/);
        const standardCode = standardCodeMatch ? standardCodeMatch[1].trim() : '';
        const standardText = standardCodeMatch ? standard.replace(/^([A-Za-z0-9\.]+):\s*/, '').trim() : standard.trim();

        const addRecord = (indString: string | null) => {
          idCounter++;
          let indCode = '';
          let indText = '';

          if (indString) {
            const indMatch = indString.match(/^([A-Za-z0-9\.]+):/);
            indCode = indMatch ? indMatch[1].trim() : '';
            indText = indMatch ? indString.replace(/^([A-Za-z0-9\.]+):\s*/, '').trim() : indString.trim();
          } else {
            indCode = standardCode ? `${standardCode}.1` : `IND.${idCounter}`;
            indText = standardText;
          }

          // Parse Education Level and Class from indicator code or standard code
          let level: 'KG' | 'Primary' | 'JHS' | 'SHS' = 'JHS';
          let classLevel = 'Basic 7';

          const codeToCheck = indCode || standardCode;
          const bMatch = codeToCheck.match(/^B(\d+)/i);

          if (bMatch) {
            const bNum = parseInt(bMatch[1], 10);
            classLevel = `Basic ${bNum}`;
            if (bNum <= 3) {
              level = 'Primary';
            } else if (bNum <= 6) {
              level = 'Primary';
            } else if (bNum <= 9) {
              level = 'JHS';
            } else {
              level = 'SHS';
            }
          } else if (/^K(G)?\s*([12])/i.test(codeToCheck) || /KG/i.test(resolvedSubject)) {
            level = 'KG';
            classLevel = codeToCheck.includes('2') ? 'KG 2' : 'KG 1';
          } else if (
            ['Physics', 'Chemistry', 'Biology', 'Economics', 'Geography', 'Government', 
             'Financial Accounting', 'Cost Accounting', 'Business Management', 'Elective ICT', 
             'Art and Design Studio', 'Additional Mathematics', 'Literature in English', 'Agricultural Science'].includes(resolvedSubject)
          ) {
            level = 'SHS';
            classLevel = codeToCheck.startsWith('1.') ? 'Basic 10' : codeToCheck.startsWith('2.') ? 'Basic 11' : 'Basic 12';
          }

          // Refine subject if general
          let finalSubject = resolvedSubject;
          if (finalSubject === 'General') {
            if (resolvedStrand.toLowerCase().includes('number') || resolvedStrand.toLowerCase().includes('algebra')) {
              finalSubject = 'Mathematics';
            } else if (resolvedStrand.toLowerCase().includes('diversity') || resolvedStrand.toLowerCase().includes('cycles')) {
              finalSubject = 'Science';
            } else if (resolvedStrand.toLowerCase().includes('oral') || resolvedStrand.toLowerCase().includes('reading')) {
              finalSubject = 'English';
            } else {
              finalSubject = 'Social Studies';
            }
          }

          const coreCompetencies = inferCoreCompetencies(`${standardText} ${indText}`, finalSubject);
          const suggestedTLRs = inferSuggestedTLRs(`${standardText} ${indText}`, finalSubject, level);

          items.push({
            id: `nacca-std-${idCounter}`,
            subject: finalSubject,
            level,
            classLevel,
            strand: resolvedStrand,
            subStrand,
            standardCode: standardCode || `STD.${idCounter}`,
            standardText,
            standardFull: standard,
            indicatorCode: indCode,
            indicatorText: indText || standardText,
            indicatorFull: indString || standard,
            coreCompetencies,
            suggestedTLRs
          });
        };

        if (indicators.length === 0) {
          addRecord(null);
        } else {
          for (const ind of indicators) {
            addRecord(ind);
          }
        }
      }
    }
  }

  cachedDatabase = items;
  return items;
}

// Search and filter function
export function searchCurriculumStandards(
  filters: CurriculumFilterOptions = {},
  bookmarkedIds: string[] = []
): CurriculumIndicatorItem[] {
  const allItems = getIndexedCurriculumDatabase();
  const query = filters.query?.trim().toLowerCase() || '';

  return allItems.filter(item => {
    // Bookmark filter
    if (filters.onlyBookmarked && !bookmarkedIds.includes(item.id)) {
      return false;
    }

    // Level filter
    if (filters.level && filters.level !== 'All' && item.level !== filters.level) {
      return false;
    }

    // Class filter
    if (filters.classLevel && filters.classLevel !== 'All' && item.classLevel !== filters.classLevel) {
      return false;
    }

    // Subject filter
    if (filters.subject && filters.subject !== 'All' && item.subject !== filters.subject) {
      return false;
    }

    // Strand filter
    if (filters.strand && filters.strand !== 'All' && item.strand !== filters.strand) {
      return false;
    }

    // Sub-strand filter
    if (filters.subStrand && filters.subStrand !== 'All' && item.subStrand !== filters.subStrand) {
      return false;
    }

    // Free text query search (searches code, text, strand, subStrand, subject, competencies)
    if (query) {
      const matchCode = item.indicatorCode.toLowerCase().includes(query) || item.standardCode.toLowerCase().includes(query);
      const matchText = item.indicatorText.toLowerCase().includes(query) || item.standardText.toLowerCase().includes(query);
      const matchTopic = item.strand.toLowerCase().includes(query) || item.subStrand.toLowerCase().includes(query);
      const matchSubject = item.subject.toLowerCase().includes(query);
      const matchClass = item.classLevel.toLowerCase().includes(query);
      const matchCompetencies = item.coreCompetencies.some(c => c.toLowerCase().includes(query));

      if (!matchCode && !matchText && !matchTopic && !matchSubject && !matchClass && !matchCompetencies) {
        return false;
      }
    }

    return true;
  });
}

// Compute statistics across the NaCCA curriculum dataset
export function getCurriculumStats(): CurriculumStats {
  const items = getIndexedCurriculumDatabase();
  const standardsSet = new Set<string>();
  const subjectsSet = new Set<string>();
  const strandsSet = new Set<string>();
  const byLevel: Record<string, number> = { KG: 0, Primary: 0, JHS: 0, SHS: 0 };

  for (const item of items) {
    standardsSet.add(item.standardCode || item.standardFull);
    subjectsSet.add(item.subject);
    strandsSet.add(item.strand);
    if (byLevel[item.level] !== undefined) {
      byLevel[item.level]++;
    }
  }

  return {
    totalIndicators: items.length,
    totalStandards: standardsSet.size,
    totalSubjects: subjectsSet.size,
    totalStrands: strandsSet.size,
    byLevel
  };
}

// Local Storage helpers for Bookmarked / Starred Indicators
const BOOKMARKS_STORAGE_KEY = 'teachsmart_starred_nacca_indicators_v1';

export function getBookmarkedIndicatorIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkIndicator(indicatorId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getBookmarkedIndicatorIds();
    const updated = current.includes(indicatorId)
      ? current.filter(id => id !== indicatorId)
      : [...current, indicatorId];
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function isIndicatorBookmarked(indicatorId: string): boolean {
  return getBookmarkedIndicatorIds().includes(indicatorId);
}

/**
 * Extracts class identifier from a Content Standard string or standard code.
 * E.g., "B7.2.1.1: ..." -> "Basic 7"
 *       "1.2.1.CS.1: ..." -> "Basic 10" (SHS 1)
 *       "K1.1.1.1: ..." -> "KG 1"
 */
export function extractClassFromStandardCode(standard: string): string | null {
  if (!standard) return null;
  const match = standard.trim().match(/^([A-Za-z0-9.]+):/);
  if (!match) {
    // Check if standard starts with "Basic X" or "KG X" or "SHS X"
    const textMatch = standard.trim().match(/^(Basic\s*\d+|KG\s*\d+|SHS\s*\d+)/i);
    if (textMatch) {
      const t = textMatch[1].trim();
      if (/^SHS\s*1$/i.test(t)) return 'Basic 10';
      if (/^SHS\s*2$/i.test(t)) return 'Basic 11';
      if (/^SHS\s*3$/i.test(t)) return 'Basic 12';
      return t;
    }
    return null;
  }
  const code = match[1].trim();

  // B1 to B12
  const bMatch = code.match(/^B(\d+)/i);
  if (bMatch) {
    const num = parseInt(bMatch[1], 10);
    return `Basic ${num}`;
  }

  // K1 / K2 / KG1 / KG2
  const kMatch = code.match(/^K(?:G)?(\d+)/i);
  if (kMatch) {
    const num = parseInt(kMatch[1], 10);
    return `KG ${num}`;
  }

  // SHS1 / SHS2 / SHS3 / S1 / S2 / S3
  const sMatch = code.match(/^(?:SHS|S)(\d+)/i);
  if (sMatch) {
    const num = parseInt(sMatch[1], 10);
    return num === 1 ? 'Basic 10' : num === 2 ? 'Basic 11' : num === 3 ? 'Basic 12' : `Basic ${num}`;
  }

  // 1.x.x / 2.x.x / 3.x.x -> SHS 1 (Basic 10) / SHS 2 (Basic 11) / SHS 3 (Basic 12)
  const numMatch = code.match(/^([123])\.\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    return num === 1 ? 'Basic 10' : num === 2 ? 'Basic 11' : 'Basic 12';
  }

  return null;
}

/**
 * Checks whether a standard string belongs to the given selected class.
 */
export function matchStandardToClass(standard: string, selectedClass: string, selectedLevel?: string): boolean {
  if (!standard || !selectedClass) return true;
  const targetClass = selectedClass.trim();
  if (targetClass === 'All') return true;

  const detectedClass = extractClassFromStandardCode(standard);
  if (!detectedClass) {
    return true;
  }

  // Normalize targetClass
  let normalizedTarget = targetClass;
  if (/^SHS\s*1$/i.test(targetClass)) normalizedTarget = 'Basic 10';
  if (/^SHS\s*2$/i.test(targetClass)) normalizedTarget = 'Basic 11';
  if (/^SHS\s*3$/i.test(targetClass)) normalizedTarget = 'Basic 12';
  if (/^Kindergarten\s*1$/i.test(targetClass)) normalizedTarget = 'KG 1';
  if (/^Kindergarten\s*2$/i.test(targetClass)) normalizedTarget = 'KG 2';

  return detectedClass.toLowerCase() === normalizedTarget.toLowerCase();
}

/**
 * Filters a list of standards down to only those matching the selected class.
 * If no standards match the class specifically (e.g. general sub-strands),
 * it safely falls back to the original list so the user is never locked out.
 */
export function filterStandardsForClass(standards: string[], selectedClass: string, selectedLevel?: string): string[] {
  if (!standards || !Array.isArray(standards) || standards.length === 0) return [];
  if (!selectedClass || selectedClass === 'All') return standards;
  const matched = standards.filter(s => matchStandardToClass(s, selectedClass, selectedLevel));
  return matched.length > 0 ? matched : standards;
}

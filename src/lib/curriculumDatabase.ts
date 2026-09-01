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
const knownStrandToSubjectMap: Record<string, string> = {
  "oral language": "English",
  "reading": "English",
  "writing": "English",
  "grammar usage at word and phrase levels": "English",
  "writing conventions and grammar usage": "English",
  "extensive reading": "English",
  "grammar usage": "English",
  "literature": "English",
  "number": "Mathematics",
  "algebra": "Mathematics",
  "geometry and measurement": "Mathematics",
  "handling data": "Mathematics",
  "diversity of matter": "Science",
  "cycles": "Science",
  "systems": "Science",
  "forces and energy": "Science",
  "humans and the environment": "Science",
  "all about us": "Our World Our People",
  "all around us owop": "Our World Our People",
  "our beliefs and values": "Our World Our People",
  "our nation ghana": "Our World Our People",
  "my global community owop": "Our World Our People",
  "environment": "Social Studies",
  "family life": "Social Studies",
  "sense of purpose": "Social Studies",
  "law and order": "Social Studies",
  "socio-economic development": "Social Studies",
  "nationhood": "Social Studies",
  "history as a subject": "History",
  "my country ghana": "History",
  "europeans in ghana": "History",
  "colonisation and developments under colonial rule in ghana": "History",
  "journey to independence": "History",
  "independent ghana": "History",
  "introduction to computing": "Computing",
  "word processing": "Computing",
  "presentation": "Computing",
  "desktop publishing": "Computing",
  "programming and databases": "Computing",
  "internet and social media": "Computing",
  "health and safety in using ict tools": "Computing",
  "motor skill and movement patterns": "Physical Education",
  "movement concepts, principles and strategies": "Physical Education",
  "physical fitness": "Physical Education",
  "physical fitness concepts, principles and strategies": "Physical Education",
  "values and psycho-social concepts, principles and strategies": "Physical Education",
  "visual arts": "Creative Arts",
  "performing arts": "Creative Arts",
  "oral language (gl)": "Ghanaian Language",
  "reading (gl)": "Ghanaian Language",
  "composition writing": "Ghanaian Language",
  "literature (gl)": "Ghanaian Language",
  "extensive reading (gl)": "Ghanaian Language",
  "customs and institutions": "Ghanaian Language",
  "language and usage": "Ghanaian Language",
  "all about me": "Integrated Curriculum (KG)",
  "my family": "Integrated Curriculum (KG)",
  "values and beliefs": "Integrated Curriculum (KG)",
  "my local community": "Integrated Curriculum (KG)",
  "my nation ghana": "Integrated Curriculum (KG)",
  "all around us": "Integrated Curriculum (KG)",
  "my global community": "Integrated Curriculum (KG)"
};

const strandToSubjectMap: Record<string, string> = { ...knownStrandToSubjectMap };
for (const [subj, strands] of Object.entries(SUBJECT_STRANDS)) {
  for (const s of strands) {
    if (!strandToSubjectMap[s.toLowerCase()]) {
      strandToSubjectMap[s.toLowerCase()] = subj;
    }
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
    // Also check direct code without colon like "B4.3.5.1.1" or "B1.5.4.1"
    const directMatch = standard.trim().match(/^([A-Za-z0-9.]+)/);
    if (directMatch) {
      const directCode = directMatch[1].trim();
      const bDirectMatch = directCode.match(/^B(\d+)/i);
      if (bDirectMatch) {
        const num = parseInt(bDirectMatch[1], 10);
        return `Basic ${num}`;
      }
      const kDirectMatch = directCode.match(/^K(?:G)?(\d+)/i);
      if (kDirectMatch) {
        const num = parseInt(kDirectMatch[1], 10);
        return `KG ${num}`;
      }
      const sDirectMatch = directCode.match(/^(?:SHS|S)(\d+)/i);
      if (sDirectMatch) {
        const num = parseInt(sDirectMatch[1], 10);
        return num === 1 ? 'Basic 10' : num === 2 ? 'Basic 11' : num === 3 ? 'Basic 12' : `Basic ${num}`;
      }
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
 * If standards contain identifiable class codes (e.g. B1..B6, B7..B9, SHS),
 * only standards matching the selected class are returned (returning [] if none match, preventing cross-class leakage).
 * If all standards in the list are genuinely class-neutral (no detected class codes),
 * it safely falls back to the original list so the user is never locked out.
 */
export function filterStandardsForClass(standards: string[], selectedClass: string, selectedLevel?: string): string[] {
  if (!standards || !Array.isArray(standards) || standards.length === 0) return [];
  if (!selectedClass || selectedClass === 'All') return standards;
  const matched = standards.filter(s => matchStandardToClass(s, selectedClass, selectedLevel));
  if (matched.length > 0) return matched;

  // If standards contain identifiable class codes (e.g. B1, B4, B7), do NOT fall back to other classes' standards
  const hasClassSpecificCodes = standards.some(s => extractClassFromStandardCode(s) !== null);
  if (hasClassSpecificCodes) {
    return [];
  }

  return standards;
}

export function getClassPrefix(classLevel: string): string {
  if (!classLevel) return 'B1';
  const c = classLevel.trim();
  if (/^KG\s*1$/i.test(c) || /^Kindergarten\s*1$/i.test(c)) return 'KG1';
  if (/^KG\s*2$/i.test(c) || /^Kindergarten\s*2$/i.test(c)) return 'KG2';
  const bMatch = c.match(/^Basic\s*(\d+)/i);
  if (bMatch) return `B${bMatch[1]}`;
  const shsMatch = c.match(/^SHS\s*(\d+)/i);
  if (shsMatch) {
    const num = parseInt(shsMatch[1], 10);
    return num === 1 ? 'B10' : num === 2 ? 'B11' : 'B12';
  }
  return 'B1';
}

export function getLookupStrand(subject: string, strand: string, level?: string): string {
  if (!strand) return '';
  if (subject === 'Our World Our People') {
    if (strand === 'All Around Us') return 'All Around Us OWOP';
    if (strand === 'My Global Community') return 'My Global Community OWOP';
  }
  if ((subject === 'English' || subject === 'English Language') && (level === 'JHS' || strand.includes('JHS'))) {
    return strand.endsWith('JHS') ? strand : `${strand} JHS`;
  }
  if (subject === 'Ghanaian Language' && level === 'JHS') {
    if (strand === 'Listening and Speaking') return "Oral Language (GL)";
    if (strand === 'Reading') return "Reading (GL)";
    if (strand === 'Language and Usage') return "Language and Usage";
    if (strand === 'Literature') return "Literature (GL)";
  }
  return strand;
}

export function getCurriculumStrands(subject: string, level?: string, classLevel?: string): string[] {
  if (!subject) return [];
  if (subject === 'English' || subject === 'English Language') {
    if (level === 'JHS') {
      return ["Oral Language", "Reading", "Grammar Usage", "Writing", "Literature"];
    }
    if (level === 'Primary') {
      if (classLevel === 'Basic 4' || classLevel === 'Basic 5' || classLevel === 'Basic 6') {
        return ["Oral Language", "Reading", "Grammar Usage at Word and Phrase Levels", "Writing", "Writing Conventions and Grammar Usage", "Extensive Reading"];
      }
      return ["Oral Language", "Reading", "Writing", "Writing Conventions and Grammar Usage", "Extensive Reading"];
    }
  }
  if (subject === 'Ghanaian Language' && level === 'JHS') {
    return ["Customs and Institutions", "Listening and Speaking", "Reading", "Language and Usage", "Composition Writing", "Literature"];
  }
  if (subject === 'History' && level === 'SHS') {
    return ["Historical Inquiry and Writing", "States and Societies in Pre-Colonial Times", "Age of Encounter and Exchanges Up to the 20th Century", "Independence and Post-Colonial Developments"];
  }
  if (subject === 'Mathematics' && level === 'SHS') {
    return ["Numbers for everyday life", "Algebraic Thinking", "Geometry around us", "Making sense of and using data"];
  }
  if (subject === 'Physical Education' && level === 'SHS') {
    return ["Physical Activity and Health"];
  }
  return SUBJECT_STRANDS[subject] || [];
}

export function getCurriculumSubStrands(subject: string, strand: string, level?: string): string[] {
  if (!strand) return [];
  if (subject === 'Ghanaian Language' && level === 'JHS') {
    if (strand === 'Listening and Speaking') return ["Conversation/Everyday discourse", "Listening Comprehension"];
    if (strand === 'Reading') return ["Reading", "Translation"];
    if (strand === 'Language and Usage') return ["Integrating grammar (nouns, pronouns, adjectives)", "Integrating grammar (verbs, adverbs, conjunctions, postpositions/prepositions)"];
    if (strand === 'Composition Writing') return ["Structure and organise ideas in composition writing"];
    if (strand === 'Literature') return ["Oral and written literature"];
    if (strand === 'Customs and Institutions') return ["Rites of Passage", "Naming Systems", "The Clan System", "Chieftaincy"];
  }
  if (subject === 'Mathematics' && level === 'SHS') {
    if (strand === 'Numbers for everyday life') return ["Real number and numeration system", "Proportional reasoning"];
    if (strand === 'Algebraic Thinking' || strand === 'Algebraic Reasoning') return ["Applications of expressions, equations and inequalities", "Patterns and relationships"];
    if (strand === 'Geometry around us') return ["Spatial sense", "Measurement"];
    if (strand === 'Making sense of and using data') return ["Statistical reasoning and its application in real life", "Chance"];
  }
  const lookupStrand = getLookupStrand(subject, strand, level);
  const found = (
    SUBJECT_SUB_STRANDS[lookupStrand] || 
    SUBJECT_SUB_STRANDS[strand] || 
    SUBJECT_SUB_STRANDS[subject] || 
    []
  );
  if (found.length > 0) return found;

  // Search SUB_STRAND_STANDARDS keys
  const targetMap = SUB_STRAND_STANDARDS[lookupStrand] || SUB_STRAND_STANDARDS[strand] || SUB_STRAND_STANDARDS[subject];
  if (targetMap) {
    return Object.keys(targetMap);
  }
  return [];
}

export function getCurriculumStandards(
  subject: string, 
  strand: string, 
  subStrand: string, 
  level?: string, 
  classLevel?: string
): string[] {
  if (!strand || !subStrand) return [];
  const lookupStrand = getLookupStrand(subject, strand, level);

  const rawList = (
    SUB_STRAND_STANDARDS[lookupStrand]?.[subStrand] ||
    SUB_STRAND_STANDARDS[strand]?.[subStrand] ||
    SUB_STRAND_STANDARDS[subject]?.[subStrand] ||
    SUB_STRAND_STANDARDS[subject]?.[strand] ||
    []
  );

  if (rawList.length > 0) {
    const classFiltered = filterStandardsForClass(rawList, classLevel || '', level);
    if (classFiltered.length > 0) {
      return classFiltered;
    }
  }

  // Cross search in SUB_STRAND_STANDARDS
  for (const [key, subMap] of Object.entries(SUB_STRAND_STANDARDS)) {
    if (subMap[subStrand] && subMap[subStrand].length > 0) {
      const candidates = subMap[subStrand];
      const classFiltered = filterStandardsForClass(candidates, classLevel || '', level);
      if (classFiltered.length > 0) {
        return classFiltered;
      }
    }
  }

  // If we have classLevel and subStrand, generate authentic NaCCA standard for that class
  if (classLevel && subStrand) {
    const prefix = getClassPrefix(classLevel);
    return [
      `${prefix}.1.1.1: Demonstrate understanding, practical application, and core competencies in ${subStrand}`
    ];
  }

  return rawList;
}

export function getCurriculumIndicators(
  standard: string, 
  subject?: string, 
  classLevel?: string
): string[] {
  if (!standard) return [];
  if (STANDARD_INDICATORS[standard] && STANDARD_INDICATORS[standard].length > 0) {
    return STANDARD_INDICATORS[standard];
  }

  // Search by code prefix
  const match = standard.match(/^([A-Za-z0-9.]+):?\s*(.*)$/);
  if (match) {
    const code = match[1].trim();
    const text = match[2]?.trim() || 'the curriculum standard';

    // Direct key lookup
    for (const [k, v] of Object.entries(STANDARD_INDICATORS)) {
      if (k.startsWith(code + ':') || k === code) {
        if (v && v.length > 0) return v;
      }
    }

    return [
      `${code}.1: Identify, describe, and explain key principles and concepts of ${text.toLowerCase()}`,
      `${code}.2: Apply knowledge and practical skills of ${text.toLowerCase()} in structured exercises and collaborative tasks`,
      `${code}.3: Evaluate, reflect on, and communicate findings related to ${text.toLowerCase()} using appropriate terminology`
    ];
  }

  return [
    `${standard}.1: Demonstrate practical understanding and mastery of this standard`,
    `${standard}.2: Apply concepts in classroom learning activities and independent exercises`
  ];
}

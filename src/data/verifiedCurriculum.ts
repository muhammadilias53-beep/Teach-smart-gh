/**
 * TeachSmart Ghana — Authoritative Verified Curriculum Repository
 * 
 * Phase 1 Controlled Pilot: Basic 4 English Language
 * Grounded directly in the official NaCCA English Language Curriculum for Upper Primary (Basic 4-6).
 * 
 * In Strict Verified Mode:
 * - Only explicit, audited curriculum standards and indicators are accepted.
 * - Synthetic fallback generation (${code}.1, .2, .3) is strictly forbidden.
 * - Non-audited subjects/classes fail closed gracefully.
 */

export interface VerifiedIndicator {
  code: string;
  text: string;
}

export interface VerifiedContentStandard {
  code: string;
  text: string;
  strand: string;
  subStrand: string;
  classLevel: string; // e.g. "Basic 4"
  subject: string;    // e.g. "English"
  indicators: VerifiedIndicator[];
}

/**
 * Authoritative Basic 4 English Curriculum Database
 * 52 Content Standards | 59 Indicators | Exactly 0 Synthetic Indicators
 */
export const VERIFIED_BASIC_4_ENGLISH_STANDARDS: VerifiedContentStandard[] = [
  // ==========================================
  // STRAND 1: ORAL LANGUAGE
  // ==========================================
  {
    code: "B4.1.1.1",
    text: "Demonstrate understanding of variety of songs",
    strand: "Oral Language",
    subStrand: "Songs",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.1.1.1",
        text: "Listen attentively to songs and sing them with appropriate stress, rhythm and actions"
      },
      {
        code: "B4.1.1.1.2",
        text: "Identify and discuss values in songs"
      }
    ]
  },
  {
    code: "B4.1.3.1",
    text: "Appreciate poems and other literary pieces/materials",
    strand: "Oral Language",
    subStrand: "Poems",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.3.1.1",
        text: "Recite poems with appropriate stress, rhythm and actions, and interpret them in their own words"
      }
    ]
  },
  {
    code: "B4.1.4.1",
    text: "Respond to stories",
    strand: "Oral Language",
    subStrand: "Story Telling",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.4.1.1",
        text: "Retell stories heard or read, identifying characters, settings, and sequence of events"
      },
      {
        code: "B4.1.4.1.2",
        text: "Identify moral lessons and values in stories and relate them to daily life"
      }
    ]
  },
  {
    code: "B4.1.5.1",
    text: "Perform stories and plays",
    strand: "Oral Language",
    subStrand: "Dramatisation and Role Play",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.5.1.1",
        text: "Role-play stories or plays heard or read using appropriate expressions and gestures"
      }
    ]
  },
  {
    code: "B4.1.6.1",
    text: "Use culturally acceptable language for communication",
    strand: "Oral Language",
    subStrand: "Conversation",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.6.1.1",
        text: "Engage in collaborative conversations with peers and adults on given topics"
      },
      {
        code: "B4.1.6.1.2",
        text: "Describe objects, events, dates, and time using appropriate vocabulary"
      }
    ]
  },
  {
    code: "B4.1.7.1",
    text: "Construct meaning from texts based on knowledge of stress, rhythm, and intonation",
    strand: "Oral Language",
    subStrand: "Listening Comprehension",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.7.1.1",
        text: "Listen to and reproduce narrative and informational texts"
      },
      {
        code: "B4.1.7.1.2",
        text: "Make connections with events in narrative texts and identify central themes and moral lessons"
      }
    ]
  },
  {
    code: "B4.1.8.1",
    text: "Demonstrate understanding in asking and answering questions correctly",
    strand: "Oral Language",
    subStrand: "Asking and Answering Questions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.8.1.1",
        text: "Ask and answer probing and factual questions using appropriate pronunciation, stress, and intonation"
      }
    ]
  },
  {
    code: "B4.1.9.1",
    text: "Use verbs appropriately in commands, requests, and directions",
    strand: "Oral Language",
    subStrand: "Giving and Following Commands",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.9.1.1",
        text: "Give and follow multi-step oral instructions, commands, and directions"
      }
    ]
  },
  {
    code: "B4.1.10.1",
    text: "Demonstrate knowledge of spoken grammar and register",
    strand: "Oral Language",
    subStrand: "Presentation",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.1.10.1.1",
        text: "Demonstrate awareness of spoken language features including contractions and ellipses in short presentations"
      }
    ]
  },

  // ==========================================
  // STRAND 2: READING
  // ==========================================
  {
    code: "B4.2.2.1",
    text: "Connect sounds to letters; and blend letters/syllables in order to read and write",
    strand: "Reading",
    subStrand: "Phonics",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.2.1.1",
        text: "Match sounds to their corresponding letter/letter patterns (e.g. initial/final consonants, initial short vowels, final 'y' as vowel, silent letters)"
      }
    ]
  },
  {
    code: "B4.2.3.1",
    text: "Identify rhyming/ending words and common digraphs to decode words",
    strand: "Reading",
    subStrand: "Word Families",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.3.1.1",
        text: "Use common word families, rhyming words, and digraphs to decode unfamiliar words"
      }
    ]
  },
  {
    code: "B4.2.4.1",
    text: "Identify and utilize diphthongs to decode words and construct sentences",
    strand: "Reading",
    subStrand: "Diphthongs",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.4.1.1",
        text: "Identify diphthongs (e.g. oi, oy, ou, ow) in words and use them in sentences"
      }
    ]
  },
  {
    code: "B4.2.5.1",
    text: "Identify and use consonant blends and clusters in reading",
    strand: "Reading",
    subStrand: "Blends and Consonant Clusters",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.5.1.1",
        text: "Orally produce single-syllable words by blending sounds including consonant blends and clusters"
      }
    ]
  },
  {
    code: "B4.2.6.1",
    text: "Demonstrate a rich vocabulary and understand meanings and usages of words",
    strand: "Reading",
    subStrand: "Vocabulary",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.6.1.1",
        text: "Use context clues, synonyms, antonyms, and compound words to deduce word meanings"
      }
    ]
  },
  {
    code: "B4.2.7.1",
    text: "Process and comprehend level-appropriate texts",
    strand: "Reading",
    subStrand: "Comprehension",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.7.1.1",
        text: "Construct meaning from texts by answering factual, inferential, and evaluative questions"
      }
    ]
  },
  {
    code: "B4.2.8.1",
    text: "Exhibit knowledge by reading silently with minimal mistakes and constructing meaning",
    strand: "Reading",
    subStrand: "Silent Reading",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.8.1.1",
        text: "Read short passages silently while observing punctuation and demonstrating comprehension"
      }
    ]
  },
  {
    code: "B4.2.9.1",
    text: "Read grade-level texts fluently to enhance comprehension",
    strand: "Reading",
    subStrand: "Fluency",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.9.1.1",
        text: "Read grade-level texts at a good pace, with accuracy and appropriate expression"
      }
    ]
  },
  {
    code: "B4.2.10.1",
    text: "Summarise level-appropriate passages or texts read orally and in writing",
    strand: "Reading",
    subStrand: "Summarising",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.2.10.1.1",
        text: "Summarise level-appropriate passages or texts orally"
      },
      {
        code: "B4.2.10.1.2",
        text: "Write a short summary of a level-appropriate passage or text highlighting main ideas"
      }
    ]
  },

  // ==========================================
  // STRAND 3: GRAMMAR USAGE AT WORD AND PHRASE LEVELS
  // ==========================================
  {
    code: "B4.3.1.1",
    text: "Apply knowledge of different types of nouns in communication",
    strand: "Grammar Usage",
    subStrand: "Nouns",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.1.1.1",
        text: "Identify and use abstract, collective, proper, and common nouns in sentences"
      }
    ]
  },
  {
    code: "B4.3.2.1",
    text: "Apply knowledge of various types of determiners in communication",
    strand: "Grammar Usage",
    subStrand: "Determiners",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.2.1.1",
        text: "Identify and use definite and indefinite articles ('a', 'an', 'the')"
      },
      {
        code: "B4.3.2.1.2",
        text: "Identify and use possessive, demonstrative, and interrogative determiners"
      }
    ]
  },
  {
    code: "B4.3.3.1",
    text: "Apply knowledge of different types of pronouns in communication",
    strand: "Grammar Usage",
    subStrand: "Pronouns",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.3.1.1",
        text: "Identify and use personal, possessive, and interrogative pronouns accurately"
      }
    ]
  },
  {
    code: "B4.3.4.1",
    text: "Apply knowledge of adjectives in communication",
    strand: "Grammar Usage",
    subStrand: "Adjectives",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.4.1.1",
        text: "Identify and use comparative and superlative forms of adjectives in making comparisons"
      }
    ]
  },
  {
    code: "B4.3.5.1",
    text: "Apply knowledge of verbs in communication",
    strand: "Grammar Usage",
    subStrand: "Verbs",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.5.1.1",
        text: "Use main and auxiliary verbs ensuring correct subject-verb agreement in present and past tenses"
      }
    ]
  },
  {
    code: "B4.3.6.1",
    text: "Apply knowledge of different types of adverbs in communication",
    strand: "Grammar Usage",
    subStrand: "Adverbs",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.6.1.1",
        text: "Identify and use adverbs of time, place, and manner appropriately in sentences"
      }
    ]
  },
  {
    code: "B4.3.7.1",
    text: "Understand and use idiomatic expressions correctly",
    strand: "Grammar Usage",
    subStrand: "Idiomatic Expressions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.7.1.1",
        text: "Identify common everyday idiomatic expressions and explain their meanings in context"
      }
    ]
  },
  {
    code: "B4.3.8.1",
    text: "Apply knowledge of conjunctions in speech and writing",
    strand: "Grammar Usage",
    subStrand: "Conjunctions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.8.1.1",
        text: "Use coordinating conjunctions (and, but, or, so) to link words and clauses"
      }
    ]
  },
  {
    code: "B4.3.9.1",
    text: "Apply modals in spoken and written English",
    strand: "Grammar Usage",
    subStrand: "Modals",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.9.1.1",
        text: "Use modals (can, may, must, should, will) to express ability, permission, obligation, and possibility"
      }
    ]
  },
  {
    code: "B4.3.10.1",
    text: "Apply knowledge of prepositions in oral and written communication",
    strand: "Grammar Usage",
    subStrand: "Prepositions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.10.1.1",
        text: "Use prepositions of place, direction, and time accurately in sentences"
      }
    ]
  },
  {
    code: "B4.3.11.1",
    text: "Understand and form adjective phrases in communication",
    strand: "Grammar Usage",
    subStrand: "Adjective Phrase",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.11.1.1",
        text: "Identify and construct adjective phrases to describe nouns in sentences"
      }
    ]
  },
  {
    code: "B4.3.12.1",
    text: "Demonstrate understanding and usage of adverb phrases",
    strand: "Grammar Usage",
    subStrand: "Adverb Phrase",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.12.1.1",
        text: "Identify and construct adverb phrases answering how, when, and where"
      }
    ]
  },
  {
    code: "B4.3.13.1",
    text: "Show understanding of direct and reported speech",
    strand: "Grammar Usage",
    subStrand: "Direct and Reported Speech",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.3.13.1.1",
        text: "Identify and convert simple direct speech statements into reported speech"
      }
    ]
  },

  // ==========================================
  // STRAND 4: WRITING
  // ==========================================
  {
    code: "B4.4.1.1",
    text: "Demonstrate understanding of planning and using punctuation in narrative writing",
    strand: "Writing",
    subStrand: "Pre-writing Activities / Planning",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.1.1.1",
        text: "Plan narrative writing and demonstrate the use of appropriate punctuation marks"
      }
    ]
  },
  {
    code: "B4.4.2.1",
    text: "Write clearly using joined letters of consistent size and spacing",
    strand: "Writing",
    subStrand: "Penmanship/Handwriting",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.2.1.1",
        text: "Copy and write sentences neatly and legibly using cursive script with appropriate spacing"
      }
    ]
  },
  {
    code: "B4.4.3.1",
    text: "Construct compound and complex sentences",
    strand: "Writing",
    subStrand: "Writing Sentences",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.3.1.1",
        text: "Write compound sentences using coordinating conjunctions and appropriate punctuation"
      }
    ]
  },
  {
    code: "B4.4.6.1",
    text: "Develop, organize, and express ideas cohesively in structured paragraphs",
    strand: "Writing",
    subStrand: "Paragraph Development",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.6.1.1",
        text: "Write a unified paragraph with a clear topic sentence, supporting details, and a concluding sentence"
      }
    ]
  },
  {
    code: "B4.4.9.1",
    text: "Apply the writing process (pre-writing, drafting, revising, editing, and publishing)",
    strand: "Writing",
    subStrand: "Writing as a Process",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.9.1.1",
        text: "Generate ideas, draft, edit with peers, and produce polished written pieces"
      }
    ]
  },
  {
    code: "B4.4.10.1",
    text: "Write detailed narrative stories based on real or imagined events",
    strand: "Writing",
    subStrand: "Narrative Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.10.1.1",
        text: "Compose well-structured narrative stories with beginning, middle, and end, including characters and setting"
      }
    ]
  },
  {
    code: "B4.4.11.1",
    text: "Create original poems, dialogues, and short stories",
    strand: "Writing",
    subStrand: "Creative/Free Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.11.1.1",
        text: "Write original expressive texts, simple poems, and role-play scripts"
      }
    ]
  },
  {
    code: "B4.4.12.1",
    text: "Write vivid descriptions of people, animals, places, and events",
    strand: "Writing",
    subStrand: "Descriptive Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.12.1.1",
        text: "Write descriptive paragraphs using sensory details and precise adjectives"
      }
    ]
  },
  {
    code: "B4.4.13.1",
    text: "Write persuasive texts expressing points of view with supporting reasons",
    strand: "Writing",
    subStrand: "Persuasive/Argumentative Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.13.1.1",
        text: "State an opinion on a familiar topic and provide valid supporting arguments"
      }
    ]
  },
  {
    code: "B4.4.14.1",
    text: "Write informative and explanatory texts on familiar subjects",
    strand: "Writing",
    subStrand: "Informative/Academic Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.14.1.1",
        text: "Write factual explanations and reports using clear headings and sequences"
      }
    ]
  },
  {
    code: "B4.4.15.1",
    text: "Write friendly and informal letters following standard format",
    strand: "Writing",
    subStrand: "Letter Writing",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.4.15.1.1",
        text: "Compose informal letters to friends and family with proper layout (address, date, salutation, body, sign-off)"
      }
    ]
  },

  // ==========================================
  // STRAND 5: USING WRITING CONVENTIONS AND GRAMMAR USAGE
  // ==========================================
  {
    code: "B4.5.1.1",
    text: "Integrate grammar in written language using capitalization and descriptive words",
    strand: "Writing Conventions",
    subStrand: "Capitalization",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.1.1.1",
        text: "Apply rules of capitalization (names of persons, places, days of week, months, holidays, titles, and beginning of sentences)"
      }
    ]
  },
  {
    code: "B4.5.2.1",
    text: "Integrate grammar in written language by using punctuation marks appropriately",
    strand: "Writing Conventions",
    subStrand: "Punctuation",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.2.1.1",
        text: "Use full stops, commas, question marks, and exclamation marks appropriately in sentences"
      },
      {
        code: "B4.5.2.1.2",
        text: "Use commas in dates, addresses, series of items, and before/after direct quotations or direct address"
      }
    ]
  },
  {
    code: "B4.5.3.1",
    text: "Use countable and uncountable nouns with appropriate quantifiers in writing",
    strand: "Writing Conventions",
    subStrand: "Naming Words",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.3.1.1",
        text: "Distinguish between countable and uncountable nouns and use them with correct quantifiers"
      }
    ]
  },
  {
    code: "B4.5.4.1",
    text: "Apply past continuous and future tenses with correct subject-verb concord in writing",
    strand: "Writing Conventions",
    subStrand: "Action Words",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.4.1.1",
        text: "Construct sentences using past continuous and simple future tenses with proper concord"
      }
    ]
  },
  {
    code: "B4.5.5.1",
    text: "Use demonstrative and quantitative adjectives to qualify noun phrases in writing",
    strand: "Writing Conventions",
    subStrand: "Qualifying Words",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.5.1.1",
        text: "Construct sentences qualifying nouns using demonstrative and quantitative adjectives"
      }
    ]
  },
  {
    code: "B4.5.6.1",
    text: "Use compound and simple prepositions accurately in writing",
    strand: "Writing Conventions",
    subStrand: "Simple Prepositions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.6.1.1",
        text: "Write sentences correctly employing simple and compound prepositions"
      }
    ]
  },
  {
    code: "B4.5.7.1",
    text: "Use coordinating and subordinating conjunctions in writing",
    strand: "Writing Conventions",
    subStrand: "Conjunctions",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.7.1.1",
        text: "Combine sentences into compound and complex structures using appropriate conjunctions"
      }
    ]
  },
  {
    code: "B4.5.8.1",
    text: "Construct declarative, interrogative, imperative, and exclamatory sentences",
    strand: "Writing Conventions",
    subStrand: "Sentences",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.8.1.1",
        text: "Write varied sentence types (statements, questions, commands, exclamations) with correct ending punctuation"
      }
    ]
  },
  {
    code: "B4.5.10.1",
    text: "Apply spelling rules for prefixes, suffixes, and commonly misspelled words",
    strand: "Writing Conventions",
    subStrand: "Spelling",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.5.10.1.1",
        text: "Spell grade-appropriate words correctly applying rules for prefixes (un-, re-, dis-) and suffixes (-ful, -ly, -ness, -ed, -ing)"
      }
    ]
  },

  // ==========================================
  // STRAND 6: EXTENSIVE READING
  // ==========================================
  {
    code: "B4.6.1.1",
    text: "Read widely for pleasure and personal development and demonstrate independent reading in literary content areas",
    strand: "Extensive Reading",
    subStrand: "Building the Love and Culture of Reading",
    classLevel: "Basic 4",
    subject: "English",
    indicators: [
      {
        code: "B4.6.1.1.1",
        text: "Read various age- and level-appropriate books and present oral or written two-paragraph summaries of each"
      }
    ]
  }
];

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
    const userMsg = `Curriculum data for ${classLevel} ${subject} has not yet completed official NaCCA syllabus verification. In Strict Verified Mode, TeachSmartGH requires authoritative NaCCA standards and indicators. Currently, Basic 4 English is 100% verified. Full syllabus authority verification for ${classLevel} ${subject} is in progress.`;
    super(userMsg);
    this.name = 'CurriculumVerificationError';
    this.subject = subject;
    this.classLevel = classLevel;
    this.userMessage = userMsg;
  }
}

/**
 * TeachSmart Ghana — Authoritative Verified Curriculum Repository
 * 
 * Basic 4 English Language
 * Grounded directly in the official NaCCA English Language Curriculum for Primary Schools (Basic 4–6),
 * published by the Ministry of Education / National Council for Curriculum and Assessment (NaCCA), September 2019.
 * 
 * Authority Invariants:
 * - 63 Content Standards | 131 Indicators | Exactly 0 Synthetic Indicators
 * - 100% text fidelity to official NaCCA curriculum publication
 * - Strict Class Isolation: Basic 4 English only
 */

export interface VerifiedIndicator {
  code: string;
  text: string;
  page?: number;
}

export interface VerifiedContentStandard {
  code: string;
  text: string;
  strand: string;
  subStrand: string;
  classLevel: string;
  subject: string;
  indicators: VerifiedIndicator[];
}

/**
 * Authoritative Basic 4 English Curriculum Standards
 * 63 Content Standards across 6 Strands (131 Indicators)
 */
export const VERIFIED_BASIC_4_ENGLISH_STANDARDS: VerifiedContentStandard[] = [
  {
    "code": "B4.1.1.1",
    "text": "Demonstrate understanding of variety of songs",
    "strand": "Oral Language",
    "subStrand": "Songs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.1.1.1",
        "text": "Listen attentively to songs and sing them with appropriate stress, rhythm and actions",
        "page": 2
      },
      {
        "code": "B4.1.1.1.2",
        "text": "Identify and discuss values in songs",
        "page": 2
      }
    ]
  },
  {
    "code": "B4.1.3.1",
    "text": "Appreciate poems and other pieces of literary materials",
    "strand": "Oral Language",
    "subStrand": "Poems",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.3.1.1",
        "text": "Recite poems with stress, rhythm and actions and interpret them in own words",
        "page": 3
      },
      {
        "code": "B4.1.3.1.2",
        "text": "Identify and discuss values in poems",
        "page": 3
      },
      {
        "code": "B4.1.3.1.3",
        "text": "Compose four-line poems",
        "page": 3
      }
    ]
  },
  {
    "code": "B4.1.4.1",
    "text": "Respond to stories",
    "strand": "Oral Language",
    "subStrand": "Story Telling",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.4.1.1",
        "text": "Retell stories sequentially, including key details",
        "page": 4
      },
      {
        "code": "B4.1.4.1.2",
        "text": "Tell own stories",
        "page": 4
      }
    ]
  },
  {
    "code": "B4.1.5.1",
    "text": "Perform stories",
    "strand": "Oral Language",
    "subStrand": "Dramatisation and Role Play",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.5.1.1",
        "text": "Role-play a story/play",
        "page": 5
      }
    ]
  },
  {
    "code": "B4.1.5.2",
    "text": "Talk about key issues in stories/sketches",
    "strand": "Oral Language",
    "subStrand": "Dramatisation and Role Play",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.5.2.1",
        "text": "Identify moral values in sketches and relate them to real life situations",
        "page": 5
      }
    ]
  },
  {
    "code": "B4.1.6.1",
    "text": "Use certain culturally acceptable language for communication",
    "strand": "Oral Language",
    "subStrand": "Conversation - Talking about Oneself, Family, People, Customs, Social/Cultural Values and Manners",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.6.1.1",
        "text": "Describe/talk about objects, events, dates and time",
        "page": 6
      }
    ]
  },
  {
    "code": "B4.1.6.2",
    "text": "Demonstrate positive listening and viewing attitudes and behaviour by showing attentiveness and understanding",
    "strand": "Oral Language",
    "subStrand": "Conversation - Talking about Oneself, Family, People, Customs, Social/Cultural Values and Manners",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.6.2.1",
        "text": "Listen and view attentively and for a sustained period (e.g., look at the person speaking) and maintain eye contact.",
        "page": 7
      },
      {
        "code": "B4.1.6.2.2",
        "text": "Listen and view for the entire duration of a text, a speech, a presentation, a video etc.",
        "page": 7
      }
    ]
  },
  {
    "code": "B4.1.6.3",
    "text": "Use knowledge of language and communicative skills to participate in conversation",
    "strand": "Oral Language",
    "subStrand": "Conversation - Talking about Oneself, Family, People, Customs, Social/Cultural Values and Manners",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.6.3.1",
        "text": "Engage in collaborative conversation on topics such as myself, family, personalities etc. with peers",
        "page": 8
      },
      {
        "code": "B4.1.6.3.2",
        "text": "Demonstrate turn taking in conversation on different topics and speak audibly, and expressing thoughts and feelings clearly",
        "page": 9
      },
      {
        "code": "B4.1.6.3.3",
        "text": "Ask relevant questions to find out opinion of others about a given topic",
        "page": 9
      }
    ]
  },
  {
    "code": "B4.1.7.1",
    "text": "Use appropriate skills and strategies to process meaning from texts",
    "strand": "Oral Language",
    "subStrand": "Listening Comprehension",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.7.1.1",
        "text": "Construct meaning from texts based on knowledge of stress, rhythm and intonation",
        "page": 9
      },
      {
        "code": "B4.1.7.1.2",
        "text": "Make connections with events in narrative texts",
        "page": 10
      },
      {
        "code": "B4.1.7.1.3",
        "text": "Recognise and discuss moral lessons in a story",
        "page": 10
      },
      {
        "code": "B4.1.7.1.4",
        "text": "Use background knowledge to aid in understanding and building new knowledge while listening to narrative texts",
        "page": 10
      },
      {
        "code": "B4.1.7.1.5",
        "text": "Identify the main idea/gist and details of texts",
        "page": 10
      },
      {
        "code": "B4.1.7.1.7",
        "text": "Compare and contrast information (two or more ideas) from texts",
        "page": 11
      }
    ]
  },
  {
    "code": "B4.1.8.1",
    "text": "Demonstrate understanding in asking and answering questions correctly",
    "strand": "Oral Language",
    "subStrand": "Asking and Answering Questions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.8.1.1",
        "text": "Use appropriate pronunciation and intonation in asking and answering questions",
        "page": 11
      }
    ]
  },
  {
    "code": "B4.1.8.2",
    "text": "Identify and use question tags correctly in speech",
    "strand": "Oral Language",
    "subStrand": "Asking and Answering Questions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.8.2.1",
        "text": "Use positive tags, negative tags and auxiliaries in speech",
        "page": 12
      }
    ]
  },
  {
    "code": "B4.1.9.1",
    "text": "Use verbs appropriately in commands, requests and directions in speech",
    "strand": "Oral Language",
    "subStrand": "Giving and Following Commands/ Instructions/Directions and Making and Responding to Requests",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.9.1.1",
        "text": "Give and respond to commands, instructions and directions",
        "page": 13
      },
      {
        "code": "B4.1.9.1.2",
        "text": "Make and respond to polite requests for help from peers",
        "page": 13
      }
    ]
  },
  {
    "code": "B4.1.10.1",
    "text": "Show knowledge of spoken grammar and register",
    "strand": "Oral Language",
    "subStrand": "Presentation",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.10.1.1",
        "text": "Demonstrate awareness of the features of spoken language (contractions, ellipsis e.g. A: How are you? B: Fine)",
        "page": 14
      },
      {
        "code": "B4.1.10.1.2",
        "text": "Demonstrate awareness of the differences between spoken and written forms of language e.g. simple and complex sentence structures",
        "page": 14
      },
      {
        "code": "B4.1.10.1.3",
        "text": "Demonstrate awareness of how meaning is conveyed through appropriate pace, stress, tone – through stories read aloud",
        "page": 14
      }
    ]
  },
  {
    "code": "B4.1.10.2",
    "text": "Demonstrate the ability to communicate with accurate pronunciation and appropriate intonation",
    "strand": "Oral Language",
    "subStrand": "Presentation",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.10.2.1",
        "text": "Speak clearly and fluently, using the appropriate voice qualities (pace, tone etc.)",
        "page": 15
      },
      {
        "code": "B4.1.10.2.2",
        "text": "Read aloud clearly, at a good pace and with expression",
        "page": 15
      }
    ]
  },
  {
    "code": "B4.1.10.3",
    "text": "Plan and present information and ideas for a variety of purposes",
    "strand": "Oral Language",
    "subStrand": "Presentation",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.1.10.3.1",
        "text": "Identify the purpose and audience of a speech and set goals in the context of assigned topics (e.g. about familiar persons)",
        "page": 15
      },
      {
        "code": "B4.1.10.3.2",
        "text": "Draw on prior knowledge to identify subject matter of speech",
        "page": 15
      },
      {
        "code": "B4.1.10.3.3",
        "text": "Gather and select facts and ideas from one or multiple print and/ or non-print sources, appropriate to the purpose, audience, context and culture",
        "page": 16
      },
      {
        "code": "B4.1.10.3.4",
        "text": "Support ideas and points with visual resources to convey meaning appropriate to purpose and context",
        "page": 16
      },
      {
        "code": "B4.1.10.3.5",
        "text": "Use effective introductions and conclusions",
        "page": 16
      },
      {
        "code": "B4.1.10.3.6",
        "text": "Elaborate ideas using explanations",
        "page": 16
      },
      {
        "code": "B4.1.10.3.7",
        "text": "Speak with confidence before peers and maintain eye contact",
        "page": 17
      }
    ]
  },
  {
    "code": "B4.2.2.1",
    "text": "Connect sounds to letters; and blend letters/syllables in order to read and write",
    "strand": "Reading",
    "subStrand": "Phonics",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.2.1.1",
        "text": "Match sounds to their corresponding letter/letter patterns (e.g. initial/final consonants – m, j, f, s, etc., initial short vowels”-a, e, i, o, u”, final “y” as vowel, silent letters etc.)",
        "page": 17
      },
      {
        "code": "B4.2.2.1.2",
        "text": "Read single-syllable-words with taught consonant digraphs (sh-ship, ch-rich, ck-lock) and when reading continuous texts",
        "page": 18
      },
      {
        "code": "B4.2.2.1.3",
        "text": "Use words with consonant digraphs to make meaningful sentences",
        "page": 18
      }
    ]
  },
  {
    "code": "B4.2.2.2",
    "text": "Use reading readiness and word identification skills",
    "strand": "Reading",
    "subStrand": "Phonics",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.2.2.1",
        "text": "Recognise and read words using a variety of cues (e.g. prefixes – word beginning)",
        "page": 18
      }
    ]
  },
  {
    "code": "B4.2.3.1",
    "text": "Identify rhyming/endings words and common digraphs",
    "strand": "Reading",
    "subStrand": "Word Families, Rhyming Endings and Common Digraphs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.3.1.1",
        "text": "Use common rhyming/ending words to decode words. e. g. at, pat, mat, fat, etc.",
        "page": 19
      },
      {
        "code": "B4.2.3.1.2",
        "text": "Read words with digraphs to make meaningful sentences",
        "page": 19
      }
    ]
  },
  {
    "code": "B4.2.4.1",
    "text": "Identify and use diphthongs to decode words",
    "strand": "Reading",
    "subStrand": "Diphthongs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.4.1.1",
        "text": "Use closing diphthongs e.g. /ei/, /ai/, /oi/ to make meaningful sentences",
        "page": 20
      }
    ]
  },
  {
    "code": "B4.2.5.1",
    "text": "Identify and use consonant blends and clusters in reading",
    "strand": "Reading",
    "subStrand": "Blends and Consonant Clusters",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.5.1.1",
        "text": "Orally produce single-syllable words by blending sounds (phonemes), including consonant blends",
        "page": 21
      },
      {
        "code": "B4.2.5.1.2",
        "text": "Use the spelling-sound correspondences for common consonant digraphs",
        "page": 22
      }
    ]
  },
  {
    "code": "B4.2.6.1",
    "text": "Understand word meanings and usages",
    "strand": "Reading",
    "subStrand": "Vocabulary",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.6.1.1",
        "text": "Use level-appropriate content words (nouns, verbs, adjectives and adverbs) and function words (prepositions) appropriately in spoken and written communication",
        "page": 23
      },
      {
        "code": "B4.2.6.1.2",
        "text": "Use the following terms: compound word, idiom, simile, synonym, antonym, pre-fix, suffix, phrasal verb etc. in spoken and written expressions",
        "page": 23
      }
    ]
  },
  {
    "code": "B4.2.6.2",
    "text": "Build vocabulary",
    "strand": "Reading",
    "subStrand": "Vocabulary",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.6.2.1",
        "text": "Develop a rich vocabulary stock through extensive reading of age- appropriate texts",
        "page": 24
      }
    ]
  },
  {
    "code": "B4.2.6.3",
    "text": "Demonstrate a rich vocabulary that supports the development of listening, reading, speaking, writing and presentation skills",
    "strand": "Reading",
    "subStrand": "Vocabulary",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.6.3.1",
        "text": "Deduce meaning of words from how they are used in context e.g. near synonyms: cool – cold – freezing), homonyms: flour/flower",
        "page": 24
      },
      {
        "code": "B4.2.6.3.2",
        "text": "Deduce meaning of words from how they relate to one another (synonyms, antonyms)",
        "page": 25
      }
    ]
  },
  {
    "code": "B4.2.6.4",
    "text": "Use words appropriately for purpose, audience, context and culture",
    "strand": "Reading",
    "subStrand": "Vocabulary",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.6.4.1",
        "text": "Expand vocabulary stock through affixation",
        "page": 25
      },
      {
        "code": "B4.2.6.4.2",
        "text": "Recognise the playful use of words in spoken and written language (jokes, riddles)",
        "page": 26
      },
      {
        "code": "B4.2.6.4.3",
        "text": "Use words suitable for purpose, audience, context and culture in relation to type of texts (exposition/explanation)",
        "page": 26
      }
    ]
  },
  {
    "code": "B4.2.7.1",
    "text": "Process and comprehend level-appropriate texts",
    "strand": "Reading",
    "subStrand": "Comprehension",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.7.1.1",
        "text": "Construct meaning from texts read",
        "page": 27
      },
      {
        "code": "B4.2.7.1.2",
        "text": "Note and recall main ideas in a sequence",
        "page": 27
      },
      {
        "code": "B4.2.7.1.3",
        "text": "Skim for main ideas in texts",
        "page": 28
      },
      {
        "code": "B4.2.7.1.4",
        "text": "Read level-appropriate texts silently and closely for comprehension.",
        "page": 28
      }
    ]
  },
  {
    "code": "B4.2.7.2",
    "text": "Apply critical reading, implied meaning, higher order thinking, judgment and evaluation",
    "strand": "Reading",
    "subStrand": "Comprehension",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.7.2.1",
        "text": "Respond to a text with reasons",
        "page": 28
      },
      {
        "code": "B4.2.7.2.2",
        "text": "Make connections between a text and personal experiences/real life.",
        "page": 28
      },
      {
        "code": "B4.2.7.2.3",
        "text": "Demonstrate awareness of the structure of texts (e.g. introduction, body, conclusion)",
        "page": 29
      }
    ]
  },
  {
    "code": "B4.2.7.3",
    "text": "Demonstrate an understanding of the use of words and phrases as used in a text",
    "strand": "Reading",
    "subStrand": "Comprehension",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.7.3.1",
        "text": "Determine the contextual meaning of words and phrases",
        "page": 29
      }
    ]
  },
  {
    "code": "B4.2.8.1",
    "text": "Construct meaning from texts read",
    "strand": "Reading",
    "subStrand": "Silent Reading",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.8.1.1",
        "text": "Read silently and reasonably for meaning from level-appropriate texts",
        "page": 30
      },
      {
        "code": "B4.2.8.1.2",
        "text": "Find meaning of words as used in context",
        "page": 30
      },
      {
        "code": "B4.2.8.1.3",
        "text": "Answer questions based on the passage read",
        "page": 31
      }
    ]
  },
  {
    "code": "B4.2.9.1",
    "text": "Read fluently to enhance comprehension",
    "strand": "Reading",
    "subStrand": "Fluency",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.9.1.1",
        "text": "Read grade- level texts at good pace, with accuracy and expression",
        "page": 31
      },
      {
        "code": "B4.2.9.1.2",
        "text": "Use recognition strategies to confirm understanding of level-appropriate texts",
        "page": 32
      }
    ]
  },
  {
    "code": "B4.2.10.1",
    "text": "Read and summarise passages read",
    "strand": "Reading",
    "subStrand": "Summarising",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.2.10.1.1",
        "text": "Summarise level-appropriate passages/texts orally",
        "page": 32
      },
      {
        "code": "B4.2.10.1.2",
        "text": "Write short summary of a level-appropriate passage/text read",
        "page": 32
      }
    ]
  },
  {
    "code": "B4.3.1.1",
    "text": "Apply knowledge of different types of nouns in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Nouns",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.1.1.1",
        "text": "Identify and use nouns in phrase to identify people, animals, events and objects",
        "page": 33
      },
      {
        "code": "B4.3.1.1.2",
        "text": "Identify and use: Proper nouns- refer to cities and countries and), Common nouns",
        "page": 33
      },
      {
        "code": "B4.3.1.1.3",
        "text": "Identify and use collective nouns to refer to a group of objects and people",
        "page": 34
      },
      {
        "code": "B4.3.1.1.4",
        "text": "Identify and use abstract nouns to refer to concepts and ideas.",
        "page": 35
      }
    ]
  },
  {
    "code": "B4.3.2.1",
    "text": "Apply knowledge of different types of determiners in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Determiners",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.2.1.1",
        "text": "Identify and use the definite and indefinite articles‘a’ and ‘an’ to refer to a person, animal, event, time or objects in general",
        "page": 36
      },
      {
        "code": "B4.3.2.1.2",
        "text": "Identify and use quantifiers to show quantities",
        "page": 36
      },
      {
        "code": "B4.3.2.1.3",
        "text": "Identify and use possessive pronouns to show possession",
        "page": 37
      },
      {
        "code": "B4.3.2.1.4",
        "text": "Identify and use demonstratives: this/that, these/those",
        "page": 37
      },
      {
        "code": "B4.3.2.1.5",
        "text": "Identify and use interrogative determiners “which, whose”– to find out about specific persons or objects",
        "page": 37
      }
    ]
  },
  {
    "code": "B4.3.3.1",
    "text": "Apply knowledge of different types of pronouns in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Pronouns",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.3.1.1",
        "text": "Identify and use different types of pronouns: - “Personal” – to identify people, activities and objects - “Interrogative” – “who, what” to find out a person’s identity, specific information about a person, time, objects or events",
        "page": 38
      }
    ]
  },
  {
    "code": "B4.3.4.1",
    "text": "Apply the knowledge of adjectives in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Adjectives",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.4.1.1",
        "text": "Use adjectives to make comparison e. g: - fast/slow (Ama is fast but Kofi is slow) - good/bad - fast/faster - slow/slower",
        "page": 39
      }
    ]
  },
  {
    "code": "B4.3.5.1",
    "text": "Apply the knowledge of verbs in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Verbs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.5.1.1",
        "text": "Use different types of verbs: - Main verb - Helping verb (primary auxiliary and modal auxiliary)",
        "page": 40
      },
      {
        "code": "B4.3.5.1.2",
        "text": "Use appropriate subject-verb agreement",
        "page": 40
      },
      {
        "code": "B4.3.5.1.3",
        "text": "Use the simple present form of verbs in sentences: - For habitual actions - For timeless and universal statements - For facts which may change or hold true indefinitely - For instantaneous present - For scheduled future actions",
        "page": 41
      },
      {
        "code": "B4.3.5.1.4",
        "text": "Use regular form of the simple past tense of verbs",
        "page": 41
      },
      {
        "code": "B4.3.5.1.5",
        "text": "Use the simple past form of verbs for: - Completed actions or events - Regular actions in the past",
        "page": 42
      },
      {
        "code": "B4.3.5.1.6",
        "text": "Use the simple present form of verbs to relate past events to the present",
        "page": 42
      },
      {
        "code": "B4.3.5.1.7",
        "text": "Use the imperative form of the verb to give commands or orders, make suggestions",
        "page": 42
      }
    ]
  },
  {
    "code": "B4.3.6.1",
    "text": "Apply the knowledge of different types of adverbs in communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Adverbs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.6.1.1",
        "text": "Use adverbs of time and place appropriately",
        "page": 43
      },
      {
        "code": "B4.3.6.1.2",
        "text": "Use adverbs of time to modify verbs.",
        "page": 43
      }
    ]
  },
  {
    "code": "B4.3.7.1",
    "text": "Understand and use idiomatic expressions appropriately in speech and in writing",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Idiomatic Expressions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.7.1.1",
        "text": "Use idiomatic expressions appropriately in communication",
        "page": 44
      }
    ]
  },
  {
    "code": "B4.3.8.1",
    "text": "Apply the knowledge of conjunctions in speech and in writing",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Conjunctions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.8.1.1",
        "text": "Identify and use simple conjunctions - and, but, or, nor - to link: - similar ideas - contrasting ideas, show choices/express alternatives",
        "page": 44
      }
    ]
  },
  {
    "code": "B4.3.9.1",
    "text": "Apply the knowledge of modals in speech and in writing",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Modals",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.9.1.1",
        "text": "Use modals to express a variety of meanings: - can: conveys ability - may: asks for permission, expresses politeness, possibility - must: obligation or compulsion, necessitys - shall / will: prediction, intention, determination etc. - could: tentativeness, politeness - would: politeness - might: possibility - should: obligation - used to: for past activities or events - have to, ought to and need to: for obligation",
        "page": 45
      }
    ]
  },
  {
    "code": "B4.3.10.1",
    "text": "Apply the knowledge of prepositions in oral and written communication",
    "strand": "Grammar Usage at Word and Phrase Levels",
    "subStrand": "Prepositions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.3.10.1.1",
        "text": "Use prepositions to convey a variety of meanings: - Direction e.g. along - Period of Time - Purpose - Possession - Comparison e.g. taller than",
        "page": 46
      }
    ]
  },
  {
    "code": "B4.4.2.1",
    "text": "Copy and rewrite sentences correctly",
    "strand": "Writing",
    "subStrand": "Penmanship and Handwriting",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.2.1.1",
        "text": "Write clearly using joined letters of consistent size",
        "page": 47
      },
      {
        "code": "B4.4.2.1.2",
        "text": "Use simple sentences clearly and correctly",
        "page": 47
      }
    ]
  },
  {
    "code": "B4.4.6.1",
    "text": "Develop, organise and express ideas cohesively in writing for a variety of purposes, audience, and contexts",
    "strand": "Writing",
    "subStrand": "Paragraph Development",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.6.1.1",
        "text": "Choose appropriate ways and modes of writing for a variety of purposes, audience, and contexts, and organise facts, ideas and/ or points of view in a way appropriate to the mode of delivery, using appropriate text features",
        "page": 48
      },
      {
        "code": "B4.4.6.1.2",
        "text": "Identify the main idea and minor ideas/supporting details in a paragraph",
        "page": 49
      }
    ]
  },
  {
    "code": "B4.4.9.1",
    "text": "Apply the skills and strategies for idea generation, selection, development, organisation and revision in writing",
    "strand": "Writing",
    "subStrand": "Writing as a Process",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.9.1.1",
        "text": "Select a topic of choice on issues in the immediate environment, brainstorm and organise ideas before writing",
        "page": 50
      }
    ]
  },
  {
    "code": "B4.4.9.2",
    "text": "Develop and express ideas coherently and cohesively in writing",
    "strand": "Writing",
    "subStrand": "Writing as a Process",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.9.2.1",
        "text": "Develop ideas into a one-paragraph draft using appropriate nouns or pronouns within and across sentences to aid cohesion and avoid ambiguity",
        "page": 51
      }
    ]
  },
  {
    "code": "B4.4.9.3",
    "text": "Apply strategies for improving drafts for publishing",
    "strand": "Writing",
    "subStrand": "Writing as a Process",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.9.3.1",
        "text": "Review and revise the one-paragraph draft taking out irrelevant details",
        "page": 51
      },
      {
        "code": "B4.4.9.3.2",
        "text": "Proofread draft, checking capitalisation, usage, punctuation and spelling",
        "page": 52
      },
      {
        "code": "B4.4.9.3.3",
        "text": "Display writing piece for other peers to read",
        "page": 52
      }
    ]
  },
  {
    "code": "B4.4.10.1",
    "text": "Narrate situations, express feelings and convey point of view about the world/ or fictional world",
    "strand": "Writing",
    "subStrand": "Narrative Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.10.1.1",
        "text": "Write about real or imagined experiences or events following story structure (beginning, middle and ending), using appropriate noun or pronoun within and across sentences to aid cohesion.",
        "page": 53
      }
    ]
  },
  {
    "code": "B4.4.11.1",
    "text": "Create texts",
    "strand": "Writing",
    "subStrand": "Creative/Free Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.11.1.1",
        "text": "Write freely about topics of choice in their immediate environment",
        "page": 54
      },
      {
        "code": "B4.4.11.1.2",
        "text": "Write poems and imaginative, narrative stories and illustrate them",
        "page": 54
      }
    ]
  },
  {
    "code": "B4.4.12.1",
    "text": "Demonstrate knowledge of descriptive words/expressions in writing",
    "strand": "Writing",
    "subStrand": "Descriptive Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.12.1.1",
        "text": "Use descriptive words/expressions to describe places, personal experiences and events",
        "page": 55
      }
    ]
  },
  {
    "code": "B4.4.13.1",
    "text": "Support an opinion in writing",
    "strand": "Writing",
    "subStrand": "Argumentative/Persuasive Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.13.1.1",
        "text": "Support opinions with simple sentences",
        "page": 55
      }
    ]
  },
  {
    "code": "B4.4.13.2",
    "text": "Write arguments to support claims with clear reasons and relevant evidence",
    "strand": "Writing",
    "subStrand": "Argumentative/Persuasive Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.13.2.1",
        "text": "Introduce claim(s) and support them with clear reasons and relevant evidence",
        "page": 56
      },
      {
        "code": "B4.4.13.2.2",
        "text": "Use words, phrases, and clauses to clarify the relationships between claim(s) and reasons",
        "page": 56
      },
      {
        "code": "B4.4.13.2.3",
        "text": "Establish and maintain a formal style",
        "page": 56
      },
      {
        "code": "B4.4.13.2.4",
        "text": "Provide a concluding statement that follows from argument presented",
        "page": 56
      }
    ]
  },
  {
    "code": "B4.4.14.1",
    "text": "Write informative essays",
    "strand": "Writing",
    "subStrand": "Expository/Informative Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.14.1.1",
        "text": "Write words giving information about family",
        "page": 57
      }
    ]
  },
  {
    "code": "B4.4.14.2",
    "text": "Write an event of the day",
    "strand": "Writing",
    "subStrand": "Expository/Informative Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.14.2.1",
        "text": "Write picture events about personal experiences and make radio/TV presentations",
        "page": 57
      }
    ]
  },
  {
    "code": "B4.4.15.1",
    "text": "Write informal letters on given topics",
    "strand": "Writing",
    "subStrand": "Letter Writing",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.4.15.1.1",
        "text": "Write to friends about personal experiences using appropriate letter formats",
        "page": 58
      }
    ]
  },
  {
    "code": "B4.5.2.1",
    "text": "Show understanding of how punctuations are used appropriately in writing",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Punctuation",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.2.1.1",
        "text": "Use the comma: - before and after \"Yes\" and \"No\" in sentences - after addressing a person, e.g. Kofi, can you help me?",
        "page": 58
      }
    ]
  },
  {
    "code": "B4.5.3.1",
    "text": "Apply knowledge of different types of nouns in communication",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Naming words/ Nouns",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.3.1.1",
        "text": "Identify and use nouns in phrase in sentences to identify people, animals, events and objects",
        "page": 59
      },
      {
        "code": "B4.5.3.1.2",
        "text": "Identify and use: - Proper nouns- refer to cities and countries - Common nouns",
        "page": 59
      },
      {
        "code": "B4.5.3.1.3",
        "text": "Identify and use collective nouns to refer to a group of objects and people",
        "page": 60
      },
      {
        "code": "B4.5.3.1.4",
        "text": "Identify and use abstract nouns to refer to concepts and ideas",
        "page": 60
      }
    ]
  },
  {
    "code": "B4.5.4.1",
    "text": "Demonstrate understanding of verbs in everyday language",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Action Words",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.4.1.1",
        "text": "Use the singular and plural subjects and the verb form that go with them",
        "page": 62
      },
      {
        "code": "B4.5.4.1.2",
        "text": "Demonstrate the use of simple past form in speech and in writing to express past conditions",
        "page": 62
      },
      {
        "code": "B4.5.4.1.3",
        "text": "Use the present perfect form of verbs to relate past events to the present",
        "page": 62
      }
    ]
  },
  {
    "code": "B4.5.5.1",
    "text": "Demonstrate understanding of adjectives in speech and in writing",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Qualifying Words – Adjectives",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.5.1.1",
        "text": "Use adjectives to make comparisons e.g. - fast /slow - good/bad - fast/faster - slow/slower",
        "page": 63
      },
      {
        "code": "B4.5.5.1.2",
        "text": "Differentiate between how the comparative and superlative adjective forms are used in sentences",
        "page": 63
      }
    ]
  },
  {
    "code": "B4.5.6.1",
    "text": "Understand and use adverbs correctly in speech and in writing",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Adverbs",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.6.1.1",
        "text": "Use adverbs to talk about when and where the action of a verb took place",
        "page": 64
      }
    ]
  },
  {
    "code": "B4.5.7.1",
    "text": "Apply the knowledge of prepositions in oral and written communication",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Simple Prepositions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.7.1.1",
        "text": "Use prepositions to convey a variety of meanings: - Direction, e.g. up - Period of Time, e.g. for - Purpose, e.g. to - Possession, of - Comparison e.g. taller than",
        "page": 64
      }
    ]
  },
  {
    "code": "B4.5.8.1",
    "text": "Apply the knowledge of conjunctions in speech and in writing",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Conjunctions",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.8.1.1",
        "text": "Identify and use conjunctions - and, but, or, nor - to link: - similar ideas - contrasting ideas - express alternatives",
        "page": 66
      }
    ]
  },
  {
    "code": "B4.5.9.1",
    "text": "Apply knowledge of grammatical rules to form words, phrases and sentences",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Using Simple, Compound and Complex Sentences",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.9.1.1",
        "text": "Identify subjects and verbs in simple sentences",
        "page": 67
      },
      {
        "code": "B4.5.9.1.2",
        "text": "Construct simple sentences correctly",
        "page": 67
      }
    ]
  },
  {
    "code": "B4.5.10.1",
    "text": "Spell words accurately",
    "strand": "Using Writing Conventions/ Grammar Usage",
    "subStrand": "Spelling",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.5.10.1.1",
        "text": "Use invented spelling to increase fluency and free writing",
        "page": 68
      }
    ]
  },
  {
    "code": "B4.6.1.1",
    "text": "Read widely for pleasure, personal development, and demonstrate independent reading and learning in the literary content areas",
    "strand": "Extensive Reading",
    "subStrand": "Building the Love and Culture of Reading",
    "classLevel": "Basic 4",
    "subject": "English",
    "indicators": [
      {
        "code": "B4.6.1.1.1",
        "text": "Read a variety of age- and level appropriate books and present a-two-paragraph summary of each book read",
        "page": 69
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
    const userMsg = `Curriculum data for ${classLevel} ${subject} has not yet completed official NaCCA syllabus verification. In Strict Verified Mode, TeachSmartGH requires authoritative NaCCA standards and indicators. Currently, Basic 4 English is 100% verified (131 official indicators). Full syllabus authority verification for ${classLevel} ${subject} is in progress.`;
    super(userMsg);
    this.name = 'CurriculumVerificationError';
    this.subject = subject;
    this.classLevel = classLevel;
    this.userMessage = userMsg;
  }
}

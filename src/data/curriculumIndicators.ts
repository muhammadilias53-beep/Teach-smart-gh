/**
 * TeachSmart Ghana — Authoritative Curriculum Indicators Repository
 * 
 * Grounded in the official Ministry of Education / National Council for Curriculum and Assessment (NaCCA)
 * Common Core Programme (CCP) Curriculum for Junior High Schools (Basic 7 - Basic 9)
 * and the Standard-Based Curriculum for Primary Schools (Basic 1 - Basic 6).
 *
 * NOTE ON NACCA CODE ARCHITECTURE:
 * NaCCA codes (e.g. B7.2.1.1) repeat across different subjects because the first digit is Class (B7),
 * the second is Strand (2), the third is Sub-strand (1), and the fourth is Content Standard (1).
 * Therefore, indicators are indexed by `SUBJECT:CODE` (e.g. `English:B7.2.1.1`, `Science:B7.2.1.1`)
 * with fallback to the code itself.
 */

export const AUTHORITATIVE_INDICATORS: Record<string, string[]> = {
  // =========================================================================
  // JHS ENGLISH LANGUAGE (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================

  // --- STRAND 1: ORAL LANGUAGE ---
  // Sub-strand 1: Conversation / Everyday Discourse
  "English:B7.1.1.1": [
    "B7.1.1.1.1: Use appropriate register, tone, and language orally in formal and informal communicative situations",
    "B7.1.1.1.2: Demonstrate active listening, appropriate turn-taking, and conversational etiquette in group discussions",
    "B7.1.1.1.3: Ask clarifying questions and express personal viewpoints respectfully in dialogues"
  ],
  "English:B8.1.1.1": [
    "B8.1.1.1.1: Initiate, sustain, and conclude conversations on diverse social, academic, and cultural topics with fluency",
    "B8.1.1.1.2: Use persuasive language, diplomatic expressions, and appropriate gestures in communicative exchanges",
    "B8.1.1.1.3: Paraphrase, summarize, and critique peers' oral contributions constructively in discussions"
  ],
  "English:B9.1.1.1": [
    "B9.1.1.1.1: Demonstrate mastery of spoken English in formal interviews, negotiations, and panel presentations",
    "B9.1.1.1.2: Mediate conflicts, negotiate compromise, and defend complex arguments orally with poise",
    "B9.1.1.1.3: Critique rhetorical techniques, speaker tone, and underlying assumptions in spontaneous debates"
  ],

  // Sub-strand 2: Listening Comprehension
  "English:B7.1.2.1": [
    "B7.1.2.1.1: Listen attentively to extract main points, supporting details, and infer implicit meaning from spoken texts",
    "B7.1.2.1.2: Identify speaker's purpose, tone, and point of view in informational and literary oral presentations",
    "B7.1.2.1.3: Take structured notes from audio broadcasts, lectures, and peer presentations with accuracy"
  ],
  "English:B8.1.2.1": [
    "B8.1.2.1.1: Analyze and evaluate oral arguments, debates, and broadcasts for objectivity, logic, and bias",
    "B8.1.2.1.2: Distinguish between facts, reasoned opinions, and emotional appeals in persuasive speeches",
    "B8.1.2.1.3: Synthesize information from multiple spoken sources to construct well-founded conclusions"
  ],
  "English:B9.1.2.1": [
    "B9.1.2.1.1: Synthesize multi-source spoken presentations and summarize technical information with precision",
    "B9.1.2.1.2: Critically assess the validity, reliability, and rhetorical strategies of spoken discourse in public forums",
    "B9.1.2.1.3: Respond critically to complex oral arguments providing counter-arguments and sound rebuttals"
  ],

  // Sub-strand 3: Speech Sounds / English Sounds
  "English:B7.1.3.1": [
    "B7.1.3.1.1: Articulate English consonant clusters, vowel contrasts, and diphthongs with phonological accuracy",
    "B7.1.3.1.2: Apply correct word stress in disyllabic and polysyllabic words to distinguish meaning and parts of speech",
    "B7.1.3.1.3: Use rising, falling, and fall-rise intonation patterns appropriately in statements, commands, and questions"
  ],
  "English:B8.1.3.1": [
    "B8.1.3.1.1: Apply correct syllabic stress, rhythm, and sentence intonation in connected speech and expressive reading",
    "B8.1.3.1.2: Produce weak forms, contracted forms, and elision accurately in casual and formal oral delivery",
    "B8.1.3.1.3: Distinguish minimal pairs and produce subtle phonological contrasts in challenging consonant blends"
  ],
  "English:B9.1.3.1": [
    "B9.1.3.1.1: Demonstrate mastery of phonological variations, accent neutralisation, and expressive oral cadence",
    "B9.1.3.1.2: Modulate vocal pitch, tempo, volume, and pauses to achieve specific rhetorical effects in public speech",
    "B9.1.3.1.3: Self-monitor and correct pronunciation, articulation, and voice projection in sustained discourse"
  ],

  // Sub-strand 4: Presentation and Public Speaking
  "English:B7.1.4.1": [
    "B7.1.4.1.1: Plan, structure, and deliver 3-minute informative oral presentations using visual aids and vocal modulation",
    "B7.1.4.1.2: Maintain effective eye contact, confident posture, and purposeful body language during speeches",
    "B7.1.4.1.3: Respond clearly and politely to audience questions following an oral presentation"
  ],
  "English:B8.1.4.1": [
    "B8.1.4.1.1: Construct and defend arguments in formal debates and panel discussions adhering to parliamentary rules",
    "B8.1.4.1.2: Use visual and multimedia aids effectively to reinforce arguments and engage audience interest",
    "B8.1.4.1.3: Evaluate peer presentations using established rubrics covering content, organization, and delivery"
  ],
  "English:B9.1.4.1": [
    "B9.1.4.1.1: Deliver persuasive capstone speeches, advocacy talks, and ceremonial presentations with rhetorical techniques",
    "B9.1.4.1.2: Employ ethos, pathos, and logos effectively to persuade diverse audiences on contemporary national issues",
    "B9.1.4.1.3: Master impromptu speaking and handle unexpected questions or objections with intellectual agility"
  ],

  // --- STRAND 2: READING ---
  // Sub-strand 1: Comprehension / Reading Strategies
  "English:B7.2.1.1": [
    "B7.2.1.1.1: Apply skimming, scanning, and in-depth analytical reading strategies to expository and literary texts",
    "B7.2.1.1.2: Identify main ideas, supporting details, and author's purpose in level-appropriate texts",
    "B7.2.1.1.3: Make inferences and draw conclusions supported by explicit and implicit textual evidence",
    "B7.2.1.1.4: Answer literal, inferential, and evaluative comprehension questions accurately"
  ],
  "English:B8.2.1.1": [
    "B8.2.1.1.1: Evaluate authorial intent, tone, figurative language, and perspective across varied informational and literary texts",
    "B8.2.1.1.2: Analyze how text structure, headings, and paragraph transitions contribute to development of central themes",
    "B8.2.1.1.3: Compare and contrast multiple texts on the same subject to evaluate conflicting viewpoints and evidence"
  ],
  "English:B9.2.1.1": [
    "B9.2.1.1.1: Critically deconstruct complex literary and informational articles synthesizing key themes and underlying assumptions",
    "B9.2.1.1.2: Evaluate the credibility, validity, and potential bias of arguments in print, media, and digital texts",
    "B9.2.1.1.3: Synthesize evidence across multiple primary and secondary texts to form independent critical perspectives"
  ],

  // Sub-strand 2: Vocabulary and Word Analysis / Summarising
  "English:B7.2.2.1": [
    "B7.2.2.1.1: Decode unfamiliar words using prefixes, suffixes, Greek/Latin roots, and contextual clues",
    "B7.2.2.1.2: Identify and explain the meaning of idioms, similes, and metaphors in reading passages",
    "B7.2.2.1.3: Distinguish between denotative and connotative meanings of academic vocabulary"
  ],
  "English:B8.2.2.1": [
    "B8.2.2.1.1: Distinguish between denotative and connotative meanings and nuances of academic vocabulary in context",
    "B8.2.2.1.2: Use context clues, etymology, and morphological analysis to determine precise meanings of specialized terms",
    "B8.2.2.1.3: Analyze how figurative expressions and rhetorical devices enhance meaning in prose and poetry"
  ],
  "English:B9.2.2.1": [
    "B9.2.2.1.1: Utilize specialized academic and technical register across discipline-specific reading materials",
    "B9.2.2.1.2: Analyze how subtle shades of meaning and word choice (diction) convey authorial perspective and tone",
    "B9.2.2.1.3: Apply advanced lexical strategies to interpret archaic, dialectical, and idiomatic expressions in classic texts"
  ],

  // Sub-strand 3: Silent Reading and Fluency
  "English:B7.2.3.1": [
    "B7.2.3.1.1: Read grade-level texts silently with sustained comprehension and target reading speed (150-180 wpm)",
    "B7.2.3.1.2: Self-monitor comprehension and apply repair strategies (rereading, adjusting pace) during silent reading",
    "B7.2.3.1.3: Read aloud with appropriate phrasing, expression, and pacing to convey the author's intended meaning"
  ],
  "English:B8.2.3.1": [
    "B8.2.3.1.1: Demonstrate accelerated silent reading fluency adjusting pace according to text complexity and reading purpose",
    "B8.2.3.1.2: Annotate and extract key information efficiently during timed silent reading of extended informational texts",
    "B8.2.3.1.3: Perform expressive oral dramatic and poetic readings with nuanced tonal inflection and dramatic pauses"
  ],
  "English:B9.2.3.1": [
    "B9.2.3.1.1: Read diverse informational and literary materials with high-level comprehension, retention, and analytical speed",
    "B9.2.3.1.2: Skim and scan complex technical documents, research papers, and policy briefs efficiently for specific data",
    "B9.2.3.1.3: Model fluent, expressive, and authoritative oral interpretation of literary prose, dramatic dialogue, and poetry"
  ],

  // --- STRAND 3: GRAMMAR USAGE ---
  // Sub-strand 1: Parts of Speech / Integrating Grammar
  "English:B7.3.1.1": [
    "B7.3.1.1.1: Identify and use various types of nouns (proper, common, collective, abstract, countable/uncountable) correctly",
    "B7.3.1.1.2: Use personal, relative, reflexive, and demonstrative pronouns with correct antecedent agreement",
    "B7.3.1.1.3: Apply descriptive, quantitative, and demonstrative adjectives with correct comparative and superlative forms",
    "B7.3.1.1.4: Identify and form noun phrases, adjectival phrases, and adverbial phrases in sentences"
  ],
  "English:B8.3.1.1": [
    "B8.3.1.1.1: Analyze grammatical functions of phrases (noun phrases, adjectival phrases, adverbial phrases) in complex sentences",
    "B8.3.1.1.2: Use reflexive, reciprocal, relative, and indefinite pronouns accurately ensuring syntactic clarity",
    "B8.3.1.1.3: Apply compound adjectives and participial adjectives correctly in descriptive and argumentative writing"
  ],
  "English:B9.3.1.1": [
    "B9.3.1.1.1: Analyze and construct complex clause structures (noun clauses, relative clauses, adverbial clauses) with precision",
    "B9.3.1.1.2: Apply nominalisation to convert verbal and adjectival constructions into formal academic noun phrases",
    "B9.3.1.1.3: Evaluate and correct subtle stylistic errors in pronoun reference, adjective stacking, and modifier placement"
  ],

  // Sub-strand 2: Tenses and Aspect / Verbs & Adverbs
  "English:B7.3.2.1": [
    "B7.3.2.1.1: Use transitive, intransitive, and modal auxiliary verbs correctly in spoken and written sentences",
    "B7.3.2.1.2: Use adverbs of manner, time, place, frequency, and degree to modify verbs, adjectives, and other adverbs",
    "B7.3.2.1.3: Apply simple present, past, future, and continuous aspects correctly in communicative contexts"
  ],
  "English:B8.3.2.1": [
    "B8.3.2.1.1: Use perfect and perfect continuous tenses (present, past, future) with appropriate temporal markers",
    "B8.3.2.1.2: Use phrasal verbs, idioms, and complex prepositional phrases with grammatical precision in varied contexts",
    "B8.3.2.1.3: Apply modal auxiliaries to express subtle shades of obligation, permission, certainty, deduction, and politeness"
  ],
  "English:B9.3.2.1": [
    "B9.3.2.1.1: Apply conditional clauses (types 0, 1, 2, 3) and subjunctive moods accurately in formal speech and writing",
    "B9.3.2.1.2: Transform sentences between direct and indirect (reported) speech with correct tense backshifting and pronoun shifts",
    "B9.3.2.1.3: Transform active voice to passive voice appropriately for scientific, objective, and journalistic writing styles"
  ],

  // Sub-strand 3: Sentence Structure and Concord
  "English:B7.3.3.1": [
    "B7.3.3.1.1: Apply rules of subject-verb agreement (concord) in simple, compound, and complex sentences",
    "B7.3.3.1.2: Construct compound sentences using coordinating conjunctions (FANBOYS) and conjunctive adverbs",
    "B7.3.3.1.3: Identify and correct common sentence faults (run-on sentences, comma splices, and sentence fragments)"
  ],
  "English:B8.3.3.1": [
    "B8.3.3.1.1: Apply advanced concord rules including indefinite pronouns, collective nouns, compound subjects, and proximity concord",
    "B8.3.3.1.2: Construct complex sentences with subordinating conjunctions expressing cause, contrast, condition, and concession",
    "B8.3.3.1.3: Use parallel structure in lists, paired conjunctions (either/or, not only/but also), and comparisons"
  ],
  "English:B9.3.3.1": [
    "B9.3.3.1.1: Construct compound-complex sentences with stylistic elegance and rhythmic variety",
    "B9.3.3.1.2: Apply inversion for rhetorical emphasis (e.g., 'Seldom have we witnessed...') in formal compositions",
    "B9.3.3.1.3: Audit and edit complex texts for syntactical clarity, eliminating ambiguity and misplaced/dangling modifiers"
  ],

  // Sub-strand 4: Punctuation and Capitalisation
  "English:B7.3.4.1": [
    "B7.3.4.1.1: Use capital letters, full stops, commas, question marks, and exclamation marks accurately in all written work",
    "B7.3.4.1.2: Use apostrophes correctly for singular/plural possession and contracted forms",
    "B7.3.4.1.3: Use quotation marks and commas accurately when writing direct speech dialogue"
  ],
  "English:B8.3.4.1": [
    "B8.3.4.1.1: Use colons and semi-colons correctly to separate independent clauses and introduce formal lists",
    "B8.3.4.1.2: Use hyphens, dashes, brackets (parentheses), and ellipses accurately for parenthetical and dramatic effects",
    "B8.3.4.1.3: Punctuate complex citations, book titles, and formal correspondence correctly"
  ],
  "English:B9.3.4.1": [
    "B9.3.4.1.1: Master advanced punctuation conventions across varied text types including formal reports and literary prose",
    "B9.3.4.1.2: Use punctuation to establish nuanced sentence rhythm, tone, and stylistic emphasis in sophisticated writing",
    "B9.3.4.1.3: Proofread and edit complex drafts to eliminate all mechanical and typographical punctuation errors"
  ],

  // Sub-strand 5: Vocabulary
  "English:B7.3.5.1": [
    "B7.3.5.1.1: Expand active vocabulary through synonyms, antonyms, homonyms, and word-formation affixes",
    "B7.3.5.1.2: Use domain-specific terminology accurately in curriculum subjects and everyday communication",
    "B7.3.5.1.3: Maintain a personal vocabulary journal documenting word origins, meanings, and example sentences"
  ],
  "English:B8.3.5.1": [
    "B8.3.5.1.1: Use common English idioms, collocations, and proverbs appropriately in oral and written composition",
    "B8.3.5.1.2: Analyze how context influences word choice and distinguish between formal and informal lexical registers",
    "B8.3.5.1.3: Apply morphological roots (Latin/Greek) to deduce meanings of unfamiliar poly-syllabic academic terms"
  ],
  "English:B9.3.5.1": [
    "B9.3.5.1.1: Demonstrate command of nuanced academic register, abstract vocabulary, and technical jargon in discourse",
    "B9.3.5.1.2: Analyze connotations, euphemisms, loaded language, and biased diction in media and political rhetoric",
    "B9.3.5.1.3: Select words with precision and economy to enhance clarity, impact, and aesthetic appeal in writing"
  ],

  // --- STRAND 4: WRITING ---
  // Sub-strand 1: Structure and Organise Ideas / Paragraph Development
  "English:B7.4.1.1": [
    "B7.4.1.1.1: Generate, plan, and organize ideas using brainstorm webs, outlines, and graphic organizers",
    "B7.4.1.1.2: Write coherent paragraphs with clear topic sentences, supporting details, and concluding thoughts",
    "B7.4.1.1.3: Use transitional devices (firstly, furthermore, however, therefore) to maintain logical flow between sentences"
  ],
  "English:B7.4.1.2": [
    "B7.4.1.2.1: Create introductory paragraphs that provide context and capture the reader's attention",
    "B7.4.1.2.2: Develop body paragraphs focusing on a single controlling idea with concrete examples",
    "B7.4.1.2.3: Write effective concluding paragraphs that summarize main points and leave a lasting impression"
  ],
  "English:B8.4.1.1": [
    "B8.4.1.1.1: Develop unified multi-paragraph essays with logical progression, cohesive ties, and smooth transitions",
    "B8.4.1.1.2: Structure multi-perspective essays establishing clear thesis statements and supporting claims",
    "B8.4.1.1.3: Apply the writing process: Pre-writing, Drafting, Peer-reviewing, Revising, Editing, and Publishing"
  ],
  "English:B8.4.1.2": [
    "B8.4.1.2.1: Write contrasting and comparative paragraphs with balanced syntactic structures",
    "B8.4.1.2.2: Incorporate direct quotations, paraphrased evidence, and citations smoothly within paragraphs",
    "B8.4.1.2.3: Revise paragraphs to eliminate redundancies, clichés, and awkward phrasing"
  ],
  "English:B9.4.1.1": [
    "B9.4.1.1.1: Organize complex essays incorporating sophisticated introductory hooks, multi-layered body argumentation, and compelling conclusions",
    "B9.4.1.1.2: Maintain stylistic consistency, appropriate academic tone, and seamless transitional bridges throughout extended compositions",
    "B9.4.1.1.3: Self-edit compositions critically against formal NaCCA writing rubrics to achieve publishable quality"
  ],
  "English:B9.4.1.2": [
    "B9.4.1.2.1: Craft nuanced thesis-driven paragraphs addressing complex socio-economic, scientific, and cultural themes",
    "B9.4.1.2.2: Use varied paragraph lengths and structures strategically to control pacing and reader engagement",
    "B9.4.1.2.3: Master executive summary writing condensing multi-page essays into focused executive briefings"
  ],

  // Sub-strand 2: Narrative Writing / Text Types
  "English:B7.4.2.1": [
    "B7.4.2.1.1: Compose imaginative and personal narratives with character development and descriptive Ghanaian settings",
    "B7.4.2.1.2: Use chronological sequencing, flashbacks, and transitional markers to pace narrative events effectively",
    "B7.4.2.1.3: Incorporate realistic dialogue punctuated correctly to reveal character traits and advance the plot"
  ],
  "English:B7.4.2.2": [
    "B7.4.2.2.1: Apply narrative writing skills to compose engaging personal recount essays of memorable life experiences",
    "B7.4.2.2.2: Write imaginative stories highlighting moral lessons and positive cultural values"
  ],
  "English:B8.4.2.1": [
    "B8.4.2.1.1: Write narrative stories incorporating rising action, plot climax, character motivation, and resolved conflict",
    "B8.4.2.1.2: Establish distinct narrative point of view (first-person, third-person limited/omniscient) consistently",
    "B8.4.2.1.3: Create atmospheric tension, suspense, and emotional resonance using sensory imagery and pacing"
  ],
  "English:B8.4.2.2": [
    "B8.4.2.2.1: Adapt narratives for dramatic performances, radio scripts, and classroom readers' theatre",
    "B8.4.2.2.2: Compose biographical and historical narratives grounded in Ghanaian heritage and cultural milestones"
  ],
  "English:B9.4.2.1": [
    "B9.4.2.1.1: Produce creative biographical and fictional narratives utilizing advanced literary techniques (foreshadowing, irony, symbolism)",
    "B9.4.2.1.2: Develop complex multi-dimensional characters whose choices drive the central thematic conflict",
    "B9.4.2.1.3: Experiment with innovative narrative structures (parallel plots, framed narratives, dual perspectives) with artistic control"
  ],
  "English:B9.4.2.2": [
    "B9.4.2.2.1: Write polished creative short stories suitable for school literary anthologies and creative writing competitions",
    "B9.4.2.2.2: Craft allegorical narratives addressing contemporary national challenges including environmental conservation and social justice"
  ],

  // Sub-strand 3: Descriptive Writing / Building Knowledge
  "English:B7.4.3.1": [
    "B7.4.3.1.1: Write vivid descriptive essays depicting people, places, objects, and cultural ceremonies in Ghana",
    "B7.4.3.1.2: Use sensory details (sight, sound, smell, taste, touch) and figurative adjectives to create clear mental pictures",
    "B7.4.3.1.3: Organize descriptions logically using spatial order (top to bottom, near to far) or order of importance"
  ],
  "English:B8.4.3.1": [
    "B8.4.3.1.1: Compose descriptive accounts using sensory imagery, similes, metaphors, and rich adjectives to evoke mood",
    "B8.4.3.1.2: Research and synthesize descriptive details from multiple sources to depict historical events and natural landmarks",
    "B8.4.3.1.3: Create atmospheric descriptive compositions capturing nuanced cultural rituals and community life"
  ],
  "English:B9.4.3.1": [
    "B9.4.3.1.1: Conduct independent research to build and present well-documented descriptive and investigative reports",
    "B9.4.3.1.2: Combine descriptive and reflective prose to analyze personal encounters and societal phenomena",
    "B9.4.3.1.3: Master evocative travel writing, ecological portraits, and cultural critiques with stylistic distinction"
  ],

  // Sub-strand 4: Argumentative Writing
  "English:B7.4.4.1": [
    "B7.4.4.1.1: Write simple argumentative texts stating a clear position on a familiar school or community issue",
    "B7.4.4.1.2: Provide logical reasons, personal examples, and factual evidence to support the chosen stance",
    "B7.4.4.1.3: Acknowledge opposing viewpoints and provide simple counter-arguments politely"
  ],
  "English:B8.4.4.1": [
    "B8.4.4.1.1: Draft balanced persuasive essays addressing counterarguments and refuting opposing views with verified evidence",
    "B8.4.4.1.2: Use rhetorical questions, emotive diction, and logical appeals (deductive and inductive reasoning) effectively",
    "B8.4.4.1.3: Write formal debate speeches arguing motion proposals adhering to established debating formats"
  ],
  "English:B9.4.4.1": [
    "B9.4.4.1.1: Write formal debate speeches and opinion essays defending complex policy positions with authoritative data",
    "B9.4.4.1.2: Deconstruct logical fallacies (ad hominem, false dichotomy, slippery slope) in opposing arguments systematically",
    "B9.4.4.1.3: Author persuasive editorials and open letters advocating actionable solutions to pressing national issues"
  ],

  // Sub-strand 5: Informative / Expository Writing
  "English:B7.4.5.1": [
    "B7.4.5.1.1: Write procedural instructions, recipes, and informative guides using clear sequential markers (first, next, then)",
    "B7.4.5.1.2: Organize expository information with clear headings, bulleted lists, and simple explanatory diagrams",
    "B7.4.5.1.3: Write factual reports on classroom science experiments, sports events, and educational visits"
  ],
  "English:B8.4.5.1": [
    "B8.4.5.1.1: Compose cause-and-effect and compare-and-contrast expository essays with balanced structural development",
    "B8.4.5.1.2: Explain complex technical or scientific processes in clear, accessible language for non-specialist readers",
    "B8.4.5.1.3: Write comprehensive project progress reports incorporating data tables, charts, and objective analysis"
  ],
  "English:B9.4.5.1": [
    "B9.4.5.1.1: Author formal research reports and analytical articles citing factual data and primary/secondary sources",
    "B9.4.5.1.2: Formulate clear problem-solution essays proposing innovative, evidence-based recommendations",
    "B9.4.5.1.3: Produce technical documentation, standard operating procedures, and comprehensive briefing memos"
  ],

  // Sub-strand 6: Letter Writing
  "English:B7.4.6.1": [
    "B7.4.6.1.1: Write informal letters to friends and family members with proper address, date, salutation, body, and sign-off",
    "B7.4.6.1.2: Use warm conversational tone, informal contractions, and personal inquiries appropriately in friendly letters",
    "B7.4.6.1.3: Write simple semi-formal letters (e.g., to a class teacher or club patron) with respectful register"
  ],
  "English:B8.4.6.1": [
    "B8.4.6.1.1: Write formal letters of application, permission, and apology adhering strictly to official business letter formats",
    "B8.4.6.1.2: Use two addresses, formal salutation, concise subject heading, and courteous sign-off in formal correspondence",
    "B8.4.6.1.3: Maintain an objective, professional, and respectful tone without slang or informal abbreviations"
  ],
  "English:B9.4.6.1": [
    "B9.4.6.1.1: Draft formal business correspondence, letters to the editor, official petitions, and corporate emails",
    "B9.4.6.1.2: Express civic concerns, community complaints, and policy recommendations persuasively to public officials",
    "B9.4.6.1.3: Write professional CVs, cover letters, and statements of purpose for secondary school placement and scholarships"
  ],

  // Sub-strand 7: Summary Writing
  "English:B7.4.7.1": [
    "B7.4.7.1.1: Identify topic sentences and extract main ideas to write brief passage summaries in own words",
    "B7.4.7.1.2: Paraphrase complex sentences into concise statements eliminating examples and decorative adjectives",
    "B7.4.7.1.3: Summarize narrative texts highlighting key plot events within a designated word count"
  ],
  "English:B8.4.7.1": [
    "B8.4.7.1.1: Paraphrase complex passages and draft concise summaries within specified word limits (50-80 words)",
    "B8.4.7.1.2: Differentiate between essential points and non-essential illustrative details in informational texts",
    "B8.4.7.1.3: Write point-form and prose summaries of argumentative speeches and multi-paragraph essays"
  ],
  "English:B9.4.7.1": [
    "B9.4.7.1.1: Synthesize multiple informational texts into structured executive summaries capturing conflicting viewpoints",
    "B9.4.7.1.2: Produce précis of academic articles, policy documents, and literary criticism maintaining absolute fidelity to the original",
    "B9.4.7.1.3: Summarize complex data sets, survey findings, and conference proceedings into actionable briefing points"
  ],

  // --- STRAND 5: LITERATURE ---
  // Sub-strand 1: Prose / Oral & Written Literature
  "English:B7.5.1.1": [
    "B7.5.1.1.1: Analyze plot, setting, characterization, and central themes in selected African and Ghanaian literature",
    "B7.5.1.1.2: Discuss moral lessons, cultural values, and societal traditions reflected in Ghanaian folklore and prose",
    "B7.5.1.1.3: Compare traditional oral narratives (Ananse stories) with modern written prose forms"
  ],
  "English:B8.5.1.1": [
    "B8.5.1.1.1: Examine conflict, foreshadowing, character motives, and narrative perspective in prescribed African novels",
    "B8.5.1.1.2: Analyze how authors use imagery, symbolism, and local idioms to enrich storytelling and cultural authenticity",
    "B8.5.1.1.3: Compare and contrast protagonists and antagonists in two different literary texts"
  ],
  "English:B9.5.1.1": [
    "B9.5.1.1.1: Critique narrative point of view, figurative language, dramatic irony, and socio-cultural themes in African literature",
    "B9.5.1.1.2: Evaluate how contemporary African writers address themes of governance, gender, migration, and post-colonial identity",
    "B9.5.1.1.3: Write critical literary reviews and essays analyzing authorial style and thematic development in prescribed texts"
  ],

  // Sub-strand 2: Poetry
  "English:B7.5.2.1": [
    "B7.5.2.1.1: Analyze poetic devices (rhyme, rhythm, stanza form, imagery, alliteration, onomatopoeia) in selected poems",
    "B7.5.2.1.2: Interpret themes, emotional tone, and speaker persona in Ghanaian and African poetry",
    "B7.5.2.1.3: Recite selected poems aloud with expressive intonation, gestures, and appreciation of musicality"
  ],
  "English:B8.5.2.1": [
    "B8.5.2.1.1: Interpret figurative language (similes, metaphors, personification, hyperbole) and underlying messages in poems",
    "B8.5.2.1.2: Contrast free verse and traditional metered poetry analyzing how form influences meaning and mood",
    "B8.5.2.1.3: Compose original poems exploring personal reflections, nature, and cultural celebrations"
  ],
  "English:B9.5.2.1": [
    "B9.5.2.1.1: Critically appreciate theme, tone, mood, diction, and sound patterns in prescribed African and non-African poetry",
    "B9.5.2.1.2: Deconstruct complex allegories, extended metaphors, and political satire in protest and pan-African poetry",
    "B9.5.2.1.3: Write comparative poetry essays evaluating how two poets approach similar themes using distinct techniques"
  ],

  // Sub-strand 3: Drama
  "English:B7.5.3.1": [
    "B7.5.3.1.1: Explore dramatic elements including dialogue, stage directions, act/scene division, and character roles",
    "B7.5.3.1.2: Perform script readings and enact short dramatic scenes with appropriate vocal expression and movement",
    "B7.5.3.1.3: Identify dramatic conflict and explain how stage directions guide actors' physical performance"
  ],
  "English:B8.5.3.1": [
    "B8.5.3.1.1: Perform script readings and analyze dramatic conflict, climax, and character relationships in Ghanaian plays",
    "B8.5.3.1.2: Differentiate between comedy, tragedy, and farce explaining key conventions of each theatrical genre",
    "B8.5.3.1.3: Improvise dramatic scenes and write short one-act plays based on contemporary community dilemmas"
  ],
  "English:B9.5.3.1": [
    "B9.5.3.1.1: Evaluate tragic and comedic conventions, satire, and dramatic irony in prescribed African dramatic works",
    "B9.5.3.1.2: Direct and stage dramatic scenes demonstrating understanding of blocking, lighting, costuming, and audience engagement",
    "B9.5.3.1.3: Critique dramatic performances analyzing playwright intention, theatrical effectiveness, and social commentary"
  ],

  // =========================================================================
  // JHS SCIENCE (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================
  "Science:B7.1.1.1": [
    "B7.1.1.1.1: Classify materials into solids, liquids, and gases based on their physical properties and particle arrangement",
    "B7.1.1.1.2: Demonstrate changes of state of matter (melting, evaporation, condensation, freezing, sublimation) using local materials",
    "B7.1.1.1.3: Explain the importance of changes of state in everyday life and industrial processes (water cycle, distillation)"
  ],
  "Science:B7.1.1.2": [
    "B7.1.1.2.1: Explain the structure of the atom and identify protons, neutrons, and electrons",
    "B7.1.1.2.2: Identify elements by their chemical symbols and state atomic numbers for the first 20 elements of the Periodic Table",
    "B7.1.1.2.3: Classify the first 20 elements into metals, non-metals, and noble gases"
  ],
  "Science:B8.1.1.1": [
    "B8.1.1.1.1: Distinguish between pure substances (elements, compounds) and mixtures",
    "B8.1.1.1.2: Demonstrate various methods of separating mixtures (filtration, evaporation, distillation, chromatography, magnetic separation)",
    "B8.1.1.1.3: Apply separation techniques to solve practical local problems such as water purification and salt production"
  ],
  "Science:B8.1.1.2": [
    "B8.1.1.2.1: Draw atomic structures and write electron configurations for the first 20 elements",
    "B8.1.1.2.2: Relate the group number and period of an element to its electron configuration",
    "B8.1.1.2.3: Explain how atoms achieve stability through gaining, losing, or sharing electrons"
  ],
  "Science:B9.1.1.1": [
    "B9.1.1.1.1: Identify acids, bases, and salts by their physical and chemical properties and pH values",
    "B9.1.1.1.2: Prepare simple indicators from local plant materials (red cabbage, hibiscus) to test acidity and alkalinity",
    "B9.1.1.1.3: Explain neutralization reactions and their applications in everyday life (soil treatment, antacid medicine)"
  ],
  "Science:B9.1.1.2": [
    "B9.1.1.2.1: Differentiate between ionic and covalent bonding with specific examples",
    "B9.1.1.2.2: Write chemical formulas of binary compounds using valencies of elements",
    "B9.1.1.2.3: Construct balanced chemical equations for simple chemical reactions"
  ],
  "Science:B7.2.1.1": [
    "B7.2.1.1.1: Describe the life cycle of a flowering plant including pollination, fertilization, seed formation, and germination",
    "B7.2.1.1.2: Dissect a flower and identify the male (stamen) and female (pistil) reproductive organs",
    "B7.2.1.1.3: Investigate conditions necessary for seed germination (water, warmth, oxygen)"
  ],
  "Science:B7.2.2.1": [
    "B7.2.2.1.1: Describe the life cycle of a housefly (egg, larva/maggot, pupa, adult) through observation and illustration",
    "B7.2.2.1.2: Identify the economic and health importance of the housefly as a vector of diseases (cholera, dysentery, typhoid)",
    "B7.2.2.1.3: Design and implement strategies for controlling housefly populations in the home and school environment"
  ],
  "Science:B7.2.3.1": [
    "B7.2.3.1.1: Identify suitable conditions and site selection criteria for vegetable crop production",
    "B7.2.3.1.2: Demonstrate seedbed preparation and nursery management practices for vegetable crops",
    "B7.2.3.1.3: Transplant vegetable seedlings using appropriate spacing and cultural care"
  ],
  "Science:B7.2.4.1": [
    "B7.2.4.1.1: Classify farm animals based on digestive system into monogastric and ruminants",
    "B7.2.4.1.2: Describe appropriate housing and environmental requirements for poultry and small ruminants",
    "B7.2.4.1.3: Formulate basic feed rations from local feedstuffs (cassava peelings, maize bran, forage)"
  ],
  "Science:B8.2.1.1": [
    "B8.2.1.1.1: Describe the life cycle of a mosquito and a housefly and identify the stages",
    "B8.2.1.1.2: Explain the biological methods of controlling vectors at various stages of their life cycles",
    "B8.2.1.1.3: Plan and carry out an environmental sanitation campaign to eliminate mosquito breeding sites"
  ],
  "Science:B8.2.2.1": [
    "B8.2.2.1.1: Describe the stages in the life cycle of the female Anopheles mosquito (egg, larva/wriggler, pupa/tumbler, adult)",
    "B8.2.2.1.2: Relate the habitat and breeding habits of mosquitoes to methods of malaria prevention and control",
    "B8.2.2.1.3: Compare the life cycles of the mosquito and housefly noting complete metamorphosis"
  ],
  "Science:B8.2.3.1": [
    "B8.2.3.1.1: Demonstrate cultural practices in crop production including weeding, thinning, mulching, and staking",
    "B8.2.3.1.2: Identify common crop pests and diseases and their symptoms in vegetable gardens",
    "B8.2.3.1.3: Practice integrated pest management (IPM) using biological and organic control measures"
  ],
  "Science:B8.2.4.1": [
    "B8.2.4.1.1: Identify signs of good health and common symptoms of illnesses in domestic livestock",
    "B8.2.4.1.2: Describe causes, symptoms, and control of major animal diseases (Newcastle disease, anthrax, foot-and-mouth)",
    "B8.2.4.1.3: Explain routine management practices including vaccination, deworming, and sanitation in livestock production"
  ],
  "Science:B9.2.1.1": [
    "B9.2.1.1.1: Describe carbon and nitrogen cycles and explain their significance in maintaining ecological balance",
    "B9.2.1.1.2: Discuss human activities that disrupt biogeochemical cycles (deforestation, burning fossil fuels)",
    "B9.2.1.1.3: Propose sustainable practices to mitigate the impacts of disrupted ecological cycles"
  ],
  "Science:B9.2.2.1": [
    "B9.2.2.1.1: Describe the stages in the life cycle of the grasshopper (egg, nymph, adult) representing incomplete metamorphosis",
    "B9.2.2.1.2: Compare complete and incomplete metamorphosis in insects with specific examples",
    "B9.2.2.1.3: Assess the economic impact of grasshoppers/locusts on crops and food security and devise control methods"
  ],
  "Science:B9.2.3.1": [
    "B9.2.3.1.1: Identify maturity indices for harvesting various vegetable and grain crops",
    "B9.2.3.1.2: Demonstrate post-harvest handling and storage techniques to minimize spoilage and nutrient loss",
    "B9.2.3.1.3: Package and market agricultural produce using safe and attractive local packaging"
  ],
  "Science:B9.2.4.1": [
    "B9.2.4.1.1: Describe breeding practices and selection of healthy breeding stock in farm animals",
    "B9.2.4.1.2: Demonstrate record keeping in animal production including breeding, feeding, and financial records",
    "B9.2.4.1.3: Evaluate the contribution of livestock production to food security and rural livelihoods in Ghana"
  ],
  "Science:B7.3.1.1": [
    "B7.3.1.1.1: Identify the components of the solar system and describe their relative positions and movements",
    "B7.3.1.1.2: Explain the causes of day and night, seasons, and eclipses of the sun and moon",
    "B7.3.1.1.3: Build a model of the solar system using local, low-cost materials"
  ],
  "Science:B7.3.2.1": [
    "B7.3.2.1.1: Identify the sun and the eight planets in order of distance from the sun in the solar system",
    "B7.3.2.1.2: Explain rotation and revolution of the earth and their effects (day/night, seasons)",
    "B7.3.2.1.3: Construct scale models or diagrams illustrating lunar and solar eclipses"
  ],
  "Science:B7.3.3.1": [
    "B7.3.3.1.1: Distinguish between biotic (producers, consumers, decomposers) and abiotic components of an ecosystem",
    "B7.3.3.1.2: Construct food chains and food webs for terrestrial and aquatic ecosystems in Ghana",
    "B7.3.3.1.3: Explain energy flow and pyramid of numbers in natural habitats"
  ],
  "Science:B7.3.4.1": [
    "B7.3.4.1.1: Distinguish between land rotation, crop rotation, and mixed farming systems in Ghana",
    "B7.3.4.1.2: Design a 3-year or 4-year crop rotation program incorporating leguminous cover crops",
    "B7.3.4.1.3: Discuss the advantages of mixed farming in terms of nutrient recycling and economic stability"
  ],
  "Science:B8.3.1.1": [
    "B8.3.1.1.1: Identify the organs of the human circulatory system (heart, blood vessels, blood) and their functions",
    "B8.3.1.1.2: Trace the path of double circulation through the pulmonary and systemic circuits",
    "B8.3.1.1.3: Measure pulse rates before and after physical exercise and explain cardiovascular health"
  ],
  "Science:B8.3.2.1": [
    "B8.3.2.1.1: Explain the gravitational pull of the moon and sun in producing ocean tides",
    "B8.3.2.1.2: Describe comets, meteors, meteorites, and asteroids and their characteristics",
    "B8.3.2.1.3: Discuss space exploration milestones and the role of artificial satellites in weather forecasting and communications"
  ],
  "Science:B8.3.3.1": [
    "B8.3.3.1.1: Investigate ecological adaptations of plants and animals to desert, forest, and aquatic environments",
    "B8.3.3.1.2: Describe symbiotic relationships (mutualism, commensalism, parasitism) with local examples",
    "B8.3.3.1.3: Assess how environmental changes and invasive species disrupt ecological balance"
  ],
  "Science:B8.3.4.1": [
    "B8.3.4.1.1: Evaluate pastoral farming, nomadic herding, and commercial ranching in West Africa",
    "B8.3.4.1.2: Explain agroforestry and alley cropping as sustainable agricultural practices",
    "B8.3.4.1.3: Assess the impact of modern irrigation systems on food security and water resources"
  ],
  "Science:B9.3.1.1": [
    "B9.3.1.1.1: Identify the organs of the human nervous system and endocrine system and their functions",
    "B9.3.1.1.2: Explain reflex actions and compare electrical nerve impulses with chemical hormonal responses",
    "B9.3.1.1.3: Discuss the effects of substance abuse (alcohol, narcotics) on the nervous system"
  ],
  "Science:B9.3.2.1": [
    "B9.3.2.1.1: Explain constellations, galaxies, and the Milky Way galaxy",
    "B9.3.2.1.2: Discuss the origin and evolution of the universe (Big Bang theory) and expansion of space",
    "B9.3.2.1.3: Appreciate the contribution of space science to technology, navigation (GPS), and natural disaster monitoring"
  ],
  "Science:B9.3.3.1": [
    "B9.3.3.1.1: Explain ecological succession (primary and secondary) in disturbed habitats",
    "B9.3.3.1.2: Analyze human activities (deforestation, galamsey, pesticide use) on biodiversity loss",
    "B9.3.3.1.3: Design habitat restoration and conservation interventions for degraded local ecosystems"
  ],
  "Science:B9.3.4.1": [
    "B9.3.4.1.1: Analyze organic farming versus conventional chemical farming in terms of yield and environmental health",
    "B9.3.4.1.2: Explore climate-smart agriculture techniques (zero tillage, rainwater harvesting, drought-tolerant seeds)",
    "B9.3.4.1.3: Develop a sustainable farm management business plan for a school demonstration farm"
  ],
  "Science:B7.4.1.1": [
    "B7.4.1.1.1: Identify forms and sources of energy (renewable and non-renewable) available in Ghana",
    "B7.4.1.1.2: Demonstrate the principle of conservation of energy and energy transformations in simple devices",
    "B7.4.1.1.3: Construct simple solar or wind energy conversion devices using recycled materials"
  ],
  "Science:B7.4.2.1": [
    "B7.4.2.1.1: Identify conductors, insulators, and semiconductors in electrical devices",
    "B7.4.2.1.2: Construct simple series and parallel circuits using dry cells, switches, and lamps",
    "B7.4.2.1.3: Measure electrical current using an ammeter and potential difference using a voltmeter"
  ],
  "Science:B7.4.3.1": [
    "B7.4.3.1.1: State the Law of Conservation of Energy and give examples in mechanical and chemical systems",
    "B7.4.3.1.2: Demonstrate energy conversions between potential and kinetic energy using pendulums and roller tracks",
    "B7.4.3.1.3: Calculate potential energy (PE = mgh) and kinetic energy (KE = ½mv²) in simple problems"
  ],
  "Science:B7.4.4.1": [
    "B7.4.4.1.1: Define force, state its SI unit (Newton), and measure contact and non-contact forces using a spring balance",
    "B7.4.4.1.2: Investigate frictional force and demonstrate methods of increasing and reducing friction in machines",
    "B7.4.4.1.3: Distinguish between mass (kg) and weight (N) and calculate weight using W = mg"
  ],
  "Science:B7.4.5.1": [
    "B7.4.5.1.1: Identify simple agricultural hand tools (cutlass, hoe, rake, trowel, watering can) and describe their primary uses",
    "B7.4.5.1.2: Demonstrate the correct handling, cleaning, and sharpening of cutting and digging tools",
    "B7.4.5.1.3: Explain safe storage practices and application of grease/oil to prevent rust on metal tools"
  ],
  "Science:B8.4.1.1": [
    "B8.4.1.1.1: Demonstrate how light travels in straight lines (rectilinear propagation) and produces shadows and eclipses",
    "B8.4.1.1.2: Investigate the laws of reflection using plane mirrors and construct a pinhole camera or periscope",
    "B8.4.1.1.3: Demonstrate refraction of light through glass blocks and prisms explaining dispersion into a spectrum"
  ],
  "Science:B8.4.2.1": [
    "B8.4.2.1.1: Identify basic electronic components (resistors, diodes, capacitors, LEDs, transistors) and their schematic symbols",
    "B8.4.2.1.2: Assemble basic electronic circuit boards showing rectification and LED illumination",
    "B8.4.2.1.3: Explain the safety rules when handling household electrical equipment and fuses"
  ],
  "Science:B8.4.3.1": [
    "B8.4.3.1.1: Calculate the efficiency of simple machines (levers, pulleys, inclined planes): Efficiency = (Work Output / Work Input) × 100%",
    "B8.4.3.1.2: Investigate ways of reducing energy losses in mechanical systems (lubrication, streamlining)",
    "B8.4.3.1.3: Design an energy-efficient cookstove using clay and local biomass fuels"
  ],
  "Science:B8.4.4.1": [
    "B8.4.4.1.1: Define speed and velocity, state SI units (m/s), and solve simple motion calculations",
    "B8.4.4.1.2: Plot and interpret distance-time and velocity-time graphs for uniform motion",
    "B8.4.4.1.3: State Newton's First Law of Motion (Inertia) and relate it to passenger safety in motor vehicles (seatbelts)"
  ],
  "Science:B8.4.5.1": [
    "B8.4.5.1.1: Identify harvesting and processing tools (sickles, secateurs, knapsack sprayers, mist blowers)",
    "B8.4.5.1.2: Demonstrate calibration and safe spraying operation using knapsack sprayers with protective personal equipment (PPE)",
    "B8.4.5.1.3: Assemble and replace worn-out parts of simple farm tools (handles, bolts, washers)"
  ],
  "Science:B9.4.1.1": [
    "B9.4.1.1.1: Construct simple series and parallel electrical circuits and measure voltage and current",
    "B9.4.1.1.2: Apply Ohm's Law (V = IR) to solve simple numerical problems",
    "B9.4.1.1.3: Explain electrical safety precautions and calculate household electricity consumption in kilowatt-hours (kWh)"
  ],
  "Science:B9.4.2.1": [
    "B9.4.2.1.1: Explain magnetic fields around current-carrying conductors and electromagnets",
    "B9.4.2.1.2: Demonstrate the working principle of electric motors, dynamos, and transformers",
    "B9.4.2.1.3: Trace the national electrical power grid in Ghana from generation (Akosombo, Bui) to domestic distribution"
  ],
  "Science:B9.4.3.1": [
    "B9.4.3.1.1: Analyze thermal energy dissipation and heat losses in industrial and home appliances",
    "B9.4.3.1.2: Evaluate thermal insulation materials in building architecture to reduce cooling energy demand",
    "B9.4.3.1.3: Audit school energy consumption and formulate an institutional energy conservation policy"
  ],
  "Science:B9.4.4.1": [
    "B9.4.4.1.1: State and apply Newton's Second Law of Motion (F = ma) in solving numerical problems",
    "B9.4.4.1.2: State Newton's Third Law of Motion (Action and Reaction) and explain rocket propulsion and swimming",
    "B9.4.4.1.3: Define linear momentum (p = mv) and the principle of conservation of momentum in collisions"
  ],
  "Science:B9.4.5.1": [
    "B9.4.5.1.1: Identify tractor-drawn implements (ploughs, harrows, ridgers, seed drills) and their functions in farm mechanization",
    "B9.4.5.1.2: Discuss routine maintenance and safety regulations regarding motorized agricultural machinery",
    "B9.4.5.1.3: Compare cost-benefit and soil conservation impacts of manual versus mechanized farming"
  ],
  "Science:B7.5.1.1": [
    "B7.5.1.1.1: Identify sources and types of water pollution and discuss their effects on aquatic life and human health",
    "B7.5.1.1.2: Demonstrate simple and affordable methods of water purification (boiling, chlorination, filtration)",
    "B7.5.1.1.3: Design a community advocacy message promoting responsible water conservation and hygiene"
  ],
  "Science:B7.5.2.1": [
    "B7.5.2.1.1: Distinguish between infectious (communicable) and non-infectious diseases with examples",
    "B7.5.2.1.2: Describe transmission paths of water-borne and vector-borne diseases (cholera, typhoid, malaria)",
    "B7.5.2.1.3: Practice proper personal hygiene and food safety standards to prevent disease transmission"
  ],
  "Science:B7.5.3.1": [
    "B7.5.3.1.1: Identify indigenous Ghanaian technologies (black soap making, shea butter extraction, pottery, kente weaving)",
    "B7.5.3.1.2: Explain the underlying scientific principles (saponification, thermal processing, crystallization) in indigenous industries",
    "B7.5.3.1.3: Propose scientific improvements to enhance quality, hygiene, and efficiency in indigenous production"
  ],
  "Science:B7.5.4.1": [
    "B7.5.4.1.1: Explain the greenhouse effect and list primary greenhouse gases (carbon dioxide, methane, nitrous oxide)",
    "B7.5.4.1.2: Describe global warming and its visible consequences in Ghana (rising temperatures, sea level rise in coastal areas)",
    "B7.5.4.1.3: Plant trees and implement energy-saving practices in school to reduce carbon footprints"
  ],
  "Science:B7.5.5.1": [
    "B7.5.5.1.1: Describe the physical environment and identify living and non-living components of natural habitats",
    "B7.5.5.1.2: Identify environmental sanitation challenges in rural and urban Ghanaian communities",
    "B7.5.5.1.3: Formulate a school environmental sanitation pledge and weekly cleanup roster"
  ],
  "Science:B7.5.6.1": [
    "B7.5.6.1.1: Collect and classify soil samples into sand, silt, and clay using touch and feel ribbon tests",
    "B7.5.6.1.2: Investigate physical properties of soil: texture, structure, porosity, and drainage capacity",
    "B7.5.6.1.3: Demonstrate soil capillarity and water retention in sand, loam, and clay soils"
  ],
  "Science:B8.5.1.1": [
    "B8.5.1.1.1: Identify causes, effects, and prevention of soil erosion and soil degradation in agricultural communities",
    "B8.5.1.1.2: Demonstrate soil conservation practices (mulching, cover cropping, terracing, contour ploughing)",
    "B8.5.1.1.3: Analyze the impact of illegal mining (galamsey) on arable land and water bodies in Ghana"
  ],
  "Science:B8.5.2.1": [
    "B8.5.2.1.1: Identify causes, signs, and prevention of lifestyle diseases (hypertension, obesity, type 2 diabetes)",
    "B8.5.2.1.2: Discuss transmission, symptoms, and stigma reduction for HIV/AIDS and other STIs",
    "B8.5.2.1.3: Promote mental health awareness, stress management, and emotional well-being among adolescents"
  ],
  "Science:B8.5.3.1": [
    "B8.5.3.1.1: Describe industrial fermentation processes in gari processing, brewing, and cocoa bean curing",
    "B8.5.3.1.2: Investigate food preservation technologies (smoking, salting, drying, canning) used in Ghanaian markets",
    "B8.5.3.1.3: Assess occupational health and safety standards in local agro-processing factories"
  ],
  "Science:B8.5.4.1": [
    "B8.5.4.1.1: Analyze climate change impacts on agriculture, rainfall patterns, and food security in Ghana",
    "B8.5.4.1.2: Distinguish between climate change adaptation and climate change mitigation strategies",
    "B8.5.4.1.3: Create an advocacy campaign on green economy principles and circular economic models"
  ],
  "Science:B8.5.5.1": [
    "B8.5.5.1.1: Investigate the causes, environmental destruction, and toxic chemical contamination (mercury, cyanide) from galamsey",
    "B8.5.5.1.2: Assess the pollution of major Ghanaian river basins (Pra, Birim, Ankobra) and its socio-economic impact",
    "B8.5.5.1.3: Propose policy, technological, and community enforcement solutions to curb illegal mining"
  ],
  "Science:B8.5.6.1": [
    "B8.5.6.1.1: Analyze soil chemical properties including soil pH, organic matter content, and nutrient levels (NPK)",
    "B8.5.6.1.2: Test soil pH using universal indicator paper or soil test kits and recommend corrective measures (liming)",
    "B8.5.6.1.3: Prepare compost and organic manure using crop residues and livestock waste"
  ],
  "Science:B9.5.1.1": [
    "B9.5.1.1.1: Explain the greenhouse effect, global warming, and climate change with observable local evidence in Ghana",
    "B9.5.1.1.2: Analyze the role of greenhouse gas emissions, deforestation, and industrialization in climate change",
    "B9.5.1.1.3: Design community adaptation and mitigation strategies including tree planting and renewable energy adoption"
  ],
  "Science:B9.5.2.1": [
    "B9.5.2.1.1: Explain the physiological and social consequences of substance abuse (alcohol, tramadol, shisha, narcotics)",
    "B9.5.2.1.2: Describe teenage pregnancy risks and reproductive health management in adolescent development",
    "B9.5.2.1.3: Design peer counseling and community health outreach initiatives for school clubs"
  ],
  "Science:B9.5.3.1": [
    "B9.5.3.1.1: Explain heavy chemical and metallurgical industries in Ghana (petroleum refining at TOR, aluminium smelting at VALCO)",
    "B9.5.3.1.2: Assess industrial effluent treatment and pollution control technologies used by manufacturing firms",
    "B9.5.3.1.3: Evaluate the contribution of science and technological innovation to national GDP and economic growth"
  ],
  "Science:B9.5.4.1": [
    "B9.5.4.1.1: Evaluate international climate agreements (Paris Agreement) and Ghana's Nationally Determined Contributions (NDCs)",
    "B9.5.4.1.2: Explore renewable energy transition (solar PV, mini-grids) as climate change solutions",
    "B9.5.4.1.3: Design a youth-led climate action project addressing flood mitigation in peri-urban areas"
  ],
  "Science:B9.5.5.1": [
    "B9.5.5.1.1: Analyze urban sprawl, deforestation, and wetland reclamation impacts on biodiversity loss in Ghana",
    "B9.5.5.1.2: Evaluate the role of the Environmental Protection Agency (EPA) and Forestry Commission in environmental governance",
    "B9.5.5.1.3: Conduct an Environmental Impact Assessment (EIA) for a hypothetical development project"
  ],
  "Science:B9.5.6.1": [
    "B9.5.6.1.1: Identify causes and agents of soil erosion (sheet, rill, gully) and soil nutrient depletion",
    "B9.5.6.1.2: Demonstrate soil conservation measures: contour ploughing, cover cropping, terracing, and windbreaks",
    "B9.5.6.1.3: Rehabilitate degraded and mined-out soils through organic amendments and phytoremediation"
  ],

  // =========================================================================
  // JHS MATHEMATICS (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================
  // Strand 1: Number - Sub-strand 1: Number and Numeration Systems
  "Mathematics:B7.1.1.1": [
    "B7.1.1.1.1: Read, write, and identify the place value of multi-digit numbers up to billions",
    "B7.1.1.1.2: Express large and small numbers in standard form (scientific notation: a × 10ⁿ, where 1 ≤ a < 10)",
    "B7.1.1.1.3: Round whole numbers and decimals to specified place values and significant figures"
  ],
  "Mathematics:B7.1.1.2": [
    "B7.1.1.2.1: Express multi-digit numbers in expanded notation using powers of ten",
    "B7.1.1.2.2: Compare and order integers, decimals, and numbers in standard form on a number line",
    "B7.1.1.2.3: Solve contextual problems involving estimation and rounding in commerce and measurement"
  ],
  "Mathematics:B8.1.1.1": [
    "B8.1.1.1.1: Read, write, and compare numbers in base two (binary) and convert between base ten and base two",
    "B8.1.1.1.2: Perform arithmetic operations on numbers in standard form accurately",
    "B8.1.1.1.3: Solve real-life financial mathematics problems involving simple interest, profit, loss, and discount"
  ],
  "Mathematics:B9.1.1.1": [
    "B9.1.1.1.1: Apply the understanding of place value, rational, and irrational numbers in solving real life problems",
    "B9.1.1.1.2: Calculate compound interest, depreciation, hire purchase, and taxation (VAT, income tax) in Ghanaian currency (GHS)",
    "B9.1.1.1.3: Use indices and laws of indices to simplify algebraic and numerical expressions"
  ],

  // Strand 1: Number - Sub-strand 2: Number Operations
  "Mathematics:B7.1.2.1": [
    "B7.1.2.1.1: Add, subtract, multiply, and divide multi-digit whole numbers and decimals using standard algorithms",
    "B7.1.2.1.2: Apply the order of operations (BODMAS/PEMDAS) correctly in evaluating multi-operation expressions",
    "B7.1.2.1.3: Solve multi-step word problems involving commercial transactions and practical applications"
  ],
  "Mathematics:B7.1.2.2": [
    "B7.1.2.2.1: Express composite numbers as products of their prime factors using factor trees and repeated division",
    "B7.1.2.2.2: Determine the Highest Common Factor (HCF) and Least Common Multiple (LCM) of numbers",
    "B7.1.2.2.3: Apply HCF and LCM in solving real-life grouping, partitioning, and scheduling problems"
  ],
  "Mathematics:B8.1.2.1": [
    "B8.1.2.1.1: Perform addition, subtraction, multiplication, and division on directed numbers (integers)",
    "B8.1.2.1.2: Apply the properties of operations (commutative, associative, distributive) to simplify computations",
    "B8.1.2.1.3: Solve multi-step problems involving temperatures, bank balances, elevation, and financial ledgers"
  ],
  "Mathematics:B9.1.2.1": [
    "B9.1.2.1.1: Apply properties of real numbers to simplify arithmetic and algebraic computations",
    "B9.1.2.1.2: Perform operations on surds in simple form (addition, subtraction, multiplication)",
    "B9.1.2.1.3: Use mental math strategies and estimation to check the plausibility of numerical calculations"
  ],

  // Strand 1: Number - Sub-strand 3: Fractions, Decimals and Percentages
  "Mathematics:B7.1.3.1": [
    "B7.1.3.1.1: Convert fluently between common fractions, decimal fractions, and percentages",
    "B7.1.3.1.2: Compare and order fractions with unlike denominators using equivalent fractions and number lines",
    "B7.1.3.1.3: Perform addition, subtraction, multiplication, and division of proper, improper, and mixed fractions"
  ],
  "Mathematics:B7.1.3.2": [
    "B7.1.3.2.1: Calculate percentages of quantities and express one quantity as a percentage of another",
    "B7.1.3.2.2: Calculate profit, loss, profit percentage, loss percentage, and simple discount in trade transactions",
    "B7.1.3.2.3: Solve practical consumer arithmetic problems in market shopping and household budgeting"
  ],
  "Mathematics:B8.1.3.1": [
    "B8.1.3.1.1: Calculate percentage increase and percentage decrease in commercial and demographic contexts",
    "B8.1.3.1.2: Calculate Simple Interest using I = (P × R × T) / 100, Principal, Rate, Time, and Total Amount",
    "B8.1.3.1.3: Calculate Sales Tax, Value Added Tax (VAT), and NHIL on goods and services in Ghana"
  ],
  "Mathematics:B9.1.3.1": [
    "B9.1.3.1.1: Calculate compound interest using step-by-step annual calculation and compound interest formula",
    "B9.1.3.1.2: Solve depreciation problems on vehicles, equipment, and electronics over multiple years",
    "B9.1.3.1.3: Calculate total cost and interest under hire purchase agreements and evaluate financial options"
  ],

  // Strand 1: Number - Sub-strand 4: Number: Ratios and Proportion
  "Mathematics:B7.1.4.1": [
    "B7.1.4.1.1: Express comparisons between quantities as ratios and simplify ratios to lowest terms",
    "B7.1.4.1.2: Divide a given quantity into two or three parts according to a specified ratio",
    "B7.1.4.1.3: Solve word problems involving sharing profits, inheritance, mixing ingredients, and scale models"
  ],
  "Mathematics:B7.1.4.2": [
    "B7.1.4.2.1: Distinguish between direct and inverse proportions using tables and unitary methods",
    "B7.1.4.2.2: Solve direct proportion problems involving cost, distance, time, and fuel consumption",
    "B7.1.4.2.3: Solve inverse proportion problems involving worker-hours, pump filling rates, and speed-time"
  ],
  "Mathematics:B8.1.4.1": [
    "B8.1.4.1.1: Apply ratios to calculate real distances from map scales (linear scale, representative fraction 1:n)",
    "B8.1.4.1.2: Calculate average speed, distance, and travel time using proportional reasoning",
    "B8.1.4.1.3: Compare unit prices across different package sizes to determine the best consumer value"
  ],
  "Mathematics:B9.1.4.1": [
    "B9.1.4.1.1: Solve compound proportion problems involving multi-variable work, men, and days",
    "B9.1.4.1.2: Perform foreign currency exchange rate conversions (GHS to USD, GBP, EUR) including bank charges",
    "B9.1.4.1.3: Calculate partnership profit sharing based on variable capital investments and time periods"
  ],

  // Strand 2: Algebra - Sub-strand 1: Patterns and Relationships
  "Mathematics:B7.2.1.1": [
    "B7.2.1.1.1: Derive the rule for a set of points of a relation and generate number sequences from given patterns",
    "B7.2.1.1.2: Identify linear patterns and describe relations verbally and algebraically",
    "B7.2.1.1.3: Extend numeric and geometric patterns and find missing terms in linear sequences"
  ],
  "Mathematics:B8.2.1.1": [
    "B8.2.1.1.1: Determine the gradient (slope) and y-intercept of a straight line from tables of values and graphs",
    "B8.2.1.1.2: Construct tables of values and graph linear relations of the form y = mx + c on the Cartesian plane",
    "B8.2.1.1.3: Interpret the real-life meaning of slope and intercepts in distance-time and rate graphs"
  ],
  "Mathematics:B9.2.1.1": [
    "B9.2.1.1.1: Construct tables of values for pairs of linear relations and graph simultaneous equations on the coordinate plane",
    "B9.2.1.1.2: Locate and interpret the intersection point of two linear graphs as the unique solution",
    "B9.2.1.1.3: Model real-world break-even points and financial comparisons using linear relation graphs"
  ],

  // Strand 2: Algebra - Sub-strand 2: Algebraic Expressions
  "Mathematics:B7.2.2.1": [
    "B7.2.2.1.1: Formulate algebraic expressions from word problems and translate expressions into verbal phrases",
    "B7.2.2.1.2: Simplify algebraic expressions by grouping like terms and expanding single brackets: a(b + c)",
    "B7.2.2.1.3: Substitute numerical values into algebraic expressions and formulas to evaluate outcomes"
  ],
  "Mathematics:B8.2.2.1": [
    "B8.2.2.1.1: Expand products of two binomials: (a + b)(c + d) and (ax + b)(cx + d)",
    "B8.2.2.1.2: Factorize algebraic expressions using common monomial factors and grouping techniques",
    "B8.2.2.1.3: Apply algebraic identities including the difference of two squares: a² - b² = (a - b)(a + b)"
  ],
  "Mathematics:B9.2.2.1": [
    "B9.2.2.1.1: Factorize quadratic expressions of the form x² + bx + c and ax² + bx + c",
    "B9.2.2.1.2: Simplify rational algebraic fractions by factorizing numerator and denominator",
    "B9.2.2.1.3: Solve quadratic equations using factor method and quadratic formula"
  ],

  // Strand 2: Algebra - Sub-strand 3: Variables and Equations
  "Mathematics:B7.2.3.1": [
    "B7.2.3.1.1: Solve linear equations in one variable of the forms ax + b = c and ax + b = cx + d",
    "B7.2.3.1.2: Clear fractional coefficients from linear equations and find unknown values",
    "B7.2.3.1.3: Formulate linear equations from practical scenarios, solve for unknowns, and verify solutions"
  ],
  "Mathematics:B8.2.3.1": [
    "B8.2.3.1.1: Solve linear inequalities in one variable with integer coefficients",
    "B8.2.3.1.2: Represent solution sets of linear inequalities on a number line using open and closed boundary circles",
    "B8.2.3.1.3: Solve practical problems involving inequality constraints and thresholds"
  ],
  "Mathematics:B9.2.3.1": [
    "B9.2.3.1.1: Solve simultaneous linear equations in two variables using the elimination method",
    "B9.2.3.1.2: Solve simultaneous linear equations in two variables using the substitution method",
    "B9.2.3.1.3: Formulate and solve simultaneous equations arising from commerce, geometry, and real-life scenarios"
  ],

  // Strand 3: Geometry and Measurement - Sub-strand 1: Shapes and Space
  "Mathematics:B7.3.1.1": [
    "B7.3.1.1.1: Identify and classify angles (acute, right, obtuse, straight, reflex) and measure them using a protractor",
    "B7.3.1.1.2: Calculate unknown angles on a straight line, vertically opposite angles, and angles at a point",
    "B7.3.1.1.3: Calculate interior and exterior angles of regular and irregular polygons"
  ],
  "Mathematics:B8.3.1.1": [
    "B8.3.1.1.1: Construct angles of 60°, 90°, 45°, 30°, and 75° using only a pair of compasses and a ruler",
    "B8.3.1.1.2: Construct triangles and quadrilaterals from given dimensions using geometric instruments",
    "B8.3.1.1.3: Investigate angle properties of parallel lines intersected by transversals (alternate, corresponding, interior angles)"
  ],
  "Mathematics:B9.3.1.1": [
    "B9.3.1.1.1: Apply circle theorems to find unknown angles subtended at center and circumference",
    "B9.3.1.1.2: Solve three-figure bearing problems and construct scale drawings",
    "B9.3.1.1.3: Represent vectors in column form, find magnitude, and perform vector addition and scalar multiplication"
  ],

  // Strand 3: Geometry and Measurement - Sub-strand 2: Measurement
  "Mathematics:B7.3.2.1": [
    "B7.3.2.1.1: Calculate perimeter and area of squares, rectangles, triangles, and parallelograms",
    "B7.3.2.1.2: Derive and apply formulas for circumference (C = 2πr) and area of a circle (A = πr²)",
    "B7.3.2.1.3: Calculate perimeter and area of composite plane shapes made up of rectangles and semicircles"
  ],
  "Mathematics:B8.3.2.1": [
    "B8.3.2.1.1: Calculate surface area and volume of cubes, cuboids, and right triangular prisms",
    "B8.3.2.1.2: Calculate total surface area and volume of right circular cylinders using standard formulas",
    "B8.3.2.1.3: Convert between units of volume and capacity (cm³, m³, liters, milliliters) in practical problem solving"
  ],
  "Mathematics:B9.3.2.1": [
    "B9.3.2.1.1: State and verify Pythagoras' theorem: a² + b² = c² for right-angled triangles",
    "B9.3.2.1.2: Calculate unknown side lengths of right-angled triangles in 2D and 3D practical configurations",
    "B9.3.2.1.3: Calculate surface area and volume of cones, pyramids, and spheres in real-world contexts"
  ],

  // Strand 3: Geometry and Measurement - Sub-strand 3: Position and Transformation
  "Mathematics:B7.3.3.1": [
    "B7.3.3.1.1: Plot points in all four quadrants of the Cartesian coordinate plane from given ordered pairs (x, y)",
    "B7.3.3.1.2: Determine coordinates of vertices of geometric shapes drawn on the coordinate grid",
    "B7.3.3.1.3: Find the coordinates of the midpoint of a line segment connecting two points"
  ],
  "Mathematics:B8.3.3.1": [
    "B8.3.3.1.1: Perform translation of 2D shapes by a translation vector (x, y) on the coordinate plane",
    "B8.3.3.1.2: Perform reflection of points and shapes in the x-axis, y-axis, and line y = x",
    "B8.3.3.1.3: Perform rotation of shapes about the origin through 90°, 180°, and 270° clockwise and counterclockwise"
  ],
  "Mathematics:B9.3.3.1": [
    "B9.3.3.1.1: Perform enlargement of shapes with positive integer and fractional scale factors from a given center",
    "B9.3.3.1.2: Determine scale factors and centers of enlargement from original and image figures",
    "B9.3.3.1.3: Relate area of image to area of object using scale factor squared (k²)"
  ],

  // Strand 4: Handling Data - Sub-strand 1: Data
  "Mathematics:B7.4.1.1": [
    "B7.4.1.1.1: Collect, organize, and record discrete data using tally charts and frequency tables",
    "B7.4.1.1.2: Represent data using pictograms, bar graphs, and pie charts with appropriate scales and keys",
    "B7.4.1.1.3: Calculate the mean, median, mode, and range of ungrouped data and interpret their meanings"
  ],
  "Mathematics:B8.4.1.1": [
    "B8.4.1.1.1: Construct grouped frequency tables and represent grouped data using histograms and frequency polygons",
    "B8.4.1.1.2: Calculate the mean from grouped frequency distributions using class midpoints",
    "B8.4.1.1.3: Determine the modal class and median class from grouped frequency distributions"
  ],
  "Mathematics:B9.4.1.1": [
    "B9.4.1.1.1: Analyze two-way tables and calculate probabilities of combined and mutually exclusive events",
    "B9.4.1.1.2: Construct and interpret cumulative frequency curves (ogives) to estimate medians, quartiles, and percentiles",
    "B9.4.1.1.3: Conduct statistical investigations, analyze sample bias, and communicate findings through data reports"
  ],

  // Strand 4: Handling Data - Sub-strand 2: Chance or Probability
  "Mathematics:B7.4.2.1": [
    "B7.4.2.1.1: Describe the probability of events using descriptive terms: impossible, unlikely, equally likely, likely, certain",
    "B7.4.2.1.2: Place probability of everyday events on a numerical scale from 0 to 1",
    "B7.4.2.1.3: Conduct simple chance experiments (flipping a coin, rolling a die) and record frequency of outcomes"
  ],
  "Mathematics:B8.4.2.1": [
    "B8.4.2.1.1: Calculate experimental probability from experimental trials and compare with theoretical probability",
    "B8.4.2.1.2: Calculate theoretical probability of single events: P(E) = Number of Favorable Outcomes / Total Outcomes",
    "B8.4.2.1.3: Solve probability problems involving playing cards, colored marbles in bags, and numbered spinners"
  ],
  "Mathematics:B9.4.2.1": [
    "B9.4.2.1.1: List sample spaces for combined events using two-way tables, grid diagrams, and tree diagrams",
    "B9.4.2.1.2: Calculate probabilities of independent events using the multiplication rule: P(A and B) = P(A) × P(B)",
    "B9.4.2.1.3: Calculate probabilities of mutually exclusive events using the addition rule: P(A or B) = P(A) + P(B)"
  ],

  // =========================================================================
  // JHS SOCIAL STUDIES (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================
  "Social Studies:B7.1.1.1": [
    "B7.1.1.1.1: Examine environmental degradation in Ghana including deforestation, soil erosion, and water pollution",
    "B7.1.1.1.2: Assess the causes and impacts of illegal small-scale mining (galamsey) on agricultural land and rivers",
    "B7.1.1.1.3: Formulate individual and community action plans to conserve the local environment"
  ],
  "Social Studies:B8.1.1.1": [
    "B8.1.1.1.1: Explain the importance of biodiversity and wildlife conservation in national parks and reserves in Ghana",
    "B8.1.1.1.2: Analyze waste management challenges in urban centers and advocate sustainable sanitation habits",
    "B8.1.1.1.3: Propose enforcement strategies for local assembly environmental bye-laws"
  ],
  "Social Studies:B9.1.1.1": [
    "B9.1.1.1.1: Assess global climate change impacts on rainfall patterns and coastal erosion in Ghanaian communities",
    "B9.1.1.1.2: Evaluate national policies and international agreements on climate mitigation and sustainable development",
    "B9.1.1.1.3: Lead community tree-planting campaigns and renewable energy awareness projects"
  ],
  "Social Studies:B7.2.1.1": [
    "B7.2.1.1.1: Describe physical, emotional, and social changes during adolescence and puberty",
    "B7.2.1.1.2: Analyze the causes, consequences, and prevention of adolescent reproductive health challenges (teenage pregnancy, STIs)",
    "B7.2.1.1.3: Demonstrate assertiveness and refusal skills in resisting negative peer pressure"
  ],
  "Social Studies:B8.2.1.1": [
    "B8.2.1.1.1: Examine the functions and responsibilities of the family as the basic social institution",
    "B8.2.1.1.2: Compare the traditional extended family system with the contemporary nuclear family in Ghana",
    "B8.2.1.1.3: Identify causes of family breakdowns and suggest conflict resolution mechanisms"
  ],
  "Social Studies:B9.2.1.1": [
    "B9.2.1.1.1: Analyze the population structure and growth trends in Ghana and their socio-economic implications",
    "B9.2.1.1.2: Discuss the impacts of rapid rural-urban migration on rural agriculture and urban infrastructure",
    "B9.2.1.1.3: Propose population management and youth employment initiatives for sustainable development"
  ],
  "Social Studies:B7.3.1.1": [
    "B7.3.1.1.1: Explore personal self-identity, capabilities, values, and vision for personal development",
    "B7.3.1.1.2: Explain the significance of cultural elements (language, dress, food, festivals) in defining Ghanaian national identity",
    "B7.3.1.1.3: Demonstrate respect for ethnic, cultural, and religious diversity in school and the community"
  ],
  "Social Studies:B8.3.1.1": [
    "B8.3.1.1.1: Examine traditional and contemporary leadership systems (chieftaincy, district assemblies) in Ghana",
    "B8.3.1.1.2: Discuss the duties and civic responsibilities of Ghanaian citizens as stipulated in the 1992 Constitution",
    "B8.3.1.1.3: Role-play community development mobilization and volunteerism"
  ],
  "Social Studies:B9.3.1.1": [
    "B9.3.1.1.1: Evaluate the contributions of Ghanaian national icons and pioneers in politics, education, and science",
    "B9.3.1.1.2: Analyze the role of national symbols (the Coat of Arms, National Flag, National Anthem) in fostering unity",
    "B9.3.1.1.3: Exhibit patriotism and integrity in national affairs and community service"
  ],
  "Social Studies:B7.4.1.1": [
    "B7.4.1.1.1: Explain the fundamental human rights and freedoms guaranteed under Chapter 5 of the 1992 Constitution",
    "B7.4.1.1.2: Identify human rights abuses (child labor, domestic violence, human trafficking) and redress agencies (CHRAJ, DOVVSU)",
    "B7.4.1.1.3: Demonstrate democratic principles and tolerance in student council governance and classroom debates"
  ],
  "Social Studies:B8.4.1.1": [
    "B8.4.1.1.1: Identify the causes and effects of conflicts in families, schools, and traditional communities in Ghana",
    "B8.4.1.1.2: Demonstrate non-violent conflict resolution skills including negotiation, mediation, and reconciliation",
    "B8.4.1.1.3: Assess the role of security agencies (Police, Armed Forces) in maintaining peace and order"
  ],
  "Social Studies:B9.4.1.1": [
    "B9.4.1.1.1: Explain the separation of powers and checks and balances among the Executive, Legislature, and Judiciary in Ghana",
    "B9.4.1.1.2: Analyze the electoral process and the role of the Electoral Commission in ensuring credible democratic elections",
    "B9.4.1.1.3: Discuss ways to strengthen democratic institutions and political stability in Ghana"
  ],
  "Social Studies:B7.5.1.1": [
    "B7.5.1.1.1: Explain the concept of human resource development and the importance of education and skill training",
    "B7.5.1.1.2: Identify work ethics and attitudes required for productivity and national development",
    "B7.5.1.1.3: Create a career plan aligned with personal interests and national human resource needs"
  ],
  "Social Studies:B8.5.1.1": [
    "B8.5.1.1.1: Examine the role of financial institutions and social security schemes (SSNIT, pensions) in financial security",
    "B8.5.1.1.2: Discuss the contributions of tourism, arts, and creative industries to Ghana's foreign exchange earnings",
    "B8.5.1.1.3: Design a marketing strategy for a local tourist attraction in the district"
  ],
  "Social Studies:B9.5.1.1": [
    "B9.5.1.1.1: Analyze the role of science, technology, and digitalization in transforming Ghana's economy",
    "B9.5.1.1.2: Evaluate government economic development policies (One District One Factory, Planting for Food and Jobs)",
    "B9.5.1.1.3: Propose youth-led entrepreneurial ventures that address community needs and generate employment"
  ],

  // =========================================================================
  // JHS COMPUTING (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================
  "Computing:B7.1.1.1": [
    "B7.1.1.1.1: Identify and describe the evolution of computers across the five generations (vacuum tubes to AI)",
    "B7.1.1.1.2: Classify computer hardware into input, processing, storage, and output devices with examples",
    "B7.1.1.1.3: Demonstrate safe start-up, shut-down, and mouse and keyboard techniques"
  ],
  "Computing:B8.1.1.1": [
    "B8.1.1.1.1: Explain internal computer hardware components (CPU, RAM, ROM, Motherboard, Power Supply Unit)",
    "B8.1.1.1.2: Differentiate between system software (Operating Systems) and application software",
    "B8.1.1.1.3: Perform basic file management tasks including creating folders, renaming, moving, and backing up files"
  ],
  "Computing:B9.1.1.1": [
    "B9.1.1.1.1: Evaluate emerging computer technologies (cloud computing, Internet of Things, Artificial Intelligence)",
    "B9.1.1.1.2: Troubleshoot common computer hardware and software faults and perform preventive maintenance",
    "B9.1.1.1.3: Discuss electronic waste (e-waste) hazards and environmentally safe disposal methods"
  ],
  "Computing:B7.2.1.1": [
    "B7.2.1.1.1: Launch a word processing application (MS Word / Google Docs) and identify key interface elements (ribbons, tabs, ruler)",
    "B7.2.1.1.2: Enter text, format fonts (size, style, color), and align paragraphs (left, right, center, justify)",
    "B7.2.1.1.3: Insert and format tables, shapes, and clip arts to enhance document presentation"
  ],
  "Computing:B8.2.1.1": [
    "B8.2.1.1.1: Apply advanced document formatting including headers, footers, page numbering, and line spacing",
    "B8.2.1.1.2: Use proofing tools (spelling and grammar check, thesaurus) to edit and refine written text",
    "B8.2.1.1.3: Perform mail merge to generate customized form letters and envelopes"
  ],
  "Computing:B9.2.1.1": [
    "B9.2.1.1.1: Create multi-page structured reports with table of contents, footnotes, and bibliographic citations",
    "B9.2.1.1.2: Design professional resumes, newsletters, and brochures using desktop publishing templates",
    "B9.2.1.1.3: Collaborate on documents online using track changes, commenting, and version history"
  ],
  "Computing:B7.3.1.1": [
    "B7.3.1.1.1: Explain computer network concepts (LAN, WAN, Internet) and network hardware (router, switch, modem)",
    "B7.3.1.1.2: Navigate the World Wide Web using web browsers and search engines with effective keywords",
    "B7.3.1.1.3: Compose, send, and manage email messages with attachments observing netiquette"
  ],
  "Computing:B8.3.1.1": [
    "B8.3.1.1.1: Explain cybersecurity concepts: malware, phishing, spyware, viruses, and firewalls",
    "B8.3.1.1.2: Create strong, secure passwords and practice two-factor authentication (2FA)",
    "B8.3.1.1.3: Discuss digital privacy, social media safety, and the legal implications of cyberbullying in Ghana"
  ],
  "Computing:B9.3.1.1": [
    "B9.3.1.1.1: Evaluate intellectual property, copyright laws, and open-source licenses in digital content creation",
    "B9.3.1.1.2: Design simple web pages using basic HTML tags (headings, paragraphs, links, images)",
    "B9.3.1.1.3: Assess the socio-economic impacts of electronic commerce (e-commerce) and mobile money in Ghana"
  ],
  "Computing:B7.4.1.1": [
    "B7.4.1.1.1: Define an algorithm and represent everyday problem-solving steps using flowcharts and pseudocode",
    "B7.4.1.1.2: Use standard flowchart symbols (terminal, process, decision, input/output, flowline)",
    "B7.4.1.1.3: Create simple interactive animations and games using block-based visual programming (Scratch)"
  ],
  "Computing:B8.4.1.1": [
    "B8.4.1.1.1: Implement control structures (sequence, selection/if-else, iteration/loops) in Scratch programming",
    "B8.4.1.1.2: Use variables and operators to accept user input and calculate scores in Scratch projects",
    "B8.4.1.1.3: Debug and test algorithmic logic to fix syntax and logical errors in code"
  ],
  "Computing:B9.4.1.1": [
    "B9.4.1.1.1: Enter data, apply basic formulas (SUM, AVERAGE, MIN, MAX, COUNT), and create charts in MS Excel",
    "B9.4.1.1.2: Explain relational database concepts (tables, records, fields, primary keys) in MS Access",
    "B9.4.1.1.3: Write simple text-based programs using introductory Python syntax (variables, print, input, conditions)"
  ],

  // =========================================================================
  // JHS RME (COMMON CORE PROGRAMME - B7, B8, B9)
  // =========================================================================
  "RME:B7.1.1.1": [
    "B7.1.1.1.1: Narrate the Creation Story according to Christianity, Islam, and African Traditional Religion (ATR)",
    "B7.1.1.1.2: Explain the attributes of God (Omnipotence, Omniscience, Omnipresence, Love, Justice) across the three religions",
    "B7.1.1.1.3: Discuss humanity's divine role as stewards of God's creation and ways to protect the environment"
  ],
  "RME:B8.1.1.1": [
    "B8.1.1.1.1: Examine the purpose and usefulness of living and non-living things created by God",
    "B8.1.1.1.2: Discuss how environmental degradation violates God's mandate for creation care",
    "B8.1.1.1.3: Formulate a code of conduct for environmental preservation based on religious teachings"
  ],
  "RME:B9.1.1.1": [
    "B9.1.1.1.1: Explore scientific theories of the origin of the universe (Big Bang) in relation to religious creation accounts",
    "B9.1.1.1.2: Explain how God's nature inspires human justice, compassion, and moral responsibility",
    "B9.1.1.1.3: Advocate inter-faith dialogue and collaborative community development initiatives among religious groups"
  ],
  "RME:B7.2.1.1": [
    "B7.2.1.1.1: Describe worship practices (prayer, sacrifice, liturgy) in Christianity, Islam, and ATR",
    "B7.2.1.1.2: Explain the moral significance of prayer, meditation, and fasting in personal character building",
    "B7.2.1.1.3: Compare major religious festivals (Easter, Eid-ul-Fitr, Hogbetsotso, Homowo) and their socio-economic benefits"
  ],
  "RME:B8.2.1.1": [
    "B8.2.1.1.1: Describe rites of passage (naming/outdooring, puberty, marriage, death) in the three religions",
    "B8.2.1.1.2: Explain the moral lessons and cultural values embedded in Ghanaian naming and puberty rites (Dipo, Bragoro)",
    "B8.2.1.1.3: Discuss funeral practices and the belief in life after death and ancestral veneration"
  ],
  "RME:B9.2.1.1": [
    "B9.2.1.1.1: Examine religious songs, proverbs, and recitations and their ethical teachings",
    "B9.2.1.1.2: Analyze how religious worship fosters national unity, peace, and tolerance in Ghana",
    "B9.2.1.1.3: Demonstrate respect for sacred spaces, objects, and symbols in all three major religions"
  ],
  "RME:B7.3.1.1": [
    "B7.3.1.1.1: Identify the roles and duties of parents, children, and extended family members in the home",
    "B7.3.1.1.2: Explain the religious basis of obedience, respect, and mutual support in family life",
    "B7.3.1.1.3: Discuss how good family character formation prevents juvenile delinquency in society"
  ],
  "RME:B8.3.1.1": [
    "B8.3.1.1.1: Examine the leadership styles and moral teachings of Moses, Jesus Christ, and Prophet Muhammad (PBUH)",
    "B8.3.1.1.2: Highlight key virtues demonstrated by traditional religious priests, priestesses, and family heads",
    "B8.3.1.1.3: Apply the leadership virtues of integrity, sacrifice, and humility in school prefectship and club activities"
  ],
  "RME:B9.3.1.1": [
    "B9.3.1.1.1: Evaluate the contributions of religious bodies (Christian, Muslim, ATR) to education, healthcare, and social welfare in Ghana",
    "B9.3.1.1.2: Analyze religion's role in promoting peace, reconciliation, and democratic governance",
    "B9.3.1.1.3: Design a youth inter-religious peace forum addressing community peaceful coexistence"
  ],
  "RME:B7.4.1.1": [
    "B7.4.1.1.1: Explain good manners, etiquette, and greetings across Ghanaian cultures and religious traditions",
    "B7.4.1.1.2: Differentiate between acceptable and unacceptable societal behaviors (truthfulness, honesty vs. lying, stealing)",
    "B7.4.1.1.3: Practice moral decision-making when confronted with moral dilemmas"
  ],
  "RME:B8.4.1.1": [
    "B8.4.1.1.1: Examine the religious and moral perspectives on hard work, entrepreneurship, and productivity",
    "B8.4.1.1.2: Discuss the destructive effects of bribery, corruption, and embezzlement on national progress",
    "B8.4.1.1.3: Uphold financial transparency and accountability in managing class dues and student finances"
  ],
  "RME:B9.4.1.1": [
    "B9.4.1.1.1: Analyze the concepts of reward, punishment, repentance, and forgiveness across the three religions",
    "B9.4.1.1.2: Examine religious teachings on peaceful coexistence, human dignity, and reconciliation",
    "B9.4.1.1.3: Resolve interpersonal conflicts using religious teachings on love, mercy, and restorative justice"
  ],

  // =========================================================================
  // PRIMARY ENGLISH (BASIC 1 - BASIC 6)
  // =========================================================================
  "English:B1.2.7.1": [
    "B1.2.7.1.1: Answer simple literal comprehension questions (who, what, where) about shared read-aloud stories",
    "B1.2.7.1.2: Point to illustrations in picture storybooks that answer specific comprehension questions",
    "B1.2.7.1.3: Retell main events of a story in correct chronological sequence with teacher guidance"
  ],
  "English:B2.2.7.1": [
    "B2.2.7.1.1: Make predictions about what will happen next in a story based on title, cover, and illustrations",
    "B2.2.7.1.2: Answer inferential 'why' and 'how' questions about characters' feelings and actions",
    "B2.2.7.1.3: Identify the main character and setting in simple illustrated storybooks"
  ],
  "English:B3.2.7.1": [
    "B3.2.7.1.1: Identify the main idea and supporting details in short grade-level informational and narrative passages",
    "B3.2.7.1.2: Distinguish between reality and fantasy/make-believe in children's literature",
    "B3.2.7.1.3: Answer literal, inferential, and personal response questions about printed passages"
  ],
  "English:B5.2.7.1": [
    "B5.2.7.1.1: Compare and contrast themes, characters, and settings across multiple stories on similar topics",
    "B5.2.7.1.2: Distinguish between facts and opinions in informational reading materials",
    "B5.2.7.1.3: Draw conclusions and substantiate answers with explicit citations from the text"
  ],
  "English:B6.2.7.1": [
    "B6.2.7.1.1: Critically evaluate arguments, evidence, and perspectives in complex expository and literary texts",
    "B6.2.7.1.2: Analyze how character traits, conflicts, and author's tone drive the thematic resolution of a story",
    "B6.2.7.1.3: Formulate thoughtful personal critiques of authors' styles and moral messages in texts"
  ],
  "English:B1.1.6.1": [
    "B1.1.6.1.1: Introduce oneself and exchange polite greetings with classmates and teachers",
    "B1.1.6.1.2: Participate in simple classroom conversations taking turns speaking without interrupting",
    "B1.1.6.1.3: Express basic personal needs, likes, and dislikes clearly in complete sentences"
  ],
  "English:B2.1.6.1": [
    "B2.1.6.1.1: Engage in everyday social conversations using polite expressions (please, thank you, excuse me)",
    "B2.1.6.1.2: Describe family members, daily routines, and familiar community landmarks to peers",
    "B2.1.6.1.3: Maintain focus on a conversation topic and ask relevant follow-up questions"
  ],
  "English:B3.1.6.1": [
    "B3.1.6.1.1: Converse on diverse thematic topics (health, environment, culture) expressing clear opinions",
    "B3.1.6.1.2: Contribute constructively in small group project discussions respecting others' views",
    "B3.1.6.1.3: Give and follow multi-step oral directions during classroom collaborative tasks"
  ],
  "English:B5.1.6.1": [
    "B5.1.6.1.1: Lead and sustain academic conversations on school and national community events with clarity",
    "B5.1.6.1.2: Use evidence and reasoned arguments to persuade peers during informal classroom debates",
    "B5.1.6.1.3: Synthesize group members' oral contributions and report collective decisions to the class"
  ],
  "English:B6.1.6.1": [
    "B6.1.6.1.1: Participate actively in formal panel discussions and parliamentary-style debates on ethical topics",
    "B6.1.6.1.2: Moderate group discussions ensuring balanced participation and professional discourse",
    "B6.1.6.1.3: Defend complex personal viewpoints diplomatically while refuting opposing arguments respectfully"
  ]
};

/**
 * Normalizes subject names to match database keys
 */
function normalizeSubject(subject?: string): string {
  if (!subject) return '';
  const s = subject.trim().toLowerCase();
  if (s.includes('english')) return 'English';
  if (s.includes('science')) return 'Science';
  if (s.includes('math')) return 'Mathematics';
  if (s.includes('computing') || s.includes('ict')) return 'Computing';
  if (s.includes('social')) return 'Social Studies';
  if (s.includes('rme') || s.includes('religious')) return 'RME';
  return subject.trim();
}

/**
 * Helper to get authoritative indicators for a given standard code and subject.
 * Checks subject-qualified key first (e.g. "English:B7.2.1.1"), then falls back to generic key.
 */
export function getAuthoritativeIndicatorsForStandard(standardCode: string, subject?: string): string[] | null {
  const cleanCode = standardCode.split(':')[0].trim();
  const normSubject = normalizeSubject(subject);

  if (normSubject) {
    const subjectKey = `${normSubject}:${cleanCode}`;
    if (AUTHORITATIVE_INDICATORS[subjectKey]) {
      return AUTHORITATIVE_INDICATORS[subjectKey];
    }
    // Strict isolation: if subject was provided, do NOT fall back to other subjects
    return null;
  }

  // Check code directly if present in map
  if (AUTHORITATIVE_INDICATORS[cleanCode]) {
    return AUTHORITATIVE_INDICATORS[cleanCode];
  }

  // Cross-search ONLY when subject was NOT provided
  for (const [key, inds] of Object.entries(AUTHORITATIVE_INDICATORS)) {
    if (key.endsWith(`:${cleanCode}`)) {
      return inds;
    }
  }

  return null;
}

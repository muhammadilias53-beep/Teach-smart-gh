// Gemini client helper using server-side proxy


export const getLanguageInstruction = (language?: string, bilingualLanguage?: string) => {
  if (!language || language === 'English') {
    return '';
  }

  const isBilingual = language.toLowerCase().includes('bilingual');
  
  // Set the target Ghanaian language
  let targetLanguage = language;
  if (isBilingual) {
    if (bilingualLanguage) {
      targetLanguage = bilingualLanguage;
    } else {
      // Try to parse from language string like "Bilingual (English + Twi)"
      const match = language.match(/Bilingual\s*\(English\s*\+\s*([^)]+)\)/i);
      if (match) {
        targetLanguage = match[1].trim();
      } else {
        targetLanguage = "Twi"; // Default
      }
    }
  }

  if (isBilingual) {
    return `
    CRITICAL MULTILINGUAL REQUIREMENT - BILINGUAL MODE (CONFORMS TO OFFICIAL NaCCA & TeachSmartGH STANDARDS):
    The teacher/learner has selected BILINGUAL MODE (English and Ghanaian Language: ${targetLanguage}).
    You MUST generate all instructional content, titles, summaries, explanations, descriptions, activities, exercises, questions, and marking schemes in BOTH languages using the following structure:
    1. English version FIRST.
    2. Followed immediately by the equivalent translation in ${targetLanguage}.
    
    Structure example for titles, headers, and descriptions:
    **English:**
    [Detailed content in elegant English...]
    
    **${targetLanguage} Translation:**
    [Detailed content translated fully, grammatically correctly, and culturally appropriately in ${targetLanguage}...]
    
    Ensure that this layout is applied consistently across all parts, sections, steps, and exercises. Do not skip translations or mix them into a single paragraph. Keep them clearly demarcated. Do NOT use word-for-word robotic literal translation; write naturally in both languages.
    `;
  } else {
    return `
    CRITICAL MULTILINGUAL REQUIREMENT - MONOLINGUAL GHANAIAN LANGUAGE Mode (CONFORMS TO OFFICIAL NaCCA & TeachSmartGH STANDARDS):
    The teacher/learner has selected MONOLINGUAL mode in the Ghanaian language: ${targetLanguage}.
    You MUST generate the entire content—including all headers, titles, instructional steps, bullet points, checklists, worksheets, explanations, keywords, questions, answers, and assessments—ENTIRELY in the ${targetLanguage} language.
    You are STRICTLY FORBIDDEN from writing any part of this document/material in the English language (except for official curriculum codes like B7.1.1.1.1 or universally recognized symbols).
    Ensure the spelling, grammar, orthography, tones, and cultural context are 100% authentic and correct for ${targetLanguage}. Do not provide English translations. The teacher and student must see only ${targetLanguage}.
    `;
  }
};

export const generateLessonPlan = async (
  prompt: string, 
  teacherInfo?: { school?: string, district?: string, town?: string, region?: string, isBstemSchool?: boolean },
  language?: string,
  bilingualLanguage?: string
) => {
  const isGhanaianLanguage = prompt.toLowerCase().includes('ghanaian language') || prompt.toLowerCase().includes('ghanaian languages') || prompt.toLowerCase().includes('ghanaian') || (language && language !== 'English');
  let selectedLanguage = "";
  if (isGhanaianLanguage) {
    if (language && language !== 'English') {
      selectedLanguage = language.toLowerCase().includes('bilingual') ? (bilingualLanguage || 'Twi') : language;
    } else {
      const match = prompt.match(/Ghanaian Language \(([^)]+)\)/i);
      if (match) {
        selectedLanguage = match[1];
      } else {
        const match2 = prompt.match(/\((Dagaare|Dagbani|Dangme|Ewe|Fante|Ga|Gonja|Kasem|Nzema|Twi \(Akuapem\)|Twi \(Asante\))\)/i);
        if (match2) {
          selectedLanguage = match2[1];
        }
      }
    }
  }

  const systemInstruction = `
    You are an expert Ghanaian teacher and curriculum consultant strictly following the NaCCA (National Council for Curriculum and Assessment) Standard-Based Curriculum (SBC) and Common Core Programme (CCP) for 2024/2025.
    Generate content that is 100% compliant with the latest Ghanaian educational standards as seen in official Strategic Schemes of Learning and Curriculum Handbooks.
    
    ${language && language !== 'English' ? getLanguageInstruction(language, bilingualLanguage) : (isGhanaianLanguage && selectedLanguage ? `
    CRITICAL LANGUAGE REQUIREMENT (CONFORMS TO OFFICIAL NaCCA GUIDELINES):
    The lesson subject is specifically the Ghanaian Language: ${selectedLanguage}.
    You MUST generate the entire lesson plan—including the title, performance indicators, keywords, phase activities, reflections, differentiation strategies, resources, and assessments—ENTIRELY in the ${selectedLanguage} language.
    You are STRICTLY FORBIDDEN from writing any part of this lesson plan, descriptions, instructions, steps, lists, guides, or questions in the English language (except for translating from English to ${selectedLanguage} if explicitly asked by the lesson indicators, but even then, the surrounding notes and headings must be in ${selectedLanguage}).
    Ensure the spelling, grammar, orthography, tones, and cultural context are 100% authentic and correct for ${selectedLanguage}.
    Do NOT include English translations. The teacher must see only ${selectedLanguage}.
    ` : '')}

    SOURCE OF TRUTH: If the prompt provides specific "LESSON FRAME" details such as activities, keywords, or resources, you MUST treat these as the PRIMARY constraints and incorporate them into the lesson plan.
    
    CURRICULUM INTEGRITY: You MUST maintain the EXACT names of Strands and Sub-strands provided in the prompt. Do NOT summarize or rephrase them. Use the official codes and titles exactly as they appear in the data provided. Specifically for Science, ensure the strand formerly known as "All Around Us" is always referred to as "Diversity of Matter".
    
    LESSON OBJECTIVE RULE: You MUST automatically use the selected NaCCA Indicator as the main, primary, and sole Learning Objective of the lesson when generating. Ensure the performance indicator/learning objective is formulated as: 'By the end of the lesson, the learner will be able to: [indicator text].' Do not invent or add secondary goals.
    
    STRAND PARITY & DISTRIBUTION: When generating schemes or multi-term content, ensure that each Strand of a subject is represented in every term. A bit of every strand should be taught in every term (Term 1, 2, and 3) to ensure continuous engagement.
    
    SUBJECT-SPECIFIC COMPLIANCE:
    - Integrated Curriculum (KG): Follow a thematic and play-based approach. The curriculum is integrated across Language and Literacy, Numeracy, Our World and Our People, and Creative Arts. Focus on the 7 core themes (All About Me, My Family, Values and Beliefs, My Local Community, My Nation Ghana, All Around Us, My Global Community). Activity descriptions must be detailed and play-centered.
    - Mathematics (B1-B6): Use concrete manipulatives for B1-B3. For B4-B6, transition to more abstract modeling but maintain practical examples (e.g., area from grid paper, division as repeated subtraction). Emphasize Roman Numerals, factors/HCF/LCM, and fractions/decimals/percent.
    - Our World Our People (B1-B6): Focus on civic responsibility, environmental awareness, and moral values. Activity descriptions should encourage community interaction and personal reflection. Use real-life scenarios related to Ghana's culture and environment.
    - Physical Education (B1-B6): Focus on motor skills, physical fitness, and teamwork. Activity descriptions must include safety instructions, specific movement cues (e.g., 'eyes on the ball'), and step-by-step drills appropriate for the field or playground. Emphasize teamwork and fair play.
    - Ghanaian Language (B1-B3, B4-B6 & B7-B9): Follow the specific NaCCA strands (Oral Language/Listening and Speaking, Reading, Writing/Language and Usage, Composition Writing, Customs and Institutions, Literature). For B1-B3, focus on foundational literacy and phonological awareness. For B4-B6, move towards composition, customs, and literature. For B7-B9 (JHS), structure lesson content and assessment around the 6 official JHS strands, teaching childhood, puberty, and marriage rites of passage, naming systems, traditional chieftaincy structure, syllables, speech tones, and drum/horn language. Always include the official NaCCA Indicator codes.
    - French: Prioritize the four basic communicative skills (Listening, Speaking, Reading, Writing). Use the task-based approach. All French text outputs should include the French expression followed by the English translation in parentheses for Basic levels.
    - History: Use narrative and inquiry-based approaches. Focus on sources of evidence.
    - English: Integrate Listening, Speaking, Reading, Writing, and Grammar.
    - Creative Arts: Balance "Thinking and Exploring" with "Planning and Making".
    - Science: Emphasize "Diversity of Matter" as the first strand.
    - Computing: Prioritize practical application and digital safety.
    - Career Technology: Implement the NaCCA "Head, Heart, and Hands (3-H) Therapy" model, focusing primarily on practical skills, craftsmanship, and safety. Specify double-periods (100 continues minutes) for practical sessions where appropriate. Standardise lesson plans around local, accessible Ghanaian resources: compliant materials (paper, cardboard, fabric), resistant materials (wood, metal, plastic, clay/laterite), or local food commodities. For tools and processes, enforce safety routines (PPEs, safe handling of sharp-edged tools). Emphasize freehand sketching (2-D and 3-D), design briefs, and evaluation spanning: Concept/Ideas, Planning/Preparation, Process, Product/Artefact, and Presentation.
    
    NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12. For Kindergarten, use KG1 and KG2.
    INDICATORS: You MUST include and strictly follow the Indicator Code provided. Every activity must map back to these curriculum indicators.
    
    LESSON PLAN STRUCTURE (NaCCA CCP/SBC Standards):
    - Phase 1: Starter (Preparing the brain for learning) - 10 mins. Focus on prior knowledge.
    - Phase 2: Main (New Learning including assessment) - 40 mins. Step-by-step teaching and learning activities using various techniques (think-pair-share, group work, etc.).
    - Phase 3: Plenary / Reflection - 10 mins. Summary and assessment.
    
    ${teacherInfo?.school ? `TEACHER CONTEXT:
    School: ${teacherInfo.school}
    Town: ${teacherInfo.town || 'N/A'}
    District: ${teacherInfo.district || 'N/A'}
    Region: ${teacherInfo.region || 'N/A'}
    BSTEM Aligned School: ${teacherInfo.isBstemSchool ? 'YES' : 'NO'}` : ''}

    ${teacherInfo?.isBstemSchool ? `
    BSTEM SCHOOL INSTRUCTION (CRITICAL - INTEGRATE BSTEM METHODOLOGIES):
    Since the school is a BSTEM Aligned School, you MUST design of all instructional parts, starters, main activities, and plenary elements to prominently incorporate the Basic Science, Technology, Engineering, and Mathematics (BSTEM) framework:
    1. Focus heavily on practical inquiry-based learning, hands-on scientific experimentation, basic computational concepts, mathematical modeling, and engineering design loops.
    2. Suggest concrete, accessible local Ghanaian resources, physical models, and simple handmade tools suitable for experimentation in classrooms.
    3. Use the BSTEM Inquiry Cycle (Observation -> Questioning -> Conjecture -> Investigation -> Discussion -> Reflective Application).
    4. Provide clear STEAM (Science, Tech, Engineering, Arts, Math) connections where plausible.
    ` : ''}

    The response MUST be a JSON object with the following structure:
    {
      "title": "Topic title",
      "weekEnding": "The week ending date provided in the prompt (or a suggested one if not provided)",
      "classSize": "The number of learners provided in the prompt",
      "strand": "The strand from NaCCA",
      "subStrand": "The sub-strand from NaCCA",
      "indicatorCode": "The specific indicator code (e.g., B8.1.1.1.1)",
      "contentStandardCode": "The content standard code",
      "performanceIndicator": "Detailed performance indicator",
      "coreCompetencies": "Core competencies involved",
      "keyWords": "Important key words for the lesson",
      "tlrs": "Teaching and Learning Resources (Tailor these strictly to the LOCALITY provided - e.g., if Rural, prefer locally available items)",
      "references": "Textbooks and other reference materials",
      "phase1": "Phase 1: Starter (preparing the brain for learning) - Detailed activities",
      "phase2": "Phase 2: Main (new learning including assessment) - Step-by-step teaching and learning activities",
      "phase3": "Phase 3: Plenary / Reflections - Closing activities and reflections",
      "differentiation": {
        "strugglingLearners": {
          "activities": "Specific remedial or simplified activities based on user's differentiation strategies",
          "resources": "Simplified resources or scaffolding tools based on locality and user guidance",
          "assessments": "Targeted assessment tips for this level"
        },
        "averageLearners": {
          "activities": "Core activities for the general class",
          "resources": "Standard lesson resources based on locality",
          "assessments": "Standard assessment methods"
        },
        "advancedLearners": {
          "activities": "Enrichment or extension activities based on user guidance",
          "resources": "Advanced reading or complex problem sets",
          "assessments": "Challenging assessment items"
        }
      }
    }
    
    IMPORTANT: The 'differentiation' section MUST reflect NaCCA's requirement for inclusive and level-appropriate pedagogy, specifically honoring any 'DIFFERENTIATION INSTRUCTION' or 'TAILORING INSTRUCTION' provided in the prompt.
  `;

  const responseText = await generateWithProxy(prompt, systemInstruction, "application/json");
  return parseAIResponse(responseText);
};

export const generateSchemeOfWork = async (
  subject: string, 
  level: string, 
  type: string, 
  term?: string, 
  options?: { 
    includeLearningOutcomes?: boolean, 
    customPrompt?: string,
    language?: string,
    bilingualLanguage?: string,
    isBstemSchool?: boolean
  }
) => {
  const isGhanaianLanguage = subject.toLowerCase().includes('ghanaian language') || subject.toLowerCase().includes('ghanaian languages') || subject.toLowerCase().includes('ghanaian') || (options?.language && options.language !== 'English');
  let selectedLanguage = "";
  if (isGhanaianLanguage) {
    if (options?.language && options.language !== 'English') {
      selectedLanguage = options.language.toLowerCase().includes('bilingual') ? (options.bilingualLanguage || 'Twi') : options.language;
    } else {
      const match = subject.match(/\(([^)]+)\)/);
      if (match) {
        selectedLanguage = match[1];
      }
    }
  }
  
  let formatInstructions = "";
  if (type === 'yearly') {
    formatInstructions = `
      STRICT CURRICULUM REQUIREMENT: 
      1. This document serves as the MASTER STRATEGIC ROADMAP for the entire academic year.
      2. PERSPECTIVE: Act as a highly experienced Ghana Education Service (GES) curriculum expert.
      3. SYSTEMATIC DISTRIBUTION: You MUST systematically distribute ALL strands and sub-strands from the NaCCA curriculum across Term 1, Term 2, and Term 3.
      4. STRAND PARITY: You MUST ensure that a bit of EACH Strand is represented and taught in EVERY term (Term 1, Term 2, and Term 3) to ensure continuous engagement and reinforcement.
      5. FULL COVERAGE: By the end of Term 3, 100% of the curriculum for ${subject} ${level} MUST be exhausted. No sub-strand should be left out.
      
      Format the entire scheme as ONE SINGLE Markdown Table.
      Headers MUST be:
      | Week | Term 1 Topics | Term 2 Topics | Term 3 Topics | Key Performance Indicators |
      | :--- | :--- | :--- | :--- | :--- |
      
      Include exactly one row per week (Week 1 to Week 12).
      At the end of the document, include the footer:
      Vetted by: ................................ Signature: ................................ Date: ................................
    `;
  } else if (type === 'termly') {
    const termLabel = term ? `TERM ${term}` : 'a specific term';
    formatInstructions = `
      STRICT CURRICULUM REQUIREMENT:
      1. This termly scheme MUST be a detailed, week-by-week decomposition of the official yearly roadmap for ${subject} ${level}.
      2. PERSPECTIVE: Act as a highly experienced Ghana Education Service (GES) curriculum expert and NaCCA instructional planning specialist.
      3. Follow the official NaCCA curriculum exactly. Use only approved strands, sub-strands, content standards, indicators, and exemplars.
      4. Arrange content progressively from simple to complex.

      Format the entire scheme as ONE SINGLE Markdown Table for ${termLabel}.
      Headers MUST be EXACTLY:
      | Week/Period | Strand | Sub-Strand | Content Standard | Indicator(s) | TLRs | References |
      | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
      
      Include exactly one row per week (Week 1 to Week 12). Include revision and assessment weeks where appropriate (typically Week 11/12).
    `;
  }

  const systemInstruction = `
    You are a NaCCA Curriculum Expert. Generate an official ${type.toUpperCase()} STRATEGIC SCHEME OF LEARNING for ${subject} (${level})${term && type === 'termly' ? ` specifically for TERM ${term}` : ''}.
    All content must align strictly with the latest Ghanaian National Curriculum (SBC/CCP) and NaCCA standards.
    
    ${options?.language && options.language !== 'English' ? getLanguageInstruction(options.language, options.bilingualLanguage) : (isGhanaianLanguage && selectedLanguage ? `
    CRITICAL LANGUAGE REQUIREMENT (CONFORMS TO OFFICIAL NaCCA GUIDELINES):
    The subject is specifically the Ghanaian Language: ${selectedLanguage}.
    You MUST generate the entire Scheme of Learning table—including all topics, strands descriptions, sub-strands descriptions, weekly lessons topics, learning indicators, teaching & learning activities, and assessment descriptions—ENTIRELY in the ${selectedLanguage} language.
    You are STRICTLY FORBIDDEN from writing any part of this scheme, instructions, steps, lists, guides, or questions in the English language (except for official NaCCA codes like B7.1.1.1.1, and English/Ghanaian translation labels if required, but even then, the surrounding text must be in ${selectedLanguage}).
    Ensure the spelling, grammar, orthography, tones, and cultural context are 100% authentic and correct for ${selectedLanguage}.
    Do NOT include English translations. The teacher must see only ${selectedLanguage}.
    ` : '')}

    CURRICULUM INTEGRITY: You MUST maintain the EXACT names of Strands and Sub-strands as defined in the NaCCA curriculum standards. Do NOT summarize or rephrase official titles. Specifically for Science, ensure the strand formerly known as "All Around Us" is always referred to as "Diversity of Matter".
    
    STRAND PARITY & DISTRIBUTION: When generating schemes, ensure that each Strand of a subject is represented in every term. A bit of every strand should be taught in every term (Term 1, 2, and 3) to ensure continuous engagement. By the end of Term 3, 100% of the curriculum MUST be exhausted.
    
    SUBJECT-SPECIFIC COMPLIANCE:
    - Integrated Curriculum (KG): Follow a thematic and play-based approach. The curriculum is integrated across Language and Literacy, Numeracy, Our World and Our People, and Creative Arts. Focus on the 7 core themes (All About Me, My Family, Values and Beliefs, My Local Community, My Nation Ghana, All Around Us, My Global Community). Activity descriptions must be detailed and play-centered. Use appropriate NaCCA KG Indicator codes (e.g. K1.1.1.1.1).
    - Mathematics (B1-B6): Ensure logical progression from concrete to abstract. Cover all 4 strands (Number, Algebra, Geometry, Data) across all 3 terms. For B4-B6, introduce more complex operations like multi-digit division and ratio.
    - Our World Our People (B1-B6): Cover all themes (All About Me, All Around Us, Our Beliefs and Values, Our Nation Ghana, My Global Community) across the termly scheme.
    - Physical Education (B1-B6): Distribute physical fitness, movement patterns, and value-based strategies across the term. Ensure a mix of individual drills and team-based activities.
    - Ghanaian Language (B1-B3, B4-B6 & B7-B9): Follow the specific NaCCA strands (Oral Language/Listening and Speaking, Reading, Writing/Language and Usage, Composition Writing, Customs and Institutions, Literature). For B1-B3, focus on foundational literacy, penmanship, and oral traditions. For B4-B6, emphasize composition, advanced grammar, and cultural institutions. For B7-B9 (JHS), structure schemes of learning around the 6 official JHS strands, distributing childhood, puberty, and marriage rites of passage, naming systems, traditional chieftaincy structure, syllables, speech tones, and drum/horn language across the termly schedule. Always use the official NaCCA codes (e.g. B7.1.1.1.1).
    - French: Prioritize the four basic communicative skills (Listening, Speaking, Reading, Writing). Use the task-based approach. All French text outputs should include the French expression followed by the English translation in parentheses for Basic levels.
    - History: Use narrative and inquiry-based approaches. Focus on sources of evidence.
    - English: Integrate Listening, Speaking, Reading, Writing, and Grammar.
    - Creative Arts: Balance "Thinking and Exploring" with "Planning and Making".
    - Science: Emphasize "Diversity of Matter" as the first strand.
    - Computing: Prioritize practical application and digital safety.
    - Career Technology: Implement the NaCCA "Head, Heart, and Hands (3-H) Therapy" model, focusing primarily on practical skills, craftsmanship, and safety. Specify double-periods (100 continues minutes) for practical sessions where appropriate. Standardise Schemes around local, accessible Ghanaian resources: compliant materials (paper, cardboard, fabric), resistant materials (wood, metal, plastic, clay/laterite), or local food commodities. For tools and processes, enforce safety routines (PPEs, safe handling of sharp-edged tools). Emphasize freehand sketching (2-D and 3-D), design briefs, and evaluation spanning: Concept/Ideas, Planning/Preparation, Process, Product/Artefact, and Presentation.
    
    ${options?.customPrompt ? `SPECIFIC FOCUS: ${options.customPrompt}` : ''}

    ${options?.isBstemSchool ? `
    BSTEM SCHEME INSTRUCTION (CRITICAL - INTEGRATE BSTEM METHODOLOGIES):
    Since the teacher is preparing a scheme for a BSTEM Aligned School, all weekly teaching and learning activities, project indicators, and teaching & learning resources (TLRs) MUST prioritize hands-on Basic STEM concepts:
    1. Focus on inquiry-driven investigations, engineering design loops, active student prototyping, and mathematical problem-solving.
    2. Propose low-cost or easily sourced everyday Ghanaian materials (e.g. bottles, carton, wire, plants, soil, battery-led sets) as the primary learning resources (TLRs).
    3. Include practical lab activities, science/tech projects, and active experiments in the "Teaching & Learning Activities" column where applicable.
    ` : ''}

    NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12.
    ${formatInstructions}
    
    Rules:
    1. ONLY return the markdown table. No preambles.
    2. Ensure columns are correctly aligned.
    3. Content must be rigorous and strictly aligned with the official NaCCA Scheme of Learning for the specified grade and term.
    4. Ensure indicators include official codes (e.g., B7.1.3.1.1).
  `;

  const responseText = await generateWithProxy(
    `Generate a ${type} scheme of learning table for ${subject} ${level}${term && type === 'termly' ? ` Term ${term}` : ''}.${options?.customPrompt ? ` ${options.customPrompt}` : ''}`,
    systemInstruction
  );

  return responseText;
};

export const generateExam = async (
  subject: string, 
  level: string, 
  topics: string, 
  difficulty: string, 
  teacherInfo?: { school?: string, region?: string, district?: string, town?: string, isBstemSchool?: boolean }, 
  questionTypes?: string[],
  p1Settings?: { count: number, difficulty: string },
  p2Settings?: { count: number, difficulty: string },
  strand?: string,
  subStrand?: string,
  contentStandard?: string,
  indicatorCode?: string,
  language?: string,
  bilingualLanguage?: string
) => {
  const isGhanaianLanguage = subject.toLowerCase().includes('ghanaian language') || subject.toLowerCase().includes('ghanaian languages') || subject.toLowerCase().includes('ghanaian') || (language && language !== 'English');
  let selectedLanguage = "";
  if (isGhanaianLanguage) {
    if (language && language !== 'English') {
      selectedLanguage = language.toLowerCase().includes('bilingual') ? (bilingualLanguage || 'Twi') : language;
    } else {
      const match = subject.match(/\(([^)]+)\)/);
      if (match) {
        selectedLanguage = match[1];
      }
    }
  }
  
  // Determine WAEC question counts based on level
  const isSHS = level.toLowerCase().includes('shs');
  const isJHS = level.toLowerCase().includes('jhs') || level.toLowerCase().includes('basic 7') || level.toLowerCase().includes('basic 8') || level.toLowerCase().includes('basic 9');
  
  let objectiveCount = p1Settings?.count ?? (isSHS ? 50 : 40);
  const p1Diff = p1Settings?.difficulty ?? difficulty;
  
  let theoryCount = p2Settings?.count ?? 6;
  const p2Diff = p2Settings?.difficulty ?? difficulty;
  let theoryToAnswer = theoryCount === 6 ? 4 : Math.ceil(theoryCount * 0.7);

  // 2024 BECE Guidelines based on subject
  let beceSpecificInstructions = "";
  if (isJHS) {
    const normSubject = subject.toLowerCase().trim();
    if (normSubject.includes('science') || normSubject === 'science') {
      objectiveCount = 40;
      theoryCount = 5; // 1 compulsory, 4 others in section B
      theoryToAnswer = 4; // 1 compulsory + 3 from section B
      beceSpecificInstructions = `
        STRICT 2024 BECE SCIENCE EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 Multiple Choice Questions (MCQs), 45 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 25 minutes, consisting of Section A and Section B.
        - Section A is COMPULSORY (Question 1) testing practical skills in Agriculture, Biology, Chemistry, and Physics (each sub-part worth 10 marks, total 40 marks). You MUST include a boxed diagram placeholder with labels for this question!
        - Section B: 4 blended questions from Agriculture, Biology, Chemistry, and Physics. Candidates must answer any 3 (20 marks each, total 60 marks).
      `;
    } else if (normSubject.includes('math') || normSubject === 'mathematics') {
      objectiveCount = 40;
      theoryCount = 6;
      theoryToAnswer = 4;
      beceSpecificInstructions = `
        STRICT 2024 BECE MATHEMATICS EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 compulsory MCQs, 1 hour, 40 marks.
        - PAPER 2 (ESSAY): 6 structured and comprehensive questions. Candidates must answer any 4 questions (15 marks each, total 60 marks), 1 hour.
      `;
    } else if (normSubject.includes('social') || normSubject.includes('social studies')) {
      objectiveCount = 40;
      theoryCount = 5; // 1 compulsory, 2 in Sec II, 2 in Sec III
      theoryToAnswer = 3; // 1 compulsory + 1 from Sec II + 1 from Sec III
      beceSpecificInstructions = `
        STRICT 2024 BECE SOCIAL STUDIES EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs, 45 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour, consisting of three sections:
          * Section I: The Environment. Question 1 is COMPULSORY (20 marks).
          * Section II: Law, Order, and Nation Building. Candidates answer any 1 question from 2 options (20 marks).
          * Section III: Social and Economic Development. Candidates answer any 1 question from 2 options (20 marks).
      `;
    } else if (normSubject.includes('technology') || normSubject.includes('career')) {
      objectiveCount = 40;
      theoryCount = 6; // 3 in Sec A, 3 in Sec B
      theoryToAnswer = 4; // 1 compulsory + 1 standard from Sec A, and 1 compulsory + 1 standard from Sec B
      beceSpecificInstructions = `
        STRICT 2024 BECE CAREER TECHNOLOGY EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs, 50 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 15 minutes, consisting of Section A (Home Economics) and Section B (Pre-Technical Skills).
          * Section A (Home Economics): 3 questions. Question 1 (test of practical) is COMPULSORY. Answer Question 1 and any other 1 question (15 marks each).
          * Section B (Pre-Technical Skills): 3 questions. Question 4 (test of practical) is COMPULSORY. Answer Question 4 and any other 1 question (15 marks each).
      `;
    } else if (normSubject.includes('computing')) {
      objectiveCount = 40;
      theoryCount = 5; // 1 compulsory, 4 standard
      theoryToAnswer = 4; // 1 compulsory + 3 standard
      beceSpecificInstructions = `
        STRICT 2024 BECE COMPUTING EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 compulsory MCQs, 45 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 15 minutes, consisting of Section A and Section B:
          * Section A: Question 1 is COMPULSORY (24 marks).
          * Section B: 4 questions. Candidates answer any 3 questions (12 marks each, total 36 marks).
      `;
    } else if (normSubject.includes('creative') || normSubject.includes('art')) {
      objectiveCount = 40;
      theoryCount = 7; // 3 in Sec A, 2 in Sec B, 2 in Sec C
      theoryToAnswer = 4; // 1 compulsory + 1 other from Sec A, 1 from Sec B, 1 from Sec C
      beceSpecificInstructions = `
        STRICT 2024 BECE CREATIVE ART AND DESIGN EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs, 45 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 20 minutes, consisting of three sections (A, B, C):
          * Section A (Visual Art): 3 questions. Question 1 (Design) is COMPULSORY. Candidates answer Question 1 and any 1 other (15 marks each).
          * Section B (Music): 2 questions. Candidates answer exactly 1 question (15 marks).
          * Section C (Dance and Drama): 2 questions. Candidates answer exactly 1 question (15 marks).
      `;
    } else if (normSubject.includes('english')) {
      objectiveCount = 40;
      theoryCount = 3; // Section A, B, C are distinct parts
      theoryToAnswer = 3; // Compulsory Parts
      beceSpecificInstructions = `
        STRICT 2024 BECE ENGLISH LANGUAGE EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs (35 Grammar Usage, 5 Oral Language), 50 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 10 minutes, consisting of three sections:
          * Part A (Writing): 3 composition topics. Candidates answer exactly 1 topic (30 marks, ~250 words long).
          * Part B (Reading): 1 compulsory Reading Comprehension and Summarizing passage with questions (20 marks).
          * Part C (Literature): 10 compulsory questions based on approved Ghanaian BECE literature extracts (10 marks).
      `;
    } else if (normSubject.includes('rme') || normSubject.includes('religious')) {
      objectiveCount = 40;
      theoryCount = 5; // 1 compulsory, 4 standard
      theoryToAnswer = 3; // 1 compulsory + 2 standard
      beceSpecificInstructions = `
        STRICT 2024 BECE RELIGIOUS AND MORAL EDUCATION EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs, 45 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour, consisting of Section A (compulsory question) and Section B (4 options from which candidates answer 2). Total of 3 questions to answer (20 marks each, total 60 marks).
      `;
    } else if (normSubject.includes('french')) {
      objectiveCount = 20; // 10 Written Comprehension, 10 Vocabulary (due to Listening Comprehension put on hold)
      theoryCount = 2; // Two compulsory questions
      theoryToAnswer = 2;
      beceSpecificInstructions = `
        STRICT 2024 BECE FRENCH EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs (Note: Listening comprehension is put on hold. Please generate 20 MCQs: 10 Written Comprehension questions from two short passages, and 10 Vocabulary questions), 30 minutes, 40 marks total.
        - PAPER 2 (WRITTEN EXPRESSION): 45 minutes, consisting of two compulsory questions:
          * Question 1: 10 short-answer situational questions (e.g. filling out a form, replying to invitation, giving advice, describing work) for 20 marks.
          * Question 2: 1 guided composition/essay question for 20 marks.
      `;
    } else if (normSubject.includes('language') || normSubject.includes('ghanaian')) {
      objectiveCount = 40;
      theoryCount = 4; // 4 distinct parts
      theoryToAnswer = 4;
      beceSpecificInstructions = `
        STRICT 2024 BECE GHANAIAN LANGUAGE${selectedLanguage ? ` (${selectedLanguage.toUpperCase()})` : ''} EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs covering Customs, Institutions, Oral & Written Literature, and Listening & Speaking, 50 minutes, 40 marks.
        - PAPER 2 (ESSAY): 1 hour 10 minutes, consisting of 4 parts (total 60 marks):
          * Part I (Composition): Write a short composition on 1 out of 4 options (30 marks, ~150 words) in ${selectedLanguage || 'the selected Ghanaian language'}.
          * Part II (Comprehension): 1 compulsory passage with questions in ${selectedLanguage || 'the selected Ghanaian language'} (10 marks).
          * Part III (Translation): Translate an English passage into ${selectedLanguage || 'the selected Ghanaian language'} (10 marks).
          * Part IV (Language and Usage): 10 questions on grammar, parts of speech, syntax (10 marks) written entirely in ${selectedLanguage || 'the selected Ghanaian language'}.
      `;
    } else if (normSubject.includes('arabic')) {
      objectiveCount = 40;
      theoryCount = 3;
      theoryToAnswer = 1;
      beceSpecificInstructions = `
        STRICT 2024 BECE ARABIC EXAM STRUCTURE:
        - PAPER 1 (OBJECTIVE): 40 MCQs covering lexis, structure, and comprehension, 45 minutes, 70 marks (scaled to 70%).
        - PAPER 2 (ESSAY): 1 hour, answer exactly 1 guided essay out of 3 set questions (composition, picture description, letter writing, narration) for 30 marks.
      `;
    }
  }

  const selectedTypesList = questionTypes && questionTypes.length > 0 ? questionTypes : ['Multiple Choice', 'Theory'];

  // Dynamically build exam structures
  const structureParts: string[] = [];
  const rulesParts: string[] = [];
  const instructionsParts: string[] = [];

  let paperIndex = 1;
  let sectionLetter = 'A';

  if (selectedTypesList.includes('Multiple Choice')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): Multiple Choice Objective Test`);
    rulesParts.push(`- SECTION ${sectionLetter} (Multiple Choice): Provide exactly ${objectiveCount} multiple choice questions (with options A, B, C, D). Section difficulty: ${p1Diff}.`);
    instructionsParts.push(`- Section ${sectionLetter} (Multiple Choice) Instruction: "Answer ALL questions in this section."`);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
  }

  if (selectedTypesList.includes('True/False')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): True / False Questions`);
    rulesParts.push(`- SECTION ${sectionLetter} (True / False): Provide exactly 10 True/False statements.`);
    instructionsParts.push(`- Section ${sectionLetter} (True / False) Instruction: "State whether each of the following statements is TRUE or FALSE."`);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
  }

  if (selectedTypesList.includes('Matching')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): Matching Exercise`);
    rulesParts.push(`- SECTION ${sectionLetter} (Matching): Provide a matching set formatted STRICTLY as a clean Markdown table with exactly three columns: "| Column A (Items to Match) | Your Answer | Column B (Options) |". Provide 5 to 10 matching pairs. For each row in the table, Column A displays a concept/term, the "Your Answer" column must contain a blank space or placeholder like "[       ]" or "______________" for students to input their answers, and Column B displays randomized/jumbled corresponding options.`);
    instructionsParts.push(`- Section ${sectionLetter} (Matching) Instruction: "Match items in Column A with the correct corresponding terms in Column B. Write the letter/option of your answer from Column B in the space provided in the 'Your Answer' column."`);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
  }

  if (selectedTypesList.includes('Fill-in-the-blanks')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): Fill-in-the-blanks`);
    rulesParts.push(`- SECTION ${sectionLetter} (Fill-in-the-blanks): Provide exactly 10 short-answer/completion questions where the learner fills in a missing word or phrase.`);
    instructionsParts.push(`- Section ${sectionLetter} (Fill-in-the-blanks) Instruction: "Fill in the blank spaces with the most appropriate word(s) to complete each sentence."`);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
  }

  // Increment paper index if we had any objective type and also have theory/practical
  if (structureParts.length > 0 && (selectedTypesList.includes('Theory') || selectedTypesList.includes('Practical'))) {
    paperIndex++;
    sectionLetter = 'A'; // Reset section letter for the next paper
  }

  if (selectedTypesList.includes('Theory')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): Essay / Theory Questions.`);
    rulesParts.push(`- SECTION ${sectionLetter} (Essay/Theory): Provide exactly ${theoryCount} comprehensive structured theory/essay questions (with sub-parts a, b, c). Section difficulty: ${p2Diff}.`);
    instructionsParts.push(`- Section ${sectionLetter} (Essay/Theory) Instruction: "Answer question 1 (compulsory) and any other ${theoryToAnswer - 1} questions (for a total of ${theoryToAnswer} questions)."`);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
  }

  if (selectedTypesList.includes('Practical')) {
    structureParts.push(`- PAPER ${paperIndex} (SECTION ${sectionLetter}): Practical Work / Test of Practical Knowledge.`);
    rulesParts.push(`- SECTION ${sectionLetter} (Practical): Provide at least 3 detailed Practical questions based on diagrams, measurements, and identification using clear, boxed text-based diagrams description.`);
    instructionsParts.push(`- Section ${sectionLetter} (Practical) Instruction: "Answer ALL questions in this section. All diagrams should be clearly labeled and referenced."`);
  }

  const structureFormatted = structureParts.join('\n       ');
  const rulesFormatted = rulesParts.join('\n       ');
  const instructionsFormatted = instructionsParts.join('\n       ');

  const systemInstruction = `
    You are an expert senior curriculum developer and examiner for the West African Examinations Council (WAEC) and NaCCA (National Council for Curriculum and Assessment) Ghana.
    Generate a high-quality examination for ${subject} (${level}) based on the topics, strand, sub-strand, content standard, and indicator provided, strictly adhering to the Standards-Based Curriculum (SBC) framework.
    
    CRITICAL STANDARDS-BASED CURRICULUM (SBC) TEST CONSTRUCTION PRINCIPLES:
    You MUST craft all test items (questions) strictly following the official Ghanaian NaCCA assessment guardrails:
    1. CLARITY & SPECIFICITY:
       - Every test item must be clear, concise, and completely unambiguous. Avoid vague, confusing, or double-negative language using age-appropriate reading levels.
       - The stem of every Multiple-Choice Question (MCQ) must state the question or problem clearly and fully, containing all necessary information such that a student could reasonably formulate an answer even before reading the optional responses. Avoid truncated stems.
    2. RELEVANCE & VALIDITY:
       - Every question must directly align with and measure the learning objectives, content standards, and indicators of the NaCCA curriculum (${contentStandard || 'N/A'}, Indicator: ${indicatorCode || 'N/A'} and topics: ${topics}). Every single item must be instructionally valid.
    3. BALANCED DIFFICULTY & DISCRIMINATION (ITEM ANALYSIS):
       - Align questions with a deliberate range of item difficulties. Target a balanced spread: some foundational easy questions (calculated p-value near 0.90), some rigorous challenging questions (calculated p-value near 0.20), and the majority in the optimal moderate difficulty range (calculated p-value between 0.45 and 0.75) which is optimized for spreading scores and discriminating between high-performing master students and low-performing struggle students.
    4. DISTRACTOR COGNITION & NO CLUE BIAS (FOR MCQS):
       - Distractors (the three incorrect options) must be highly plausible, believable, and representative of common student misconceptions so they test genuine cognitive understanding rather than allowing easy guessing.
       - Avoid spelling, grammatical, or word-length clues. Keep all options (A, B, C, D) roughly similar in length, grammatical structure, and level of detail.
       - Randomize the position of the correct answer (frequently place the correct key on the second or third options to balance-out key placement bias).
       - Never write obviously silly or humorously incorrect distractors.
    5. MULTIPLE LEARNING DOMAINS & BLOOM'S/DOK ALIGNMENT:
       - Cognitive Domain: Systematically scaffold questions across Bloom's Revised Taxonomy levels and Depth of Knowledge (DOK) levels:
         * Knowledge/Remembering (DOK 1 - recall, list, label, define).
         * Comprehension/Understanding (Explain, summarize, describe, interpret).
         * Application/Applying (DOK 2 - use, solve, calculate, demonstrate in practical Ghanaian contexts).
         * Analysis/Analyzing (DOK 3 - compare, contrast, categorize, differentiate).
         * Evaluation & Creation (DOK 4 - judge, critique, design, formulate, build, plan).
       - Affective Domain (Attitudes & Values): Where appropriate (especially in Social Studies, Ghanaian Language, and RME), assess student reflection on civic responsibility, ethical behavior, and community values using hypothetical situational prompts.
       - Psychomotor Domain (Skills & Practicals): In practical-oriented subjects (Science, Career Technology, Computing, and Creative Arts), integrate performance tasks, observational checklists, and diagnostic design/fabrication questions. Use clear, boxed text descriptions for practical setups and mock apparatus.

    CORE DESIGN & REAL-LIFE CONTEXTS:
    1. ALIGNMENT: Content MUST be strictly based on the provided Strand, Sub-Strand, Content Standard (${contentStandard || 'N/A'}), Indicator (${indicatorCode || 'N/A'}), and Topics (${topics}).
    2. REAL-LIFE PROBLEM SOLVING: Include real-world practical word problems that require reasoning using Ghanaian cultural, societal, geographical, commercial, or environmental situations (e.g., local farm output, market trading calculations, sanitation, building mockups, chieftaincy rites, kente weaving design lines, or processing local raw foodstuffs).
    3. CURRICULUM INTEGRITY: You MUST maintain the EXACT names of the Strand and Sub-Strand provided. Specifically for Science, use "Diversity of Matter" instead of "All Around Us".
    4. SUBJECT-SPECIFIC COMPLIANCE:
       - French: All French text outputs must include the French expression followed by the English translation in parentheses for Basic levels.
       - Ghanaian Language: Enforce cultural specificities: rites of passage, naming ceremonies, chieftancy state structure, and syllables.
       - Career Technology: Emphasize 3-H Therapy (Head, Heart, Hands) practical safety routines, compliant vs resistant materials, and freehand drawing.
    5. NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High).
    
    Overall Examination Difficulty: ${difficulty}
    Selected Question Types to include: ${selectedTypesList.join(', ')}
    
    ${teacherInfo?.school ? `SCHOOL HEADER INFO:
    School Name: ${teacherInfo.school}
    Town: ${teacherInfo.town || 'N/A'}
    District: ${teacherInfo.district || 'N/A'}
    Region: ${teacherInfo.region || 'N/A'}
    BSTEM Aligned School: ${teacherInfo.isBstemSchool ? 'YES' : 'NO'}` : ''}

    ${teacherInfo?.isBstemSchool ? `
    BSTEM EXAM INSTRUCTION (CRITICAL - INTEGRATE BSTEM METHODOLOGIES):
    Since this is a BSTEM Aligned School, all multiple-choice, practical, and theory questions MUST incorporate BSTEM principles:
    1. Focus questions on real-life troubleshooting, scientific hypothesis testing, data table comprehension, computing logic, or engineering design/construction challenges.
    2. Ensure that practical questions include scenarios with simple apparatus, lab safety guidelines, and active scientific observations.
    3. Encourage critical thinking, analytical reasoning, and practical mathematical/scientific calculation.
    ` : ''}

    STRICT WAEC COMPLIANCE RULES:
    ${beceSpecificInstructions ? `
    BECE 2024 SPECIFIC EXAM FORMAT DIRECTIVES (CRITICAL):
    ${beceSpecificInstructions}
    ` : ''}
    ${language && language !== 'English' ? getLanguageInstruction(language, bilingualLanguage) : (isGhanaianLanguage && selectedLanguage ? `
    CRITICAL LANGUAGE REQUIREMENT (CONFORMS TO 2024 BECE SPECIFICATIONS):
    The assessment subject is specifically the Ghanaian Language: ${selectedLanguage}.
    You MUST generate the entire examination—including all questions, multiple choice options (A, B, C, D), reading comprehension passages, titles, section instructions, headers, and matching terms—ENTIRELY in the ${selectedLanguage} language.
    You are STRICTLY FORBIDDEN from asking, prompting, or writing any questions or options in the English language (except for translating from English to ${selectedLanguage} in Part III Translation, but even then, the surrounding prompts, headers, and target questions must be in ${selectedLanguage}).
    Ensure the spelling, grammar, orthography, tones, and cultural context are 100% authentic and correct for ${selectedLanguage}.
    The marking scheme answers and explanations MUST also be written entirely in ${selectedLanguage}.
    Do NOT translate the questions to English. The teacher and student must see only ${selectedLanguage}.
    ` : '')}
    1. STRUCTURE (STRICTLY generate ONLY these selected sections. Do NOT generate any unselected sections or question types):
       ${structureFormatted}
    2. QUESTION COUNTS & DIFFICULTY:
       ${rulesFormatted}
    3. INSTRUCTIONS:
       - Header must include: "NAME: ....................................", "INDEX NUMBER: ............................", "DATE: ............................"
       - ${teacherInfo?.school ? `Include the school name "${teacherInfo.school.toUpperCase()}" prominently in the header centered, followed by the Town and Region if available.` : 'Include placeholders for school name.'}
       ${instructionsFormatted}
    4. NO OTHER QUESTION TYPES ALLOWED:
       - You are STRICTLY forbidden from generating any question formats that the teacher has NOT selected. If 'Theory / Essay' is not in the list of selected types above, you MUST NOT generate any essay or theory questions. If 'Multiple Choice' is not in the list of selected types above, you MUST NOT generate any multiple choice questions. The exam must focus entirely on the requested formats: ${selectedTypesList.join(', ')}.
    5. QUALITY:
       - Questions must be rigorous and strictly aligned with the Ghanaian NaCCA/WAEC standardized syllabus.
       - REAL-LIFE SCENARIOS: Every question must contain, or directly relate to, real-life problems or daily practical scenarios in a Ghanaian context. Learners should be required to solve concrete problems using the specific knowledge and skills acquired through the strands and sub-strands covered.
       - Each Theory question must have multiple sub-parts.
       - PRACTICAL QUESTIONS: For subjects requiring practicals (Science, Career Tech, etc.), you MUST include a dedicated section for PRACTICAL QUESTIONS. 
       - DIAGRAMS: Since you are generating text, represent diagrams as clear, boxed placeholders with detailed descriptions and identification labels. Example:
         [DIAGRAM 1: EXPERIMENTAL SETUP FOR PHOTOSYNTHESIS]
         - Label A: Light source
         - Label B: Water weed in a beaker
         - Label C: Gas being collected in a test tube
       - Ensure all practical questions involve scenarios with apparatus, observations, and data interpretation as per WAEC format.
    6. FORMATTING:
       - Use Arabic numerals for main questions correctly prefixed (e.g., 1., 2.).
       - Use lower case letters (e.g., a., b.) for sub-questions.
       - Use Roman numerals (e.g., i, ii) for further sub-divisions.
       - Ensure all multiple choice options are listed with bullets or A, B, C, D labels.
    
    CRITICAL REQUIREMENT: You MUST also generate a VERY DETAILED marking scheme.
    - For Objective/short-answer questions, provide a key (e.g., 1. A, 2. B, or True/False keys, or Matching answers) followed by the correct answer text.
    - For Matching questions, the marking scheme answers MUST ALSO be formatted as a Markdown table with columns: "| Item from Column A | Correct Answer from Column B |".
    - For Theory/Essay questions, provide a detailed mark allocation (e.g., [2 marks], [4 marks]) and expected points for each sub-part.
    
    CRITICAL JSON ENCODING RULES:
    1. Output a strictly valid JSON object without surrounding commentary.
    2. Because "questions" and "markingScheme" are Markdown strings inside JSON, ANY literal double quotes (") inside the text MUST be escaped as \\" or replaced with single quotes (').
    3. Ensure newlines in Markdown are represented cleanly within JSON.

    The response MUST be a JSON object with this exact shape:
    {
      "questions": "The complete examination paper in rich Markdown with school/student headers and numbered sections.",
      "markingScheme": "The comprehensive marking scheme and scoring guide in Markdown."
    }
  `;

  const responseText = await generateWithProxy(
    `Generate a comprehensive WAEC-standard examination containing ONLY the selected formats: ${selectedTypesList.join(', ')} for subject ${subject} ${level} covering ${topics}${strand ? ` (Strand: ${strand})` : ''}${subStrand ? ` (Sub-Strand: ${subStrand})` : ''} at a ${difficulty} level. Return only valid JSON with "questions" and "markingScheme".`,
    systemInstruction,
    "application/json"
  );

  let parsed: any = null;
  try {
    parsed = parseAIResponse(responseText);
  } catch (err) {
    console.warn("Failed standard JSON parse in generateExam, normalizing raw text...", err);
  }

  return normalizeExamResponse(parsed, responseText, subject, level);
};

export const normalizeExamResponse = (
  parsed: any, 
  rawText: string, 
  subject: string, 
  level: string
): { questions: string; markingScheme: string } => {
  let questions = "";
  let markingScheme = "";

  if (parsed && typeof parsed === 'object') {
    questions = parsed.questions || parsed.exam || parsed.paper || parsed.questionPaper || parsed.test || parsed.content || "";
    markingScheme = parsed.markingScheme || parsed.marking_scheme || parsed.scheme || parsed.answers || parsed.answerKey || parsed.solutions || "";
  } else if (typeof parsed === 'string' && parsed.trim().length > 0) {
    questions = parsed.trim();
  }

  // If questions is still empty, fall back to rawText
  if (!questions && typeof rawText === 'string') {
    questions = rawText.trim();
  }

  // Check if questions has an embedded marking scheme that can be split
  const splitRegex = /(?:^|\n)(?:#{1,4}\s*)?(?:MARKING\s+SCHEME|SCORING\s+GUIDE|ANSWER\s+KEY|MARKING\s+GUIDE|SOLUTIONS|ANSWERS\s+&\s+MARKING\s+SCHEME)[\s\S]*/i;
  if (!markingScheme && questions) {
    const match = questions.match(splitRegex);
    if (match && match.index !== undefined && match.index > 50) {
      const extractedQuestions = questions.substring(0, match.index).trim();
      const extractedScheme = questions.substring(match.index).trim();
      questions = extractedQuestions;
      markingScheme = extractedScheme;
    }
  }

  // If markingScheme is still missing, synthesize a rich, curriculum-aligned scoring guide
  if (!markingScheme) {
    markingScheme = `## ${subject.toUpperCase()} (${level.toUpperCase()}) - MARKING SCHEME & SCORING GUIDE\n\n### General Assessment Principles\n1. Follow official NaCCA Standards-Based Curriculum rubrics.\n2. In Objective/Multiple-Choice sections, allocate 1 mark for each correct option.\n3. In Theory, Problem-Solving, and Practical questions, award step-wise marks for clear reasoning, accurate formulae, correct working, labeled diagrams, and final conclusions.\n\n### Key Concepts & Model Answers\n- Review each corresponding question item in the question paper above.\n- Full marks are awarded for valid contextual Ghanaian examples and learner-centered competency demonstrations.`;
  }

  if (!questions) {
    questions = `# ${subject.toUpperCase()} (${level.toUpperCase()}) EXAMINATION\n\n*Please review the generated questions or click Re-generate.*`;
  }

  return {
    questions,
    markingScheme
  };
};

export const generateNote = async (
  formData: {
    level: string;
    class: string;
    subject: string;
    strand: string;
    subStrand: string;
    contentStandard: string;
    indicator: string;
    coreCompetencies: string;
    week: string;
    duration: string;
    term: string;
    academicYear: string;
    lessonTopic?: string;
    objectives: string;
    locality: string;
    specificLocality?: string;
    differentiation?: string;
    language?: string;
    bilingualLanguage?: string;
  },
  teacherInfo?: { school?: string, district?: string, region?: string, town?: string, locality?: string, isBstemSchool?: boolean }
) => {
  const isGhanaianLanguage = formData.subject.toLowerCase().includes('ghanaian language') || formData.subject.toLowerCase().includes('ghanaian languages') || formData.subject.toLowerCase().includes('ghanaian') || (formData.language && formData.language !== 'English');
  let selectedLanguage = "";
  if (isGhanaianLanguage) {
    if (formData.language && formData.language !== 'English') {
      selectedLanguage = formData.language.toLowerCase().includes('bilingual') ? (formData.bilingualLanguage || 'Twi') : formData.language;
    } else {
      const match = formData.subject.match(/\(([^)]+)\)/);
      if (match) {
        selectedLanguage = match[1];
      }
    }
  }

  const systemInstruction = `
You are an advanced NaCCA-aligned student learning note generation engine designed specifically for Ghanaian learners.

${formData.language && formData.language !== 'English' ? getLanguageInstruction(formData.language, formData.bilingualLanguage) : (isGhanaianLanguage && selectedLanguage ? `
CRITICAL LANGUAGE REQUIREMENT (CONFORMS TO OFFICIAL NaCCA GUIDELINES):
The assessment / learning area subject is specifically the Ghanaian Language: ${selectedLanguage}.
You MUST generate the entire student learning notes—including the title, objectives, keys terms, main lesson notes, important points, worked examples, practice exercises, summary, and homework—ENTIRELY in the ${selectedLanguage} language.
You are STRICTLY FORBIDDEN from writing any part of this lesson note, descriptions, options, lists, guides, or questions in the English language (except for translating from English to ${selectedLanguage} if explicitly asked by the lesson indicators, but even then, the surrounding notes and headings must be in ${selectedLanguage}).
Ensure the spelling, grammar, orthography, tones, and cultural context are 100% authentic and correct for ${selectedLanguage}.
Do NOT include English translations. The learner must see only ${selectedLanguage}.
` : '')}

Your task is to generate HIGH-QUALITY STUDENT LEARNING NOTES based strictly on the official NaCCA curriculum data selected by the teacher or learner.

The notes must be:
* easy to understand,
* engaging,
* strategic for learning and revision,
* learner-friendly,
* and suitable for independent study and classroom revision.

IMPORTANT:
The curriculum structure is already controlled by the system through official dropdown selections.

DO NOT invent or modify:
* Strands
* Sub-Strands
* Content Standards
* Indicators
* Core Competencies

Use ONLY the curriculum information provided by the system.

==================================================
PRIMARY OBJECTIVE
=================
Generate student-centered learning notes that:
✔ simplify difficult concepts,
✔ improve comprehension,
✔ support classroom learning,
✔ encourage independent study,
✔ and help learners prepare effectively for assessments and examinations.

==================================================
INPUT DATA PROVIDED BY SYSTEM
=============================
- Education Level: ${formData.level}
- Class/Form: ${formData.class}
- Subject/Learning Area: ${formData.subject}
- Strand: ${formData.strand}
- Sub-Strand: ${formData.subStrand}
- Content Standard: ${formData.contentStandard}
- Indicator(s): ${formData.indicator}
${formData.lessonTopic ? `- Lesson Topic: ${formData.lessonTopic}` : ''}
- Learning Objectives: ${formData.objectives}
- Locality Setting: ${formData.locality} setting ${formData.specificLocality ? `(${formData.specificLocality})` : ''}
${formData.differentiation ? `- Differentiation Strategy: ${formData.differentiation}` : ''}
${teacherInfo?.school ? `- School Name: ${teacherInfo.school}` : ''}
${teacherInfo?.district ? `- District Name: ${teacherInfo.district}` : ''}
${teacherInfo?.region ? `- Region Name: ${teacherInfo.region}` : ''}
${teacherInfo?.isBstemSchool ? `- BSTEM Aligned School: YES` : ''}

==================================================
STRICT GENERATION RULES
=======================
1. Generate notes strictly based on the selected curriculum content. Automatically use the selected Indicator as the core learning objective. The learning objectives section inside the notes MUST strictly match and be formulated directly from the selected Indicator (phrased as "By the end of the lesson, the learner will be able to: [Indicator text]").
2. Use simple and clear language suitable for the learner’s level.
3. Break difficult concepts into understandable explanations.
4. Use practical and relatable examples.
5. REAL-LIFE PROBLEM SOLVING IN QUESTIONS & EXERCISES: All practice questions, exercises, and homework activities generated (both in the practice section of the notes content and inside the returned JSON "questions" array) MUST always contain real-life, practical, or word problems that can be solved with the knowledge acquired through the specific strands and sub-strands covered. Frame these problems using relatable Ghanaian cultural, societal, geographical, commercial, or environmental issues.
6. Avoid complex educational jargon.
7. Ensure explanations are accurate and curriculum-aligned.
8. Make notes engaging and interactive.
9. Use short paragraphs and bullet points where appropriate.
10. Highlight important points for revision.
${teacherInfo?.isBstemSchool ? `11. BSTEM NOTE INSTRUCTION (CRITICAL): Since this is a BSTEM Aligned School, all student note content, practice questions, and worked examples MUST prioritize BSTEM principles:
    - Incorporate rich step-by-step scientific illustrations, inquiry cycles, and practical science or computing definitions.
    - Provide deep hands-on activities that students can try at home or in the classroom, explaining the underlying scientific, technological, engineering, or mathematical logic in detail.
    - Focus heavily on critical thinking, design loops, and analytical problem-solving.` : ''}
11. Include memory aids, tips, and summaries where useful.
12. Ensure the notes are suitable for:
* classroom revision,
* homework support,
* examination preparation,
* and independent learning.
13. Make the notes feel naturally written for students, not teachers.
14. Avoid robotic AI language and textbook-style overload.
15. Keep the notes concise but comprehensive.

==================================================
WRITING STYLE REQUIREMENTS
==========================
The notes should feel:
* friendly,
* strategic,
* motivating,
* and easy to follow.

Use:
✔ simple explanations
✔ examples learners can relate to
✔ step-by-step breakdowns
✔ revision-friendly formatting

Avoid:
✘ overly academic language
✘ long difficult paragraphs
✘ unnecessary theory
✘ teacher instructional language

==================================================
GENERATE NOTES USING THIS EXACT STRUCTURE
=========================================
The returned "content" must be in beautifully written Markdown styled to consume minimal vertical space. It must strictly contain the following sections in order:

### LESSON OVERVIEW (COMPACT METADATA BLOCK)
To occupy the absolute minimum reasonable space, group these 5 fields (Subject, Class/Form, Strand, Sub-Strand, and Lesson Topic) together at the absolute top of the notes in a compact, elegant, space-saving format (e.g., as a clean single-line pipe-separated list or a tight compact key-value block like: **Subject:** Science | **Class:** Basic 7 | **Strand:** ... | **Sub-Strand:** ... | **Topic:** ...). Do NOT write them as separate large headings or separate lines.

Use small, concise headers (using ### instead of # or ##) for all subsequent sections, and keep the vertical spacing tight and reasonable:

### 6. Learning Objectives
### 7. Key Terms & Vocabulary
### 8. Main Lesson Notes & Explanation
### 9. Important Points to Remember
### 10. Worked Examples (where necessary)
### 11. Practice Questions & Exercises
### 12. Summary & Revision Notes
### 13. Exam Tips (optional)
### 14. Homework / Practice Activity

All sub-headers must be styled cleanly with small headings (###) to maintain a professional, space-efficient, and easy-to-follow layout. Do NOT use huge headings or redundant horizontal lines between every section.

==================================================
ENGAGEMENT REQUIREMENTS
=======================
The notes should:
✔ encourage active learning
✔ improve retention
✔ support quick revision
✔ build learner confidence
✔ make learning enjoyable

Where appropriate:
* use examples,
* comparisons,
* diagrams descriptions,
* memory tricks,
* and simple summaries.

==================================================
QUALITY CONTROL RULES
=====================
Before generating the final notes, ensure:
✔ the content matches the selected curriculum indicator(s)
✔ the language matches the learner’s level
✔ explanations are clear and easy to understand
✔ the notes are revision-friendly
✔ examples are practical and relatable
✔ no curriculum content is omitted unnecessarily

==================================================
FINAL GOAL
==========
Generate professional, engaging, NaCCA-aligned student learning notes that learners in Ghana can:
* understand easily,
* revise confidently,
* study independently,
* and use effectively to improve academic performance.

==================================================
RESPONSE FORMAT
===============
CRITICAL JSON FORMATTING RULES:
1. Because you are returning a JSON object, any double quotes (") inside the markdown string in the "content" field MUST be properly escaped as \" or replaced with single quotes (') to prevent JSON parsing errors. DO NOT output unescaped double quotes anywhere inside string values.
2. Ensure the JSON is completely valid, clean, and properly escaped.

You MUST return a JSON object with this exact structure:
{
  "title": "A short and compelling lesson topic/title",
  "content": "The full lesson note in Markdown formatted strictly with the 14-part structure specified in the 'GENERATE NOTES USING THIS EXACT STRUCTURE' section.",
  "summary": [
    "A list of 3-5 concise, direct key takeaways of the lesson for student review"
  ],
  "questions": [
    "The 3 exercises or practice questions generated in the Practice Questions/Exercises section as individual strings"
  ]
}
  `;

  const responseText = await generateWithProxy(
    `Generate a lesson note for level ${formData.class} in ${formData.subject}${formData.lessonTopic ? ` for the topic "${formData.lessonTopic}"` : ''} based on indicator ${formData.indicator}.`,
    systemInstruction,
    "application/json"
  );

  return parseAIResponse(responseText);
};

/**
 * Robustly parses AI responses that are expected to be JSON.
 * Handles cases where the model might include extra text or markdown markers.
 */
function extractFirstJSON(text: string): string | null {
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  
  if (firstBrace === -1 && firstBracket === -1) return null;
  
  let startIdx = -1;
  let openChar = '{';
  let closeChar = '}';
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    openChar = '{';
    closeChar = '}';
  } else {
    startIdx = firstBracket;
    openChar = '[';
    closeChar = ']';
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < text.length; i++) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;
        if (depth === 0) {
          return text.substring(startIdx, i + 1);
        }
      }
    }
  }

  // Fallback to substring if brace matching didn't close cleanly
  const lastIndex = text.lastIndexOf(closeChar);
  if (lastIndex !== -1 && lastIndex > startIdx) {
    return text.substring(startIdx, lastIndex + 1);
  }

  return null;
}

function sanitizeJsonBackslashes(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '\\') {
      if (i + 1 < str.length) {
        const next = str[i + 1];
        if (
          next === 'n' ||
          next === 't' ||
          next === 'r' ||
          next === '"' ||
          next === '\\' ||
          next === '/' ||
          next === 'b' ||
          next === 'f'
        ) {
          result += '\\' + next;
          i++;
        } else if (next === 'u' && i + 5 < str.length && /^[0-9a-fA-F]{4}$/.test(str.substring(i + 2, i + 6))) {
          result += '\\' + str.substring(i + 1, i + 6);
          i += 5;
        } else {
          result += '\\\\';
        }
      } else {
        result += '\\\\';
      }
    } else {
      result += char;
    }
  }
  return result;
}

function extractFieldStringValue(jsonText: string, key: string): string | null {
  const regex = new RegExp(`"${key}"\\s*:\\s*"`);
  const match = jsonText.match(regex);
  if (!match || match.index === undefined) return null;

  const startIdx = match.index + match[0].length;
  let inEscape = false;
  let value = "";

  for (let i = startIdx; i < jsonText.length; i++) {
    const char = jsonText[i];
    if (inEscape) {
      value += char;
      inEscape = false;
    } else if (char === '\\') {
      value += char;
      inEscape = true;
    } else if (char === '"') {
      return value;
    } else {
      value += char;
    }
  }
  return value;
}

function extractFieldArrayValue(jsonText: string, key: string): string[] | null {
  const regex = new RegExp(`"${key}"\\s*:\\s*\\[`);
  const match = jsonText.match(regex);
  if (!match || match.index === undefined) return null;

  const startIdx = match.index + match[0].length;
  const items: string[] = [];
  let inString = false;
  let inEscape = false;
  let currentStr = "";

  for (let i = startIdx; i < jsonText.length; i++) {
    const char = jsonText[i];
    
    if (inString) {
      if (inEscape) {
        currentStr += char;
        inEscape = false;
      } else if (char === '\\') {
        currentStr += char;
        inEscape = true;
      } else if (char === '"') {
        items.push(currentStr);
        currentStr = "";
        inString = false;
      } else {
        currentStr += char;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === ']') {
        return items;
      }
    }
  }
  return items;
}

function extractDifferentiation(jsonStr: string) {
  const extractSubSection = (sectionName: string) => {
    const startRegex = new RegExp(`"${sectionName}"\\s*:\\s*\\{`);
    const match = jsonStr.match(startRegex);
    if (!match || match.index === undefined) return { activities: "", resources: "", assessments: "" };

    const searchArea = jsonStr.substring(match.index);
    const activities = extractFieldStringValue(searchArea, "activities") || "";
    const resources = extractFieldStringValue(searchArea, "resources") || "";
    const assessments = extractFieldStringValue(searchArea, "assessments") || "";
    return { activities, resources, assessments };
  };

  return {
    strugglingLearners: extractSubSection("strugglingLearners"),
    averageLearners: extractSubSection("averageLearners"),
    advancedLearners: extractSubSection("advancedLearners"),
  };
}

function parseAIResponse(response: any) {
  const text = typeof response === 'string'
    ? response
    : (typeof response?.text === 'function' ? response.text() : (response?.text || ""));
  
  if (!text) {
    throw new Error("Empty response from AI");
  }

  const trimmedText = text.trim();
  try {
    // Try direct parse first
    return JSON.parse(trimmedText);
  } catch (e) {
    try {
      // Try parsing with sanitized backslashes
      const sanitized = sanitizeJsonBackslashes(trimmedText);
      return JSON.parse(sanitized);
    } catch (e2) {
      // Attempt robust balanced-braces JSON extraction
      const extracted = extractFirstJSON(trimmedText);
      if (extracted) {
        try {
          return JSON.parse(extracted);
        } catch (innerE) {
          try {
            const sanitizedExtracted = sanitizeJsonBackslashes(extracted);
            return JSON.parse(sanitizedExtracted);
          } catch (innerE2) {
            console.warn("Standard and sanitized JSON block parsing failed, trying robust schema-aware regex fallback...", innerE2);
          }
        }
      }

      const sourceText = extracted || trimmedText;
      const unescapedString = (str: string) => {
        return str
          .replace(/\\"/g, '"')
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
      };

      try {
        // 1. Check for Exam Schema: "questions", "markingScheme", "marking_scheme", "scheme", "answers"
        const hasQuestionsKey = sourceText.includes('"questions"') || sourceText.includes('"exam"') || sourceText.includes('"paper"') || sourceText.includes('"test"');
        const hasSchemeKey = sourceText.includes('"markingScheme"') || sourceText.includes('"marking_scheme"') || sourceText.includes('"scheme"') || sourceText.includes('"answers"') || sourceText.includes('"solutions"');
        
        if (hasQuestionsKey || hasSchemeKey) {
          const questionsVal = 
            extractFieldStringValue(sourceText, "questions") || 
            extractFieldStringValue(sourceText, "exam") || 
            extractFieldStringValue(sourceText, "paper") || 
            extractFieldStringValue(sourceText, "questionPaper") || 
            extractFieldStringValue(sourceText, "test") || "";
            
          const markingSchemeVal = 
            extractFieldStringValue(sourceText, "markingScheme") || 
            extractFieldStringValue(sourceText, "marking_scheme") || 
            extractFieldStringValue(sourceText, "scheme") || 
            extractFieldStringValue(sourceText, "answers") || 
            extractFieldStringValue(sourceText, "solutions") || "";

          if (questionsVal || markingSchemeVal) {
            return {
              questions: unescapedString(questionsVal).trim(),
              markingScheme: unescapedString(markingSchemeVal).trim()
            };
          }
        }

        // 2. Check for Student Notes Schema: "title", "content", "summary", "questions"
        if (sourceText.includes('"content"') && sourceText.includes('"summary"')) {
          const titleVal = extractFieldStringValue(sourceText, "title") || "";
          const contentVal = extractFieldStringValue(sourceText, "content") || "";
          const summaryVal = extractFieldArrayValue(sourceText, "summary") || [];
          const questionsVal = extractFieldArrayValue(sourceText, "questions") || [];

          return {
            title: unescapedString(titleVal).trim(),
            content: unescapedString(contentVal).trim(),
            summary: summaryVal.map(s => unescapedString(s || "").trim()),
            questions: questionsVal.map(q => unescapedString(q || "").trim())
          };
        }

        // 3. Check for Lesson Plan Schema: "phase1", "phase2", "phase3"
        if (sourceText.includes('"phase1"') || sourceText.includes('"phase2"')) {
          const title = unescapedString(extractFieldStringValue(sourceText, "title") || "").trim();
          const weekEnding = unescapedString(extractFieldStringValue(sourceText, "weekEnding") || "").trim();
          const classSize = unescapedString(extractFieldStringValue(sourceText, "classSize") || "").trim();
          const strand = unescapedString(extractFieldStringValue(sourceText, "strand") || "").trim();
          const subStrand = unescapedString(extractFieldStringValue(sourceText, "subStrand") || "").trim();
          const indicatorCode = unescapedString(extractFieldStringValue(sourceText, "indicatorCode") || "").trim();
          const contentStandardCode = unescapedString(extractFieldStringValue(sourceText, "contentStandardCode") || "").trim();
          const performanceIndicator = unescapedString(extractFieldStringValue(sourceText, "performanceIndicator") || "").trim();
          const coreCompetencies = unescapedString(extractFieldStringValue(sourceText, "coreCompetencies") || "").trim();
          const keyWords = unescapedString(extractFieldStringValue(sourceText, "keyWords") || "").trim();
          const tlrs = unescapedString(extractFieldStringValue(sourceText, "tlrs") || "").trim();
          const references = unescapedString(extractFieldStringValue(sourceText, "references") || "").trim();
          const phase1 = unescapedString(extractFieldStringValue(sourceText, "phase1") || "").trim();
          const phase2 = unescapedString(extractFieldStringValue(sourceText, "phase2") || "").trim();
          const phase3 = unescapedString(extractFieldStringValue(sourceText, "phase3") || "").trim();
          const differentiation = extractDifferentiation(sourceText);

          return {
            title,
            weekEnding,
            classSize,
            strand,
            subStrand,
            indicatorCode,
            contentStandardCode,
            performanceIndicator,
            coreCompetencies,
            keyWords,
            tlrs,
            references,
            phase1,
            phase2,
            phase3,
            differentiation
          };
        }
      } catch (recoveryError) {
        console.error("Backup schema regex recovery failed:", recoveryError);
      }
    }
    
    console.error("AI response did not contain a valid JSON block:", text);
    throw e;
  }
}

export const generateAIPackResource = async (
  type: string, 
  resourceTitle: string, 
  context: string,
  language?: string,
  bilingualLanguage?: string
) => {
  const systemInstruction = `
    You are an expert AI educational consultant specialized in the Ghanaian curriculum (NaCCA) and WAEC standards.
    You are helping a ${type === 'teacher' ? 'teacher' : 'student'} generate specific content for a resource pack.
    
    The resource title is: ${resourceTitle}
    The specific request is: ${context}
    
    ${language && language !== 'English' ? getLanguageInstruction(language, bilingualLanguage) : ''}
    
    Format the output in clean, professional Markdown. 
    Make it actionable, practical, and highly relevant to the Ghanaian educational context.
    Use headings, lists, and tables where appropriate.
    DIAGRAMS/ILLUSTRATIONS: Where a concept benefit from a visual aid, include a detailed text-based description of the diagram or illustration needed, clearly labeled (e.g. [ILLUSTRATION: The Water Cycle showing evaporation, condensation, and precipitation]).
  `;

  return await generateWithProxy(`Generate the ${resourceTitle} content based on: ${context}`, systemInstruction);
};

export const suggestIndicatorCode = async (level: string, subject: string, strand: string, subStrand: string) => {
  const systemInstruction = `
    You are a NaCCA Curriculum Expert for Ghana.
    Given a level (e.g. Basic 7 or B7), subject, strand, and sub-strand, provide the exact NaCCA Indicator Code (e.g., B7.1.1.1.1 or B1.1.1.1.1).
    STRICT COMPLIANCE: Use the official B-prefix nomenclature for all levels (B1-B12).
    ONLY return the indicator code itself. No other text, no preamble, no periods at the end.
    Example output format: B8.2.1.1.2
  `;

  const resText = await generateWithProxy(
    `Predict the NaCCA indicator code for Level: ${level}, Subject: ${subject}, Strand: ${strand}, Sub-Strand: ${subStrand}.`,
    systemInstruction
  );
  return resText.trim();
};

export const generateWithProxy = async (
  prompt: string | any[], 
  systemInstruction?: string, 
  responseMimeType?: string,
  preferredModel?: string
) => {
  const maxRetries = 2;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait briefly before client-side retry
        await new Promise(resolve => setTimeout(resolve, attempt * 1200));
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: typeof prompt === 'string' ? prompt : undefined,
          contents: typeof prompt !== 'string' ? prompt : undefined,
          systemInstruction,
          responseMimeType,
          preferredModel
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let rawMessage = errData.error || errData.details || `Server returned status ${response.status}`;
        
        // Try parsing nested JSON string if the server returned raw JSON from the SDK
        if (typeof rawMessage === 'string' && rawMessage.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(rawMessage);
            if (parsed.error?.message) {
              rawMessage = parsed.error.message;
            }
          } catch {
            // keep rawMessage
          }
        }

        const isUnavailable = 
          response.status === 503 || 
          response.status === 429 || 
          rawMessage.includes('503') || 
          rawMessage.includes('high demand') || 
          rawMessage.includes('UNAVAILABLE') ||
          rawMessage.includes('RESOURCE_EXHAUSTED');

        if (isUnavailable && attempt < maxRetries) {
          console.warn(`[generateWithProxy] Transient 503/high-demand error on attempt ${attempt + 1}. Retrying...`);
          continue;
        }

        throw new Error(rawMessage);
      }

      const data = await response.json();
      return data.text;
    } catch (error: any) {
      lastError = error;
      if (attempt >= maxRetries) {
        break;
      }
    }
  }

  let finalErrorMessage = lastError?.message || "Failed to generate content.";
  if (finalErrorMessage.includes("503") || finalErrorMessage.includes("high demand") || finalErrorMessage.includes("UNAVAILABLE")) {
    finalErrorMessage = "The AI service is experiencing high traffic spikes. Please wait a moment and try clicking Generate again.";
  }

  console.error("[generateWithProxy error]:", finalErrorMessage);
  throw new Error(finalErrorMessage);
};


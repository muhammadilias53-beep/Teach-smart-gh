import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateLessonPlan = async (prompt: string, teacherInfo?: { school?: string, district?: string, town?: string, region?: string }) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an expert Ghanaian teacher and curriculum consultant strictly following the NaCCA (National Council for Curriculum and Assessment) Standard-Based Curriculum (SBC) and Common Core Programme (CCP).
    Generate content that is 100% compliant with the latest Ghanaian educational standards as seen in official Strategic Schemes of Learning.
    
    NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12.
    INDICATORS: You MUST include and strictly follow the Indicator Code provided. Every activity must map back to these curriculum indicators.
    
    LESSON PLAN STRUCTURE (NaCCA CCP/SBC Standards):
    - Phase 1: Starter (Preparing the brain for learning) - 10 mins. Focus on prior knowledge.
    - Phase 2: Main (New Learning including assessment) - 40 mins. Step-by-step teaching and learning activities using various techniques (think-pair-share, group work, etc.).
    - Phase 3: Plenary / Reflection - 10 mins. Summary and assessment.
    
    ${teacherInfo?.school ? `TEACHER CONTEXT:
    School: ${teacherInfo.school}
    Town: ${teacherInfo.town || 'N/A'}
    District: ${teacherInfo.district || 'N/A'}
    Region: ${teacherInfo.region || 'N/A'}` : ''}

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

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return parseAIResponse(response);
};

export const generateSchemeOfWork = async (
  subject: string, 
  level: string, 
  type: string, 
  term?: string, 
  options?: { 
    includeLearningOutcomes?: boolean, 
    customPrompt?: string
  }
) => {
  const model = "gemini-3-flash-preview";
  
  let formatInstructions = "";
  if (type === 'yearly') {
    formatInstructions = `
      STRICT CURRICULUM REQUIREMENT: 
      1. This document serves as the MASTER ROADMAP for the entire academic year.
      2. SYSTEMATIC DISTRIBUTION: You MUST systematically distribute ALL strands and sub-strands from the NaCCA curriculum across Term 1, Term 2, and Term 3.
      3. FULL COVERAGE: By the end of Term 3, 100% of the curriculum for ${subject} ${level} MUST be exhausted. No sub-strand should be left out.
      4. PROGRESSION: Ensure a logical transition of content from Term 1 through to Term 3.
      
      Format the entire scheme as ONE SINGLE Markdown Table.
      Headers MUST be:
      | WEEK | TERM 1 | TERM 2 | TERM 3 | ${options?.includeLearningOutcomes ? 'LEARNING OUTCOMES |' : ''}
      | :--- | :--- | :--- | :--- | ${options?.includeLearningOutcomes ? ':--- |' : ''}
      
      Include exactly one row per week (Week 1 to Week 12). Each term column should contain the specific SUB-STRANDS and Key Topics to be taught that week.
      At the end of the document, include the footer:
      Vetted by: ................................ Signature: ................................ Date: ................................
    `;
  } else if (type === 'termly') {
    const termLabel = term ? `TERM ${term}` : 'a specific term';
    formatInstructions = `
      STRICT CURRICULUM REQUIREMENT:
      1. This termly scheme MUST be a detailed, week-by-week decomposition of the official yearly roadmap for ${subject} ${level}.
      2. Ensure that ALL sub-strands systematically assigned to ${termLabel} are covered in depth.
      3. Follow the logical progression of content standards as defined in the NaCCA curriculum.

      Format the entire scheme as ONE SINGLE Markdown Table for ${termLabel}.
      Headers MUST be:
      | WEEK | STRAND | SUB-STRAND | CONTENT STANDARDS | INDICATOR | ${options?.includeLearningOutcomes ? 'LEARNING OUTCOMES |' : ''} RESOURCES |
      | :--- | :--- | :--- | :--- | :--- | ${options?.includeLearningOutcomes ? ':--- |' : ''} :--- |
      
      Include exactly one row per week (Week 1 to Week 12).
    `;
  }

  const systemInstruction = `
    You are a NaCCA Curriculum Expert. Generate an official ${type.toUpperCase()} STRATEGIC SCHEME OF LEARNING for ${subject} (${level})${term && type === 'termly' ? ` specifically for TERM ${term}` : ''}.
    All content must align strictly with the latest Ghanaian National Curriculum (SBC/CCP) and NaCCA standards.
    
    ${options?.customPrompt ? `SPECIFIC FOCUS: ${options.customPrompt}` : ''}

    NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12.
    ${formatInstructions}
    
    Rules:
    1. ONLY return the markdown table. No preambles.
    2. Ensure columns are correctly aligned.
    3. Content must be rigorous and strictly aligned with the official NaCCA Scheme of Learning for the specified grade and term.
    4. Ensure indicators include official codes (e.g., B7.1.3.1.1).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a ${type} scheme of learning table for ${subject} ${level}${term && type === 'termly' ? ` Term ${term}` : ''}.${options?.customPrompt ? ` ${options.customPrompt}` : ''}`,
    config: { systemInstruction },
  });

  return response.text;
};

export const generateExam = async (
  subject: string, 
  level: string, 
  topics: string, 
  difficulty: string, 
  teacherInfo?: { school?: string, region?: string, district?: string, town?: string }, 
  questionTypes?: string[],
  p1Settings?: { count: number, difficulty: string },
  p2Settings?: { count: number, difficulty: string },
  strand?: string,
  subStrand?: string,
  contentStandard?: string,
  indicatorCode?: string
) => {
  const model = "gemini-3-flash-preview";
  
  // Determine WAEC question counts based on level
  const isSHS = level.toLowerCase().includes('shs');
  const objectiveCount = p1Settings?.count ?? (isSHS ? 50 : 40);
  const p1Diff = p1Settings?.difficulty ?? difficulty;
  
  const theoryCount = p2Settings?.count ?? 6;
  const p2Diff = p2Settings?.difficulty ?? difficulty;
  const theoryToAnswer = theoryCount === 6 ? 4 : Math.ceil(theoryCount * 0.7);

  const systemInstruction = `
    You are an expert examiner for the West African Examinations Council (WAEC), strictly adhering to NaCCA SBC/CCP and GES assessment standards for Ghana.
    Generate a high-quality examination for ${subject} (${level}) based on the topics, strand, sub-strand, content standard, and indicator provided.
    
    CORE REQUIREMENTS:
    1. ALIGNMENT: Content MUST be strictly based on the provided Strand, Sub-Strand, Content Standard (${contentStandard || 'N/A'}), Indicator (${indicatorCode || 'N/A'}), and Topics (${topics}). Every single question must be traceable to a NaCCA curriculum indicator.
    2. NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12.
    
    Overall Examination Difficulty: ${difficulty}
    ${questionTypes && questionTypes.length > 0 ? `Selected Question Types to include: ${questionTypes.join(', ')}` : ''}
    
    ${teacherInfo?.school ? `SCHOOL HEADER INFO:
    School Name: ${teacherInfo.school}
    Town: ${teacherInfo.town || 'N/A'}
    District: ${teacherInfo.district || 'N/A'}
    Region: ${teacherInfo.region || 'N/A'}` : ''}

    STRICT WAEC COMPLIANCE RULES:
    1. STRUCTURE:
       - PAPER 1 (SECTION A): Objective Test.
       - PAPER 2 (SECTION B): Essay/Theory.
       ${questionTypes?.includes('Practical') || subject.toLowerCase().includes('science') ? '- PAPER 3 (SECTION C): Practical Work / Test of Practical Knowledge.' : ''}
    2. QUESTION COUNTS & DIFFICULTY:
       - SECTION A (Objectives): Exactly ${objectiveCount} Multiple Choice Questions (A, B, C, D). Section difficulty: ${p1Diff}.
       - SECTION B (Essay): Exactly ${theoryCount} Essay questions. Section difficulty: ${p2Diff}.
       ${questionTypes?.includes('Practical') || subject.toLowerCase().includes('science') ? '- SECTION C: At least 3 detailed Practical questions based on diagrams, measurements, and identification.' : ''}
    3. INSTRUCTIONS:
       - Header must include: "NAME: ....................................", "INDEX NUMBER: ............................", "DATE: ............................"
       - ${teacherInfo?.school ? `Include the school name "${teacherInfo.school.toUpperCase()}" prominently in the header centered, followed by the Town and Region if available.` : 'Include placeholders for school name.'}
       - Section A Instruction: "Answer ALL questions in this section."
       - Section B Instruction: "Answer question 1 and any other ${theoryToAnswer - 1} questions (for a total of ${theoryToAnswer})."
       ${questionTypes?.includes('Practical') || subject.toLowerCase().includes('science') ? '- Section C Instruction: "Answer ALL questions in this section. All diagrams should be clearly labeled."' : ''}
    4. QUALITY:
       - Questions must be rigorous and strictly aligned with the Ghanaian NaCCA/WAEC standardized syllabus.
       - Each Theory question must have multiple sub-parts.
       - PRACTICAL QUESTIONS: For subjects requiring practicals (Science, Career Tech, etc.), you MUST include a dedicated section for PRACTICAL QUESTIONS. 
       - DIAGRAMS: Since you are generating text, represent diagrams as clear, boxed placeholders with detailed descriptions and identification labels. Example:
         [DIAGRAM 1: EXPERIMENTAL SETUP FOR PHOTOSYNTHESIS]
         - Label A: Light source
         - Label B: Water weed in a beaker
         - Label C: Gas being collected in a test tube
       - Ensure all practical questions involve scenarios with apparatus, observations, and data interpretation as per WAEC format.
    5. FORMATTING:
       - Use Arabic numerals for main questions correctly prefixed (e.g., 1., 2.).
       - Use lower case letters (e.g., a., b.) for sub-questions.
       - Use Roman numerals (e.g., i, ii) for further sub-divisions.
       - Ensure all multiple choice options are listed with bullets or A, B, C, D labels.
    
    CRITICAL REQUIREMENT: You MUST also generate a VERY DETAILED marking scheme.
    - For Objective questions, provide a key (e.g., 1. A, 2. B) followed by the correct answer text.
    - For Theory questions, provide a detailed mark allocation (e.g., [2 marks], [4 marks]) and expected points for each sub-part.
    
    The response MUST be a JSON object:
    {
      "questions": "The exam questions in Markdown format with professional headers.",
      "markingScheme": "The marking scheme in Markdown format. Clearly match the numbering used in the questions."
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a full WAEC-style examination for ${subject} ${level} covering ${topics}${strand ? ` (Strand: ${strand})` : ''}${subStrand ? ` (Sub-Strand: ${subStrand})` : ''} at a ${difficulty} level.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return parseAIResponse(response);
};

export const generateNote = async (
  subject: string,
  level: string,
  topic: string,
  objectives: string,
  teacherInfo?: { school?: string, district?: string, region?: string, town?: string, locality?: string },
  differentiation?: string
) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an expert Ghanaian teacher and curriculum developer for NaCCA, specialized in the Standard-Based Curriculum (SBC) and Common Core Programme (CCP).
    Your task is to generate COMPELLING, ACCURATE, and EASY-TO-UNDERSTAND lesson notes that strictly follow GES requirements.
    
    ALIGNMENT: You MUST generate content specifically for the provided:
    Level: ${level}
    Subject: ${subject}
    Topic/Context: ${topic}
    
    NOMENCLATURE: ALWAYS use the "Basic" level format (e.g., B1-B6 for Primary, B7-B9 for Junior High, B10-B12 for Senior High). NEVER use JHS or SHS alone; always refer to them as Basic 7-9 or Basic 10-12.
    Core Objectives: ${objectives}
    
    ${teacherInfo?.locality ? `LOCALITY CONTEXT: ${teacherInfo.locality} (${teacherInfo.town || 'N/A'}). 
    TAILORING: Use examples and comparisons that students in a ${teacherInfo.locality} setting would find most relatable.` : ''}

    ${differentiation ? `DIFFERENTIATION FOCUS: ${differentiation}` : ''}
    
    STRUCTURE OF THE NOTE:
    1. Introduction: Engaging opening that connects to prior knowledge.
    2. Key Concepts: Clear definitions and explanations.
    3. Detailed Body: Break down the topic into sub-headings. Use bullet points for readability.
    4. Examples: Relatable Ghanaian examples (e.g., local currencies, landmarks, cultural practices if applicable).
    5. Summary: 3-5 key takeaways.
    6. Review Questions: 5 questions to test understanding (Objectives and Theory).
    
    FORMATTING:
    - Use Markdown for the content.
    - Use bold text for key terms.
    - Response MUST be a JSON object:
    {
      "title": "Topic Title",
      "content": "The full lesson note in Markdown",
      "summary": ["Point 1", "Point 2", "..."],
      "questions": ["Q1", "Q2", "..."]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a detailed student note for ${topic} (${level}) in ${subject}.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  return parseAIResponse(response);
};

/**
 * Robustly parses AI responses that are expected to be JSON.
 * Handles cases where the model might include extra text or markdown markers.
 */
function parseAIResponse(response: any) {
  const text = typeof response.text === 'function' ? response.text() : (response.text || "");
  
  if (!text) {
    throw new Error("Empty response from AI");
  }

  try {
    // Try direct parse first
    return JSON.parse(text.trim());
  } catch (e) {
    // Attempt to extract anything between the first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      const potentialJSON = text.substring(start, end + 1);
      try {
        return JSON.parse(potentialJSON);
      } catch (innerE) {
        console.error("Failed to parse extracted JSON block:", potentialJSON);
        throw e; // Throw original error for better context
      }
    }
    
    console.error("AI response did not contain a valid JSON block:", text);
    throw e;
  }
}

export const generateAIPackResource = async (type: string, resourceTitle: string, context: string) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an expert AI educational consultant specialized in the Ghanaian curriculum (NaCCA) and WAEC standards.
    You are helping a ${type === 'teacher' ? 'teacher' : 'student'} generate specific content for a resource pack.
    
    The resource title is: ${resourceTitle}
    The specific request is: ${context}
    
    Format the output in clean, professional Markdown. 
    Make it actionable, practical, and highly relevant to the Ghanaian educational context.
    Use headings, lists, and tables where appropriate.
    DIAGRAMS/ILLUSTRATIONS: Where a concept benefit from a visual aid, include a detailed text-based description of the diagram or illustration needed, clearly labeled (e.g. [ILLUSTRATION: The Water Cycle showing evaporation, condensation, and precipitation]).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate the ${resourceTitle} content based on: ${context}`,
    config: { systemInstruction },
  });

  return response.text;
};

export const suggestIndicatorCode = async (level: string, subject: string, strand: string, subStrand: string) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are a NaCCA Curriculum Expert for Ghana.
    Given a level (e.g. Basic 7 or B7), subject, strand, and sub-strand, provide the exact NaCCA Indicator Code (e.g., B7.1.1.1.1 or B1.1.1.1.1).
    STRICT COMPLIANCE: Use the official B-prefix nomenclature for all levels (B1-B12).
    ONLY return the indicator code itself. No other text, no preamble, no periods at the end.
    Example output format: B8.2.1.1.2
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Predict the NaCCA indicator code for Level: ${level}, Subject: ${subject}, Strand: ${strand}, Sub-Strand: ${subStrand}.`,
    config: { systemInstruction },
  });

  return response.text.trim();
};

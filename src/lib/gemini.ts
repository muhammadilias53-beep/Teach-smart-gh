import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateLessonPlan = async (prompt: string, teacherInfo?: { school?: string, district?: string, town?: string, region?: string }) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an expert Ghanaian teacher familiar with the NaCCA (National Council for Curriculum and Assessment) curriculum.
    Generate a highly detailed lesson plan in the EXACT format required by the official Ghanaian teacher's lesson notebook.
    
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

export const generateSchemeOfWork = async (subject: string, level: string, type: string, term?: string, options?: { includeLearningOutcomes?: boolean }) => {
  const model = "gemini-3-flash-preview";
  
  let formatInstructions = "";
  if (type === 'yearly') {
    formatInstructions = `
      STRICT REQUIREMENT: Format the entire scheme as ONE SINGLE Markdown Table. 
      Headers MUST be:
      | WEEK | TERM 1 (SUB STRANDS) | TERM 2 (SUB STRANDS) | TERM 3 (SUB STRANDS) | ${options?.includeLearningOutcomes ? 'LEARNING OUTCOMES |' : ''}
      | :--- | :--- | :--- | :--- | ${options?.includeLearningOutcomes ? ':--- |' : ''}
      
      Include exactly one row per week.
      At the end of the document, include the footer:
      Vetted by: ................................ Signature: ................................ Date: ................................
    `;
  } else if (type === 'termly') {
    const termLabel = term ? `TERM ${term}` : 'a specific term';
    formatInstructions = `
      STRICT REQUIREMENT: Format the entire scheme as ONE SINGLE Markdown Table for ${termLabel}.
      Headers MUST be:
      | WEEK | STRAND | SUB-STRAND | CONTENT STANDARDS | INDICATOR | ${options?.includeLearningOutcomes ? 'LEARNING OUTCOMES |' : ''} RESOURCES |
      | :--- | :--- | :--- | :--- | :--- | ${options?.includeLearningOutcomes ? ':--- |' : ''} :--- |
      
      Include exactly one row per week (Week 1 to Week 12).
    `;
  }

  const systemInstruction = `
    You are a NaCCA Curriculum Expert. Generate an official ${type.toUpperCase()} SCHEME OF LEARNING for ${subject} (${level})${term && type === 'termly' ? ` specifically for TERM ${term}` : ''}.
    
    ${formatInstructions}
    
    Rules:
    1. ONLY return the markdown table. No preambles.
    2. Ensure columns are correctly aligned.
    3. Content must be rigorous and strictly aligned with the Ghanaian National Curriculum for the specified term.
    4. Ensure the table is clearly readable.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a ${type} scheme of learning table for ${subject} ${level}${term && type === 'termly' ? ` Term ${term}` : ''}.`,
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
  p2Settings?: { count: number, difficulty: string }
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
    You are an expert examiner for the West African Examinations Council (WAEC), familiar with BECE and WASSCE standards in Ghana.
    Generate a high-quality examination for ${subject} (${level}) based on the topics: ${topics}.
    
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
    contents: `Generate a full WAEC-style examination for ${subject} ${level} covering ${topics} at a ${difficulty} level.`,
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
  teacherInfo?: { school?: string, district?: string, region?: string }
) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are an expert Ghanaian teacher and curriculum developer for NaCCA.
    Your task is to generate COMPELLING, ACCURATE, and EASY-TO-UNDERSTAND lesson notes for students.
    
    The notes must be strictly aligned with the Ghanaian NaCCA curriculum for ${level}.
    Subject: ${subject}
    Topic: ${topic}
    Core Objectives: ${objectives}
    
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

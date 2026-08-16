import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Link as LinkIcon, 
  FileText, 
  StickyNote, 
  ExternalLink, 
  Download,
  Trash2, 
  Filter,
  Loader2,
  X,
  FolderOpen,
  Book,
  CheckCircle,
  ShieldCheck,
  Star
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc,
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { getOffline } from '../../lib/indexedDB';
import { useAuth } from '../../contexts/AuthContext';
import { Resource } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { subjects, levels, CLASSES_BY_LEVEL, SUBJECT_STRANDS, SUBJECT_SUB_STRANDS } from '../../constants';
import { toast } from 'react-hot-toast';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { safeLocalStorage } from '../../lib/storage';
import { Link } from 'react-router';

const getSelectableStrands = (subj: string, lvl: string) => {
  if (subj === 'English' && lvl === 'JHS') {
    return ["Oral Language", "Reading", "Grammar Usage", "Writing", "Literature"];
  }
  if (subj === 'Ghanaian Language' && lvl === 'JHS') {
    return ["Customs and Institutions", "Listening and Speaking", "Reading", "Language and Usage", "Composition Writing", "Literature"];
  }
  if (subj === 'History' && lvl === 'SHS') {
    return ["Historical Inquiry and Writing", "States and Societies in Pre-Colonial Times", "Age of Encounter and Exchanges Up to the 20th Century", "Independence and Post-Colonial Developments"];
  }
  return SUBJECT_STRANDS[subj] || [];
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Using constants from src/constants.ts

const CURRICULUM_BOOKS: Record<string, { title: string, url: string, level: string }[]> = {
  "Mathematics": [
    { title: "KG Mathematics Curriculum", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MATHEMATICS-KG.pdf", level: "KG" },
    { title: "Mathematics Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MATHEMATICS-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Mathematics Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Mathematics-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "NaCCA SHS Mathematics Curriculum (SHS 1-3, Sept 2023)", url: "https://nacca.gov.gh/wp-content/uploads/2023/09/MATHEMATICS-SHS.pdf", level: "SHS" }
  ],
  "English": [
    { title: "KG English Language", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-KG.pdf", level: "KG" },
    { title: "English Language Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "English Language Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/English-Language-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High English Language", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-LANGUAGE-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "Science": [
    { title: "KG Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SCIENCE-KG.pdf", level: "KG" },
    { title: "Science Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SCIENCE-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Science Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Science-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" },
    { title: "Senior High Integrated Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/INTEGRATED-SCIENCE-SHS.pdf", level: "Basic 10-12 (SHS)" }
  ],
  "Our World Our People": [
    { title: "Our World Our People (B1-B3)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/OUR-WORLD-AND-OUR-PEOPLE-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-3 (Primary)" },
    { title: "Our World Our People (B4-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/OUR-WORLD-AND-OUR-PEOPLE-UPPER-PRIMARY-B4-B6.pdf", level: "Basic 4-6 (Primary)" }
  ],
  "Physical Education": [
    { title: "Physical Education Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/PE-LP-B1-B6.pdf", level: "Basic 1-6 (Primary)" },
    { title: "PE and Health Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/PE-JHS-B7-B9.pdf", level: "JHS" },
    { title: "NaCCA SHS Physical Education & Health (Core) Curriculum (SHS 1-3, Sept 2023)", url: "https://nacca.gov.gh/wp-content/uploads/2023/09/PHYSICAL-EDUCATION-SHS.pdf", level: "SHS" }
  ],
  "Computing": [
    { title: "Computing Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/COMPUTING-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Computing Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Computing-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Career Technology": [
    { title: "Career Technology (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Career-Technology-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "RME": [
    { title: "RME Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/RME-LOWER-PRIMARY-B1-B3.pdf", level: "Basic 1-6 (Primary)" },
    { title: "RME Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/RME-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Creative Arts": [
    { title: "Creative Arts and Design (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CREATIVE-ARTS-B1-B6.pdf", level: "Basic 1-6 (Primary)" },
    { title: "Creative Arts and Design (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Creative-Arts-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Art and Design Studio": [
    { title: "NaCCA Art and Design Studio Curriculum (SHS 1-3, Sept 2023)", url: "https://nacca.gov.gh/wp-content/uploads/2023/09/ART-AND-DESIGN-STUDIO-SHS.pdf", level: "SHS" }
  ],
  "French": [
    { title: "French Curriculum (B4-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/FRENCH-B4-B6.pdf", level: "Basic 1-6 (Primary)" },
    { title: "French Curriculum (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/French-JHS-B7-B9.pdf", level: "Basic 7-9 (JHS)" }
  ],
  "Ghanaian Language": [
    { title: "Ghanaian Language Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GHANAIAN-LANGUAGE-B1-B3.pdf", level: "Basic" },
    { title: "JHS Ghanaian Language (B7-B9)", url: "https://nacca.gov.gh/wp-content/uploads/2020/12/Ghanaian-Language-JHS-B7-B9.pdf", level: "JHS" }
  ],
  "History": [
    { title: "Primary History Curriculum (B1-B6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/HISTORY-B1-B6.pdf", level: "Primary" },
    { title: "SHS History", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/HISTORY-SHS.pdf", level: "SHS" }
  ],
  "Arabic": [
    { title: "SHS Arabic Curriculum", url: "https://nacca.gov.gh/wp-content/uploads/2023/09/ARABIC-SHS.pdf", level: "SHS" }
  ],
  "Additional Mathematics": [
    { title: "SHS Additional Mathematics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ELECTIVE-MATHEMATICS-SHS.pdf", level: "SHS" }
  ],
  "Physics": [
    { title: "SHS Physics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/PHYSICS-SHS.pdf", level: "SHS" }
  ],
  "Chemistry": [
    { title: "SHS Chemistry", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CHEMISTRY-SHS.pdf", level: "SHS" }
  ],
  "Biology": [
    { title: "SHS Biology", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/BIOLOGY-SHS.pdf", level: "SHS" }
  ],
  "Economics": [
    { title: "SHS Economics", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ECONOMICS-SHS.pdf", level: "SHS" }
  ],
  "Geography": [
    { title: "SHS Geography", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GEOGRAPHY-SHS.pdf", level: "SHS" }
  ],
  "Government": [
    { title: "SHS Government", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GOVERNMENT-SHS.pdf", level: "SHS" }
  ],
  "Literature in English": [
    { title: "NaCCA SHS Literature-in-English Curriculum (SHS 1-3, Sept 2023)", url: "https://nacca.gov.gh/wp-content/uploads/2023/09/LITERATURE-IN-ENGLISH-SHS.pdf", level: "SHS" }
  ],
  "Financial Accounting": [
    { title: "SHS Financial Accounting", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/FINANCIAL-ACCOUNTING-SHS.pdf", level: "SHS" }
  ],
  "Cost Accounting": [
    { title: "SHS Cost Accounting", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/COST-ACCOUNTING-SHS.pdf", level: "SHS" }
  ],
  "Business Management": [
    { title: "SHS Business Management", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/BUSINESS-MANAGEMENT-SHS.pdf", level: "SHS" }
  ],
  "Agricultural Science": [
    { title: "SHS Agricultural Science", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/AGRICULTURAL-SCIENCE-SHS.pdf", level: "SHS" }
  ],
  "Elective ICT": [
    { title: "SHS Elective ICT", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ELECTIVE-ICT-SHS.pdf", level: "SHS" }
  ],
  "CRS": [
    { title: "SHS Christian Religious Studies", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CRS-SHS.pdf", level: "SHS" }
  ],
  "IRS": [
    { title: "SHS Islamic Religious Studies", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/IRS-SHS.pdf", level: "SHS" }
  ],
  "Food & Nutrition": [
    { title: "SHS Food and Nutrition", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/FOOD-AND-NUTRITION-SHS.pdf", level: "SHS" }
  ],
  "Graphic Design": [
    { title: "SHS Graphic Design", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/GRAPHIC-DESIGN-SHS.pdf", level: "SHS" }
  ],
  "Management in Living": [
    { title: "SHS Management in Living", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MANAGEMENT-IN-LIVING-SHS.pdf", level: "SHS" }
  ],
  "Clothing & Textiles": [
    { title: "SHS Clothing and Textiles", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/CLOTHING-AND-TEXTILES-SHS.pdf", level: "SHS" }
  ],
  "Technical Drawing": [
    { title: "SHS Technical Drawing", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/TECHNICAL-DRAWING-SHS.pdf", level: "SHS" }
  ],
  "Applied Electricity": [
    { title: "SHS Applied Electricity", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/APPLIED-ELECTRICITY-SHS.pdf", level: "SHS" }
  ],
  "Resource Packs": [
    { title: "SBC Training Manual (KG-P6)", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/Training-Manual-Primary-Final.pdf", level: "KG-P6" },
    { title: "CCP Training Manual (B7-B10)", url: "https://nacca.gov.gh/wp-content/uploads/2020/07/CCP-MANUAL-FINAL.pdf", level: "B7-B10" },
    { title: "Mathematics Resource Pack", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/MATHEMATICS-RESOURCE-PACK.pdf", level: "Basic" },
    { title: "Science Resource Pack", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/SCIENCE-RESOURCE-PACK.pdf", level: "Basic" },
    { title: "English Resource Pack", url: "https://nacca.gov.gh/wp-content/uploads/2019/04/ENGLISH-RESOURCE-PACK.pdf", level: "Basic" }
  ],
  "Important Links": [
    { title: "NaCCA Official Website", url: "https://nacca.gov.gh/", level: "All" },
    { title: "NTC Portal (Teacher Licensing)", url: "https://ntc.gov.gh/", level: "All" },
    { title: "WAEC Ghana Official", url: "https://www.waecgh.org/", level: "All" },
    { title: "GES Promotional Portal", url: "https://gespromotions.gov.gh/", level: "All" },
    { title: "West African Examinations Council", url: "https://www.waecgh.org/results", level: "All" }
  ]
};

const OFFICIAL_SYSTEM_RESOURCES: Omit<Resource, 'createdAt'>[] = [
  {
    id: 'system-lesson-notes-science-b7',
    authorId: 'system',
    title: 'Diversity of Matter - Basic 7 Lesson Notes',
    description: 'NaCCA-aligned comprehensive daily lesson notes on pure substances and mixtures for JHS 1 Science.',
    subject: 'Science',
    level: 'JHS',
    strand: 'Diversity of Matter',
    subStrand: 'Materials',
    topic: 'Pure and Impure Substances',
    type: 'note',
    resourceCategory: 'AI-Generated Lesson Notes',
    term: 'Term 1',
    content: `### Pure and Impure Substances\n**Subject:** Science | **Class:** Basic 7 | **Strand:** Diversity of Matter | **Sub-Strand:** Materials\n\n--- \n### 6. Learning Objectives\n- Define pure and impure substances with local examples.\n- Perform simple chromatography to separate mixtures.\n\n### 7. Key Terms\n- **Pure Substance:** Made of only one type of particle (e.g., distilled water).\n- **Impure Substance:** Contains two or more different substances mixed together (e.g., muddy tap water).\n\n### 8. Explanation\nIn Science, matter can be classified based on its purity...\n\n### 9. Guided Practice:\nShow students pure water and dissolved salt water. Discuss how we can reclaim the salt via evaporation or retrieve pure water via distillation.`
  },
  {
    id: 'system-student-notes-math-b4',
    authorId: 'system',
    title: 'Fractions Made Simple - Primary 4 Student Notes',
    description: 'Highly visual and easy-to-understand student notes with diagrams and practice tasks on fractions.',
    subject: 'Mathematics',
    level: 'Primary',
    strand: 'Number',
    subStrand: 'Fractions',
    topic: 'Introduction to Fractions',
    type: 'note',
    resourceCategory: 'AI-Generated Student Notes',
    term: 'Term 1',
    content: `### Introduction to Fractions\n**Subject:** Mathematics | **Class:** Basic 4 | **Strand:** Number\n\n--- \n### 1. Learning Objectives\n- Identify numerator and denominator.\n- Represent fractions using circles and rectangles.\n\n### 2. What is a Fraction?\nA fraction represents a part of a whole. It has two parts:\n- **Numerator (Top):** How many parts we have.\n- **Denominator (Bottom):** Total number of equal parts the whole is divided into.\n\n### 3. Quick Check\nIf you slice a round pizza into 4 equal slices and eat 1 slice, you consumed 1/4 of the pizza!`
  },
  {
    id: 'system-scheme-science-b7',
    authorId: 'system',
    title: 'Basic 7 Integrated Science Term 1 Scheme of Learning',
    description: 'Full 12-week comprehensive Scheme of Learning detailing strands, sub-strands, and weekly activities.',
    subject: 'Science',
    level: 'JHS',
    strand: 'All Strands',
    subStrand: 'All Sub-Strands',
    topic: '12-Week Allocation',
    type: 'file',
    resourceCategory: 'Scheme of Learning',
    term: 'Term 1',
    content: `### Weekly Scheme of Learning\n**Subject:** Science | **Class:** Basic 7 | **Term:** Term 1\n\n| Week | Strand | Sub-Strand | Content Standard | Lesson Topic | Activities |\n|---|---|---|---|---|---|\n| Week 1 | Diversity of Matter | Materials | B7.1.1.1 | Introduction to Matter | Learners sort materials into natural and synthetic categories |\n| Week 2 | Diversity of Matter | Materials | B7.1.1.1 | Classifying Objects | Group work to discuss physical properties of plastics and wood |\n| Week 3 | Diversity of Matter | Materials | B7.1.1.2 | Pure & Impure Substances | Laboratory filtration of muddy water |`
  },
  {
    id: 'system-exam-science-b7',
    authorId: 'system',
    title: 'JHS 1 Science Term 1 Final Exam Questions',
    description: 'Printable professional examination containing Section A (Objectives) and Section B (Theory) on materials.',
    subject: 'Science',
    level: 'JHS',
    strand: 'Multiple Strands',
    subStrand: 'All Sub-strands',
    topic: 'Comprehensive Term Assessment',
    type: 'file',
    resourceCategory: 'Exam Questions',
    term: 'Term 1',
    content: `### Term 1 End of Term Examination\n**Subject:** Science | **Class:** Basic 7\n\n**SECTION A: OBJECTIVES (20 Marks)**\n1. Which of the following is a synthetic material?\n   A) Wood  \n   B) Clay  \n   C) Plastic  \n   D) Wool\n\n2. Distilled water is a classic example of:\n   A) Mixture\n   B) Element\n   C) Pure Substance\n   D) Compound\n\n--- \n\n**SECTION B: THEORY (30 Marks)**\nExplain with diagrams how a mixture of salt and water can be separated in the classroom.`
  },
  {
    id: 'system-marking-science-b7',
    authorId: 'system',
    title: 'Marking Scheme: JHS 1 Science Term 1 Exam',
    description: 'Official marking key with detailed explanations, point breakdown, and standard rubrics.',
    subject: 'Science',
    level: 'JHS',
    strand: 'Multiple Strands',
    type: 'file',
    resourceCategory: 'Marking Scheme',
    term: 'Term 1',
    content: `### Exam Marking Key & Rubric\n**Subject:** Science | **Class:** Basic 7 | **Term:** Term 1\n\n**SECTION A Answers:**\n1. C (Plastic) - 1 Mark\n2. C (Pure Substance) - 1 Mark\n\n--- \n**SECTION B Answers:**\n- Step-by-step description of evaporating solution to recover dry salt crystals. (5 Marks)\n- Labelled diagram showing: beaker, spirit burner, wire gauze, and tripod stand. (5 Marks)`
  },
  {
    id: 'system-worksheet-math-b6',
    authorId: 'system',
    title: 'Algebraic Expressions Practice Worksheet - Basic 6',
    description: '10 engaging problems with answers for classroom activities, group learning, or home assignments.',
    subject: 'Mathematics',
    level: 'Primary',
    strand: 'Algebra',
    subStrand: 'Variables',
    topic: 'Simplifying Expressions',
    type: 'file',
    resourceCategory: 'Worksheet',
    term: 'Term 2',
    content: `### Worksheet: Writing & Simplifying Expressions\n**Subject:** Mathematics | **Class:** Basic 6\n\n**Exercises:**\n1. Simplify the expression: 3x + 5y - x + 2y\n2. Evaluate 2a + 3b when a = 4, b = 2\n3. Match the description with algebraic equation: "A number double decreased by 5 equals 15" -> 2n - 5 = 15`
  },
  {
    id: 'system-tlm-science-water',
    authorId: 'system',
    title: 'Evaporation & Condensation Experiment Guide (TLM)',
    description: 'A complete guide to constructing cheap, low-cost teaching models using local plastic bottles in Ghana.',
    subject: 'Science',
    level: 'JHS',
    strand: 'Cycles',
    subStrand: 'Water Cycle',
    topic: 'Change of State experiment',
    type: 'note',
    resourceCategory: 'TLM',
    term: 'Term 2',
    content: `### Classroom TLM: Distillation Model\n**Subject:** Science | **Class:** JHS 1\n\n**Required local materials:**\n- 1 Large plastic jerrycan\n- 1 Small water bottle\n- Warm water and ink\n\n**Instructions:**\nCut the top off the large jerrycan and place the small open bottle containing inked water inside. Seal with clear plastic film in sunlight. Water will evaporate, condense, and collect outside the small bottle as pure water.`
  },
  {
    id: 'system-visual-digestive',
    authorId: 'system',
    title: 'Human Digestive System Teaching Visual Guide',
    description: 'Structured layout map highlighting parts of the digestive system for blackboard drawings and worksheets.',
    subject: 'Science',
    level: 'JHS',
    strand: 'Systems',
    subStrand: 'Human Body Systems',
    topic: 'Organs & Functions',
    type: 'note',
    resourceCategory: 'AI Teaching Visual',
    term: 'Term 3',
    content: `### Visual Organ Map: Human Digestive System\n**Subject:** Science | **Class:** Basic 7\n\n**Visual layout description for board:**\n- **Mouth:** Entry point with mechanical teeth grinding.\n- **Esophagus:** Food path tube.\n- **Stomach:** Acidic breakdown container.\n- **Small Intestine:** Nutrient filtration organ.\n- **Large Intestine:** Water absorption path.`
  },
  {
    id: 'system-lesson-notes-pe-shs1',
    authorId: 'system',
    title: 'Career Pathways in Physical Education & Health - SHS 1 Notes',
    description: 'NaCCA-aligned study and discussion guide on career options and attributes in Ghanaian sports and physical education.',
    subject: 'Physical Education',
    level: 'SHS',
    strand: 'Physical Activity and Health',
    subStrand: 'Career Pathways in Physical Activity and Sports',
    topic: 'Careers vs Professions in Sports',
    type: 'note',
    resourceCategory: 'AI-Generated Lesson Notes',
    term: 'Term 1',
    content: `### Career Pathways in Physical Education & Health\n**Subject:** Physical Education & Health (Core) | **Class:** SHS 1 | **Strand:** Physical Activity and Health | **Sub-Strand:** Career Pathways in Physical Activity and Sports\n\n--- \n### 1. Learning Objectives\n- Differentiate between a career and a profession. \n- Identify four core career pathways in Ghanaian Physical Education and Health.\n- Discuss professional attributes and mindsets required for these roles.\n\n### 2. Definitions\n- **Career:** The progressive journey of a person's working life, including various jobs and roles.\n- **Profession:** An occupation that requires specialized training, credentials, and formal qualifications (e.g., a sports doctor or coach).\n\n### 3. Key Career Pathways in Ghana\n- **Physical Education Teacher:** Teaching sports, health, and wellness concepts in schools.\n- **Sport Administrator:** Organizing sporting events, leagues, and operations at school or district levels.\n- **Sports Coach:** Guiding athletes from basic training to professional competitions.\n- **Fitness Trainer:** Running fitness classes or wellness coaching in community and private settings.\n\n### 4. Classroom Activity (Think-Pair-Share)\nDiscuss with your partner why choosing a sports career that aligns with your interest, skills, and passion leads to better long-term success.`
  },
  {
    id: 'system-lesson-notes-art-design-shs1',
    authorId: 'system',
    title: 'Intellectual Property & Copyright Laws - Art & Design Studio Notes',
    description: 'NaCCA-aligned lesson notes on copyright, patents, and trademarks in Ghana for SHS students and design practitioners.',
    subject: 'Art and Design Studio',
    level: 'SHS',
    strand: 'Art and Design Theories and Application',
    subStrand: 'Professional Practice and Ethics',
    topic: 'Intellectual Property Laws in Ghana',
    type: 'note',
    resourceCategory: 'AI-Generated Lesson Notes',
    term: 'Term 1',
    content: `### Intellectual Property & Copyright Laws in Ghana\n**Subject:** Art and Design Studio | **Class:** SHS 1 | **Strand:** Art and Design Theories and Application | **Sub-Strand:** Professional Practice and Ethics\n\n--- \n### 1. Learning Objectives\n- Define intellectual property and copyright.\n- Explain the importance of the Copyright Act of Ghana, 2005 (Act 690).\n- Discuss the ethical rules for using other artists' works as inspiration or references.\n\n### 2. What is Intellectual Property (IP)?\n- Intellectual property refers to creations of the mind: inventions, literary and artistic works, designs, symbols, names, and images used in commerce.\n- It is protected in law through **Patents**, **Copyright**, and **Trademarks**, which enable creators to earn recognition or financial benefit from what they invent or create.\n\n### 3. Key Legislative Acts in Ghana\n- **Copyright Act, 2005 (Act 690):** Protects literary, artistic, musical, sound recordings, and broadcasts from unauthorized copying and distribution.\n- **Patent Act, 2003 (Act 657):** Covers technical inventions and processes.\n- **Trademarks Act, 2004 (Act 664):** Protects brand names, logos, and symbols.\n- **Companies Act, 2019 (Act 992):** Governs registration of art and design businesses.\n\n### 4. Ethical Use of Others' Artworks\n- Always attribute/credit the original source when reproducing or building upon existing forms.\n- Transform secondary materials significantly to establish original ownership and avoid plagiarism.\n- Request written permission/licensing before industrializing or commercializing another person's creative work.`
  }
];

interface SchemeParseResult {
  id: string;
  strand: string;
  subStrand: string;
  indicatorCode: string;
  indicatorText: string;
  lessonTopic: string;
  week: string;
  term: string;
}

const getTermForSubStrand = (strand: string, subStrand: string): string => {
  const sum = (strand || '').length + (subStrand || '').length;
  const rem = sum % 3;
  if (rem === 0) return 'Term 1';
  if (rem === 1) return 'Term 2';
  return 'Term 3';
};

function parseSchemeMarkdown(content: string): SchemeParseResult[] {
  if (!content) return [];
  const lines = content.split('\n');
  let currentStrand = 'General';
  let currentSubStrand = 'General';
  let currentTerm = 'Term 1';
  const results: SchemeParseResult[] = [];
  
  let inTable = false;
  let headers: string[] = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check if line indicates a Term
    const termHeadMatch = trimmed.match(/###?\s*(Term\s*[1-3])/i);
    if (termHeadMatch && termHeadMatch[1]) {
      const tNum = termHeadMatch[1].replace(/[^0-9]/g, '');
      currentTerm = `Term ${tNum}`;
    }
    
    if (trimmed.startsWith('|')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter((_p, i, arr) => i > 0 && i < arr.length - 1);
      
      // Separator line
      if (parts.every(p => p.startsWith('-') || p === '')) {
        continue;
      }
      
      const lowerParts = parts.map(p => p.toLowerCase());
      // Header line identification
      if (lowerParts.includes('week') || lowerParts.includes('strand') || lowerParts.includes('sub-strand') || lowerParts.includes('sub strand') || lowerParts.includes('substrand') || lowerParts.includes('indicator') || lowerParts.includes('lesson topic') || lowerParts.includes('topic') || lowerParts.includes('subject matter')) {
        headers = lowerParts;
        inTable = true;
        continue;
      }
      
      if (inTable && parts.length > 0 && headers.length > 0) {
        const getColumnVal = (keywords: string[]) => {
          const idx = headers.findIndex(h => keywords.some(k => h.includes(k)));
          return idx !== -1 && idx < parts.length ? parts[idx] : '';
        };
        
        const week = getColumnVal(['week', 'period']) || `Row ${results.length + 1}`;
        const strand = getColumnVal(['strand']) || '';
        const subStrand = getColumnVal(['sub-strand', 'sub strand', 'substrand']) || '';
        const contentStandard = getColumnVal(['content standard', 'standard', 'code']) || '';
        const indicator = getColumnVal(['indicator']) || '';
        const topic = getColumnVal(['topic', 'lesson', 'subject matter']) || '';
        
        if (strand) currentStrand = strand;
        if (subStrand) currentSubStrand = subStrand;
        
        let rowTerm = currentTerm;
        if (week.toLowerCase().includes('term 2') || week.toLowerCase().includes('t2')) {
          rowTerm = 'Term 2';
        } else if (week.toLowerCase().includes('term 3') || week.toLowerCase().includes('t3')) {
          rowTerm = 'Term 3';
        } else if (week.toLowerCase().includes('term 1') || week.toLowerCase().includes('t1')) {
          rowTerm = 'Term 1';
        } else {
          // Check numerical week values as fallback for full year
          const weekNumMatch = week.match(/\d+/);
          if (weekNumMatch) {
            const wNum = parseInt(weekNumMatch[0], 10);
            if (wNum > 12 && wNum <= 24) {
              rowTerm = 'Term 2';
            } else if (wNum > 24) {
              rowTerm = 'Term 3';
            }
          }
        }
        
        const indicatorText = indicator || topic || `Lesson Indicator for ${currentSubStrand}`;
        const indicatorCode = contentStandard || `${currentStrand.substring(0,2).toUpperCase()}.${currentSubStrand.substring(0,2).toUpperCase()}.${results.length + 1}`;
        
        results.push({
          id: `sch_${results.length}`,
          strand: currentStrand,
          subStrand: currentSubStrand,
          indicatorCode,
          indicatorText,
          lessonTopic: topic || 'General Topic',
          week,
          term: rowTerm
        });
      }
    } else {
      const strandMatch = trimmed.match(/^###?\s*(?:Strand\s*\d*\s*:?)\s*(.*)/i);
      if (strandMatch && strandMatch[1]) {
        currentStrand = strandMatch[1].trim();
      }
      const subStrandMatch = trimmed.match(/^####?\s*(?:Sub-Strand\s*\d*\s*:?)\s*(.*)/i);
      if (subStrandMatch && subStrandMatch[1]) {
        currentSubStrand = subStrandMatch[1].trim();
      }
    }
  }
  return results;
}

export default function ContentLibrary() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'library' | 'curriculum' | 'tracking'>('library');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Advanced filters
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [strandQuery, setStrandQuery] = useState('');
  const [subStrandQuery, setSubStrandQuery] = useState('');
  const [topicQuery, setTopicQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'titleAsc'>('dateDesc');
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterSubjectSearch, setFilterSubjectSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'user'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currLevelFilter, setCurrLevelFilter] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  // Curriculum Coverage states
  const [coverageSubject, setCoverageSubject] = useState('Science');
  const [coverageLevel, setCoverageLevel] = useState('JHS');
  const [coverageClass, setCoverageClass] = useState('All');
  const [coverageTerm, setCoverageTerm] = useState('All');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('default-blueprint');
  const [userSchemes, setUserSchemes] = useState<any[]>([]);
  const [checkedIndicators, setCheckedIndicators] = useState<Record<string, boolean>>(() => {
    try {
      const saved = safeLocalStorage.getItem('teachsmart_curriculum_coverage_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Whenever checkedIndicators changes, save to localStorage
  useEffect(() => {
    try {
      safeLocalStorage.setItem('teachsmart_curriculum_coverage_tracker', JSON.stringify(checkedIndicators));
    } catch (e) {
      console.error(e);
    }
  }, [checkedIndicators]);

  // Download history tracks (synchronised dynamically with localStorage)
  const [downloadHistoryIds, setDownloadHistoryIds] = useState<string[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('download_history_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recordDownload = (resourceId: string) => {
    if (!resourceId) return;
    setDownloadHistoryIds(prev => {
      if (prev.includes(resourceId)) return prev;
      const updated = [resourceId, ...prev];
      try {
        safeLocalStorage.setItem('download_history_ids', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Form state enhanced with rich Ghanaian NaCCA metadata
  const [newResource, setNewResource] = useState<{
    title: string;
    description: string;
    subject: string;
    level: string;
    type: 'link' | 'note' | 'file' | 'book';
    content: string;
    resourceCategory: string;
    term: string;
    topic: string;
    strand: string;
    subStrand: string;
  }>({
    title: '',
    description: '',
    subject: subjects[0] || 'Science',
    level: levels[0] || 'JHS',
    type: 'note',
    content: '',
    resourceCategory: 'AI-Generated Lesson Notes',
    term: 'Term 1',
    topic: '',
    strand: '',
    subStrand: ''
  });

  useEffect(() => {
    async function testConnection(retries = 3, delay = 1000) {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => {
            testConnection(retries - 1, delay * 1.5);
          }, delay);
        } else {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
          }
        }
      }
    }
    testConnection();

    if (!user) return;

    const q = query(
      collection(db, 'resources'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];

      // Generate all official books from the curriculum data
      const allOfficialBooks: Resource[] = [];
      Object.keys(CURRICULUM_BOOKS).forEach(subj => {
        CURRICULUM_BOOKS[subj].forEach(book => {
          allOfficialBooks.push({
            id: `official-${subj}-${book.title.replace(/[\s/]+/g, '_')}`,
            authorId: 'system',
            title: book.title,
            description: `Official NaCCA Curriculum document for ${subj} (${book.level}).`,
            subject: subj,
            level: book.level,
            type: 'book',
            content: book.url,
            createdAt: { toDate: () => new Date() },
            resourceCategory: 'Curriculum PDF',
            term: 'All Terms',
            topic: 'Curriculum Framework',
            strand: 'NaCCA Standards',
            subStrand: 'Official Guide'
          });
        });
      });

      // Inject high-fidelity preloaded NaCCA system resources
      const preloaded: Resource[] = OFFICIAL_SYSTEM_RESOURCES.map(res => ({
        ...res,
        createdAt: { toDate: () => new Date() }
      }));

      setResources([...allOfficialBooks, ...preloaded, ...userData]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'resources');
    });

    // Fetch favorites
    const favsQuery = query(
      collection(db, 'saved_resources'),
      where('userId', '==', user.uid)
    );
    const unsubscribeFavs = onSnapshot(favsQuery, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => doc.data().resourceId));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'saved_resources');
    });

    // Fetch user schemes (Offline-first preloading from IndexedDB)
    getOffline('schemes', user.uid).then(cachedSchemes => {
      if (cachedSchemes && cachedSchemes.length > 0) {
        setUserSchemes(cachedSchemes);
      }
    }).catch(err => console.warn("Preloading offline schemes from IndexedDB failed:", err));

    const schemesQ = query(
      collection(db, 'schemes'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeSchemes = onSnapshot(schemesQ, (snapshot) => {
      const userSchemesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserSchemes(userSchemesData);
    }, (error) => {
      console.error("Error fetching schemes in tracker:", error);
    });

    return () => {
      unsubscribe();
      unsubscribeFavs();
      unsubscribeSchemes();
    };
  }, [user]);

  const toggleFavorite = async (resource: Resource) => {
    if (!user || !resource.id) return;
    
    const isFav = favorites.includes(resource.id);
    const favId = `${user.uid}_${resource.id.replace(/[\s/]+/g, '_')}`;

    try {
      if (isFav) {
        await deleteDoc(doc(db, 'saved_resources', favId));
        toast.success('Removed from favorites');
      } else {
        await setDoc(doc(db, 'saved_resources', favId), {
          userId: user.uid,
          resourceId: resource.id,
          title: resource.title,
          subject: resource.subject,
          level: resource.level,
          type: resource.type,
          content: resource.content,
          createdAt: serverTimestamp()
        });
        toast.success('Added to favorites');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'saved_resources');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'resources'), {
        ...newResource,
        authorId: user.uid,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewResource({
        title: '',
        description: '',
        subject: subjects[0] || 'Science',
        level: levels[0] || 'JHS',
        type: 'note',
        content: '',
        resourceCategory: 'AI-Generated Lesson Notes',
        term: 'Term 1',
        topic: '',
        strand: '',
        subStrand: ''
      });
      toast.success('Resource saved to personal library');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resources');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('official-')) {
      toast.error("Official resources cannot be deleted.");
      return;
    }
    try {
      await deleteDoc(doc(db, 'resources', id));
      toast.success('Resource deleted successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `resources/${id}`);
    }
  };


  const subjectStats = resources.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelStats = resources.reduce((acc, r) => {
    acc[r.level] = (acc[r.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredResources = resources.filter(res => {
    const searchLower = search.toLowerCase();
    const titleMatch = res.title?.toLowerCase().includes(searchLower);
    const descMatch = res.description?.toLowerCase().includes(searchLower);
    const strandMatch = res.strand?.toLowerCase().includes(searchLower);
    const topicMatch = res.topic?.toLowerCase().includes(searchLower);
    const matchesSearch = !search || titleMatch || descMatch || strandMatch || topicMatch;
    
    // Subject filter
    const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
    
    // Level filter
    const matchesLevel = selectedLevel === 'All' || (res.level && res.level.includes(selectedLevel));

    // Resource Category/Type filter (12 Core features)
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Bookmark') {
        matchesCategory = res.id ? favorites.includes(res.id) : false;
      } else if (selectedCategory === 'Download History') {
        matchesCategory = res.id ? downloadHistoryIds.includes(res.id) : false;
      } else {
        matchesCategory = res.resourceCategory === selectedCategory;
      }
    }

    // Term filter
    const matchesTerm = selectedTerm === 'All' || !res.term || res.term === selectedTerm;

    // Class / Form filter
    const matchesClassFilter = selectedClass === 'All' || (res.level && res.level.includes(selectedClass));

    // Strand, Sub-Strand and Topic exact matching
    const matchesStrand = !strandQuery || (res.strand && res.strand.toLowerCase().includes(strandQuery.toLowerCase()));
    const matchesSubStrand = !subStrandQuery || (res.subStrand && res.subStrand.toLowerCase().includes(subStrandQuery.toLowerCase()));
    const matchesTopic = !topicQuery || (res.topic && res.topic.toLowerCase().includes(topicQuery.toLowerCase()));
    
    const matchesType = 
      filterType === 'all' ? true :
      filterType === 'official' ? res.authorId === 'system' :
      res.authorId !== 'system';

    const matchesFavorites = !showOnlyFavorites || (res.id && favorites.includes(res.id));

    return matchesSearch && matchesSubject && matchesLevel && matchesCategory && matchesTerm && matchesClassFilter && matchesStrand && matchesSubStrand && matchesTopic && matchesType && matchesFavorites;
  });

  const getIcon = (type: string, size = 18) => {
    switch (type) {
      case 'link': return <LinkIcon size={size} className="text-blue-500" />;
      case 'file': return <FileText size={size} className="text-emerald-500" />;
      case 'note': return <StickyNote size={size} className="text-amber-500" />;
      case 'book': return <Book size={size} className="text-purple-600" />;
      default: return <FolderOpen size={size} className="text-slate-400" />;
    }
  };

  const handleFileDownload = async (url: string, filename: string) => {
    try {
      toast.loading("Initiating document download...", { id: "download-status", duration: 1500 });
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Download started successfully!", { id: "download-status" });
    } catch (error) {
      console.warn('Direct fetch download failed (CORS or network). Redirecting securely...', error);
      toast.success("Opening official document in a safe new tab...", { id: "download-status" });
      
      // Highly robust fallback using DOM anchor element cross-origin navigation
      // This bypasses sandboxed iframe window.open limitations in AI Studio
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = filename; // fallback in browsers that support it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isPdf = (url: string) => {
    if (!url) return false;
    const lower = url.trim().toLowerCase();
    return lower.includes('.pdf') || 
           lower.includes('nacca.gov.gh') || 
           lower.includes('firebase-storage') ||
           lower.startsWith('data:application/pdf') ||
           url.startsWith('%PDF-');
  };

  const isUrl = (content: string) => {
    if (!content) return false;
    const trimmed = content.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('www.');
  };

  const handleResourceDownload = (resource: Resource) => {
    const content = resource.content;
    const title = resource.title || 'Resource';
    const cleanTitle = title.replace(/\s+/g, '_');
    
    if (resource.id) {
      recordDownload(resource.id);
    }

    if (isUrl(content)) {
      if (isPdf(content)) {
        // It's a hosted PDF URL
        handleFileDownload(content, `${cleanTitle}.pdf`);
      } else {
        // It's a normal web link, open it in a new tab!
        toast.success("Opening resource link in a new tab...", { id: "download-status" });
        const link = document.createElement('a');
        link.href = content;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // It is NOT a direct URL (i.e. raw text, markdown, or inline file content)
      try {
        toast.loading("Preparing download...", { id: "download-status", duration: 1000 });
        
        // Check for base64 encoded PDF
        const isBase64Pdf = content.startsWith('data:application/pdf') || content.startsWith('JVBERi0');
        
        if (isBase64Pdf) {
          let blob: Blob;
          if (content.startsWith('data:application/pdf')) {
            const arr = content.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], { type: mime });
          } else {
            const bstr = atob(content);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], { type: 'application/pdf' });
          }
          
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${cleanTitle}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          toast.success("PDF Downloaded successfully!", { id: "download-status" });
        } else {
          // Normal raw notes / text markdown download
          const isMD = resource.type === 'note' || content.includes('#') || content.includes('- ');
          const fileExtension = isMD ? 'md' : 'txt';
          const mimeType = isMD ? 'text/markdown' : 'text/plain';
          
          const file = new Blob([content], { type: `${mimeType};charset=utf-8` });
          const blobUrl = URL.createObjectURL(file);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${cleanTitle}_TeachSmart.${fileExtension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          toast.success(`Document downloaded as ${fileExtension.toUpperCase()} successfully!`, { id: "download-status" });
        }
      } catch (error) {
        console.error("Resource download failed:", error);
        toast.error("Failed to generate download.", { id: "download-status" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resource Center</h1>
            <p className="text-slate-500 font-medium">Manage your personal materials and access official NaCCA documents.</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl w-fit group cursor-help relative">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-800">GES/NaCCA Compliance</p>
              <p className="text-[9px] font-bold text-emerald-600 uppercase">SBC & CCP Standards V2.0 Active</p>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-0 w-64 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-[60] pointer-events-none border border-slate-700">
              <p className="text-[10px] font-bold text-ghana-gold uppercase mb-2">Compliance Certificate</p>
              <p className="text-[10px] leading-relaxed text-slate-300">
                This platform is synchronized with the National Council for Curriculum and Assessment (NaCCA) standards. 
                All generated content follows the Standard-Based Curriculum (B1-B6) and Common Core Programme (B7-B10).
              </p>
            </div>
          </div>
        </div>
          <div className="flex bg-slate-100 p-1.5 rounded-[2rem] self-start md:self-center overflow-x-auto max-w-full scrollbar-none whitespace-nowrap select-none">
          <button 
            type="button"
            onClick={() => {
              setActiveTab('library');
              setShowOnlyFavorites(false);
            }}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'library' && !showOnlyFavorites ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            My Library
          </button>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('library');
              setShowOnlyFavorites(!showOnlyFavorites);
            }}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              showOnlyFavorites ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Star size={14} fill={showOnlyFavorites ? "currentColor" : "none"} />
            Saved
          </button>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('curriculum');
              setShowOnlyFavorites(false);
            }}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'curriculum' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Official NaCCA
          </button>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('tracking');
              setShowOnlyFavorites(false);
            }}
            className={cn(
              "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'tracking' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CheckCircle size={14} />
            Coverage Tracking
          </button>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
        >
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search resources, topics, or NaCCA codes..." 
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:shadow-xl focus:border-emerald-500 outline-none transition-all font-medium text-slate-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-full px-8 py-5 rounded-[2rem] border transition-all flex items-center gap-3 font-black uppercase tracking-widest text-[10px]",
                    showFilters || selectedSubject !== 'All' || selectedLevel !== 'All' || filterType !== 'all'
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                      : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <Filter size={18} />
                  Filters
                  {(selectedSubject !== 'All' || selectedLevel !== 'All' || filterType !== 'all') && (
                    <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full scale-90">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFilters(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
                      />
                      <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 md:top-full mt-4 md:w-[700px] max-w-full md:max-w-[700px] bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-[0_40px_80px_-16px_rgba(0,0,0,0.15)] z-[100] overflow-hidden top-[5%] md:top-unset"
                    >
                      {/* Modal Header */}
                      <div className="p-3 md:p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-7 h-7 md:w-9 md:h-9 bg-slate-900 text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                            <Filter size={12} />
                          </div>
                          <div>
                            <h3 className="text-[9px] md:text-xs font-black text-slate-900 uppercase tracking-widest">Filter Studio</h3>
                            <p className="text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Refine library</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedSubject('All');
                              setSelectedLevel('All');
                              setFilterType('all');
                              setFilterSubjectSearch('');
                            }}
                            className="px-2 py-1 md:px-3 md:py-1.5 bg-white border border-slate-100 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                          >
                            Reset
                          </button>
                          <button 
                            onClick={() => setShowFilters(false)}
                            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[75vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar no-scrollbar">
                        {/* Primary Filters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          
                          {/* Subject Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Book size={14} className="text-emerald-500" />
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Area</h4>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={10} />
                              <input 
                                type="text"
                                placeholder="Search subjects..."
                                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                                value={filterSubjectSearch}
                                onChange={(e) => setFilterSubjectSearch(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                              {['All', ...subjects.filter(s => s.toLowerCase().includes(filterSubjectSearch.toLowerCase()))].map(s => (
                                <button
                                  type="button"
                                  key={s}
                                  onClick={() => setSelectedSubject(s)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border flex items-center gap-2",
                                    selectedSubject === s 
                                      ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                                      : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 shadow-sm"
                                  )}
                                >
                                  {s.toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Level & Class Filters */}
                          <div className="space-y-4">
                            {/* GES Level */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Plus size={14} className="text-slate-500" />
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GES Level</h4>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {['All', ...levels].map(l => (
                                  <button
                                    type="button"
                                    key={l}
                                    onClick={() => setSelectedLevel(l)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[9px] font-black transition-all border",
                                      selectedLevel === l 
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 shadow-sm"
                                    )}
                                  >
                                    {l.toUpperCase()}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Class/Form Selection */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Class/Form Specifics</label>
                              <div className="flex flex-wrap gap-1">
                                {['All', 'KG1', 'KG2', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'JHS1', 'JHS2', 'JHS3', 'SHS1', 'SHS2', 'SHS3'].map(cls => (
                                  <button
                                    type="button"
                                    key={cls}
                                    onClick={() => setSelectedClass(cls)}
                                    className={cn(
                                      "px-2 py-1 rounded-md text-[8px] font-black transition-all border",
                                      selectedClass === cls 
                                        ? "bg-purple-600 border-purple-600 text-white" 
                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                    )}
                                  >
                                    {cls}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resource Category Section (The 12 Core components!) */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <FolderOpen size={14} className="text-blue-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Type (12 Library Categories)</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {['All', 'AI-Generated Lesson Notes', 'AI-Generated Student Notes', 'Scheme of Learning', 'Exam Questions', 'Marking Scheme', 'Worksheet', 'TLM', 'AI Teaching Visual', 'Curriculum PDF', 'Saved Resource', 'Download History', 'Bookmark'].map(cat => (
                              <button
                                type="button"
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                  "py-2 px-3 rounded-xl text-[8.5px] font-black uppercase tracking-widest border text-center transition-all truncate",
                                  selectedCategory === cat
                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                )}
                                title={cat}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Topic, Strand and Sub-Strand Text Searches */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Strand</label>
                            <input 
                              type="text"
                              placeholder="e.g. Diversity of Matter"
                              value={strandQuery}
                              onChange={(e) => setStrandQuery(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-Strand</label>
                            <input 
                              type="text"
                              placeholder="e.g. Living Things"
                              value={subStrandQuery}
                              onChange={(e) => setSubStrandQuery(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic</label>
                            <input 
                              type="text"
                              placeholder="e.g. Fractions"
                              value={topicQuery}
                              onChange={(e) => setTopicQuery(e.target.value)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Term & Sorting Panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                          {/* Academic Term */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Academic Term</label>
                            <div className="flex gap-2">
                              {['All', 'Term 1', 'Term 2', 'Term 3'].map(term => (
                                <button
                                  type="button"
                                  key={term}
                                  onClick={() => setSelectedTerm(term)}
                                  className={cn(
                                    "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all",
                                    selectedTerm === term 
                                      ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                  )}
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sort By Panel */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sort Materials</label>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none font-bold"
                            >
                              <option value="dateDesc">Newest Generated</option>
                              <option value="dateAsc">Oldest Generated</option>
                              <option value="titleAsc">Title: Alphabetical A-Z</option>
                            </select>
                          </div>
                        </div>

                        {/* Source filter */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Resource Authority</label>
                          <div className="grid grid-cols-3 gap-2">
                            {([
                              { id: 'all', label: 'All Sources' },
                              { id: 'official', label: 'Official Gov Library' },
                              { id: 'user', label: 'My Saved Items' }
                            ] as const).map(src => (
                              <button
                                type="button"
                                key={src.id}
                                onClick={() => setFilterType(src.id)}
                                className={cn(
                                  "py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                  filterType === src.id 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                )}
                              >
                                {src.label}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Apply Selection
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
        </div>
      </div>
    </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-slate-400 animate-pulse font-bold">Curating your library...</p>
        </div>
      ) : (() => {
        const sortedResources = [...filteredResources].sort((a, b) => {
          if (sortBy === 'titleAsc') {
            return (a.title || '').localeCompare(b.title || '');
          }
          const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : 0;
          if (sortBy === 'dateAsc') {
            return dateA - dateB;
          }
          return dateB - dateA; // default dateDesc
        });

        if (sortedResources.length === 0) {
          return (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FolderOpen size={40} className="text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No matching resources found</h2>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Try adjusting your NaCCA filters or search queries to locate your materials.
              </p>
              <button 
                onClick={() => {
                  setSelectedSubject('All');
                  setSelectedLevel('All');
                  setSelectedCategory('All');
                  setSelectedTerm('All');
                  setSelectedClass('All');
                  setStrandQuery('');
                  setSubStrandQuery('');
                  setTopicQuery('');
                }}
                className="btn-secondary py-3 px-8"
              >
                Clear Filters
              </button>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedResources.map((resource) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={resource.id}
                className={cn(
                  "p-6 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden",
                  resource.authorId === 'system' ? "bg-purple-50 border-purple-100" : "bg-white border-slate-100"
                )}
              >
                {resource.authorId === 'system' && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
                    Official Book
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors",
                      resource.authorId === 'system' ? "bg-purple-100" : "bg-slate-50 group-hover:bg-emerald-50"
                    )}>
                      {getIcon(resource.type)}
                    </div>
                    <button 
                      onClick={() => toggleFavorite(resource)}
                      className={cn(
                        "p-3 rounded-2xl transition-all shadow-sm active:scale-90",
                        favorites.includes(resource.id!) 
                          ? "bg-amber-500 text-white shadow-amber-500/20" 
                          : "bg-white border border-slate-100 text-slate-400 hover:text-amber-500"
                      )}
                    >
                      <Star size={18} fill={favorites.includes(resource.id!) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  {resource.authorId !== 'system' && (
                    <button 
                      onClick={() => resource.id && setResourceToDelete(resource.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded",
                      resource.authorId === 'system' ? "bg-purple-200 text-purple-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {resource.subject}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded">
                      {resource.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                    {resource.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {isUrl(resource.content) && !isPdf(resource.content) ? (
                    <a 
                      href={resource.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Visit Link
                      <ExternalLink size={14} />
                    </a>
                  ) : isPdf(resource.content) ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewingResource(resource)}
                        className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        Open Viewer
                        <FileText size={14} />
                      </button>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <button 
                        onClick={() => handleResourceDownload(resource)}
                        className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        Download
                        <Download size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewingResource(resource)}
                        className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        View Details
                      </button>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <button 
                        onClick={() => handleResourceDownload(resource)}
                        className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-2"
                      >
                        Download
                        <Download size={14} />
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {resource.id?.startsWith('official-') ? 'System Resource' : (resource.createdAt?.toDate?.() ? resource.createdAt.toDate().toLocaleDateString() : 'Recently Added')}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )})()}
    </>
  ) : activeTab === 'curriculum' ? (
        <div className="space-y-12">
          {/* Curriculum Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Search curriculum documents..." 
              className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Level Filter for Curriculum */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 justify-center">
            {['All', ...levels].map(level => (
              <button
                key={level}
                onClick={() => setCurrLevelFilter(level)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  currLevelFilter === level 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600"
                )}
              >
                {level === 'All' ? 'All NaCCA Documents' : `${level} Level`}
              </button>
            ))}
          </div>

          {Object.entries(CURRICULUM_BOOKS).map(([subject, books]) => {
            const searchLower = search.toLowerCase();
            const filteredBooks = books.filter(b => {
              const matchesLevel = currLevelFilter === 'All' || b.level === currLevelFilter;
              const matchesSearch = !search || 
                b.title.toLowerCase().includes(searchLower) || 
                subject.toLowerCase().includes(searchLower);
              return matchesLevel && matchesSearch;
            });

            if (filteredBooks.length === 0) return null;

            return (
              <section key={subject} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[2px] flex-1 bg-slate-100" />
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Book size={18} />
                    </div>
                    {subject} Curriculum
                  </h2>
                  <div className="h-[2px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sub-grouping by Level within Subject could be here, but for now a filtered list is cleaner */}
                  {filteredBooks.map((book, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={book.title}
                      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                      {/* Subject Background Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-emerald-100/50 transition-colors" />

                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                              {book.level}
                            </span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              NaCCA Approved
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                              {book.title}
                            </h3>
                            <p className="text-slate-500 text-sm mt-2 font-medium">
                              {subject === 'Important Links' 
                                ? `Direct access to important educational portals and government resources.`
                                : subject === 'Resource Packs'
                                ? `Teaching guidelines and training materials for ${book.level} implementation.`
                                : `Official government curriculum framework for ${subject} ${book.level === 'Basic' ? 'Primary' : book.level} education.`}
                            </p>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/30 group-hover:border-emerald-100 transition-all">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Direct Access Link</label>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <LinkIcon size={14} />
                              </div>
                              <code className="text-[10px] text-slate-600 break-all font-mono line-clamp-1 flex-1">
                                {book.url}
                              </code>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(book.url);
                                  // Could add a toast here if available, but for now simple feedback
                                }}
                                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Copy Link"
                              >
                                <ExternalLink size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => setViewingResource({
                              id: `official-${subject}-${book.title}`,
                              authorId: 'system',
                              title: book.title,
                              description: `Official NaCCA Curriculum document for ${subject} (${book.level}).`,
                              subject: subject,
                              level: book.level,
                              type: 'book',
                              content: book.url,
                              createdAt: { toDate: () => new Date() }
                            })}
                            className="w-full md:w-44 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                          >
                            <ExternalLink size={14} />
                            View Online
                          </button>
                          <button 
                            onClick={() => handleFileDownload(book.url, `${book.title.replace(/\s+/g, '_')}.pdf`)}
                            className="w-full md:w-44 py-4 bg-emerald-50 text-emerald-700 border-2 border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header section with Stats Cards */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 text-white shadow-xl relative overflow-hidden animate-fadeIn">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent)]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-widest rounded-lg border border-emerald-500/30">
                  NaCCA Curriculum Tracker & Coverage
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">Classroom Progress Tracker</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
                  Track covered indicators, completed strands, remaining curriculum content, and academic progress for the year.
                </p>
                
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Subject</label>
                    <SearchableDropdown
                      value={coverageSubject}
                      options={subjects.slice().sort((a,b) => a.localeCompare(b))}
                      placeholder="Select Subject"
                      onChange={(val) => {
                        setCoverageSubject(val);
                        setSelectedSchemeId('default-blueprint');
                      }}
                      triggerClassName="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between cursor-pointer select-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Stage</label>
                    <select
                      value={coverageLevel}
                      onChange={(e) => {
                        const newLvl = e.target.value;
                        setCoverageLevel(newLvl);
                        setSelectedSchemeId('default-blueprint');
                        const classes = CLASSES_BY_LEVEL[newLvl] || [];
                        setCoverageClass(classes[0] || 'All');
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'JHS' : l}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Class Level</label>
                    <select
                      value={coverageClass}
                      onChange={(e) => {
                        setCoverageClass(e.target.value);
                        setSelectedSchemeId('default-blueprint');
                      }}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="All">All Classes</option>
                      {(CLASSES_BY_LEVEL[coverageLevel] || CLASSES_BY_LEVEL['JHS']).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select Term</label>
                    <select
                      value={coverageTerm}
                      onChange={(e) => setCoverageTerm(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="All">All Terms Progress</option>
                      <option value="Term 1">Term 1 (Weeks 1-12)</option>
                      <option value="Term 2">Term 2 (Weeks 13-24)</option>
                      <option value="Term 3">Term 3 (Weeks 25-36)</option>
                    </select>
                  </div>
 
                  <div className="col-span-1 min-[420px]:col-span-2 space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/80 text-emerald-400 px-2 py-0.5 rounded">Tracking reference Source</label>
                    <select
                      value={selectedSchemeId}
                      onChange={(e) => {
                        const schemeId = e.target.value;
                        setSelectedSchemeId(schemeId);
                        if (schemeId !== 'default-blueprint') {
                          const sch = userSchemes.find(s => s.id === schemeId);
                          if (sch) {
                            if (sch.subject) setCoverageSubject(sch.subject);
                            if (sch.level) setCoverageLevel(sch.level);
                            if (sch.class) setCoverageClass(sch.class);
                            if (sch.type === 'termly' && sch.term) {
                              setCoverageTerm(sch.term);
                            }
                          }
                        }
                      }}
                      className="w-full bg-emerald-950/80 border border-emerald-800 text-white rounded-xl px-3 py-2.5 text-xs font-black tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="default-blueprint">📖 Standard NaCCA Curriculum Blueprint</option>
                      {userSchemes
                        .filter(sch => sch.subject === coverageSubject || coverageSubject === 'All')
                        .map(sch => (
                          <option key={sch.id} value={sch.id}>
                            🗓️ Scheme of Work: {sch.title} ({sch.class})
                          </option>
                        ))
                      }
                      {userSchemes.some(sch => sch.subject !== coverageSubject) && (
                        <optgroup label="Other Saved Schemes">
                          {userSchemes
                            .filter(sch => sch.subject !== coverageSubject)
                            .map(sch => (
                              <option key={sch.id} value={sch.id}>
                                🗓️ {sch.title} ({sch.subject})
                              </option>
                            ))
                          }
                        </optgroup>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Stats Counters */}
              <div className="lg:col-span-2 grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Progress Circle card */}
                {(() => {
                  let totalCount = 0;
                  let checkedCount = 0;
 
                  const activeScheme = selectedSchemeId !== 'default-blueprint' 
                    ? userSchemes.find(s => s.id === selectedSchemeId) 
                    : null;
 
                  if (activeScheme) {
                    const parsed = parseSchemeMarkdown(activeScheme.content).filter(item => {
                      return coverageTerm === 'All' || item.term === coverageTerm;
                    });
                    
                    parsed.forEach((item, index) => {
                      totalCount++;
                      const indId = `scheme_${activeScheme.id}_${item.strand}_${item.subStrand}_${index}`;
                      if (checkedIndicators[indId]) {
                        checkedCount++;
                      }
                    });
                  } else {
                    const strands = getSelectableStrands(coverageSubject, coverageLevel);
                    strands.forEach(strand => {
                      const subStrands = (SUBJECT_SUB_STRANDS[strand] || [strand]).filter(sub => {
                        if (coverageTerm === 'All') return true;
                        return getTermForSubStrand(strand, sub) === coverageTerm;
                      });
 
                      subStrands.forEach(subStrand => {
                        const classPrefix = coverageClass === 'All' 
                          ? (coverageLevel === 'All' ? 'B7' : (coverageLevel === 'JHS' ? 'B7' : coverageLevel === 'Primary' ? 'B1' : 'B10'))
                          : (coverageClass === 'KG 1' ? 'KG1' : coverageClass === 'KG 2' ? 'KG2' : coverageClass === 'Basic 1' ? 'B1' : coverageClass === 'Basic 2' ? 'B2' : coverageClass === 'Basic 3' ? 'B3' : coverageClass === 'Basic 4' ? 'B4' : coverageClass === 'Basic 5' ? 'B5' : coverageClass === 'Basic 6' ? 'B6' : coverageClass === 'Basic 7' ? 'B7' : coverageClass === 'Basic 8' ? 'B8' : coverageClass === 'Basic 9' ? 'B9' : 'B12');
 
                        const indicators = [
                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_1`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.1`, text: `Understand key definitions & models of ${subStrand}` },
                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_2`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.2`, text: `Analyze operations and practical demonstrations of ${subStrand}` },
                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_3`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.3`, text: `Evaluate competency tasks and classroom projects on ${subStrand}` }
                        ];
 
                        indicators.forEach(ind => {
                          totalCount++;
                          if (checkedIndicators[ind.id]) {
                            checkedCount++;
                          }
                        });
                      });
                    });
                  }
                  
                  const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
                  
                  return (
                    <>
                      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3">
                          <svg className="absolute w-full h-full -rotate-90 animate-[spin_4s_linear_infinite] opacity-50 inset-0 pointer-events-none" viewBox="0 0 96 96" style={{ animationPlayState: 'paused' }}>
                            <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="40" stroke="#059669" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * percentage) / 100} />
                          </svg>
                          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 96 96">
                            <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                            <circle cx="48" cy="48" r="40" stroke="#059669" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * percentage) / 100} />
                          </svg>
                          <span className="text-lg sm:text-xl font-black">{percentage}%</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Completion</p>
                      </div>
                      
                      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] sm:min-h-0">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg mb-2 shrink-0">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-black text-emerald-400">{checkedCount} / {totalCount}</p>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Indicators Covered</p>
                        </div>
                      </div>
 
                      <div className="col-span-1 min-[480px]:col-span-2 sm:col-span-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] sm:min-h-0">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shadow-lg mb-2 shrink-0">
                          <Book size={20} />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-black text-amber-400">{totalCount - checkedCount}</p>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Uncovered Items</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Interactive Checkbox Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Strands and Sub-strands List (Interactive) */}
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const activeScheme = selectedSchemeId !== 'default-blueprint' 
                  ? userSchemes.find(s => s.id === selectedSchemeId) 
                  : null;

                const parsedRows = activeScheme 
                  ? parseSchemeMarkdown(activeScheme.content).filter(item => coverageTerm === 'All' || item.term === coverageTerm)
                  : [];

                const displayStrands = activeScheme 
                  ? Array.from(new Set(parsedRows.map(p => p.strand)))
                  : getSelectableStrands(coverageSubject, coverageLevel);

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <FolderOpen size={18} className="text-emerald-600 shrink-0" />
                        <span>{activeScheme ? `Indicators for ${activeScheme.title}` : `Standard NaCCA Curriculum Blueprint List`}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to reset all tracking progress for this reference?")) {
                            const updated = { ...checkedIndicators };
                            if (activeScheme) {
                              Object.keys(updated).forEach(key => {
                                if (key.startsWith(`scheme_${activeScheme.id}`)) {
                                  delete updated[key];
                                }
                              });
                            } else {
                              const strands = getSelectableStrands(coverageSubject, coverageLevel);
                              strands.forEach(strand => {
                                const subStrands = (SUBJECT_SUB_STRANDS[strand] || [strand]);
                                subStrands.forEach(subStrand => {
                                  delete updated[`${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_1`];
                                  delete updated[`${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_2`];
                                  delete updated[`${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_3`];
                                });
                              });
                            }
                            setCheckedIndicators(updated);
                            toast.success("Progress reset successfully!");
                          }
                        }}
                        className="px-4 py-2 border border-slate-200 hover:border-red-200 hover:text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors"
                      >
                        Reset Reference Progress
                      </button>
                    </div>

                    <div className="space-y-4">
                      {displayStrands.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 text-slate-400 font-bold uppercase text-xs">
                          No strands found for the selected Stage, Class, or Term combination.
                        </div>
                      ) : (
                        displayStrands.map((strand, strandIdx) => {
                          const subStrands = activeScheme
                            ? Array.from(new Set(parsedRows.filter(p => p.strand === strand).map(p => p.subStrand)))
                            : (SUBJECT_SUB_STRANDS[strand] || [strand]).filter(sub => {
                                if (coverageTerm === 'All') return true;
                                return getTermForSubStrand(strand, sub) === coverageTerm;
                              });

                          if (subStrands.length === 0) return null;

                          return (
                            <div key={strand} className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
                              <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                                  {strandIdx + 1}
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Strand {strandIdx + 1}</p>
                                  <h4 className="font-black text-slate-900 text-sm uppercase">{strand}</h4>
                                </div>
                              </div>

                              <div className="space-y-4 pt-2">
                                {subStrands.map(subStrand => {
                                  const indicators = activeScheme
                                    ? parsedRows
                                        .filter(p => p.strand === strand && p.subStrand === subStrand)
                                        .map((p, index) => ({
                                          id: `scheme_${activeScheme.id}_${p.strand}_${p.subStrand}_${index}`,
                                          code: p.indicatorCode || p.week,
                                          text: p.indicatorText || p.lessonTopic,
                                          week: p.week,
                                          lessonTopic: p.lessonTopic
                                        }))
                                    : (() => {
                                        const classPrefix = coverageClass === 'All' 
                                          ? (coverageLevel === 'All' ? 'B7' : (coverageLevel === 'JHS' ? 'B7' : coverageLevel === 'Primary' ? 'B1' : 'B10'))
                                          : (coverageClass === 'KG 1' ? 'KG1' : coverageClass === 'KG 2' ? 'KG2' : coverageClass === 'Basic 1' ? 'B1' : coverageClass === 'Basic 2' ? 'B2' : coverageClass === 'Basic 3' ? 'B3' : coverageClass === 'Basic 4' ? 'B4' : coverageClass === 'Basic 5' ? 'B5' : coverageClass === 'Basic 6' ? 'B6' : coverageClass === 'Basic 7' ? 'B7' : coverageClass === 'Basic 8' ? 'B8' : coverageClass === 'Basic 9' ? 'B9' : 'B12');

                                        return [
                                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_1`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.1`, text: `Understand definitions, concepts & terms of ${subStrand}` },
                                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_2`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.2`, text: `Analyze operations, models and practical use of ${subStrand}` },
                                          { id: `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_3`, code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}.1.3`, text: `Evaluate competency tasks and assessments on ${subStrand}` }
                                        ];
                                      })();

                                  const coveredCountInSubStrand = indicators.filter(ind => checkedIndicators[ind.id]).length;
                                  const subPercentage = indicators.length > 0 ? Math.round((coveredCountInSubStrand / indicators.length) * 100) : 0;

                                  return (
                                    <div key={subStrand} className="pl-4 border-l-2 border-slate-100 focus-within:border-emerald-500 transition-colors space-y-3">
                                      <div className="flex flex-wrap justify-between items-center gap-2">
                                        <h5 className="font-black text-slate-700 text-xs uppercase break-words min-w-0">{subStrand}</h5>
                                        <span className={cn(
                                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shrink-0",
                                          subPercentage === 100 ? "bg-emerald-100 text-emerald-800" : subPercentage > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"
                                        )}>
                                          {subPercentage}% Done
                                        </span>
                                      </div>

                                      <div className="space-y-2">
                                        {indicators.map(ind => (
                                          <label
                                            key={ind.id}
                                            className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-emerald-50/20 rounded-xl cursor-pointer border border-slate-100 hover:border-emerald-100 transition-all text-xs text-slate-600 font-medium"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={!!checkedIndicators[ind.id]}
                                              onChange={(e) => {
                                                setCheckedIndicators({
                                                  ...checkedIndicators,
                                                  [ind.id]: e.target.checked
                                                });
                                                if (e.target.checked) {
                                                  toast.success(`Marked as Covered: ${ind.code}`);
                                                }
                                              }}
                                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <div className="space-y-0.5 min-w-0">
                                              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                                                <code className="text-[9px] font-black text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded mr-1 inline-block shrink-0">{ind.code}</code>
                                                {'week' in ind && (
                                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">{String(ind.week).toUpperCase()}</span>
                                                )}
                                              </div>
                                              <p className="text-slate-700 mt-1">{ind.text}</p>
                                              {'lessonTopic' in ind && ind.lessonTopic && ind.lessonTopic !== 'General Topic' && (
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Topic: {String(ind.lessonTopic)}</p>
                                              )}
                                            </div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Pending Topics & Action suggestions */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-500" />
                  Pending Sub-strands
                </h4>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Focus these areas next in class</p>
                
                <div className="space-y-3">
                  {(() => {
                    const activeScheme = selectedSchemeId !== 'default-blueprint' 
                      ? userSchemes.find(s => s.id === selectedSchemeId) 
                      : null;

                    const parsedRows = activeScheme 
                      ? parseSchemeMarkdown(activeScheme.content).filter(item => coverageTerm === 'All' || item.term === coverageTerm)
                      : [];

                    const pendingList: { strand: string; subStrand: string; code: string }[] = [];
                    
                    if (activeScheme) {
                      const displayStrands = Array.from(new Set(parsedRows.map(p => p.strand)));
                      displayStrands.forEach(strand => {
                        const subStrands = Array.from(new Set(parsedRows.filter(p => p.strand === strand).map(p => p.subStrand)));
                        subStrands.forEach(subStrand => {
                          const indicators = parsedRows
                            .filter(p => p.strand === strand && p.subStrand === subStrand)
                            .map((p, index) => `scheme_${activeScheme.id}_${p.strand}_${p.subStrand}_${index}`);
                          
                          const allCovered = indicators.every(id => checkedIndicators[id]);
                          if (!allCovered) {
                            pendingList.push({
                              strand,
                              subStrand,
                              code: `WKW`
                            });
                          }
                        });
                      });
                    } else {
                      const strands = getSelectableStrands(coverageSubject, coverageLevel);
                      strands.forEach(strand => {
                        const subStrands = (SUBJECT_SUB_STRANDS[strand] || [strand]).filter(sub => {
                          if (coverageTerm === 'All') return true;
                          return getTermForSubStrand(strand, sub) === coverageTerm;
                        });

                        subStrands.forEach(subStrand => {
                          const totalIds = [
                            `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_1`,
                            `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_2`,
                            `${coverageLevel}_${coverageClass}_${coverageTerm}_${strand}_${subStrand}_3`
                          ];
                          const allCovered = totalIds.every(id => checkedIndicators[id]);
                          if (!allCovered) {
                            const classPrefix = coverageClass === 'All' 
                              ? (coverageLevel === 'All' ? 'B7' : (coverageLevel === 'JHS' ? 'B7' : coverageLevel === 'Primary' ? 'B1' : 'B10'))
                              : (coverageClass === 'KG 1' ? 'KG1' : coverageClass === 'KG 2' ? 'KG2' : coverageClass === 'Basic 1' ? 'B1' : coverageClass === 'Basic 2' ? 'B2' : coverageClass === 'Basic 3' ? 'B3' : coverageClass === 'Basic 4' ? 'B4' : coverageClass === 'Basic 5' ? 'B5' : coverageClass === 'Basic 6' ? 'B6' : coverageClass === 'Basic 7' ? 'B7' : coverageClass === 'Basic 8' ? 'B8' : coverageClass === 'Basic 9' ? 'B9' : 'B12');

                            pendingList.push({
                              strand,
                              subStrand,
                              code: `${classPrefix}.${strand.substring(0,2).toUpperCase()}.${subStrand.substring(0,2).toUpperCase()}`
                            });
                          }
                        });
                      });
                    }

                    if (pendingList.length === 0) {
                      return (
                        <div className="p-4 text-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                          🎉 Complete! All strands covered!
                        </div>
                      );
                    }

                    return pendingList.slice(0, 5).map(item => (
                      <div key={item.subStrand} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">{item.strand}</span>
                          <code className="text-[8px] font-black text-slate-500 bg-slate-200 px-1 py-0.5 rounded">{item.code}</code>
                        </div>
                        <h5 className="font-black text-slate-800 text-xs uppercase">{item.subStrand}</h5>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Action Board (Fast Preparation) */}
              <div className="bg-emerald-950 text-white p-6 rounded-[2rem] shadow-xl space-y-4 relative overflow-hidden border border-emerald-900">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <h4 className="text-xs font-black uppercase tracking-widest text-[10px] text-emerald-400">Curriculum Action Hub</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  Generate classroom resources for pending strands instantly with AI Tutor.
                </p>
                <Link
                  to="/ai"
                  className="block text-center py-3 bg-white text-emerald-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Consult AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-deep text-white">
              <h2 className="text-2xl font-black">Add New Resource</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
                <Plus className="rotate-45" size={28} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resource Type</label>
                <div className="flex gap-4">
                  {(['link', 'note', 'file', 'book'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewResource({...newResource, type: t})}
                      className={cn(
                        "flex-1 py-4 rounded-3xl flex flex-col items-center gap-2 border-2 transition-all",
                        newResource.type === t 
                          ? t === 'link' ? "bg-blue-50 border-blue-200 text-blue-700 shadow-lg shadow-blue-900/5 ring-2 ring-blue-500/20" :
                            t === 'note' ? "bg-amber-50 border-amber-200 text-amber-700 shadow-lg shadow-amber-900/5 ring-2 ring-amber-500/20" :
                            t === 'book' ? "bg-purple-50 border-purple-200 text-purple-700 shadow-lg shadow-purple-900/5 ring-2 ring-purple-500/20" :
                            "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-lg shadow-emerald-900/5 ring-2 ring-emerald-500/20"
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl transition-colors",
                        newResource.type === t
                          ? t === 'link' ? "bg-blue-100" : t === 'note' ? "bg-amber-100" : t === 'book' ? "bg-purple-100" : "bg-emerald-100"
                          : "bg-slate-50"
                      )}>
                        {getIcon(t, 24)}
                      </div>
                      <span className="capitalize text-xs font-black tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 tracking-widest uppercase">Subject</label>
                  <SearchableDropdown
                    value={newResource.subject}
                    options={subjects.slice().sort((a,b) => a.localeCompare(b))}
                    placeholder="Select Subject"
                    onChange={(val) => setNewResource({...newResource, subject: val})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Level</label>
                  <select 
                    required
                    value={newResource.level}
                    onChange={(e) => setNewResource({...newResource, level: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  >
                    <option value="">Select...</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Advanced NaCCA Alignment Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Resource Category</label>
                  <select 
                    required
                    value={newResource.resourceCategory}
                    onChange={(e) => setNewResource({...newResource, resourceCategory: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  >
                    {['AI-Generated Lesson Notes', 'AI-Generated Student Notes', 'Scheme of Learning', 'Exam Questions', 'Marking Scheme', 'Worksheet', 'TLM', 'AI Teaching Visual', 'Saved Resource', 'Bookmarked'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">School Term</label>
                  <select 
                    required
                    value={newResource.term}
                    onChange={(e) => setNewResource({...newResource, term: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  >
                    {['Term 1', 'Term 2', 'Term 3'].map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Strand (NaCCA)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Diversity of Matter"
                    value={newResource.strand}
                    onChange={(e) => setNewResource({...newResource, strand: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Sub-Strand</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Living Things"
                    value={newResource.subStrand}
                    onChange={(e) => setNewResource({...newResource, subStrand: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mixtures"
                    value={newResource.topic}
                    onChange={(e) => setNewResource({...newResource, topic: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-xs"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Resource Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Photosynthesis Video"
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Description (Optional)</label>
                <textarea 
                  placeholder="What is this resource about?"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  {newResource.type === 'link' || newResource.type === 'book' ? 'URL Link' : newResource.type === 'file' ? 'File URL' : 'Notes'}
                </label>
                <textarea 
                  required
                  placeholder={newResource.type === 'link' || newResource.type === 'book' ? "https://..." : "Type your notes here..."}
                  value={newResource.content}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full btn-primary py-4 font-black uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Save Resource"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewingResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "bg-white w-full rounded-[3rem] shadow-2xl overflow-hidden transition-all duration-500 flex flex-col",
              isPdf(viewingResource.content) ? "max-w-6xl h-[90vh]" : "max-w-2xl h-auto max-h-[80vh]"
            )}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  {getIcon(viewingResource.type, 24)}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                    {viewingResource.authorId === 'system' ? 'Official NaCCA Document' : 'Resource Viewer'}
                  </span>
                  <h2 className="text-xl font-black truncate max-w-[200px] md:max-w-md">{viewingResource.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleResourceDownload(viewingResource)}
                  className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isUrl(viewingResource.content) && !isPdf(viewingResource.content) ? (
                    <>
                      <ExternalLink size={16} />
                      Open Link
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setViewingResource(null)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors border border-white/10"
                >
                  <Plus className="rotate-45" size={28} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-8 space-y-8">
                {isPdf(viewingResource.content) && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                          {viewingResource.subject}
                        </div>
                        <div className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                          {viewingResource.level}
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">
                          <FileText size={12} />
                          Official PDF Archive
                        </span>
                      </div>
                      
                      <div className="p-1 bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-hidden">
                        <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between rounded-t-[2.4rem]">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                             <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Document Preview</span>
                          </div>
                        </div>
                        <div className="bg-slate-200 h-[600px] relative">
                          <iframe 
                            src={`${viewingResource.content}#view=FitH&toolbar=0`}
                            className="w-full h-full border-none"
                            title={viewingResource.title}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                          <Download size={100} />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Dedicated Download Portal</p>
                            <h3 className="text-xl font-black leading-tight border-l-4 border-emerald-500 pl-4">Ready for Export</h3>
                          </div>
                          
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            This document is provided by TeachSmart Ghana's central repository. It has been verified against current NaCCA guidelines.
                          </p>

                          <div className="space-y-3">
                            <button 
                              onClick={() => handleFileDownload(viewingResource.content, `${viewingResource.title.replace(/\s+/g, '_')}.pdf`)}
                              className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/30 group"
                            >
                              <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                              Download Document Now
                            </button>
                            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-wider">Estimated File Size: ~2.4 MB</p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          Security & Compliance
                        </h4>
                        
                        <div className="space-y-4">
                          {[
                            { label: 'NaCCA Alignment', value: 'Verified' },
                            { label: 'Cloud Scan', value: 'Complete' },
                            { label: 'Data Registry', value: 'Public' },
                            { label: 'Access Level', value: 'Teacher' }
                          ].map(stat => (
                            <div key={stat.label} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                              <span className="text-[10px] font-black text-slate-900 uppercase">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-[10px] text-amber-800 font-medium leading-relaxed italic">
                        Tip: Open the file on your computer using dedicated software like Adobe Reader for full annotation capabilities.
                      </div>
                    </div>
                  </div>
                )}

                {!isPdf(viewingResource.content) && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                        {viewingResource.subject}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-widest">
                        {viewingResource.level}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-1">
                        {getIcon(viewingResource.type, 12)}
                        {viewingResource.type}
                      </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                       
                       {isUrl(viewingResource.content) ? (
                         <div className="flex flex-col items-center gap-6 text-center w-full">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border-2 border-dashed border-emerald-100">
                              <LinkIcon size={48} />
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-slate-900 mb-2">Web Link Resource</h4>
                              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                This resource is an external web page or document. You can visit the official URL in a safe new tab.
                              </p>
                            </div>
                            <button 
                              onClick={() => handleResourceDownload(viewingResource)}
                              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
                            >
                              <ExternalLink size={16} />
                              Open Link in New Tab
                            </button>
                         </div>
                       ) : viewingResource.type === 'file' ? (
                         <div className="flex flex-col items-center gap-6 text-center w-full">
                            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                              <FileText size={48} />
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-slate-900 mb-2">Binary File Resource</h4>
                              <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium mb-2">
                                This file structure is stored offline. Please download below to open and access the full content.
                              </p>
                            </div>
                            <button 
                              onClick={() => handleResourceDownload(viewingResource)}
                              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download File Document
                            </button>
                         </div>
                       ) : viewingResource.type === 'note' ? (
                         <div className="relative z-10 w-full prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap leading-loose font-medium bg-amber-50/30 p-8 rounded-2xl border border-amber-100/50">
                            <div className="flex items-center gap-2 mb-4 text-amber-600 border-b border-amber-100 pb-4">
                              <StickyNote size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Teacher's Note Content</span>
                            </div>
                            {viewingResource.content}
                         </div>
                       ) : (
                         <div className="relative z-10 w-full prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap leading-loose font-medium">
                            {viewingResource.content}
                         </div>
                       )}
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <StickyNote size={14} />
                    Teacher's Reference Notes
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {viewingResource.description || "Official source documentation from the National Council for Curriculum and Assessment (NaCCA) Ghana."}
                  </p>
                </div>

                {/* Smart Curriculum Recommendations Engine */}
                <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px]">
                      AI
                    </div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      Smart Curriculum Recommendations
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Intelligently suggested files to support preparation for "{viewingResource.subject} - {viewingResource.title}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { type: 'Lesson Notes', label: 'Lesson Notes', desc: 'Standard-based lesson notes structured around core pedagogical indicators.' },
                      { type: 'Worksheet', label: 'Worksheets & Activities', desc: 'Group project templates and questions matching NaCCA standard operations.' },
                      { type: 'Exam Questions', label: 'Revision & Assessment', desc: 'Critical assessment questions bank with standard marking instructions.' },
                      { type: 'Marking Scheme', label: 'Marking Scheme', desc: 'Step-by-step marking rubrics matching correct curricular guidelines.' },
                      { type: 'TLM', label: 'Teaching & Learning Materials', desc: 'Practical guidance for low-cost, local items to construct in lessons.' },
                      { type: 'AI Teaching Visual', label: 'AI Educational Visuals', desc: 'An interactive schematic and blueprint description for chalkboard illustrations.' }
                    ].map(rec => (
                      <div key={rec.type} className="bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all group space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded tracking-widest uppercase">
                              {rec.type}
                            </span>
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="text-[11px] font-extrabold text-slate-800 leading-tight uppercase">
                            {viewingResource.title} - {rec.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2 mt-1">
                            {rec.desc}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Automatically add to library
                            const newResObj = {
                              authorId: user?.uid || 'user',
                              title: `${viewingResource.title} (${rec.type})`,
                              description: `Intelligently recommended ${rec.label.toLowerCase()} content for ${viewingResource.title} in ${viewingResource.subject}.`,
                              subject: viewingResource.subject,
                              level: viewingResource.level,
                              type: 'note' as const,
                              content: `### Intelligent ${rec.type} Resource\n**Subject:** ${viewingResource.subject}\n**Topic:** ${viewingResource.title}\n\nThis is a standard-aligned professional curriculum document generated dynamically by TeachSmart Ghana. It includes class-ready activities, indicator codes, and lesson structures.`,
                              createdAt: new Date(),
                              resourceCategory: rec.type,
                              term: viewingResource.term || 'Term 1',
                              topic: viewingResource.title
                            };
                            
                            // Let's add it
                            try {
                              addDoc(collection(db, 'resources'), {
                                ...newResObj,
                                createdAt: serverTimestamp()
                              });
                              toast.success(`Recommended ${rec.type} saved to "My Library" successfully!`);
                            } catch (e) {
                              // Fallback if writing to Firestore has issues (offline etc)
                              const localResources = JSON.parse(safeLocalStorage.getItem('teachsmart_offline_resources') || '[]');
                              localResources.push({ ...newResObj, id: 'temp-' + Date.now() });
                              safeLocalStorage.setItem('teachsmart_offline_resources', JSON.stringify(localResources));
                              toast.success(`Recommended ${rec.type} saved offline successfully!`);
                            }
                          }}
                          className="w-full py-2 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 text-center transition-all border border-slate-100 group-hover:border-emerald-600 block"
                        >
                          Quick Add to List
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center md:justify-end pb-8">
                  <button 
                    onClick={() => setViewingResource(null)}
                    className="w-full md:w-auto px-12 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <ConfirmationModal 
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={() => resourceToDelete && handleDelete(resourceToDelete)}
        title="Delete Resource?"
        message="This action cannot be undone. This resource will be permanently removed from your library."
        confirmLabel="Delete"
      />
    </div>
  );
}

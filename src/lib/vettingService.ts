import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { LessonPlan, UserProfile } from '../types';
import { VettingSubmission, VettingStatus, VettingRubricChecks, HeadteacherStampConfig } from '../types/vetting';
import { saveOffline, getOffline } from './indexedDB';
import { getCurrentGesCalendarInfo, getAcademicYearForDate, getTermForDate } from './academicCalendar';

const LOCAL_STORAGE_VETTING_KEY = 'teachsmart_vetting_submissions';
const LOCAL_STORAGE_STAMP_KEY = 'teachsmart_headteacher_stamp';

export const GES_DEFAULT_REMARKS_PRESETS = [
  {
    type: 'approved',
    title: 'NaCCA Aligned & Commended',
    text: 'Lesson plan strictly aligns with official NaCCA curriculum standards. Progressive learner-centered activities in Phase 2 with appropriate local TLRs. Endorsed for instructional delivery.'
  },
  {
    type: 'approved',
    title: 'Approved with Inclusive Note',
    text: 'Well structured and competency-based. Ensure sufficient time allocation for differentiated learners during Phase 2 activity sessions.'
  },
  {
    type: 'approved',
    title: 'Interactive Delivery Commendation',
    text: 'Commendable integration of critical thinking and collaborative group tasks. Approved for weekly teaching.'
  },
  {
    type: 'needs_revision',
    title: 'Phase 2 Learner-Centric Revision',
    text: 'Revision Required: Kindly restructure Phase 2 activities to be more participatory and hands-on. Shift teacher-led talk to student group engagement.'
  },
  {
    type: 'needs_revision',
    title: 'Indicator & Core Competency Adjustment',
    text: 'Revision Required: Please verify the Indicator code and ensure specific Core Competencies (e.g. Critical Thinking, Communication) are explicitly mapped in Phase 2.'
  },
  {
    type: 'needs_revision',
    title: 'TLR & Assessment Enhancement',
    text: 'Revision Required: Please specify locally available Teaching & Learning Resources (TLRs) and include clear formative assessment questions in Phase 3.'
  }
];

export const GES_RUBRIC_CRITERIA = [
  {
    key: 'curriculumAligned' as keyof VettingRubricChecks,
    label: 'NaCCA Curriculum & Code Alignment',
    description: 'Strand, Sub-strand, Content Standard, and Indicator codes accurately match official NaCCA syllabus.'
  },
  {
    key: 'learnerCentered' as keyof VettingRubricChecks,
    label: 'Phase 2 Learner-Centric Activities',
    description: 'Students actively participate through inquiry, group work, or practical tasks rather than passive listening.'
  },
  {
    key: 'coreCompetencies' as keyof VettingRubricChecks,
    label: 'Core Competencies & Values Integration',
    description: 'Fosters Critical Thinking, Problem Solving, Collaboration, and Cultural Identity in classroom interactions.'
  },
  {
    key: 'localTlrs' as keyof VettingRubricChecks,
    label: 'Accessible & Localized TLRs',
    description: 'Teaching aids and learning materials utilize realistic, affordable, locally available resources.'
  },
  {
    key: 'assessmentAndInclusion' as keyof VettingRubricChecks,
    label: 'Formative Assessment & Differentiation',
    description: 'Clear diagnostic/plenary evaluation with differentiated support for struggling and gifted learners.'
  }
];

/**
 * Retrieves Headteacher stamp preferences from localStorage with fallback to user profile
 */
export function getHeadteacherStampConfig(profile?: UserProfile | null): HeadteacherStampConfig {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_STAMP_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading stamp config from localStorage:', e);
  }

  const schoolName = profile?.schoolName || profile?.school || 'Presbyterian Basic School, Adabraka';
  const district = profile?.district || profile?.region ? `${profile?.district || 'Accra Metro'} (${profile?.region || 'Greater Accra'})` : 'Accra Metro District';
  const headteacherName = profile?.displayName || 'Rev. Emmanuel Mensah';

  return {
    headteacherName,
    designation: profile?.role === 'school_admin' ? 'Headteacher' : 'Headteacher / Academic Supervisor',
    schoolName,
    district,
    stampStyle: 'rectangle',
    signatureType: 'typed',
    typedSignatureFont: 'font-serif italic',
    serialCode: `GES-VET-${Math.floor(100000 + Math.random() * 900000)}`
  };
}

/**
 * Saves Headteacher stamp preferences to localStorage
 */
export function saveHeadteacherStampConfig(config: HeadteacherStampConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_STAMP_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving stamp config to localStorage:', e);
  }
}

/**
 * Read all local submissions from localStorage fallback
 */
function getLocalSubmissions(): VettingSubmission[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_VETTING_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save submissions to localStorage fallback
 */
function saveLocalSubmissions(submissions: VettingSubmission[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_VETTING_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error caching submissions locally:', e);
  }
}

/**
 * Submits a lesson plan for Headteacher Digital Vetting
 */
export async function submitPlanForVetting(
  plan: LessonPlan,
  profile: UserProfile | null,
  options?: {
    schoolName?: string;
    district?: string;
    schoolLicenseCode?: string;
  }
): Promise<VettingSubmission> {
  const planId = plan.id || `plan_${Date.now()}`;
  const submissionId = `vet_${planId}_${Date.now()}`;
  const nowIso = new Date().toISOString();

  const submission: VettingSubmission = {
    id: submissionId,
    planId,
    teacherUid: profile?.uid || 'anonymous_teacher',
    teacherName: profile?.displayName || 'Ghanaian Educator',
    teacherEmail: profile?.email || '',
    schoolName: options?.schoolName || profile?.schoolName || profile?.school || 'Ghana Basic School',
    district: options?.district || profile?.district || 'Ghana Education Service',
    schoolLicenseCode: options?.schoolLicenseCode || profile?.schoolLicenseCode || '',
    title: plan.title || `${plan.subject} - Week ${plan.week || plan.weekNumber || '1'}`,
    subject: plan.subject || 'General',
    classLevel: plan.class || plan.level || 'Basic',
    weekNumber: plan.week || plan.weekNumber || '1',
    term: plan.term || (plan.weekEnding ? `Term ${getTermForDate(plan.weekEnding)}` : 'Term 1'),
    academicYear: plan.academicYear || getAcademicYearForDate(plan.weekEnding || plan.date || new Date()),
    planSnapshot: { ...plan, id: planId },
    status: 'pending',
    submittedAt: nowIso,
    updatedAt: nowIso,
    rubricChecks: {
      curriculumAligned: true,
      learnerCentered: true,
      coreCompetencies: true,
      localTlrs: true,
      assessmentAndInclusion: true
    },
    rubricScore: 5
  };

  // 1. Save to local storage first for resilience
  const localList = getLocalSubmissions();
  const existingIdx = localList.findIndex(s => s.planId === planId);
  if (existingIdx >= 0) {
    localList[existingIdx] = submission;
  } else {
    localList.unshift(submission);
  }
  saveLocalSubmissions(localList);

  // 2. Also update local IndexedDB copy of lesson plan
  try {
    await saveOffline('lessonPlans', {
      ...plan,
      id: planId,
      vettingStatus: 'pending',
      vettingSubmissionId: submissionId
    }, true);
  } catch (e) {
    console.warn('Failed to update indexedDB plan with pending status:', e);
  }

  // 3. Persist to Firestore if online
  try {
    const docRef = doc(db, 'vetting_submissions', submissionId);
    await setDoc(docRef, {
      ...submission,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Also update the lessonPlan doc in Firestore if plan.id exists
    if (plan.id) {
      try {
        const planDocRef = doc(db, 'lessonPlans', plan.id);
        await updateDoc(planDocRef, {
          vettingStatus: 'pending',
          vettingSubmissionId: submissionId,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Could not update original lessonPlan doc directly:', err);
      }
    }
  } catch (err) {
    console.warn('Network issue saving to Firestore, local submission kept:', err);
  }

  return submission;
}

/**
 * Fetch submissions for a specific teacher or school
 */
export async function getVettingSubmissions(options?: {
  teacherUid?: string;
  schoolLicenseCode?: string;
  schoolName?: string;
  isHeadteacherView?: boolean;
}): Promise<VettingSubmission[]> {
  let list: VettingSubmission[] = [];

  // Try Firestore first
  try {
    const submissionsCol = collection(db, 'vetting_submissions');
    let q;

    if (options?.teacherUid && !options.isHeadteacherView) {
      q = query(submissionsCol, where('teacherUid', '==', options.teacherUid), orderBy('submittedAt', 'desc'));
    } else if (options?.schoolLicenseCode) {
      q = query(submissionsCol, where('schoolLicenseCode', '==', options.schoolLicenseCode), orderBy('submittedAt', 'desc'));
    } else {
      q = query(submissionsCol, orderBy('submittedAt', 'desc'));
    }

    const snap = await getDocs(q);
    snap.forEach(d => {
      list.push({ id: d.id, ...(d.data() as any) });
    });
  } catch (err) {
    console.warn('Firestore fetch failed for vetting submissions, reading local fallback:', err);
  }

  // Merge with local storage
  const localList = getLocalSubmissions();
  const idMap = new Map<string, VettingSubmission>();

  // Add remote first
  list.forEach(s => idMap.set(s.id, s));

  // Add local (overwrites if newer or missing)
  localList.forEach(s => {
    if (!idMap.has(s.id)) {
      idMap.set(s.id, s);
    } else {
      const existing = idMap.get(s.id)!;
      if (new Date(s.updatedAt || s.submittedAt) > new Date(existing.updatedAt || existing.submittedAt)) {
        idMap.set(s.id, s);
      }
    }
  });

  let merged = Array.from(idMap.values());

  // Filter if needed
  if (options?.teacherUid && !options.isHeadteacherView) {
    merged = merged.filter(s => s.teacherUid === options.teacherUid);
  } else if (options?.schoolLicenseCode) {
    merged = merged.filter(s => s.schoolLicenseCode === options.schoolLicenseCode || !s.schoolLicenseCode);
  }

  // Sort by submittedAt descending
  merged.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // If completely empty, populate with realistic sample data for smooth testing
  if (merged.length === 0) {
    merged = getSeedSampleSubmissions();
    saveLocalSubmissions(merged);
  }

  return merged;
}

/**
 * Headteacher records their vetting decision (Approve, Request Revision, or Reject)
 */
export async function recordVettingDecision(
  submissionId: string,
  decision: 'approved' | 'needs_revision' | 'rejected',
  details: {
    headteacherRemarks: string;
    rubricChecks: VettingRubricChecks;
    rubricScore: number;
    headteacherConfig: HeadteacherStampConfig;
    revisionNotes?: string;
    vettedByUid?: string;
  }
): Promise<VettingSubmission> {
  const nowIso = new Date().toISOString();
  const localList = getLocalSubmissions();
  const idx = localList.findIndex(s => s.id === submissionId);

  let targetSubmission: VettingSubmission;

  if (idx >= 0) {
    targetSubmission = {
      ...localList[idx],
      status: decision,
      headteacherRemarks: details.headteacherRemarks,
      rubricChecks: details.rubricChecks,
      rubricScore: details.rubricScore,
      vettedAt: nowIso,
      updatedAt: nowIso,
      vettedByUid: details.vettedByUid || 'headteacher_local',
      vettedByName: details.headteacherConfig.headteacherName,
      vettedByDesignation: details.headteacherConfig.designation,
      digitalStamp: details.headteacherConfig,
      revisionNotes: details.revisionNotes || ''
    };
    localList[idx] = targetSubmission;
    saveLocalSubmissions(localList);
  } else {
    throw new Error('Submission not found to vet.');
  }

  // Also update original plan in indexedDB
  if (targetSubmission.planId) {
    try {
      const planDocs = await getOffline('lessonPlans');
      const foundPlan = planDocs.find(p => p.id === targetSubmission.planId);
      if (foundPlan) {
        await saveOffline('lessonPlans', {
          ...foundPlan,
          vettingStatus: decision,
          headteacherRemarks: details.headteacherRemarks,
          vettedBy: details.headteacherConfig.headteacherName,
          vettedDesignation: details.headteacherConfig.designation,
          vettedAt: nowIso,
          headteacherSignature: details.headteacherConfig.signatureDataUrl
        }, true);
      }
    } catch (e) {
      console.warn('Could not update indexedDB plan with vetting decision:', e);
    }
  }

  // Update in Firestore
  try {
    const docRef = doc(db, 'vetting_submissions', submissionId);
    await updateDoc(docRef, {
      status: decision,
      headteacherRemarks: details.headteacherRemarks,
      rubricChecks: details.rubricChecks,
      rubricScore: details.rubricScore,
      vettedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      vettedByUid: details.vettedByUid || 'headteacher',
      vettedByName: details.headteacherConfig.headteacherName,
      vettedByDesignation: details.headteacherConfig.designation,
      digitalStamp: details.headteacherConfig,
      revisionNotes: details.revisionNotes || ''
    });

    if (targetSubmission.planId) {
      try {
        const planDocRef = doc(db, 'lessonPlans', targetSubmission.planId);
        await updateDoc(planDocRef, {
          vettingStatus: decision,
          headteacherRemarks: details.headteacherRemarks,
          vettedBy: details.headteacherConfig.headteacherName,
          vettedDesignation: details.headteacherConfig.designation,
          vettedAt: nowIso,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Could not update firestore lessonPlans doc:', err);
      }
    }
  } catch (err) {
    console.warn('Could not update firestore vetting doc:', err);
  }

  return targetSubmission;
}

/**
 * Realistic seed sample submissions for Ghanaian teachers & headteachers
 */
function getSeedSampleSubmissions(): VettingSubmission[] {
  return [
    {
      id: 'vet_sample_sci_p4_01',
      planId: 'sample_plan_p4_science',
      teacherUid: 'sample_teacher_kofi',
      teacherName: 'Kofi Mensah Boateng',
      teacherEmail: 'kofi.boateng@ges.gov.gh',
      schoolName: 'Presbyterian Basic School, Adabraka',
      district: 'Accra Metro District',
      title: 'Science: States of Matter & Phase Changes',
      subject: 'Science',
      classLevel: 'Basic 4 (Primary 4)',
      weekNumber: '3',
      term: `Term ${getCurrentGesCalendarInfo().activeTerm}`,
      academicYear: getCurrentGesCalendarInfo().academicYear,
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      rubricChecks: {
        curriculumAligned: true,
        learnerCentered: true,
        coreCompetencies: true,
        localTlrs: true,
        assessmentAndInclusion: true
      },
      rubricScore: 5,
      planSnapshot: {
        title: 'Science: States of Matter & Phase Changes',
        subject: 'Science',
        class: 'Basic 4',
        level: 'Primary',
        strand: 'Materials',
        subStrand: 'Earth Materials',
        contentStandard: 'B4.1.1.1: Demonstrate an understanding of the states of matter.',
        contentStandardCode: 'B4.1.1.1',
        indicator: 'B4.1.1.1.1: Classify materials into solids, liquids, and gases based on observable physical properties.',
        indicatorCode: 'B4.1.1.1.1',
        performanceIndicator: 'Learners can observe and group classroom objects into solid, liquid, and gas categories.',
        coreCompetencies: 'Critical Thinking and Problem Solving (CP), Collaboration and Communication (CC)',
        keyWords: 'Solid, Liquid, Gas, Shape, Volume, Pouring, Freezing',
        tlrs: 'Water in clean cups, stones, inflated balloons, transparent containers, chart of states of matter',
        references: 'NaCCA Curriculum for Science (Basic 4), Science Pupil Book 4, pp. 22-26',
        phase1: 'Engage learners with mystery items in bags (a stone, a bottle of water, an inflated balloon). Have them touch and describe without seeing, guessing the state.',
        phase2: 'In groups of four, learners handle stones, pour water into different shaped glasses, and feel air escaping from a balloon. Guide them to record shape changes on their group activity sheet.',
        phase3: 'Quick plenary quiz: Call out 5 everyday Ghanaian items (shea butter, palm oil, smoke from kitchen, calabash) and have learners raise corresponding flashcards.'
      }
    },
    {
      id: 'vet_sample_math_jhs2_02',
      planId: 'sample_plan_jhs2_math',
      teacherUid: 'sample_teacher_ama',
      teacherName: 'Ama Serwaa Darko',
      teacherEmail: 'ama.darko@ges.gov.gh',
      schoolName: 'Presbyterian Basic School, Adabraka',
      district: 'Accra Metro District',
      title: 'Mathematics: Linear Equations in One Variable',
      subject: 'Mathematics',
      classLevel: 'JHS 2 (Basic 8)',
      weekNumber: '4',
      term: `Term ${getCurrentGesCalendarInfo().activeTerm}`,
      academicYear: getCurrentGesCalendarInfo().academicYear,
      status: 'approved',
      submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      vettedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      vettedByName: 'Rev. Emmanuel Mensah',
      vettedByDesignation: 'Headteacher',
      headteacherRemarks: 'Excellent NaCCA alignment with clear balance beam real-world analogies. Learner-centric group tasks are exemplary. Approved for instruction.',
      rubricChecks: {
        curriculumAligned: true,
        learnerCentered: true,
        coreCompetencies: true,
        localTlrs: true,
        assessmentAndInclusion: true
      },
      rubricScore: 5,
      digitalStamp: {
        headteacherName: 'Rev. Emmanuel Mensah',
        designation: 'Headteacher',
        schoolName: 'Presbyterian Basic School, Adabraka',
        district: 'Accra Metro District',
        stampStyle: 'rectangle',
        serialCode: 'GES-ACC-2026-8831'
      },
      planSnapshot: {
        title: 'Mathematics: Linear Equations in One Variable',
        subject: 'Mathematics',
        class: 'JHS 2',
        level: 'JHS',
        strand: 'Algebra',
        subStrand: 'Algebraic Expressions & Equations',
        contentStandard: 'B8.2.1.1: Demonstrate understanding of solving linear equations in one variable.',
        contentStandardCode: 'B8.2.1.1',
        indicator: 'B8.2.1.1.2: Solve linear equations of the form ax + b = c using balancing methods.',
        indicatorCode: 'B8.2.1.1.2',
        performanceIndicator: 'Learners can model and solve 2-step algebraic linear equations with inverse operations.',
        coreCompetencies: 'Critical Thinking and Problem Solving (CP), Digital Literacy (DL)',
        keyWords: 'Equation, Balance, Variable, Coefficient, Inverse Operation',
        tlrs: 'Scale balance model, matchsticks, cardboard number tiles, chalk board algebra chart',
        references: 'NaCCA Mathematics Curriculum for JHS (Basic 7-9), pp. 48-52',
        phase1: 'Review balancing concept with a physical twin-pan balance scale. Ask learners what happens if 5 pebbles are removed from one side only.',
        phase2: 'Guide pairs of students through balancing equations step-by-step: subtracting constant from both sides, then dividing by coefficient.',
        phase3: 'Exit ticket: 2 equations solved individually on mini-whiteboards for immediate teacher feedback.'
      }
    },
    {
      id: 'vet_sample_kg2_owop_03',
      planId: 'sample_plan_kg2_owop',
      teacherUid: 'sample_teacher_grace',
      teacherName: 'Grace Abena Osei',
      teacherEmail: 'grace.osei@ges.gov.gh',
      schoolName: 'Presbyterian Basic School, Adabraka',
      district: 'Accra Metro District',
      title: 'Our World and Our People: Family & Home Roles',
      subject: 'Our World Our People',
      classLevel: 'Kindergarten 2 (KG 2)',
      weekNumber: '2',
      term: `Term ${getCurrentGesCalendarInfo().activeTerm}`,
      academicYear: getCurrentGesCalendarInfo().academicYear,
      status: 'needs_revision',
      submittedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      vettedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
      vettedByName: 'Rev. Emmanuel Mensah',
      vettedByDesignation: 'Headteacher',
      headteacherRemarks: 'Good child-friendly theme. Revision note: Please include specific role-play drama stations and local Ghanaian family songs in the Phase 2 activity corners.',
      revisionNotes: 'Please add role-play activities and songs in the play corners for early childhood learning.',
      rubricChecks: {
        curriculumAligned: true,
        learnerCentered: false,
        coreCompetencies: true,
        localTlrs: true,
        assessmentAndInclusion: false
      },
      rubricScore: 3,
      planSnapshot: {
        title: 'Our World and Our People: Family & Home Roles',
        subject: 'Our World Our People',
        class: 'KG 2',
        level: 'KG',
        strand: 'All About Us',
        subStrand: 'My Family and Community',
        contentStandard: 'K2.1.2.1: Appreciate family members and their roles.',
        contentStandardCode: 'K2.1.2.1',
        indicator: 'K2.1.2.1.1: Identify members of the nuclear and extended family and their contributions to the home.',
        indicatorCode: 'K2.1.2.1.1',
        performanceIndicator: 'Children can draw their family members and state one chore each person assists with.',
        coreCompetencies: 'Personal Development and Leadership (PL), Cultural Identity and Global Citizenship (CG)',
        keyWords: 'Mother, Father, Siblings, Grandmother, Helping, Chores',
        tlrs: 'Picture cut-outs of Ghanaian families, crayons, drawing sheets, puppets',
        references: 'NaCCA Kindergarten Curriculum Guide, pp. 14-17',
        phase1: 'Sing familiar Ghanaian family rhymes (e.g. "Obaatan pa"). Ask children who cooked breakfast for them.',
        phase2: 'Children color family pictures and share who they live with.',
        phase3: 'Children display their artwork in the classroom gallery corner.'
      }
    }
  ];
}

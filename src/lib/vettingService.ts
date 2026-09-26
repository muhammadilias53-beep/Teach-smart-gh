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
import { 
  VettingSubmission, 
  VettingStatus, 
  VettingRubricChecks, 
  HeadteacherStampConfig,
  SchoolVettingPortal,
  SchoolTeacherMember
} from '../types/vetting';
import { saveOffline, getOffline } from './indexedDB';
import { getCurrentGesCalendarInfo, getAcademicYearForDate, getTermForDate } from './academicCalendar';

const LOCAL_STORAGE_VETTING_KEY = 'teachsmart_vetting_submissions';
const LOCAL_STORAGE_STAMP_KEY = 'teachsmart_headteacher_stamp';
const LOCAL_STORAGE_PORTAL_KEY = 'teachsmart_headteacher_portal';
const LOCAL_STORAGE_ALL_PORTALS_KEY = 'teachsmart_all_school_portals';

/**
 * Checks if the current user profile has official Headteacher, Academic Supervisor, or School Admin privileges.
 * Under Ghana Education Service (GES) supervisory regulations, only these authorized roles
 * are legally permitted to vet, rubric-score, and stamp lesson notes.
 */
export function isHeadteacherUser(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  if (profile.isSchoolAdmin) return true;
  const role = (profile.role || '').toLowerCase();
  return (
    role === 'headteacher' ||
    role === 'school_admin' ||
    role === 'admin' ||
    role === 'superadmin' ||
    role === 'circuit_supervisor' ||
    role === 'siso'
  );
}

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
 * Generate human-friendly School Vetting Code (e.g. PBS-782, GES-409)
 */
export function generateSchoolVettingCode(schoolName: string): string {
  const clean = schoolName.replace(/[^a-zA-Z\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  let prefix = '';
  if (words.length >= 3) {
    prefix = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  } else if (words.length === 2) {
    prefix = (words[0].substring(0, 2) + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 3) {
    prefix = words[0].substring(0, 3).toUpperCase();
  } else {
    prefix = 'GES';
  }
  const randomDigits = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randomDigits}`;
}

const DEFAULT_SAMPLE_TEACHERS: SchoolTeacherMember[] = [
  {
    uid: 'sample_teacher_kofi',
    name: 'Kofi Mensah Boateng',
    email: 'kofi.boateng@ges.gov.gh',
    phone: '024 412 8891',
    classLevel: 'Basic 4',
    subject: 'Science',
    joinedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    status: 'active'
  },
  {
    uid: 'sample_teacher_ama',
    name: 'Ama Serwaa Darko',
    email: 'ama.darko@ges.gov.gh',
    phone: '055 623 1544',
    classLevel: 'JHS 2 (Basic 8)',
    subject: 'Mathematics',
    joinedAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    status: 'active'
  },
  {
    uid: 'sample_teacher_grace',
    name: 'Grace Abena Osei',
    email: 'grace.osei@ges.gov.gh',
    phone: '020 891 0022',
    classLevel: 'KG 2',
    subject: 'Our World Our People',
    joinedAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    status: 'active'
  }
];

function getAllCachedPortals(): SchoolVettingPortal[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALL_PORTALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading all portals cache:', e);
  }
  return [];
}

function saveCachedPortals(portals: SchoolVettingPortal[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ALL_PORTALS_KEY, JSON.stringify(portals));
  } catch (e) {
    console.error('Error saving cached portals:', e);
  }
}

/**
 * Get or create a dedicated School Vetting Portal for a Headteacher
 */
export async function getOrCreateHeadteacherPortal(profile?: UserProfile | null): Promise<SchoolVettingPortal> {
  const uid = profile?.uid || 'headteacher_local';
  const schoolName = profile?.schoolName || profile?.school || 'Presbyterian Basic School, Adabraka';
  const district = profile?.district || profile?.region ? `${profile?.district || 'Accra Metro'} (${profile?.region || 'Greater Accra'})` : 'Accra Metro District';
  const headteacherName = profile?.displayName || 'Rev. Emmanuel Mensah';

  // 1. Try local storage first for instant load
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_PORTAL_KEY);
    if (local) {
      const parsed = JSON.parse(local) as SchoolVettingPortal;
      if (parsed && (parsed.headteacherUid === uid || !profile?.uid)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local portal:', e);
  }

  // 2. Try Firestore
  try {
    if (profile?.uid) {
      const portalsCol = collection(db, 'school_vetting_portals');
      const q = query(portalsCol, where('headteacherUid', '==', profile.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data() as SchoolVettingPortal;
        localStorage.setItem(LOCAL_STORAGE_PORTAL_KEY, JSON.stringify(docData));
        return docData;
      }
    }
  } catch (err) {
    console.warn('Firestore fetch failed for school portal:', err);
  }

  // 3. Create default / initial portal
  const portalCode = profile?.schoolLicenseCode || generateSchoolVettingCode(schoolName);
  const nowIso = new Date().toISOString();
  const calendarInfo = getCurrentGesCalendarInfo();

  const newPortal: SchoolVettingPortal = {
    id: portalCode,
    code: portalCode,
    schoolName,
    district,
    headteacherUid: uid,
    headteacherName,
    headteacherDesignation: profile?.role === 'school_admin' ? 'Headteacher' : 'Headteacher / Academic Supervisor',
    headteacherEmail: profile?.email || '',
    headteacherPhone: profile?.phone || '',
    teachers: DEFAULT_SAMPLE_TEACHERS,
    activeTerm: `Term ${calendarInfo.activeTerm}`,
    academicYear: calendarInfo.academicYear,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Cache locally
  localStorage.setItem(LOCAL_STORAGE_PORTAL_KEY, JSON.stringify(newPortal));
  const cachedAll = getAllCachedPortals();
  const existingIdx = cachedAll.findIndex(p => p.code === newPortal.code);
  if (existingIdx >= 0) cachedAll[existingIdx] = newPortal;
  else cachedAll.push(newPortal);
  saveCachedPortals(cachedAll);

  // Persist to Firestore if online
  try {
    const docRef = doc(db, 'school_vetting_portals', portalCode);
    await setDoc(docRef, {
      ...newPortal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not persist school portal to Firestore:', err);
  }

  return newPortal;
}

/**
 * Look up a school vetting portal by its unique Code (e.g. PBS-782)
 */
export async function getSchoolPortalByCode(code: string): Promise<SchoolVettingPortal | null> {
  const cleanCode = code.toUpperCase().trim();
  if (!cleanCode) return null;

  // 1. Check local cache
  const cachedAll = getAllCachedPortals();
  const foundInAll = cachedAll.find(p => p.code.toUpperCase() === cleanCode || p.id.toUpperCase() === cleanCode);
  if (foundInAll) return foundInAll;

  const currentLocal = localStorage.getItem(LOCAL_STORAGE_PORTAL_KEY);
  if (currentLocal) {
    const parsed = JSON.parse(currentLocal) as SchoolVettingPortal;
    if (parsed.code.toUpperCase() === cleanCode || parsed.id.toUpperCase() === cleanCode) {
      return parsed;
    }
  }

  // 2. Query Firestore
  try {
    const docRef = doc(db, 'school_vetting_portals', cleanCode);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SchoolVettingPortal;
      cachedAll.push(data);
      saveCachedPortals(cachedAll);
      return data;
    }

    const col = collection(db, 'school_vetting_portals');
    const q = query(col, where('code', '==', cleanCode));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const data = querySnap.docs[0].data() as SchoolVettingPortal;
      cachedAll.push(data);
      saveCachedPortals(cachedAll);
      return data;
    }
  } catch (err) {
    console.warn('Error fetching school portal by code from Firestore:', err);
  }

  // 3. Fallback for sample PBS school
  if (cleanCode.startsWith('PBS') || cleanCode === 'GES-ACC-01') {
    const calendarInfo = getCurrentGesCalendarInfo();
    const fallbackPortal: SchoolVettingPortal = {
      id: cleanCode,
      code: cleanCode,
      schoolName: 'Presbyterian Basic School, Adabraka',
      district: 'Accra Metro District',
      headteacherUid: 'sample_headteacher_emmanuel',
      headteacherName: 'Rev. Emmanuel Mensah',
      headteacherDesignation: 'Headteacher',
      headteacherEmail: 'emmanuel.mensah@ges.gov.gh',
      headteacherPhone: '024 498 7712',
      teachers: DEFAULT_SAMPLE_TEACHERS,
      activeTerm: `Term ${calendarInfo.activeTerm}`,
      academicYear: calendarInfo.academicYear,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    cachedAll.push(fallbackPortal);
    saveCachedPortals(cachedAll);
    return fallbackPortal;
  }

  return null;
}

/**
 * Links a teacher to a Headteacher's School Vetting Portal
 */
export async function joinSchoolPortal(
  teacherProfile: UserProfile | null,
  code: string,
  details?: { classLevel?: string; subject?: string; phone?: string }
): Promise<SchoolVettingPortal> {
  const portal = await getSchoolPortalByCode(code);
  if (!portal) {
    throw new Error(`School Vetting Code "${code}" was not found. Please verify the code with your Headteacher.`);
  }

  const teacherUid = teacherProfile?.uid || `teacher_${Date.now()}`;
  const teacherName = teacherProfile?.displayName || 'Educator';
  const teacherEmail = teacherProfile?.email || '';

  const existingIdx = portal.teachers.findIndex(t => t.uid === teacherUid || (t.email && t.email === teacherEmail));

  const updatedTeacher: SchoolTeacherMember = {
    uid: teacherUid,
    name: teacherName,
    email: teacherEmail,
    phone: details?.phone || teacherProfile?.phone || '',
    classLevel: details?.classLevel || (teacherProfile as any)?.class || teacherProfile?.level || 'Basic',
    subject: details?.subject || teacherProfile?.subjects?.[0] || 'General',
    joinedAt: new Date().toISOString(),
    status: 'active'
  };

  if (existingIdx >= 0) {
    portal.teachers[existingIdx] = { ...portal.teachers[existingIdx], ...updatedTeacher };
  } else {
    portal.teachers.push(updatedTeacher);
  }

  portal.updatedAt = new Date().toISOString();

  // Save updated portal
  await updateSchoolPortal(portal);

  // Cache teacher's linked code
  try {
    localStorage.setItem('teachsmart_linked_school_code', portal.code);
    localStorage.setItem('teachsmart_linked_school_name', portal.schoolName);
  } catch (e) {
    console.warn('Error saving linked code:', e);
  }

  return portal;
}

/**
 * Updates a School Vetting Portal
 */
export async function updateSchoolPortal(portal: SchoolVettingPortal): Promise<SchoolVettingPortal> {
  portal.updatedAt = new Date().toISOString();

  // Save locally
  localStorage.setItem(LOCAL_STORAGE_PORTAL_KEY, JSON.stringify(portal));
  const cachedAll = getAllCachedPortals();
  const idx = cachedAll.findIndex(p => p.id === portal.id || p.code === portal.code);
  if (idx >= 0) cachedAll[idx] = portal;
  else cachedAll.push(portal);
  saveCachedPortals(cachedAll);

  // Update in Firestore
  try {
    const docRef = doc(db, 'school_vetting_portals', portal.id || portal.code);
    await setDoc(docRef, {
      ...portal,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Error updating school portal in Firestore:', err);
  }

  return portal;
}

/**
 * Computes teacher roster with real-time submission statistics for a school portal
 */
export async function getSchoolTeachersWithStats(portalCode: string): Promise<Array<SchoolTeacherMember & {
  totalPlans: number;
  pendingPlans: number;
  approvedPlans: number;
  needsRevisionPlans: number;
}>> {
  const portal = await getSchoolPortalByCode(portalCode);
  const teachers = portal?.teachers || DEFAULT_SAMPLE_TEACHERS;

  // Load all submissions for this portal
  const allSubmissions = await getVettingSubmissions({
    schoolLicenseCode: portalCode,
    schoolVettingCode: portalCode,
    isHeadteacherView: true
  });

  return teachers.map(teacher => {
    const teacherPlans = allSubmissions.filter(s => 
      s.teacherUid === teacher.uid || 
      (s.teacherEmail && teacher.email && s.teacherEmail.toLowerCase() === teacher.email.toLowerCase()) ||
      s.teacherName.toLowerCase() === teacher.name.toLowerCase()
    );

    const totalPlans = teacherPlans.length;
    const pendingPlans = teacherPlans.filter(p => p.status === 'pending').length;
    const approvedPlans = teacherPlans.filter(p => p.status === 'approved').length;
    const needsRevisionPlans = teacherPlans.filter(p => p.status === 'needs_revision').length;

    return {
      ...teacher,
      totalPlans,
      pendingPlans,
      approvedPlans,
      needsRevisionPlans
    };
  });
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
    schoolVettingCode?: string;
  }
): Promise<VettingSubmission> {
  const planId = plan.id || `plan_${Date.now()}`;
  const submissionId = `vet_${planId}_${Date.now()}`;
  const nowIso = new Date().toISOString();

  const code = options?.schoolVettingCode || options?.schoolLicenseCode || profile?.schoolLicenseCode || '';

  const submission: VettingSubmission = {
    id: submissionId,
    planId,
    teacherUid: profile?.uid || 'anonymous_teacher',
    teacherName: profile?.displayName || 'Ghanaian Educator',
    teacherEmail: profile?.email || '',
    schoolName: options?.schoolName || profile?.schoolName || profile?.school || 'Presbyterian Basic School',
    district: options?.district || profile?.district || 'Accra Metro District',
    schoolLicenseCode: code,
    schoolVettingCode: code,
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
  schoolVettingCode?: string;
  schoolName?: string;
  isHeadteacherView?: boolean;
}): Promise<VettingSubmission[]> {
  let list: VettingSubmission[] = [];
  const targetCode = options?.schoolVettingCode || options?.schoolLicenseCode;

  // Try Firestore first
  try {
    const submissionsCol = collection(db, 'vetting_submissions');
    let q;

    if (options?.teacherUid && !options.isHeadteacherView) {
      q = query(submissionsCol, where('teacherUid', '==', options.teacherUid), orderBy('submittedAt', 'desc'));
    } else if (targetCode) {
      q = query(submissionsCol, where('schoolLicenseCode', '==', targetCode), orderBy('submittedAt', 'desc'));
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
  } else if (targetCode) {
    merged = merged.filter(s => 
      s.schoolLicenseCode === targetCode || 
      s.schoolVettingCode === targetCode || 
      !s.schoolLicenseCode
    );
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
  const currentYear = new Date().getFullYear();
  const localList = getLocalSubmissions();
  const idx = localList.findIndex(s => s.id === submissionId);

  let targetSubmission: VettingSubmission;

  // Generate or preserve official GES vetting serial code
  const verificationCode = details.headteacherConfig.serialCode || `GES-VET-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;
  const stampConfigWithSerial: HeadteacherStampConfig = {
    ...details.headteacherConfig,
    serialCode: verificationCode
  };

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
      digitalStamp: stampConfigWithSerial,
      verificationCode: decision === 'approved' ? verificationCode : undefined,
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
      digitalStamp: stampConfigWithSerial,
      verificationCode: decision === 'approved' ? verificationCode : null,
      revisionNotes: details.revisionNotes || ''
    });

    // Also register verification ledger document in Firestore so SISO/Inspector QR scanner can verify immediately
    if (decision === 'approved' && verificationCode) {
      try {
        const verifDocRef = doc(db, 'document_verifications', verificationCode);
        await setDoc(verifDocRef, {
          verificationCode,
          documentType: 'Weekly Lesson Plan',
          subject: targetSubmission.subject,
          classLevel: targetSubmission.classLevel,
          term: targetSubmission.term,
          academicYear: targetSubmission.academicYear,
          teacherName: targetSubmission.teacherName,
          schoolName: targetSubmission.schoolName,
          district: targetSubmission.district || 'GES Directorate',
          issuedAt: nowIso,
          vettingStatus: 'approved',
          vettedBy: details.headteacherConfig.headteacherName,
          vettedDesignation: details.headteacherConfig.designation,
          vettedAt: nowIso,
          headteacherRemarks: details.headteacherRemarks,
          rubricScore: details.rubricScore,
          rubricChecks: details.rubricChecks,
          verified: true,
          registeredAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Could not register in document_verifications ledger:', err);
      }
    }

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

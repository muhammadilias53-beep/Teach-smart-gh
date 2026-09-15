export type VettingStatus = 'draft' | 'pending' | 'approved' | 'needs_revision' | 'rejected';

export interface VettingRubricChecks {
  curriculumAligned: boolean; // Strand, Sub-strand & Indicator Code accuracy
  learnerCentered: boolean; // Phase 2 participatory, learner-centric activities
  coreCompetencies: boolean; // Critical thinking, collaboration, creativity integrated
  localTlrs: boolean; // Appropriate local teaching and learning materials
  assessmentAndInclusion: boolean; // Formative check & differentiation for diverse learners
}

export interface HeadteacherStampConfig {
  headteacherName: string;
  designation: string; // e.g. 'Headteacher', 'Assistant Headteacher (Academics)', 'Curriculum Lead', 'Circuit Supervisor'
  schoolName: string;
  district: string;
  stampStyle?: 'circle' | 'rectangle';
  signatureDataUrl?: string; // Drawn or typed signature
  signatureType?: 'drawn' | 'typed';
  typedSignatureFont?: string;
  serialCode?: string;
}

export interface VettingSubmission {
  id: string;
  planId: string;
  teacherUid: string;
  teacherName: string;
  teacherEmail?: string;
  schoolName: string;
  district?: string;
  schoolLicenseCode?: string;
  title: string;
  subject: string;
  classLevel: string;
  weekNumber?: string;
  term?: string;
  academicYear?: string;
  planSnapshot: any; // Full LessonPlan object
  status: VettingStatus;
  submittedAt: string;
  vettedAt?: string;
  vettedByUid?: string;
  vettedByName?: string;
  vettedByDesignation?: string;
  headteacherRemarks?: string;
  revisionNotes?: string;
  rubricChecks?: VettingRubricChecks;
  rubricScore?: number; // 0 to 5
  digitalStamp?: HeadteacherStampConfig;
  verificationCode?: string;
  updatedAt?: string;
}

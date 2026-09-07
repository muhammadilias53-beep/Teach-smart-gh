export type Level = 'KG' | 'Primary' | 'JHS' | 'SHS';
export type SchemeType = 'weekly' | 'termly' | 'yearly';
export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export type PlanType = 'quick_pass' | 'credits' | 'termly' | 'termly_pro' | 'yearly' | 'lifetime' | 'school_license' | 'school_starter' | 'school_pro';

export interface SchoolLicense {
  code: string;
  ownerUid: string;
  ownerEmail?: string;
  ownerName?: string;
  schoolName?: string;
  plan: 'school_starter' | 'school_pro';
  maxSeats: number;
  usedSeats: number;
  members: string[];
  createdAt: any;
  expiresAt: any;
  active: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  school?: string;
  schoolName?: string;
  region?: string;
  district?: string;
  town?: string;
  level?: Level;
  subjects?: string[];
  subjectsTaught?: string[];
  teachingExperienceYears?: number;
  trialStartDate: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate?: string;
  aiCredits?: number;
  isSchoolAdmin?: boolean;
  schoolLicenseCode?: string;
  onboardingComplete?: boolean;
  lastGenerationAt?: any;
  photoURL?: string;
  lastPaymentId?: string;
  planType?: PlanType;
  plan?: PlanType;
  hasBulkExport?: boolean;
  locality?: string;
  classSize?: string;
  trialResetApril2024Applied?: boolean;
  trialResetMay2026Applied?: boolean;
  trialGenerationsDate?: string;
  trialGenerationsToday?: number;
  trialTotalGenerations?: number;
  isBstemSchool?: boolean;
  isAnonymous?: boolean;
  hasSeenOnboardingTour?: boolean;
  onboardingTourDismissed?: boolean;
  profileCompleted?: boolean;
  acceptedTerms?: boolean;
  acceptedTermsAt?: string;
  termsVersion?: string;
  acceptedResponsibleAiTerms?: boolean;
  createdAt?: any;
}

export interface LessonPlan {
  id?: string;
  authorId: string;
  title: string;
  level: string;
  subject: string;
  class?: string;
  term?: string;
  academicYear?: string;
  locality?: string;
  specificLocality?: string;
  week?: string;
  weekNumber?: string;
  weekEnding?: string;
  classSize?: string;
  day?: string;
  date?: string;
  period?: string;
  lessonNumber?: string;
  lesson?: string;
  duration?: string;
  strand: string;
  subStrand: string;
  indicator?: string;
  indicatorCode: string;
  contentStandard?: string;
  contentStandardCode: string;
  lessonFocus?: string;
  performanceIndicator: string;
  coreCompetencies: string;
  keyWords: string;
  tlrs: string;
  references: string;
  phase1: string;
  phase2: string;
  phase3: string;
  assessment?: string;
  remarks?: string;
  teacherReflection?: string;
  headteacherRemarks?: string;
  isKgPlan?: boolean;
  kgBlocks?: any[];
  differentiation?: any;
  createdAt: any;
}

export interface SchemeOfWork {
  id?: string;
  authorId: string;
  title: string;
  level: string;
  subject: string;
  type: SchemeType;
  content: string;
  createdAt: string;
}

export interface Exam {
  id?: string;
  authorId: string;
  title: string;
  level: string;
  subject: string;
  questions: string;
  markingScheme: string;
  createdAt: string;
}

export interface Resource {
  id?: string;
  authorId: string;
  title: string;
  description?: string;
  subject: string;
  level: string;
  strand?: string;
  subStrand?: string;
  contentCode?: string;
  type: 'link' | 'note' | 'file' | 'book';
  content: string;
  createdAt: any;
  resourceCategory?: 'Lesson Notes' | 'Student Notes' | 'Scheme of Learning' | 'Exam Questions' | 'Marking Scheme' | 'Worksheet' | 'TLM' | 'AI Teaching Visual' | 'Curriculum PDF' | 'Saved Resource' | 'Download History' | 'Bookmark' | string;
  term?: string;
  topic?: string;
  downloadHistory?: boolean;
}

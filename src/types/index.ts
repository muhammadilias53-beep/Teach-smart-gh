export type Level = 'KG' | 'Primary' | 'JHS' | 'SHS';
export type SchemeType = 'weekly' | 'termly' | 'yearly';
export type SubscriptionStatus = 'trial' | 'active' | 'expired';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  school?: string;
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
  onboardingComplete?: boolean;
  lastGenerationAt?: any;
  photoURL?: string;
  lastPaymentId?: string;
  planType?: 'quick_pass' | 'termly' | 'yearly' | 'lifetime';
  plan?: 'quick_pass' | 'termly' | 'yearly' | 'lifetime';
  locality?: string;
  classSize?: string;
  trialResetApril2024Applied?: boolean;
  trialResetMay2026Applied?: boolean;
  isBstemSchool?: boolean;
  isAnonymous?: boolean;
  createdAt?: any;
}

export interface LessonPlan {
  id?: string;
  authorId: string;
  title: string;
  level: string;
  subject: string;
  weekEnding?: string;
  classSize?: string;
  day?: string;
  date?: string;
  period?: string;
  lessonNumber?: string;
  strand: string;
  subStrand: string;
  indicatorCode: string;
  contentStandardCode: string;
  performanceIndicator: string;
  coreCompetencies: string;
  keyWords: string;
  tlrs: string;
  references: string;
  phase1: string;
  phase2: string;
  phase3: string;
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

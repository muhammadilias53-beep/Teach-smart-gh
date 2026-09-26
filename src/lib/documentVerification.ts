import QRCode from 'qrcode';
import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getCurrentGesCalendarInfo } from './academicCalendar';

export interface DocumentVerificationData {
  verificationCode: string;
  documentType: string;
  subject: string;
  classLevel: string;
  term: string;
  academicYear: string;
  teacherName: string;
  schoolName: string;
  district?: string;
  issuedAt: string;
  signature: string;
  authorId?: string;
  vettingStatus?: string;
  vettedBy?: string;
  vettedDesignation?: string;
  vettedAt?: string;
  headteacherRemarks?: string;
  rubricScore?: number;
  rubricChecks?: Record<string, boolean>;
}

/**
 * Generate a short, tamper-evident signature string for URL verification
 */
function createSignature(payload: {
  code: string;
  docType: string;
  subject: string;
  classLevel: string;
  term: string;
  year: string;
  teacher: string;
  school: string;
  issuedAt: string;
}): string {
  const secret = 'TSG_GHANA_CURRICULUM_INTEGRITY_2026';
  const str = `${payload.code}|${payload.docType}|${payload.subject}|${payload.classLevel}|${payload.term}|${payload.year}|${payload.teacher}|${payload.school}|${payload.issuedAt}|${secret}`;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  return hex;
}

/**
 * Generate a random alphanumeric verification code: TSG-2026-XXXXXX
 */
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const currentYear = new Date().getFullYear();
  return `TSG-${currentYear}-${rand}`;
}

/**
 * Create a full verification payload with URL and metadata
 */
export function createDocumentVerification(params: {
  documentType?: string;
  subject?: string;
  classLevel?: string;
  term?: string;
  academicYear?: string;
  teacherName?: string;
  schoolName?: string;
  district?: string;
  authorId?: string;
  verificationCode?: string;
  vettingStatus?: string;
  vettedBy?: string;
  vettedDesignation?: string;
  vettedAt?: string;
  headteacherRemarks?: string;
  rubricScore?: number;
  rubricChecks?: Record<string, boolean>;
}): {
  data: DocumentVerificationData;
  verificationUrl: string;
} {
  const code = params.verificationCode || generateVerificationCode();
  const docType = params.documentType || 'Lesson Plan';
  const subject = params.subject || 'General Subject';
  const classLevel = params.classLevel || 'Basic Stage';
  const term = params.term || `Term ${getCurrentGesCalendarInfo().activeTerm}`;
  const academicYear = params.academicYear || getCurrentGesCalendarInfo().academicYear;
  const teacherName = params.teacherName || 'Facilitator';
  const schoolName = params.schoolName || 'Ghana Basic School';
  const district = params.district || 'GES District Directorate';
  const issuedAt = new Date().toISOString();

  const signature = createSignature({
    code,
    docType,
    subject,
    classLevel,
    term,
    year: academicYear,
    teacher: teacherName,
    school: schoolName,
    issuedAt: issuedAt.slice(0, 10), // Date-level stability
  });

  const data: DocumentVerificationData = {
    verificationCode: code,
    documentType: docType,
    subject,
    classLevel,
    term,
    academicYear,
    teacherName,
    schoolName,
    district,
    issuedAt,
    signature,
    authorId: params.authorId,
    vettingStatus: params.vettingStatus,
    vettedBy: params.vettedBy,
    vettedDesignation: params.vettedDesignation,
    vettedAt: params.vettedAt,
    headteacherRemarks: params.headteacherRemarks,
    rubricScore: params.rubricScore,
    rubricChecks: params.rubricChecks,
  };

  // Build browser URL origin (or fallback)
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://teachsmartgh.com';

  const queryParams = new URLSearchParams({
    code,
    type: docType,
    sub: subject,
    cls: classLevel,
    term,
    yr: academicYear,
    fac: teacherName,
    sch: schoolName,
    dist: district,
    t: issuedAt,
    sig: signature,
  });

  if (params.vettingStatus) {
    queryParams.set('vet', params.vettingStatus);
  }
  if (params.vettedBy) {
    queryParams.set('vb', params.vettedBy);
  }
  if (params.vettedDesignation) {
    queryParams.set('vd', params.vettedDesignation);
  }
  if (params.vettedAt) {
    queryParams.set('va', params.vettedAt);
  }
  if (params.headteacherRemarks) {
    queryParams.set('rem', params.headteacherRemarks.slice(0, 200));
  }

  // Use HashRouter path format so URL works immediately on static/SPA hosting
  const verificationUrl = `${origin}/#/verify?${queryParams.toString()}`;

  // Asynchronously record verification in Firestore in background (non-blocking)
  recordVerificationInFirestore(data).catch(() => {});

  return { data, verificationUrl };
}

/**
 * Generate QR Code as Base64 Data URL (for jsPDF and web display)
 */
export async function generateQRCodeDataUrl(verificationUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 220,
      color: {
        dark: '#001C3D', // TeachSmart Deep Navy Blue
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return '';
  }
}

/**
 * Draw a vector-sharp QR Code directly in jsPDF (100% synchronous, no canvas/bitmap artifacts)
 */
export function renderQRCodeInPDF(
  doc: any,
  url: string,
  x: number,
  y: number,
  sizeMm: number,
  darkColor: [number, number, number] = [0, 28, 61], // TeachSmart Deep Navy
  lightColor: [number, number, number] = [255, 255, 255]
): void {
  try {
    const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const modSize = qr.modules.size;
    const margin = 1;
    const totalGrid = modSize + (margin * 2);
    const cellSize = sizeMm / totalGrid;

    // Background container
    doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
    doc.rect(x, y, sizeMm, sizeMm, 'F');

    // Subtle border
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.2);
    doc.rect(x, y, sizeMm, sizeMm, 'S');

    // Dark modules
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    for (let r = 0; r < modSize; r++) {
      for (let c = 0; c < modSize; c++) {
        if (qr.modules.get(r, c)) {
          doc.rect(
            x + (c + margin) * cellSize,
            y + (r + margin) * cellSize,
            cellSize + 0.05,
            cellSize + 0.05,
            'F'
          );
        }
      }
    }
  } catch (err) {
    console.error('Error rendering QR code in PDF:', err);
  }
}

/**
 * Generate QR Code as Uint8Array bytes (for docx ImageRun)
 */
export async function generateQRCodeBytes(verificationUrl: string): Promise<Uint8Array | null> {
  try {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, verificationUrl, {
        margin: 1,
        width: 220,
        color: {
          dark: '#001C3D',
          light: '#FFFFFF'
        }
      });
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
  } catch (err) {
    console.error('Failed to generate QR code bytes for docx:', err);
  }
  return null;
}

/**
 * Non-blocking write to Firestore for persistent lookup by verification code
 */
async function recordVerificationInFirestore(data: DocumentVerificationData): Promise<void> {
  try {
    if (!db || !data.verificationCode) return;
    const ref = doc(db, 'document_verifications', data.verificationCode);
    await setDoc(ref, {
      ...data,
      verified: true,
      registeredAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    // Silently ignore offline or unauthenticated write failures
  }
}

/**
 * Verify a document token and fetch full data
 */
export async function verifyDocumentCode(code: string): Promise<DocumentVerificationData | null> {
  try {
    if (!db || !code) return null;
    const ref = doc(db, 'document_verifications', code);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as DocumentVerificationData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate URL parameters against expected signature
 */
export function validateSignature(data: {
  code: string;
  docType: string;
  subject: string;
  classLevel: string;
  term: string;
  year: string;
  teacher: string;
  school: string;
  issuedAt: string;
  sig: string;
}): boolean {
  if (!data.sig) return false;
  const expected = createSignature({
    code: data.code,
    docType: data.docType,
    subject: data.subject,
    classLevel: data.classLevel,
    term: data.term,
    year: data.year,
    teacher: data.teacher,
    school: data.school,
    issuedAt: data.issuedAt.slice(0, 10),
  });
  return expected === data.sig;
}

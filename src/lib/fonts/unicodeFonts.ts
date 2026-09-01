import jsPDF from 'jspdf';
import { FREE_SANS_REGULAR_B64, FREE_SANS_BOLD_B64 } from './freeSansBase64';

/**
 * Returns text as-is, strictly preserving Ghanaian phonetic characters (ɛ, Ɛ, ɔ, Ɔ, ŋ, Ŋ).
 */
export function sanitizeForPdf(text: string): string {
  return text || '';
}

/**
 * Registers Unicode TrueType fonts (FreeSans and FreeSans-Bold) in the jsPDF instance.
 * Fully supports all NaCCA and Ghanaian indigenous language characters:
 * - ɛ (U+025B)
 * - Ɛ (U+0190)
 * - ɔ (U+0254)
 * - Ɔ (U+0186)
 * - ŋ (U+014B)
 * - Ŋ (U+014A)
 *
 * Returns the registered font family name ('FreeSans').
 */
export function registerUnicodeFonts(doc: jsPDF): string {
  try {
    if (typeof doc.addFileToVFS === 'function' && typeof doc.addFont === 'function') {
      // Check if FreeSans is already added to VFS/Font List
      const fontList = typeof doc.getFontList === 'function' ? doc.getFontList() : {};
      if (!fontList['FreeSans']) {
        doc.addFileToVFS('FreeSans.ttf', FREE_SANS_REGULAR_B64);
        doc.addFont('FreeSans.ttf', 'FreeSans', 'normal');

        doc.addFileToVFS('FreeSansBold.ttf', FREE_SANS_BOLD_B64);
        doc.addFont('FreeSansBold.ttf', 'FreeSans', 'bold');
      }
      return 'FreeSans';
    }
  } catch (error) {
    console.warn('Could not register FreeSans Unicode font with jsPDF:', error);
  }
  return 'helvetica';
}


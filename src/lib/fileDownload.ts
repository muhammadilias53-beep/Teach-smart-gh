import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

/**
 * Checks if the current app environment is running as an installed PWA (Standalone / WebAPK)
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Detects iOS device (iPhone, iPad, iPod)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Detects Android device
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Universal, PWA-safe file download and native share handler.
 * Seamlessly handles installed PWAs (Android WebAPK, iOS Standalone WebClip, Desktop PWA),
 * sandboxed preview iframes, and standard web browsers.
 */
export async function saveOrDownloadBlob(
  blob: Blob,
  filename: string,
  customMimeType?: string
): Promise<boolean> {
  const mimeType = customMimeType || blob.type || 'application/octet-stream';
  const isMobile = isIOSDevice() || isAndroidDevice();
  const isPWA = isStandaloneMode();

  // 1. Mobile & PWA Native Share (Level 2 Web Share API with Files)
  // In iOS PWA and Android PWA, this presents the native OS sheet allowing
  // direct "Save to Files", "Save to Downloads", "Drive", or WhatsApp sharing.
  if ((isMobile || isPWA) && typeof navigator !== 'undefined' && 'canShare' in navigator && typeof File !== 'undefined') {
    try {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
          text: `TeachSmartGH Generated: ${filename}`
        });
        return true;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled the share dialog - do not force anchor fallback or show error
        return false;
      }
      console.warn('[PWA Download] Native file share failed, falling back to direct download:', err);
    }
  }

  // 2. Direct Anchor Download (for Desktop PWA, Desktop Browsers, or Mobile fallback)
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener noreferrer';

    // In iOS standalone PWA where <a download> with blob is ignored by WebKit:
    if (isIOSDevice() && isPWA) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const newWin = window.open(dataUrl, '_blank');
        if (!newWin) {
          const dataLink = document.createElement('a');
          dataLink.href = dataUrl;
          dataLink.download = filename;
          dataLink.target = '_blank';
          document.body.appendChild(dataLink);
          dataLink.click();
          setTimeout(() => {
            if (dataLink.parentNode) document.body.removeChild(dataLink);
          }, 30000);
        }
      };
      reader.readAsDataURL(blob);
      return true;
    }

    // Standard high-reliability anchor dispatch
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // CRITICAL: Do NOT revoke object URL immediately!
    // Revoking immediately causes PWA download managers (especially on Android and Chrome)
    // to fail because the download process reads the blob asynchronously.
    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch {
        // Ignore cleanup errors
      }
    }, 60000); // 60 seconds ensures download manager has completed fetching

    return true;
  } catch (downloadErr) {
    console.error('[PWA Download] Anchor download failed:', downloadErr);
    toast.error('Failed to trigger download. Please check your browser permissions.');
    return false;
  }
}

/**
 * Universal PWA-compatible PDF exporter.
 * Replaces direct doc.save() calls with PWA-aware blob extraction and native handling.
 */
export async function saveOrDownloadPdf(
  doc: jsPDF,
  filename: string
): Promise<boolean> {
  const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  try {
    const blob = doc.output('blob');
    return await saveOrDownloadBlob(blob, safeFilename, 'application/pdf');
  } catch (err) {
    console.warn('[PWA Download] doc.output("blob") failed, attempting arraybuffer fallback:', err);
    try {
      const buffer = doc.output('arraybuffer');
      const blob = new Blob([buffer], { type: 'application/pdf' });
      return await saveOrDownloadBlob(blob, safeFilename, 'application/pdf');
    } catch (finalErr) {
      console.error('[PWA Download] PDF export failed:', finalErr);
      return false;
    }
  }
}

/**
 * Universal text/markdown/csv downloader compatible with PWAs
 */
export async function saveOrDownloadText(
  content: string,
  filename: string,
  mimeType = 'text/plain;charset=utf-8'
): Promise<boolean> {
  const blob = new Blob([content], { type: mimeType });
  return await saveOrDownloadBlob(blob, filename, mimeType);
}

/**
 * Install global jsPDF interceptor so any doc.save() call across the app
 * is automatically PWA-safe without requiring manual changes in all call sites.
 */
export function initPwaDownloadPolyfill(): void {
  if (typeof window === 'undefined') return;
  try {
    const api = (jsPDF as any).API;
    if (api && !api.__pwa_save_patched) {
      api.__pwa_save_patched = true;
      api.save = function (filename?: string) {
        const targetFilename = filename || 'document.pdf';
        saveOrDownloadPdf(this, targetFilename);
        return this;
      };
    }
  } catch (err) {
    console.warn('[PWA Download] Could not attach global jsPDF save interceptor:', err);
  }
}

// Auto-initialize polyfill on module evaluation in browser environments
if (typeof window !== 'undefined') {
  initPwaDownloadPolyfill();
}


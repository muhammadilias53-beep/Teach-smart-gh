import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { formatWeekLessonPlanTitle } from './utils';
import { buildMultiDayLessonPhases } from './multiDayParser';
import { getKGScheduleForDay, getSupportedKGBlockDuration, reconcileKGBlocks } from '../config/kgTimetable';

export interface LessonPlanExportData {
  title?: string;
  subject: string;
  ghanaianLanguage?: string;
  level?: string;
  class: string;
  classSize?: string;
  weekNumber?: string;
  week?: string;
  weekEnding?: string;
  day?: string;
  date?: string;
  period?: string;
  lesson?: string;
  duration?: string;
  strand?: string;
  subStrand?: string;
  indicatorCode?: string;
  contentStandardCode?: string;
  indicator?: string;
  contentStandard?: string;
  lessonFocus?: string;
  performanceIndicator?: string;
  mainObjective?: string;
  coreCompetencies?: string;
  keyWords?: string;
  tlrs?: string;
  references?: string;
  phase1?: string;
  phase2?: string;
  phase3?: string;
  assessment?: string;
  remarks?: string;
  teacherReflection?: string;
  headteacherRemarks?: string;
  isKgPlan?: boolean;
  kgBlocks?: any[];
  locality?: string;
  specificLocality?: string;
  differentiation?: {
    strugglingLearners?: { activities?: string; resources?: string; assessments?: string };
    averageLearners?: { activities?: string; resources?: string; assessments?: string };
    advancedLearners?: { activities?: string; resources?: string; assessments?: string };
  };
}

/**
 * Clean and format markdown text to readable plain text for PDF tables WITHOUT cutting or deleting content
 */
function cleanMarkdownForPDF(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, '$1') // Preserve contents of code blocks
    .replace(/^#+\s+/gm, '') // Remove markdown header hashes
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold asterisks
    .replace(/\*([^*]+)\*/g, '$1') // Remove italics asterisks
    .replace(/__([^_]+)__/g, '$1') // Remove bold underscores
    .replace(/_([^_]+)_/g, '$1') // Remove italic underscores
    .replace(/`([^`]+)`/g, '$1') // Remove inline backticks
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/^\s*[-*+]\s+/gm, '• ') // Standardize bullets
    .replace(/\r\n/g, '\n') // Standardize line endings
    .replace(/\n{3,}/g, '\n\n') // Normalize excessive line breaks
    .trim();
}

/**
 * Export Lesson Plan in the EXACT format and positioning of the Official GES / NaCCA Lesson Notebook Page
 * Ensures bold component preservation, distinct aligned rows per day, multi-page continuous flow, and crisp TeachSmartGH branding.
 */
export function exportLessonPlanToPDF(data: LessonPlanExportData): jsPDF {
  const isKg = data.isKgPlan || data.level === 'KG' || data.class?.toUpperCase().includes('KG');
  if (isKg) {
    return exportKGLessonPlanToPDF(data);
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 12;
  const rightMargin = 12;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 186mm on standard A4

  const displaySubject = data.subject === 'Ghanaian Language' && data.ghanaianLanguage
    ? `GHANAIAN LANGUAGE (${data.ghanaianLanguage.toUpperCase()})`
    : (data.subject || 'GENERAL SUBJECT').toUpperCase();

  const className = (data.class || data.level || 'BASIC 7').toUpperCase();
  const classSize = data.classSize || '40';
  const weekEnding = data.weekEnding || new Date().toISOString().split('T')[0];
  const day = data.day || 'Monday';
  const date = data.date || weekEnding;
  const period = data.period || (data.duration ? `${data.duration}` : '1 & 2');
  const lesson = data.lesson || '1';

  const strand = data.strand || 'N/A';
  const subStrand = data.subStrand || 'N/A';

  // Extract indicator and content standard codes cleanly
  let indCode = data.indicatorCode || '';
  if (!indCode && data.indicator) {
    indCode = data.indicator;
  }
  if (!indCode) indCode = 'N/A';

  let csCode = data.contentStandardCode || '';
  if (!csCode && data.contentStandard) {
    csCode = data.contentStandard;
  }
  if (!csCode) csCode = 'N/A';

  const performanceIndicator = data.performanceIndicator || data.mainObjective || 'Learners can demonstrate understanding of stated lesson indicators.';
  const coreCompetencies = cleanMarkdownForPDF(data.coreCompetencies) || 'Critical Thinking and Problem Solving (CP), Communication and Collaboration (CC)';
  const keyWords = cleanMarkdownForPDF(data.keyWords) || 'N/A';
  const tlrs = cleanMarkdownForPDF(data.tlrs) || 'Curriculum Handbooks, Realia, Chalkboard illustrations';
  const references = cleanMarkdownForPDF(data.references) || 'NaCCA Standard-Based Curriculum Guidelines, Teacher Resource Pack';

  // ==========================================
  // TOP BRANDING BANNER (Page 1)
  // ==========================================
  doc.setFillColor(0, 28, 61); // Deep Navy Blue
  doc.rect(0, 0, pageWidth, 16.5, 'F');

  // Gold & Green Trim Ribbon
  doc.setFillColor(252, 209, 22); // Ghana Gold
  doc.rect(0, 16.5, pageWidth, 1.2, 'F');
  doc.setFillColor(0, 107, 63); // Ghana Green
  doc.rect(0, 17.7, pageWidth, 0.6, 'F');

  // Brand Name & Tagline (Left)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('TeachSmart', leftMargin, 9.5);
  doc.setTextColor(252, 209, 22);
  doc.text('GH', leftMargin + 25.5, 9.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('AI-Powered Teaching. Smarter Tomorrow.  |  Catalyst Creative', leftMargin, 14);

  // Right Side: Standard Badge
  doc.setFillColor(0, 107, 63);
  doc.roundedRect(pageWidth - rightMargin - 46, 4, 46, 9.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NaCCA / GES Aligned', pageWidth - rightMargin - 23, 8.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('Standard-Based Curriculum', pageWidth - rightMargin - 23, 12, { align: 'center' });

  // ==========================================
  // NOTEBOOK HEADER ROW
  // ==========================================
  const topMargin = 25.5;

  // Center Main Title - Official GES Week Lesson Plan Title
  const officialTitle = formatWeekLessonPlanTitle(data.weekNumber || data.week || '1');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(officialTitle, pageWidth / 2, topMargin - 2.5, { align: 'center' });

  // Top Left: SUBJECT
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SUBJECT:', leftMargin, topMargin);
  doc.setFont('helvetica', 'bold');
  doc.text(` ${displaySubject}`, leftMargin + 18, topMargin);
  
  // Underline under subject
  doc.setDrawColor(180, 180, 180);
  doc.setLineDashPattern([0.5, 1], 0);
  doc.line(leftMargin + 18, topMargin + 1, leftMargin + 65, topMargin + 1);

  // Top Right: CLASS and CLASS SIZE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CLASS:', 148, topMargin - 2);
  doc.setFont('helvetica', 'bold');
  doc.text(` ${className}`, 163, topMargin - 2);
  doc.line(163, topMargin - 1, pageWidth - rightMargin, topMargin - 1);

  doc.setFont('helvetica', 'bold');
  doc.text('CLASS SIZE:', 148, topMargin + 3.5);
  doc.setFont('helvetica', 'bold');
  doc.text(` ${classSize}`, 171, topMargin + 3.5);
  doc.line(171, topMargin + 4.5, pageWidth - rightMargin, topMargin + 4.5);

  doc.setLineDashPattern([], 0); // Reset dash

  // ==========================================
  // TABLE 1: METADATA & CURRICULUM COMPONENTS
  // ==========================================
  const startTableY = topMargin + 7;

  // AutoTable for Metadata Rows (Row 1 to Row 6)
  // Strict 5-column widths summing to exactly contentWidth (186mm)
  autoTable(doc, {
    startY: startTableY,
    margin: { top: 14, bottom: 15, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    pageBreak: 'auto',
    rowPageBreak: 'auto',
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 60 },
      2: { cellWidth: 36 },
      3: { cellWidth: 32 },
      4: { cellWidth: 32 },
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      textColor: [15, 23, 42],
      font: 'helvetica',
      overflow: 'linebreak',
    },
    body: [
      // Row 1: Day | WEEK ENDING: | Date | Period | Lesson (5 columns)
      [
        { 
          content: `Day\n${day}`, 
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252] } 
        },
        { 
          content: `WEEK ENDING: ${weekEnding}`, 
          styles: { fontStyle: 'bold', valign: 'middle' } 
        },
        { 
          content: `Date\n${date}`, 
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252] } 
        },
        { 
          content: `Period\n${period}`, 
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252] } 
        },
        { 
          content: `Lesson\n${lesson}`, 
          styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252] } 
        },
      ],
      // Row 2: Strand (cols 0-1 = 86mm) | Sub-strand (cols 2-4 = 100mm)
      [
        { 
          colSpan: 2, 
          content: `STRAND:\n${strand}`, 
          styles: { fontStyle: 'bold' } 
        },
        { 
          colSpan: 3, 
          content: `SUB-STRAND:\n${subStrand}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
      // Row 3: Indicator (code) | Content standard (code)
      [
        { 
          colSpan: 2, 
          content: `INDICATOR (CODE):\n${indCode}`, 
          styles: { fontStyle: 'bold' } 
        },
        { 
          colSpan: 3, 
          content: `CONTENT STANDARD (CODE):\n${csCode}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
      // Row 4: Performance indicator (Full Width: 5 cols = 186mm)
      [
        { 
          colSpan: 5, 
          content: `PERFORMANCE INDICATOR:\n${performanceIndicator}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
      // Row 5: Core competencies | Key words
      [
        { 
          colSpan: 2, 
          content: `CORE COMPETENCIES:\n${coreCompetencies}`, 
          styles: { fontStyle: 'bold' } 
        },
        { 
          colSpan: 3, 
          content: `KEY WORDS:\n${keyWords}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
      // Row 6: T.L.R.(s): | Ref:
      [
        { 
          colSpan: 2, 
          content: `T.L.R.(S):\n${tlrs}`, 
          styles: { fontStyle: 'bold' } 
        },
        { 
          colSpan: 3, 
          content: `REF:\n${references}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
    ],
  });

  // Get table 1 end Y position
  const finalYTable1 = (doc as any).lastAutoTable.finalY || 100;

  // Build multi-day phases for Table 2
  const dayPhases = buildMultiDayLessonPhases({
    day: data.day || 'Monday',
    weekEnding: data.weekEnding,
    duration: data.duration,
    phase1: data.phase1,
    phase2: data.phase2,
    phase3: data.phase3,
    differentiation: data.differentiation
  });

  // Create Table 2 rows for each individual day
  const table2BodyRows: RowInput[] = dayPhases.map((phase, index) => {
    let mainContent = cleanMarkdownForPDF(phase.main);
    
    // Add differentiation to main content
    if (phase.differentiation) {
      const diff = phase.differentiation;
      const diffTexts: string[] = [];
      if (diff.strugglingLearners?.activities) {
        diffTexts.push(`• Remedial / Struggling: ${cleanMarkdownForPDF(diff.strugglingLearners.activities)}`);
      }
      if (diff.averageLearners?.activities) {
        diffTexts.push(`• Core Class / Average: ${cleanMarkdownForPDF(diff.averageLearners.activities)}`);
      }
      if (diff.advancedLearners?.activities) {
        diffTexts.push(`• Advanced / Enrichment: ${cleanMarkdownForPDF(diff.advancedLearners.activities)}`);
      }
      if (diffTexts.length > 0) {
        mainContent += `\n\nINCLUSIVE DIFFERENTIATION:\n${diffTexts.join('\n')}`;
      }
    }

    if (data.assessment && (index === dayPhases.length - 1 || dayPhases.length === 1)) {
      mainContent += `\n\nASSESSMENT / EVALUATION:\n${cleanMarkdownForPDF(data.assessment)}`;
    }

    let plenaryContent = cleanMarkdownForPDF(phase.plenary);
    if (data.remarks && (index === dayPhases.length - 1 || dayPhases.length === 1)) {
      plenaryContent += `\n\nREMARKS / REFLECTION:\n${cleanMarkdownForPDF(data.remarks)}`;
    }

    const dayCellLabel = phase.dayDate 
      ? `${phase.dayName}\n(${phase.dayDate})\n\n(${phase.duration || data.duration || '60 mins'})`
      : `${phase.dayName}\n\n(${phase.duration || data.duration || '60 mins'})`;

    return [
      { 
        content: dayCellLabel, 
        styles: { fontStyle: 'bold' as const, halign: 'center' as const, valign: 'top' as const, fillColor: [248, 250, 252], textColor: [15, 23, 42] } 
      },
      { 
        content: cleanMarkdownForPDF(phase.starter), 
        styles: { valign: 'top' as const, textColor: [30, 41, 59] } 
      },
      { 
        content: mainContent, 
        styles: { valign: 'top' as const, textColor: [30, 41, 59] } 
      },
      { 
        content: plenaryContent, 
        styles: { valign: 'top' as const, textColor: [30, 41, 59] } 
      }
    ];
  });

  // ==========================================
  // TABLE 2: 3-PHASE INSTRUCTIONAL DELIVERY
  // ==========================================
  // Strict 4-column widths summing to exactly contentWidth (186mm)
  autoTable(doc, {
    startY: finalYTable1,
    margin: { top: 14, bottom: 16, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    pageBreak: 'auto',
    rowPageBreak: 'auto',
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 44 },
      2: { cellWidth: 76 },
      3: { cellWidth: 42 },
    },
    head: [[
      { content: 'DAY', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' } },
      { content: 'Phase 1: Starter\n(preparing the brain for learning):', styles: { halign: 'left', fontStyle: 'bold' } },
      { content: 'Phase 2: Main\n(new learning including assessment):', styles: { halign: 'left', fontStyle: 'bold' } },
      { content: 'Phase 3:\nPlenary / Reflections:', styles: { halign: 'left', fontStyle: 'bold' } }
    ]],
    body: table2BodyRows,
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 7.8,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      cellPadding: 2.5,
      textColor: [15, 23, 42],
      overflow: 'linebreak',
    },
  });

  // ==========================================
  // TEACHER & HEADTEACHER SIGNATURE / ENDORSEMENT SECTION (GES ADMINISTRATIVE REQUIREMENT)
  // ==========================================
  const finalYTable2 = (doc as any).lastAutoTable.finalY || finalYTable1 + 40;
  
  // Check remaining space on the last page; if less than 32mm needed for signature block, add a new page
  const requiredSignatureHeight = 32;
  const bottomFooterReserve = 14;
  let didAddPageForSign = false;
  if (finalYTable2 + requiredSignatureHeight + bottomFooterReserve > pageHeight) {
    doc.addPage();
    didAddPageForSign = true;
  }

  const signBlockStartY = didAddPageForSign ? 16 : finalYTable2 + 6;

  autoTable(doc, {
    startY: signBlockStartY,
    margin: { top: 14, bottom: 16, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    pageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: contentWidth / 2 },
      1: { cellWidth: contentWidth / 2 },
    },
    head: [[
      { 
        content: 'TEACHER DECLARATION / SUBMISSION', 
        styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } 
      },
      { 
        content: 'HEADTEACHER / SUPERVISOR VETTING & ENDORSEMENT', 
        styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } 
      }
    ]],
    body: [[
      {
        content: `Teacher's Name: ................................................................\n\nSignature: ........................................... Date: ......................\n\nRemarks: [  ] Submitted on Time    [  ] Revision Required`,
        styles: { fontSize: 7.5, cellPadding: 3, textColor: [30, 41, 59] }
      },
      {
        content: `Headteacher/Supervisor: .................................................\n\nSignature / Stamp: ............................ Date: ......................\n\nStatus: [  ] Approved for Delivery    [  ] Inspected & Monitored`,
        styles: { fontSize: 7.5, cellPadding: 3, textColor: [30, 41, 59] }
      }
    ]],
    headStyles: {
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      cellPadding: 2.5,
    },
    bodyStyles: {
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      cellPadding: 3,
    }
  });

  // ==========================================
  // UNIFIED MULTI-PAGE HEADERS & FOOTERS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subsequent pages top header (pages 2+)
    if (i > 1) {
      doc.setFillColor(0, 28, 61);
      doc.rect(0, 0, pageWidth, 9, 'F');
      doc.setFillColor(252, 209, 22);
      doc.rect(0, 9, pageWidth, 0.8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`TeachSmartGH - ${officialTitle} (${displaySubject} - ${className})`, leftMargin, 6);
      doc.setTextColor(226, 232, 240);
      doc.text(`Week Ending: ${weekEnding}`, pageWidth - rightMargin, 6, { align: 'right' });
    }

    // Bottom Footer (all pages)
    const footerY = pageHeight - 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, footerY - 2.5, pageWidth - rightMargin, footerY - 2.5);

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 28, 61);
    doc.text('TeachSmartGH', leftMargin, footerY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('  |  Official GES & NaCCA Standard Lesson Plan Format  |  Catalyst Creative', leftMargin + 21, footerY);

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - rightMargin,
      footerY,
      { align: 'right' }
    );
  }

  return doc;
}

/**
 * Specialized Kindergarten Daily Lesson Plan PDF Generator
 * Adheres strictly to the Nanumba South District Education Directorate
 * and NaCCA Early Childhood Education (KG1 & KG2) Universal Timetable standards.
 */
export function exportKGLessonPlanToPDF(data: LessonPlanExportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 12;
  const rightMargin = 12;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 186mm

  const className = (data.class || data.level || 'KG 1').toUpperCase();
  const classSize = data.classSize || '35';
  const weekEnding = data.weekEnding || new Date().toISOString().split('T')[0];
  const day = data.day || 'Monday';
  const date = data.date || weekEnding;
  const weekNumber = data.weekNumber || data.week || '1';
  const officialTitle = `KINDERGARTEN DAILY LESSON PLAN - WEEK ${weekNumber}`;

  const strand = data.strand || 'All About Me';
  const subStrand = data.subStrand || 'I Am a Special Child';
  const csCode = data.contentStandardCode || data.contentStandard || 'K1.1.1.1';
  const csText = data.contentStandard || csCode;
  const indCode = data.indicatorCode || data.indicator || 'K1.1.1.1.1';
  const indText = data.indicator || indCode;
  const lessonFocus = data.lessonFocus || data.title || 'Parts of My Body: Head, Hands and Feet';
  const performanceIndicator = data.performanceIndicator || data.mainObjective || 'Learners can touch and name body parts during a play song.';
  const coreCompetencies = cleanMarkdownForPDF(data.coreCompetencies) || 'Communication and Collaboration (CC), Personal Development (PL)';
  const keyWords = cleanMarkdownForPDF(data.keyWords) || 'Head, Eyes, Nose, Hands, Special';
  const tlrs = cleanMarkdownForPDF(data.tlrs) || 'Body chart, Mirror, Soft toys, Flashcards, Bottle caps';
  const references = cleanMarkdownForPDF(data.references) || 'NaCCA Kindergarten Curriculum Guide (KG1-KG2)';

  // ==========================================
  // TOP BRANDING BANNER (Page 1)
  // ==========================================
  doc.setFillColor(0, 28, 61); // Deep Navy Blue
  doc.rect(0, 0, pageWidth, 16.5, 'F');

  // Gold & Green Trim Ribbon
  doc.setFillColor(252, 209, 22); // Ghana Gold
  doc.rect(0, 16.5, pageWidth, 1.2, 'F');
  doc.setFillColor(0, 107, 63); // Ghana Green
  doc.rect(0, 17.7, pageWidth, 0.6, 'F');

  // Brand Name & Tagline (Left)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('TeachSmart', leftMargin, 9.5);
  doc.setTextColor(252, 209, 22);
  doc.text('GH', leftMargin + 25.5, 9.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('AI-Powered Early Childhood Teaching  |  Catalyst Creative', leftMargin, 14);

  // Right Side: Standard Badge
  doc.setFillColor(0, 107, 63);
  doc.roundedRect(pageWidth - rightMargin - 62, 4, 62, 9.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Designed for NaCCA/GES ECE Alignment', pageWidth - rightMargin - 31, 8.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('Universal KG Timetable Model', pageWidth - rightMargin - 31, 12, { align: 'center' });

  // ==========================================
  // NOTEBOOK HEADER ROW
  // ==========================================
  const topMargin = 25.5;

  doc.setFontSize(12.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(officialTitle, pageWidth / 2, topMargin - 2.5, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('INTEGRATED CURRICULUM (KG 1 & KG 2)  •  PLAY-BASED & LEARNER-CENTRED PEDAGOGY', pageWidth / 2, topMargin + 2, { align: 'center' });

  // ==========================================
  // TABLE 1: KG METADATA & CURRICULUM COMPONENTS
  // ==========================================
  const startTableY = topMargin + 5.5;

  autoTable(doc, {
    startY: startTableY,
    margin: { top: 14, bottom: 15, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 44 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
      4: { cellWidth: 40 },
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      textColor: [15, 23, 42],
      font: 'helvetica',
      overflow: 'linebreak',
    },
    body: [
      // Row 1: Day | Date | Class | Class Size | Week Ending
      [
        { content: `DAY:\n${day}`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `DATE:\n${date}`, styles: { fontStyle: 'bold' } },
        { content: `CLASS:\n${className}`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `CLASS SIZE:\n${classSize}`, styles: { fontStyle: 'bold' } },
        { content: `WEEK ENDING:\n${weekEnding}`, styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
      ],
      // Row 2: Strand | Sub-strand
      [
        { colSpan: 2, content: `STRAND:\n${strand}`, styles: { fontStyle: 'bold' } },
        { colSpan: 3, content: `SUB-STRAND:\n${subStrand}`, styles: { fontStyle: 'bold' } }
      ],
      // Row 3: Content Standard | Indicator
      [
        { colSpan: 2, content: `CONTENT STANDARD (CODE & TEXT):\n${csText}`, styles: { fontStyle: 'bold' } },
        { colSpan: 3, content: `INDICATOR (CODE & TEXT):\n${indText}`, styles: { fontStyle: 'bold' } }
      ],
      // Row 4: Lesson Focus (Full Width)
      [
        { 
          colSpan: 5, 
          content: `LESSON FOCUS / THEMATIC TOPIC:\n${lessonFocus}`, 
          styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } 
        }
      ],
      // Row 5: Performance Indicator (Full Width)
      [
        { 
          colSpan: 5, 
          content: `PERFORMANCE INDICATOR (Observable Learner Demonstration):\n${performanceIndicator}`, 
          styles: { fontStyle: 'bold' } 
        }
      ],
      // Row 6: Core Competencies | Key Vocabulary
      [
        { colSpan: 3, content: `CORE COMPETENCIES & VALUES:\n${coreCompetencies}`, styles: { fontStyle: 'bold' } },
        { colSpan: 2, content: `KEY VOCABULARY / WORDS:\n${keyWords}`, styles: { fontStyle: 'bold' } }
      ],
      // Row 7: TLRs | References
      [
        { colSpan: 3, content: `TEACHING & LEARNING RESOURCES (TLRs - Local Materials):\n${tlrs}`, styles: { fontStyle: 'bold' } },
        { colSpan: 2, content: `REFERENCES:\n${references}`, styles: { fontStyle: 'bold' } }
      ],
    ],
  });

  const finalYTable1 = (doc as any).lastAutoTable.finalY || 105;

  // ==========================================
  // TABLE 2: UNIVERSAL KG TIMETABLE DELIVERY TABLE
  // ==========================================
  const blocksToUse = reconcileKGBlocks(data.kgBlocks || (data as any).blocks, day);

  const table2BodyRows: RowInput[] = blocksToUse.map((blk: any, idx: number) => {
    const periodDisplay = blk.periodNumber ? `Period ${blk.periodNumber}` : `Period ${idx + 1}`;
    const rawBlockName = blk.blockName || periodDisplay;
    const cleanBlockName = rawBlockName
      .replace(/\(?\b\d{1,2}:\d{2}\s*(-|–|to)\s*\d{1,2}:\d{2}\b\)?/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const durationDisplay = getSupportedKGBlockDuration(cleanBlockName);
    const timeAndBlock = `${cleanBlockName}${durationDisplay ? `\n(${durationDisplay})` : ''}`;
    
    let activitiesText = '';
    if (blk.isInstructional === false && !blk.teacherActivities && !blk.learnerActivities) {
      activitiesText = cleanMarkdownForPDF(blk.defaultDescription || blk.activities || 'Routine school activity.');
    } else if (blk.teacherActivities || blk.learnerActivities) {
      activitiesText = `• Teacher Facilitation: ${cleanMarkdownForPDF(blk.teacherActivities || '')}\n\n• Learner Play Activities: ${cleanMarkdownForPDF(blk.learnerActivities || '')}`;
      if (blk.playBasedTechnique) {
        activitiesText += `\n\n• Play Technique: ${cleanMarkdownForPDF(blk.playBasedTechnique)}`;
      }
    } else {
      activitiesText = cleanMarkdownForPDF(blk.activities || blk.description || 'Play-based interactive engagement.');
    }

    const tlrText = cleanMarkdownForPDF(blk.resources || blk.tlrs || 'Local materials');
    const compText = cleanMarkdownForPDF(blk.assessment || blk.coreCompetency || blk.formativeCheck || 'Active Observation');

    return [
      {
        content: timeAndBlock,
        styles: { fontStyle: 'bold', halign: 'center', fillColor: [248, 250, 252], valign: 'top' }
      },
      {
        content: activitiesText,
        styles: { fontStyle: 'normal', valign: 'top', halign: 'left' }
      },
      {
        content: tlrText,
        styles: { fontStyle: 'normal', valign: 'top', halign: 'left' }
      },
      {
        content: compText,
        styles: { fontStyle: 'normal', valign: 'top', halign: 'left' }
      }
    ];
  });

  autoTable(doc, {
    startY: finalYTable1 + 4,
    margin: { top: 14, bottom: 15, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    showHead: 'everyPage',
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 34 },
      1: { cellWidth: 88 },
      2: { cellWidth: 32 },
      3: { cellWidth: 32 },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      textColor: [15, 23, 42],
      font: 'helvetica',
      overflow: 'linebreak',
    },
    head: [[
      { content: 'TIMETABLE BLOCK & TIME', styles: { halign: 'center', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } },
      { content: 'TEACHING & LEARNING ACTIVITIES (PLAY-BASED & LEARNER-CENTRED)', styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } },
      { content: 'RESOURCES / TLMs', styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } },
      { content: 'ASSESSMENT', styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } },
    ]],
    body: table2BodyRows,
  });

  const finalYTable2 = (doc as any).lastAutoTable.finalY || 180;

  // ==========================================
  // POST-LESSON REFLECTION & EVALUATION
  // ==========================================
  const assessmentEvidence = cleanMarkdownForPDF((data as any).assessmentEvidence) || 'Evidence gathered via direct observation and manipulative handling during activities.';
  const learnersNeedingSupport = cleanMarkdownForPDF((data as any).learnersNeedingSupport) || 'Targeted multi-sensory support for learners experiencing difficulties.';
  const teacherReflection = cleanMarkdownForPDF(data.teacherReflection || data.remarks) || '1. Did the play-based manipulatives effectively engage learners?\n2. Which sounds/concepts need reinforcement tomorrow?\n3. What adjustments are needed?';

  autoTable(doc, {
    startY: finalYTable2 + 3.5,
    margin: { top: 14, bottom: 15, left: leftMargin, right: rightMargin },
    tableWidth: contentWidth,
    theme: 'grid',
    showHead: 'everyPage',
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: contentWidth },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.8,
      lineColor: [30, 41, 59],
      lineWidth: 0.35,
      textColor: [15, 23, 42],
      font: 'helvetica',
      overflow: 'linebreak',
    },
    head: [[
      { content: 'POST-LESSON REFLECTION & EVALUATION', styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8 } },
    ]],
    body: [[
      {
        content: `• Assessment Evidence:\n${assessmentEvidence}\n\n• Learners Needing Support:\n${learnersNeedingSupport}\n\n• Teacher Reflection Prompts:\n${teacherReflection}`,
        styles: { fontSize: 7.2, cellPadding: 3, textColor: [30, 41, 59] }
      }
    ]],
  });

  // Multi-page header and footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (i > 1) {
      doc.setFillColor(0, 28, 61);
      doc.rect(0, 0, pageWidth, 9, 'F');
      doc.setFillColor(252, 209, 22);
      doc.rect(0, 9, pageWidth, 0.8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`TeachSmartGH - ${officialTitle} (${className})`, leftMargin, 6);
      doc.setTextColor(226, 232, 240);
      doc.text(`Week Ending: ${weekEnding}`, pageWidth - rightMargin, 6, { align: 'right' });
    }

    const footerY = pageHeight - 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, footerY - 2.5, pageWidth - rightMargin, footerY - 2.5);

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 28, 61);
    doc.text('TeachSmartGH', leftMargin, footerY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('  |  TeachSmartGH Kindergarten Daily Lesson Plan — Designed to Align with NaCCA/GES Requirements  |  Catalyst Creative', leftMargin + 21, footerY);

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - rightMargin,
      footerY,
      { align: 'right' }
    );
  }

  return doc;
}

import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { LessonPlan } from '../types';
import { registerUnicodeFonts } from './fonts/unicodeFonts';
import { buildMultiDayLessonPhases } from './multiDayParser';
import { formatWeekLessonPlanTitle } from './utils';
import { extractWeekNumber, extractLessonNumber, generateCurriculumKey, getLessonRecordTimestamp } from './bulkExportHelpers';

export interface BulkTermPdfExportOptions {
  academicYear: string;
  term: string;
  classLevel: string;
  subject: string;
  teacherName?: string;
  schoolName?: string;
  district?: string;
  lessons: LessonPlan[];
}

function cleanMarkdownForPDF(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Builds and downloads the Bulk Term Lesson Plan Book as a PDF
 */
export function exportBulkTermLessonPlansToPDF(options: BulkTermPdfExportOptions): jsPDF {
  const { lessons, academicYear, term, classLevel, subject, teacherName, schoolName, district } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const fontName = registerUnicodeFonts(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 12;
  const rightMargin = 12;
  const contentWidth = pageWidth - leftMargin - rightMargin;

  // Deduplicate and sort lessons using robust curriculum keys and timestamps
  const curriculumMap = new Map<string, LessonPlan>();

  for (const l of lessons) {
    const key = generateCurriculumKey(l);
    if (!curriculumMap.has(key)) {
      curriculumMap.set(key, l);
    } else {
      const existing = curriculumMap.get(key)!;
      const existingTs = getLessonRecordTimestamp(existing);
      const currentTs = getLessonRecordTimestamp(l);
      if (currentTs > existingTs) {
        curriculumMap.set(key, l);
      }
    }
  }

  const deduplicatedLessons = Array.from(curriculumMap.values());

  deduplicatedLessons.sort((a, b) => {
    const wA = extractWeekNumber(a);
    const wB = extractWeekNumber(b);
    if (wA !== wB) return wA - wB;
    const lA = extractLessonNumber(a);
    const lB = extractLessonNumber(b);
    return lA - lB;
  });

  const displaySubject = subject.toUpperCase();
  const displayClass = classLevel.toUpperCase();
  const displayTerm = term.toUpperCase();
  const displayTeacher = (teacherName || 'Facilitator').toUpperCase();
  const displaySchool = (schoolName || 'Ghana Basic School').toUpperCase();
  const displayDistrict = (district || 'GES District Education Directorate').toUpperCase();

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  
  // Top Header Banner (Deep Navy)
  doc.setFillColor(0, 28, 61); // Navy Dark
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold Accent Line
  doc.setFillColor(252, 209, 22); // Ghana Gold
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Brand Titles
  doc.setFont(fontName, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('TEACHSMART', leftMargin + 4, 18);

  doc.setTextColor(252, 209, 22);
  doc.text('GH', leftMargin + 50, 18);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text('PRINT  |  TERM LESSON PLAN BOOK', leftMargin + 62, 18);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('CATALYST CREATIVE  •  NaCCA STANDARD-BASED CURRICULUM ALIGNED', leftMargin + 4, 28);

  // Central Title
  let currentY = 66;
  doc.setFont(fontName, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 28, 61);
  doc.text('TERM LESSON PLAN BOOK', pageWidth / 2, currentY, { align: 'center' });

  currentY += 10;
  doc.setFont(fontName, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 107, 63); // Ghana Green
  doc.text(`${displayTerm}  •  ${academicYear} ACADEMIC SESSION`, pageWidth / 2, currentY, { align: 'center' });

  currentY += 16;

  // Metadata Card Table
  const metaRows: RowInput[] = [
    [{ content: 'SUBJECT / DISCIPLINE', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [0, 28, 61] } }, { content: displaySubject, styles: { fontStyle: 'bold', textColor: [0, 28, 61] } }],
    [{ content: 'CLASS / LEVEL', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [0, 28, 61] } }, { content: displayClass, styles: { fontStyle: 'bold', textColor: [0, 28, 61] } }],
    [{ content: 'TEACHER / FACILITATOR', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [0, 28, 61] } }, { content: displayTeacher, styles: { fontStyle: 'bold', textColor: [0, 28, 61] } }],
    [{ content: 'SCHOOL & DISTRICT', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [0, 28, 61] } }, { content: `${displaySchool}\n${displayDistrict}`, styles: { textColor: [30, 41, 59] } }],
    [{ content: 'LESSONS INCLUDED', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], textColor: [0, 28, 61] } }, { content: `${deduplicatedLessons.length} Lesson Plans compiled in sequential curriculum order`, styles: { fontStyle: 'bold', textColor: [0, 107, 63] } }],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: leftMargin + 10, right: rightMargin + 10 },
    theme: 'grid',
    body: metaRows,
    styles: {
      font: fontName,
      fontSize: 10,
      cellPadding: 4,
      lineColor: [203, 213, 225],
      lineWidth: 0.2
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: contentWidth - 70 }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Sign-off Box
  autoTable(doc, {
    startY: currentY,
    margin: { left: leftMargin + 10, right: rightMargin + 10 },
    theme: 'grid',
    body: [
      [
        {
          content: 'PREPARED BY (FACILITATOR):\n\nSignature: ........................................\nDate: ................................................',
          styles: { textColor: [30, 41, 59], fontSize: 9 }
        },
        {
          content: 'VETTED & APPROVED BY (HEADTEACHER):\n\nStamp & Sign: .....................................\nDate: ................................................',
          styles: { textColor: [30, 41, 59], fontSize: 9 }
        }
      ]
    ],
    styles: {
      font: fontName,
      cellPadding: 4.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.2
    }
  });

  // Disclaimer / Adaptation Notice Box
  const disclaimerY = (doc as any).lastAutoTable.finalY + 8;
  autoTable(doc, {
    startY: disclaimerY,
    margin: { left: leftMargin + 10, right: rightMargin + 10 },
    theme: 'plain',
    body: [
      [
        {
          content: 'TEACHER ADAPTATION NOTICE & CURRICULUM DISCLAIMER:\nThis material was generated and formatted using TeachSmartGH. Teachers should review and adapt the content to the needs of their learners before classroom use.',
          styles: { 
            fontSize: 7.5, 
            textColor: [71, 85, 105], 
            fontStyle: 'italic',
            fillColor: [248, 250, 252],
            lineColor: [203, 213, 225],
            lineWidth: 0.2,
            cellPadding: 3.5
          }
        }
      ]
    ]
  });

  // ==========================================
  // PAGE 2: CURRICULUM SYNOPSIS / TABLE OF CONTENTS
  // ==========================================
  doc.addPage();
  
  // Header on Page 2
  doc.setFillColor(0, 28, 61);
  doc.rect(0, 0, pageWidth, 18, 'F');
  doc.setFont(fontName, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`TEACHSMARTGH PRINT  |  ${displaySubject} (${displayClass})  |  ${displayTerm}`, leftMargin, 12);

  doc.setFont(fontName, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 28, 61);
  doc.text('TERM CURRICULUM SYNOPSIS & TABLE OF CONTENTS', leftMargin, 30);

  const tocRows: RowInput[] = deduplicatedLessons.map((l, i) => {
    const wNum = extractWeekNumber(l);
    return [
      `Week ${wNum}`,
      `${l.strand || 'General Strand'}\n${l.subStrand || 'General Sub-strand'}`,
      l.indicatorCode || l.indicator || `Code ${i + 1}`,
      cleanMarkdownForPDF(l.performanceIndicator || l.lessonFocus || l.title || 'Curriculum Lesson Plan')
    ];
  });

  autoTable(doc, {
    startY: 36,
    margin: { left: leftMargin, right: rightMargin },
    theme: 'striped',
    head: [['WEEK', 'STRAND & SUB-STRAND', 'INDICATOR CODE', 'LESSON TOPIC / PERFORMANCE OBJECTIVE']],
    body: tocRows,
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    styles: {
      font: fontName,
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.15
    },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 50 },
      2: { cellWidth: 32, fontStyle: 'bold', textColor: [0, 107, 63] },
      3: { cellWidth: contentWidth - 100 }
    }
  });

  // ==========================================
  // PAGES 3+: LESSON PLANS
  // ==========================================
  deduplicatedLessons.forEach((plan, idx) => {
    doc.addPage();

    const weekNumStr = plan.weekNumber || (plan.week ? plan.week.replace(/[^0-9]/g, '') : `${idx + 1}`);
    const lessonTitle = plan.title || formatWeekLessonPlanTitle(weekNumStr);
    const duration = plan.duration || '60 minutes';
    const period = plan.period || '1 & 2';
    const weekEnding = plan.weekEnding || plan.date || 'End of Week';
    const classSize = plan.classSize || '40';
    const indicatorCodes = plan.indicatorCode || plan.indicator || 'N/A';
    const contentStandardCode = plan.contentStandardCode || plan.contentStandard || 'N/A';

    // Running Header
    doc.setFillColor(0, 28, 61);
    doc.rect(0, 0, pageWidth, 14, 'F');
    doc.setFont(fontName, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`TEACHSMARTGH PRINT  |  ${displaySubject} (${displayClass})  |  ${displayTerm}`, leftMargin, 9.5);

    // Week Title Bar
    doc.setFont(fontName, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 28, 61);
    doc.text(`WEEK ${weekNumStr.toUpperCase()} — LESSON PLAN (${idx + 1} of ${deduplicatedLessons.length})`, leftMargin, 22);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`TOPIC: ${plan.strand || ''} - ${plan.subStrand || ''}`, leftMargin, 27);

    // Table 1: Metadata Grid
    const table1Body: RowInput[] = [
      [
        { content: `WEEK ENDING: ${weekEnding}`, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: [252, 209, 22] } },
        { content: `CLASS: ${displayClass}`, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: [255, 255, 255] } },
        { content: `SIZE: ${classSize}`, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: [255, 255, 255] } },
        { content: `PERIOD: ${period}`, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: [255, 255, 255] } },
        { content: `DURATION: ${duration}`, styles: { fontStyle: 'bold', fillColor: [15, 23, 42], textColor: [255, 255, 255] } },
      ],
      [
        { content: `STRAND:\n${cleanMarkdownForPDF(plan.strand)}`, colSpan: 2, styles: { fontStyle: 'bold' } },
        { content: `SUB-STRAND:\n${cleanMarkdownForPDF(plan.subStrand)}`, colSpan: 3, styles: { fontStyle: 'bold' } }
      ],
      [
        { content: `CONTENT STANDARD:\n[${contentStandardCode}] ${cleanMarkdownForPDF(plan.contentStandard)}`, colSpan: 2 },
        { content: `INDICATOR(S):\n[${indicatorCodes}] ${cleanMarkdownForPDF(plan.indicator)}`, colSpan: 3 }
      ],
      [
        { content: `PERFORMANCE INDICATOR / LESSON OBJECTIVE:\n${cleanMarkdownForPDF(plan.performanceIndicator || plan.lessonFocus)}`, colSpan: 5, styles: { fillColor: [248, 250, 252] } }
      ],
      [
        { content: `CORE COMPETENCIES:\n${cleanMarkdownForPDF(plan.coreCompetencies)}`, colSpan: 2 },
        { content: `KEY WORDS:\n${cleanMarkdownForPDF(plan.keyWords)}`, colSpan: 3 }
      ],
      [
        { content: `T.L.R.(S) & RESOURCES:\n${cleanMarkdownForPDF(plan.tlrs)}`, colSpan: 2 },
        { content: `REFERENCES:\n${cleanMarkdownForPDF(plan.references)}`, colSpan: 3 }
      ]
    ];

    autoTable(doc, {
      startY: 31,
      margin: { left: leftMargin, right: rightMargin },
      theme: 'grid',
      body: table1Body,
      styles: {
        font: fontName,
        fontSize: 7.5,
        cellPadding: 2,
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        textColor: [15, 23, 42]
      }
    });

    let currentLpY = (doc as any).lastAutoTable.finalY + 3;

    // Table 2: 3-Phase Delivery Table
    const dayPhases = buildMultiDayLessonPhases({
      day: plan.day || 'Monday',
      weekEnding: plan.weekEnding,
      duration: plan.duration,
      phase1: plan.phase1,
      phase2: plan.phase2,
      phase3: plan.phase3,
      differentiation: plan.differentiation
    });

    const phaseRows: RowInput[] = dayPhases.map(dp => {
      const p2Content = cleanMarkdownForPDF(dp.main) + (plan.assessment ? `\n\nASSESSMENT:\n${cleanMarkdownForPDF(plan.assessment)}` : '');
      return [
        `${dp.dayName.toUpperCase()}\n(${duration})`,
        cleanMarkdownForPDF(dp.starter),
        p2Content,
        cleanMarkdownForPDF(dp.plenary)
      ];
    });

    autoTable(doc, {
      startY: currentLpY,
      margin: { left: leftMargin, right: rightMargin },
      theme: 'grid',
      head: [['DAY / TIME', 'Phase 1: Starter\n(Preparing the Brain)', 'Phase 2: Main\n(New Learning & Assessment)', 'Phase 3: Plenary\n(Reflections & Wrap-up)']],
      body: phaseRows,
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'center'
      },
      styles: {
        font: fontName,
        fontSize: 7,
        cellPadding: 2,
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        textColor: [15, 23, 42]
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center', fontStyle: 'bold', fillColor: [248, 250, 252] },
        1: { cellWidth: 42 },
        2: { cellWidth: contentWidth - 94 },
        3: { cellWidth: 32 }
      }
    });

    currentLpY = (doc as any).lastAutoTable.finalY + 3;

    // Check if sign-off box fits, if not let it flow or auto-wrap
    if (currentLpY > pageHeight - 35) {
      doc.addPage();
      currentLpY = 20;
    }

    // Table 3: Reflection & Sign-off
    autoTable(doc, {
      startY: currentLpY,
      margin: { left: leftMargin, right: rightMargin },
      theme: 'grid',
      head: [["TEACHER'S SELF-REFLECTION", 'HEADTEACHER / SUPERVISOR REMARKS']],
      body: [
        [
          `${plan.teacherReflection || 'Lesson delivered effectively in accordance with NaCCA SBC competency standards.'}\n\nTeacher Signature: ....................................... Date: ...................`,
          `${plan.headteacherRemarks || 'Lesson plan approved. Ensure practical learner-centered activities are sustained.'}\n\nSupervisor Stamp & Sign: ............................. Date: ...................`
        ]
      ],
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [0, 28, 61],
        fontStyle: 'bold',
        fontSize: 7.5
      },
      styles: {
        font: fontName,
        fontSize: 7,
        cellPadding: 2,
        lineColor: [203, 213, 225],
        lineWidth: 0.15,
        textColor: [30, 41, 59]
      }
    });
  });

  // Add Page Numbers in Footer for all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `TeachSmartGH (Catalyst Creative) • NaCCA & GES Standard-Based Curriculum Preparation`,
      leftMargin,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - rightMargin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  const cleanSubject = subject.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = classLevel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanTerm = term.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `TeachSmartGH_Term_Lesson_Plan_Book_${cleanTerm}_${cleanSubject}_${cleanClass}.pdf`;

  doc.save(filename);
  return doc;
}

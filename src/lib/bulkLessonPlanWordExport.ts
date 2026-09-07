import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType, 
  HeadingLevel, 
  Header, 
  Footer, 
  PageOrientation, 
  ShadingType,
  VerticalAlign,
  PageNumber
} from 'docx';
import { toast } from 'react-hot-toast';
import { LessonPlan } from '../types';
import { buildMultiDayLessonPhases } from './multiDayParser';
import { formatWeekLessonPlanTitle } from './utils';
import { extractWeekNumber, extractLessonNumber, generateCurriculumKey, getLessonRecordTimestamp } from './bulkExportHelpers';

// TeachSmartGH Brand Color Palette (Hex values without '#' for docx compatibility)
const BRAND_COLORS = {
  NAVY_DARK: '001C3D',
  NAVY_HEADER: '0F172A',
  GHANA_GREEN: '006B3F',
  GHANA_GOLD: 'FCD116',
  GHANA_RED: 'CE1126',
  SLATE_MUTED: '64748B',
  SLATE_LIGHT_BG: 'F8FAFC',
  SLATE_HEADER_BG: 'F1F5F9',
  SLATE_BORDER: '1E293B',
  BORDER_SUBTLE: 'CBD5E1',
  WHITE: 'FFFFFF',
  TEXT_MAIN: '0F172A',
  TEXT_BODY: '1E293B',
  TEXT_MUTED: '475569'
};

const table1CellBorder = {
  top: { style: BorderStyle.SINGLE, size: 8, color: BRAND_COLORS.BORDER_SUBTLE },
  bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND_COLORS.BORDER_SUBTLE },
  left: { style: BorderStyle.SINGLE, size: 8, color: BRAND_COLORS.BORDER_SUBTLE },
  right: { style: BorderStyle.SINGLE, size: 8, color: BRAND_COLORS.BORDER_SUBTLE },
};

export interface BulkTermExportOptions {
  academicYear: string;
  term: string;
  classLevel: string;
  subject: string;
  teacherName?: string;
  schoolName?: string;
  district?: string;
  lessons: LessonPlan[];
}

/**
 * Splits inline markdown text into formatted TextRun array (handling bold, italic, code)
 */
function createFormattedRuns(text: string, defaultColor = BRAND_COLORS.TEXT_MAIN, defaultSize = 19): TextRun[] {
  if (!text) return [new TextRun({ text: '', size: defaultSize })];

  const runs: TextRun[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|__.*?__|`.*?`|[^*_`]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const part = match[0];
    if (!part) continue;

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      runs.push(new TextRun({
        text: part.slice(2, -2),
        bold: true,
        color: defaultColor,
        size: defaultSize,
        font: 'Calibri'
      }));
    } else if (part.startsWith('__') && part.endsWith('__') && part.length > 4) {
      runs.push(new TextRun({
        text: part.slice(2, -2),
        bold: true,
        color: defaultColor,
        size: defaultSize,
        font: 'Calibri'
      }));
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      runs.push(new TextRun({
        text: part.slice(1, -1),
        italics: true,
        color: defaultColor,
        size: defaultSize,
        font: 'Calibri'
      }));
    } else {
      runs.push(new TextRun({
        text: part,
        color: defaultColor,
        size: defaultSize,
        font: 'Calibri'
      }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text, color: defaultColor, size: defaultSize, font: 'Calibri' })];
}

/**
 * Creates multi-line paragraphs with bullet or plain text support
 */
function createFormattedParagraphs(
  rawText: string | undefined | null, 
  defaultColor = BRAND_COLORS.TEXT_BODY, 
  fontSize = 18,
  alignment = AlignmentType.LEFT
): Paragraph[] {
  if (!rawText) {
    return [new Paragraph({ children: [new TextRun({ text: 'N/A', size: fontSize, color: BRAND_COLORS.TEXT_MUTED })] })];
  }

  const lines = rawText.split('\n');
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (/^[-*•+]\s+/.test(trimmed)) {
      const cleanItem = trimmed.replace(/^[-*•+]\s+/, '');
      paragraphs.push(new Paragraph({
        alignment,
        spacing: { before: 20, after: 30 },
        bullet: { level: 0 },
        children: createFormattedRuns(cleanItem, defaultColor, fontSize)
      }));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
      if (numMatch) {
        paragraphs.push(new Paragraph({
          alignment,
          spacing: { before: 20, after: 30 },
          children: [
            new TextRun({ text: numMatch[1] + ' ', bold: true, color: defaultColor, size: fontSize, font: 'Calibri' }),
            ...createFormattedRuns(numMatch[2], defaultColor, fontSize)
          ]
        }));
      } else {
        paragraphs.push(new Paragraph({
          alignment,
          spacing: { before: 20, after: 30 },
          children: createFormattedRuns(trimmed, defaultColor, fontSize)
        }));
      }
    } else {
      paragraphs.push(new Paragraph({
        alignment,
        spacing: { before: 20, after: 30 },
        children: createFormattedRuns(trimmed, defaultColor, fontSize)
      }));
    }
  }

  return paragraphs.length > 0 
    ? paragraphs 
    : [new Paragraph({ children: [new TextRun({ text: 'N/A', size: fontSize, color: BRAND_COLORS.TEXT_MUTED })] })];
}

/**
 * Downloads a generated Docx blob safely to the client browser
 */
async function downloadDocxBlob(doc: Document, filename: string, successMessage: string) {
  try {
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast.success(successMessage);
  } catch (error) {
    console.error('Docx generation error:', error);
    toast.error('Failed to export Word document. Please try again.');
    throw error;
  }
}

/**
 * Build Single Lesson Plan Tables for the Book
 */
function buildLessonPlanSection(plan: LessonPlan, index: number, total: number): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  const weekNumStr = plan.weekNumber || (plan.week ? plan.week.replace(/[^0-9]/g, '') : `${index + 1}`);
  const lessonTitle = plan.title || formatWeekLessonPlanTitle(weekNumStr);
  const displaySubject = plan.subject || 'GENERAL SUBJECT';
  const className = plan.class || plan.level || 'Basic Class';
  const classSize = plan.classSize || '40';
  const duration = plan.duration || '60 minutes';
  const period = plan.period || '1 & 2';
  const weekEnding = plan.weekEnding || plan.date || 'End of Week';
  const lessonNumber = plan.lesson || plan.lessonNumber || '1 of 3';

  // Section Banner / Heading
  elements.push(
    new Paragraph({
      pageBreakBefore: index > 0, // Fresh page for each subsequent lesson
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: `WEEK ${weekNumStr.toUpperCase()} — LESSON PLAN (${index + 1} of ${total})`,
          bold: true,
          size: 24,
          color: BRAND_COLORS.NAVY_DARK,
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 100 },
      children: [
        new TextRun({ text: 'SUBJECT: ', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${displaySubject}    |    `, size: 16, color: BRAND_COLORS.TEXT_MAIN }),
        new TextRun({ text: 'CLASS: ', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${className}    |    `, size: 16, color: BRAND_COLORS.TEXT_MAIN }),
        new TextRun({ text: 'TOPIC/FOCUS: ', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${plan.strand} - ${plan.subStrand}`, size: 16, color: BRAND_COLORS.TEXT_MAIN }),
      ]
    })
  );

  // Table 1: Metadata & Curriculum Grid
  const indicatorCodes = plan.indicatorCode || plan.indicator || 'N/A';
  const contentStandardCode = plan.contentStandardCode || plan.contentStandard || 'N/A';

  const table1Rows: TableRow[] = [
    // Row 1: Header (Week Ending, Class, Class Size, Period, Duration)
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'WEEK ENDING:', bold: true, size: 15, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                new TextRun({ text: `\n${weekEnding}`, size: 16, color: BRAND_COLORS.GHANA_GOLD, bold: true, font: 'Calibri' })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'CLASS:', bold: true, size: 15, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                new TextRun({ text: `\n${className}`, size: 16, color: BRAND_COLORS.WHITE, bold: true, font: 'Calibri' })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'SIZE:', bold: true, size: 15, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                new TextRun({ text: `\n${classSize}`, size: 16, color: BRAND_COLORS.WHITE, bold: true, font: 'Calibri' })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'PERIOD:', bold: true, size: 15, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                new TextRun({ text: `\n${period}`, size: 16, color: BRAND_COLORS.WHITE, bold: true, font: 'Calibri' })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'DURATION:', bold: true, size: 15, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                new TextRun({ text: `\n${duration}`, size: 16, color: BRAND_COLORS.WHITE, bold: true, font: 'Calibri' })
              ]
            })
          ]
        }),
      ]
    }),
    // Row 2: Strand & Sub-strand
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'STRAND:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.strand, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'SUB-STRAND:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.subStrand, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    }),
    // Row 3: Content Standard & Indicator
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'CONTENT STANDARD:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `[${contentStandardCode}] `, bold: true, size: 16, color: BRAND_COLORS.GHANA_GREEN }),
                new TextRun({ text: plan.contentStandard || plan.contentStandardCode || '', size: 16, color: BRAND_COLORS.TEXT_MAIN })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'INDICATOR(S):', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `[${indicatorCodes}] `, bold: true, size: 16, color: BRAND_COLORS.GHANA_GREEN }),
                new TextRun({ text: plan.indicator || '', size: 16, color: BRAND_COLORS.TEXT_MAIN })
              ]
            })
          ]
        })
      ]
    }),
    // Row 4: Performance Indicator / Lesson Focus
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 5,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'PERFORMANCE INDICATOR / LESSON OBJECTIVE:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.performanceIndicator || plan.lessonFocus, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    }),
    // Row 5: Core Competencies | Key Words
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'CORE COMPETENCIES:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.coreCompetencies, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'KEY WORDS:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.keyWords, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    }),
    // Row 6: TLRs | References
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'T.L.R.(S) & RESOURCES:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.tlrs, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'CURRICULUM REFERENCES:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(plan.references, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    })
  ];

  const table1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: table1Rows
  });
  elements.push(table1);
  elements.push(new Paragraph({ spacing: { after: 100 } }));

  // Table 2: 3-Phase Instructional Delivery Table
  const dayPhases = buildMultiDayLessonPhases({
    day: plan.day || 'Monday',
    weekEnding: plan.weekEnding,
    duration: plan.duration,
    phase1: plan.phase1,
    phase2: plan.phase2,
    phase3: plan.phase3,
    differentiation: plan.differentiation
  });

  const table2HeaderRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'DAY / TIME', bold: true, size: 16, color: BRAND_COLORS.WHITE })]
          })
        ]
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 1: Starter\n', bold: true, size: 16, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: '(preparing the brain for learning)', size: 13, color: 'CBD5E1' })
            ]
          })
        ]
      }),
      new TableCell({
        width: { size: 42, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 2: Main\n', bold: true, size: 16, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: '(new learning including assessment)', size: 13, color: 'CBD5E1' })
            ]
          })
        ]
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 3: Plenary\n', bold: true, size: 16, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: '(learner reflection & wrap-up)', size: 13, color: 'CBD5E1' })
            ]
          })
        ]
      }),
    ]
  });

  const table2DataRows = dayPhases.map((dayPhase, dIdx) => {
    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 14, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: dIdx % 2 === 0 ? BRAND_COLORS.SLATE_LIGHT_BG : BRAND_COLORS.WHITE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 70, right: 70 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: dayPhase.dayName.toUpperCase(), bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: `\n${duration}`, size: 13, color: BRAND_COLORS.SLATE_MUTED })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: createFormattedParagraphs(dayPhase.starter, BRAND_COLORS.TEXT_BODY, 16)
        }),
        new TableCell({
          width: { size: 42, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: [
            ...createFormattedParagraphs(dayPhase.main, BRAND_COLORS.TEXT_BODY, 16),
            ...(plan.assessment ? [
              new Paragraph({
                spacing: { before: 80, after: 20 },
                children: [new TextRun({ text: 'ASSESSMENT / EMBEDDED EVALUATION:', bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK })]
              }),
              ...createFormattedParagraphs(plan.assessment, BRAND_COLORS.TEXT_BODY, 15)
            ] : [])
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: createFormattedParagraphs(dayPhase.plenary, BRAND_COLORS.TEXT_BODY, 16)
        })
      ]
    });
  });

  const table2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [table2HeaderRow, ...table2DataRows]
  });
  elements.push(table2);
  elements.push(new Paragraph({ spacing: { after: 100 } }));

  // Table 3: Reflection & Headteacher Endorsement
  const table3 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
            borders: table1CellBorder,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "TEACHER'S SELF-REFLECTION & EVALUATION", bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK })]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
            borders: table1CellBorder,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'HEADTEACHER / SUPERVISOR VETTING & REMARKS', bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK })]
              })
            ]
          })
        ]
      }),
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: table1CellBorder,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                spacing: { before: 30, after: 40 },
                children: [
                  new TextRun({ 
                    text: plan.teacherReflection || "Lesson delivered effectively in accordance with NaCCA SBC competency standards.", 
                    size: 14, 
                    color: BRAND_COLORS.TEXT_BODY,
                    italics: !plan.teacherReflection
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [
                  new TextRun({ text: "Teacher Signature: ............................. Date: ..................", size: 13, color: BRAND_COLORS.SLATE_MUTED })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: table1CellBorder,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                spacing: { before: 30, after: 40 },
                children: [
                  new TextRun({ 
                    text: plan.headteacherRemarks || "Lesson plan approved. Ensure practical learner-centered activities are sustained throughout delivery.", 
                    size: 14, 
                    color: BRAND_COLORS.TEXT_BODY,
                    italics: !plan.headteacherRemarks
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [
                  new TextRun({ text: "Supervisor Stamp & Sign: ...................... Date: ..................", size: 13, color: BRAND_COLORS.SLATE_MUTED })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
  elements.push(table3);
  elements.push(new Paragraph({ spacing: { after: 140 } }));

  return elements;
}

/**
 * Builds the Cover Page and Term Curriculum Table of Contents
 */
function buildFrontMatter(options: BulkTermExportOptions, sortedLessons: LessonPlan[]): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  const school = options.schoolName || 'Ghana Basic School';
  const teacher = options.teacherName || 'Facilitator';
  const district = options.district || 'GES District Education Directorate';
  const termName = options.term.toUpperCase();
  const yearName = options.academicYear;
  const subjectName = options.subject.toUpperCase();
  const className = options.classLevel.toUpperCase();

  // Cover Page Header Banner
  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_DARK },
              margins: { top: 180, bottom: 180, left: 240, right: 240 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 24, color: BRAND_COLORS.GHANA_GOLD },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 40 },
                  children: [
                    new TextRun({ text: 'TEACHSMART', bold: true, size: 32, color: BRAND_COLORS.WHITE, font: 'Calibri' }),
                    new TextRun({ text: 'GH', bold: true, size: 32, color: BRAND_COLORS.GHANA_GOLD, font: 'Calibri' }),
                    new TextRun({ text: '  PRINT', bold: true, size: 26, color: 'CBD5E1', font: 'Calibri' }),
                  ]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0 },
                  children: [
                    new TextRun({ text: 'CATALYST CREATIVE  •  NaCCA STANDARD-BASED CURRICULUM ALIGNED', size: 15, color: '94A3B8', font: 'Calibri' })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { before: 240, after: 80 } }),
    // Central Document Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: 'TERM LESSON PLAN BOOK',
          bold: true,
          size: 34,
          color: BRAND_COLORS.NAVY_DARK,
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 180 },
      children: [
        new TextRun({
          text: `${termName}  •  ${yearName} ACADEMIC SESSION`,
          bold: true,
          size: 22,
          color: BRAND_COLORS.GHANA_GREEN,
          font: 'Calibri'
        })
      ]
    })
  );

  // Cover Metadata Box Table
  const coverMetadataRows: TableRow[] = [
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'SUBJECT / DISCIPLINE', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: subjectName, bold: true, size: 18, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        })
      ]
    }),
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'CLASS / LEVEL', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: className, bold: true, size: 18, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        })
      ]
    }),
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'TEACHER / FACILITATOR', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: teacher, bold: true, size: 18, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        })
      ]
    }),
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'SCHOOL & DISTRICT', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `${school}\n`, bold: true, size: 17, color: BRAND_COLORS.TEXT_MAIN }),
                new TextRun({ text: district, size: 15, color: BRAND_COLORS.SLATE_MUTED })
              ]
            })
          ]
        })
      ]
    }),
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'TOTAL LESSONS INCLUDED', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `${sortedLessons.length} Lesson Plan(s) compiled across the term`, 
                  bold: true, 
                  size: 17, 
                  color: BRAND_COLORS.GHANA_GREEN 
                })
              ]
            })
          ]
        })
      ]
    })
  ];

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: coverMetadataRows
    }),
    new Paragraph({ spacing: { before: 180, after: 120 } }),
    // Endorsement Sign-off block
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: table1CellBorder,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 40 },
                  children: [new TextRun({ text: 'PREPARED BY (FACILITATOR):', bold: true, size: 14, color: BRAND_COLORS.NAVY_DARK })]
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [new TextRun({ text: `Signature: ........................................`, size: 14, color: BRAND_COLORS.SLATE_MUTED })]
                }),
                new Paragraph({
                  spacing: { before: 20, after: 0 },
                  children: [new TextRun({ text: `Date: ................................................`, size: 14, color: BRAND_COLORS.SLATE_MUTED })]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: table1CellBorder,
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 40 },
                  children: [new TextRun({ text: 'VETTED & APPROVED BY (HEADTEACHER):', bold: true, size: 14, color: BRAND_COLORS.NAVY_DARK })]
                }),
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [new TextRun({ text: `Stamp & Signature: .............................`, size: 14, color: BRAND_COLORS.SLATE_MUTED })]
                }),
                new Paragraph({
                  spacing: { before: 20, after: 0 },
                  children: [new TextRun({ text: `Date: ................................................`, size: 14, color: BRAND_COLORS.SLATE_MUTED })]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { before: 100, after: 60 } }),
    // Teacher Adaptation Notice & Curriculum Disclaimer Table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_LIGHT_BG },
              borders: table1CellBorder,
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 20 },
                  children: [
                    new TextRun({ 
                      text: 'TEACHER ADAPTATION NOTICE & CURRICULUM DISCLAIMER', 
                      bold: true, 
                      size: 13, 
                      color: BRAND_COLORS.NAVY_DARK 
                    })
                  ]
                }),
                new Paragraph({
                  spacing: { before: 0, after: 0 },
                  children: [
                    new TextRun({ 
                      text: 'This material was generated and formatted using TeachSmartGH. Teachers should review and adapt the content to the needs of their learners before classroom use.', 
                      italics: true, 
                      size: 14, 
                      color: BRAND_COLORS.TEXT_MUTED 
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { after: 120 } })
  );

  // Term Table of Contents / Curriculum Synopsis
  elements.push(
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: 'TERM CURRICULUM SYNOPSIS & TABLE OF CONTENTS',
          bold: true,
          size: 24,
          color: BRAND_COLORS.NAVY_DARK,
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: 'Sequential overview of all lessons and curriculum indicators compiled in this portfolio:',
          size: 16,
          color: BRAND_COLORS.TEXT_MUTED
        })
      ]
    })
  );

  const tocHeaderRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 12, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 70, bottom: 70, left: 70, right: 70 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'WEEK', bold: true, size: 15, color: BRAND_COLORS.WHITE })]
          })
        ]
      }),
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 70, bottom: 70, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: 'STRAND & SUB-STRAND', bold: true, size: 15, color: BRAND_COLORS.WHITE })]
          })
        ]
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 70, bottom: 70, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: 'INDICATOR CODE', bold: true, size: 15, color: BRAND_COLORS.WHITE })]
          })
        ]
      }),
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 70, bottom: 70, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: 'LESSON TOPIC / PERFORMANCE FOCUS', bold: true, size: 15, color: BRAND_COLORS.WHITE })]
          })
        ]
      })
    ]
  });

  const tocDataRows = sortedLessons.map((l, i) => {
    const wNum = extractWeekNumber(l);
    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? BRAND_COLORS.SLATE_LIGHT_BG : BRAND_COLORS.WHITE },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 70, right: 70 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `Week ${wNum}`, bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `${l.strand || 'General Strand'}\n`, bold: true, size: 15, color: BRAND_COLORS.TEXT_MAIN }),
                new TextRun({ text: l.subStrand || 'General Sub-Strand', size: 14, color: BRAND_COLORS.SLATE_MUTED })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: l.indicatorCode || l.indicator || `Code ${i + 1}`, 
                  bold: true, 
                  size: 15, 
                  color: BRAND_COLORS.GHANA_GREEN 
                })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 70, bottom: 70, left: 80, right: 80 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: l.performanceIndicator || l.lessonFocus || l.title || 'Curriculum Lesson Plan', 
                  size: 14, 
                  color: BRAND_COLORS.TEXT_BODY 
                })
              ]
            })
          ]
        })
      ]
    });
  });

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [tocHeaderRow, ...tocDataRows]
    }),
    new Paragraph({ spacing: { after: 180 } })
  );

  return elements;
}

/**
 * Main Export Function: Builds and downloads the Bulk Term Lesson Plan Book as a .docx Word document
 */
export async function exportBulkTermLessonPlansToWord(options: BulkTermExportOptions): Promise<void> {
  const { lessons, academicYear, term, classLevel, subject } = options;

  if (!lessons || lessons.length === 0) {
    toast.error('No saved lesson plans provided for export.');
    return;
  }

  // Deduplicate and Sort
  // Primary Sort: numeric week number
  // Secondary Sort: numeric lesson number
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

  // Running Header and Footer
  const runningHeader = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: `TeachSmartGH Print  |  ${subject.toUpperCase()} - ${classLevel.toUpperCase()}  |  ${term.toUpperCase()}`,
            size: 14,
            color: BRAND_COLORS.SLATE_MUTED,
            font: 'Calibri'
          })
        ]
      })
    ]
  });

  const runningFooter = new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'TeachSmartGH (Catalyst Creative) • Designed to Align with NaCCA / GES Curriculum Requirements',
                        size: 13,
                        color: BRAND_COLORS.SLATE_MUTED,
                        font: 'Calibri'
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: 'Page ', size: 14, color: BRAND_COLORS.NAVY_DARK }),
                      new TextRun({ children: [PageNumber.CURRENT], size: 14, color: BRAND_COLORS.NAVY_DARK, bold: true }),
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Build Front Matter
  const frontMatterElements = buildFrontMatter(options, deduplicatedLessons);

  // Build Lesson Sections
  const lessonSectionsElements: (Paragraph | Table)[] = [];
  deduplicatedLessons.forEach((plan, idx) => {
    const sec = buildLessonPlanSection(plan, idx, deduplicatedLessons.length);
    lessonSectionsElements.push(...sec);
  });

  const doc = new Document({
    creator: 'TeachSmartGH (Catalyst Creative)',
    title: `TeachSmartGH Term Lesson Plan Book - ${subject} (${classLevel})`,
    description: `Standard-Based Curriculum Term Lesson Plan Book for ${term}, ${academicYear} (Aligned to NaCCA Standards)`,
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.PORTRAIT },
            margin: { top: 600, bottom: 600, left: 600, right: 600 }
          }
        },
        headers: { default: runningHeader },
        footers: { default: runningFooter },
        children: [
          ...frontMatterElements,
          ...lessonSectionsElements
        ]
      }
    ]
  });

  const cleanSubject = subject.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = classLevel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanTerm = term.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `TeachSmartGH_Term_Lesson_Plan_Book_${cleanTerm}_${cleanSubject}_${cleanClass}.docx`;

  await downloadDocxBlob(doc, filename, `Term Lesson Plan Book (.docx) generated with ${deduplicatedLessons.length} lessons! 📝`);
}

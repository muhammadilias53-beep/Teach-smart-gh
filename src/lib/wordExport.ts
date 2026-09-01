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
  VerticalAlign
} from 'docx';
import { toast } from 'react-hot-toast';
import { formatWeekLessonPlanTitle } from './utils';
import { buildMultiDayLessonPhases } from './multiDayParser';
import { getKGScheduleForDay, getSupportedKGBlockDuration, reconcileKGBlocks } from '../config/kgTimetable';

export interface DocumentExportMetadata {
  title?: string;
  subject?: string;
  classLevel?: string;
  level?: string;
  term?: string;
  week?: string;
  strand?: string;
  subStrand?: string;
  contentStandard?: string;
  indicator?: string;
  topic?: string;
  schoolName?: string;
  teacherName?: string;
  academicYear?: string;
  locality?: string;
  documentType?: string; // 'Scheme of Learning', 'Lesson Plan', 'Exam Question Paper', 'Marking Scheme', 'Lesson Notes', 'Assignment', 'Quiz', 'Student Report'
  orientation?: 'portrait' | 'landscape';
}

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

/**
 * Strips markdown markup from a string and returns clean plain text
 */
function cleanMarkdownText(text: string | undefined | null): string {
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
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * Splits inline markdown text into formatted TextRun array (handling **bold**, *italic*, `code`)
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
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      runs.push(new TextRun({
        text: part.slice(1, -1),
        color: BRAND_COLORS.GHANA_GREEN,
        size: Math.max(12, defaultSize - 1),
        font: 'Consolas'
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
 * Creates the official TeachSmartGH top header banner table for Word Documents
 */
function createBrandHeaderBanner(meta: DocumentExportMetadata): Table {
  const school = meta.schoolName || 'Ghana Basic School';
  const academicYear = meta.academicYear || '2025/2026 Academic Year';

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_DARK },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 18, color: BRAND_COLORS.GHANA_GOLD },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40 },
                children: [
                  new TextRun({
                    text: 'TeachSmart',
                    bold: true,
                    size: 26,
                    color: BRAND_COLORS.WHITE,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: 'GH',
                    bold: true,
                    size: 26,
                    color: BRAND_COLORS.GHANA_GOLD,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: '  |  CATALYST CREATIVE',
                    size: 20,
                    color: 'CBD5E1',
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40 },
                children: [
                  new TextRun({
                    text: '🇬🇭 AI-POWERED TEACHING. SMARTER TOMORROW.  •  DESIGNED TO ALIGN WITH NaCCA/GES CURRICULUM REQUIREMENTS',
                    size: 16,
                    color: BRAND_COLORS.GHANA_GOLD,
                    bold: true,
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: `${school.toUpperCase()}  •  ${academicYear.toUpperCase()}`,
                    size: 15,
                    color: 'E2E8F0',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

/**
 * Dedicated Kindergarten Top Brand Banner Table
 */
function createKGBrandHeaderBanner(meta: DocumentExportMetadata): Table {
  const school = meta.schoolName || 'Basic School / Early Childhood Centre';
  const academicYear = meta.academicYear || '2025/2026 Academic Year';

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_DARK },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 18, color: BRAND_COLORS.GHANA_GOLD },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40 },
                children: [
                  new TextRun({
                    text: 'TeachSmart',
                    bold: true,
                    size: 26,
                    color: BRAND_COLORS.WHITE,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: 'GH',
                    bold: true,
                    size: 26,
                    color: BRAND_COLORS.GHANA_GOLD,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: '  |  CATALYST CREATIVE',
                    size: 20,
                    color: 'CBD5E1',
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 40 },
                children: [
                  new TextRun({
                    text: '🇬🇭 AI-POWERED EARLY CHILDHOOD TEACHING  •  DESIGNED FOR NaCCA/GES ECE ALIGNMENT',
                    size: 16,
                    color: BRAND_COLORS.GHANA_GOLD,
                    bold: true,
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: `${school.toUpperCase()}  •  ${academicYear.toUpperCase()}  •  UNIVERSAL KG TIMETABLE MODEL`,
                    size: 15,
                    color: 'E2E8F0',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

/**
 * Creates the document metadata summary box table (Subject, Class, Term, Strand, etc.)
 */
function createMetadataStripTable(meta: DocumentExportMetadata): Table {
  const fields = [
    { label: 'DOCUMENT', val: meta.documentType || meta.title || 'Curriculum Resource' },
    { label: 'SUBJECT', val: meta.subject || 'General' },
    { label: 'CLASS / LEVEL', val: `${meta.classLevel || 'Basic 7'} (${meta.level || 'JHS'})` },
    { label: 'TERM / ACADEMIC YEAR', val: `${meta.term ? `Term ${meta.term}` : 'All Terms'} • ${meta.academicYear || '2025/2026'}` },
  ];

  if (meta.strand) {
    fields.push({ label: 'STRAND', val: meta.strand });
  }
  if (meta.subStrand) {
    fields.push({ label: 'SUB-STRAND', val: meta.subStrand });
  }
  if (meta.contentStandard) {
    fields.push({ label: 'CONTENT STANDARD', val: meta.contentStandard });
  }
  if (meta.indicator) {
    fields.push({ label: 'INDICATOR', val: meta.indicator });
  }
  if (meta.topic) {
    fields.push({ label: 'TOPIC', val: meta.topic });
  }
  if (meta.locality) {
    fields.push({ label: 'LOCALITY CONTEXT', val: meta.locality });
  }

  const rows: TableRow[] = [];
  for (let i = 0; i < fields.length; i += 2) {
    const f1 = fields[i];
    const f2 = fields[i + 1];

    rows.push(new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_LIGHT_BG },
          margins: { top: 90, bottom: 90, left: 140, right: 140 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            left: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            right: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
          },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [
                new TextRun({ text: f1.label + ': ', bold: true, size: 16, color: BRAND_COLORS.SLATE_MUTED, font: 'Calibri' }),
                new TextRun({ text: f1.val, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK, font: 'Calibri' })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_LIGHT_BG },
          margins: { top: 90, bottom: 90, left: 140, right: 140 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            left: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
            right: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE },
          },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [
                f2 ? new TextRun({ text: f2.label + ': ', bold: true, size: 16, color: BRAND_COLORS.SLATE_MUTED, font: 'Calibri' }) : new TextRun(''),
                f2 ? new TextRun({ text: f2.val, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK, font: 'Calibri' }) : new TextRun('')
              ]
            })
          ]
        })
      ]
    }));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows
  });
}

/**
 * Calculates optimal column percentage widths for markdown tables based on column count and role.
 */
function getCalculatedColumnWidths(numCols: number): number[] {
  if (typeof numCols !== 'number' || isNaN(numCols) || numCols <= 0) {
    return [100];
  }
  const safeCols = Math.min(Math.max(1, Math.floor(numCols)), 50);

  // Official NaCCA 11-column Scheme of Learning table
  if (safeCols === 11) {
    return [6, 8, 8, 10, 9, 10, 22, 9, 6, 6, 6];
  }
  // 10-column table
  if (safeCols === 10) {
    return [7, 9, 9, 11, 10, 11, 23, 10, 5, 5];
  }
  // 9-column table
  if (safeCols === 9) {
    return [8, 10, 10, 12, 11, 12, 23, 7, 7];
  }
  // 8-column table
  if (safeCols === 8) {
    return [8, 11, 11, 13, 12, 14, 21, 10];
  }
  // 7-column table
  if (safeCols === 7) {
    return [9, 12, 12, 15, 14, 23, 15];
  }
  // 6-column table
  if (safeCols === 6) {
    return [10, 15, 15, 20, 25, 15];
  }
  // 5-column table
  if (safeCols === 5) {
    return [14, 20, 26, 20, 20];
  }
  // 4-column table
  if (safeCols === 4) {
    return [15, 25, 40, 20];
  }
  // 3-column table
  if (safeCols === 3) {
    return [20, 45, 35];
  }
  // 2-column table
  if (safeCols === 2) {
    return [30, 70];
  }
  if (safeCols === 1) {
    return [100];
  }
  
  const evenWidth = Math.max(1, Math.floor(100 / safeCols));
  const widths: number[] = [];
  for (let i = 0; i < safeCols; i++) {
    widths.push(evenWidth);
  }
  return widths;
}

/**
 * Converts markdown table rows into a native docx Table with complete borders, headers, and shading.
 */
function parseMarkdownTableToDocx(tableLines: string[]): Table {
  if (!tableLines || !Array.isArray(tableLines) || tableLines.length < 2) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: []
    });
  }

  // Parse lines into cell arrays
  const parsedRows = tableLines.map(line => {
    return line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());
  }).filter(row => {
    return row.length > 0 && !row.every(cell => /^[-:\s]+$/.test(cell));
  });

  if (parsedRows.length === 0) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: []
    });
  }

  const rawNumCols = Math.max(1, ...parsedRows.map(r => r.length));
  const numCols = Math.min(Math.max(1, Math.floor(rawNumCols)), 50);
  const colWidths = getCalculatedColumnWidths(numCols);
  const fontSize = numCols >= 9 ? 15 : (numCols >= 6 ? 16 : 17);

  const docxRows: TableRow[] = [];

  parsedRows.forEach((rowCells, rowIndex) => {
    const isHeader = rowIndex === 0;
    const isEven = rowIndex % 2 === 0;
    const rowBgColor = isHeader 
      ? BRAND_COLORS.NAVY_HEADER 
      : (isEven ? BRAND_COLORS.SLATE_LIGHT_BG : BRAND_COLORS.WHITE);

    const cellsCopy = [...rowCells];
    while (cellsCopy.length < numCols) {
      cellsCopy.push('');
    }

    const cells = cellsCopy.map((cellText, colIndex) => {
      const cellWidth = colWidths[colIndex] || Math.floor(100 / numCols);
      const formattedRuns = isHeader
        ? [new TextRun({ text: cleanMarkdownText(cellText), bold: true, color: BRAND_COLORS.WHITE, size: fontSize, font: 'Calibri' })]
        : createFormattedRuns(cellText, BRAND_COLORS.TEXT_MAIN, fontSize);

      return new TableCell({
        width: { size: cellWidth, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: rowBgColor },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 100, bottom: 100, left: 110, right: 110 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: isHeader ? 8 : 4, color: isHeader ? BRAND_COLORS.NAVY_DARK : BRAND_COLORS.BORDER_SUBTLE },
          bottom: { style: BorderStyle.SINGLE, size: isHeader ? 12 : 4, color: isHeader ? BRAND_COLORS.GHANA_GOLD : BRAND_COLORS.BORDER_SUBTLE },
          left: { style: BorderStyle.SINGLE, size: 4, color: isHeader ? '334155' : BRAND_COLORS.BORDER_SUBTLE },
          right: { style: BorderStyle.SINGLE, size: 4, color: isHeader ? '334155' : BRAND_COLORS.BORDER_SUBTLE },
        },
        children: [
          new Paragraph({
            alignment: isHeader 
              ? AlignmentType.CENTER 
              : (colIndex === 0 && numCols > 3 ? AlignmentType.CENTER : AlignmentType.LEFT),
            spacing: { before: 15, after: 15 },
            children: formattedRuns
          })
        ]
      });
    });

    docxRows.push(new TableRow({
      tableHeader: isHeader,
      cantSplit: true,
      children: cells
    }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: docxRows
  });
}

/**
 * Parses full Markdown content into an array of Word document elements (Paragraphs, Headings, Lists, Tables)
 */
function parseMarkdownToDocxElements(markdown: string): (Paragraph | Table)[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const elements: (Paragraph | Table)[] = [];
  let currentTableLines: string[] = [];

  const flushTable = () => {
    if (currentTableLines.length > 0) {
      elements.push(parseMarkdownTableToDocx(currentTableLines));
      elements.push(new Paragraph({ spacing: { after: 100 } }));
      currentTableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
      currentTableLines.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    if (!trimmed) {
      elements.push(new Paragraph({ spacing: { after: 80 } }));
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: cleanMarkdownText(trimmed.replace(/^#\s+/, '')),
            bold: true,
            size: 25,
            color: BRAND_COLORS.NAVY_DARK,
            font: 'Calibri'
          })
        ]
      }));
    } else if (trimmed.startsWith('## ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 90 },
        children: [
          new TextRun({
            text: cleanMarkdownText(trimmed.replace(/^##\s+/, '')),
            bold: true,
            size: 21,
            color: BRAND_COLORS.GHANA_GREEN,
            font: 'Calibri'
          })
        ]
      }));
    } else if (trimmed.startsWith('### ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 140, after: 70 },
        children: [
          new TextRun({
            text: cleanMarkdownText(trimmed.replace(/^###\s+/, '')),
            bold: true,
            size: 19,
            color: BRAND_COLORS.NAVY_DARK,
            font: 'Calibri'
          })
        ]
      }));
    } else if (trimmed.startsWith('#### ')) {
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 120, after: 50 },
        children: [
          new TextRun({
            text: cleanMarkdownText(trimmed.replace(/^####\s+/, '')),
            bold: true,
            size: 18,
            color: BRAND_COLORS.NAVY_HEADER,
            font: 'Calibri'
          })
        ]
      }));
    } else if (trimmed.startsWith('> ')) {
      elements.push(new Paragraph({
        spacing: { before: 80, after: 80 },
        indent: { left: 400 },
        children: createFormattedRuns(trimmed.replace(/^>\s*/, ''), BRAND_COLORS.SLATE_MUTED, 18)
      }));
    } else if (/^[-*+]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*+]\s+/, '');
      elements.push(new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 30, after: 30 },
        children: createFormattedRuns(itemText, BRAND_COLORS.TEXT_MAIN, 18)
      }));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      elements.push(new Paragraph({
        spacing: { before: 40, after: 40 },
        indent: { left: 280 },
        children: [
          new TextRun({ text: trimmed.match(/^\d+\./)![0] + ' ', bold: true, color: BRAND_COLORS.GHANA_GREEN, size: 18 }),
          ...createFormattedRuns(itemText, BRAND_COLORS.TEXT_MAIN, 18)
        ]
      }));
    } else if (/^([-*_]){3,}$/.test(trimmed)) {
      elements.push(new Paragraph({
        spacing: { before: 120, after: 120 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.BORDER_SUBTLE }
        }
      }));
    } else {
      elements.push(new Paragraph({
        spacing: { before: 40, after: 60 },
        children: createFormattedRuns(trimmed, BRAND_COLORS.TEXT_MAIN, 18)
      }));
    }
  }

  flushTable();
  return elements;
}

/**
 * Common running header and footer creator
 */
function createRunningHeaderAndFooter(documentType: string) {
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `TeachSmartGH • ${documentType.toUpperCase()} • Designed to Align with NaCCA/GES Curriculum Requirements`,
            size: 14,
            color: BRAND_COLORS.SLATE_MUTED,
            font: 'Calibri'
          })
        ]
      })
    ]
  });

  const footer = new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: { 
                  top: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE }, 
                  bottom: { style: BorderStyle.NONE }, 
                  left: { style: BorderStyle.NONE }, 
                  right: { style: BorderStyle.NONE } 
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'TeachSmartGH by Catalyst Creative • Designed to Align with NaCCA/GES Curriculum Requirements',
                        size: 14,
                        color: BRAND_COLORS.SLATE_MUTED,
                        italics: true,
                        font: 'Calibri'
                      })
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

  return { header, footer };
}

/**
 * Dedicated Kindergarten Running Header and Footer with Safe Branding
 */
function createKGRunningHeaderAndFooter(weekNumber: string, className: string) {
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `TeachSmartGH • KINDERGARTEN DAILY LESSON PLAN - WEEK ${weekNumber} (${className}) • Designed for NaCCA/GES ECE Alignment`,
            size: 14,
            color: BRAND_COLORS.SLATE_MUTED,
            font: 'Calibri'
          })
        ]
      })
    ]
  });

  const footer = new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: { 
                  top: { style: BorderStyle.SINGLE, size: 4, color: BRAND_COLORS.BORDER_SUBTLE }, 
                  bottom: { style: BorderStyle.NONE }, 
                  left: { style: BorderStyle.NONE }, 
                  right: { style: BorderStyle.NONE } 
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'TeachSmartGH | TeachSmartGH Kindergarten Daily Lesson Plan — Designed to Align with NaCCA/GES Requirements | Catalyst Creative',
                        size: 13,
                        color: BRAND_COLORS.SLATE_MUTED,
                        font: 'Calibri'
                      })
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

  return { header, footer };
}

/**
 * Triggers file download in the browser
 */
async function downloadDocxBlob(doc: Document, filename: string, successMessage = 'Word document (.docx) downloaded successfully! 📝'): Promise<void> {
  const blob = await Packer.toBlob(doc);
  if (typeof document !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  toast.success(successMessage);
}

/**
 * Main function to export any Markdown content as a styled TeachSmartGH Word (.docx) document
 */
export async function exportMarkdownToWord(
  markdownContent: string,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const {
    title = 'TeachSmartGH Curriculum Document',
    documentType = 'Curriculum Document',
    subject = 'Integrated Curriculum',
    classLevel = 'Basic 7',
    level = 'JHS',
    orientation
  } = metadata;

  const hasWideTable = markdownContent.split('\n').some(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && (trimmed.match(/\|/g) || []).length > 5;
  });

  const isLandscape = orientation === 'landscape' || hasWideTable || documentType.toLowerCase().includes('scheme');

  const brandHeader = createBrandHeaderBanner({ ...metadata, title, documentType, subject, classLevel, level });
  const metaTable = createMetadataStripTable({ ...metadata, title, documentType, subject, classLevel, level });
  const contentElements = parseMarkdownToDocxElements(markdownContent);
  const { header, footer } = createRunningHeaderAndFooter(documentType);

  const doc = new Document({
    creator: 'TeachSmartGH (Catalyst Creative)',
    title: `${title} - TeachSmartGH`,
    description: 'AI-Generated Curriculum Document Designed to Align with NaCCA/GES Curriculum Requirements',
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720,
            }
          }
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          brandHeader,
          new Paragraph({ spacing: { after: 120 } }),
          metaTable,
          new Paragraph({ spacing: { after: 160 } }),
          ...contentElements
        ]
      }
    ]
  });

  const cleanSubject = (subject || 'Subject').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanDocType = (documentType || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = (classLevel || 'Class').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `TeachSmartGH_${cleanDocType}_${cleanSubject}_${cleanClass}.docx`;

  await downloadDocxBlob(doc, filename);
}

/**
 * Dedicated NaCCA Lesson Plan Word Exporter
 * Generates the EXACT NaCCA / GES Notebook Structure in Microsoft Word (.docx format):
 * - Table 1: 5-Column Metadata & Curriculum Grid (Day, Week Ending, Date, Period, Lesson, Strand, Sub-strand, Indicators, Competencies, TLRs)
 * - Table 2: 3-Phase Instructional Delivery Table (Day-by-Day aligned Starter, Main, and Plenary)
 * - Table 3: Teacher Declaration & Headteacher / Supervisor Endorsement
 */
export async function exportLessonPlanToWord(
  planData: any,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const isKg = planData.isKgPlan || planData.level === 'KG' || planData.class?.toUpperCase().includes('KG');
  if (isKg) {
    return exportKGLessonPlanToWord(planData, metadata);
  }

  const displaySubject = planData.subject === 'Ghanaian Language' && planData.ghanaianLanguage
    ? `GHANAIAN LANGUAGE (${planData.ghanaianLanguage.toUpperCase()})`
    : (planData.subject || metadata.subject || 'GENERAL SUBJECT').toUpperCase();

  const className = (planData.class || planData.level || metadata.classLevel || 'BASIC 7').toUpperCase();
  const classSize = planData.classSize || '40';
  const weekNumber = planData.weekNumber || planData.week || metadata.week || '1';
  const officialTitle = formatWeekLessonPlanTitle(weekNumber);
  const weekEnding = planData.weekEnding || new Date().toISOString().split('T')[0];
  const day = planData.day || 'Monday';
  const date = planData.date || weekEnding;
  const period = planData.period || (planData.duration ? `${planData.duration}` : '1 & 2');
  const lesson = planData.lesson || '1';

  const strand = planData.strand || metadata.strand || 'N/A';
  const subStrand = planData.subStrand || metadata.subStrand || 'N/A';
  const indCode = planData.indicatorCode || planData.indicator || metadata.indicator || 'N/A';
  const csCode = planData.contentStandardCode || planData.contentStandard || metadata.contentStandard || 'N/A';
  const performanceIndicator = planData.performanceIndicator || planData.mainObjective || 'Learners can demonstrate understanding of stated lesson indicators.';
  const coreCompetencies = cleanMarkdownText(planData.coreCompetencies) || 'Critical Thinking and Problem Solving (CP), Communication and Collaboration (CC)';
  const keyWords = cleanMarkdownText(planData.keyWords) || 'N/A';
  const tlrs = cleanMarkdownText(planData.tlrs) || 'Curriculum Handbooks, Realia, Chalkboard illustrations';
  const references = cleanMarkdownText(planData.references) || 'NaCCA Standard-Based Curriculum Guidelines, Teacher Resource Pack';

  // Build Table 1: Official NaCCA 5-Column Metadata Table
  const table1CellBorder = {
    top: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    left: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    right: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER }
  };

  const table1Rows: TableRow[] = [
    // Row 1: Day | WEEK ENDING: | Date | Period | Lesson (5 columns)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 14, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Day\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: day, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 34, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'WEEK ENDING: ', bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: weekEnding, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Date\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: date, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 17, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Period\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: period, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 17, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Lesson\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: lesson, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        })
      ]
    }),
    // Row 2: Strand (cols 1-2 = 48%) | Sub-strand (cols 3-5 = 52%)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'STRAND:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(strand, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'SUB-STRAND:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(subStrand, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    }),
    // Row 3: Indicator (code) | Content standard (code)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'INDICATOR (CODE):', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(indCode, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'CONTENT STANDARD (CODE):', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(csCode, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    }),
    // Row 4: Performance Indicator (full width 100%)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 5,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'PERFORMANCE INDICATOR:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(performanceIndicator, BRAND_COLORS.TEXT_MAIN, 17)
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
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'CORE COMPETENCIES:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(coreCompetencies, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'KEY WORDS:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(keyWords, BRAND_COLORS.TEXT_MAIN, 17)
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
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'T.L.R.(S):', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(tlrs, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        }),
        new TableCell({
          width: { size: 52, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 20 },
              children: [new TextRun({ text: 'REF:', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            }),
            ...createFormattedParagraphs(references, BRAND_COLORS.TEXT_MAIN, 17)
          ]
        })
      ]
    })
  ];

  const table1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: table1Rows
  });

  // Build Table 2: 3-Phase Instructional Delivery Table
  const dayPhases = buildMultiDayLessonPhases({
    day: planData.day || 'Monday',
    weekEnding: planData.weekEnding,
    duration: planData.duration,
    phase1: planData.phase1,
    phase2: planData.phase2,
    phase3: planData.phase3,
    differentiation: planData.differentiation
  });

  const table2HeaderRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 90, bottom: 90, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'DAY', bold: true, size: 17, color: BRAND_COLORS.WHITE })]
          })
        ]
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 90, bottom: 90, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 1: Starter\n', bold: true, size: 17, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: '(preparing the brain for learning):', size: 14, color: 'CBD5E1' })
            ]
          })
        ]
      }),
      new TableCell({
        width: { size: 42, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 90, bottom: 90, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 2: Main\n', bold: true, size: 17, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: '(new learning including assessment):', size: 14, color: 'CBD5E1' })
            ]
          })
        ]
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.NAVY_HEADER },
        borders: table1CellBorder,
        margins: { top: 90, bottom: 90, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'Phase 3:\n', bold: true, size: 17, color: BRAND_COLORS.WHITE }),
              new TextRun({ text: 'Plenary / Reflections:', size: 14, color: 'CBD5E1' })
            ]
          })
        ]
      })
    ]
  });

  const table2BodyRows = dayPhases.map((phase, index) => {
    let mainContent = cleanMarkdownText(phase.main);
    
    if (phase.differentiation) {
      const diff = phase.differentiation;
      const diffTexts: string[] = [];
      if (diff.strugglingLearners?.activities) {
        diffTexts.push(`• Remedial / Struggling: ${cleanMarkdownText(diff.strugglingLearners.activities)}`);
      }
      if (diff.averageLearners?.activities) {
        diffTexts.push(`• Core Class / Average: ${cleanMarkdownText(diff.averageLearners.activities)}`);
      }
      if (diff.advancedLearners?.activities) {
        diffTexts.push(`• Advanced / Enrichment: ${cleanMarkdownText(diff.advancedLearners.activities)}`);
      }
      if (diffTexts.length > 0) {
        mainContent += `\n\n**INCLUSIVE DIFFERENTIATION:**\n${diffTexts.join('\n')}`;
      }
    }

    if (planData.assessment && (index === dayPhases.length - 1 || dayPhases.length === 1)) {
      mainContent += `\n\n**ASSESSMENT / EVALUATION:**\n${cleanMarkdownText(planData.assessment)}`;
    }

    let plenaryContent = cleanMarkdownText(phase.plenary);
    if (planData.remarks && (index === dayPhases.length - 1 || dayPhases.length === 1)) {
      plenaryContent += `\n\n**REMARKS / REFLECTION:**\n${cleanMarkdownText(planData.remarks)}`;
    }

    const dayText = phase.dayDate
      ? `${phase.dayName}\n(${phase.dayDate})\n\n(${phase.duration || planData.duration || '60 mins'})`
      : `${phase.dayName}\n\n(${phase.duration || planData.duration || '60 mins'})`;

    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 14, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_LIGHT_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 80, right: 80 },
          verticalAlign: VerticalAlign.TOP,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: dayText, bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
            })
          ]
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 80, right: 80 },
          verticalAlign: VerticalAlign.TOP,
          children: createFormattedParagraphs(phase.starter, BRAND_COLORS.TEXT_BODY, 16)
        }),
        new TableCell({
          width: { size: 42, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 80, right: 80 },
          verticalAlign: VerticalAlign.TOP,
          children: createFormattedParagraphs(mainContent, BRAND_COLORS.TEXT_BODY, 16)
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 80, right: 80 },
          verticalAlign: VerticalAlign.TOP,
          children: createFormattedParagraphs(plenaryContent, BRAND_COLORS.TEXT_BODY, 16)
        })
      ]
    });
  });

  const table2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [table2HeaderRow, ...table2BodyRows]
  });

  // Build Table 3: Teacher Declaration & Headteacher Vetting
  const table3 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
            borders: table1CellBorder,
            margins: { top: 70, bottom: 70, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'TEACHER DECLARATION / SUBMISSION', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
            borders: table1CellBorder,
            margins: { top: 70, bottom: 70, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'HEADTEACHER / SUPERVISOR VETTING & ENDORSEMENT', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })]
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
            margins: { top: 90, bottom: 90, left: 100, right: 100 },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: "Teacher's Name: ................................................................", size: 15, color: BRAND_COLORS.TEXT_BODY })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: 'Signature: ........................................... Date: ......................', size: 15, color: BRAND_COLORS.TEXT_BODY })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Remarks: [  ] Submitted on Time    [  ] Revision Required', size: 14, color: BRAND_COLORS.SLATE_MUTED })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: table1CellBorder,
            margins: { top: 90, bottom: 90, left: 100, right: 100 },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: 'Headteacher/Supervisor: .................................................', size: 15, color: BRAND_COLORS.TEXT_BODY })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: 'Signature / Stamp: ............................ Date: ......................', size: 15, color: BRAND_COLORS.TEXT_BODY })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'Status: [  ] Approved for Delivery    [  ] Inspected & Monitored', size: 14, color: BRAND_COLORS.SLATE_MUTED })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  const { header, footer } = createRunningHeaderAndFooter('Lesson Plan');

  // Notebook Header Block (Subject, Class, Size)
  const notebookHeaderParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: officialTitle,
          bold: true,
          size: 26,
          color: BRAND_COLORS.NAVY_DARK,
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 40, after: 80 },
      children: [
        new TextRun({ text: 'SUBJECT: ', bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${displaySubject}        `, bold: true, underline: {}, size: 17, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: 'CLASS: ', bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${className}        `, bold: true, underline: {}, size: 17, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: 'CLASS SIZE: ', bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${classSize}`, bold: true, underline: {}, size: 17, color: BRAND_COLORS.NAVY_DARK }),
      ]
    })
  ];

  const brandHeader = createBrandHeaderBanner({
    ...metadata,
    title: officialTitle,
    documentType: 'Official Lesson Plan',
    subject: displaySubject,
    classLevel: className
  });

  const doc = new Document({
    creator: 'TeachSmartGH (Catalyst Creative)',
    title: `${officialTitle} - ${displaySubject}`,
    description: 'NaCCA Compliant GES Official Lesson Plan Notebook Page',
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.PORTRAIT },
            margin: { top: 600, bottom: 600, left: 600, right: 600 }
          }
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          brandHeader,
          ...notebookHeaderParagraphs,
          new Paragraph({ spacing: { after: 60 } }),
          table1,
          new Paragraph({ spacing: { after: 120 } }),
          table2,
          new Paragraph({ spacing: { after: 140 } }),
          table3
        ]
      }
    ]
  });

  const cleanSubject = displaySubject.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = className.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanWeek = (weekNumber || '1').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `TeachSmartGH_LessonPlan_Week_${cleanWeek}_${cleanSubject}_${cleanClass}.docx`;

  await downloadDocxBlob(doc, filename, 'NaCCA Lesson Plan (.docx) downloaded successfully! 📝');
}

/**
 * Dedicated Kindergarten Daily Lesson Plan Word Exporter
 * Generates the Official GES / NaCCA KG Notebook Format in Microsoft Word (.docx format):
 * - Table 1: KG Metadata & Header Grid (Day, Date, Class, Class Size, Week Ending, Strand, Sub-strand, Content Standard, Indicator, Lesson Focus, Performance Indicator, Core Competencies, Key Words, TLRs, References)
 * - Table 2: Universal KG Timetable Delivery Table (8 Schedule Blocks from 07:30 to 12:30)
 * - Table 3: Inclusive Differentiation (Remedial, Average, Advanced)
 * - Table 4: Teacher Post-Lesson Reflection & Headteacher / Supervisor Endorsement
 */
export async function exportKGLessonPlanToWord(
  planData: any,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const className = (planData.class || planData.level || metadata.classLevel || 'KG 1').toUpperCase();
  const classSize = planData.classSize || '35';
  const weekNumber = planData.weekNumber || planData.week || metadata.week || '1';
  const officialTitle = `KINDERGARTEN DAILY LESSON PLAN - WEEK ${weekNumber}`;
  const weekEnding = planData.weekEnding || new Date().toISOString().split('T')[0];
  const day = planData.day || 'Monday';
  const date = planData.date || weekEnding;

  const strand = planData.strand || metadata.strand || 'All About Me';
  const subStrand = planData.subStrand || metadata.subStrand || 'I Am a Special Child';
  const csCode = planData.contentStandardCode || planData.contentStandard || metadata.contentStandard || 'K1.1.1.1';
  const csText = planData.contentStandard || csCode;
  const indCode = planData.indicatorCode || planData.indicator || metadata.indicator || 'K1.1.1.1.1';
  const indText = planData.indicator || indCode;
  const lessonFocus = planData.lessonFocus || planData.title || 'Parts of My Body: Head, Hands and Feet';
  const performanceIndicator = planData.performanceIndicator || planData.mainObjective || 'Learners can touch and name body parts during a play song.';
  const coreCompetencies = cleanMarkdownText(planData.coreCompetencies) || 'Communication and Collaboration (CC), Personal Development (PL)';
  const keyWords = cleanMarkdownText(planData.keyWords) || 'Head, Eyes, Nose, Hands, Special';
  const tlrs = cleanMarkdownText(planData.tlrs) || 'Body chart, Mirror, Soft toys, Flashcards, Bottle caps';
  const references = cleanMarkdownText(planData.references) || 'NaCCA Kindergarten Curriculum Guide (KG1-KG2)';
  const teacherReflection = cleanMarkdownText(planData.teacherReflection || planData.remarks) || '1. Did the play-based manipulatives effectively engage learners?\n2. Which sounds/concepts need reinforcement tomorrow?\n3. What adjustments are needed?';

  const table1CellBorder = {
    top: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    left: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER },
    right: { style: BorderStyle.SINGLE, size: 6, color: BRAND_COLORS.SLATE_BORDER }
  };

  // Table 1: KG Metadata & Header Grid
  const table1Rows: TableRow[] = [
    // Row 1: Day | Date | Class | Class Size | Week Ending
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'DAY\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: day, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'DATE\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: date, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'CLASS\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: className, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'CLASS SIZE\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: classSize, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'WEEK ENDING\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: weekEnding, bold: true, size: 17, color: BRAND_COLORS.NAVY_DARK })
              ]
            })
          ]
        })
      ]
    }),
    // Row 2: Strand | Sub-strand
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'STRAND:\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: strand, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'SUB-STRAND:\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: subStrand, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        })
      ]
    }),
    // Row 3: Content Standard | Indicator
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'CONTENT STANDARD (CODE & TEXT):\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: csText, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'INDICATOR (CODE & TEXT):\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: indText, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        })
      ]
    }),
    // Row 4: Lesson Focus (Full Width)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 5,
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'LESSON FOCUS / THEMATIC TOPIC: ', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: lessonFocus, bold: true, size: 17, color: BRAND_COLORS.GHANA_GREEN })
              ]
            })
          ]
        })
      ]
    }),
    // Row 5: Performance Indicator (Full Width)
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 5,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'PERFORMANCE INDICATOR (Observable Learner Demonstration):\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: performanceIndicator, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        })
      ]
    }),
    // Row 6: Core Competencies | Key Words
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'CORE COMPETENCIES & VALUES:\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: coreCompetencies, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'KEY VOCABULARY / WORDS:\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: keyWords, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        })
      ]
    }),
    // Row 7: TLRs | References
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'TEACHING & LEARNING RESOURCES (TLRs - Local Materials):\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: tlrs, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          borders: table1CellBorder,
          margins: { top: 90, bottom: 90, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'REFERENCES:\n', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
                new TextRun({ text: references, size: 17, color: BRAND_COLORS.TEXT_BODY })
              ]
            })
          ]
        })
      ]
    })
  ];

  const table1 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: table1Rows
  });

  // Table 2: Universal KG Timetable Delivery Table
  const blocksToUse = reconcileKGBlocks(planData.kgBlocks || (planData as any).blocks, day);

  const table2HeaderRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'TIMETABLE BLOCK & TIME', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })] })]
      }),
      new TableCell({
        width: { size: 46, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: 'TEACHING & LEARNING ACTIVITIES (PLAY-BASED & LEARNER-CENTRED)', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })] })]
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: 'RESOURCES / TLMs', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })] })]
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
        borders: table1CellBorder,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: 'ASSESSMENT', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })] })]
      })
    ]
  });

  const table2DataRows = blocksToUse.map((blk: any, idx: number) => {
    const periodDisplay = blk.periodNumber ? `Period ${blk.periodNumber}` : `Period ${idx + 1}`;
    const rawBlockName = blk.blockName || periodDisplay;
    const cleanBlockName = rawBlockName
      .replace(/\(?\b\d{1,2}:\d{2}\s*(-|–|to)\s*\d{1,2}:\d{2}\b\)?/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const durationDisplay = getSupportedKGBlockDuration(cleanBlockName);
    let actRuns: TextRun[] = [];

    if (blk.isInstructional === false && !blk.teacherActivities && !blk.learnerActivities) {
      actRuns = [new TextRun({ text: cleanMarkdownText(blk.defaultDescription || blk.activities || 'Routine school activity.'), size: 16, color: BRAND_COLORS.TEXT_BODY })];
    } else if (blk.teacherActivities || blk.learnerActivities) {
      actRuns = [
        new TextRun({ text: '• Teacher Facilitation: ', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK }),
        new TextRun({ text: `${cleanMarkdownText(blk.teacherActivities)}\n\n`, size: 16, color: BRAND_COLORS.TEXT_BODY }),
        new TextRun({ text: '• Learner Play Activities: ', bold: true, size: 16, color: BRAND_COLORS.GHANA_GREEN }),
        new TextRun({ text: `${cleanMarkdownText(blk.learnerActivities)}`, size: 16, color: BRAND_COLORS.TEXT_BODY })
      ];
      if (blk.playBasedTechnique) {
        actRuns.push(new TextRun({ text: `\n\n• Play Technique: `, bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK }));
        actRuns.push(new TextRun({ text: cleanMarkdownText(blk.playBasedTechnique), size: 15, color: BRAND_COLORS.TEXT_MUTED }));
      }
    } else {
      actRuns = [new TextRun({ text: cleanMarkdownText(blk.activities || blk.description || 'Play-based interactive engagement.'), size: 16, color: BRAND_COLORS.TEXT_BODY })];
    }

    return new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_LIGHT_BG },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: cleanBlockName, bold: true, size: 16, color: BRAND_COLORS.GHANA_GREEN }),
                ...(durationDisplay ? [new TextRun({ text: `(${durationDisplay})`, bold: true, size: 14, color: BRAND_COLORS.NAVY_DARK, break: 1 })] : [])
              ]
            })
          ]
        }),
        new TableCell({
          width: { size: 46, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: actRuns })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: cleanMarkdownText(blk.resources || blk.tlrs || 'Local materials'), size: 16, color: BRAND_COLORS.TEXT_BODY })] })]
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: table1CellBorder,
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: cleanMarkdownText(blk.assessment || blk.coreCompetency || blk.formativeCheck || 'Active Observation'), size: 16, color: BRAND_COLORS.TEXT_BODY })] })]
        })
      ]
    });
  });

  const table2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [table2HeaderRow, ...table2DataRows]
  });

  // Table 4: Post-Lesson Reflection & Evaluation
  const assessmentEvidence = cleanMarkdownText(planData.assessmentEvidence) || 'Evidence gathered via direct observation and manipulative handling during activities.';
  const learnersNeedingSupport = cleanMarkdownText(planData.learnersNeedingSupport) || 'Targeted multi-sensory support for learners experiencing difficulties.';

  const table4 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_COLORS.SLATE_HEADER_BG },
            borders: table1CellBorder,
            margins: { top: 70, bottom: 70, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: 'POST-LESSON REFLECTION & EVALUATION', bold: true, size: 16, color: BRAND_COLORS.NAVY_DARK })] })]
          })
        ]
      }),
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: table1CellBorder,
            margins: { top: 90, bottom: 90, left: 100, right: 100 },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: '• Assessment Evidence:\n', bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK }),
                  new TextRun({ text: `${assessmentEvidence}\n\n`, size: 15, color: BRAND_COLORS.TEXT_BODY }),
                  new TextRun({ text: '• Learners Needing Support:\n', bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK }),
                  new TextRun({ text: `${learnersNeedingSupport}\n\n`, size: 15, color: BRAND_COLORS.TEXT_BODY }),
                  new TextRun({ text: '• Teacher Reflection Prompts / Evaluation:\n', bold: true, size: 15, color: BRAND_COLORS.NAVY_DARK }),
                  new TextRun({ text: `${teacherReflection}`, size: 15, color: BRAND_COLORS.TEXT_BODY })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  const { header, footer } = createKGRunningHeaderAndFooter(weekNumber, className);

  const brandHeader = createKGBrandHeaderBanner({
    ...metadata,
    title: officialTitle,
    documentType: 'TeachSmartGH Kindergarten Daily Lesson Plan — Designed to Align with NaCCA/GES Requirements',
    subject: 'Integrated Curriculum (KG1 / KG2)',
    classLevel: className
  });

  const doc = new Document({
    creator: 'TeachSmartGH (Catalyst Creative)',
    title: `${officialTitle} - ${className}`,
    description: 'TeachSmartGH Kindergarten Daily Lesson Plan — Designed to Align with NaCCA/GES Requirements',
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.PORTRAIT },
            margin: { top: 600, bottom: 600, left: 600, right: 600 }
          }
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          brandHeader,
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: officialTitle, bold: true, size: 26, color: BRAND_COLORS.NAVY_DARK, font: 'Calibri' })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: 'INTEGRATED CURRICULUM • UNIVERSAL KG TIMETABLE MODEL', size: 16, color: BRAND_COLORS.GHANA_GREEN, bold: true, font: 'Calibri' })]
          }),
          table1,
          new Paragraph({ spacing: { after: 120 } }),
          table2,
          new Paragraph({ spacing: { after: 120 } }),
          table4
        ]
      }
    ]
  });

  const cleanClass = className.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanWeek = (weekNumber || '1').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `TeachSmartGH_KG_DailyLessonPlan_Week_${cleanWeek}_${cleanClass}.docx`;

  await downloadDocxBlob(doc, filename, 'KG Daily Lesson Plan (.docx) downloaded successfully! 📝');
}

/**
 * Dedicated Termly / Yearly Scheme of Learning Word Exporter (Landscape 11-column table fidelity)
 */
export async function exportSchemeToWord(
  schemeMarkdown: string,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const subject = metadata.subject || 'Subject';
  const classLevel = metadata.classLevel || 'Basic 7';
  const term = metadata.term || '1';

  await exportMarkdownToWord(schemeMarkdown, {
    ...metadata,
    title: `${subject} - Scheme of Learning (Term ${term})`,
    documentType: 'Scheme of Learning',
    subject,
    classLevel,
    term,
    orientation: 'landscape' // Full landscape 11-column table preservation
  });
}

/**
 * Dedicated Examination & Marking Scheme Word Exporter
 */
export async function exportExamToWord(
  examContent: string,
  type: 'exam' | 'marking',
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const subject = metadata.subject || 'Subject';
  const classLevel = metadata.classLevel || 'Basic 7';
  const term = metadata.term || '1';
  const docType = type === 'exam' ? 'Exam Question Paper' : 'Official Marking Scheme';

  await exportMarkdownToWord(examContent, {
    ...metadata,
    title: `${subject} - ${docType} (${classLevel})`,
    documentType: docType,
    subject,
    classLevel,
    term,
    orientation: 'portrait'
  });
}

/**
 * Dedicated Comprehensive Lesson / Student Notes Word Exporter
 */
export async function exportNoteToWord(
  noteContent: string,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const subject = metadata.subject || 'Subject';
  const classLevel = metadata.classLevel || 'Basic 7';
  const isLowerPrimary = ['Basic 1', 'Basic 2', 'Basic 3', 'B1', 'B2', 'B3'].includes(classLevel) ||
    (metadata.level === 'Primary' && ['1', '2', '3'].includes(classLevel.replace(/\D/g, '')));

  const docType = isLowerPrimary ? 'Lower Primary Learner Notes' : 'Comprehensive Lesson Notes';

  await exportMarkdownToWord(noteContent, {
    ...metadata,
    title: `${subject} - ${docType} (${classLevel})`,
    documentType: docType,
    subject,
    classLevel,
    orientation: 'portrait'
  });
}

/**
 * Dedicated Assignment / Homework / Project Rubric Word Exporter
 */
export async function exportAssignmentToWord(
  assignmentContent: string,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const subject = metadata.subject || 'Subject';
  const classLevel = metadata.classLevel || 'Basic 7';

  await exportMarkdownToWord(assignmentContent, {
    ...metadata,
    title: `${subject} - Homework & Assessment Assignment (${classLevel})`,
    documentType: 'Homework & Assignment Pack',
    subject,
    classLevel,
    orientation: 'portrait'
  });
}

/**
 * Dedicated Quick Quiz & Class Test Word Exporter
 */
export async function exportQuizToWord(
  quizContent: string,
  metadata: DocumentExportMetadata = {}
): Promise<void> {
  const subject = metadata.subject || 'Subject';
  const classLevel = metadata.classLevel || 'Basic 7';

  await exportMarkdownToWord(quizContent, {
    ...metadata,
    title: `${subject} - Quick Quiz & Class Test (${classLevel})`,
    documentType: 'Quick Quiz & Assessment',
    subject,
    classLevel,
    orientation: 'portrait'
  });
}

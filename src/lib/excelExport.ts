import ExcelJS from 'exceljs';

export interface StudentExcelRecord {
  id?: string;
  rank?: number;
  rollNumber?: string;
  name: string;
  gender?: 'male' | 'female' | string;
  classScore: number;
  examScore: number;
  total: number;
  grade: string;
  gradeDesc: string;
  attendance?: string;
  conduct?: string;
  attitude?: string;
  remark?: string;
}

export interface ExcelExportMetadata {
  documentTitle?: string;
  schoolName?: string;
  className?: string;
  subjectName?: string;
  selectedTerm?: string;
  academicYear?: string;
  classWeight?: number;
  examWeight?: number;
  gradingSystem?: 'ges_numeric' | 'letter';
  isFiltered?: boolean;
  filterLabel?: string;
}

// Color palette constants (ARGB hex strings for ExcelJS)
const COLORS = {
  NAVY_DARK: 'FF0F172A',      // Slate-900 / Deep Navy
  NAVY_HEADER: 'FF1E293B',    // Slate-800
  NAVY_LIGHT: 'FFE2E8F0',     // Slate-200
  GOLD_PRIMARY: 'FFD97706',   // Amber-600 / Gold
  GOLD_LIGHT: 'FFFEF3C7',     // Amber-100
  WHITE: 'FFFFFFFF',
  SLATE_BG_LIGHT: 'FFF8FAFC', // Slate-50
  SLATE_BORDER: 'FFCBD5E1',   // Slate-300
  SLATE_TEXT_MUTED: 'FF64748B',// Slate-500
  SLATE_TEXT_DARK: 'FF1E293B', // Slate-800
  EMERALD_BG: 'FFD1FAE5',     // Emerald-100
  EMERALD_FG: 'FF065F46',     // Emerald-800
  BLUE_BG: 'FFDBEAFE',        // Blue-100
  BLUE_FG: 'FF1E40AF',        // Blue-800
  AMBER_BG: 'FFFEF3C7',       // Amber-100
  AMBER_FG: 'FF92400E',       // Amber-800
  ROSE_BG: 'FFFEE2E2',        // Rose-100
  ROSE_FG: 'FF991B1B',        // Rose-800
};

/**
 * Gets grade color styles for Excel cells based on grade
 */
function getGradeCellStyle(grade: string | number) {
  const g = String(grade || '').trim().toUpperCase();
  if (['1', '2', 'A', 'B'].includes(g)) {
    return { bg: COLORS.EMERALD_BG, fg: COLORS.EMERALD_FG, label: 'Distinction' };
  }
  if (['3', '4', 'C'].includes(g)) {
    return { bg: COLORS.BLUE_BG, fg: COLORS.BLUE_FG, label: 'Credit' };
  }
  if (['5', '6', 'D'].includes(g)) {
    return { bg: COLORS.AMBER_BG, fg: COLORS.AMBER_FG, label: 'Pass' };
  }
  if (['7', '8', '9', 'E', 'F'].includes(g)) {
    return { bg: COLORS.ROSE_BG, fg: COLORS.ROSE_FG, label: 'Remedial' };
  }
  return { bg: COLORS.WHITE, fg: COLORS.SLATE_TEXT_DARK, label: 'Pending' };
}

/**
 * Generates and downloads a beautifully styled, high-impact Excel (.xlsx) file
 * with dynamic formulas (Total, Rank, Grade, Classification, Remarks & Statistics),
 * input validation, conditional formatting, and pre-formatted entry buffer rows
 * so teachers can add or edit students directly in Excel with full automated reactivity.
 */
export async function exportRosterToExcel(
  students: StudentExcelRecord[],
  metadata: ExcelExportMetadata = {}
): Promise<void> {
  const {
    documentTitle = 'Terminal Continuous Assessment & Examination Broad Sheet',
    schoolName = 'Ghana Model Basic School',
    className = 'Basic 7',
    subjectName = 'Integrated Science',
    selectedTerm = 'Term 1',
    academicYear = '2025/2026',
    classWeight = 30,
    examWeight = 70,
    gradingSystem = 'ges_numeric',
    isFiltered = false,
    filterLabel = 'All Grades'
  } = metadata;

  // 1. Create workbook & worksheet
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TeachSmartGH (Catalyst Creative)';
  workbook.lastModifiedBy = 'TeachSmartGH Teacher Assistant';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Set calc properties so Excel calculates all dynamic formulas upon opening
  workbook.calcProperties.fullCalcOnLoad = true;

  const sheet = workbook.addWorksheet('Terminal Broad Sheet', {
    views: [{ state: 'frozen', ySplit: 6 }], // Freeze header rows at row 6
    pageSetup: {
      orientation: 'landscape',
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });

  // 2. Define columns with precise auto-widths
  sheet.columns = [
    { key: 'rank', width: 11 },        // Col A: Position / Rank (Dynamic Formula)
    { key: 'roll', width: 14 },        // Col B: Roll Number
    { key: 'name', width: 28 },        // Col C: Student Name
    { key: 'gender', width: 12 },      // Col D: Gender
    { key: 'classScore', width: 18 },  // Col E: Class Assessment (30%)
    { key: 'examScore', width: 18 },   // Col F: Exam Score (70%)
    { key: 'total', width: 18 },       // Col G: Total Mark (100% - Dynamic Formula)
    { key: 'grade', width: 12 },       // Col H: Grade (Dynamic Formula)
    { key: 'gradeDesc', width: 22 },   // Col I: Performance Classification (Dynamic Formula)
    { key: 'attendance', width: 15 },  // Col J: Attendance
    { key: 'conduct', width: 20 },     // Col K: Conduct
    { key: 'attitude', width: 20 },    // Col L: Attitude
    { key: 'remark', width: 46 }       // Col M: Teacher's Remarks (Dynamic Formula / Custom)
  ];

  const totalCols = 13; // A to M

  // 3. ROW 1: School Name Header Banner
  const row1 = sheet.addRow([schoolName.toUpperCase()]);
  sheet.mergeCells(1, 1, 1, totalCols);
  row1.height = 32;
  const cell1 = sheet.getCell('A1');
  cell1.font = { name: 'Calibri', size: 16, bold: true, color: { argb: COLORS.WHITE } };
  cell1.alignment = { horizontal: 'center', vertical: 'middle' };
  cell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };

  // 4. ROW 2: Document Title Sub-banner
  const row2 = sheet.addRow([documentTitle.toUpperCase()]);
  sheet.mergeCells(2, 1, 2, totalCols);
  row2.height = 24;
  const cell2 = sheet.getCell('A2');
  cell2.font = { name: 'Calibri', size: 12, bold: true, color: { argb: COLORS.GOLD_PRIMARY } };
  cell2.alignment = { horizontal: 'center', vertical: 'middle' };
  cell2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };

  // 5. ROW 3: Academic Metadata Strip
  const metadataText = `CLASS: ${className.toUpperCase()}   |   SUBJECT: ${subjectName.toUpperCase()}   |   TERM: ${selectedTerm.toUpperCase()} (${academicYear})   |   REGISTERED PUPILS: ${students.length}`;
  const row3 = sheet.addRow([metadataText]);
  sheet.mergeCells(3, 1, 3, totalCols);
  row3.height = 20;
  const cell3 = sheet.getCell('A3');
  cell3.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: COLORS.SLATE_TEXT_DARK } };
  cell3.alignment = { horizontal: 'center', vertical: 'middle' };
  cell3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_LIGHT } };

  // 6. ROW 4: Assessment Weighting & Grading Guidelines
  const gradingSchemeText = gradingSystem === 'ges_numeric'
    ? 'GES 1-9 Standard Scale (1 = Highest / Distinction, 9 = Lowest)'
    : 'Standard Letter Scale (A+ = Distinction, F = Fail)';
  const weightsText = `ASSESSMENT WEIGHTS: Class Continuous Assessment (${classWeight}%)  +  End-of-Term Examination (${examWeight}%)  =  100%  •  GRADING: ${gradingSchemeText}${isFiltered ? `  •  FILTER: [${filterLabel}]` : ''}`;
  const row4 = sheet.addRow([weightsText]);
  sheet.mergeCells(4, 1, 4, totalCols);
  row4.height = 18;
  const cell4 = sheet.getCell('A4');
  cell4.font = { name: 'Calibri', size: 8.5, italic: true, color: { argb: COLORS.SLATE_TEXT_MUTED } };
  cell4.alignment = { horizontal: 'center', vertical: 'middle' };
  cell4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_BG_LIGHT } };

  // 7. ROW 5: Live Formula & Smart Editing Guide Notice
  const guideText = '⚡ DYNAMIC EXCEL TEMPLATE: You can add new student names & marks directly into empty rows below. Totals, Ranks, Grades, Remarks, and Summary Statistics will calculate automatically.';
  const row5 = sheet.addRow([guideText]);
  sheet.mergeCells(5, 1, 5, totalCols);
  row5.height = 18;
  const cell5 = sheet.getCell('A5');
  cell5.font = { name: 'Calibri', size: 8.5, bold: true, color: { argb: 'FF047857' } }; // Emerald-700
  cell5.alignment = { horizontal: 'center', vertical: 'middle' };
  cell5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Emerald-50

  // 8. ROW 6: Table Column Headers
  const headers = [
    'Position',
    'Roll No.',
    'Student Full Name',
    'Gender',
    `Class Mark (${classWeight}%)`,
    `Exam Mark (${examWeight}%)`,
    'Total (100%)',
    'Grade',
    'Classification',
    'Attendance',
    'Conduct',
    'Attitude',
    "Teacher's Remarks / Evaluation"
  ];

  const headerRow = sheet.addRow(headers);
  headerRow.height = 26;

  headerRow.eachCell((cell, colNumber) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLORS.WHITE } };
    cell.alignment = {
      horizontal: [1, 2, 4, 8, 10].includes(colNumber) ? 'center' : [5, 6, 7].includes(colNumber) ? 'right' : 'left',
      vertical: 'middle',
      wrapText: true
    };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_HEADER } };
    cell.border = {
      top: { style: 'medium', color: { argb: COLORS.NAVY_DARK } },
      bottom: { style: 'medium', color: { argb: COLORS.GOLD_PRIMARY } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // Calculate table data row boundaries (Data starts at Row 7)
  const startDataRow = 7;
  // Include existing students PLUS 20 extra formatted buffer rows (or at least 45 total pupil rows)
  const bufferRowCount = 20;
  const totalRosterRows = Math.max(students.length + bufferRowCount, 45);
  const endDataRow = startDataRow + totalRosterRows - 1;

  // AutoFilter covering the entire active and buffer data range
  sheet.autoFilter = {
    from: { row: 6, column: 1 },
    to: { row: endDataRow, column: totalCols }
  };

  // 9. FORMULA GENERATORS FOR CELLS
  // Total Score Formula: =IF(C7="","",E7+F7)
  const getTotalFormula = (r: number) => `IF(C${r}="","",E${r}+F${r})`;

  // Dynamic Rank Formula across the full data range $G$7:$G${endDataRow}
  const getRankFormula = (r: number) => `IF(OR(C${r}="",G${r}=""),"",RANK(G${r},$G$${startDataRow}:$G$${endDataRow}))`;

  // Grade Formula (GES 1-9 Numeric scale or Letter scale)
  const getGradeFormula = (r: number) => {
    if (gradingSystem === 'ges_numeric') {
      return `IF(OR(C${r}="",G${r}=""),"",IF(G${r}>=80,1,IF(G${r}>=70,2,IF(G${r}>=65,3,IF(G${r}>=60,4,IF(G${r}>=50,5,IF(G${r}>=45,6,IF(G${r}>=40,7,IF(G${r}>=35,8,9)))))))))`;
    } else {
      return `IF(OR(C${r}="",G${r}=""),"",IF(G${r}>=80,"A",IF(G${r}>=70,"B",IF(G${r}>=60,"C",IF(G${r}>=50,"D",IF(G${r}>=40,"E","F"))))))`;
    }
  };

  // Performance Classification Formula
  const getClassificationFormula = (r: number) => {
    if (gradingSystem === 'ges_numeric') {
      return `IF(OR(C${r}="",H${r}=""),"",IF(H${r}<=2,"Distinction",IF(H${r}<=4,"Credit",IF(H${r}<=6,"Pass","Remedial"))))`;
    } else {
      return `IF(OR(C${r}="",H${r}=""),"",IF(OR(H${r}="A",H${r}="B"),"Distinction",IF(H${r}="C","Credit",IF(H${r}="D","Pass","Remedial"))))`;
    }
  };

  // Dynamic Pedagogical Remark Formula (Used if no custom comment is provided)
  const getRemarkFormula = (r: number) => {
    if (gradingSystem === 'ges_numeric') {
      return `IF(OR(C${r}="",H${r}=""),"",IF(H${r}<=2,"Outstanding performance with exemplary subject mastery and leadership.",IF(H${r}<=4,"Good academic progress and understanding. Shows consistent effort.",IF(H${r}<=6,"Satisfactory effort. Recommended for extra exercises and independent revision.","Requires extra attention and dedicated remedial support on foundational topics."))))`;
    } else {
      return `IF(OR(C${r}="",H${r}=""),"",IF(OR(H${r}="A",H${r}="B"),"Outstanding performance with exemplary subject mastery and leadership.",IF(H${r}="C","Good academic progress and understanding. Shows consistent effort.",IF(H${r}="D","Satisfactory effort. Recommended for extra exercises and independent revision.","Requires extra attention and dedicated remedial support on foundational topics."))))`;
    }
  };

  // 10. POPULATE DATA ROWS (Existing Students + Pre-formatted Empty Dynamic Rows)
  for (let i = 0; i < totalRosterRows; i++) {
    const rowNum = startDataRow + i;
    const isEven = i % 2 === 0;
    const isZebra = isEven ? COLORS.WHITE : COLORS.SLATE_BG_LIGHT;
    const hasStudent = i < students.length;
    const student = hasStudent ? students[i] : null;

    // Roll number default
    const rollDefault = student?.rollNumber || `GH-${String(i + 1).padStart(3, '0')}`;
    const studentName = student ? student.name : '';
    const studentGender = student ? (student.gender === 'female' ? 'Female' : 'Male') : '';
    const studentClassScore = student ? student.classScore : null;
    const studentExamScore = student ? student.examScore : null;
    const studentAttendance = student?.attendance || '';
    const studentConduct = student?.conduct || '';
    const studentAttitude = student?.attitude || '';

    // Row construction with real Excel formulas and fallback initial evaluation results
    const row = sheet.addRow([
      // Col 1 (A): Position / Rank
      { formula: getRankFormula(rowNum), result: student?.rank || undefined },
      // Col 2 (B): Roll Number
      rollDefault,
      // Col 3 (C): Student Full Name
      studentName,
      // Col 4 (D): Gender
      studentGender,
      // Col 5 (E): Class Score
      studentClassScore !== null ? studentClassScore : '',
      // Col 6 (F): Exam Score
      studentExamScore !== null ? studentExamScore : '',
      // Col 7 (G): Total Mark
      { formula: getTotalFormula(rowNum), result: student?.total || undefined },
      // Col 8 (H): Grade
      { formula: getGradeFormula(rowNum), result: student ? (gradingSystem === 'ges_numeric' ? Number(student.grade) || student.grade : student.grade) : undefined },
      // Col 9 (I): Performance Classification
      { formula: getClassificationFormula(rowNum), result: student?.gradeDesc || undefined },
      // Col 10 (J): Attendance
      studentAttendance,
      // Col 11 (K): Conduct
      studentConduct,
      // Col 12 (L): Attitude
      studentAttitude,
      // Col 13 (M): Remark
      student?.remark
        ? student.remark
        : { formula: getRemarkFormula(rowNum), result: undefined }
    ]);

    row.height = 22;

    // Apply cell formatting, styling, number formats, borders and data validations
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10, color: { argb: COLORS.SLATE_TEXT_DARK } };
      cell.border = {
        top: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        bottom: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        left: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        right: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } }
      };

      if (colNumber === 1) {
        // Position / Rank
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLORS.NAVY_DARK } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      } else if (colNumber === 2) {
        // Roll No.
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 9.5, color: { argb: COLORS.SLATE_TEXT_MUTED } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      } else if (colNumber === 3) {
        // Name
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLORS.SLATE_TEXT_DARK } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      } else if (colNumber === 4) {
        // Gender
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
        // Dropdown data validation for Gender
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Male,Female"'],
          showErrorMessage: true,
          errorTitle: 'Invalid Gender',
          error: 'Please select Male or Female from the dropdown.'
        };
      } else if (colNumber === 5 || colNumber === 6) {
        // Class Score & Exam Score
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '0.0';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };

        // Data validation for max score
        const maxScore = colNumber === 5 ? classWeight : examWeight;
        const scoreType = colNumber === 5 ? 'Class Assessment' : 'Examination';
        cell.dataValidation = {
          type: 'decimal',
          operator: 'between',
          allowBlank: true,
          formulae: ['0', `${maxScore}`],
          showErrorMessage: true,
          errorTitle: 'Invalid Score',
          error: `${scoreType} score must be a number between 0 and ${maxScore}.`
        };
      } else if (colNumber === 7) {
        // Total Score
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: COLORS.NAVY_DARK } };
        cell.numFmt = '0.0';
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEven ? 'FFF1F5F9' : 'FFE2E8F0' }
        };
      } else if (colNumber === 8) {
        // Grade (Pill-like color styling for initial student records)
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: COLORS.SLATE_TEXT_DARK } };
        if (student) {
          const gradeStyle = getGradeCellStyle(student.grade);
          cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: gradeStyle.fg } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: gradeStyle.bg } };
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
        }
      } else if (colNumber === 9) {
        // Classification
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.font = { name: 'Calibri', size: 9.5, italic: true, color: { argb: COLORS.SLATE_TEXT_DARK } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      } else if (colNumber === 10) {
        // Attendance
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      } else if (colNumber === 11 || colNumber === 12) {
        // Conduct & Attitude
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
        // Quick dropdown validation for Conduct/Attitude
        if (colNumber === 11) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Exemplary,Very Good,Good,Satisfactory,Needs Improvement"']
          };
        } else {
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Diligent & Dedicated,Hardworking & Attentive,Inquisitive & Creative,Cooperative,Willing to Learn,Needs Guidance"']
          };
        }
      } else if (colNumber === 13) {
        // Remarks
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        cell.font = { name: 'Calibri', size: 9.5, color: { argb: COLORS.SLATE_TEXT_DARK } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isZebra } };
      }
    });
  }

  // 11. CONDITIONAL FORMATTING FOR GRADE COLUMN (Col H)
  // Dynamic cell color highlights as teachers enter or modify marks in Excel
  if (gradingSystem === 'ges_numeric') {
    sheet.addConditionalFormatting({
      ref: `H${startDataRow}:H${endDataRow}`,
      rules: [
        {
          priority: 1,
          type: 'cellIs',
          operator: 'lessThan',
          formulae: ['3'],
          style: {
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: COLORS.EMERALD_BG } },
            font: { color: { argb: COLORS.EMERALD_FG }, bold: true }
          }
        },
        {
          priority: 2,
          type: 'cellIs',
          operator: 'between',
          formulae: ['3', '4'],
          style: {
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: COLORS.BLUE_BG } },
            font: { color: { argb: COLORS.BLUE_FG }, bold: true }
          }
        },
        {
          priority: 3,
          type: 'cellIs',
          operator: 'between',
          formulae: ['5', '6'],
          style: {
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: COLORS.AMBER_BG } },
            font: { color: { argb: COLORS.AMBER_FG }, bold: true }
          }
        },
        {
          priority: 4,
          type: 'cellIs',
          operator: 'greaterThan',
          formulae: ['6'],
          style: {
            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: COLORS.ROSE_BG } },
            font: { color: { argb: COLORS.ROSE_FG }, bold: true }
          }
        }
      ]
    });
  }

  // 12. DYNAMIC EXECUTIVE STATISTICAL SUMMARY & PERFORMANCE SECTION
  // Blank separator row
  sheet.addRow([]);

  // Summary Header Banner
  const summaryHeaderRow = sheet.addRow(['EXECUTIVE CLASS PERFORMANCE & STATISTICAL SUMMARY (LIVE FORMULAS)']);
  const sumHeaderRowNum = summaryHeaderRow.number;
  sheet.mergeCells(sumHeaderRowNum, 1, sumHeaderRowNum, totalCols);
  summaryHeaderRow.height = 22;
  const sumHeaderCell = sheet.getCell(`A${sumHeaderRowNum}`);
  sumHeaderCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: COLORS.WHITE } };
  sumHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sumHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };

  // Calculate dynamic formulas over the entire data range
  const nameRange = `C${startDataRow}:C${endDataRow}`;
  const genderRange = `D${startDataRow}:D${endDataRow}`;
  const totalScoreRange = `G${startDataRow}:G${endDataRow}`;

  // Metric Summary Row 1 (Enrolment, Boys, Girls, Average)
  const metricRow1 = sheet.addRow([
    'Total Enrolment:',
    { formula: `COUNTA(${nameRange})`, result: students.length },
    '',
    'Boys (Male):',
    { formula: `COUNTIF(${genderRange},"Male")`, result: students.filter(s => (s.gender || 'male').toLowerCase().startsWith('m')).length },
    '',
    'Girls (Female):',
    { formula: `COUNTIF(${genderRange},"Female")`, result: students.filter(s => (s.gender || '').toLowerCase().startsWith('f')).length },
    '',
    'Class Average Score:',
    {
      formula: `IFERROR(AVERAGE(${totalScoreRange}),0)`,
      result: students.length > 0 ? students.reduce((acc, s) => acc + s.total, 0) / students.length : 0
    }
  ]);
  metricRow1.height = 20;
  applyMetricStyles(metricRow1, true); // true for average format

  // Metric Summary Row 2 (Highest, Lowest, Passed, Pass Rate)
  const metricRow2 = sheet.addRow([
    'Highest Score:',
    {
      formula: `IFERROR(MAX(${totalScoreRange}),0)`,
      result: students.length > 0 ? Math.max(...students.map(s => s.total)) : 0
    },
    '',
    'Lowest Score:',
    {
      formula: `IFERROR(MIN(${totalScoreRange}),0)`,
      result: students.length > 0 ? Math.min(...students.map(s => s.total)) : 0
    },
    '',
    'Total Passed:',
    {
      formula: `IFERROR(COUNTIF(${totalScoreRange},">=50"),0)`,
      result: students.filter(s => s.total >= 50).length
    },
    '',
    'Overall Pass Rate:',
    {
      formula: `IFERROR(COUNTIF(${totalScoreRange},">=50")/MAX(1,COUNTA(${nameRange})),0)`,
      result: students.length > 0 ? students.filter(s => s.total >= 50).length / students.length : 0
    }
  ]);
  metricRow2.height = 20;
  applyMetricStyles(metricRow2, false, true); // percentage format on last col

  // 13. FOOTER & CREDITS
  const footerRowIndex = sheet.rowCount + 2;
  const footerRow = sheet.getRow(footerRowIndex);
  footerRow.getCell(1).value = `Generated via TeachSmartGH • Catalyst Creative • Official NaCCA Curriculum & GES Assessment Framework • Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  sheet.mergeCells(footerRowIndex, 1, footerRowIndex, totalCols);
  const footerCell = sheet.getCell(`A${footerRowIndex}`);
  footerCell.font = { name: 'Calibri', size: 8, italic: true, color: { argb: COLORS.SLATE_TEXT_MUTED } };
  footerCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // 14. Trigger browser download of buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const cleanTitle = documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 25);
  const cleanClass = className.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanSubj = subjectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `TeachSmartGH_${cleanTitle}_${cleanClass}_${cleanSubj}.xlsx`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses an uploaded .xlsx or .xls file into standard CSV text
 * allowing the existing robust parser to extract rows, headers, and document titles seamlessly.
 */
export async function parseExcelFileToCSV(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) return '';

    const lines: string[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const values: string[] = [];
      const maxCol = Math.max(row.cellCount, 15);
      for (let colNumber = 1; colNumber <= maxCol; colNumber++) {
        const cell = row.getCell(colNumber);
        let cellVal = '';
        if (cell.value !== null && cell.value !== undefined) {
          if (typeof cell.value === 'object') {
            if ('result' in cell.value && cell.value.result !== undefined && cell.value.result !== null) {
              cellVal = String(cell.value.result);
            } else if ('text' in cell.value && cell.value.text !== undefined && cell.value.text !== null) {
              cellVal = String(cell.value.text);
            } else if (cell.value instanceof Date) {
              cellVal = cell.value.toLocaleDateString();
            } else {
              cellVal = String(cell.text || '');
            }
          } else {
            cellVal = String(cell.value);
          }
        }
        values.push(`"${cellVal.replace(/"/g, '""')}"`);
      }
      if (values.some(v => v !== '""')) {
        lines.push(values.join(','));
      }
    });

    return lines.join('\r\n');
  } catch (err) {
    console.error('Failed to parse Excel file:', err);
    throw new Error('Could not parse Excel document. Please ensure it is a valid .xlsx file.');
  }
}

/**
 * Generates and downloads a beautifully styled, formatted Excel Template (.xlsx)
 * with sample Ghanaian students or blank rows ready for instant class mark entry.
 */
export async function exportTemplateToExcel(
  options: {
    className?: string;
    classWeight?: number;
    examWeight?: number;
    customTitle?: string;
    schoolName?: string;
    subjectName?: string;
    termName?: string;
    academicYear?: string;
    isTemplateBlank?: boolean;
  } = {}
): Promise<void> {
  const {
    className = 'Basic 7',
    classWeight = 30,
    examWeight = 70,
    customTitle = 'Terminal Continuous Assessment & Examination Broad Sheet',
    schoolName = 'Ghana Model Basic School',
    subjectName = 'Integrated Science',
    termName = 'Term 1',
    academicYear = '2025/2026',
    isTemplateBlank = false
  } = options;

  let templateStudents: StudentExcelRecord[] = [];

  if (isTemplateBlank) {
    templateStudents = [];
  } else {
    // Sample Ghanaian pupils with realistic continuous assessment marks
    templateStudents = [
      {
        rank: 1,
        rollNumber: 'GH-001',
        name: 'Ama Serwaa',
        gender: 'female',
        classScore: 27.5,
        examScore: 65.0,
        total: 92.5,
        grade: '1',
        gradeDesc: 'Highest Distinction',
        attendance: '60/60',
        conduct: 'Exemplary',
        attitude: 'Diligent & Dedicated',
        remark: 'Outstanding academic mastery with exceptional problem-solving skills and peer leadership.'
      },
      {
        rank: 2,
        rollNumber: 'GH-002',
        name: 'Kwame Mensah',
        gender: 'male',
        classScore: 25.0,
        examScore: 59.0,
        total: 84.0,
        grade: '1',
        gradeDesc: 'Distinction',
        attendance: '58/60',
        conduct: 'Very Good & Respectful',
        attitude: 'Hardworking & Attentive',
        remark: 'Consistently participates in class discussions and shows strong analytical ability.'
      },
      {
        rank: 3,
        rollNumber: 'GH-003',
        name: 'Akosua Darko',
        gender: 'female',
        classScore: 23.5,
        examScore: 55.0,
        total: 78.5,
        grade: '2',
        gradeDesc: 'Distinction',
        attendance: '59/60',
        conduct: 'Excellent',
        attitude: 'Inquisitive & Creative',
        remark: 'Demonstrates thorough comprehension of practical science activities.'
      },
      {
        rank: 4,
        rollNumber: 'GH-004',
        name: 'Yaw Boateng',
        gender: 'male',
        classScore: 21.0,
        examScore: 49.5,
        total: 70.5,
        grade: '3',
        gradeDesc: 'High Credit',
        attendance: '56/60',
        conduct: 'Good',
        attitude: 'Cooperative',
        remark: 'Active in group tasks. Regular revision will elevate overall performance.'
      },
      {
        rank: 5,
        rollNumber: 'GH-005',
        name: 'Abena Osei',
        gender: 'female',
        classScore: 19.5,
        examScore: 45.0,
        total: 64.5,
        grade: '4',
        gradeDesc: 'Credit',
        attendance: '54/60',
        conduct: 'Satisfactory',
        attitude: 'Willing to Learn',
        remark: 'Shows steady progress. Needs more practice with numerical word problems.'
      },
      {
        rank: 6,
        rollNumber: 'GH-006',
        name: 'Kofi Owusu',
        gender: 'male',
        classScore: 16.0,
        examScore: 40.0,
        total: 56.0,
        grade: '5',
        gradeDesc: 'Pass',
        attendance: '51/60',
        conduct: 'Good',
        attitude: 'Needs Guidance',
        remark: 'Good potential; encouraged to submit all homework assignments on time.'
      }
    ];
  }

  await exportRosterToExcel(templateStudents, {
    documentTitle: customTitle,
    schoolName,
    className,
    subjectName,
    selectedTerm: termName,
    academicYear,
    classWeight,
    examWeight,
    gradingSystem: 'ges_numeric'
  });
}

/**
 * Helper to apply clean styling to metric summary rows
 */
function applyMetricStyles(row: ExcelJS.Row, isAvgRow = false, isPassRateRow = false) {
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.border = {
      top: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
      bottom: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
      left: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
      right: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } }
    };

    // Label Columns (Col 1, 4, 7, 10)
    if ([1, 4, 7, 10].includes(colNumber)) {
      cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: COLORS.SLATE_TEXT_MUTED } };
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_BG_LIGHT } };
    }
    // Value Columns (Col 2, 5, 8, 11)
    else if ([2, 5, 8, 11].includes(colNumber)) {
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: COLORS.NAVY_DARK } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.WHITE } };

      if (isAvgRow && colNumber === 11) {
        cell.numFmt = '0.0"%"';
      } else if (!isAvgRow && (colNumber === 2 || colNumber === 5)) {
        cell.numFmt = '0.0"%"';
      } else if (isPassRateRow && colNumber === 11) {
        cell.numFmt = '0.0%';
      }
    } else {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_BG_LIGHT } };
    }
  });
}

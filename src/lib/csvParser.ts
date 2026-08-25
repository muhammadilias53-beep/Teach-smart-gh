/**
 * TeachSmart Ghana - CSV / TSV Student Roster & Assessment Parser
 * Supports official GES & NaCCA continuous assessment and terminal report formats.
 */

export interface ParsedStudentRow {
  name: string;
  gender?: 'male' | 'female';
  rollNumber?: string;
  classScore: number;
  examScore: number;
  attendance?: string;
  conduct?: string;
  attitude?: string;
  remark?: string;
  isValid: boolean;
  validationError?: string;
}

export interface CSVParseResult {
  rows: ParsedStudentRow[];
  headersFound: string[];
  totalParsed: number;
  validCount: number;
  hasScores: boolean;
  warnings: string[];
  documentTitle?: string;
}

export interface CSVExportOptions {
  title?: string;
  schoolName?: string;
  className?: string;
  subjectName?: string;
  termName?: string;
  academicYear?: string;
  classWeight?: number;
  examWeight?: number;
  gradingSystem?: 'ges_numeric' | 'letter';
  includeMetadataBlock?: boolean;
}

/**
 * Robust RFC-4180 compliant CSV & TSV line parser.
 * Correctly handles quotes, commas/tabs within quotes, and multiple delimiters.
 */
export function parseCSVToRows(rawText: string): string[][] {
  const cleanText = rawText.replace(/^\uFEFF/, '').trim(); // Remove UTF-8 BOM if present
  if (!cleanText) return [];

  // Determine delimiter: comma, tab, or semicolon
  const lines = cleanText.split(/\r?\n/).filter(l => l.trim().length > 0 && !l.trim().startsWith('#'));
  const firstDataLine = lines[0] || '';
  let delimiter = ',';
  if (firstDataLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstDataLine.includes(';') && !firstDataLine.includes(',')) {
    delimiter = ';';
  }

  const result: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i++; // Skip next quote
        } else {
          // End of quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // Skip \n
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          result.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          result.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Last field/row if any
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      result.push(currentRow);
    }
  }

  return result;
}

/**
 * Normalizes header string to find matching known schema fields.
 */
function matchHeaderField(header: string): string | null {
  const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Student Name
  if (['name', 'studentname', 'fullname', 'learnername', 'student', 'pupilname', 'pupil', 'learner', 'studentfullname'].includes(norm)) {
    return 'name';
  }

  // Gender / Sex
  if (['gender', 'sex', 'mf'].includes(norm)) {
    return 'gender';
  }

  // Roll Number / ID / Reg
  if (['roll', 'rollnumber', 'rollno', 'id', 'studentid', 'indexno', 'indexnumber', 'regno', 'registrationnumber', 'studentnumber'].includes(norm)) {
    return 'rollNumber';
  }

  // Class Score / SBA / Continuous Assessment
  if ([
    'classscore', 'classmark', 'sba', 'sbascore', 'continuousassessment', 'ca', 
    'cascore', 'classassessment', 'continuousassessmentscore', '30score', 'classscore30', 'sba30',
    'classscoremax30', 'classscoremax50'
  ].includes(norm)) {
    return 'classScore';
  }

  // Exam Score / End of Term Exam
  if ([
    'examscore', 'exammark', 'exam', 'endoftermexam', 'terminalexam', 
    'endofterm', 'examination', 'exam70', 'examscore70', 'examscoremax70', 'examscoremax50'
  ].includes(norm)) {
    return 'examScore';
  }

  // Attendance
  if (['attendance', 'dayspresent', 'presence', 'daysattended', 'schoolattendance'].includes(norm)) {
    return 'attendance';
  }

  // Conduct / Behaviour
  if (['conduct', 'behaviour', 'behavior', 'discipline'].includes(norm)) {
    return 'conduct';
  }

  // Attitude / Interest
  if (['attitude', 'interest', 'attitudetowork', 'disposition'].includes(norm)) {
    return 'attitude';
  }

  // Remarks / Comments
  if (['remark', 'remarks', 'teacherremark', 'teachersremark', 'comment', 'comments', 'evaluation'].includes(norm)) {
    return 'remark';
  }

  return null;
}

/**
 * Parses raw text or CSV matrix into structured Student records.
 * Supports metadata blocks, comment headers, and flexible table column layouts.
 */
export function parseStudentCSV(
  csvText: string,
  classWeight: number = 30,
  examWeight: number = 70
): CSVParseResult {
  const matrix = parseCSVToRows(csvText);
  const warnings: string[] = [];

  if (matrix.length === 0) {
    return {
      rows: [],
      headersFound: [],
      totalParsed: 0,
      validCount: 0,
      hasScores: false,
      warnings: ['File or text contains no readable rows.']
    };
  }

  let documentTitle: string | undefined = undefined;

  // Find the header row in case metadata/title lines precede the table
  let headerRowIndex = -1;
  let headerMap: { [colIndex: number]: string } = {};

  for (let r = 0; r < Math.min(matrix.length, 10); r++) {
    const row = matrix[r];
    
    // Check if row is a metadata title row
    const firstCell = (row[0] || '').trim();
    if (firstCell.toLowerCase().startsWith('title:') || firstCell.toLowerCase().startsWith('# document title:')) {
      documentTitle = firstCell.replace(/^(title:|# document title:)/i, '').trim();
    }

    const matchedFields = row.map(h => matchHeaderField(h));
    const hasNameOrRoll = matchedFields.includes('name') || matchedFields.includes('rollNumber');
    const matchedCount = matchedFields.filter(f => f !== null).length;

    if (hasNameOrRoll && matchedCount >= 1) {
      headerRowIndex = r;
      row.forEach((h, idx) => {
        const match = matchHeaderField(h);
        if (match) headerMap[idx] = match;
      });
      break;
    }
  }

  let dataRows: string[][] = [];

  if (headerRowIndex >= 0) {
    dataRows = matrix.slice(headerRowIndex + 1);
  } else {
    // If no explicit header row was detected, check the first row format:
    // If first row has pure numbers in first column, assume [Roll, Name, Gender, ClassScore, ExamScore]
    if (matrix.length > 0 && /^\d+$/.test(matrix[0][0]) && matrix[0].length > 1) {
      headerMap[0] = 'rollNumber';
      headerMap[1] = 'name';
      if (matrix[0].length > 2) headerMap[2] = 'gender';
      if (matrix[0].length > 3) headerMap[3] = 'classScore';
      if (matrix[0].length > 4) headerMap[4] = 'examScore';
      dataRows = matrix;
    } else {
      headerMap[0] = 'name';
      if (matrix[0].length > 1) headerMap[1] = 'gender';
      if (matrix[0].length > 2) headerMap[2] = 'classScore';
      if (matrix[0].length > 3) headerMap[3] = 'examScore';
      dataRows = matrix;
    }
  }

  const parsedRows: ParsedStudentRow[] = [];
  let hasScores = false;

  dataRows.forEach((row, rowIndex) => {
    // Skip empty lines or comment/separator lines
    if (row.length === 0 || row.every(cell => !cell.trim()) || row[0]?.startsWith('#') || row[0]?.startsWith('===')) {
      return;
    }

    let name = '';
    let gender: 'male' | 'female' = 'male';
    let rollNumber: string | undefined = undefined;
    let classScore = 0;
    let examScore = 0;
    let attendance = '—';
    let conduct = 'Good';
    let attitude = 'Attentive';
    let remark: string | undefined = undefined;

    // Extract by header mapping
    row.forEach((val, colIdx) => {
      const field = headerMap[colIdx];
      const cleanVal = (val || '').trim();

      if (field === 'name') {
        // Strip numbered prefixes like "1. ", "01-", etc. if present
        name = cleanVal.replace(/^[\d.)\s-]+/, '').trim();
      } else if (field === 'gender') {
        const g = cleanVal.toLowerCase();
        if (g === 'f' || g === 'female' || g === 'girl') {
          gender = 'female';
        } else {
          gender = 'male';
        }
      } else if (field === 'rollNumber') {
        rollNumber = cleanVal || undefined;
      } else if (field === 'classScore') {
        const parsedNum = parseFloat(cleanVal);
        if (!isNaN(parsedNum)) {
          classScore = Math.max(0, Math.min(classWeight, Math.round(parsedNum * 10) / 10));
          hasScores = true;
          if (parsedNum > classWeight) {
            warnings.push(`Row ${rowIndex + 1} (${name || 'Student'}): Class score ${parsedNum} was clamped to max ${classWeight}%.`);
          }
        }
      } else if (field === 'examScore') {
        const parsedNum = parseFloat(cleanVal);
        if (!isNaN(parsedNum)) {
          examScore = Math.max(0, Math.min(examWeight, Math.round(parsedNum * 10) / 10));
          hasScores = true;
          if (parsedNum > examWeight) {
            warnings.push(`Row ${rowIndex + 1} (${name || 'Student'}): Exam score ${parsedNum} was clamped to max ${examWeight}%.`);
          }
        }
      } else if (field === 'attendance') {
        attendance = cleanVal || '—';
      } else if (field === 'conduct') {
        conduct = cleanVal || 'Good';
      } else if (field === 'attitude') {
        attitude = cleanVal || 'Attentive';
      } else if (field === 'remark') {
        remark = cleanVal || undefined;
      }
    });

    // Fallback: If name wasn't mapped via headers, use the first non-numeric non-empty cell
    if (!name && row.length > 0) {
      const firstNonNum = row.find(c => c && isNaN(Number(c)));
      if (firstNonNum) {
        name = firstNonNum.replace(/^[\d.)\s-]+/, '').trim();
      }
    }

    const isValid = name.length >= 2;
    const validationError = isValid ? undefined : 'Student name is too short or missing.';

    parsedRows.push({
      name,
      gender,
      rollNumber,
      classScore,
      examScore,
      attendance,
      conduct,
      attitude,
      remark,
      isValid,
      validationError
    });
  });

  const validCount = parsedRows.filter(r => r.isValid).length;
  const headersFound = Object.values(headerMap);

  return {
    rows: parsedRows,
    headersFound,
    totalParsed: parsedRows.length,
    validCount,
    hasScores,
    warnings: Array.from(new Set(warnings)),
    documentTitle
  };
}

/**
 * Generates an official, beautifully formatted CSV sample template for Ghanaian teachers.
 * Includes official document title header and properly formatted cell values.
 */
export function generateSampleRosterCSV(options: CSVExportOptions = {}): string {
  const {
    title = 'Terminal Continuous Assessment & Examination Broad Sheet',
    schoolName = 'Ghana Model Basic School',
    className = 'Basic 7',
    subjectName = 'Integrated Science',
    termName = 'Term 1',
    academicYear = '2025/2026',
    classWeight = 30,
    examWeight = 70,
    includeMetadataBlock = true
  } = options;

  const metadataLines: string[] = [];

  if (includeMetadataBlock) {
    metadataLines.push(`"DOCUMENT TITLE: ${title.replace(/"/g, '""')}"`);
    metadataLines.push(`"SCHOOL: ${schoolName.replace(/"/g, '""')} | CLASS: ${className} | SUBJECT: ${subjectName} | TERM: ${termName} (${academicYear})"`);
    metadataLines.push(`"ASSESSMENT WEIGHTS: Class Continuous Assessment (${classWeight}%) | End-of-Term Examination (${examWeight}%)"`);
    metadataLines.push(`"CURRICULUM STANDARD: Official Ghana Education Service (GES) & NaCCA Continuous Assessment Framework"`);
    metadataLines.push(''); // Blank line separator before tabular columns
  }

  const headers = [
    'Roll Number',
    'Student Name',
    'Gender (M/F)',
    `Class Score [Max ${classWeight}%]`,
    `Exam Score [Max ${examWeight}%]`,
    'Attendance (e.g. 58/60)',
    'Conduct',
    'Attitude',
    'Teacher Remarks'
  ];

  const sampleRows = [
    ['GH-001', 'Kwame Mensah', 'Male', '24.5', '58.0', '58/60', 'Very Good & Respectful', 'Hardworking & Attentive', 'Consistently participates in class discussions and shows strong analytical ability.'],
    ['GH-002', 'Ama Serwaa', 'Female', '27.0', '64.5', '60/60', 'Exemplary', 'Diligent & Dedicated', 'Outstanding academic mastery with exceptional problem-solving skills and leadership.'],
    ['GH-003', 'Kofi Owusu', 'Male', '18.0', '42.0', '52/60', 'Satisfactory', 'Needs Guidance', 'Good potential; encouraged to submit all homework assignments on time.'],
    ['GH-004', 'Akosua Darko', 'Female', '26.0', '61.5', '59/60', 'Excellent', 'Inquisitive & Creative', 'Demonstrates thorough comprehension of practical science activities.'],
    ['GH-005', 'Yaw Boateng', 'Male', '21.5', '49.0', '55/60', 'Good', 'Cooperative', 'Active in group tasks. Regular revision will elevate overall performance.']
  ];

  const formattedRows = sampleRows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  );

  const allLines = [
    ...metadataLines,
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...formattedRows
  ];

  return '\uFEFF' + allLines.join('\r\n'); // UTF-8 BOM for perfect Excel / spreadsheet formatting
}

/**
 * Generates an empty/blank roster template ready for teachers to fill in.
 */
export function generateBlankRosterCSV(options: CSVExportOptions = {}): string {
  const {
    title = 'Student Continuous Assessment & Examination Register',
    schoolName = 'Ghana Model Basic School',
    className = 'Basic 7',
    subjectName = 'Integrated Science',
    termName = 'Term 1',
    academicYear = '2025/2026',
    classWeight = 30,
    examWeight = 70,
    includeMetadataBlock = true
  } = options;

  const metadataLines: string[] = [];

  if (includeMetadataBlock) {
    metadataLines.push(`"DOCUMENT TITLE: ${title.replace(/"/g, '""')}"`);
    metadataLines.push(`"SCHOOL: ${schoolName.replace(/"/g, '""')} | CLASS: ${className} | SUBJECT: ${subjectName} | TERM: ${termName} (${academicYear})"`);
    metadataLines.push(`"ASSESSMENT WEIGHTS: Class Continuous Assessment (${classWeight}%) | End-of-Term Examination (${examWeight}%)"`);
    metadataLines.push('');
  }

  const headers = [
    'Roll Number',
    'Student Name',
    'Gender (M/F)',
    `Class Score [Max ${classWeight}%]`,
    `Exam Score [Max ${examWeight}%]`,
    'Attendance',
    'Conduct',
    'Attitude',
    'Teacher Remarks'
  ];

  // 10 placeholder empty rows with generated Roll Numbers
  const emptyRows: string[] = [];
  for (let i = 0; i < 10; i++) {
    const roll = `GH-${String(i + 1).padStart(3, '0')}`;
    emptyRows.push([`"${roll}"`, '""', '""', '""', '""', '""', '""', '""', '""'].join(','));
  }

  const allLines = [
    ...metadataLines,
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...emptyRows
  ];

  return '\uFEFF' + allLines.join('\r\n');
}

/**
 * Triggers browser download of the sample CSV template with custom title & school metadata.
 */
export function downloadSampleCSVTemplate(
  className = 'Basic_7', 
  classWeight = 30, 
  examWeight = 70,
  customTitle = 'Terminal Continuous Assessment & Examination Broad Sheet',
  schoolName = 'Ghana Model Basic School',
  subjectName = 'Integrated Science',
  termName = 'Term 1',
  academicYear = '2025/2026',
  isTemplateBlank = false
) {
  const content = isTemplateBlank
    ? generateBlankRosterCSV({
        title: customTitle,
        schoolName,
        className,
        subjectName,
        termName,
        academicYear,
        classWeight,
        examWeight
      })
    : generateSampleRosterCSV({
        title: customTitle,
        schoolName,
        className,
        subjectName,
        termName,
        academicYear,
        classWeight,
        examWeight
      });

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const sanitizedTitle = customTitle.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  link.setAttribute('download', `TeachSmartGH_${sanitizedTitle}_${className}_Template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


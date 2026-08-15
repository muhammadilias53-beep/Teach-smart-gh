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
}

/**
 * Robust RFC-4180 compliant CSV & TSV line parser.
 * Correctly handles quotes, commas/tabs within quotes, and multiple delimiters.
 */
export function parseCSVToRows(rawText: string): string[][] {
  const cleanText = rawText.replace(/^\uFEFF/, '').trim(); // Remove UTF-8 BOM if present
  if (!cleanText) return [];

  // Determine delimiter: comma, tab, or semicolon
  const firstLine = cleanText.split(/\r?\n/)[0] || '';
  let delimiter = ',';
  if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(';') && !firstLine.includes(',')) {
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
    'cascore', 'classassessment', 'continuousassessmentscore', '30score', 'classscore30', 'sba30'
  ].includes(norm)) {
    return 'classScore';
  }

  // Exam Score / End of Term Exam
  if ([
    'examscore', 'exammark', 'exam', 'endoftermexam', 'terminalexam', 
    'endofterm', 'examination', 'exam70', 'examscore70'
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

  // Check if first row is a header
  const firstRow = matrix[0];
  const matchedFields = firstRow.map(h => matchHeaderField(h));
  const hasRecognizedHeader = matchedFields.some(f => f !== null);

  let headerMap: { [colIndex: number]: string } = {};
  let dataRows = matrix;

  if (hasRecognizedHeader) {
    firstRow.forEach((h, idx) => {
      const match = matchHeaderField(h);
      if (match) headerMap[idx] = match;
    });
    dataRows = matrix.slice(1);
  } else {
    // If no header found, assume standard layout:
    // Col 0: Name (or Col 0 is Index/No and Col 1 is Name if Col 0 is purely numeric)
    if (matrix.length > 0 && /^\d+$/.test(matrix[0][0]) && matrix[0].length > 1) {
      headerMap[0] = 'rollNumber';
      headerMap[1] = 'name';
      if (matrix[0].length > 2) headerMap[2] = 'gender';
      if (matrix[0].length > 3) headerMap[3] = 'classScore';
      if (matrix[0].length > 4) headerMap[4] = 'examScore';
    } else {
      headerMap[0] = 'name';
      if (matrix[0].length > 1) headerMap[1] = 'gender';
      if (matrix[0].length > 2) headerMap[2] = 'classScore';
      if (matrix[0].length > 3) headerMap[3] = 'examScore';
    }
  }

  const parsedRows: ParsedStudentRow[] = [];
  let hasScores = false;

  dataRows.forEach((row, rowIndex) => {
    // Skip empty lines
    if (row.length === 0 || row.every(cell => !cell.trim())) {
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

    // Fallback: If name wasn't mapped via headers, use the first non-empty cell
    if (!name && row.length > 0) {
      name = (row[0] || '').replace(/^[\d.)\s-]+/, '').trim();
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
    warnings: Array.from(new Set(warnings))
  };
}

/**
 * Generates an official downloadable CSV sample template for teachers.
 */
export function generateSampleRosterCSV(classWeight = 30, examWeight = 70): string {
  const headers = [
    'Student Name',
    'Gender',
    'Roll Number',
    `Class Score (Max ${classWeight})`,
    `Exam Score (Max ${examWeight})`,
    'Attendance',
    'Conduct',
    'Attitude',
    'Remarks'
  ];

  const sampleRows = [
    ['Kwame Mensah', 'Male', 'GH-001', '24.5', '58.0', '58/60', 'Very Good', 'Hardworking & Attentive', 'Consistently participates in class discussions.'],
    ['Ama Serwaa', 'Female', 'GH-002', '27.0', '64.5', '60/60', 'Exemplary', 'Diligent & Dedicated', 'Outstanding problem-solving skills and leadership.'],
    ['Kofi Owusu', 'Male', 'GH-003', '18.0', '42.0', '52/60', 'Satisfactory', 'Needs Guidance', 'Encouraged to submit all homework assignments on time.']
  ];

  const lines = [
    headers.join(','),
    ...sampleRows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ];

  return lines.join('\r\n');
}

/**
 * Triggers browser download of the sample CSV template.
 */
export function downloadSampleCSVTemplate(className = 'Basic_7', classWeight = 30, examWeight = 70) {
  const content = generateSampleRosterCSV(classWeight, examWeight);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TeachSmartGH_${className}_Roster_Template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

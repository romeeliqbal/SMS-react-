// Weighted average: assignments 30%, midterm 30%, final 40%.
export function calculateAverage(assignments, midExam, finalExam) {
  const a = Number(assignments) || 0;
  const m = Number(midExam) || 0;
  const f = Number(finalExam) || 0;
  return a * 0.3 + m * 0.3 + f * 0.4;
}

export function getLetterGrade(average) {
  if (average >= 93) return 'A';
  if (average >= 90) return 'A-';
  if (average >= 87) return 'B+';
  if (average >= 83) return 'B';
  if (average >= 80) return 'B-';
  if (average >= 77) return 'C+';
  if (average >= 73) return 'C';
  if (average >= 70) return 'C-';
  if (average >= 60) return 'D';
  return 'F';
}

export function getGpaPoint(letter) {
  const map = {
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    D: 1.0,
    F: 0,
  };
  return map[letter] ?? 0;
}

export function getPassFailStatus(average) {
  return average >= 60 ? 'Pass' : 'Fail';
}

export function calculateStudentGpa(gradeRecords) {
  if (!gradeRecords || gradeRecords.length === 0) {
    return 0;
  }
  const points = gradeRecords.map((record) => {
    const avg = calculateAverage(record.assignments, record.midExam, record.finalExam);
    return getGpaPoint(getLetterGrade(avg));
  });
  const sum = points.reduce((acc, point) => acc + point, 0);
  return sum / points.length;
}

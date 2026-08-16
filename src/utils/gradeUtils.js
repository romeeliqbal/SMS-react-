// EduPulse Pakistani School & College Evaluation Engine
// Strictly uses Marks, Percentage, Letter Grades, and Class Ranking. (NO GPA/CGPA).

export const DEFAULT_GRADING_SCALE = [
  { grade: 'A+', minPercentage: 80, maxPercentage: 100, label: 'Outstanding / Honors', pass: true, color: '#10b981' },
  { grade: 'A', minPercentage: 70, maxPercentage: 79.99, label: 'Excellent', pass: true, color: '#06b6d4' },
  { grade: 'B+', minPercentage: 60, maxPercentage: 69.99, label: 'Very Good', pass: true, color: '#3b82f6' },
  { grade: 'B', minPercentage: 50, maxPercentage: 59.99, label: 'Good', pass: true, color: '#6366f1' },
  { grade: 'C', minPercentage: 40, maxPercentage: 49.99, label: 'Satisfactory / Pass', pass: true, color: '#f59e0b' },
  { grade: 'D', minPercentage: 33, maxPercentage: 39.99, label: 'Marginal Pass', pass: true, color: '#f97316' },
  { grade: 'F', minPercentage: 0, maxPercentage: 32.99, label: 'Fail', pass: false, color: '#ef4444' },
];

/**
 * Calculate percentage from obtained marks and total marks.
 */
export function calculatePercentage(obtained, total) {
  const o = Number(obtained) || 0;
  const t = Number(total) || 0;
  if (t <= 0) return 0;
  return Math.min(100, Math.max(0, (o / t) * 100));
}

/**
 * Determine letter grade based on percentage using configured grading scale.
 */
export function getGradeFromPercentage(percentage, scale = DEFAULT_GRADING_SCALE) {
  const pct = Number(percentage) || 0;
  for (const item of scale) {
    if (pct >= item.minPercentage) {
      return item.grade;
    }
  }
  return 'F';
}

/**
 * Get pass/fail status based on percentage and passing threshold (default 33%).
 */
export function getPassFailStatus(percentage, passingThreshold = 33) {
  const pct = Number(percentage) || 0;
  return pct >= passingThreshold ? 'Pass' : 'Fail';
}

/**
 * Calculate total obtained, total max marks, and overall percentage for a student across all subjects.
 */
export function calculateStudentOverallMarks(subjectMarksArray = []) {
  if (!subjectMarksArray || subjectMarksArray.length === 0) {
    return { totalObtained: 0, totalMax: 0, percentage: 0, grade: '—', status: 'Pending', passedCount: 0, failedCount: 0 };
  }

  let totalObtained = 0;
  let totalMax = 0;
  let passedCount = 0;
  let failedCount = 0;

  subjectMarksArray.forEach((sub) => {
    const obt = Number(sub.obtainedMarks) || 0;
    const max = Number(sub.totalMarks) || 100;
    const subPassing = Number(sub.passingMarks) || (max * 0.33);

    totalObtained += obt;
    totalMax += max;

    if (obt >= subPassing) {
      passedCount += 1;
    } else {
      failedCount += 1;
    }
  });

  const percentage = calculatePercentage(totalObtained, totalMax);
  const grade = getGradeFromPercentage(percentage);
  const status = failedCount === 0 && percentage >= 33 ? 'Pass' : 'Fail';

  return {
    totalObtained,
    totalMax,
    percentage: Math.round(percentage * 10) / 10,
    grade,
    status,
    passedCount,
    failedCount,
  };
}

/**
 * Calculate positions (1st, 2nd, 3rd...) for a list of students based on obtained marks / percentage.
 */
export function calculateClassRankings(studentPerformanceList) {
  // Sort descending by percentage, then by totalObtained
  const sorted = [...studentPerformanceList].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return (b.totalObtained || 0) - (a.totalObtained || 0);
  });

  let currentRank = 1;
  return sorted.map((student, index) => {
    if (index > 0) {
      const prev = sorted[index - 1];
      if (student.percentage < prev.percentage) {
        currentRank = index + 1;
      }
    }
    return {
      ...student,
      position: currentRank,
      positionLabel: formatPosition(currentRank),
    };
  });
}

/**
 * Helper to format position number to ordinal string (1st, 2nd, 3rd, etc.)
 */
export function formatPosition(rank) {
  if (!rank || rank <= 0) return '—';
  const j = rank % 10;
  const k = rank % 100;
  if (j === 1 && k !== 11) return `${rank}st`;
  if (j === 2 && k !== 12) return `${rank}nd`;
  if (j === 3 && k !== 13) return `${rank}rd`;
  return `${rank}th`;
}

/**
 * Generate standard teacher remark based on percentage.
 */
export function getAutomatedRemark(percentage, attendancePercentage = 100) {
  if (percentage >= 85) {
    return 'Exceptional academic performance and diligent commitment throughout the term.';
  }
  if (percentage >= 70) {
    return 'Very good effort and consistent grasp of subject concepts.';
  }
  if (percentage >= 55) {
    return 'Good performance with room for improvement in analytical topics.';
  }
  if (percentage >= 40) {
    if (attendancePercentage < 75) {
      return 'Needs regular revision and improvement in class attendance.';
    }
    return 'Satisfactory progress. Focused practice required for upcoming terms.';
  }
  return 'Requires immediate academic intervention and regular parent-teacher consultation.';
}

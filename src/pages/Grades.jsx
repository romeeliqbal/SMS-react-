import { useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import SearchBar from '../components/common/SearchBar';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../utils/storage';
import { generateId } from '../utils/idGenerators';
import {
  calculateAverage,
  calculateStudentGpa,
  getLetterGrade,
  getPassFailStatus,
} from '../utils/gradeUtils';
import { logActivity } from '../utils/activityLog';
import styles from './Grades.module.css';

export default function Grades() {
  const [students] = useStoredState(STORAGE_KEYS.students, []);
  const [courses] = useStoredState(STORAGE_KEYS.courses, []);
  const [grades, setGrades] = useStoredState(STORAGE_KEYS.grades, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach((course) => {
      map[course.id] = course;
    });
    return map;
  }, [courses]);

  const rows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const list = [];
    students.forEach((student) => {
      const fullName = `${student.firstName} ${student.lastName}`;
      if (term && !fullName.toLowerCase().includes(term) && !student.studentCode.toLowerCase().includes(term)) {
        return;
      }

      student.courseIds.forEach((courseId) => {
        if (courseFilter !== 'all' && courseId !== courseFilter) {
          return;
        }
        const record = grades.find((g) => g.studentId === student.id && g.courseId === courseId);
        list.push({
          key: `${student.id}::${courseId}`,
          student,
          courseId,
          record: record || { assignments: 0, midExam: 0, finalExam: 0 },
        });
      });
    });

    return list;
  }, [students, grades, searchTerm, courseFilter]);

  const classStats = useMemo(() => {
    if (students.length === 0) {
      return { avgGpa: 0, passRate: 0 };
    }
    const relevantGpas = students
      .filter((student) => grades.some((g) => g.studentId === student.id))
      .map((student) => calculateStudentGpa(grades.filter((g) => g.studentId === student.id)));

    const avgGpa =
      relevantGpas.length > 0 ? relevantGpas.reduce((sum, g) => sum + g, 0) / relevantGpas.length : 0;

    const passCount = grades.filter(
      (record) => getPassFailStatus(calculateAverage(record.assignments, record.midExam, record.finalExam)) === 'Pass',
    ).length;
    const passRate = grades.length > 0 ? Math.round((passCount / grades.length) * 100) : 0;

    return { avgGpa, passRate };
  }, [students, grades]);

  function updateField(studentId, courseId, field, rawValue) {
    const value = Math.max(0, Math.min(100, Number(rawValue) || 0));

    setGrades((prev) => {
      const idx = prev.findIndex((r) => r.studentId === studentId && r.courseId === courseId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      }
      return [
        ...prev,
        {
          id: generateId('grade'),
          studentId,
          courseId,
          assignments: 0,
          midExam: 0,
          finalExam: 0,
          [field]: value,
        },
      ];
    });
  }

  function handleBlurLog(student, courseId) {
    const course = courseMap[courseId];
    if (course) {
      logActivity('Grade submitted', `Scores updated for ${student.firstName} ${student.lastName} in ${course.code}`);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.statsRow}>
        <StatCard icon={GraduationCap} label="Class Average GPA" value={classStats.avgGpa.toFixed(2)} />
        <StatCard icon={GraduationCap} label="Overall Pass Rate" value={`${classStats.passRate}%`} />
      </div>

      <div className={styles.toolbar}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search students..." />
        <select
          className={styles.filterSelect}
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          aria-label="Filter by course"
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code}
            </option>
          ))}
        </select>
      </div>

      <GlassCard padding="none">
        {rows.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No grade records"
            description="Enroll students in courses to start recording grades."
          />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th className={styles.hideOnMobile}>Course</th>
                  <th>Assignments</th>
                  <th>Mid Exam</th>
                  <th>Final Exam</th>
                  <th>Average</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ key, student, courseId, record }) => {
                  const average = calculateAverage(record.assignments, record.midExam, record.finalExam);
                  const letter = getLetterGrade(average);
                  const passFail = getPassFailStatus(average);
                  const course = courseMap[courseId];

                  return (
                    <tr key={key}>
                      <td>
                        <div className={styles.studentCell}>
                          <Avatar initials={student.initials} color={student.avatarColor} size={32} />
                          <span>
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      </td>
                      <td className={styles.hideOnMobile}>{course?.code || '—'}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={styles.numberInput}
                          value={record.assignments}
                          onChange={(e) => updateField(student.id, courseId, 'assignments', e.target.value)}
                          onBlur={() => handleBlurLog(student, courseId)}
                          aria-label={`Assignments score for ${student.firstName} ${student.lastName}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={styles.numberInput}
                          value={record.midExam}
                          onChange={(e) => updateField(student.id, courseId, 'midExam', e.target.value)}
                          onBlur={() => handleBlurLog(student, courseId)}
                          aria-label={`Mid exam score for ${student.firstName} ${student.lastName}`}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className={styles.numberInput}
                          value={record.finalExam}
                          onChange={(e) => updateField(student.id, courseId, 'finalExam', e.target.value)}
                          onBlur={() => handleBlurLog(student, courseId)}
                          aria-label={`Final exam score for ${student.firstName} ${student.lastName}`}
                        />
                      </td>
                      <td className={styles.averageCell}>{average.toFixed(1)}</td>
                      <td>
                        <span className={styles.letterGrade}>{letter}</span>
                      </td>
                      <td>
                        <Badge tone={passFail === 'Pass' ? 'success' : 'danger'}>{passFail}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

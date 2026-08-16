import { useMemo, useState } from 'react';
import { PenLine, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import styles from './ExaminationPages.module.css';

export default function MarksEntry() {
  const { classes, subjects, exams, students, marks, updateMark } = useData();
  const { addToast } = useToast();

  const [selectedClass, setSelectedClass] = useState('class_10a');
  const [selectedExam, setSelectedExam] = useState('exam_mid_2026');
  const [selectedSubject, setSelectedSubject] = useState('subj_math10');

  const targetStudents = useMemo(
    () => students.filter((s) => s.classId === selectedClass),
    [students, selectedClass],
  );

  const targetSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubject) || subjects[0],
    [subjects, selectedSubject],
  );

  const currentMarks = useMemo(() => {
    return targetStudents.map((st) => {
      const record = marks.find(
        (m) => m.studentId === st.id && m.examId === selectedExam && m.subjectId === selectedSubject,
      );
      return {
        studentId: st.id,
        rollNo: st.rollNo,
        fullName: st.fullName,
        markId: record?.id,
        obtainedMarks: record?.obtainedMarks ?? 65,
        totalMarks: record?.totalMarks ?? targetSubject?.totalMarks ?? 75,
        passingMarks: record?.passingMarks ?? targetSubject?.passingMarks ?? 25,
        percentage: record?.percentage ?? 86.6,
        grade: record?.grade ?? 'A+',
        status: record?.status ?? 'Pass',
        remarks: record?.remarks ?? 'Good effort',
      };
    });
  }, [targetStudents, marks, selectedExam, selectedSubject, targetSubject]);

  function handleSaveMark(markId, newObtained) {
    if (!markId) return;
    updateMark(markId, { obtainedMarks: Number(newObtained) });
    addToast('Marks updated successfully.', 'success');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Marks Entry & Result Gazette Entry</h2>
          <p>Subject-wise marks entry engine for Matriculation and Intermediate examinations.</p>
        </div>
      </div>

      {/* Selectors Bar */}
      <GlassCard className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div>
            <label>Select Examination</label>
            <select className={styles.select} value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>{e.name} ({e.academicYear})</option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Class & Section</label>
            <select className={styles.select} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Subject</label>
            <select className={styles.select} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <div className={styles.statsGrid}>
        <StatCard label="Class Size" value={targetStudents.length} icon={PenLine} />
        <StatCard label="Maximum Subject Marks" value={targetSubject?.totalMarks || 75} icon={CheckCircle2} />
        <StatCard label="Passing Threshold Marks" value={targetSubject?.passingMarks || 25} icon={AlertCircle} />
      </div>

      <GlassCard title={`Marks Entry Table — ${targetSubject?.name || 'Subject'}`}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Total Marks</th>
                <th>Obtained Marks (Editable)</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMarks.map((row) => (
                <tr key={row.studentId}>
                  <td><strong>{row.rollNo}</strong></td>
                  <td>{row.fullName}</td>
                  <td>{row.totalMarks}</td>
                  <td>
                    <input
                      type="number"
                      className={styles.numInput}
                      defaultValue={row.obtainedMarks}
                      onBlur={(e) => handleSaveMark(row.markId, e.target.value)}
                    />
                  </td>
                  <td><strong>{row.percentage}%</strong></td>
                  <td><Badge tone={row.grade === 'A+' || row.grade === 'A' ? 'success' : 'info'}>{row.grade}</Badge></td>
                  <td><Badge tone={row.status === 'Pass' ? 'success' : 'danger'}>{row.status}</Badge></td>
                  <td>
                    <button
                      type="button"
                      className={styles.saveBtn}
                      onClick={() => addToast('Marks saved successfully.', 'success')}
                    >
                      <Save size={14} /> Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

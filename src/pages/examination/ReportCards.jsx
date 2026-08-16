import { useMemo, useState } from 'react';
import { Award, Printer, Download, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { INSTITUTION_INFO } from '../../data/seedData';
import styles from './ReportCards.module.css';

export default function ReportCards() {
  const { students, classes, exams, getStudentMarksForExam, getStudentOverallForExam, getStudentAttendancePercentage } = useData();

  const [selectedStudentId, setSelectedStudentId] = useState('student_1');
  const [selectedExamId, setSelectedExamId] = useState('exam_mid_2026');

  const student = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0],
    [students, selectedStudentId],
  );

  const exam = useMemo(
    () => exams.find((e) => e.id === selectedExamId) || exams[0],
    [exams, selectedExamId],
  );

  const overall = useMemo(
    () => getStudentOverallForExam(student.id, exam.id),
    [getStudentOverallForExam, student.id, exam.id],
  );

  const studentMarks = useMemo(
    () => getStudentMarksForExam(student.id, exam.id),
    [getStudentMarksForExam, student.id, exam.id],
  );

  const attPct = useMemo(
    () => getStudentAttendancePercentage(student.id),
    [getStudentAttendancePercentage, student.id],
  );

  function handlePrint() {
    window.print();
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerNoPrint}>
        <div>
          <h2>Pakistani Board Style Report Cards</h2>
          <p>Official BISE result card generation, marks summary, and printable transcript.</p>
        </div>
        <div className={styles.actions}>
          <select
            className={styles.select}
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.rollNo} — {s.className})
              </option>
            ))}
          </select>

          <Button icon={Printer} onClick={handlePrint}>Print Report Card</Button>
        </div>
      </div>

      {/* Report Card Document Container */}
      <div className={styles.reportCardDoc}>
        <div className={styles.docHeader}>
          <div className={styles.insLogo}>
            <Award size={36} color="#2563eb" />
          </div>
          <div className={styles.insInfo}>
            <h1 className={styles.insName}>{INSTITUTION_INFO.name}</h1>
            <p className={styles.insAffil}>{INSTITUTION_INFO.affiliation}</p>
            <p className={styles.insAddr}>{INSTITUTION_INFO.address}</p>
          </div>
        </div>

        <div className={styles.docTitleBar}>
          <h3>OFFICIAL ACADEMIC PERFORMANCE REPORT CARD</h3>
          <span>{exam.name} — Session {INSTITUTION_INFO.academicYear}</span>
        </div>

        {/* Student Data Table */}
        <div className={styles.studentInfoGrid}>
          <div><span>Student Name:</span> <strong>{student.fullName}</strong></div>
          <div><span>Roll Number:</span> <strong>{student.rollNo}</strong></div>
          <div><span>Guardian Name:</span> <strong>{student.guardianName}</strong></div>
          <div><span>Student Code / ID:</span> <strong>{student.studentCode}</strong></div>
          <div><span>Class & Section:</span> <strong>{student.className} {student.section}</strong></div>
          <div><span>BISE Reg No:</span> <strong>{student.biseRegistrationNo || 'BISE-ISB-2024-102'}</strong></div>
        </div>

        {/* Subject Breakdown Table */}
        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>Sr#</th>
              <th>Subject Code</th>
              <th>Subject Title</th>
              <th>Theory Marks</th>
              <th>Practical Marks</th>
              <th>Max Marks</th>
              <th>Obtained Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {studentMarks.map((m, idx) => (
              <tr key={m.id}>
                <td>{idx + 1}</td>
                <td><strong>{m.subjectCode}</strong></td>
                <td>{m.subjectName}</td>
                <td>{m.theoryObtained}</td>
                <td>{m.practicalObtained || 0}</td>
                <td>{m.totalMarks}</td>
                <td><strong>{m.obtainedMarks}</strong></td>
                <td>{m.percentage}%</td>
                <td>{m.grade}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Footer Box */}
        <div className={styles.summaryBox}>
          <div className={styles.summaryPill}>
            <span>Grand Total Marks</span>
            <strong>{overall.totalObtained} / {overall.totalMax}</strong>
          </div>

          <div className={styles.summaryPill}>
            <span>Cumulative Percentage</span>
            <strong>{overall.percentage}%</strong>
          </div>

          <div className={styles.summaryPill}>
            <span>Final Grade</span>
            <strong>{overall.grade}</strong>
          </div>

          <div className={styles.summaryPill}>
            <span>Class Position</span>
            <strong>{overall.positionLabel || '1st Position'}</strong>
          </div>

          <div className={styles.summaryPill}>
            <span>Attendance %</span>
            <strong>{attPct}%</strong>
          </div>

          <div className={styles.summaryPill}>
            <span>Academic Status</span>
            <strong style={{ color: overall.status === 'Pass' ? '#10b981' : '#ef4444' }}>{overall.status}</strong>
          </div>
        </div>

        {/* Remarks and Signatures */}
        <div className={styles.signatureRow}>
          <div className={styles.remarksCol}>
            <label>Teacher Remarks:</label>
            <p>"Exceptional performance throughout the midterm term. Consistently high analytical capability in Mathematics and Natural Sciences."</p>
          </div>

          <div className={styles.sigCol}>
            <div className={styles.sigLine} />
            <span>Class Teacher Signature</span>
          </div>

          <div className={styles.sigCol}>
            <div className={styles.sigLine} />
            <span>Principal / Controller Sign</span>
          </div>
        </div>
      </div>
    </div>
  );
}

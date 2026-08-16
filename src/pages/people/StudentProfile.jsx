import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Tabs from '../../components/common/Tabs';
import { useData } from '../../context/DataContext';
import styles from './StudentProfile.module.css';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    students,
    classes,
    subjects,
    marks,
    assignments,
    fees,
    getStudentAttendancePercentage,
    getStudentMarksForExam,
    getStudentOverallForExam,
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');

  const student = useMemo(
    () => students.find((s) => s.id === id) || students[0],
    [students, id],
  );

  const overall = useMemo(
    () => getStudentOverallForExam(student.id, 'exam_mid_2026'),
    [getStudentOverallForExam, student.id],
  );

  const attendancePct = useMemo(
    () => getStudentAttendancePercentage(student.id),
    [getStudentAttendancePercentage, student.id],
  );

  const studentMarks = useMemo(
    () => getStudentMarksForExam(student.id, 'exam_mid_2026'),
    [getStudentMarksForExam, student.id],
  );

  const studentFees = useMemo(
    () => fees.filter((f) => f.studentId === student.id),
    [fees, student.id],
  );

  const studentAssignments = useMemo(
    () => assignments.filter((a) => a.classId === student.classId),
    [assignments, student.classId],
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal Information' },
    { id: 'academic', label: 'Academic & Marks' },
    { id: 'attendance', label: 'Attendance Record' },
    { id: 'fees', label: 'Fee Challans' },
    { id: 'assignments', label: 'Assignments' },
  ];

  return (
    <div className={styles.profilePage}>
      <button type="button" className={styles.backBtn} onClick={() => navigate('/people/students')}>
        <ArrowLeft size={16} /> Back to Student Directory
      </button>

      {/* Header Banner */}
      <GlassCard className={styles.profileHeaderCard}>
        <div className={styles.headerMain}>
          <div className={styles.avatarGroup}>
            <Avatar initials={student.initials} color={student.avatarColor} size="lg" />
            <div>
              <div className={styles.titleRow}>
                <h2 className={styles.name}>{student.fullName}</h2>
                <Badge tone={student.status === 'Active' ? 'success' : 'neutral'}>{student.status}</Badge>
              </div>
              <p className={styles.subtitle}>
                ID: {student.studentCode} | Roll No: <strong>{student.rollNo}</strong> | BISE Reg: {student.biseRegistrationNo || 'BISE-ISB-2024-102'}
              </p>
              <p className={styles.classText}>
                {student.className} ({student.section || 'Sec A'}) — <em>EduPulse Model School & College</em>
              </p>
            </div>
          </div>

          <div className={styles.headerKpis}>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>Overall Percentage</span>
              <span className={styles.kpiVal}>{overall.percentage}%</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>Grade / Status</span>
              <span className={styles.kpiVal}>{overall.grade} ({overall.status})</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>Class Rank</span>
              <span className={styles.kpiVal}>{overall.positionLabel || '1st'}</span>
            </div>
            <div className={styles.kpiPill}>
              <span className={styles.kpiLabel}>Attendance</span>
              <span className={styles.kpiVal}>{attendancePct}%</span>
            </div>
          </div>
        </div>

        <div className={styles.tabNav}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </GlassCard>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.gridTwo}>
            <GlassCard title="Academic Summary (Midterm 2026)">
              <div className={styles.summaryList}>
                <div className={styles.summaryItem}>
                  <span>Total Obtained Marks</span>
                  <strong>{overall.totalObtained} / {overall.totalMax}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Overall Percentage</span>
                  <strong>{overall.percentage}%</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Letter Grade</span>
                  <strong>{overall.grade}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Subjects Passed</span>
                  <strong>{overall.passedCount} Passed / {overall.failedCount} Failed</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Class Position</span>
                  <strong>{overall.positionLabel || '1st Position'}</strong>
                </div>
              </div>
            </GlassCard>

            <GlassCard title="Guardian & Contact Details">
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Users size={16} />
                  <div>
                    <label>Guardian Name ({student.guardianRelation || 'Father'})</label>
                    <p>{student.guardianName}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={16} />
                  <div>
                    <label>Guardian Phone</label>
                    <p>{student.guardianPhone || student.phone}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={16} />
                  <div>
                    <label>Email Address</label>
                    <p>{student.email}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <MapPin size={16} />
                  <div>
                    <label>Residential Address</label>
                    <p>{student.address}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'personal' && (
          <GlassCard title="Personal Record">
            <div className={styles.detailsGrid}>
              <div><label>Full Name</label><p>{student.fullName}</p></div>
              <div><label>Roll Number</label><p>{student.rollNo}</p></div>
              <div><label>Student ID</label><p>{student.studentCode}</p></div>
              <div><label>Date of Birth</label><p>{student.dateOfBirth}</p></div>
              <div><label>Gender</label><p>{student.gender}</p></div>
              <div><label>Blood Group</label><p>{student.bBloodGroup || 'O+'}</p></div>
              <div><label>Religion</label><p>{student.religion || 'Islam'}</p></div>
              <div><label>Admission Date</label><p>{student.admissionDate}</p></div>
              <div><label>Transport Bus Service</label><p>{student.transportRequired ? 'Subscribed' : 'N/A'}</p></div>
              <div><label>Hostel Facility</label><p>{student.hostelRequired ? 'Subscribed' : 'N/A'}</p></div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'academic' && (
          <GlassCard title="Subject-wise Marks & Evaluation (BISE Pattern)">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Theory</th>
                    <th>Practical</th>
                    <th>Obtained / Total</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((m) => (
                    <tr key={m.id}>
                      <td><strong>{m.subjectCode}</strong></td>
                      <td>{m.subjectName}</td>
                      <td>{m.theoryObtained}</td>
                      <td>{m.practicalObtained || 0}</td>
                      <td><strong>{m.obtainedMarks} / {m.totalMarks}</strong></td>
                      <td>{m.percentage}%</td>
                      <td><Badge tone={m.grade === 'A+' || m.grade === 'A' ? 'success' : 'info'}>{m.grade}</Badge></td>
                      <td><Badge tone={m.status === 'Pass' ? 'success' : 'danger'}>{m.status}</Badge></td>
                      <td>{m.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {activeTab === 'attendance' && (
          <GlassCard title="Attendance Summary & 30-Day Record">
            <div className={styles.attHeader}>
              <div>
                <h4>Overall Attendance: {attendancePct}%</h4>
                <p>Threshold Warning Benchmark: 75%</p>
              </div>
              <Badge tone={attendancePct >= 75 ? 'success' : 'danger'}>
                {attendancePct >= 75 ? 'Satisfactory' : 'Attendance Shortage Warning'}
              </Badge>
            </div>
          </GlassCard>
        )}

        {activeTab === 'fees' && (
          <GlassCard title="Fee Challans & Receipts">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Challan No</th>
                    <th>Month</th>
                    <th>Tuition</th>
                    <th>Lab/Exam</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFees.map((f) => (
                    <tr key={f.id}>
                      <td><strong>{f.challanNo}</strong></td>
                      <td>{f.month}</td>
                      <td>Rs. {f.tuitionFee?.toLocaleString()}</td>
                      <td>Rs. {((f.labFee || 0) + (f.examFee || 0)).toLocaleString()}</td>
                      <td><strong>Rs. {f.totalAmount?.toLocaleString()}</strong></td>
                      <td><Badge tone={f.status === 'Paid' ? 'success' : 'warning'}>{f.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {activeTab === 'assignments' && (
          <GlassCard title="Class Assignments Log">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Total Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAssignments.map((a) => (
                    <tr key={a.id}>
                      <td><strong>{a.title}</strong></td>
                      <td>{a.subjectName}</td>
                      <td>{a.dueDate}</td>
                      <td>{a.totalMarks}</td>
                      <td><Badge tone="success">Submitted</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  MessageSquare,
  PenLine,
  School,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ROLES } from '../data/roleConfigs';
import { formatNumber, getGreeting } from '../utils/formatters';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeRole, authProfile } = useAuth();
  const {
    students,
    teachers,
    classes,
    marks,
    assignments,
    fees,
    complaints,
    auditLogs,
    lowAttendanceStudents,
    overdueFees,
    getStudentAttendancePercentage,
    getStudentOverallForExam,
  } = useData();

  const greeting = useMemo(() => getGreeting(), []);

  // Compute common institution metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;

  // Compute pass rate percentage
  const passRate = useMemo(() => {
    if (marks.length === 0) return 88;
    const passed = marks.filter((m) => m.status === 'Pass').length;
    return Math.round((passed / marks.length) * 100);
  }, [marks]);

  // Enrollment trend data
  const enrollmentTrend = useMemo(() => [
    { month: 'Sep', students: Math.max(10, totalStudents - 15) },
    { month: 'Oct', students: Math.max(15, totalStudents - 12) },
    { month: 'Nov', students: Math.max(18, totalStudents - 8) },
    { month: 'Dec', students: Math.max(20, totalStudents - 5) },
    { month: 'Jan', students: Math.max(22, totalStudents - 2) },
    { month: 'Feb', students: totalStudents },
  ], [totalStudents]);

  // Performance by department data
  const deptPerformanceData = useMemo(() => [
    { name: 'Computer Sci', percentage: 86.4 },
    { name: 'Pre-Engineering', percentage: 82.1 },
    { name: 'Pre-Medical', percentage: 84.7 },
    { name: 'Humanities', percentage: 79.5 },
    { name: 'Commerce', percentage: 81.0 },
  ], []);

  // Render Role Specific Content
  function renderDashboardContent() {
    switch (activeRole) {
      case ROLES.STUDENT: {
        const student = students.find((s) => s.id === authProfile.id) || students[0];
        const studentMarks = marks.filter((m) => m.studentId === student.id);
        const overallMarks = getStudentOverallForExam(student.id, 'exam_mid_2026');
        const attPct = getStudentAttendancePercentage(student.id);

        return (
          <div className={styles.roleGrid}>
            <div className={styles.heroRow}>
              <GlassCard className={styles.welcomeBanner}>
                <h2>Welcome, {student.fullName}! 👋</h2>
                <p>Roll No: {student.rollNo} | {student.className} {student.section}</p>
                <div className={styles.studentStatsPills}>
                  <div className={styles.pill}>Overall Percentage: <strong>{overallMarks.percentage}%</strong></div>
                  <div className={styles.pill}>Overall Grade: <strong>{overallMarks.grade}</strong></div>
                  <div className={styles.pill}>Attendance: <strong>{attPct}%</strong></div>
                </div>
              </GlassCard>
            </div>

            <div className={styles.statsGrid}>
              <StatCard label="Enrolled Subjects" value={student.subjectIds?.length || 6} icon={BookOpen} />
              <StatCard label="Midterm Position" value={overallMarks.positionLabel || '1st'} icon={Award} />
              <StatCard label="Attendance Rate" value={`${attPct}%`} icon={UserCheck} />
              <StatCard label="Fee Status" value="Paid" icon={CreditCard} />
            </div>

            <div className={styles.twoColGrid}>
              <GlassCard title="Recent Exam Performance (Midterm 2026)">
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Obtained / Total</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentMarks.map((m) => (
                        <tr key={m.id}>
                          <td><strong>{m.subjectName}</strong></td>
                          <td>{m.obtainedMarks} / {m.totalMarks}</td>
                          <td>{m.percentage}%</td>
                          <td><Badge tone={m.grade === 'A+' || m.grade === 'A' ? 'success' : 'info'}>{m.grade}</Badge></td>
                          <td><Badge tone={m.status === 'Pass' ? 'success' : 'danger'}>{m.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>

              <GlassCard title="Pending Assignments & Deadlines">
                <div className={styles.listGroup}>
                  {assignments.slice(0, 3).map((a) => (
                    <div key={a.id} className={styles.listItem}>
                      <div>
                        <strong>{a.title}</strong>
                        <p>{a.subjectName} — Due: {a.dueDate}</p>
                      </div>
                      <Badge tone="warning">{a.totalMarks} Marks</Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        );
      }

      case ROLES.PARENT: {
        const parentStudent = students.find((s) => s.firstName === 'Romeel') || students[0];
        const overall = getStudentOverallForExam(parentStudent.id, 'exam_mid_2026');
        const att = getStudentAttendancePercentage(parentStudent.id);

        return (
          <div className={styles.roleGrid}>
            <GlassCard className={styles.welcomeBanner}>
              <h2>Parent Portal — Monitoring Children Progress</h2>
              <p>Linked Child: <strong>{parentStudent.fullName}</strong> ({parentStudent.className} {parentStudent.section})</p>
            </GlassCard>

            <div className={styles.statsGrid}>
              <StatCard label="Child Percentage" value={`${overall.percentage}%`} icon={Award} />
              <StatCard label="Class Position" value={overall.positionLabel || '1st'} icon={GraduationCap} />
              <StatCard label="Attendance Rate" value={`${att}%`} icon={UserCheck} />
              <StatCard label="Fee Voucher Status" value="Paid (Aug)" icon={Wallet} />
            </div>

            <GlassCard title={`Academic Record — ${parentStudent.fullName}`}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Total Marks</th>
                      <th>Obtained Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.filter((m) => m.studentId === parentStudent.id).map((m) => (
                      <tr key={m.id}>
                        <td>{m.subjectName}</td>
                        <td>{m.totalMarks}</td>
                        <td>{m.obtainedMarks}</td>
                        <td>{m.percentage}%</td>
                        <td><Badge tone="success">{m.grade}</Badge></td>
                        <td>{m.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        );
      }

      case ROLES.TEACHER: {
        return (
          <div className={styles.roleGrid}>
            <GlassCard className={styles.welcomeBanner}>
              <h2>Teacher Dashboard — {authProfile.name}</h2>
              <p>Assigned Classes: Grade 10-A, 1st Year FSc | Department: Science & Mathematics</p>
            </GlassCard>

            <div className={styles.statsGrid}>
              <StatCard label="Today's Classes" value="3 Period Sessions" icon={Clock} />
              <StatCard label="Attendance Pending" value="1 Class" icon={UserCheck} />
              <StatCard label="Assignments Active" value="2 Homework Tasks" icon={PenLine} />
              <StatCard label="Students at Risk" value={`${lowAttendanceStudents.length}`} icon={AlertTriangle} />
            </div>

            <div className={styles.twoColGrid}>
              <GlassCard title="Today's Class Schedule">
                <div className={styles.listGroup}>
                  <div className={styles.listItem}>
                    <div>
                      <strong>08:30 AM — 09:15 AM</strong>
                      <p>Mathematics — Grade 10-A (Room 201)</p>
                    </div>
                    <Badge tone="success">Completed</Badge>
                  </div>
                  <div className={styles.listItem}>
                    <div>
                      <strong>10:00 AM — 10:45 AM</strong>
                      <p>FSc Mathematics — 1st Year FSc (Lecture Hall 1)</p>
                    </div>
                    <Badge tone="warning">Next Up</Badge>
                  </div>
                </div>
              </GlassCard>

              <GlassCard title="Students Requiring Academic Attention">
                <div className={styles.listGroup}>
                  {lowAttendanceStudents.slice(0, 3).map((st) => (
                    <div key={st.id} className={styles.listItem}>
                      <div>
                        <strong>{st.fullName}</strong>
                        <p>{st.className} — Low Attendance: {st.attendancePct}%</p>
                      </div>
                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => navigate(`/people/students/${st.id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        );
      }

      case ROLES.ACCOUNTANT: {
        const totalBilled = fees.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
        const totalCollected = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
        const totalOutstanding = totalBilled - totalCollected;

        return (
          <div className={styles.roleGrid}>
            <GlassCard className={styles.welcomeBanner}>
              <h2>Accountant Dashboard — Finance & Fee Operations</h2>
              <p>Manage fee challans, recorded payments, and monthly collection reports.</p>
            </GlassCard>

            <div className={styles.statsGrid}>
              <StatCard label="Total Billed" value={`Rs. ${totalBilled.toLocaleString()}`} icon={Wallet} />
              <StatCard label="Total Collected" value={`Rs. ${totalCollected.toLocaleString()}`} icon={CreditCard} />
              <StatCard label="Outstanding Dues" value={`Rs. ${totalOutstanding.toLocaleString()}`} icon={AlertTriangle} />
              <StatCard label="Defaulters" value={`${overdueFees.length} Invoices`} icon={Clock} />
            </div>

            <GlassCard title="Recent Payments Recorded">
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Challan No</th>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.slice(0, 5).map((f) => (
                      <tr key={f.id}>
                        <td><strong>{f.challanNo}</strong></td>
                        <td>{f.studentName}</td>
                        <td>{f.className}</td>
                        <td>Rs. {f.totalAmount?.toLocaleString()}</td>
                        <td><Badge tone={f.status === 'Paid' ? 'success' : 'warning'}>{f.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        );
      }

      // Default Admin / Principal Overview Dashboard
      default: {
        return (
          <div className={styles.adminGrid}>
            <section className={styles.statsRow}>
              <StatCard label="Total Students" value={formatNumber(totalStudents)} icon={Users} />
              <StatCard label="Total Teachers" value={formatNumber(totalTeachers)} icon={UserCheck} />
              <StatCard label="Classes / Sections" value={formatNumber(totalClasses)} icon={School} />
              <StatCard label="Academic Pass Rate" value={`${passRate}%`} icon={Award} />
              <StatCard label="Attendance Rate" value="89.2%" icon={CheckCircle2} />
              <StatCard label="Open Complaints" value={complaints.filter((c) => c.status !== 'Resolved').length} icon={MessageSquare} />
            </section>

            <section className={styles.twoColGrid}>
              <GlassCard title="Student Enrollment Trend (BISE Terms)">
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={enrollmentTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ background: '#0f1525', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} fill="url(#enrollGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard title="Academic Performance by Department (Marks %)">
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={deptPerformanceData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: '#0f1525', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </section>

            <section className={styles.twoColGrid}>
              <GlassCard title="Needs Attention List">
                <div className={styles.attentionList}>
                  {lowAttendanceStudents.slice(0, 3).map((st) => (
                    <div key={st.id} className={styles.attentionItem}>
                      <div className={styles.attIcon}><AlertTriangle size={18} /></div>
                      <div className={styles.attContent}>
                        <strong>{st.fullName} ({st.className})</strong>
                        <p>Low Attendance: {st.attendancePct}% (Threshold: 75%)</p>
                      </div>
                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => navigate(`/people/students/${st.id}`)}
                      >
                        Action
                      </button>
                    </div>
                  ))}
                  {overdueFees.slice(0, 2).map((fee) => (
                    <div key={fee.id} className={styles.attentionItem}>
                      <div className={styles.attIcon}><Wallet size={18} /></div>
                      <div className={styles.attContent}>
                        <strong>Overdue Fee: {fee.studentName}</strong>
                        <p>Challan {fee.challanNo} — Balance: Rs. {fee.balance?.toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => navigate('/finance/fees')}
                      >
                        Challan
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard title="Recent System Activity">
                <div className={styles.activityList}>
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className={styles.activityItem}>
                      <span className={styles.dot} />
                      <div>
                        <strong>{log.action}</strong>
                        <p>{log.detail} — <em>{log.user} ({log.module})</em></p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>
          </div>
        );
      }
    }
  }

  return (
    <div className={styles.dashboardPage}>
      <GlassCard className={styles.heroCard}>
        <div className={styles.heroContent}>
          <div>
            <span className={styles.heroEyebrow}>System Dashboard</span>
            <h2 className={styles.heroTitle}>{greeting}, {authProfile.name}</h2>
            <p className={styles.heroDescription}>
              EduPulse Model School & Intermediate College — Academic Management Platform
            </p>
          </div>
          <div className={styles.heroRoleTag}>
            <span>Active Role:</span>
            <strong>{authProfile.role?.toUpperCase()}</strong>
          </div>
        </div>
      </GlassCard>

      {renderDashboardContent()}
    </div>
  );
}

import { useMemo } from 'react';
import { AlertTriangle, ClipboardList, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './AttendancePages.module.css';

export default function AttendanceReports() {
  const navigate = useNavigate();
  const { students, lowAttendanceStudents } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Attendance Shortage & Analytics Reports</h2>
          <p>75% attendance threshold monitoring and institutional attendance reports.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Active Students" value={students.filter((s) => s.status === 'Active').length} icon={ClipboardList} />
        <StatCard label="Meeting Threshold (≥75%)" value={students.filter((s) => s.status === 'Active').length - lowAttendanceStudents.length} icon={CheckCircle2} />
        <StatCard label="Shortage Warning (<75%)" value={lowAttendanceStudents.length} icon={AlertTriangle} />
      </div>

      <GlassCard title="Students Below 75% Attendance Threshold (Needs Action)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class & Section</th>
                <th>Attendance Percentage</th>
                <th>Guardian Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowAttendanceStudents.map((st) => (
                <tr key={st.id}>
                  <td><strong>{st.rollNo}</strong></td>
                  <td>{st.fullName}</td>
                  <td>{st.className} {st.section}</td>
                  <td><Badge tone="danger">{st.attendancePct}%</Badge></td>
                  <td>{st.guardianPhone || st.phone}</td>
                  <td>
                    <button
                      type="button"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#6366f1',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/people/students/${st.id}`)}
                    >
                      View Profile
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

import { useMemo, useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './AttendancePages.module.css';

export default function TeacherAttendance() {
  const { teachers } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Teacher & Staff Attendance Log</h2>
          <p>Faculty daily check-in and leave tracking records.</p>
        </div>
      </div>

      <GlassCard className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div>
            <label>Attendance Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      <div className={styles.statsGrid}>
        <StatCard label="Total Faculty" value={teachers.length} icon={UserCheck} />
        <StatCard label="Present Today" value={teachers.length - 1} icon={CheckCircle2} />
        <StatCard label="On Leave" value={1} icon={Clock} />
      </div>

      <GlassCard title="Faculty Attendance Sheet">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Teacher Code</th>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>Check-in Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr key={t.id}>
                  <td><strong>{t.teacherCode}</strong></td>
                  <td>{t.fullName}</td>
                  <td>{t.departmentName}</td>
                  <td>{idx === 2 ? 'On Leave' : '07:55 AM'}</td>
                  <td>
                    <Badge tone={idx === 2 ? 'warning' : 'success'}>
                      {idx === 2 ? 'Leave' : 'Present'}
                    </Badge>
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

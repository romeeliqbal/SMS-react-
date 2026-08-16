import { useMemo, useState } from 'react';
import { ClipboardCheck, Save, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import styles from './AttendancePages.module.css';

export default function StudentAttendance() {
  const { classes, students, attendance, markAttendanceForClass } = useData();
  const { addToast } = useToast();

  const [selectedClass, setSelectedClass] = useState('class_10a');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const classStudents = useMemo(
    () => students.filter((s) => s.classId === selectedClass && s.status === 'Active'),
    [students, selectedClass],
  );

  const [statusMap, setStatusMap] = useState({});

  const activeStatusMap = useMemo(() => {
    const result = {};
    classStudents.forEach((st) => {
      const key = `${st.id}_${selectedDate}`;
      result[st.id] = statusMap[st.id] || attendance[key] || 'present';
    });
    return result;
  }, [classStudents, selectedDate, statusMap, attendance]);

  function handleStatusChange(studentId, status) {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSaveAll() {
    markAttendanceForClass(selectedClass, selectedDate, activeStatusMap);
    addToast('Attendance saved successfully.', 'success');
  }

  const presentCount = Object.values(activeStatusMap).filter((s) => s === 'present').length;
  const absentCount = Object.values(activeStatusMap).filter((s) => s === 'absent').length;
  const lateCount = Object.values(activeStatusMap).filter((s) => s === 'late').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Student Daily Attendance</h2>
          <p>Class-wise attendance marking engine.</p>
        </div>
        <Button icon={Save} onClick={handleSaveAll}>Save Attendance</Button>
      </div>

      <GlassCard className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div>
            <label>Select Class & Section</label>
            <select className={styles.select} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
              ))}
            </select>
          </div>

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
        <StatCard label="Total Enrolled" value={classStudents.length} icon={ClipboardCheck} />
        <StatCard label="Present" value={presentCount} icon={CheckCircle2} />
        <StatCard label="Absent" value={absentCount} icon={XCircle} />
        <StatCard label="Late / Leave" value={lateCount} icon={Clock} />
      </div>

      <GlassCard title="Student Attendance Marking Sheet">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Status Toggle</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((st) => {
                const currentStatus = activeStatusMap[st.id] || 'present';
                return (
                  <tr key={st.id}>
                    <td><strong>{st.rollNo}</strong></td>
                    <td>{st.fullName}</td>
                    <td>
                      <div className={styles.btnGroup}>
                        <button
                          type="button"
                          className={[styles.statusBtn, currentStatus === 'present' ? styles.btnPresent : ''].join(' ')}
                          onClick={() => handleStatusChange(st.id, 'present')}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={[styles.statusBtn, currentStatus === 'absent' ? styles.btnAbsent : ''].join(' ')}
                          onClick={() => handleStatusChange(st.id, 'absent')}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          className={[styles.statusBtn, currentStatus === 'late' ? styles.btnLate : ''].join(' ')}
                          onClick={() => handleStatusChange(st.id, 'late')}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          className={[styles.statusBtn, currentStatus === 'leave' ? styles.btnLeave : ''].join(' ')}
                          onClick={() => handleStatusChange(st.id, 'leave')}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

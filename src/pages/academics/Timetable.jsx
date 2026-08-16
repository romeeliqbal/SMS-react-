import { useMemo, useState } from 'react';
import { Clock, Calendar, School, UserCheck } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './Timetable.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [
  { id: 1, time: '08:00 - 08:45 AM', label: 'Period 1' },
  { id: 2, time: '08:45 - 09:30 AM', label: 'Period 2' },
  { id: 3, time: '09:30 - 10:15 AM', label: 'Period 3' },
  { id: 'recess', time: '10:15 - 10:45 AM', label: 'Recess Break' },
  { id: 4, time: '10:45 - 11:30 AM', label: 'Period 4' },
  { id: 5, time: '11:30 - 12:15 PM', label: 'Period 5' },
  { id: 6, time: '12:15 - 01:00 PM', label: 'Period 6' },
];

export default function Timetable() {
  const { classes, subjects } = useData();
  const [selectedClass, setSelectedClass] = useState('class_10a');

  const selectedClassObj = useMemo(
    () => classes.find((c) => c.id === selectedClass) || classes[0],
    [classes, selectedClass],
  );

  const timetableSchedule = useMemo(() => {
    // Generate schedule for selected class
    return {
      Monday: {
        1: { subject: 'Mathematics', teacher: 'Engr. Bilal Hassan', room: 'Room 201' },
        2: { subject: 'Physics (Theory)', teacher: 'Dr. Usman Ali', room: 'Room 201' },
        3: { subject: 'English Compulsory', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 201' },
        4: { subject: 'Chemistry (Theory)', teacher: 'Prof. Tariq Mehmood', room: 'Room 201' },
        5: { subject: 'Biology / CS', teacher: 'Dr. Saima Rashid', room: 'Lab 2' },
        6: { subject: 'Urdu Compulsory', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
      },
      Tuesday: {
        1: { subject: 'Physics Practical', teacher: 'Dr. Usman Ali', room: 'Physics Lab' },
        2: { subject: 'Physics Practical', teacher: 'Dr. Usman Ali', room: 'Physics Lab' },
        3: { subject: 'Mathematics', teacher: 'Engr. Bilal Hassan', room: 'Room 201' },
        4: { subject: 'Islamiat Compulsory', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
        5: { subject: 'Pakistan Studies', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
        6: { subject: 'Chemistry (Theory)', teacher: 'Prof. Tariq Mehmood', room: 'Room 201' },
      },
      Wednesday: {
        1: { subject: 'Chemistry Practical', teacher: 'Prof. Tariq Mehmood', room: 'Chemistry Lab' },
        2: { subject: 'Chemistry Practical', teacher: 'Prof. Tariq Mehmood', room: 'Chemistry Lab' },
        3: { subject: 'Mathematics', teacher: 'Engr. Bilal Hassan', room: 'Room 201' },
        4: { subject: 'English Compulsory', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 201' },
        5: { subject: 'Urdu Compulsory', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
        6: { subject: 'Physics (Theory)', teacher: 'Dr. Usman Ali', room: 'Room 201' },
      },
      Thursday: {
        1: { subject: 'Computer / Bio Lab', teacher: 'Engr. Fatima Zahra', room: 'CS Lab 1' },
        2: { subject: 'Computer / Bio Lab', teacher: 'Engr. Fatima Zahra', room: 'CS Lab 1' },
        3: { subject: 'Mathematics', teacher: 'Engr. Bilal Hassan', room: 'Room 201' },
        4: { subject: 'Pakistan Studies', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
        5: { subject: 'English Compulsory', teacher: 'Ms. Ayesha Siddiqui', room: 'Room 201' },
        6: { subject: 'Islamiat Compulsory', teacher: 'Prof. Jamil Siddiqui', room: 'Room 201' },
      },
      Friday: {
        1: { subject: 'Mathematics', teacher: 'Engr. Bilal Hassan', room: 'Room 201' },
        2: { subject: 'Physics (Theory)', teacher: 'Dr. Usman Ali', room: 'Room 201' },
        3: { subject: 'Chemistry (Theory)', teacher: 'Prof. Tariq Mehmood', room: 'Room 201' },
        4: { subject: 'Assembly & Moral Ethics', teacher: 'Principal', room: 'Auditorium' },
      },
    };
  }, [selectedClass]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Weekly Timetable & Schedule Grid</h2>
          <p>Class periods, room allocations, and faculty timetable schedules.</p>
        </div>
        <div className={styles.selectorGroup}>
          <label>Select Class:</label>
          <select
            className={styles.select}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.section} ({c.roomNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Current Class" value={`${selectedClassObj.name} ${selectedClassObj.section}`} icon={School} />
        <StatCard label="Class Teacher" value={selectedClassObj.classTeacherName || 'Dr. Usman Ali'} icon={UserCheck} />
        <StatCard label="Assigned Room" value={selectedClassObj.roomNumber || 'Room 201'} icon={Clock} />
      </div>

      <GlassCard title={`Timetable Grid — ${selectedClassObj.name} (${selectedClassObj.section})`}>
        <div className={styles.gridWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day / Time</th>
                {PERIODS.map((p) => (
                  <th key={p.id} className={p.id === 'recess' ? styles.recessHead : ''}>
                    <div><strong>{p.label}</strong></div>
                    <span className={styles.timeLabel}>{p.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className={styles.dayCell}><strong>{day}</strong></td>
                  {PERIODS.map((p) => {
                    if (p.id === 'recess') {
                      return (
                        <td key={p.id} className={styles.recessCell}>
                          Recess Break
                        </td>
                      );
                    }
                    const slot = timetableSchedule[day]?.[p.id];
                    if (!slot) {
                      return <td key={p.id} className={styles.emptyCell}>—</td>;
                    }
                    return (
                      <td key={p.id} className={styles.slotCell}>
                        <strong>{slot.subject}</strong>
                        <span className={styles.subText}>{slot.teacher}</span>
                        <Badge tone="info">{slot.room}</Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

import { Calendar, Clock, School } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './ExaminationPages.module.css';

const mockDateSheet = [
  { date: '2026-03-01', day: 'Monday', time: '09:00 - 12:00 PM', subject: 'Mathematics (Theory)', class: 'Grade 10-A', room: 'Room 201', invigilator: 'Engr. Fatima Zahra' },
  { date: '2026-03-03', day: 'Wednesday', time: '09:00 - 12:00 PM', subject: 'Physics (Theory)', class: 'Grade 10-A', room: 'Room 201', invigilator: 'Prof. Tariq Mehmood' },
  { date: '2026-03-05', day: 'Friday', time: '09:00 - 12:00 PM', subject: 'Chemistry (Theory)', class: 'Grade 10-A', room: 'Room 201', invigilator: 'Dr. Saima Rashid' },
  { date: '2026-03-08', day: 'Monday', time: '09:00 - 12:00 PM', subject: 'English Compulsory', class: 'Grade 10-A', room: 'Room 201', invigilator: 'Engr. Bilal Hassan' },
  { date: '2026-03-10', day: 'Wednesday', time: '09:00 - 12:00 PM', subject: 'Urdu Compulsory', class: 'Grade 10-A', room: 'Room 201', invigilator: 'Ms. Ayesha Siddiqui' },
];

export default function ExamSchedule() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Date Sheet & Exam Room Allocation</h2>
          <p>BISE examination date sheets and invigilation duties.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Exam Papers Scheduled" value={mockDateSheet.length} icon={Calendar} />
        <StatCard label="Hall Allocation" value="Room 201" icon={School} />
      </div>

      <GlassCard title="Midterm Date Sheet 2026 — Grade 10-A">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Timing</th>
                <th>Paper / Subject</th>
                <th>Assigned Room</th>
                <th>Invigilator</th>
              </tr>
            </thead>
            <tbody>
              {mockDateSheet.map((d, idx) => (
                <tr key={idx}>
                  <td><strong>{d.date}</strong></td>
                  <td>{d.day}</td>
                  <td><Badge tone="info">{d.time}</Badge></td>
                  <td><strong>{d.subject}</strong></td>
                  <td>{d.room}</td>
                  <td>{d.invigilator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

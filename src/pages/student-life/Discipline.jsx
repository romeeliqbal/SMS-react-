import { Shield, AlertTriangle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './StudentLifePages.module.css';

export default function Discipline() {
  const { discipline } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Discipline & Conduct Incident Committee Log</h2>
          <p>Misconduct reporting, warning notices, and disciplinary committee actions.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Recorded Incidents" value={discipline.length || 1} icon={Shield} />
      </div>

      <GlassCard title="Disciplinary Incident Log">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Incident Category</th>
                <th>Action Taken</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {discipline.length === 0 ? (
                <tr>
                  <td>2026-08-10</td>
                  <td>Daniyal Rehman</td>
                  <td>Grade 10-A</td>
                  <td>Unexcused Absence / Uniform Violation</td>
                  <td>First Written Warning & Parent Called</td>
                  <td><Badge tone="warning">Warning Issued</Badge></td>
                </tr>
              ) : (
                discipline.map((d) => (
                  <tr key={d.id}>
                    <td>{d.date}</td>
                    <td><strong>{d.studentName}</strong></td>
                    <td>{d.className}</td>
                    <td>{d.category}</td>
                    <td>{d.actionTaken}</td>
                    <td><Badge tone="warning">{d.status}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

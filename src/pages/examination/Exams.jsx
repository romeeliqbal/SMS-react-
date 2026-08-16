import { useMemo, useState } from 'react';
import { FileText, Plus, Calendar } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import styles from './ExaminationPages.module.css';

export default function Exams() {
  const { exams } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Examinations & Assessment Registry</h2>
          <p>Midterm, send-ups, and annual BISE examination sessions.</p>
        </div>
        <Button icon={Plus}>Create Exam</Button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Exams" value={exams.length} icon={FileText} />
        <StatCard label="Published" value={exams.filter((e) => e.status === 'Published').length} icon={Calendar} />
      </div>

      <GlassCard title="Examinations Catalogue">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Term</th>
                <th>Academic Year</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td><Badge tone="info">{e.term}</Badge></td>
                  <td>{e.academicYear}</td>
                  <td>{e.startDate}</td>
                  <td>{e.endDate}</td>
                  <td><Badge tone={e.status === 'Published' ? 'success' : 'warning'}>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

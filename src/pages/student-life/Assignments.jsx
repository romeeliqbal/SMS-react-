import { useMemo, useState } from 'react';
import { PenLine, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import styles from './StudentLifePages.module.css';

export default function Assignments() {
  const { assignments } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignments;
    return assignments.filter((a) => a.title.toLowerCase().includes(term) || a.subjectName.toLowerCase().includes(term));
  }, [assignments, search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Homework & Class Assignments Log</h2>
          <p>Assignment creation, class targeting, and submission tracking.</p>
        </div>
        <div className={styles.actions}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search assignments..." />
          <Button icon={Plus}>Create Assignment</Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Active Tasks" value={assignments.length} icon={PenLine} />
        <StatCard label="Submissions Received" value="73 Tasks" icon={CheckCircle2} />
      </div>

      <GlassCard title="Active Assignments Directory">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Subject</th>
                <th>Target Class</th>
                <th>Assigned Teacher</th>
                <th>Due Date</th>
                <th>Total Marks</th>
                <th>Submissions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td><Badge tone="info">{a.subjectName}</Badge></td>
                  <td>{a.className}</td>
                  <td>{a.teacherName}</td>
                  <td>{a.dueDate}</td>
                  <td><strong>{a.totalMarks} Marks</strong></td>
                  <td>{a.submittedCount} / {a.totalCount || 25}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

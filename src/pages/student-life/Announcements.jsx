import { useMemo, useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import styles from './StudentLifePages.module.css';

export default function Announcements() {
  const { announcements } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return announcements;
    return announcements.filter((a) => a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term));
  }, [announcements, search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Notice Board & Circular Announcements</h2>
          <p>Official notices broadcast to students, parents, and faculty staff.</p>
        </div>
        <div className={styles.actions}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search notices..." />
          <Button icon={Plus}>Post Notice</Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Active Circulars" value={announcements.length} icon={Megaphone} />
      </div>

      <GlassCard title="Institutional Notice Board">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date Posted</th>
                <th>Notice Title</th>
                <th>Category</th>
                <th>Target Audience</th>
                <th>Posted By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td><strong>{a.title}</strong></td>
                  <td><Badge tone="info">{a.category}</Badge></td>
                  <td><Badge tone="success">{a.targetAudience || 'All'}</Badge></td>
                  <td>{a.author || 'Admin Office'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

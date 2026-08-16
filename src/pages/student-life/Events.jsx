import { PartyPopper } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './StudentLifePages.module.css';

export default function Events() {
  const { events } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>School Events & Activity Calendar</h2>
          <p>Annual sports gala, science exhibition, parent-teacher meetings, and prize distribution.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Scheduled Events" value={events.length} icon={PartyPopper} />
      </div>

      <GlassCard title="Upcoming Institutional Events">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Event Date</th>
                <th>Venue / Location</th>
                <th>Target Audience</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.title}</strong></td>
                  <td><Badge tone="info">{e.category}</Badge></td>
                  <td>{e.date}</td>
                  <td>{e.venue || 'Main Campus Ground'}</td>
                  <td><Badge tone="success">{e.targetAudience || 'All'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

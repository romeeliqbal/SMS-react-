import { Building } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './ResourcePages.module.css';

export default function Facilities() {
  const { facilities } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Rooms & Facilities Management</h2>
          <p>Classrooms, science laboratories, lecture halls, and auditoriums.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Rooms & Halls" value={facilities.length} icon={Building} />
        <StatCard label="Available Rooms" value={facilities.filter((f) => f.status === 'Available').length} icon={Building} />
      </div>

      <GlassCard title="Facilities Catalogue">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Seating Capacity</th>
                <th>Location / Block</th>
                <th>Equipment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.roomNumber}</strong></td>
                  <td>{f.name}</td>
                  <td>{f.capacity} Seats</td>
                  <td>{f.location}</td>
                  <td>{f.equipment || 'Projector, Whiteboard'}</td>
                  <td><Badge tone={f.status === 'Available' ? 'success' : 'info'}>{f.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

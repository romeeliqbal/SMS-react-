import { BedDouble, Users } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './ResourcePages.module.css';

export default function Hostel() {
  const { hostel } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Hostel & Boarding Accommodation</h2>
          <p>Student hostel room allotments and bed vacancies.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Hostel Blocks" value={hostel.length} icon={BedDouble} />
        <StatCard label="Boarding Students" value={12} icon={Users} />
      </div>

      <GlassCard title="Hostel Rooms & Vacancies">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hostel Block</th>
                <th>Warden Name</th>
                <th>Total Beds</th>
                <th>Occupied</th>
                <th>Available Vacancies</th>
                <th>Monthly Hostel Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {hostel.map((h) => (
                <tr key={h.id}>
                  <td><strong>{h.blockName || h.name}</strong></td>
                  <td>{h.wardenName}</td>
                  <td>{h.totalBeds} Beds</td>
                  <td>{h.occupiedBeds} Occupied</td>
                  <td><strong>{h.availableBeds} Vacant</strong></td>
                  <td>Rs. {h.monthlyFee?.toLocaleString()}</td>
                  <td><Badge tone="success">{h.status || 'Active'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

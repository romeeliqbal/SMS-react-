import { Bus, Users } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './ResourcePages.module.css';

export default function Transport() {
  const { transport } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>School Bus Routes & Transport Management</h2>
          <p>Bus routes, drivers, stops, and student transport allocations.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Active Bus Routes" value={transport.length} icon={Bus} />
        <StatCard label="Subscribed Students" value={18} icon={Users} />
      </div>

      <GlassCard title="Transport Bus Routes">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Route Code</th>
                <th>Route Name</th>
                <th>Bus Registration No</th>
                <th>Driver Name</th>
                <th>Monthly Fare</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transport.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.routeCode || t.id}</strong></td>
                  <td>{t.routeName}</td>
                  <td>{t.busNumber}</td>
                  <td>{t.driverName}</td>
                  <td>Rs. {t.monthlyFare?.toLocaleString()}</td>
                  <td>{t.capacity} Seats</td>
                  <td><Badge tone="success">{t.status || 'Active'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

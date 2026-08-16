import { useMemo } from 'react';
import { Package, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './ResourcePages.module.css';

export default function Inventory() {
  const { inventory } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Lab & Institutional Assets Inventory</h2>
          <p>Physics, Chemistry, Computer Science labs, and IT equipment assets.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Equipment Assets" value={inventory.length} icon={Package} />
        <StatCard label="In Working Order" value={inventory.filter((i) => i.status === 'Available' || i.status === 'In Use').length} icon={CheckCircle2} />
      </div>

      <GlassCard title="Institutional Inventory Assets">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.assetTag || item.id}</strong></td>
                  <td>{item.name}</td>
                  <td><Badge tone="info">{item.category}</Badge></td>
                  <td>{item.location}</td>
                  <td>{item.condition}</td>
                  <td><Badge tone={item.status === 'In Use' ? 'success' : 'warning'}>{item.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

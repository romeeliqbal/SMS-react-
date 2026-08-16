import { ScrollText } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './AdminPages.module.css';

export default function AuditLog() {
  const { auditLogs } = useData();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>System Audit Log & Activity Trail</h2>
          <p>Complete historical log of administrative actions, attendance submissions, and fee updates.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Logged Operations" value={auditLogs.length} icon={ScrollText} />
      </div>

      <GlassCard title="Administrative Action History">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Operator</th>
                <th>Role</th>
                <th>Module</th>
                <th>Action Taken</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td><strong>{new Date(log.timestamp).toLocaleString()}</strong></td>
                  <td>{log.user}</td>
                  <td><Badge tone="info">{log.role}</Badge></td>
                  <td><Badge tone="success">{log.module}</Badge></td>
                  <td><strong>{log.action}</strong></td>
                  <td>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

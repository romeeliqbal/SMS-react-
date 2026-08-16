import { useMemo } from 'react';
import { UserCog, Shield } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { ROLE_DEFINITIONS } from '../../data/roleConfigs';
import styles from './AdminPages.module.css';

export default function UsersRoles() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>System Users & Role Access Matrix</h2>
          <p>Role-based access permissions, user roles, and default demonstration credentials.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Supported System Roles" value={ROLE_DEFINITIONS.length} icon={UserCog} />
        <StatCard label="Security Policies" value="Active Enforced" icon={Shield} />
      </div>

      <GlassCard title="System Roles Register">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Role ID</th>
                <th>Role Title</th>
                <th>Role Badge</th>
                <th>Default Demo Account</th>
                <th>Permission Scope</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_DEFINITIONS.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.label}</td>
                  <td><Badge tone="info">{r.badge}</Badge></td>
                  <td>{r.defaultUser?.name} ({r.defaultUser?.email})</td>
                  <td>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

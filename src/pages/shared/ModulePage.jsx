import { useMemo, useState } from 'react';
import GlassCard from '../../components/common/GlassCard';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import StatCard from '../../components/common/StatCard';
import styles from './ModulePage.module.css';

export default function ModulePage({
  title,
  subtitle,
  data = [],
  columns = [],
  searchKeys = [],
  stats = [],
  emptyMessage = 'No records found.',
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(term)),
    );
  }, [data, search, searchKeys]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search records..." />
      </div>

      {stats.length > 0 && (
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </div>
      )}

      <GlassCard padding="none" className={styles.tableCard}>
        {filtered.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id || row._key}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export function StatusBadge({ value }) {
  return <Badge tone={value === 'Active' || value === 'Paid' || value === 'Pass' ? 'success' : undefined}>{value}</Badge>;
}

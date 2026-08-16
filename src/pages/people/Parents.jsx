import { useMemo, useState } from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import styles from './PeoplePages.module.css';

export default function Parents() {
  const { students } = useData();
  const [search, setSearch] = useState('');

  const parentsList = useMemo(() => {
    const parentMap = new Map();
    students.forEach((st) => {
      const gName = st.guardianName || 'Father';
      if (!parentMap.has(gName)) {
        parentMap.set(gName, {
          name: gName,
          relation: st.guardianRelation || 'Father',
          phone: st.guardianPhone || st.phone,
          email: st.guardianEmail || st.email,
          address: st.address,
          children: [st],
        });
      } else {
        parentMap.get(gName).children.push(st);
      }
    });
    return Array.from(parentMap.values());
  }, [students]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return parentsList;
    return parentsList.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.children.some((c) => c.fullName.toLowerCase().includes(term)),
    );
  }, [parentsList, search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Parents & Guardians Management</h2>
          <p>Guardian Directory and linked student relationships.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search parents or children..." />
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Guardians" value={parentsList.length} icon={Users} />
        <StatCard label="Linked Students" value={students.length} icon={Users} />
      </div>

      <GlassCard padding="none">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Guardian Name</th>
                <th>Relationship</th>
                <th>Contact Phone</th>
                <th>Email</th>
                <th>Linked Children</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={idx}>
                  <td><strong>{p.name}</strong></td>
                  <td><Badge tone="info">{p.relation}</Badge></td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                  <td>
                    {p.children.map((c) => (
                      <span key={c.id} style={{ display: 'inline-block', marginRight: '6px' }}>
                        <Badge tone="success">{c.fullName} ({c.className})</Badge>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

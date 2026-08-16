import { useMemo, useState } from 'react';
import { UserCheck, Mail, Phone, BookOpen, Plus } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import styles from './PeoplePages.module.css';

export default function Teachers() {
  const { teachers } = useData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return teachers.filter((t) => {
      const matchTerm = !term || t.fullName.toLowerCase().includes(term) || t.designation.toLowerCase().includes(term);
      const matchDept = deptFilter === 'all' || t.departmentId === deptFilter;
      return matchTerm && matchDept;
    });
  }, [teachers, search, deptFilter]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Faculty & Teachers Directory</h2>
          <p>Academic teaching staff, departmental affiliations, and subject workloads.</p>
        </div>
        <div className={styles.actions}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search teachers..." />
          <Button icon={Plus}>Add Teacher</Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Faculty" value={teachers.length} icon={UserCheck} />
        <StatCard label="Active Staff" value={teachers.filter((t) => t.status === 'Active').length} icon={UserCheck} />
        <StatCard label="Departments" value={5} icon={BookOpen} />
      </div>

      <div className={styles.teacherGrid}>
        {filtered.map((t) => (
          <GlassCard key={t.id} className={styles.teacherCard}>
            <div className={styles.cardHeader}>
              <Avatar initials={t.initials} color={t.avatarColor} size="md" />
              <div>
                <strong>{t.fullName}</strong>
                <p className={styles.designation}>{t.designation}</p>
                <Badge tone="info">{t.departmentName}</Badge>
              </div>
            </div>
            <div className={styles.cardDetails}>
              <p><Mail size={14} /> {t.email}</p>
              <p><Phone size={14} /> {t.phone}</p>
              <p><strong>Qualification:</strong> {t.qualification}</p>
              <p><strong>Experience:</strong> {t.experience}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

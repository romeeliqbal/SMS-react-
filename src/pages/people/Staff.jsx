import { useMemo, useState } from 'react';
import { UserCog, Mail, Phone } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import styles from './PeoplePages.module.css';

const mockStaff = [
  { id: 'stf_1', name: 'Mr. Asif Raza', designation: 'Chief Accounts Officer', dept: 'Finance', email: 'accounts@edupulse.edu.pk', phone: '+92 300 9876541', status: 'Active' },
  { id: 'stf_2', name: 'Prof. Jamil Siddiqui', designation: 'Controller of Examinations', dept: 'Examination Cell', email: 'exams@edupulse.edu.pk', phone: '+92 300 9876542', status: 'Active' },
  { id: 'stf_3', name: 'Ms. Sadia Munir', designation: 'Admissions Coordinator', dept: 'Admissions Desk', email: 'admissions@edupulse.edu.pk', phone: '+92 300 9876543', status: 'Active' },
  { id: 'stf_4', name: 'Mr. Zahid Hussain', designation: 'Head Librarian', dept: 'Central Library', email: 'library@edupulse.edu.pk', phone: '+92 300 9876544', status: 'Active' },
  { id: 'stf_5', name: 'Engr. Kamran Ali', designation: 'IT Systems Engineer', dept: 'IT Infrastructure', email: 'it@edupulse.edu.pk', phone: '+92 300 9876545', status: 'Active' },
];

export default function Staff() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockStaff;
    return mockStaff.filter((s) => s.name.toLowerCase().includes(term) || s.designation.toLowerCase().includes(term));
  }, [search]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Administrative & Support Staff</h2>
          <p>Non-teaching administrative staff directory.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." />
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Administrative Staff" value={mockStaff.length} icon={UserCog} />
        <StatCard label="Active Status" value={mockStaff.length} icon={UserCog} />
      </div>

      <GlassCard padding="none">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.designation}</td>
                  <td><Badge tone="info">{s.dept}</Badge></td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td><Badge tone="success">{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

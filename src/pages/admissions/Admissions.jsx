import { useMemo, useState } from 'react';
import { UserPlus, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import styles from './Admissions.module.css';

export default function Admissions() {
  const { admissions, setAdmissions, enrollAdmission } = useData();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return admissions.filter((a) => {
      const matchTerm = !term || a.applicantName.toLowerCase().includes(term) || a.fatherName.toLowerCase().includes(term);
      const matchStage = stageFilter === 'all' || a.status === stageFilter;
      return matchTerm && matchStage;
    });
  }, [admissions, search, stageFilter]);

  function handleEnroll(admId, name) {
    enrollAdmission(admId);
    addToast(`${name} has been enrolled as an active student!`, 'success');
  }

  function handleStatusChange(admId, newStatus) {
    setAdmissions((prev) =>
      prev.map((a) => (a.id === admId ? { ...a, status: newStatus } : a)),
    );
    addToast(`Application status updated to ${newStatus}`, 'info');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Admissions & Student Enrollment Pipeline</h2>
          <p>Scrutinize applications, manage entrance test schedules, and enroll new students.</p>
        </div>
        <div className={styles.actions}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search applicants..." />
          <Button icon={UserPlus}>New Application</Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Applications" value={admissions.length} icon={UserPlus} />
        <StatCard label="Under Review / Test" value={admissions.filter((a) => a.status === 'Submitted' || a.status === 'Test Scheduled').length} icon={Clock} />
        <StatCard label="Accepted" value={admissions.filter((a) => a.status === 'Accepted').length} icon={CheckCircle2} />
        <StatCard label="Enrolled" value={admissions.filter((a) => a.status === 'Enrolled').length} icon={CheckCircle2} />
      </div>

      <GlassCard title="Admissions Pipeline Table">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>App Code</th>
                <th>Applicant Name</th>
                <th>Father / Guardian</th>
                <th>Desired Class</th>
                <th>Phone</th>
                <th>Previous School</th>
                <th>Stage Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.applicationCode || a.id}</strong></td>
                  <td>{a.applicantName}</td>
                  <td>{a.fatherName}</td>
                  <td><Badge tone="info">{a.desiredClass || 'Grade 9'}</Badge></td>
                  <td>{a.phone}</td>
                  <td>{a.previousSchool || 'Army Public School'}</td>
                  <td>
                    <Badge tone={a.status === 'Enrolled' ? 'success' : a.status === 'Accepted' ? 'info' : 'warning'}>
                      {a.status}
                    </Badge>
                  </td>
                  <td>
                    {a.status === 'Accepted' && (
                      <button
                        type="button"
                        className={styles.enrollBtn}
                        onClick={() => handleEnroll(a.id, a.applicantName)}
                      >
                        Enroll Student
                      </button>
                    )}
                    {a.status === 'Submitted' && (
                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => handleStatusChange(a.id, 'Test Scheduled')}
                      >
                        Schedule Test
                      </button>
                    )}
                    {a.status === 'Test Scheduled' && (
                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => handleStatusChange(a.id, 'Accepted')}
                      >
                        Approve
                      </button>
                    )}
                    {a.status === 'Enrolled' && <span className={styles.doneTag}>Complete</span>}
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

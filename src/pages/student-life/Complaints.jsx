import { MessageSquare, Plus, CheckCircle2, Clock } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import styles from './StudentLifePages.module.css';

export default function Complaints() {
  const { complaints, setComplaints } = useData();
  const { addToast } = useToast();

  function handleResolve(id) {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' } : c)),
    );
    addToast('Ticket marked as resolved.', 'success');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Complaints & Facility Support Ticketing</h2>
          <p>Classroom, lab, IT infrastructure, and transport support tickets.</p>
        </div>
        <Button icon={Plus}>Submit New Ticket</Button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Tickets" value={complaints.length} icon={MessageSquare} />
        <StatCard label="In Progress" value={complaints.filter((c) => c.status !== 'Resolved').length} icon={Clock} />
        <StatCard label="Resolved" value={complaints.filter((c) => c.status === 'Resolved').length} icon={CheckCircle2} />
      </div>

      <GlassCard title="Support Tickets Directory">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Subject / Description</th>
                <th>Submitted By</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.ticketNo || c.id}</strong></td>
                  <td><Badge tone="info">{c.category}</Badge></td>
                  <td>{c.subject || c.description}</td>
                  <td>{c.submittedBy || 'Teacher'}</td>
                  <td><Badge tone={c.priority === 'High' ? 'danger' : 'warning'}>{c.priority}</Badge></td>
                  <td><Badge tone={c.status === 'Resolved' ? 'success' : 'warning'}>{c.status}</Badge></td>
                  <td>
                    {c.status !== 'Resolved' && (
                      <button
                        type="button"
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleResolve(c.id)}
                      >
                        Mark Resolved
                      </button>
                    )}
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

import { useMemo } from 'react';
import { BarChart3, Wallet, CreditCard, AlertTriangle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './FinancePages.module.css';

export default function FinancialReports() {
  const { fees, overdueFees } = useData();

  const totalBilled = useMemo(() => fees.reduce((s, f) => s + (f.totalAmount || 0), 0), [fees]);
  const totalCollected = useMemo(() => fees.reduce((s, f) => s + (f.paidAmount || 0), 0), [fees]);
  const totalOutstanding = totalBilled - totalCollected;
  const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Financial Reports & Fee Recovery Analytics</h2>
          <p>Monthly fee recovery rate, defaulters list, and collection summary.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Fee Recovery Rate" value={`${recoveryRate}%`} icon={BarChart3} />
        <StatCard label="Total Collected" value={`Rs. ${totalCollected.toLocaleString()}`} icon={CreditCard} />
        <StatCard label="Total Outstanding" value={`Rs. ${totalOutstanding.toLocaleString()}`} icon={Wallet} />
        <StatCard label="Defaulters Count" value={overdueFees.length} icon={AlertTriangle} />
      </div>

      <GlassCard title="Fee Defaulters List (Outstanding Dues)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Student Name</th>
                <th>Class & Section</th>
                <th>Month</th>
                <th>Total Billed</th>
                <th>Balance Outstanding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overdueFees.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.challanNo}</strong></td>
                  <td>{f.studentName}</td>
                  <td>{f.className}</td>
                  <td>{f.month}</td>
                  <td>Rs. {f.totalAmount?.toLocaleString()}</td>
                  <td><strong style={{ color: '#ef4444' }}>Rs. {f.balance?.toLocaleString()}</strong></td>
                  <td><Badge tone="danger">{f.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

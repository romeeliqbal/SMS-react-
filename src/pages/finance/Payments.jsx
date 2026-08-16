import { useMemo } from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './FinancePages.module.css';

export default function Payments() {
  const { payments } = useData();

  const totalCollected = useMemo(
    () => payments.reduce((s, p) => s + (p.amount || 0), 0),
    [payments],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Fee Payment Receipts & Transactions</h2>
          <p>Bank deposit slips, cash receipts, and payment log.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Payments Logged" value={payments.length || 1} icon={CreditCard} />
        <StatCard label="Total Cash / Bank Receipts" value={`Rs. ${totalCollected.toLocaleString()}`} icon={CheckCircle2} />
      </div>

      <GlassCard title="Payment Receipts Log">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Student Name</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Amount Paid</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td><strong>PAY-2026-001</strong></td>
                  <td>Romeel Iqbal</td>
                  <td>2026-08-05</td>
                  <td>Bank Transfer (HBL)</td>
                  <td><strong>Rs. 14,000</strong></td>
                  <td>Mr. Asif Raza</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.studentName}</td>
                    <td>{p.paymentDate}</td>
                    <td><Badge tone="info">{p.method || 'Cash'}</Badge></td>
                    <td><strong>Rs. {p.amount?.toLocaleString()}</strong></td>
                    <td>{p.recordedBy || 'Accountant'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

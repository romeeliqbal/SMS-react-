import { useMemo, useState } from 'react';
import { Wallet, CreditCard, Plus, Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import styles from './FinancePages.module.css';

export default function Fees() {
  const { fees, recordPayment } = useData();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredFees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return fees.filter((f) => {
      const matchTerm = !term || f.studentName.toLowerCase().includes(term) || f.challanNo.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchTerm && matchStatus;
    });
  }, [fees, search, statusFilter]);

  const totalBilled = useMemo(() => fees.reduce((s, f) => s + (f.totalAmount || 0), 0), [fees]);
  const totalCollected = useMemo(() => fees.reduce((s, f) => s + (f.paidAmount || 0), 0), [fees]);
  const totalOutstanding = totalBilled - totalCollected;

  function handleRecordPay(feeId, amount) {
    recordPayment(feeId, { amount, method: 'Cash Deposit' });
    addToast('Payment recorded successfully.', 'success');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Fee Structure & Challans Management</h2>
          <p>Monthly fee billing, tuition vouchers, and collection status.</p>
        </div>
        <div className={styles.actions}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search challan or student..." />
          <Button icon={Plus}>Generate Challans</Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Billed Fees" value={`Rs. ${totalBilled.toLocaleString()}`} icon={Wallet} />
        <StatCard label="Total Collected" value={`Rs. ${totalCollected.toLocaleString()}`} icon={CreditCard} />
        <StatCard label="Outstanding Dues" value={`Rs. ${totalOutstanding.toLocaleString()}`} icon={AlertTriangle} />
        <StatCard label="Paid Vouchers" value={fees.filter((f) => f.status === 'Paid').length} icon={CheckCircle2} />
      </div>

      <GlassCard title="Fee Challans Register">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Student</th>
                <th>Class</th>
                <th>Month</th>
                <th>Tuition Fee</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.challanNo}</strong></td>
                  <td>{f.studentName}</td>
                  <td>{f.className}</td>
                  <td>{f.month}</td>
                  <td>Rs. {f.tuitionFee?.toLocaleString()}</td>
                  <td><strong>Rs. {f.totalAmount?.toLocaleString()}</strong></td>
                  <td>Rs. {(f.paidAmount || 0).toLocaleString()}</td>
                  <td><Badge tone={f.status === 'Paid' ? 'success' : f.status === 'Overdue' ? 'danger' : 'warning'}>{f.status}</Badge></td>
                  <td>
                    {f.status !== 'Paid' ? (
                      <button
                        type="button"
                        className={styles.payBtn}
                        onClick={() => handleRecordPay(f.id, f.totalAmount - (f.paidAmount || 0))}
                      >
                        Record Payment
                      </button>
                    ) : (
                      <Badge tone="success">Paid</Badge>
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

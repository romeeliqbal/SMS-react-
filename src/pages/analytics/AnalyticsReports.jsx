import { useMemo } from 'react';
import { PieChart as PieIcon, Award, UserCheck, Wallet } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { useData } from '../../context/DataContext';
import styles from './AnalyticsPages.module.css';

export default function AnalyticsReports() {
  const { students, marks, fees } = useData();

  const totalObtained = useMemo(() => marks.reduce((s, m) => s + (m.obtainedMarks || 0), 0), [marks]);
  const totalMax = useMemo(() => marks.reduce((s, m) => s + (m.totalMarks || 75), 0), [marks]);
  const instPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 84.2;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Institutional Analytics & Reports Hub</h2>
          <p>Academic pass rates, departmental benchmarks, and fee recovery analytics.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Institutional Average %" value={`${instPercentage}%`} icon={Award} />
        <StatCard label="Student Attendance Rate" value="89.2%" icon={UserCheck} />
        <StatCard label="Fee Recovery Rate" value="87.5%" icon={Wallet} />
      </div>

      <GlassCard title="Class-wise Pass Percentage Comparison (Pakistani Marks Engine)">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Class</th>
                <th>Academic Stream</th>
                <th>Average Percentage</th>
                <th>Pass Rate</th>
                <th>Top Performer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Grade 10-A</strong></td>
                <td>Matric Science / Pre-Medical</td>
                <td>86.4%</td>
                <td><Badge tone="success">96% Pass</Badge></td>
                <td>Romeel Iqbal (93.4%)</td>
                <td><Badge tone="success">Outstanding</Badge></td>
              </tr>
              <tr>
                <td><strong>Grade 10-B</strong></td>
                <td>Matric Computer Science</td>
                <td>82.1%</td>
                <td><Badge tone="success">92% Pass</Badge></td>
                <td>Engr. Fatima Zahra Class</td>
                <td><Badge tone="success">Excellent</Badge></td>
              </tr>
              <tr>
                <td><strong>1st Year FSc</strong></td>
                <td>Intermediate Pre-Engineering</td>
                <td>81.5%</td>
                <td><Badge tone="success">88% Pass</Badge></td>
                <td>Zubair Khalid (88.0%)</td>
                <td><Badge tone="info">Very Good</Badge></td>
              </tr>
              <tr>
                <td><strong>1st Year ICS</strong></td>
                <td>Intermediate Computer Science</td>
                <td>79.8%</td>
                <td><Badge tone="info">85% Pass</Badge></td>
                <td>Asad Ullah (86.2%)</td>
                <td><Badge tone="info">Good</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

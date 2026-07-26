import GlassCard from './GlassCard';
import styles from './StatCard.module.css';

export default function StatCard({ icon: Icon, label, value, change, changeTone = 'success' }) {
  return (
    <GlassCard className={styles.statCard}>
      <div className={styles.header}>
        {Icon && (
          <div className={styles.iconWrap}>
            <Icon size={20} />
          </div>
        )}
        {change && <span className={[styles.change, styles[changeTone]].join(' ')}>{change}</span>}
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </GlassCard>
  );
}

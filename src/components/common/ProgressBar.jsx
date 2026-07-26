import styles from './ProgressBar.module.css';

export default function ProgressBar({ value = 0, max = 100, tone = 'default', showLabel = false }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={[styles.fill, styles[tone]].join(' ')} style={{ width: `${percent}%` }} />
      </div>
      {showLabel && <span className={styles.label}>{Math.round(percent)}%</span>}
    </div>
  );
}

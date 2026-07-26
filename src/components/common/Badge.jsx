import styles from './Badge.module.css';

const TONE_MAP = {
  Active: 'success',
  Present: 'success',
  Pass: 'success',
  Upcoming: 'warning',
  Leave: 'warning',
  Inactive: 'muted',
  Completed: 'info',
  Graduated: 'info',
  Absent: 'danger',
  Fail: 'danger',
};

export default function Badge({ children, tone }) {
  const resolvedTone = tone || TONE_MAP[children] || 'muted';
  return <span className={[styles.badge, styles[resolvedTone]].join(' ')}>{children}</span>;
}

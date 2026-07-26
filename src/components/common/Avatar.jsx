import styles from './Avatar.module.css';

export default function Avatar({ initials, color = '#6366f1', size = 40 }) {
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, background: `${color}2a`, color, borderColor: `${color}55` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', padding = 'default' }) {
  const cardClassName = [
    styles.card,
    padding === 'large' ? styles.paddingLarge : '',
    padding === 'none' ? styles.paddingNone : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cardClassName}>{children}</div>;
}

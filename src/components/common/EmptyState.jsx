import styles from './EmptyState.module.css';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className={styles.wrapper}>
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon size={28} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}

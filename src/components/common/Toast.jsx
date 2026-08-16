import styles from './Toast.module.css';

export default function ToastContainer({ toasts }) {
  if (!toasts?.length) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={[styles.toast, styles[toast.type] || styles.info].join(' ')}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

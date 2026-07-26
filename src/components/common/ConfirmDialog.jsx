import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
        {message}
      </p>
    </Modal>
  );
}

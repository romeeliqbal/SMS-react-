import styles from './FormField.module.css';

export function FieldWrapper({ label, htmlFor, error, hint, children, required }) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      {children}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function TextInput({ id, label, error, hint, required, className = '', ...rest }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input
        id={id}
        className={[styles.input, error ? styles.inputError : '', className].filter(Boolean).join(' ')}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function SelectInput({ id, label, error, hint, required, children, className = '', ...rest }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select
        id={id}
        className={[styles.input, styles.select, error ? styles.inputError : '', className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}

export function TextareaInput({ id, label, error, hint, required, className = '', ...rest }) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        className={[styles.input, styles.textarea, error ? styles.inputError : '', className]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={Boolean(error)}
        {...rest}
      />
    </FieldWrapper>
  );
}

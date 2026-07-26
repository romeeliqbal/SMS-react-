import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  className = '',
  ...rest
}) {
  const classNames = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.medium,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} {...rest}>
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
}

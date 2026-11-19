import styles from './Button.module.css';

/**
 * Pill button. Renders an <a> when `href` is given, otherwise a <button>.
 * variant: 'primary' (filled green) | 'outline' (white with green border)
 */
export default function Button({ variant = 'primary', href, children, className = '', ...rest }) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

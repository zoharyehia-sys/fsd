import classes from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}: ButtonProps) {
  const buttonClasses = `${classes.button} ${classes[variant]} ${fullWidth ? classes.fullWidth : ''} ${className || ''}`;

  return (
    <button
      className={buttonClasses}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <span className={classes.spinner} /> : null}
      {children}
    </button>
  );
}

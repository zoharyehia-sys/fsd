import classes from './Loader.module.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function Loader({ size = 'medium', message }: LoaderProps) {
  return (
    <div className={`${classes.loader} ${classes[size]}`}>
      <div className={classes.spinner} />
      {message && <p className={classes.message}>{message}</p>}
    </div>
  );
}

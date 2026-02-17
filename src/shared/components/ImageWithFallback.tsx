import classes from './ImageWithFallback.module.scss';

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export default function ImageWithFallback({
  fallback = 'https://via.placeholder.com/400x300?text=No+Image',
  onError,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = fallback;
    onError?.(e as any);
  };

  return (
    <img
      className={classes.image}
      onError={handleError}
      loading="lazy"
      alt={alt ?? ''}
      {...props}
    />
  );
}

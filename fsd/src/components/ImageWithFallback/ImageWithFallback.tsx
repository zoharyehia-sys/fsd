import { FC, useState, useEffect, ImgHTMLAttributes, memo } from "react";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImageWithFallback: FC<ImageProps> = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsError(false);
  }, [src]);

  if (isError) {
    return (
      <div
        className={props.className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#eee",
          color: "#666",
          textAlign: "center",
          padding: "20px",
        }}
      >
        תמונה לא זמינה
      </div>
    );
  }

  return (
    <img {...props} src={imgSrc} alt={alt} onError={() => setIsError(true)} />
  );
};

export default memo(ImageWithFallback);

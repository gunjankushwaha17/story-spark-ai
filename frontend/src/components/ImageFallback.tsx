import { useState, useEffect } from "react";
import { useCachedImage } from "../hooks/useCachedImage";

interface ImageFallbackProps {
  src?: string;
  alt: string;
  className?: string;
}

const FALLBACK =
  "https://placehold.co/800x400/png?text=Story+Image";

export default function ImageFallback({
  src,
  alt,
  className,
}: ImageFallbackProps) {
  const { cachedSrc } = useCachedImage(src);
  const [imageSrc, setImageSrc] = useState(FALLBACK);

  useEffect(() => {
    if (cachedSrc) {
      setImageSrc(cachedSrc);
    } else {
      setImageSrc(src || FALLBACK);
    }
  }, [cachedSrc, src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(FALLBACK)}
    />
  );
}
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';

export const SafeImage = ({
  src,
  alt = 'Blog Image',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError && imgSrc === fallbackSrc) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 ${className}`}>
        <ImageIcon className="w-8 h-8 opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default SafeImage;

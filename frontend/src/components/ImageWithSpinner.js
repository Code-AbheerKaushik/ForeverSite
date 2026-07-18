import React, { useEffect, useState } from 'react';

function ImageWithSpinner({ src, alt, className, onLoad, onError, loading: loadingMode = 'lazy', ...props }) {
  const [isLoading, setIsLoading] = useState(Boolean(src));

  useEffect(() => {
    setIsLoading(Boolean(src));
  }, [src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loadingMode}
        decoding="async"
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={(event) => {
          setIsLoading(false);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsLoading(false);
          onError?.(event);
        }}
        {...props}
      />
    </div>
  );
}

export default ImageWithSpinner;

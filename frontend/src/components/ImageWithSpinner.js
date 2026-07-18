import React, { memo, useLayoutEffect, useRef, useState } from 'react';

const ImageWithSpinner = memo(function ImageWithSpinner({ src, alt, className, onLoad, onError, loading: loadingMode = 'lazy', ...props }) {
  const imageRef = useRef(null);
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  const [status, setStatus] = useState(normalizedSrc ? 'loading' : 'idle');

  // Check the actual <img> node: cached images become visible without extra preloads.
  useLayoutEffect(() => {
    const image = imageRef.current;
    if (!normalizedSrc) {
      setStatus('idle');
    } else if (image?.complete) {
      setStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
    } else {
      setStatus('loading');
    }
  }, [normalizedSrc]);

  const isLoading = status === 'loading';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black"></div>
        </div>
      )}
      <img
        ref={imageRef}
        src={normalizedSrc}
        alt={alt}
        loading={loadingMode}
        decoding="async"
        className={`${className || ''} transition-opacity duration-200`}
        onLoad={(event) => {
          setStatus('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          setStatus('error');
          onError?.(event);
        }}
        {...props}
      />
    </div>
  );
});

export default ImageWithSpinner;

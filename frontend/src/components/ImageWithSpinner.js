import React, { useState, useEffect } from 'react';

function ImageWithSpinner({ src, alt, className, ...props }) {
  // Check synchronously if the image is already cached/complete
  const [loading, setLoading] = useState(() => {
    if (!src) return false;
    const img = new Image();
    img.src = src;
    return !img.complete;
  });

  // Reset loading state when the source URL changes, checking if it is already loaded
  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }
    const img = new Image();
    img.src = src;
    if (img.complete) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || ''} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </div>
  );
}

export default ImageWithSpinner;

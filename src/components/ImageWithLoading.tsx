import { useState, useEffect, useRef } from 'react';

interface ImageWithLoadingProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  priority?: boolean;
}

export default function ImageWithLoading({ 
  src, 
  alt, 
  className, 
  containerClassName = "",
  priority = false,
  ...props 
}: ImageWithLoadingProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' } // Load significantly earlier to prevent flickering
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef}
      className={`relative w-full h-full overflow-hidden bg-gray-100 ${containerClassName}`}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-yellow-200 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      )}
      
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: 'opacity' }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setError(true);
          }}
          decoding="async"
          {...props}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Failed to load
        </div>
      )}
    </div>
  );
}

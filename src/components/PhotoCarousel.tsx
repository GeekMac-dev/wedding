import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Maximize2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
  autoPlay?: boolean;
  interval?: number;
}

export default function PhotoCarousel({ photos, autoPlay = true, interval = 5000 }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused || photos.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, photos.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-rose-50 rounded-2xl">
        <p className="text-rose-400 text-lg">No photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Image Container */}
        <div className="relative aspect-[16/9] bg-black">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          ))}

          {/* Caption */}
          {photos[currentIndex]?.caption && (
            <div className="absolute bottom-16 left-0 right-0 text-center">
              <p className="text-white text-lg font-light italic px-4">
                "{photos[currentIndex].caption}"
              </p>
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300 group"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300 group"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => handleDownload(photos[currentIndex].url, `wedding-photo-${currentIndex + 1}.jpg`)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300"
              aria-label="Download photo"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all duration-300"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex gap-2 p-4 bg-white overflow-x-auto">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-rose-500 ring-offset-2 scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img
            src={photos[currentIndex].url}
            alt={photos[currentIndex].caption || `Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={() => handleDownload(photos[currentIndex].url, `wedding-photo-${currentIndex + 1}.jpg`)}
              className="px-4 py-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      )}
    </>
  );
}

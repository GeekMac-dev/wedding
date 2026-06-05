import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, X, ChevronLeft, ChevronRight, User, Calendar, CheckSquare, Square } from 'lucide-react';
import ImageWithLoading from './ImageWithLoading';

interface Photo {
  id: string;
  url: string;
  displayUrl?: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  caption?: string;
  uploadedBy?: string;
  createdAt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
}

export default function PhotoGallery({ photos, title = "Photo Gallery" }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedPhoto !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

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

  const handleBulkDownload = async () => {
    const selectedPhotos = photos.filter(p => selectedForDownload.has(p.id));
    for (let i = 0; i < selectedPhotos.length; i++) {
      await handleDownload(selectedPhotos[i].originalUrl || selectedPhotos[i].url, `wedding-photo-${i + 1}.jpg`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedForDownload(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedForDownload(new Set(photos.map(p => p.id)));
  };

  const deselectAll = () => {
    setSelectedForDownload(new Set());
  };

  const goToPrevious = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length);
    }
  };

  const goToNext = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photos.length);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No photos yet</h3>
        <p className="text-gray-500">Be the first to share a memory!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with Selection Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-serif text-gray-800">{title}</h3>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) deselectAll();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelectionMode
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSelectionMode ? 'Cancel Selection' : 'Select Photos'}
          </button>
          
          {isSelectionMode && (
            <>
              <button
                onClick={selectedForDownload.size === photos.length ? deselectAll : selectAll}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                {selectedForDownload.size === photos.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedForDownload.size > 0 && (
                <button
                  onClick={handleBulkDownload}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-600 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download ({selectedForDownload.size})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => isSelectionMode ? toggleSelection(photo.id) : setSelectedPhoto(index)}
          >
            <ImageWithLoading
              src={photo.thumbnailUrl || photo.url}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              isSelectionMode && selectedForDownload.has(photo.id)
                ? 'bg-yellow-500/30'
                : 'bg-black/0 group-hover:bg-black/30'
            }`} />

            {isSelectionMode && (
              <div className="absolute top-2 left-2">
                {selectedForDownload.has(photo.id) ? (
                  <CheckSquare className="w-6 h-6 text-white drop-shadow-lg" />
                ) : (
                  <Square className="w-6 h-6 text-white drop-shadow-lg opacity-70 group-hover:opacity-100" />
                )}
              </div>
            )}

            {!isSelectionMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(photo.originalUrl || photo.url, `wedding-photo-${index + 1}.jpg`);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Uploader & Date Overlay - Always visible on web for better context */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-wider">
                  <User className="w-2.5 h-2.5 text-yellow-400" />
                  <span className="truncate">{photo.uploadedBy || 'Guest'}</span>
                </div>
                {photo.createdAt && (
                  <div className="flex items-center gap-1.5 text-white/60 text-[8px] uppercase tracking-widest font-medium">
                    <Calendar className="w-2 h-2" />
                    <span>{new Date(photo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal - Using Portal to ensure it's on top of everything */}
      {selectedPhoto !== null && !isSelectionMode && createPortal(
        <div 
          className="fixed inset-0 w-screen h-screen m-0 p-0 top-0 left-0 z-[100000] bg-black flex flex-col items-center justify-center overflow-hidden"
          style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Controls Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-10 flex items-center justify-between z-[100020] pointer-events-none">
            <div className="bg-white/10 backdrop-blur-2xl px-4 py-1.5 md:px-6 md:py-3 rounded-full text-white text-xs md:text-sm font-bold border border-white/20 shadow-2xl pointer-events-auto">
              {selectedPhoto + 1} / {photos.length}
            </div>
            
            <div className="flex items-center gap-3 md:gap-5 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(photos[selectedPhoto].originalUrl || photos[selectedPhoto].url, `wedding-photo-${selectedPhoto + 1}.jpg`);
                }}
                className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-2xl text-white hover:bg-yellow-500 hover:text-black transition-all border border-white/20 shadow-xl"
                title="Download"
              >
                <Download className="w-5 h-5 md:w-8 md:h-8" />
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-2xl text-white hover:bg-red-500 transition-all border border-white/20 shadow-xl"
                title="Close"
              >
                <X className="w-5 h-5 md:w-8 md:h-8" />
              </button>
            </div>
          </div>

          {/* Navigation Controls Overlay */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-12 z-[100020] pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="w-12 h-12 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white/5 md:bg-white/10 backdrop-blur-md md:backdrop-blur-3xl text-white hover:bg-yellow-500 hover:text-black transition-all border border-white/10 md:border-white/20 pointer-events-auto group"
            >
              <ChevronLeft className="w-6 h-6 md:w-16 md:h-16 group-hover:-translate-x-2 transition-transform" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="w-12 h-12 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-white/5 md:bg-white/10 backdrop-blur-md md:backdrop-blur-3xl text-white hover:bg-yellow-500 hover:text-black transition-all border border-white/10 md:border-white/20 pointer-events-auto group"
            >
              <ChevronRight className="w-6 h-6 md:w-16 md:h-16 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Main Visual Area */}
          <div className="relative flex-1 w-full flex flex-col items-center justify-center p-4 md:p-10 z-[100010] min-h-0">
            <div 
              className="relative max-w-full max-h-full flex items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedPhoto].displayUrl || photos[selectedPhoto].url}
                alt=""
                className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.05)] select-none animate-in fade-in zoom-in-95 duration-500 rounded-sm pointer-events-auto"
              />
            </div>
          </div>

          {/* Bottom Info Bar - Caption, Uploader & Thumbnails */}
          <div 
            className="w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-8 px-4 flex flex-col items-center gap-6 z-[100020]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Caption & Uploader Info */}
            <div className="text-center max-w-4xl w-full">
              {photos[selectedPhoto].caption && (
                <p className="text-white text-lg md:text-3xl font-serif italic mb-4 drop-shadow-2xl">
                  "{photos[selectedPhoto].caption}"
                </p>
              )}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black">
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-yellow-400" />
                  <span>By {photos[selectedPhoto].uploadedBy || 'Anonymous Guest'}</span>
                </div>
                <span className="hidden md:inline text-white/30 font-light">|</span>
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>{photos[selectedPhoto].createdAt ? new Date(photos[selectedPhoto].createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
                </div>
              </div>
            </div>

            {/* Thumbnails Strip */}
            <div className="flex justify-center gap-3 overflow-x-auto py-2 max-w-full hide-scrollbar px-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhoto(i)}
                  className={`flex-shrink-0 w-12 h-12 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    selectedPhoto === i 
                      ? 'border-yellow-400 scale-110 z-10 shadow-[0_0_40px_rgba(250,204,21,0.3)]' 
                      : 'border-white/10 opacity-30 hover:opacity-100'
                  }`}
                >
                  <img src={p.thumbnailUrl || p.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

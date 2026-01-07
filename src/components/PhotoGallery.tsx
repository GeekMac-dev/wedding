import { useState } from 'react';
import { Download, X, ChevronLeft, ChevronRight, User, Calendar, CheckSquare, Square } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
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
      await handleDownload(selectedPhotos[i].url, `wedding-photo-${i + 1}.jpg`);
      // Small delay between downloads
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
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No photos yet</h3>
        <p className="text-gray-500">Be the first to share a memory!</p>
      </div>
    );
  }

  return (
    <div>
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
                ? 'bg-rose-100 text-rose-600'
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-2"
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
            <img
              src={photo.url}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Hover Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              isSelectionMode && selectedForDownload.has(photo.id)
                ? 'bg-rose-500/30'
                : 'bg-black/0 group-hover:bg-black/30'
            }`} />

            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="absolute top-2 left-2">
                {selectedForDownload.has(photo.id) ? (
                  <CheckSquare className="w-6 h-6 text-white drop-shadow-lg" />
                ) : (
                  <Square className="w-6 h-6 text-white drop-shadow-lg opacity-70 group-hover:opacity-100" />
                )}
              </div>
            )}

            {/* Download Button (non-selection mode) */}
            {!isSelectionMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(photo.url, `wedding-photo-${index + 1}.jpg`);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Photo Info */}
            {photo.uploadedBy && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-white text-xs">
                  <User className="w-3 h-3" />
                  <span>{photo.uploadedBy}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && !isSelectionMode && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div 
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].caption || `Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="text-white">
                {photos[selectedPhoto].uploadedBy && (
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <User className="w-4 h-4" />
                    <span>Uploaded by {photos[selectedPhoto].uploadedBy}</span>
                  </div>
                )}
                {photos[selectedPhoto].createdAt && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(photos[selectedPhoto].createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleDownload(photos[selectedPhoto].url, `wedding-photo-${selectedPhoto + 1}.jpg`)}
                className="px-6 py-3 rounded-full bg-white text-gray-800 font-medium hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}

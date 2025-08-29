import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  title?: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  title = "Gallery"
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset current index when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen || images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 text-white bg-black bg-opacity-50 backdrop-blur-sm">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
            <p className="text-xs md:text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 md:p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center relative px-4 md:px-6 pb-4 md:pb-6">
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            style={{
              maxHeight: 'calc(100vh - 200px)',
              maxWidth: 'calc(100vw - 2rem)'
            }}
            onError={(e) => {
              e.currentTarget.src = '';
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="p-3 md:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-yellow-500 opacity-100' 
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryModal;
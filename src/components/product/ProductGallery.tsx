import { motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Play, Video } from 'lucide-react';

interface ProductGalleryProps {
  productName: string;
  mainMedia: { type: 'image' | 'instagram'; url: string }[];
  currentMediaIndex: number;
  setCurrentMediaIndex: (index: number) => void;
  variants: { imageUrl: string; name: string }[];
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
  reviewImages: string[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  showImageModal: boolean;
  setShowImageModal: (state: boolean) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  mainMedia,
  currentMediaIndex,
  setCurrentMediaIndex,
  variants,
  selectedVariant,
  setSelectedVariant,
  reviewImages,
  selectedImageIndex,
  setSelectedImageIndex,
  showImageModal,
  setShowImageModal,
}) => {
  const current = mainMedia[currentMediaIndex];

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? mainMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev === mainMedia.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Media Display */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square p-4">
        {current.type === 'image' ? (
          <img
            src={current.url}
            alt={productName}
            loading="lazy"
            className="w-full h-full object-contain cursor-pointer rounded-2xl transition-transform duration-300 hover:scale-105"
            onClick={() => setShowImageModal(true)}
          />
        ) : (
          <iframe
            src={current.url}
            title="Instagram Reel"
            className="w-full h-full rounded-2xl"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Navigation arrows */}
        {mainMedia.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 rounded-full p-2 shadow-md z-10 transition hover:ring-2"
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600 rounded-full p-2 shadow-md z-10 transition hover:ring-2"
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Media index indicator */}
      {mainMedia.length > 1 && (
        <div className="flex justify-center gap-1">
          {mainMedia.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                currentMediaIndex === idx ? 'bg-terracotta-500 scale-110' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Media thumbnails */}
      {mainMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {mainMedia.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentMediaIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all focus:outline-none ${
                currentMediaIndex === idx
                  ? 'border-terracotta-500 ring-2 ring-terracotta-200'
                  : 'border-gray-200 hover:border-terracotta-300'
              }`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 bg-gray-100">
                  <Play/>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Variant Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {variants.map((variant, index) => (
          <div key={index} className="space-y-1 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedVariant(index)}
              className={`w-24 h-24 sm:w-full sm:h-full border-2 rounded-xl overflow-hidden aspect-square transition-all focus:outline-none ${
                selectedVariant === index
                  ? 'border-terracotta-500 ring-2 ring-terracotta-200 shadow-md'
                  : 'border-cream-200 hover:border-terracotta-300'
              }`}
            >
              <img
                src={variant.imageUrl}
                alt={`${productName} - ${variant.name}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </motion.button>
            <p className="text-xs text-gray-700 truncate">{variant.name}</p>
          </div>
        ))}
      </div>

      {/* Customer Photos */}
      {reviewImages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold mb-4 flex items-center text-gray-800">
            <Camera size={18} className="mr-2 text-terracotta-500" />
            Customer Photos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {reviewImages.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 hover:scale-[1.01] transition-transform"
              >
                <img
                  src={image}
                  alt={`Customer photo ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setShowImageModal(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductGallery;

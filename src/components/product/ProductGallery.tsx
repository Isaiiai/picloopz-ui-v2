import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

interface ProductGalleryProps {
  productName: string;
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
  variants,
  selectedVariant,
  setSelectedVariant,
  reviewImages,
  selectedImageIndex,
  setSelectedImageIndex,
  showImageModal,
  setShowImageModal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Main Image */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square p-4">
        <img
          src={variants[selectedVariant].imageUrl}
          alt={productName}
          className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setShowImageModal(true)}
        />
      </div>

      {/* Variant Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {variants.map((variant, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedVariant(index)}
            className={`border-2 rounded-xl overflow-hidden aspect-square transition-all ${
              selectedVariant === index
                ? 'border-terracotta-500 ring-2 ring-terracotta-200 shadow-md'
                : 'border-cream-200 hover:border-terracotta-300'
            }`}
          >
            <img
              src={variant.imageUrl}
              alt={`${productName} - ${variant.name}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      {/* Customer Photos */}
      {reviewImages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold mb-4 flex items-center">
            <Camera size={18} className="mr-2 text-terracotta-500" />
            Customer Photos
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {reviewImages.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={image}
                  alt={`Customer photo ${index + 1}`}
                  className="w-full h-full object-cover"
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

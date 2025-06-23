import { motion } from 'framer-motion';
import { Star, Upload, Check, ShoppingCart, Heart, Share2, Verified } from 'lucide-react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import ProductShareMenu from './ProductShareMenu';
import { useReview } from '../../features/review/useReview';

interface ProductInfoProps {
  product: any;
  averageRating: number;
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  getRootProps: (props?: DropzoneRootProps) => any;
  getInputProps: (props?: DropzoneInputProps) => any;
  isDragActive: boolean;
  singleUpload: { url: string } | null;
  uploadLoading: boolean;
  handleAddToCart: () => void;
  isInFavorites: boolean;
  toggleFavorite: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  averageRating,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  getRootProps,
  getInputProps,
  isDragActive,
  singleUpload,
  uploadLoading,
  handleAddToCart,
  isInFavorites,
  toggleFavorite,
}) => {
  const { total } = useReview();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg h-fit"
    >
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.tags?.map((tag: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1 bg-terracotta-50 text-terracotta-700 text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-playfair text-gray-900">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center mb-6">
        <div className="flex mr-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < Math.floor(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-lg font-medium text-gray-900">{averageRating.toFixed(1)}</span>
        <span className="text-gray-500 mx-2">•</span>
        <span className="text-gray-600">{total} reviews</span>
        <span className="text-gray-500 mx-2">•</span>
        <span className="text-gray-600">{product.orderCount} sold</span>
      </div>

      {/* Price */}
      <div className="text-2xl sm:text-3xl font-bold text-terracotta-600 mb-6 sm:mb-8">
        ₹{(product.basePrice + product.variants[selectedVariant].additionalPrice).toFixed(2)}
      </div>

      {/* Variant Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900">Select Variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.variants.map((variant: any, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedVariant(index)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                selectedVariant === index
                  ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                  : 'border-cream-200 text-gray-700 hover:border-terracotta-300 hover:bg-cream-50'
              }`}
            >
              <div className="font-medium">{variant.name}</div>
              <div className="text-sm opacity-75">
                ₹{(product.basePrice + variant.additionalPrice).toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900">Quantity</h3>
        <div className="flex items-center w-fit border-2 border-cream-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-12 text-center font-medium focus:outline-none"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Upload Image */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2 text-gray-900">Upload Your Photo</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload an image to customize your product. This is required before adding to cart.
        </p>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-terracotta-400 bg-terracotta-50'
              : singleUpload
              ? 'border-green-400 bg-green-50'
              : 'border-cream-300 hover:border-terracotta-300 hover:bg-cream-50'
          }`}
        >
          <input {...getInputProps()} />
          {uploadLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse flex justify-center">
                <div className="h-10 w-10 bg-terracotta-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Uploading image...</p>
            </div>
          ) : singleUpload ? (
            <div className="space-y-3">
              <div className="relative inline-block">
                <img
                  src={singleUpload.url}
                  alt="Uploaded preview"
                  className="max-h-32 mx-auto object-contain rounded-lg"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-green-600 font-medium">Image uploaded successfully!</p>
              <p className="text-xs text-gray-500">Click or drag to replace the image</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="mx-auto text-gray-400" size={40} />
              <p className="text-gray-700 font-medium">Drag and drop an image here, or click to select</p>
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG. Max size: 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!singleUpload || uploadLoading}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${
            singleUpload && !uploadLoading
              ? 'bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          {uploadLoading ? 'Processing...' : 'Add to Cart'}
        </motion.button>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={`p-4 rounded-xl border-2 transition-all ${
              isInFavorites
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'border-cream-300 text-gray-600 hover:bg-cream-50 hover:border-terracotta-300'
            }`}
            aria-label={isInFavorites ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={20} className={isInFavorites ? 'fill-current' : ''} />
          </motion.button>

          <ProductShareMenu product={product}/>

        </div>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-cream-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <Check size={16} className="text-green-600" />
          </div>
          <span className="text-sm text-gray-700">Quality Guaranteed</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Verified size={16} className="text-blue-600" />
          </div>
          <span className="text-sm text-gray-700">Satisfaction Promise</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductInfo;

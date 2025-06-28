import { motion } from 'framer-motion';
import { Star, Upload, Check, ShoppingCart, Heart, Share2, Verified } from 'lucide-react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import ProductShareMenu from './ProductShareMenu';
import { useReview } from '../../features/review/useReview';
import { useUpload } from '../../features/upload/useUpload';

interface ProductInfoProps {
  product: any;
  averageRating: number;
  selectedVariant: number;
  setSelectedVariant: (index: number) => void;
  getRootProps: (props?: DropzoneRootProps) => any;
  getInputProps: (props?: DropzoneInputProps) => any;
  isDragActive: boolean;
  singleUpload: { url: string } | null;
  uploadLoading: boolean;
  handleAddToCart: () => void;
  isInFavorites: boolean;
  toggleFavorite: () => void;
  requiredFilesCount: number;
  filesToUpload: File[];
  previewUrls: string[];
  uploadProgress: number;
  setFilesToUpload: (q: File[]) => any;
  setPreviewUrls: (q: string[]) => any;
  handleUploadCartImages: () => any;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  averageRating,
  selectedVariant,
  setSelectedVariant,
  getRootProps,
  getInputProps,
  isDragActive,
  singleUpload,
  uploadLoading,
  handleAddToCart,
  isInFavorites,
  toggleFavorite,
  requiredFilesCount,
  filesToUpload,
  uploadProgress,
  previewUrls,
  setFilesToUpload,
  setPreviewUrls,
  handleUploadCartImages
}) => {
  const { total } = useReview();
  const { loading, cartImagesUpload } = useUpload();
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
      <div className="text-3xl font-bold text-terracotta-600 mb-8">
        ₹{(product.variants[selectedVariant].price).toFixed(2)}
      </div>

      {/* Variant Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900">Select Variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.variants.map((variant: any, index: number) => {
            const isOutOfStock = !variant.inStock;
            return (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`p-4 border-2 rounded-xl text-left transition-all relative ${
                  selectedVariant === index
                    ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                    : 'border-cream-200 text-gray-700 hover:border-terracotta-300 hover:bg-cream-50'
                } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isOutOfStock}
              >
                <div className="font-medium">{variant.name}</div>
                <div className="text-sm opacity-75">₹{variant.price.toFixed(2)}</div>
                {isOutOfStock && (
                  <div className="absolute bottom-2 right-2 text-xs font-medium text-red-900 bg-red-100 px-2 py-0.5 rounded-full">
                    Out of Stock
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Image */}
      {product.variants[selectedVariant].inStock ?
      (
        <div>
        <div className="mb-8">
        <h3 className="font-semibold mb-2 text-gray-900">
          Upload Your Photos ({requiredFilesCount} required)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {cartImagesUpload?.uploads?.length === requiredFilesCount
            ? "All images uploaded successfully!"
            : `Please upload ${requiredFilesCount} images to customize your product`}
        </p>
        
        {/* Dropzone */}
        {(!cartImagesUpload || cartImagesUpload.uploads.length < requiredFilesCount) && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-terracotta-400 bg-terracotta-50' : 'border-cream-300 hover:border-terracotta-300 hover:bg-cream-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-3">
              <Upload className="mx-auto text-gray-400" size={40} />
              <p className="text-gray-700 font-medium">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                {filesToUpload.length + (cartImagesUpload?.uploads?.length || 0)}/{requiredFilesCount} images selected
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {loading.cartUploadLoading && (
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-terracotta-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Preview section */}
        {(previewUrls.length > 0 || cartImagesUpload?.uploads?.length) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {cartImagesUpload?.uploads?.length === requiredFilesCount
                ? "Uploaded Images:"
                : "Selected Images:"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {/* Show uploaded images first */}
              {cartImagesUpload?.uploads?.map((upload, index) => (
                <div key={`uploaded-${index}`} className="relative">
                  <img
                    src={upload.url}
                    alt={`Uploaded ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <Check size={12} />
                  </div>
                </div>
              ))}
              
              {/* Show local previews for not-yet-uploaded files */}
              {previewUrls.map((url, index) => (
                <div key={`preview-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newFiles = [...filesToUpload];
                      const newPreviews = [...previewUrls];
                      newFiles.splice(index, 1);
                      newPreviews.splice(index, 1);
                      setFilesToUpload(newFiles);
                      setPreviewUrls(newPreviews);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload button */}
        {filesToUpload.length > 0 && !loading.cartUploadLoading && (
          <div className="mt-4">
            <button
              onClick={handleUploadCartImages}
              disabled={filesToUpload.length + (cartImagesUpload?.uploads?.length || 0) < requiredFilesCount}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                filesToUpload.length + (cartImagesUpload?.uploads?.length || 0) < requiredFilesCount
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
              }`}
            >
              Upload {filesToUpload.length} Image{filesToUpload.length !== 1 ? 's' : ''}
            </button>
            {filesToUpload.length + (cartImagesUpload?.uploads?.length || 0) < requiredFilesCount && (
              <p className="text-xs text-red-500 mt-1">
                Please select {requiredFilesCount - (filesToUpload.length + (cartImagesUpload?.uploads?.length || 0))} more image{requiredFilesCount - (filesToUpload.length + (cartImagesUpload?.uploads?.length || 0)) !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={
            (cartImagesUpload?.uploads?.length || 0) < requiredFilesCount ||
            loading.cartUploadLoading
          }
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${
            cartImagesUpload && !loading.cartUploadLoading
              ? 'bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          {loading.cartUploadLoading ? 'Processing...' : 'Add to Cart'}
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
      </div>
      ) : (
        <div className="mb-8 p-6 bg-cream-50 border border-cream-200 rounded-lg flex items-center gap-4">
          <div className="bg-red-100 text-red-600 rounded-full p-2">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Currently Out of Stock</p>
            <p className="text-sm text-gray-600">This variant is not available at the moment. Please check back later or choose another option.</p>
          </div>
        </div>
      )}


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

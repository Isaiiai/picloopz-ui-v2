import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Heart, Share2, ShoppingCart, Star, Upload, Camera, Check, Verified, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useCart } from '../features/cart/useCart';
import { useFavorites } from '../contexts/FavoritesContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { 
  selectCurrentProduct, 
  selectProductLoading,
  selectCategoryInfo,
  selectCategoryProducts
} from '../features/product/productSelectors';
import { getProductById, getProductsByCategory } from '../features/product/productThunks';
import { clearCurrentProduct } from '../features/product/productSlice';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const categoryInfo = useSelector(selectCategoryInfo);
  const relatedProducts = useSelector(selectCategoryProducts);
  
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    images: [] as string[]
  });
  
  // Fetch product and related products
  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, productId]);

  // Fetch related products when product is loaded
  useEffect(() => {
    if (product?.categoryId) {
      dispatch(getProductsByCategory({
        categoryId: product.categoryId,
        params: { limit: 4, exclude: product.id }
      }));
    }
  }, [dispatch, product?.categoryId, product?.id]);

  // Dropzone configuration for image upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result as string);
          toast.success('Image uploaded successfully!');
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Dropzone for review images
  const reviewImageDropzone = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setNewReview(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  });
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!uploadedImage) {
      toast.error('Please upload an image before adding to cart');
      return;
    }
    
    if (product) {
      addToCart({
        productId: product.id,
        variantId: product.variants[selectedVariant].id,
        quantity: quantity,
      });
      toast.success('Added to cart!');
    }
  };
  
  // Handle add/remove from favorites
  const toggleFavorite = () => {
    if (product) {
      if (isInFavorites(product.id)) {
        removeFromFavorites(product.id);
        toast.success('Removed from favorites');
      } else {
        addToFavorites(product);
        toast.success('Added to favorites');
      }
    }
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '', images: [] });
    } else {
      toast.error('Please add a comment to your review');
    }
  };

  // Collect all review images for gallery
  useEffect(() => {
    if (product?.reviews) {
      const allImages: string[] = [];
      product.reviews.forEach((review) => {
        allImages.push(...review.images);
      });
      setReviewImages(allImages);
    }
  }, [product?.reviews]);

  // If loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/category/all" className="inline-block bg-terracotta-600 text-white px-6 py-2 rounded-full">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-terracotta-600 transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to={`/category/${product.categoryId}`} className="hover:text-terracotta-600 transition-colors">
            {categoryInfo?.name || 'Category'}
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square p-4">
              <img 
                src={product.variants[selectedVariant].imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setShowImageModal(true)}
              />
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {product.variants.map((variant, index) => (
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
                    alt={`${product.name} - ${variant.name}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Customer Photo Gallery */}
            {reviewImages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Camera size={18} className="mr-2 text-terracotta-500" />
                  Customer Photos
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {reviewImages.slice(0, 8).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
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
          
          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg h-fit"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-terracotta-50 text-terracotta-700 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-4 font-playfair text-gray-900">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'} 
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-900">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-600">
                {product.reviewCount} reviews
              </span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-600">
                {product.orderCount} sold
              </span>
            </div>
            
            <div className="text-3xl font-bold text-terracotta-600 mb-8">
              ${(product.basePrice+product.variants[selectedVariant].additionalPrice).toFixed(2)}
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-gray-900">Select Variant</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant, index) => (
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
                    <div className="text-sm opacity-75">${(product.basePrice+variant.additionalPrice).toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-gray-900">Quantity</h3>
              <div className="flex items-center w-fit border-2 border-cream-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
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
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-cream-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Image Upload Section */}
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
                    : uploadedImage 
                      ? 'border-green-400 bg-green-50'
                      : 'border-cream-300 hover:border-terracotta-300 hover:bg-cream-50'
                }`}
              >
                <input {...getInputProps()} />
                
                {uploadedImage ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img 
                        src={uploadedImage} 
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
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG. Max size: 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!uploadedImage}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all ${
                  uploadedImage 
                    ? 'bg-terracotta-600 text-white hover:bg-terracotta-700 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isInFavorites(product.id)
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-cream-300 text-gray-600 hover:bg-cream-50 hover:border-terracotta-300'
                  }`}
                  aria-label={isInFavorites(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={20} className={isInFavorites(product.id) ? 'fill-current' : ''} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl border-2 border-cream-300 text-gray-600 hover:bg-cream-50 hover:border-terracotta-300 transition-all"
                  aria-label="Share product"
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>

            {/* Product Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream-200">
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
        </div>
        
        {/* Product Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg mb-16"
        >
          <div className="border-b border-cream-200">
            <div className="flex space-x-0 overflow-x-auto">
              {[
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Details' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? 'border-terracotta-600 text-terracotta-600 bg-terracotta-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-cream-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
                    <p className="text-gray-600 text-sm">Crafted with the finest materials for lasting beauty</p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Custom Made</h4>
                    <p className="text-gray-600 text-sm">Personalized just for you with your special moments</p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
                    <p className="text-gray-600 text-sm">Quick processing and reliable shipping</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Product Specifications</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-cream-100">
                      <dt className="font-medium text-gray-700">Materials:</dt>
                      <dd className="text-gray-600">{product.materials}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-cream-100">
                      <dt className="font-medium text-gray-700">Dimensions:</dt>
                      <dd className="text-gray-600">{product.dimensions}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-cream-100">
                      <dt className="font-medium text-gray-700">Processing Time:</dt>
                      <dd className="text-gray-600">{product.processingTime}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-gray-700">Shipping:</dt>
                      <dd className="text-gray-600">{product.shippingInfo}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Care Instructions</h3>
                  <ul className="space-y-2 text-gray-600">
                    {product.careInstructions?.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-terracotta-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={20} 
                            className={i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                      <span className="text-xl font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-2">based on {product.reviewCount} reviews</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-6 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors font-medium"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form Modal */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) setShowReviewForm(false);
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                      >
                        <h3 className="text-2xl font-semibold mb-6">Write a Review</h3>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className="p-1"
                              >
                                <Star
                                  size={24}
                                  className={star <= newReview.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-4 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            rows={4}
                            placeholder="Share your experience with this product..."
                          />
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos (Optional)</label>
                          <div 
                            {...reviewImageDropzone.getRootProps()}
                            className="border-2 border-dashed border-cream-300 rounded-xl p-6 text-center cursor-pointer hover:border-terracotta-300 transition-colors"
                          >
                            <input {...reviewImageDropzone.getInputProps()} />
                            <Camera className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-gray-600">Drag photos here or click to select</p>
                          </div>
                          
                          {newReview.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-4">
                              {newReview.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <img src={image} alt={`Review ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                  <button
                                    onClick={() => setNewReview(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== index)
                                    }))}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 py-3 border border-cream-300 text-gray-700 rounded-xl hover:bg-cream-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitReview}
                            className="flex-1 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors"
                          >
                            Submit Review
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border border-cream-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <img 
                              src={review.user.avatar} 
                              alt={review.user.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                                {review.isVerified && (
                                  <Verified size={16} className="text-blue-500 ml-2" />
                                )}
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="flex mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={14} 
                                      className={i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                        
                        {review.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-3 mb-4">
                            {review.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`Review image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  setSelectedImageIndex(index);
                                  setShowImageModal(true);
                                }}
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-cream-100">
                          <button className="flex items-center text-gray-500 hover:text-terracotta-600 transition-colors">
                            <ThumbsUp size={16} className="mr-2" />
                            Helpful
                          </button>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs text-gray-400">Verified Purchase</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-3 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition-colors font-medium"
                    >
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold font-playfair">You May Also Like</h2>
              <Link 
                to={`/category/${product.categoryId}`}
                className="text-terracotta-600 hover:text-terracotta-700 flex items-center transition-colors group"
              >
                View All
                <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related, idx) => (
                <motion.div 
                  key={related.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                >
                  <Link to={`/product/${related.id}`} className="block">
                    <div className="relative overflow-hidden aspect-square">
                      <img 
                        src={related.variants[0].imageUrl}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {related.isTrending && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 group-hover:text-terracotta-600 transition-colors mb-2">
                        {related.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-terracotta-600 font-bold text-lg">
                          ${related.variants[0].price.toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Star size={14} className="text-amber-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{related.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-terracotta-300 transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={reviewImages[selectedImageIndex] || product.variants[selectedVariant].imageUrl}
              alt="Product preview"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
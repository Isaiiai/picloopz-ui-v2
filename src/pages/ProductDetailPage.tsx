import { useEffect, useState, useMemo, useCallback, lazy } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';

import { useCart } from '../features/cart/useCart';
import { useFavorite } from '../features/favorite/useFavorite';
import { useUpload } from '../features/upload/useUpload';
import { useReview } from '../features/review/useReview';
import { useAuth } from '../features/auth/authHooks';

import {
  getProductById,
  getProductsByCategory,
} from '../features/product/productThunks';
import {
  clearCurrentProduct,
} from '../features/product/productSlice';
import { clearError as clearReviewError } from '../features/review/reviewSlice';
import { clearUploadState } from '../features/upload/uploadSlice';

import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  selectCurrentProduct,
  selectProductLoading,
  selectCategoryProducts
} from '../features/product/productSelectors';
import { useDropzone } from 'react-dropzone';
import { Review } from '../features/review/reviewTypes';
import { AxiosProgressEvent } from 'axios';

const ProductTabs = lazy(() => import('../components/product/ProductTabs'));
const RelatedProducts = lazy(() => import('../components/product/RelatedProducts'));
const ImageModal = lazy(() => import('../components/product/ImageModal'));

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorite();
  const {
    uploadMultiple,
    clear: clearUpload,
    reviewImageUpload,
    cartImagesUpload,
    error: uploadError,
  } = useUpload();
  const {
    reviews,
    total,
    averageRating,
    submitReview,
    editReview,
    loadProductReviews,
    loading: reviewLoading,
  } = useReview();
  const { isAuthenticated } = useAuth();

  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const relatedProducts = useSelector(selectCategoryProducts);

  const requiredFilesCount = product?.maxUserImages || 1;

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);


  const [files, setFiles] = useState<File[]>([]);
  const [newReview, setNewReview] = useState<Pick<Review, 'rating' | 'comment' | 'images'>>({
    rating: 5,
    comment: '',
    images: [],
  });

  const flatReviewImages = useMemo(() => reviews.flatMap((r) => r.images), [reviews]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (filesToUpload.length + acceptedFiles.length > requiredFilesCount) {
      toast.error(`You can only upload ${requiredFilesCount} images`);
      return;
    }
    const newFiles = [...filesToUpload, ...acceptedFiles];
    setFilesToUpload(newFiles);
    const newPreviewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  }, [filesToUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: requiredFilesCount,
    onDrop,
  });

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
      clearUpload();
    }
  }, [uploadError, clearUpload]);

  useEffect(() => {
    if (reviewImageUpload?.uploads?.length) {
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, ...reviewImageUpload.uploads.map((u) => u.url)],
      }));
      setFiles([]);
      dispatch(clearUploadState());
    }
  }, [reviewImageUpload]);

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
      loadProductReviews({ productId, page: 1, limit: 10, sort: 'createdAt', sortOrder: 'desc' });
    }
    return () => {
      dispatch(clearCurrentProduct());
      dispatch(clearReviewError());
    };
  }, [dispatch, productId]);

  useEffect(() => {
  if (typeof product?.categoryId === 'object' && '_id' in product.categoryId) {
    dispatch(
      getProductsByCategory({
        categoryId: product.categoryId._id,
        params: { limit: 4 }
      })
    );
  }
}, [dispatch, product?.categoryId]);


  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleAddToCart = async() => {
    if (!isAuthenticated) {
      toast('Please log in to add products to cart', { icon: '🔒' });
      return;
    }
    if (!product) return;
    const imageUrls = cartImagesUpload?.uploads.map(upload => upload.url) || [];
    await addToCart({
      productId: product.id,
      variantId: product.variants[selectedVariant].id,
      cartImages: imageUrls
    });
    clearUpload();
    toast.success('Added to cart!');
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast('Please log in to add favorites', { icon: '🔒' });
      return;
    }
    if (!product) return;
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(product.id);
      toast.success('Added to favorites');
    }
  };

  const mainMedia = useMemo(() => {
    const media: { type: 'image' | 'instagram' | 'youtube'; url: string }[] = [];

    // Add product image
    if (product?.variants?.[selectedVariant]?.imageUrl) {
      media.push({
        type: 'image',
        url: product.variants[selectedVariant].imageUrl,
      });
    }

    // Add Instagram reel if exists
    if (product?.videos?.length) {
      product.videos.forEach((video) => {
        if (video.url.includes('instagram.com')) {
          const embedUrl = video.url.includes('/embed')
            ? video.url
            : video.url.replace(/\/reel\/([^/?]+)/, '/reel/$1/embed');
          media.push({ type: 'instagram', url: embedUrl });
        }

        // Add support for YouTube links if needed
        if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
          media.push({
              type: 'youtube',
              url: video.url,
            });
        }
      });
    }
    console.log(media)


    return media;
  }, [product, selectedVariant]);


  const handleUploadCartImages = async () => {
    if (!isAuthenticated) {
      toast('Please log in to upload images', { icon: '🔒' });
      return;
    }
    if (filesToUpload.length < requiredFilesCount) {
      toast.error(`Please upload ${requiredFilesCount} images`);
      return;
    }
    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append('images', file));
    await uploadMultiple({
      formData,
      purpose: 'cart',
      onUploadProgress: (e: AxiosProgressEvent) => {
        const progress = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(progress);
      },
    });
    setFilesToUpload([]);
    setUploadProgress(0);
    toast.success('Images uploaded successfully!');
  };

  const handleUploadReviewImages = async () => {
    if (!isAuthenticated) {
      toast('Please log in to upload images', { icon: '🔒' });
      return;
    }
    if (files.length === 0) {
      toast.error('Please select images to upload');
      return;
    }
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    await uploadMultiple({ formData, purpose: 'review' });
    setFiles([]);
    toast.success('Images uploaded!');
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim() || !productId) {
      toast.error('Please add a comment to your review');
      return;
    }
    try {
      if (editingReview) {
        await editReview(editingReview.id, newReview);
        toast.success('Review updated!');
      } else {
        await submitReview({ productId, ...newReview });
        toast.success('Review submitted!');
      }
      setNewReview({ rating: 5, comment: '', images: [] });
      setEditingReview(null);
    } catch {
      toast.error(editingReview ? 'Failed to update review' : 'Failed to submit review');
    }
  };

  const handleImageClick = ( index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleReviewDeleted = useCallback(() => {
    console.log('=== HANDLE REVIEW DELETED CALLBACK ===');
    console.log('Product ID:', productId);
    console.log('Current reviews count:', reviews.length);
    console.log('Current review IDs:', reviews.map(r => r.id));
    
    if (productId) {
      console.log('Calling loadProductReviews with params:', { productId, page: 1, limit: 10, sort: 'createdAt', sortOrder: 'desc' });
      
      // Add a small delay to ensure backend has processed the deletion
      setTimeout(() => {
        loadProductReviews({ productId, page: 1, limit: 10, sort: 'createdAt', sortOrder: 'desc' });
        console.log('loadProductReviews called');
      }, 500);
    } else {
      console.log('No productId available');
    }
  }, [productId, loadProductReviews, reviews]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-8 bg-gradient-to-br from-amber-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-terracotta-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-amber-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-amber-100 via-cream-100 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>

      <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-x-hidden mt-16 md:mt-0">
        {/* Breadcrumbs */}
        <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8 px-1 sm:px-0">
          <a href="/" className="hover:text-terracotta-600">Home</a>
          <span className="mx-2">/</span>
          <a href={`/category/${product?.categoryId}`} className="hover:text-terracotta-600">
            {product?.categoryName || 'Category'}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        {/* Product Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          <ProductGallery
            productName={product.name}
            mainMedia={mainMedia}
            currentMediaIndex={currentMediaIndex}
            setCurrentMediaIndex={setCurrentMediaIndex}
            variants={(product.variants || []).map(v => ({
              name: v.name,
              imageUrl: v.imageUrl || '',
            }))}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            reviewImages={flatReviewImages}
            setSelectedImageIndex={setSelectedImageIndex}
            setShowImageModal={setShowImageModal}
          />


          <ProductInfo
            product={product}
            averageRating={averageRating}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            handleAddToCart={handleAddToCart}
            isInFavorites={isInFavorites(product.id)}
            toggleFavorite={toggleFavorite}
            requiredFilesCount={requiredFilesCount}
            filesToUpload={filesToUpload}
            setFilesToUpload={setFilesToUpload}
            previewUrls={previewUrls}
            setPreviewUrls={setPreviewUrls}
            uploadProgress={uploadProgress}
            handleUploadCartImages={handleUploadCartImages}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8 sm:mt-12">
          <ProductTabs
            product={product}
            reviews={reviews || []}
            total={total}
            averageRating={averageRating}
            newReview={newReview}
            setNewReview={setNewReview}
            files={files}
            setFiles={setFiles}
            handleSubmitReview={handleSubmitReview}
            handleUploadReviewImages={handleUploadReviewImages}
            reviewLoading={reviewLoading}
            onEditReview={(review) => {
              setEditingReview(review);
              setNewReview({
                rating: review.rating,
                comment: review.comment,
                images: review.images
              });
            }}
            editingReview={editingReview ?? {
              id: '',
              userId: '',
              userName: '',
              productId: '',
              productName: '',
              rating: 0,
              comment: '',
              images: [],
              isApproved: false,
              createdAt: '',
              updatedAt: ''
            }}
            onImageClick={handleImageClick}
            onReviewDeleted={handleReviewDeleted}
          />
        </div>

        {/* Related Products */}
        <div className="mt-8 sm:mt-12">
          <RelatedProducts
            relatedProducts={(relatedProducts || []).map((p: any) => ({
              id: p.id,
              name: p.name,
              rating: typeof p.rating === 'number' ? p.rating : 0,
              categoryId: p.categoryId,
              isTrending: !!p.isTrending,
              variants: (p.variants || []).map((v: any) => ({
                imageUrl: v.imageUrl || '',
                price: typeof v.price === 'number' ? v.price : 0
              })),
            }))}
            categoryId={
              typeof product.categoryId === 'object' && '_id' in product.categoryId
                ? product.categoryId._id
                : product.categoryId
            }
          />
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={
          (reviews?.flatMap?.(r => r.images)?.[selectedImageIndex]) || 
          product.variants?.[selectedVariant]?.imageUrl || ''
        }
      />
    </div>
  );
};

export default ProductDetailPage;

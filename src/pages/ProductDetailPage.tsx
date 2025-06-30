import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';

import { useCart } from '../features/cart/useCart';
import { useFavorite } from '../features/favorite/useFavorite';
import { useUpload } from '../features/upload/useUpload';
import { useReview } from '../features/review/useReview';

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
  selectCategoryInfo,
  selectCategoryProducts
} from '../features/product/productSelectors';
import { useDropzone } from 'react-dropzone';

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
    singleUpload,
    reviewImageUpload,
    cartImagesUpload,
    loading: uploadLoading,
    error: uploadError,
  } = useUpload();
  const {
    reviews,
    total,
    averageRating,
    submitReview,
    editReview,
    loadProductReviews,
    error: reviewError,
    loading: reviewLoading,
  } = useReview();

  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const relatedProducts = useSelector(selectCategoryProducts);

  const requiredFilesCount = product?.maxUserImages || 1;

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [files, setFiles] = useState<File[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    images: [],
  });

  const flatReviewImages = useMemo(() => reviews.flatMap((r) => r.images), [reviews]);

  const onEditReview = useCallback((review) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      images: review.images,
    });
  }, []);

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
    if (product?.categoryId?._id) {
      dispatch(getProductsByCategory({ categoryId: product.categoryId._id, params: { limit: 4 } }));
    }
  }, [dispatch, product?.categoryId?._id]);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleAddToCart = async() => {
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
    if (!product) return;
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(product.id);
      toast.success('Added to favorites');
    }
  };

  const handleUploadCartImages = async () => {
    if (filesToUpload.length < requiredFilesCount) {
      toast.error(`Please upload ${requiredFilesCount} images`);
      return;
    }
    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append('images', file));
    formData.append('productId', productId || '');
    try {
      await uploadMultiple({
        formData,
        purpose: 'cart',
        onUploadProgress: (e: ProgressEvent) => {
          const progress = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(progress);
        },
      });
      setFilesToUpload([]);
      setPreviewUrls([]);
      setUploadProgress(0);
      toast.success('Images uploaded successfully!');
    } catch {
      toast.error('Failed to upload images');
    }
  };

  const handleUploadReviewImages = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('productId', productId || '');
    try {
      await uploadMultiple({ formData, purpose: 'review' });
    } catch {
      toast.error('Failed to upload images');
    }
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

  const handleImageClick = (imageUrl: string, index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="container mx-auto max-w-screen-xl px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 overflow-x-hidden">
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
            variants={(product.variants || []).map(v => ({ name: v.name, imageUrl: v.imageUrl || '' }))}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            reviewImages={flatReviewImages}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            showImageModal={showImageModal}
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
            singleUpload={singleUpload}
            uploadLoading={uploadLoading}
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
            uploadLoading={uploadLoading}
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
            categoryId={product.categoryId}
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

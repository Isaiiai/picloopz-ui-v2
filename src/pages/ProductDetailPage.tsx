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
  selectCurrentProduct,
  selectProductLoading,
  selectCategoryInfo,
  selectCategoryProducts,
} from '../features/product/productSelectors';
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
    uploadSingle,
    uploadMultiple,
    clear: clearUpload,
    singleUpload,
    reviewImageUpload,
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
  const categoryInfo = useSelector(selectCategoryInfo);
  const relatedProducts = useSelector(selectCategoryProducts);

  const requiredFilesCount = 2;

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      variantId: product.variants[selectedVariant].id,
      quantity,
    });
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
      toast.success('Images uploaded successfully!');
      setFilesToUpload([]);
      setPreviewUrls([]);
      setUploadProgress(0);
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{categoryInfo?.name || 'Category'}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery
            productName={product.name}
            variants={product.variants}
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
            quantity={quantity}
            setQuantity={setQuantity}
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

        <Suspense fallback={<SkeletonLoader />}>
          <ProductTabs
            product={product}
            reviews={reviews}
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
            onEditReview={onEditReview}
            editingReview={editingReview}
            onImageClick={handleImageClick}
          />

          <RelatedProducts relatedProducts={relatedProducts} categoryId={product.categoryId} />

          <ImageModal
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
            imageUrl={flatReviewImages[selectedImageIndex] || product.variants[selectedVariant].imageUrl}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductDetailPage;

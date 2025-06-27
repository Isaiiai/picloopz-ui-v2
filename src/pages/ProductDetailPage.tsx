import { useEffect, useState } from 'react';
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
  getProductsByCategory
} from '../features/product/productThunks';
import {
  clearCurrentProduct
} from '../features/product/productSlice';
import {
  clearError as clearReviewError
} from '../features/review/reviewSlice';
import { clearUploadState } from '../features/upload/uploadSlice';

import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import ImageModal from '../components/product/ImageModal';
import { useDropzone } from 'react-dropzone';
import SkeletonLoader from '../components/SkeletonLoader';
import type { Review } from '../features/review/reviewTypes';
import {
  selectCurrentProduct,
  selectProductLoading,
  selectCategoryInfo,
  selectCategoryProducts
} from '../features/product/productSelectors';

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
    multipleUpload,
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

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    images: [] as string[]
  });

  useEffect(() => {
    if (uploadError) {
      toast.error(uploadError);
      clearUpload();
    }
  }, [uploadError, clearUpload]);

  useEffect(() => {
    if (multipleUpload?.uploads?.length) {
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, ...multipleUpload.uploads.map(u => u.url)]
      }));
      setFiles([]);
      dispatch(clearUploadState());
    }
  }, [multipleUpload, dispatch]);

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
    if (product?.categoryId) {
      dispatch(getProductsByCategory({ categoryId: product.categoryId, params: { limit: 4 } }));
    }
  }, [dispatch, product?.categoryId]);
  

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        variantId: product.variants[selectedVariant].id,
        quantity,
      });
      toast.success('Added to cart!');
    }
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('productId', productId || '');
        uploadSingle(formData);
      }
    }
  });

  const handleUploadReviewImages = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('productId', productId || '');
    try {
      await uploadMultiple(formData);
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
        await editReview(
          editingReview.id,
          {
            rating: newReview.rating,
            comment: newReview.comment,
            images: newReview.images,
          }
        );
        toast.success('Review updated!');
      } else {
        await submitReview({
          productId,
          rating: newReview.rating,
          comment: newReview.comment,
          images: newReview.images,
        });
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
            reviewImages={reviews?.flatMap?.((r) => r.images) || []}
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
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../features/order/useOrder';
import { useReview } from '../features/review/useReview';
import toast from 'react-hot-toast';
import { ReviewProductCard } from '../components/review/ReviewProductCard';
import { ReviewInput } from '../components/review/ReviewProductCard';
import { useAuth } from '../features/auth/authHooks';

export const ReviewPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrderById, currentOrder, loading: orderLoading } = useOrders();
  const { submitReview, loading: reviewLoading, userReviews, loadUserReviews } = useReview();

  const [productReviews, setProductReviews] = useState<Record<string, ReviewInput>>({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<string[]>([]);

  useEffect(() => {
    if (!orderId) {
      toast.error('Order ID missing');
      navigate('/orders');
      return;
    }
    getOrderById(orderId);
  }, [orderId]);

  useEffect(() => {
    if (user) {
      loadUserReviews(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (currentOrder?.items && userReviews) {
      const reviewedProductIds = userReviews
        .filter(review => currentOrder.items.some(item => item.productId === review.productId))
        .map(review => review.productId);

      setAlreadyReviewed(reviewedProductIds);

      const initialReviews = currentOrder.items.reduce((acc, item) => {
        if (!reviewedProductIds.includes(item.productId)) {
          acc[item.productId] = { rating: 5, comment: '', images: [] };
        }
        return acc;
      }, {} as Record<string, ReviewInput>);

      setProductReviews(initialReviews);
    }
  }, [currentOrder, userReviews]);

  const handleChange = (productId: string, data: Partial<ReviewInput>) => {
    setProductReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], ...data },
    }));
  };

  const validateReviews = () => {
    return Object.values(productReviews).every(
      review => review.comment.trim().length >= 10
    );
  };

  const handleSubmitAll = async () => {
    if (!validateReviews()) {
      toast.error('Each review must be at least 10 characters.');
      return;
    }

    try {
      await Promise.all(
        Object.entries(productReviews).map(([productId, review]) =>
          submitReview({ productId, ...review, orderId: orderId! })
        )
      );
      toast.success('Reviews submitted successfully!');
      setSubmitted(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit reviews');
    }
  };

  const unreviewedItems = currentOrder?.items?.filter(
    item => !alreadyReviewed.includes(item.productId)
  ) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {orderLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : submitted ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3">Thank You!</h2>
          <p className="text-lg text-gray-600">Your reviews have been submitted.</p>
          <p className="text-sm mt-2">Redirecting to orders...</p>
        </div>
      ) : !currentOrder?.items?.length ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-4">Looks like this order has no items or all were removed.</p>
          <button
            onClick={() => navigate('/category/all')}
            className="px-4 py-2 bg-terracotta-600 text-white rounded hover:bg-terracotta-500"
          >
            Continue Shopping
          </button>
        </div>
      ) : unreviewedItems.length === 0 ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">All Reviewed</h2>
          <p className="text-gray-500 mb-4">You've already reviewed all products in this order.</p>
          <button
            onClick={() => navigate('/category/all')}
            className="px-4 py-2 bg-terracotta-600 text-white rounded hover:bg-terracotta-500"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Review Your Purchase</h2>
          <p className="mb-6 text-gray-600 text-lg">
            Help others by sharing your experience with {unreviewedItems.length}{' '}
            product{unreviewedItems.length > 1 ? 's' : ''}.
          </p>

          {unreviewedItems.map(item => (
            <ReviewProductCard
              key={item.productId}
              productId={item.productId}
              productName={item.productName}
              value={productReviews[item.productId] || { rating: 5, comment: '', images: [] }}
              onChange={handleChange}
            />
          ))}

          <button
            onClick={handleSubmitAll}
            disabled={reviewLoading || !validateReviews()}
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <span>✓</span>
                Submit All Reviews
              </>
            )}
          </button>

          {alreadyReviewed.length > 0 && (
            <div className="mt-10 pt-6 border-t">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Already Reviewed</h3>
              <ul className="space-y-3">
                {currentOrder.items
                  .filter(item => alreadyReviewed.includes(item.productId))
                  .map(item => (
                    <li
                      key={item.productId}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <span className="text-gray-700 font-medium">{item.productName}</span>
                      <span className="text-green-600 font-semibold">✓ Reviewed</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

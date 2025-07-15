import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useOrders } from '../features/order/useOrder';
import { useReview } from '../features/review/useReview';
import { useAuth } from '../features/auth/authHooks';
import { ReviewProductCard, ReviewInput } from '../components/review/ReviewProductCard';
import PageSpinner from '../components/PageSpinner';


type ObjectIdLike = { _id: string };

const isObjectIdLike = (val: unknown): val is ObjectIdLike =>
  !!val && typeof val === 'object' && '_id' in (val as any);

const toId = (val: string | ObjectIdLike) => (isObjectIdLike(val) ? val._id : val);


export const ReviewPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    getOrderById,
    currentOrder,
    loading: orderLoading,
  } = useOrders();

  const {
    submitReview,
    loading: reviewLoading,
    userReviews,
    loadUserReviews,
  } = useReview();

  const [draft, setDraft] = useState<Record<string, ReviewInput>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error('Order ID missing');
      navigate('/orders');
    } else {
      getOrderById(orderId);
    }
  }, [orderId, getOrderById, navigate]);

  useEffect(() => {
    if (user) loadUserReviews();
  }, [user, loadUserReviews]);

  const alreadyReviewed = useMemo<string[]>(() => {
    if (!currentOrder?.items || !userReviews) return [];

    const reviewed = userReviews
      .filter(r => currentOrder.items.some(i => toId(i.productId) === r.productId))
      .map(r => r.productId);

    return reviewed;
  }, [currentOrder?.items, userReviews]);

  const unreviewedItems = useMemo(
    () =>
      currentOrder?.items?.filter(item => !alreadyReviewed.includes(toId(item.productId))) ?? [],
    [currentOrder?.items, alreadyReviewed],
  );

  useEffect(() => {
    if (!unreviewedItems.length) return;

    setDraft(prev => {
      const next = { ...prev };
      unreviewedItems.forEach(i => {
        const pid = toId(i.productId);
        if (!next[pid])
          next[pid] = { rating: 5, comment: '', images: [] };
      });
      return next;
    });
  }, [unreviewedItems]);

  const handleChange = (pid: string, data: Partial<ReviewInput>) =>
    setDraft(d => ({ ...d, [pid]: { ...d[pid], ...data } }));

  const validateReviews = () =>
    Object.values(draft).every(r => r.comment.trim().length >= 10);

  const handleSubmitAll = async () => {
    if (!validateReviews()) {
      toast.error('Each review must be at least 10 characters.');
      document.documentElement.scrollTop = 0; // quick UX helper
      return;
    }

    try {
      await Promise.all(
        Object.entries(draft).map(([productId, r]) =>
          submitReview({ productId, ...r, orderId: orderId! }),
        ),
      );
      toast.success('Reviews submitted!');
      setSubmitted(true);
      setTimeout(() => navigate('/orders'), 1500);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to submit reviews');
    }
  };

  if (orderLoading || reviewLoading) {
    return <PageSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {submitted ? (
        <ThankYou />
      ) : !currentOrder?.items?.length ? (
        <EmptyOrder navigate={navigate} />
      ) : unreviewedItems.length === 0 ? (
        <AllReviewed navigate={navigate} />
      ) : (
        <>
          <h2 className="text-3xl font-extrabold mb-2">Review Your Purchase</h2>
          <p className="mb-6 text-gray-600">
            Help others by sharing your experience with&nbsp;
            {unreviewedItems.length} product{unreviewedItems.length > 1 && 's'}.
          </p>

          {unreviewedItems.map(item => {
            const pid = toId(item.productId);
            return (
              <ReviewProductCard
                key={pid}
                productId={pid}
                productName={item.productName + ''}
                value={draft[pid] ?? { rating: 5, comment: '', images: [] }}
                onChange={handleChange}
              />
            );
          })}

          <button
            onClick={handleSubmitAll}
            disabled={reviewLoading || !validateReviews()}
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-60"
          >
            {reviewLoading ? 'Submitting…' : '✓ Submit All Reviews'}
          </button>

          {alreadyReviewed.length > 0 && (
            <ReviewedList order={currentOrder} alreadyReviewed={alreadyReviewed} />
          )}
        </>
      )}
    </div>
  );
};


const Loader = () => (
  <div className="flex justify-center items-center min-h-[40vh]">
    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

const ThankYou = () => (
  <div className="text-center">
    <h2 className="text-3xl font-bold mb-3">Thank You!</h2>
    <p className="text-lg text-gray-600">Your reviews have been submitted.</p>
  </div>
);

const EmptyOrder = ({ navigate }: { navigate: ReturnType<typeof useNavigate> }) => (
  <div className="text-center">
    <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
    <p className="text-gray-500 mb-4">
      Looks like this order has no items or all items were removed.
    </p>
    <button
      onClick={() => navigate('/category/all')}
      className="px-4 py-2 bg-terracotta-600 text-white rounded hover:bg-terracotta-500"
    >
      Continue Shopping
    </button>
  </div>
);

const AllReviewed = ({ navigate }: { navigate: ReturnType<typeof useNavigate> }) => (
  <div className="text-center">
    <h2 className="text-2xl font-semibold mb-2">All Reviewed</h2>
    <p className="text-gray-500 mb-4">You've already reviewed all products in this order.</p>
    <button
      onClick={() => navigate('/category/all')}
      className="px-4 py-2 bg-terracotta-600 text-white rounded hover:bg-terracotta-500"
    >
      Continue Shopping
    </button>
  </div>
);

const ReviewedList = ({
  order,
  alreadyReviewed,
}: {
  order: NonNullable<ReturnType<typeof useOrders>['currentOrder']>;
  alreadyReviewed: string[];
}) => (
  <div className="mt-10 pt-6 border-t">
    <h3 className="text-xl font-bold mb-4">Already Reviewed</h3>
    <ul className="space-y-3">
      {order.items
        .filter(i => alreadyReviewed.includes(toId(i.productId)))
        .map(i => (
          <li
            key={toId(i.productId)}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <span>{i.productName}</span>
            <span className="text-green-600 font-semibold">✓ Reviewed</span>
          </li>
        ))}
    </ul>
  </div>
);

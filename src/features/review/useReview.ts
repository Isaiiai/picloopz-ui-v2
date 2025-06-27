import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store'; 
import {
  fetchProductReviews,
  fetchUserReviews,
  createReview,
  updateReview,
  deleteReview,
} from './reviewThunks';

// Typed hooks 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for review feature
export function useReview() {
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    reviews,
    userReviews,
    total,
    averageRating,
    ratingDistribution,
    pagination,
  } = useAppSelector(state => state.reviews);

  const loadProductReviews = (params: {
    productId: string;
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
  }) => dispatch(fetchProductReviews(params));

  const loadUserReviews = (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
  }) => dispatch(fetchUserReviews(params || {}));

  const submitReview = (payload: any) => dispatch(createReview(payload));

  const editReview = (reviewId: string, data: any) =>
    dispatch(updateReview({ reviewId, data }));

  const removeReview = (reviewId: string) => dispatch(deleteReview(reviewId));

  return {
    loading,
    error,
    reviews,
    userReviews,
    total,
    averageRating,
    ratingDistribution,
    pagination,
    loadProductReviews,
    loadUserReviews,
    submitReview,
    editReview,
    removeReview,
  };
}

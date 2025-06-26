import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ReviewState,
  Review,
  ReviewListResponse,
  UserReviewListResponse,
} from './reviewTypes';
import {
  fetchProductReviews,
  fetchUserReviews,
  createReview,
  updateReview,
  deleteReview,
} from './reviewThunks';

const initialState: ReviewState = {
  loading: false,
  error: null,
  reviews: [],
  userReviews: [],
  total: 0,
  averageRating: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  pagination: { page: 1, limit: 10, totalPages: 0, totalItems: 0 },
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearReviews(state) {
      state.reviews = [];
      state.total = 0;
      state.averageRating = 0;
      state.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      state.pagination = { page: 1, limit: 10, totalPages: 0, totalItems: 0 };
    },
  },
  extraReducers: builder => {
    builder
      // Fetch product reviews
      .addCase(fetchProductReviews.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<ReviewListResponse>) => {
        state.loading = false;
        state.reviews = action.payload.data.reviews;
        state.total = action.payload.data.total;
        state.averageRating = action.payload.data.averageRating;
        state.ratingDistribution = action.payload.data.ratingDistribution;
        state.pagination.page = 1; 
        state.pagination.limit = 10;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch product reviews';
      })

      // Fetch user reviews
      .addCase(fetchUserReviews.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action: PayloadAction<UserReviewListResponse>) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
        state.total = action.payload.total;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch user reviews';
      })

      // Create review
      .addCase(createReview.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to create review';
      })

      // Update review
      .addCase(updateReview.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        // Also update in userReviews if needed
        const userIndex = state.userReviews.findIndex(r => r.id === action.payload.id);
        if (userIndex !== -1) {
          state.userReviews[userIndex] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to update review';
      })

      // Delete review
      .addCase(deleteReview.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
        state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete review';
      });
  },
});

export const { clearError, clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;

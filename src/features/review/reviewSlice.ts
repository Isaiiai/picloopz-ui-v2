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
    // Immediately remove a review from state for instant UI feedback
    removeReviewFromState(state, action: PayloadAction<string>) {
      console.log('=== REMOVE REVIEW FROM STATE ===');
      console.log('Removing review ID:', action.payload);
      console.log('Reviews before removal:', state.reviews.length);
      
      state.reviews = state.reviews.filter(r => r.id !== action.payload);
      state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
      
      console.log('Reviews after removal:', state.reviews.length);
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
        console.log('=== FETCH PRODUCT REVIEWS FULFILLED ===');
        console.log('Action payload:', action.payload);
        console.log('Reviews in payload:', action.payload.data.reviews.length);
        console.log('Review IDs in payload:', action.payload.data.reviews.map(r => r.id));
        
        state.loading = false;
        state.reviews = action.payload.data.reviews;
        state.total = action.payload.data.total;
        state.averageRating = action.payload.data.averageRating;
        state.ratingDistribution = action.payload.data.ratingDistribution;
        state.pagination.page = 1; 
        state.pagination.limit = 10;
        
        console.log('State updated - reviews count:', state.reviews.length);
        console.log('State updated - review IDs:', state.reviews.map(r => r.id));
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
        // Don't add the review to frontend state immediately
        // Reviews should only be displayed after admin approval
        // The review will be fetched again when the product page is refreshed
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
        // Remove the review from frontend state when updated
        // Updated reviews need to be re-approved by admin
        state.reviews = state.reviews.filter(r => r.id !== action.payload.id);
        state.userReviews = state.userReviews.filter(r => r.id !== action.payload.id);
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to update review';
      })

      // Delete review
      .addCase(deleteReview.pending, (state, action) => {
        console.log('=== DELETE REVIEW PENDING ===');
        console.log('Action payload:', action.payload);
        console.log('Current reviews count:', state.reviews.length);
        console.log('Current review IDs:', state.reviews.map(r => r.id));
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        console.log('=== DELETE REVIEW FULFILLED ===');
        console.log('Deleted review ID:', action.payload);
        console.log('Reviews before deletion:', state.reviews.length);
        console.log('Review IDs before deletion:', state.reviews.map(r => r.id));
        
        state.loading = false;
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
        state.userReviews = state.userReviews.filter(r => r.id !== action.payload);
        
        console.log('Reviews after deletion:', state.reviews.length);
        console.log('Review IDs after deletion:', state.reviews.map(r => r.id));
      })
      .addCase(deleteReview.rejected, (state, action) => {
        console.log('=== DELETE REVIEW REJECTED ===');
        console.log('Error payload:', action.payload);
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete review';
      });
  },
});

export const { clearError, clearReviews, removeReviewFromState } = reviewSlice.actions;

export default reviewSlice.reducer;

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import {
  ReviewListResponse,
  ReviewCreatePayload,
  ReviewUpdatePayload,
  Review,
  UserReviewListResponse,
} from './reviewTypes';

interface FetchProductReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FetchUserReviewsParams {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

// Fetch product reviews 
export const fetchProductReviews = createAsyncThunk<
  ReviewListResponse,
  FetchProductReviewsParams
>('reviews/fetchProductReviews', async (params, thunkAPI) => {
  console.log('=== FETCH PRODUCT REVIEWS START ===');
  console.log('Params:', params);
  
  const { productId, page = 1, limit = 10, sort = 'createdAt', sortOrder = 'desc' } = params;
  try {
    console.log('Making GET request to:', `/reviews/product/${productId}`);
    const response = await api.get(`/reviews/product/${productId}`, {
      params: { page, limit, sort, sortOrder },
    });
    console.log('GET response:', response);
    console.log('Response data:', response.data);
    console.log('Reviews count in response:', response.data.data.reviews.length);
    console.log('Review IDs in response:', response.data.data.reviews.map((r: any) => r.id));
    return response.data;
  } catch (error: any) {
    console.error('Fetch product reviews error:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch user's own reviews
export const fetchUserReviews = createAsyncThunk<
  UserReviewListResponse,
  FetchUserReviewsParams,
  { rejectValue: string }
>('reviews/fetchUserReviews', async (params, thunkAPI) => {
  const { page = 1, limit = 10, sort = 'createdAt', sortOrder = 'desc' } = params;
  try {
    const response = await api.get(`/reviews/my-reviews`, {
      params: { page, limit, sort, sortOrder },
    });
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Create review
export const createReview = createAsyncThunk<
  Review,
  ReviewCreatePayload,
  { rejectValue: string }
>('reviews/createReview', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/reviews', payload);
    console.log(response);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update review
export const updateReview = createAsyncThunk<
  Review,
  { reviewId: string; data: ReviewUpdatePayload },
  { rejectValue: string }
>('reviews/updateReview', async ({ reviewId, data }, thunkAPI) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Delete review
export const deleteReview = createAsyncThunk<
  string, // return deleted review id
  string, // review id param
  { rejectValue: string }
>('reviews/deleteReview', async (reviewId, thunkAPI) => {
  console.log('=== DELETE REVIEW THUNK START ===');
  console.log('Review ID to delete:', reviewId);
  
  try {
    console.log('Making DELETE request to:', `/reviews/${reviewId}`);
    const response = await api.delete(`/reviews/${reviewId}`);
    console.log('DELETE response:', response);
    console.log('Response data:', response.data);
    console.log('Response data.data:', response.data.data);
    console.log('deletedReviewId from response:', response.data.data.deletedReviewId);
    
    const deletedId = response.data.data.deletedReviewId;
    console.log('Returning deleted ID:', deletedId);
    
    // Verify the review was actually deleted by trying to fetch it
    try {
      console.log('Verifying deletion by attempting to fetch the review...');
      await api.get(`/reviews/${reviewId}`);
      console.log('WARNING: Review still exists after deletion!');
    } catch (verifyError: any) {
      if (verifyError.response?.status === 404) {
        console.log('✅ Review successfully deleted (404 not found)');
      } else {
        console.log('Review verification failed:', verifyError.response?.status);
      }
    }
    
    return deletedId;
  } catch (error: any) {
    console.error('DELETE review error:', error);
    console.error('Error response:', error.response?.data);
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

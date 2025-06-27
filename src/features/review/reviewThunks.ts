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
  const { productId, page = 1, limit = 10, sort = 'createdAt', sortOrder = 'desc' } = params;
  try {
    const response = await api.get(`/reviews/product/${productId}`, {
      params: { page, limit, sort, sortOrder },
    });
    console.log(response.data)
    return response.data;
  } catch (error: any) {
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
    return response.data;
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
  try {
    await api.delete(`/reviews/${reviewId}`);
    return reviewId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

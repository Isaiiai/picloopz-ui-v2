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

// Fetch product reviews (Gateway)
export const fetchProductReviews = createAsyncThunk<
  ReviewListResponse,
  FetchProductReviewsParams
>('reviews/fetchProductReviews', async (params, thunkAPI) => {
  const { productId, page = 1, limit = 10, sort = 'createdAt', sortOrder = 'desc' } = params;
  try {
    const response = await api.post(`/api/gateway`, {
      route: 'getProductReviews',
      payload: {
        params: { productId },
        body: { page, limit, sort, sortOrder },
      },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Fetch user's own reviews (Gateway)
export const fetchUserReviews = createAsyncThunk<
  UserReviewListResponse,
  FetchUserReviewsParams,
  { rejectValue: string }
>('reviews/fetchUserReviews', async (params, thunkAPI) => {
  const { page = 1, limit = 10, sort = 'createdAt', sortOrder = 'desc' } = params;
  try {
    const response = await api.post(`/api/gateway`, {
      route: 'getUserReviews',
      payload: {
        body: { page, limit, sort, sortOrder },
      },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Create a new review (Gateway)
export const createReview = createAsyncThunk<
  Review,
  ReviewCreatePayload,
  { rejectValue: string }
>('reviews/createReview', async (payload, thunkAPI) => {
  try {
    const response = await api.post(`/api/gateway`, {
      route: 'createReview',
      payload: payload
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update review (Gateway)
export const updateReview = createAsyncThunk<
  Review,
  { reviewId: string; data: ReviewUpdatePayload },
  { rejectValue: string }
>('reviews/updateReview', async ({ reviewId, data }, thunkAPI) => {
  try {
    const response = await api.post(`/api/gateway`, {
      route: 'updateReview',
      payload: {
        params: { id: reviewId },
        body: data,
      },
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Delete review (Gateway)
export const deleteReview = createAsyncThunk<
  string, 
  string,
  { rejectValue: string }
>('reviews/deleteReview', async (reviewId, thunkAPI) => {
  try {
    await api.post(`/api/gateway`, {
      route: 'deleteReview',
      payload: {
        params: { id: reviewId },
      },
    });
    return reviewId;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

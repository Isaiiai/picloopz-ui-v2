import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import { Category, CategoryListResponse } from './categoryTypes';

interface FetchCategoriesParams {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
}

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (params: FetchCategoriesParams, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 50,
        sort = 'displayOrder',
        sortOrder = 'asc',
        isActive,
      } = params;

      const response = await api.post<CategoryListResponse>('/api/gateway', {
        route: "getCategories",
        payload: {params: { page, limit, sort, sortOrder, isActive },}
      });

      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to fetch categories';
      return rejectWithValue(message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post<Category>(`/api/gateway`, {
        route: "getCategoryById",
        payload: {params: {id}}
      });
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Category not found';
      return rejectWithValue(message);
    }
  }
);

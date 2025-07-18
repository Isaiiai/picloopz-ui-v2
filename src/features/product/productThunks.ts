import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import { ProductSearchParams } from './productTypes';

// Get all products with filtering and search
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params: ProductSearchParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Get trending products
export const getTrendingProducts = createAsyncThunk(
  'products/getTrendingProducts',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/trending', { params: { limit } });
      return response.data.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending products');
    }
  }
);

// Get top-selling products
export const getTopSellingProducts = createAsyncThunk(
  'products/getTopSellingProducts',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/top-selling', { params: { limit } });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top-selling products');
    }
  }
);

// Get products by category
export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async ({ categoryId, params }: { categoryId: string; params?: Partial<ProductSearchParams> }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`, { params });
      console.log(response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category products');
    }
  }
);

// Get product by ID
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';

export const fetchReels = createAsyncThunk(
  'gallery/fetchReels',
  async (params: { page?: number; limit?: number; sort?: string; sortOrder?: 'asc' | 'desc' }) => {
    const response = await api.post('/api/gateway', {route: "getAllReels", payload: {params}});
    return response.data;
  }
);

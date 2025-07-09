import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import { Favorite } from './favoriteTypes';

export const fetchFavorites = createAsyncThunk<Favorite[]>(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/gateway',{
        route: "getFavorites",
        payload: {},
      });
      return res.data.data.favorites;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addFavorite = createAsyncThunk<Favorite, string>(
  'favorites/addFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/gateway', {
        route: "addToFavorites",
        payload: {productId}
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeFavorite = createAsyncThunk<string, string>(
  'favorites/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      await api.post(`/api/gateway`,{
        route: "removeFromFavorites",
        payload: {params: {productId}}
      });
      return productId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchFavoriteCount = createAsyncThunk<number>(
  'favorites/fetchCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/gateway',{
        route: "getFavoritesCount",
        payload: {}
      });
      return res.data.count;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkIfFavorite = createAsyncThunk<boolean, string>(
  'favorites/checkIfFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/gateway`, {
        route: "checkFavoriteStatus",
        payload: { params: {productId} }
      });
      return res.data.isFavorite;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const clearAllFavorites = createAsyncThunk(
  'favorites/clearAllFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/gateway', {
        route: "clearAllFavorites",
        payload: {}
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
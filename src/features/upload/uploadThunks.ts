import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import { UploadResponse, MultipleUploadResponse } from './uploadTypes';

export const uploadSingleImage = createAsyncThunk<
  UploadResponse,
  FormData
>('upload/uploadSingleImage', async (formData, { rejectWithValue }) => {
  try {
    console.log(formData);
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

export const uploadMultipleImages = createAsyncThunk<
  MultipleUploadResponse,
  FormData
>('upload/uploadMultipleImages', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

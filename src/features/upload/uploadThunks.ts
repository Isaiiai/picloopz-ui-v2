import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';
import { UploadResponse, MultipleUploadResponse } from './uploadTypes';
import { AxiosProgressEvent } from 'axios';

interface UploadArgs {
  formData: FormData;
  purpose: 'review' | 'cart' | 'profile';
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const uploadSingleImage = createAsyncThunk<
  UploadResponse,
  FormData
>('upload/uploadSingleImage', async (formData, { rejectWithValue }) => {
  try {
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
  UploadArgs
>('upload/uploadMultipleImages', async ({ formData, onUploadProgress }, { rejectWithValue }) => {
  try {
    const response = await api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

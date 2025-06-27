import { createSlice } from '@reduxjs/toolkit';
import { UploadState } from './uploadTypes';
import { uploadSingleImage, uploadMultipleImages } from './uploadThunks';

const initialState: UploadState = {
  loading: false,
  error: null,
  singleUpload: null,
  multipleUpload: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.singleUpload = null;
      state.multipleUpload = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSingleImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleUpload = null;
      })
      .addCase(uploadSingleImage.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUpload = action.payload;
      })
      .addCase(uploadSingleImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadMultipleImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.multipleUpload = null;
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.loading = false;
        state.multipleUpload = action.payload;
      })
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;

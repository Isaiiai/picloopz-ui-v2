import { createSlice } from '@reduxjs/toolkit';
import { UploadState } from './uploadTypes';
import { uploadSingleImage, uploadMultipleImages } from './uploadThunks';

const initialState: UploadState = {
  loading: {
    reviewUploadLoading: false,
    cartUploadLoading: false,
    profileUploadLoading: false,
    singleUploadLoading: false
  },
  error: null,
  singleUpload: null,
  reviewImages: null,
  cartImages: null,
  profileImages: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.reviewImages = null;
      state.cartImages = null;
      state.profileImages = null;
      state.error = null;
      state.loading.reviewUploadLoading = false;
      state.loading.cartUploadLoading = false;
      state.loading.profileUploadLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSingleImage.pending, (state) => {
        state.loading.singleUploadLoading = true;
        state.error = null;
        state.singleUpload = null;
      })
      .addCase(uploadSingleImage.fulfilled, (state, action) => {
        state.loading.singleUploadLoading = false;
        state.singleUpload = action.payload;
      })
      .addCase(uploadSingleImage.rejected, (state, action) => {
        state.loading.singleUploadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadMultipleImages.pending, (state, action) => {
        const purpose = action.meta.arg.purpose;
        if(purpose === 'review') {
          state.loading.reviewUploadLoading = true;
          state.reviewImages = null;
        } else if (purpose === 'cart') {
          state.loading.cartUploadLoading = true;
          state.cartImages = null;
        } else if (purpose === 'profile') {
          state.loading.profileUploadLoading = true;

        }
        
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        const purpose = action.meta.arg.purpose;
        if (purpose === 'review') {
          state.loading.reviewUploadLoading = false;
          state.reviewImages = action.payload;
        } else if (purpose === 'cart') {
          state.loading.cartUploadLoading = false;
          state.cartImages = action.payload;
        } else if (purpose === 'profile') {
          state.loading.profileUploadLoading = false;
          state.profileImages = action.payload;
        }
      })
      .addCase(uploadMultipleImages.rejected, (state, action) => {
        const purpose = action.meta.arg.purpose;
        if (purpose === 'review') {
          state.loading.reviewUploadLoading = false;
        } else if (purpose === 'cart') {
          state.loading.cartUploadLoading = false;
        } else if (purpose === 'profile') {
          state.loading.profileUploadLoading = false;
        }
        state.error = action.payload as string;
      });
  },
});

export const { clearUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;

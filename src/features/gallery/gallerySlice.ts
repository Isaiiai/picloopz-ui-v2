import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchReels } from './galleryThunks';
import { GalleryState, Reel, Pagination } from './galleryTypes';

const initialState: GalleryState = {
  reels: [],
  loading: false,
  error: null,
  pagination: null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearGalleryState: (state) => {
      state.reels = [];
      state.loading = false;
      state.error = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReels.fulfilled, (state, action: PayloadAction<{ data: { reels: Reel[] }, pagination: Pagination }>) => {
        state.loading = false;
        state.reels = action.payload.data.reels;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load reels';
      });
  },
});

export const { clearGalleryState } = gallerySlice.actions;
export default gallerySlice.reducer;
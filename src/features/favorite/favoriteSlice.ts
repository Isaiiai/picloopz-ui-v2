import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteState, Favorite } from './favoriteTypes';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchFavoriteCount,
  checkIfFavorite,
  clearAllFavorites
} from './favoriteThunk';

const initialState: FavoriteState = {
  favorites: [],
  count: 0,
  loading: false,
  error: null
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites(state) {
      state.favorites = [];
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Favorite[]>) => {
        state.favorites = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })

      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Favorite>) => {
        state.favorites.push(action.payload);
      })

      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<string>) => {
        state.favorites = state.favorites.filter(fav => fav.productId !== action.payload);
      })

      .addCase(fetchFavoriteCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.count = action.payload;
      })
      .addCase(clearAllFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearAllFavorites.fulfilled, (state) => {
        state.favorites = [];
        state.count = 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(clearAllFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear favorites';
      });
  }
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;

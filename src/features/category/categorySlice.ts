import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryListResponse, CategoryState } from './categoryTypes';
import { fetchCategories, fetchCategoryById } from './categoryThunks';

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  pagination: []
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryListResponse>) => {
        state.loading = false;
        state.categories = action.payload.data.categories;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
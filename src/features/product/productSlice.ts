import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getProducts,
  getTrendingProducts,
  getTopSellingProducts,
  getProductsByCategory,
  getProductById,
} from './productThunks';
import { Product, initialState } from './productTypes';

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    clearCategoryProducts(state) {
      state.categoryProducts = [];
      state.categoryInfo = null;
    },
    resetProductState() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<{ products: Product[]; pagination: any }>) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get trending products
      .addCase(getTrendingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.trendingProducts = action.payload;
      })
      .addCase(getTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get top-selling products
      .addCase(getTopSellingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopSellingProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.topSellingProducts = action.payload.products;
      })
      .addCase(getTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get products by category
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProductsByCategory.fulfilled,
        (state, action: PayloadAction<{ products: Product[]; category: any; pagination: any }>) => {
          state.loading = false;
          state.categoryProducts = action.payload.data.products;
          state.categoryInfo = action.payload.data.category;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, clearCategoryProducts, resetProductState } = productSlice.actions;
export default productSlice.reducer;
import { RootState } from "../../store/store";

export const selectProducts = (state: RootState) => state.product.products;
export const selectTrendingProducts = (state: RootState) => state.product.trendingProducts;
export const selectTopSellingProducts = (state: RootState) => state.product.topSellingProducts;
export const selectCategoryProducts = (state: RootState) => state.product.categoryProducts;
export const selectCurrentProduct = (state: RootState) => state.product.currentProduct;
export const selectProductLoading = (state: RootState) => state.product.loading;
export const selectProductError = (state: RootState) => state.product.error;
export const selectProductPagination = (state: RootState) => state.product.pagination;
export const selectCategoryInfo = (state: RootState) => state.product.categoryInfo;
import { RootState } from '../../store/store';

export const selectCategories = (state: RootState) => state.category.categories;
export const selectCurrentCategory = (state: RootState) => state.category.currentCategory;
export const selectCategoryLoading = (state: RootState) => state.category.loading;
export const selectCategoryError = (state: RootState) => state.category.error;
export const selectCategoryPagination = (state: RootState) => ({
  total: state.category.total,
  page: state.category.page,
  limit: state.category.limit,
});

export const selectActiveCategories = (state: RootState) => 
  state.category.categories.filter(category => category.isActive);

export const selectCategoryById = (id: string) => (state: RootState) => 
  state.category.categories.find(category => category.id === id);
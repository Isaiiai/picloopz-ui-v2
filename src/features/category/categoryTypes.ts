export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number,
  hasNext: boolean,
  hasPrevious: boolean,
  pageSize: number,
  totalItems: number
  totalPages: number
}

export interface CategoryListResponse {
  categories: Category[];
  pagination: Pagination[];
}



export interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination[];
}


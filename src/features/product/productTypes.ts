export interface ProductVariant {
  id: string;
  name: string;
  additionalPrice: number;
  imageUrl?: string;
  attributeType: string;
  isActive: boolean;
  inStock: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  basePrice: number;
  variants: ProductVariant[];
  images: string[];
  tags: string[];
  isTrending: boolean;
  isTopSelling: boolean;
  isFeatured: boolean;
  isActive: boolean;
  maxUserImages: number;
  viewCount: number;
  orderCount: number;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  isTrending?: boolean;
  isTopSelling?: boolean;
  isFeatured?: boolean;
  rating?: number;
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsState {
  products: Product[];
  trendingProducts: Product[];
  topSellingProducts: Product[];
  categoryProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  categoryInfo: {
    id: string;
    name: string;
  } | null;
}

export const initialState: ProductsState = {
  products: [],
  trendingProducts: [],
  topSellingProducts: [],
  categoryProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  categoryInfo: null,
};
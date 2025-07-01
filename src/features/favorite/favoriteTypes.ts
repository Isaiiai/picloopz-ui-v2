export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  addedAt: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  description: string;
  variants: any[];
  category: string;
}

export interface FavoriteState {
  favorites: Favorite[];
  count: number;
  loading: boolean;
  error: string | null;
}

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
}

export interface FavoriteState {
  favorites: Favorite[];
  count: number;
  loading: boolean;
  error: string | null;
}

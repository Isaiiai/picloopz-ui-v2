export interface VariantInfo {
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variantId: string;
  uploadedImage: string;
  variantInfo: VariantInfo;
}

export interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
}

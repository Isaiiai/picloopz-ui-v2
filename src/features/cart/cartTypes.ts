export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  cartImages: string[];
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  cartImages: string[];
  loading: boolean;
  error: string | null;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  cartImages: string[];
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
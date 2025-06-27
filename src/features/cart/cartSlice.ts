import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from './cartTypes';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // Action to set error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    // Action to set the entire cart
    setCart(state, action: PayloadAction<{ items: CartItem[]; totalItems: number; totalAmount: number }>) {
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalAmount = action.payload.totalAmount;
      state.loading = false;
      state.error = null;
    },
    // Action to clear the cart
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from './cartTypes';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cartThunks.ts';

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch cart';
      })

      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.cartItems.push(action.payload);
      })

      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.cartItems = state.cartItems.map(item =>
          item._id === action.payload._id ? action.payload : item
        );
      })

      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
      })

      .addCase(clearCart.fulfilled, state => {
        state.cartItems = [];
      });
  },
});

export default cartSlice.reducer;

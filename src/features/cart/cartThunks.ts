import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItem } from './cartTypes';

const API_BASE = 'http://localhost:3000/api/cart';
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await axios.get(`${API_BASE}`, authHeader());
  return res.data.cartItems as CartItem[];
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, variantId, quantity }: { productId: string; variantId: string; quantity: number }) => {
    const res = await axios.post(`${API_BASE}/add`, { productId, variantId, quantity }, authHeader());
    return res.data.cartItem as CartItem;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
    const res = await axios.put(`${API_BASE}/update/${cartItemId}`, { quantity }, authHeader());
    return res.data.cartItem as CartItem;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string) => {
    await axios.delete(`${API_BASE}/remove/${cartItemId}`, authHeader());
    return cartItemId;
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await axios.delete(`${API_BASE}/clear`, authHeader());
  return [];
});

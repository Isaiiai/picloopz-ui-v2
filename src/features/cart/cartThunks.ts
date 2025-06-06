import { AppThunk } from '../../store/store';
import { setLoading, setError, setCart, clearCart } from './cartSlice';
import { AddToCartPayload, UpdateCartItemPayload } from './cartTypes';
import api from '../../config/axiosConfig';

export const fetchCart = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/cart');
    dispatch(setCart({
      items: response.data.items,
      totalItems: response.data.totalItems,
      totalAmount: response.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const addToCart = (payload: AddToCartPayload): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/cart/add', payload);
    dispatch(setCart({
      items: response.data.items,
      totalItems: response.data.totalItems,
      totalAmount: response.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateCartItem = (payload: UpdateCartItemPayload): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.put(`/cart/items/${payload.itemId}`, {
      quantity: payload.quantity,
    });
    dispatch(setCart({
      items: response.data.items,
      totalItems: response.data.totalItems,
      totalAmount: response.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeCartItem = (itemId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.delete(`/cart/items/${itemId}`);
    dispatch(setCart({
      items: response.data.items,
      totalItems: response.data.totalItems,
      totalAmount: response.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const emptyCart = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete('/cart');
    dispatch(clearCart());
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const getCartSummary = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/cart/summary');
    return response.data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};
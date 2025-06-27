import { AppThunk } from '../../store/store';
import { setLoading, setError, setCart, clearCart } from './cartSlice';
import { AddToCartPayload, UpdateCartItemPayload } from './cartTypes';
import api from '../../config/axiosConfig';

export const fetchCart = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    const response = await api.get('/cart',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setCart({
      items: response.data.data.items,
      itemCount: response.data.data.itemCount,
      totalAmount: response.data.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const addToCart = (payload: AddToCartPayload): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    const response = await api.post('/cart/add', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Add to cart response:', response);
    dispatch(setCart({
      items: response.data.data.items,
      itemCount: response.data.data.itemCount,
      totalAmount: response.data.data.totalAmount,
    }));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};


export const updateCartItem = (payload: UpdateCartItemPayload): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    const response = await api.put(`/cart/update/${payload.itemId}`, {
      quantity: payload.quantity,
    }, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setCart({
      items: response.data.data.items,
      totalItems: response.data.data.totalItems,
      totalAmount: response.data.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeCartItem = (itemId: string): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    const response = await api.delete(`/cart/remove/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setCart({
      items: response.data.data.items,
      itemCount: response.data.data.itemCount,
      totalAmount: response.data.data.totalAmount,
    }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const emptyCart = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    await api.delete('/cart/clear', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(clearCart());
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const getCartSummary = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const token = getState().auth.token;
    const response = await api.get('/cart/summary',{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};
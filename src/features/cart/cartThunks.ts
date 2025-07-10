import { AppThunk } from '../../store/store';
import { setLoading, setError, setCart, clearCart } from './cartSlice';
import { AddToCartPayload } from './cartTypes';
import api from '../../config/axiosConfig';

export const fetchCart = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/api/gateway',{
      route: "getCart",
      payload: {}
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

export const addToCart = (payload: AddToCartPayload): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/api/gateway', {
      route: "addToCart",
      payload: payload
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


export const removeCartItem = (itemId: string): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post(`/api/gateway`, {
      route: "removeCartItem",
      payload: { id:  itemId }
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

export const emptyCart = (): AppThunk => async (dispatch, ) => {
  try {
    dispatch(setLoading(true));
    await api.post('/api/gateway',{
      route: "clearCart",
      payload: {}
    });
    dispatch(clearCart());
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const getCartSummary = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/api/gateway',{
      route: "getCartSummary",
      payload: {}
    });
    return response.data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};
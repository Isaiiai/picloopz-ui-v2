import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Order,
  CreateOrderData,
  PaymentVerificationData,
  OrderResponse,
  CancelOrderData,
} from './orderTypes';
import api from '../../config/axiosConfig';

export const fetchOrders = createAsyncThunk<OrderResponse, void>(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/gateway', {
        route: "getOrders",
        payload: {}
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, string>(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/gateway`, {
        route: "getOrderById",
        payload: {id: orderId}
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createNewOrder = createAsyncThunk<Order, CreateOrderData>(
  'order/createNewOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/gateway', {
        route: "createOrder",
        payload: orderData
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyOrderPayment = createAsyncThunk<Order, PaymentVerificationData>(
  'order/verifyOrderPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/gateway', {
        route: "verifyPayment",
        payload: paymentData
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const cancelOrder = createAsyncThunk<Order, CancelOrderData>(
  'order/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/gateway`, { 
        route: "cancelOrder",
        payload: {
          id: {orderId},
          body: {reason},
        }
       });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);
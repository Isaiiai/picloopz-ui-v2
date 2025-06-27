import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Order,
  CreateOrderData,
  PaymentVerificationData,
  OrderResponse,
} from './orderTypes';
import api from '../../config/axiosConfig';

export const fetchOrders = createAsyncThunk<OrderResponse, void>(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
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
      const { data } = await api.get(`/orders/${orderId}`);
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
      const { data } = await api.post('/orders/create', orderData);
      console.log(data);
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
      const { data } = await api.post('/orders/payment/verify', paymentData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

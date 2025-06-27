import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrders, 
  fetchOrderById, 
  createNewOrder, 
  verifyOrderPayment,
} from './orderThunks';
import { CreateOrderData, PaymentVerificationData } from './orderTypes';
import { clearCurrentOrder, resetOrderError } from './orderSlice';
import { RootState } from '../../store/store';
import { useCallback } from 'react';

export const useOrders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector((state: RootState) => state.order);

  const getOrders = useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getOrderById = useCallback((orderId: string) => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  const createOrder = useCallback((orderData: CreateOrderData) => {
    return dispatch(createNewOrder(orderData));
  }, [dispatch]);

  const verifyPayment = useCallback((paymentData: PaymentVerificationData) => {
    return dispatch(verifyOrderPayment(paymentData));
  }, [dispatch]);

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(resetOrderError());
  }, [dispatch]);

  return {
    ...orderState,
    getOrders,
    getOrderById,
    createOrder,
    verifyPayment,
    clearOrder,
    clearError,
  };
};
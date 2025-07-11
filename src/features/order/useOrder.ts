import { useSelector } from 'react-redux';
import { 
  fetchOrders, 
  fetchOrderById, 
  createNewOrder, 
  verifyOrderPayment,
  cancelOrder,
} from './orderThunks';
import { CreateOrderData, PaymentVerificationData } from './orderTypes';
import { clearCurrentOrder, resetOrderError } from './orderSlice';
import { RootState } from '../../store/store';
import { useCallback } from 'react';
import { useAppDispatch } from '../../utils/hooks';

export const useOrders = () => {
  const dispatch = useAppDispatch();
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

  const orderCancel = useCallback((orderId: string, reason?: string) => {
    return dispatch(cancelOrder({ orderId, reason }));
  }, [dispatch]);

  return {
    ...orderState,
    getOrders,
    getOrderById,
    createOrder,
    orderCancel,
    verifyPayment,
    cancelOrder,
    clearOrder,
    clearError,
  };
};
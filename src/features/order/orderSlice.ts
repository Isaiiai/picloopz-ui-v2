import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderResponse, OrderState } from './orderTypes';
import { fetchOrders, fetchOrderById, createNewOrder, verifyOrderPayment } from './orderThunks';

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    resetOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.loading = false;
        state.orders = action.payload.data.orders;
        state.pagination = action.payload.pagination;
        console.log(state.orders);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = [action.payload, ...state.orders];
        state.currentOrder = action.payload;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOrderPayment.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        );
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(verifyOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, resetOrderError } = orderSlice.actions;
export default orderSlice.reducer;

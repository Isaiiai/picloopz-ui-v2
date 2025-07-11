export type OrderStatus = 'Pending' | 'Confirmed' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded' | 'RefundPending' | 'RefundFailed';

export interface OrderItem {
  id?: string;
  productId: {_id: string; name: string};
  productName: String;
  name: string;
  productImage?: string;
  variantId?: string;
  variantName?: string;
  unitPrice?: number;
  totalPrice?: number;
  uploadedImageUrl?: string[];
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'razorpay' | 'cod';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  refundId?: string; // New
  refundAmount?: number; // New
  trackingNumber?: string;
  estimatedDelivery?: string;
  cancellationReason?: string; // New 
  cancelledAt?: string; // New 
  cancelledBy?: string; // New
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface OrderResponse {
  data: {
    orders: Order[];
  };
  pagination: PaginationInfo;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    variantId?: string;
    uploadedImageUrl: string[];
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay' | 'cod';
  notes?: string;
}

export interface PaymentVerificationData {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  pagination: PaginationInfo;
}

export interface CancelOrderData {
  orderId: string;
  reason?: string;
}
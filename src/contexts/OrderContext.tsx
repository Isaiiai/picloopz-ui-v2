import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'out_for_delivery' | 'delivered';

export interface OrderItem {
  productId: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageUrl: string;
  uploadedImage: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  previewImage?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  isPendingApproval?: boolean;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (shippingAddress: any) => Promise<Order>;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  approveOrderDesign: (orderId: string) => void;
  requestDesignChange: (orderId: string, feedback: string) => void;
  uploadPreviewImage: (orderId: string, imageUrl: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { cartItems, clearCart } = useCart();
  
  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('picloopz-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders', error);
      }
    }
  }, []);
  
  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('picloopz-orders', JSON.stringify(orders));
  }, [orders]);
  
  const createOrder = async (shippingAddress: any): Promise<Order> => {
    // Generate random ID
    const generateOrderId = () => {
      return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };
    
    // Calculate estimated delivery (14 days from now)
    const getEstimatedDelivery = () => {
      const date = new Date();
      date.setDate(date.getDate() + 14);
      return date.toISOString().split('T')[0];
    };
    
    const newOrder: Order = {
      id: generateOrderId(),
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        variant: item.variants[item.selectedVariant].name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.variants[item.selectedVariant].imageUrl,
        uploadedImage: item.uploadedImage
      })),
      status: 'pending',
      totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      createdAt: new Date().toISOString(),
      shippingAddress,
      estimatedDelivery: getEstimatedDelivery(),
      isPendingApproval: false
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success('Order placed successfully!');
    return newOrder;
  };
  
  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };
  
  const approveOrderDesign = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, isPendingApproval: false, status: 'confirmed' } 
          : order
      )
    );
    toast.success('Design approved! Your order will now proceed to production.');
  };
  
  const requestDesignChange = (orderId: string, _feedback: string) => {
    // In a real implementation, this would send feedback to the admin
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, isPendingApproval: true } 
          : order
      )
    );
    toast.success('Feedback sent! Our design team will review your request.');
  };
  
  const uploadPreviewImage = (orderId: string, imageUrl: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, previewImage: imageUrl, isPendingApproval: true } 
          : order
      )
    );
  };
  
  return (
    <OrderContext.Provider 
      value={{ 
        orders,
        createOrder,
        getOrder,
        updateOrderStatus,
        approveOrderDesign,
        requestDesignChange,
        uploadPreviewImage
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

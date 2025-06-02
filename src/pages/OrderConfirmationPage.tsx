import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders, Order } from '../contexts/OrderContext';
import toast from 'react-hot-toast';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders } = useOrders();
  
  // Get order from state or find the most recent order
  const order: Order = location.state?.order || orders[0];
  
  useEffect(() => {
    // If no order is available, redirect to home
    if (!order) {
      toast.error('Order information not found');
      navigate('/');
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to view your order');
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [order, isAuthenticated, navigate, location.pathname]);
  
  if (!order) {
    return null;
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold font-playfair mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for your order! We've received your request and will begin working on it right away.
          </p>
        </div>
        
        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold font-playfair">Order Summary</h2>
              <span className="bg-terracotta-100 text-terracotta-800 text-sm px-3 py-1 rounded-full">
                {order.status === 'pending' ? 'Pending' : 
                 order.status === 'confirmed' ? 'Confirmed' : 
                 order.status === 'ready' ? 'Ready' : 
                 order.status === 'out_for_delivery' ? 'Out for Delivery' : 'Delivered'}
              </span>
            </div>
            <div className="flex flex-wrap text-sm text-gray-500 mt-2">
              <span className="mr-6">Order ID: <span className="text-gray-800 font-medium">{order.id}</span></span>
              <span>Date: <span className="text-gray-800 font-medium">{formatDate(order.createdAt)}</span></span>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 flex">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Variant: {item.variant}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Totals */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.totalAmount >= 50 ? 'Free' : '$5.00'}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-semibold">
              <span>Total</span>
              <span className="text-terracotta-700">
                ${(order.totalAmount + (order.totalAmount >= 50 ? 0 : 5)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Shipping Info */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Truck size={18} className="mr-2 text-terracotta-600" />
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                <p className="text-gray-800">{order.shippingAddress.name}</p>
                <p className="text-gray-800">{order.shippingAddress.address}</p>
                <p className="text-gray-800">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-800">{order.shippingAddress.country}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Estimate</h3>
                <p className="text-gray-800">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'To be determined'}</p>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Next Steps</h3>
                  <p className="text-gray-800 text-sm">
                    We'll prepare your design and send you a preview for approval before production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            to={`/account/orders/${order.id}`} 
            className="px-6 py-3 bg-terracotta-600 text-white rounded-full font-medium hover:bg-terracotta-700 transition-colors flex items-center"
          >
            Track Order
            <ChevronRight size={18} className="ml-1" />
          </Link>
          <Link 
            to="/account/orders" 
            className="px-6 py-3 border border-terracotta-200 text-terracotta-700 rounded-full font-medium hover:bg-terracotta-50 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

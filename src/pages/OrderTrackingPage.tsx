import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, CircleHelp, MessageCircle, Package, Phone, Truck } from 'lucide-react';
import { useAuth } from '../features/auth/authHooks';
import { Order } from '../features/order/orderTypes';
import { useOrders } from '../features/order/useOrder';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const { isAuthenticated } = useAuth();
  const { getOrderById, currentOrder, orderCancel } = useOrders();
  const [order, setOrder] = useState<Order | undefined>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'support'; text: string; timestamp: Date }[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const cancellationReasons = [
    "Changed my mind",
    "Found better price elsewhere",
    "Shipping takes too long",
    "Ordered by mistake",
    "Product not needed anymore",
    "Other reason",
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view your order');
      navigate('/login', { state: { from: `/account/orders/${orderId}` } });
      return;
    }

    if (orderId && !hasFetched.current) {
      getOrderById(orderId);
      hasFetched.current = true;
    }
  }, [orderId, isAuthenticated, navigate, getOrderById]);

  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
    }
  }, [currentOrder]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      sender: 'user' as const,
      text: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setMessage('');

    setTimeout(() => {
      const supportMessage = {
        sender: 'support' as const,
        text: 'Thank you for your message. Our team will get back to you shortly.',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancellationReason(cancellationReasons[0]);
    setCustomReason('');
  };

  const handleCancelOrder = async () => {
    if (!orderId) return;

    const reasonToSend =
      cancellationReason === 'Other reason' ? customReason.trim() : cancellationReason;

    if (!reasonToSend) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await orderCancel(orderId, reasonToSend);
      toast.success('Order cancelled successfully');
      getOrderById(orderId);
      setShowCancelModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const statusSteps: Record<string, number> = {
    Pending: 1,
    Confirmed: 2,
    Ready: 3,
    'Out for Delivery': 4,
    Delivered: 5,
  };

  const getStatusStep = (status: string) => statusSteps[status] ?? 1;

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (order.status === 'Cancelled') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 font-playfair">Order Tracking</h1>
        <p className="text-xl text-red-600 font-semibold">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
              <p className="mb-4">Please tell us why you're canceling this order:</p>

              <select
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value);
                  if (e.target.value !== 'Other reason') setCustomReason('');
                }}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
              >
                {cancellationReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {cancellationReason === 'Other reason' && (
                <textarea
                  placeholder="Please specify your reason"
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 min-h-[100px]"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isCancelling}
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  className={`px-4 py-2 rounded-md text-white ${
                    isCancelling ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-gray-600 hover:text-terracotta-600 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-6 font-playfair">Order Tracking</h1>
        
        {/* Order Info */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <span className="text-gray-500">Order ID: </span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">Order Date:</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Ready' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'Out for Delivery' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-green-100 text-green-800'}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tracking Timeline */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Order Status</h2>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                {/* Step 1: Order Placed */}
                <div className="relative flex items-start">
                  <div className={`w-14 h-14 rounded-full ${
                    getStatusStep(order.status) >= 1 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center mr-4 z-10`}>
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-gray-500">
                      We've received your order and are processing it.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {/* Step 2: Order Confirmed */}
                <div className="relative flex items-start">
                  <div className={`w-14 h-14 rounded-full ${
                    getStatusStep(order.status) >= 2 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center mr-4 z-10`}>
                    {getStatusStep(order.status) >= 2 ? <Check size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmed</h3>
                    <p className="text-sm text-gray-500">
                      Your design has been approved and order confirmed.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.estimatedDelivery ? 'Waiting for your approval' : 
                       getStatusStep(order.status) >= 2 ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Step 3: Order Ready */}
                <div className="relative flex items-start">
                  <div className={`w-14 h-14 rounded-full ${
                    getStatusStep(order.status) >= 3 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center mr-4 z-10`}>
                    {getStatusStep(order.status) >= 3 ? <Check size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium">Preparing Your Order</h3>
                    <p className="text-sm text-gray-500">
                      Your order is being created and prepared for shipping.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getStatusStep(order.status) >= 3 ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Step 4: Out for Delivery */}
                <div className="relative flex items-start">
                  <div className={`w-14 h-14 rounded-full ${
                    getStatusStep(order.status) >= 4 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center mr-4 z-10`}>
                    {getStatusStep(order.status) >= 4 ? <Check size={20} /> : <Truck size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium">Out for Delivery</h3>
                    <p className="text-sm text-gray-500">
                      Your order has been shipped and is on its way to you.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getStatusStep(order.status) >= 4 ? 
                        (order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'Shipped') : 
                        'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Step 5: Delivered */}
                <div className="relative flex items-start">
                  <div className={`w-14 h-14 rounded-full ${
                    getStatusStep(order.status) >= 5 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center mr-4 z-10`}>
                    {getStatusStep(order.status) >= 5 ? <Check size={20} /> : <Package size={20} />}
                  </div>
                  <div>
                    <h3 className="font-medium">Delivered</h3>
                    <p className="text-sm text-gray-500">
                      Your order has been delivered.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getStatusStep(order.status) >= 5 ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Button (only show for cancellable statuses) */}
        {['Pending', 'Confirmed', 'Ready'].includes(order.status) && (
          <div className='my-4'>
            <button 
              className="p-4 w-full rounded-md text-white text-lg bg-terracotta-600 hover:bg-terracotta-700"
              onClick={handleCancelClick}
            >
              Cancel Order
            </button>
          </div>
        )}
        
        {/* Support Options */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Need Help?</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-terracotta-300 hover:bg-terracotta-50 transition-colors"
              >
                <MessageCircle size={24} className="text-terracotta-600 mb-3" />
                <h3 className="font-medium">Chat with Support</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Chat with our customer service team
                </p>
              </button>
              
              <button 
                onClick={() => toast.success('We will call you shortly!')}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-terracotta-300 hover:bg-terracotta-50 transition-colors"
              >
                <Phone size={24} className="text-terracotta-600 mb-3" />
                <h3 className="font-medium">Request a Call</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Get a call from our support team
                </p>
              </button>
              
              <button 
                onClick={() => navigate('/faq')}
                className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-terracotta-300 hover:bg-terracotta-50 transition-colors"
              >
                <CircleHelp size={24} className="text-terracotta-600 mb-3" />
                <h3 className="font-medium">FAQs & Help</h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Find answers to common questions
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Chat with Support</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Start a conversation with our support team</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.sender === 'user' 
                          ? 'bg-terracotta-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-terracotta-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
                <button 
                  type="submit"
                  className="bg-terracotta-600 text-white px-4 py-2 rounded-r-lg hover:bg-terracotta-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;

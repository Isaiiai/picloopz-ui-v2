import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/useCart';
import toast from 'react-hot-toast';
import { loadRazorpayScript } from '../utils/loadRazorpayScript';
import { useOrders } from '../features/order/useOrder';

const OrderSummaryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  const { currentOrder, verifyPayment } = useOrders();
  
  const formData = state?.formData;

  if (!formData || !currentOrder) {
    toast.error('Order information missing.');
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    const isRazorpayScriptLoaded = await loadRazorpayScript();
    if (!isRazorpayScriptLoaded) {
      toast.error('Razorpay Failed to load. Are you online?');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      
      amount: currentOrder.totalAmount * 100,
      currency: 'INR',
      name: 'Picloopz',
      description: 'Secure Payment',
      order_id: currentOrder.razorpayOrderId,
      handler: async function (response: any) {
        try {
          const verifyRes = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }).unwrap();

          if (verifyRes.paymentStatus !== 'Paid') {
            toast.error('Payment verification failed');
            return;
          }

          toast.success('Payment Successful!');
          emptyCart();
          navigate('/order-confirmation', { 
            state: { 
              order: verifyRes
            } 
          });
        } catch (err) {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#6366F1' },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-playfair">Order Summary</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold">Order Items ({currentOrder.items.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {currentOrder.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="p-4 flex">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                    {item.productImage && (
                      <img 
                        src={item.productImage} 
                        alt={item.productName?.toString()} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.productName}</h3>
                        {item.variantName && (
                          <p className="text-gray-500 text-sm">
                            Variant: {item.variantName}
                          </p>
                        )}
                        <p className="text-purple-600 font-medium mt-1">
                          ₹{item.unitPrice?.toFixed(2)}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Total: ₹{(item.unitPrice ? item.unitPrice : 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {item.uploadedImageUrl && item.uploadedImageUrl.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500 mr-2">Uploaded Images:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.uploadedImageUrl.map((image, idx) => (
                            <div key={idx} className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                              <img 
                                src={image} 
                                alt={`Uploaded ${idx + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{currentOrder.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{currentOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-purple-600">₹{currentOrder.totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePayment}
                className="w-full py-3 rounded-full font-medium flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { mockProducts } from '../data/mockData';
import toast from 'react-hot-toast';

type ShippingKey = 'insideTamilNadu' | 'allOverIndia' | 'international';

const getShippingKey = (country: string) => {
  if (country === 'India' || country === 'United States') return 'allOverIndia';
  if (country === 'United States') return 'allOverIndia';
  if (country === 'Canada' || country === 'United Kingdom' || country === 'Australia') return 'international';
  if (country === 'Tamil Nadu') return 'insideTamilNadu';
  return 'international';
};

const OrderSummaryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const formData = state?.formData;

  if (!formData) {
    toast.error('Shipping information missing.');
    navigate('/cart');
    return null;
  }

  // Determine shipping key
  let shippingKey: ShippingKey = 'allOverIndia';
  if (formData.country === 'India' || formData.country === 'United States') shippingKey = 'allOverIndia';
  else if (formData.country === 'Tamil Nadu') shippingKey = 'insideTamilNadu';
  else shippingKey = 'international';

  // Calculate shipping and totals
  let subtotal = 0;
  let shippingTotal = 0;
  const summaryItems = cartItems.map(item => {
    const product = mockProducts.find(p => p.id === item.id);
    const variant = product?.variants[item.selectedVariant];
    const itemSubtotal = item.price * item.quantity;
    const shipping = variant?.shipping?.[shippingKey] || 0;
    subtotal += itemSubtotal;
    shippingTotal += shipping * item.quantity;
    return {
      ...item,
      variantName: variant?.name,
      variantImage: variant?.imageUrl,
      shipping,
      itemSubtotal,
    };
  });
  const total = subtotal + shippingTotal;

  const handlePlaceOrder = () => {
    clearCart();
    toast.success('Order placed successfully!');
    navigate('/order-confirmation', { state: { order: { ...formData, subtotal, shippingTotal, total } } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-playfair">Order Summary</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold">Cart Items ({cartItems.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {summaryItems.map(item => (
                <div key={`${item.id}-${item.selectedVariant}`} className="p-4 flex">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                    <img 
                      src={item.variantImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-500 text-sm">
                          Variant: {item.variantName}
                        </p>
                        <p className="text-purple-600 font-medium mt-1">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Shipping: ₹{item.shipping} x {item.quantity} = ₹{item.shipping * item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Uploaded Image:</span>
                      <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                        <img 
                          src={item.uploadedImage} 
                          alt="Uploaded preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
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
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-purple-600">₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-full font-medium flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useOrders } from '../features/order/useOrder';
import toast from 'react-hot-toast';
import { CreateOrderData } from '../features/order/orderTypes';
import { useUpload } from '../features/upload/useUpload';
import { loadRazorpayScript } from '../utils/loadRazorpayScript';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
}

const CartPage = () => {
  const { 
    cart, 
    updateCartItem, 
    removeCartItem, 
    emptyCart 
  } = useCart();

  const { cartImagesUpload, clear } = useUpload();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    notes: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof FormData]: value
    }));
  };
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    updateCartItem({ itemId, quantity: newQuantity });
  };
  
  const { createOrder, verifyPayment } = useOrders();
  const navigate = useNavigate();
  
  const handleCheckout = async () => {
  const requiredFields: (keyof FormData)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    toast.error('Please fill in all required fields');
    return;
  }

  const isRazorpayScriptLoaded = await loadRazorpayScript();
  if (!isRazorpayScriptLoaded) {
    toast.error('Razorpay Failed to load. Are you online?');
    return;
  }

  try {
    const orderData: CreateOrderData = {
      items: cart.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        uploadedImageUrl: cartImagesUpload?.uploads[0]?.url ?? '',
      })),
      shippingAddress: {
        fullName: formData.name,
        phone: formData.phone,
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: 'razorpay',
      notes: formData.notes || '',
    };

    // ✅ Get clean response
    const orderResponse = await createOrder(orderData).unwrap();
    const { razorpayOrderId, totalAmount } = orderResponse;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Picloopz',
      description: 'Secure Payment',
      order_id: razorpayOrderId,
      handler: async function (response: any) {
        const verifyRes = await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }).unwrap();

        if (verifyRes.status !== 'Confirmed') {
          toast.error('Payment verification failed');
          return;
        }

        toast.success('Payment Successful!');
        emptyCart();
        clear();
        navigate('/order-confirmation', { state: { order: verifyRes.data } });
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
  } catch (err: any) {
    toast.error(err?.message || 'Checkout failed');
  }
};


  
  const isFormValid = () => {
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return requiredFields.every(field => formData[field]) && cart.items.length > 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-playfair">Shopping Cart</h1>
      
      {cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold">Cart Items ({cart.items.length})</h2>
                <button 
                  onClick={emptyCart}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
                >
                  <Trash2 size={14} className="mr-1" />
                  Clear All
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map(item => (
                  <div key={item.id} className="p-4 flex">
                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                      {item && (
                        <img 
                          src={item.productImage}
                          alt={item.productName} 
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
                            ₹{item.unitPrice}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => removeCartItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden w-24">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-8 h-8 text-center focus:outline-none"
                          />
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-medium">
                            ₹{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
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
                  <span className="font-medium">₹{cart.totalAmount}</span>
                </div>
                
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.totalAmount >= 50 ? 'Free' : '₹5.00'}
                  </span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-purple-600">
                    ₹{(cart.totalAmount + (cart.totalAmount >= 50 ? 0 : 5)).toFixed(2)}
                  </span>
                </div>
                
                {/* Shipping Information Form */}
                <div className="pt-4">
                  <h3 className="font-medium mb-3">Shipping Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm text-gray-600 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="city" className="block text-sm text-gray-600 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm text-gray-600 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="zipCode" className="block text-sm text-gray-600 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm text-gray-600 mb-1">
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={!isFormValid() || cart.loading}
                  className={`w-full py-3 rounded-full font-medium flex items-center justify-center ${
                    isFormValid() && !cart.loading
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  {cart.loading ? 'Processing...' : 'Proceed to Checkout'}
                  {!cart.loading && <ChevronRight size={18} className="ml-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet</p>
          <Link 
            to="/category/all" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useOrders } from '../features/order/useOrder';
import toast from 'react-hot-toast';
import { CreateOrderData } from '../features/order/orderTypes';
import { useUpload } from '../features/upload/useUpload';

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
    removeCartItem, 
    emptyCart 
  } = useCart();
  
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
  
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  
  const handleProceedToCheckout = async () => {
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const orderData: CreateOrderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: 1,
          uploadedImageUrl: item.cartImages,
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

      const orderResponse = (await createOrder(orderData).unwrap()) as any;
      
      // Navigate to Order Summary with the order data
      navigate('/order-summary', { 
        state: { 
          orderData: orderResponse,
          formData 
        } 
      });

    } catch (err: any) {
      toast.error(err?.message || 'Order creation failed');
    }
  };


  
  const isFormValid = () => {
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return requiredFields.every(field => formData[field]) && cart.items.length > 0;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 overflow-x-hidden pt-36 md:pt-32">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 font-playfair text-center sm:text-left">Shopping Cart</h1>
      
      {cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                      {item && (
                        <img 
                          src={item.productImage}
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-base sm:text-lg">{item.productName}</h3>
                          {item.variantName && (
                            <p className="text-gray-500 text-xs sm:text-sm">
                              Variant: {item.variantName}
                            </p>
                          )}
                          <p className="text-purple-600 font-medium mt-1 text-sm sm:text-base">
                            ₹{item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <button 
                          onClick={() => removeCartItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors self-start sm:self-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap flex-row-reverse gap-2 mt-2">
                        {item.cartImages.map((cartImage, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={cartImage}
                              alt={`Custom image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items Total</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes & Shipping</span>
                  <span className="text-gray-400 italic">Calculated next</span>
                </div>

                <hr className="my-2 border-gray-200" />

                <div className="flex justify-between font-semibold text-base text-gray-800">
                  <span>Final Total</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium text-gray-700">Note:</span> Tax and shipping charges will be calculated at the payment step.
                </p>
              </div>
            </div>

          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden lg:sticky lg:top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold">Shipping Information</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* <div className="flex justify-between pb-4 border-b border-gray-200">
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
                </div> */}
                
                {/* Shipping Information Form */}
                <div className="pt-4">
                  {/* <h3 className="font-medium mb-3">Shipping Information</h3> */}
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
                    
                    <div className="grid grid-cols-1 gap-3">
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
                    
                    <div className="grid grid-cols-1 gap-3">
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
                    
                    <div className="grid grid-cols-1 gap-3">
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
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToCheckout}
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
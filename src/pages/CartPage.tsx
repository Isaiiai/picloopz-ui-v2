import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useOrders } from '../features/order/useOrder';
import toast from 'react-hot-toast';
import { CreateOrderData, Order } from '../features/order/orderTypes';
import { useUpload } from '../features/upload/useUpload';
import { reverseGeocode } from '../utils/geocode';

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

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.loading("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const data = await reverseGeocode(latitude, longitude);

          const address = data.address;
          console.log(address)

          setFormData(prev => ({
            ...prev,
            address: address.road + ", " + address.suburb || '',
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            zipCode: address.postcode || '',
            country: address.country || 'United States',
          }));

          toast.dismiss();
          toast.success("Location fetched successfully!");
        } catch (err) {
          toast.dismiss();
          toast.error("Failed to fetch address.");
          console.error(err);
        }
      },
      (error) => {
        toast.dismiss();
        toast.error("Permission denied or failed to get location.");
      }
    );
  };
  
  const isFormValid = () => {
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return requiredFields.every(field => formData[field]) && cart.items.length > 0;
  };

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-8 bg-gradient-to-br from-amber-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-terracotta-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-amber-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-amber-100 via-cream-100 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair mb-6 text-gray-900 text-center sm:text-left">Shopping Cart</h1>
        
        {cart.items.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </p>
              <button 
                onClick={emptyCart}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full flex items-center gap-2 shadow transition-colors font-semibold"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h2 className="font-semibold">Cart Items ({cart.items.length})</h2>
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
                      {/* Shipping Information Form */}
                      <div className="pt-4">
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
                          <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            className="text-sm text-purple-600 hover:underline mt-2"
                          >
                            Use my current location
                          </button>
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
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <ShoppingBag size={56} className="text-purple-300 drop-shadow" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair mb-1 text-gray-800 tracking-tight">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-4 text-center max-w-xs text-base sm:text-lg">
              Looks like you haven't added any products to your cart yet.
              Start exploring now!
            </p>
            <Link 
              to="/category/all" 
              className="inline-block px-8 py-3 bg-terracotta-600 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold shadow"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
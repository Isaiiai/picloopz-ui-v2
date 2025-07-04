import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, CreditCard, Pen, Heart, House, LogOut, Mail, MapPin, Package, Phone, Save, User } from 'lucide-react';
import { useAuth } from '../features/auth/authHooks';
import { useOrders } from '../features/order/useOrder';
import { useFavorite } from '../features/favorite/useFavorite';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { favorites } = useFavorite();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    // We're using window.location here to force a full reload
    // so the login modal will appear on the homepage
    window.location.href = '/';
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update user info
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const renderOrders = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Link 
            to="/category/all" 
            className="inline-block bg-terracotta-600 text-white px-4 py-2 rounded-full hover:bg-terracotta-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-sm text-gray-500">Order ID: </span>
                <span className="font-medium">{order.id}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Ready' ? 'bg-purple-100 text-purple-800' :
                order.status === 'Out for Delivery' ? 'bg-indigo-100 text-indigo-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status === 'Pending' ? 'Pending' : 
                 order.status === 'Confirmed' ? 'Confirmed' : 
                 order.status === 'Ready' ? 'Ready' : 
                 order.status === 'Out for Delivery' ? 'Out for Delivery' : 'Delivered'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className='flex'>
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={item.uploadedImageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className='flex-row px-2'>
                    <h3 className="font-normal">{item.productName}</h3>
                    <p className="text-gray-500 text-sm">
                      Variant: {item.variantName}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-500">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 mr-2">Total:</span>
                <span className="font-medium text-terracotta-700">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <Link 
                to={`/account/orders/${order.id}`}
                className="text-terracotta-600 hover:text-terracotta-800 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 font-playfair">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-24">
            {/* Profile Summary */}
            <div className="p-6 bg-cream-100 border-b border-gray-200 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-cream-200 mx-auto">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-terracotta-600">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-terracotta-500 text-white p-1.5 rounded-full hover:bg-terracotta-600 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            {/* Navigation */}
            <nav className="p-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'profile' 
                    ? 'bg-terracotta-50 text-terracotta-800' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'orders' 
                    ? 'bg-terracotta-50 text-terracotta-800' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package size={18} className="mr-3" />
                <span>Orders</span>
                {orders.length > 0 && (
                  <span className="ml-auto bg-terracotta-100 text-terracotta-800 text-xs px-2 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'favorites' 
                    ? 'bg-terracotta-50 text-terracotta-800' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart size={18} className="mr-3" />
                <span>Favorites</span>
                {favorites.length > 0 && (
                  <span className="ml-auto bg-terracotta-100 text-terracotta-800 text-xs px-2 py-1 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'addresses' 
                    ? 'bg-terracotta-50 text-terracotta-800' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <House size={18} className="mr-3" />
                <span>Addresses</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  activeTab === 'payment' 
                    ? 'bg-terracotta-50 text-terracotta-800' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Payment Methods</span>
              </button>
              
              <hr className="my-2 border-gray-200" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg text-left text-gray-700 hover:bg-gray-50"
              >
                <LogOut size={18} className="mr-3" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            {/* Profile Content */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {isEditing ? (
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center text-sm font-medium text-terracotta-600 hover:text-terracotta-800"
                    >
                      <Save size={16} className="mr-1" />
                      Save Changes
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-sm font-medium text-terracotta-600 hover:text-terracotta-800"
                    >
                      <Pen size={16} className="mr-1" />
                      Pen Profile
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none"
                        />
                      ) : (
                        <div className="flex items-center">
                          <User size={18} className="text-gray-400 mr-2" />
                          <span>{profileData.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail size={18} className="text-gray-400 mr-2" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone size={18} className="text-gray-400 mr-2" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none"
                        />
                      ) : (
                        <div className="flex items-center">
                          <MapPin size={18} className="text-gray-400 mr-2" />
                          <span>{profileData.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders Content */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                {renderOrders()}
              </div>
            )}
            
            {/* Favorites Content */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">My Favorites</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-4">You haven't added any products to your favorites yet</p>
                    <Link 
                      to="/category/all" 
                      className="inline-block bg-terracotta-600 text-white px-4 py-2 rounded-full hover:bg-terracotta-700 transition-colors"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favorites.map(product => (
                      <Link 
                        to={`/product/${product.productId}`} 
                        key={product.id} 
                        className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 bg-gray-100">
                          <img 
                            src={product.productImage} 
                            alt={product.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">{product.productName}</h3>
                          <p className="text-terracotta-600 font-medium">₹{product.productPrice.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Addresses Content */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">House</h3>
                      <p className="text-gray-600">{profileData.name}</p>
                      <p className="text-gray-600">{profileData.address}</p>
                      <p className="text-gray-600">{profileData.city}, {profileData.state} {profileData.zipCode}</p>
                      <p className="text-gray-600">{profileData.country}</p>
                      <p className="text-gray-600">{profileData.phone}</p>
                    </div>
                    <div>
                      <button className="text-terracotta-600 hover:text-terracotta-800 text-sm font-medium">
                        Pen
                      </button>
                    </div>
                  </div>
                </div>
                
                <button className="bg-terracotta-50 text-terracotta-600 border border-dashed border-terracotta-300 rounded-lg p-4 w-full hover:bg-terracotta-100 transition-colors">
                  + Add New Address
                </button>
              </div>
            )}
            
            {/* Payment Methods Content */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <p className="text-gray-500 mb-4">You haven't added any payment methods yet.</p>
                <button className="bg-terracotta-50 text-terracotta-600 border border-dashed border-terracotta-300 rounded-lg p-4 w-full hover:bg-terracotta-100 transition-colors">
                  + Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

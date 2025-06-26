import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera, CreditCard, Pen, Heart, House, LogOut, Mail,
  Package, Phone, Save, User
} from 'lucide-react';
import { useAuth } from '../features/auth/authHooks';
import { useOrders } from '../features/order/useOrder';
import { useFavorite } from '../features/favorite/useFavorite';
import { useUpload } from '../features/upload/useUpload';
import { useProfile } from '../features/profile/useProfile';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const { favorites } = useFavorite();
  const { fetchProfile, updateUserProfile, profile } = useProfile();
  const { singleUpload, uploadSingle, loading, clear } = useUpload();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    profileImage: profile?.profileImage || '',
  });

  // Fetch profile on load
  useEffect(() => {
    if (user?.id) fetchProfile(user.id);
  }, [user?.id, fetchProfile]);

  // Set profile data from redux
  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        phone: profile.phone || '',
        profileImage: profile.profileImage || '',
      }));
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) window.location.href = '/';
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { 
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    try {
      await uploadSingle(formData);
      toast.success('Profile photo uploaded successfully');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload profile photo');
    }
  };

  useEffect(() => {
    if (singleUpload?.url) {
      const url = singleUpload.url;
      setProfileData(prev => ({ ...prev, profileImage: url }));

      (async () => {
        try {
          await updateUserProfile({
            name: profileData.name,
            phone: profileData.phone,
            profileImage: url,
          });
          toast.success('Profile image updated!');
        } catch {
          toast.error('Failed to update profile image');
        }
      })();
    }
  }, [singleUpload]);



  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        name: profileData.name,
        phone: profileData.phone,
        profileImage: profileData.profileImage,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const renderOrders = () => {
    if (!orders.length) {
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
                {order.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className='flex'>
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <img src={item.productImage} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className='flex-row px-2'>
                    <h3 className="font-normal">{item.productName}</h3>
                    <p className="text-gray-500 text-sm">Variant: {item.variantName}</p>
                    {item.uploadedImageUrl && item.uploadedImageUrl.length > 0 && (
                      <div className='mb-2'>
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
                    <hr className="my-2 border-gray-200 w-full" />
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

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 font-playfair">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 bg-cream-100 border-b border-gray-200 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-cream-200 mx-auto">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-terracotta-600">
                      <User size={36} />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-terracotta-500 text-white p-1.5 rounded-full hover:bg-terracotta-600 transition-colors cursor-pointer"
                >
                  <Camera size={14} />
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  hidden
                />
              </div>
              <h3 className="font-medium">{profileData.name}</h3>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>

            {/* Nav */}
            <nav className="p-2">
              {[
                ['profile', 'Profile', <User size={18} />],
                ['orders', 'Orders', <Package size={18} />],
                ['favorites', 'Favorites', <Heart size={18} />],
                ['addresses', 'Addresses', <House size={18} />],
                ['payment', 'Payment Methods', <CreditCard size={18} />]
              ].map(([key, label, icon]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === key ? 'bg-terracotta-50 text-terracotta-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}

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

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
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
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center"><User size={18} className="text-gray-400 mr-2" /> {profileData.name}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center"><Mail size={18} className="text-gray-400 mr-2" /> {profileData.email}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center"><Phone size={18} className="text-gray-400 mr-2" /> {profileData.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && <>{renderOrders()}</>}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

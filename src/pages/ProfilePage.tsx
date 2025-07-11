import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera, CreditCard, Pen, Heart, House, LogOut, Mail,
  Package, Phone, Save, User, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../features/auth/authHooks';
import { useOrders } from '../features/order/useOrder';
import { useFavorite } from '../features/favorite/useFavorite';
import { useUpload } from '../features/upload/useUpload';
import { useProfile } from '../features/profile/useProfile';
import { UpdateProfile } from '../features/profile/profileTypes';
import toast from 'react-hot-toast';
import OrderCard from '../components/OrderCard';
import FavoriteProductCard from '../components/FavoriteProductCard';

// Define a type for navigation items
type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const ProfilePage = () => {
  const { user, logout, isAuthenticated, changeUserPassword } = useAuth();
  const { orders } = useOrders();
  const { favorites } = useFavorite();
  const { fetchProfile, updateUserProfile, profile, loading } = useProfile();
  const { singleUpload, uploadSingle } = useUpload();
  const profileFetchedRef = useRef(false);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    profileImage: profile?.profileImage || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Map favorite product to ProductCard's expected props
  const mapFavoriteToProduct = (fav: any) => ({
    id: fav.productId,
    name: fav.productName,
    description: fav.description || '',
    variants: fav.variants || [
      {
        name: '',
        price: fav.productPrice,
        imageUrl: fav.productImage,
      },
    ],
    category: fav.category || '',
    categoryId: fav.categoryId || '',
    rating: fav.rating || 0,
    reviewCount: fav.reviewCount || 0,
    orderCount: fav.orderCount || 0,
  });

  // Navigation items
  const navItems: NavItem[] = [
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { key: 'favorites', label: 'Favorites', icon: <Heart size={18} /> },
    { key: 'addresses', label: 'Addresses', icon: <House size={18} /> },
    { key: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> }
  ];

  // Fetch profile on load - only once
  useEffect(() => {
    if (user?.id && !profileFetchedRef.current) {
      profileFetchedRef.current = true;
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Set profile data from redux
  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        name: profile.name || prev.name,
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

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (formData: FormData) => {
    if (!isAuthenticated) {
      toast('Please log in to upload a profile image', { icon: '🔒' });
      return;
    }
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
          // Create update data with only the fields we want to update
          const updateData: UpdateProfile = {
            profileImage: url,
          };
          
          await updateUserProfile(updateData);
          toast.success('Profile image updated!');
        } catch (error: any) {
          console.error('Profile image update error:', error);
          toast.error(error?.message || 'Failed to update profile image');
        }
      })();
    }
  }, [singleUpload, updateUserProfile]);

  const handleSaveProfile = async () => {
    try {
      if (!profileData.name.trim()) {
        toast.error('Name cannot be empty');
        return;
      }

      // Create update data with only the fields we want to update
      const updateData: UpdateProfile = {
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        profileImage: profileData.profileImage,
      };
      
      // Wait for the update to complete
      await updateUserProfile(updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  // Handle save password
  const handleSavePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderOrders = () => {
    // Filter for orders with successful payment
    const successfulOrders = orders.filter(order => order.paymentStatus === 'Paid');

    if (successfulOrders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">You haven't placed any successful orders yet</p>
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
        {successfulOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  const renderFavorites = () => {
    if (favorites.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">You haven't added any products to your favorites yet</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start p-2">
        {favorites.map((fav) => (
          <FavoriteProductCard
            key={fav.productId}
            product={mapFavoriteToProduct(fav)}
          />
        ))}
      </div>
    );
  };
  

  if (!isAuthenticated) return null;

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-8 bg-gradient-to-br from-amber-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-terracotta-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-amber-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-amber-100 via-cream-100 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>
      <div className="container mx-auto px-4 py-20 mt-8 md:mt-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden md:sticky md:top-24">
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('image', file);
                        handleProfileImageUpload(formData);
                      }
                    }}
                    hidden
                  />
                </div>
                <h3 className="font-medium">{profileData.name}</h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center p-3 rounded-lg text-left ${
                      activeTab === item.key ? 'bg-terracotta-50 text-terracotta-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
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
                        disabled={loading}
                        className="flex items-center text-sm font-medium text-terracotta-600 hover:text-terracotta-800 disabled:opacity-50"
                      >
                        <Save size={16} className="mr-1" />
                        {loading ? 'Saving...' : 'Save Changes'}
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
                            disabled // Email changes should be handled separately
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
                    
                    {/* Password Change Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Lock size={18} className="mr-2 text-gray-500" />
                        Change Password
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.current ? "text" : "password"}
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                              required
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => togglePasswordVisibility('current')}
                            >
                              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                        
                        {/* New Password */}
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.new ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                              required
                              minLength={6}
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => togglePasswordVisibility('new')}
                            >
                              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>
                        
                        {/* Confirm New Password */}
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className={`w-full px-3 py-2 border ${
                                passwordData.newPassword && 
                                passwordData.confirmPassword && 
                                passwordData.newPassword !== passwordData.confirmPassword 
                                  ? 'border-red-300' 
                                  : 'border-gray-300'
                              } rounded-lg pr-10`}
                              required
                            />
                            <button 
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => togglePasswordVisibility('confirm')}
                            >
                              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {passwordData.newPassword && 
                           passwordData.confirmPassword && 
                           passwordData.newPassword !== passwordData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleSavePassword}
                          disabled={
                            passwordLoading || 
                            !passwordData.currentPassword || 
                            !passwordData.newPassword || 
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword
                          }
                          className="px-4 py-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {passwordLoading ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && <>{renderOrders()}</>}
              {activeTab === 'favorites' && <>{renderFavorites()}</>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../features/auth/authHooks';
import api from '../config/axiosConfig'; // Import api instead of axios

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  otp: string;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const { login, verifyUserOTP } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    password: '',
    otp: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof FormData]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name as keyof FormErrors]: ''
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Validate password
    if (!isOtpMode && !formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!isOtpMode && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Validate name for registration
    if (!isLoginMode && !isOtpMode && !formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate OTP if in OTP mode
    if (isOtpMode && !formData.otp) {
      newErrors.otp = 'Verification code is required';
      isValid = false;
    } else if (isOtpMode && formData.otp.length !== 6) {
      newErrors.otp = 'Verification code must be 6 digits';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Store phone number in form data
      const phoneToUse = "9988776655"; // In a real app, collect this from the user
      setFormData(prev => ({
        ...prev,
        phone: phoneToUse
      }));
      
      // Use api instead of axios and the correct endpoint path
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: phoneToUse
      });
      
      setIsOtpMode(true);
      toast.success('Verification code sent to your email');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Use the verifyUserOTP function from the auth hook
      await verifyUserOTP(
        formData.email,
        formData.otp,
        formData.name,
        formData.password,
        formData.phone || "9988776655" // Preferably use the stored phone
      );
      
      // The auth state will be updated by the verifyUserOTP thunk
      onClose();
      // Toast message will be shown by the auth slice
    } catch (error: any) {
      // Improved error handling
      const errorMessage = error?.response?.data?.message || error?.toString() || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    }
  };
  
  const handleResendOTP = async () => {
    if (isResendingOtp) return;
    
    try {
      setIsResendingOtp(true);
      // Use api instead of axios and the correct endpoint path
      await api.post('/auth/resend-otp', {
        email: formData.email,
        name: formData.name
      });
      toast.success('New verification code sent to your email');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to resend code. Please try again.';
      // Check for name validation error
      if (errorMessage.includes('Name is required')) {
        toast.error('Name is required to resend verification code');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsResendingOtp(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (error: any) {
      toast.error(error?.toString() || 'Something went wrong. Please try again.');
    }
  };
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setIsOtpMode(false);
    setErrors({ name: '', email: '', password: '', otp: '' });
  };
  
  const goBack = () => {
    setIsOtpMode(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="p-6 pb-0">
          {isOtpMode && (
            <button
              onClick={goBack}
              className="flex items-center text-terracotta-600 hover:text-terracotta-800 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>
          )}
          
          <h2 className="text-2xl font-semibold font-playfair text-gray-800">
            {isLoginMode ? 'Welcome Back' : isOtpMode ? 'Verify Your Email' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isLoginMode 
              ? 'Sign in to your account' 
              : isOtpMode 
                ? 'Enter the verification code sent to your email' 
                : 'Join the Picloopz community'}
          </p>
        </div>
        
        {/* Form */}
        <form 
          onSubmit={
            isLoginMode 
              ? handleLogin 
              : isOtpMode 
                ? handleVerifyOTP 
                : handleSendOTP
          } 
          className="p-6"
        >
          <div className="space-y-4">
            {/* Email field (hidden in OTP mode) */}
            {!isOtpMode && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none transition-colors`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            )}
            
            {/* Name field (only for registration and not in OTP mode) */}
            {!isLoginMode && !isOtpMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none transition-colors`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}
            
            {/* Password field (not in OTP mode) */}
            {!isOtpMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none transition-colors`}
                    placeholder={isLoginMode ? 'Your password' : 'Create a password'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            )}
            
            {/* OTP field (only in OTP mode) */}
            {isOtpMode && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.otp ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-terracotta-300 focus:border-terracotta-400 outline-none transition-colors text-center text-xl tracking-widest`}
                  placeholder="123456"
                />
                {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
                
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResendingOtp}
                    className="text-sm text-terracotta-600 hover:text-terracotta-800 font-medium disabled:opacity-50"
                  >
                    {isResendingOtp ? 'Sending...' : 'Resend verification code'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Forgot password link (only for login) */}
            {isLoginMode && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-terracotta-600 hover:text-terracotta-800 font-medium"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {isLoginMode 
                ? 'Sign In' 
                : isOtpMode 
                  ? 'Verify & Complete Registration' 
                  : 'Continue to Verification'}
            </button>
            
            {/* Toggle mode (not in OTP mode) */}
            {!isOtpMode && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-1 text-terracotta-600 hover:text-terracotta-800 font-medium"
                  >
                    {isLoginMode ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

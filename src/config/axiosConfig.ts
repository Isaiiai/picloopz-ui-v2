import axios from 'axios';

type TokenGetter = () => string | null;
type LogoutAction = () => void;

let getToken: TokenGetter;
let onLogout: LogoutAction;

export const configureApi = (tokenGetter: TokenGetter, logoutHandler: LogoutAction) => {
  getToken = tokenGetter;
  onLogout = logoutHandler;
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Make sure this matches your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken?.();
  
  // Skip auth header for public endpoints like registration and OTP verification
  const isPublicEndpoint = 
    config.url?.includes('/auth/register') || 
    config.url?.includes('/auth/login') || 
    config.url?.includes('/auth/verify-otp') || 
    config.url?.includes('/auth/resend-otp') ||
    config.url?.includes('/auth/forgot-password') ||
    config.url?.includes('/auth/reset-password') ||
    config.headers?.['X-Public-Request'];

  // Only add Authorization header if token exists and endpoint requires auth
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on auth errors for protected routes
    if (error.response?.status === 401 && 
        !error.config.url?.includes('/auth/login') &&
        !error.config.url?.includes('/auth/register') &&
        !error.config.url?.includes('/auth/verify-otp') &&
        !error.config.url?.includes('/auth/resend-otp')) {
      onLogout?.();
    }
    return Promise.reject(error);
  }
);

export default api;

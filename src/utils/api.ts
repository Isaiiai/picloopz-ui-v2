import axios, { AxiosInstance } from 'axios';
import { encrypt, decrypt } from './encryption';

interface GatewayApi extends AxiosInstance {
  gateway: (route: string, payload?: any, config?: any) => Promise<any>;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update as needed
  withCredentials: true,
}) as GatewayApi;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gateway helper for encrypted API masking
api.gateway = async function(route, payload = {}, config = {}) {
  // Encrypt the route and payload
  const encrypted = await encrypt({ route, payload });
  // Send to /gateway endpoint as { data: <encrypted> }
  const response = await api.post('/gateway', { data: encrypted }, config);
  // Decrypt the response
  if (response.data && response.data.data) {
    return await decrypt(response.data.data);
  }
  throw new Error('Invalid encrypted response from server');
};

export default api;

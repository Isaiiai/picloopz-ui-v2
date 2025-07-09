import axios from 'axios';
import { encrypt, decrypt } from '../utils/encryption';

type TokenGetter = () => string | null;
type LogoutAction = () => void;

let getToken: TokenGetter;
let onLogout: LogoutAction;

export const configureApi = (tokenGetter: TokenGetter, logoutHandler: LogoutAction) => {
  getToken = tokenGetter;
  onLogout = logoutHandler;
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Encrypt & reroute requests to /gateway (except upload & public)
api.interceptors.request.use(async (config) => {
  const token = getToken?.();

  const isUploadRequest = config.url?.startsWith('/upload');
  const isPublic = config.headers?.['X-Public-Request'] || isUploadRequest;

  if (config.data && !isPublic) {
    const { route, payload } = config.data;

    if (!route || payload === undefined) {
      throw new Error('[Gateway Error] Payload must include both `route` and `payload`');
    }

    try {
      config.url = '/gateway';
      config.data = {
        data: await encrypt({ route, payload })
      };
    } catch (err) {
      console.error('[Encryption Error]', err);
      throw err;
    }
  }

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Decrypt encrypted response payloads (if applicable)
api.interceptors.response.use(
  async (response) => {
    const isEncrypted = response.data?.data && typeof response.data.data === 'string';

    if (isEncrypted) {
      try {
        // Await the result of decryption
        const decrypted = await decrypt(response.data.data);
        response.data = decrypted;
      } catch (e) {
        console.error('[Decryption Error]', e);
        return Promise.reject({
          message: 'Decryption failed',
          original: e,
          code: 'DECRYPTION_ERROR'
        });
      }
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) onLogout?.();
    return Promise.reject(error);
  }
);

export default api;

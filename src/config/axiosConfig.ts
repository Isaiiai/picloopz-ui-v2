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
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = getToken?.();
  const isPublic = config.headers?.['X-Public-Request'];

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onLogout?.();
    }
    return Promise.reject(error);
  }
);

export default api;

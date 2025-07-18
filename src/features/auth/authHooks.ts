import {
  registerUser,
  loginUser,
  verifyToken,
  clearAuthState,
} from './authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';

import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
} from './authSelectors';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);


  return {
    user,
    isAuthenticated,
    status,
    error,
    register: (name: string, email: string, password: string, phone?: string) =>
      dispatch(registerUser({ name, email, password, phone })),
    login: (email: string, password: string) =>
      dispatch(loginUser({ email, password })),
    logout: () => dispatch(clearAuthState()),
    verify: () => dispatch(verifyToken()),
  };
};

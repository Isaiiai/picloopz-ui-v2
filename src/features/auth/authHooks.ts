import {
  registerUser,
  loginUser,
  verifyToken,
  clearAuthState,
  changePassword,
  verifyOTP,
  updateUser
} from './authSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useEffect } from 'react';

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
  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    if (profile && profile.profileImage && user && profile.profileImage !== user.avatar) {
      dispatch(updateUser({ avatar: profile.profileImage }));
    }
  }, [profile?.profileImage]);

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
    changeUserPassword: (credentials: { currentPassword: string; newPassword: string }) => 
      dispatch(changePassword(credentials)),
    verifyUserOTP: (email: string, otp: string, name: string, password: string, phone: string) =>
      dispatch(verifyOTP({ email, otp, name, password, phone })),
  };
};

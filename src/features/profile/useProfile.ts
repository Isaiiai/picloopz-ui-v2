import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { getuserProfile, updateProfile } from './profileThunks';
import { UpdateProfile } from './profileTypes';
import { useCallback } from 'react';
import { clearProfile } from './profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);

  const fetchProfile = useCallback((userId: string) => {
    return dispatch(getuserProfile(userId));
  }, [dispatch]);

  const updateUserProfile = useCallback((data: UpdateProfile) => {
    return dispatch(updateProfile(data)).unwrap();
  }, [dispatch]);

  const clearUserProfile = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateUserProfile,
    clearUserProfile,
  };
};

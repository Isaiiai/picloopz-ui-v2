import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { getuserProfile, updateProfile } from './profileThunks';
import { UpdateProfile } from './profileTypes';
import { useCallback } from 'react';
import { clearProfile } from './profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);

  const fetchProfile = useCallback((userId: string) => {
    dispatch(getuserProfile(userId));
  }, [dispatch]);

  const updateUserProfile = useCallback((data: UpdateProfile) => {
    dispatch(updateProfile(data));
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

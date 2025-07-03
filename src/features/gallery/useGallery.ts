import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppDispatch, RootState } from '../../store/store'
import { fetchReels } from './galleryThunks';

export const useGallery = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reels, loading, error, pagination } = useSelector(
    (state: RootState) => state.gallery
  );

  const loadReels = useCallback(
    (params: { page?: number; limit?: number; sort?: string; sortOrder?: 'asc' | 'desc' }) => {
      dispatch(fetchReels(params));
    },
    [dispatch]
  );

  return {
    reels,
    loading,
    error,
    pagination,
    loadReels,
  };
};
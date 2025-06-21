import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { fetchActiveBanners, clearBanners } from './bannerSlice';

export const useBanner = (params?: { type?: string; categoryId?: string }) => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state: RootState) => state.banner);

  useEffect(() => {
    dispatch(fetchActiveBanners(params) as any);

    return () => {
      dispatch(clearBanners());
    };
  }, [dispatch, params?.type, params?.categoryId]);

  return { banners, loading, error };
};

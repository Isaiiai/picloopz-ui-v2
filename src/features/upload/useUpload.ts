import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  uploadSingleImage,
  uploadMultipleImages,
} from './uploadThunks';
import {
  clearUploadState
} from './uploadSlice';
import { RootState, AppDispatch } from '../../store/store';

export const useUpload = () => {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.upload.loading);
  const error = useSelector((state: RootState) => state.upload.error);
  const singleUpload = useSelector((state: RootState) => state.upload.singleUpload);
  const cartImagesUpload = useSelector((state: RootState) => state.upload.cartImages);
  const reviewImageUpload = useSelector((state: RootState) => state.upload.reviewImages);

  const uploadSingle = useCallback((formData) => {
    dispatch(uploadSingleImage(formData));
  }, [dispatch]);

  const uploadMultiple = useCallback((formData) => {
    dispatch(uploadMultipleImages(formData));
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearUploadState());
  }, [dispatch]);

  return {
    loading,
    error,
    singleUpload,
    cartImagesUpload,
    reviewImageUpload,
    uploadSingle,
    uploadMultiple,
    clear,
  };
};

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchFavoriteCount
} from '../favorite/favoriteThunk';

export const useFavorite = () => {
  const dispatch: AppDispatch = useDispatch();
  const { favorites, count, loading, error } = useSelector(
    (state: RootState) => state.favorite
  );

  const addToFavorites = (productId: string) => {
    dispatch(addFavorite(productId));
  };

  const removeFromFavorites = (productId: string) => {
    dispatch(removeFavorite(productId));
  };

  const loadFavorites = () => {
    dispatch(fetchFavorites());
  };

  const loadFavoritesCount = () => {
    dispatch(fetchFavoriteCount());
  };

  const isInFavorites = (productId: string) => {
    return favorites.some((fav) => fav.productId === productId);
  };

  return {
    favorites,
    count,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    loadFavorites,
    loadFavoritesCount
  };
};

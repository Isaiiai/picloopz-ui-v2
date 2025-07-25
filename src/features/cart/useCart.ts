import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  fetchCart,
  addToCart,
  removeCartItem,
  emptyCart,
  getCartSummary,
} from './cartThunks';
import { useAppDispatch } from '../../utils/hooks';
import { AddToCartPayload } from './cartTypes';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  return {
    cart,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: (payload: AddToCartPayload) => dispatch(addToCart(payload)),
    removeCartItem: (itemId: string) => dispatch(removeCartItem(itemId)),
    emptyCart: () => dispatch(emptyCart()),
    getCartSummary: () => dispatch(getCartSummary()),
  };
};
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  emptyCart,
  getCartSummary,
} from './cartThunks';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  return {
    cart,
    fetchCart: () => dispatch(fetchCart()),
    addToCart: (payload: AddToCartPayload) => dispatch(addToCart(payload)),
    updateCartItem: (payload: UpdateCartItemPayload) => dispatch(updateCartItem(payload)),
    removeCartItem: (itemId: string) => dispatch(removeCartItem(itemId)),
    emptyCart: () => dispatch(emptyCart()),
    getCartSummary: () => dispatch(getCartSummary()),
  };
};
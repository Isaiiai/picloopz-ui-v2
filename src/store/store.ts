import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { clearAuthState } from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import categoryReducer from '../features/category/categorySlice';
import productReducer from '../features/product/productSlice';
import favoriteReducer from '../features/favorite/favoriteSlice';
import orderReducer from '../features/order/orderSlice';
import uploadReducer from '../features/upload/uploadSlice';
import reviewReducer from '../features/review/reviewSlice';
import bannerReducer from '../features/banner/bannerSlice';
import profileReducer from '../features/profile/profileSlice';
import { configureApi } from '../config/axiosConfig';
import { ThunkAction, Action } from '@reduxjs/toolkit';


const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  category: categoryReducer,
  favorite: favoriteReducer,
  order: orderReducer,
  upload: uploadReducer,
  reviews: reviewReducer,
  banner: bannerReducer,
  profile: profileReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      serializableCheck: false,
      thunk: true 
    }),
});

configureApi(
  () => store.getState().auth.token,
  () => store.dispatch(clearAuthState())
);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useEffect, useRef } from 'react';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import { verifyToken } from './features/auth/authSlice';
import './index.css';
import { selectAuthStatus } from './features/auth/authSelectors';
import { useAppSelector, useAppDispatch } from './utils/hooks';
import { useCart } from './features/cart/useCart';
import { useFavorite } from './features/favorite/useFavorite';
import { useOrders } from './features/order/useOrder';
import { useAuth } from './features/auth/authHooks';

export function App() {
  const dispatch = useAppDispatch();
  const hasVerified = useRef(false);
  const status = useAppSelector(selectAuthStatus)
  const { fetchCart } = useCart();
  const { loadFavorites } = useFavorite();
  const { getOrders } = useOrders();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
  if (isAuthenticated) {
    fetchCart();
    loadFavorites();
    getOrders();
  } else {
    fetchCart();
    loadFavorites();
    getOrders();
  }
}, [isAuthenticated]);
  
  useEffect(() => {
    if (!hasVerified.current && status === 'idle') {
      hasVerified.current = true;
      dispatch(verifyToken());
    }
  }, [ status, dispatch]);


  return (
    <Router>
      <div className="min-h-screen font-poppins text-gray-800">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="account/orders/:orderId" element={<OrderTrackingPage />} />
            <Route path="account" element={<ProfilePage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

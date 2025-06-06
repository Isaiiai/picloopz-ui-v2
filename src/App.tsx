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
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { useDispatch } from 'react-redux';
import { verifyToken } from './features/auth/authSlice';
import './index.css';
import { selectAuthStatus } from './features/auth/authSelectors';
import { useAppSelector } from './utils/hooks';

export function App() {

  const dispatch = useDispatch();
  const hasVerified = useRef(false);
  const status = useAppSelector(selectAuthStatus)
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);
  
  

  useEffect(() => {
    if (!hasVerified.current && status === 'idle') {
      hasVerified.current = true;
      dispatch(verifyToken());
    }
  }, [ status, dispatch]);


  return (
    <Router>
      
      <AuthProvider>
        
        <CartProvider>
          <FavoritesProvider>
            <OrderProvider>
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
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </div>
            </OrderProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>

    </Router>
  );
}

export default App;

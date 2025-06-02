import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  return (
    <header className={`sticky top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-playfair font-bold text-terracotta-700 tracking-wide">Picloopz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-terracotta-600 transition-colors">Home</Link>
            <Link to="/category/all" className="font-medium hover:text-terracotta-600 transition-colors">Shop</Link>
            <Link to="/gallery" className="font-medium hover:text-terracotta-600 transition-colors">Gallery</Link>
            <Link to="/how-it-works" className="font-medium hover:text-terracotta-600 transition-colors">How It Works</Link>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <button aria-label="Search" className="p-1 hover:text-terracotta-600 transition-colors">
              <Search size={20} />
            </button>
            <Link to="/favorites" className="p-1 hover:text-terracotta-500 transition-colors relative">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-1 hover:text-terracotta-500 transition-colors relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/account" className="p-1 hover:text-terracotta-600 transition-colors relative group">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-full object-cover border border-terracotta-300"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-terracotta-100 flex items-center justify-center border border-terracotta-300">
                    <User size={16} className="text-terracotta-600" />
                  </div>
                )}
                <span className="absolute top-full right-0 w-max bg-white shadow-md rounded-md py-1 px-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                  My Account
                </span>
              </Link>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="p-1 hover:text-terracotta-600 transition-colors relative group"
              >
                <User size={20} />
                <span className="absolute top-full right-0 w-max bg-white shadow-md rounded-md py-1 px-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                  Sign In
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/favorites" className="p-1 relative">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-1 relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button 
              onClick={toggleMenu} 
              className="p-1"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-2xl font-bold text-purple-700 font-playfair">Picloopz</Link>
            <button onClick={closeMenu} className="p-1">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 text-lg">
            <Link to="/" className="py-2 border-b border-gray-100">Home</Link>
            <Link to="/category/all" className="py-2 border-b border-gray-100">Shop</Link>
            <Link to="/gallery" className="py-2 border-b border-gray-100">Gallery</Link>
            <Link to="/how-it-works" className="py-2 border-b border-gray-100">How It Works</Link>
            {isAuthenticated ? (
              <Link to="/account" className="py-2 border-b border-gray-100">My Account</Link>
            ) : (
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="py-2 border-b border-gray-100 text-left w-full"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;

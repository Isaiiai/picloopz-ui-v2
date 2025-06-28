import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, ShoppingCart, User, X } from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useFavorite } from '../features/favorite/useFavorite';
import { useAuth } from '../features/auth/authHooks';
import LoginModal from './LoginModal';
import ProductSearch from './ProductSearch';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { cart } = useCart();
  const { favorites } = useFavorite();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSearch = (query: string) => {
    navigate(`/category/all?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className={`sticky top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-playfair font-bold text-terracotta-700 tracking-wide">Picloopz</span>
          </Link>

          <div className='flex items-center gap-8'>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-brand-black font-medium">
              <Link to="/" className="hover:text-brand-cyan transition-colors">Home</Link>
              <Link to="/category/all" className="hover:text-brand-cyan transition-colors">Shop</Link>
              <Link to="/gallery" className="hover:text-brand-cyan transition-colors">Gallery</Link>
              <Link to="/about" className="hover:text-brand-cyan transition-colors">About</Link>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <ProductSearch onSearch={handleSearch} initialValue="" placeholder="Search products..." />
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-5 text-brand-black">
            <Link to="/favorites" className="p-1 relative hover:text-brand-pink">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-1 relative hover:text-brand-pink">
              <ShoppingCart size={20} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/account" className="relative group">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-brand-cyan" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-brand-pink/20 flex items-center justify-center border border-brand-cyan">
                    <User size={16} className="text-brand-cyan" />
                  </div>
                )}
                <span className="absolute top-full right-0 w-max bg-white shadow-md rounded-md py-1 px-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                  My Account
                </span>
              </Link>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="p-1 relative group hover:text-brand-cyan">
                <User size={20} />
                <span className="absolute top-full right-0 w-max bg-white shadow-md rounded-md py-1 px-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                  Sign In
                </span>
              </button>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/favorites" className="p-1 relative">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-1 relative">
              <ShoppingCart size={20} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="p-1">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <ProductSearch onSearch={handleSearch} initialValue="" placeholder="Search products..." isMobile />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-2xl font-bold text-brand-black font-playfair">Picloopz</Link>
            <button onClick={closeMenu} className="p-1">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 text-lg text-brand-black">
            <Link to="/">Home</Link>
            <Link to="/category/all">Shop</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            {isAuthenticated ? (
              <Link to="/account">My Account</Link>
            ) : (
              <button onClick={() => { setIsMenuOpen(false); setIsLoginModalOpen(true); }} className="text-left w-full">
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
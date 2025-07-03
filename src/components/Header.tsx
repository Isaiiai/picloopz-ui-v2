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
    <>
      {/* Fixed Header Navigation */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'} border-b border-gray-200`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dr6n03ecb/image/upload/v1751004201/pic_loopz_logo_copy_ic1bro.jpg"
                alt="Picloopz Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <span className="text-2xl font-playfair font-bold text-terracotta-700 tracking-wide">Picloopz</span>
            </Link>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/favorites" className="p-1 relative">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-sm w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-1 relative">
                <ShoppingCart size={20} />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-sm w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cart.itemCount}
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
      </header>

      {/* Desktop Header */}
      <header className={`hidden md:block fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dr6n03ecb/image/upload/v1751004201/pic_loopz_logo_copy_ic1bro.jpg"
                alt="Picloopz Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              <span className="text-2xl font-playfair font-bold text-terracotta-700 tracking-wide">Picloopz</span>
            </Link>

            <div className='flex items-center gap-8'>
              {/* Desktop Navigation */}
              <nav className="flex space-x-8">
                <Link to="/" className="font-medium hover:text-terracotta-600 transition-colors">Home</Link>
                <Link to="/category/all" className="font-medium hover:text-terracotta-600 transition-colors">Shop</Link>
                <Link to="/gallery" className="font-medium hover:text-terracotta-600 transition-colors">Gallery</Link>
                <Link to="/about" className="font-medium hover:text-terracotta-600 transition-colors">About</Link>
              </nav>

              {/* Desktop Search */}
              <div>
                <ProductSearch 
                  onSearch={handleSearch} 
                  placeholder="Search products..."
                />
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="flex items-center space-x-5">
              <Link to="/favorites" className="p-1 hover:text-brand-pink relative">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-red text-white text-sm w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-1 hover:text-brand-pink relative">
                <ShoppingCart size={20} />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-red text-white text-sm w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <Link to="/account" className="p-1 hover:text-terracotta-600 relative group">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-7 h-7 rounded-full object-cover border border-terracotta-600"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-pink/20 flex items-center justify-center border border-terracotta-600">
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
                  className="p-1 hover:text-brand-cyan relative group"
                >
                  <User size={20} />
                  <span className="absolute top-full right-0 w-max bg-white shadow-md rounded-md py-1 px-2 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-1">
                    Sign In
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      {!['/gallery', '/about', '/contact', '/faq', '/account', '/profile', '/favorites', '/cart'].some(path => location.pathname.includes(path)) && (
        <div className="md:hidden fixed top-[65px] left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3">
            <ProductSearch 
              onSearch={handleSearch} 
              placeholder="Search products..."
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-terracotta-700 font-playfair">
              <img
                src="https://res.cloudinary.com/dr6n03ecb/image/upload/v1751004201/pic_loopz_logo_copy_ic1bro.jpg"
                alt="Picloopz Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              Picloopz
            </Link>
            <button onClick={closeMenu} className="p-1">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 text-lg">
            <Link to="/" className="hover:text-terracotta-600 transition-colors">Home</Link>
            <Link to="/category/all" className="hover:text-terracotta-600 transition-colors">Shop</Link>
            <Link to="/gallery" className="hover:text-terracotta-600 transition-colors">Gallery</Link>
            <Link to="/how-it-works" className="hover:text-terracotta-600 transition-colors">How It Works</Link>
            <Link to="/about" className="hover:text-terracotta-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-terracotta-600 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-terracotta-600 transition-colors">FAQ</Link>
            {isAuthenticated ? (
              <Link to="/account">My Account</Link>
            ) : (
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-left w-full"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;

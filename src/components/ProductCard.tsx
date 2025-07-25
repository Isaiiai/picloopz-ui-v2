import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';
import { useAuth } from '../features/auth/authHooks';
import toast from 'react-hot-toast';
import { Product } from '../features/product/productTypes';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorite();
  const { isAuthenticated } = useAuth();
  const variant = product.variants[0];
  const isAvailable = product.variants.some(v => v.inStock);
  const outOfStock = !isAvailable;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      if (toast) {
        toast('Please log in to add favorites', { icon: '🔒' });
      } else {
        alert('Please log in to add favorites');
      }
      return;
    }
    if (isInFavorites(String(product.id))) {
      removeFromFavorites(String(product.id));
    } else {
      addToFavorites(String(product.id));
    }
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <div
      className={`w-full group relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 ${
        outOfStock ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${String(product.id)}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src={variant.imageUrl}
            alt={product.name}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
              isHovered && !outOfStock ? 'scale-105' : ''
            }`}
          />
          {outOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
              Out of Stock
            </div>
          )}
          {isHovered && (
            <button
              onClick={toggleFavorite}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 z-10 ${
                isInFavorites(String(product.id))
                  ? 'bg-red-100 text-red-600'
                  : 'bg-white text-gray-400 hover:text-red-600 hover:bg-red-100'
              }`}
              aria-label={
                isInFavorites(String(product.id))
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Heart
                size={20}
                className={isInFavorites(String(product.id)) ? 'fill-current' : ''}
              />
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 p-2 pb-0 min-h-[110px]">
          <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-600 text-sm mb-1 truncate">{product.description}</p>
          )}
          <div className="flex-1" />
        </div>

        <div className="w-full px-3 py-2 bg-white border-t border-gray-100 flex items-center justify-between gap-2 min-h-[44px]">
          <span className="text-terracotta-600 font-bold text-base md:text-lg">
            {formatPrice(variant.price)}
          </span>
          <span className="flex items-center gap-1 text-xs text-yellow-500 font-medium">
            <Star size={14} className="inline-block" />
            {product.rating.toFixed(1)}
            <span className="text-gray-400 ml-1">({product.reviewCount})</span>
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

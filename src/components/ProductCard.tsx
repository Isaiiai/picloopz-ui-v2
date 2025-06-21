import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';

interface Product {
  id: number;
  name: string;
  basePrice: number;
  description: string;
  variants: Array<{
    additionalPrice: number;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorite();
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };
  
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100 mb-3">
          <img 
            src={product.variants[0]?.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Quick action buttons */}
          <div 
            className={`absolute top-3 right-3 z-10 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={toggleFavorite}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isInFavorites(product.id) 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-white text-gray-600 hover:text-terracotta-500'
              } shadow-sm transition-colors`}
              aria-label={isInFavorites(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={16} 
                className={isInFavorites(product.id) ? 'fill-current' : ''} 
              />
            </button>
          </div>
          
          {/* View button on hover */}
          <div 
            className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors">
              View Product
            </span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 group-hover:text-terracotta-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-1 flex justify-between items-center">
          <span className="text-terracotta-600 font-medium">
            {formatPrice(product.basePrice + product.variants[0].additionalPrice)}
          </span>
          
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

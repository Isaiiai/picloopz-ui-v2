import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';

export interface Product {
  id: string | number;
  name: string;
  basePrice: number;
  description: string;
  variants: Array<{
    additionalPrice: number;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  category?: string;
  categoryId?: string;
  rating: number;
  reviewCount: number;
  orderCount?: number;
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
    
    if (isInFavorites(String(product.id))) {
      removeFromFavorites(String(product.id));
    } else {
      addToFavorites(String(product.id));
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
        <div className="relative overflow-hidden rounded-lg aspect-[4/3] md:aspect-[5/4] lg:aspect-[6/5] xl:aspect-[7/6] bg-gray-100 mb-2">
          <img 
            src={product.variants[0]?.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Quick action buttons */}
          <div 
            className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={toggleFavorite}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                isInFavorites(String(product.id)) 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-white text-gray-600 hover:text-terracotta-500'
              } shadow-sm transition-colors`}
              aria-label={isInFavorites(String(product.id)) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={14} 
                className={`${isInFavorites(String(product.id)) ? 'fill-current' : ''} md:w-4 md:h-4`} 
              />
            </button>
          </div>
          
          {/* View button on hover */}
          <div 
            className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-white transition-colors">
              View Product
            </span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 group-hover:text-terracotta-600 transition-colors text-sm md:text-base line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs md:text-sm text-gray-500">
            <div className="flex items-center">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span>{product.reviewCount} reviews</span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className={ (product.orderCount || 0) > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                {product.orderCount || 0} sold
            </span>
        </div>

        <div className="mt-1">
            <span className="text-terracotta-600 font-bold text-base md:text-lg">
                {formatPrice(product.variants[0].price)}
            </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

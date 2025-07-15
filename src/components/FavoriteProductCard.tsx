import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';
import { Product } from '../features/product/productTypes';

interface FavoriteProductCardProps {
  product: Product;
}

const FavoriteProductCard = ({ product }: FavoriteProductCardProps) => {
  const { removeFromFavorites } = useFavorite();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromFavorites(String(product.id));
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const isAvailable = product.variants.some(v => v.inStock);
  const outOfStock = !isAvailable;

  // Use variant image, then fallback to product.images[0], then fallback to a placeholder
  const imageUrl = product.variants[0]?.imageUrl || (product as any).images?.[0] || '/placeholder.png';

  return (
    <div className={`flex bg-white p-3 rounded-lg shadow-sm transition-shadow hover:shadow-md w-full relative ${outOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
          {outOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
              Out of Stock
            </div>
          )}
        </Link>
      </div>
      <div className="ml-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-terracotta-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
              <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span>{product.reviewCount} reviews</span>
          </div>
           <div className="mt-1 text-xs text-gray-500">
                <span className={ (product.orderCount || 0) > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {product.orderCount || 0} sold
                </span>
            </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-terracotta-600 font-bold text-lg">
            {formatPrice(product.variants[0].price)}
          </span>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full -mr-2"
            aria-label="Remove from favorites"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProductCard; 
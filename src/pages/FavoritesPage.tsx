import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';
import ProductCard from '../components/ProductCard';
import FavoriteProductCard from '../components/FavoriteProductCard';

const FavoritesPage = () => {
  const { favorites, clearAll } = useFavorite();

  // Map favorite product to ProductCard's expected props
  const mapFavoriteToProduct = (fav: any) => ({
    id: fav.productId,
    name: fav.productName,
    basePrice: fav.productPrice,
    description: fav.description || '',
    variants: fav.variants || [
      {
        additionalPrice: 0,
        name: '',
        price: fav.productPrice,
        imageUrl: fav.productImage,
      },
    ],
    category: fav.category || '',
    categoryId: fav.categoryId || '',
    rating: fav.rating || 0,
    reviewCount: fav.reviewCount || 0,
    orderCount: fav.orderCount || 0,
  });

  return (
    <div className="bg-cream-50 min-h-screen pt-36 md:pt-32">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair mb-6 text-gray-900 text-center sm:text-left">
          My Favorites
        </h1>
        {favorites.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <p className="text-gray-600 text-base sm:text-lg font-medium">{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</p>
              <button 
                onClick={clearAll}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full flex items-center gap-2 shadow transition-colors font-semibold"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              {/* Mobile: List View (for screens smaller than sm) */}
              <div className="space-y-4 sm:hidden">
                {favorites.map(fav => (
                  <FavoriteProductCard key={`${fav.productId}-mobile`} product={mapFavoriteToProduct(fav)} />
                ))}
              </div>

              {/* Desktop: Grid View (for sm screens and up) */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {favorites.map(fav => (
                  <ProductCard key={fav.productId} product={mapFavoriteToProduct(fav)} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-pink-300 drop-shadow"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair mb-1 text-gray-800 tracking-tight">No Favorites Yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-xs text-base sm:text-lg">Save your favorite products for quick access and inspiration. Start exploring now!</p>
            <Link
              to="/category/all"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold shadow"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

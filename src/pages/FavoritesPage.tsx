import { Link } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';
import FavoriteProductCard from '../components/FavoriteProductCard';
import ProductCard from '../components/ProductCard';
import PageSpinner from '../components/PageSpinner';
import { Product } from '../features/product/productTypes';

const FavoritesPage = () => {
  const { favorites, clearAll, loading } = useFavorite();

  // Map favorite product to ProductCard's expected props
  const mapFavoriteToProduct = (fav: any): Product => ({
    id: fav.productId,
    name: fav.productName,
    description: fav.description || '',
    basePrice: fav.productPrice || 0,
    variants: fav.variants && fav.variants.length > 0 ? fav.variants : [
      {
        id: '',
        name: '',
        price: fav.productPrice || 0,
        imageUrl: fav.productImage || '',
        attributeType: '',
        isActive: true,
        inStock: true,
      },
    ],
    categoryId: fav.categoryId || '',
    categoryName: fav.categoryName || '',
    images: fav.productImage ? [fav.productImage] : [],
    tags: fav.tags || [],
    isTrending: fav.isTrending || false,
    isTopSelling: fav.isTopSelling || false,
    isFeatured: fav.isFeatured || false,
    isActive: fav.isActive !== undefined ? fav.isActive : true,
    maxUserImages: fav.maxUserImages || 1,
    viewCount: fav.viewCount || 0,
    orderCount: fav.orderCount || 0,
    rating: fav.rating || 0,
    reviewCount: fav.reviewCount || 0,
    videos: fav.videos || [],
    createdAt: fav.createdAt || '',
    updatedAt: fav.updatedAt || '',
  });

  if (loading) {
    return <PageSpinner icon={<Heart size={40} />} />;
  }

  return (
    <div className="relative min-h-screen pt-14 sm:pt-28 pb-8 bg-gradient-to-br from-amber-50 via-cream-100 to-terracotta-50 overflow-x-hidden">
      {/* Animated 3D shapes/accent background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-terracotta-100 opacity-40 blur-2xl animate-pulse-slow" />
        <div className="absolute right-[8%] top-[20%] w-16 h-16 rounded-full bg-gradient-to-tr from-terracotta-200 to-amber-100 opacity-30 blur-xl animate-floatY" />
        <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-amber-100 via-cream-100 to-terracotta-100 opacity-30 blur-2xl rounded-full animate-floatX" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-playfair mb-6 text-gray-900 text-center sm:text-left">
          My Favorites
        </h1>
        {favorites.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
              </p>
              <button
                onClick={clearAll}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full flex items-center gap-2 shadow transition-colors font-semibold"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
              {/* Mobile: List View */}
              <div className="sm:hidden space-y-4">
                {favorites.map(fav => (
                  <FavoriteProductCard
                    key={`${fav.productId}-mobile`}
                    product={mapFavoriteToProduct(fav)}
                  />
                ))}
              </div>

              {/* Desktop: Grid View */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {favorites.map(fav => (
                  <ProductCard
                    key={fav.productId}
                    product={mapFavoriteToProduct(fav)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div className="w-28 h-28 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <svg
                width="56"
                height="56"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-pink-300 drop-shadow"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair mb-1 text-gray-800 tracking-tight">
              No Favorites Yet
            </h3>
            <p className="text-gray-500 mb-4 text-center max-w-xs text-base sm:text-lg">
              Save your favorite products for quick access and inspiration.
              Start exploring now!
            </p>
            <Link
              to="/category/all"
              className="inline-block px-8 py-3 bg-terracotta-500 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold shadow"
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

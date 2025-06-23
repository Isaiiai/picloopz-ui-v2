import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ShoppingCartIcon, Trash2 } from 'lucide-react';
import { useFavorite } from '../features/favorite/useFavorite';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useFavorite();

  
  return (
    <div className="container mx-auto px-4 py-8 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6 font-playfair text-center sm:text-left">My Favorites</h1>
      
      {favorites.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <p className="text-gray-600">{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</p>
            <button 
              onClick={()=> {}}
              className="text-red-500 flex items-center hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {favorites.map(product => (
              <div key={product.productId} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="flex flex-col sm:flex-row h-auto sm:h-40 md:h-56">
                  <div className="w-full sm:w-1/3 bg-gray-100 flex-shrink-0">
                    <Link to={`/product/${product.productId}`}>
                      <img 
                        src={product.productImage} 
                        alt={product.productName} 
                        className="w-full h-40 sm:h-full object-cover"
                      />
                    </Link>
                  </div>
                  
                  <div className="w-full sm:w-2/3 p-4 flex flex-col">
                    <Link to={`/product/${product.productId}`} className="hover:text-purple-600 transition-colors">
                      <h3 className="font-medium mb-1 text-base sm:text-lg">{product.productName}</h3>
                    </Link>
                    <p className="text-purple-600 font-medium text-sm sm:text-base">₹{product.productPrice.toFixed(2)}</p>
                    
                    <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row gap-2">
                      <Link 
                        to={`/product/${product.productId}`}
                        className="w-full sm:w-auto px-3 py-2 bg-purple-600 text-white text-sm rounded flex items-center justify-center hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </Link>
                      
                      <button 
                        onClick={() => removeFromFavorites(product.productId)}
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Remove from favorites"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your favorites list is empty</h3>
          <p className="text-gray-600 mb-6">Save items you love to your favorites list</p>
          <Link 
            to="/category/all" 
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

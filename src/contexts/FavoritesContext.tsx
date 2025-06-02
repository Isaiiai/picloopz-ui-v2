import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  variants: Array<{
    name: string;
    price: number;
    imageUrl: string;
  }>;
  category: string;
  categoryId: string;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isInFavorites: (productId: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('picloopz-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
      }
    }
  }, []);
  
  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('picloopz-favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Add product to favorites
  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      // Check if product already exists in favorites
      if (prev.some(item => item.id === product.id)) {
        return prev;
      } else {
        // Add new product to favorites
        return [...prev, product];
      }
    });
  };
  
  // Remove product from favorites
  const removeFromFavorites = (productId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };
  
  // Check if product is in favorites
  const isInFavorites = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };
  
  // Clear favorites
  const clearFavorites = () => {
    setFavorites([]);
  };
  
  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isInFavorites,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

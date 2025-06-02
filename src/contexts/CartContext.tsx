import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  selectedVariant: number;
  uploadedImage: string;
  variants: Array<{ 
    name: string;
    price: number;
    imageUrl: string; 
  }>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('picloopz-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('picloopz-cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Add product to cart
  const addToCart = (product: CartItem) => {
    setCartItems(prev => {
      // Check if product already exists in cart
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedVariant === product.selectedVariant
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prev, product];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  
  // Update product quantity in cart
  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Calculate cart items count
  const cartCount = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

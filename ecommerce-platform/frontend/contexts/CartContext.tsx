import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await cartAPI.add(productId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await cartAPI.remove(productId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      await cartAPI.update(productId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    cartTotal,
    cartItemsCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
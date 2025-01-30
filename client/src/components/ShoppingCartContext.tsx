import React, { createContext, useState } from 'react';
import { type Product } from '../Pages/ProductsPage';

//defining type for the cart context value
export type ShoppingCartValue = {
  cart: Product[];
  addToCart: (product: Product) => void;
};

//default value for CartContext
export const defaultShoppingCartValue: ShoppingCartValue = {
  cart: [],
  addToCart: () => undefined,
};

export const ShoppingCartContext = createContext(defaultShoppingCartValue);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

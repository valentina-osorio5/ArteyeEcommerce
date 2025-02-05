import React, { createContext, useState } from 'react';
import { type Product } from '../Pages/ProductsPage';

// interface Product {
//   productId: string;
//   productName: string;
//   price: number;
//   quantity: number;
// }

//defining type for the cart context value
export type ShoppingCartValue = {
  cart: Product[];
  addToCart: (product: Product) => void;
  decrementCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
};

//default value for CartContext
export const defaultShoppingCartValue: ShoppingCartValue = {
  cart: [],
  addToCart: () => undefined,
  decrementCart: () => undefined,
  removeFromCart: () => undefined,
};

export const ShoppingCartContext = createContext(defaultShoppingCartValue);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const decrementCart = (product: Product) => {
    setCart((prevCart) => {
      //should it be cartItem instead of item? do I need to define the type or interface above for cartItem or product?
      //quantity does not exist on product but it does exist on cartItem...
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.productId
      );

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        const currentQuantity = updatedCart[existingProductIndex].quantity;

        // Decrement the quantity if it's greater than 1, otherwise remove the product
        if (currentQuantity > 1) {
          updatedCart[existingProductIndex].quantity -= 1;
        } else {
          updatedCart.splice(existingProductIndex, 1); // Remove the product if quantity is 1
        }

        return updatedCart;
      }

      return prevCart; // If the product is not in the cart, return the cart unchanged
    });
  };

  const removeFromCart = (product: Product) => {};

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart, decrementCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

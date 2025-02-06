// import React, { createContext, useEffect, useState } from 'react';
// import { type Product } from '../Pages/ProductsPage';

// // Define the context type
// export type ShoppingCartValue = {
//   cart: Product[];
//   addToCart: (product: Product) => void;
//   decrementCart: (product: Product) => void;
//   removeFromCart: (product: Product) => void;
//   fetchCartFromDB: (userId: number) => Promise<void>;
// };

// // Default values for ShoppingCartContext
// export const defaultShoppingCartValue: ShoppingCartValue = {
//   cart: [],
//   addToCart: () => undefined,
//   decrementCart: () => undefined,
//   removeFromCart: () => undefined,
//   fetchCartFromDB: async () => {},
// };

// // Create the ShoppingCartContext
// export const ShoppingCartContext = createContext(defaultShoppingCartValue);

// export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [cart, setCart] = useState<Product[]>([]);
//   const [userId, setUserId] = useState<number | null>(null);

//   // Fetch cart from the database
//   const fetchCartFromDB = async (userId: number) => {
//     if (!userId) return;
//     try {
//       const res = await fetch(`/api/shop/user/${userId}`);
//       if (!res.ok) throw new Error(`Error fetching cart: ${res.status}`);
//       const data = await res.json();
//       setCart(data);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchCartFromDB(userId);
//     }
//   }, [userId]);

//   const addToCart = async (product: Product) => {
//     if (!userId) return;

//     try {
//       const res = await fetch('/api/shop/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.productId,
//           quantity: 1,
//           userId,
//         }),
//       });

//       if (!res.ok) throw new Error(`Error adding item: ${res.status}`);
//       await res.json();

//       // Refetch cart after updating database
//       fetchCartFromDB(userId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const decrementCart = async (product: Product) => {
//     if (!userId) return;

//     if (product.quantity <= 1) {
//       removeFromCart(product);
//       return;
//     }

//     try {
//       const res = await fetch('/api/shop/cart', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.productId,
//           quantity: product.quantity - 1,
//           userId,
//         }),
//       });

//       if (!res.ok) throw new Error(`Error decrementing item: ${res.status}`);
//       await res.json();

//       // Refetch cart after updating database
//       fetchCartFromDB(userId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ WORKING removeFromCart (syncs with database)
//   const removeFromCart = async (product: Product) => {
//     if (!userId) return;

//     try {
//       const res = await fetch('/api/shop/cart', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: product.productId,
//           userId,
//         }),
//       });

//       if (!res.ok) throw new Error(`Error removing item: ${res.status}`);
//       await res.json();

//       // Refetch cart after updating database
//       fetchCartFromDB(userId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <ShoppingCartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         decrementCart,
//         removeFromCart,
//         fetchCartFromDB,
//       }}>
//       {children}
//     </ShoppingCartContext.Provider>
//   );
// };

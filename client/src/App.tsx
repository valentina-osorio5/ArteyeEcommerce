// import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './Pages/ProductsPage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductDetails } from './Pages/ProductDetails';
import { Header } from './components/Header';
import { ShoppingCartProvider } from './components/ShoppingCartContext';
import { UserProvider } from './components/UserContext';
import { SignIn } from './Pages/Sign-In';
import { SignUpForm } from './Pages/Sign-Up';
import { CartPage } from './Pages/CartPage';

export default function App() {
  return (
    <>
      <UserProvider>
        <ShoppingCartProvider>
          <Header />

          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUpForm />} />
          </Routes>
        </ShoppingCartProvider>
      </UserProvider>
    </>
  );
}

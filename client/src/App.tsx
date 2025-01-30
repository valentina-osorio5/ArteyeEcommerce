// import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './Pages/ProductsPage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductDetails } from './Pages/ProductDetails';
import { Header } from './components/Header';
import { ShoppingCartProvider } from './components/ShoppingCartContext';

export default function App() {
  return (
    <>
      <ShoppingCartProvider>
        <Header />

        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          {/* <Route path="/cart/:cartId" element={<ShoppingCart />} /> */}
        </Routes>
      </ShoppingCartProvider>
    </>
  );
}

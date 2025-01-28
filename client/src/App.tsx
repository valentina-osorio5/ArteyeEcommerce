// import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './Pages/ProductsPage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductDetails } from './Pages/ProductDetails';
import { Header } from './components/Header';

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

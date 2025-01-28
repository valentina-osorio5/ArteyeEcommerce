// import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './Pages/ProductsPage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function App() {
  return (
    <div>
      <div>
        <Link
          className="background-color: #EAF585,
                  height: 2.5rem,
                  text-center
                  justify-center"
          to="/">
          ARTEYE
        </Link>
        <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
          {/* <FontAwesomeIcon icon=“fa-light fa-cart-shopping” /> */}
          <Link to="/cart">My Cart</Link>
          <Link to="/sign-in">Sign In</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<ProductsPage />} />
      </Routes>
    </div>
  );
}

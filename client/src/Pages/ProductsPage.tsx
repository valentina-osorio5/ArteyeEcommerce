import React, { useEffect, useState } from 'react';
import productsImage from '../assets/productsImage.png';
import { Link, useNavigate } from 'react-router-dom';
// import { ProductDetails } from './ProductDetails';
import { Header } from '../components/Header';

export type Product = {
  productId: number;
  productName: string;
  description: string;
  imageUrl: string;
  price: string;
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/shop');
        if (!res.ok) {
          console.error('Failed to fetch products');
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    console.log('product div clicked', product.productId);
    navigate(`/product/${product.productId}`); // Navigate to the product details page
  };

  return (
    <div>
      <div>
        <img
          className="rounded-md mx-3"
          style={{ width: '95%' }}
          src={productsImage}
        />
        <h2
          style={{ fontFamily: 'Nova Round' }}
          className="justify-self-center p-2.5 text-2xl">
          BEST SELLERS
        </h2>
      </div>
      <div
        className="justify-center"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div
            onClick={() => handleProductClick(product)}
            className="justify-self-center justify-center"
            key={product.productId}
            style={{ width: '200px' }}>
            <img
              src={product.imageUrl}
              alt={product.productName}
              style={{ width: '100%' }}
            />
            <h3
              className=" font-display ml-4 text-center "
              style={{ fontFamily: 'Nova Round' }}>
              {product.productName}
            </h3>
            <p
              style={{ fontFamily: 'Nova Round' }}
              className="font-semibold justify-self-center ">
              Price: ${product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

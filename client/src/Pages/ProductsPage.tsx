import React, { useEffect, useState } from 'react';
import product from '../assets/product.png';

type Product = {
  productId: number;
  productName: string;
  description: string;
  imageUrl: string;
  price: string;
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <div>
      <div>
        <img src={product} />
        <h2 className="justify-self-center p-2.5 text-lg">BEST SELLERS</h2>
      </div>
      <div
        // className="border-none, flex-wrap, gap-4"
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div
            className="justify-self-center justify-center"
            key={product.productId}
            style={{ width: '200px' }}>
            <img
              src={product.imageUrl}
              alt={product.productName}
              style={{ width: '100%' }}
            />
            <h3
              // style={{font-sans:'Nova Round'}}
              className=" font-display ml-4 text-center ">
              {product.productName}
            </h3>
            <p className="font-semibold justify-self-center ">
              Price: ${product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import productsImage from '../assets/productsImage.png';
import { Link, useNavigate } from 'react-router-dom';
// import { ProductDetails } from './ProductDetails';

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
        <img src={productsImage} />
        <h2 className="justify-self-center p-2.5 text-lg">BEST SELLERS</h2>
      </div>
      <div
        // className="border-none, flex-wrap, gap-4"
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

// type handleProductClickProps = {
//   product: Product;
// };

// function handleProductClick({ product }: handleProductClickProps) {
//   console.log('product div clicked', product.productId);
//   // return (
//   //   <div>
//   //     <Link to={`product/${product.productId}`}></Link>
//   //     <div>
//   //       <Link
//   //         className="background-color: #EAF585,
//   //                 height: 2.5rem,
//   //                 text-center
//   //                 justify-center"
//   //         to="/">
//   //         ARTEYE
//   //       </Link>
//   //       <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
//   //         {/* <FontAwesomeIcon icon=“fa-light fa-cart-shopping” /> */}
//   //         <Link to="/cart">My Cart</Link>
//   //         <Link to="/sign-in">Sign In</Link>
//   //       </nav>
//   //     </div>
//   //     <div key={product.productId} style={{ width: '200px' }}>
//   //       <img
//   //         src={product.imageUrl}
//   //         alt={product.productName}
//   //         style={{ width: '100%' }}
//   //       />
//   //       <h3
//   //         // style={{font-sans:'Nova Round'}}
//   //         className=" font-display ml-4 text-center ">
//   //         {product.productName}
//   //       </h3>
//   //       <p className="font-semibold justify-self-center ">
//   //         Price: ${product.price}
//   //       </p>
//   //     </div>
//   //   </div>
//   // );
// }

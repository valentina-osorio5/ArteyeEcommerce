import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Product } from './ProductsPage';
import { useParams } from 'react-router-dom';

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  console.log(product, productId);

  useEffect(() => {
    console.log('useEffect fired');
    async function fetchProduct() {
      console.log('fetch product fired');
      try {
        const res = await fetch(`/api/shop/${productId}`);
        console.log(res);
        if (!res.ok) {
          console.error('Failed to fetch product');
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }

    // if (productId) {
    fetchProduct();
    // }
  }, [productId]);

  // if (!product) console.error('Error fetching product details');

  return (
    <div>
      {product && (
        <div>
          <h2>{product.productName}</h2>
          <img
            src={product.imageUrl}
            alt={product.productName}
            style={{ width: '300px' }}
          />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <button
            // onClick={handleAddToCart}
            className="border border-gray-300 rounded py-1 px-3 mx-10">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}

// export function ProductDetails({ product }: Product) {
//   return (
//     <div>
//       <div>
//         <Link
//           className="background-color: #EAF585,
//                   height: 2.5rem,
//                   text-center
//                   justify-center"
//           to="/">
//           ARTEYE
//         </Link>
//         <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
//           {/* <FontAwesomeIcon icon=“fa-light fa-cart-shopping” /> */}
//           <Link to="/cart">My Cart</Link>
//           <Link to="/sign-in">Sign In</Link>
//         </nav>
//       </div>
//       <div key={product.productId} style={{ width: '200px' }}>
//         <img
//           src={product.imageUrl}
//           alt={product.productName}
//           style={{ width: '100%' }}
//         />
//         <h3
//           // style={{font-sans:'Nova Round'}}
//           className=" font-display ml-4 text-center ">
//           {product.productName}
//         </h3>
//         <p className="font-semibold justify-self-center ">
//           Price: ${product.price}
//         </p>
//       </div>
//     </div>
//   );
// }

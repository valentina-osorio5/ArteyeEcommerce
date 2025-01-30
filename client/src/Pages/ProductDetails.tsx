import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Product } from './ProductsPage';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../components/ShoppingCartContext';

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useContext(ShoppingCartContext);
  console.log(addToCart);
  // console.log(product, productId);

  useEffect(() => {
    // console.log('useEffect fired');
    async function fetchProduct() {
      // console.log('fetch product fired');
      try {
        const res = await fetch(`/api/shop/${productId}`);
        // console.log(res);
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

  function handleAddToCart() {
    if (!product) throw new Error('something went wrong...');
    addToCart(product);
  }

  // if (!product) console.error('Error fetching product details');

  return (
    <div style={{ fontFamily: 'Nova Round' }} className="mx-3">
      {product && (
        <div>
          <h2 className="align-center justify-self-center text-xl">
            {product.productName}
          </h2>
          <img
            className="justify-self-center"
            src={product.imageUrl}
            alt={product.productName}
            style={{ width: '300px' }}
          />
          <p className="justify-self-center mx-5">{product.description}</p>
          <br></br>
          <p className="font-semibold justify-self-center">
            Price: ${product.price}
          </p>
          <br></br>
          <button
            onClick={handleAddToCart}
            style={{ backgroundColor: '#eaf585' }}
            className="flex justify-items-center justify-self-center border border-gray-300 rounded py-1 px-3 mx-10 mb-5">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}

type Cart = {
  cartId: number;
  productId: number;
  quantity: number;
};

// export function fetchCart() {
//   const { cartId } = useParams<{ cartId: string }>();
//   const [cart, setCart] = useState<any>(null);
//   console.log(`add to cart fired`);

//   useEffect(() => {
//     // console.log('useEffect fired');
//     async function fetchCart() {
//       // console.log('fetch product fired');
//       try {
//         const res = await fetch(`/api/shop/cart/${cartId}`);
//         // console.log(res);
//         if (!res.ok) {
//           console.error('Failed to fetch cart');
//           return;
//         }
//         const data = await res.json();
//         setCart(data);
//       } catch (error) {
//         console.error('Error fetching cart details:', error);
//       }
//     }

//     // if (productId) {
//     fetchCart();
//     // }
//   }, [cartId]);

//   return (
//     {cart &&

//     }
//   );
// }

import { Link, UNSAFE_NavigationContext } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Product } from './ProductsPage';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../components/ShoppingCartContext';
import { v4 as uuidv4 } from 'uuid';

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useContext(ShoppingCartContext);
  const context = useContext(ShoppingCartContext);
  const numberOfItems = context.cart.length;
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
    addNewCart();
  }

  function addNewCart() {
    // const { cartId } = useParams<{ cartId: string }>();
    // const [cart, setCart] = useState<any>(null);
    console.log(`addNewCart fired`);
    async function postData() {
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ numberOfItems, productId }),
        };

        const res = await fetch(`/api/shop/product/${productId}`, options);
        console.log(res);
        if (!res.ok) throw new Error(`fetch Error ${res.status}`);
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
    postData();
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

//uuid library, send cartId with fetch request to create a cart for a guest
//download npm link in client
//check to see if cartId already exists...
//post request (get the post server working)
//would need to turn into a put request if the cart exists
//look at other exercises for the post/ put

//   return (
//     {cart &&

//     }
//   );
// }

// useEffect(() => {
//   // console.log('useEffect fired');
//   async function fetchCart() {
//     // console.log('fetch product fired');
//     try {
//       const res = await fetch(`/api/shop/cart/${cartId}`);
//       // console.log(res);
//       if (!res.ok) {
//         console.error('Failed to fetch cart');
//         return;
//       }
//       const data = await res.json();
//       setCart(data);
//     } catch (error) {
//       console.error('Error fetching cart details:', error);
//     }
//   }

//   // if (productId) {
//   fetchCart();
//   // }
// }, [cartId]);

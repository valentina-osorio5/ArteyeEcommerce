import { Link, UNSAFE_NavigationContext } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Product } from './ProductsPage';
import { useParams } from 'react-router-dom';
import { ShoppingCartContext } from '../components/ShoppingCartContext';
// import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../components/useUser';

type Cart = {
  cartId: number;
  productId: number;
  quantity: number;
};

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useContext(ShoppingCartContext);
  const context = useContext(ShoppingCartContext);
  const numberOfItems = context.cart.length;
  console.log(addToCart);
  const userContext = useUser();
  console.log(userContext.user.userId);
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
    if (!product) throw new Error('Product data missing');

    // Call the context function to update local state (if needed)
    addToCart(product);

    // Now add the item to the cart in the database
    async function postData() {
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Send the productId and quantity.
          // If you need to send a userId, include it here or have it added via authMiddleware on the server.
          body: JSON.stringify({
            productId: product.productId,
            quantity: 1,
            userId: userContext.user.userId,
            // or use the value from your context if you allow choosing quantity
          }),
        };
        const res = await fetch('/api/shop/cart', options);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const data = await res.json();
        console.log('Cart updated:', data);
      } catch (err) {
        console.error(err);
      }
    }
    postData();
  }

  // function handleAddToCart() {
  //   if (!product) throw new Error('something went wrong...');
  //   addToCart(product);
  //   addNewCart();
  // }

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

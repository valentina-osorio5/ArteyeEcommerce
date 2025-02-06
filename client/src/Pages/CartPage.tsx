//current working version

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
// import { ShoppingCartContext } from '../components/ShoppingCartContext';
export type User = {
  userId: number;
  username: string;
};
type CartItem = {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
  addedAt: string;
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
};

export function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  console.log('cartItems from state', cartItems);
  // const { addToCart, decrementCart } = useContext(ShoppingCartContext);
  const userContext = useUser();
  const user = userContext.user?.userId;

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);
  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);
  async function fetchCartItems() {
    try {
      const res = await fetch(`/api/shop/user/${user}`);
      if (!res.ok) {
        console.error(`Failed to fetch userId ${user}`);
        return;
      }
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }
  function toDollars(value: number): string {
    return '$' + value.toFixed(2);
  }
  async function handleAddToCart(cartItem: CartItem) {
    // await addToCart(cartItem);
    console.log('+ button pressed');
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: cartItem.productId,
          quantity: 1,
          userId: user,
        }),
      };
      console.log('user from addtocart', user);
      const res = await fetch('/api/shop/cart', options);
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      await res.json();
      await fetchCartItems();
      // Ensure UI updates
    } catch (err) {
      console.error(err);
    }
  }
  async function handleDecrementCart(cartItem: CartItem) {
    console.log('- button pressed');
    if (cartItem.quantity <= 1) {
      console.log('Quantity is already at 1, cannot decrement further.');
      return;
    }
    try {
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: cartItem.productId,
          quantity: cartItem.quantity - 1,
          userId: user,
        }),
      };
      const res = await fetch('/api/shop/cart', options);
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      await res.json();
      console.log('cart decremented');
      await fetchCartItems(); // Ensure UI updates
    } catch (err) {
      console.error(err);
    }
  }
  async function handleDelete(cartItem: CartItem) {
    console.log('delete button pressed');
    try {
      const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: cartItem.productId,
          userId: user,
        }),
      };
      const res = await fetch('/api/shop/cart', options);
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      await res.json();
      console.log('cart item removed');
      await fetchCartItems(); // Ensure UI updates
    } catch (err) {
      console.error(err);
    }
  }

  function getSubtotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.quantity;
    }, 0);
  }

  return (
    <>
      <div className="container flex">
        <div style={{ fontFamily: 'Nova Round' }} className="w-3/5 ml-4 p-4">
          <h1 className="align-center justify-self-center text-2xl mb-2">
            Your Shopping Cart
          </h1>
          {cartItems.map((cartItem) => (
            <div key={cartItem.productId} className="mb-4">
              <h2 className="font-bold">{cartItem.productName}</h2>
              <p className="font-light text-sm">
                Item Price: ${cartItem.price}
              </p>
              <p className="font-light text-sm">
                Item Total: {toDollars(cartItem.price * cartItem.quantity)}
              </p>
              <img
                src={cartItem.imageUrl}
                alt={cartItem.productName}
                style={{ width: '125px' }}
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  style={{ backgroundColor: '#9381ef' }}
                  className="px-1 py-.75 rounded"
                  onClick={() => handleDecrementCart(cartItem)}>
                  -
                </button>
                <p className="font-light">{cartItem.quantity}</p>
                <button
                  style={{ backgroundColor: '#9381ef' }}
                  className="px-1 py-.75 rounded"
                  onClick={() => handleAddToCart(cartItem)}>
                  +
                </button>
                <button
                  className="text-sm underline"
                  onClick={() => handleDelete(cartItem)}>
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ fontFamily: 'Nova Round' }}
          className="w-2/5 border-b-1 0 ml-4 p-4 border-2 max-h-fit">
          <h2 className="text-xl mb-2 justify-self-center">Order Summary</h2>
          <h3 className="mb-2 pt-4">
            Cart Subtotal {toDollars(getSubtotal(cartItems))}
          </h3>
          <p className="text-xs border-b-1 pt-3">
            Shipping & taxes calculated at checkout
          </p>
          <h3 className="mb-2 pt-6">
            Estimated Total {toDollars(getSubtotal(cartItems))}
          </h3>
          <br />
          <button
            style={{ backgroundColor: '#eaf585' }}
            className="flex justify-items-center justify-self-center border border-gray-300 rounded py-1 px-3 mx-10 mb-5 text-sm">
            Proceed to checkout
          </button>
        </div>
      </div>
    </>
  );
}

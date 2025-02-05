//current working version
import { Link } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import { useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from './ShoppingCartContext';
import { useUser } from './useUser';

export function Header() {
  const { cart } = useContext(ShoppingCartContext);
  const { user, handleSignOut } = useUser();
  const [cartCount, setCartCount] = useState<number>(0);

  // Function to calculate the total quantity
  function getTotalCartQuantity(cartItems: { quantity: number }[]) {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Fetch the latest cart count from the database on mount
  useEffect(() => {
    async function fetchCartCount() {
      if (!user?.userId) return; // Don't fetch if the user isn't logged in
      try {
        const res = await fetch(`/api/shop/user/${user.userId}`);
        if (!res.ok)
          throw new Error(`Error fetching cart count: ${res.status}`);
        const data = await res.json();
        setCartCount(getTotalCartQuantity(data)); // Sum the quantity of all cart items
      } catch (error) {
        console.error(error);
      }
    }

    fetchCartCount();
  }, [user]);

  // Update count whenever the cart state changes
  useEffect(() => {
    setCartCount(getTotalCartQuantity(cart));
  }, [cart]);

  return (
    <div
      style={{ backgroundColor: '#eaf585', fontFamily: 'Nova Round' }}
      className="sticky top-0 p-5 justify-center text-center border-b-1 mb-4">
      <Link className="align-middle text-2xl font-semibold" to="/">
        ARTEYE
      </Link>
      <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/cart">
          <IoCartOutline className="text-2xl inline" />
          <span className="text-sm">{cartCount}</span>
        </Link>
        {user ? (
          <button onClick={handleSignOut} className="text-sm">
            Sign Out
          </button>
        ) : (
          <Link className="text-sm" to="/sign-in">
            Sign In
          </Link>
        )}
      </nav>
    </div>
  );
}

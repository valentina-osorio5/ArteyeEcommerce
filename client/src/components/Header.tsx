//current working version
import { Link } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import { useUser } from './useUser';

export function Header() {
  // const { cart } = useContext(ShoppingCartContext);
  const { user, handleSignOut } = useUser();

  // Function to calculate the total quantity
  // function getTotalCartQuantity(cartItems: { quantity: number }[]) {
  //   return cartItems.reduce((total, item) => total + item.quantity, 0);
  // }

  // // Fetch the latest cart count from the database on mount
  // useEffect(() => {
  //   async function fetchCartCount() {
  //     if (!user?.userId) return; // Don't fetch if the user isn't logged in
  //     try {
  //       const res = await fetch(`/api/shop/user/${user.userId}`);
  //       if (!res.ok)
  //         throw new Error(`Error fetching cart count: ${res.status}`);
  //       const data = await res.json();
  //       setCartCount(getTotalCartQuantity(data)); // Sum the quantity of all cart items
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchCartCount();
  // }, [user]);

  // Update count whenever the cart state changes
  // useEffect(() => {
  //   setCartCount(getTotalCartQuantity(cart));
  // }, [cart]);

  return (
    <div
      style={{ backgroundColor: '#eaf585', fontFamily: 'Nova Round' }}
      className="sticky top-0 p-5 border-b mb-4 flex justify-between items-center">
      <div className="w-1/3"></div>

      <Link className="text-2xl font-semibold text-center flex-1" to="/">
        ARTEYE
      </Link>

      <nav className="w-1/3 flex justify-end gap-8">
        <Link to="/cart" className="flex items-center gap-1">
          <IoCartOutline className="text-2xl" />
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

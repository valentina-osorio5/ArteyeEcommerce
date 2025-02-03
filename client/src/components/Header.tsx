import { Link, Outlet } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import { ShoppingCartContext } from './ShoppingCartContext';
import { useContext } from 'react';
import { useUser } from './useUser';

export function Header() {
  const context = useContext(ShoppingCartContext);
  const numberOfItems = context.cart.length;
  const { user, handleSignOut } = useUser();
  console.log('header context', context);
  console.log('number of items', numberOfItems);

  return (
    <div
      style={{ backgroundColor: '#eaf585', fontFamily: 'Nova Round' }}
      className="sticky top-0 p-5 justify-center text-center border-b-1 mb-4">
      <Link className=" align-middle  text-2xl font-semibold" to="/">
        ARTEYE
      </Link>
      <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/cart">
          <IoCartOutline className="text-2xl inline" />
          <span className="text-sm">{numberOfItems}</span>
        </Link>
        <Link to="/sign-in">Sign In</Link>
      </nav>
    </div>
  );
}

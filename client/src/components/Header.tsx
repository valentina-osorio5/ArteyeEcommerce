import { Link, Outlet } from 'react-router-dom';
import { IoCartOutline } from 'react-icons/io5';
import { ShoppingCartContext } from './ShoppingCartContext';
import { useContext } from 'react';

export function Header() {
  const context = useContext(ShoppingCartContext);
  const numberOfItems = context.cart.length;
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
          <IoCartOutline className="text-2xl" />
          <span className="absolute top-1 left-8 inline-flex float-right w-5 h-5">
            {numberOfItems}
          </span>
        </Link>
        <Link to="/sign-in">Account</Link>
      </nav>
    </div>
  );
}

/* <div
          className="rounded-circle bg-black d-flex justify-content-center align-items-center"
          style={{
            color: 'white',
            width: '1.5rem',
            height: '1.5rem',
            position: 'absolute',
            bottom: 0,
            right: 0,
            transform: 'translate(25%, 25%)',
          }}>
          3
        </div> */

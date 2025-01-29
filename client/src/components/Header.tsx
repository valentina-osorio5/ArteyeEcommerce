import { Link, Outlet } from 'react-router-dom';

export function Header() {
  return (
    <div
      style={{ backgroundColor: '#eaf585', fontFamily: 'Nova Round' }}
      className="sticky top-0 p-5 justify-center text-center border-b-1 mb-4">
      <Link className=" align-middle  text-2xl font-semibold" to="/">
        ARTEYE
      </Link>
      <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
        {/* <FontAwesomeIcon icon=“fa-light fa-cart-shopping” /> */}
        <Link to="/cart">My Cart</Link>
        <Link to="/sign-in">Account</Link>
      </nav>
    </div>
  );
}

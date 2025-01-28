import { Link, Outlet } from 'react-router-dom';

export function Header() {
  return (
    <div style={{ backgroundColor: '#f1f1f1', fontFamily: 'Nova Round' }}>
      <Link className="text-center, justify-center" to="/">
        ARTEYE
      </Link>
      <nav className="float-right" style={{ display: 'flex', gap: '2rem' }}>
        {/* <FontAwesomeIcon icon=“fa-light fa-cart-shopping” /> */}
        <Link to="/cart">My Cart</Link>
        <Link to="/sign-in">Sign In</Link>
      </nav>
    </div>
  );
}

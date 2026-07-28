import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛒 E-Commerce Store</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>Cart</Link>
        {user ? (
          <>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.link}>Hi, {user.name}</span>
            <button onClick={logout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1f2937',
    color: '#fff',
  },
  brand: { color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.2rem' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  btn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

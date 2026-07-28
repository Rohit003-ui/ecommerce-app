import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const imageSrc = product.image_url || '/images/product-placeholder.svg';

  async function handleAddToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, 1);
  }

  return (
    <div style={styles.card}>
      <img
        src={imageSrc}
        alt={product.name}
        style={styles.img}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/product-placeholder.svg';
        }}
      />
      <h3>{product.name}</h3>
      <p style={styles.desc}>{product.description}</p>
      <p style={styles.price}>${Number(product.price).toFixed(2)}</p>
      <button onClick={handleAddToCart} style={styles.btn}>Add to Cart</button>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1rem',
    width: '220px',
    textAlign: 'center',
  },
  img: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' },
  desc: { fontSize: '0.85rem', color: '#6b7280' },
  price: { fontWeight: 'bold', fontSize: '1.1rem' },
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
};

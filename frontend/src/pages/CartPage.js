import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axiosConfig';

export default function CartPage() {
  const { cartItems, fetchCart, removeFromCart } = useCart();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    try {
      const res = await api.post('/orders');
      setMessage(`Order #${res.data.orderId} placed! Total: $${res.data.total}`);
      await fetchCart();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Checkout failed');
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.row}>
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={handleCheckout} style={styles.checkoutBtn}>Checkout</button>
        </>
      )}
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb',
  },
  removeBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' },
  checkoutBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' },
};

import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await api.get('/orders');
      setOrders(res.data);
    }
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={styles.td}>{o.id}</td>
                <td style={styles.td}>${Number(o.total_amount).toFixed(2)}</td>
                <td style={styles.td}>{o.status}</td>
                <td style={styles.td}>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  th: { textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '0.5rem' },
  td: { borderBottom: '1px solid #e5e7eb', padding: '0.5rem' },
};

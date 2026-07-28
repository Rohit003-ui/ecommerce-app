import { createContext, useState, useContext, useCallback } from 'react';
import api from '../api/axiosConfig';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  }, []);

  async function addToCart(productId, quantity = 1) {
    await api.post('/cart', { product_id: productId, quantity });
    await fetchCart();
  }

  async function removeFromCart(cartItemId) {
    await api.delete(`/cart/${cartItemId}`);
    await fetchCart();
  }

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

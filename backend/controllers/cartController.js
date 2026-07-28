const { pool } = require('../config/db');

// GET /api/cart
async function getCart(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
}

// POST /api/cart  { product_id, quantity }
async function addToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity || 1]
    );
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
}

// PUT /api/cart/:id  { quantity }
async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating cart item' });
  }
}

// DELETE /api/cart/:id
async function removeCartItem(req, res) {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing cart item' });
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };

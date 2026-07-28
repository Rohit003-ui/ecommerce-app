const { pool } = require('../config/db');

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
}

// POST /api/products (admin only)
async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name and price are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, stock || 0, category_id || null, image_url || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
}

// PUT /api/products/:id (admin only)
async function updateProduct(req, res) {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;
    await pool.query(
      `UPDATE products SET name=?, description=?, price=?, stock=?, category_id=?, image_url=?
       WHERE id=?`,
      [name, description, price, stock, category_id, image_url, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
}

// DELETE /api/products/:id (admin only)
async function deleteProduct(req, res) {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

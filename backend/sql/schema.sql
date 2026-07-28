-- ================================================================
-- E-commerce schema for AWS RDS (MySQL engine)
-- Database: database-1
--
-- Run this once after connecting to your RDS instance, e.g.:
--   mysql -h <RDS-ENDPOINT> -u admin -p database-1 < schema.sql
-- ================================================================

USE `database-1`;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer','admin') DEFAULT 'customer',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT,
  name          VARCHAR(150) NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  stock         INT NOT NULL DEFAULT 0,
  image_url     VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  total_amount  DECIMAL(10,2) NOT NULL,
  status        ENUM('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sample seed data (optional)
INSERT IGNORE INTO categories (id, name) VALUES
  (1, 'Electronics'), (2, 'Clothing'), (3, 'Home & Kitchen');

INSERT IGNORE INTO products (id, category_id, name, description, price, stock, image_url) VALUES
  (1, 1, 'Wireless Headphones', 'Noise-cancelling over-ear headphones', 59.99, 50, 'https://via.placeholder.com/300'),
  (2, 2, 'Cotton T-Shirt', 'Comfortable everyday cotton t-shirt', 14.99, 100, 'https://via.placeholder.com/300'),
  (3, 3, 'Non-stick Frying Pan', '28cm non-stick frying pan', 24.99, 30, 'https://via.placeholder.com/300');

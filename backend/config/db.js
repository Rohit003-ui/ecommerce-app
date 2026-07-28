const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

// Connection pool pointed at the AWS RDS MySQL instance.
// All values come from environment variables (.env) so credentials
// never live in source code.
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // RDS endpoint
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,       // "database-1"
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // RDS generally works fine without SSL for same-VPC EC2 traffic,
  // but you can enable it if you download the RDS CA bundle.
  // ssl: { ca: fs.readFileSync('./rds-ca-bundle.pem') }
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ Connected to MySQL RDS database "${process.env.DB_NAME}" at ${process.env.DB_HOST}`);
    conn.release();
  } catch (err) {
    console.error('❌ Failed to connect to RDS MySQL database:', err.message);
  }
}

module.exports = { pool, testConnection };

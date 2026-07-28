# E-Commerce Project

A full-stack e-commerce app:
- **frontend/** — React app (product listing, cart, login/register, orders)
- **backend/** — Node.js + Express REST API, connects to **AWS RDS (MySQL engine)**

Database name expected: **`database-1`**

---

## 1. Project structure

```
e-commerce/
├── backend/
│   ├── config/db.js          # MySQL pool -> RDS
│   ├── controllers/          # business logic
│   ├── middleware/auth.js    # JWT auth
│   ├── routes/                # /api/auth, /products, /cart, /orders
│   ├── sql/schema.sql        # run this on database-1
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axiosConfig.js
    │   ├── context/          # Auth + Cart state
    │   ├── components/
    │   └── pages/
    ├── package.json
    └── .env.example
```

## 2. Set up the AWS RDS MySQL database

1. In the RDS console, confirm your instance is running the **MySQL** engine and its identifier/DB name is **`database-1`**.
2. Note the RDS **endpoint** (e.g. `database-1.xxxxxxxxxx.us-east-1.rds.amazonaws.com`), **port** (3306), and master **username/password**.
3. In the RDS instance's **Security Group**, add an inbound rule allowing **MySQL/Aurora (3306)** from your EC2 instance's security group (not `0.0.0.0/0`).
4. Load the schema (from your EC2 instance, or any machine that can reach the RDS endpoint):
   ```bash
    mysql -h database-1.czumw8eq2qw0.ap-south-1.rds.amazonaws.com -P 3306 -u admin -p database-1 < backend/sql/schema.sql
   ```

## 3. Launch & prepare the EC2 instance (Amazon Linux 2)

```bash
# Update packages
sudo yum update -y

# Install Node.js 18 (via NodeSource) and git
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git

# Verify
node -v
npm -v

# Install MySQL client (optional, to test RDS connectivity from EC2)
sudo yum install -y mysql
```

Make sure the EC2 instance's **Security Group** allows:
- Inbound **22** (SSH) from your IP
- Inbound **5000** (or whatever `PORT` you choose) from `0.0.0.0/0` if the API should be public
- Inbound **80/443** if you serve the frontend from this same instance (e.g. via Nginx)

## 4. Deploy the backend

```bash
# Copy the backend/ folder to EC2 (e.g. via scp or git clone)
cd backend
npm install

cp .env.example .env
nano .env
```

Fill in `.env` with your real RDS values:
```
DB_HOST=database-1.xxxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_real_password
DB_NAME=database-1
JWT_SECRET=some_long_random_string
CLIENT_ORIGIN=http://<EC2_PUBLIC_IP>
```

Run it:
```bash
# Quick test
node server.js

# For production, use pm2 to keep it running
sudo npm install -g pm2
pm2 start server.js --name ecommerce-backend
pm2 save
pm2 startup   # follow the printed instructions to enable on reboot
```

You should see:
```
🚀 Server running on port 5000
✅ Connected to MySQL RDS database "database-1" at database-1.xxxxxxxxxx...
```

## 5. Deploy the frontend

Option A — build and serve statically (recommended for production):
```bash
cd frontend
npm install
cp .env.example .env
# set REACT_APP_API_URL=http://<EC2_PUBLIC_IP>:5000/api
npm run build
```
Then serve the `build/` folder with Nginx, or a simple static server:
```bash
sudo npm install -g serve
serve -s build -l 80
```

Option B — quick dev mode (not for production):
```bash
npm start
```

## 6. Verify end-to-end

1. Visit `http://<EC2_PUBLIC_IP>` → product list should load (confirms frontend ↔ backend ↔ RDS).
2. `GET http://<EC2_PUBLIC_IP>:5000/api/health` → `{"status":"ok"}` confirms backend is up.
3. Register a user, add a product to cart, and check out to confirm write access to `database-1`.

## Notes
- Never commit `.env` files — `.gitignore` already excludes them.
- For production, put the RDS instance in a private subnet and only allow the EC2 security group to reach port 3306.
- Consider adding an Nginx reverse proxy on the EC2 instance so both frontend (port 80) and backend (`/api` proxied to port 5000) are served from the same domain, avoiding CORS entirely.

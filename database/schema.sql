-- File: schema.sql

CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Product_Categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS Products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES Product_Categories(id),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  attributes JSONB NOT NULL DEFAULT '{}',
  thumbnail_url VARCHAR(2048),
  gallery_urls JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES Products(id),
  size VARCHAR(20) NOT NULL,
  stock INTEGER DEFAULT 0,
  UNIQUE(product_id, size)
);

CREATE TABLE IF NOT EXISTS Online_Orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES Customers(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS POS_Transactions (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER REFERENCES Users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Order_Items (
  id SERIAL PRIMARY KEY,
  online_order_id INTEGER REFERENCES Online_Orders(id),
  pos_transaction_id INTEGER REFERENCES POS_Transactions(id),
  product_id INTEGER REFERENCES Products(id),
  size VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  CHECK (
    (online_order_id IS NOT NULL AND pos_transaction_id IS NULL) OR
    (online_order_id IS NULL AND pos_transaction_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS Payments (
  id SERIAL PRIMARY KEY,
  online_order_id INTEGER REFERENCES Online_Orders(id),
  pos_transaction_id INTEGER REFERENCES POS_Transactions(id),
  method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (online_order_id IS NOT NULL AND pos_transaction_id IS NULL) OR
    (online_order_id IS NULL AND pos_transaction_id IS NOT NULL)
  )
);

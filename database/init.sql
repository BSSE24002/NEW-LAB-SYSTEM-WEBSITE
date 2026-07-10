-- ============================================================
-- FLOW E-Commerce & POS System - Unified Database Schema
-- Consolidated from schema.sql + init.sql
-- ============================================================

-- 1. USERS (Staff: admins, cashiers)
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'staff', -- 'admin' | 'staff'
    is_main_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS (Online shoppers)
CREATE TABLE IF NOT EXISTS Customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCT CATALOG
CREATE TABLE IF NOT EXISTS Product_Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES Product_Categories(id) ON DELETE SET NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    -- Stores: {"color": "White", "size": "M", "material": "Cotton"}
    attributes JSONB NOT NULL DEFAULT '{}',
    thumbnail_url VARCHAR(2048),
    gallery_urls JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INVENTORY (One row per product variant/SKU)
CREATE TABLE IF NOT EXISTS Inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id)
);

-- 5. ONLINE ORDERS
CREATE TABLE IF NOT EXISTS Online_Orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customers(id) ON DELETE SET NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    shipping_address TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- e.g. 'pending','pending_verification','confirmed','out for delivery','delivered','refunded'
    payment_method VARCHAR(50), -- 'card' | 'bank_transfer'
    payment_details JSONB,      -- { last4, tid, accountTitle, screenshot }
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    tracking_no VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. POS TRANSACTIONS
CREATE TABLE IF NOT EXISTS POS_Transactions (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES Users(id) ON DELETE SET NULL,
    cashier_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    -- e.g. 'completed' | 'refunded'
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash', -- 'cash' | 'card'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDER ITEMS (unified line items for both online & POS)
CREATE TABLE IF NOT EXISTS Order_Items (
    id SERIAL PRIMARY KEY,
    online_order_id INTEGER REFERENCES Online_Orders(id) ON DELETE CASCADE,
    pos_transaction_id INTEGER REFERENCES POS_Transactions(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,  -- denormalized for historical accuracy
    product_sku VARCHAR(50),
    size VARCHAR(20),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time DECIMAL(10,2) NOT NULL,
    CONSTRAINT item_belongs_to_one_transaction CHECK (
        (online_order_id IS NOT NULL AND pos_transaction_id IS NULL) OR
        (online_order_id IS NULL AND pos_transaction_id IS NOT NULL)
    )
);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS Payments (
    id SERIAL PRIMARY KEY,
    online_order_id INTEGER REFERENCES Online_Orders(id) ON DELETE CASCADE,
    pos_transaction_id INTEGER REFERENCES POS_Transactions(id) ON DELETE CASCADE,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_linked_to_one_transaction CHECK (
        (online_order_id IS NOT NULL AND pos_transaction_id IS NULL) OR
        (online_order_id IS NULL AND pos_transaction_id IS NOT NULL)
    )
);

-- 9. DELIVERIES (for online orders)
CREATE TABLE IF NOT EXISTS Deliveries (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES Online_Orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(100),
    carrier_name VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    estimated_date TIMESTAMP,
    actual_date TIMESTAMP,
    shipping_address TEXT NOT NULL
);

-- 10. DISCOUNTS (Automatic / store-wide rules)
CREATE TABLE IF NOT EXISTS Discounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target VARCHAR(50) NOT NULL DEFAULT 'all', -- 'all' | 'category' | 'product'
    target_value VARCHAR(255),                  -- category name or product id
    type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' | 'fixed'
    value DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. COUPONS (Manual promo codes)
CREATE TABLE IF NOT EXISTS Coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' | 'fixed'
    value DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED: Default admin user (password: admin1234, pin: 1234)
-- ============================================================
INSERT INTO Users (username, email, password_hash, pin, role, is_main_admin)
VALUES ('Admin', 'admin@flow.com', 'admin1234', '1234', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Seed default categories
INSERT INTO Product_Categories (name) VALUES ('Spectrometers') ON CONFLICT DO NOTHING;
INSERT INTO Product_Categories (name) VALUES ('Chromatographs') ON CONFLICT DO NOTHING;
INSERT INTO Product_Categories (name) VALUES ('Microscopes') ON CONFLICT DO NOTHING;
INSERT INTO Product_Categories (name) VALUES ('Centrifuges') ON CONFLICT DO NOTHING;

-- 12. POSTS (News/Updates)
CREATE TABLE IF NOT EXISTS Posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES Users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
